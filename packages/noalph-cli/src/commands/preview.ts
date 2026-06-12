import { preview } from 'vite'
import path from 'path'
import { DEFAULT_PORT } from '@noalph/shared'

export async function runPreview(args: string[]) {
  const portArg = args.find(a => a.startsWith('--port='))
  const port = portArg ? parseInt(portArg.split('=')[1] ?? '', 10) : DEFAULT_PORT + 1

  const cwd = process.cwd()
  const server = await preview({
    root: cwd,
    preview: { port, open: true },
  })

  server.printUrls()
}
