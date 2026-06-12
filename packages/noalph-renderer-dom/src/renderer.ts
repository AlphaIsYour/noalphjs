export function createRenderer() {
  return {
    createElement(tag: string) {
      return document.createElement(tag)
    },
    createText(text: string) {
      return document.createTextNode(text)
    },
    insert(parent: Node, child: Node) {
      parent.appendChild(child)
    },
    remove(child: Node) {
      child.parentNode?.removeChild(child)
    },
    patchProp(el: Element, key: string, value: unknown) {
      if (key === 'class') {
        el.className = String(value ?? '')
      } else if (key.startsWith('on')) {
        const event = key.slice(2).toLowerCase()
        el.addEventListener(event, value as EventListener)
      } else {
        el.setAttribute(key, String(value ?? ''))
      }
    },
  }
}
