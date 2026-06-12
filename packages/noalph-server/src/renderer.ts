import { compile } from '@alphaisyour/compiler'
import type { SSROptions, SSRResult } from './types.js'

export async function renderToString(options: SSROptions): Promise<SSRResult> {
  const { filename, source, props = {}, head = {} } = options
  const compiled = compile(source, { filename, ssr: true })

  if (compiled.errors.length > 0) {
    return {
      html: `<div data-noalph-error>${compiled.errors.map(e => e.message).join('<br>')}</div>`,
      css: '',
      head: '',
      bodyAttrs: '',
      errors: compiled.errors.map(e => e.message),
    }
  }

  const htmlOutput = simulateRender(compiled.code, props)
  const headTags = buildHeadTags(head)

  return {
    html: htmlOutput,
    css: compiled.css ?? '',
    head: headTags,
    bodyAttrs: 'data-noalph-ssr="true"',
    errors: [],
  }
}

export async function renderToStream(options: SSROptions): Promise<SSRResult> {
  return renderToString(options)
}

function simulateRender(code: string, _props: Record<string, unknown>): string {
  const componentMatch = code.match(/export function create(\w+)\(/)
  const componentName = componentMatch?.[1] ?? 'App'
  const divMatches = [...code.matchAll(/document\.createElement\(["'](\w+)["']\)/g)]
  const tags = divMatches.map(m => m[1]).filter(Boolean)

  if (tags.length === 0) {
    return `<div data-noalph-component="${componentName.toLowerCase()}" data-noalph-ssr="true"></div>`
  }

  const rootTag = tags[0] ?? 'div'
  return `<${rootTag} data-noalph-component="${componentName.toLowerCase()}" data-noalph-ssr="true" data-noalph-hydrate="true"></${rootTag}>`
}

function buildHeadTags(head: SSROptions['head']): string {
  if (!head) return ''
  const parts: string[] = []
  if (head.title) parts.push(`<title>${escapeHtml(head.title)}</title>`)
  for (const meta of head.meta ?? []) {
    const attrs = Object.entries(meta).map(([k, v]) => `${k}="${escapeHtml(v)}"`).join(' ')
    parts.push(`<meta ${attrs} />`)
  }
  for (const link of head.links ?? []) {
    const attrs = Object.entries(link).map(([k, v]) => `${k}="${escapeHtml(v)}"`).join(' ')
    parts.push(`<link ${attrs} />`)
  }
  return parts.join('\n')
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
