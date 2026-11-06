# Troubleshooting & FAQ

Solutions for common problems when installing, validating, or using the Eazworld AI
Skills Library. For cross-agent test results, see
[COMPATIBILITY.md](COMPATIBILITY.md).

## Troubleshooting

### `npm test` fails with a glob or directory error

Run tests with the bare form from the repository root:

```bash
npm test
```

The `package.json` script is `node --test` on purpose — glob patterns fail on Node 20
and directory arguments fail on Node 21+. The library is tested on Node 24.

### The validator reports errors for a skill you just added

Run it directly for the full report:

```bash
node scripts/validate-skills.js
```

Common causes, in order of frequency:

- **Frontmatter:** missing `name`, `description`, `license`, or `metadata` block; a
  `name` that is not kebab-case; a description containing a colon-space that breaks
  plain YAML folding.
- **Sections:** one of the 7 mandatory sections missing or renamed — section
  headings must match the authoring guide exactly.
- **Secrets:** the scanner found a secret-shaped string. Never write real or
  realistic credentials — assemble test fixtures from fragments at runtime instead.
- **Line length:** prose lines over 120 characters (fenced code is exempt).

### A skill does not appear in the agent's skill list

1. Confirm the file exists at `.claude/skills/<skill-name>/SKILL.md` — exactly one
   folder below `skills/`. Skills nested in a subfolder (such as an old
   `software-engineering/` folder) are not discovered.
2. Re-run the validator — discovery requires valid frontmatter.
3. Restart the agent session; skills are indexed at startup, not mid-session.
4. Check for an ID collision: if a built-in skill shares the name (known case:
   `frontend-design` in OpenCode), the built-in wins. Rename only if the collision
   affects your workflow — the library keeps the name from `tasks.md`.

### A `references/` link does not load

Relative links resolve against the skill's own directory. Verify the target exists:

```bash
ls .claude/skills/<skill-name>/references/
```

All three current references are linked as `./references/<file>.md` from their
SKILL.md and verified in `docs/COMPATIBILITY.md`.

### CI fails but the same command passes locally

Check the workflow's Node version first (`.github/workflows/lint-skills.yml` runs on
Node 24). If the failure is the secret scanner, search your diff for realistic-looking
keys — even test fixtures must be assembled from fragments, never committed as whole
strings.

### The `frontend-design` skill loads different instructions than expected

Known issue, documented in `docs/COMPATIBILITY.md`: OpenCode ships a built-in skill
with the same ID, so it shadows this library's file. The library's file still exists
and passes validation; Claude Code loads it from `.claude/skills/` normally.

## FAQ

**How do I install the library?**
Clone the repository and open it as your workspace — see the Quickstart in
[README.md](../README.md). Both Claude Code and OpenCode index `.claude/skills/`
natively; there is no separate install step.

**Where do I add a new skill?**
`.claude/skills/<skill-name>/SKILL.md`, following the step-by-step guide
in [CONTRIBUTING.md](../CONTRIBUTING.md). One skill, one directory, one SKILL.md.

**Why does one skill live in two departments' trigger lists?**
It should not. Every skill carries an Anti-Trigger section that routes overlapping
tasks to the correct skill — the router is the description, not duplication.

**Can I use these skills with a different agent?**
Anything that reads SKILL.md files with YAML frontmatter can consume them. The
library is verified against Claude Code and OpenCode; other agents work as long as
they support the same directory convention.

**How are secrets kept out of the library?**
Three layers: the authoring rules (environment variables only), the validator's
secret scanner, and a pre-push hook with repository-wide scanning. CI re-runs the
validator on every push.

**What does a fenced code example in a skill do?**
It shows the concrete shape of the rule next to it — a role matrix, a callback
verification, an offline queue. Every skill ships at least one; the JSON examples
are machine-parsed by review checks.

**How do I report a bug in a skill?**
Open an issue with the skill name, the task you were doing, and what the agent
produced instead. Pull request fixes are welcome — see CONTRIBUTING.md.

**Is there a versioning policy?**
Yes — semantic versioning tracked in [CHANGELOG.md](../CHANGELOG.md); the public
release is v1.0.0.
