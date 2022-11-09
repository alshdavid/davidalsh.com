import * as path from 'node:path'
import { parseArgs } from '../../platform/args'
import { crawlDir } from '../../platform/crawl-dir'

export async function main(args: Record<string, string[]>): Promise<number | void> {
    const targetFile = args['target'][0]
    const targetCwd = args['cwd'][0]
    const ignoreList = args['ignore'] || []
    const runScript = args['run-script'][0]
    const runScriptArgs = args['args'] || []

    const targetFileReg = new RegExp(targetFile)

    const files = crawlDir({ 
        cwd: path.isAbsolute(targetCwd) ? targetCwd : path.resolve(process.cwd(), targetCwd),
        dontCrawl: [ '.git', 'node_modules', ...ignoreList ]
    })

    for (const file of Object.keys(files)) {
        if (targetFileReg.test(file)) {
            const { main: scriptMain }: any = await import(`../${runScript}/main`)
            const newArgs = parseArgs([...runScriptArgs, file])
            const exitCode = await scriptMain(newArgs)
            if (exitCode) {
                return exitCode
            }
        }
    }
}

