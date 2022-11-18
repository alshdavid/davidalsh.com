export interface IContext {
  filename(): string
  input: IContextDirectory,
  output: IContextDirectory,
  template?: IContextDirectory,
  readFile(path_abs: string): string
  requireModule(package_path_or_name: string, options?: TemplateOptions): unknown
  writeFile(path_abs: string, data: string): void
  includeFile(path_abs: string, options?: TemplateOptions): void
  includeDir(path_abs: string, options?: TemplateOptions): void
  log: IContextLogger
  global: Record<any, any>
}

export interface IContextDirectory {
  dirname_absolute(): string
  dirname_relative(): string
}

export interface IContextLogger {
  write(text: string): IContextLogger
  newLine(text: string): IContextLogger
}

export type TemplateOptions = {
  cwd?: string 
}
