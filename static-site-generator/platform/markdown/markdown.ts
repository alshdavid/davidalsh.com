import * as fs from "node:fs/promises";
import * as path from "node:path";
import { marked } from 'marked'
import * as ejs from 'ejs'

export class Markdown {
  static async renderFile(...filepathSegments: string[]): Promise<string> {
    const filepath = path.join(...filepathSegments)
    const content =  await fs.readFile(filepath, { encoding: 'utf-8' })
    
    const postContent = await ejs.render(content, {}, {
      async: true,
      cache: false,
      filename: filepath,
    })

    try {
      return await Markdown.render(postContent)         
    } catch (error) {
      console.error('Error while compiling Markdown'+ path.resolve(...filepathSegments))
      console.error((error as Error).message)
      process.exit(1)
    }
  }

  static render(content: string): Promise<string> {
    return marked(content, { sanitize: false }) as any
  }
}
