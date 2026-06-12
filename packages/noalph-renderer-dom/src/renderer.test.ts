import { describe, it, expect } from 'vitest'
import { createRenderer } from './renderer.js'

describe('createRenderer', () => {
  it('membuat elemen DOM', () => {
    const renderer = createRenderer()
    const el = renderer.createElement('div')
    expect(el.tagName.toLowerCase()).toBe('div')
  })

  it('membuat text node', () => {
    const renderer = createRenderer()
    const text = renderer.createText('Halo')
    expect(text.textContent).toBe('Halo')
  })

  it('menyisipkan child ke parent', () => {
    const renderer = createRenderer()
    const parent = renderer.createElement('div')
    const child = renderer.createElement('span')
    renderer.insert(parent, child)
    expect(parent.children).toHaveLength(1)
  })

  it('menghapus child dari parent', () => {
    const renderer = createRenderer()
    const parent = renderer.createElement('div')
    const child = renderer.createElement('span')
    renderer.insert(parent, child)
    renderer.remove(child)
    expect(parent.children).toHaveLength(0)
  })

  it('set class via patchProp', () => {
    const renderer = createRenderer()
    const el = renderer.createElement('div')
    renderer.patchProp(el, 'class', 'container')
    expect(el.className).toBe('container')
  })

  it('set attribute biasa via patchProp', () => {
    const renderer = createRenderer()
    const el = renderer.createElement('button')
    renderer.patchProp(el, 'type', 'button')
    expect(el.getAttribute('type')).toBe('button')
  })
})
