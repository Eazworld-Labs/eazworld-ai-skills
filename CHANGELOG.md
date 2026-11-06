# Changelog

All notable changes to the **Eazworld AI Skills Library** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **`project-kickoff` skill:** runs the kickoff for a new client project — asks the
  stack, region, and design questions once, creates `PROJECT.md` and `DESIGN.md`
  (templates ship inside the skill's `references/`), recommends which skills to
  apply in build order, and waits for approval before any building.
- **`frontend-design` references:** `styling-methods`, `visual-directions`,
  `react-next`, `vue-nuxt`, `native-mobile`, `server-rendered`, and `visual-system`.

### Fixed

- **`project-kickoff` v1.2.1:** phase approvals must be an explicit message (answering
  next-phase questions is not approval), and partly verified tasks are marked `[?]`
  instead of `[x]` — found when a test project recorded a phase as approved by
  implication.
- **`check-tokens` crashed in ES-module projects:** the script is now `check-tokens.cjs`,
  so it runs in projects whose `package.json` sets `"type": "module"`.

### Changed

- **All skills renamed with an `eaz-` prefix (breaking):** `frontend-design` is now
  `eaz-frontend-design`, and likewise for all 33 skills. Agents give a user's personal
  skills priority over project skills of the same name, so plain names such as
  `frontend-design` and `security-audit` were silently shadowed on machines that already
  had a skill with that name. The validator now requires the prefix (`skill-prefix`);
  the shell installers accept short names (`--skill nigeria-payments`) and print any
  leftover un-prefixed copies from older installs. Update any `--skill` flags and
  prompts that use the old names.

- **`frontend-design` v1.4.0 — modern design and motion:**
  - New references: `motion-and-animation` (motion levels none/subtle/expressive, motion
    tokens, CSS-first patterns with browser support checked on 2026-11-06, libraries per
    stack, reduced-motion rules, motion QA), `modern-css` (support policy, container
    queries, fluid type, `light-dark()` theming, color pitfalls), and `design-quality`
    (avoiding the generic look, one signature element, hierarchy, state design, visual
    QA procedure and rubric).
  - `visual-directions` gains a recipe per direction (type pairing, layout pattern,
    component feel, motion default); `visual-system` gains motion and theme tokens; the
    stack notes gain animation guidance; motion level becomes a fourth design choice and
    visual QA a workflow step and Definition of Done item.
  - `check-tokens.cjs` also flags raw animation durations, and now has tests.

- **`project-kickoff` v1.2.0:** generates a phased `tasks.md` (six standard phases,
  trimmed per project type, each task with a skill and an acceptance criterion, approval
  stops after phases 1, 3, and 5) from new `phases` and `tasks-template` references; the
  `DESIGN.md` template gains a Discovery section.
- **`frontend-design` v1.3.0:** adds `discovery-questions` — grouped questions by project
  type, at most five at a time with recommended answers — and keeps `tasks.md` statuses
  current as work completes.

- **`project-kickoff` v1.1.0:** adds a build gate (the one job, impression, primary
  action, stack, and region must be filled before building; an approval with core fields
  still `TBD` must name them and be confirmed) and records known trade-offs of the
  chosen stack under a new "Decisions & Trade-offs" section of `PROJECT.md`.
- **`frontend-design` v1.2.0:** adds `scripts/check-tokens.cjs`, a zero-dependency scan
  for raw colors and off-grid pixel values outside token files, wired into the
  execution workflow and Definition of Done; asks for missing purpose fields instead of
  building on guesses.

- **Flat skill layout (breaking for manual copies):** skills now live at
  `.claude/skills/<skill-name>/SKILL.md`. Agents only discover skills one level deep,
  so the previous `<department>/<skill>` nesting meant a manual copy was never picked
  up. The department is now `metadata.department` in each skill's frontmatter. The
  validator requires that field and rejects nested skills (`nested-skill`); both
  installers copy skill folders individually, never delete skills you added yourself,
  and point out leftover department folders from older installs.

- **`frontend-design` v1.1.0:** stack-agnostic core with stack detection; asks the user
  to choose styling method, visual direction, and token values before building. The
  visual system moved to a reference file and is now a default, not a mandate.

- **`nigeria-payments` skill:** Nigerian rails — Paystack, Flutterwave, OPay, and
  bank transfers — with kobo-denominated charges, per-provider timing-safe webhook
  verification, USSD and transfer pending states with reconciliation, and
  role-gated refunds (Phase 10, Nigeria-first regional fintech expansion).

---

## [1.0.0] - 2026-11-05

### Added

- **Foundational Architecture Suite (`docs/ARCHITECTURE.md`):** Established core principles,
  Single Source of Truth (SSOT) repository layout, progressive disclosure models, and
  cross-agent interoperability guidelines.
- **Engineering Standards (`docs/ENGINEERING_STANDARDS.md` v2.0.0):** Defined rigorous
  coding rules, file inspection protocols, and behavioral guardrails for AI coding agents.
- **Skill Authoring Guide (`docs/SKILL_AUTHORING_GUIDE.md`):** Standardized the 7 mandatory
  Markdown sections, YAML frontmatter schemas, naming conventions (kebab-case), and quality
  matrices.
- **Agent Compatibility Matrix (`docs/COMPATIBILITY.md`):** Recorded native skill
  discovery, activation, and reference-link test outcomes with runner versions across
  **Claude Code** and **OpenCode**, without code duplication.
- **Security Policy (`docs/SECURITY_POLICY.md`):** Enforced zero-hardcoding rules,
  zero-trust patterns, OWASP Top 10 defense, and secret isolation.
- **Development Roadmap (`docs/ROADMAP.md`):** Outlined the 31 planned skills across 4 core
  departments (Software Engineering, Digital Marketing, AI & Automation, Business
  Solutions) and execution phases.
- **Task Management Tracking (`tasks.md`):** Established tracking procedures and acceptance
  criteria across all implementation phases.
- **Project Specification (`PROJECT_SPEC.md`):** Documented ecosystem scope, target tech
  stack, and versioning rules.
- **Software Engineering Skills (13):** architecture, frontend, backend, databases, APIs,
  security auditing, testing, code review, e-commerce, mobile, performance, SEO
  engineering, and cloud DevOps — each with triggers, audit checklists, workflows,
  security guardrails, and a Definition of Done.
- **Digital Marketing Skills (7):** SEO strategy, Google Ads, Meta Ads, social media
  management, brand identity, email marketing, and conversion optimization.
- **AI & Automation Skills (5):** agent development, n8n workflows, WhatsApp automation,
  chatbot development, and CRM automation — with retry, idempotency, and
  environment-isolation patterns throughout.
- **Business Solutions Skills (6):** school and church management, POS and inventory,
  restaurant operations, booking systems, and Ghana payments (Paystack, Hubtel, Mobile
  Money) — RBAC, audit logging, callback verification, and offline-first guidance.
- **Validation Tooling (`scripts/validate-skills.js`):** Automated linter for YAML
  frontmatter, kebab-case naming, the 7 mandatory sections, reference-link integrity,
  and secret scanning — with a Node test suite (`npm test`).
- **Governance & CI/CD Templates:** Pull request and issue templates under `.github/`,
  plus the `lint-skills` GitHub Actions workflow gating every push and pull request on
  Node 24.
- **Developer Experience Documentation:** Per-agent installation steps in `README.md`,
  a step-by-step skill creation guide in `CONTRIBUTING.md`, and
  `docs/TROUBLESHOOTING.md` with troubleshooting and FAQ.
- **Open Source Licensing:** Added the permissive **MIT License**.

---

*Maintained by Eazworld*
