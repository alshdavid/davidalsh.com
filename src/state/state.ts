import { Articles } from "../platform/articles"
import { Github } from "../platform/github"
import { ReactiveHistory } from "../platform/navigation"

export class State {
  public _window = window
  public outlet = document.querySelector('#app')!
  public navigation = new ReactiveHistory(this._window)
  public github = new Github(this._window)
  public articles = new Articles(this.github)
}