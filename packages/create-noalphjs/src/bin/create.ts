#!/usr/bin/env node

import { createRequire } from 'module'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Lazy-load dengan fallback
async function loadColorAndPrompts() {
  try {
    const pc = (await import('picocolors')).default
    const prompts = (await import('prompts')).default
    return { pc, prompts }
  } catch {
    return { pc: { green: (s: string) => s, bold: (s: string) => s, cyan: (s: string) => s, yellow: (s: string) => s, red: (s: string) => s }, prompts: null }
  }
}

async function main() {
  const { pc, prompts } = await loadColorAndPrompts()

  console.log()
  console.log(pc.bold(pc.cyan('  ●  noalphjs')))
  console.log(pc.cyan('  Framework JavaScript Indonesia dengan ekstensi .eno'))
  console.log()

  let projectName = process.argv[2]

  if (!projectName && prompts) {
    const response = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Nama proyek kamu:',
      initial: 'my-noalph-app',
      validate: (value: string) =>
        /^[a-z0-9-_]+$/.test(value) ? true : 'Gunakan huruf kecil, angka, - atau _',
    })
    projectName = response.projectName
  }

  if (!projectName) {
    projectName = 'my-noalph-app'
  }

  const targetDir = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(targetDir)) {
    console.log(pc.red(`\n  Error: Folder "${projectName}" sudah ada.`))
    process.exit(1)
  }

  console.log()
  console.log(`  Membuat proyek ${pc.bold(pc.green(projectName))}...`)
  console.log()

  // Copy template
  const templateDir = path.join(__dirname, '../../templates/default')
  copyDir(templateDir, targetDir)

  // Update package.json nama
  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.name = projectName
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  console.log(pc.green('  ✓ Proyek berhasil dibuat!'))
  console.log()
  console.log('  Langkah selanjutnya:')
  console.log()
  console.log(pc.cyan(`    cd ${projectName}`))
  console.log(pc.cyan('    npm install'))
  console.log(pc.cyan('    npm run dev'))
  console.log()
  console.log(`  Kemudian buka ${pc.bold('http://localhost:3000')} di browser kamu.`)
  console.log()
  console.log(pc.yellow('  Selamat ngoding! 🇮🇩'))
  console.log()
}

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name === '_gitignore' ? '.gitignore' : entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
