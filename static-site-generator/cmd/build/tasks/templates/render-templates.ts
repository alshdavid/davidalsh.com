import * as ejs from 'ejs'
import { DirectoryMap } from "../../../../platform/crawl-dir";
import { Yaml } from "../../../../platform/yaml";
import { Markdown } from "../../../../platform/markdown";
import { Args } from '../../args';
import { TemplateContext } from './template-context';
import { slugify } from '../../../../platform/slugify';

export async function renderTemplates(
  args: Args,
  sourceFiles: DirectoryMap,
  outFiles: Map<string, string>,
): Promise<boolean> {
  for (const [sourceFilePath, fileEntry] of sourceFiles.entries()) {
    if (sourceFilePath.includes('_')) continue  
    if (
      !sourceFilePath.endsWith('index.ejs') &&
      !sourceFilePath.endsWith('index.html')
    ) continue

    const ctx = new TemplateContext(sourceFilePath, args.projectRoot)

    ctx.set('OutFiles', outFiles)
    ctx.set('slug', slugify(fileEntry.relativeDir))
    ctx.set('scripts', '/scripts/main.js')
    ctx.set('styles', '/styles/styles.css')
    ctx.set('Yaml', Yaml)
    ctx.set('Markdown', Markdown)

    const result = await ejs.renderFile(sourceFilePath, ctx, {
      async: true,
      cache: false,
    })
    
    let outFile = fileEntry.relativePath
    if (outFile.endsWith('.ejs')) {
      outFile = outFile.replace('.ejs', '.html')
    }

    outFiles.set(outFile, result)
  }

  return true
}
