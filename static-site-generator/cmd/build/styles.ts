import { DirectoryMap } from "../../platform/crawl-dir";
import * as hash from "../../platform/hash";
import * as sass from "sass"

const ENTRY = 'index.scss'

export type RenderStylesOptions = {
  contentHash?: boolean
}

export async function renderStyles(
  sourceFiles: DirectoryMap,
  outFiles: Map<string, string>,
  options: RenderStylesOptions,
): Promise<boolean> {
  const sourceEntry = sourceFiles.getRelative(ENTRY)

  if (!sourceEntry) {
    return false
  }

  const result = await sass.compileAsync(sourceEntry.absolutePath)
  const content = result.css.toString()

  let filename = 'styles.css'

  if (options.contentHash) {
    const hex = hash.sha1(content, 20)
    filename = `${hex}.css`
  }

  outFiles.set(filename, content)
  return true
}
