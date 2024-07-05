use std::path::PathBuf;
use std::env;

pub struct Config {
    pub entry_point: PathBuf,
    pub project_root: PathBuf,
}

impl Config {
    pub fn new() -> Self {
        let entry_point = get_entry();
        let project_root = find_project_root(&entry_point);

        return Config {
            entry_point,
            project_root,
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