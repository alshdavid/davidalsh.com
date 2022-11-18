import { IContext } from './context'
import * as node_path from 'node:path'
import * as node_url from 'node:url'
import * as node_fs from 'fs'
import * as node_crypto from "node:crypto"
import * as prettier from "prettier"
import * as sass from "sass"

export type IncludeStyleOptions = { 
  inline?: boolean, 
  cwd?: string 
}

export function includeStyle(context: IContext, path_input_file_rel: string, { inline = false, cwd }: IncludeStyleOptions = {}): string {
  let path_input_file_abs = ''
  if (cwd) {
    path_input_file_abs = node_path.join(cwd, path_input_file_rel)
  } else {
    path_input_file_abs = node_path.join(context.input.dirname_absolute(), path_input_file_rel)
  }

  if (!path_input_file_abs) {
    throw new Error('No path supplied')
  }

  let fileType = 'css'
  let outFilePathRel = path_input_file_rel
  let outFilePathAbs = node_path.join(context.output.dirname_absolute(), path_input_file_rel)
  let outDirPathAbs = node_path.dirname(outFilePathAbs)
  let content: string = ''
  let hash: string = ''

  let doneMessage

  if (node_fs.existsSync(outFilePathAbs)) {
    return ''
  }

  if (!node_fs.existsSync(path_input_file_abs)) {
    return ''
  }

  if (path_input_file_rel.endsWith('.scss')) {
    fileType = 'scss'
    outFilePathAbs = outFilePathAbs.replace('.scss', '.css')
    outFilePathRel = outFilePathRel.replace('.scss', '.css')
  }

  node_fs.mkdirSync(node_path.dirname(outFilePathAbs), { recursive: true })

  if (fileType === 'scss') {
    const sourceContent = node_fs.readFileSync(path_input_file_abs, { encoding: 'utf8' })
    const result = sass.compileString(sourceContent, {
      url: node_url.pathToFileURL(path_input_file_abs),
    })
    content = result.css.toString()
  } else {
    content = node_fs.readFileSync(path_input_file_abs, { encoding: 'utf8' })
  }

  content = prettier.format(content, {
    parser: 'css',
    tabWidth: 2,
  })

  hash = node_crypto.createHash('sha256').update(content).digest('hex').substring(0,10)
  outFilePathAbs = outFilePathAbs.replace('.css', `.${hash}.css`)
  outFilePathRel = outFilePathRel.replace('.css', `.${hash}.css`)
  
  if (!inline) {
    if (!node_fs.existsSync(outDirPathAbs)) {
      node_fs.mkdirSync(outDirPathAbs, { recursive: true })
    }

    node_fs.writeFileSync(outFilePathAbs, content, { encoding: 'utf8' })
  }

  if (inline) {
    return `<style>${content}</style>`
  } else {
    return `<link rel="stylesheet" href="${outFilePathRel}">`
  }
}
