   # Panduan Pengembangan Game Edukasi Dua Pemain

## 1. Tujuan dan teknologi

Bangun aplikasi game edukasi untuk anak menggunakan React dengan JavaScript atau TypeScript. React adalah library antarmuka, bukan bahasa pemrograman. Aplikasi dimainkan oleh tepat dua pemain secara berhadapan pada satu perangkat (local multiplayer), tanpa akun atau server multiplayer.

Aplikasi harus berupa Progressive Web App (PWA) yang dapat dipasang di perangkat mobile:

- Sediakan web app manifest dengan nama aplikasi, `start_url`, `scope`, `display: standalone`, warna tema, serta ikon ukuran 192 dan 512 piksel dan ikon maskable.
- Gunakan service worker untuk menyimpan app shell, bank soal, gambar soal, karakter, dan font lokal agar permainan dapat digunakan offline setelah pemuatan dan cache pertama berhasil.
- Gunakan HTTPS pada deployment; localhost dapat digunakan saat pengembangan.
- Tampilkan tombol instalasi hanya ketika browser mendukung prompt instalasi. Untuk iOS, sediakan petunjuk melalui menu berbagi dan Add to Home Screen.
- Jangan mengaktifkan pembaruan service worker di tengah pertandingan. Tawarkan pembaruan saat pemain kembali ke menu.

Dokumen ini menjadi sumber aturan bersama. Detail arena terdapat di [BALAP_KARUNG.md](BALAP_KARUNG.md), [PANJAT_PINANG.md](PANJAT_PINANG.md), dan [TARIK_TAMBANG.md](TARIK_TAMBANG.md). Arah visual terdapat di [DESIGN.md](DESIGN.md). Jika aturan skor atau alur berbeda, gunakan aturan di dokumen ini.

Nama `AGENT.md` mengikuti permintaan pemilik proyek. File ini merupakan panduan proyek; jangan mengasumsikan semua alat AI membacanya otomatis. Cantumkan atau lampirkan file ini saat meminta implementasi.

## 2. Permainan dan kategori soal

Pisahkan jenis permainan (arena) dari kategori soal (materi belajar). Semua kategori harus bisa dimainkan pada semua arena.

| Jenis permainan | Mekanik arena |
| --- | --- |
| Balap Karung | Melompat dari start menuju finish |
| Panjat Pinang | Memanjat tiang dari dasar menuju hadiah |
| Tarik Tambang | Menarik tali berdasarkan kemajuan kedua pemain |

| Kategori soal | Materi | Kontrol jawaban |
| --- | --- | --- |
| Matematika | Operasi hitung dasar | Keypad angka dan tombol kirim |
| Benda dan Bangun Ruang | Mengenali bentuk benda, seperti kubus, balok, bola, tabung, kerucut, dan limas | Pilihan teks atau gambar |
| Jenis Sampah | Mengelompokkan sampah organik, anorganik, dan B3 dengan contoh yang tidak ambigu | Pilihan teks atau gambar |
| Bagian Tumbuhan | Mengenali akar, batang, daun, bunga, buah, dan biji | Pilihan teks atau gambar |

Penambahan kategori baru tidak boleh mengharuskan perubahan aturan skor, pemilihan warna, atau logika kemenangan. Jangan memasang keypad angka pada semua kategori.

## 3. Bank soal

- Sediakan 20 soal berbeda untuk setiap kategori pada setiap permainan, bukan 20 soal yang dibagi ke seluruh kategori.
- Bank kategori yang sama boleh dipakai ulang oleh ketiga arena. Empat bank berisi masing-masing 20 soal (80 soal unik) sudah mencukupi jika seluruh kombinasi arena dan kategori dapat mengakses bank lengkapnya.
- Kedua pemain memakai 20 soal yang sama dengan urutan yang sama dalam satu pertandingan agar tingkat kesulitan setara. Acak urutan bank sekali saat pertandingan dimulai, lalu salin urutan tersebut untuk kedua pemain.
- Simpan indeks soal secara terpisah. Pemain tidak perlu menunggu lawan untuk menjawab soal berikutnya.
- Setiap soal hanya boleh dijawab sekali oleh masing-masing pemain. Jawaban benar maupun salah membawa pemain ke soal berikutnya; jangan mengulang soal untuk menambah skor.
- Pisahkan data soal dari komponen React dan animasi arena. Setiap soal memiliki `id` unik, `categoryId`, `prompt`, `answerType`, `correctAnswer`, dan `explanation`. Sertakan `options` untuk pilihan jawaban serta `image` dan `imageAlt` jika memakai gambar.
- Nilai pilihan menggunakan ID opsi, bukan posisi tampilannya. Normalisasikan jawaban angka sebelum membandingkan; input kosong atau tidak valid tidak dihitung sebagai jawaban salah.
- Untuk soal identifikasi gambar, tampilkan gambar lokal yang benar-benar sesuai materi. Teks alternatif mendeskripsikan gambar tanpa membocorkan jawaban.
- Tinjau ketepatan materi dan pastikan setiap soal memiliki tepat satu jawaban benar. Jangan memulai pertandingan jika bank tidak berisi 20 soal valid atau aset soal gagal dimuat; tampilkan pesan dan pilihan kembali ke menu.

Dokumen ini menetapkan kewajiban penyediaan bank soal saat implementasi; bank soal aplikasi belum dibuat dalam dokumen ini.

## 4. Skor dan kemenangan

| Aturan | Nilai |
| --- | --- |
| Skor awal setiap pemain | 0 |
| Jawaban benar | +1 |
| Jawaban salah | -1 |

Untuk Panjat Pinang dan Balap Karung, jawaban salah pada posisi 0 atau negatif tidak mengurangi skor. Pengurangan -1 aktif setelah karakter memiliki poin di atas dasar atau start.
| Target kemenangan | Skor bersih 8 |
| Batas soal per pemain | 20 |

Delapan jawaban benar tanpa kesalahan cukup untuk menang. Jika ada jawaban salah, pemain membutuhkan jawaban benar tambahan untuk mencapai skor bersih 8. Contoh: 9 benar dan 1 salah menghasilkan skor 8.

- Skor boleh negatif: jawaban salah pada skor 0 menghasilkan -1. Jangan diam-diam membatasi pengurangan skor pada 0.
- Untuk posisi karakter Balap Karung dan Panjat Pinang, gunakan `progress = Math.min(8, Math.max(0, score)) / 8`. Skor negatif tetap ditampilkan, tetapi karakter tidak keluar dari dasar arena.
- Pemain pertama yang mencapai skor 8 menang. Selisih skor lawan tidak menjadi syarat tambahan.
- Proses jawaban dan penentuan pemenang melalui satu pengelola state pertandingan agar ketukan bersamaan tidak menghasilkan dua pemenang. Setelah pemenang ditetapkan, abaikan jawaban berikutnya.
- Jika seorang pemain menghabiskan 20 soal tanpa mencapai target, nonaktifkan kontrolnya dan biarkan lawan menyelesaikan soal yang tersisa.
- Jika kedua pemain menghabiskan soal tanpa mencapai skor 8, akhiri dengan status `Tanpa pemenang`. Jangan menetapkan pemenang hanya berdasarkan skor tertinggi.
- Simpan skor, jumlah benar, jumlah salah, dan jumlah soal terjawab secara terpisah. Skor menentukan kemenangan; jumlah benar saja tidak cukup.

## 5. Pemilihan warna dan karakter

| Warna | Nilai |
| --- | --- |
| Kuning | `#EAB308` |
| Biru | `#3B82F6` |
| Merah | `#EF4444` |
| Hijau | `#22C55E` |
| Hitam | `#000000` |
| Putih | `#FFFFFF` |

- Setiap pemain memilih tepat satu warna untuk karakter atau atribut karakternya. Terapkan warna yang sama pada identitas pemain, indikator kemajuan, dan hasil pertandingan.
- Pemain 1 memilih terlebih dahulu, kemudian pemain 2. Warna milik lawan tidak dapat dipilih; validasi juga dalam state, bukan hanya tampilan tombol.
- Tampilkan swatch dengan nama warna, status terpilih, dan status tidak tersedia. Jangan membedakan pemain hanya melalui warna; sertakan label Pemain 1/Pemain 2.
- Sediakan kontras teks dan outline yang sesuai. Karakter putih harus terlihat pada latar terang, karakter hitam pada latar gelap; warna identitas tidak harus menjadi warna teks.
- Kedua pemain harus mengonfirmasi `Siap` sebelum hitung mundur dimulai. Perubahan pilihan warna membatalkan status siap pemain tersebut.

## 6. Alur layar

`Menu permainan -> Pilih kategori soal -> Pilih warna -> Siap -> Hitung mundur 3 detik -> Mengerjakan soal -> Hasil pertandingan`

1. Menu menampilkan Balap Karung, Panjat Pinang, dan Tarik Tambang. Layar pertama adalah menu yang dapat digunakan, bukan landing page promosi.
2. Setelah memilih permainan, pilih satu kategori untuk kedua pemain. Tampilkan arena dan kategori terpilih sebelum masuk pemilihan warna.
3. Kedua pemain memilih warna berbeda dan melihat pratinjau karakter sesuai pilihannya, dengan orientasi mengikuti permainan.
4. Setelah kedua pemain menekan `Siap`, tampilkan `3`, `2`, `1`, masing-masing selama satu detik, lalu `Mulai`. Kontrol jawaban tetap nonaktif sebelum pertandingan dimulai.
5. Saat bermain, kedua sisi menampilkan soal masing-masing, kontrol yang sesuai kategori, skor, dan nomor soal dari 20. Beri umpan balik benar/salah tanpa menghentikan lawan.
6. Hentikan pertandingan saat skor 8 tercapai atau kedua bank habis. Tampilkan nama/nomor pemain pemenang, warna karakter, serta ringkasan skor, benar, dan salah kedua pemain. Jika tidak ada yang mencapai target, tampilkan `Tanpa pemenang`.
7. Sediakan `Main lagi` dan `Kembali ke menu`. Main lagi memakai arena, kategori, dan warna yang sama, tetapi mereset skor, indeks soal, status siap, dan hasil; acak ulang bank dan jalankan proses siap serta hitung mundur lagi.

Jika aplikasi masuk latar belakang, jeda pertandingan untuk kedua pemain. Saat kembali, minta kedua pemain siap dan ulangi hitung mundur 3 detik sebelum melanjutkan; jangan mereset skor atau soal. Jika aplikasi dimuat ulang, kembali ke menu tanpa mengklaim pertandingan lama masih berlangsung.

Semua permainan memakai orientasi landscape (HP mendatar), dengan panel Pemain 1 di kiri berotasi +90 derajat dan Pemain 2 di kanan berotasi -90 derajat. Saat kategori dipilih melalui aksi ketuk, coba kunci orientasi landscape; gunakan fullscreen jika browser membutuhkannya. Jika API tidak tersedia atau ditolak, tampilkan indikator `Putar HP` dengan animasi rotasi dan tombol mencoba kembali. Jangan meminta akses sensor gerak hanya untuk membaca orientasi viewport.

Panel permainan tidak menerima input dan countdown tidak berjalan selama viewport masih portrait. Indikator hilang otomatis ketika layar sudah landscape. Jika pemain memutar HP kembali ke portrait saat bermain, jeda pertandingan tanpa mengubah skor atau indeks soal; setelah kembali landscape, kedua pemain siap dan countdown diulang. Saat kembali ke menu, lepaskan kunci orientasi serta fullscreen yang dibuka aplikasi, bukan fullscreen milik pihak lain.

## 7. Struktur implementasi (Clean Architecture)

Gunakan Clean Architecture dengan arah dependensi menuju aturan permainan, bukan menuju React atau API browser. Terapkan struktur berikut secara bertahap; buat file hanya ketika diperlukan oleh implementasi.

```text
src/
	domain/
		entities/
			player.ts
			question.ts
			match.ts
		rules/
			gameRules.ts
			evaluateAnswer.ts
			updateScore.ts
			determineResult.ts
	application/
		ports/
			questionRepository.ts
		useCases/
			prepareMatch.ts
			selectPlayerColor.ts
			setPlayerReady.ts
			startMatch.ts
			submitAnswer.ts
			pauseMatch.ts
			resumeMatch.ts
			restartMatch.ts
	infrastructure/
		data/
			questions/
				mathematics.json
				solidShapes.json
				wasteTypes.json
				plantParts.json
		repositories/
			localQuestionRepository.ts
		pwa/
			registerServiceWorker.ts
		browser/
			pageVisibility.ts
	presentation/
		components/
			ColorSelector.tsx
			Countdown.tsx
			QuestionPanel.tsx
			AnswerRenderer.tsx
		screens/
			GameMenu.tsx
			CategorySelection.tsx
			Lobby.tsx
			MatchScreen.tsx
			ResultScreen.tsx
		arenas/
			SackRaceArena.tsx
			PoleClimbArena.tsx
			TugOfWarArena.tsx
		state/
			matchReducer.ts
		hooks/
			useMatch.ts
		styles/
	bootstrap/
		createGame.ts
	App.tsx
	main.tsx
public/
	manifest.webmanifest
	icons/
	images/
	fonts/
```

Contoh menggunakan TypeScript (`.ts`/`.tsx`); jika memilih JavaScript, gunakan `.js`/`.jsx` dengan kontrak data dan batas lapisan yang sama. Lokasi service worker hasil build mengikuti integrasi PWA yang dipilih; jangan menganggap folder registrasi di atas sebagai lokasi worker yang diakses browser.

### 7.1. Tanggung jawab lapisan

- `domain` berisi model pemain, soal, pertandingan, serta aturan validasi jawaban, skor, dan hasil. Gunakan fungsi murni; lapisan ini tidak mengimpor React, DOM, penyimpanan browser, data JSON, atau service worker.
- `application` menjalankan use case dan mengatur transisi pertandingan menggunakan aturan domain. `submitAnswer` memvalidasi fase, pemain, dan ID soal, lalu memperbarui skor, indeks, dan hasil sebagai satu transisi. Definisikan kontrak `QuestionRepository` di sini untuk mengambil bank soal tanpa mengetahui sumber datanya.
- `infrastructure` menyediakan implementasi kontrak pengambilan soal melalui data lokal, registrasi PWA, dan adapter API browser. Lapisan ini tidak menentukan skor atau pemenang.
- `presentation` berisi komponen React, layar, animasi arena, styling, hooks, serta adapter state UI. Lapisan ini menerjemahkan interaksi menjadi pemanggilan use case dan menampilkan hasilnya; jangan menghitung ulang aturan bisnis dalam komponen.
- `bootstrap` menjadi composition root: buat repository konkret, hubungkan dengan use case, lalu injeksikan layanan aplikasi ke React melalui props atau context. Hanya titik perakitan ini yang perlu mengetahui implementasi konkret dan UI sekaligus.

### 7.2. Arah dependensi dan alur data

```text
application -> domain
infrastructure -> application (ports), domain (model bila diperlukan)
presentation -> application, domain (model baca-saja bila diperlukan)
bootstrap -> infrastructure, application, presentation
```

- `domain` tidak bergantung pada lapisan lain. `application` tidak mengimpor `presentation` atau `infrastructure`.
- `presentation` tidak mengimpor repository konkret, file bank soal, atau adapter browser dari `infrastructure`; terima layanan atau callback yang sudah dirakit oleh `bootstrap`.
- Alur jawaban: kontrol React -> dispatch aksi -> use case `submitAnswer` -> aturan domain -> state pertandingan baru -> render panel dan arena. Jangan memutasi state lama.
- Pengambilan soal dan efek browser dilakukan di luar reducer. Reducer boleh memanggil transisi use case yang murni, tetapi tidak menjalankan I/O, timer, atau pengacakan yang berubah setiap pemanggilan.
- Saat persiapan pertandingan, siapkan urutan acak sekali di luar reducer lalu berikan urutan tersebut sebagai input transisi agar kedua pemain mendapat urutan yang sama dan pengujian dapat diulang.
- Timer hitung mundur dan kejadian aplikasi masuk latar belakang menghasilkan aksi ke application; validasi perpindahan fase tetap berada pada use case, bukan hanya pada tombol UI.
- Jangan menambahkan base class, container dependency injection, atau interface untuk setiap fungsi. Gunakan interface/kontrak hanya pada batas yang membutuhkan implementasi eksternal, seperti repository soal.

### 7.3. Komponen dan state pertandingan

- Pisahkan menu, pemilih kategori, pemilih warna, hitung mundur, panel soal, renderer jawaban, arena, dan layar hasil menjadi komponen sesuai tanggung jawab.
- Gunakan pengelola state bersama (misalnya React reducer) untuk fase pertandingan, identitas dan warna pemain, skor, urutan soal, indeks masing-masing pemain, serta hasil.
- Simpan aturan umum pada `domain/rules/gameRules`: `questionCount: 20`, `winningScore: 8`, `correctDelta: 1`, dan `wrongDelta: -1`. Semua arena menerima konfigurasi atau kemajuan turunan melalui state/props yang sama.
- Arena hanya memvisualisasikan state pertandingan. Jangan menyalin aturan kemenangan ke setiap animasi atau kategori.
- Batasi satu pengiriman jawaban per ID soal dan pemain. Bersihkan timer ketika fase berubah atau komponen dilepas agar hitung mundur tidak berjalan ganda.
- Kedua pemain harus bisa menekan kontrol bersamaan melalui input sentuh. Hindari zoom tidak disengaja pada kontrol tanpa mematikan kemampuan zoom aksesibilitas di seluruh aplikasi.
- Gunakan area aman perangkat, ukuran viewport dinamis, dan perhitungan ukuran panel setelah rotasi. Jangan mengandalkan kunci orientasi layar karena dukungan browser berbeda.

## 8. Kriteria penerimaan

- Uji aturan domain tanpa React atau browser; uji use case menggunakan repository soal pengganti, lalu uji interaksi React dan integrasi PWA secara terpisah.
- Verifikasi batas import dengan lint atau pemeriksaan arsitektur: `domain` tidak mengimpor lapisan luar, `application` tidak mengimpor React/infrastructure/presentation, dan `presentation` tidak mengakses infrastructure secara langsung.
- Ketiga permainan mendukung keempat kategori; setiap kombinasi menyediakan bank 20 soal valid.
- Uji skor 0 menjadi 1 saat benar dan menjadi -1 saat salah; 7 menjadi 8 menghasilkan kemenangan; 7 menjadi 6 tidak menghasilkan kemenangan.
- Uji 8 benar tanpa salah, 9 benar dengan 1 salah, serta 8 benar dengan 1 salah yang belum mencapai target.
- Uji pemain yang kehabisan soal, kedua pemain tanpa skor 8, ketukan jawaban ganda, ketukan dua pemain bersamaan, dan input setelah hasil ditetapkan.
- Keenam warna tersedia; warna yang sama ditolak; karakter putih dan hitam tetap terlihat.
- Hitung mundur berlangsung 3 detik dan tidak menerima jawaban sebelum selesai. Main lagi dan kembali ke menu membersihkan state serta timer yang relevan.
- Uji panel berhadapan dan tombol pada mobile portrait/landscape tanpa teks bertumpuk atau keluar layar; sediakan target sentuh minimal 44 piksel, fokus keyboard, dan label kontrol.
- Uji permintaan landscape melalui aksi ketuk, fallback saat API ditolak/tidak tersedia, penghentian input pada portrait, jeda ketika orientasi berubah, dan pelepasan kunci saat kembali ke menu. Verifikasi kunci orientasi native pada perangkat nyata sebelum mengklaim dukungan platform tertentu.
- Verifikasi instalasi PWA pada browser yang mendukung dan permainan offline setelah cache siap, termasuk gambar dan font. Catat jika pengujian perangkat nyata belum dilakukan.

<!-- antislop:start -->
## antislop

Untuk pekerjaan UI, baca skill `antislop` dan gunakan skill terkait yang tersedia:
`antislop-ui`, `antislop-copywriting`, `antislop-human`,
`antislop-layoutmobile`, dan `antislop-code`. Skill pada mesin ini berada di
`~/.agents/skills/<nama-skill>/SKILL.md`. Ikuti pilihan mode antislop pengguna
dan arah visual di [DESIGN.md](DESIGN.md).
<!-- antislop:end -->