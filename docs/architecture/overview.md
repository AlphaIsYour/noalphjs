# Arsitektur noalphjs

## Ringkasan

noalphjs adalah framework JavaScript berbasis komponen dengan ekstensi file `.eno`.
Arsitekturnya mengikuti pipeline: **Source `.eno`** → **Parser (AST)** → **Compiler (JS)** → **Renderer (DOM)**.

## Pipeline Kompilasi

```
App.eno
↓ [noalph-parser]
AST (EnoNode tree)
↓ [noalph-compiler]
JavaScript Module (ESM)
↓ [noalph-renderer-dom]
DOM Elements
```

## Dependency Graph Package

```
@alphaisyour/core
├── @alphaisyour/compiler
│   └── @alphaisyour/parser
│       └── @alphaisyour/shared
├── @alphaisyour/renderer-dom
│   └── @alphaisyour/shared
└── @alphaisyour/shared (fondasi, tidak boleh depend ke lain)

@alphaisyour/vite-plugin
├── @alphaisyour/compiler
└── @alphaisyour/shared

@alphaisyour/cli
└── @alphaisyour/shared

create-noalph-app
(standalone, tidak depend ke packages monorepo)
```

## Aturan Dependency

1. `@alphaisyour/shared` adalah dasar — tidak boleh import dari package lain dalam monorepo
2. Dependency hanya boleh satu arah: ke bawah (ke paket yang lebih fundamental)
3. `apps/*` boleh depend ke semua `packages/*`
4. `packages/*` tidak boleh import dari `apps/*`
5. Circular dependency = build gagal (Turborepo enforce)

## Format File `.eno`

File `.eno` memiliki tiga blok utama (semua opsional):

```eno
<script>
  // Logic komponen — JavaScript/TypeScript
  let count = 0
</script>

<div class="container">
  <!-- Template — mirip HTML dengan {ekspresi} dan @event -->
  <button @click="increment">Klik: {count}</button>
</div>

<style>
  /* CSS scoped ke komponen ini */
  .container { padding: 1rem; }
</style>
```
