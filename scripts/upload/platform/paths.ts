export function makeRelative(filepath: string) {
  let Key = filepath
  if (filepath.startsWith('/')) {
    Key = filepath.replace('/', '')
  }
  return Key
}
