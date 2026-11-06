#!/usr/bin/env node
'use strict';

/**
 * Behavior eval runner for the Eazworld skills.
 *
 * For each scenario in evals/scenarios.js it builds a throwaway project, copies this
 * working tree's skills into it, runs Claude Code headless (`claude -p`), and evaluates
 * the scenario's checks against the agent's tool calls, replies, and files.
 *
 * This runs the real model, so it costs money and takes a few minutes: every run is
 * capped with --max-budget-usd, and only the fast scenarios run unless --all is given.
 *
 * Usage:
 *   node evals/run-evals.js [--list] [--all] [--scenario <id>]... [--budget <usd>]
 *                           [--repeat <n>] [--max-turns <n>] [--model <name>] [--keep]
 *                           [--claude <bin>]
 *
 * --repeat runs each scenario n times and reports a pass rate; model output varies, so one
 * failure is a signal and a failure in most runs is a finding.
 *
 * Results (raw transcripts + summary.json) are saved under evals/results/<timestamp>/.
 * Exit codes: 0 = every check passed, 1 = a check failed, 2 = usage or runtime error.
 *
 * ctx passed to each check:
 *   turns[i]   { final, allText, toolUses:[{name,input}], cost, sessionId, stopReason }
 *   skillsInvoked  names passed to the Skill tool, across all turns
 *   files      every file in the project (relative paths, excluding .claude and node_modules)
 *   created    files that were not in the seed
 *   read(rel)  contents of a project file, or null
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const SKILLS_SRC = path.join(REPO_ROOT, '.claude', 'skills');
const SKIP_DIRS = new Set(['.claude', 'node_modules', '.git']);

function parseArgs(argv) {
  const o = {
    list: false, all: false, ids: [], budget: 1.5, maxTurns: 14, repeat: 1, model: null,
    keep: false, claude: 'claude',
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined) usage(`${a} needs a value`);
      return v;
    };
    if (a === '--list') o.list = true;
    else if (a === '--all') o.all = true;
    else if (a === '--scenario') o.ids.push(next());
    else if (a === '--budget') o.budget = Number(next());
    else if (a === '--max-turns') o.maxTurns = Number(next());
    else if (a === '--repeat') o.repeat = Number(next());
    else if (a === '--model') o.model = next();
    else if (a === '--keep') o.keep = true;
    else if (a === '--claude') o.claude = next();
    else if (a === '-h' || a === '--help') usage(null, 0);
    else usage(`unknown option "${a}"`);
  }
  if (!(o.budget > 0) || !(o.maxTurns > 0) || !(o.repeat >= 1)) usage('--budget, --max-turns and --repeat must be positive numbers');
  return o;
}

function usage(msg, code = 2) {
  if (msg) console.error(`Error: ${msg}`);
  console.error(
    'Usage: node evals/run-evals.js [--list] [--all] [--scenario <id>]... [--budget <usd>] ' +
      '[--repeat <n>] [--max-turns <n>] [--model <name>] [--keep] [--claude <bin>]'
  );
  process.exit(code);
}

function listFiles(root, rel = '') {
  const out = [];
  for (const e of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const relPath = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...listFiles(root, relPath));
    else out.push(relPath);
  }
  return out.sort();
}

function parseStream(stdout) {
  const turn = { final: '', allText: '', toolUses: [], cost: 0, sessionId: null, stopReason: null };
  const texts = [];
  for (const line of stdout.split('\n')) {
    if (!line.trim()) continue;
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    if (e.type === 'assistant' && e.message && Array.isArray(e.message.content)) {
      for (const b of e.message.content) {
        if (b.type === 'text') texts.push(b.text);
        else if (b.type === 'tool_use') turn.toolUses.push({ name: b.name, input: b.input || {} });
      }
    } else if (e.type === 'result') {
      turn.final = typeof e.result === 'string' ? e.result : '';
      turn.cost = e.total_cost_usd || 0;
      turn.sessionId = e.session_id || null;
      turn.stopReason = e.subtype || null;
    }
  }
  turn.allText = texts.join('\n');
  if (!turn.final) turn.final = texts[texts.length - 1] || '';
  return turn;
}

function runScenario(sc, opts, resultsDir, run = 1) {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), `eazworld-eval-${sc.id}-`));
  fs.mkdirSync(path.join(project, '.claude'), { recursive: true });
  fs.cpSync(SKILLS_SRC, path.join(project, '.claude', 'skills'), { recursive: true });
  for (const [rel, text] of Object.entries(sc.seed || {})) {
    const full = path.join(project, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, text);
  }
  const seedFiles = new Set(listFiles(project));

  const turns = [];
  let sessionId = null;
  let error = null;
  for (let i = 0; i < sc.turns.length; i++) {
    const args = [
      '-p', sc.turns[i],
      '--output-format', 'stream-json', '--verbose',
      '--setting-sources', 'project',
      '--strict-mcp-config',
      '--permission-mode', 'acceptEdits',
      '--max-turns', String(opts.maxTurns),
      '--max-budget-usd', String(opts.budget),
    ];
    if (sessionId) args.push('--resume', sessionId);
    if (opts.model) args.push('--model', opts.model);

    const res = spawnSync(opts.claude, args, {
      cwd: project, encoding: 'utf8', input: '', timeout: 15 * 60 * 1000, maxBuffer: 256 * 1024 * 1024,
    });
    fs.writeFileSync(path.join(resultsDir, `${sc.id}.run${run}.turn${i + 1}.jsonl`), res.stdout || '');
    if (res.error || res.status !== 0) {
      error = res.error ? res.error.message : `claude exited with code ${res.status}: ${String(res.stderr).slice(0, 300)}`;
      const partial = parseStream(res.stdout || '');
      turns.push(partial);
      break;
    }
    const turn = parseStream(res.stdout);
    turns.push(turn);
    sessionId = turn.sessionId;
    if (!sessionId && i < sc.turns.length - 1) { error = 'no session id returned; cannot continue the conversation'; break; }
  }

  const files = listFiles(project);
  const ctx = {
    turns,
    skillsInvoked: turns.flatMap((t) => t.toolUses.filter((u) => u.name === 'Skill').map((u) => u.input.skill)),
    files,
    created: files.filter((f) => !seedFiles.has(f)),
    read: (rel) => {
      try { return fs.readFileSync(path.join(project, rel), 'utf8'); } catch { return null; }
    },
  };

  const checks = sc.checks.map((c) => {
    let outcome;
    try { outcome = error ? `run failed: ${error}` : c.test(ctx); } catch (e) { outcome = `check threw: ${e.message}`; }
    return { name: c.name, pass: outcome === true, detail: outcome === true ? '' : String(outcome) };
  });

  const cost = turns.reduce((s, t) => s + t.cost, 0);
  if (!opts.keep) fs.rmSync(project, { recursive: true, force: true });
  return { id: sc.id, description: sc.description, checks, cost, error, project: opts.keep ? project : null,
    skillsInvoked: ctx.skillsInvoked, created: ctx.created };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const scenarios = require('./scenarios');

  if (opts.list) {
    for (const s of scenarios) console.log(`${s.id}${s.slow ? '  (slow: needs --all)' : ''}\n    ${s.description}`);
    return;
  }

  const known = new Set(scenarios.map((s) => s.id));
  for (const id of opts.ids) if (!known.has(id)) usage(`unknown scenario "${id}" (try --list)`);
  const selected = scenarios.filter((s) => (opts.ids.length ? opts.ids.includes(s.id) : opts.all || !s.slow));

  const probe = spawnSync(opts.claude, ['--version'], { encoding: 'utf8' });
  if (probe.error || probe.status !== 0) {
    console.error(`Error: could not run "${opts.claude}". Install Claude Code or pass --claude <path>.`);
    process.exit(2);
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsDir = path.join(__dirname, 'results', stamp);
  fs.mkdirSync(resultsDir, { recursive: true });

  console.log(`Eazworld skill evals — ${selected.length} scenario(s), up to $${opts.budget} each`);
  console.log(`Transcripts: ${path.relative(process.cwd(), resultsDir)}\n`);

  const results = [];
  for (const sc of selected) {
    for (let run = 1; run <= opts.repeat; run++) {
      const label = opts.repeat > 1 ? `${sc.id} (run ${run}/${opts.repeat})` : sc.id;
      process.stdout.write(`▶ ${label} ... `);
      const r = runScenario(sc, opts, resultsDir, run);
      results.push(r);
      const failed = r.checks.filter((c) => !c.pass);
      console.log(`${failed.length === 0 ? 'PASS' : 'FAIL'}  ($${r.cost.toFixed(2)})`);
      for (const c of r.checks) console.log(`   ${c.pass ? '✓' : '✗'} ${c.name}${c.pass ? '' : `  — ${c.detail}`}`);
      console.log(`   skills invoked: ${r.skillsInvoked.join(', ') || 'none'}`);
      if (r.created.length) console.log(`   files created: ${r.created.join(', ')}`);
      if (r.project) console.log(`   project kept at: ${r.project}`);
      console.log('');
    }
  }

  const total = results.reduce((s, r) => s + r.cost, 0);
  const passed = (r) => r.checks.every((c) => c.pass);
  console.log('Pass rate per scenario:');
  for (const sc of selected) {
    const runs = results.filter((r) => r.id === sc.id);
    console.log(`  ${runs.filter(passed).length}/${runs.length}  ${sc.id}`);
  }
  fs.writeFileSync(path.join(resultsDir, 'summary.json'), JSON.stringify({ stamp, total, results }, null, 2));
  console.log(`\nTotal cost $${total.toFixed(2)}`);
  process.exit(results.every(passed) ? 0 : 1);
}

main();
