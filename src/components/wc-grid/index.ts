export class WcGrid extends HTMLElement {
  static observedAttributes = ["ratio"];

  constructor() {
    super();
  }

  static register() {
    customElements.define("wc-grid", WcGrid);
  }

  #getRatio(): undefined | string[] {
    return this.getAttribute('ratio')?.split(',').map(i => i.trim())
  }

  connectedCallback() {
    const ratio = this.#getRatio();
    for (const [i, child] of (Array.from(this.children)as Array<HTMLDivElement>).entries()) {
      if (ratio) {
        child.style.width = ratio[i]
      } else {
        child.style.width = `calc(100% / ${this.children.length})`
      }
      child.style.flex = 'auto'
    }
    this.style.visibility = 'visible'
  }

}

declare module 'preact' {
  namespace JSX {
    interface IntrinsicElements {
      'wc-grid': WcGridHtmlAttributes;
    }
  }
}

interface WcGridHtmlAttributes extends preact.JSX.HTMLAttributes<HTMLElement> {
}