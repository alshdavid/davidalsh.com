// node copy.mjs parcel 250
// node copy.mjs fastest-possible 250
// node copy.mjs transformer 250

import * as path from 'node:path';
import * as fs from 'node:fs';
import * as url from 'node:url';
import * as child_process from 'node:child_process';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const Paths = Object.freeze({
  three_js: __dirname,
  parcel: path.join(__dirname, '..', '..', 'parcel'),
  ['fastest-possible']: path.join(__dirname, '..', '..', 'fastest-possible'),
})

const [,, target = 'parcel', copies = 250] = process.argv

if (!fs.existsSync(path.join(Paths.three_js, 'src'))) {
  child_process.execSync('tar -xzvf src.tar.gz', { cwd: Paths.three_js, stdio: 'inherit' })
}

fs.rmSync(path.join(Paths[target], 'entry'), { force: true, recursive: true })
fs.mkdirSync(path.join(Paths[target], 'entry'))

let entrySource = ''

process.stdout.write(`\n[copy] `)
for (let i = 1; i <= copies; i++) {
  process.stdout.write(`${i} `)
  fs.cpSync(path.join(Paths.three_js, 'src'), path.join(Paths[target], 'entry', `copy_${i}`), { recursive: true })
  
  // Parcel doesn't work with symlinked sources
  // fs.symlinkSync(path.join(Paths.three_js, 'vendor'), path.join(Paths[target], 'entry', `copy_${i}`))
}
process.stdout.write(`\n`)

for (let i = 1; i <= copies; i++) {
  entrySource += `import * as copy_${i} from './copy_${i}/Three.js';\n`
}

entrySource += `\n`

for (let i = 1; i <= copies; i++) {
  entrySource += `export { copy_${i} };\n`
}

entrySource += `\n`

for (let i = 1; i <= copies; i++) {
  entrySource += `window.copy_${i} = copy_${i};\n`
}


fs.writeFileSync(path.join(Paths[target], 'entry', 'entry.js'), entrySource, 'utf8')
