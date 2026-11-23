# Panjat Pinang (Berhadapan / Landscape)

Panjat Pinang adalah arena game edukasi dua pemain pada satu perangkat. Materi soal dapat berupa Matematika, Benda dan Bangun Ruang, Jenis Sampah, Bagian Tumbuhan, atau kategori tambahan. Mekanik memanjat tidak bergantung pada materi soal.

Gunakan [AGENT.md](AGENT.md) untuk aturan React/PWA, bank soal, warna, skor, dan alur pertandingan; gunakan [DESIGN.md](DESIGN.md) untuk arah visual.

## 1. Tata letak

- Optimalkan untuk mobile landscape dengan panel Pemain 1 di kiri dan panel Pemain 2 di kanan.
- Panel Pemain 1 diputar 90 derajat searah jarum jam. Panel Pemain 2 diputar -90 derajat.
- Putar soal, gambar soal, kontrol jawaban, skor, pemilih warna, dan status siap bersama panel masing-masing.
- Letakkan tiang Pemain 1 di kanan panel kiri dan tiang Pemain 2 di kiri panel kanan. Kedua tiang berada di bagian tengah layar dengan hadiah di puncak.
- Sediakan satu karakter per tiang dengan atribut sesuai warna pilihan pemain. Karakter memanjat dari dasar ke puncak.
- Kontrol mengikuti kategori: keypad untuk jawaban angka, pilihan teks/gambar untuk identifikasi atau klasifikasi.

```text
+-------------------------------------------------------------+
| Panel Pemain 1      Tiang 1       Tiang 2      Panel Pemain 2 |
| Rotasi +90          Hadiah        Hadiah      Rotasi -90     |
| Soal dan gambar       |             |        Soal/gambar    |
| Kontrol jawaban       ^             ^        Jawaban        |
| Skor dan nomor soal   P1            P2       Skor           |
|                      Dasar         Dasar                   |
+-------------------------------------------------------------+
```

## 2. Mekanik memanjat

- Setiap pemain mendapat 20 soal dari kategori terpilih. Skor awal 0, benar +1, salah -1; pemain pertama mencapai skor bersih 8 menang.
- Jawaban benar membuat karakter naik satu langkah. Jawaban salah pada posisi di atas dasar membuat karakter turun satu langkah. Pada skor 0 atau negatif, jawaban salah tidak mengurangi skor lebih jauh.
- Gunakan `progress = Math.min(8, Math.max(0, score)) / 8` untuk menentukan ketinggian. Skor negatif tetap terlihat pada panel pemain.
- Skor 0 berada di dasar, skor 4 di tengah, dan skor 8 di puncak. Jika skor negatif naik menjadi 0, karakter masih berada di dasar.
- Hadiah diperoleh saat skor mencapai 8. Tentukan kemenangan dari state skor, bukan waktu selesainya animasi atau jumlah jawaban benar saja.
- Hentikan input kedua pemain setelah hasil ditetapkan. Jika kedua pemain kehabisan soal tanpa mencapai 8, tampilkan `Tanpa pemenang` sesuai aturan bersama.

## 3. Alur pertandingan

`Menu -> Panjat Pinang -> Kategori -> Warna -> Kedua pemain siap -> 3 detik -> Memanjat sambil menjawab -> Hasil`

Sediakan enam warna dan cegah pemilihan warna yang sama sesuai [AGENT.md](AGENT.md). Layar hasil menampilkan pemenang dan ringkasan kedua pemain, serta `Main lagi` dan `Kembali ke menu`.

## 4. Rotasi dan ukuran panel

```css
.game-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 100dvh;
}

.team-left-section,
.team-right-section {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.team-left-ui {
  transform: rotate(90deg);
  transform-origin: center;
}

.team-right-ui {
  transform: rotate(-90deg);
  transform-origin: center;
}
```

Urutan elemen kiri adalah panel lalu tiang; urutan kanan adalah tiang lalu panel. Cuplikan ini hanya menunjukkan orientasi. Sesuaikan dimensi panel sebelum rotasi agar soal, gambar, tombol, dan tiang tidak bertumpuk. Pada portrait, tampilkan indikator putar HP dan hentikan input sampai landscape. Kunci orientasi hanya upaya opsional; penolakan browser memakai fallback sesuai [AGENT.md](AGENT.md).