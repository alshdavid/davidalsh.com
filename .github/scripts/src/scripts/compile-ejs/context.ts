import { marked } from 'marked'
import * as path from 'node:path'
import * as fs from 'node:fs'
import * as yaml from 'yaml'
import * as prettier from "prettier"
import * as sass from "sass"

export class TemplateContext {
  #targetFileDirAbs: string
  #outDirAbs: string

  constructor(
    targetFileDirAbs: string,
    outDirAbs: string
  ) {
    this.#targetFileDirAbs = targetFileDirAbs
    this.#outDirAbs = outDirAbs
  }

  dirname() {
    return this.#targetFileDirAbs
  }

  readFile(srcPathRel: string): string {
    const srcPathAbs = path.isAbsolute(srcPathRel) ? srcPathRel : path.join(this.#targetFileDirAbs, srcPathRel)
    return fs.readFileSync(srcPathAbs, { encoding: 'utf8' })
  }

  readDir(srcPathRel: string): string[] {
    const srcPathAbs = path.isAbsolute(srcPathRel) ? srcPathRel : path.join(this.#targetFileDirAbs, srcPathRel)
    return fs.readdirSync(srcPathAbs)
  }

  stat(srcPathRel: string) {
    const srcPathAbs = path.isAbsolute(srcPathRel) ? srcPathRel : path.join(this.#targetFileDirAbs, srcPathRel)
    return fs.statSync(srcPathAbs)
  }

  renderMarkdown(srcPath: string) {
    return marked(this.readFile(srcPath))
  }

  parseYaml(yamlSrc: string): Record<string, any> {
    return yaml.parse(yamlSrc)
  }

  includeStyle(srcFilePathRel: string, { inline = false }: { inline?: boolean } = {}): string {
    let fileType = 'css'
    let srcFilePathAbs = path.join(this.#targetFileDirAbs, srcFilePathRel)
    let outFilePathRel = srcFilePathRel
    let outFilePathAbs = path.join(this.#outDirAbs, srcFilePathRel)
    let content: string

    if (srcFilePathRel.endsWith('.scss')) {
      fileType = 'scss'
      outFilePathAbs = outFilePathAbs.replace('.scss', '.css')
      outFilePathRel = outFilePathRel.replace('.scss', '.css')
    }

    if (!fs.existsSync(outFilePathAbs)) {
      fs.mkdirSync(path.dirname(outFilePathAbs), { recursive: true })


      if (fileType === 'scss') {
        const result = sass.renderSync({
          file: srcFilePathAbs
        })
        content = result.css.toString()
      } else {
        content = this.readFile(srcFilePathRel)
      }

      content = prettier.format(content, {
        parser: 'css',
        tabWidth: 2,
      })

      if (!inline) {
        fs.writeFileSync(outFilePathAbs, content, { encoding: 'utf8' })
      }
    }

    if (inline) {
      return `<style>${content}</style>`
    } else {
      return `<link rel="stylesheet" href="${outFilePathRel}">`
    }
  }

  includeDir(srcPathRel: string) {
    const srcPathAbs = path.join(this.#targetFileDirAbs, srcPathRel)
    const outputPathAbs = path.join(this.#outDirAbs, srcPathRel)
    if (fs.existsSync(outputPathAbs)) {
      fs.rmSync(outputPathAbs, { recursive: true })
    }
    fs.cpSync(srcPathAbs, outputPathAbs, { recursive: true })
  }
}
