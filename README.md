<div align="center">
  <h1>● noalphjs</h1>
  <p><strong>Framework JavaScript Indonesia dengan ekstensi komponen <code>.eno</code></strong></p>
  <p>
    <a href="https://github.com/AlphaIsYour/noalphjs/actions"><img src="https://github.com/AlphaIsYour/noalphjs/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
    <a href="https://www.npmjs.com/package/create-noalph-app"><img src="https://img.shields.io/npm/v/create-noalph-app?color=6366f1" alt="npm" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT" /></a>
  </p>
</div>

---

## Mulai Cepat

```bash
npx create-noalph-app my-app
cd my-app
npm install
npm run dev
```

Buka `http://localhost:3000` — kamu akan melihat halaman default dari `src/App.eno`.

## Contoh Komponen `.eno`

```eno
<script>
  let nama = 'Dunia'
</script>

<div class="container">
  <h1>Halo, {nama}!</h1>
  <p>Ini adalah komponen .eno pertamamu.</p>
</div>

<style>
  .container { padding: 2rem; font-family: sans-serif; }
  h1 { color: #6366f1; }
</style>
```

## Packages

| Package                | Deskripsi                 |
| ---------------------- | ------------------------- |
| `@alphaisyour/core`         | Runtime inti framework    |
| `@alphaisyour/parser`       | Parser `.eno` → AST       |
| `@alphaisyour/compiler`     | Compiler AST → JavaScript |
| `@alphaisyour/renderer-dom` | DOM renderer              |
| `@alphaisyour/vite-plugin`  | Plugin Vite untuk `.eno`  |
| `create-noalph-app`    | CLI scaffolding           |

## Kontribusi

Lihat [CONTRIBUTING.md](./CONTRIBUTING.md) untuk panduan lengkap.

## Lisensi

MIT — AlphaIsYour dan kontributor.
