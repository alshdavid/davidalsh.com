import * as fs from "node:fs/promises";
import * as path from "node:path";
import { marked } from 'marked'
import * as ejs from 'ejs'
import { resolvePath } from './path-resolver.mjs'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import { TemplateContext } from "./context.mjs";

marked.use(gfmHeadingId())

export class Markdown {
  #rootDir
  #dirRel

  constructor(
    rootDir,
    dirRel
  ) {
    this.#rootDir = rootDir
    this.#dirRel = dirRel
  }

  async render(...filepathSegments) {
    const filepathAbs = resolvePath(this.#rootDir, this.#dirRel, path.join(...filepathSegments))
    const filepathRel = filepathAbs.replace(this.#rootDir, '')
    const content =  await fs.readFile(filepathAbs, { encoding: 'utf-8' })

    const ctx = new TemplateContext(
      filepathRel,
      this.#rootDir
    )

    ctx.set('image', () => 'poop')

    ctx.set('markdown', new Markdown(
      this.#rootDir,
      path.dirname(filepathRel)
    ))
    
    const postContent = await ejs.render(content, ctx, {
      async: true,
      cache: false,
      filename: filepathAbs,
    })

    try {
      return await this.renderText(postContent)         
    } catch (error) {
      console.error('Error while compiling Markdown'+ path.resolve(...filepathSegments))
      console.error(error.message)
      process.exit(1)
    }
  }

  renderText(content) {
    return marked(content, { 
      sanitize: false,
      mangle: false,
    })
  }
}
