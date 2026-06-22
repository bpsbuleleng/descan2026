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

test('Operator dashboard shows all 8 households', () => {
  const txt = render({ auth: { role: 'Operator', nama: 'Budi Santoso', wilayah: null }, view: 'dashboard' });
  assert.match(txt, /Total KK/);
  assert.match(txt, /"val":8/);
  assert.doesNotMatch(txt, /Hanya-Lihat/);
});

test('Operator daftar view exposes CRUD controls', () => {
  const txt = render({ auth: { role: 'Operator', nama: 'Budi Santoso', wilayah: null }, view: 'daftar' });
  assert.match(txt, /\+ Tambah Data/);
  assert.match(txt, /Slamet Riyadi/);
  assert.match(txt, /Sukinem/);
});

test('Kepala SLS is read-only and scoped to its dusun', () => {
  const txt = render({ auth: { role: 'Kepala SLS', nama: 'Sarno', wilayah: 'Dusun Krajan' }, view: 'daftar' });
  assert.match(txt, /Hanya-Lihat/);
  assert.doesNotMatch(txt, /\+ Tambah Data/);
  // In-scope household present, out-of-scope household absent.
  assert.match(txt, /Slamet Riyadi/);   // Dusun Krajan
  assert.doesNotMatch(txt, /Sukinem/);  // Dusun Ngasem
});

test('Kepala SLS dashboard totals are scoped', () => {
  const txt = render({ auth: { role: 'Kepala SLS', nama: 'Sarno', wilayah: 'Dusun Krajan' }, view: 'dashboard' });
  assert.match(txt, /Total KK/);
  assert.doesNotMatch(txt, /"val":8/); // not all 8
});
