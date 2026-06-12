import type { RendererOptions } from './types'

export function mount(options: RendererOptions): () => void {
  const { container, component, props = {} } = options
  const comp = component as { render?: (props: unknown) => Node; mount?: (container: HTMLElement) => void }

  if (typeof comp?.mount === 'function') {
    comp.mount(container)
  } else if (typeof comp?.render === 'function') {
    const el = comp.render(props)
    container.appendChild(el)
  }

  return () => unmount(container)
}

export function unmount(container: HTMLElement): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
}
