/**
 * DTSEN Desa — Backend (Google Apps Script Web App) dengan Google Sheets sebagai database.
 *
 * Database = satu Spreadsheet dengan sheet: Users, Warga, Sanggahan, Meta.
 * Protokol  = HTTP POST ke URL Web App. Body: text/plain berisi JSON
 *             { action, auth:{username,password}, payload }.
 *             (text/plain dipakai agar tidak memicu CORS preflight.)
 *
 * Aturan akses (dipaksakan di server):
 *   - Operator & Kepala Desa  -> boleh baca semua + tulis (CRUD).
 *   - Kepala SLS              -> hanya-baca, dibatasi ke wilayah (dusun)-nya.
 *
 * Deploy: lihat server/README.md.
 */

var SHEETS = { USERS: 'Users', WARGA: 'Warga', SANGGAHAN: 'Sanggahan', KRITIK: 'Kritik', META: 'Meta' };

var WARGA_COLS = ['id','noKK','nik','nama','dusun','rt','rw','alamat','desil','bansos','updatedAt','dataJson','status'];
var SANGGAHAN_COLS = ['id','wargaId','tanggalSnapshot','pengaju','nik','hubungan','alasan','status','tanggalPengajuan','tanggalSelesai','catatanOperator'];
var KRITIK_COLS = ['id','nama','organisasi','isi','tanggal'];
var USER_COLS = ['username','password','nama','role','wilayah'];

// ---- Entry points ----------------------------------------------------------
function doGet(e)  { return handle(e); }
function doPost(e) { return handle(e); }

function handle(e) {
  var req = {};
  try {
    if (e && e.postData && e.postData.contents) req = JSON.parse(e.postData.contents);
    else if (e && e.parameter && e.parameter.payload) req = JSON.parse(e.parameter.payload);
  } catch (err) { return json({ ok: false, error: 'Body bukan JSON yang valid.' }); }

  ensureSetup();
  ensureWargaHeader();   // migrasi ringan: pastikan kolom (mis. 'status') ada di sheet lama
  var action = req.action || '';
  try {
    if (action === 'ping')             return json({ ok: true, time: new Date().toISOString() });
    if (action === 'login')            return json(actionLogin(req.payload || {}));
    // Kritik & saran boleh dikirim tanpa login (tersedia di halaman login).
    if (action === 'submitKritik')     return json(actionSubmitKritik((req.payload && (req.payload.kritik || req.payload)) || {}));

    var user = authenticate(req.auth);     // semua action lain butuh login
    if (!user) return json({ ok: false, error: 'Sesi tidak sah. Silakan login ulang.' });

    if (action === 'bootstrap')        return json(actionBootstrap(user));
    // Klien mengirim payload terbungkus ({warga:…}, {sanggahan:…}); terima juga
    // bentuk tak terbungkus agar tahan terhadap kedua format.
    if (action === 'saveWarga')        return json(requireWrite(user, function(){ var p=req.payload||{}; return actionSaveWarga(user, p.warga||p); }));
    if (action === 'deleteWarga')      return json(requireWrite(user, function(){ var p=req.payload||{}; return actionDeleteWarga(p.warga||p); }));
    // Menyanggah cukup butuh login (Operator, Kepala Desa, & Kepala SLS) — bukan hak tulis penuh.
    if (action === 'submitSanggahan')  return json((function(){ var p=req.payload||{}; return actionSubmitSanggahan(p.sanggahan||p); })());
    if (action === 'updateSanggahan')  return json(requireWrite(user, function(){ return actionUpdateSanggahan(req.payload); }));
    if (action === 'uploadFoto')       return json(requireWrite(user, function(){ return actionUploadFoto(req.payload || {}); }));
    if (action === 'reset')            return json(requireWrite(user, function(){ seedData(true); return { ok: true }; }));

    return json({ ok: false, error: 'Action tidak dikenal: ' + action });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) });
  }
}

// ---- Auth ------------------------------------------------------------------
function canWrite(user) { return user && (user.role === 'Operator' || user.role === 'Kepala Desa'); }

function requireWrite(user, fn) {
  if (!canWrite(user)) return { ok: false, error: 'Hanya Operator & Kepala Desa yang boleh mengubah data.' };
  return fn();
}

function authenticate(auth) {
  if (!auth || !auth.username) return null;
  var u = findUser(String(auth.username).toLowerCase());
  if (!u || String(u.password) !== String(auth.password)) return null;
  return { username: u.username, nama: u.nama, role: u.role, wilayah: u.wilayah || null };
}

function findUser(username) {
  var rows = readSheet(SHEETS.USERS, USER_COLS);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].username).toLowerCase() === username) return rows[i];
  }
  return null;
}

function actionLogin(p) {
  var user = authenticate({ username: p.username, password: p.password });
  if (!user) return { ok: false, error: 'Username atau kata sandi salah.' };
  return { ok: true, user: user };
}

// ---- Reads -----------------------------------------------------------------
function actionBootstrap(user) {
  var warga = readWarga();
  var sanggahan = readSheet(SHEETS.SANGGAHAN, SANGGAHAN_COLS);
  if (user.role === 'Kepala SLS' && user.wilayah) {
    warga = warga.filter(function(w){ return w.dusun === user.wilayah; });
    var ids = {}; warga.forEach(function(w){ ids[w.id] = true; });
    sanggahan = sanggahan.filter(function(s){ return ids[s.wargaId]; });
  }
  return { ok: true, warga: warga, sanggahan: sanggahan, serverDate: today() };
}

function readWarga() {
  var rows = readSheet(SHEETS.WARGA, WARGA_COLS);
  return rows.map(function(r){
    var data = {};
    try { data = r.dataJson ? JSON.parse(r.dataJson) : {}; } catch (e) {}
    // Kolom datar adalah cermin dari ringkasan; dataJson memegang objek lengkap.
    data.id = r.id; data.noKK = r.noKK; data.nik = r.nik; data.nama = r.nama;
    data.dusun = r.dusun; data.rt = r.rt; data.rw = r.rw; data.alamat = r.alamat;
    if (data.desil == null) data.desil = Number(r.desil) || 1;
    if (data.bansos == null) data.bansos = r.bansos;
    return data;
  });
}

// ---- Writes ----------------------------------------------------------------
function actionSaveWarga(user, w) {
  if (!w || !w.id) return { ok: false, error: 'Data warga tidak valid (id kosong).' };
  var sh = sheet(SHEETS.WARGA);
  var rowIndex = findRowIndexById(sh, 'id', w.id);
  var record = toWargaRow(w);
  if (rowIndex > 0) sh.getRange(rowIndex, 1, 1, WARGA_COLS.length).setValues([record]);
  else sh.appendRow(record);
  return { ok: true, warga: w };
}

function actionDeleteWarga(p) {
  var sh = sheet(SHEETS.WARGA);
  var rowIndex = findRowIndexById(sh, 'id', p && p.id);
  if (rowIndex > 0) sh.deleteRow(rowIndex);
  return { ok: true };
}

function actionSubmitSanggahan(s) {
  if (!s || !s.id) return { ok: false, error: 'Sanggahan tidak valid.' };
  var sh = sheet(SHEETS.SANGGAHAN);
  sh.appendRow(SANGGAHAN_COLS.map(function(k){ return s[k] != null ? s[k] : ''; }));
  return { ok: true, sanggahan: s };
}

function actionUpdateSanggahan(p) {
  if (!p || !p.id) return { ok: false, error: 'id sanggahan kosong.' };
  var sh = sheet(SHEETS.SANGGAHAN);
  var rowIndex = findRowIndexById(sh, 'id', p.id);
  if (rowIndex < 1) return { ok: false, error: 'Sanggahan tidak ditemukan.' };
  var col = {}; SANGGAHAN_COLS.forEach(function(k,i){ col[k] = i + 1; });
  if (p.status != null)          sh.getRange(rowIndex, col.status).setValue(p.status);
  if (p.catatanOperator != null) sh.getRange(rowIndex, col.catatanOperator).setValue(p.catatanOperator);
  if (p.tanggalSelesai != null)  sh.getRange(rowIndex, col.tanggalSelesai).setValue(p.tanggalSelesai);
  return { ok: true };
}

// ---- Kritik & Saran (boleh tanpa login) ------------------------------------
function actionSubmitKritik(k) {
  if (!k || !k.isi || !String(k.isi).trim()) return { ok: false, error: 'Isi kritik/saran kosong.' };
  var sh = sheet(SHEETS.KRITIK);
  var rec = {
    id: k.id || ('k' + new Date().getTime()),
    nama: (k.nama && String(k.nama).trim()) || 'Anonim',
    organisasi: (k.organisasi && String(k.organisasi).trim()) || '-',
    isi: String(k.isi).trim(),
    tanggal: k.tanggal || today()
  };
  sh.appendRow(KRITIK_COLS.map(function(c){ return rec[c] != null ? rec[c] : ''; }));
  return { ok: true, kritik: rec };
}

function stripFoto(fotoObj) {
  if (!fotoObj) return;
  Object.keys(fotoObj).forEach(function(k){
    var f = fotoObj[k];
    // Hanya buang base64 (data:) agar muat di sel; URL Google Drive dipertahankan.
    if (f && f.src && String(f.src).indexOf('data:') === 0) fotoObj[k] = { has: true, before: f.before, after: f.after };
  });
}

// ---- Foto di Google Drive --------------------------------------------------
function getFotoFolder() {
  var name = 'DTSEN Desa - Foto';
  var it = DriveApp.getFoldersByName(name);
  return it.hasNext() ? it.next() : DriveApp.createFolder(name);
}
// Simpan satu foto (data URL base64) ke Drive, link publik (anyone with link),
// kembalikan { fileId, url }. Nama file = <wargaId>__<key> agar ganti foto menimpa.
function actionUploadFoto(p) {
  if (!p || !p.dataUrl) return { ok: false, error: 'Data foto kosong.' };
  var m = /^data:(image\/[\w.+-]+);base64,([\s\S]+)$/.exec(String(p.dataUrl));
  if (!m) return { ok: false, error: 'Format data URL tidak valid.' };
  var name = (p.id || 'foto') + '__' + String(p.key || 'foto').replace(/[^\w]+/g, '_') + '.jpg';
  var folder = getFotoFolder();
  var existing = folder.getFilesByName(name);
  while (existing.hasNext()) existing.next().setTrashed(true);
  var blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], name);
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return { ok: true, fileId: file.getId(), url: 'https://lh3.googleusercontent.com/d/' + file.getId() + '=w1200' };
}
function toWargaRow(w) {
  // Foto base64 dilepas dari dataJson agar muat di sel (batas 50.000 char).
  var slim = JSON.parse(JSON.stringify(w));
  if (Array.isArray(slim.snapshots)) slim.snapshots.forEach(function(sn){ if (sn) stripFoto(sn.foto); });
  if (slim.rumah) stripFoto(slim.rumah.foto);  // foto Blok II (R21) juga di-strip
  return [w.id, w.noKK, w.nik, w.nama, w.dusun, w.rt, w.rw, w.alamat,
          w.desil, w.bansos, today(), JSON.stringify(slim), w.status || 'final'];
}

// ---- Sheet helpers ---------------------------------------------------------
function ss() { return SpreadsheetApp.getActiveSpreadsheet(); }
function sheet(name) { var s = ss().getSheetByName(name); if (!s) s = ss().insertSheet(name); return s; }

function readSheet(name, cols) {
  var sh = sheet(name);
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  var header = values[0];
  var idx = {}; cols.forEach(function(c){ idx[c] = header.indexOf(c); });
  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (row.join('') === '') continue;
    var obj = {};
    cols.forEach(function(c){ obj[c] = idx[c] >= 0 ? row[idx[c]] : ''; });
    out.push(obj);
  }
  return out;
}

function findRowIndexById(sh, idCol, id) {
  var values = sh.getDataRange().getValues();
  if (values.length < 1) return -1;
  var c = values[0].indexOf(idCol);
  if (c < 0) return -1;
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][c]) === String(id)) return r + 1; // 1-based
  }
  return -1;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function today() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'Asia/Makassar', 'yyyy-MM-dd');
}

// ---- One-time setup & seed -------------------------------------------------
function ensureSetup() {
  if (getMeta('initialized') === 'true') return;
  writeHeader(SHEETS.USERS, USER_COLS);
  writeHeader(SHEETS.WARGA, WARGA_COLS);
  writeHeader(SHEETS.SANGGAHAN, SANGGAHAN_COLS);
  writeHeader(SHEETS.KRITIK, KRITIK_COLS);
  writeHeader(SHEETS.META, ['key', 'value']);
  seedUsers();
  seedData(false);
  setMeta('initialized', 'true');
}

function writeHeader(name, cols) {
  var sh = sheet(name);
  if (sh.getLastRow() === 0) sh.getRange(1, 1, 1, cols.length).setValues([cols]);
}

// Migrasi ringan untuk sheet Warga yang sudah ter-deploy sebelum kolom baru
// (mis. 'status') ditambahkan: pastikan baris header cocok dengan WARGA_COLS.
function ensureWargaHeader() {
  var sh = sheet(SHEETS.WARGA);
  if (sh.getLastRow() === 0) return;
  var width = Math.max(sh.getLastColumn(), WARGA_COLS.length);
  var hdr = sh.getRange(1, 1, 1, width).getValues()[0];
  var changed = false;
  for (var i = 0; i < WARGA_COLS.length; i++) { if (hdr[i] !== WARGA_COLS[i]) { hdr[i] = WARGA_COLS[i]; changed = true; } }
  if (changed) sh.getRange(1, 1, 1, WARGA_COLS.length).setValues([hdr.slice(0, WARGA_COLS.length)]);
}

function seedUsers() {
  var sh = sheet(SHEETS.USERS);
  if (sh.getLastRow() > 1) return;
  var rows = [
    ['kepaladesa', 'desa123', 'I Gusti Ngurah Rai', 'Kepala Desa', ''],
    ['operator', 'operator123', 'Komang Sutarja', 'Operator', ''],
    ['sls.sambirenteng', 'sls123', 'I Nyoman Lestari', 'Kepala SLS', 'Banjar Dinas Sambirenteng'],
    ['sls.penyumbahan', 'sls123', 'I Ketut Wirya', 'Kepala SLS', 'Banjar Dinas Penyumbahan'],
    ['sls.penuktukan', 'sls123', 'I Wayan Sudiarta', 'Kepala SLS', 'Banjar Dinas Penuktukan'],
    ['sls.tembok', 'sls123', 'I Made Astawan', 'Kepala SLS', 'Banjar Dinas Tembok'],
    ['sls.ngis', 'sls123', 'I Gede Mariana', 'Kepala SLS', 'Banjar Dinas Ngis']
  ];
  sh.getRange(2, 1, rows.length, USER_COLS.length).setValues(rows);
}

// Bangun blok terstruktur FASIH (ringkas) untuk satu KK seed — agar saat dibuka
// di aplikasi (mode server) form tidak kosong. Detail penuh tetap dari aplikasi.
function seedStructured(w) {
  var kaya = w.desil >= 8;
  return {
    wilayah: { provinsi: '[51] BALI', kabupaten: '[08] BULELENG', kecamatan: '[090] TEJAKULA', desa: w.desa,
      klasifikasi: '2. Perdesaan', kodeSls: '0003' + String(w.rt || '01').slice(-2), namaSls: w.dusun, kodePos: '81173', namaJalan: w.alamat, nomorRumah: '-' },
    statusKeluarga: '1. Ditemukan', jumlahAnggotaKK: 1, alamatSesuaiKK: '1. Ya, Sesuai KK',
    geotag: { mode: '2. Input Manual', lat: '', long: '', akurasi: '' },
    rumah: { jumlahKeluarga: 1, jenisBangunan: '1. Rumah tinggal tunggal', statusKepemilikan: '1. Milik sendiri', buktiMilik: '1. SHM', nilaiSewa: 500000, luasLantai: 45,
      lantaiBahan: kaya ? '2. Keramik' : '8. Tanah', lantaiKondisi: '1. Baik', dindingBahan: kaya ? '1. Tembok' : '6. Bambu', dindingKondisi: '1. Baik', atapBahan: kaya ? '2. Genteng' : '3. Seng', atapKondisi: '1. Baik',
      fasilitasBAB: '1. Ada, digunakan oleh anggota keluarga dalam satu rumah', jenisKloset: '1. Leher angsa', pembuanganTinja: '1. Tangki septik', sumberAirMinum: '5. Sumur terlindung', sumberPenerangan: '1. Listrik PLN dengan meteran',
      pengeluaranListrik: 100000, pengeluaranPulsa: 100000, pengeluaranInternet: 0, foto: { depan: { has: true }, ruangTamu: { has: true }, kamarMandi: null } },
    meteran: [ { daya: kaya ? '3. 1.300 watt' : '1. 450 watt', jenisId: 'ID Pelanggan', idPelanggan: (String(w.noKK) + '00').slice(0, 12) } ],
    aset: { tabungGas3: 1, tabungGas55: 0, kulkas: kaya ? 1 : 0, ac: 0, emas: 0, komputer: 0, sepedaMotor: w.desil >= 5 ? 1 : 0, nilaiSepedaMotor: w.desil >= 5 ? 15000000 : 0, mobil: w.desil >= 9 ? 1 : 0, nilaiMobil: w.desil >= 9 ? 120000000 : 0, lahanLain: 0, bangunanLain: 0 },
    anggota: [ { no: 1, nama: w.nama, nik: w.nik, hp: '-', keberadaan: '1. Tinggal di rumah/tempat tinggal ini', domisili: '1. Sesuai KK dan KTP', jk: '1. Laki-laki',
      tglLahir: '05', blnLahir: '05 - Mei', thnLahir: '1985', umur: '41', statusKawin: '2. Kawin/nikah', hubungan: '1. Kepala Keluarga',
      partisipasiSekolah: '2. Tidak bersekolah lagi', pendidikan: '1. SD/sederajat', pendapatanKerja: '1. Ya', pendapatanUsaha: '2. Tidak', nilaiUsaha: '', pendapatanLain: '2. Tidak',
      profesi: 'Petani', statusKerja: '1. Berusaha sendiri', disabilitas: {}, kesehatan: {}, rekening: '4. Tidak ada' } ],
    catatan: ''
  };
}

function seedData(force) {
  var sh = sheet(SHEETS.WARGA);
  if (force) { if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1); }
  else if (sh.getLastRow() > 1) return;

  // Subset perwakilan 3 desa Tejakula (data lengkap 18 KK ada di aplikasi; operator
  // dapat menambah/mendorong selebihnya). desa disimpan di dalam dataJson juga.
  var seed = [
    { id: 'w01', noKK: '5108150101010001', nik: '5108150101800001', nama: 'I Wayan Sukra', desa: 'Desa Sambirenteng', dusun: 'Banjar Dinas Sambirenteng', rt: '001', rw: '001', alamat: 'Jl. Air Sanih Gg. Melati', desil: 1, bansos: 'PKH + BPNT' },
    { id: 'w05', noKK: '5108150103010005', nik: '5108151009820005', nama: 'I Gede Suardika', desa: 'Desa Sambirenteng', dusun: 'Banjar Dinas Bantes', rt: '001', rw: '003', alamat: 'Br. Bantes', desil: 10, bansos: 'Tidak Ada' },
    { id: 'w07', noKK: '5108150201010007', nik: '5108150201750007', nama: 'I Nyoman Reta', desa: 'Desa Penuktukan', dusun: 'Banjar Dinas Penuktukan', rt: '001', rw: '001', alamat: 'Jl. Singaraja-Amlapura', desil: 2, bansos: 'PKH + BPNT' },
    { id: 'w12', noKK: '5108150203010012', nik: '5108150512720012', nama: 'I Komang Wirawan', desa: 'Desa Penuktukan', dusun: 'Banjar Dinas Kawanan', rt: '002', rw: '003', alamat: 'Br. Kawanan No. 1', desil: 10, bansos: 'Tidak Ada' },
    { id: 'w13', noKK: '5108150301010013', nik: '5108150301680013', nama: 'I Wayan Repot', desa: 'Desa Tembok', dusun: 'Banjar Dinas Tembok', rt: '001', rw: '001', alamat: 'Jl. Tembok-Tejakula', desil: 1, bansos: 'PKH' },
    { id: 'w16', noKK: '5108150302010016', nik: '5108152610830016', nama: 'I Made Suarjana', desa: 'Desa Tembok', dusun: 'Banjar Dinas Dukuh', rt: '002', rw: '002', alamat: 'Br. Dukuh Kaja', desil: 9, bansos: 'Tidak Ada', status: 'draft' }
  ];
  var rows = seed.map(function(w){
    var status = w.status || 'final';
    var data = Object.assign({}, w, seedStructured(w), { status: status, snapshots: [
      { tanggal: today(), operator: 'Sistem', data: Object.assign({}, w), fieldYangBerubah: [], foto: {} }
    ]});
    return [w.id, w.noKK, w.nik, w.nama, w.dusun, w.rt, w.rw, w.alamat, w.desil, w.bansos, today(), JSON.stringify(data), status];
  });
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, WARGA_COLS.length).setValues(rows);

  var ssh = sheet(SHEETS.SANGGAHAN);
  if (force && ssh.getLastRow() > 1) ssh.deleteRows(2, ssh.getLastRow() - 1);
  if (ssh.getLastRow() <= 1) {
    ssh.appendRow(['s1', 'w13', today(), 'Kelian Banjar Dinas Tembok', '-', 'RT/RW',
      'Pak I Wayan Repot menyandang disabilitas dan tinggal menumpang. Mohon diprioritaskan bantuan tambahan.', 'Diajukan', today(), '', '']);
  }
}

function getMeta(key) {
  var rows = readSheet(SHEETS.META, ['key', 'value']);
  for (var i = 0; i < rows.length; i++) if (rows[i].key === key) return String(rows[i].value);
  return '';
}
function setMeta(key, value) {
  var sh = sheet(SHEETS.META);
  var rowIndex = findRowIndexById(sh, 'key', key);
  if (rowIndex > 0) sh.getRange(rowIndex, 2).setValue(value);
  else sh.appendRow([key, value]);
}
