export interface Route {
  path: string
  component: unknown
  params?: Record<string, string>
  meta?: Record<string, unknown>
}

export interface RouterOptions {
  mode?: 'hash' | 'history'
  base?: string
  routes?: Route[]
}

export interface RouterInstance {
  currentPath: string
  currentRoute: Route | null
  navigate(path: string): void
  back(): void
  forward(): void
  on(event: 'change', callback: (route: Route) => void): () => void
}
