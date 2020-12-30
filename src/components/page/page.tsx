import './page.scss'
import React, { useMemo } from "react"
import { useGlobalContext } from "global-context";
import { State } from '../../state';
import { Container } from "../container/container";

export type PageProps = {
  pageTitle: string
  className: string
  children: any
}

export const Page = ({ pageTitle, children, className }: PageProps) => {
  const { outlet, _window } = useGlobalContext<State>()

  useMemo(() => outlet.classList.value = `component-page-outlet ${className}`, [className])
  useMemo(() => _window.document.title = pageTitle, [pageTitle])
  
  return <Container className="component-page">
    {children}
  </Container>
}