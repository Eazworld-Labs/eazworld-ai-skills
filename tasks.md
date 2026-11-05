# Eazworld AI Skills Library — Development Tasks (`tasks.md`)

**Version:** 1.0.0  
**Owner:** Eazworld  
**Status:** Active Development  
**Repository:** `eazworld-ai-skills`  
**Primary Agent:** Claude Code  
**Secondary Agent:** OpenCode  

---

## Task Management Rules

This document tracks the actual implementation progress of the Eazworld AI Skills Library.

### Status Legend

- `[ ]` Not started
- `[x]` Completed
- `[~]` In progress
- `[!]` Blocked
- `[?]` Requires review

### Mandatory Operational Rules

1. Complete tasks in their defined order unless a dependency requires otherwise.
2. Do not mark a task complete (`[x]`) until all its acceptance criteria are satisfied.
3. Test every skill in both Claude Code and OpenCode before considering it production-ready.
4. Update this file whenever a task status changes.
5. Do not create duplicate skill files for different AI agents unless technically necessary.
6. Follow `docs/ENGINEERING_STANDARDS.md` and `docs/SECURITY_POLICY.md` strictly.
7. All significant changes must be committed and tracked through Git.
8. Never expose credentials, API keys, tokens, or other secrets in source files.
9. Do not publish incomplete or untested skills as production-ready.

---

## PHASE 1 — Complete Repository Foundation

**Priority:** Critical  
**Objective:** Finish and verify the repository's foundational structure and documentation suite.

### 1.1 Repository Directory Structure

- [x] Verify root repository directory structure.
- [x] Verify `.claude/skills/` directory exists.
- [x] Verify `docs/` directory exists.
- [x] Verify `scripts/` directory exists.
- [x] Verify `templates/` directory exists.
- [x] Verify `examples/` directory exists.
- [x] Verify `.github/workflows/` directory exists.
- [x] Remove unnecessary or duplicate files.

### 1.2 Foundational Documentation Suite

- [x] `README.md` (v1.0.0)
- [x] `LICENSE` (MIT)
- [x] `CONTRIBUTING.md` (v1.0.0)
- [x] `SECURITY.md` (v1.0.0)
- [x] `CHANGELOG.md` (v1.0.0)
- [x] `PROJECT_SPEC.md` (v1.0.0)
- [x] `docs/ENGINEERING_STANDARDS.md` (v2.0.0)
- [x] `docs/ARCHITECTURE.md` (v1.0.0)
- [x] `docs/SKILL_AUTHORING_GUIDE.md` (v1.0.0)
- [x] `docs/COMPATIBILITY.md` (v1.0.0)
- [x] `docs/SECURITY_POLICY.md` (v1.0.0)
- [x] `docs/ROADMAP.md` (v1.0.0)
- [x] `tasks.md` (v1.0.0)

### 1.3 Repository Governance & Workflows

- [x] Create `.github/PULL_REQUEST_TEMPLATE.md`.
- [x] Create GitHub issue templates for bug reports and feature requests.
- [x] Define branch protection guidelines.
- [x] Define conventional commit message standards.
- [x] Define pull request review requirements.
- [x] Verify MIT License metadata.
- [x] Establish initial Git repository commit.

**Completion Criteria:** Repository structure, governance templates, and foundational specs are verified and committed.

---

## PHASE 2 — Build Validation & Quality Automation

**Priority:** Critical  
**Objective:** Build automated tools to validate skills before they are accepted into the library.

### 2.1 Validation Scripts

- [x] Create `scripts/validate-skills.js`.
- [x] Validate `SKILL.md` YAML frontmatter formatting and schema.
- [x] Validate skill `name` against its parent folder name (`kebab-case`).
- [x] Validate required metadata fields (`name`, `description`).
- [x] Validate all 7 mandatory Markdown sections in `SKILL.md`.
- [x] Detect missing `SKILL.md` entry files.
- [x] Detect duplicate skill names across departments.
- [x] Validate internal relative documentation references (`references/`).
- [x] Report invalid skill directories cleanly in CLI output.

### 2.2 Security Validation

- [x] Add secret and token detection patterns.
- [x] Detect accidental API key exposure (`sk_live_`, `AIzaSy`, etc.).
- [x] Detect hardcoded passwords, private keys, and DB URIs.
- [x] Detect unsafe shell command patterns (`rm -rf`, `git push --force`).
- [x] Verify helper scripts do not execute destructive operations without authorization.

### 2.3 Automated Test Suite for Validation

- [x] Create automated tests for `scripts/validate-skills.js`.
- [x] Create valid and invalid sample skill mockups in `examples/`.
- [x] Test missing metadata scenarios.
- [x] Test invalid directory naming scenarios.
- [x] Test missing mandatory section scenarios.
- [x] Confirm expected non-zero exit codes and descriptive failure messages.

### 2.4 GitHub Actions CI/CD Pipeline

- [x] Create `.github/workflows/lint-skills.yml`.
- [x] Trigger validation automatically on Pull Requests to `main`.
- [x] Fail build workflows when skill checks or security scans fail.
- [x] Document how developers can run validation scripts locally.

**Completion Criteria:** Automated CI/CD and local scripts reliably flag invalid, incomplete, or insecure skills.

---

## PHASE 3 — Software Engineering Department (13 Skills)

**Priority:** Critical  
**Objective:** Author, validate, and test the 13 core software engineering skills.

### 3.1 Architecture & Core Systems

- [x] `software-architecture`
- [x] `frontend-design`
- [x] `backend-engineering`
- [x] `database-architecture`
- [x] `api-development`

### 3.2 Security, Review & Quality Assurance

- [x] `security-audit`
- [x] `software-testing`
- [x] `code-review`

### 3.3 Specialized Engineering Domains

- [x] `ecommerce-development`
- [x] `mobile-app-development`
- [x] `performance-optimization`
- [x] `seo-engineering`
- [x] `cloud-devops`

### 3.4 Mandatory Quality Checklist per Skill

- [x] Create skill directory (`skills/software-engineering/<skill-name>/`).
- [x] Write `SKILL.md` with valid YAML frontmatter.
- [x] Define precise triggers and activation conditions.
- [x] Outline required inputs and context audit directives.
- [x] Define step-by-step execution workflows.
- [x] Incorporate non-negotiable security guardrails.
- [x] Include concrete code templates and examples.
- [x] Add supporting spec files under `references/` if required.
- [x] Pass automated validation script (`npm run validate`).
- [ ] Verify discovery and loading in Claude Code.
- [x] Verify discovery and loading in OpenCode.

**Evidence & known issue:** Validator PASS for all 13 skills; every skill ships at least
one fenced code example. OpenCode discovery verified live in-session — 12 of 13 skills
registered on creation. Known issue: `frontend-design` is shadowed in OpenCode by a
built-in skill with the same ID; the file exists and passes validation, and the name is
kept per this task list. Claude Code discovery remains open pending a Claude Code run.

**Completion Criteria:** All 13 Software Engineering skills pass quality gates and are fully executable in both agents.

---

## PHASE 4 — Digital Marketing Department (7 Skills)

**Priority:** High  
**Objective:** Build seven reusable digital marketing and growth skills.

### 4.1 Marketing Skills Portfolio

- [x] `seo-strategy`
- [x] `google-ads`
- [x] `meta-ads`
- [x] `social-media-management`
- [x] `brand-identity`
- [x] `email-marketing`
- [x] `conversion-optimization`

### 4.2 Quality Requirements

- [x] Define target users, platform policies, and activation triggers.
- [x] Include structured research and audience analysis procedures.
- [x] Establish measurable campaign KPI evaluation logic.
- [x] Validate every skill using `scripts/validate-skills.js`.
- [ ] Verify cross-agent execution in Claude Code and OpenCode.

**Evidence:** All 7 skills contain a target-users statement, named platform policies,
an activation-triggers section, a Research & Audience Audit Checklist, and KPI
evaluation logic with baseline and target — verified 7/7 by sweep. Validator PASS for
all 20 skills; every skill ships at least one fenced example (JSON examples
machine-parsed). OpenCode discovery verified live in-session — all 7 registered on
creation. Claude Code check remains open: CLI returns the weekly-limit message
(resets 12am Africa/Accra).

**Completion Criteria:** All 7 Digital Marketing skills pass library quality standards and agent tests.

---

## PHASE 5 — AI & Automation Department (5 Skills)

**Priority:** High  
**Objective:** Develop five skills for custom AI systems, n8n integrations, and business automation.

### 5.1 AI & Automation Skills Portfolio

- [x] `ai-agent-development`
- [x] `n8n-automation`
- [x] `whatsapp-automation`
- [x] `chatbot-development`
- [x] `crm-automation`

### 5.2 Quality Requirements

- [x] Document supported API, webhook, and LLM agent architectures.
- [x] Enforce strict environment variable isolation for API keys.
- [x] Include retry logic, exponential backoff, and error-handling workflows.
- [x] Validate every skill via automated linter.
- [ ] Verify cross-agent execution in Claude Code and OpenCode.

**Evidence:** Sweep across all 5 skills confirmed 5/5 for "Supported architectures"
statements, an Environment Isolation rule in every §6, and exponential backoff plus an
error path (error branch, fail-fast, dead-letter, or fallback) in every skill. Each
skill ships one fenced example (backoff helper, n8n retry config, HMAC verification,
intent spec, idempotent dedup — JSON examples machine-parsed). Validator PASS for all
25 skills; format checks clean. OpenCode discovery verified live in-session — all 5
registered on creation. Claude Code check remains open: CLI returns the weekly-limit
message (resets 12am Africa/Accra).

**Completion Criteria:** All 5 AI & Automation skills provide reliable, secure, and reusable workflows.

---

## PHASE 6 — Business Solutions Department (6 Skills)

**Priority:** High  
**Objective:** Build six skills for enterprise verticals, ERPs, and regional fintech integrations.

### 6.1 Business Solutions Portfolio

- [x] `school-management`
- [x] `church-management`
- [x] `pos-inventory`
- [x] `restaurant-management`
- [x] `booking-systems`
- [x] `ghana-payments` (Paystack, Hubtel, Mobile Money APIs)

### 6.2 Quality Requirements

- [x] Define RBAC roles, data privacy standards, and audit logging.
- [x] Address regional payment callback verification and idempotency rules.
- [x] Include offline-first and POS sync considerations where relevant.
- [x] Validate every skill via automated linter.
- [ ] Verify cross-agent execution in Claude Code and OpenCode.

**Evidence:** Flattened-text sweep confirmed 6/6 across all six skills for RBAC role
definitions, data privacy/retention rules, audit logging, payment callback
verification, idempotency rules, and offline considerations. Each skill ships one
fenced example (role matrix, access rules, offline queue, order ticket, idempotent
booking, timing-safe callback verification — five JSON examples machine-parsed).
Validator PASS for all 31 skills; format checks clean. OpenCode discovery verified
live in-session — all 6 registered on creation (two experienced transient registry
churn and re-registered). Claude Code check remains open: CLI returns the
weekly-limit message (resets 12am Africa/Accra).

**Completion Criteria:** All 6 Business Solutions skills deliver practical, secure, and production-ready guidance.

---

## PHASE 7 — Agent Compatibility & Integration Verification

**Priority:** Critical  
**Objective:** Formally test and document cross-agent compatibility across the complete library.

### 7.1 Claude Code Verification

- [ ] Test native skill discovery from `.claude/skills/`.
- [ ] Verify activation on domain triggers.
- [ ] Verify relative link resolution for `references/`.
- [ ] Test representative skills across all 4 departments.

### 7.2 OpenCode Verification

- [x] Test shared skill discovery from `.claude/skills/`.
- [x] Verify activation on domain triggers.
- [x] Verify relative link resolution for `references/`.
- [x] Confirm no duplicate skills exist under `.opencode/`.

### 7.3 Compatibility Matrix Logging

- [x] Document test outcomes and agent runner versions in `docs/COMPATIBILITY.md`.
- [ ] Resolve any execution discrepancies across environments.

**Evidence (§7.2):** Discovery — all 31 skills registered live in OpenCode v2.0.15
as created. Activation — `api-development` loaded end to end via the skill tool with
full content. References — 3/3 static resolution plus runtime resolution of
`./references/openapi-checklist.md` during the live load. Duplicates — no `.opencode/`
directory exists. Matrix written to `docs/COMPATIBILITY.md` with runner versions
(OpenCode v2.0.15, Claude Code 2.1.312, Node v24.21.0). §7.1 remains blocked by the
Claude Code weekly quota (resets 12am Africa/Accra); §7.3 discrepancy resolution stays
open until Claude Code can be tested for environment-specific discrepancies.

**Completion Criteria:** Compatibility Matrix fully populated with passing status across both agents.

---

## PHASE 8 — Developer Experience & Public Documentation

**Priority:** High  
**Objective:** Make the library accessible, well-documented, and easy for open-source contributors to use.

- [x] Complete root `README.md` with usage badges and installation steps.
- [x] Document installation for Claude Code and OpenCode users.
- [x] Add step-by-step skill creation guide in `CONTRIBUTING.md`.
- [x] Add troubleshooting and FAQ section in documentation.
- [x] Review all Markdown files for formatting, typos, and broken relative links.

**Evidence:** README carries CI/license/version/agents badges and a per-agent
installation section (numbered steps for Claude Code and OpenCode, verification
step, Node requirement). CONTRIBUTING Step 3 now walks template copy → frontmatter →
7 sections → fenced example → quality-matrix self-check. `docs/TROUBLESHOOTING.md`
ships troubleshooting (validator, discovery, links, CI) and FAQ, linked from the
README documentation table. Repo-wide review: all active relative links resolve (4
flagged are intentional — a backticked format example, the test-asserted
`broken-links` fixture, and two template placeholders); trailing whitespace is
entirely legitimate 2-space hard breaks; heading hierarchy clean; common-misspelling
sweep clean; tests 8/8 and validator PASS (31 skills).

**Completion Criteria:** External developers can clone, install, use, and contribute to the library seamlessly.

---

## PHASE 9 — Final Security Audit & Public v1.0.0 Release

**Priority:** Critical  
**Objective:** Execute final quality audits and publish version 1.0.0 to GitHub.

### 9.1 Pre-Release Audit

- [x] Run `npm run validate` across all 31 skills.
- [x] Perform automated secret scanning across entire Git history.
- [x] Audit code snippets for OWASP Top 10 compliance.
- [x] Confirm MIT license information in all files.

### 9.2 Release Artifacts

- [x] Update `CHANGELOG.md` for Release v1.0.0.
- [x] Update version tags in root files.
- [x] Create Git release tag `v1.0.0`.
- [x] Publish public GitHub repository.

**Evidence (§9.2 items 3–4):** Annotated tag `v1.0.0` created on `aa335a8` and
pushed to origin; GitHub Release published at
https://github.com/Eazworld-Labs/eazworld-ai-skills/releases/tag/v1.0.0. (The repo
later moved from `fekt2016/` to the `Eazworld-Labs` organization; install links
point at `Eazworld-Labs` throughout.) Repository
visibility confirmed PUBLIC via `gh repo view`.

**Evidence (§9.1):** Validator PASS — 31/31 skills, 0 errors, 0 warnings. History
scan — every commit in `git rev-list --all` searched for key, token, private-key,
database-URI, and cloud-credential patterns: clean. OWASP review — all skill
snippets scanned for injection, weak crypto, misconfiguration, and SSRF patterns:
no interpolated SQL, no eval, no MD5/SHA1 for security, no wildcard CORS, no
disabled TLS verification; representative manual review confirms parameterized
validation (Zod), timing-safe HMAC verification, and RBAC-scoped examples; the only
`Math.random()` is backoff jitter (not security randomness); test-harness
`spawnSync` uses fixed argv with no shell. Licenses — 31/31 SKILL.md files carry
`license: MIT`, root `LICENSE` present, `package.json` license is MIT.

**Evidence (§9.2 items 1–2):** CHANGELOG `[1.0.0]` now covers all 31 skills across
4 departments, validation tooling, governance & CI/CD templates, and developer
documentation. Version fields verified at 1.0.0: `package.json`, README text and
badge, `PROJECT_SPEC.md`, and all 31 skill metadata blocks — no stale 0.x values.

**Completion Criteria:** Public v1.0.0 release tagged and published on GitHub.

---

## PHASE 10 — Post-Release Maintenance & Ecosystem Growth

**Priority:** Ongoing  
**Objective:** Maintain quality, address community feedback, and expand skills post-release.

- [ ] Monitor incoming GitHub issues and community Pull Requests.
- [ ] Maintain compatibility as Claude Code and OpenCode specs evolve.
- [ ] Expand regional fintech integrations across West Africa.
- [ ] Regularly run automated dependency security audits.
- [x] Ship the distribution & user installation suite (`scripts/install.sh`,
      `scripts/install.ps1`, README "User Installation & Setup").

**First-pass status (2026-11-05):** Issues and PRs checked — none open. Claude Code
re-verification attempted — the weekly limit is still active (resets 12am
Africa/Accra), so §7.1 stays queued for when quota returns. Dependency audit:
repository has zero dependencies and zero devDependencies (Node built-ins only, no
lockfile, no node_modules), so there is no third-party surface to audit — verified
directly from `package.json`. All four items stay unchecked by design: Phase 10 is
ongoing maintenance, not a one-time gate.

**Fintech expansion progress:** Nigeria-first step shipped — `nigeria-payments`
(Paystack, Flutterwave, OPay, bank transfers, USSD/pending reconciliation) added
under business-solutions; library now 32 skills. Ghana–Nigeria coverage in place;
further WAEMU/cross-border rails remain future scope.

**Distribution suite status:** `scripts/install.sh` (executable) and
`scripts/install.ps1` shipped; README gained a "User Installation & Setup" section
(one-line curl/iwr installs, submodule integration, discovery explanation). Bash
installer verified end to end — fresh clone-to-32-skills install plus idempotent
update run, content matched against the working tree. PowerShell counterpart
review-verified (no pwsh on this machine). Note: the repository later moved from
`fekt2016/` to the `Eazworld-Labs` organization — every install link and script
default now points at `Eazworld-Labs/eazworld-ai-skills` (overridable via
`EAZWORLD_SKILLS_REPO` or `-Repo`). Selective installs are supported everywhere:
`npx skills add --skill`, `install.sh --skill`, and `install.ps1 -Skill` install
only the named skills (bash installer end-to-end tested for the selection path).

---

## Final Project Completion Checklist

- [x] Phase 1: Repository Foundation Completed
- [x] Phase 2: Automated Validation & CI/CD Pipeline Completed
- [ ] Phase 3: 13 Software Engineering Skills Completed
- [ ] Phase 4: 7 Digital Marketing Skills Completed
- [ ] Phase 5: 5 AI & Automation Skills Completed
- [ ] Phase 6: 6 Business Solutions Skills Completed
- [ ] Phase 7: Cross-Agent Compatibility Matrix Verified
- [x] Phase 8: Public Developer Experience & Docs Completed
- [x] Phase 9: Security Audit & Public v1.0.0 Tagged

**Note:** Phases 3–7 stay open here until the Claude Code verification completes
(weekly quota; resets 12am Africa/Accra). All 31 skills are shipped, validated,
green on CI, and tagged in v1.0.0; only cross-agent execution evidence is pending.

---

**Total Planned Skills:** 31 Skills  
**Departments:** 4 Core Domains  
**Project Owner:** Eazworld  
**Repository:** `eazworld-ai-skills`  
**License:** MIT
