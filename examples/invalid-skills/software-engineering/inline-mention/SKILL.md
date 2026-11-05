---
name: inline-mention
description: Fixture that mentions a force push only in prose so the scanner must not
  flag documentation context and only reports commands inside runnable code fences.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Inline Mention

## 1. Overview & Purpose

This file mentions `git push --force` in inline prose only — never inside a code
fence — so the fence-aware scanner must NOT report `dangerous:git-force-push` here.

## 2. Activation Conditions & Triggers

- **Trigger 1:** Fence-awareness regression test.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:** None.

## 4. Technical Standards & Rules

- Documentation may describe prohibited commands without executing them.

## 5. Execution Workflow (Step-by-Step)

1. Run the validator.

## 6. Security & Edge Case Guidelines

- Policy text references prohibited operations without runnable snippets.

## 7. Definition of Done & Quality Gates

- [ ] Expected to produce no `dangerous:git-force-push` error for this file.
