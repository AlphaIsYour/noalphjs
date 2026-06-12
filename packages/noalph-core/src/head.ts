export interface HeadOptions {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: 'summary' | 'summary_large_image'
  canonical?: string
  robots?: string
  lang?: string
  viewport?: string
  themeColor?: string
  extraMeta?: Array<Record<string, string>>
}

export function setHead(options: HeadOptions): void {
  if (typeof document === 'undefined') return

  const {
    title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl,
    twitterCard, canonical, robots, lang = 'id',
    viewport = 'width=device-width, initial-scale=1.0',
    themeColor, extraMeta = [],
  } = options

  if (title) document.title = title
  if (lang) document.documentElement.setAttribute('lang', lang)

  function setMeta(type: 'name' | 'property', key: string, value: string) {
    if (!value) return
    let el = document.querySelector<HTMLMetaElement>(`meta[${type}="${key}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(type, key)
      document.head.appendChild(el)
    }
    el.content = value
  }

  function setLink(rel: string, href: string) {
    let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
    if (!el) {
      el = document.createElement('link')
      el.rel = rel
      document.head.appendChild(el)
    }
    el.href = href
  }

  if (description) setMeta('name', 'description', description)
  if (keywords) setMeta('name', 'keywords', keywords)
  if (robots) setMeta('name', 'robots', robots)
  if (viewport) setMeta('name', 'viewport', viewport)
  if (themeColor) setMeta('name', 'theme-color', themeColor)

  if (ogTitle ?? title) setMeta('property', 'og:title', ogTitle ?? title ?? '')
  if (ogDescription ?? description) setMeta('property', 'og:description', ogDescription ?? description ?? '')
  if (ogImage) setMeta('property', 'og:image', ogImage)
  if (ogUrl) setMeta('property', 'og:url', ogUrl)
  setMeta('property', 'og:type', 'website')

  if (twitterCard) setMeta('name', 'twitter:card', twitterCard)
  if (ogTitle ?? title) setMeta('name', 'twitter:title', ogTitle ?? title ?? '')
  if (ogDescription ?? description) setMeta('name', 'twitter:description', ogDescription ?? description ?? '')
  if (ogImage) setMeta('name', 'twitter:image', ogImage)

  if (canonical) setLink('canonical', canonical)

  for (const m of extraMeta) {
    const type = 'name' in m ? 'name' : 'property'
    const key = m[type] ?? ''
    const value = m['content'] ?? ''
    if (key && value) setMeta(type as 'name' | 'property', key, value)
  }
}
