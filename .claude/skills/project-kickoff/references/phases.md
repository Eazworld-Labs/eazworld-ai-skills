# Project Phases

Companion to the `project-kickoff` skill. Defines the standard six phases, how to trim
them for a project type, and where work must stop for the client's approval. The
result is written to the project's `tasks.md` (skeleton:
[Tasks Template](./tasks-template.md)).

## The six phases

| # | Phase | Goal | Skills that usually apply | Stop for approval after? |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Discovery** | Answers gathered, `PROJECT.md` and `DESIGN.md` written, core fields filled | `project-kickoff`, `frontend-design` (questions), `software-architecture` | **Yes** |
| 2 | **Foundation** | Tokens, theme, global styles, fonts, base components, project scaffolding | `frontend-design`, `cloud-devops` (repo, CI) | No |
| 3 | **Layout & structure** | Page templates, navigation, responsive grid, placeholder content | `frontend-design`, `seo-engineering` (URL structure) | **Yes** |
| 4 | **Pages & features** | Real content page by page; features with loading, empty, and error states | `frontend-design`, `backend-engineering`, `api-development`, `database-architecture`, region payments skill, business skills | No |
| 5 | **Polish & quality** | Motion, accessibility pass, token check, performance, tests | `frontend-design`, `performance-optimization`, `software-testing`, `code-review` | **Yes** |
| 6 | **Launch & handoff** | SEO, security review, deploy, monitoring, client handoff | `seo-engineering`, `security-audit`, `cloud-devops` | Final sign-off |

The hard stops are after phases 1, 3, and 5, because those are the points where a wrong
decision gets expensive: before building, before filling in content, and before
launch work.

## Trimming by project type

Start from the six phases and adjust. State every change to the user in the kickoff
summary.

| Project type | Adjustment |
| :--- | :--- |
| Marketing / business site | Phase 4 is mostly content; skip backend and database tasks unless a form handler is needed |
| E-commerce | Split phase 4 into catalog, cart and checkout, payments, and orders; add `security-audit` before phase 5 ends |
| Web app / SaaS | Add a **data model & API** phase between 1 and 2; phase 4 becomes one phase per feature area |
| Mobile app | Replace layout tasks with navigation and screen scaffolds; add a **device testing & store release** task group to phase 6 |
| School, church, POS, booking system | Add a **data model & roles** phase between 1 and 2; phase 4 follows the business skill's workflow |
| Automation / chatbot | Drop phases 2–3; phases become design the flow, build with error branches, test failure paths, launch with monitoring |

## Rules

- Every task has an **acceptance criterion** — a check someone can run, not a feeling
  ("tokens defined, contrast verified at 4.5:1", not "colors done").
- Name the **skill** that applies to each task so the right standards load.
- Open `TBD` core fields are a **blocker** on the phase that needs them, not a note.
- Never mark a task done until its acceptance criterion passes; update the status in
  `tasks.md` in the same step as the work.
- A stop point means: summarize what was built, show what changed, list open items,
  and wait for explicit approval before starting the next phase.
- **Approval must be explicit.** A stop point is passed only by a clear message from the
  client or owner approving that phase, recorded with the date. Answering questions
  about the next phase, continuing the conversation, or silence is not approval — ask
  directly.
- A task whose acceptance criterion could only be partly verified (for example, tested
  on an in-memory database but not the real one) is marked `[?]` with the gap named,
  not `[x]`.
- Keep task numbers in order; add new tasks at the end of their phase with the next
  number.
- Scope added later goes in a new task or phase with its own criterion, not into a
  finished one.
