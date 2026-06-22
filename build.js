// Build step: compile src/app.jsx (JSX) -> vendor/app.js (plain JS, classic
// runtime so it runs as a normal <script> with the React UMD globals, no Babel
// needed in the browser). Run: node build.js
const fs = require('fs');
const path = require('path');
const babel = require('@babel/standalone');

const srcPath = path.join(__dirname, 'src', 'app.jsx');
const outPath = path.join(__dirname, 'vendor', 'app.js');

const src = fs.readFileSync(srcPath, 'utf8');
const { code } = babel.transform(src, {
  presets: [['react', { runtime: 'classic' }]],
  compact: false
});

const banner = '/* AUTO-GENERATED from src/app.jsx by build.js — do not edit directly. */\n';
fs.writeFileSync(outPath, banner + code, 'utf8');
console.log('Built vendor/app.js (' + (banner.length + code.length) + ' bytes)');
