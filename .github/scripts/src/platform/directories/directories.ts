import * as path from 'node:path'

const Root = path.resolve(__dirname, '..', '..', '..', '..', '..')
const Src = path.join(Root, 'src')

export const Directories = {
    Root,
    Src,
}
