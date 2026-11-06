---
name: eaz-code-review
description: Review pull requests and code changes for correctness, security, test
  quality, and readability. Use when asked to review a diff or PR, give feedback on a
  change, check code before merge, or assess whether a change meets repository
  standards.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.0.0"
---

# Code Review

## 1. Overview & Purpose

Reviews a change against its stated intent and the repository's standards, then delivers
prioritized, actionable feedback. Reviews run in a fixed order — correctness first,
security second, tests third, readability last — so the important problems surface before
style noise. The output is a clear verdict: approve, or request changes with a short list
of what must move.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to review a pull request, branch, diff, or patch.
- **Trigger 2:** When asked for feedback on a change before merge or release.
- **Trigger 3:** When checking whether a change matches repository conventions and
  standards.
- **Anti-Trigger:** Do not activate for writing new features (route to the implementation
  skills) or for hunting vulnerabilities systematically (route to eaz-security-audit) — a
  code review flags security problems it encounters but is not a full audit.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The diff under review, with its intent: the issue, requirement, or request it
     addresses.
  2. The acceptance criteria the change claims to satisfy.
  3. Repository conventions: lint configuration, contributing guide, and neighboring code.
- **Codebase Audit Checklist:**
  1. Read the surrounding code the change touches to understand existing patterns.
  2. Check lint and format configuration so style comments stay limited to real issues.
  3. Locate the tests covering the changed area and read them before judging the change.
  4. Confirm the diff matches its stated intent before evaluating how it is written.

## 4. Technical Standards & Rules

- Review in order: correctness against intent, security, test quality, readability,
  performance — stop and demand fixes for blockers before discussing nits.
- Every comment carries a location (file and line), the reason it matters, and a concrete
  suggestion — a comment without a fix path is noise.
- Severity labels: **blocker** (must change before merge), **question** (needs an answer),
  **nit** (optional polish).
- Style is the linter's job — do not hand-review what the formatter would rewrite.
- Judge tests by what they would catch, not by their existence: a test that passes with
  the feature removed is not a test.
- Understand intent before judging implementation — if the intent is unclear, ask before
  recommending a rewrite.
- Praise what is done well; reviews that only criticize teach people to fear them.

Example of an actionable comment:

```text
blocker · src/payment/charge.ts:88
The amount comes from the client payload. Recompute it server-side from
the cart before charging (see eaz-api-development skill, section 4).
Suggestion: const amountMinor = await priceCart(cart);
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate what the change is supposed to do and how success is
   measured.
2. **Step 2: Inspect Context** — Execute the audit checklist; read the surrounding code
   before reading the diff line by line.
3. **Step 3: Formulate Plan** — Walk the diff in review order: correctness, security,
   tests, readability, performance.
4. **Step 4: Verify Security** — Check the change for hardcoded secrets, missing input
   validation, authorization gaps, and injection risks; flag anything found as a blocker.
5. **Step 5: Apply Edits** — Write the review comments with severity labels, locations,
   and suggested fixes.
6. **Step 6: Execute Tests** — Run the test suite against the change when possible, and
   confirm the new tests fail without the change.
7. **Step 7: Report Status** — Deliver the verdict — approve or request changes — with
   blockers first, then questions, then nits.

## 6. Security & Edge Case Guidelines

- **Secrets:** A credential in the diff is a blocker — report its location for rotation;
  never copy its value into the review.
- **Input Handling:** Every new external input must be validated at the boundary; missing
  validation is a blocker, not a suggestion.
- **Authorization:** New routes and actions must show their auth check in the diff or
  link to it — absence is a blocker.
- **Destructive Suggestions:** Never recommend force-pushes, history rewrites, or data
  deletion as review fixes without explicit human approval.
- **Edge Cases:** Check the change for empty states, error paths, and concurrent use —
  reviews that only read the happy path miss most real defects.

## 7. Definition of Done & Quality Gates

- [ ] Verdict stated explicitly: approve or request changes.
- [ ] Blockers listed before questions and nits, each with location and suggestion.
- [ ] Security pass completed: secrets, validation, and authorization checked.
- [ ] Test quality assessed — new tests verified to fail without the change where
      practical.
- [ ] Style comments limited to issues the linter does not already catch.
- [ ] No credential values, exploit payloads, or out-of-scope material in the review.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; follow the target repository's
  contributing guide for conventions.
