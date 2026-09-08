# Panduan Kontribusi noalphjs

Terima kasih atas minatmu untuk berkontribusi ke **noalphjs**! 🇮🇩✨  
noalphjs adalah proyek open-source yang dibangun bersama komunitas. Kontribusi dalam bentuk apapun—mulai dari perbaikan ketikan (typo) di dokumentasi, penambahan unit test, perbaikan bug, hingga implementasi fitur baru—sangat dihargai.

---

## Daftar Isi
- [Setup Lingkungan Lokal](#setup-lingkungan-lokal)
- [Struktur Monorepo](#struktur-monorepo)
- [Menjalankan Aplikasi Contoh](#menjalankan-aplikasi-contoh)
- [Menjalankan Pengujian (Testing)](#menjalankan-pengujian-testing)
- [Alur Kerja Kontribusi (Git Workflow)](#alur-kerja-kontribusi-git-workflow)
- [Konvensi Commit](#konvensi-commit)
- [Membuat Changeset](#membuat-changeset)
- [Jenjang Kontributor (Contributor Ladder)](#jenjang-kontributor-contributor-ladder)
- [Pedoman Pembuatan Issue & Pull Request](#pedoman-pembuatan-issue--pull-request)
- [Butuh Bantuan?](#butuh-bantuan)

---

## Setup Lingkungan Lokal

### Prasyarat
- **Node.js**: versi 20 LTS atau lebih baru (`node -v`)
- **pnpm**: versi 8 atau lebih baru (`pnpm -v`). Jika belum ada: `npm install -g pnpm`
- **Git**: terinstal dan terkonfigurasi

### Langkah Instalasi
1. Fork repositori [AlphaIsYour/noalphjs](https://github.com/AlphaIsYour/noalphjs) ke akun GitHub pribadimu.
2. Clone hasil fork ke komputer lokalmu:
   ```bash
   git clone https://github.com/<username-kamu>/noalphjs.git
   cd noalphjs
   ```
3. Install seluruh dependensi monorepo:
   ```bash
   pnpm install
   ```
4. Build seluruh paket di dalam monorepo:
   ```bash
   pnpm build
   ```
5. Verifikasi bahwa semua tes dan typecheck berhasil:
   ```bash
   pnpm test
   pnpm typecheck
   ```

---

## Struktur Monorepo

Proyek ini menggunakan arsitektur monorepo yang dikelola oleh **pnpm workspace** dan **Turborepo**:

```
noalphjs/
├── packages/
│   ├── noalph-shared/        # Tipe & konstanta fondasi (tanpa internal dependency)
│   ├── noalph-parser/        # Parser file .eno -> AST
│   ├── noalph-compiler/      # Compiler AST -> JS & CSS
│   ├── noalph-renderer-dom/  # DOM Renderer runtime
│   ├── noalph-vite-plugin/   # Vite Plugin untuk .eno
│   ├── noalph-core/          # Entry point runtime publik
│   ├── noalph-server/        # SSR renderer
│   ├── noalph-router/        # Client routing
│   ├── noalph-image/         # Komponen optimasi gambar
│   ├── noalph-cli/           # CLI runtime
│   └── create-noalphjs/      # Paket CLI npm 'create-noalph-app'
├── examples/
│   └── hello-world/          # Aplikasi contoh untuk pengujian lokal
└── docs/                     # Dokumentasi arsitektur & panduan
```

> **Aturan Dependensi:** Dependensi hanya boleh mengalir ke bawah (paket tingkat tinggi mengimpor paket tingkat rendah). `@alphaisyour/shared` adalah fondasi dan tidak boleh mengimpor dari paket internal lain.

---

## Menjalankan Aplikasi Contoh

Saat kamu sedang memodifikasi kode di `packages/noalph-compiler` atau `packages/noalph-renderer-dom`, cara terbaik untuk menguji perubahannya secara visual adalah menggunakan aplikasi contoh `examples/hello-world`:

```bash
# Jalankan dev server aplikasi contoh
pnpm --filter=@alphaisyour/example-hello-world dev
```

Buka `http://localhost:5173` di browser. Setiap kali kamu mengubah kode di paket monorepo dan mem-build-nya, kamu bisa langsung melihat perilakunya di browser!

---

## Menjalankan Pengujian (Testing)

Kami menggunakan **Vitest** untuk pengujian unit dan integrasi.

```bash
# Menjalankan seluruh test suite di semua package
pnpm test

# Menjalankan test hanya untuk satu paket tertentu (contoh: compiler)
pnpm --filter=@alphaisyour/compiler test

# Menjalankan test dalam mode watch saat development
pnpm --filter=@alphaisyour/renderer-dom exec vitest

# Menjalankan pengecekan tipe TypeScript (typecheck)
pnpm typecheck
```

---

## Alur Kerja Kontribusi (Git Workflow)

1. Pastikan branch `main` lokalmu selalu sinkron dengan upstream:
   ```bash
   git remote add upstream https://github.com/AlphaIsYour/noalphjs.git
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```
2. Buat branch baru untuk pekerjaanmu dengan nama yang deskriptif:
   ```bash
   # Format: <tipe>/<deskripsi-singkat>
   git checkout -b feat/tambah-directive-if
   # atau
   git checkout -b fix/parser-closing-tag
   ```
3. Tulis kode perbaikan atau fitur barumu beserta unit test-nya.
4. Pastikan build, linting, dan tes lulus 100%:
   ```bash
   pnpm test
   pnpm typecheck
   ```
5. Buat changeset jika perubahanmu mempengaruhi paket yang dipublikasikan (lihat bagian [Membuat Changeset](#membuat-changeset)).
6. Commit perubahanmu mengikuti [Konvensi Commit](#konvensi-commit).
7. Push ke fork GitHub pribadimu dan buka Pull Request.

---

## Konvensi Commit

Kami menerapkan format [Conventional Commits](https://www.conventionalcommits.org/):

| Awalan | Tujuan Penggunaan | Contoh |
| :--- | :--- | :--- |
| `feat:` | Penambahan fitur baru | `feat(compiler): tambahkan dukungan boolean attributes` |
| `fix:` | Perbaikan bug | `fix(parser): tangani self-closing tags tanpa spasi` |
| `docs:` | Pembaruan dokumentasi | `docs: perbaiki contoh binding pada syntax-guide` |
| `test:` | Penambahan atau perbaikan unit test | `test(core): tambahkan unit test untuk helper setHead` |
| `refactor:` | Refaktorisasi kode tanpa mengubah fungsionalitas | `refactor(renderer): rapikan penanganan event listener` |
| `chore:` | Tugas pemeliharaan build/dependencies | `chore: update pnpm dependencies` |

---

## Membuat Changeset

Setiap kali kamu membuat perubahan pada paket di folder `packages/` yang akan dirilis ke npm, kamu **harus** membuat changeset:

```bash
pnpm changeset
```

CLI interaktif akan menanyakan:
1. Paket mana saja yang terpengaruh oleh perubahanmu.
2. Apakah perubahan ini tergolong `patch` (bug fix), `minor` (fitur baru non-breaking), atau `major` (breaking change).
3. Deskripsi singkat perubahan untuk dicantumkan pada changelog rilis.

File markdown kecil akan dibuat di folder `.changeset/`. Commit file ini bersama kode pekerjaanmu.

---

## Jenjang Kontributor (Contributor Ladder)

Kami menyediakan jalur kontribusi berjenjang agar siapa pun dapat bertumbuh di komunitas noalphjs:

### 1. Level Pemula (Beginner / Good First Issue)
- **Estimasi:** < 2 jam.
- **Fokus:** Memperbaiki dokumentasi, menambahkan contoh kode, membuat test suite untuk paket yang belum ter-cover (`@alphaisyour/core`), memperbaiki pesan error typo.
- **Label yang dicari:** `good first issue`, `documentation`, `testing`.

### 2. Level Menengah (Intermediate / Builder)
- **Estimasi:** 1–3 hari.
- **Fokus:** Menangani edge cases pada parser, validasi input pada CLI, optimasi transform plugin Vite, atau penanganan atribut HTML tertentu di compiler.
- **Label yang dicari:** `enhancement`, `bug`, `help wanted`.

### 3. Level Mahir (Advanced / Core Architect)
- **Estimasi:** Berkelanjutan.
- **Fokus:** Arsitektur reaktivitas otomatis (fine-grained reactive signals), SSR streaming, file-based routing otomatis, atau pembuatan language server (LSP).
- **Label yang dicari:** `architecture`, `core`, `roadmap`.

---

## Pedoman Pembuatan Issue & Pull Request

### Melaporkan Bug
- Cek terlebih dahulu tab [Issues](https://github.com/AlphaIsYour/noalphjs/issues) untuk memastikan masalah belum pernah dilaporkan.
- Gunakan template **Bug Report**.
- Sertakan langkah-langkah reproduksi yang jelas (contoh potongan kode `.eno` minimal yang memicu error).

### Mengajukan Fitur Baru
- Buka issue dengan template **Feature Request** atau diskusikan di **GitHub Discussions** terlebih dahulu sebelum menulis kode besar. Hal ini mencegah waktu terbuang jika ada pertimbangan arsitektur lain dari maintainer.

### Standar Pull Request
- Isi checklist pada template PR dengan jujur.
- Pastikan semua tes otomatis (`pnpm test`) dan typecheck (`pnpm typecheck`) lolos di lokal sebelum membuat PR.
- Jelaskan *mengapa* perubahan ini diperlukan dan bagaimana cara memverifikasinya.

---

## Butuh Bantuan?

Jangan ragu untuk bertanya! Kami ingin membuat proses kontribusi senyaman mungkin.
- Buka pertanyaan di [GitHub Discussions Q&A](https://github.com/AlphaIsYour/noalphjs/discussions/categories/q-a).
- Berikan saran atau feedback untuk meningkatkan pengalaman developer di repositori ini.
