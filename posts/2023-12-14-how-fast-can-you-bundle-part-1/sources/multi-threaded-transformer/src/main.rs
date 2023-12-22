mod config;
mod resolve;
mod transform;

use std::fs;
use std::path::PathBuf;
use std::collections::HashMap;
use std::collections::HashSet;
use std::sync::Arc;
use std::sync::Mutex;
use std::sync::atomic::AtomicUsize;
use std::sync::atomic::Ordering;
use std::thread;
use std::thread::JoinHandle;

use crate::config::Config;
use crate::resolve::resolve;
use crate::transform::transform;

fn main() {
    // Parse CLI arguments
    let config = Config::new();
    println!("Threads: {}", config.threads);

    // Channel to notify parked threads when new work comes in
    let (submit_job, on_submitted_job) = crossbeam_channel::unbounded::<Option<(PathBuf, String)>>();
    // Counter of the tasks in flight
    let in_flight = Arc::new(AtomicUsize::new(0));

    // Map of path -> asset contents
    let assets = Arc::new(Mutex::new(HashMap::<PathBuf, String>::new()));
    // Graph as tuples rather than strings
    let asset_graph = Arc::new(Mutex::new(HashSet::<(PathBuf, PathBuf)>::new()));

    // Add the entry asset to queue
    in_flight.fetch_add(1, Ordering::Relaxed);
    submit_job.send(Some((
        config.project_root.clone(),
        config.entry_point.clone().to_str().unwrap().to_string()
    ))).unwrap();

    // Hold the threads so we know when they all exit
    // In JavaScript terms, you can sort of think of this as an "Array<Promise<void>>"
    let mut thread_handles = Vec::<JoinHandle<()>>::new();

    // Spawn a bunch of threads, this loop will exit immediately and the main thread will block
    // at the end where we have the "handle.join()" code
    for _ in 0..config.threads {
        // Clone all of the Arcs - this clones the pointer, not the value
        // Rust will move the cloned pointers into the thread
        // You can think of this as a sort of "dependency injection" for each thread
        let assets = assets.clone();
        let asset_graph = asset_graph.clone();
        let in_flight = in_flight.clone();
        let submit_job = submit_job.clone();
        let on_submitted_job = on_submitted_job.clone();
        let threads_num = config.threads.clone();

        // In JavaScript terms, you can think of "thread::spawn()" as "setTimeout(cb)" if it returned a Promise
        thread_handles.push(thread::spawn(move || {
            while let Ok(msg) = on_submitted_job.recv() {
                let Some((from_path, specifier)) = msg else {
                    break;
                };

                // Resolve and ignore errors
                let absolute_path = resolve(&from_path, &specifier).unwrap();

                // Add to graph
                asset_graph.lock().unwrap().insert((from_path, absolute_path.clone()));

                // In the case where multiple different files import the same target file, it's  
                // possible that the same file will be resolved from different threads. To prevent  
                // that file from being transformed multiple times, we hold the lock to the
                // the shared data store, check if the file has already been transformed and
                // if it hasn't, we insert a placeholder preventing others from trying.
                let mut assets_unlocked = assets.lock().unwrap();

                // Skip if transformed previously
                if assets_unlocked.contains_key(&absolute_path) {
                    // This job is done, kill all threads if there's no more work
                    if in_flight.fetch_sub(1, Ordering::Relaxed) == 1 {
                        for _ in 0..threads_num {
                            submit_job.send(None).unwrap();
                        }
                    };
                    continue;
                }

                // Insert a placeholder so other threads will skip it when checking if it exists
                assets_unlocked.insert(absolute_path.clone(), String::new());
                
                // Unlock the mutex manually
                drop(assets_unlocked);

                // Read file and ignore errors
                let contents = fs::read_to_string(&absolute_path).unwrap();

                // Transform file
                let (content_transformed, specifiers) = transform(&contents, &absolute_path);

                for specifier in specifiers.iter() {
                    in_flight.fetch_add(1, Ordering::Relaxed);
                    // Send job to another thread 
                    submit_job.send(Some((absolute_path.clone(), specifier.clone()))).unwrap();
                }

                // Add asset to the asset store
                assets.lock().unwrap().insert(absolute_path, content_transformed);

                // This job is done, kill all threads if there's no more work
                if in_flight.fetch_sub(1, Ordering::Relaxed) == 1 {
                    for _ in 0..threads_num {
                        submit_job.send(None).unwrap();
                    }
                    continue;
                };
            }
        }));
    }

    // Wait for all the threads to finish
    // Kinda like "Promise.all()"
    for handle in thread_handles {
        handle.join().unwrap();
    }

    println!("Assets: {}", assets.lock().unwrap().len());
}