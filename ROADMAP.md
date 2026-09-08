# Roadmap noalphjs

Dokumen ini memetakan status pengembangan terkini dan rencana arah masa depan **noalphjs**.
Kami menyambut baik bantuan dari siapa pun yang ingin berkontribusi!

---

## 🟢 Selesai (Completed)
- **Monorepo Baseline:** Turborepo + pnpm workspace dengan TypeScript strict mode.
- **AST Parser (`@alphaisyour/parser`):** Parsing komponen `.eno` menjadi struktur pohon AST.
- **Komposisi Compiler (`@alphaisyour/compiler`):** Mengompilasi AST ke kode JavaScript ESM dan CSS modular.
- **Runtime DOM Renderer (`@alphaisyour/renderer-dom`):** Mount komponen ke DOM browser dengan event handler (`@event`) dan binding atribut (`:attr`).
- **Integrasi Vite & HMR (`@alphaisyour/vite-plugin`):** Plugin Vite resmi dengan Hot Module Replacement.
- **CLI Scaffolding (`create-noalph-app`):** Pembuat template interaktif dengan animasi CLI (`npx create-noalph-app <nama-aplikasi>`).
- **Fondasi SSR (`@alphaisyour/server`):** Render komponen `.eno` menjadi string HTML di sisi server.
- **Client Routing (`@alphaisyour/router`):** Routing client-side sederhana.
- **Komponen Gambar (`@alphaisyour/image`):** Helper optimasi dan rendering elemen gambar.
- **SEO Helper (`@alphaisyour/core`):** Helper `setHead` untuk mengatur judul dan meta tags dokumen.

---

## 🟡 Sedang Dikerjakan (In Progress)
- **Dokumentasi & Syntax Guide:** Panduan lengkap sintaks `.eno`, dokumentasi API tiap paket, dan contoh penggunaan dunia nyata.
- **Penguatan Test Coverage:** Menambahkan unit dan integration test untuk `@alphaisyour/core` dan `@alphaisyour/vite-plugin`.
- **Triaging Dependency Updates:** Validasi dan review dependabot PRs untuk menjaga dependensi tetap mutakhir.

---

## 🔵 Butuh Bantuan Kontributor (Help Wanted & Good First Issues)
Kami sangat menghargai kontribusi dari komunitas untuk fitur-fitur berikut:
1. **Reaktivitas Otomatis (Fine-Grained Reactivity):**
   - Mengubah text node di DOM saat nilai state JavaScript diperbarui tanpa perlu seleksi DOM manual.
2. **Directive Template Tambahan:**
   - Conditional rendering: `{#if kondisi} ... {/if}`
   - Loop / List rendering: `{#each data as item} ... {/each}`
3. **Template CLI Variatif:**
   - Menambahkan opsi template Tailwind CSS dan template TypeScript penuh saat scaffolding dengan `create-noalph-app`.
4. **Validasi CLI:**
   - Pengecekan nama proyek agar kompatibel dengan penamaan paket npm dan sistem file OS.
5. **Ekstensi Editor:**
   - Syntax highlighting dasar untuk file `.eno` di Visual Studio Code.

---

## 🟣 Rencana Masa Depan (Future Ideas)
- **Static Site Generation (SSG):** Build seluruh rute menjadi HTML statis pra-render.
- **DevTools Browser Extension:** Tab inspektor komponen `.eno` dan tracking state reaktif di Chrome/Firefox DevTools.
- **Language Server Protocol (LSP):** Auto-completion dan linting real-time untuk komponen `.eno`.

---

## Cara Ikut Berkontribusi
Jika kamu tertarik mengambil salah satu bagian di atas, silakan baca [CONTRIBUTING.md](./CONTRIBUTING.md) untuk panduan memulai, atau diskusikan ide barumu melalui [GitHub Discussions](https://github.com/AlphaIsYour/noalphjs/discussions).
