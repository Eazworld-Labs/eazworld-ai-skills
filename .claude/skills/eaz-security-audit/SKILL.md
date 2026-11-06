---
name: eaz-security-audit
description: Audit codebases, APIs, and infrastructure configuration for security
  vulnerabilities. Use when asked to perform a security review, threat model a feature,
  check for OWASP Top 10 issues, scan for hardcoded secrets, audit dependencies, or
  assess a change before release.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.0.0"
---

# Security Audit

## 1. Overview & Purpose

Finds and reports security weaknesses in code, configuration, and design with evidence,
severity, and concrete remediation. Covers the OWASP Top 10, secret exposure, dependency
risk, authentication and authorization paths, and input handling. Every finding is
verifiable — file, line, and exploit path — so maintainers can fix what is real and
dismiss what is not without guessing.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks for a security review, audit, or vulnerability
  assessment of code, an API, or a repository.
- **Trigger 2:** When requested to threat-model a feature, check for OWASP Top 10 issues,
  or scan for hardcoded secrets and credentials.
- **Trigger 3:** When auditing dependencies for known vulnerabilities, or reviewing a
  change before a production release.
- **Anti-Trigger:** Do not activate for building new features (route to the implementation
  skills) or for general code style review (route to eaz-code-review).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. Scope: which repositories, services, or endpoints are in bounds for this audit.
  2. Sensitivity of data handled: personal data, payment data, or neither.
  3. Any rules of engagement: test environment only, or production read-only checks.
- **Codebase Audit Checklist:**
  1. Map entry points: routes, webhooks, background jobs, and admin interfaces.
  2. Trace authentication and authorization on every protected path.
  3. Review dependency manifests and lockfiles for outdated or risky packages.
  4. Check configuration and CI files for secrets, over-broad permissions, or debug flags.

## 4. Technical Standards & Rules

- Cover the OWASP Top 10: broken access control, injection, insecure design, security
  misconfiguration, vulnerable components, identification and authentication failures,
  software and data integrity failures, and logging failures.
- Rate every finding with severity (Critical / High / Medium / Low) plus the evidence
  that justifies it — no severity without proof.
- Distinguish exploitability: a theoretical weakness and a demonstrated path are never
  listed as the same thing.
- Check secrets hygiene across the whole history of the repository, not only HEAD.
- Prefer fixes that remove the risk class (framework defaults, parameterized queries)
  over patches that block one instance.
- Findings are written for action: location, impact, and the smallest safe remediation.

Example finding format:

```text
[HIGH] src/routes/export.ts:42 — CSV export missing an authorization check
Impact: any authenticated user can export all customers' data.
Fix: require role=admin on /admin/export and add a deny-path test.
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the scope, data sensitivity, and rules of engagement;
   stop and ask if production testing is requested without written approval.
2. **Step 2: Inspect Context** — Execute the audit checklist; build the attack-surface
   map before hunting for bugs.
3. **Step 3: Formulate Plan** — Order the review by risk: access control first, then
   input handling, then secrets and dependencies.
4. **Step 4: Verify Security** — Test findings safely in a local or staging environment
   only; never run exploit attempts against systems outside the agreed scope.
5. **Step 5: Apply Edits** — If fixes were requested, apply the smallest safe remediation
   per finding, one commit per fix where practical.
6. **Step 6: Execute Tests** — Re-run the test suite and re-scan fixed areas to confirm
  the weakness is gone and nothing regressed.
7. **Step 7: Report Status** — Deliver the findings table: severity, location, evidence,
   impact, and remediation, plus what was checked and found clean.

## 6. Security & Edge Case Guidelines

- **Rules of Engagement:** No denial-of-service, no brute force, no data exfiltration, and
  no production changes without explicit written human approval.
- **Safe Testing:** Proof of concept stays in a local or staging environment and is
  removed after verification — never committed.
- **Zero Hardcoding:** Reports reference secret *names* and locations, never their values;
  a discovered credential is reported for rotation, not copied into the report.
- **Scope Creep:** Systems discovered during the audit but outside scope are flagged, not
  tested.
- **False Positives:** Each finding states its exploit path; findings that cannot be
  demonstrated are labeled as defense-in-depth recommendations, not vulnerabilities.

## 7. Definition of Done & Quality Gates

- [ ] Every finding has location, evidence, severity, and remediation.
- [ ] Access control and input-handling paths reviewed on every entry point in scope.
- [ ] Dependency and secret scans run across the repository history.
- [ ] Fixed items re-scanned and confirmed clean; test suite passes after any fix.
- [ ] No exploit payloads, credentials, or out-of-scope data in the report or the diff.
- [ ] Human maintainer reviews and approves all fixes before release.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; severity definitions follow the
  CVSS-style labels above.
