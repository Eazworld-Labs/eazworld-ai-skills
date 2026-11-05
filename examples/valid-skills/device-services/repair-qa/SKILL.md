---
name: repair-qa
description: Optional Department 5 fixture proving that the device-services department
  from docs/ARCHITECTURE.md is accepted by the validator without being required for the
  v1.0.0 roadmap. Use when verifying optional department handling.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Repair QA

## 1. Overview & Purpose

Compact fixture proving optional departments (`device-services`) pass validation.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When verifying optional department handling in the linter.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:** None.

## 4. Technical Standards & Rules

- Follow `docs/ARCHITECTURE.md` department layout.

## 5. Execution Workflow (Step-by-Step)

1. Run the validator against `examples/valid-skills`.

## 6. Security & Edge Case Guidelines

- No secrets or destructive commands.

## 7. Definition of Done & Quality Gates

- [ ] Validator reports zero errors for this fixture.
