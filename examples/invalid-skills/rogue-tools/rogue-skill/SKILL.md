---
name: rogue-skill
description: Fixture placed inside an unknown department folder to prove the validator
  rejects department directories outside the four core departments and device-services.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Rogue Skill

## 1. Overview & Purpose

Lives under `rogue-tools/`, which is not a recognized department.

## 2. Activation Conditions & Triggers

- **Trigger 1:** Unknown department detection test.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:** None.

## 4. Technical Standards & Rules

- Only the four core departments plus device-services are recognized.

## 5. Execution Workflow (Step-by-Step)

1. Run the validator.

## 6. Security & Edge Case Guidelines

- No secrets.

## 7. Definition of Done & Quality Gates

- [ ] Expected to fail validation with `department-unknown`.
