import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as node_crypto from "node:crypto"
import { Marked } from 'marked'
import * as ejs from 'ejs'
import Prism from 'prismjs'
import PrismComponents from 'prismjs/components/'
import { markedHighlight } from "./highlight";

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
        highlight: async (code, lang_raw) => {
          const [lang = 'plaintext', settings_raw] = lang_raw.split('?')
          const settings = new URLSearchParams(settings_raw)
          
          if (lang  === 'plaintext' || lang === '') {
            return `
              <div class="codeblock-outer">
                <button>
                  <span class="flex flex-row items-center leading-none">
                    <span class="mr-1">Copy</span>
                    <svg class="h-4 w-4 fill-current" viewBox="0 0 384 512"><path d="M336 64h-88.6c.4-2.6.6-5.3.6-8 0-30.9-25.1-56-56-56s-56 25.1-56 56c0 2.7.2 5.4.6 8H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zM192 32c13.3 0 24 10.7 24 24s-10.7 24-24 24-24-10.7-24-24 10.7-24 24-24zm160 432c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16h48v20c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12V96h48c8.8 0 16 7.2 16 16z"></path></svg>
                  </span>
                </button>
                <pre><code class="codeblock language-${lang}"><div class="codeblock-inner"><div class="line-numbers">${code}</div></div></code></pre>
              </div>
            `
          }
          
          if (lang  === 'mermaid') {
            const hash = node_crypto.createHash('sha256').update(code).digest('hex').substring(0,10)

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

          return `
            <code class="codeblock language-${lang} ${settings.get('border') === 'false' ? '' : 'border'}">
              ${settings.has('title') ? `<div class="title">${settings.get('title')}</div>` : ''}
              <div class="codeblock-inner line-numbers">
                <pre>${Prism.highlight(code, Prism.languages[lang], lang)}</pre>
                ${lineNumbersWrapper}
              </div>
            </code>
          `
        }
      })).parse(postContent)
    } catch (error) {
      console.error('Error while compiling Markdown'+ path.resolve(...filepathSegments))
      console.error((error as Error).message)
      process.exit(1)
    }
  }
}

