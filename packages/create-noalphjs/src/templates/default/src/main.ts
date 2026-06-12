import { mount } from '@alphaisyour/renderer-dom'
import App from './App.eno'

const container = document.getElementById('app')

if (!container) {
  throw new Error('[noalphjs] Elemen #app tidak ditemukan di index.html')
}

mount({ container, component: App })
