import { IContext } from "./context";
import * as node_path from "node:path";
import * as node_fs from "node:fs";
import * as yaml from 'yaml'

export type TemplateOptions = {
  cwd?: string 
}

export function parseYamlFromFile<T = any>(context: IContext, path_input_rel_or_abs: string, options?: TemplateOptions): T {
  if (node_path.isAbsolute(path_input_rel_or_abs)) {
    const contents = node_fs.readFileSync(path_input_rel_or_abs, { encoding: 'utf8' })
    return parseYaml(contents)
  }

  let path_input_abs = ''

  if (options?.cwd) {
    path_input_abs = node_path.join(options.cwd, path_input_rel_or_abs)
  } else {
    path_input_abs = node_path.join(context.input.dirname_absolute(), path_input_rel_or_abs)
  }

  if (!node_fs.existsSync(path_input_abs)) {
    throw new Error('Yaml file does not exist, cannot parse' + path_input_abs)
  }

  const contents = node_fs.readFileSync(path_input_abs, { encoding: 'utf8' })
  return parseYaml(contents)
}

export function parseYaml<T = any>(text: string): T {
  return yaml.parse(text)
}
