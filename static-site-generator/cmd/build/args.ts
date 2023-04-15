import * as path from 'node:path'
import * as yargs from 'yargs'

export type ArgKeys = typeof ArgKeys[keyof typeof ArgKeys];
export const ArgKeys = {
  ProjectRoot: 'project-root',
  OutDir: 'out-dir',
}

export class Args {
  readonly projectRoot: string
  readonly outDir: string

  constructor(args: string[]) {
    const argv = this.#getArgs(args)

    const projectRoot = argv.get(ArgKeys.ProjectRoot)
    if (!projectRoot) {
      throw new Error('Missing Project Root')
    }

    if (path.isAbsolute(projectRoot)) {
      this.projectRoot = projectRoot
    } else {
      this.projectRoot = path.resolve(process.cwd(), projectRoot)
    }

    const outDir = argv.get(ArgKeys.OutDir)
    if (!outDir) {
      throw new Error('Missing Out Directory')
    }

    if (path.isAbsolute(outDir)) {
      this.outDir = outDir
    } else {
      this.outDir = path.resolve(process.cwd(), outDir)
    }
  }

  #getArgs(args: string[]): Map<string, string> {
    const m = new Map<string, string>()
    for (const [k, v] of Object.entries((yargs(args).argv as Record<string, string>))) {
      m.set(k, v)
    }
    return m
  }
}
