import { Directories } from "../platform/directories"
import { TemplateContext } from "./context"
import * as fs from "../platform/fs"
import * as node_fs from 'node:fs'
import * as node_path from 'node:path'
import * as ejs from 'ejs'
import * as yaml from 'yaml'
import * as prettier from "prettier"

type EntryConfigFile = {
  type: 'file',
  fileName: string,
}

type EntryConfigTemplate = {
  type: 'template',
  virtualFileName: string,
  virtualInputDirectory: string,
  template: string,
}

type EntryConfig = (EntryConfigFile | EntryConfigTemplate) & {
  processor: 'ejs',
  inputDirRel: string,
  outputExtension?: string,
  outputDirRel?: string,
}

const Entries: EntryConfig[] = [
  { type: 'file', processor: 'ejs', inputDirRel: '', fileName: 'index.ejs' },
  { type: 'file', processor: 'ejs', inputDirRel: '', fileName: '404.ejs' },
  { type: 'file', processor: 'ejs', inputDirRel: 'resume', fileName: 'index.ejs' },
  { type: 'file', processor: 'ejs', inputDirRel: 'portfolio', fileName: 'index.ejs' },
  { type: 'file', processor: 'ejs', inputDirRel: 'posts/api', fileName: 'all.ejs', outputExtension: 'json' },
]

// Populate post entries
for (const item of fs.ls(`${Directories.Root}/posts`)) {
  if (item.target_name.startsWith('_')) continue
  if (item.target_name === 'api') continue
  if (!item.isDirectory()) continue

  const meta = yaml.parse(fs.readFile(`${item.target_path_absolute}/meta.yaml`))
  Entries.push({
    type: 'template',
    processor: 'ejs',
    virtualFileName: 'index.ejs',
    inputDirRel: `../posts/${item.target_name}`,
    virtualInputDirectory: `posts/${meta.slug}`,
    template: 'posts/_template/post.template.ejs',
    outputDirRel: `posts/${meta.slug}`,
  })
}

for (const entry of Entries) {
  let result: undefined | string
  let outputName: undefined | string
  let inputName: undefined | string
  const outDir = entry.outputDirRel || entry.inputDirRel
  const outDirAbs = fs.path(`${Directories.Dist}/${outDir}`)
  const outputExtension = entry.outputExtension || 'html'

  if (entry.type === 'template') {
    inputName = entry.virtualFileName
    outputName = inputName.slice(0, -3) + outputExtension
  }

  if (entry.type === 'file') {
    inputName = entry.fileName
    outputName = entry.fileName.slice(0, -3) + outputExtension
  }

  if (!inputName) {
    throw new Error(`No input name: ${JSON.stringify(entry, null, 2)}`)
  }

  if (entry.processor === 'ejs') {
    let inputDirRel: string | undefined

    if (entry.type === 'template') {
      inputDirRel = fs.path(entry.template)
    }

    if (entry.type === 'file') {
      inputDirRel = entry.inputDirRel ? fs.path(`${entry.inputDirRel}/${entry.fileName}`) : entry.fileName      
    }

    if (!inputDirRel) {
      throw new Error(`Unable to load file: ${JSON.stringify(entry, null, 2)}`)
    }

    const inputContent = fs.readFile(`${Directories.Src}/${inputDirRel}`)
    ;(global as any).context = undefined
    
    if (entry.type === 'template') {
      console.log(fs.path(`${entry.virtualInputDirectory}/${entry.virtualFileName}`) + ' (virtual)')

      const path_input_file_abs_template = node_path.join(Directories.Src, entry.template)
      const ctx = new TemplateContext(inputName, entry.inputDirRel, outDirAbs, path_input_file_abs_template)

      result = ejs.render(inputContent, ctx, {
        async: false,
        cache: false,
        filename: fs.path(`${Directories.Src}/${entry.virtualInputDirectory}/${inputName}`),
      })
    }

    if (entry.type === 'file') {
      console.log(fs.path(inputDirRel))

      const ctx = new TemplateContext(inputName, entry.inputDirRel, outDirAbs)

      result = ejs.render(inputContent, ctx, {
        async: false,
        cache: false,
        filename: fs.path(`${Directories.Src}/${outDir}/${inputName}`),
      })
    }    
  }

  if (!node_fs.existsSync(outDirAbs)) {
    node_fs.mkdirSync(outDirAbs, { recursive: true })
  }

  if (!result) {
    throw new Error(`No render produced: ${JSON.stringify(entry, null, 2)}`)
  }

  result = prettier.format(result, {
    parser: entry.outputExtension || 'html',
    tabWidth: 2,
  })

  try {
    node_fs.writeFileSync(fs.path(`${outDirAbs}/${outputName}`), result, { encoding: 'utf8' })
  } catch (error) {
    console.log({normalized_path: fs.path(`${outDirAbs}/${outputName}`)})
    console.log(error)
    throw new Error('Failed to write file')
  }
}
