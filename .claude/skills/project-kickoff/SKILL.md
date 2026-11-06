---
name: project-kickoff
description: Run the kickoff for a new client project before any code is written.
  Use when starting a new website, web app, mobile app, e-commerce store, or
  automation project, onboarding a client, or setting up a repository that has no
  PROJECT.md. Captures stack, region, and design choices, creates PROJECT.md,
  DESIGN.md, and a phased tasks.md, and recommends which skills to apply in what order.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.2.1"
---

# Project Kickoff

## 1. Overview & Purpose

Gives every new project the same start. The skill asks the kickoff questions once,
records the answers in `PROJECT.md` and `DESIGN.md`, breaks the work into approved
phases in a `tasks.md`, recommends which library skills fit the project and in what
order, and stops for human approval before any building begins. Every later skill reads those two files first, so decisions are made once and
stay consistent across the team and across projects. It plans and records; it never
scaffolds code, installs dependencies, or changes infrastructure.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user says they are starting, onboarding, or scoping a new
  project, site, app, store, or automation.
- **Trigger 2:** When a repository has no `PROJECT.md` and the task is a new build.
- **Trigger 3:** When an existing project is being taken over and its stack, region, or
  design decisions are undocumented.
- **Anti-Trigger:** Do not activate for a bug fix, feature, or review inside a project
  that already has a complete `PROJECT.md` — route to the relevant skill directly.
  Visual and styling decisions themselves belong to frontend-design; this skill only
  opens that conversation and records its outcome.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. What the project is for and who uses it (one sentence each).
  2. Project type: marketing site, e-commerce, web app, mobile app, internal tool, or
     automation.
  3. Region and market, because payments, compliance, and language depend on it.
- **Project Audit Checklist:**
  1. Look for an existing `PROJECT.md`, `DESIGN.md`, `README`, and manifests
     (`package.json`, `pubspec.yaml`, `composer.json`) and read them before asking.
     Never re-ask what the repository already answers.
  2. Look for a brief, Figma link, or brand guidelines the user already has.
  3. Note anything already decided by the client or an earlier contract.

## 4. Technical Standards & Rules

- **Ask in one organized pass,** grouped as: project, stack, region and business,
  design. Offer a recommendation with a one-line reason for each open decision instead
  of an empty question; the stack is the client's choice, so never impose one.
- **Fill the templates:** write `PROJECT.md` from
  [Project Template](./references/project-template.md) and `DESIGN.md` from
  [Design Template](./references/design-template.md). Leave unknown fields marked
  `TBD` — never invent a value.
- **Hand design choices to frontend-design:** styling method, visual direction, and
  token values are settled by that skill's choice flow; copy its outcome into
  `DESIGN.md`.
- **Recommend skills from the map in
  [Skill Selection Guide](./references/skill-selection.md),** using only skills that
  exist in the installed library, ordered by build sequence.
- **Build gate — core fields must be filled before any build starts.** The core fields
  are: the one job, the one impression, the primary action, the front-end stack, and
  the region. While any is `TBD`, the kickoff is not complete: list them as blockers,
  ask for them, and do not recommend moving to implementation. An approval given while
  core fields are still `TBD` does not open the gate — show exactly which fields are
  open and get an explicit "build anyway" for those named fields, then record it as
  "approved with open items" in `PROJECT.md`.
- **State known trade-offs, then follow the client.** When the chosen stack, styling
  method, or library has a known cost (client-side runtime in a server-rendering
  framework, a library with an uncertain maintenance status, a heavy dependency for a
  small site), say so in one line before recording it, tell the user to check the
  library's current maintenance status, and write the note under "Decisions &
  Trade-offs" in `PROJECT.md`. The client's choice stands; never swap it silently.
- **Plan in phases.** Generate `tasks.md` from [Tasks Template](./references/tasks-template.md)
  using the six standard phases in [Phases](./references/phases.md), trimmed to the
  project type with every change stated to the user. Each task names its skill and an
  acceptance criterion. Work stops for client approval after phases 1, 3, and 5 and at
  final sign-off.
- **Approvals are explicit.** Record a phase as approved only on a clear approval
  message, with its date; answering later questions or continuing to talk does not
  count. A criterion verified only in part is `[?]` with the gap named, not `[x]`.
- **Keep `tasks.md` true.** Mark a task done only after its acceptance criterion
  passes, update its status in the same step as the work, and add new scope as a new
  task — never inside a finished phase.
- **Never write secrets** — no API keys, passwords, tokens, or connection strings — in
  `PROJECT.md` or `DESIGN.md`. Name environment variables instead.
- **Do not overwrite** an existing `PROJECT.md` or `DESIGN.md`; show a diff of proposed
  changes and wait for approval.

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate what is being started and for whom. Confirm whether
   this is a new build or a takeover.
2. **Step 2: Inspect Context** — Execute the audit checklist; list what is already known
   and what is missing.
3. **Step 3: Formulate Plan** — Ask the grouped kickoff questions for the missing items
   only, with a recommendation on each open decision. Open the frontend-design choice
   flow for styling method, visual direction, and tokens.
4. **Step 4: Verify Security** — Confirm no secrets or private client data are in the
   answers about to be written; replace any with environment variable names.
5. **Step 5: Apply Edits** — Create `PROJECT.md`, `DESIGN.md`, and `tasks.md` at the
   repository root from the templates, with `TBD` for unknowns and phases trimmed to
   the project type.
6. **Step 6: Execute Tests** — Re-read all three files and check: every field is filled
   or marked `TBD`, every task has a skill and an acceptance criterion, every
   recommended skill exists in the library, and nothing in the files looks like a
   secret.
7. **Step 7: Report Status** — Present a short kickoff summary: decisions recorded, open
   `TBD` items with the core-field blockers called out first, trade-offs noted, the
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

- [ ] `PROJECT.md`, `DESIGN.md`, and `tasks.md` exist at the repository root.
- [ ] `tasks.md` follows the standard phases, trimmed to the project type, with a skill
      and an acceptance criterion on every task and stop points after phases 1, 3, 5.
- [ ] Every field is filled or explicitly marked `TBD`; no invented values.
- [ ] No secrets or private client data in either file.
- [ ] Styling method, visual direction, and token values were chosen by the user
      through the frontend-design flow, or are marked `TBD` with the reason.
- [ ] Recommended skills all exist in the library and are listed in build order with a
      one-line reason each.
- [ ] Core fields (one job, one impression, primary action, front-end stack, region) are
      filled, or the user explicitly approved building with those named fields open.
- [ ] Known trade-offs of the chosen stack and libraries are recorded under "Decisions &
      Trade-offs".
- [ ] The user approved the kickoff summary before any implementation started.

## 8. Supporting References & Assets

- [Project Template](./references/project-template.md) — the `PROJECT.md` skeleton.
- [Design Template](./references/design-template.md) — the `DESIGN.md` skeleton.
- [Phases](./references/phases.md) — the six standard phases, trimming rules by project
  type, and approval stops.
- [Tasks Template](./references/tasks-template.md) — the `tasks.md` skeleton.
- [Skill Selection Guide](./references/skill-selection.md) — which library skills fit
  which project type, and in what order.
