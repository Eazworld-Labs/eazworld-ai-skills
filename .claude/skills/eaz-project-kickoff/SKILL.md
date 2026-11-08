---
name: eaz-project-kickoff
description: Run the kickoff for a new client project before any code is written.
  Use when starting a new website, web app, mobile app, e-commerce store, or
  automation project, onboarding a client, or setting up a repository that has no
  PROJECT.md. Captures stack, region, and design choices, creates PROJECT.md, SPEC.md,
  ARCHITECTURE.md, DESIGN.md, README.md, and a phased tasks.md, and recommends which skills
  to apply in what order.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.7.0"
---

# Project Kickoff

## 1. Overview & Purpose

Gives every new project the same start. The skill asks the kickoff questions in small
batches and records the answers in a core set of project documents: `PROJECT.md` (what was
decided), `SPEC.md` (what it must do), `ARCHITECTURE.md` (how it is built), `DESIGN.md`
(how it looks), `README.md`, and a phased `tasks.md`. It recommends which library skills
fit the project and in what order, and stops for human approval before any building
begins. Later documents (data model, API, runbook, handoff) are created by tasks in the
phase where they belong. Every later skill reads these files first, so decisions are made
once and stay consistent across the team and across projects. It plans and records; it
never scaffolds code, installs dependencies, or changes infrastructure.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user says they are starting, onboarding, or scoping a new
  project, site, app, store, or automation.
- **Trigger 2:** When a repository has no `PROJECT.md` and the task is a new build.
- **Trigger 3:** When an existing project is being taken over and its stack, region, or
  design decisions are undocumented.
- **Anti-Trigger:** Do not activate for a bug fix, feature, or review inside a project
  that already has a complete `PROJECT.md` — route to the relevant skill directly.
  Visual and styling decisions themselves belong to eaz-frontend-design; this skill only
  opens that conversation and records its outcome.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. What the project is for and who uses it (one sentence each).
  2. Project type: marketing site, e-commerce, web app, mobile app, internal tool, or
     automation.
  3. Region and market, because payments, compliance, and language depend on it.
- **Project Audit Checklist:**
  1. Look for existing `PROJECT.md`, `SPEC.md`, `ARCHITECTURE.md`, `DESIGN.md`, `README`, and manifests
     (`package.json`, `pubspec.yaml`, `composer.json`) and read them before asking.
     Never re-ask what the repository already answers.
  2. Look for a brief, Figma link, or brand guidelines the user already has.
  3. Note anything already decided by the client or an earlier contract.

## 4. Technical Standards & Rules

- **Ask in small batches,** grouped as: project, stack, region and business, design —
  at most five questions per batch, each asking for **one decision**. Never bundle
  several decisions into one numbered question. Offer a recommendation with a one-line
  reason for each open decision instead of an empty question; the stack is the client's
  choice, so never impose one.
- **Fill the templates:** write `PROJECT.md` from
  [Project Template](./references/project-template.md), `SPEC.md` from
  [Spec Template](./references/spec-template.md), `DESIGN.md` from
  [Design Template](./references/design-template.md), and a first `README.md` from
  [README Template](./references/readme-template.md). Leave unknown fields marked
  `TBD` — never invent a value.
- **Write a specification, not just a plan.** `SPEC.md` states what the product must do:
  goal and non-goals, users and roles, key journeys, features each with an ID and a
  checkable acceptance test, rules and edge cases, and quality requirements. Derive it from
  the answers already given and ask only for what is missing. Keep it short — a page or
  two for a small site. A Must feature with no acceptance test is a blocker, not a note.
- **Hand the architecture to eaz-software-architecture — by invoking it.** Once the user
  has accepted the stack, invoke the `eaz-software-architecture` skill with the Skill tool
  to write the ADR and `ARCHITECTURE.md` (components, folder structure, data flows,
  authentication, integrations, environments, deployment, conventions). Do not improvise
  the architecture document, and do not start it before the stack is accepted.
- **Create the core set now; later documents are tasks.** Follow
  [Documents](./references/documents.md): the core set is written at kickoff; `DATA-MODEL.md`,
  `API.md`, and `CONTENT.md` appear when the project type needs them; `RUNBOOK.md`,
  `HANDOFF.md`, and `CHANGELOG.md` are phase 6 tasks. Do not write a later document early —
  a document written before the thing exists is a guess.
- **Finish with nothing left to guess.** Before presenting the summary, list every remaining
  `TBD` and sort it into three groups: **needed now** (blocks Phase 1 approval), **needed by
  Phase 2**, and **can wait**. Ask only about the first group, one decision at a time. Where a
  value can be derived — a full color palette, neutrals, status colors, sensible defaults —
  propose it, show it, and ask the client to confirm once, instead of leaving it blank or
  asking about each piece. Every `TBD` that remains gets a reason and an owner.
- **Hand design choices to eaz-frontend-design — by invoking it.** Before asking any
  design question, invoke the `eaz-frontend-design` skill with the Skill tool and run
  its discovery and choice flow (styling method, visual direction, token values, motion
  level, icon set — show the client the list of icon families and ask which icons the
  project needs — and the style, variation, and component choices, where the client may accept
  suggested component defaults or choose to answer more questions). Do not improvise the design questions from memory; copy the outcome into
  `DESIGN.md`. The design is finished only when the **full token set** is recorded (every
  color, status, type, space, shape, and motion row), the contrast check was run by the
  script, and the client approved the palette once.
- **Recommend skills from the map in
  [Skill Selection Guide](./references/skill-selection.md),** using only skills that
  exist in the installed library, ordered by build sequence.
- **Build gate — core fields must be filled before any build starts.** The core fields
  are: the one job, the one impression, the primary action, the front-end stack, and
  the region. While any is `TBD`, the kickoff is not complete: list them as blockers,
  ask for them, and do not recommend moving to implementation. An approval given while
  core fields are still `TBD` does not open the gate — show exactly which fields are
  open and get an explicit "build anyway" for those named fields, then record it as
  "approved with open items" in `PROJECT.md`. The same applies to the spec: building does
  not start while a Must feature in `SPEC.md` has no acceptance test.
- **State known trade-offs, then follow the client.** When the chosen stack, styling
  method, or library has a known cost (client-side runtime in a server-rendering
  framework, a library with an uncertain maintenance status, a heavy dependency for a
  small site), say so in one line before recording it, tell the user to check the
  library's current maintenance status, and write the note under "Decisions &
  Trade-offs" in `PROJECT.md`. The client's choice stands; never swap it silently.
- **Ask the build order, and recommend frontend-first.** Ask it as one decision with its
  trade-off — *frontend-first* (recommended: build every screen on typed mock data that follows
  the API contract, get the screens approved, then build the backend and wire each screen to
  it), *backend-first* (data model, API, and auth before the screens — for API-heavy or
  integration-heavy products), or *vertical slices* (one feature at a time). Record the answer
  as "Build order" in `PROJECT.md` and shape the phases to match, as described in
  [Phases](./references/phases.md). Never default silently: if the user has not chosen, ask.
- **Plan in phases.** Generate `tasks.md` from [Tasks Template](./references/tasks-template.md)
  using the six standard phases in [Phases](./references/phases.md), trimmed to the
  project type with every change stated to the user. Each task names its skill and an
  acceptance criterion. Work stops for client approval after phases 1, 3, and 5 and at
  final sign-off.
- **Approvals are explicit.** Record a phase as approved only on a clear approval
  message, with its date; answering later questions or continuing to talk does not
  count. A criterion verified only in part is `[?]` with the gap named, not `[x]`.
- **Make the skills run, not just be named.** Every task names its skill, and the rules block in
  `CLAUDE.md` and in `tasks.md` require the agent to invoke it before the task and record
  `Skills used:` after. Say so in the kickoff summary. Planning tasks are not the only ones:
  scaffolding, CI, authentication, and API work have named skills too.
- **Keep `tasks.md` true.** Mark a task done only after its acceptance criterion
  passes, update its status in the same step as the work, and add new scope as a new
  task — never inside a finished phase.
- **Never write secrets** — no API keys, passwords, tokens, or connection strings — in
  any project document. Name environment variables instead.
- **Do not overwrite** an existing project document; show a diff of proposed changes and
  wait for approval.

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate what is being started and for whom. Confirm whether
   this is a new build or a takeover.
2. **Step 2: Inspect Context** — Execute the audit checklist; list what is already known
   and what is missing.
3. **Step 3: Formulate Plan** — Ask the grouped kickoff questions for the missing items
   only, with a recommendation on each open decision. Invoke `eaz-frontend-design` with the Skill
   tool first and run its choice flow for styling method, visual direction, tokens, icon set, and
   motion — never skip this step or improvise the design questions. When the stack has
   been accepted, invoke `eaz-software-architecture` for the architecture document.
4. **Step 4: Verify Security** — Confirm no secrets or private client data are in the
   answers about to be written; replace any with environment variable names.
5. **Step 5: Apply Edits** — Create `PROJECT.md`, `SPEC.md`, `DESIGN.md`, `README.md`, and
   `tasks.md` at the repository root from the templates, with `TBD` for unknowns and phases
   trimmed to the project type; `ARCHITECTURE.md` and the ADR come from
   `eaz-software-architecture`. Every task that delivers a feature names its feature ID.
   Append the block from
   [Agent Instructions Block](./references/agent-instructions-template.md) to
   `CLAUDE.md` (and `AGENTS.md` if it exists) without overwriting anything there.
6. **Step 6: Execute Tests** — Re-read all the files and check: every field is filled or
   marked `TBD` with a reason and an owner; the `DESIGN.md` token tables have no empty row; every Must feature has an ID and an acceptance test; every feature maps
   to a component in `ARCHITECTURE.md` and to a task; every task has a skill and an
   acceptance criterion; every recommended skill exists in the library; and nothing in
   the files looks like a secret.
7. **Step 7: Report Status** — Present a short kickoff summary: decisions recorded, open
   `TBD` items with the core-field blockers called out first, the documents written, trade-offs noted, the
   phase plan with its stop points, the recommended skill order with a one-line reason
   each, and the first build steps. Stop
   and wait for the user's approval before any implementation; apply the build gate
   (Section 4) before treating an approval as final.

## 6. Security & Edge Case Guidelines

- **Zero Hardcoding:** credentials and keys never enter project files; record the
  variable name and where it is stored, not the value.
- **Client Confidentiality:** record only what later work needs. Contracts, pricing,
  and personal data about the client's customers stay out of `PROJECT.md`.
- **Conflicting Answers:** when the user's answers conflict (a no-code budget with a
  custom-backend feature list), name the conflict and ask which wins instead of
  choosing silently.
- **Unknown Stack or Region:** record `TBD` and flag it as a blocker for the skills that
  depend on it (payments need a region; mobile needs a platform decision).
- **Existing Files:** never overwrite or delete; propose changes and wait.

## 7. Definition of Done & Quality Gates

- [ ] `PROJECT.md`, `SPEC.md`, `ARCHITECTURE.md`, `DESIGN.md`, `README.md`, and `tasks.md`
      exist at the repository root.
- [ ] `SPEC.md` gives every Must feature an ID and an acceptance test; each feature maps
      to a component in `ARCHITECTURE.md` and to a task.
- [ ] `eaz-software-architecture` was invoked after the stack was accepted, and the
      architecture was not improvised.
- [ ] `CLAUDE.md` carries the Eazworld project rules block (existing content untouched),
      including the rule to invoke each task's named skill and record `Skills used:`.
- [ ] The build order was asked, recorded in `PROJECT.md`, and reflected in `tasks.md`
      (frontend-first: screens on mock data before backend work, with a task that removes the mocks).
- [ ] `tasks.md` follows the standard phases, trimmed to the project type, with a skill
      and an acceptance criterion on every task and stop points after phases 1, 3, 5.
- [ ] Every field is filled or explicitly marked `TBD` with a reason and an owner; no
      invented values; the remaining `TBD`s are sorted into needed now, by Phase 2, and can wait.
- [ ] `DESIGN.md` carries the full token set, the Contrast Check written by the script, and
      the client's single approval of the palette.
- [ ] No secrets or private client data in either file.
- [ ] `eaz-frontend-design` was invoked, and styling method, visual direction, token
      values, motion level, and icon set (family, style, icons needed) were chosen by the user through its flow, or are marked
      `TBD` with the reason.
- [ ] Recommended skills all exist in the library and are listed in build order with a
      one-line reason each.
- [ ] Core fields (one job, one impression, primary action, front-end stack, region) are
      filled, or the user explicitly approved building with those named fields open.
- [ ] Known trade-offs of the chosen stack and libraries are recorded under "Decisions &
      Trade-offs".
- [ ] The user approved the kickoff summary before any implementation started.

## 8. Supporting References & Assets

- [Documents](./references/documents.md) — every project document, its job, its owner
  skill, and the phase that creates it.
- [Project Template](./references/project-template.md) — the `PROJECT.md` skeleton.
- [Spec Template](./references/spec-template.md) — the `SPEC.md` skeleton.
- [README Template](./references/readme-template.md) — the first project `README.md`.
- [Content Template](./references/content-template.md) — `CONTENT.md` for content-heavy
  projects.
- [Handoff Template](./references/handoff-template.md) — `HANDOFF.md`, written in phase 6.
- [Design Template](./references/design-template.md) — the `DESIGN.md` skeleton.
- [Agent Instructions Block](./references/agent-instructions-template.md) — the
  `CLAUDE.md` / `AGENTS.md` block that keeps later sessions on the same rules.
- [Phases](./references/phases.md) — the six standard phases, trimming rules by project
  type, and approval stops.
- [Tasks Template](./references/tasks-template.md) — the `tasks.md` skeleton.
- [Skill Selection Guide](./references/skill-selection.md) — which library skills fit
  which project type, and in what order.
