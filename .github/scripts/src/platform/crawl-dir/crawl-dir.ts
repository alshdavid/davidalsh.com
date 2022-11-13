import * as fs from 'node:fs'
import * as path from 'node:path'

enum TargetType {
    FOLDER,
    FILE,
    LINK,
}

// Crawls a directory and generates a file list
export function crawlDir({
    relPath = '',
    cwd = process.cwd(),
    dontCrawl = [],
    depth = undefined
} = {}): Record<string, TargetType> {
    const files: Record<string, TargetType> = {}
    
    let currentDepth = 1

    function _crawl(_relPath: string) {
        const contents = fs.readdirSync(path.join(cwd, _relPath))

        for (const target of contents) {
            const relTargetPath = path.join(_relPath, target)
            const stat = fs.lstatSync(path.join(cwd, _relPath, target))
            if (stat.isSymbolicLink()) {
                files[relTargetPath] = TargetType.LINK
                continue
            }
            if (stat.isDirectory()) {
                files[relTargetPath] = TargetType.FOLDER
                if (dontCrawl.find(ignored => relTargetPath.startsWith(ignored))) {
                    continue
                }
                if (depth !== undefined && currentDepth >= depth) {
                    continue
                }
                currentDepth++
                _crawl(path.join(_relPath, target))
                currentDepth--
                continue
            }
            if (stat.isFile()) {
                files[relTargetPath] = TargetType.FILE
                continue
            }
        }
    }

    _crawl(relPath)

    return files
}
