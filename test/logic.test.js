// Unit tests for the Component logic (roles, scoping, scoring, formatters, auth).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadApp, makeInstance } = require('./harness');

test('app source compiles without error', () => {
  const app = loadApp();
  assert.ok(!app.error, app.error && String(app.error));
  assert.equal(typeof app.Component, 'function');
  assert.equal(typeof app.css, 'function');
});

test('css() parses inline-style strings into a React style object', () => {
  const { css } = loadApp();
  // css() builds its object inside the vm realm; copy into this realm so the
  // prototype matches for deepStrictEqual.
  const plain = (s) => Object.assign({}, css(s));
  assert.deepEqual(plain('color:red; font-size:12px'), { color: 'red', fontSize: '12px' });
  assert.deepEqual(plain('-webkit-overflow-scrolling:touch'), { WebkitOverflowScrolling: 'touch' });
  assert.deepEqual(plain(''), {});
});

test('seed data has the expected shape (Buleleng: 3 desa)', () => {
  const c = makeInstance();
  const W = c.seedWarga();
  assert.equal(W.length, 18);
  assert.equal(c.seedSanggahan().length, 5);
  W.forEach((w) => {
    assert.ok(w.desil >= 1 && w.desil <= 10, 'desil in 1..10 for ' + w.nama);
    assert.ok(Array.isArray(w.snapshots) && w.snapshots.length >= 1);
    assert.ok(w.desa && w.dusun, 'desa & dusun set for ' + w.nama);
  });
  // The three target villages are all represented.
  const desaSet = new Set(W.map((w) => w.desa));
  ['Desa Sambirenteng', 'Desa Penuktukan', 'Desa Tembok'].forEach((d) => assert.ok(desaSet.has(d), 'missing ' + d));
  // "Semua kemungkinan kasus": every decile 1..10 appears, all bansos types, all sanggahan statuses.
  const deciles = new Set(W.map((w) => w.desil));
  for (let d = 1; d <= 10; d++) assert.ok(deciles.has(d), 'missing decile ' + d);
  const bansos = new Set(W.map((w) => w.bansos));
  ['Tidak Ada', 'PKH', 'BPNT', 'PKH + BPNT'].forEach((b) => assert.ok(bansos.has(b), 'missing bansos ' + b));
  const statuses = new Set(c.seedSanggahan().map((s) => s.status));
  ['Diajukan', 'Diproses', 'Diterima', 'Ditolak'].forEach((s) => assert.ok(statuses.has(s), 'missing status ' + s));
});

test('canCrud(): only Operator and Kepala Desa', () => {
  assert.equal(makeInstance({ auth: null }).canCrud(), false);
  assert.equal(makeInstance({ auth: { role: 'Operator' } }).canCrud(), true);
  assert.equal(makeInstance({ auth: { role: 'Kepala Desa' } }).canCrud(), true);
  assert.equal(makeInstance({ auth: { role: 'Kepala SLS', wilayah: 'Dusun Krajan' } }).canCrud(), false);
});

test('canSanggah(): any logged-in role may submit (incl. Kepala SLS), guests cannot', () => {
  assert.equal(makeInstance({ auth: null }).canSanggah(), false);
  assert.equal(makeInstance({ auth: { role: 'Operator' } }).canSanggah(), true);
  assert.equal(makeInstance({ auth: { role: 'Kepala Desa' } }).canSanggah(), true);
  assert.equal(makeInstance({ auth: { role: 'Kepala SLS', wilayah: 'Banjar Dinas Tembok' } }).canSanggah(), true);
});

test('Kepala SLS can open and submit a sanggahan (not gated by canCrud)', () => {
  const c = makeInstance({ auth: { role: 'Kepala SLS', nama: 'I Made Astawan', wilayah: 'Banjar Dinas Tembok' } });
  c.bukaRiwayat('w13'); // a household inside its banjar
  c.onBukaFormSanggahan();
  assert.equal(c.state.showSanggahanForm, true, 'read-only SLS may still open the sanggahan form');
  c.state.sanggahanForm = { pengaju: 'Kelian Tembok', nik: '-', hubungan: 'RT/RW', alasan: 'Mohon ditinjau ulang.' };
  const before = c.state.sanggahan.length;
  c.onSubmitSanggahan();
  assert.equal(c.state.sanggahan.length, before + 1, 'sanggahan recorded');
  assert.equal(c.state.showSanggahanForm, false);
  assert.equal(c.state.toast.type, 'ok');
});

test('onSubmitKritik(): isi is required; otherwise it closes and resets', () => {
  // Empty content → blocked, modal stays open with an error toast.
  const c = makeInstance({ showKritikModal: true, kritikForm: { nama: 'A', organisasi: 'BPD', isi: '   ' } });
  c.onSubmitKritik();
  assert.equal(c.state.showKritikModal, true);
  assert.equal(c.state.toast.type, 'err');
  // Valid content → modal closes, form resets, success toast (nama/organisasi optional).
  const c2 = makeInstance({ showKritikModal: true, kritikForm: { nama: '', organisasi: '', isi: 'Mohon tambah fitur ekspor.' } });
  c2.onSubmitKritik();
  assert.equal(c2.state.showKritikModal, false);
  assert.equal(c2.state.kritikForm.isi, '');
  assert.equal(c2.state.toast.type, 'ok');
});

test('visibleWarga(): Kepala SLS is scoped to its wilayah', () => {
  const all = makeInstance({ auth: { role: 'Operator' } }).visibleWarga();
  assert.equal(all.length, 18);

  const sls = makeInstance({ auth: { role: 'Kepala SLS', wilayah: 'Banjar Dinas Tembok' } }).visibleWarga();
  assert.ok(sls.length > 0 && sls.length < 18);
  assert.ok(sls.every((w) => w.dusun === 'Banjar Dinas Tembok'));
});

test('hitungDesil(): wealthier household ranks in a higher decile than a poorer one', () => {
  const c = makeInstance();
  const poor = c.hitungDesil({ penghasilan: 500000, lantai: 'Tanah', dinding: 'Bambu/Kayu', atap: 'Daun/Rumbia', sumberAir: 'Sungai/Hujan', penerangan: 'Non-PLN', aset: [], pekerjaan: 'Buruh Tani', pendidikan: 'SD' });
  const rich = c.hitungDesil({ penghasilan: 9000000, lantai: 'Keramik/Ubin', dinding: 'Tembok', atap: 'Genteng/Beton', sumberAir: 'PDAM/Ledeng', penerangan: 'PLN 900+ VA', aset: ['Mobil', 'Kulkas', 'TV', 'AC'], pekerjaan: 'PNS', pendidikan: 'S1' });
  assert.ok(poor >= 1 && poor <= 10 && rich >= 1 && rich <= 10);
  assert.ok(rich > poor, 'rich(' + rich + ') should outrank poor(' + poor + ')');
});

test('formatters', () => {
  const c = makeInstance();
  assert.equal(c.rupiah(0), 'Rp0');
  assert.equal(c.rupiah(1500000), 'Rp1.500.000');
  assert.equal(c.formatBytes(500), '500 B');
  assert.equal(c.formatBytes(2048), '2 KB');
  assert.equal(c.formatTanggal('2026-06-19'), '19 Juni 2026');
  assert.equal(c.formatTanggal(''), '-');
});

test('login(): rejects bad credentials, accepts a valid demo account', () => {
  const bad = makeInstance();
  bad.state.loginForm = { username: 'operator', password: 'wrong', error: '' };
  bad.login();
  assert.equal(bad.state.auth, null);
  assert.ok(bad.state.loginForm.error.length > 0);

  const ok = makeInstance();
  ok.state.loginForm = { username: 'operator', password: 'operator123', error: '' };
  ok.login();
  assert.ok(ok.state.auth);
  assert.equal(ok.state.auth.role, 'Operator');

  const sls = makeInstance();
  sls.state.loginForm = { username: 'sls.tembok', password: 'sls123', error: '' };
  sls.login();
  assert.equal(sls.state.auth.role, 'Kepala SLS');
  assert.equal(sls.state.auth.wilayah, 'Banjar Dinas Tembok');
});

test('CRUD handlers are no-ops for a read-only Kepala SLS', () => {
  const sls = makeInstance({ auth: { role: 'Kepala SLS', wilayah: 'Banjar Dinas Tembok' } });
  const before = sls.state.view;
  sls.onTambah();
  assert.equal(sls.state.view, before, 'onTambah must not open the form for SLS');
  assert.equal(sls.state.form, null);
});

// ---- FASIH questionnaire: structured data, validation & submit gate ----------

test('seed warga carry the FASIH structured blocks (rumah, meteran, aset, anggota)', () => {
  const c = makeInstance();
  c.seedWarga().forEach((w) => {
    assert.ok(w.rumah && typeof w.rumah === 'object', 'rumah block for ' + w.nama);
    assert.ok(Array.isArray(w.meteran), 'meteran roster for ' + w.nama);
    assert.ok(w.aset && typeof w.aset.sepedaMotor !== 'undefined', 'aset object for ' + w.nama);
    assert.ok(Array.isArray(w.anggota) && w.anggota.length >= 1, 'anggota roster for ' + w.nama);
    const a = w.anggota[0];
    assert.equal(typeof a.disabilitas.fisik, 'string'); // R38 a–f
    assert.equal(typeof a.kesehatan.hipertensi, 'string'); // R39 a–r
    assert.equal(w.anggota.filter((x) => /^1\. Kepala Keluarga/.test(x.hubungan)).length, 1, 'exactly one KRT');
    assert.ok(w.status === 'final' || w.status === 'draft');
  });
});

test('deriveSummary maps structured data back to the flat dashboard summary', () => {
  const c = makeInstance();
  const disab = c.seedWarga().find((w) => w.id === 'w03'); // disabilitas case
  const s = c.deriveSummary(c.dataToForm(disab));
  assert.equal(s.disabilitas, 'Ada');
  assert.equal(s.jumlahAnggota, disab.anggota.length);
  assert.ok(s.desil >= 1 && s.desil <= 10);
});

test('every seeded (final) household passes validation (galat = 0)', () => {
  const c = makeInstance();
  c.seedWarga().forEach((w) => {
    const v = c.validateKeluarga(c.dataToForm(w));
    assert.equal(v.galat.length, 0, w.nama + ' galat: ' + JSON.stringify(v.galat.slice(0, 3)));
  });
});

test('a blank new household is full of galat and cannot be finalized', () => {
  const c = makeInstance({ auth: { role: 'Operator' } });
  const f = c.blankForm();
  assert.ok(c.validateKeluarga(f).galat.length > 10);
  assert.equal(c.canFinalize(f), false);
});

test('validateKeluarga enforces FASIH-specific rules', () => {
  const c = makeInstance();
  const base = c.dataToForm(c.seedWarga().find((w) => w.id === 'w12'));
  const flags = (k, re) => c.validateKeluarga(k).galat.some((g) => re.test(g.label));
  const clone = () => JSON.parse(JSON.stringify(base));

  let k = clone(); k.nik = '123';
  assert.ok(flags(k, /NIK Kepala Keluarga harus 16 digit/), 'NIK 16-digit rule');

  k = clone(); if (!k.meteran.length) k.meteran = [{ daya: '1. 450 watt', jenisId: 'ID Pelanggan', idPelanggan: '' }]; k.meteran[0].jenisId = 'ID Pelanggan'; k.meteran[0].idPelanggan = '123';
  assert.ok(flags(k, /ID Pelanggan harus 12 digit/), 'meteran 12-digit rule');

  k = clone(); k.anggota.forEach((a) => { a.hubungan = '3. Anak'; });
  assert.ok(flags(k, /tepat satu Kepala Keluarga/), 'exactly one KRT rule');

  k = clone();
  k.anggota[0].hubungan = '1. Kepala Keluarga'; k.anggota[0].jk = '1. Laki-laki';
  k.anggota[1].hubungan = '2. Istri/Suami'; k.anggota[1].jk = '1. Laki-laki';
  assert.ok(flags(k, /Jenis kelamin Kepala Keluarga & pasangan harus berbeda/), 'couple sex rule');
});

test('skip-logic: bukti kepemilikan is skipped unless "Milik sendiri"', () => {
  const c = makeInstance();
  const k = c.dataToForm(c.seedWarga().find((w) => w.id === 'w12'));
  k.rumah.statusKepemilikan = '2. Kontrak/sewa'; k.rumah.buktiMilik = '';
  assert.ok(!c.validateKeluarga(k).galat.some((g) => /bukti kepemilikan/i.test(g.label)));
});

test('finalize is gated on galat=0; draft always saves (status=draft)', () => {
  const c = makeInstance({ auth: { role: 'Operator', nama: 'Op', wilayah: null } });
  c.state.form = c.blankForm(); c.state.form.nama = 'Uji Draf'; c.state.view = 'form';
  const before = c.state.warga.length;
  c.simpanKeluarga('final'); // blocked — blank form is full of galat
  assert.equal(c.state.view, 'form', 'finalize stays on form');
  assert.equal(c.state.warga.length, before, 'no household added on blocked finalize');
  assert.match(c.state.toast.msg, /GALAT/);
  c.simpanKeluarga('draft'); // always allowed
  assert.equal(c.state.warga.length, before + 1, 'draft adds the household');
  assert.equal(c.state.warga.find((w) => w.nama === 'Uji Draf').status, 'draft');
});

test('roster handlers add/remove members and resize the meteran roster', () => {
  const c = makeInstance({ auth: { role: 'Operator' } });
  c.state.form = c.blankForm();
  assert.equal(c.state.form.anggota.length, 1);
  c.tambahAnggota();
  assert.equal(c.state.form.anggota.length, 2);
  assert.equal(c.state.form.anggota[1].no, 2);
  c.hapusAnggota(0);
  assert.equal(c.state.form.anggota.length, 1);
  assert.equal(c.state.form.anggota[0].no, 1); // renumbered
  c.setJumlahMeteran(2);
  assert.equal(c.state.form.meteran.length, 2);
  c.setJumlahMeteran(0);
  assert.equal(c.state.form.meteran.length, 0);
});

test('simpanKeluarga preserves aset as object (regression: summary.aset array must not overwrite struct)', () => {
  const c = makeInstance({ auth: { role: 'Operator', nama: 'Op', wilayah: null } });
  // Start from a seed warga that already has the correct aset object
  const w = c.state.warga[0];
  c.state.form = c.dataToForm(w);
  c.state.editId = w.id;
  // Save as draft
  c.simpanKeluarga('draft');
  // Reload the saved warga and open its form
  const saved = c.state.warga.find(x => x.id === w.id);
  assert.ok(saved, 'warga still present after save');
  assert.ok(!Array.isArray(saved.aset), 'saved warga.aset must remain an object, not an array');
  assert.equal(typeof saved.aset, 'object');
  assert.ok('tabungGas3' in saved.aset, 'aset object must have field tabungGas3');
  // Re-editing should give form.aset as object with correct fields
  const form2 = c.dataToForm(saved);
  assert.ok(!Array.isArray(form2.aset), 'form.aset must be object after re-edit');
  assert.ok('sepedaMotor' in form2.aset, 'form.aset must have sepedaMotor key');
});
