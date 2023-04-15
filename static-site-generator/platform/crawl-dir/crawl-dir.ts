import * as fs from "node:fs";
import * as path from "node:path";
import { TargetType } from "./target-type";

export type CrawlDirOptions = {
  targetPath?: string
  dontCrawl?: string[]
  depth?: number
}

export class DirectoryEntry {
  readonly absolutePath: string
  readonly relativePath: string
  readonly basePath: string
  readonly targetType: TargetType

  constructor(
    absolutePath: string,
    relativePath: string,
    basePath: string,
    targetType: TargetType,
  ) {
    this.absolutePath = absolutePath
    this.relativePath = relativePath
    this.basePath = basePath
    this.targetType = targetType
  }
}

export class DirectoryMap {
  #files: Map<string, DirectoryEntry>
  #basePath: string

  constructor(
    files: Map<string, DirectoryEntry>,
    basePath: string,
  ) {
    this.#basePath = basePath
    this.#files = files
  }

  getRelative(...filepathSegments: string[]): DirectoryEntry | null {
    return this.getAbsolute(path.join(this.#basePath, ...filepathSegments))
  }

  getAbsolute(...filepathSegments: string[]): DirectoryEntry | null {
    const result = this.#files.get(path.join(...filepathSegments))
    if (!result) {
      return null
    }
    return result
  }
}

export function crawlDir({
  targetPath = "",
  dontCrawl = [],
}: CrawlDirOptions = {}): DirectoryMap {
  const files = new Map<string, DirectoryEntry>();

  function _crawl(currentTargetPath: string) {
    const contents = fs.readdirSync(currentTargetPath);

    for (const basename of contents) {
      const absolutePath = path.join(currentTargetPath, basename);
      const relativePath = absolutePath.replace(targetPath + '/', '')
      const stat = fs.lstatSync(absolutePath);

      if (dontCrawl.includes(basename)) {
        continue;
      }

      if (stat.isSymbolicLink()) {
        const entry = new DirectoryEntry(absolutePath, relativePath, targetPath, TargetType.LINK)
        files.set(absolutePath, entry)
        continue;
      }

      if (stat.isFile()) {
        const entry = new DirectoryEntry(absolutePath, relativePath, targetPath, TargetType.FILE)
        files.set(absolutePath, entry)
        continue;
      }

      if (stat.isDirectory()) {
        const entry = new DirectoryEntry(absolutePath, relativePath, targetPath, TargetType.FOLDER)
        files.set(absolutePath, entry)
        _crawl(absolutePath);
        continue;
      }
    }
  }

  _crawl(targetPath);

  return new DirectoryMap(files, targetPath);
}
