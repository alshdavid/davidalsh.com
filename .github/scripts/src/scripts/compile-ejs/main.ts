import { marked } from 'marked'
import * as ejs from 'ejs'
import { Directories } from '../../platform/directories'
import * as path from 'node:path'
import * as fs from 'node:fs'

export async function main(args: Record<string, string[]>): Promise<number | void> {
    const targetFileRel = args['_'][0]
    const targetFileDirRel = path.dirname(targetFileRel)
    const targetFileNameRel = path.basename(targetFileRel)
    const targetFileDirAbs = path.join(Directories.Root, 'src', targetFileDirRel)
    const targetFileNameAbs = path.join(Directories.Root, 'src', targetFileRel)
    const outFileAbs = path.join(Directories.Root, 'dist', targetFileDirRel, targetFileNameRel).slice(0, -3) + 'html'

    const ctx = {
        renderMarkdown: (srcPath: string) => {
            const absSrcPath = path.join(targetFileDirAbs, srcPath)
            const src = fs.readFileSync(absSrcPath, { encoding: 'utf8' })
            return marked(src)
        }
    }
    
    const renderOutput = await ejs.renderFile(targetFileNameAbs, ctx)

    if (!fs.existsSync(path.dirname(outFileAbs))) {
        fs.mkdirSync(path.dirname(outFileAbs), { recursive: true })
    }
    fs.writeFileSync(outFileAbs, renderOutput, { encoding: 'utf8' })
}
