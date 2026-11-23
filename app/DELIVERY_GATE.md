# Delivery Gate

Mode: DURING, core saja (pilihan sesi). Cakupan PASS adalah implementasi dan pengujian browser lokal, bukan sertifikasi perangkat fisik atau penilaian guru.

## Hard Gate

| Item | Status | Bukti |
| --- | --- | --- |
| R-02 Teks | PASS | Label Indonesia tanpa em dash atau slogan pemasaran. |
| R-03 Mobile | PASS | Screenshot desktop/mobile dan pemeriksaan bounds pada 320 x 568, 390 x 844, 844 x 390; tombol minimal 44 piksel. |
| R-17 Angka | PASS | Angka berasal dari konfigurasi 20 soal/8 poin dan hasil jawaban pemain, bukan statistik promosi. |
| R-18 Testimoni | PASS | Tidak ada testimoni atau identitas pelanggan fiktif. |
| R-23 Aset | PASS | Konsep karakter kartun, ilustrasi soal, dan ikon dua pemain disetujui pengguna sebelum dibuat. |
| R-24 Navigasi | PASS | Ketiga arena dan keempat kategori memiliki tujuan nyata; kembali ke menu diuji. |
| R-25 Kontras | PASS | Pemeriksaan kontras teks yang dirender pada menu dan pertandingan tidak menemukan pelanggaran; centang hijau memakai warna gelap. |
| R-26 Kontrol | PASS | Menu, kategori, warna, siap, keypad, hapus/kirim, jeda/lanjut, main lagi, dan kembali ke menu diuji. |
| R-27 State | PASS | Loading terlihat saat gambar ditunda; pembatalan permintaan dan error gambar diuji secara terkontrol; bank tidak lengkap ditolak. |
| R-28 FAQ | PASS | Tidak ada FAQ generik. |
| R-32 Keyboard | PASS | Tab/Enter membuka pilihan; fokus 3 piksel terlihat; dialog mendapat fokus dan ditutup lewat Escape serta tombol tutup. |
| R-33 Sumber | PASS | Fitur ditulis langsung pada sumber; skrip hanya memeriksa arsitektur dan merender ikon, bukan mengganti sumber melalui string replacement. |
| R-34 Tema | PASS | Tema terang mengikuti arah desain; keenam warna pemain tersedia dan hitam/putih diberi outline. Tidak ada toggle tema yang belum berfungsi. |
| R-35 Eksekusi | PASS | Build berhasil, 15 tes lulus, 12 kombinasi arena/kategori mencapai hasil, dan preview produksi tidak menghasilkan error pada alur jeda/lanjut. |
| R-36 Klaim | PASS | Tidak ada klaim keamanan, performa, kepatuhan, atau pelanggan yang dibuat-buat; batasan audit dinyatakan. |
| R-37 Arah | PASS | Mengikuti arah gambar tangan pada DESIGN.md; font dekoratif dibatasi pada judul, bukan soal. |
| R-38 Konten | PASS | 80 soal lokal dibuat sesuai kategori; gambar identifikasi adalah bangun yang dimaksud; tidak ada konten promosi palsu. |

## Purpose Gate

| Item | Status | Bukti |
| --- | --- | --- |
| R-01 Warna | PASS | Latar terang dan aksen arena mengikuti arah ilustrasi; tidak ada gradient/glow default. |
| R-04 Ikon | PASS | Calculator, Shapes, Recycle, dan Sprout mewakili materi; ikon kontrol menunjukkan tindakan dan memiliki label. |
| R-06 Tipografi | PASS | Permanent Marker untuk identitas gambar tangan; Nunito untuk keterbacaan soal; letter spacing 0. |
| R-07 Latar | PASS | Tidak ada grid, blueprint, atau pola dekoratif yang mengganggu soal. |
| R-08 Panah | PASS | Panah menunjukkan masuk pilihan atau mengirim jawaban; tidak ditempel pada semua tindakan. |
| R-09 Badge | PASS | Indikator offline menunjukkan cache siap, bukan label pemasaran fiktif. |
| R-10 Blur | PASS | Tidak ada backdrop blur bertumpuk. |
| R-12 Bayangan | PASS | Bayangan ringan membedakan pilihan arena dan batas panel, bukan membuat semua bagian melayang. |
| R-13 Glow | PASS | Tidak ada glow dekoratif. |
| R-14 Kartu | PASS | Kartu menu memuat arena yang berbeda dan dapat dimainkan; bagian halaman tidak disusun sebagai kartu promosi. |
| R-19 Gerak | PASS | Lompatan, pemanjatan, tali, countdown, dan transisi hasil mengomunikasikan state; reduced motion menonaktifkan animasi. |
| R-22 Ilustrasi | PASS | Karakter berkarung, tiang hadiah, tali, dan bangun ruang berhubungan langsung dengan permainan/materi. |

## Liveliness

| Item | Status | Bukti |
| --- | --- | --- |
| Dial eksplisit | PASS | ENERGY 2 / RHYTHM 2 / MOTION 2 diumumkan sebelum implementasi. |
| Konsistensi dial | PASS | Arena ekspresif, kontrol konsisten, gerak singkat untuk kemajuan dan countdown. |
| Fokus | PASS | Menu berfokus pada pilihan arena; setiap panel pemain berfokus pada soal aktif. |
| Ruang | PASS | Ruang memisahkan dua pemain dan arena tengah; kontrol tidak saling menutupi. |
| Aksen | PASS | Identitas pemain dan arena memakai aksen terarah dengan latar netral. |
| Motif | PASS | Garis ilustrasi gelap, karakter kartun, dan judul gambar tangan digunakan konsisten. |
| Design Read | PASS | Arah game anak bergaya gambar tangan dan dial diumumkan sebelum kode UI dibuat. |

## Craftsmanship

| Item | Status | Bukti |
| --- | --- | --- |
| C-1 Intentionality | PASS | Alasan warna, font, layout, ilustrasi, dan gerak dicatat pada README. |
| C-2 Completeness | PASS | Alur menu sampai hasil nyata; instalasi memanggil prompt hanya saat tersedia. Callback prompt diuji lewat event terkontrol. |
| C-3 Content | PASS | Aplikasi membuka menu permainan, bukan hero, pricing, testimoni, atau bagian promosi. |
| C-4 Resilience | PASS | Layout dua orientasi, input salah, tanpa pemenang, bank habis, jeda, reset, error gambar, dan offline diperiksa. |
| C-5 Evidence | PASS | Skor dan ringkasan berasal dari pertandingan; status cache berasal dari service worker. |
| R-05 Struktur | PASS | Menu arena -> materi -> warna -> siap/countdown -> pertandingan -> hasil, sesuai kebutuhan game. |
| R-11 Radius | PASS | Tombol/panel menggunakan radius 6-8 piksel; swatch bulat karena merepresentasikan warna. |
| R-15 Tindakan | PASS | Label Siap, Main lagi, Kembali ke menu, dan Perbarui aplikasi menyebut tindakan yang terjadi. |
| R-16 Bahasa | PASS | Tidak ada buzzword AI atau CTA generik. |
| R-20 Identitas | PASS | Ketiga arena menampilkan karakter dan alat permainan tradisional, bukan ilustrasi generik. |
| R-21 Tema | PASS | Tema terang dipilih dari DESIGN.md untuk arena ilustrasi dan soal anak; bukan dark mode default. |
| R-29 Palet | PASS | Enam swatch adalah pilihan fungsional yang diminta; saat bermain hanya dua warna tim, aksen arena, dan warna netral. |
| R-30 Orisinalitas | PASS | Tidak menyalin layout produk populer; komposisi mengikuti dua pemain berhadapan. |
| R-31 Alasan | PASS | Keputusan visual utama dijelaskan pada README. |

## Batas Verifikasi

Instalasi native Android/iOS dan multitouch pada perangkat fisik belum diuji. Petunjuk iOS, fokus dialog, Escape, tombol tutup, serta callback instalasi diuji dengan simulasi browser. Offline diuji dengan menghentikan server preview, memuat ulang aplikasi, memulai pertandingan, dan memuat keenam gambar dari cache. Pembaruan worker diuji melalui tombol di menu setelah build baru.

Audit dependensi produksi bersih; alat build PWA masih memiliki 6 kerentanan transitif (2 low, 4 moderate). Tidak menjalankan downgrade breaking otomatis. Peninjauan guru untuk tingkat kesulitan dan materi sebelum rilis sekolah tetap diperlukan.

## Pembaruan Layout Tarik Tambang

- R-03 PASS: Tarik Tambang kini memakai `side-layout` bersama Balap Karung dan Panjat Pinang, dengan rotasi panel +90/-90 derajat. Keempat kategori diuji pada portrait 320 x 568 dan landscape 844 x 390 tanpa overflow atau tombol keluar panel; target sentuh tetap minimal 44 piksel.
- R-26 PASS: Pemilihan warna, siap/countdown, jawaban matematika, kemenangan pada skor 8, dan main lagi diuji pada layout baru. Tali vertikal bergerak ke batas Pemain 1 setelah jawaban benar.
- R-19/R-22 PASS: Arena tali vertikal diperiksa melalui screenshot portrait; karakter mengikuti orientasi pemain dan ilustrasi menu tetap tersedia.
- R-35 PASS: 15 tes otomatis, lint, dan build produksi lulus. Aturan skor serta bank soal tidak diubah; panduan TARIK_TAMBANG.md diselaraskan dengan layout baru.

## Orientasi Landscape Semua Game

- R-03/R-26 PASS: Indikator `Putar HP` muncul pada portrait, panel memakai `inert`, dan indikator hilang otomatis pada landscape. Browser menguji penolakan fullscreen/kunci orientasi, tombol mencoba kembali, serta jeda ketika layar kembali portrait.
- R-19 PASS: Ikon smartphone memperlihatkan gerakan menuju landscape; reduced motion mengikuti aturan global aplikasi.
- R-35 PASS: 21 tes lulus, termasuk enam tes adapter orientasi untuk fullscreen, standalone, API ditolak/tidak tersedia, listener resize, dan kepemilikan fullscreen. Build fitur berhasil; dukungan auto-lock pada Android/iOS fisik belum diverifikasi.