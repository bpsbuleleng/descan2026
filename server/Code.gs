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

var SHEETS = { USERS: 'Users', WARGA: 'Warga', SANGGAHAN: 'Sanggahan', META: 'Meta' };

var WARGA_COLS = ['id','noKK','nik','nama','dusun','rt','rw','alamat','desil','bansos','updatedAt','dataJson'];
var SANGGAHAN_COLS = ['id','wargaId','tanggalSnapshot','pengaju','nik','hubungan','alasan','status','tanggalPengajuan','tanggalSelesai','catatanOperator'];
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
  var action = req.action || '';
  try {
    if (action === 'ping')             return json({ ok: true, time: new Date().toISOString() });
    if (action === 'login')            return json(actionLogin(req.payload || {}));

    var user = authenticate(req.auth);     // semua action lain butuh login
    if (!user) return json({ ok: false, error: 'Sesi tidak sah. Silakan login ulang.' });

    if (action === 'bootstrap')        return json(actionBootstrap(user));
    if (action === 'saveWarga')        return json(requireWrite(user, function(){ return actionSaveWarga(user, req.payload); }));
    if (action === 'deleteWarga')      return json(requireWrite(user, function(){ return actionDeleteWarga(req.payload); }));
    if (action === 'submitSanggahan')  return json(requireWrite(user, function(){ return actionSubmitSanggahan(req.payload); }));
    if (action === 'updateSanggahan')  return json(requireWrite(user, function(){ return actionUpdateSanggahan(req.payload); }));
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

function toWargaRow(w) {
  // Foto base64 dilepas dari dataJson agar muat di sel (batas 50.000 char).
  var slim = JSON.parse(JSON.stringify(w));
  if (Array.isArray(slim.snapshots)) {
    slim.snapshots.forEach(function(sn){
      if (sn && sn.foto) Object.keys(sn.foto).forEach(function(k){
        var f = sn.foto[k];
        if (f && f.src) sn.foto[k] = { has: true, before: f.before, after: f.after };
      });
    });
  }
  return [w.id, w.noKK, w.nik, w.nama, w.dusun, w.rt, w.rw, w.alamat,
          w.desil, w.bansos, today(), JSON.stringify(slim)];
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
  writeHeader(SHEETS.META, ['key', 'value']);
  seedUsers();
  seedData(false);
  setMeta('initialized', 'true');
}

function writeHeader(name, cols) {
  var sh = sheet(name);
  if (sh.getLastRow() === 0) sh.getRange(1, 1, 1, cols.length).setValues([cols]);
}

function seedUsers() {
  var sh = sheet(SHEETS.USERS);
  if (sh.getLastRow() > 1) return;
  var rows = [
    ['kepaladesa', 'desa123', 'H. Sutrisno', 'Kepala Desa', ''],
    ['operator', 'operator123', 'Budi Santoso', 'Operator', ''],
    ['sls.krajan', 'sls123', 'Sarno', 'Kepala SLS', 'Dusun Krajan'],
    ['sls.ngasem', 'sls123', 'Yatmin', 'Kepala SLS', 'Dusun Ngasem'],
    ['sls.sukamulya', 'sls123', 'Marni', 'Kepala SLS', 'Dusun Sukamulya']
  ];
  sh.getRange(2, 1, rows.length, USER_COLS.length).setValues(rows);
}

function seedData(force) {
  var sh = sheet(SHEETS.WARGA);
  if (force) { if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1); }
  else if (sh.getLastRow() > 1) return;

  var seed = [
    { id: 'w1', noKK: '3204150607080001', nik: '3204151005780002', nama: 'Slamet Riyadi', dusun: 'Dusun Krajan', rt: '002', rw: '001', alamat: 'Jl. Melati No. 12', desil: 3, bansos: 'PKH' },
    { id: 'w2', noKK: '3204150607080002', nik: '3204154208600003', nama: 'Sukinem', dusun: 'Dusun Ngasem', rt: '001', rw: '001', alamat: 'Jl. Mawar No. 4', desil: 2, bansos: 'PKH + BPNT' },
    { id: 'w5', noKK: '3204150607080005', nik: '3204156504880006', nama: 'Sri Wahyuni', dusun: 'Dusun Sukamulya', rt: '001', rw: '003', alamat: 'Jl. Dahlia No. 3', desil: 6, bansos: 'Tidak Ada' }
  ];
  var rows = seed.map(function(w){
    var data = Object.assign({}, w, { anggota: [w.nama], snapshots: [
      { tanggal: today(), operator: 'Sistem', data: Object.assign({}, w), fieldYangBerubah: [], foto: {} }
    ]});
    return [w.id, w.noKK, w.nik, w.nama, w.dusun, w.rt, w.rw, w.alamat, w.desil, w.bansos, today(), JSON.stringify(data)];
  });
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, WARGA_COLS.length).setValues(rows);

  var ssh = sheet(SHEETS.SANGGAHAN);
  if (force && ssh.getLastRow() > 1) ssh.deleteRows(2, ssh.getLastRow() - 1);
  if (ssh.getLastRow() <= 1) {
    ssh.appendRow(['s1', 'w1', today(), 'Slamet Riyadi', '3204151005780002', 'Warga Bersangkutan',
      'Penghasilan menurun karena tidak lagi bekerja, mohon ditinjau ulang.', 'Diajukan', today(), '', '']);
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
