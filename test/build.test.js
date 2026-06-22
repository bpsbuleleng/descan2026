// Guard: vendor/app.js must be an up-to-date build of src/app.jsx.
// If this fails, run `node build.js` (or `npm run build`) and commit the result.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { compile, BANNER, SRC, ROOT } = require('./harness');

test('vendor/app.js is in sync with src/app.jsx (run `npm run build` if this fails)', () => {
  const expected = BANNER + compile(fs.readFileSync(SRC, 'utf8'));
  const actual = fs.readFileSync(path.join(ROOT, 'vendor', 'app.js'), 'utf8');
  assert.equal(actual, expected);
});
