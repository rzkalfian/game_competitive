---
version: "alpha"
name: "Game Edukasi Berhadapan"
description: "Arah visual bergaya gambar tangan untuk game edukasi dua pemain pada satu perangkat mobile."
colors:
  primary: "#FDFDFD"
  secondary: "#87CEEB"
  tertiary: "#7CFC00"
  neutral: "#FFD700"
  surface: "#FFB6C1"
  accent: "#FFA07A"
typography:
  h1:
    fontFamily: Permanent Marker
    fontSize: 2.5rem
    fontWeight: 700
  body-md:
    fontFamily: Permanent Marker
    fontSize: 1rem
    fontWeight: 400
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    padding: 12px
---

## Tujuan

Gunakan gaya gambar tangan yang sudah dipilih untuk aplikasi game edukasi anak dua pemain. Layar pertama adalah menu permainan, bukan halaman promosi atau blog. Pertahankan karakter bergaya ilustrasi, tetapi soal dan kontrol harus mudah dibaca serta ditekan oleh kedua pemain.

Materi mencakup Matematika, Benda dan Bangun Ruang, Jenis Sampah, serta Bagian Tumbuhan. Gunakan gambar sesuai materi; jangan menjadikan simbol matematika sebagai identitas seluruh aplikasi. Ikuti [AGENT.md](AGENT.md) untuk aturan umum dan dokumen masing-masing permainan untuk orientasi panel.

- Density: 5/10 (seimbang)
- Variance: 8/10 (ekspresif pada arena, konsisten pada kontrol)
- Motion: 4/10 (umpan balik jawaban dan kemajuan karakter)

- **Style:** Playful, Organic, Artistic
- **Keywords:** hand-drawn, illustration, children, stories, playful, organic, artistic, unique, warm, friendly
- **Theme:** Terang, dengan warna identitas pemain yang dipilih secara terpisah.

## Colors

- **Branco Giz** (#FDFDFD): latar terang.
- **Azul Céu** (#87CEEB): aksen antarmuka.
- **Verde Grama** (#7CFC00): detail arena.
- **Amarelo Sol** (#FFD700): penanda perhatian.
- **Rosa Pastel** (#FFB6C1): aksen ilustrasi.
- **Laranja Suave** (#FFA07A): aksen ilustrasi tambahan.
- **Cinza Lápis** (#A9A9A9): garis dekoratif, bukan warna teks utama pada latar terang.

Palet di atas adalah arah ilustrasi, bukan daftar warna karakter. Keenam warna karakter wajib mengikuti [AGENT.md](AGENT.md), termasuk hitam `#000000` dan putih `#FFFFFF`. Gunakan hanya aksen yang relevan per layar dan kedua warna pemain; jangan menampilkan seluruh palet sebagai dekorasi. Warna teks dan latar tombol harus memenuhi kontras WCAG AA; outline menjaga karakter putih/hitam tetap terlihat.


## Typography

- **Judul dan nama permainan:** Permanent Marker untuk mempertahankan gaya gambar tangan.
- **Soal dan kontrol:** gunakan font pendamping yang mudah dibaca dengan ukuran minimal 1rem dan line-height yang cukup. Jangan memaksakan font dekoratif pada angka, opsi panjang, dan ringkasan hasil.
- **Letter spacing:** 0.
- Simpan font yang dipakai secara lokal agar tersedia offline.

Scale:
- Game title: 2rem
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem


## Layout

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Layar:** Menu permainan, kategori, pemilihan warna, siap/hitung mundur, pertandingan, dan hasil.
- **Arena:** Pertahankan dua panel berhadapan sesuai dokumen permainan, bukan layout hero atau bagian promosi.
- **Mobile:** Jangan otomatis menumpuk panel menjadi satu kolom di bawah 768px karena orientasi berhadapan harus dipertahankan. Hitung ukuran panel sebelum rotasi dan sesuaikan arena dengan ruang perangkat; tidak boleh ada horizontal overflow.
- **Viewport:** Gunakan ukuran dinamis dan safe-area inset; seluruh kontrol pertandingan harus terlihat tanpa scroll untuk menjawab.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).


## Elevation & Depth

Gunakan ilustrasi bergaya gambar tangan pada karakter dan arena. Tekstur kertas atau kapur tidak boleh mengganggu gambar soal, angka, dan pilihan jawaban. Animasikan lompatan, gerak memanjat, atau tarikan tali untuk menunjukkan perubahan skor.

- **Physics:** Ease-out curves, 200-300ms duration. Smooth and predictable.
- **Feedback:** Tampilkan status benar/salah tanpa menunda giliran lawan. Hormati `prefers-reduced-motion`.
- **Hover states:** Subtle color shift + shadow adjustment over 200ms.
- **Page transitions:** Fade only (200ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.


## Shapes

Base corner radius: 8px. See rounded tokens in front matter for the full scale.


## Components

- **Primary Button:** Radius 8px, target sentuh minimal 44px, kontras teks yang cukup, serta status focus, active, dan disabled yang terlihat.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Subtly rounded (0.5rem) corners. Surface background. Subtle shadow (0 2px 12px rgba(0,0,0,0.06)). 1px border stroke.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px accent color offset 2px. Error text below in semantic red. No floating labels.
- **Navigation:** Primary surface background. Active item: accent color indicator. Font weight 500 when active.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty States:** Jika bank soal belum tersedia, tampilkan pesan dan jalan kembali ke menu; jangan menampilkan soal palsu.
- **Pemilih warna:** Swatch dengan nama warna, penanda terpilih, dan status tidak tersedia untuk warna lawan.
- **Panel soal:** Renderer jawaban sesuai kategori, skor, nomor soal dari 20, gambar bila diperlukan, serta umpan balik jawaban.
- **Hasil:** Identitas pemenang atau status tanpa pemenang, ringkasan kedua pemain, `Main lagi`, dan `Kembali ke menu`.


## Do's and Don'ts

- No emojis in UI — use icon system only (Lucide, Heroicons)
- Warna hitam murni wajib tersedia sebagai pilihan karakter, bukan sebagai latar seluruh aplikasi.
- Warna identitas pemain mengikuti [AGENT.md](AGENT.md); batas aksen ilustrasi tidak boleh menghapus pilihan warna yang diminta.
- No 3-column equal-width feature layouts — use zig-zag or asymmetric grid
- No `h-screen` — use `min-h-[100dvh]`
- Gunakan label tindakan singkat berbahasa Indonesia sesuai alur permainan.
- Gunakan aset lokal yang sesuai karakter dan materi soal; jangan memakai gambar acak untuk soal identifikasi.
- No generic lorem ipsum in demos

- Pertahankan gaya gambar tangan pada ilustrasi.
- Utamakan keterbacaan soal, fokus keyboard, dan kenyamanan input sentuh dua pemain.
- Gunakan gerak untuk menjelaskan perubahan skor, bukan sebagai dekorasi terus-menerus.


## Cakupan

PWA game edukasi dua pemain secara berhadapan pada satu perangkat mobile, dengan arena Balap Karung, Panjat Pinang, dan Tarik Tambang serta kategori soal yang dapat ditambah.
