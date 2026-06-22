# Pengujian (Testing)

Skema test memakai **test runner bawaan Node** (`node --test`) — tanpa framework
tambahan. Logika & render aplikasi diuji di Node lewat sebuah *harness* yang
mengompilasi `src/app.jsx` di memori dan menjalankannya dalam sandbox dengan stub
ringan untuk React / DOM (lihat [test/harness.js](test/harness.js)).

## Menjalankan

```bash
npm test          # otomatis build dulu (pretest), lalu jalankan semua test
node --test       # jalankan test saja (tanpa build ulang)
```

## Struktur

| File | Menguji |
|------|---------|
| [test/logic.test.js](test/logic.test.js)  | Logika murni: `canCrud`, `visibleWarga`, `hitungDesil`, formatter, `login`, seed data (3 desa Buleleng, semua kasus) |
| [test/render.test.js](test/render.test.js) | Hasil `render()` per peran — gating CRUD & pembatasan wilayah pada pohon elemen |
| [test/server.test.js](test/server.test.js) | Lapisan sinkronisasi Google Sheets (mode server) dengan `fetch` tiruan |
| [test/build.test.js](test/build.test.js)  | `vendor/app.js` harus hasil build terbaru dari `src/app.jsx` |

## Aturan: setiap fitur baru wajib disertai test

Saat menambah / mengubah fitur:

1. Tulis kode fitur di **`src/app.jsx`** (jangan edit `vendor/app.js`).
2. **Tambah / perbarui test** yang relevan:
   - Logika baru (method baru, aturan akses, perhitungan) → `test/logic.test.js`.
   - Perubahan tampilan / kondisi peran → `test/render.test.js`.
3. Jalankan `npm test` sampai **hijau** (ini juga mem-build ulang `vendor/app.js`).
4. Commit `src/`, `vendor/app.js`, dan test bersama-sama.

### Cara menulis test

Harness menyediakan helper:

```js
const { makeInstance, loadApp, treeText } = require('./harness');

// Instance Component dengan override state (mis. peran/login):
const c = makeInstance({ auth: { role: 'Operator', nama: 'Budi', wilayah: null }, view: 'daftar' });
c.canCrud();          // panggil method logika langsung
treeText(c.render()); // serialisasi pohon render untuk dicari dengan assert.match
```

Pola umum:
- **Aturan akses** → cek `canCrud()` / `visibleWarga()` untuk tiap peran.
- **Gating UI** → render peran tsb, lalu `assert.match` / `assert.doesNotMatch`
  terhadap teks tombol (mis. `/\+ Tambah Data/`).
- **Perhitungan** → uji perilaku (rentang / urutan), hindari hardcode nilai rapuh.
