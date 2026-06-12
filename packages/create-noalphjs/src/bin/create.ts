#!/usr/bin/env node

import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── WARNA ANSI ────────────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  purple: '\x1b[38;2;139;92;246m',
  indigo: '\x1b[38;2;99;102;241m',
  cyan: '\x1b[38;2;34;211;238m',
  green: '\x1b[38;2;52;211;153m',
  yellow: '\x1b[38;2;251;191;36m',
  red: '\x1b[38;2;248;113;113m',
  white: '\x1b[38;2;248;250;252m',
  gray: '\x1b[38;2;100;116;139m',
  bg_indigo: '\x1b[48;2;49;46;129m',
  bg_purple: '\x1b[48;2;88;28;135m',
}
const bold = (s: string) => `${c.bold}${s}${c.reset}`
const dim = (s: string) => `${c.dim}${s}${c.reset}`
const purple = (s: string) => `${c.purple}${s}${c.reset}`
const indigo = (s: string) => `${c.indigo}${s}${c.reset}`
const cyan = (s: string) => `${c.cyan}${s}${c.reset}`
const green = (s: string) => `${c.green}${s}${c.reset}`
const yellow = (s: string) => `${c.yellow}${s}${c.reset}`
const red = (s: string) => `${c.red}${s}${c.reset}`
const gray = (s: string) => `${c.gray}${s}${c.reset}`

// ─── ANIMASI SPINNER ───────────────────────────────────────────────────────
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
let spinnerInterval: ReturnType<typeof setInterval> | null = null
let spinnerIdx = 0

function startSpinner(label: string) {
  spinnerIdx = 0
  process.stdout.write('\n')
  spinnerInterval = setInterval(() => {
    process.stdout.write(`\r  ${purple(spinnerFrames[spinnerIdx % spinnerFrames.length]!)}  ${label}  `)
    spinnerIdx++
  }, 80)
}

function stopSpinner(successLabel?: string) {
  if (spinnerInterval) {
    clearInterval(spinnerInterval)
    spinnerInterval = null
  }
  if (successLabel) {
    process.stdout.write(`\r  ${green('✓')}  ${successLabel}${' '.repeat(20)}\n`)
  } else {
    process.stdout.write('\r' + ' '.repeat(60) + '\r')
  }
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────
function progressBar(current: number, total: number, label: string) {
  const width = 28
  const filled = Math.round((current / total) * width)
  const bar = `${c.indigo}${'█'.repeat(filled)}${c.reset}${c.dim}${'░'.repeat(width - filled)}${c.reset}`
  const pct = String(Math.round((current / total) * 100)).padStart(3)
  process.stdout.write(`\r  [${bar}] ${pct}% ${dim(label)}  `)
}

// ─── SLEEP ─────────────────────────────────────────────────────────────────
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// ─── BANNER ────────────────────────────────────────────────────────────────
function printBanner() {
  console.clear()
  const lines = [
    '',
    `  ${c.bold}${c.purple}   ███╗   ██╗ ██████╗  █████╗ ██╗     ██████╗ ██╗  ██╗${c.reset}`,
    `  ${c.bold}${c.purple}   ████╗  ██║██╔═══██╗██╔══██╗██║     ██╔══██╗██║  ██║${c.reset}`,
    `  ${c.bold}${c.indigo}   ██╔██╗ ██║██║   ██║███████║██║     ██████╔╝███████║${c.reset}`,
    `  ${c.bold}${c.indigo}   ██║╚██╗██║██║   ██║██╔══██║██║     ██╔═══╝ ██╔══██║${c.reset}`,
    `  ${c.bold}${c.cyan}   ██║ ╚████║╚██████╔╝██║  ██║███████╗██║     ██║  ██║${c.reset}`,
    `  ${c.bold}${c.cyan}   ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝${c.reset}`,
    '',
    `  ${bold(purple('●'))} ${bold(white('The Indonesian JavaScript Framework'))}`,
    `  ${gray('Ekstensi komponen')} ${cyan('.eno')} ${gray('· Dibangun untuk skala dunia')}`,
    '',
    `  ${dim('━'.repeat(52))}`,
    '',
  ]
  lines.forEach(l => console.log(l))
}

// ─── PILIHAN TEMPLATE ──────────────────────────────────────────────────────
const templates = [
  {
    id: 'default',
    label: 'Starter',
    desc: 'Halaman default, counter, info grid',
    icon: '⚡',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    desc: 'Satu file App.eno kosong, siap diisi',
    icon: '✦',
  },
  {
    id: 'with-router',
    label: 'Router',
    desc: 'File-based routing dengan pages/',
    icon: '🗺',
  },
  {
    id: 'with-api',
    label: 'Full-Stack',
    desc: 'Router + API routes + SSR',
    icon: '🚀',
  },
]

// ─── INPUT READLINE ────────────────────────────────────────────────────────
import * as readline from 'readline'

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

async function selectTemplate(): Promise<string> {
  console.log(`  ${bold(white('Pilih template:'))}\n`)
  templates.forEach((t, i) => {
    const num = indigo(`  ${i + 1}`)
    const icon = t.icon
    const label = bold(t.label)
    const desc = gray(t.desc)
    console.log(`  ${num}  ${icon}  ${label.padEnd(14)} ${desc}`)
  })
  console.log()

  const answer = await askQuestion(`  ${gray('Masukkan nomor')} ${cyan('[1-4]')} ${gray('(default: 1):')}  `)
  const idx = parseInt(answer || '1', 10) - 1

  if (idx >= 0 && idx < templates.length && templates[idx]) {
    return templates[idx].id
  }
  return 'default'
}

function white(s: string) { return `${c.white}${s}${c.reset}` }

// ─── COPY TEMPLATE ─────────────────────────────────────────────────────────
function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destName = entry.name === '_gitignore' ? '.gitignore' : entry.name
    const destPath = path.join(dest, destName)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// ─── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  printBanner()

  // Nama proyek
  let projectName = process.argv[2]
  if (!projectName) {
    projectName = await askQuestion(
      `  ${bold(white('Nama proyek kamu:'))}  ${gray('(default: my-noalph-app)')}  \n  ${cyan('❯')} `
    )
    if (!projectName) projectName = 'my-noalph-app'
  }

  // Validasi nama
  if (!/^[a-z0-9-_]+$/.test(projectName)) {
    console.log(`\n  ${red('✗')} Nama proyek hanya boleh huruf kecil, angka, - atau _\n`)
    process.exit(1)
  }

  const targetDir = path.resolve(process.cwd(), projectName)
  if (fs.existsSync(targetDir)) {
    console.log(`\n  ${red('✗')} Folder ${bold(projectName)} sudah ada. Gunakan nama lain.\n`)
    process.exit(1)
  }

  console.log()

  // Pilih template
  const templateId = await selectTemplate()
  const selectedTemplate = templates.find(t => t.id === templateId) ?? templates[0]!

  console.log(`\n  ${green('✓')} Template dipilih: ${bold(purple(selectedTemplate.label))}\n`)
  await sleep(400)

  // Konfirmasi ringkas
  console.log(`  ${dim('━'.repeat(52))}`)
  console.log(`  ${gray('Proyek')}     ${bold(white(projectName))}`)
  console.log(`  ${gray('Template')}   ${bold(purple(selectedTemplate.label))} ${gray('—')} ${gray(selectedTemplate.desc)}`)
  console.log(`  ${gray('Lokasi')}     ${dim(targetDir)}`)
  console.log(`  ${dim('━'.repeat(52))}\n`)
  await sleep(600)

  // Copy template dengan progress
  console.log(`  ${bold(white('Membuat struktur proyek...'))}\n`)
  const templateDir = path.join(__dirname, '../../templates', templateId)
  const fallbackDir = path.join(__dirname, '../../templates/default')
  const sourceDir = fs.existsSync(templateDir) ? templateDir : fallbackDir

  const allFiles: string[] = []
  function collectFiles(dir: string, base: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const e of entries) {
      if (e.isDirectory()) collectFiles(path.join(dir, e.name), path.join(base, e.name))
      else allFiles.push(path.join(base, e.name))
    }
  }
  collectFiles(sourceDir, '')

  const total = allFiles.length + 4
  let step = 0

  const steps = [
    'Menyiapkan workspace',
    'Menyalin template',
    'Mengonfigurasi TypeScript',
    'Menulis vite.config.ts',
    'Membuat .noalph/',
    'Finalisasi package.json',
  ]

  for (const stepLabel of steps) {
    progressBar(step, total, stepLabel)
    await sleep(120 + Math.random() * 180)
    step++
  }

  copyDir(sourceDir, targetDir)

  // Update nama proyek di package.json
  const pkgPath = path.join(targetDir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.name = projectName
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  // Buat folder .noalph di proyek baru
  fs.mkdirSync(path.join(targetDir, '.noalph', 'cache'), { recursive: true })
  fs.writeFileSync(
    path.join(targetDir, '.noalph', 'manifest.json'),
    JSON.stringify({
      version: '0.2.3',
      framework: 'noalphjs',
      template: templateId,
      created: new Date().toISOString(),
      projectName,
    }, null, 2)
  )

  progressBar(total, total, 'Selesai!')
  await sleep(300)
  process.stdout.write('\n\n')

  // ─── SUKSES ─────────────────────────────────────────────────────────
  console.log(`  ${c.bold}${c.bg_indigo}  ✓ Proyek berhasil dibuat!  ${c.reset}\n`)
  console.log(`  ${bold(purple('noalphjs'))} siap untukmu, ${bold(white(projectName))} 🇮🇩\n`)

  console.log(`  ${dim('━'.repeat(52))}`)
  console.log(`  ${bold(white('Langkah selanjutnya:'))}\n`)
  console.log(`  ${gray('1.')}  ${cyan(`cd ${projectName}`)}`)
  console.log(`  ${gray('2.')}  ${cyan('npm install')}      ${dim('# atau pnpm install')}`)
  console.log(`  ${gray('3.')}  ${cyan('npm run dev')}      ${dim('# buka http://localhost:3000')}`)
  console.log(`  ${dim('━'.repeat(52))}\n`)

  console.log(`  ${bold(white('Tips:'))}`)
  console.log(`  ${gray('·')} Edit ${cyan(`${projectName}/src/App.eno`)} untuk mulai`)
  console.log(`  ${gray('·')} Tambah halaman di ${cyan('src/pages/')}`)
  console.log(`  ${gray('·')} Tambah API di ${cyan('src/api/')}`)
  console.log(`  ${gray('·')} Jalankan ${cyan('noalph --help')} untuk daftar perintah`)
  console.log()
  console.log(`  ${yellow('★')} ${bold(white('Star kami di GitHub:'))} ${dim('github.com/AlphaIsYour/noalphjs')}`)
  console.log()
  console.log(`  ${bold(purple('Selamat ngoding! Mari kita bikin sesuatu yang hebat.'))}`)
  console.log()
}

main().catch(e => {
  console.error(`\n  ${red('✗')} Error: ${e.message}\n`)
  process.exit(1)
})
