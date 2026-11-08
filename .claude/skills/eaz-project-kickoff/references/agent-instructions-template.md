# Agent Instructions Block

Companion to the `eaz-project-kickoff` skill. Append this block to the project's
`CLAUDE.md` (create it if missing) — and to `AGENTS.md` too when that file exists — so
every later session in the project follows the same rules without being reminded.
**Append only: never overwrite or reorder existing content.** If a block headed
"Eazworld project rules" is already there, leave it as it is.

```markdown
## Eazworld project rules

- Read `PROJECT.md`, `SPEC.md`, `ARCHITECTURE.md`, `DESIGN.md`, and `tasks.md` before
  starting any task, and build only what `SPEC.md` describes in the structure
  `ARCHITECTURE.md` sets out.
- **Before you start any task in `tasks.md`, invoke every skill named on that task** with the
  Skill tool and follow it — do not work from memory of what the skill says. If a named skill
  is not available, stop and say so; do not improvise. For any UI work, `eaz-frontend-design`
  is always one of them.
- When you finish a task, add a `Skills used:` line under it listing the skills you invoked.
  If a named skill was not invoked, say why and mark the task `[?]`, not `[x]`.
- Follow the **Build order** in `PROJECT.md`. With frontend-first, build screens on typed mock
  data that follows `API.md` and do not start backend work until the screens are approved.
- Do not start building while a core field in `PROJECT.md` or `DESIGN.md` is `TBD`
  (the one job, one impression, primary action, front-end stack, region).
- Pass a phase stop in `tasks.md` only on an explicit approval message from the client
  or owner; answering questions is not approval.
- Mark a task done only after its acceptance criterion passes, and update `tasks.md` in
  the same step.
- Never write secrets into files; name environment variables instead.
```
