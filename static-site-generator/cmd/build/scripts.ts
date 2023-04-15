import * as webpack from 'webpack'
import { createFsFromVolume, Volume } from 'memfs'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { DirectoryMap } from "../../platform/crawl-dir";

const ENTRY = 'index.ts'

export async function renderScripts(
  sourceFiles: DirectoryMap,
  outFiles: Map<string, string>,
): Promise<boolean> {
  const sourceEntry = sourceFiles.getRelative(ENTRY)

  if (!sourceEntry) {
    return true
  }

  const options: webpack.Configuration = {
    mode: 'production',
    entry: sourceEntry.absolutePath,
    output: {
      path: '/scripts',
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader'
        },
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
  }

  const compiler = webpack.webpack(options)
  
  const virtualFs = createFsFromVolume(new Volume())

  compiler.inputFileSystem = fs
  compiler.outputFileSystem = virtualFs

  const stat = await new Promise<webpack.Stats>((resolve, reject) => 
    compiler.run((err, stats) => err ? reject(err) : stats ? resolve(stats) : reject())
  )

  if (!virtualFs.existsSync('/scripts')) {
    throw new Error(stat.toString())
  }
  const outputFiles = virtualFs.readdirSync('/scripts')

  for (const basename of outputFiles) {
    const absolutePath = path.join('scripts', basename.toString())
    const contents = virtualFs.readFileSync(path.join(path.sep, absolutePath), { encoding: 'utf-8' }).toString()
    outFiles.set(absolutePath, contents)
  }

  return true
}