import './comments.css'
import { Component, ReactNode } from 'react'

export default class Comments extends Component {
  #isSet = false;

  init(parent: HTMLElement | null) {
    if (!parent || this.#isSet) return
    this.#isSet = true
    const script = document.createElement('script')
    script.setAttribute('src', 'https://giscus.app/client.js')
    script.setAttribute('data-repo', 'alshdavid/davidalsh-com')
    script.setAttribute('data-repo-id', 'MDEwOlJlcG9zaXRvcnk2ODQ0NzA1NA==')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', 'DIC_kwDOBBRrTs4Cgmfx')
    script.setAttribute('data-mapping', 'title')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '1')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'dark_dimmed')
    script.setAttribute('data-lang', 'en')
    script.setAttribute('data-loading', 'lazy')
    script.setAttribute('async', 'true')
    parent.appendChild(script)
  }

  render(): ReactNode {
    return <div className="alsh-comments" ref={el => this.init(el)}></div>
  }
}
