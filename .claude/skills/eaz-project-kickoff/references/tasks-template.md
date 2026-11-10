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
4. **Before starting a task, invoke every skill named on it** (Skill tool) and follow it; if a
   named skill is unavailable, stop and say so.
5. Under each finished task add a `Skills used:` line. A task whose named skill was not invoked is
   `[?]` with the reason, never `[x]`.
6. New scope becomes a new task with its own criterion.

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
  - Done when: `DESIGN.md` has purpose, styling method, visual direction, icon set (family,
    style, and the list of icons needed, confirmed by the client), a Discovery
    section, an Inspiration table (or "none given"), the **full token set** (no empty row),
    a Contrast Check written by `check-contrast.cjs`, and the client's approval of the palette.
- [ ] **1.3 Specification** — *skill: eaz-project-kickoff*
  - Done when: `SPEC.md` has goal and non-goals, roles, key journeys, features with IDs,
    and an acceptance test for every Must feature (or `TBD` flagged as a blocker).
- [ ] **1.4 Architecture decision and ARCHITECTURE.md** — *skill: eaz-software-architecture*
  - Done when: an ADR records the chosen approach and rejected options, `ARCHITECTURE.md`
    describes the accepted stack and structure, and every Must feature maps to a component.
- [ ] **1.5 Core fields closed** — one job, one impression, primary action, stack, region
  - Done when: none are `TBD`, or the client approved building with them named as open.
- [ ] **1.6 First README and agent rules** — *skill: eaz-project-kickoff*
  - Done when: `README.md` (first version) exists and `CLAUDE.md` carries the rules block.

**Approval:** [?] Client approved Phase 1 — date: ____

---

## Phase 2 — Foundation (front end)

**Build order:** <!-- frontend-first (default) | backend-first | vertical slices — as chosen in
PROJECT.md. This template shows frontend-first. For backend-first, move 4.0, 4.0a, and the
backend half of each 4.x task into this phase, and have Phase 3 screens call the real API. -->

**Goal:** a project that builds and carries the design system, so the screens can be built and shown.

- [ ] **2.1 Scaffold and CI** — *skill: eaz-cloud-devops*
  - Done when: install, lint, type-check, and build commands pass, the folder structure
    matches `ARCHITECTURE.md`, and `README.md` lists the real run, test, and build commands.
- [ ] **2.1a API contract (draft)** *(if the project exposes an API)* — *skill: eaz-api-development*
  - Done when: `API.md` (or an OpenAPI file) lists every endpoint and response shape the Must
    screens need — the contract the mock data will follow.
- [ ] **2.1b Content inventory** *(content-heavy projects)* — *skill: eaz-project-kickoff*
  - Done when: `CONTENT.md` lists every page, its copy and media status, and who supplies it.
- [ ] **2.2 Tokens and theme** — *skill: eaz-frontend-design*
  - Done when: the theme matches the `DESIGN.md` token table name for name and value, contrast
    is verified by `check-contrast.cjs`, and the token check is clean.
- [ ] **2.3 Base components** — *skill: eaz-frontend-design*
  - Done when: buttons, inputs, and layout primitives exist with focus states.

---

## Phase 3 — Screens with mock data  ⛔ stop for approval

**Goal:** every launch screen exists, looks like the approved design, and can be clicked through —
using typed mock data that follows the API contract — so the client approves what they will
actually use before the backend is built.

- [ ] **3.1 Mock data layer** — *skill: eaz-frontend-design*
  - Done when: typed mock responses for every endpoint in `API.md` exist behind one data-access
    module, so a screen can switch from mock to real by changing that module only.
- [ ] **3.2 Screens and navigation** — *skill: eaz-frontend-design*
  - Done when: every launch screen works end to end on mock data, with loading, empty, error,
    and (where relevant) offline states, verified at 360 / 768 / 1440px.
- [ ] **3.3 URL structure** *(public sites)* — *skill: eaz-seo-engineering*
  - Done when: routes and slugs are agreed and listed.

**Approval:** [?] Client approved Phase 3 (the screens) — date: ____

---

## Phase 4 — Backend and wiring

**Goal:** real data and working features behind the approved screens.

- [ ] **4.0 Data model** *(if the project has a database)* — *skill: eaz-database-architecture*
  - Done when: migrations run up, down, and up on a real engine, and `DATA-MODEL.md`
    matches the schema.
- [ ] **4.0a Auth and roles** *(if the project has accounts)* — *skill: eaz-backend-engineering*
  - Done when: sign-in works, roles are enforced on the server with allow and deny tests, and
    sessions can be ended.
- [ ] **4.1 <feature>: backend and wiring** — *skill: <skill>* — **Delivers: F#** (from `SPEC.md`)
  - Done when: the endpoint matches `API.md`, the screen is switched from mock to the real API
    (the mock module is no longer used for it), and the acceptance test for F# passes,
    including loading, empty, and error states.
- [ ] **4.9 Mock data removed** — *skill: eaz-code-review*
  - Done when: no screen imports the mock module, and the contract tests pass against the real API.

---

## Phase 5 — Polish & quality  ⛔ stop for approval

**Goal:** ready for a launch decision.

- [ ] **5.1 Accessibility pass** — *skill: eaz-frontend-design*
  - Done when: keyboard path and screen-reader check pass on every page.
- [ ] **5.2 Token check** — *skill: eaz-frontend-design*
  - Done when: `check-tokens.cjs` is clean, or each hit is justified.
- [ ] **5.3 Performance** — *skill: eaz-frontend-design/references/performance-optimization.md*
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
- [ ] **6.4 Runbook** — *skill: eaz-cloud-devops*
  - Done when: `RUNBOOK.md` is written from the real setup and checked by someone other
    than its author.
- [ ] **6.5 Client handoff** — *skill: eaz-project-kickoff*
  - Done when: `HANDOFF.md` is complete, and the client has access, documentation, and a
    change process.
- [ ] **6.6 Changelog**
  - Done when: `CHANGELOG.md` records the first release.

**Approval:** [?] Final sign-off — date: ____
