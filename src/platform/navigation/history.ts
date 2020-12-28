import { normalise } from './url'
import { Subject, Subscribable } from 'rxjs'

export enum HistoryType {
  Push,
  Back,
  Forward,
  Replace,
}

export interface HistoryEvent {
  type: HistoryType
  from: string
  to: string
}

export class ReactiveHistory {
  public entries: string[] = []
  public events: HistoryEvent[] = []
  public onEvent: Subscribable<HistoryEvent>
  private _onEvent = new Subject<HistoryEvent>()

  onPop = () => {
    const path = this._window.location.pathname
    if (path === this.lastRoute) {
      const event = { type: HistoryType.Back, from: this.currentRoute, to: this.lastRoute }
      this.entries.pop()
      this.events.push(event)
      this._onEvent.next(event)
    } else {
      const event = { type: HistoryType.Forward, from: this.currentRoute, to: path }
      this.entries.push(path)
      this.events.push(event)
      this._onEvent.next(event)
    }
  }

  public get lastEvent() {
    return this.events[this.events.length - 2]
  }

  public get currentEvent() {
    return this.events[this.events.length - 1]
  }

  public get lastRoute() {
    return this.entries[this.entries.length - 2]
  }

  public get currentRoute() {
    return this.entries[this.entries.length - 1]
  }

  constructor(
    private _window: Window,
  ) {
    this.onEvent = this._onEvent.asObservable()
    this.entries.push(this._window.location.pathname)
    this._window.addEventListener('popstate', this.onPop)
  }

  public destroy() {
    this._window.removeEventListener('popstate', this.onPop)
  }

  public push(path: string) {
    path = normalise(path, false)
    this._window.history.pushState(null, this._window.document.title, path)
    const event = { type: HistoryType.Push, from: this.currentRoute, to: path }
    this.entries.push(path)
    this.events.push(event)
    this._onEvent.next(event)
  }

  public pop() {
    this._window.history.back()
  }

  public replace(path: string) {
    path = normalise(path, false)
    this._window.history.replaceState(null, this._window.document.title, path)
    this.entries[this.entries.length - 1] = path
    this._onEvent.next({ type: HistoryType.Replace, from: this.currentRoute, to: path })
  }
}