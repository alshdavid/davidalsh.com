export class WcEmbedSvg extends HTMLElement {
  static observedAttributes = ["src"];

  constructor() {
    super();
  }

  static register() {
    customElements.define("wc-embed-svg", WcEmbedSvg);
    const styles = document.createElement('style')
    styles.innerHTML = /*css*/`
      wc-embed-svg svg {
        margin: 0 auto;
        display: block;
      }
    `
    document.head.appendChild(styles)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name !== 'src' || newValue === oldValue) {
      return
    }
    this.#embedSvg(newValue)
  }

  async #embedSvg(url: string) {
    this.innerHTML = ''
    const frame = document.createElement('iframe')
    frame.src = url
    frame.style.visibility = 'hidden'
    frame.style.height = '0px';
    frame.style.border = 'none';
    frame.style.display = 'block';
    frame.loading = this.getAttribute("loading") || undefined
    this.appendChild(frame)
    frame.onload = () => {
      this.appendChild(frame.contentDocument.children[0])
      this.removeChild(frame)
      for (const attribute of Array.from(this.attributes)) {
        if (attribute.name === "src" || attribute.name === "class") continue
        this.children[0].setAttribute(attribute.name, attribute.value)
      }
    }
  }
}
