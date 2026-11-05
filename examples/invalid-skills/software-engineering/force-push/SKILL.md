---
name: force-push
description: Fixture containing a force push command inside a fenced code block used to
  prove the dangerous command scanner flags runnable destructive shell commands.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Force Push

## 1. Overview & Purpose

The fenced command below must be flagged by the dangerous-command scan.

## 2. Activation Conditions & Triggers

- **Trigger 1:** Dangerous command detection test.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:** None.

## 4. Technical Standards & Rules

- Force pushes are prohibited (SECURITY_POLICY §9).

## 5. Execution Workflow (Step-by-Step)

```bash
git push --force origin main
```

## 6. Security & Edge Case Guidelines

- Destructive operations require explicit human confirmation.

## 7. Definition of Done & Quality Gates

- [ ] Expected to fail validation with `dangerous:git-force-push`.
