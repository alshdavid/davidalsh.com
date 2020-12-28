import './container.scss'
import React from "react"
import { classNameSwitch } from "../../platform/class-name-switch"

export type ContainerProps = JSX.IntrinsicElements['div'] & {
}

export const Container = ({ className, ...props }: ContainerProps) => <div
  className={classNameSwitch({
    'content-max-width': true,
    [className!]: className,
  })} 
  { ...props }
  />