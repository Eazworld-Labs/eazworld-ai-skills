#!/usr/bin/env node
'use strict';

/**
 * Eazworld AI Skills Library — Skill Validation Linter (Phase 2)
 *
 * Validates every skill under `.claude/skills/` against the standards defined in:
 *   - docs/ARCHITECTURE.md            (department layout)
 *   - docs/SKILL_AUTHORING_GUIDE.md   (naming, frontmatter, 7 mandatory sections)
 *   - docs/SECURITY_POLICY.md         (secret & destructive-command scanning)
 *
 * Checks performed:
 *   1. Department structure   — 4 core departments must exist; unknown departments rejected.
 *   2. Kebab-case enforcement — skill directories must match /^[a-z0-9]+(-[a-z0-9]+)*$/
 *   3. Frontmatter            — valid YAML, `name` matches parent dir, `description` present.
 *   4. Mandatory sections     — all 7 SKILL.md sections present.
 *   5. Internal links         — relative `references/`, `assets/` targets must exist.
 *   6. Secret scan            — API keys, private tokens, DB URIs, hardcoded credentials.
 *   7. Dangerous commands     — `rm -rf /`, `git push --force` (fenced/runnable context).
 *   8. Duplicates             — skill names must be unique across departments.
 *
 * Usage:
 *   node scripts/validate-skills.js [--skills-dir <path>] [--no-color] [--help]
 *
 * Exit codes: 0 = all checks passed, 1 = one or more violations, 2 = usage error.
 * Zero dependencies — runs on Node.js >= 18 with no install step.
 */

const fs = require('fs');
const path = require('path');

const VERSION = '1.0.0';
const DEFAULT_SKILLS_DIR = path.join('.claude', 'skills');

/* ------------------------------------------------------------------ *
 * Standards (docs/ARCHITECTURE.md §7, docs/SKILL_AUTHORING_GUIDE.md) *
 * ------------------------------------------------------------------ */

// The 4 core departments tracked by the v1.0.0 roadmap (31 skills).
const CORE_DEPARTMENTS = [
  'software-engineering',
  'digital-marketing',
  'ai-automation',
  'business-solutions',
];

// docs/SKILL_AUTHORING_GUIDE.md §5 — lowercase kebab-case only.
const KEBAB_CASE_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// docs/SKILL_AUTHORING_GUIDE.md §7 — all 7 sections are mandatory.
const REQUIRED_SECTIONS = [
  'Overview & Purpose',
  'Activation Conditions & Triggers',
  'Required Inputs & Project Audit',
  'Technical Standards & Rules',
  'Execution Workflow',
  'Security & Edge Case Guidelines',
  'Definition of Done & Quality Gates',
];

// docs/SKILL_AUTHORING_GUIDE.md §6.1 — description should be a meaningful trigger string.
const MIN_DESCRIPTION_LENGTH = 60;

/* ----------------------------- *
 * Secret / credential patterns  *
 * ----------------------------- *
 * Any value captured by a pattern is passed through isPlaceholderValue() so that
 * documented placeholders (`<your-key>`, `process.env.X`, `your-api-key-here`)
 * never trip the scanner — docs/SECURITY_POLICY.md §3 permits placeholders only.
 */

const SECRET_PATTERNS = [
  {
    id: 'secret:private-key',
    label: 'Private key block',
    re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    id: 'secret:stripe-api-key',
    label: 'Stripe-style API key (sk_live_/sk_test_)',
    re: /\bsk_(?:live|test)_[0-9A-Za-z]{16,}/,
  },
  {
    id: 'secret:google-api-key',
    label: 'Google API key (AIzaSy...)',
    re: /\bAIzaSy[0-9A-Za-z_-]{20,}/,
  },
  {
    id: 'secret:github-token',
    label: 'GitHub token (ghp_...)',
    re: /\b(?:ghp|gho|ghu|ghs|ghr)_[0-9A-Za-z]{20,}/,
  },
  {
    id: 'secret:slack-token',
    label: 'Slack token (xoxb-...)',
    re: /\bxox[baprs]-[0-9A-Za-z-]{10,}/,
  },
  {
    id: 'secret:aws-access-key',
    label: 'AWS access key ID (AKIA...)',
    re: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/,
  },
  {
    id: 'secret:db-credentials',
    label: 'Database URI with embedded credentials',
    re: /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis|amqp):\/\/[^\s/@:]+:([^\s/@]+)@/,
    capture: 1,
  },
  {
    id: 'secret:hardcoded-assignment',
    label: 'Hardcoded credential assignment (quoted)',
    re: /\b(?:api[_-]?key|secret[_-]?key|jwt[_-]?secret|password|passwd|pwd)\s*[:=]\s*["']([^"']{8,})["']/i,
    capture: 1,
  },
  {
    id: 'secret:hardcoded-env',
    label: 'Hardcoded credential assignment (env-style)',
    re: /\b(?:api[_-]?key|secret[_-]?key|jwt[_-]?secret|password|passwd|pwd)\s*=\s*([^\s"'`,#]{8,})/i,
    capture: 1,
  },
];

// Placeholder heuristics: documented examples and code references are never violations.
function isPlaceholderValue(value) {
  const v = String(value).trim();
  if (v.length < 8) return true;
  const placeholderShape =
    /^(?:<[^>]*>|\$\{[^}]*\}|your[_-].*|xxx+|password|passwd|pwd|pass|changeme|example.*|placeholder.*|dummy.*|sample.*|test.*|secret$|key$)/i;
  const codeReference =
    /^(?:process\.env|env\.|env\[|config\.|import\.meta|require\(|\$\{|<|["']?\s*$)/i;
  return placeholderShape.test(v) || codeReference.test(v);
}

/* ----------------------------- *
 * Dangerous command patterns    *
 * ----------------------------- *
 * fenceOnly patterns are matched only inside fenced code blocks (``` ... ```) in
 * Markdown — inline prose such as "never run `git push --force`" is documentation,
 * not an executable snippet, and must not trip the scanner. In non-Markdown files
 * (scripts, shell) the whole file is treated as executable context.
 */

const DANGEROUS_PATTERNS = [
  {
    id: 'dangerous:rm-rf-root',
    label: 'Destructive rm -rf on / , ~ or $HOME',
    re: /\brm\s+-[a-z]*r[a-z]*f[a-z]*\s+(?:\/\*?|~|\$HOME)\/?(?:\s|$|["'`])/i,
    fenceOnly: false,
  },
  {
    id: 'dangerous:git-force-push',
    label: 'Force push (git push --force / -f)',
    re: /\bgit\s+push\s+(?:--force\b|-f\b)/,
    fenceOnly: true,
  },
];

/* ------------------ *
 * Colored reporting  *
 * ------------------ */

function resolveColor(opt) {
  if (opt === false) return false;
  if (process.env.NO_COLOR) return false;
  return Boolean(
    process.stdout.isTTY || process.env.FORCE_COLOR || process.env.GITHUB_ACTIONS
  );
}

function makeRenderer(color) {
  const wrap = (code) => (s) => (color ? `\u001b[${code}m${s}\u001b[0m` : String(s));
  return {
    red: wrap(31),
    green: wrap(32),
    yellow: wrap(33),
    cyan: wrap(36),
    bold: wrap(1),
    dim: wrap(2),
  };
}

class Reporter {
  constructor(renderer) {
    this.r = renderer;
    this.errors = [];
    this.warnings = [];
    this.skillsScanned = 0;
  }

  error(id, location, message) {
    this.errors.push({ id, location, message });
    console.log(
      `${this.r.red('\u2717')} [${id}] ${this.r.bold(location)} \u2014 ${message}`
    );
  }

  warn(id, location, message) {
    this.warnings.push({ id, location, message });
    console.log(
      `${this.r.yellow('\u26A0')} [${id}] ${this.r.dim(location)} \u2014 ${message}`
    );
  }

  ok(message) {
    console.log(`${this.r.green('\u2713')} ${message}`);
  }
}

/* ------------------- *
 * Frontmatter parser  *
 * ------------------- *
 * Minimal, dependency-free YAML subset covering the SKILL.md schema:
 * top-level scalars, one nested mapping (metadata:), quoted values, and
 * folded plain multi-line scalars (long descriptions wrapped across lines).
 */

function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0 || lines[0].trim() !== '---') {
    return { ok: false, error: 'missing opening "---" frontmatter delimiter' };
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) {
    return { ok: false, error: 'unterminated frontmatter (no closing "---")' };
  }

  const data = {};
  const stripQuotes = (v) => {
    const first = v[0];
    if ((first === '"' || first === "'") && v[v.length - 1] === first) {
      return v.slice(1, -1);
    }
    return v;
  };

  let openBlockKey = null; // set while a nested mapping (metadata:) is open
  let lastKey = null; // last top-level key — scalar values may fold across lines
  for (let i = 1; i < end; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith('#')) continue;

    const mappingMatch = raw.match(/^(\s*)([A-Za-z_][A-Za-z0-9_.-]*):\s*(.*)$/);
    const indent = mappingMatch ? mappingMatch[1].length : 0;

    if (mappingMatch && indent === 0) {
      // Top-level key
      const key = mappingMatch[2];
      const value = mappingMatch[3].trim();
      if (value === '') {
        data[key] = {};
        openBlockKey = key;
      } else {
        data[key] = stripQuotes(value);
        openBlockKey = null;
      }
      lastKey = key;
    } else if (mappingMatch && indent > 0 && openBlockKey) {
      // Nested mapping key (e.g. metadata.author)
      data[openBlockKey][mappingMatch[2]] = stripQuotes(mappingMatch[3].trim());
    } else if (mappingMatch && indent > 0 && !openBlockKey) {
      return {
        ok: false,
        error: `nested key "${mappingMatch[2]}" at line ${i + 1} has no parent mapping`,
      };
    } else if (lastKey && typeof data[lastKey] === 'string' && /^\s+\S/.test(raw)) {
      // Folded plain multi-line scalar: append with a single space (YAML folding).
      data[lastKey] = `${data[lastKey]} ${raw.trim()}`;
    } else {
      return { ok: false, error: `invalid YAML at line ${i + 1}: "${raw.trim()}"` };
    }
  }
  return { ok: true, data };
}

/* ------------------- *
 * Markdown utilities  *
 * ------------------- */

function stripFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] && lines[0].trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') return lines.slice(i + 1).join('\n');
    }
  }
  return text;
}

// Collect ATX headings that sit outside fenced code blocks.
function extractHeadings(markdownBody) {
  const headings = [];
  let inFence = false;
  for (const line of markdownBody.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) {
      const m = line.match(/^#{1,6}\s+(.+?)\s*$/);
      if (m) headings.push(m[1]);
    }
  }
  return headings;
}

function normalizeHeading(text) {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function headingCoversSection(heading, sectionLabel) {
  const h = normalizeHeading(heading);
  const s = normalizeHeading(sectionLabel);
  return h === s || h.includes(s);
}

// Internal relative links in a Markdown file that must resolve to real files.
function extractRelativeLinks(markdownText) {
  const links = [];
  const re = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(markdownText)) !== null) {
    const target = m[1];
    if (/^(?:https?:|mailto:|#)/i.test(target)) continue; // external / anchor
    if (/[<>{}*]/.test(target)) continue; // template placeholder
    links.push(target.split('#')[0]);
  }
  return links.filter(Boolean);
}

/* -------------- *
 * File walking   *
 * -------------- */

const SKILL_TEXT_EXTENSIONS = new Set([
  '.md', '.mdx', '.txt', '.js', '.mjs', '.cjs', '.ts', '.json', '.yml', '.yaml',
  '.sh', '.bash', '.env', '.example', '.css', '.html', '.xml', '.csv', '.toml',
]);

function walkFiles(dir, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue; // skip .git, .DS_Store, .gitkeep
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walkFiles(full, acc);
    } else if (entry.isFile()) {
      acc.push(full);
    }
  }
  return acc;
}

function isScannableFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext && !SKILL_TEXT_EXTENSIONS.has(ext)) return false;
  // Extension-less files (e.g. .env) are read; skip obvious binaries by content.
  let fd;
  try {
    fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(512);
    const bytes = fs.readSync(fd, buf, 0, 512, 0);
    for (let i = 0; i < bytes; i++) {
      if (buf[i] === 0) return false;
    }
    return true;
  } catch {
    return false;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

/* ------------------ *
 * Per-skill checks   *
 * ------------------ */

function validateSkill(relSkillDir, skillDir, reporter) {
  const skillName = path.basename(skillDir);

  // 1. Kebab-case directory name (docs/SKILL_AUTHORING_GUIDE.md §5)
  if (!KEBAB_CASE_RE.test(skillName)) {
    reporter.error(
      'skill-kebab',
      relSkillDir,
      `directory name "${skillName}" must be lowercase kebab-case (a-z, 0-9, hyphens)`
    );
  }

  // 2. SKILL.md entry file must exist
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    reporter.error(
      'missing-skill-md',
      relSkillDir,
      'skill directory has no SKILL.md entry file'
    );
    return skillName;
  }

  reporter.skillsScanned += 1;

  let text;
  try {
    text = fs.readFileSync(skillMdPath, 'utf8');
  } catch (err) {
    reporter.error('unreadable-file', `${relSkillDir}/SKILL.md`, err.message);
    return skillName;
  }

  // 3. Frontmatter validation (docs/SKILL_AUTHORING_GUIDE.md §6)
  const relSkillMd = `${relSkillDir}/SKILL.md`;
  const parsed = parseFrontmatter(text);
  if (!parsed.ok) {
    reporter.error('frontmatter-invalid', relSkillMd, parsed.error);
  } else {
    const { name, description, license } = parsed.data;

    if (typeof name !== 'string' || !name.trim()) {
      reporter.error('name-missing', relSkillMd, 'required field "name" is missing or empty');
    } else {
      if (!KEBAB_CASE_RE.test(name)) {
        reporter.error(
          'name-kebab',
          relSkillMd,
          `name "${name}" must be lowercase kebab-case`
        );
      }
      if (name !== skillName) {
        reporter.error(
          'name-mismatch',
          relSkillMd,
          `name "${name}" must match parent directory "${skillName}" exactly`
        );
      }
    }

    if (typeof description !== 'string' || !description.trim()) {
      reporter.error(
        'description-missing',
        relSkillMd,
        'required field "description" is missing or empty'
      );
    } else if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
      reporter.warn(
        'description-short',
        relSkillMd,
        `description is ${description.trim().length} chars (< ${MIN_DESCRIPTION_LENGTH}); ` +
          'guide §6.2 requires explicit trigger phrases and domain keywords'
      );
    }

    if (typeof license !== 'string' || !license.trim()) {
      reporter.warn('license-missing', relSkillMd, 'recommended field "license" is missing (defaults to MIT)');
    }
  }

  // 4. Mandatory sections (docs/SKILL_AUTHORING_GUIDE.md §7)
  const body = stripFrontmatter(text);
  const headings = extractHeadings(body);
  for (const section of REQUIRED_SECTIONS) {
    const found = headings.some((h) => headingCoversSection(h, section));
    if (!found) {
      reporter.error(
        'section-missing',
        relSkillMd,
        `mandatory section "${section}" not found as a Markdown heading`
      );
    }
  }

  // 5. Internal relative links (references/, assets/) must resolve
  const skillFiles = walkFiles(skillDir);
  for (const file of skillFiles) {
    if (path.extname(file).toLowerCase() !== '.md') continue;
    const relFile = path.relative(path.dirname(skillDir), file);
    const fileText = fs.readFileSync(file, 'utf8');
    const links = extractRelativeLinks(
      path.basename(file) === 'SKILL.md' ? stripFrontmatter(fileText) : fileText
    );
    for (const link of links) {
      const resolved = path.resolve(path.dirname(file), link);
      if (!fs.existsSync(resolved)) {
        reporter.error(
          'broken-link',
          relFile,
          `relative link target does not exist: ${link}`
        );
      }
    }
  }

  // 6 + 7. Secret scan & dangerous command scan across all skill files
  for (const file of skillFiles) {
    if (!isScannableFile(file)) continue;
    const relFile = path.relative(path.dirname(skillDir), file);
    const fileText = fs.readFileSync(file, 'utf8');
    const lines = fileText.split(/\r?\n/);
    const isMarkdown = path.extname(file).toLowerCase() === '.md';

    let inFence = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (isMarkdown && /^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        continue;
      }

      // Secret scan — whole file, including prose and inline code.
      for (const pattern of SECRET_PATTERNS) {
        const m = line.match(pattern.re);
        if (!m) continue;
        if (pattern.capture && isPlaceholderValue(m[pattern.capture])) continue;
        reporter.error(
          pattern.id,
          `${relFile}:${i + 1}`,
          `${pattern.label} detected`
        );
      }

      // Dangerous command scan — fenced/runnable context only for prose-sensitive patterns.
      const codeContext = isMarkdown ? inFence : true;
      for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.fenceOnly && !codeContext) continue;
        if (pattern.re.test(line)) {
          reporter.error(
            pattern.id,
            `${relFile}:${i + 1}`,
            `${pattern.label} — destructive operations require explicit human confirmation (SECURITY_POLICY §9)`
          );
        }
      }
    }
  }

  return skillName;
}

/* --------------------- *
 * Top-level scan logic  *
 * --------------------- */

function runScan(skillsDir, reporter) {
  const absSkillsDir = path.resolve(skillsDir);
  const relRoot = path.relative(process.cwd(), absSkillsDir) || skillsDir;

  if (!fs.existsSync(absSkillsDir) || !fs.statSync(absSkillsDir).isDirectory()) {
    reporter.error(
      'skills-dir-missing',
      relRoot,
      'skills directory does not exist — expected `.claude/skills/` (ARCHITECTURE.md)'
    );
    return;
  }

  const entries = fs.readdirSync(absSkillsDir, { withFileTypes: true });
  const dirNames = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  const knownDepartments = new Set(CORE_DEPARTMENTS);

  // Core department folders must exist (ARCHITECTURE.md §6 / ROADMAP 4 departments).
  for (const dept of CORE_DEPARTMENTS) {
    if (!dirNames.includes(dept)) {
      reporter.error(
        'department-missing',
        `${relRoot}/${dept}`,
        'core department folder is missing'
      );
    }
  }

  // Any other top-level directory is off-spec.
  for (const name of dirNames) {
    if (!knownDepartments.has(name)) {
      reporter.error(
        'department-unknown',
        `${relRoot}/${name}`,
        `unknown department — expected one of: ${[...knownDepartments].join(', ')} ` +
          `(update CORE_DEPARTMENTS in scripts/validate-skills.js if intentional)`
      );
    }
  }

  // Unexpected files at the skills root (ignore dotfiles like .DS_Store).
  for (const e of entries) {
    if (e.isFile() && !e.name.startsWith('.')) {
      reporter.warn(
        'stray-file',
        `${relRoot}/${e.name}`,
        'unexpected file at skills root — only department folders belong here'
      );
    }
  }

  // Validate every skill directory, recursively, inside every department found.
  const seenNames = new Map(); // skillName -> [relDirs]
  for (const name of dirNames) {
    const deptDir = path.join(absSkillsDir, name);
    const skillDirs = fs
      .readdirSync(deptDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .map((e) => path.join(deptDir, e.name));

    for (const skillDir of skillDirs) {
      const relSkillDir = path.relative(process.cwd(), skillDir);
      const skillName = validateSkill(relSkillDir, skillDir, reporter);
      if (skillName) {
        if (!seenNames.has(skillName)) seenNames.set(skillName, []);
        seenNames.get(skillName).push(relSkillDir);
      }
    }

    const count = skillDirs.length;
    reporter.ok(
      `${name} \u2014 ${count} skill${count === 1 ? '' : 's'} scanned`
    );
  }

  // Duplicate skill names across departments (SKILL_AUTHORING_GUIDE §15).
  for (const [skillName, dirs] of seenNames) {
    if (dirs.length > 1) {
      reporter.error(
        'duplicate-skill',
        skillName,
        `skill name appears in ${dirs.length} locations: ${dirs.join(', ')} — ` +
          'duplicates across departments are prohibited'
      );
    }
  }

  if (reporter.skillsScanned === 0) {
    reporter.warn(
      'no-skills',
      relRoot,
      'no skill directories found yet — departments are ready for Phase 3-6 authoring'
    );
  }
}

/* -------------- *
 * CLI entrypoint *
 * -------------- */

function parseArgs(argv) {
  const opts = { skillsDir: DEFAULT_SKILLS_DIR, color: undefined, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--skills-dir') {
      const value = argv[++i];
      if (!value) {
        console.error('Error: --skills-dir requires a path argument');
        process.exit(2);
      }
      opts.skillsDir = value;
    } else if (arg === '--no-color') {
      opts.color = false;
    } else if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else {
      console.error(`Error: unknown option "${arg}" (try --help)`);
      process.exit(2);
    }
  }
  return opts;
}

function printHelp() {
  console.log(`Eazworld Skill Validator v${VERSION}

Usage:
  node scripts/validate-skills.js [options]

Options:
  --skills-dir <path>  Skills root to scan (default: ${DEFAULT_SKILLS_DIR})
  --no-color           Disable colored output
  -h, --help           Show this help

Exit codes: 0 = pass, 1 = violations found, 2 = usage error`);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  const color = resolveColor(opts.color);
  const r = makeRenderer(color);
  const reporter = new Reporter(r);

  console.log(r.bold(`Eazworld Skill Validator v${VERSION}`));
  console.log(r.dim(`Scanning: ${path.resolve(opts.skillsDir)}`));
  console.log('');

  runScan(opts.skillsDir, reporter);

  const { errors, warnings, skillsScanned } = reporter;
  console.log('');
  console.log(r.dim('\u2500'.repeat(60)));
  console.log(`Skills scanned : ${skillsScanned}`);
  console.log(`Errors         : ${errors.length === 0 ? r.green('0') : r.red(String(errors.length))}`);
  console.log(`Warnings       : ${warnings.length === 0 ? r.green('0') : r.yellow(String(warnings.length))}`);
  if (errors.length === 0) {
    console.log(r.green(r.bold('Result         : PASS')));
    console.log(r.dim('\u2500'.repeat(60)));
    process.exit(0);
  } else {
    console.log(r.red(r.bold('Result         : FAIL')));
    console.log(r.dim('\u2500'.repeat(60)));
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseFrontmatter, extractHeadings, extractRelativeLinks, isPlaceholderValue };
