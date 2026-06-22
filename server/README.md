# Server DTSEN Desa — Google Sheets sebagai Database (Apps Script)

Backend opsional. Tanpa ini, aplikasi tetap jalan **mode lokal** (offline,
localStorage). Dengan ini, data tersimpan terpusat di **Google Sheets** dan bisa
dipakai banyak perangkat / banyak operator.

## Arsitektur

```
index.html (browser)
   │  fetch JSON (POST, text/plain)
   ▼
Apps Script Web App  ──►  Google Spreadsheet (database)
   doGet/doPost            Sheet: Users · Warga · Sanggahan · Meta
```

- Database = satu Spreadsheet, satu baris = satu KK / satu sanggahan.
- Data lengkap tiap KK (snapshot, dll.) disimpan sebagai JSON di kolom `dataJson`.
  Foto (base64) **tidak** disimpan ke sheet (batas 50.000 karakter/sel) — foto
  tetap di perangkat. Untuk foto terpusat, gunakan Google Drive (pengembangan lanjut).
- Aturan akses dipaksakan di server: **Operator & Kepala Desa** boleh tulis;
  **Kepala SLS** hanya-baca, dibatasi ke wilayah (banjar dinas)-nya.

## Langkah Deploy

1. Buat Spreadsheet baru di Google Drive (mis. beri nama "DB DTSEN Desa").
2. Menu **Extensions → Apps Script**.
3. Hapus isi `Code.gs` bawaan, lalu tempel seluruh isi [Code.gs](Code.gs).
   (Opsional) samakan manifes dengan [appsscript.json](appsscript.json) lewat
   ⚙ *Project Settings → Show "appsscript.json"*.
4. **Deploy → New deployment → Type: Web app**.
   - *Execute as*: **Me**.
   - *Who has access*: **Anyone** (atau "Anyone with Google account" bila ingin terbatas).
   - Klik **Deploy**, salin **Web app URL** (berakhiran `/exec`).
5. Saat pertama dijalankan, sheet `Users`, `Warga`, `Sanggahan`, `Meta` dibuat
   dan diisi data contoh otomatis.
6. Di proyek aplikasi, buka [../config.js](../config.js) dan isi:
   ```js
   window.DTSEN_CONFIG = { apiUrl: 'https://script.google.com/macros/s/AKfycb..../exec' };
   ```
7. Buka `index.html`. Header akan menampilkan **● Sheets**. Login memakai akun di
   sheet `Users` (default sama dengan akun demo lokal, mis. `operator` / `operator123`).

> Setelah mengubah `Code.gs`, lakukan **Deploy → Manage deployments → Edit → Version: New**
> agar perubahan aktif (URL tetap sama).

## API (ringkas)

`POST <url>` body `text/plain` berisi JSON `{ action, auth:{username,password}, payload }`.

| action            | peran        | fungsi |
|-------------------|--------------|--------|
| `ping`            | —            | cek hidup |
| `login`           | —            | validasi kredensial → data user |
| `bootstrap`       | semua login  | ambil warga + sanggahan (di-scope utk SLS) |
| `saveWarga`       | tulis        | tambah/perbarui satu KK |
| `submitSanggahan` | tulis        | ajukan sanggahan |
| `updateSanggahan` | tulis        | ubah status/keputusan sanggahan |
| `reset`           | tulis        | pulihkan data contoh |

Respons selalu `{ ok: true, ... }` atau `{ ok: false, error }`.

## Kuesioner FASIH, roster & draf

Sejak form mengikuti kuesioner FASIH (Blok I–V + roster anggota & roster meteran),
seluruh isian per-KK disimpan sebagai JSON di kolom `dataJson` — termasuk
`rumah`, `meteran[]`, `aset`, dan `anggota[]` (per anggota: identitas, disabilitas
a–f, keluhan kesehatan a–r, dll). Tidak perlu kolom baru per field.

- Kolom **`status`** (`draft`/`final`) ditambahkan ke sheet `Warga`. **Simpan Draf**
  dari aplikasi menulis baris ber-`status=draft` **langsung ke spreadsheet**;
  **Finalisasi** menulis `status=final` (hanya bila tidak ada GALAT).
- **Foto disimpan di Google Drive** (mode server). Saat foto diambil, aplikasi
  mengompres (≤200KB) lalu mengunggah via aksi `uploadFoto` → Apps Script menulis
  file ke folder **"DTSEN Desa - Foto"** (akses *anyone with link*) dan
  mengembalikan URL `lh3.googleusercontent.com/d/<id>`. Yang disimpan di
  `rumah.foto`/sheet hanyalah **URL** (kecil), bukan base64. `stripFoto` hanya
  membuang base64 (`data:`), URL Drive dipertahankan. Foto pengganti menimpa file
  bernama sama (`<wargaId>__<key>`). Mode lokal tetap memakai base64 di perangkat.
  > Karena memakai `DriveApp`, **redeploy** akan meminta **izin Google Drive** baru —
  > setujui saat diminta.
- Sheet `Warga` yang **sudah ter-deploy** otomatis ditambahi header kolom `status`
  pada permintaan berikutnya (`ensureWargaHeader()`); baris lama tetap terbaca
  (status diambil dari `dataJson`). Tetap lakukan **redeploy versi baru** setelah
  mengganti `Code.gs`, lalu **reset** bila ingin data contoh terstruktur yang baru.

## Keamanan (catatan prototipe)

Kata sandi tersimpan apa adanya di sheet `Users` dan dikirim tiap permintaan —
cukup untuk prototipe internal. Untuk produksi: hash kata sandi, gunakan token
sesi, dan batasi akses Web App ke akun Google tertentu.
