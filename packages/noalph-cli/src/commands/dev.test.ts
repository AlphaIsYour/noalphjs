import { describe, it, expect } from 'vitest'

describe('noalph CLI commands', () => {
  it('modul dev bisa diimport tanpa crash', async () => {
    // Test bahwa modul dapat di-import (tidak throw saat import)
    const mod = await import('./dev')
    expect(typeof mod.runDev).toBe('function')
  })

  it('modul build bisa diimport tanpa crash', async () => {
    const mod = await import('./build')
    expect(typeof mod.runBuild).toBe('function')
  })

  it('modul preview bisa diimport tanpa crash', async () => {
    const mod = await import('./preview')
    expect(typeof mod.runPreview).toBe('function')
  })
})
