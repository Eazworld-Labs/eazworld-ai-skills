---
name: colon-scalar
description: Fixture whose description contains an unquoted nested mapping such as
  "operations: members" — strict YAML rejects a plain scalar holding a colon-space.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Colon Scalar

## 1. Overview & Purpose

The folded description value becomes "Fixture whose description contains an
unquoted nested mapping such as operations: members — strict YAML rejects a plain
scalar holding a colon-space." — strict YAML parses that as a nested mapping, so
the validator must reject it as `frontmatter-invalid`.

## 2. Activation Conditions & Triggers

- **Trigger 1:** Strict-YAML nested mapping test.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:** None.

## 4. Technical Standards & Rules

- Plain scalars must quote or reword nested-mapping patterns.

## 5. Execution Workflow (Step-by-Step)

1. Run the validator.

## 6. Security & Edge Case Guidelines

- No secrets.

## 7. Definition of Done & Quality Gates

- [ ] Expected to fail validation with `frontmatter-invalid`.
