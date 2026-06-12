# Panduan Kontribusi noalphjs

Terima kasih telah tertarik berkontribusi ke noalphjs! 🙏

## Setup Cepat

```bash
# Clone repo
git clone https://github.com/AlphaIsYour/noalphjs.git
cd noalphjs

# Install dependencies
pnpm install

# Bootstrap semua packages
pnpm bootstrap

# Jalankan tests
pnpm test
```

## Alur Kontribusi

1. Fork repo ini
2. Buat branch: `git checkout -b feat/nama-fitur`
3. Buat perubahan dan tambahkan tests
4. Jalankan `pnpm test` dan `pnpm typecheck`
5. Commit: `git commit -m "feat: deskripsi singkat"`
6. Push dan buat Pull Request

## Konvensi Commit

Gunakan [Conventional Commits](https://www.conventionalcommits.org):

- `feat:` — fitur baru
- `fix:` — perbaikan bug
- `docs:` — perubahan dokumentasi
- `chore:` — maintenance
- `test:` — menambah atau memperbaiki tests
- `refactor:` — refaktor kode tanpa mengubah behavior

## Membuat Changeset

Setiap perubahan pada packages yang akan dirilis harus memiliki changeset:

```bash
pnpm changeset
```

## Struktur Package

Lihat `docs/architecture/` untuk penjelasan arsitektur lengkap.

## Pertanyaan?

Buka diskusi di [GitHub Discussions](https://github.com/AlphaIsYour/noalphjs/discussions).
