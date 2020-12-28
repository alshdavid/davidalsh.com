import './home.scss'
import React, { useMemo, Fragment } from "react"
import { useGlobalSelector } from 'global-context'
import { State } from '../../state'

export const HomePage = () => {
    const outlet = useGlobalSelector<State, Element>(ctx => ctx.outlet)
    useMemo(() => outlet.classList.value = 'page-home', [outlet])
    return <Fragment>Home Page</Fragment>
}
