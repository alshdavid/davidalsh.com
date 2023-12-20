
While it would be great if a specifier could only ever be a relative or absolute unix path, Node.js needed to enable the ability to consume external dependencies without copying their sources into the current project. For this reason, Node.js allows for specifier paths that let us target files in the `node_modules` directory.

Further, Node.js was created before JavaScript had the `import` syntax. For Node.js applications to support modules they created their own importing syntax used with `require("specifier")`. 

After `import` was introduced into the JavaScript specification, Node.js had the issue where the vast majority of Node.js libraries were using `require()`, however they needed to migrate to `import`. 

Node.js granted library authors the ability to ship both formats and allow Node.js to determine which format to resolve at runtime.

This is expressed as [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) declared in `package.json#exports`:

```json
{
    "name": "my-package-name",
    "exports": {
        ".": {
            "module": "./dist/module/index.mjs",
            "require": "./dist/require/index.mjs",
            "source": "./src/index.ts"
        }
    }
}
```

This means that the consumer can use the same import specifier but have a different resolved file depending on the environment Node.js in run within.

```javascript
// Could possibly resolve to:
//   "./dist/module/index.mjs"
//   "./dist/require/index.mjs"
//   "./src/index.ts"
import "my-package-name"
```

All this is to say that this complicates in the context of a bundler. this necessitates that the resolver mimic the dynamic resolution behavior of Node.js when identifying the targets of imports on demand within the transformation pipeline - where different outcomes could occur depending on the environment that the bundler is running in.



```typescript
import * as fs from 'node:fs'
import { resolve } from '@parcel/node-resolver-core'
import { transform } from '@parcel/transformer-js'

async function main() {
    let todo = new EventTarget()
    let promises: Array<Promise<void>> = []

    let assets = new Map<string, string>()
    let asset_graph = new Map<string, string>()

    todo.addEventListener('task', (event) => {
        // Do the work async
        promises.push(new Promise(res => setTimeout(() => {
            const { from_path, specifier } = event.data

            let absolute_path = resolve(from_path, specifier)

            if (assets.contains(absolute_path)) {
                return
            }
        })))
    })

    await Promise.all(promises)

}
```