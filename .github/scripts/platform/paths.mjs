import * as path from 'node:path'
import * as url from 'node:url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
export const root = path.resolve(__dirname, '../../../')
export const outDir = path.resolve(__dirname, '../dist')
export const src = path.resolve(__dirname, '../../../website')
