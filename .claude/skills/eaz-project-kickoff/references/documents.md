# Project Documents

Companion to the `eaz-project-kickoff` skill. Every document has **one job, one owner
skill, and a phase when it is created**. The kickoff writes the core set; the rest are
created later by a task in `tasks.md`, from what was actually built — a document written
before the thing exists is a guess, and guesses go stale.

## Core set — written at kickoff (phase 1)

| File | Answers | Written by | Template |
| :--- | :--- | :--- | :--- |
| `PROJECT.md` | What was decided | `eaz-project-kickoff` | [Project Template](./project-template.md) |
| `SPEC.md` | What it must do | `eaz-project-kickoff` | [Spec Template](./spec-template.md) |
| `ARCHITECTURE.md` | How it is built | `eaz-software-architecture` (invoked by the kickoff) | In that skill's `references/` |
| `DESIGN.md` | How it looks and feels | `eaz-frontend-design` (invoked by the kickoff) | [Design Template](./design-template.md) |
| `tasks.md` | What work is left | `eaz-project-kickoff` | [Tasks Template](./tasks-template.md) |
| `CLAUDE.md` block | Rules for every session | `eaz-project-kickoff` | [Agent Instructions Block](./agent-instructions-template.md) |
| `README.md` | What this is and how to run it | `eaz-project-kickoff` (first version) | [README Template](./readme-template.md) |
| `docs/adr/NNNN-*.md` | Why each big decision was made | `eaz-software-architecture` | In that skill's `references/` |

The client approves this set at the phase 1 stop, before anything is built.

## Conditional — created by a task when the project type needs them

| File | Needed when | Written by | Phase |
| :--- | :--- | :--- | :--- |
| `DATA-MODEL.md` | The project has a database | `eaz-database-architecture` | 4 (frontend-first) or 2 (backend-first) |
| `API.md` (or an OpenAPI file) | The project exposes an API | `eaz-api-development` | 2 as a draft contract the mock data follows; kept current through 4 |
| `CONTENT.md` | Content-heavy sites, stores, schools, churches | `eaz-project-kickoff` | 1 |

Small projects fold testing notes into `SPEC.md` (Quality Requirements) rather than a
separate file.

## At launch — created in phase 6

| File | Answers | Written by | Template |
| :--- | :--- | :--- | :--- |
| `RUNBOOK.md` | How to deploy, roll back, back up, restore, and respond to incidents | `eaz-cloud-devops` | In that skill's `references/` |
| `HANDOFF.md` | What the client receives and how to look after it | `eaz-project-kickoff` | [Handoff Template](./handoff-template.md) |
| `CHANGELOG.md` | What changed and when, once live | the person releasing | Keep a Changelog format |

## Rules

- **One job per document.** Do not repeat a decision in three places; link to it.
- **Source of truth:** `SPEC.md` for requirements, `ARCHITECTURE.md` for structure,
  `DESIGN.md` for appearance, `PROJECT.md` for decisions, ADRs for reasons.
- **Every document is a task** in `tasks.md`, so none is forgotten.
- **Keep them true.** A change to the architecture updates `ARCHITECTURE.md` and adds an
  ADR; a change to scope updates `SPEC.md` with a new feature ID and a change-log line.
- **Never write secrets** into any of them — name environment variables and where values
  are stored.
- **Do not overwrite** an existing file; show a diff and wait for approval.
