import * as path from 'node:path'
import * as crypto from 'node:crypto'
import * as fs from 'node:fs'
import { crawlDir } from '../crawl-dir.js'
import { sha1 } from '../hash.js'

// export function getPregeneratedFileListFromFile(): Record<string, string> {
//   const str = fs.readFileSync(Directories['~/dist/']('integrity.json'), { encoding: 'utf-8' })
//   const json = JSON.parse(str)
//   return json
// }

enum HashMethod {
  SHA1 = 'sha1',
  SHA256 = 'sha256',
  MD5 = 'md5',
}

export type GetFileListOptions = {
  filepath: string
  cwd?: string
  hashMethod?: HashMethod
}

export type GetFileListResult = {
  keyPath: string
  fullPath: string
  hash: string
}

export type GetFileListResults = Record<string, GetFileListResult>

export function getFileList({
  filepath,
  cwd,
  hashMethod = HashMethod.MD5,
}: GetFileListOptions): GetFileListResults {
  const fileList: GetFileListResults = {}
  const platformCwd = (cwd || filepath) + path.sep

  const local = crawlDir({ targetPath: filepath })

  for (const [absolutePath, value] of Object.entries(local)) {
    const assetPath = absolutePath.replace(platformCwd, '')
  
    if (value !== 'FILE') {
      continue
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const result = crypto.createHash(hashMethod).update(fileBuffer).digest('hex')
    
    fileList[assetPath] = {
      keyPath: assetPath,
      fullPath: absolutePath,
      hash: result,
    }
  }

  return fileList
}
