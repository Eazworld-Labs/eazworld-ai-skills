# README.md (project)

Copy this to the root of a client project as `README.md`. The kickoff writes a short first
version; the scaffold task fills in the commands once they exist. Keep it to one screen of
essentials and point to the other documents by name (turn them into links in the real
README). Never put secrets in this file.

```markdown
# <Project name>

<One sentence: what this is and who it is for.>

**Status:** <Phase N — name> · **Client:** <name> · **Stack:** <front end, back end, database, hosting>

## Documents

| File | What it answers |
| :--- | :--- |
| `PROJECT.md` | What was decided |
| `SPEC.md` | What it must do |
| `ARCHITECTURE.md` | How it is built |
| `DESIGN.md` | How it looks and feels |
| `tasks.md` | What work is left |

## Run it locally

Requirements: <runtime and version, database, other tools — TBD until scaffolded>

    <install command>
    <run command>

Copy `.env.example` to `.env.local` and fill in the values. Never commit real values.

## Common commands

| Task | Command |
| :--- | :--- |
| Test | `<command>` |
| Lint and type-check | `<command>` |
| Build | `<command>` |

## Working on this project

Read `CLAUDE.md` and `tasks.md` first. Work in phases; each phase ends with approval.
```
