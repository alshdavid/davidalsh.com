import * as path from "node:path";
import { crawlDir } from "../../platform/crawl-dir";
import * as files from "../../platform/files";
import { Args } from "./args";
import { renderStyles } from "./styles";



async function main() {
  const args = new Args(process.argv.slice(3))
  const outFiles = new Map<string, string>()
  const sourceFiles = crawlDir({ targetPath: args.projectRoot, dontCrawl: ['node_modules'] })

  await renderStyles(sourceFiles, outFiles, { contentHash: false })

  await files.rmDir(args.outDir)
  for (const [relativePath, contents] of outFiles.entries()) {
    await files.writeFile(path.resolve(args.outDir, relativePath), contents)
  }
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })