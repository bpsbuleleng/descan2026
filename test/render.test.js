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

test('login screen offers a Kritik & Saran entry point', () => {
  const txt = render({ auth: null });
  assert.match(txt, /Sampaikan Kritik & Saran/);
});

test('sidebar exposes a Kritik & Saran button for logged-in users', () => {
  const txt = render({ auth: { role: 'Operator', nama: 'Op', wilayah: null }, view: 'daftar' });
  assert.match(txt, /Kritik & Saran/);
});

test('opening the Kritik & Saran modal renders its form fields', () => {
  const txt = render({ auth: { role: 'Operator', nama: 'Op', wilayah: null }, view: 'daftar', showKritikModal: true });
  assert.match(txt, /Organisasi/);
  assert.match(txt, /Kritik \/ Saran/);
});

test('Admin sidebar exposes a Kotak Saran menu entry', () => {
  const txt = render({ auth: { role: 'Admin', nama: 'Administrator', wilayah: null }, view: 'daftar' });
  assert.match(txt, /Kotak Saran/);
});

test('Admin Kotak Saran view lists incoming kritik & saran', () => {
  const txt = render({ auth: { role: 'Admin', nama: 'Administrator', wilayah: null }, view: 'kritik' });
  assert.match(txt, /Kotak Saran/);
  assert.match(txt, /masukan/);       // count chip
  assert.match(txt, /fitur ekspor/);  // seeded kritik content surfaced to the admin
});

test('non-admin roles do not get the Kotak Saran inbox even at view=kritik', () => {
  const txt = render({ auth: { role: 'Operator', nama: 'Op', wilayah: null }, view: 'kritik' });
  assert.doesNotMatch(txt, /masukan/);      // inbox count chip absent
  assert.doesNotMatch(txt, /fitur ekspor/); // inbox content absent
});

test('Kepala SLS sees the "Ajukan Sanggahan" button on a household in its banjar', () => {
  const c = makeInstance({ auth: { role: 'Kepala SLS', nama: 'I Made Astawan', wilayah: 'Banjar Dinas Tembok' } });
  c.bukaRiwayat('w13');
  assert.match(treeText(c.render()), /\+ Ajukan Sanggahan/);
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
  assert.match(txt, /I Wayan Sukra/);  // Desa Sambirenteng — on page 1
  // All 3 desa appear in the filter dropdown (pagination hides page-2 rows)
  assert.match(txt, /Desa Tembok/);     // filterable
  assert.match(txt, /Desa Penuktukan/); // filterable
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

test('Operator form: sidebar lists all blocks, shows progress, and gates submit', () => {
  const c = makeInstance({ auth: { role: 'Operator', nama: 'Op', wilayah: null } });
  c.state.form = c.blankForm();
  c.state.view = 'form';
  const txt = treeText(c.render());
  // sidebar nav (all blocks always present, even when only block I is shown)
  assert.match(txt, /Keterangan Identitas Keluarga/);
  assert.match(txt, /Keterangan Perumahan/);
  assert.match(txt, /Keterangan Kepemilikan Aset/);
  assert.match(txt, /Keterangan Anggota Keluarga/);
  assert.match(txt, /Progres Pengisian/);   // progress bar
  assert.match(txt, /Ringkasan/);           // modal trigger
  assert.match(txt, /Submit \/ Finalisasi/);
  assert.match(txt, /Status Keberadaan Keluarga/); // active block I content
  // blank form is full of galat → finalize uses the disabled colour
  assert.match(txt, /#cbd5e1/);
});

test('Operator form: roster blocks render their controls when active', () => {
  const c = makeInstance({ auth: { role: 'Operator', nama: 'Op', wilayah: null } });
  c.state.form = c.blankForm();
  c.state.view = 'form';
  c.state.form._activeBlok = 'II';
  assert.match(treeText(c.render()), /Roster Meteran/);     // R18 roster (Blok II)
  c.state.form._activeBlok = 'IV';
  assert.match(treeText(c.render()), /\+ Tambah Anggota/);  // anggota roster (Blok IV)
});

test('Operator form: the Ringkasan modal lists galat with jump links', () => {
  const c = makeInstance({ auth: { role: 'Operator', nama: 'Op', wilayah: null } });
  c.state.form = c.blankForm();
  c.state.form._showRingkasan = true;
  c.state.view = 'form';
  const txt = treeText(c.render());
  assert.match(txt, /Daftar Galat/);
  assert.match(txt, /klik untuk menuju/);
});

test('Operator form: a finalizable household enables Submit/Finalisasi', () => {
  const c = makeInstance({ auth: { role: 'Operator', nama: 'Op', wilayah: null } });
  c.state.form = c.dataToForm(c.seedWarga().find((w) => w.id === 'w12'));
  c.state.view = 'form';
  const txt = treeText(c.render());
  assert.doesNotMatch(txt, /#cbd5e1/); // finalize not in disabled colour
  assert.match(txt, /#16a34a/);        // enabled green submit
});
