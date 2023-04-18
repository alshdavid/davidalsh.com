import * as path from 'node:path'
import * as ejs from 'ejs'

export class TemplateContext extends Map<string, any> {
  filepath: string
  dirname: string
  rootpath: string

  constructor(
    filepath: string,
    rootpath: string,
  ) {
    super()
    this.filepath = filepath
    this.dirname = path.dirname(filepath)
    this.rootpath = rootpath
  }

  set(key: string, value: any): this {
    Reflect.set(this, key, value)
    super.set(key, value)    
    return this
  }

  async include(filepath: string): Promise<string> {
    let absolutePath = filepath
    
    if (filepath.startsWith('~/')) {
      absolutePath = `${this.rootpath}/${filepath.slice(2)}`
    }
    
    if (!path.isAbsolute(absolutePath)) {
      absolutePath = path.join(this.dirname, absolutePath)
    }

    return await this.renderFile(absolutePath)
  }

  resolvePath(target: string): string {
    let absolutePath = target
    if (!path.isAbsolute(absolutePath)) {
      absolutePath = path.join(this.dirname, target)
    }
    const ext = path.extname(target);
    if (!ext) {
      return absolutePath + '.ejs'
    }
    return absolutePath;
  }

  async renderFile(filepath: string): Promise<string> {
    return await ejs.renderFile(this.resolvePath(filepath), this, {
      async: true,
      cache: false,
    })
  }
}
