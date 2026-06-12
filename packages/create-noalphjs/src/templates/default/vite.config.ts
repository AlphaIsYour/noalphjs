import { defineConfig } from 'vite'
import { noalph } from '@noalph/vite-plugin'

export default defineConfig({
  plugins: [
    noalph({
      hmr: true,
    }),
  ],
  server: {
    port: 3000,
    open: true,
  },
})
