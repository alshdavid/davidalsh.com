export type BuildElementOptions = { 
  tagName: string
  attributes: Record<string, string|number|boolean|undefined>
  closing?: 'default' | 'self' | 'void'
  children?: (string | BuildElementOptions | undefined)[]
  innerHTML?: string
}

export function buildElement({ tagName, attributes, closing = 'default', children, innerHTML }: BuildElementOptions) {
  let tag = `<${tagName}`
  for (const [name, value] of Object.entries(attributes)) {
    if (value === undefined) continue
    tag += ` ${name}="${value}"`
  }
  if (closing === 'default') {
    tag += `>`
    if (innerHTML) {
      tag += innerHTML
    }
    if (children) {
      for (const child of children) {
        if (typeof child === 'undefined') {
          continue
        } else if (typeof child === 'string') {
          tag += child
        } else {
          tag += buildElement(child)
        }
      }
    }
    tag += `</${tagName}>`
  } else if (closing === 'self') {
    tag += `/>`
  } else {
    tag += `>`
  }
  return tag.trim()
}
