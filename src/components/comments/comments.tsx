import './comments.scss'
import React, { useEffect } from "react"
import { classNameSwitch } from "../../platform/class-name-switch"

export type CommentProps = JSX.IntrinsicElements['div'] & {
}

export const Comments = ({ className, ...props }: CommentProps) => {
  useEffect(() => {
    // @ts-ignore
    const dispose = commentBox('5675312390078464-proj');
    return () => dispose()
  }, [window])

  return <div className={classNameSwitch({
      'commentbox': true,
      [className!]: className,
    })} 
    { ...props }
  />
}