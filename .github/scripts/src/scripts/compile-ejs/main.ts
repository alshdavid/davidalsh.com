import * as ejs from 'ejs'
import { Directories } from '../../platform/directories'
import * as path from 'node:path'
import * as fs from 'node:fs'
import * as prettier from "prettier"
import { TemplateContext } from './context'

export async function main(args: Record<string, string[]>): Promise<number | void> {
    const targetFileRel = args['_'][0]
    const targetFileDirRel = path.dirname(targetFileRel)
    const targetFileNameRel = path.basename(targetFileRel)
    const targetFileDirAbs = path.join(Directories.Root, 'src', targetFileDirRel)
    const targetFileNameAbs = path.join(Directories.Root, 'src', targetFileRel)
    const outFileAbs = path.join(Directories.Root, 'dist', targetFileDirRel, targetFileNameRel).slice(0, -3) + 'html'
    const outDirAbs = path.dirname(outFileAbs)

    const ctx = new TemplateContext(targetFileDirAbs, outDirAbs)
    
    const renderOutput = await ejs.renderFile(targetFileNameAbs, ctx)
    const prettyOutput = prettier.format(renderOutput, {
        parser: 'html',
        tabWidth: 2,
    })

    if (!fs.existsSync(path.dirname(outFileAbs))) {
        fs.mkdirSync(path.dirname(outFileAbs), { recursive: true })
    }
    fs.writeFileSync(outFileAbs, prettyOutput, { encoding: 'utf8' })
}

