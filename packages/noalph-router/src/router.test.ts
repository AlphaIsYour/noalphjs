import { describe, it, expect } from 'vitest'
import { createRouter } from './router.js'

describe('createRouter', () => {
  it('membuat router instance', () => {
    const router = createRouter({ mode: 'history', routes: [{ path: '/', component: {} }] })
    expect(router).toBeDefined()
    expect(typeof router.navigate).toBe('function')
  })

  it('match route exact', () => {
    const routes = [
      { path: '/', component: {} },
      { path: '/about', component: {} },
    ]
    const router = createRouter({ routes })
    expect(router.currentRoute).toBeDefined()
  })
})
