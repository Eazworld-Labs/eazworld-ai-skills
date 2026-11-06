#!/usr/bin/env node
'use strict';

/**
 * Token-enforcement check for the frontend-design skill.
 *
 * Scans UI source for raw design values that should be design tokens:
 *   - hex colors (#rgb, #rrggbb, #rrggbbaa) and rgb()/rgba()/hsl()/hsla() colors
 *   - px values that are not on the 4px grid (0, 1px and 2px are allowed for borders)
 *
 * Token files (theme, tokens, variables, global styles, Tailwind config) are skipped,
 * and so are custom-property declarations (`--color-x: #123456`) and media/container
 * query breakpoints. Zero dependencies; works on any stack that keeps styles in text
 * files.
 *
 * Usage: node check-tokens.cjs [dir ...] [--ignore <regex>] [--json]
 * Exit codes: 0 = clean, 1 = raw values found, 2 = usage error.
 */

const fs = require('fs');
const path = require('path');

const EXTENSIONS = new Set([
  '.css', '.scss', '.sass', '.less', '.tsx', '.jsx', '.ts', '.js', '.vue', '.svelte',
  '.astro', '.html', '.php', '.blade.php', '.dart', '.svg',
]);
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.next', '.nuxt', 'dist', 'build', 'out', 'coverage',
  'vendor', '.dart_tool', 'ios', 'android',
]);
const DEFAULT_TOKEN_FILE_RE =
  /(^|[\\/])(theme|tokens?|variables|colou?rs|palette|global-?styles?|globals?|tailwind\.config)[^\\/]*\.(css|scss|sass|less|ts|js|mjs|cjs|json|dart)$|(^|[\\/])app_?theme\.dart$|(^|[\\/])theme\.json$/i;

const HEX_RE = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/;
const FUNC_COLOR_RE = /\b(?:rgba?|hsla?)\(/i;
const PX_RE = /(?<![\w.#-])(\d+(?:\.\d+)?)px\b/g;
const CUSTOM_PROP_RE = /^\s*--[\w-]+\s*:/;
const BREAKPOINT_RE = /@media|@container|min-width|max-width|min-height|max-height|breakpoint/i;
const HEX_ENTITY_RE = /&#\d+;|#(?:[0-9a-fA-F]+)\s*(?:\{|,\s*\.)/; // CSS id selectors like #main {

function parseArgs(argv) {
  const opts = { dirs: [], ignore: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--ignore') {
      const v = argv[++i];
      if (!v) usage('--ignore needs a regex');
      try { opts.ignore = new RegExp(v); } catch (e) { usage(`bad --ignore regex: ${e.message}`); }
    } else if (a === '--json') opts.json = true;
    else if (a === '-h' || a === '--help') usage(null, 0);
    else if (a.startsWith('-')) usage(`unknown option "${a}"`);
    else opts.dirs.push(a);
  }
  if (opts.dirs.length === 0) opts.dirs.push(fs.existsSync('src') ? 'src' : '.');
  return opts;
}

function usage(msg, code = 2) {
  if (msg) console.error(`Error: ${msg}`);
  console.error('Usage: node check-tokens.cjs [dir ...] [--ignore <regex>] [--json]');
  process.exit(code);
}

function* walk(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.') && e.isDirectory()) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) yield* walk(full);
    } else if (EXTENSIONS.has(path.extname(e.name).toLowerCase())) {
      yield full;
    }
  }
}

function checkLine(line) {
  const hits = [];
  if (CUSTOM_PROP_RE.test(line)) return hits;
  if (!HEX_ENTITY_RE.test(line) && HEX_RE.test(line)) hits.push(['color', line.match(HEX_RE)[0]]);
  else if (FUNC_COLOR_RE.test(line)) hits.push(['color', line.match(FUNC_COLOR_RE)[0] + '...)']);
  if (!BREAKPOINT_RE.test(line)) {
    for (const m of line.matchAll(PX_RE)) {
      const n = parseFloat(m[1]);
      if (n === 0 || n === 1 || n === 2) continue;
      if (n % 4 !== 0) hits.push(['off-grid px', `${m[1]}px`]);
    }
  }
  return hits;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const findings = [];
  let scanned = 0;

  for (const dir of opts.dirs) {
    if (!fs.existsSync(dir)) usage(`path does not exist: ${dir}`);
    const files = fs.statSync(dir).isDirectory() ? [...walk(dir)] : [dir];
    for (const file of files) {
      if (DEFAULT_TOKEN_FILE_RE.test(file)) continue;
      if (opts.ignore && opts.ignore.test(file)) continue;
      scanned += 1;
      const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
      lines.forEach((line, i) => {
        for (const [kind, value] of checkLine(line)) {
          findings.push({ file: path.relative(process.cwd(), file), line: i + 1, kind, value });
        }
      });
    }
  }

  if (opts.json) {
    console.log(JSON.stringify({ scanned, findings }, null, 2));
  } else {
    for (const f of findings) console.log(`${f.file}:${f.line}  ${f.kind}  ${f.value}`);
    console.log(`\nFiles scanned: ${scanned} | Raw values: ${findings.length}`);
    if (findings.length) {
      console.log('Replace each with a design token, or justify it (e.g. one-off SVG art) in the report.');
    }
  }
  process.exit(findings.length ? 1 : 0);
}

main();
