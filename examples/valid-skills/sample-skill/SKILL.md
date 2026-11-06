---
name: sample-skill
description: Reference sample skill that proves a fully compliant SKILL.md passes the
  validation linter. Use when running the examples/ fixture suite, reviewing validator
  behavior, or checking your local setup before authoring a real skill.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.0.0"
---

# Sample Skill

## 1. Overview & Purpose

Reference fixture demonstrating a fully compliant skill: valid frontmatter, all 7
mandatory sections, kebab-case naming, and a resolvable internal link.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When executing the examples fixture suite.
- **Anti-Trigger:** Do not activate for production skill authoring tasks.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:** None — this fixture is self-contained.

## 4. Technical Standards & Rules

- Follow `docs/ENGINEERING_STANDARDS.md` and `docs/SKILL_AUTHORING_GUIDE.md`.

## 5. Execution Workflow (Step-by-Step)

1. Run `node scripts/validate-skills.js --skills-dir examples/valid-skills`.
2. Confirm the linter reports `Result : PASS`.

## 6. Security & Edge Case Guidelines

- Contains no secrets, credentials, or destructive shell commands.

## 7. Definition of Done & Quality Gates

- [ ] Validator reports zero errors for this fixture.

See the [setup guide](./references/setup-guide.md) for details.
