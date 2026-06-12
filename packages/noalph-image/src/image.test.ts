import { describe, it, expect } from 'vitest'
import { NoAlphImage } from './image.js'

describe('NoAlphImage', () => {
  it('membuat elemen gambar dengan alt yang benar', () => {
    const el = NoAlphImage({ src: '/test.png', alt: 'Test image' })
    const img = el.querySelector('img')
    expect(img?.alt).toBe('Test image')
  })

  it('set lazy loading secara default', () => {
    const el = NoAlphImage({ src: '/test.png', alt: 'Test' })
    const img = el.querySelector('img')
    expect(img?.loading).toBe('lazy')
  })

  it('set eager loading jika priority: true', () => {
    const el = NoAlphImage({ src: '/test.png', alt: 'Test', priority: true })
    const img = el.querySelector('img')
    expect(img?.loading).toBe('eager')
  })
})
