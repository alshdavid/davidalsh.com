import './articles.scss'
import React, { useEffect, useState } from "react"
import { useGlobalContext } from "global-context"
import { For, Link, Page } from '../../components'
import { State } from '../../state'
import { ArticleMeta } from '../../platform/articles'

export const ArticlesPage = () => {
  const { articles } = useGlobalContext<State>()
  const [articleList, setArticlesList] = useState<ArticleMeta[]>([])
  
  useEffect(() => {
    articles.getList().then(setArticlesList)
  }, [articles])

  return <Page 
    pageTitle="Articles" 
    className="page-articles">
    <For items={articleList}>{item => (
      <Link 
        key={item.folder}  
        className="article-link" 
        href={`/articles/${item.folder}`}>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <i>Read More &gt;</i>
      </Link>
    )}</For>
  </Page>
}
