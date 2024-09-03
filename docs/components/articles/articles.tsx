import { usePageData } from 'rspress/runtime';

export default () => {
  let pageData = usePageData()
  console.log(pageData.siteData.pages.filter(p => p.routePath.startsWith('/articles/')))

  return <div>{
    pageData.siteData.pages
      .filter(p => p.routePath.startsWith('/articles/'))
      .map(p => <div key={p.routePath}><a href={p.routePath}>{p.title}</a></div>)}
    </div>
}