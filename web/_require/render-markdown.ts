import { IContext } from './context'
import * as node_crypto from "node:crypto"
import * as node_path from "node:path"
import * as node_fs from "node:fs"
import { marked } from 'marked'
import * as Prism from 'prismjs'
import * as PrismComponents from 'prismjs/components/'

export type RenderMarkdownOptions = { 
  renderHighlighting?: boolean,
  cwd?: string,
}

const NEW_LINE_EXP = /\n(?!$)/g;

export function renderMarkdownFile(context: IContext, path_input_rel_or_abs: string, options: RenderMarkdownOptions = {}) {
  let path_abs = path_input_rel_or_abs
  
  if (node_path.isAbsolute(path_input_rel_or_abs)) {
    path_abs = path_input_rel_or_abs
  } else if (options.cwd) {
    path_abs = node_path.join(options.cwd, path_input_rel_or_abs)
  } else {
    path_abs = node_path.join(context.input.dirname_absolute(), path_input_rel_or_abs)
  }

  return _renderMarkdownFile(context, path_abs, options)
}

function _renderMarkdownFile(context: IContext, text: string, { renderHighlighting = true }: RenderMarkdownOptions = {}) {
  let result = marked(context.readFile(text), {
    highlight: function(code, lang, callback) {
      if (!renderHighlighting) {
        return ''
      }
      let output = code
      if (lang !== 'plaintext') {
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

        output = Prism.highlight(code, Prism.languages[lang], lang) + lineNumbersWrapper;
      }
      
      const hash = node_crypto.createHash('sha256').update(output).digest('hex').substring(0,10)

      const sourcePath = `fragments/${hash}/${hash}.txt`
      const fragPath = `fragments/${hash}/${hash}.html`
      const fragMeta = { 
        lang, 
        source: node_path.join(context.output.dirname_relative(), sourcePath), 
        rendered: node_path.join(context.output.dirname_relative(), fragPath), 
      }

      const path_output_dir_abs = node_path.join(context.output.dirname_absolute(), 'fragments', hash)

      if (!node_fs.existsSync(path_output_dir_abs)) {
        node_fs.mkdirSync(path_output_dir_abs, { recursive: true })
      }

      node_fs.writeFileSync(node_path.join(path_output_dir_abs, `${hash}.json`), JSON.stringify(fragMeta, null, 2),{ encoding: 'utf8' })
      node_fs.writeFileSync(node_path.join(path_output_dir_abs, `${hash}.html`), output,{ encoding: 'utf8' })
      node_fs.writeFileSync(node_path.join(path_output_dir_abs, `${hash}.txt`), code,{ encoding: 'utf8' })

      return `<embed data-type="code" data-lang="${lang}" type="text/html" style="display: none;" src="${fragPath}" />`
    },
  })
  return result
}
