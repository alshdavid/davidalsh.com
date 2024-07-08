export class WcEmbedHtml extends HTMLElement {
  static observedAttributes = ["src"];

  constructor() {
    super();
  }

  static register() {
    customElements.define("wc-embed-html", WcEmbedHtml);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== 'src' || newValue === oldValue) {
      return
    }
    this.#embed(newValue)
  }

  async #embed(url: string) {
    this.innerHTML = ''
    const frame = document.createElement('iframe')
    
    for (const attribute of Array.from(this.attributes)) {
      if (attribute.name === "src" || attribute.name === "class") continue
      frame.setAttribute(attribute.name, attribute.value)
    }

    frame.src = url
    frame.loading = this.getAttribute("loading") || undefined

    this.appendChild(frame)

    frame.onload = () => {
      const html = frame.contentDocument.querySelector('html')
      const body = frame.contentDocument.querySelector('body')
      body.style.margin = '0'

      frame.style.height = `${Math.ceil(html.getBoundingClientRect().height)}px`
    }
  }
}

declare module 'preact' {
  namespace JSX {
      interface IntrinsicElements {
          'wc-embed-html': WcEmbedHtmlAttributes;
      }
  }
}

interface WcEmbedHtmlAttributes extends preact.JSX.HTMLAttributes<HTMLElement> {
  src?: string;
}