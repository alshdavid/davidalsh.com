use std::env;
use std::path::PathBuf;
use std::borrow::Cow;
use std::path::Component;
use std::path::Path;

use parcel_node_resolver::SpecifierType;
use parcel_node_resolver::Resolver;
use parcel_node_resolver::Resolution;
use parcel_node_resolver::OsFileSystem;
use parcel_node_resolver::CacheCow;
use parcel_node_resolver::Cache;

pub fn resolve(from: &PathBuf, specifier: &str) -> Result<PathBuf, String> {
    let result = resolve_node(&specifier, &from);

    if let Ok(result) = result {
        return Ok(result);
    }

    for try_this in [
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        "/index.js",
        "/index.jsx",
        "/index.ts",
        "/index.tsx",
        "/src/index.js",
        "/src/index.jsx",
        "/src/index.ts",
        "/src/index.tsx",
    ] {
        let spec = format!("{}{}", specifier, try_this);
        let result = resolve_node(&spec, &from);
        if let Ok(result) = result {
          return Ok(result)
        }
    }

    return Err("Unable to resolve".to_string());
}

pub fn resolve_node(specifier: &str, from: &PathBuf) -> Result<PathBuf, String> {
    let resolver = Resolver::node(
        Cow::Owned(env::current_dir().unwrap().as_path().into()),
        CacheCow::Owned(Cache::new(OsFileSystem)),
    );

    let resolve_result = resolver.resolve(specifier, from, SpecifierType::Esm);

    if resolve_result.result.is_err() {
        let msg = format!("Resolve Result {:?}", resolve_result.result.err());
        return Err(msg);
    }

    let (resolution, _) = resolve_result.result.unwrap();

    return match resolution {
        Resolution::Path(p) => Ok(normalize_path(&p)),
        Resolution::Builtin(b) => {
            let msg = format!("Resolution::Builtin {:?}", b);
            return Err(msg);
        }
        Resolution::External => {
            let msg = format!("Resolution::External");
            return Err(msg);
        }
        Resolution::Empty => {
            let msg = format!("Resolution::Empty");
            return Err(msg);
        }
        Resolution::Global(s) => {
            let msg = format!("Resolution::Global {:?}", s);
            return Err(msg);
        }
    };
}

pub fn normalize_path(path: &Path) -> PathBuf {
    let mut components = path.components().peekable();
    let mut ret = if let Some(c @ Component::Prefix(..)) = components.peek().cloned() {
        components.next();
        PathBuf::from(c.as_os_str())
    } else {
        PathBuf::new()
    };

    for component in components {
        match component {
            Component::Prefix(..) => unreachable!(),
            Component::RootDir => {
                ret.push(component.as_os_str());
            }
            Component::CurDir => {}
            Component::ParentDir => {
                ret.pop();
            }
            Component::Normal(c) => {
                ret.push(c);
            }
        }
    }
    return ret;
}
