#!/usr/bin/env node
'use strict';

/**
 * Contrast check for the frontend-design skill.
 *
 * Reads the token table in a project's DESIGN.md, computes WCAG 2.x contrast ratios for the
 * standard text/background pairs, and reports pass or fail for the light theme and, when dark
 * values exist, the dark theme. Ratios are calculated, never estimated.
 *
 * Token table format (names are fixed so the check can find them):
 *
 *   | Token | Light | Dark | Role |
 *   | `bg-app` | #F8FAFC | #0B1020 | Page background |
 *
 * Required tokens: bg-app, surface, border, text-primary, text-muted, action-primary,
 * text-on-action, accent, success, warning, danger, focus-ring. A Dark column of "none" (or
 * empty) for every row means "no dark theme at launch" and the dark checks are skipped.
 *
 * Usage: node check-contrast.cjs [DESIGN.md] [--write] [--json]
 *   --write  replace the body of the "## Contrast Check" section of DESIGN.md with the results
 * Exit codes: 0 = all pairs pass, 1 = a pair fails or a required token is missing, 2 = usage error.
 */

const fs = require('fs');

const REQUIRED = [
  'bg-app', 'surface', 'border', 'text-primary', 'text-muted', 'action-primary',
  'text-on-action', 'accent', 'success', 'warning', 'danger', 'focus-ring',
];

// [foreground, background, minimum ratio, what it protects]
const PAIRS = [
  ['text-primary', 'bg-app', 4.5, 'body text'],
  ['text-primary', 'surface', 4.5, 'text on cards'],
  ['text-muted', 'bg-app', 4.5, 'secondary text'],
  ['text-muted', 'surface', 4.5, 'secondary text on cards'],
  ['text-on-action', 'action-primary', 4.5, 'button label'],
  ['action-primary', 'bg-app', 3, 'button / link boundary'],
  ['border', 'bg-app', 3, 'control (input) boundary'],
  ['focus-ring', 'bg-app', 3, 'keyboard focus ring'],
  ['danger', 'bg-app', 4.5, 'error text'],
  ['success', 'bg-app', 4.5, 'success text'],
  ['warning', 'bg-app', 3, 'warning icon or fill (never body text)'],
  ['accent', 'bg-app', 3, 'accent fill or icon (never body text)'],
];

const HEX_RE = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/;

function usage(msg, code = 2) {
  if (msg) console.error(`Error: ${msg}`);
  console.error('Usage: node check-contrast.cjs [DESIGN.md] [--write] [--json]');
  process.exit(code);
}

function toRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function parseTokens(text) {
  const tokens = {};
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    if (cells.length < 2) continue;
    const name = cells[0].replace(/`/g, '').toLowerCase();
    if (!REQUIRED.includes(name)) continue;
    const light = (cells[1].match(HEX_RE) || [])[0];
    const darkCell = cells[2] || '';
    const dark = (darkCell.match(HEX_RE) || [])[0];
    tokens[name] = { light, dark, darkNone: !darkCell || /^(none|—|-|n\/a)$/i.test(darkCell.replace(/`/g, '')) };
  }
  return tokens;
}

function evaluate(tokens) {
  const rows = [];
  const missing = REQUIRED.filter((n) => !tokens[n] || !tokens[n].light);
  const hasDark = REQUIRED.some((n) => tokens[n] && tokens[n].dark);
  for (const theme of hasDark ? ['light', 'dark'] : ['light']) {
    for (const [fg, bg, min, why] of PAIRS) {
      const a = tokens[fg] && tokens[fg][theme];
      const b = tokens[bg] && tokens[bg][theme];
      if (!a || !b) {
        rows.push({ theme, fg, bg, min, why, ratio: null, pass: false, note: 'missing value' });
        continue;
      }
      const r = ratio(a, b);
      rows.push({ theme, fg, bg, min, why, ratio: Math.round(r * 100) / 100, pass: r >= min });
    }
  }
  return { rows, missing, hasDark };
}

function markdownTable(result) {
  const lines = ['| Theme | Pair | Protects | Needs | Ratio | Result |', '| :--- | :--- | :--- | :--- | :--- | :--- |'];
  for (const r of result.rows) {
    lines.push(`| ${r.theme} | \`${r.fg}\` on \`${r.bg}\` | ${r.why} | ${r.min}:1 | ${r.ratio === null ? '—' : r.ratio} | ${r.pass ? 'Pass' : 'FAIL'} |`);
  }
  if (!result.hasDark) lines.push('', 'No dark theme at launch — dark pairs not checked.');
  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  let file = 'DESIGN.md';
  let write = false;
  let json = false;
  for (const a of args) {
    if (a === '--write') write = true;
    else if (a === '--json') json = true;
    else if (a === '-h' || a === '--help') usage(null, 0);
    else if (a.startsWith('-')) usage(`unknown option "${a}"`);
    else file = a;
  }
  if (!fs.existsSync(file)) usage(`file not found: ${file}`);
  const text = fs.readFileSync(file, 'utf8');
  const result = evaluate(parseTokens(text));
  const failed = result.rows.filter((r) => !r.pass);
  const ok = failed.length === 0 && result.missing.length === 0;

  if (json) {
    console.log(JSON.stringify({ ok, missing: result.missing, rows: result.rows }, null, 2));
  } else {
    if (result.missing.length) console.log(`MISSING tokens (need a hex Light value): ${result.missing.join(', ')}`);
    for (const r of result.rows) {
      console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.ratio === null ? '  —  ' : String(r.ratio).padStart(5)}  [${r.theme}] ${r.fg} on ${r.bg} (needs ${r.min}:1, ${r.why})${r.note ? ' — ' + r.note : ''}`);
    }
    console.log(`\n${ok ? 'All pairs pass' : `${failed.length} pair(s) fail, ${result.missing.length} token(s) missing`}${result.hasDark ? '' : ' (light theme only)'}`);
  }

  if (write && !json) {
    const body = `\n${markdownTable(result)}\n\nChecked by \`check-contrast.cjs\` (WCAG 2.x relative luminance). Body text needs 4.5:1; large text, icons, and control borders need 3:1.\n\n`;
    const re = /(^##\s+Contrast Check[^\n]*\n)([\s\S]*?)(?=^##\s|(?![\s\S]))/m;
    if (re.test(text)) fs.writeFileSync(file, text.replace(re, (_, head) => head + body));
    else fs.writeFileSync(file, `${text.replace(/\s*$/, '')}\n\n## Contrast Check\n${body}`);
    console.log(`Wrote results to ${file}`);
  }
  process.exit(ok ? 0 : 1);
}

main();
