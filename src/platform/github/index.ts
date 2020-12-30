export const BASE_URL = (accountName: string, repo: string, filePath: string): string => `https://raw.githubusercontent.com/${accountName}/${repo}/master/${filePath}`

export class Github implements IGithub {
  constructor(
    private _window: Window,
  ) {}

  public async getFileContent(accountName: string, repo: string, filePath: string): Promise<GithubResponse> {
    return this._window.fetch(BASE_URL(accountName, repo, filePath))
  }
}

export interface GithubResponse {
  text(): Promise<string>, 
  json<T>(): Promise<T>,
}

export interface IGithub {
  getFileContent(accountName: string, repo: string, filePath: string): Promise<GithubResponse>
}