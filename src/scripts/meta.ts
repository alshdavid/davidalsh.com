export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type SiteMeta = Record<string, SiteMetaWebsite | SiteMetaArticle>;

export type WithSlug<T> = { slug: string } & T
export type WithDates<T> = { 
  published_time: Date
  modified_time: Date 
} & T

export type SiteMetaWebsite = {
  type: "website";
  hash:string
}

export type SiteMetaArticle = {
  type: "article";
  title: string
  published_time: string;
  published_time_pretty: string;
  modified_time: string
  modified_time_pretty: string
  author: string
  section: string
  tag: string[]
  description: string
  image: string
  image_alt: string
  hash:string
}

let cached: SiteMeta | undefined;

export async function fetchSiteMeta(): Promise<SiteMeta> {
  if (!cached) {
    cached = await fetch("/index.json").then((r) => r.json());
  }
  return cached;
}

export async function fetchArticles(): Promise<Array<WithSlug<WithDates<SiteMetaArticle>>>> {
  const meta = await fetchSiteMeta();
  const output = []

  for (const [slug, item] of Object.entries(meta)) {
    if (item.type !== "article") continue
    output.push({
      slug,
      ...item,
      published_time: new Date(item.published_time)
    })
  }

  output.sort((a, b) => b.published_time - a.published_time)
  return output
}
