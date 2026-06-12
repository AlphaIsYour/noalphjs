import { build } from 'vite'
import path from 'path'

export async function runBuild(_args: string[]) {
  const cwd = process.cwd()

  let userConfig = {}
  try {
    const configPath = path.join(cwd, 'vite.config.ts')
    const mod = await import(configPath)
    userConfig = mod.default ?? {}
  } catch {
    // Gunakan default
  }

  await build({
    root: cwd,
    ...userConfig,
  })

  console.log('\n✓ Build selesai — output ada di dist/')
}
