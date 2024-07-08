import { Yaml } from "../yaml.js"

export class CacheControl {
  #settings: Promise<{
    defaultCacheControl: string
    rules: Array<{ regex: string, cacheControl: string }>
  }>

  constructor(segments: string[]) {
    this.#settings = Yaml.parseFile(...segments)
  }

  async getCacheControl(pathname: string): Promise<string> {
    const settings = await this.#settings
    for (const test of settings.rules) {
      if (pathname.match(new RegExp(test.regex))) {
        return test.cacheControl
      }
    }
    return settings.defaultCacheControl
  }
}
