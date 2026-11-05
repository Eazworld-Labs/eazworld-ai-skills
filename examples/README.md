# Examples — Validator Fixtures

Reference skill mockups used by the Phase 2 automated test suite
(`scripts/validate-skills.test.js`) to prove `scripts/validate-skills.js` behaves
correctly.

## Layout

```text
examples/
├── valid-skills/     # Must pass validation with exit code 0
│   ├── software-engineering/sample-skill/   # Fully compliant skill + internal link
│   ├── digital-marketing/                   # Empty core department (.gitkeep)
│   ├── ai-automation/                      # Empty core department (.gitkeep)
│   ├── business-solutions/                 # Empty core department (.gitkeep)
│   └── device-services/repair-qa/          # Optional Department 5 (ARCHITECTURE.md)
└── invalid-skills/   # Must fail validation with exit code 1
    ├── software-engineering/Bad_Skill_Name/       # Kebab-case violation
    ├── software-engineering/missing-entry/        # No SKILL.md
    ├── software-engineering/no-description/       # Missing description field
    ├── software-engineering/wrong-name-field/     # name != parent directory
    ├── software-engineering/few-sections/         # Missing mandatory sections
    ├── software-engineering/force-push/           # git push --force in a code fence
    ├── software-engineering/inline-mention/       # Prose mention (must NOT be flagged)
    ├── software-engineering/broken-links/         # Relative link to missing file
    ├── software-engineering/dup-skill/            # Duplicate name across departments
    ├── digital-marketing/dup-skill/               # Duplicate name across departments
    └── rogue-tools/                               # Unknown department
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
