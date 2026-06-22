// Render-level tests: exercise render()/renderVals() per role and assert the
// resulting element tree reflects the access rules (gating + wilayah scoping).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { makeInstance, treeText } = require('./harness');

function render(overrides) {
  const c = makeInstance(overrides);
  return treeText(c.render());
}

test('logged-out users see the login screen, not the app', () => {
  const txt = render({ auth: null });
  assert.match(txt, /Akun Demo/);
  assert.match(txt, /Masuk/);
  assert.doesNotMatch(txt, /Total KK/);
});

test('Operator dashboard shows all 18 households', () => {
  const txt = render({ auth: { role: 'Operator', nama: 'Komang Sutarja', wilayah: null }, view: 'dashboard' });
  assert.match(txt, /Total KK/);
  assert.match(txt, /"val":18/);
  assert.doesNotMatch(txt, /Hanya-Lihat/);
});

test('Operator daftar view exposes CRUD controls and all desa', () => {
  const txt = render({ auth: { role: 'Operator', nama: 'Komang Sutarja', wilayah: null }, view: 'daftar' });
  assert.match(txt, /\+ Tambah Data/);
  assert.match(txt, /I Wayan Sukra/);  // Desa Sambirenteng
  assert.match(txt, /I Gede Mangku/);  // Desa Tembok
  assert.match(txt, /Desa Penuktukan/); // desa shown / filterable
});

test('Kepala SLS is read-only and scoped to its banjar', () => {
  const txt = render({ auth: { role: 'Kepala SLS', nama: 'I Made Astawan', wilayah: 'Banjar Dinas Tembok' }, view: 'daftar' });
  assert.match(txt, /Hanya-Lihat/);
  assert.doesNotMatch(txt, /\+ Tambah Data/);
  // In-scope household present, out-of-scope household absent.
  assert.match(txt, /I Wayan Repot/);    // Banjar Dinas Tembok
  assert.doesNotMatch(txt, /I Wayan Sukra/); // Desa Sambirenteng
});

test('Kepala SLS dashboard totals are scoped', () => {
  const txt = render({ auth: { role: 'Kepala SLS', nama: 'I Made Astawan', wilayah: 'Banjar Dinas Tembok' }, view: 'dashboard' });
  assert.match(txt, /Total KK/);
  assert.doesNotMatch(txt, /"val":18/); // not all 18
});

test('Operator form view renders the 5 FASIH blocks, both rosters, and the validation summary', () => {
  const c = makeInstance({ auth: { role: 'Operator', nama: 'Op', wilayah: null } });
  c.state.form = c.blankForm();
  c.state.view = 'form';
  const txt = treeText(c.render());
  assert.match(txt, /Keterangan Identitas Keluarga/);   // Blok I
  assert.match(txt, /Keterangan Perumahan/);            // Blok II
  assert.match(txt, /Kepemilikan Aset/);                // Blok III
  assert.match(txt, /Keterangan Anggota Keluarga/);     // Blok IV
  assert.match(txt, /Roster Meteran/);                  // R18 roster
  assert.match(txt, /\+ Tambah Anggota/);               // anggota roster control
  assert.match(txt, /Submit \/ Finalisasi/);
  // a blank form is full of galat → the finalize button is disabled (gate)
  assert.match(txt, /"disabled":true/);
});

test('a finalizable household enables the Submit/Finalisasi button', () => {
  const c = makeInstance({ auth: { role: 'Operator', nama: 'Op', wilayah: null } });
  c.state.form = c.dataToForm(c.seedWarga().find((w) => w.id === 'w12'));
  c.state.view = 'form';
  const txt = treeText(c.render());
  assert.doesNotMatch(txt, /"disabled":true/); // galat=0 → submit enabled
});
