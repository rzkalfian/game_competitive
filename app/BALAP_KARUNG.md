# Balap Karung (Berhadapan / Landscape)

Balap Karung adalah arena game edukasi dua pemain pada satu perangkat. Materi soal dapat berupa Matematika, Benda dan Bangun Ruang, Jenis Sampah, Bagian Tumbuhan, atau kategori tambahan. Mekanik balapan tidak bergantung pada materi soal.

Gunakan [AGENT.md](AGENT.md) untuk aturan React/PWA, bank soal, warna, skor, dan alur pertandingan; gunakan [DESIGN.md](DESIGN.md) untuk arah visual.

## 1. Tata letak

- Gunakan mobile landscape dengan dua panel pemain di kiri dan kanan serta dua jalur vertikal di tengah. Pada portrait, tampilkan indikator putar HP dan hentikan input sampai orientasi sesuai, mengikuti [AGENT.md](AGENT.md).
- Panel Pemain 1 di kiri diputar 90 derajat searah jarum jam. Panel Pemain 2 di kanan diputar -90 derajat.
- Putar soal, gambar soal, kontrol jawaban, skor, pemilih warna, dan status siap bersama panel masing-masing agar menghadap pemain.
- Arena tetap vertikal: start di atas, finish di bawah. Sediakan satu karakter berkarung per jalur dengan atribut sesuai warna pilihan pemain.
- Kontrol mengikuti kategori: keypad untuk jawaban angka, pilihan teks/gambar untuk identifikasi atau klasifikasi.

```text
+----------------------------------------------------------+
|                        START                             |
|                                                          |
| Panel Pemain 1       Jalur 1  Jalur 2      Panel Pemain 2 |
| Rotasi +90              P1      P2         Rotasi -90    |
| Soal dan gambar         |       |          Soal/gambar   |
| Kontrol jawaban         v       v          Jawaban       |
| Skor dan nomor soal                        Skor          |
|                                                          |
|                        FINISH                            |
+----------------------------------------------------------+
```

## 2. Mekanik balapan

- Setiap pemain mendapat 20 soal dari kategori terpilih. Skor awal 0, benar +1, salah -1; pemain pertama mencapai skor bersih 8 menang.
- Jawaban benar membuat karakter melompat satu langkah menuju finish. Jawaban salah mengurangi kemajuan satu langkah setelah karakter memiliki poin. Pada posisi 0 atau awal lintasan, jawaban salah tidak mengurangi skor.
- Karakter memakai aset lokal `balap-karung-chibi-hitam-elegan.svg` dengan warna baju mengikuti pemain. Animasi lompatan diputar sekali setiap jawaban, bukan berulang di menu atau saat jeda. Hormati pengaturan pengurangan gerakan perangkat.
- Posisi karakter diturunkan dari `progress = Math.min(8, Math.max(0, score)) / 8`, bukan dari jumlah benar saja. Skor negatif tetap terlihat pada panel pemain.
- Contoh: skor 4 menempatkan karakter di setengah lintasan; skor 8 menempatkannya di finish. Pada skor -1, karakter tetap di start; jawaban benar berikutnya menghasilkan skor 0 dan belum memajukan karakter.
- Tentukan kemenangan dari state skor sebelum menunggu animasi selesai. Hentikan input kedua pemain setelah hasil ditetapkan.
- Jika kedua pemain kehabisan soal tanpa mencapai 8, tampilkan `Tanpa pemenang` sesuai aturan bersama.

## 3. Alur pertandingan

`Menu -> Balap Karung -> Kategori -> Warna -> Kedua pemain siap -> 3 detik -> Balapan sambil menjawab -> Hasil`

Sediakan enam warna dan cegah pemilihan warna yang sama sesuai [AGENT.md](AGENT.md). Layar hasil menampilkan pemenang dan ringkasan kedua pemain, serta `Main lagi` dan `Kembali ke menu`.

## 4. Rotasi dan ukuran panel

```css
.player-left-container {
  transform: rotate(90deg);
  transform-origin: center;
}

.player-right-container {
  transform: rotate(-90deg);
  transform-origin: center;
}

.track-middle {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 100dvh;
}
```

Cuplikan ini hanya menunjukkan orientasi. Hitung lebar dan tinggi panel sebelum rotasi berdasarkan ruang yang tersedia karena transform tidak mengubah ukuran layout. Arena dan kontrol harus tetap terlihat saat viewport atau orientasi berubah, termasuk area aman perangkat.