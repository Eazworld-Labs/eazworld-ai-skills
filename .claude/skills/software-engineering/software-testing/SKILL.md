---
name: software-testing
description: Design and implement automated test suites with Jest, Vitest, and Playwright.
  Use when asked to write unit, integration, or end-to-end tests, improve coverage of a
  feature, fix flaky tests, add mocks at boundaries, or set up testing in CI.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Software Testing

## 1. Overview & Purpose

Builds test suites that fail for the right reasons and pass for the right reasons. Covers
test design (happy path, edge cases, failure modes), the test pyramid, mocking at
boundaries, determinism, and CI integration. A suite built with this skill is trusted:
when it is green, the change is safe; when it is red, something real is wrong.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to write, extend, or improve tests for code.
- **Trigger 2:** When coverage of a feature is missing or a bug needs a regression test.
- **Trigger 3:** When tests are flaky, slow, or unreliable and need repair.
- **Trigger 4:** When setting up a test runner, coverage reporting, or tests in CI.
- **Anti-Trigger:** Do not activate for writing production features (route to the
  implementation skills) or for reviewing someone else's diff (route to code-review).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The behavior under test: inputs, expected outputs, and the acceptance criteria.
  2. The failure modes that matter: what must never break for users.
  3. The test stack in use (Jest, Vitest, Playwright) — follow it, do not introduce a
     second framework.
- **Codebase Audit Checklist:**
  1. Inspect `package.json` test scripts and the existing runner configuration.
  2. Read neighboring tests and mirror their structure and naming conventions.
  3. Check coverage configuration and which directories are excluded.
  4. Look at CI configuration to see when and how tests run.

## 4. Technical Standards & Rules

- Follow the test pyramid: many fast unit tests, a layer of integration tests against
  real boundaries, few end-to-end tests for critical journeys only.
- Test observable behavior, not implementation details — renaming an internal function
  must not break the suite.
- Structure every test as Arrange, Act, Assert with one clear assertion theme; the test
  name states the behavior, for example "returns 404 when the order does not exist".
- Deterministic only: no real network, no wall-clock dependence, no unseeded randomness —
  inject time, random, and I/O at the boundary.
- Mock at system boundaries (network, clock, filesystem), never the logic under test.
- Coverage is a signal, not a goal — every critical path has a test whether or not the
  percentage looks impressive.
- Flaky tests are defects: quarantine with a ticket, then fix or delete — never rerun
  until green.

Example of a deterministic behavior test (Arrange, Act, Assert):

```ts
it('returns 404 when the order does not exist', async () => {
  const res = await request(app).get('/orders/does-not-exist');

  expect(res.status).toBe(404);
  expect(res.body.error.code).toBe('order_not_found');
});
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the behavior to cover and the failure modes that must
   be locked in.
2. **Step 2: Inspect Context** — Execute the audit checklist; reuse the existing runner,
   helpers, and patterns.
3. **Step 3: Formulate Plan** — List the cases first: happy path, boundary values,
   invalid input, and the regression case for any known bug.
4. **Step 4: Verify Security** — Confirm fixtures contain only dummy data — no real
   credentials, personal data, or calls to production systems.
5. **Step 5: Apply Edits** — Write the tests in Arrange, Act, Assert form, one behavior
   per test, alongside the code they protect.
6. **Step 6: Execute Tests** — Run the full suite twice to prove determinism, then run
   lint and type-check.
7. **Step 7: Report Status** — Report cases added, suite results, coverage movement, and
   any behavior deliberately left untested with the reason.

## 6. Security & Edge Case Guidelines

- **Zero Hardcoding:** Test fixtures use dummy values and environment placeholders —
  real credentials never enter a test file, snapshot, or log.
- **Isolated Systems:** Tests run against local or in-memory systems; they never touch
  production databases, payment providers, or live webhooks.
- **Honest Assertions:** Never weaken or delete an assertion to make CI pass — a falsified
  test suite is worse than no suite (prohibited by the authoring guide).
- **Destructive Fixtures:** Database cleanup in tests is scoped and reversible; tests
  clean up what they create and never drop shared tables.
- **Edge Cases:** Every test isolates one failure mode — timeouts, malformed payloads,
  and empty collections each get their own case, not one mega-test.

## 7. Definition of Done & Quality Gates

- [ ] Full suite passes locally and runs green twice in a row (deterministic).
- [ ] Critical paths covered with happy path, boundary, and failure cases.
- [ ] Lint and type-check pass with the new tests included.
- [ ] No real credentials or personal data in fixtures, snapshots, or logs.
- [ ] CI executes the suite on every pull request.
- [ ] Any flaky test found is fixed or ticketed — not ignored.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; follow the target project's existing
  test patterns and runner.
