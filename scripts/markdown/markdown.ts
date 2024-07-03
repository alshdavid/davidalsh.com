import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import * as path from "node:path";
import * as node_crypto from "node:crypto"
import { Marked } from 'marked'
import * as child_process from 'node:child_process'
import * as ejs from 'ejs'
import Prism from 'prismjs'
import PrismComponents from 'prismjs/components/'
import { markedHighlight } from "./markdown-highlight";
import * as paths from "../paths";

const NEW_LINE_EXP = /\n(?!$)/g;

export class Markdown {
  static async render(filepathSegments: string[], ctx: any): Promise<string> {
    const filepath = path.join(...filepathSegments)
    const dirpath = path.dirname(filepath)
    const content =  await fs.readFile(filepath, { encoding: 'utf-8' })
    
    const postContent = await ejs.render(content, ctx, {
      async: true,
      cache: false,
      filename: filepath,
    })

    try {
      return new Marked(markedHighlight({
        async: true,
        highlight: async (code, lang) => {
          if (lang  === 'plaintext') {
            return `
              <pre><code class="codeblock language-${lang}"><div class="codeblock-inner"><div class="line-numbers">${code}</div></div></code></pre>
            `
          }
          
          if (lang  === 'mermaid') {
            const hash = node_crypto.createHash('sha256').update(code).digest('hex').substring(0,10)

            if (!fsSync.existsSync(path.join(dirpath, 'mermaid'))) {
              await fs.mkdir(path.join(dirpath, 'mermaid'), { recursive: true })
            }

            if (!fsSync.existsSync(path.join(dirpath, 'mermaid', hash + '_light.svg'))) {
              const dir = path.join(paths.__temp, hash)
              await fs.mkdir(dir, { recursive: true })

              await fs.writeFile(path.join(dir, hash), code, 'utf8')
              
              child_process.execSync(`npx mmdc --input ${path.join(dir, hash)} -o ${path.join(dirpath, 'mermaid', hash + '_light.svg')} -b transparent`)
  
              await fs.rm(dir, { force: true, recursive: true })
            }

            if (!fsSync.existsSync(path.join(dirpath, 'mermaid', hash + '_dark.svg'))) {
              const dir = path.join(paths.__temp, hash)
              await fs.mkdir(dir, { recursive: true })

              await fs.writeFile(path.join(dir, hash), code, 'utf8')
  
              child_process.execSync(`npx mmdc --input ${path.join(dir, hash)} -o ${path.join(dirpath, 'mermaid', hash + '_dark.svg')} -t dark -b transparent`)
  
              await fs.rm(dir, { force: true, recursive: true })
            }

            ctx.assets.add(path.join('mermaid', hash + '_light.svg'))
            ctx.assets.add(path.join('mermaid', hash + '_dark.svg'))
            
            return `<div class="mermaid">
              <img class="light-mode" src="mermaid/${hash}_light.svg" />
              <img class="dark-mode" src="mermaid/${hash}_dark.svg" />
            </div>`
          }

          // @ts-ignore
          PrismComponents.silent = true
          PrismComponents(lang)
  
          let lineNumbersWrapper;
  
          Prism.hooks.add('after-tokenize', function (env) {
            const match = env.code.match(NEW_LINE_EXP);
            const linesNum = match ? match.length + 1 : 1;
            const lines = new Array(linesNum + 1).join('<span></span>');
          
            lineNumbersWrapper = `<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`;
          });
  
          return `<pre><code class="codeblock language-${lang}"><div class="codeblock-inner"><div class="line-numbers">${Prism.highlight(code, Prism.languages[lang], lang) + lineNumbersWrapper}</div></div></code></pre>`
        }
      })).parse(postContent)
    } catch (error) {
      console.error('Error while compiling Markdown'+ path.resolve(...filepathSegments))
      console.error((error as Error).message)
      process.exit(1)
    }
  }
}

