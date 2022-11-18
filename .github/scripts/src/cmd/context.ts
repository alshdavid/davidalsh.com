import { Directories } from '../platform/directories'
import * as node_path from 'node:path'
import * as node_fs from 'fs'
import { IContext, IContextDirectory, IContextLogger, TemplateOptions } from './i-context'

export class TemplateContext implements IContext {
  #filename: string
  input: ContextDirectory
  output: ContextDirectory
  template?: ContextDirectory
  log: ContextLogger
  global: Record<any, any>

  constructor(
    fileName: string,
    path_input_dir_rel: string,
    path_output_dir_abs: string,
    path_template_file_abs?: string,
  ) {
    this.#filename = fileName
    
    const path_input_dir_abs = node_path.join(Directories.Src, path_input_dir_rel)
    this.input = new ContextDirectory(path_input_dir_abs, path_input_dir_rel)

    const path_output_dir_rel = node_path.relative(Directories.Dist, path_output_dir_abs)
    this.output = new ContextDirectory(path_output_dir_abs, path_output_dir_rel)

    if (path_template_file_abs) {
      const path_template_dir_abs = node_path.dirname(path_template_file_abs)
      const path_template_file_rel = node_path.relative(path_input_dir_abs, path_template_file_abs)
      this.template = new ContextDirectory(path_template_dir_abs, path_template_file_rel)
    }

    this.log = new ContextLogger()
    this.global = {}
  }

  filename() {
    return this.#filename
  }
  
  requireModule(package_path_or_name: string, options?: TemplateOptions): any {
    let module_path = package_path_or_name

    if (package_path_or_name.startsWith('.') && options?.cwd) {
      module_path = node_path.join(options?.cwd, package_path_or_name)
    } else if (package_path_or_name.startsWith('.') && !options?.cwd) {
      module_path = node_path.join(this.input.dirname_absolute(), package_path_or_name)
    }
    
    return require(module_path)
  }

  readFile(path_abs: string): string {
    return node_fs.readFileSync(path_abs, { encoding: 'utf8' })
  }

  writeFile(path_rel: string, data: string): void {
    const path_abs = node_path.join(this.output.dirname_absolute(), path_rel)
    if (!node_fs.existsSync(node_path.dirname(path_abs))) {
      node_fs.mkdirSync(node_path.dirname(path_abs), { recursive: true })
    }
    return node_fs.writeFileSync(path_abs, data, { encoding: 'utf8' })
  }

  includeFile(path_rel: string, options?: TemplateOptions): void {
    this.includeDir(path_rel, options)
  }

  includeDir(path_input_rel: string, options?: TemplateOptions): void {
    if (node_path.isAbsolute(path_input_rel)) {
      throw new Error('Does not support absolute paths yet')
    }

    let path_input_abs = ''
    if (options?.cwd) {
      path_input_abs = node_path.join(options.cwd, path_input_rel)
    } else {
      path_input_abs = node_path.join(this.input.dirname_absolute(), path_input_rel)
    }
    if (!node_fs.existsSync(path_input_abs)) {
      return
    }

    const path_output_abs = node_path.join(this.output.dirname_absolute(), path_input_rel)
    node_fs.cpSync(path_input_abs, path_output_abs, { recursive: true })
  }
}

export class ContextDirectory implements IContextDirectory {
  #path_dir_abs: string
  #path_dir_rel: string

  constructor(
    path_dir_abs: string,
    path_dir_rel: string,
  ) {
    this.#path_dir_abs = path_dir_abs
    this.#path_dir_rel = path_dir_rel
  }

  dirname_absolute(): string {
    return this.#path_dir_abs
  }

  dirname_relative(): string {
    return this.#path_dir_rel
  }
}

export class ContextLogger implements IContextLogger {
  write(text: string): IContextLogger {
    throw new Error('Method not implemented.')
  }
  newLine(text: string): IContextLogger {
    throw new Error('Method not implemented.')
  }

}