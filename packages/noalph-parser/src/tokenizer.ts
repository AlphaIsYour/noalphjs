import type { Token, TokenType } from './types.js'

export function tokenize(source: string): Token[] {
  const tokens: Token[] = []
  let pos = 0
  let line = 1
  let column = 1

  const advance = (count = 1) => {
    for (let i = 0; i < count; i++) {
      if (source[pos] === '\n') { line++; column = 1 } else { column++ }
      pos++
    }
  }

  const peek = (offset = 0) => source[pos + offset] ?? ''
  const remaining = () => source.slice(pos)

  while (pos < source.length) {
    const startPos = pos
    const startLine = line
    const startColumn = column

    const addToken = (type: TokenType, value: string) => {
      tokens.push({ type, value, start: startPos, end: pos, line: startLine, column: startColumn })
    }

    // Script block: <script>...</script>
    if (remaining().startsWith('<script>') || remaining().startsWith('<script ')) {
      const end = source.indexOf('</script>', pos)
      if (end === -1) { advance(remaining().length); break }
      const value = source.slice(pos, end + 9)
      advance(value.length)
      addToken('ScriptBlock', value)
      continue
    }

    // Style block: <style>...</style>
    if (remaining().startsWith('<style>') || remaining().startsWith('<style ')) {
      const end = source.indexOf('</style>', pos)
      if (end === -1) { advance(remaining().length); break }
      const value = source.slice(pos, end + 8)
      advance(value.length)
      addToken('StyleBlock', value)
      continue
    }

    // Comment: <!-- ... -->
    if (remaining().startsWith('<!--')) {
      const end = source.indexOf('-->', pos + 4)
      const value = end === -1 ? remaining() : source.slice(pos, end + 3)
      advance(value.length)
      addToken('Comment', value)
      continue
    }

    // Expression: { ... }
    if (peek() === '{') {
      advance()
      addToken('ExpressionStart', '{')
      const end = source.indexOf('}', pos)
      if (end !== -1) {
        const expr = source.slice(pos, end)
        advance(expr.length)
        addToken('Text', expr)
        advance()
        addToken('ExpressionEnd', '}')
      }
      continue
    }

    // Tags
    if (peek() === '<') {
      if (peek(1) === '/') {
        // Closing tag
        const end = source.indexOf('>', pos)
        const value = end === -1 ? remaining() : source.slice(pos, end + 1)
        advance(value.length)
        addToken('TagClose', value)
        continue
      }
      const end = source.indexOf('>', pos)
      const value = end === -1 ? remaining() : source.slice(pos, end + 1)
      advance(value.length)
      addToken(value.endsWith('/>') ? 'TagSelfClose' : 'TagOpen', value)
      continue
    }

    // Text
    const nextTag = source.indexOf('<', pos)
    const nextExpr = source.indexOf('{', pos)
    let textEnd = source.length
    if (nextTag !== -1 && nextTag < textEnd) textEnd = nextTag
    if (nextExpr !== -1 && nextExpr < textEnd) textEnd = nextExpr
    const text = source.slice(pos, textEnd)
    if (text.length > 0) {
      advance(text.length)
      addToken('Text', text)
    } else {
      advance()
    }
  }

  tokens.push({ type: 'EOF', value: '', start: pos, end: pos, line, column })
  return tokens
}
