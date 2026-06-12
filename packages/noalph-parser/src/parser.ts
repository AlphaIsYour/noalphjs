import type { EnoNode } from '@alphaisyour/shared'
import { tokenize } from './tokenizer'
import type { ParseResult } from './types'

export function parse(source: string): ParseResult {
  const tokens = tokenize(source)
  const errors: ParseResult['errors'] = []
  const warnings: ParseResult['warnings'] = []

  const root: EnoNode = {
    type: 'root',
    start: 0,
    end: source.length,
    children: [],
  }

  // Simple recursive-descent parser — Phase 1 baseline
  let cursor = 0

  function parseChildren(): EnoNode[] {
    const children: EnoNode[] = []
    while (cursor < tokens.length && tokens[cursor]?.type !== 'EOF') {
      const token = tokens[cursor]
      if (!token) break

      if (token.type === 'TagClose') break

      if (token.type === 'Text') {
        const trimmed = token.value.trim()
        if (trimmed.length > 0) {
          children.push({ type: 'text', start: token.start, end: token.end, value: token.value })
        }
        cursor++
        continue
      }

      if (token.type === 'ExpressionStart') {
        cursor++ // skip {
        const expr = tokens[cursor]
        const exprEnd = tokens[cursor + 1]
        if (expr && exprEnd?.type === 'ExpressionEnd') {
          children.push({ type: 'expression', start: token.start, end: exprEnd.end, value: expr.value.trim() })
          cursor += 2
        }
        continue
      }

      if (token.type === 'ScriptBlock') {
        const scriptContent = token.value.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim()
        children.push({ type: 'script', start: token.start, end: token.end, value: scriptContent })
        cursor++
        continue
      }

      if (token.type === 'StyleBlock') {
        const styleContent = token.value.replace(/<style[^>]*>/, '').replace(/<\/style>/, '').trim()
        children.push({ type: 'style', start: token.start, end: token.end, value: styleContent })
        cursor++
        continue
      }

      if (token.type === 'Comment') {
        children.push({ type: 'comment', start: token.start, end: token.end, value: token.value })
        cursor++
        continue
      }

      if (token.type === 'TagOpen') {
        const tagMatch = token.value.match(/^<([a-zA-Z][a-zA-Z0-9.-]*)/)
        const tagName = tagMatch?.[1] ?? 'div'
        const attrs = parseAttributes(token.value)
        cursor++
        const nodeChildren = parseChildren()
        if (tokens[cursor]?.type === 'TagClose') cursor++
        children.push({
          type: 'element',
          start: token.start,
          end: tokens[cursor - 1]?.end ?? token.end,
          attributes: { tag: tagName, ...attrs },
          children: nodeChildren,
        })
        continue
      }

      if (token.type === 'TagSelfClose') {
        const tagMatch = token.value.match(/^<([a-zA-Z][a-zA-Z0-9.-]*)/)
        const tagName = tagMatch?.[1] ?? 'div'
        const attrs = parseAttributes(token.value)
        children.push({
          type: 'element',
          start: token.start,
          end: token.end,
          attributes: { tag: tagName, ...attrs, selfClose: true },
          children: [],
        })
        cursor++
        continue
      }

      cursor++
    }
    return children
  }

  function parseAttributes(tagString: string): Record<string, unknown> {
    const attrs: Record<string, unknown> = {}
    const attrRegex = /([a-zA-Z:@][a-zA-Z0-9:.-]*)(?:="([^"]*)")?/g
    let match: RegExpExecArray | null
    const cleanTag = tagString.replace(/^<[a-zA-Z][a-zA-Z0-9.-]*/, '').replace(/\/?>$/, '')
    while ((match = attrRegex.exec(cleanTag)) !== null) {
      const key = match[1]
      if (key) attrs[key] = match[2] ?? true
    }
    return attrs
  }

  root.children = parseChildren()

  if (errors.length > 0) {
    warnings.push({ message: `${errors.length} error ditemukan saat parsing`, line: 0, column: 0 })
  }

  return { ast: root, errors, warnings }
}
