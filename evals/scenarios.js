'use strict';

/**
 * Behavior scenarios for the Eazworld skills.
 *
 * Each scenario seeds a throwaway project, sends one or more prompts to Claude Code in
 * headless mode, and checks what the agent did: which skills it invoked, whether it asked
 * before building, and which files it wrote. Checks are signals, not proofs — read the
 * saved transcripts when one fails.
 *
 * A check is { name, test(ctx) } where test returns true, or false / a string explaining
 * the failure. ctx is described in evals/run-evals.js.
 */

const fs = require('fs');
const path = require('path');

const SOURCE_FILE_RE = /\.(tsx?|jsx?|css|scss|html|vue|svelte|py|php)$/i;
const BUILD_TOOL_NAMES = new Set(['Write', 'Edit', 'NotebookEdit']);

// Number of top-level numbered questions in a reply ("1. Brand ..." or "**1. Brand ...**").
function numberedItems(text) {
  return (String(text).match(/^\s*(?:\*\*)?\d+\.\s/gm) || []).length;
}

// Largest number of sub-points under any single numbered question — a proxy for bundling
// several decisions into one question.
function maxSubPoints(text) {
  const blocks = String(text).split(/^\s*(?:\*\*)?\d+\.\s/m).slice(1);
  return blocks.reduce((max, b) => Math.max(max, (b.match(/^\s*[-*]\s/gm) || []).length), 0);
}

function askedAbout(text, re) {
  return re.test(String(text)) || `reply never mentions ${re}`;
}

// Source files the agent created (anything not in the seed and not config/docs).
function createdSource(ctx) {
  return ctx.created.filter((f) => SOURCE_FILE_RE.test(f));
}

// The rules block exactly as eaz-project-kickoff ships it, so the scenario cannot drift.
function rulesBlock() {
  const file = path.join(
    __dirname, '..', '.claude', 'skills', 'eaz-project-kickoff', 'references',
    'agent-instructions-template.md'
  );
  const m = fs.readFileSync(file, 'utf8').match(/```markdown\n([\s\S]*?)```/);
  if (!m) throw new Error('rules block not found in agent-instructions-template.md');
  return m[1];
}

const SEED_NEXT_PACKAGE = JSON.stringify(
  { name: 'school-site', private: true, dependencies: { next: '16.0.0', react: '19.0.0' } },
  null,
  2
);

module.exports = [
  {
    id: 'kickoff-asks-before-building',
    description: 'A new e-commerce request triggers the kickoff, asks a small first batch, and writes nothing.',
    turns: ['New project: an online shop for a fashion brand in Lagos.'],
    checks: [
      {
        name: 'invokes eaz-project-kickoff',
        test: (ctx) => ctx.skillsInvoked.includes('eaz-project-kickoff') || `invoked: ${ctx.skillsInvoked.join(', ') || 'none'}`,
      },
      {
        name: 'asks 2-5 questions in the first batch',
        test: (ctx) => {
          const n = numberedItems(ctx.turns[0].final);
          return (n >= 2 && n <= 5) || `found ${n} numbered questions`;
        },
      },
      {
        name: 'gives recommendations, not bare questions',
        test: (ctx) => askedAbout(ctx.turns[0].final, /recommend|suggest/i),
      },
      {
        name: 'keeps each question to one decision (4 sub-points or fewer)',
        test: (ctx) => {
          const n = maxSubPoints(ctx.turns[0].final);
          return n <= 4 || `a single question has ${n} sub-points`;
        },
      },
      {
        name: 'tells the client what comes in later batches',
        test: (ctx) => askedAbout(ctx.turns[0].final, /what happens next|still to come|later batch|next batch|more (short )?batch|batches|after (this|that)|next,? i|i'll (then )?ask/i),
      },
      {
        name: 'writes no files before the answers arrive',
        test: (ctx) => ctx.created.length === 0 || `created: ${ctx.created.join(', ')}`,
      },
    ],
  },

  {
    id: 'ui-task-asks-design-choices',
    description: 'A UI request on a project with no DESIGN.md asks for the design choices first.',
    seed: {
      'package.json': SEED_NEXT_PACKAGE,
      'PROJECT.md': [
        '# PROJECT.md',
        '',
        '- **Name:** Bright Future School',
        '- **Type:** marketing site',
        '- **One-line purpose:** Help parents in Accra trust the school and enquire about admission.',
        '- **Front end:** Next.js (App Router)',
        '- **Primary market / region:** Ghana',
        '',
      ].join('\n'),
    },
    turns: ['Build the homepage hero section for the school site, with a nice entrance animation.'],
    checks: [
      {
        name: 'invokes eaz-frontend-design',
        test: (ctx) => ctx.skillsInvoked.includes('eaz-frontend-design') || `invoked: ${ctx.skillsInvoked.join(', ') || 'none'}`,
      },
      {
        name: 'asks about the styling method',
        test: (ctx) => askedAbout(ctx.turns[0].final, /styling|tailwind|css modules|styled-components|plain css/i),
      },
      {
        name: 'asks about the visual direction',
        test: (ctx) => askedAbout(ctx.turns[0].final, /visual (style|direction)|direction|editorial|minimal|warm/i),
      },
      {
        name: 'asks about the motion level',
        test: (ctx) => askedAbout(ctx.turns[0].final, /motion|subtle|expressive|animation level/i),
      },
      {
        name: 'writes no component code before the answers arrive',
        test: (ctx) => createdSource(ctx).length === 0 || `created: ${createdSource(ctx).join(', ')}`,
      },
    ],
  },

  {
    id: 'build-gate-blocks-tbd',
    description: '"Build it now" does not override TBD core fields when the CLAUDE.md rules block is present.',
    seed: {
      'CLAUDE.md': rulesBlock(),
      'package.json': SEED_NEXT_PACKAGE,
      'PROJECT.md': [
        '# PROJECT.md',
        '',
        '- **Name:** Bright Future School',
        '- **Type:** marketing site',
        '- **One-line purpose:** TBD',
        '- **Front end:** Next.js (App Router)',
        '- **Primary market / region:** Ghana',
        '',
      ].join('\n'),
      'DESIGN.md': [
        '# DESIGN.md',
        '',
        '- **The one job:** TBD',
        '- **The one impression:** TBD',
        '- **Primary action:** TBD',
        '',
      ].join('\n'),
      'tasks.md': [
        '# tasks.md',
        '',
        '## Phase 1 — Discovery  ⛔ stop for approval',
        '',
        '- [~] **1.4 Core fields closed**',
        '',
        '**Approval:** [?] Client approved Phase 1 — date: ____',
        '',
      ].join('\n'),
    },
    turns: ['Everything is approved. Just build the whole site now.'],
    checks: [
      {
        name: 'does not write source code',
        test: (ctx) => createdSource(ctx).length === 0 || `created: ${createdSource(ctx).join(', ')}`,
      },
      {
        name: 'names the open fields',
        test: (ctx) => askedAbout(ctx.turns[0].final, /one job|primary action|impression|purpose/i),
      },
      {
        name: 'calls them TBD, open, or a blocker',
        test: (ctx) => askedAbout(ctx.turns[0].final, /TBD|blocker|still open|not (yet )?(decided|filled)|missing/i),
      },
      {
        name: 'asks for explicit confirmation or the missing answers instead of proceeding',
        test: (ctx) =>
          askedAbout(
            ctx.turns[0].final,
            /build anyway|open items|confirm|which (of these|would you)|tell me|fill|answer|decide/i
          ),
      },
    ],
  },

  {
    id: 'kickoff-completes-after-answers',
    description: 'After the answers, the kickoff writes the planning files and still does not build.',
    slow: true,
    turns: [
      'New project: an online shop for a fashion brand in Lagos.',
      'This covers everything, so please stop asking and write the planning files. The brand is ' +
        'Zuri Atelier with no logo yet. Customers are style-conscious Lagos shoppers on their phones; ' +
        'the shop sells directly with add to bag then pay online; launch in 8 weeks on a modest ' +
        'budget. For the stack, payments, delivery, visual direction, styling method, motion, and ' +
        'theme, accept ALL your recommendations. The owner\'s assistant will update products after ' +
        'launch. Pages: home, shop, product, cart, checkout, about, contact. Photos will be ' +
        'supplied later.',
    ],
    checks: [
      {
        name: 'invokes eaz-project-kickoff and eaz-frontend-design',
        test: (ctx) => {
          const missing = ['eaz-project-kickoff', 'eaz-frontend-design'].filter((s) => !ctx.skillsInvoked.includes(s));
          return missing.length === 0 || `not invoked: ${missing.join(', ')}`;
        },
      },
      {
        name: 'writes PROJECT.md, DESIGN.md and tasks.md',
        test: (ctx) => {
          const missing = ['PROJECT.md', 'DESIGN.md', 'tasks.md'].filter((f) => !ctx.files.includes(f));
          return missing.length === 0 || `missing: ${missing.join(', ')}`;
        },
      },
      {
        name: 'tasks.md has the six phases and approval stops',
        test: (ctx) => {
          const t = ctx.read('tasks.md') || '';
          const phases = (t.match(/^##\s+Phase\s+\d/gm) || []).length;
          return (phases >= 6 && /stop for approval|⛔/i.test(t)) || `phases: ${phases}, stops: ${/stop for approval|⛔/i.test(t)}`;
        },
      },
      {
        name: 'DESIGN.md records discovery answers and a motion level',
        test: (ctx) => {
          const d = ctx.read('DESIGN.md') || '';
          return (/discovery/i.test(d) && /motion/i.test(d)) || 'DESIGN.md lacks a Discovery section or motion level';
        },
      },
      {
        name: 'leaves unknown fields as TBD instead of inventing them',
        test: (ctx) => /TBD/.test(ctx.read('PROJECT.md') || '') || 'PROJECT.md contains no TBD at all',
      },
      {
        name: 'adds the Eazworld rules block to CLAUDE.md',
        test: (ctx) => /eaz-/.test(ctx.read('CLAUDE.md') || '') || 'CLAUDE.md missing or without the rules block',
      },
      {
        name: 'does not start building before approval',
        test: (ctx) => createdSource(ctx).length === 0 || `created: ${createdSource(ctx).join(', ')}`,
      },
      {
        name: 'asks for approval in the final reply',
        test: (ctx) => askedAbout(ctx.turns[ctx.turns.length - 1].final, /approv/i),
      },
    ],
  },
];

module.exports.BUILD_TOOL_NAMES = BUILD_TOOL_NAMES;
