import * as node_path from 'node:path'
import * as node_fs from 'node:fs'

export function path(target: string): string {
  return node_path.join(...target.split('/'))
}

export type ListDirectoryResult = node_fs.Stats & { 
  target_name: string,
  target_path_absolute: string,
}

export function ls(target: string, { cwd = process.cwd() }: { cwd?: string} = {}): ListDirectoryResult[] {
  const joined = path(target)
  const pathAbs = node_path.isAbsolute(joined) ? joined : node_path.resolve(cwd, joined)
  const result: ListDirectoryResult[] = []

  for (const target_name of node_fs.readdirSync(pathAbs)) {
    const target_path_absolute = node_path.join(pathAbs, target_name)
    const stat = node_fs.statSync(target_path_absolute)
    result.push(Object.assign(
      stat,
      {target_name,target_path_absolute},
    ))
  }

  return result
}

export function readFile(target: string, { cwd = process.cwd() }: { cwd?: string} = {}): string {
  const joined = path(target)
  const pathAbs = node_path.isAbsolute(joined) ? joined : node_path.resolve(cwd, joined)
  return node_fs.readFileSync(pathAbs, { encoding: 'utf8' })
}
