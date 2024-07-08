export async function runSvgReplace() {
  const tags = document.querySelectorAll('[svg-replace]')
  for (const tag of Array.from(tags)) {
    if (('complete' in tag) && !tag.complete) {
      
      await new Promise<void>(res => {
        const cb = () => (res(), tag.removeEventListener('load', cb))
        tag.addEventListener('load', cb)
      })
    }
    const url = tag.getAttribute('src')
    const inner = await fetch(url, {cache: 'force-cache'}).then(r => r.text())
    const template = document.createElement('template')
    template.innerHTML = inner
    for (const attribute of Array.from(tag.attributes)) {
      if (attribute.name === "svg-replace") continue
      template.content.children[0].setAttribute(attribute.name, attribute.value)
    }
    tag.parentElement.replaceChild(template.content, tag)
  }
}