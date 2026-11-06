'use strict';

/**
 * Tests for .claude/skills/eaz-frontend-design/scripts/check-contrast.cjs.
 * Run: node --test scripts/
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('path');
const fs = require('fs');
const os = require('node:os');

const SCRIPT = path.join(
  __dirname, '..', '.claude', 'skills', 'eaz-frontend-design', 'scripts', 'check-contrast.cjs'
);

const LIGHT = {
  'bg-app': '#F8FAFC', surface: '#FFFFFF', border: '#7C8291', 'text-primary': '#0F172A',
  'text-muted': '#475569', 'action-primary': '#1F3A93', 'text-on-action': '#FFFFFF',
  accent: '#B45309', success: '#166534', warning: '#B45309', danger: '#B91C1C', 'focus-ring': '#1D4ED8',
};
const DARK = {
  'bg-app': '#0B1020', surface: '#121A2E', border: '#7A859E', 'text-primary': '#F1F5F9',
  'text-muted': '#A7B0C3', 'action-primary': '#8FA8FF', 'text-on-action': '#0B1020',
  accent: '#F59E0B', success: '#4ADE80', warning: '#FBBF24', danger: '#F87171', 'focus-ring': '#93C5FD',
};

function table(light, dark, edits = {}) {
  const rows = Object.keys(light).map((k) => {
    const l = edits[k] || light[k];
    const d = dark === null ? 'none' : dark[k];
    return `| \`${k}\` | ${l} | ${d} | role |`;
  });
  return ['# DESIGN.md', '', '## Tokens', '', '| Token | Light | Dark | Role |', '| :--- | :--- | :--- | :--- |', ...rows, '', '## Contrast Check', '', 'TBD', ''].join('\n');
}

function run(text, args = []) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eazworld-contrast-'));
  const file = path.join(dir, 'DESIGN.md');
  fs.writeFileSync(file, text);
  const res = spawnSync(process.execPath, [SCRIPT, file, ...args], { encoding: 'utf8' });
  const after = fs.readFileSync(file, 'utf8');
  fs.rmSync(dir, { recursive: true, force: true });
  return { res, after };
}

test('a complete, accessible palette passes for light and dark', () => {
  const { res } = run(table(LIGHT, DARK));
  assert.strictEqual(res.status, 0, res.stdout);
  assert.match(res.stdout, /All pairs pass/);
  assert.match(res.stdout, /\[dark\]/);
});

test('a failing pair is reported with its ratio and exits 1', () => {
  const { res } = run(table(LIGHT, DARK, { 'text-muted': '#CBD5E1' }));
  assert.strictEqual(res.status, 1, res.stdout);
  assert.match(res.stdout, /FAIL\s+[\d.]+\s+\[light\] text-muted on bg-app/);
});

test('"none" in the Dark column skips the dark checks', () => {
  const { res } = run(table(LIGHT, null));
  assert.strictEqual(res.status, 0, res.stdout);
  assert.doesNotMatch(res.stdout, /\[dark\]/);
  assert.match(res.stdout, /light theme only/);
});

test('a missing required token fails and is named', () => {
  const light = { ...LIGHT };
  delete light.danger;
  const { res } = run(table(light, null));
  assert.strictEqual(res.status, 1, res.stdout);
  assert.match(res.stdout, /MISSING tokens[^\n]*danger/);
});

test('ratios are calculated correctly (black on white is 21:1)', () => {
  const { res } = run(table({ ...LIGHT, 'text-primary': '#000000', 'bg-app': '#FFFFFF' }, null));
  assert.match(res.stdout, /21\s+\[light\] text-primary on bg-app/);
});

test('--write replaces the Contrast Check section with a results table', () => {
  const { res, after } = run(table(LIGHT, DARK), ['--write']);
  assert.strictEqual(res.status, 0, res.stdout);
  assert.match(after, /## Contrast Check\n[\s\S]*\| Theme \| Pair \|/);
  assert.doesNotMatch(after, /^TBD$/m);
  assert.match(after, /`text-primary` on `bg-app`/);
});
