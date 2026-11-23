# Tarik Tambang (Berhadapan / Kiri dan Kanan)

Tarik Tambang adalah arena game edukasi dua pemain pada satu perangkat. Materi soal dapat berupa Matematika, Benda dan Bangun Ruang, Jenis Sampah, Bagian Tumbuhan, atau kategori tambahan. Mekanik menarik tali tidak bergantung pada materi soal.

Gunakan [AGENT.md](AGENT.md) untuk aturan React/PWA, bank soal, warna, skor, dan alur pertandingan; gunakan [DESIGN.md](DESIGN.md) untuk arah visual.

## 1. Tata letak

- Gunakan layout landscape bersama dengan Balap Karung dan Panjat Pinang: Pemain 1 di kiri, Pemain 2 di kanan, dan arena di kolom tengah. Pada portrait, tampilkan indikator putar HP dan hentikan input sampai landscape, mengikuti [AGENT.md](AGENT.md).
- Panel Pemain 1 diputar 90 derajat searah jarum jam. Panel Pemain 2 diputar -90 derajat.
- Soal, gambar soal, kontrol jawaban, skor, pemilih warna, dan status siap mengikuti rotasi panel masing-masing.
- Karakter masing-masing pemain mengikuti orientasi panelnya dan memakai atribut sesuai warna pilihan pemain.
- Letakkan arena tali vertikal di tengah dengan tanda tengah dan batas milik kedua pemain: batas Pemain 1 di atas, Pemain 2 di bawah. Panel soal dan kontrol memakai komponen yang sama dengan kedua permainan lainnya.
- Kontrol mengikuti kategori: keypad untuk jawaban angka, pilihan teks/gambar untuk identifikasi atau klasifikasi.

```text
+----------------------------------------------------------+
| Panel Pemain 1       Batas P1          Panel Pemain 2     |
| Rotasi +90           Karakter P1       Rotasi -90         |
| Soal dan gambar          |             Soal dan gambar   |
| Kontrol jawaban       Penanda          Kontrol jawaban   |
| Skor dan nomor soal      |             Skor/nomor soal   |
|                     Karakter P2                          |
|                       Batas P2                           |
+----------------------------------------------------------+
```

## 2. Warna dan persiapan

Sediakan Kuning, Biru, Merah, Hijau, Hitam, dan Putih dengan nilai warna di [AGENT.md](AGENT.md). Pemain 1 memilih terlebih dahulu, kemudian Pemain 2 memilih warna berbeda. Terapkan warna pada karakter, identitas, dan batas arena; sertakan label pemain agar warna bukan satu-satunya pembeda.

Pemilih warna dan tombol `Siap` memakai orientasi masing-masing pemain. Hitung mundur 3 detik dimulai hanya setelah keduanya siap.

## 3. Mekanik menarik tali

- Setiap pemain mendapat 20 soal dari kategori terpilih. Skor awal 0, benar +1, salah -1; pemain pertama mencapai skor bersih 8 menang.
- Jawaban benar meningkatkan tarikan pemain; jawaban salah menguranginya. Skor boleh negatif sesuai aturan bersama.
- Selama pertandingan, posisi penanda tali memvisualisasikan selisih skor: `offset = Math.max(-1, Math.min(1, (scoreP2 - scoreP1) / 8))`. Offset negatif mengarah ke batas Pemain 1 di atas; positif ke batas Pemain 2 di bawah.
- Posisi tali bukan sumber kemenangan. Penanda yang menyentuh batas karena skor lawan negatif tidak otomatis mengakhiri permainan. Contoh: skor 4 melawan -4 belum menghasilkan pemenang.
- Saat seorang pemain mencapai skor 8, tetapkan hasil lalu animasikan penanda ke batas pemenang. Skor 8 melawan 7 tetap merupakan kemenangan meskipun selisihnya hanya 1.
- Ilustrasi pemain memakai warna yang dipilih. Pemain dan tali lurus bergeser bersama penanda; gerakan tarikan muncul sekali ketika pemain menjawab, bukan terus-menerus, dan dinonaktifkan bila perangkat meminta pengurangan gerakan.
- Hentikan input kedua pemain setelah hasil ditetapkan. Jika kedua pemain kehabisan soal tanpa mencapai 8, tampilkan `Tanpa pemenang` sesuai aturan bersama.

## 4. Alur pertandingan

`Menu -> Tarik Tambang -> Kategori -> Warna -> Kedua pemain siap -> 3 detik -> Menarik tali sambil menjawab -> Hasil`

Layar hasil menampilkan pemenang dan ringkasan kedua pemain, serta `Main lagi` dan `Kembali ke menu` sesuai aturan reset di [AGENT.md](AGENT.md).

## 5. Rotasi dan batas arena

```css
.player-1-container,
.player-1-character {
  transform: rotate(90deg);
  transform-origin: center;
}

.player-2-container,
.player-2-character {
  transform: rotate(-90deg);
  transform-origin: center;
}

.game-arena {
  position: relative;
  width: 100%;
}

.boundary-line-p1 {
  position: absolute;
  top: 15%;
  border-top: 2px dashed var(--p1-theme-color);
}

.boundary-line-p2 {
  position: absolute;
  bottom: 15%;
  border-bottom: 2px dashed var(--p2-theme-color);
}
```

Putar setiap panel sekali pada container; jangan memutar ulang anak panel yang sudah ikut berotasi. Selector karakter di atas digunakan untuk karakter yang berada di luar panel tersebut. Hitung ukuran panel sebelum rotasi memakai layout bersama kedua arena lainnya; jangan membuat layout kontrol khusus untuk Tarik Tambang. Tentukan jarak perjalanan penanda dari ukuran arena dan gunakan outline kontras untuk warna putih atau hitam.