// @alphaisyour/core — Entry point utama runtime noalphjs
// Re-export semua API publik yang dibutuhkan developer

export { compile } from '@alphaisyour/compiler'
export type { CompileOptions, CompileResult } from '@alphaisyour/compiler'

export { parse } from '@alphaisyour/parser'
export type { ParseResult } from '@alphaisyour/parser'

export { mount, unmount, createRenderer } from '@alphaisyour/renderer-dom'
export type { RendererOptions } from '@alphaisyour/renderer-dom'

export {
  isEnoFile,
  normalizePort,
  slugify,
  NOALPH_VERSION,
  ENO_EXTENSION,
  DEFAULT_PORT,
} from '@alphaisyour/shared'

export type {
  NoAlphConfig,
  NoAlphPlugin,
  EnoNode,
  EnoNodeType,
} from '@alphaisyour/shared'

// SEO
export { setHead } from './head.js'
export type { HeadOptions } from './head.js'
