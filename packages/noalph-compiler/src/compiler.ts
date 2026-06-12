import { parse } from '@alphaisyour/parser'
import type { EnoNode } from '@alphaisyour/shared'
import type { CompileOptions, CompileResult } from './types'

export function compile(source: string, options: CompileOptions = {}): CompileResult {
  const { filename = 'anonymous.eno', hmr = false } = options
  const { ast, errors: parseErrors, warnings: parseWarnings } = parse(source)

  if (parseErrors.length > 0) {
    return {
      code: '',
      dependencies: [],
      errors: parseErrors.map(e => ({ message: e.message, line: e.line, column: e.column })),
      warnings: [],
    }
  }

  // Ekstrak script dan style dari AST
  const scriptNode = ast.children?.find(n => n.type === 'script')
  const styleNode = ast.children?.find(n => n.type === 'style')
  const templateNodes = ast.children?.filter(n => n.type !== 'script' && n.type !== 'style') ?? []

  const scriptCode = scriptNode ? String(scriptNode.value ?? '') : ''
  const cssCode = styleNode ? String(styleNode.value ?? '') : ''

  // Generate render function dari template nodes
  const renderBody = generateRender(templateNodes)

  // Script parsing untuk reactive state (baseline: extract let/const declarations)
  const stateVars = extractStateVars(scriptCode)
  const stateSetup = stateVars.length > 0
    ? stateVars.map(v => `  let ${v.name} = ${v.init};`).join('\n')
    : ''

  const componentName = filename.replace(/\.eno$/, '').split('/').pop() ?? 'App'
  const safeComponentName = componentName.charAt(0).toUpperCase() + componentName.slice(1)

  const hmrCode = hmr ? `
// HMR Support
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      const el = document.querySelector('[data-noalph-root]')
      if (el) {
        el.innerHTML = ''
        newModule.mount(el)
      }
    }
  })
}` : ''

  const code = `// [noalphjs] compiled from: ${filename}
// DO NOT EDIT — file ini di-generate otomatis

${scriptCode.replace(/^let |^const |^var /gm, '').trim() ? '' : ''}
export function create${safeComponentName}(props = {}) {
${stateSetup}
${scriptCode
  .replace(/export\s+default[^;{]*/g, '')
  .replace(/import[^;]+;?/g, '')
  .trim()}

  function render() {
    const el = document.createElement('div')
    el.setAttribute('data-noalph-component', '${safeComponentName.toLowerCase()}')
    ${renderBody}
    return el
  }

  return { render, props }
}

export function mount(container) {
  const instance = create${safeComponentName}()
  const el = instance.render()
  container.setAttribute('data-noalph-root', '')
  container.appendChild(el)
  return instance
}

export default create${safeComponentName}
${hmrCode}
`

  return {
    code,
    css: cssCode || undefined,
    dependencies: [],
    errors: [],
    warnings: parseWarnings.map(w => ({ message: w.message, line: w.line, column: w.column })),
  }
}

function generateRender(nodes: EnoNode[]): string {
  if (nodes.length === 0) return "el.innerHTML = ''"

  const lines: string[] = []
  nodes.forEach((node, i) => {
    lines.push(...generateNode(node, `child${i}`, 'el'))
  })
  return lines.join('\n    ')
}

function generateNode(node: EnoNode, varName: string, parentVar: string): string[] {
  const lines: string[] = []

  if (node.type === 'text') {
    const text = String(node.value ?? '').trim()
    if (text) {
      lines.push(`const ${varName} = document.createTextNode(${JSON.stringify(text)})`)
      lines.push(`${parentVar}.appendChild(${varName})`)
    }
    return lines
  }

  if (node.type === 'expression') {
    const expr = String(node.value ?? '').trim()
    lines.push(`const ${varName} = document.createTextNode(String(${expr} ?? ''))`)
    lines.push(`${parentVar}.appendChild(${varName})`)
    return lines
  }

  if (node.type === 'element') {
    const attrs = node.attributes as Record<string, unknown>
    const tag = String(attrs['tag'] ?? 'div')
    lines.push(`const ${varName} = document.createElement(${JSON.stringify(tag)})`)

    // Set attributes
    Object.entries(attrs).forEach(([key, val]) => {
      if (key === 'tag' || key === 'selfClose') return
      if (key === 'class') {
        lines.push(`${varName}.className = ${JSON.stringify(String(val))}`)
      } else if (key.startsWith('@')) {
        const event = key.slice(1)
        lines.push(`${varName}.addEventListener(${JSON.stringify(event)}, ${String(val)})`)
      } else if (key.startsWith(':')) {
        const attr = key.slice(1)
        lines.push(`${varName}.setAttribute(${JSON.stringify(attr)}, String(${String(val)}))`)
      } else if (val !== true) {
        lines.push(`${varName}.setAttribute(${JSON.stringify(key)}, ${JSON.stringify(String(val))})`)
      } else {
        lines.push(`${varName}.setAttribute(${JSON.stringify(key)}, '')`)
      }
    })

    // Render children
    node.children?.forEach((child, i) => {
      lines.push(...generateNode(child, `${varName}c${i}`, varName))
    })

    lines.push(`${parentVar}.appendChild(${varName})`)
    return lines
  }

  return lines
}

function extractStateVars(script: string): Array<{ name: string; init: string }> {
  const vars: Array<{ name: string; init: string }> = []
  const regex = /(?:let|const|var)\s+(\w+)\s*=\s*([^;\n]+)/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(script)) !== null) {
    const name = match[1]
    const init = match[2]
    if (name && init) vars.push({ name, init: init.trim() })
  }
  return vars
}
