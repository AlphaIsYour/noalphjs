// @noalph/core — Entry point utama runtime noalphjs
// Re-export semua API publik yang dibutuhkan developer

export { compile } from '@noalph/compiler'
export type { CompileOptions, CompileResult } from '@noalph/compiler'

export { parse } from '@noalph/parser'
export type { ParseResult } from '@noalph/parser'

export { mount, unmount, createRenderer } from '@noalph/renderer-dom'
export type { RendererOptions } from '@noalph/renderer-dom'

export {
  isEnoFile,
  normalizePort,
  slugify,
  NOALPH_VERSION,
  ENO_EXTENSION,
  DEFAULT_PORT,
} from '@noalph/shared'

export type {
  NoAlphConfig,
  NoAlphPlugin,
  EnoNode,
  EnoNodeType,
} from '@noalph/shared'
