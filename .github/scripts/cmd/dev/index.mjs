import * as childProcess from 'node:child_process'
import * as path from 'node:path'
import * as fsAsync from 'node:fs/promises'
import * as Paths from '../../platform/paths.mjs'

export async function main() {
  const packageJson = await JSON.parse(await fsAsync.readFile(path.join(Paths.root, 'package.json'), { encoding: 'utf-8' }))

  childProcess.execSync(
    `npx nodemon --watch "./website/**/*" --signal SIGTERM --ext "*" --exec "${packageJson.scripts.build}"`,
    {
      cwd: Paths.root,
      stdio: 'inherit',
      env: {
        ...process.env,
        TARGETS: process.env.TARGETS || 'dev'
      }
    }
  )
}

main()