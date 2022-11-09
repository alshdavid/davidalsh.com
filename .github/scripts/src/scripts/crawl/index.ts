import { parseArgs } from '../../platform/args';
import { main } from './crawl'

;(async () => {
    const args = parseArgs(process.argv.splice(2))
    const code = await main(args)
    process.exit(code || 0)
})()
