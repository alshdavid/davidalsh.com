import { IGithub } from '../github'

export class Articles {
  private _articles: ArticleMeta[] | undefined
  private _articleMap = new Map<string, string>()

  constructor(
    private _gitHub: IGithub
  ) {}

  public async getList(): Promise<ArticleMeta[]> {
    if (!this._articles) {
      const response = await this._gitHub.getFileContent('alshdavid', 'articles', 'meta.json')
      const result = await response.json<ArticleMetaResponse>()
      this._articles = result.articles
    }
    return this._articles
  }

  public async getOne(articleName: string): Promise<string | undefined> {
    if (!this._articleMap.has(articleName)) {
      const response = await this._gitHub.getFileContent('alshdavid', 'articles', `${articleName}/readme.md`)
      const result = await response.text()
      this._articleMap.set(articleName, result)
    }
    return this._articleMap.get(articleName)
  }
}

export type ArticleMetaResponse = {
  articles: ArticleMeta[]
}

export type ArticleMeta = {
  folder: string
  title: string
  description: string
  publishDate: string
}