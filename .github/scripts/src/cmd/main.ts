import { Directories } from "../platform/directories"
import * as fs from "../platform/fs"
// import * as node_path from 'node:path'
// import * as node_fs from 'node:fs'
// import { TemplateContext } from "./context"
// import * as ejs from 'ejs'
// import * as prettier from "prettier"
import * as yaml from 'yaml'


type EntryConfig = (
  {
    fileName: string,
    inputDirRel: string,
    outputExtension?: string,
    outputDirRel?: string,
  } | 
  {
    template: string,
    inputDirRel: string,
    outputExtension?: string,
    outputDirRel?: string,
  }
)

const Entries: EntryConfig[] = [
  { inputDirRel: './', fileName: 'index.ejs' },
  { inputDirRel: './posts', fileName: 'index.ejs' },
  { inputDirRel: './posts/api', fileName: 'all.json.ejs', outputExtension: 'json' },
]

for (const item of fs.ls(`${Directories.Src}/posts`)) {
  if (item.target_name.startsWith('_')) continue
  if (item.target_name === 'api') continue
  if (!item.isDirectory()) continue

  const meta = yaml.parse(fs.readFile(`${item.target_path_absolute}/meta.yaml`))
  Entries.push({
    inputDirRel: `./posts/${item.target_name}`,
    template: './posts/_template/post.template.ejs',
    outputDirRel: `./posts/${meta.slug}`,
  })
}

console.log(Entries)

// async function main() {
//   for (const inputFilePathRel of node_fs.readdirSync(Directories.Blogs)) {
//     if (inputFilePathRel.startsWith('_')) continue
//     if (inputFilePathRel === 'api') continue
//     if (!node_fs.statSync(node_path.join(Directories.Blogs, inputFilePathRel)).isDirectory()) continue
    
//     const meta = yaml.parse(node_fs.readFileSync(node_path.join(Directories.Src, 'posts', inputFilePathRel, 'meta.yaml'), { encoding: 'utf-8' }))

//     Files.push({ 
//       inputFilePathRel: node_path.join('posts', inputFilePathRel, 'index.ejs'),
//       template: node_path.join(Directories.Src, 'posts', '_template', 'post.template.ejs'),
//       outputDirRel: node_path.join('posts', meta.slug)
//     })
//   }

//   for (const { inputFilePathRel, template, outputDirRel } of Files) {
//     console.log(inputFilePathRel)
//     let inputFilePathAbs = node_path.join(Directories.Src, inputFilePathRel) 
//     // let inputFileDirAbs = path.dirname(inputFilePathAbs)

//     let outputFilePath = node_path.join(Directories.Dist, outputDirRel || inputFilePathRel)
//     let outputDirPath = node_path.dirname(outputFilePath)

//     let result: string

//     if (inputFilePathRel.endsWith('.ejs')) {
//       let outputLang = 'html'
//       if (inputFilePathRel.endsWith('.json.ejs')) {
//         outputLang = 'json'
//         outputFilePath = outputFilePath.slice(0, -9) + '.json'
//       } else {
//         outputLang = 'html'
//         outputFilePath = outputFilePath.slice(0, -4) + '.html'
//       }
//       const ctx = new TemplateContext(inputFilePathRel, outputDirPath)

//       const inputContent = node_fs.readFileSync(template || inputFilePathAbs, { encoding: 'utf8' })

//       let renderOutput = ejs.render(inputContent, ctx, {
//         async: false,
//         filename: inputFilePathAbs,
//       })

//       result = renderOutput
//       // result = prettier.format(renderOutput, {
//       //     parser: outputLang,
//       //     tabWidth: 2,
//       // })

//       // result = result.replaceAll(/<code>/g, '')
//     }

//     if (!node_fs.existsSync(outputDirPath)) {
//       node_fs.mkdirSync(outputDirPath, { recursive: true })
//     }
//     node_fs.writeFileSync(outputFilePath, result, { encoding: 'utf8' })
//     console.log('')
//   }
// }

// main()
