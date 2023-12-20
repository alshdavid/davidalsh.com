use std::path::PathBuf;
use std::env;

pub struct Config {
    pub entry_point: PathBuf,
    pub project_root: PathBuf,
    pub threads: usize,
}

impl Config {
    pub fn new() -> Self {
        let entry_point = get_entry();
        let project_root = find_project_root(&entry_point);
        let threads = get_threads();

        return Config {
            entry_point,
            project_root,
            threads,
        };
    }
}


fn get_entry() -> PathBuf {
    let filepath_str = std::env::args().nth(1).expect("No filepath given");
    let filepath = PathBuf::from(&filepath_str);
    if filepath.is_absolute() {
      return filepath.to_owned();
    }
    let absolute_file_path = env::current_dir().unwrap().as_path().join(filepath).canonicalize().unwrap();
    return absolute_file_path;
}

fn find_project_root(entry: &PathBuf) -> PathBuf {
    let mut current_test = entry.clone();
    loop {
        if current_test.join("package.json").exists() {
            break;
        }
        if !current_test.pop() {
            return env::current_dir().unwrap();
        }
    };
    return current_test;
}

fn get_threads() -> usize {
    let mut threads = num_cpus::get();
    let threads_res = env::var("HS_THREADS");
    
    if threads_res.is_ok() {
      let parse_res = parse_usize(&threads_res.unwrap());
      if parse_res.is_err() {
            panic!("Unable to parse HS_THREADS variable - not an int")
      }
      threads = parse_res.unwrap();
      if threads == 0 {
            panic!("Threads must be more than 0");
      }
    }
    return threads;
}

fn parse_usize(str: &str) -> Result<usize, ()> {
    let parse_opt: Result<usize, _> = str.parse();
    if parse_opt.is_err() {
        return Err(());
    }
    return Ok(parse_opt.unwrap());
}