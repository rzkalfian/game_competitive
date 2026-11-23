# Game Edukasi Berhadapan

Implementasi React + TypeScript + Vite berdasarkan [AGENT.md](../AGENT.md), dengan tiga arena, empat kategori, 80 soal lokal, dan PWA. Dua pemain memakai satu perangkat, memilih warna berbeda, lalu berlomba mencapai skor bersih 8. Jawaban benar +1 dan salah -1; jika kedua bank habis tanpa target tercapai, hasilnya tanpa pemenang.

## Menjalankan

Jalankan dari folder `app`. Pada Windows, gunakan `npm.cmd` agar tidak terhalang kebijakan skrip PowerShell.

```powershell
npm.cmd install
npm.cmd run dev -- --host 0.0.0.0
```

Build dan preview PWA:

```powershell
npm.cmd run build
npm.cmd run preview -- --host 0.0.0.0 --port 4173
```

Service worker aktif pada build produksi, bukan dev server. Buka preview sekali sampai indikator `Offline siap` muncul. Permainan, font, karakter, dan gambar soal kemudian tersedia dari cache. Tombol instalasi tampil hanya saat browser menyediakan prompt; iOS memakai Safari dan Add to Home Screen.

Deployment default melayani isi `dist` pada root domain melalui HTTPS. Akses HTTP dari alamat IP LAN hanya untuk mencoba UI, bukan untuk membuktikan instalasi PWA di mobile. Jika memakai subpath, sesuaikan Vite `base`, manifest `id`/`start_url`/`scope`, dan URL aset sebelum deployment.

## Struktur

- `src/domain`: model dan aturan permainan bebas React/browser.
- `src/application`: kontrak layanan dan use case transisi pertandingan.
- `src/infrastructure`: bank JSON, repository lokal, adapter browser, dan registrasi PWA.
- `src/presentation`: layar React, panel pemain, arena, hooks, dan styling.
- `src/bootstrap` serta `src/main.tsx`: perakitan dependensi dan entry point.

Bank soal berada di `src/infrastructure/data/questions`. Keempat bank masing-masing berisi 20 soal; ketiga arena memakai bank yang sama. Pertanyaan bergambar menggunakan SVG lokal di `public/images`, sedangkan karakter dirender sebagai SVG khusus permainan. Ikon PNG PWA dapat dirender ulang dengan `npm.cmd run icons`.

## Pemeriksaan

```powershell
npm.cmd test
npm.cmd run lint
npm.cmd run check:architecture
npm.cmd run build
npm.cmd audit --omit=dev
```

Pengujian yang telah dilakukan:

- 15 tes otomatis: skor negatif, target 8, bank valid, input ganda, satu pemenang, indeks soal independen, jeda, dan reset pertandingan.
- Browser: semua 12 kombinasi arena/kategori mencapai layar pemenang; main lagi mempertahankan warna dan mereset pertandingan.
- Browser: tombol hapus/kirim angka, pemilihan keenam warna, penolakan warna lawan, countdown, dan kembali ke menu.
- Browser: pembatalan pemuatan soal saat kembali ke menu dan pesan kegagalan gambar melalui simulasi terkontrol.
- Layout diperiksa pada 320 x 568, 390 x 844, dan 844 x 390; tombol jawaban tidak keluar panel dan target sentuh minimal 44 piksel.
- PWA produksi dimuat ulang dengan server preview dihentikan; permainan dapat dimulai, font termuat, dan keenam gambar soal tetap merespons dari cache.
- Tombol pembaruan PWA di menu diuji dengan build baru; pembaruan tidak ditawarkan pada layar pertandingan.
- Browser: jeda/lanjut mempertahankan skor dan soal; kedua bank habis pada skor -6 dan -20 menghasilkan tanpa pemenang. Petunjuk iOS, Escape, tombol tutup, dan callback instalasi diuji melalui simulasi browser.

Laporan gate per item tersedia di [DELIVERY_GATE.md](DELIVERY_GATE.md).

Instalasi native pada Android/iOS fisik dan sentuhan dua jari pada perangkat nyata belum diverifikasi. Materi soal telah ditinjau saat penyusunan, tetapi tetap perlu peninjauan guru sesuai usia anak sebelum rilis sekolah.

Audit dependensi produksi bersih. Audit lengkap menemukan 6 kerentanan transitif pada alat build PWA (2 low, 4 moderate). Saran `npm audit fix --force` menurunkan versi plugin secara breaking; tindakan tersebut belum dilakukan. Tinjau kompatibilitas plugin sebelum memperbaruinya.

## Keputusan Visual

- Judul Permanent Marker mempertahankan arah gambar tangan dari [DESIGN.md](../DESIGN.md); Nunito pada soal membantu keterbacaan angka dan pilihan.
- Latar terang memisahkan teks dari ilustrasi arena; aksen hijau, biru, dan kuning membedakan arena, bukan menggantikan pilihan warna pemain.
- Outline gelap menjaga karakter putih dan hitam tetap terlihat; nomor pemain tetap tersedia agar identitas tidak bergantung pada warna.
- Menu memakai ilustrasi arena nyata agar pilihan permainan dapat dikenali, bukan ilustrasi promosi.
- Panel berhadapan mengikuti spesifikasi setiap arena; kontrol tetap konsisten antarkategori.
- Gerak karakter menunjukkan perubahan skor; transisi hasil menunggu animasi singkat, sementara input sudah dikunci. Reduced motion menonaktifkan animasi.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
