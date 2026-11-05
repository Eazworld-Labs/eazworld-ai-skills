---
name: other-skill-name
description: Fixture whose frontmatter name deliberately differs from its parent
  directory to prove the name-mismatch check fails validation as required by the guide.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Wrong Name Field

## 1. Overview & Purpose

Directory is `wrong-name-field` but frontmatter declares `other-skill-name`.

## 2. Activation Conditions & Triggers

- **Trigger 1:** Name mismatch test.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:** None.

## 4. Technical Standards & Rules

- `name` must match the parent folder exactly.

## 5. Execution Workflow (Step-by-Step)

1. Run the validator.

## 6. Security & Edge Case Guidelines

- No secrets.

## 7. Definition of Done & Quality Gates

- [ ] Expected to fail validation.
