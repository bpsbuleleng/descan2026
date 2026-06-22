// Test harness: compile src/app.jsx in-memory and run it inside a sandbox with
// lightweight stubs for React / ReactDOM / DOM, so the Component class and the
// css() helper can be unit-tested in plain Node (no browser needed).
//
// React.createElement is stubbed to build a plain {type, props, children} tree,
// so render() can be exercised and the resulting tree serialized & searched.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const babel = require('@babel/standalone');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'app.jsx');
const BANNER = '/* AUTO-GENERATED from src/app.jsx by build.js — do not edit directly. */\n';

// Compile JSX -> JS exactly like build.js (classic runtime, not compact).
function compile(src) {
  return babel.transform(src, {
    presets: [['react', { runtime: 'classic' }]],
    compact: false
  }).code;
}

function makeLocalStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
    clear: () => m.clear()
  };
}

// A minimal React stand-in. createElement records a serializable tree.
function makeReact() {
  class ReactComponent {
    constructor(props) { this.props = props || {}; }
    setState(updater) {
      const partial = (typeof updater === 'function') ? updater(this.state) : updater;
      this.state = Object.assign({}, this.state, partial);
    }
  }
  const Fragment = { __fragment: true };
  const createElement = (type, props, ...children) => ({
    type: (typeof type === 'function' ? (type.name || 'fn') : type),
    props: props || {},
    children: children.flat(Infinity).filter((c) => c != null && c !== false)
  });
  return { Component: ReactComponent, Fragment, createElement };
}

// Load a fresh app context. Returns { Component, css, errors }.
function loadApp() {
  const src = fs.readFileSync(SRC, 'utf8');
  let code;
  try {
    code = compile(src);
  } catch (e) {
    return { error: e };
  }
  code += '\n;globalThis.__APP__ = { Component: Component, css: css };';

  const sandbox = {
    React: makeReact(),
    ReactDOM: { createRoot: () => ({ render() {} }) },
    window: { localStorage: makeLocalStorage(), confirm: () => true },
    document: { getElementById: () => ({}) },
    setTimeout: () => 0,
    clearTimeout: () => {},
    console
  };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'app.jsx.compiled.js' });
  return { Component: sandbox.__APP__.Component, css: sandbox.__APP__.css, sandbox };
}

// Create a Component instance with optional state overrides.
function makeInstance(overrides) {
  const { Component } = loadApp();
  const c = new Component({ namaDesa: 'Desa Sukamaju', namaOperator: 'Budi Santoso' });
  if (overrides) c.state = Object.assign({}, c.state, overrides);
  return c;
}

// Serialize a render() tree to a searchable string (props strings + text children).
function treeText(node) {
  try { return JSON.stringify(node); } catch (e) { return ''; }
}

module.exports = { loadApp, makeInstance, compile, treeText, BANNER, SRC, ROOT };
