import * as path from 'node:path'
import * as ejs from 'ejs'
import { resolvePath } from './path-resolver.mjs'

function isObject(val) {
  if (val === null) { return false;}
  return ( (typeof val === 'function') || (typeof val === 'object') );
}

export class TemplateContext extends Map {
  paths
  pathsAbsolute

  constructor(
    filePath,
    rootPath,
    map = new Map()
  ) {
    super(map)

    this.paths = Object.freeze({ 
      file: filePath, 
      dir: this.#dirname(filePath), 
    })

    this.pathsAbsolute = Object.freeze({ 
      file: path.join(rootPath, filePath), 
      dir: this.#dirname(path.join(rootPath, filePath)),
      root: rootPath 
    })
  }

  set(key, value) {
    Reflect.set(this, key, value)
    super.set(key, value)    
    return this
  }

  async include(filepath, extend = {}) {
    const filePathAbs = this.addExt(resolvePath(this.pathsAbsolute.root, this.paths.dir, filepath))
    const filePathRel = filePathAbs.replace(this.pathsAbsolute.root, '')

    const ctx = new TemplateContext(
      filePathRel,
      this.pathsAbsolute.root,
      this,
    )

    if (!isObject(extend)) throw new Error('extend must be an object')
    for (const [k, v] of Object.entries(extend)) ctx.set(k, v)

    return await ejs.renderFile(filePathAbs, ctx, {
      async: true,
      cache: false,
    })
  }

  addExt(target) {
    const ext = path.extname(target);
    if (!ext) {
      return target + '.ejs'
    }
    return target;
  }

  #dirname(targetPath) {
    targetPath = path.dirname(targetPath)
    if (!targetPath.endsWith(path.sep)) {
      return targetPath + path.sep
    }
    return targetPath
  }
}