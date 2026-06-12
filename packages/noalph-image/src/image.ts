import type { ImageProps } from './types.js'

export function NoAlphImage(props: ImageProps): HTMLElement {
  const {
    src, alt, width, height, lazy = true, priority = false,
    quality = 80, placeholder = 'empty', className = '', style = '', sizes,
  } = props

  const wrapper = document.createElement('div')
  wrapper.className = `noalph-image-wrapper${className ? ` ${className}` : ''}`
  wrapper.style.cssText = [
    'position: relative', 'display: inline-block', 'overflow: hidden',
    width ? `width: ${width}px` : '', height ? `height: ${height}px` : '', style,
  ].filter(Boolean).join('; ')

  const img = document.createElement('img')
  img.alt = alt
  img.decoding = 'async'

  if (priority) {
    img.fetchPriority = 'high'
    img.loading = 'eager'
  } else if (lazy) {
    img.loading = 'lazy'
  }

  if (width) img.width = width
  if (height) img.height = height
  if (sizes) img.sizes = sizes

  if (placeholder === 'blur' && !priority) {
    img.style.filter = 'blur(20px)'
    img.style.transition = 'filter 0.3s ease'
    img.onload = () => { img.style.filter = '' }
  }

  const optimizedSrc = optimizeSrc(src, { width, quality })
  img.src = optimizedSrc

  if (width) {
    const srcset = generateSrcSet(src, width, quality)
    if (srcset) img.srcset = srcset
  }

  wrapper.appendChild(img)
  return wrapper
}

export function createImage(container: HTMLElement, props: ImageProps): void {
  const el = NoAlphImage(props)
  container.appendChild(el)
}

function optimizeSrc(src: string, opts: { width?: number; quality?: number }): string {
  if (src.startsWith('/') || src.startsWith('./')) return src
  try {
    const url = new URL(src)
    if (opts.width) url.searchParams.set('w', String(opts.width))
    if (opts.quality) url.searchParams.set('q', String(opts.quality))
    return url.toString()
  } catch { return src }
}

function generateSrcSet(src: string, width: number, quality = 80): string {
  if (!src.startsWith('http')) return ''
  const widths = [width * 0.5, width, width * 1.5, width * 2]
    .filter(w => w > 0 && w <= 2400).map(w => Math.round(w))
  try {
    return widths.map(w => {
      const url = new URL(src)
      url.searchParams.set('w', String(w))
      url.searchParams.set('q', String(quality))
      return `${url.toString()} ${w}w`
    }).join(', ')
  } catch { return '' }
}
