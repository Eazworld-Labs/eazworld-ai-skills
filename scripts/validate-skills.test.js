'use strict';

/**
 * Automated test suite for scripts/validate-skills.js (Phase 2, task 2.3).
 *
 * Runs the validator as a subprocess against the fixture roots in examples/
 * and against the real .claude/skills/ tree, asserting exit codes and
 * descriptive failure messages.
 *
 * Run: node --test scripts/
 */

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const path = require('path');
const fs = require('fs');
const os = require('node:os');

const SCRIPT = path.join(__dirname, 'validate-skills.js');
const REPO_ROOT = path.join(__dirname, '..');
const VALID_ROOT = path.join(REPO_ROOT, 'examples', 'valid-skills');
const INVALID_ROOT = path.join(REPO_ROOT, 'examples', 'invalid-skills');
const REAL_SKILLS = path.join(REPO_ROOT, '.claude', 'skills');

function run(skillsDir) {
  return spawnSync(
    process.execPath,
    [SCRIPT, '--skills-dir', skillsDir, '--no-color'],
    { encoding: 'utf8', timeout: 30000 }
  );
}

function outputLines(res) {
  return String(res.stdout || '').split('\n');
}

function assertError(res, id, context) {
  const line = outputLines(res).find(
    (l) => l.includes(`[${id}]`) && l.includes(context)
  );
  assert.ok(
    line,
    `expected error [${id}] mentioning "${context}"\n--- output ---\n${res.stdout}`
  );
}

test('valid fixtures pass with exit code 0 and zero errors', () => {
  const res = run(VALID_ROOT);
  assert.strictEqual(res.status, 0, `stdout:\n${res.stdout}\nstderr:\n${res.stderr}`);
  assert.ok(res.stdout.includes('Result         : PASS'), res.stdout);
  const violations = outputLines(res).filter((l) => l.includes('\u2717'));
  assert.deepStrictEqual(violations, [], `unexpected violations:\n${violations.join('\n')}`);
});

test('invalid fixtures fail with exit code 1 and descriptive messages', () => {
  const res = run(INVALID_ROOT);
  assert.strictEqual(res.status, 1, `stdout:\n${res.stdout}`);

  // Structure & naming (task 2.1)
  assertError(res, 'skill-kebab', 'Bad_Skill_Name');
  assertError(res, 'missing-skill-md', 'missing-entry');
  assertError(res, 'nested-skill', 'rogue-tools');
  assertError(res, 'department-invalid', 'bad-department');

  // Frontmatter (task 2.1)
  assertError(res, 'description-missing', 'no-description');
  assertError(res, 'name-mismatch', 'wrong-name-field');
  assertError(res, 'frontmatter-invalid', 'colon-scalar');

  // Mandatory sections (task 2.1)
  assertError(res, 'section-missing', 'few-sections');
  assert.ok(
    outputLines(res).some(
      (l) => l.includes('[section-missing]') && l.includes('Definition of Done')
    ),
    'expected a section-missing error naming "Definition of Done"'
  );

  // Internal references (task 2.1)
  assertError(res, 'broken-link', 'broken-links');

  // Security scan (task 2.2) — dangerous commands live in a committed fixture;
  // credential detection is covered by the runtime-generated test below so that
  // no secret-shaped string is ever committed (GitHub Push Protection).
  assertError(res, 'dangerous:git-force-push', 'force-push');

  // Summary must report a failing result.
  assert.ok(res.stdout.includes('Result         : FAIL'), res.stdout);
});

test('prose mentions of dangerous commands are not flagged (fence-aware scan)', () => {
  const res = run(INVALID_ROOT);
  const offending = outputLines(res).filter(
    (l) => l.includes('[dangerous:git-force-push]') && l.includes('inline-mention')
  );
  assert.deepStrictEqual(
    offending,
    [],
    `inline prose must never trigger the force-push scan:\n${offending.join('\n')}`
  );
});

/**
 * Build the leaky skill content from fragments so no complete secret-shaped
 * string exists anywhere in the repository. The credentials only materialize
 * in a temp directory while this test runs — GitHub Push Protection scans
 * committed content, and these values are fabricated test data.
 */
function buildLeakySkill() {
  const stripeKey = ['sk', '_live_', '51H8xQ', '2LmK9vT3rY7wP2sD4fG6hJ0kLmN'].join('');
  const googleKey = ['AI', 'zaSy', 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6q7'].join('');
  const pemBegin = ['-----BEGIN ', 'RSA ', 'PRIVATE KEY-----'].join('');
  const pemBody = ['MIIEpAIBAAKCAQEAy', 'FakeKeyForTestingPurposesOnlyNotARealKey000000'].join('');
  const dbUri = ['postgres', '://appuser:', 'Hunter99Secret', '@db.internal:5432/prod'].join('');

  return [
    '---',
    'name: generated-leaks',
    'description: Runtime-generated secret detection fixture — credentials are assembled',
    '  in memory and written to a temp directory only while the test executes.',
    '---',
    '',
    '# Generated Leaks',
    '',
    '## 1. Overview & Purpose',
    '',
    'Fabricated credentials to exercise the secret scanner.',
    '',
    `- Stripe: \`${stripeKey}\``,
    `- Google: \`${googleKey}\``,
    '- Private key:',
    '',
    '  ```text',
    `  ${pemBegin}`,
    `  ${pemBody}`,
    '  ```',
    '',
    `- Database: \`${dbUri}\``,
    '',
  ].join('\n');
}

test('secret scan detects runtime-generated credentials (task 2.2)', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'eazworld-leaks-'));
  try {
    const skillDir = path.join(tmp, 'generated-leaks');
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, 'SKILL.md'), buildLeakySkill());

    const res = run(tmp);
    assert.strictEqual(res.status, 1, `stdout:\n${res.stdout}`);
    assertError(res, 'secret:stripe-api-key', 'generated-leaks');
    assertError(res, 'secret:google-api-key', 'generated-leaks');
    assertError(res, 'secret:private-key', 'generated-leaks');
    assertError(res, 'secret:db-credentials', 'generated-leaks');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('missing skills directory fails with exit code 1', () => {
  const res = run(path.join(REPO_ROOT, 'examples', 'does-not-exist'));
  assert.strictEqual(res.status, 1);
  assert.ok(res.stdout.includes('[skills-dir-missing]'), res.stdout);
});

test('repository .claude/skills/ passes validation (Phase 1 foundation)', () => {
  const res = run(REAL_SKILLS);
  assert.strictEqual(res.status, 0, `stdout:\n${res.stdout}\nstderr:\n${res.stderr}`);
  assert.ok(res.stdout.includes('Result         : PASS'), res.stdout);
});

test('unknown CLI option exits with code 2', () => {
  const res = spawnSync(process.execPath, [SCRIPT, '--bogus'], { encoding: 'utf8' });
  assert.strictEqual(res.status, 2);
});

test('parseFrontmatter folds multi-line descriptions (SKILL_TEMPLATE compatible)', () => {
  const { parseFrontmatter } = require(SCRIPT);
  const template = fs.readFileSync(
    path.join(REPO_ROOT, 'templates', 'SKILL_TEMPLATE.md'),
    'utf8'
  );
  const result = parseFrontmatter(template);
  assert.strictEqual(result.ok, true, JSON.stringify(result));
  assert.strictEqual(result.data.name, 'skill-name-in-kebab-case');
  assert.ok(
    result.data.description.includes('trigger its activation'),
    `folded description lost content: "${result.data.description}"`
  );
  assert.strictEqual(result.data.metadata.version, '1.0.0');
});
