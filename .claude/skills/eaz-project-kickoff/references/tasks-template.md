# tasks.md

Copy this file to the root of a client project as `tasks.md`. `eaz-project-kickoff`
generates it from the phases in [Phases](./phases.md), trimmed to the project type.
Agents update statuses as work completes. Never put secrets in this file.

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done — acceptance criterion passed
- `[!]` Blocked — name the blocker
- `[?]` Needs review or client approval

## Rules

1. Work phases in order; do not start a phase before the previous one is approved at its
   stop point.
2. Mark a task `[x]` only after its acceptance criterion passes.
3. Update this file in the same step as the work.
4. New scope becomes a new task with its own criterion.

## Project

- **Name:**
- **Type:**
- **Current phase:** 1 — Discovery
- **Open blockers:** <!-- core fields still TBD, missing content, pending client answers -->

---

## Phase 1 — Discovery  ⛔ stop for approval

**Goal:** answers gathered and core fields filled.

- [ ] **1.1 Kickoff questions answered** — *skill: eaz-project-kickoff*
  - Done when: `PROJECT.md` written; every field filled or marked `TBD`.
- [ ] **1.2 Design discovery and choices** — *skill: eaz-frontend-design*
  - Done when: `DESIGN.md` has purpose, styling method, visual direction, tokens, and a
    Discovery section.
- [ ] **1.3 Architecture decision** — *skill: eaz-software-architecture*
  - Done when: an ADR records the chosen approach and rejected options.
- [ ] **1.4 Core fields closed** — one job, one impression, primary action, stack, region
  - Done when: none are `TBD`, or the client approved building with them named as open.

**Approval:** [?] Client approved Phase 1 — date: ____

---

## Phase 2 — Foundation

**Goal:** a project that builds and carries the design system.

- [ ] **2.1 Scaffold and CI** — *skill: eaz-cloud-devops*
  - Done when: install, lint, type-check, and build commands pass.
- [ ] **2.2 Tokens and theme** — *skill: eaz-frontend-design*
  - Done when: tokens defined once; contrast verified at 4.5:1; token check clean.
- [ ] **2.3 Base components** — *skill: eaz-frontend-design*
  - Done when: buttons, inputs, and layout primitives exist with focus states.

---

## Phase 3 — Layout & structure  ⛔ stop for approval

**Goal:** the skeleton of every page, with placeholder content.

- [ ] **3.1 Page templates and navigation** — *skill: eaz-frontend-design*
  - Done when: every launch page has a template, verified at 360 / 768 / 1440px.
- [ ] **3.2 URL structure** — *skill: eaz-seo-engineering*
  - Done when: routes and slugs are agreed and listed.

**Approval:** [?] Client approved Phase 3 — date: ____

---

## Phase 4 — Pages & features

**Goal:** real content and working features.

- [ ] **4.1 <page or feature>** — *skill: <skill>*
  - Done when: <check, including loading, empty, and error states>

---

## Phase 5 — Polish & quality  ⛔ stop for approval

**Goal:** ready for a launch decision.

- [ ] **5.1 Accessibility pass** — *skill: eaz-frontend-design*
  - Done when: keyboard path and screen-reader check pass on every page.
- [ ] **5.2 Token check** — *skill: eaz-frontend-design*
  - Done when: `check-tokens.cjs` is clean, or each hit is justified.
- [ ] **5.3 Performance** — *skill: eaz-performance-optimization*
  - Done when: Core Web Vitals targets agreed in discovery are met.
- [ ] **5.4 Tests and review** — *skill: eaz-software-testing, eaz-code-review*
  - Done when: suite passes and open review findings are resolved.

**Approval:** [?] Client approved Phase 5 — date: ____

---

## Phase 6 — Launch & handoff

- [ ] **6.1 SEO setup** — *skill: eaz-seo-engineering*
  - Done when: metadata, sitemap, and structured data verified.
- [ ] **6.2 Security review** — *skill: eaz-security-audit*
  - Done when: no open high-severity findings; no secrets in the repository.
- [ ] **6.3 Deploy** — *skill: eaz-cloud-devops* (needs explicit human confirmation)
  - Done when: production is live, with monitoring and a rollback path.
- [ ] **6.4 Client handoff**
  - Done when: client has access, documentation, and a change process.

**Approval:** [?] Final sign-off — date: ____
