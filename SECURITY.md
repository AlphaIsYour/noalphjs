# Security Policy

## Versi yang Didukung

| Versi | Dukungan Keamanan |
|-------|-------------------|
| 0.x (pre-release) | ✅ Aktif |

## Melaporkan Kerentanan

**JANGAN buat GitHub Issue untuk melaporkan kerentanan keamanan.**

Kirimkan laporan ke: **security@noalphjs.dev**

Sertakan:
- Deskripsi kerentanan
- Langkah reproduksi
- Dampak potensial
- Saran perbaikan (opsional)

Kami akan merespons dalam **48 jam kerja** dan memberikan pembaruan setiap 7 hari.

## Prinsip Keamanan

- Semua dependency dipantau via Dependabot
- Kode dianalisis otomatis via CodeQL setiap push ke main
- Setiap release menjalankan `npm audit` dan akan gagal jika ada vulnerability level high/critical
- Secret scanning aktif di repositori ini
