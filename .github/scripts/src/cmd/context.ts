import { Directories } from '../platform/directories'
import *as fs from '../platform/fs'
import { marked } from 'marked'
import * as node_path from 'node:path'
import * as node_fs from 'fs-extra'
import * as yaml from 'yaml'
import * as prettier from "prettier"
import * as sass from "sass"
import * as crypto from "node:crypto"
import * as url from "node:url"

const col_1_padding = 30
const col_2_padding = 50

function writeStatus(title: string, target: string) {
  process.stdout.write(`  ∟ ${title}... `.padEnd(col_1_padding))
  process.stdout.write(target.padEnd(col_2_padding))
  return (doneMessage: string = 'Done') => process.stdout.write(`...${doneMessage}\n`)
}

export class TemplateContext {
  #filename: string
  #inputDirAbs: string
  #inputDirRel: string
  #virtualInputDirRel: string | undefined
  #virtualInputDirAbs: string | undefined
  #outputDirAbs: string
  path: typeof node_path

  constructor(
    fileName: string,
    inputDirRel: string,
    outputDirAbs: string,
    virtualInputDirRel?: string,
  ) {
    this.#filename = fileName
    this.#inputDirRel = inputDirRel
    this.#inputDirAbs = node_path.join(Directories.Src, inputDirRel)
    this.#virtualInputDirRel = virtualInputDirRel
    this.#virtualInputDirAbs = virtualInputDirRel && node_path.join(Directories.Src, virtualInputDirRel)
    this.#outputDirAbs = outputDirAbs
    this.path = node_path
  }

  filename() {
    return this.#filename
  }

  dirname() {
    return this.#inputDirAbs
  }

  relative_dirname() {
    return this.#virtualInputDirRel || this.#inputDirRel
  }

  readFile(srcPathRel: string): string {
    const srcPathAbs = node_path.isAbsolute(srcPathRel) ? srcPathRel : node_path.join(this.#inputDirAbs, srcPathRel)
    return node_fs.readFileSync(srcPathAbs, { encoding: 'utf8' })
  }

  readDir(srcPathRel: string): string[] {
    const srcPathAbs = node_path.isAbsolute(srcPathRel) ? srcPathRel : node_path.join(this.#inputDirAbs, srcPathRel)
    return node_fs.readdirSync(srcPathAbs)
  }

  stat(srcPathRel: string) {
    const srcPathAbs = node_path.isAbsolute(srcPathRel) ? srcPathRel : node_path.join(this.#inputDirAbs, srcPathRel)
    return node_fs.statSync(srcPathAbs)
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

  includeStyle(srcFilePathRel: string, { inline = false, fromVirtualPath = false }: { inline?: boolean, fromVirtualPath?: boolean } = {}): string {
    if (fromVirtualPath && !this.#virtualInputDirRel) {
      throw new Error('Tried to use virtual path without setting')
    }
    let fileType = 'css'
    let srcFilePathAbs = node_path.join(this.#inputDirAbs, srcFilePathRel)
    if (fromVirtualPath && this.#virtualInputDirAbs) {
      srcFilePathAbs = node_path.join(this.#virtualInputDirAbs, srcFilePathRel)
    }
    let outFilePathRel = srcFilePathRel
    let outFilePathAbs = node_path.join(this.#outputDirAbs, srcFilePathRel)
    let outDirPathAbs = node_path.dirname(outFilePathAbs)
    let content: string = ''
    let hash: string = ''


    let doneMessage

    if (fromVirtualPath) {
      doneMessage = writeStatus('Including', fs.path(srcFilePathRel) + ' (virtual)')
    } else {
      doneMessage = writeStatus('Including', fs.path(srcFilePathRel))
    }

    if (node_fs.existsSync(outFilePathAbs)) {
      doneMessage('Already Exists')
      return ''
    }

    if (!node_fs.existsSync(srcFilePathAbs)) {
      doneMessage('Doesn\'t Exist')
      return ''
    }

    if (srcFilePathRel.endsWith('.scss')) {
      fileType = 'scss'
      outFilePathAbs = outFilePathAbs.replace('.scss', '.css')
      outFilePathRel = outFilePathRel.replace('.scss', '.css')
    }

    node_fs.mkdirSync(node_path.dirname(outFilePathAbs), { recursive: true })

    if (fileType === 'scss') {
      const sourceContent = this.readFile(srcFilePathAbs)
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

      if (!node_fs.existsSync(outDirPathAbs)) {
        node_fs.mkdirSync(outDirPathAbs, { recursive: true })
      }

      node_fs.writeFileSync(outFilePathAbs, content, { encoding: 'utf8' })
    }

    doneMessage('Done')
    if (inline) {
      return `<style>${content}</style>`
    } else {
      return `<link rel="stylesheet" href="${outFilePathRel}">`
    }
  }

  includeDir(srcPathRel: string) {
    const srcPathAbs = node_path.join(this.#inputDirAbs, srcPathRel)
    if (!node_fs.existsSync(srcPathAbs)) {
      return
    }
    const outputPathAbs = node_path.join(this.#outputDirAbs, srcPathRel)
    
    const doneMessage = writeStatus('Copying', fs.path(srcPathRel))

    node_fs.copySync(srcPathAbs, outputPathAbs, { recursive: true })

    doneMessage()
  }
}
