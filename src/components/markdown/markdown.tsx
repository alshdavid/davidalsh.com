import './markdown.scss'
import React, { useEffect, useState } from "react"
import { classNameSwitch } from "../../platform/class-name-switch"
import marked from 'marked'

export type MarkdownProps = JSX.IntrinsicElements['div'] & {
  content: string
}

export const Markdown = ({ className, content, ...props }: MarkdownProps) => {
  const [ markdown, setMarkdown ] = useState('')
  const [ ref, setRef ] = useState<HTMLDivElement | null>(null)
  
  useEffect(() => {
    if (!content) return
    setMarkdown(marked(content))
  }, [content])

  useEffect(() => {
    if (!ref || !markdown) return
    ;(window as any).Prism.highlightAllUnder(ref)
  }, [markdown, ref])

  return <div
    dangerouslySetInnerHTML={{ __html: markdown }}
    ref={setRef}
    className={classNameSwitch({
      'markdown-body': true,
      [className!]: className,
    })} 
    { ...props }
  />
}