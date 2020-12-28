export const classNameSwitch = (options: Record<string, any>): string => {
  let className = ''
  for (const [key, value] of Object.entries(options)) {
    if (value) className += ` ${key}`
  }
  return className.trim()
}