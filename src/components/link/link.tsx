import React from "react"
import './link.scss'
import { useGlobalContext } from 'global-context'
import { State } from "../../state"

export type LinkProps = JSX.IntrinsicElements['a'] & {
}

export const Link = ({ className, href, ...props }: LinkProps) => {
  const { navigation } = useGlobalContext<State>()

  function onClick(e: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault()
    if (href) navigation.push(href)
  }

  return <a
    className={`component-link ${className ? className : ''}`}
    onClick={onClick}
    href={href}
    {...props}
  />
}