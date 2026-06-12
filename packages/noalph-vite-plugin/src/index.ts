import { compile } from '@alphaisyour/compiler'
import { isEnoFile } from '@alphaisyour/shared'
import type { Plugin } from 'vite'

export interface NoAlphViteOptions {
  hmr?: boolean
  ssr?: boolean
}

export function noalph(options: NoAlphViteOptions = {}): Plugin {
  const { hmr = true } = options

  return {
    name: 'vite-plugin-noalph',
    enforce: 'pre',

    transform(code: string, id: string) {
      if (!isEnoFile(id)) return null

      const result = compile(code, {
        filename: id,
        hmr,
        sourceMap: true,
      })

      if (result.errors.length > 0) {
        const errorMessages = result.errors.map(e => e.message).join('\n')
        this.error(`[noalphjs] Error kompilasi ${id}:\n${errorMessages}`)
        return null
      }

      let finalCode = result.code

      if (result.css) {
        // Inject CSS via style tag saat development
        const escapedCss = JSON.stringify(result.css)
        finalCode += `
// [noalphjs] inject style
if (typeof document !== 'undefined') {
  const __noalph_style = document.createElement('style')
  __noalph_style.setAttribute('data-noalph-id', ${JSON.stringify(id)})
  __noalph_style.textContent = ${escapedCss}
  document.head.appendChild(__noalph_style)
}
`
      }

      return { code: finalCode, map: result.map }
    },

    handleHotUpdate({ file, server }) {
      if (!isEnoFile(file)) return

      server.ws.send({
        type: 'full-reload',
        path: file,
      })

      return []
    },
  }
}

export default noalph
