import './article-hero.css'

export type ArticleHeroProps = {
  src: string
  alt?: string
  subtitle?: string
}

export default ({ src, alt, subtitle }: ArticleHeroProps) => {
  return <div className='alsh-article-hero'>
    <img src={src} alt={alt || "hero image"}/>
    { subtitle && <i>{subtitle}</i> }
  </div>
}