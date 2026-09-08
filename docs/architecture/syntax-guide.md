# Panduan Sintaks Komponen `.eno`

File `.eno` adalah format komponen Single-File Component (SFC) resmi untuk **noalphjs**.
Satu file `.eno` menyatukan logika JavaScript/TypeScript, template HTML interaktif, dan CSS scoped dalam satu kesatuan yang kohesif.

```eno
<script>
  let judul = 'Halo Dunia'
  let jumlah = 0

  function tambah() {
    jumlah++
    // Di versi saat ini, manipulasi DOM manual masih digunakan untuk update reaktif
    document.querySelector('[data-count]').textContent = String(jumlah)
  }
</script>

<div class="kartu">
  <h1>{judul}</h1>
  <p>Nilai counter saat ini: <span data-count="0">{jumlah}</span></p>
  <button class="tombol" @click="tambah">Tambah Nilai</button>
</div>

<style>
  .kartu {
    padding: 1.5rem;
    border-radius: 8px;
    background: #1e1e2e;
    color: #cdd6f4;
  }
  .tombol {
    background: #89b4fa;
    color: #11111b;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
```

---

## Struktur File `.eno`

Satu file `.eno` terdiri dari tiga blok utama. Setiap blok bersifat opsional:

1. **`<script>`**: Logika komponen (state, fungsi pembantu, event handler).
2. **Template**: Markup HTML beserta directive dan data-binding kurung kurawal `{...}`.
3. **`<style>`**: Gaya visual CSS untuk komponen.

---

## 1. Blok `<script>`

Blok script berisi logika JavaScript/TypeScript standar. Semua variabel dan fungsi yang dideklarasikan di blok ini akan tersedia di dalam scope komponen saat di-mount ke DOM.

```eno
<script>
  // Deklarasi variabel
  let nama = 'Kawan'
  let aktif = true

  // Event handler
  function tanganiKlik(event) {
    console.log('Tombol diklik!', event)
  }
</script>
```

---

## 2. Template Markup

Template `.eno` menggunakan sintaks yang sangat mirip dengan HTML standar, dengan penambahan fitur-fitur berikut:

### A. Evaluasi Ekspresi Data `{...}`
Teks atau variabel JavaScript dapat disisipkan ke dalam template menggunakan kurung kurawal `{}`:

```eno
<h1>Halo, {nama}!</h1>
<p>Waktu sekarang: {new Date().toLocaleTimeString()}</p>
```

> **Catatan:** Saat dikompilasi, ekspresi akan dievaluasi dan dimasukkan sebagai text node awal di dalam elemen DOM.

### B. Event Listener Directive (`@event`)
Untuk mendengarkan event DOM (seperti `click`, `input`, `submit`, `mouseover`), gunakan awalan `@`:

```eno
<button @click="tanganiKlik">Klik Saya</button>
<input type="text" @input="saatInput" />
```

Saat dikompilasi, `@click="tanganiKlik"` diterjemahkan menjadi:
```javascript
elemen.addEventListener('click', tanganiKlik)
```

### C. Attribute Binding (`:attribute`)
Untuk mengikat atribut HTML ke variabel atau ekspresi JavaScript secara dinamis, gunakan awalan titik dua `:`:

```eno
<img :src="gambarUrl" :alt="deskripsiGambar" />
<button :disabled="sedangMemuat">Kirim</button>
```

### D. HTML Atribut Biasa & Boolean
Atribut standar HTML seperti `class`, `id`, `type`, `placeholder`, atau boolean attribute (`disabled`, `required`, `readonly`) berfungsi seperti HTML biasa:

```eno
<input type="email" placeholder="nama@domain.com" required />
```

---

## 3. Blok `<style>`

Blok `<style>` mendefinisikan gaya CSS.

```eno
<style>
  .wadah {
    max-width: 600px;
    margin: 0 auto;
    font-family: system-ui, sans-serif;
  }
</style>
```

Compiler `noalph-compiler` mengekstrak blok CSS ini dan mengintegrasikannya langsung ke dalam pipeline Vite melalui `@alphaisyour/vite-plugin`.

---

## 4. Cara Menggunakan Komponen di Aplikasi

Setelah membuat komponen `.eno`, kamu bisa me-mount komponen tersebut ke dalam elemen DOM di file JavaScript/TypeScript aplikasimu (misal `src/main.ts`):

```typescript
import { mount } from '@alphaisyour/renderer-dom'
import App from './App.eno'

const container = document.getElementById('app')

if (container) {
  mount({ container, component: App })
}
```

---

## Status Pengembangan & Kontribusi

Fitur-fitur sintaks tingkat lanjut saat ini sedang dalam pengembangan aktif:
- [ ] Reaktivitas deklaratif otomatis (auto-update text node saat variabel berubah tanpa manual DOM).
- [ ] Conditional rendering (`{#if condition} ... {/if}`).
- [ ] List / Loop rendering (`{#each items as item} ... {/each}`).
- [ ] Props transfer antar komponen.

Tertarik membantu mengimplementasikan fitur di atas? Cek [CONTRIBUTING.md](../../CONTRIBUTING.md) dan lihat issue bertanda `good first issue` atau `help wanted`!
