import * as path from "node:path";
import { crawlDir } from "../../platform/crawl-dir";
import * as files from "../../platform/files";
import { Args } from "./args";
import { renderScripts } from "./tasks/scripts";
import { renderStyles } from "./tasks/styles";

process.stdout.setEncoding('utf8')

async function runTask(taskName: string, task: () => Promise<boolean>): Promise<boolean> {
  try {
    await task()
    process.stdout.write(`${taskName} ✔\n`)
    return true
  } catch (error) {
    if ((error as any).message) {
      process.stdout.write(`${taskName} ✘\n\n${(error as any).message}\n\n`)
      console.log()
    } else {
      process.stdout.write(`${taskName} ✘\n\n${(error as any).toString()}\n\n`)
    }
    return false
  }
}

async function runTasks(tasks: Array<{ taskName: string, task: () => Promise<boolean> }>): Promise<boolean> {
  const arr = []

  for (const task of tasks) {
    arr.push(runTask(task.taskName, task.task))
  }

  const result = await Promise.all(arr)

  return !result.includes(false)
}

async function main() {
  const args = new Args(process.argv.slice(3))
  const outFiles = new Map<string, string>()
  const sourceFiles = crawlDir({ targetPath: args.projectRoot, dontCrawl: ['node_modules'] })

  console.log('== Building ==')
  
  const success = await runTasks([
    { taskName: 'Styles', task: () => renderStyles(sourceFiles, outFiles, { contentHash: false }) },
    { taskName: 'Scripts', task: () => renderScripts(sourceFiles, outFiles) },
  ])

  if (!success) {
    process.exit(1)
  }

  console.log('== Writing ==')

  await files.rmDir(args.outDir)
  for (const [relativePath, contents] of outFiles.entries()) {
    console.log(relativePath)
    await files.writeFile(path.resolve(args.outDir, relativePath), contents)
  }
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })