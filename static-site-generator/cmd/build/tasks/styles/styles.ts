import * as sass from "sass"
import { DirectoryMap } from "../../../../platform/crawl-dir";
import * as hash from "../../../../platform/hash";

const ENTRY = 'index.scss'

export type RenderStylesOptions = {
  contentHash?: boolean
}

export async function renderStyles(
  sourceFiles: DirectoryMap,
  outFiles: Map<string, string>,
  options: RenderStylesOptions,
): Promise<void> {
  const sourceEntry = sourceFiles.getRelative(ENTRY)

  if (!sourceEntry) {
    return
  }

  const result = await sass.compileAsync(sourceEntry.absolutePath)
  const content = result.css.toString()

  let filename = 'styles/styles.css'

  if (options.contentHash) {
    const hex = hash.sha1(content, 20)
    filename = `styles/styles.${hex}.css`
  }

  outFiles.set(filename, content)
}
