import { renderToString } from './renderer.js'
import type { SSROptions } from './types.js'
import fs from 'fs'
import path from 'path'

export function createSSRHandler(options: { root?: string; template?: string }) {
  const root = options.root ?? process.cwd()

  return async function ssrHandler(
    enoFilePath: string,
    renderOptions: Partial<SSROptions> = {}
  ): Promise<string> {
    const fullPath = path.isAbsolute(enoFilePath) ? enoFilePath : path.join(root, enoFilePath)

    if (!fs.existsSync(fullPath)) {
      throw new Error(`[noalph/server] File tidak ditemukan: ${fullPath}`)
    }

    const source = fs.readFileSync(fullPath, 'utf-8')
    const result = await renderToString({ filename: fullPath, source, ...renderOptions })

    const template = options.template ?? defaultTemplate()

    return template
      .replace('<!--noalph-head-->', result.head)
      .replace('<!--noalph-css-->', result.css ? `<style>${result.css}</style>` : '')
      .replace('<!--noalph-html-->', result.html)
      .replace('<body>', `<body ${result.bodyAttrs}>`)
  }
}

function defaultTemplate(): string {
  return `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!--noalph-head-->
    <!--noalph-css-->
  </head>
  <body>
    <div id="app"><!--noalph-html--></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`
}
