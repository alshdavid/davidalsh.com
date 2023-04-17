export function prettyDate(input: string) {
  const [year, month, day] = input.split('-')
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${day} ${months[parseInt(month, 10) - 1]} ${year}`
}
