import "./article.scss"
import React, { useMemo, useState } from "react"
import { useGlobalContext } from "global-context"
import { State } from "../../state"
import { Page, Markdown, Comments, If } from "../../components"
import { BASE_URL } from "../../platform/github"

export const ArticlePage = () => {
  const { articles } = useGlobalContext<State>()
  const [markdown, setMarkdown] = useState<string | undefined>(undefined)

  useMemo(async () => {
    const articleName = window.location.pathname.split("/")[2]
    const md = await articles.getOne(articleName)
    const baseUrl = BASE_URL('alshdavid', 'articles', articleName)
    const parsed = md!.replaceAll("assets/", `${baseUrl}/assets/`).replaceAll('(#', `(${window.location.pathname}#`)
    setMarkdown(parsed)
  }, [window])

  return (
    <Page 
    pageTitle="Articles" 
    className="page-articles">
      <If condition={markdown !== undefined}>
        <Markdown content={markdown!} />
        <Comments />
      </If>
    </Page>
  )
}
