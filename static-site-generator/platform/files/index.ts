// import * as fs from "node:fs";
import * as fsAsync from "node:fs/promises";
import * as path from "node:path";

export function JSONStringify(content: any, pretty: boolean = false) {
  if (!pretty) {
    return JSON.stringify(content)
  } else {
    return JSON.stringify(content, null, 2)
  }
}

export async function readFile(filepath: string): Promise<string> {
  return fsAsync.readFile(filepath, { encoding: 'utf-8' })
}

export async function readJson<T = any>(filepath: string): Promise<T> {
  return JSON.parse(await readFile(filepath))
}

export async function writeFile(filepath: string, text: any) {
  if (typeof text === 'object') {
    text = JSONStringify(text)
  }
  if (!await existsAsync(path.dirname(filepath))) {
    await fsAsync.mkdir(path.dirname(filepath), { recursive: true })
  }
  await fsAsync.writeFile(filepath, text, { encoding: 'utf-8' })
}

export async function rmDir(filepath: string) {
  return fsAsync.rm(filepath, { recursive: true })
}

export async function existsAsync(file: string) {
  try {
    await fsAsync.access(file, fsAsync.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}