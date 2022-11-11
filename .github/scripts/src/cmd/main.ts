import { Directories } from "../platform/directories"
import * as path from 'node:path'
import * as fs from 'node:fs'
import { TemplateContext } from "./context"
import * as ejs from 'ejs'
import * as prettier from "prettier"

const Files: { inputFilePathRel: string, template?: string }[] = [
  { inputFilePathRel: path.join('index.ejs') },
  { inputFilePathRel: path.join('blogs', 'index.ejs') },
]

async function main() {
  for (const inputFilePathRel of fs.readdirSync(Directories.Blogs)) {
    if (inputFilePathRel.startsWith('_')) continue
    if (!fs.statSync(path.join(Directories.Blogs, inputFilePathRel)).isDirectory()) continue
    Files.push({ 
      inputFilePathRel: path.join('blogs', inputFilePathRel, 'index.ejs'),
      template: path.join(Directories.Src, 'blogs', '_template', 'blog.template.ejs')
    })
  }

  for (const { inputFilePathRel, template } of Files) {
    console.log('Compiling...'.padEnd(20), inputFilePathRel)
    let inputFilePathAbs = path.join(Directories.Src, inputFilePathRel) 
    let inputFileDirAbs = path.dirname(inputFilePathAbs)

    let outputFilePath = path.join(Directories.Dist, inputFilePathRel)
    let outputDirPath = path.dirname(outputFilePath)

    let result: string

    if (inputFilePathRel.endsWith('.ejs')) {
      outputFilePath = outputFilePath.slice(0, -4) + '.html'
      const ctx = new TemplateContext(inputFilePathRel, outputDirPath)

      const inputContent = fs.readFileSync(template || inputFilePathAbs, { encoding: 'utf8' })

      let renderOutput = ejs.render(inputContent, ctx, {
        async: false,
        filename: inputFilePathAbs,
      })

      result = prettier.format(renderOutput, {
          parser: 'html',
          tabWidth: 2,
      })
    }

    if (!fs.existsSync(outputDirPath)) {
      fs.mkdirSync(outputDirPath, { recursive: true })
    }
    fs.writeFileSync(outputFilePath, result, { encoding: 'utf8' })
    console.log('')
  }
}

main()