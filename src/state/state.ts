import { ReactiveHistory } from "../platform/navigation"

export class State {
  public outlet = document.querySelector('#app')!
  public navigation = new ReactiveHistory(window)
}