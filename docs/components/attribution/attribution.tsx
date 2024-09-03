export type AttributionProps = {
  author: string,
  time: string
}

export default function({ author, time }: AttributionProps) {
  return <div>
    <div>{author}</div>
    <div>{time}</div>
  </div>
}