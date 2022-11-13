import { marked } from 'marked'
import * as path from 'node:path'
import * as fs from 'fs-extra'
import * as yaml from 'yaml'
import * as prettier from "prettier"
import * as sass from "sass"
import * as crypto from "node:crypto"

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

  escapeHtml(unsafe: string): string{
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  renderMarkdown(srcPath: string) {
    return marked(this.readFile(srcPath))
  }

  parseYaml(yamlSrc: string): Record<string, any> {
    return yaml.parse(yamlSrc)
  }

  includeStyle(srcFilePathRel: string, { inline = false }: { inline?: boolean } = {}): string {
    process.stdout.write('  ∟ Including... '.padEnd(21) + path.join(this.#targetFileDirRel, srcFilePathRel).padEnd(40))

    let fileType = 'css'
    let srcFilePathAbs = path.join(this.#targetFileDirAbs, srcFilePathRel)
    let outFilePathRel = srcFilePathRel
    let outFilePathAbs = path.join(this.#outDirAbs, srcFilePathRel)
    let content: string = ''
    let hash: string = ''

    if (!fs.existsSync(srcFilePathAbs)) {
      process.stdout.write('...Already Exists\n')
      return ''
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

      hash = crypto.createHash('md5').update(content).digest('hex')
      outFilePathAbs = outFilePathAbs.replace('.css', `.${hash}.css`)
      outFilePathRel = outFilePathRel.replace('.css', `.${hash}.css`)
      if (!inline) {
        fs.writeFileSync(outFilePathAbs, content, { encoding: 'utf8' })
      }
    }

    process.stdout.write('...Done\n')
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
    process.stdout.write('  ∟ Copying... '.padEnd(21) + path.join(this.#targetFileDirRel, srcPathRel).padEnd(40))
    fs.copySync(srcPathAbs, outputPathAbs, { recursive: true })
    process.stdout.write('...Done')
  }
}
