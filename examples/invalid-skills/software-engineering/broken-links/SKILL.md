---
name: broken-links
description: Fixture with a relative link pointing to a file that does not exist used
  to prove the internal reference check fails validation for broken documentation links.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Broken Links

## 1. Overview & Purpose

The link below points to a file that was never created.

## 2. Activation Conditions & Triggers

- **Trigger 1:** Broken relative link test.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:** None.

## 4. Technical Standards & Rules

- All internal references must resolve (SKILL_AUTHORING_GUIDE §11).

## 5. Execution Workflow (Step-by-Step)

1. Run the validator.

## 6. Security & Edge Case Guidelines

- No secrets.

## 7. Definition of Done & Quality Gates

- [ ] Expected to fail validation with `broken-link`.

Missing reference: [technical guide](./references/missing-guide.md)
