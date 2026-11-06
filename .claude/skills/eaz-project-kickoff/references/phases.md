# Project Phases

Companion to the `eaz-project-kickoff` skill. Defines the standard six phases, how to trim
them for a project type, and where work must stop for the client's approval. The
result is written to the project's `tasks.md` (skeleton:
[Tasks Template](./tasks-template.md)).

## The six phases

| # | Phase | Goal | Skills that usually apply | Stop for approval after? |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Discovery** | Answers gathered; `PROJECT.md`, `SPEC.md`, `ARCHITECTURE.md`, `DESIGN.md`, `README.md` and `tasks.md` written; core fields filled | `eaz-project-kickoff`, `eaz-frontend-design` (questions), `eaz-software-architecture` | **Yes** |
| 2 | **Foundation** | Tokens, theme, global styles, fonts, base components, project scaffolding | `eaz-frontend-design`, `eaz-cloud-devops` (repo, CI) | No |
| 3 | **Layout & structure** | Page templates, navigation, responsive grid, placeholder content | `eaz-frontend-design`, `eaz-seo-engineering` (URL structure) | **Yes** |
| 4 | **Pages & features** | Real content page by page; features with loading, empty, and error states | `eaz-frontend-design`, `eaz-backend-engineering`, `eaz-api-development`, `eaz-database-architecture`, region payments skill, business skills | No |
| 5 | **Polish & quality** | Motion, accessibility pass, token check, performance, tests | `eaz-frontend-design`, `eaz-performance-optimization`, `eaz-software-testing`, `eaz-code-review` | **Yes** |
| 6 | **Launch & handoff** | SEO, security review, deploy, monitoring, client handoff | `eaz-seo-engineering`, `eaz-security-audit`, `eaz-cloud-devops` | Final sign-off |

Phase contents above are for **frontend-first**, the recommended default (see Build order).
The hard stops are after phases 1, 3, and 5, because those are the points where a wrong
decision gets expensive: before building, before filling in content, and before
launch work.

## Build order — ask, and recommend frontend-first

The order of work is a **decision to ask the client**, one question with a recommendation, and to
record in `PROJECT.md` ("Build order") and in `tasks.md`.

| Order | What happens | Choose when |
| :--- | :--- | :--- |
| **Frontend-first** *(recommended default)* | Foundation, then every screen on typed **mock data** that follows the API contract, then the client approves the screens, then the backend is built and each screen is wired to it | Most client work: people can judge what they can see, look-and-feel changes are cheap before a backend exists, and the approved screens define exactly what the API must provide |
| **Backend-first** | Data model, API, and auth first, then screens on the real API | The product is mostly an API or integration (payments, sync, webhooks), the data rules are the hard part, or the front end is a thin client |
| **Vertical slices** | One feature at a time, screen and backend together | A small team, a very small scope, or an existing backend that already works |

Why frontend-first is the default:
- The client approves screens early — the cheapest moment to change them.
- The approved screens show exactly which endpoints and fields are needed, so the backend is built
  to a concrete contract and not to a guess.
- Backend rework drops, because the UI no longer surprises the API.

How to keep frontend-first honest:
- **Contract first.** A draft `API.md` (or OpenAPI file) exists before the mocks, and the mocks
  follow it — never the other way round.
- **One mock module.** All mock data sits behind a single data-access module, so a screen switches
  to the real API by changing that module only.
- **Mocks are removed.** A task at the end of Phase 4 proves no screen still uses them, and contract
  tests run against the real API.
- **Mock data is labelled** in the UI during review so nobody mistakes it for real data.

## Trimming by project type

Start from the six phases and adjust. State every change to the user in the kickoff
summary.

| Project type | Adjustment |
| :--- | :--- |
| Marketing / business site | Phase 4 is mostly content; skip backend and database tasks unless a form handler is needed |
| E-commerce | Split phase 4 into catalog, cart and checkout, payments, and orders; add `eaz-security-audit` before phase 5 ends |
| Web app / SaaS | Phase 4 becomes **backend and wiring**, one group per feature area: data model, auth, then each feature (frontend-first). For backend-first, put the data model, API, and auth before the screens |
| Mobile app | Replace layout tasks with navigation and screen scaffolds; add a **device testing & store release** task group to phase 6 |
| School, church, POS, booking system | Phase 4 is **backend and wiring** (data model and roles first, then each feature following the business skill's workflow); for backend-first, do the data model and roles before the screens |
| Automation / chatbot | Drop phases 2–3; phases become design the flow, build with error branches, test failure paths, launch with monitoring |

## Rules

- **Requirements come from `SPEC.md`.** A task that delivers a feature names its feature ID
  (`Delivers: F4`) and is done when that feature's acceptance test passes. Scope added later
  becomes a new feature ID in `SPEC.md` with a change-log line, then a new task.
- **Documents are tasks.** Each document in [Documents](./documents.md) is created by a
  task in the phase that table names — not all at the start — so none is forgotten and none
  is written before the thing it describes exists.
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
