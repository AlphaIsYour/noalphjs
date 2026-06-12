import { mount } from '@alphaisyour/renderer-dom'
import App from './App.eno'

const container = document.getElementById('app')

if (!container) {
  console.error('[noalphjs] Elemen #app tidak ditemukan di index.html')
} else {
  mount({ container, component: App })
  if (typeof (window as any).__noalph_ready === 'function') {
    ;(window as any).__noalph_ready()
  }
}
