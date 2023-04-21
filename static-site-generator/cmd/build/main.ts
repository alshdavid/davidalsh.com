import * as path from "node:path";
import { crawlDir } from "../../platform/crawl-dir";
import * as files from "../../platform/files";
import { Args } from "./args";
import { renderScripts } from "./tasks/scripts";
import { renderStyles } from "./tasks/styles";
import { renderTemplates } from "./tasks/templates";
import { LinkSymbol, linkAssets } from "./tasks/assets";

process.stdout.setEncoding('utf8')

async function runTask(taskName: string, task: () => Promise<void>): Promise<void> {
  try {
    await task()
    process.stdout.write(`${taskName} ✔\n`)
  } catch (error) {
    if ((error as any).message) {
      process.stdout.write(`${taskName} ✘\n\n${(error as any).message}\n\n`)
      console.log()
    } else {
      process.stdout.write(`${taskName} ✘\n\n${(error as any).toString()}\n\n`)
    }
  }
}

async function runTasks(tasks: Array<{ taskName: string, task: () => Promise<void> }>): Promise<void> {
  const arr = []

  for (const task of tasks) {
    arr.push(runTask(task.taskName, task.task))
  }

  await Promise.all(arr)
}

async function main() {
  const args = new Args(process.argv.slice(3))
  const outFiles = new Map<string, string>()
  const sourceFiles = crawlDir({ targetPath: args.projectRoot, dontCrawl: ['node_modules'] })

  console.log('== Building ==')
  
  await runTasks([
    { taskName: 'Styles', task: () => renderStyles(sourceFiles, outFiles, { contentHash: false }) },
    { taskName: 'Scripts', task: () => renderScripts(sourceFiles, outFiles) },
    { taskName: 'Templates', task: () => renderTemplates(args, sourceFiles, outFiles) },
    { taskName: 'Assets', task: () => linkAssets(sourceFiles, outFiles) },
  ])

  console.log('== Writing ==')

  if (await files.existsAsync(args.outDir)) {
    await files.rmDir(args.outDir)
  }
  for (const [relativePath, contents] of outFiles.entries()) {
    console.log(relativePath)
    if (contents === LinkSymbol) {
      await files.createLink(path.join(args.projectRoot, relativePath), path.join(args.outDir, relativePath))
    } else {
      await files.writeFile(path.resolve(args.outDir, relativePath), contents)
    }
  }
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })