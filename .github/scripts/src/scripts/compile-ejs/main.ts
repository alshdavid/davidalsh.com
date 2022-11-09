import { marked } from 'marked'
import * as ejs from 'ejs'
import { Directories } from '../../platform/directories'
import * as path from 'node:path'
import * as fs from 'node:fs'
import * as yaml from 'yaml'
import * as prettier from "prettier"
import * as sass from "node-sass"

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

class TemplateContext {
    #targetFileDirAbs: string
    #outDirAbs: string
    #meta: Record<string, any> 

    constructor(
        targetFileDirAbs: string,
        outDirAbs: string
    ) {
        this.#targetFileDirAbs = targetFileDirAbs
        this.#outDirAbs = outDirAbs
    }

    readFile(srcPathRel: string): string {
        const srcPathAbs = path.join(this.#targetFileDirAbs, srcPathRel)
        return fs.readFileSync(srcPathAbs, { encoding: 'utf8' })
    }
    
    renderMarkdown(srcPath: string) {
        return marked(this.readFile(srcPath))
    }
    
    parseYamlFile(yamlSrc): Record<string, any> {
        return yaml.parse(yamlSrc)
    }
    
    meta(): Record<string, any> {
        if (!this.#meta) {
            this.#meta = this.parseYamlFile(this.readFile('meta.yaml'))
        }
        return this.#meta
    }

    renderStyleInline(srcPathRel: string): string {
        const file = this.readFile(srcPathRel)
        return `<style>${file}</style>`
    }

    renderStyleTag(srcPathRel: string, fileName?: string): string {
        if (!fileName) fileName = srcPathRel
        let file: string

        if (srcPathRel.endsWith('.scss')) {
            const srcPathAbs = path.join(this.#targetFileDirAbs, srcPathRel)
            const result = sass.renderSync({
                file: srcPathAbs
            })
            file = result.css.toString()
            fileName = fileName.replace('.scss', '.css')
        } else {
            file = this.readFile(srcPathRel)
        }

        file = prettier.format(file, {
            parser: 'css',
            tabWidth: 2,
        })
        
        const outFilePathAbs = path.join(this.#outDirAbs,fileName)
        if (!fs.existsSync(path.dirname(outFilePathAbs))) {
            fs.mkdirSync(path.dirname(outFilePathAbs), { recursive: true })
        }
        fs.writeFileSync(outFilePathAbs, file, { encoding: 'utf8' })
        return `<link rel="stylesheet" href="${fileName}">`
    }
}