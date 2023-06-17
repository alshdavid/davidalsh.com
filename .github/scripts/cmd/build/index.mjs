import webpack from 'webpack'
import * as path from 'node:path'
import * as fs from 'node:fs'
import * as url from 'node:url'
import * as sass from 'sass'
import * as ejs from 'ejs'
import { crawlDir, TargetType } from '@alshdavid/kit/dirs'
import { TemplateContext } from './templates/context.mjs'
import * as Paths from '../../platform/paths.mjs'
import { Markdown } from './templates/markdown.mjs'

async function main() {
  if (fs.existsSync(Paths.outDir)) {
    fs.rmSync(Paths.outDir, { recursive: true })
  }
  fs.mkdirSync(Paths.outDir, { recursive: true })
  
  const sourceFiles = crawlDir({
    targetPath: Paths.src,
  })

  await (async () => {
    for (const [filepath, stat] of sourceFiles.entries()) {
      if (stat !== TargetType.FOLDER) continue
      if (path.basename(filepath) !== 'assets') continue      
      const filepathRel = filepath.replace(Paths.src, '')
      const outDir = path.join(Paths.outDir, filepathRel)
      if (!fs.existsSync(path.dirname(outDir))) {
        fs.mkdirSync(path.dirname(outDir), { recursive: true })
      }
      fs.symlinkSync(filepath, outDir)
    }
  })()

  await (async () => {
    const compiler = webpack({
      mode: 'production',
      experiments: {
        outputModule: true
      },
      entry: path.join(Paths.src, 'index.ts'),
      output: {
        filename: 'index.js',
        path: Paths.outDir,
        publicPath: '',
        library: {
          type: 'module'
        }
      },
      devtool: false,
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader'
          },
        ]
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js', '.mjs'],
        extensionAlias: {
          '.js': ['.ts', '.js'],
          '.mjs': ['.mts', '.mjs']
        },
        alias: {}
      },
    })

    /** @type {import('webpack').Stats} */
    const stats = await new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err !== null && err !== undefined) {
          reject(err)
        } else if (stats === undefined) {
          reject(new Error('Webpack error: no stats'))
        } else {
          resolve(stats)
        }
      })
    })

    console.log(stats.toString())
  })()

  await (async () => {
    const sourcePath = path.join(Paths.src, 'index.scss')
    const raw = fs.readFileSync(sourcePath, { encoding: 'utf8' })
    const result = sass.compileString(raw, {
      url: url.pathToFileURL(sourcePath),
    })
    const content = result.css.toString()
    fs.writeFileSync(path.join(Paths.outDir, 'index.css'), content, { encoding: 'utf-8' })
  })()

  await (async () => {
    for (const [filepath] of sourceFiles.entries()) {
      if (!filepath.endsWith('.ejs')) continue
      if (filepath.includes(path.sep + '_')) continue

      const { name: fileName } = path.parse(filepath)
      const template = fs.readFileSync(filepath, { encoding: 'utf-8' })

      const filepathRel = path.dirname(filepath.replace(Paths.src, ''))
      const outDir = path.join(Paths.outDir, filepathRel)

      const ctx = new TemplateContext(
        path.join(filepathRel, `${fileName}.html`),
        Paths.src,
      )

      const markdown = new Markdown(
        Paths.src,
        ctx.paths.dir
      )

      ctx.set('markdown', markdown)

      const result = await ejs.render(template, ctx, {
        async: true,
        cache: false,
        filename: filepath,
      })

      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, `${fileName}.html`), result, { encoding: 'utf-8' })
    }
  })()
}

main()