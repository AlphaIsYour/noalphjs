export function RouterLink(props: { href: string; children?: string }) {
  if (typeof document === 'undefined') return null

  const el = document.createElement('a')
  el.href = props.href
  el.textContent = props.children ?? ''

  el.addEventListener('click', (e) => {
    e.preventDefault()
    window.history.pushState(null, '', props.href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  })

  return el
}
