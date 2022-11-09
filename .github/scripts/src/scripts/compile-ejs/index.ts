import { parseArgs } from '../../platform/args';
import { main } from './main'

;(async () => {
    const code = await main(parseArgs(process.argv.splice(2)))
    process.exit(code || 0)
})()