import "./article.scss"
import React, { useMemo, Fragment, useState } from "react"
import { useGlobalSelector } from "global-context"
import { State } from "../../state"
import { Container, Markdown, Comments } from "../../components"

export const ArticlePage = () => {
  const outlet = useGlobalSelector<State, Element>((ctx) => ctx.outlet)
  const [markdown, setMarkdown] = useState<string | undefined>(undefined)

  useMemo(() => (outlet.classList.value = "page-article"), [outlet])
  useMemo(async () => {
    const path = window.location.pathname.split("/")[2]
    const baseUrl = `https://raw.githubusercontent.com/alshdavid/articles/master/${path}`
    const res = await fetch(`${baseUrl}/readme.md`)
    const md = await res.text()
    const parsed = md.replaceAll("assets/", `${baseUrl}/assets/`).replaceAll('(#', `(${window.location.pathname}#`)
    setMarkdown(parsed)
  }, [window])

  if (markdown === undefined) {
    return null
  }

  return (
    <Fragment>
      <Container>
        <Markdown content={markdown} />
        <Comments />
      </Container>
    </Fragment>
  )
}
