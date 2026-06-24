# Bahan Presentasi — DTSEN Desa

Berkas ini berisi semua yang Anda butuhkan untuk membuat **bahan tayang (slide) presentasi**
kepada pemerintah desa, dengan bantuan LLM (Claude untuk membuat slide, atau NotebookLM
untuk ringkasan/audio).

Isi:
- **Bagian A — PROMPT siap-tempel ke Claude** (menghasilkan slide presentasi HTML interaktif)
- **Bagian B — BAHAN SUMBER / Naskah** (untuk NotebookLM atau sebagai materi baca)
- **Bagian C — Panduan singkat pemakaian**

---

## BAGIAN A — Prompt siap-tempel ke Claude (membuat slide)

> Salin **seluruh blok di dalam kotak di bawah ini** (mulai dari "Kamu adalah…" sampai
> akhir) lalu tempel ke Claude (claude.ai). Claude akan menghasilkan presentasi sebagai
> *artifact* HTML yang bisa langsung Anda tampilkan/full-screen dan ekspor.

```
Kamu adalah seorang desainer presentasi profesional. Buatkan SATU file presentasi HTML
interaktif (satu artifact, gunakan navigasi panah kiri/kanan antar slide, satu slide
satu layar penuh 16:9) untuk dipresentasikan kepada PEMERINTAH DESA (Kepala Desa,
perangkat desa, BPD, dan operator).

KONTEKS AUDIENS: pejabat desa yang AWAM teknologi. Hindari istilah teknis (React,
localStorage, API, dsb.). Fokus pada MANFAAT, kemudahan, transparansi, dan akuntabilitas.
Bahasa: Indonesia, sopan, jelas, meyakinkan, tidak bertele-tele.

GAYA VISUAL:
- Bersih, modern, "pemerintahan yang rapi". Warna aksen biru (#1e50d0) dan oranye (#e0701f).
- Font sans-serif (mis. Plus Jakarta Sans / Inter). Judul besar tegas, isi ringkas (poin,
  bukan paragraf panjang). Gunakan ikon/emoji seperlunya, banyak ruang kosong.
- Setiap slide: judul jelas + 3–5 butir maksimal. Sertakan nomor slide & footer kecil
  "DTSEN Desa — BPS Kabupaten Buleleng".
- Tambahkan progress bar / indikator slide. Bisa dibuka di proyektor (kontras tinggi).

JUMLAH SLIDE: sekitar 11 slide. FOKUS UTAMA pada APLIKASI dan fitur-fiturnya — latar
belakang cukup DISINGGUNG ringkas di satu slide, jangan dibahas panjang. Untuk setiap
slide saya beri JUDUL dan ISI inti; kembangkan kalimatnya agar enak dibaca, tetapi jangan
menambah klaim yang tidak ada di bahan.

URUTAN & ISI SLIDE:

1. SAMPUL — "DTSEN Desa" / Subjudul: "Aplikasi Pemutakhiran Data Sosial-Ekonomi Warga Desa".
   Baris bawah: "Badan Pusat Statistik (BPS) Kabupaten Buleleng · 2026". Sediakan ruang logo.

2. SEKILAS LATAR (singkat saja, 1 slide) —
   - DTSEN = Data Terpadu Sosial Ekonomi Nasional, dasar penetapan penerima bansos (PKH,
     BPNT, PBI-JKN). Perlu dimutakhirkan berkala oleh desa agar tepat sasaran.
   - Selama ini: data manual rawan salah, kedaluwarsa, dan sulit dipantau.
   - Maka dibuat APLIKASI DTSEN DESA — bisa dibuka di HP/laptop lewat browser, tanpa instal.
   (Cukup 3 butir ringkas; jangan jadikan slide masalah yang panjang.)

3. FITUR — KUESIONER RESMI YANG LENGKAP —
   - Mengikuti persis kuesioner resmi FASIH "Pemutakhiran DTSEN".
   - 5 bagian: Identitas Keluarga; Kondisi Perumahan; Kepemilikan Aset; Anggota Keluarga
     (per orang); serta Catatan.
   - Termasuk rincian rumah (lantai, dinding, atap, air, sanitasi, listrik/meteran) dan
     data tiap anggota (pendidikan, pekerjaan, penghasilan, disabilitas, kesehatan).

4. FITUR — VALIDASI OTOMATIS (data anti-salah) —
   - Aplikasi otomatis memeriksa isian: menandai KESALAHAN (mis. NIK/No. KK bukan 16 digit,
     kepala keluarga ganda) dan PERINGATAN.
   - Data TIDAK BISA difinalisasi bila masih ada kesalahan → hasil pendataan lebih bersih.
   - Boleh disimpan sebagai DRAF kapan saja, lalu dilanjutkan nanti.

5. FITUR — PERHITUNGAN DESIL OTOMATIS —
   - Aplikasi menghitung "desil" (peringkat kesejahteraan 1–10) secara otomatis dari isian.
   - Desil 1–4 = kelompok prioritas penerima bantuan.
   - Transparan dan konsisten: penilaian memakai aturan yang sama untuk semua warga.

6. FITUR — DASHBOARD RINGKASAN DESA —
   - Sekali lihat: jumlah keluarga terdata, jumlah keluarga prioritas, jumlah penerima bansos.
   - Grafik sebaran desil 1–10 seluruh desa.
   - Peringatan otomatis bila status kesejahteraan keluarga NAIK (berisiko keluar dari bansos)
     atau TURUN (berpotensi layak masuk bansos).

7. FITUR — RIWAYAT PERUBAHAN (jejak yang jujur) —
   - Setiap pemutakhiran tersimpan sebagai "potret" (snapshot) bertanggal.
   - Bisa dibandingkan: field apa saja yang berubah, oleh siapa, kapan.
   - Dilengkapi foto rumah (tampak depan, ruang tamu, kamar mandi) sebagai bukti.

8. FITUR — SANGGAHAN WARGA (saluran keberatan) —
   - Warga / RT / kelian banjar bisa mengajukan keberatan bila merasa data atau statusnya keliru.
   - Alur jelas: Diajukan → Diproses → Diterima / Ditolak, lengkap dengan catatan petugas.
   - Menambah rasa adil dan keterbukaan; mengurangi protes/konflik.

9. FITUR — HAK AKSES BERJENJANG, OFFLINE & ONLINE —
   - Operator & Kepala Desa: bisa kelola data; Kepala SLS / Kelian Banjar Dinas: HANYA MELIHAT
     dan hanya untuk wilayahnya. Setiap perubahan tercatat atas nama petugas → akuntabel.
   - Bisa dipakai TANPA INTERNET (cocok daerah sinyal lemah); data aman di perangkat.
   - Bila daring, tersinkron ke pusat data desa & foto tersimpan rapi. Ringan, cukup browser.

10. MANFAAT UNTUK DESA (rangkuman) —
    - TEPAT SASARAN — bantuan sampai ke yang berhak.
    - TRANSPARAN — ada riwayat & saluran sanggahan.
    - CEPAT & MUDAH — pendataan terstruktur, validasi otomatis.
    - AKUNTABEL & HEMAT — hak akses jelas, tanpa perangkat mahal.

11. COBA SEKARANG —
    - Alamat aplikasi: https://bpsbuleleng.github.io/descan2026
    - Akun demo: operator / operator123 (bisa kelola) — kepaladesa / desa123 — sls.tembok / sls123 (lihat saja).
    - Ucapan terima kasih + kontak BPS Kabupaten Buleleng (email: bpsbuleleng5108@gmail.com).

Pastikan presentasi rapi, profesional, dan SIAP DITAMPILKAN di proyektor. Sertakan tombol
"layar penuh". Jangan menambahkan data/angka yang tidak saya berikan.
```

---

## BAGIAN B — Bahan Sumber / Naskah (untuk NotebookLM atau materi baca)

> Untuk **NotebookLM**: buat notebook baru, lalu tambahkan teks di bawah ini sebagai
> *source* (atau simpan sebagai PDF/doc lalu unggah). Setelah itu Anda bisa minta NotebookLM
> membuat ringkasan, daftar pertanyaan-jawaban, atau "Audio Overview" (podcast) sebagai
> bahan latihan presentasi. Naskah ini juga bisa Anda baca langsung sebagai bahan bicara.

### Ringkasan Eksekutif

**DTSEN Desa** adalah aplikasi untuk membantu pemerintah desa **memutakhirkan dan memantau
data sosial-ekonomi warga**, yang menjadi dasar penetapan penerima bantuan sosial (bansos)
seperti PKH, BPNT, dan PBI-JKN. Aplikasi dibangun oleh **BPS Kabupaten Buleleng**, mengikuti
**kuesioner resmi FASIH "Pemutakhiran DTSEN PBI 2026"**. Aplikasi sudah dapat diakses dan
dicoba di **https://bpsbuleleng.github.io/descan2026**.

### Masalah yang Diselesaikan

1. **Data kedaluwarsa / tidak akurat** → bantuan salah sasaran (warga mampu menerima,
   warga miskin terlewat).
2. **Pendataan manual** (kertas/Excel terpisah) rawan salah tulis dan sulit dikonsolidasi.
3. **Sulit dipantau**: pemerintah desa tidak punya gambaran cepat kondisi kesejahteraan warga.
4. **Tidak ada saluran keberatan** yang jelas bagi warga yang merasa datanya keliru.
5. **Tidak ada jejak perubahan**: tidak diketahui data berubah kapan, oleh siapa, dan apa.

### Apa Itu DTSEN

DTSEN (Data Terpadu Sosial Ekonomi Nasional) adalah basis data tunggal nasional yang dipakai
pemerintah untuk menargetkan program bantuan dan pemberdayaan. Agar adil dan tepat sasaran,
DTSEN harus **dimutakhirkan berkala**, dan **desa** adalah pihak yang paling mengetahui kondisi
riil warganya. Tahun 2026 dilakukan **Pemutakhiran DTSEN PBI** memakai instrumen/kuesioner resmi.

### Fitur Utama (lengkap)

1. **Kuesioner FASIH lengkap.** Form pendataan per keluarga mengikuti persis kuesioner resmi,
   terdiri atas: Blok I Identitas Keluarga; Blok II Keterangan Perumahan (jenis & status rumah,
   bahan/kondisi lantai-dinding-atap, sanitasi/jamban, sumber air minum, sumber penerangan &
   daftar meteran listrik, pengeluaran listrik/pulsa/internet); Blok III Kepemilikan Aset
   (tabung gas, kulkas, AC, emas, komputer, sepeda motor, mobil, lahan/bangunan lain); Blok IV
   Anggota Keluarga per orang (identitas & NIK, jenis kelamin, tanggal lahir/umur, status kawin,
   hubungan dengan kepala keluarga, pendidikan, tiga jenis penghasilan, profesi & status
   pekerjaan, **disabilitas**, riwayat **kesehatan/penyakit**, kepemilikan rekening); serta Catatan.

2. **Validasi otomatis.** Aplikasi memeriksa isian dan menandai tiga tingkat: **GALAT** (kesalahan
   yang wajib diperbaiki, mis. NIK/No. KK harus 16 digit, ID/No. meteran harus jumlah digit
   tertentu, harus tepat satu Kepala Keluarga, jenis kelamin pasangan harus berbeda, luas rumah
   harus lebih dari nol), **PERINGATAN**, dan **KOSONG** (isian opsional yang belum diisi). Data
   **hanya bisa difinalisasi bila tidak ada GALAT (kesalahan = 0)**; **draf** boleh disimpan kapan saja.

3. **Perhitungan desil otomatis.** Aplikasi menghitung "desil" (peringkat kesejahteraan 1–10)
   dari kombinasi penghasilan, kondisi rumah, aset, pekerjaan, dan pendidikan. **Desil 1–4 =
   kelompok prioritas** penerima bantuan. Penilaian memakai aturan yang sama untuk semua →
   konsisten dan transparan.

4. **Dashboard ringkasan desa.** Menampilkan total keluarga terdata, jumlah keluarga prioritas,
   jumlah penerima bansos, **grafik sebaran desil 1–10**, dan **daftar peringatan perubahan**:
   keluarga yang desil-nya **naik** (berisiko keluar dari daftar bansos) atau **turun**
   (berpotensi masuk daftar bansos).

5. **Riwayat perubahan (snapshot).** Setiap pemutakhiran disimpan sebagai potret bertanggal.
   Bisa dilihat **field apa yang berubah** antar pendataan, **oleh operator siapa**, dan
   dilengkapi **foto rumah** (tampak depan, ruang tamu, kamar mandi) sebagai bukti.

6. **Sanggahan (usul sanggah) warga.** Warga, RT/RW, atau kelian banjar dinas dapat mengajukan
   keberatan jika merasa data atau statusnya keliru. Alur penanganan: **Diajukan → Diproses →
   Diterima / Ditolak**, dengan catatan petugas. Meningkatkan keadilan dan keterbukaan.

7. **Hak akses berjenjang.** **Operator** dan **Kepala Desa** dapat menambah/mengubah/menghapus
   data. **Kepala SLS (Kelian Banjar Dinas)** bersifat **hanya-lihat** dan **dibatasi pada
   wilayahnya** sendiri. Setiap perubahan tercatat atas nama petugas → akuntabel.

8. **Offline & online.** Dapat dipakai **tanpa internet** (data tersimpan aman di perangkat) —
   cocok untuk wilayah bersinyal lemah. Bila daring, data **tersinkron otomatis ke pusat data
   desa (Google Spreadsheet)** dan **foto tersimpan di Google Drive**.

9. **Mudah & ringan.** Cukup browser di HP atau laptop, tanpa instalasi dan tanpa server mahal.
   Tampilan menyesuaikan layar (responsif).

### Bukti / Status

- Sudah berjalan dengan **data contoh Kecamatan Tejakula, Kabupaten Buleleng**: Desa
  **Sambirenteng, Penuktukan, Tembok** — **18 keluarga** mencakup beragam kondisi (semua
  desil 1–10, semua jenis bansos, kasus disabilitas, perubahan desil naik/turun).
- Dapat dicoba langsung di **https://bpsbuleleng.github.io/descan2026**.
- Akun demo: `operator / operator123` (bisa kelola data), `kepaladesa / desa123`,
  `sls.tembok / sls123` (hanya melihat wilayahnya).

### Manfaat untuk Desa (poin penutup)

- **Tepat sasaran** — bantuan sampai ke yang benar-benar berhak.
- **Transparan** — ada riwayat perubahan & saluran sanggahan.
- **Cepat & mudah** — pendataan terstruktur dengan validasi otomatis.
- **Akuntabel** — hak akses berjenjang & jejak perubahan yang jelas.
- **Hemat** — tanpa perangkat mahal, bisa offline.

### Ajakan

Jadikan desa ini sebagai **percontohan**: tunjuk operator, jadwalkan **pelatihan singkat**,
dan mulai pemutakhiran bertahap. **BPS Kabupaten Buleleng siap mendampingi.**
Kontak: bpsbuleleng5108@gmail.com.

---

## BAGIAN C — Panduan singkat pemakaian

**Untuk membuat SLIDE (disarankan: Claude):**
1. Buka claude.ai.
2. Salin seluruh isi kotak di **Bagian A**, tempel, kirim.
3. Claude membuat presentasi sebagai *artifact* HTML. Klik **layar penuh**, gunakan
   panah ◀ ▶ untuk berpindah slide.
4. Ingin perubahan? Cukup balas, mis.: *"Buat warna lebih lembut"*, *"Ringkas slide 5 jadi
   4 poin"*, *"Tambah slide perbandingan sebelum vs sesudah"*, atau *"Tambahkan logo Pemkab
   Buleleng di pojok"*. Untuk menyisipkan tangkapan layar aplikasi, beri tahu Claude posisi
   gambar yang diinginkan.

**Untuk RINGKASAN / AUDIO latihan (NotebookLM):**
1. Buka notebooklm.google.com, buat notebook baru.
2. Tambahkan teks **Bagian B** sebagai sumber (atau unggah berkas ini).
3. Minta: ringkasan, daftar tanya-jawab antisipasi pertanyaan pejabat desa, atau
   **Audio Overview** untuk dengarkan sambil berlatih.

**Tips menyampaikan ke pemerintah desa:**
- Buka dengan **masalah nyata** (bansos salah sasaran) sebelum menampilkan aplikasi.
- Bila memungkinkan, **demo langsung**: login sebagai operator, tampilkan dashboard, buka
  satu data warga, tunjukkan validasi & sanggahan.
- Tutup dengan **ajakan konkret**: pilot + pelatihan operator.
```
