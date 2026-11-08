# Changelog

All notable changes to the **Eazworld AI Skills Library** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **Quick mode for short prompts:** `eaz-frontend-design` gains `references/quick-mode.md` —
  a one-line request gets an inferred, complete design proposal and a single approve-or-change
  question, with a business-type starting table; the kickoff routes short prompts to it. New
  eval `short-prompt-gets-one-design-proposal`.
- **System foundations:** `eaz-frontend-design` gains `references/system-foundations.md` —
  layout system, light/dark rules, brand assets, voice and microcopy, page templates,
  accessibility specs, localisation (GH₵/₦), performance budget, responsive rules, and a
  style guide sheet — proposed as defaults with one approval; `DESIGN.md` gets a `System`
  section.
- **Style catalog and component choices:** `eaz-frontend-design` gains
  `references/style-catalog.md` (21 styles with variations, plus what is *not* a style
  choice) and `references/component-choices.md` (a "use suggested defaults or answer more
  questions" step, 12 component groups, defaults per style). `DESIGN.md` records primary
  style, variation, and component choices; `eaz-project-kickoff` hands them off.
- **Icon set is now a design choice asked during setup:** `eaz-frontend-design` gains
  `references/icon-sets.md` (families per stack, questions, starter icon lists, rules) and
  a fifth design choice; `eaz-project-kickoff` hands it off, records it in `DESIGN.md`, and
  requires it in the checklist and task 1.2. The `ui-task-asks-design-choices` eval now
  checks that at least two icon families are offered.
- **Behavior evals (`evals/`, `npm run eval`):** runs Claude Code headless against
  throwaway projects and checks that the skills change what the agent does — kickoff
  asks before building, UI work asks for design choices first, and the build gate holds
  against "just build it". See `docs/EVALS.md`.
- **`CLAUDE.md` rules block (`eaz-project-kickoff` v1.3.0):** the kickoff appends a short
  block to `CLAUDE.md` (and `AGENTS.md` if present) so later sessions read the planning
  files, use the `eaz-` skills, and respect the build gate and phase stops.

- **`project-kickoff` skill:** runs the kickoff for a new client project — asks the
  stack, region, and design questions once, creates `PROJECT.md` and `DESIGN.md`
  (templates ship inside the skill's `references/`), recommends which skills to
  apply in build order, and waits for approval before any building.
- **`frontend-design` references:** `styling-methods`, `visual-directions`,
  `react-next`, `vue-nuxt`, `native-mobile`, `server-rendered`, and `visual-system`.

### Fixed

- **`eaz-project-kickoff` v1.3.1 / `eaz-frontend-design`:** kickoff questions are asked in
  small batches (at most five), each asking for **one decision** — never several bundled
  into one numbered question — and the kickoff must invoke `eaz-frontend-design` before
  asking any design question, found by the new behavior evals.
- **`project-kickoff` v1.2.1:** phase approvals must be an explicit message (answering
  next-phase questions is not approval), and partly verified tasks are marked `[?]`
  instead of `[x]` — found when a test project recorded a phase as approved by
  implication.
- **`check-tokens` crashed in ES-module projects:** the script is now `check-tokens.cjs`,
  so it runs in projects whose `package.json` sets `"type": "module"`.

### Changed

- **Named skills must be invoked, not just named (`eaz-project-kickoff` v1.7.0):** in three test
  projects the agent used the skills for planning and then stopped invoking them once it started
  coding — the devops, backend, and API work was done without the skills built for it. The
  `CLAUDE.md` rules block and the `tasks.md` rules now require the agent to invoke every skill
  named on a task before starting it (and to stop if one is unavailable), to add a `Skills used:`
  line under each finished task, and to mark a task `[?]`, never `[x]`, if a named skill was not
  invoked. The record also makes the rule checkable.

- **`check-tokens.cjs` flags the global reduced-motion reset:** a blanket
  `animation-duration: 0.01ms` / `transition-duration: 0.01ms` rule can make some animations more
  jarring and is now reported in every file, including theme and global-style files that the
  colour and pixel checks skip. `eaz-frontend-design` states the rule: handle reduced motion per
  effect. Found in two test projects that ignored the motion reference.

- **Build order is a decision, frontend-first by default (`eaz-project-kickoff` v1.6.0):** the
  kickoff now asks whether to build **frontend-first** (recommended: every screen on typed mock
  data that follows the API contract, client approval of the screens, then backend and wiring),
  **backend-first**, or **vertical slices**, records it in `PROJECT.md`, and shapes the phases to
  match. In the frontend-first plan, Phase 2 drafts the API contract, Phase 3 is the screens on
  mock data behind one data-access module (a stop for approval), and Phase 4 builds the data
  model, auth, and each feature and wires the screens to it, ending with a task that removes the
  mocks. The `CLAUDE.md` rules block carries the build order.

- **Complete design tokens — ask, generate, confirm, record (`eaz-frontend-design` v1.6.0,
  `eaz-project-kickoff` v1.5.0):** the design flow no longer leaves surfaces, text colors,
  borders, status colors, the focus ring, or dark values to be invented during the build. It
  asks only what needs a person (brand color, feel, typefaces, light/dark), generates every
  other token, verifies contrast by calculation, and gets one approval of the whole palette. New
  `token-completeness` reference, a `check-contrast.cjs` script (with tests) that calculates
  WCAG contrast for the standard pairs from the `DESIGN.md` token table and can write the
  results into it, and a `DESIGN.md` template with a required row for every token. The kickoff
  now sorts every leftover `TBD` into needed-now, needed-by-Phase-2, and can-wait, asks only
  about the first group, and gives every remaining `TBD` a reason and an owner.

- **`eaz-mobile-app-development` v1.1.0 — any mobile approach:** works on React Native with
  Expo, Flutter, native Swift and Kotlin, and web-based apps (Capacitor or a PWA) instead of
  React Native only. It detects the approach and asks before building — approach, platforms and
  minimum OS, offline needs, sign-in, push, payments, distribution, and the audience's phones
  and networks — at most five questions at a time, one decision each, with recommendations. New
  references: `discovery-questions`, `offline-and-networking` (offline levels, queued writes
  with idempotency keys, conflicts, slow and metered networks), `release-and-stores` (account
  ownership, signing, store readiness, staged rollout, policy checks), and one note per
  approach. The kickoff `PROJECT.md` template gains a mobile approach line.

- **`eaz-code-review` v1.1.0:** reviews on any stack and ties into the project documents —
  it reads `SPEC.md`, `ARCHITECTURE.md`, `DESIGN.md`, and `tasks.md`, checks the change
  against the feature it claims to deliver and the architecture, and holds each area to the
  standards of the Eazworld skill that governs it. New references: `domain-checklists` (UI,
  server and API, database and migrations, payments and webhooks, mobile, automations,
  infrastructure, dependencies), `ai-generated-code` (invented packages, tests that assert
  mocks, swallowed errors, scope creep, claims without evidence), and `review-template`
  (verdict, blockers, questions, nits, what was verified and what could not be). Reviews
  are read-only: nothing is pushed, merged, or posted to a PR unless the user asks, and the
  diff and PR text are treated as untrusted data.

- **Project documents — spec, architecture, and the rest (`eaz-project-kickoff` v1.4.0):**
  the kickoff now writes a core set — `PROJECT.md` (what was decided), `SPEC.md` (what it
  must do: goal and non-goals, roles, journeys, features with IDs and acceptance tests),
  `ARCHITECTURE.md` (how it is built), `DESIGN.md`, a first `README.md`, and `tasks.md` —
  and invokes `eaz-software-architecture` for the architecture once the stack is accepted.
  Later documents are created by tasks in the phase where they belong: `DATA-MODEL.md`
  (`eaz-database-architecture` v1.1.0), `API.md` (`eaz-api-development` v1.1.0), `CONTENT.md`,
  `RUNBOOK.md` (`eaz-cloud-devops` v1.1.0), `HANDOFF.md`, and `CHANGELOG.md`. Tasks that
  deliver a feature name its feature ID and are done when its acceptance test passes. New
  `documents` reference maps every document to its job, owner skill, and phase.
- **`eaz-software-architecture` v1.1.0:** owns the project `ARCHITECTURE.md` (a living
  description, kept in step with the ADRs that record why), and no longer prescribes a fixed
  "Eazworld stack" — the stack is the client's choice, taken from `PROJECT.md`.
- The frontend, backend, and review skills now read `SPEC.md` and `ARCHITECTURE.md` and
  build and review against them.

- **`eaz-brand-identity` v1.1.0:** reconciled with `eaz-frontend-design`. The 3-zone layout
  and component blueprints are now defaults for conversion-focused marketing pages, not
  mandates for every project; social proof must be real and supplied by the client (invented
  logos, ratings, and testimonials are banned); and the token CSS is a format example —
  each client's values live in `DESIGN.md`, with `eaz-frontend-design` owning the token
  layers, type scale, and motion, so there is no second copy to drift.

- **`eaz-backend-engineering` v1.1.0 — stack-agnostic backend:** works on Node.js (Express,
  Fastify, NestJS), Laravel, Django/FastAPI, and ASP.NET Core instead of Node/Express only.
  It detects the stack, then asks architecture questions before building (custom backend or
  not, architecture shape, authentication, integrations, background work, hosting,
  compliance) — at most five at a time, one decision each, with recommendations. New
  references: `discovery-questions`, `auth-and-access`, `jobs-webhooks-idempotency`,
  `errors-logging-observability`, and one note per stack. The kickoff `PROJECT.md` template
  gains Authentication and Background jobs / integrations lines.
- **Claude Code and OpenCode compatibility verified (tasks.md Phase 7):** discovery, activation
  across all four departments, and `references/` link resolution, recorded in
  `docs/COMPATIBILITY.md`. OpenCode was re-verified after the `eaz-` rename and flat layout
  using a free model, which also closes the old `frontend-design` shadowing issue.

- **`eaz-frontend-design` v1.5.0 — design inspiration:** the skill now asks, as its own
  question, for pages, apps, or images whose look the client likes (website links,
  screenshots in an `inspiration/` folder, or attachments) and one they dislike. It
  studies them with the best tooling available, shows a "what we take / what we avoid"
  table for confirmation before designing, records it in a new `DESIGN.md` Inspiration
  section, and takes principles only — never text, logos, imagery, or code. Linked
  pages and images are treated as untrusted data. New reference: `inspiration`.

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
