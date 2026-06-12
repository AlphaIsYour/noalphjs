import { describe, it, expect } from 'vitest'
import { compile } from './compiler.js'

describe('compile', () => {
  it('menghasilkan JavaScript dari .eno sederhana', () => {
    const source = '<div class="app"><h1>Halo</h1></div>'
    const result = compile(source, { filename: 'Test.eno' })
    expect(result.errors).toHaveLength(0)
    expect(result.code).toContain('createTest')
    expect(result.code).toContain('mount')
    expect(result.code).toContain('document.createElement')
  })

  it('mengekstrak CSS dari block <style>', () => {
    const source = '<div/><style>.app { color: red; }</style>'
    const result = compile(source)
    expect(result.css).toBeDefined()
    expect(result.css).toContain('.app')
  })

  it('mengekstrak script dari block <script>', () => {
    const source = '<script>\nlet count = 0\n</script>\n<div>{count}</div>'
    const result = compile(source, { filename: 'Counter.eno' })
    expect(result.errors).toHaveLength(0)
    expect(result.code).toContain('createCounter')
  })

  it('menghasilkan kode HMR jika opsi hmr: true', () => {
    const source = '<div>App</div>'
    const result = compile(source, { filename: 'App.eno', hmr: true })
    expect(result.code).toContain('import.meta.hot')
  })

  it('tidak menghasilkan kode HMR jika opsi hmr: false', () => {
    const source = '<div>App</div>'
    const result = compile(source, { filename: 'App.eno', hmr: false })
    expect(result.code).not.toContain('import.meta.hot')
  })

  it('mengembalikan error jika parse gagal — bukan crash', () => {
    // compile harus tetap return result meski ada edge case
    const result = compile('', { filename: 'Empty.eno' })
    expect(result).toBeDefined()
    expect(Array.isArray(result.errors)).toBe(true)
  })
})
