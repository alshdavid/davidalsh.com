import { DirectoryMap, TargetType } from "../../../../platform/crawl-dir";

export const LinkSymbol = "*"

export async function linkAssets(
  sourceFiles: DirectoryMap,
  outFiles: Map<string, string>,
): Promise<void> {
  for (const [sourceFilePath, fileEntry] of sourceFiles.entries()) {
    if (
      !sourceFilePath.endsWith('/assets') ||
      fileEntry.targetType !== TargetType.FOLDER
    ) {
      continue
    }
    outFiles.set(fileEntry.relativePath, LinkSymbol)
  }
}
