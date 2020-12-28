import './markdown.scss'
import React from "react"
import { classNameSwitch } from "../../platform/class-name-switch"
import marked from 'marked'

export type MarkdownProps = JSX.IntrinsicElements['div'] & {
  content: string
}

export const Markdown = ({ className, content, ...props }: MarkdownProps) => {
  if (!content) {
    return null
  }
  console.log(marked(content))
  return <div
    dangerouslySetInnerHTML={{ __html: marked(content) }}
    className={classNameSwitch({
      'markdown-body': true,
      [className!]: className,
    })} 
    { ...props }
  />
}