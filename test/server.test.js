// Tests for the Google-Sheets server sync layer (client side), using a fake
// fetch backed by an in-memory server that mirrors server/Code.gs behaviour.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { makeInstance, flush } = require('./harness');

const API = 'https://script.example/exec';

function makeServer() {
  const users = {
    operator: { password: 'operator123', nama: 'Komang Sutarja', role: 'Operator', wilayah: null },
    'sls.tembok': { password: 'sls123', nama: 'I Made Astawan', role: 'Kepala SLS', wilayah: 'Banjar Dinas Tembok' }
  };
  const warga = [
    { id: 'w13', nama: 'I Wayan Repot', desa: 'Desa Tembok', dusun: 'Banjar Dinas Tembok', desil: 1, bansos: 'PKH' },
    { id: 'w01', nama: 'I Wayan Sukra', desa: 'Desa Sambirenteng', dusun: 'Banjar Dinas Sambirenteng', desil: 1, bansos: 'PKH + BPNT' }
  ];
  const sanggahan = [];
  const calls = [];
  const auth = (a) => { if (!a) return null; const u = users[String(a.username || '').toLowerCase()]; return (u && u.password === a.password) ? { username: a.username, nama: u.nama, role: u.role, wilayah: u.wilayah } : null; };
  const canWrite = (u) => u && (u.role === 'Operator' || u.role === 'Kepala Desa');
  function handle(req) {
    const { action, auth: cred, payload } = req;
    if (action === 'login') { const u = auth(payload); return u ? { ok: true, user: u } : { ok: false, error: 'Username atau kata sandi salah.' }; }
    const u = auth(cred); if (!u) return { ok: false, error: 'unauth' };
    if (action === 'bootstrap') {
      let w = warga, s = sanggahan;
      if (u.role === 'Kepala SLS' && u.wilayah) { w = warga.filter((x) => x.dusun === u.wilayah); const ids = {}; w.forEach((x) => { ids[x.id] = 1; }); s = sanggahan.filter((x) => ids[x.wargaId]); }
      return { ok: true, warga: w, sanggahan: s };
    }
    if (!canWrite(u)) return { ok: false, error: 'Hanya Operator & Kepala Desa yang boleh mengubah data.' };
    if (action === 'saveWarga') { const i = warga.findIndex((x) => x.id === payload.warga.id); if (i >= 0) warga[i] = payload.warga; else warga.push(payload.warga); return { ok: true }; }
    if (action === 'submitSanggahan') { sanggahan.push(payload.sanggahan); return { ok: true }; }
    if (action === 'updateSanggahan') { return { ok: true }; }
    if (action === 'reset') { return { ok: true }; }
    return { ok: false, error: 'unknown' };
  }
  const fetch = (url, opt) => { const req = JSON.parse(opt.body); calls.push(req); return Promise.resolve({ json: () => Promise.resolve(handle(req)) }); };
  return { fetch, calls, warga, sanggahan };
}

function serverInstance(srv) {
  return makeInstance(null, { apiUrl: API, fetch: srv.fetch });
}

test('local mode by default (no apiUrl) — serverMode false', () => {
  assert.equal(makeInstance().serverMode(), false);
});

test('server mode: login authenticates against the server and bootstraps data', async () => {
  const srv = makeServer();
  const c = serverInstance(srv);
  assert.equal(c.serverMode(), true);
  c.state.loginForm = { username: 'operator', password: 'operator123', error: '' };
  c.login();
  await flush();
  assert.ok(c.state.auth, 'should be logged in');
  assert.equal(c.state.auth.role, 'Operator');
  assert.deepEqual(srv.calls.map((x) => x.action), ['login', 'bootstrap']);
  assert.equal(c.state.warga.length, 2); // replaced by server data
});

test('server mode: bad credentials are rejected, no bootstrap', async () => {
  const srv = makeServer();
  const c = serverInstance(srv);
  c.state.loginForm = { username: 'operator', password: 'salah', error: '' };
  c.login();
  await flush();
  assert.equal(c.state.auth, null);
  assert.ok(c.state.loginForm.error.length > 0);
  assert.ok(!srv.calls.some((x) => x.action === 'bootstrap'));
});

test('server mode: Kepala SLS bootstrap is scoped to its banjar', async () => {
  const srv = makeServer();
  const c = serverInstance(srv);
  c.state.loginForm = { username: 'sls.tembok', password: 'sls123', error: '' };
  c.login();
  await flush();
  assert.equal(c.state.auth.role, 'Kepala SLS');
  assert.equal(c.state.warga.length, 1);
  assert.equal(c.state.warga[0].dusun, 'Banjar Dinas Tembok');
});

test('server mode: push(saveWarga) persists to the server with credentials', async () => {
  const srv = makeServer();
  const c = serverInstance(srv);
  c._cred = { username: 'operator', password: 'operator123' };
  c.push('saveWarga', { warga: { id: 'wZ', nama: 'KK Baru', dusun: 'Banjar Dinas Tembok' } });
  await flush();
  const saved = srv.warga.find((w) => w.id === 'wZ');
  assert.ok(saved, 'new warga should reach the server');
  assert.equal(saved.nama, 'KK Baru');
  const last = srv.calls[srv.calls.length - 1];
  assert.equal(last.action, 'saveWarga');
  assert.equal(last.auth.username, 'operator'); // credentials attached
});

test('server mode: saving a draft writes straight to the spreadsheet with status=draft', async () => {
  const srv = makeServer();
  const c = serverInstance(srv);
  c.state.loginForm = { username: 'operator', password: 'operator123', error: '' };
  c.login();
  await flush();
  c.state.form = c.blankForm();
  c.state.form.nama = 'KK Draf Server';
  c.state.view = 'form';
  c.simpanKeluarga('draft'); // draft is allowed even with galat, and pushes to server
  await flush();
  const last = srv.calls[srv.calls.length - 1];
  assert.equal(last.action, 'saveWarga');
  assert.equal(last.payload.warga.status, 'draft');
  assert.equal(last.payload.warga.nama, 'KK Draf Server');
  assert.ok(srv.warga.some((w) => w.nama === 'KK Draf Server'), 'draft persisted to the (fake) spreadsheet');
});