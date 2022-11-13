import { marked } from 'marked'
import * as path from 'node:path'
import * as fs from 'fs-extra'
import * as yaml from 'yaml'
import * as prettier from "prettier"
import * as sass from "sass"
import * as crypto from "node:crypto"
import * as url from "node:url"

import { Directories } from '../platform/directories'


const col_1_padding = 30
const col_2_padding = 50

export class TemplateContext {
  #filename: string
  #inputDirAbs: string
  #inputDirRel: string
  #outputDirAbs: string
  path: typeof path

  constructor(
    fileName: string,
    inputDirRel: string,
    outputDirAbs: string
  ) {
    this.#filename = fileName
    this.#inputDirRel = inputDirRel
    this.#inputDirAbs = path.join(Directories.Src, inputDirRel)
    this.#outputDirAbs = outputDirAbs
    this.path = path
  }

  filename() {
    return this.#filename
  }

  dirname() {
    return this.#inputDirAbs
  }

  relative_dirname() {
    return this.#inputDirRel
  }

  readFile(srcPathRel: string): string {
    const srcPathAbs = path.isAbsolute(srcPathRel) ? srcPathRel : path.join(this.#inputDirAbs, srcPathRel)
    return fs.readFileSync(srcPathAbs, { encoding: 'utf8' })
  }

  readDir(srcPathRel: string): string[] {
    const srcPathAbs = path.isAbsolute(srcPathRel) ? srcPathRel : path.join(this.#inputDirAbs, srcPathRel)
    return fs.readdirSync(srcPathAbs)
  }

  stat(srcPathRel: string) {
    const srcPathAbs = path.isAbsolute(srcPathRel) ? srcPathRel : path.join(this.#inputDirAbs, srcPathRel)
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
    process.stdout.write('  ∟ Including... '.padEnd(col_1_padding) + path.join(this.#inputDirRel, srcFilePathRel).padEnd(col_2_padding))
    let fileType = 'css'
    let srcFilePathAbs = path.join(this.#inputDirAbs, srcFilePathRel)
    let outFilePathRel = srcFilePathRel
    let outFilePathAbs = path.join(this.#outputDirAbs, srcFilePathRel)
    let outDirPathAbs = path.dirname(outFilePathAbs)
    let content: string = ''
    let hash: string = ''


    if (fs.existsSync(outFilePathAbs)) {
      process.stdout.write('...Already Exists\n')
      return ''
    }

    if (!fs.existsSync(srcFilePathAbs)) {
      process.stdout.write('...Doesn\'t Exist\n')
      return ''
    }

    if (srcFilePathRel.endsWith('.scss')) {
      fileType = 'scss'
      outFilePathAbs = outFilePathAbs.replace('.scss', '.css')
      outFilePathRel = outFilePathRel.replace('.scss', '.css')
    }

    fs.mkdirSync(path.dirname(outFilePathAbs), { recursive: true })

    if (fileType === 'scss') {
      const sourceContent = this.readFile(srcFilePathRel)
      const result = sass.compileString(sourceContent, {
        url: url.pathToFileURL(srcFilePathAbs)// new URL(srcFilePathAbs),
      })
      // const result = sass.renderSync({
      //   file: srcFilePathAbs
      // })
      content = result.css.toString()
      // content = srcFilePathAbs
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

      if (!fs.existsSync(outDirPathAbs)) {
        fs.mkdirSync(outDirPathAbs, { recursive: true })
      }

      fs.writeFileSync(outFilePathAbs, content, { encoding: 'utf8' })
    }

    process.stdout.write('...Done\n')
    if (inline) {
      return `<style>${content}</style>`
    } else {
      return `<link rel="stylesheet" href="${outFilePathRel}">`
    }
  }

  includeDir(srcPathRel: string) {
    const srcPathAbs = path.join(this.#inputDirAbs, srcPathRel)
    if (!fs.existsSync(srcPathAbs)) {
      return
    }
    const outputPathAbs = path.join(this.#outputDirAbs, srcPathRel)
    process.stdout.write('  ∟ Copying... '.padEnd(col_1_padding) + path.join(this.#inputDirRel, srcPathRel).padEnd(col_2_padding))
    fs.copySync(srcPathAbs, outputPathAbs, { recursive: true })
    process.stdout.write('...Done\n')
  }
}
