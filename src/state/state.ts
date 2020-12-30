import { ReactiveHistory } from "../platform/navigation"

export class State {
  public _window = window
  public outlet = document.querySelector('#app')!
  public navigation = new ReactiveHistory(this._window)
}