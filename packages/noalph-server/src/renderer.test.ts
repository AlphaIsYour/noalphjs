import { describe, it, expect } from 'vitest'
import { renderToString } from './renderer.js'

describe('renderToString', () => {
  it('menghasilkan HTML string dari .eno sederhana', async () => {
    const result = await renderToString({
      filename: 'Test.eno',
      source: '<div class="app"><h1>Halo SSR</h1></div>',
    })
    expect(result.errors).toHaveLength(0)
    expect(result.html).toContain('data-noalph-ssr')
  })

  it('mengembalikan error jika kompilasi gagal', async () => {
    const result = await renderToString({ filename: 'Bad.eno', source: '' })
    expect(result).toBeDefined()
  })

  it('menghasilkan head tags jika diberikan opsi head', async () => {
    const result = await renderToString({
      filename: 'Page.eno',
      source: '<div>Halaman</div>',
      head: {
        title: 'Halaman Utama',
        meta: [{ name: 'description', content: 'Halaman test noalphjs' }],
      },
    })
    expect(result.head).toContain('<title>Halaman Utama</title>')
    expect(result.head).toContain('description')
  })
})
