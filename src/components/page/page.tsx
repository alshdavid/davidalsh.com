import React, { Fragment, useMemo } from "react"
import { useGlobalContext } from "global-context";
import { State } from '../../state';

export type PageProps = {
  pageTitle: string
  className: string
  children: any
}

export const Page = ({ pageTitle, children, className }: PageProps) => {
  const { outlet, _window } = useGlobalContext<State>()

  useMemo(() => outlet.classList.value = className, [className])
  useMemo(() => _window.document.title = pageTitle, [pageTitle])
  
  return <Fragment>
    {children}
  </Fragment>
}