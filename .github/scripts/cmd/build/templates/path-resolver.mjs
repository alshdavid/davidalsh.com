import * as path from 'node:path'

export function resolvePath(rootPath, cwd, targetPath) {
  let absolutePath = targetPath

  if (targetPath.startsWith('~/')) {
    absolutePath = path.join(rootPath, targetPath.slice(2))
  }
  
  if (!path.isAbsolute(absolutePath)) {
    absolutePath = path.join(rootPath, cwd, absolutePath)
  }

  return absolutePath
}

export function dirname(targetPath) {
  targetPath = path.dirname(targetPath)
  if (!targetPath.endsWith(path.sep)) {
    return targetPath + path.sep
  }
  return targetPath
}
