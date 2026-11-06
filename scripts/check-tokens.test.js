'use strict';

/**
 * Tests for .claude/skills/eaz-frontend-design/scripts/check-tokens.cjs.
 * Builds throwaway projects in a temp directory and runs the script against them.
 *
 * Run: node --test scripts/
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('path');
const fs = require('fs');
const os = require('node:os');

const SCRIPT = path.join(
  __dirname, '..', '.claude', 'skills', 'eaz-frontend-design', 'scripts', 'check-tokens.cjs'
);

function project(files, packageJson) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eazworld-tokens-'));
  if (packageJson) fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(packageJson));
  for (const [rel, text] of Object.entries(files)) {
    const full = path.join(dir, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
  }
  return dir;
}

function run(dir, args = ['src']) {
  return spawnSync(process.execPath, [SCRIPT, ...args], { cwd: dir, encoding: 'utf8' });
}

test('flags raw colors, off-grid px, and raw durations in components', () => {
  const dir = project({
    'src/Card.tsx': [
      'const A = styled.div`',
      '  color: #12307A;',
      '  background: rgba(0,0,0,.5);',
      '  padding: 13px;',
      '  transition: opacity 300ms ease;',
      '`;',
    ].join('\n'),
  });
  try {
    const res = run(dir);
    assert.strictEqual(res.status, 1, res.stdout);
    assert.match(res.stdout, /Card\.tsx:2\s+color\s+#12307A/);
    assert.match(res.stdout, /Card\.tsx:3\s+color/);
    assert.match(res.stdout, /Card\.tsx:4\s+off-grid px\s+13px/);
    assert.match(res.stdout, /Card\.tsx:5\s+raw duration\s+300ms/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('passes clean code: tokens, 4px-grid values, breakpoints, ids, custom properties', () => {
  const dir = project({
    'src/styles/theme.ts': 'export const brand = "#12307A"; const gap = "13px"; const t = "300ms";',
    'src/Clean.tsx': [
      'const A = styled.div`',
      '  color: var(--color-text-primary);',
      '  padding: 24px;',
      '  border: 1px solid var(--color-border);',
      '  transition: opacity var(--duration-base) var(--ease-standard);',
      '  @media (min-width: 801px) { display: flex; }',
      '`;',
    ].join('\n'),
    'src/global.css': ':root { --brand: #12307A; --gap: 13px; }\n#main { margin: 0; }',
  });
  try {
    const res = run(dir);
    assert.strictEqual(res.status, 0, res.stdout);
    assert.match(res.stdout, /Raw values: 0/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('runs in an ES-module project (package.json "type": "module")', () => {
  const dir = project({ 'src/ok.css': '.a { margin: 8px; }' }, { type: 'module' });
  try {
    const res = run(dir);
    assert.strictEqual(res.status, 0, `${res.stdout}\n${res.stderr}`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('--ignore skips matching files and a bad option exits with code 2', () => {
  const dir = project({ 'src/legacy/old.css': '.a { color: #fff; }' });
  try {
    assert.strictEqual(run(dir, ['src', '--ignore', 'legacy']).status, 0);
    assert.strictEqual(run(dir, ['--bogus']).status, 2);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
