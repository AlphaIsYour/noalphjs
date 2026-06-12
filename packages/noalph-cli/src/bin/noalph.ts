#!/usr/bin/env node

import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  // Lazy import untuk mengurangi startup time
  switch (command) {
    case 'dev': {
      const { runDev } = await import('../commands/dev.js')
      await runDev(args.slice(1))
      break
    }
    case 'build': {
      const { runBuild } = await import('../commands/build.js')
      await runBuild(args.slice(1))
      break
    }
    case 'preview': {
      const { runPreview } = await import('../commands/preview.js')
      await runPreview(args.slice(1))
      break
    }
    case '--version':
    case '-v': {
      const { NOALPH_VERSION } = await import('@noalph/shared')
      console.log(`noalphjs v${NOALPH_VERSION}`)
      break
    }
    case '--help':
    case '-h':
    case undefined:
    default: {
      printHelp()
      break
    }
  }
}

function printHelp() {
  console.log(`
  noalphjs CLI

  Usage: noalph <command> [options]

  Commands:
    dev       Jalankan development server dengan HMR
    build     Build proyek untuk production
    preview   Preview hasil build production
    --version Tampilkan versi noalphjs

  Options:
    --port    Port dev server (default: 3000)
    --host    Host dev server (default: localhost)
    --open    Buka browser otomatis
  `)
}

main().catch((e) => {
  console.error('[noalph]', e.message)
  process.exit(1)
})
