// Tipe dasar ekosistem noalphjs

export type NoAlphVersion = string

export interface NoAlphConfig {
  root?: string
  srcDir?: string
  outDir?: string
  port?: number
  host?: string
  plugins?: NoAlphPlugin[]
}

export interface NoAlphPlugin {
  name: string
  version?: string
  setup?: (ctx: NoAlphPluginContext) => void | Promise<void>
}

export interface NoAlphPluginContext {
  config: NoAlphConfig
}

export interface EnoNode {
  type: EnoNodeType
  start: number
  end: number
  children?: EnoNode[]
  attributes?: Record<string, unknown>
  value?: unknown
}

export type EnoNodeType =
  | 'root'
  | 'component'
  | 'element'
  | 'text'
  | 'expression'
  | 'directive'
  | 'comment'
  | 'script'
  | 'style'
