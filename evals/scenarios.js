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

// Builds a small PNG from horizontal color bands, so a scenario can seed a real image
// without committing a binary file. rows: [[r,g,b], ...], each band is bandHeight px.
function bandedPng(rows, width = 96, bandHeight = 32) {
  const zlib = require('zlib');
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (buf) => {
    let c = 0xffffffff;
    for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };
  const height = rows.length * bandHeight;
  const raw = [];
  rows.forEach(([r, g, b]) => {
    for (let y = 0; y < bandHeight; y++) {
      raw.push(0); // filter type: none
      for (let x = 0; x < width; x++) raw.push(r, g, b);
    }
  });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(Buffer.from(raw))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Skill names belonging to a department, read from each skill's metadata.department.
function skillsInDepartment(department) {
  const root = path.join(__dirname, '..', '.claude', 'skills');
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => {
      try {
        const text = fs.readFileSync(path.join(root, name, 'SKILL.md'), 'utf8');
        return new RegExp(`^\\s+department:\\s*${department}\\s*$`, 'm').test(text);
      } catch { return false; }
    });
}

function invokesOneOf(names) {
  return (ctx) =>
    ctx.skillsInvoked.some((s) => names.includes(s)) ||
    `invoked: ${ctx.skillsInvoked.join(', ') || 'none'}; expected one of ${names.length} skills`;
}

const SEED_NEXT_PACKAGE = JSON.stringify(
  { name: 'school-site', private: true, dependencies: { next: '16.0.0', react: '19.0.0' } },
  null,
  2
);

// Compatibility scenarios (tasks.md Phase 7.1): one realistic prompt per department, checking
// that a skill from that department activates. Run only on request — they call the model.
function compatScenario(id, department, prompt) {
  return {
    id,
    slow: true,
    description: `A ${department} request activates a ${department} skill (Claude Code compatibility).`,
    turns: [prompt],
    checks: [
      { name: `invokes a ${department} skill`, test: invokesOneOf(skillsInDepartment(department)) },
      {
        name: 'writes no source files while planning',
        test: (ctx) => createdSource(ctx).length === 0 || `created: ${createdSource(ctx).join(', ')}`,
      },
    ],
  };
}

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
        name: 'asks which icon set to use, naming at least two families',
        test: (ctx) => {
          const t = ctx.turns[0].final;
          const families = (t.match(/lucide|phosphor|heroicons|tabler|material symbols|sf symbols|custom svg/gi) || [])
            .map((f) => f.toLowerCase());
          return new Set(families).size >= 2 || 'reply does not offer a list of icon families';
        },
      },
      {
        name: 'asks for inspiration and offers links or images',
        test: (ctx) => {
          const t = ctx.turns[0].final;
          return (/inspiration|reference|sites? (you|they) like|look you like/i.test(t) &&
            /link|url|screenshot|image|upload|attach|drop/i.test(t)) ||
            'reply does not ask for inspiration with a way to share it';
        },
      },
      {
        name: 'writes no component code before the answers arrive',
        test: (ctx) => createdSource(ctx).length === 0 || `created: ${createdSource(ctx).join(', ')}`,
      },
    ],
  },

  {
    id: 'inspiration-image-is-read',
    description: 'A screenshot dropped in inspiration/ is opened and described, then confirmed with the user.',
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
      // deep blue, warm orange, off-white bands
      'inspiration/reference-homepage.png': bandedPng([[22, 40, 110], [240, 140, 40], [245, 242, 235]]),
    },
    turns: ['Design the homepage for the school site. I put a screenshot of a page I like in the inspiration folder.'],
    checks: [
      {
        name: 'opens the image with the file-reading tool',
        test: (ctx) =>
          ctx.turns.some((t) =>
            t.toolUses.some((u) => u.name === 'Read' && /reference-homepage\.png$/.test(String(u.input.file_path || '')))
          ) || 'the image was never read',
      },
      {
        name: 'describes what it saw (colors or layout)',
        test: (ctx) => askedAbout(ctx.turns[0].final, /blue|navy|orange|cream|off-white|warm|band|stripe|section/i),
      },
      {
        name: 'confirms what it takes before designing',
        test: (ctx) => askedAbout(ctx.turns[0].final, /take|avoid|inspir|like about|confirm|does that|is that right/i),
      },
      {
        name: 'writes no component code before the user confirms',
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
    description: 'After the answers, the kickoff writes the core documents and still does not build.',
    slow: true,
    turns: [
      'New project: an online shop for a fashion brand in Lagos.',
      'This covers everything, so please stop asking and write the planning files. The brand is ' +
        'Zuri Atelier with no logo yet. Customers are style-conscious Lagos shoppers on their phones; ' +
        'the shop sells directly with add to bag then pay online; launch in 8 weeks on a modest ' +
        'budget. For the build order, the stack, payments, delivery, visual direction, styling method, motion, and ' +
        'theme, accept ALL your recommendations. The owner\'s assistant will update products after ' +
        'launch. Pages: home, shop, product, cart, checkout, about, contact. Photos will be ' +
        'supplied later.',
    ],
    checks: [
      {
        name: 'invokes eaz-project-kickoff, eaz-frontend-design and eaz-software-architecture',
        test: (ctx) => {
          const missing = ['eaz-project-kickoff', 'eaz-frontend-design', 'eaz-software-architecture'].filter((s) => !ctx.skillsInvoked.includes(s));
          return missing.length === 0 || `not invoked: ${missing.join(', ')}`;
        },
      },
      {
        name: 'writes PROJECT.md, SPEC.md, ARCHITECTURE.md, DESIGN.md, README.md and tasks.md',
        test: (ctx) => {
          const need = ['PROJECT.md', 'SPEC.md', 'ARCHITECTURE.md', 'DESIGN.md', 'README.md', 'tasks.md'];
          const missing = need.filter((f) => !ctx.files.includes(f));
          return missing.length === 0 || `missing: ${missing.join(', ')}`;
        },
      },
      {
        name: 'SPEC.md gives features IDs and acceptance tests',
        test: (ctx) => {
          const t = ctx.read('SPEC.md') || '';
          const ids = new Set(t.match(/\bF\d+\b/g) || []).size;
          return (ids >= 3 && /acceptance|done when/i.test(t)) || `feature ids: ${ids}; acceptance wording: ${/acceptance|done when/i.test(t)}`;
        },
      },
      {
        name: 'ARCHITECTURE.md describes the stack, structure, and components',
        test: (ctx) => {
          const t = ctx.read('ARCHITECTURE.md') || '';
          const hits = ['stack', 'structure', 'component', 'deploy'].filter((w) => new RegExp(w, 'i').test(t));
          return hits.length >= 3 || `only mentions: ${hits.join(', ') || 'nothing'}`;
        },
      },
      {
        name: 'records a build order and plans screens on mock data before backend wiring',
        test: (ctx) => {
          const p = ctx.read('PROJECT.md') || '';
          const t = ctx.read('tasks.md') || '';
          return (/build order/i.test(p) && /mock/i.test(t)) || `build order recorded: ${/build order/i.test(p)}; mock data in tasks: ${/mock/i.test(t)}`;
        },
      },
      {
        name: 'does not write the later documents early (runbook, handoff, changelog)',
        test: (ctx) => {
          const early = ['RUNBOOK.md', 'HANDOFF.md', 'CHANGELOG.md'].filter((f) => ctx.files.includes(f));
          return early.length === 0 || `written too early: ${early.join(', ')}`;
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

  compatScenario(
    'compat-digital-marketing',
    'digital-marketing',
    'I am running a Google Ads search campaign for a Lagos fashion store with a monthly budget of ' +
      '200,000 naira. How should I structure the campaigns and keywords?'
  ),
  compatScenario(
    'compat-ai-automation',
    'ai-automation',
    'I want an n8n workflow that receives a Paystack payment webhook and sends our team a WhatsApp ' +
      'message. What is the right design?'
  ),
  compatScenario(
    'compat-business-solutions',
    'business-solutions',
    'We run a school in Kumasi and want parents to pay fees by Mobile Money. How should we handle ' +
      'payments and fee records?'
  ),

  {
    id: 'review-flags-planted-bugs',
    description: 'A diff with planted defects gets a request-changes verdict that names them with severity labels.',
    slow: true,
    seed: {
      'change.diff': [
        'diff --git a/src/routes/orders.ts b/src/routes/orders.ts',
        'new file mode 100644',
        '--- /dev/null',
        '+++ b/src/routes/orders.ts',
        '@@ -0,0 +1,17 @@',
        "+import { Router } from 'express';",
        "+import { db } from '../db';",
        "+import { chargeCard } from '../payments';",
        '+',
        '+export const orders = Router();',
        '+',
        '+// POST /orders/:id/pay - charge the customer for an order',
        "+orders.post('/orders/:id/pay', async (req, res) => {",
        '+  const { amount, currency } = req.body;',
        '+  try {',
        '+    const order = await db.query(`SELECT * FROM orders WHERE id = ${req.params.id}`);',
        '+    await chargeCard({ amount, currency, orderId: order.rows[0].id });',
        "+    await db.query(`UPDATE orders SET status = 'paid' WHERE id = ${req.params.id}`);",
        '+    res.json({ ok: true });',
        '+  } catch (e) {',
        '+    console.log(e);',
        '+    res.json({ ok: true });',
        '+  }',
        '+});',
        'diff --git a/tests/orders.test.ts b/tests/orders.test.ts',
        'new file mode 100644',
        '--- /dev/null',
        '+++ b/tests/orders.test.ts',
        '@@ -0,0 +1,5 @@',
        "+import { orders } from '../src/routes/orders';",
        '+',
        "+test('orders route exists', () => {",
        '+  expect(orders).toBeDefined();',
        '+});',
        '',
      ].join('\n'),
    },
    turns: ['Please review the change in change.diff. It adds a route that takes payment for an order.'],
    checks: [
      {
        name: 'invokes eaz-code-review',
        test: (ctx) => ctx.skillsInvoked.includes('eaz-code-review') || `invoked: ${ctx.skillsInvoked.join(', ') || 'none'}`,
      },
      {
        name: 'gives an explicit request-changes verdict',
        test: (ctx) => askedAbout(ctx.turns[0].final, /request(s|ed)? changes|do not merge|not (ready|safe) to merge/i),
      },
      {
        name: 'uses severity labels',
        test: (ctx) => askedAbout(ctx.turns[0].final, /blocker/i),
      },
      {
        name: 'flags the client-supplied payment amount',
        test: (ctx) => {
          const t = ctx.turns[0].final;
          return (/amount/i.test(t) && /client|request body|payload|trust|server-side|recompute/i.test(t)) || 'never flags the client-supplied amount';
        },
      },
      {
        name: 'flags the SQL built from request input',
        test: (ctx) => askedAbout(ctx.turns[0].final, /inject|parameteri[sz]ed|string interpolation|concatenat/i),
      },
      {
        name: 'flags the missing authentication or ownership check',
        test: (ctx) => askedAbout(ctx.turns[0].final, /authori[sz]|authenticat|owner|access control|who may|auth check/i),
      },
      {
        name: 'flags the swallowed error that still reports success',
        test: (ctx) => askedAbout(ctx.turns[0].final, /swallow|always (return|respond)|ok: ?true|hides? (the )?(error|failure)|reports? success/i),
      },
      {
        name: 'says what it verified and what it could not',
        test: (ctx) => askedAbout(ctx.turns[0].final, /could not|couldn't|did not run|not run|unable to run|verif/i),
      },
      {
        name: 'changes nothing and posts nothing',
        test: (ctx) => ctx.created.length === 0 || `created: ${ctx.created.join(', ')}`,
      },
    ],
  },

  {
    id: 'mobile-task-asks-approach-choices',
    description: 'A new mobile app request invokes the mobile skill and asks approach questions before code.',
    slow: true,
    seed: {
      'PROJECT.md': [
        '# PROJECT.md',
        '',
        '- **Name:** Bright Future School app',
        '- **Type:** mobile app',
        '- **One-line purpose:** Let parents in Accra see fees and pay them.',
        '- **Mobile approach:** TBD',
        '- **Primary market / region:** Ghana',
        '',
      ].join('\n'),
    },
    turns: ['Build a mobile app for our school so parents can see their fees and pay them.'],
    checks: [
      {
        name: 'invokes eaz-mobile-app-development',
        test: (ctx) => ctx.skillsInvoked.includes('eaz-mobile-app-development') || `invoked: ${ctx.skillsInvoked.join(', ') || 'none'}`,
      },
      {
        name: 'asks about the approach (native, cross-platform, or web-based)',
        test: (ctx) => askedAbout(ctx.turns[0].final, /react native|flutter|expo|native|cross-platform|pwa|capacitor|approach/i),
      },
      {
        name: 'asks about platforms, offline use, or the phones and networks',
        test: (ctx) => askedAbout(ctx.turns[0].final, /android|ios|offline|low-end|slow|network|data/i),
      },
      {
        name: 'gives recommendations, not bare questions',
        test: (ctx) => askedAbout(ctx.turns[0].final, /recommend|suggest/i),
      },
      {
        name: 'asks 2-5 questions in the first batch',
        test: (ctx) => {
          const n = numberedItems(ctx.turns[0].final);
          return (n >= 2 && n <= 5) || `found ${n} numbered questions`;
        },
      },
      {
        name: 'writes no app code before the answers arrive',
        test: (ctx) => createdSource(ctx).length === 0 || `created: ${createdSource(ctx).join(', ')}`,
      },
    ],
  },

  {
    id: 'design-completes-full-token-set',
    description: 'Given the few human choices, the design flow generates every token, checks contrast with the script, and records it all.',
    slow: true,
    seed: {
      'package.json': SEED_NEXT_PACKAGE,
      'PROJECT.md': [
        '# PROJECT.md',
        '',
        '- **Name:** Bright Future School',
        '- **Type:** marketing site',
        '- **One-line purpose:** Help parents in Accra trust the school and enquire about admission.',
        '- **Front end:** Next.js (App Router)',
        '- **Styling method:** Tailwind CSS',
        '- **Primary market / region:** Ghana',
        '',
      ].join('\n'),
    },
    turns: [
      'Create the design file for the school site. Ask me what you need.',
      'The brand color is deep blue #1F3A93. The feel is warm and friendly. Use Fraunces for headings and ' +
        'Inter for body text. Light mode only, no inspiration to share. Please complete the whole design ' +
        'file with every token, check the contrast, and treat this as my approval of the palette.',
    ],
    checks: [
      {
        name: 'writes DESIGN.md',
        test: (ctx) => ctx.files.includes('DESIGN.md') || 'DESIGN.md was not written',
      },
      {
        name: 'records every required color token with a hex value',
        test: (ctx) => {
          const d = ctx.read('DESIGN.md') || '';
          const need = ['bg-app', 'surface', 'border', 'text-primary', 'text-muted', 'action-primary',
            'text-on-action', 'accent', 'success', 'warning', 'danger', 'focus-ring'];
          const missing = need.filter((n) => !new RegExp('`' + n + '`\\s*\\|\\s*#[0-9a-fA-F]{3,6}').test(d));
          return missing.length === 0 || `no hex value for: ${missing.join(', ')}`;
        },
      },
      {
        name: 'runs the contrast script',
        test: (ctx) =>
          ctx.turns.some((t) => t.toolUses.some((u) => u.name === 'Bash' && /check-contrast/.test(String(u.input.command || '')))) ||
          'check-contrast.cjs was never run',
      },
      {
        name: 'writes calculated ratios into the Contrast Check section',
        test: (ctx) => {
          const d = ctx.read('DESIGN.md') || '';
          const m = d.match(/## Contrast Check[\s\S]*/);
          return (m && /\d+(\.\d+)?\s*\|\s*(Pass|FAIL)/.test(m[0])) || 'Contrast Check has no calculated ratios';
        },
      },
      {
        name: 'records the palette approval and the typefaces',
        test: (ctx) => {
          const d = ctx.read('DESIGN.md') || '';
          return (/palette approved/i.test(d) && /fraunces/i.test(d) && /inter/i.test(d)) || 'approval or typefaces missing';
        },
      },
      {
        name: 'writes no app code',
        test: (ctx) => createdSource(ctx).length === 0 || `created: ${createdSource(ctx).join(', ')}`,
      },
    ],
  },

  {
    id: 'backend-task-asks-architecture-choices',
    description: 'A new-backend request invokes the backend skill and asks architecture questions before code.',
    slow: true,
    seed: {
      'PROJECT.md': [
        '# PROJECT.md',
        '',
        '- **Name:** Zuri Atelier shop',
        '- **Type:** e-commerce',
        '- **Front end:** Next.js (App Router)',
        '- **Back end / API:** TBD',
        '- **Primary market / region:** Nigeria',
        '',
      ].join('\n'),
    },
    turns: ['Build the backend for our online shop: customer accounts, orders, and payments.'],
    checks: [
      {
        name: 'invokes eaz-backend-engineering',
        test: (ctx) => ctx.skillsInvoked.includes('eaz-backend-engineering') || `invoked: ${ctx.skillsInvoked.join(', ') || 'none'}`,
      },
      {
        name: 'asks about the authentication method',
        test: (ctx) => askedAbout(ctx.turns[0].final, /authenticat|sign.?in|log.?in|password|one-time|OTP/i),
      },
      {
        name: 'asks about the architecture, hosting, or integrations',
        test: (ctx) => askedAbout(ctx.turns[0].final, /hosting|VPS|deploy|monolith|architecture|integrat|queue|background/i),
      },
      {
        name: 'gives recommendations, not bare questions',
        test: (ctx) => askedAbout(ctx.turns[0].final, /recommend|suggest/i),
      },
      {
        name: 'asks 2-5 questions in the first batch',
        test: (ctx) => {
          const n = numberedItems(ctx.turns[0].final);
          return (n >= 2 && n <= 5) || `found ${n} numbered questions`;
        },
      },
      {
        name: 'writes no server code before the answers arrive',
        test: (ctx) => createdSource(ctx).length === 0 || `created: ${createdSource(ctx).join(', ')}`,
      },
    ],
  },
];

module.exports.BUILD_TOOL_NAMES = BUILD_TOOL_NAMES;
