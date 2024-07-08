mod config;
mod resolve;
mod transform;

use std::fs;
use std::path::PathBuf;
use std::collections::HashMap;
use std::collections::VecDeque;
use std::collections::HashSet;

use crate::config::Config;
use crate::resolve::resolve;
use crate::transform::transform;

fn main() {
    // Parse CLI arguments
    let config = Config::new();

    // Queue of files to transform
    let mut queue = VecDeque::<(PathBuf, String)>::new();
    // Map of path -> asset contents
    let mut assets = HashMap::<PathBuf, String>::new();
    // Graph as tuples rather than strings
    let mut asset_graph = HashSet::<(PathBuf, PathBuf)>::new();

    // Add entry asset to queue
    queue.push_back((config.project_root.clone(), config.entry_point.clone().to_str().unwrap().to_string()));

    // Loop until the queue is empty
    while let Some((from_path, specifier)) = queue.pop_front() {
        // Resolve and ignore errors
        let absolute_path = resolve(&from_path, &specifier).unwrap();

        // Add to graph
        asset_graph.insert((from_path, absolute_path.clone()));

        // Skip if transformed previously
        if assets.contains_key(&absolute_path) {
            continue;
        }

        // Read file and ignore errors
        let contents = fs::read_to_string(&absolute_path).unwrap();

        // Transform file
        let (content_transformed, specifiers) = transform(&contents, &absolute_path);

        // Add new specifiers to queue
        for specifier in specifiers.iter() {
            queue.push_back((absolute_path.clone(), specifier.clone()));
        }

        // Add asset to the asset store
        assets.insert(absolute_path, content_transformed);
    }

    println!("Assets: {}", assets.len());
}
