// Build step: concatenate src/*.js/*.jsx in dependency order, compile JSX → plain JS.
// The result is a single vendor/app.js loaded as a classic <script> (React UMD globals).
// Run: node build.js
const fs   = require('fs');
const path = require('path');
const babel = require('@babel/standalone');

// Source files in strict dependency order.
const SRC_FILES = [
  'src/utils.js',           // css(), getPath(), setPath()
  'src/schema.js',          // KODE, BLOK2, ANGGOTA_FIELDS, etc.
  'src/component.jsx',      // class Component (constructor + core methods)
  'src/component-data.jsx', // Object.assign: data / factory methods
  'src/component-handlers.jsx', // Object.assign: event handler methods
  'src/app.jsx',            // Object.assign: render methods + ReactDOM.render
];

const srcDir = __dirname;
const outPath = path.join(__dirname, 'vendor', 'app.js');

const combined = SRC_FILES
  .map(f => fs.readFileSync(path.join(srcDir, f), 'utf8'))
  .join('\n');

const { code } = babel.transform(combined, {
  presets: [['react', { runtime: 'classic' }]],
  compact: false,
});

const banner = '/* AUTO-GENERATED from src/* by build.js — do not edit directly. */\n';
fs.writeFileSync(outPath, banner + code, 'utf8');
console.log('Built vendor/app.js (' + (banner.length + code.length) + ' bytes)');
console.log('Sources:', SRC_FILES.join(', '));
