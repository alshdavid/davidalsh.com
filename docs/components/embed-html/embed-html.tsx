import { Component, ReactNode } from "react"

export type EmbedHtmlProps = {
  src: string,
  loading?: 'lazy'
}

export default class EmbedHtml extends Component<EmbedHtmlProps, {}> {
  #hasLoaded = false

  onLoad(el: HTMLElement | null) {
    if (!el || this.#hasLoaded) {
      return
    }

    const frame = document.createElement('iframe')
    var dataUri = "data:text/plain;base64," + btoa(this.props.src);
    frame.setAttribute('src', dataUri)
    if (this.props.loading) frame.setAttribute('loading', this.props.loading)

    el.appendChild(frame)

    frame.onload = () => {
      const html = frame.contentDocument!.querySelector('html')!
      const body = frame.contentDocument!.querySelector('body')!
      body.style.margin = '0'
      frame.style.height = `${Math.ceil(html.getBoundingClientRect().height)}px`
    }

  }
  render(): ReactNode {
      return <div ref={el => this.onLoad(el)}></div>
  }
}