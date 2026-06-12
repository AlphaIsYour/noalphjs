import type { EnoNode } from '@alphaisyour/shared'

export interface ParseResult {
  ast: EnoNode
  errors: ParseError[]
  warnings: ParseWarning[]
}

export interface ParseError {
  message: string
  line: number
  column: number
  source?: string
}

export interface ParseWarning {
  message: string
  line: number
  column: number
}

export type TokenType =
  | 'TagOpen'
  | 'TagClose'
  | 'TagSelfClose'
  | 'Attribute'
  | 'Text'
  | 'ExpressionStart'
  | 'ExpressionEnd'
  | 'DirectiveStart'
  | 'ScriptBlock'
  | 'StyleBlock'
  | 'Comment'
  | 'EOF'

export interface Token {
  type: TokenType
  value: string
  start: number
  end: number
  line: number
  column: number
}
