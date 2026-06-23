// Guard: vendor/app.js must be an up-to-date build of src/*.
// If this fails, run `node build.js` (or `npm run build`) and commit the result.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { compile, loadSrc, BANNER, ROOT } = require('./harness');

test('vendor/app.js is in sync with src/* (run `npm run build` if this fails)', () => {
  const expected = BANNER + compile(loadSrc());
  const actual = fs.readFileSync(path.join(ROOT, 'vendor', 'app.js'), 'utf8');
  assert.equal(actual, expected);
});
