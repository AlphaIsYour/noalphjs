import { createServer } from 'vite'
import path from 'path'
import { DEFAULT_PORT, DEFAULT_HOST } from '@noalph/shared'

export async function runDev(args: string[]) {
  const portArg = args.find(a => a.startsWith('--port='))
  const port = portArg ? parseInt(portArg.split('=')[1] ?? '', 10) : DEFAULT_PORT
  const openBrowser = args.includes('--open')

  const cwd = process.cwd()

  // Cari vite.config di proyek user
  let userConfig = {}
  try {
    const configPath = path.join(cwd, 'vite.config.ts')
    const mod = await import(configPath)
    userConfig = mod.default ?? {}
  } catch {
    // Tidak ada vite.config — gunakan default
  }

  const server = await createServer({
    root: cwd,
    server: {
      port,
      host: DEFAULT_HOST,
      open: openBrowser,
    },
    ...userConfig,
  })

  await server.listen()
  server.printUrls()

  process.on('SIGTERM', () => server.close())
  process.on('SIGINT', () => server.close())
}
