import { marked } from 'marked'
import * as path from 'node:path'
import * as fs from 'fs-extra'
import * as yaml from 'yaml'
import * as prettier from "prettier"
import * as sass from "sass"
import { Directories } from '../platform/directories'

export class TemplateContext {
  #filename: string
  #targetFileDirAbs: string
  #targetFileDirRel: string
  #outDirAbs: string
  path: typeof path

  constructor(
    targetFileDirRel: string,
    outDirAbs: string
  ) {
    this.#filename = path.basename(targetFileDirRel)
    this.#targetFileDirRel = path.dirname(targetFileDirRel)
    this.#targetFileDirAbs = path.dirname(path.join(Directories.Src, targetFileDirRel))
    this.#outDirAbs = outDirAbs
    this.path = path
  }

  filename() {
    return this.#filename
  }

  dirname() {
    return this.#targetFileDirAbs
  }

  relative_dirname() {
    return this.#targetFileDirRel
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
    console.log('  ∟ Including...'.padEnd(20) + srcFilePathRel)

    let fileType = 'css'
    let srcFilePathAbs = path.join(this.#targetFileDirAbs, srcFilePathRel)
    let outFilePathRel = srcFilePathRel
    let outFilePathAbs = path.join(this.#outDirAbs, srcFilePathRel)
    let content: string

    if (!fs.existsSync(srcFilePathAbs)) {
      return
    }

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
    if (!fs.existsSync(srcPathAbs)) {
      return
    }
    const outputPathAbs = path.join(this.#outDirAbs, srcPathRel)
    console.log('  ∟ Copying...'.padEnd(20) + srcPathRel)
    fs.copySync(srcPathAbs, outputPathAbs, { recursive: true })
  }
}
