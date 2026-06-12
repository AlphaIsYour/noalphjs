import { compile } from '@alphaisyour/compiler'
import { isEnoFile, NOALPH_VERSION } from '@alphaisyour/shared'
import type { Plugin, ResolvedConfig } from 'vite'
import fs from 'fs'
import path from 'path'

export interface NoAlphViteOptions {
  hmr?: boolean
  ssr?: boolean
}

function ensureNoAlphDir(root: string) {
  const noalphDir = path.join(root, '.noalph')
  const cacheDir = path.join(noalphDir, 'cache')
  const typesDir = path.join(noalphDir, 'types')

  fs.mkdirSync(cacheDir, { recursive: true })
  fs.mkdirSync(typesDir, { recursive: true })

  // manifest.json — metadata build
  const manifestPath = path.join(noalphDir, 'manifest.json')
  const manifest = {
    version: NOALPH_VERSION,
    framework: 'noalphjs',
    buildTime: new Date().toISOString(),
    components: [] as string[],
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

  // README di dalam .noalph agar tidak membingungkan
  fs.writeFileSync(
    path.join(noalphDir, 'README.md'),
    `# .noalph/\n\nFolder ini di-generate otomatis oleh noalphjs.\nJangan edit manual. Tambahkan ke .gitignore.\n`
  )

  return { noalphDir, cacheDir, typesDir, manifestPath, manifest }
}

export function noalph(options: NoAlphViteOptions = {}): Plugin {
  const { hmr = true } = options
  let resolvedConfig: ResolvedConfig
  const compiledComponents: string[] = []

  return {
    name: 'vite-plugin-noalph',
    enforce: 'pre',

    configResolved(config) {
      resolvedConfig = config
    },

    buildStart() {
      const root = resolvedConfig?.root ?? process.cwd()
      ensureNoAlphDir(root)
    },

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

      // Catat komponen yang dikompilasi di .noalph/manifest.json
      const root = resolvedConfig?.root ?? process.cwd()
      const relPath = path.relative(root, id)
      if (!compiledComponents.includes(relPath)) {
        compiledComponents.push(relPath)
        try {
          const manifestPath = path.join(root, '.noalph', 'manifest.json')
          if (fs.existsSync(manifestPath)) {
            const m = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
            m.components = compiledComponents
            m.buildTime = new Date().toISOString()
            fs.writeFileSync(manifestPath, JSON.stringify(m, null, 2))
          }
        } catch { /* silent */ }
      }

      let finalCode = result.code

      if (result.css) {
        const escapedCss = JSON.stringify(result.css)
        finalCode += `
// [noalphjs] inject scoped style
if (typeof document !== 'undefined') {
  const __noalph_id = ${JSON.stringify(id.replace(/\\/g, '/'))}
  if (!document.querySelector(\`[data-noalph-id="\${__noalph_id}"]\`)) {
    const __noalph_style = document.createElement('style')
    __noalph_style.setAttribute('data-noalph-id', __noalph_id)
    __noalph_style.textContent = ${escapedCss}
    document.head.appendChild(__noalph_style)
  }
}
`
      }

      return { code: finalCode, map: result.map }
    },

    handleHotUpdate({ file, server }) {
      if (!isEnoFile(file)) return
      server.ws.send({ type: 'full-reload', path: file })
      return []
    },
  }
}

export default noalph
