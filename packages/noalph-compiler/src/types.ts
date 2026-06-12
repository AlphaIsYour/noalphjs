export interface CompileOptions {
  filename?: string
  sourceMap?: boolean
  hmr?: boolean
  ssr?: boolean
}

export interface CompileResult {
  code: string
  css?: string
  map?: string
  dependencies: string[]
  errors: CompileError[]
  warnings: CompileWarning[]
}

export interface CompileError {
  message: string
  line?: number
  column?: number
}

export interface CompileWarning {
  message: string
  line?: number
  column?: number
}
