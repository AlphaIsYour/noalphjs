<div align="center">
  <h1>● noalphjs</h1>
  <p><strong>Framework JavaScript Indonesia dengan ekstensi komponen <code>.eno</code></strong></p>
  <p>
    <a href="https://github.com/AlphaIsYour/noalphjs/actions/workflows/ci.yml"><img src="https://github.com/AlphaIsYour/noalphjs/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
    <a href="https://www.npmjs.com/package/create-noalph-app"><img src="https://img.shields.io/npm/v/create-noalph-app?color=6366f1" alt="npm" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT" /></a>
    <a href="https://buymeacoffee.com/enoalph"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Dukung-yellow?logo=buy-me-a-coffee" alt="Buy Me a Coffee" /></a>
  </p>
</div>

---

## Tentang noalphjs

**noalphjs** adalah framework JavaScript/TypeScript modern buatan Indonesia yang mengusung konsep Single-File Component (SFC) melalui ekstensi **`.eno`**.

Menggabungkan kemudahan menulis komponen bergaya deklaratif (seperti Vue dan Svelte) dengan kecepatan perkakas modern berbasis Vite, noalphjs dirancang agar ringan, modular, dan menyenangkan untuk dipelajari oleh siapapun.

### Mengapa noalphjs?
- 🇮🇩 **Dokumentasi Bahasa Indonesia Kelas Satu:** Dirancang agar mudah dipelajari langsung oleh komunitas pengembang di Indonesia.
- ⚡ **Super Cepat dengan Vite:** Dibangun di atas Vite dengan dukungan Hot Module Replacement (HMR) bawaan.
- 🧩 **Modular & Clean:** Arsitektur pipeline terpisah dengan jelas antara Parser, Compiler, dan Renderer DOM.
- 📦 **Ekosistem Lengkap:** Mendukung SSR, client router, optimasi gambar, dan CLI generator interaktif.

---

## Mulai Cepat

Buat aplikasi baru hanya dengan satu perintah:

```bash
npx create-noalph-app my-app
cd my-app
npm install
npm run dev
```

Buka `http://localhost:3000` di browsermu — aplikasi default siap dijalankan dari `src/App.eno`.

---

## Contoh Komponen `.eno`

File `.eno` menyatukan skrip logika, template HTML, dan gaya CSS dalam satu file yang rapi:

```eno
<script>
  let salam = 'Halo Indonesia'
  let hitungan = 0

  function tambah() {
    hitungan++
    document.querySelector('[data-count]').textContent = String(hitungan)
  }
</script>

<div class="wadah">
  <h1>{salam}!</h1>
  <p>Komponen .eno pertamamu berjalan di browser.</p>

  <div class="counter">
    <button @click="tambah">Tambah</button>
    <span>Total: <strong data-count="0">{hitungan}</strong></span>
  </div>
</div>

<style>
  .wadah {
    padding: 2rem;
    font-family: system-ui, sans-serif;
    color: #334155;
  }
  h1 { color: #6366f1; }
  .counter { margin-top: 1rem; display: flex; gap: 1rem; align-items: center; }
  button {
    background: #6366f1;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
  }
</style>
```

📖 *Pelajari aturan sintaks lengkapnya di [Panduan Sintaks .eno](docs/architecture/syntax-guide.md).*

---

## Arsitektur Pipeline

```
┌─────────────┐       ┌─────────────────┐       ┌───────────────────┐       ┌──────────────┐
│  File .eno  │ ────► │  noalph-parser  │ ────► │  noalph-compiler  │ ────► │ renderer-dom │ ────► DOM Browser
│ (Source SFC)│       │   (Parse AST)   │       │(Kompilasi JS/CSS) │       │(Mount & Event│
└─────────────┘       └─────────────────┘       └───────────────────┘       └──────────────┘
```

---

## Ekosistem Packages Monorepo

| Package | Deskripsi |
| :--- | :--- |
| [`@alphaisyour/core`](./packages/noalph-core) | Runtime entry point & re-export API publik |
| [`@alphaisyour/parser`](./packages/noalph-parser) | Parser file `.eno` menjadi Abstract Syntax Tree (AST) |
| [`@alphaisyour/compiler`](./packages/noalph-compiler) | Mengompilasi AST `.eno` menjadi modul JavaScript dan CSS |
| [`@alphaisyour/renderer-dom`](./packages/noalph-renderer-dom) | Runtime renderer untuk me-mount komponen ke DOM browser |
| [`@alphaisyour/vite-plugin`](./packages/noalph-vite-plugin) | Plugin Vite resmi untuk kompilasi file `.eno` & HMR |
| [`@alphaisyour/cli`](./packages/noalph-cli) | Perintah command line interface framework |
| [`create-noalph-app`](./packages/create-noalphjs) | CLI scaffolding interaktif untuk membuat proyek baru |
| [`@alphaisyour/server`](./packages/noalph-server) | Dukungan Server-Side Rendering (SSR) untuk `.eno` |
| [`@alphaisyour/router`](./packages/noalph-router) | Sistem client routing untuk navigasi halaman |
| [`@alphaisyour/image`](./packages/noalph-image) | Komponen gambar teroptimasi |
| [`@alphaisyour/shared`](./packages/noalph-shared) | Konstanta, utilitas bersama, dan definisi tipe dasar |

---

## Roadmap Pengembangan

Ingin tahu fitur apa yang sedang dikembangkan dan bagaimana masa depan noalphjs?
Lihat dokumen [ROADMAP.md](./ROADMAP.md) kami untuk detail status fitur dan area yang membutuhkan bantuan kontributor.

---

## Cara Berkontribusi

Kami sangat menyambut kontribusi dari siapa saja—baik berupa perbaikan dokumentasi, penambahan unit test, pelaporan bug, maupun fitur baru.

1. Buka [CONTRIBUTING.md](./CONTRIBUTING.md) untuk panduan instalasi monorepo lokal, cara menjalankan tes, dan konvensi commit.
2. Cari issue berlabel `good first issue` di [GitHub Issues](https://github.com/AlphaIsYour/noalphjs/issues) untuk memulai kontribusi pertamamu.
3. Diskusi atau tanyakan ide barumu di [GitHub Discussions](https://github.com/AlphaIsYour/noalphjs/discussions).

---

## Kontributor

Terima kasih banyak kepada seluruh kontributor yang telah membantu mengembangkan noalphjs!

<a href="https://github.com/AlphaIsYour/noalphjs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AlphaIsYour/noalphjs" alt="Kontributor noalphjs" />
</a>

---

## Dukungan & Donasi

noalphjs adalah proyek open-source gratis dan terbuka untuk umum. Jika proyek ini bermanfaat bagimu atau menginspirasi belajarmu, kamu bisa memberikan dukungan sukarela untuk pengembangan berkelanjutan melalui:

☕ [**Dukung noalphjs di Buy Me a Coffee**](https://buymeacoffee.com/enoalph)

Dukunganmu—baik berupa kontribusi kode, feedback, maupun secangkir kopi—sangat berarti bagi kemajuan proyek ini!

---

## Lisensi

[MIT](./LICENSE) © AlphaIsYour dan kontributor noalphjs.
