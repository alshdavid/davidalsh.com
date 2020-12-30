import './index.scss'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Unsubscribable } from 'rxjs'
import { GlobalProvider } from 'global-context'
import { If } from './components'
import * as Pages from './pages'
import * as Partials from './partials'
import { State } from './state'

const state = new State()

if (window.location.pathname === '/') {
  state.navigation.push('/home')
}

class App extends Component {
  subscription!: Unsubscribable
  state = {
    pathname: window.location.pathname
  }

  componentDidMount() {
    this.subscription = state.navigation.onEvent.subscribe(() => {
      this.setState({ pathname: window.location.pathname })
    })
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    return <GlobalProvider value={state}>
      <Partials.Navbar />
      <If condition={this.state.pathname === '/home'}><Pages.HomePage/></If>
      <If condition={this.state.pathname === '/articles'}><Pages.ArticlesPage/></If>
      <If condition={this.state.pathname.startsWith('/articles/')}><Pages.ArticlePage/></If>
    </GlobalProvider>
  }
}

ReactDOM.render(<App />, state.outlet)

;(async () => {
  state.articles.getList()
})()