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

test('seed data has the expected shape', () => {
  const c = makeInstance();
  assert.equal(c.seedWarga().length, 8);
  assert.equal(c.seedSanggahan().length, 3);
  c.seedWarga().forEach((w) => {
    assert.ok(w.desil >= 1 && w.desil <= 10, 'desil in 1..10 for ' + w.nama);
    assert.ok(Array.isArray(w.snapshots) && w.snapshots.length >= 1);
  });
});

test('canCrud(): only Operator and Kepala Desa', () => {
  assert.equal(makeInstance({ auth: null }).canCrud(), false);
  assert.equal(makeInstance({ auth: { role: 'Operator' } }).canCrud(), true);
  assert.equal(makeInstance({ auth: { role: 'Kepala Desa' } }).canCrud(), true);
  assert.equal(makeInstance({ auth: { role: 'Kepala SLS', wilayah: 'Dusun Krajan' } }).canCrud(), false);
});

test('visibleWarga(): Kepala SLS is scoped to its wilayah', () => {
  const all = makeInstance({ auth: { role: 'Operator' } }).visibleWarga();
  assert.equal(all.length, 8);

  const sls = makeInstance({ auth: { role: 'Kepala SLS', wilayah: 'Dusun Krajan' } }).visibleWarga();
  assert.ok(sls.length > 0 && sls.length < 8);
  assert.ok(sls.every((w) => w.dusun === 'Dusun Krajan'));
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
  sls.state.loginForm = { username: 'sls.krajan', password: 'sls123', error: '' };
  sls.login();
  assert.equal(sls.state.auth.role, 'Kepala SLS');
  assert.equal(sls.state.auth.wilayah, 'Dusun Krajan');
});

test('CRUD handlers are no-ops for a read-only Kepala SLS', () => {
  const sls = makeInstance({ auth: { role: 'Kepala SLS', wilayah: 'Dusun Krajan' } });
  const before = sls.state.view;
  sls.onTambah();
  assert.equal(sls.state.view, before, 'onTambah must not open the form for SLS');
  assert.equal(sls.state.form, null);
});
