import { describe, it, expect } from 'vitest'
import { parse } from './parser.js'

describe('parse', () => {
  it('mem-parse elemen sederhana', () => {
    const result = parse('<div>Halo</div>')
    expect(result.errors).toHaveLength(0)
    expect(result.ast.type).toBe('root')
    expect(result.ast.children).toBeDefined()
    expect(result.ast.children!.length).toBeGreaterThan(0)
  })

  it('mem-parse ekspresi { variabel }', () => {
    const result = parse('<p>{nama}</p>')
    expect(result.errors).toHaveLength(0)
    const p = result.ast.children?.find(n => n.type === 'element')
    expect(p).toBeDefined()
  })

  it('mem-parse script block', () => {
    const result = parse('<script>\nlet x = 1\n</script>\n<div>{x}</div>')
    const script = result.ast.children?.find(n => n.type === 'script')
    expect(script).toBeDefined()
    expect(String(script!.value)).toContain('let x = 1')
  })

  it('mem-parse style block', () => {
    const result = parse('<style>\n.app { color: red; }\n</style>\n<div/>')
    const style = result.ast.children?.find(n => n.type === 'style')
    expect(style).toBeDefined()
    expect(String(style!.value)).toContain('.app')
  })

  it('mem-parse komentar HTML', () => {
    const result = parse('<!-- ini komentar --><div/>')
    const comment = result.ast.children?.find(n => n.type === 'comment')
    expect(comment).toBeDefined()
  })

  it('mengembalikan AST dengan root yang valid untuk input kosong', () => {
    const result = parse('')
    expect(result.ast.type).toBe('root')
    expect(result.errors).toHaveLength(0)
  })
})
