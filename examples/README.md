# Examples — Validator Fixtures

Reference skill mockups used by the Phase 2 automated test suite
(`scripts/validate-skills.test.js`) to prove `scripts/validate-skills.js` behaves
correctly.

## Layout

```text
examples/
├── valid-skills/     # Must pass validation with exit code 0
│   └── sample-skill/                  # Fully compliant skill + internal link
└── invalid-skills/   # Must fail validation with exit code 1
    ├── Bad_Skill_Name/                # Kebab-case violation
    ├── missing-entry/                 # No SKILL.md
    ├── no-description/                # Missing description field
    ├── wrong-name-field/              # name != parent directory
    ├── few-sections/                  # Missing mandatory sections
    ├── force-push/                    # git push --force in a code fence
    ├── inline-mention/                # Prose mention (must NOT be flagged)
    ├── broken-links/                  # Relative link to missing file
    ├── bad-department/                # metadata.department not a known department
    └── rogue-tools/rogue-skill/       # Skill nested too deep (undiscoverable)
```

## Run locally

```bash
# Full suite (fixtures + repository state)
npm test

# Lint the real library
npm run validate

# Lint a fixture root directly
node scripts/validate-skills.js --skills-dir examples/valid-skills
node scripts/validate-skills.js --skills-dir examples/invalid-skills
```

The `invalid-skills/` root intentionally fails — its fixtures exist only to prove
detection works. Credential fixtures are never committed: the scanner's fake keys
are assembled at test runtime and written to a temp directory only while the test
runs (see `scripts/validate-skills.test.js`). Never copy any fixture contents into
`.claude/skills/`.
