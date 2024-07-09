import * as fs from "node:fs";
import * as path from "node:path";

export type TargetType = typeof TargetType[keyof typeof TargetType];
export const TargetType = {
  FOLDER: 'FOLDER',
  FILE: 'FILE',
  LINK: 'LINK',
};

export type CrawlDirOptions = {
  targetPath?: string
  dontCrawl?: string[]
  depth?: number
}

export function crawlDir({
  targetPath = "",
  dontCrawl = [],
  depth = undefined,
}: CrawlDirOptions = {}) {
  const files: Record<string, TargetType> = {};

  let currentDepth = 1;

  function _crawl(currentTargetPath: string) {
    const contents = fs.readdirSync(currentTargetPath);

    for (const target of contents) {
      const relTargetPath = path.join(currentTargetPath, target);
      const stat = fs.lstatSync(relTargetPath);

      if (dontCrawl.includes(target)) {
        continue;
      }

      if (stat.isSymbolicLink()) {
        files[relTargetPath] = TargetType.LINK;
        continue;
      }

      if (stat.isFile()) {
        files[relTargetPath] = TargetType.FILE;
        continue;
      }

      if (stat.isDirectory()) {
        files[relTargetPath] = TargetType.FOLDER;
        if (depth !== undefined && currentDepth !== undefined && currentDepth >= depth) {
          continue;
        }
        currentDepth++;
        _crawl(relTargetPath);
        currentDepth--;
        continue;
      }
    }
  }

  _crawl(targetPath);

  return files;
}
