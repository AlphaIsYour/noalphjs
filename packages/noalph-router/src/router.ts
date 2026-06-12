import type { Route, RouterOptions, RouterInstance } from './types.js'

export function createRouter(options: RouterOptions = {}): RouterInstance {
  const { mode = 'history', routes = [] } = options
  const listeners = new Set<(route: Route) => void>()

  function getCurrentPath(): string {
    if (mode === 'hash') {
      return window.location.hash.slice(1) || '/'
    }
    return window.location.pathname
  }

  function matchRoute(path: string): Route | null {
    for (const route of routes) {
      if (route.path === path) return { ...route }

      const paramNames: string[] = []
      const pattern = route.path
        .replace(/:[^/]+/g, (match) => {
          paramNames.push(match.slice(1))
          return '([^/]+)'
        })
        .replace(/\//g, '\\/')

      const regex = new RegExp(`^${pattern}$`)
      const match = path.match(regex)

      if (match) {
        const params: Record<string, string> = {}
        paramNames.forEach((name, i) => {
          params[name] = match[i + 1] ?? ''
        })
        return { ...route, params }
      }
    }
    return null
  }

  let currentPath = typeof window !== 'undefined' ? getCurrentPath() : '/'
  let currentRoute = matchRoute(currentPath)

  function notify() {
    if (currentRoute) {
      listeners.forEach(cb => cb(currentRoute!))
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      currentPath = getCurrentPath()
      currentRoute = matchRoute(currentPath)
      notify()
    })
  }

  return {
    get currentPath() { return currentPath },
    get currentRoute() { return currentRoute },

    navigate(path: string) {
      if (typeof window === 'undefined') return
      if (mode === 'hash') {
        window.location.hash = path
      } else {
        window.history.pushState(null, '', path)
      }
      currentPath = path
      currentRoute = matchRoute(path)
      notify()
    },

    back() {
      if (typeof window !== 'undefined') window.history.back()
    },

    forward() {
      if (typeof window !== 'undefined') window.history.forward()
    },

    on(_event: 'change', callback: (route: Route) => void) {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
  }
}
