export interface SSROptions {
  filename: string
  source: string
  props?: Record<string, unknown>
  head?: {
    title?: string
    meta?: Array<Record<string, string>>
    links?: Array<Record<string, string>>
  }
}

export interface SSRResult {
  html: string
  css: string
  head: string
  bodyAttrs: string
  errors: string[]
}
