use std::path::PathBuf;
use std::str;

use parcel_transformer_js::Config;
use parcel_transformer_js::transform as parcel_transform;

pub fn transform(content: &str, file_path: &PathBuf) -> (String, Vec<String>) {
    let mut config = Config::new();
    config.code = content.as_bytes().to_vec();
    config.filename = file_path.to_str().unwrap().to_string();
    config.is_jsx = true;
    config.is_type_script = true;

    let transformation_res = parcel_transform(config);
    if transformation_res.is_err() {
        panic!("ERROR1 {}", transformation_res.err().unwrap());
    }

    let transformation = transformation_res.unwrap();
    let code_res = str::from_utf8(transformation.code.as_slice());
    if code_res.is_err() {
        panic!("ERROR1 {}", code_res.err().unwrap());
    }

    let content_transformed = code_res.unwrap().to_string();
    let mut specifiers = Vec::<String>::new();

    for descriptor in transformation.dependencies {
        specifiers.push(descriptor.specifier.as_str().to_string());
    }

    return (content_transformed, specifiers);
}
