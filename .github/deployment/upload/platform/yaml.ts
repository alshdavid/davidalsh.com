import * as yaml from 'yaml'
import * as fs from "node:fs/promises";
import * as path from "node:path";

export class Yaml {
  static parseString<T = unknown>(input: string): T {
    return yaml.parse(input)
  }

  static async parseFile<T = unknown>(...filepathSegments: string[]): Promise<T> {
    try {
      const filepath = path.join(...filepathSegments)
      const content =  await fs.readFile(filepath, { encoding: 'utf-8' })
      return Yaml.parseString(content)   
    } catch (error) {
      console.error("Error: Failed to parse YAML File" + path.resolve(...filepathSegments))
      console.error((error as Error).message)
      process.exit(1)
    }
  }
}
