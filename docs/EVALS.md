# Behavior Evals

The validator (`npm run validate`) checks that skills are well-formed. The evals check
that they **change what the agent does** — that it asks the right questions, uses the
right skill, and stops where it should. They run the real model, so they cost money and
take a few minutes; run them before releasing a change to a skill's behavior, not on
every commit.

## Run

```bash
npm run eval                                  # fast scenarios
npm run eval:all                              # includes the slow multi-turn scenario
node evals/run-evals.js --list                # show scenarios
node evals/run-evals.js --scenario build-gate-blocks-tbd
node evals/run-evals.js --repeat 3 --scenario kickoff-asks-before-building
node evals/run-evals.js --budget 1 --model <name>
```

`--repeat n` runs each scenario n times and prints a pass rate — use it before trusting a
failure or a pass, because model output varies between runs.

Requires Claude Code (`claude`) on your PATH and a signed-in session. Each run is capped
with `--max-budget-usd` (default $1.50 per prompt).

## How it works

For every scenario the runner:

1. Creates a throwaway project in the system temp directory.
2. Copies this working tree's `.claude/skills/` into it, plus any seed files the
   scenario defines (for example a half-filled `PROJECT.md`).
3. Runs `claude -p` headless with only project settings, so your personal skills and
   plugins cannot influence the result. Multi-turn scenarios resume the same session.
4. Reads the stream of tool calls and replies and evaluates the scenario's checks.
5. Saves raw transcripts and `summary.json` under `evals/results/<timestamp>/`
   (git-ignored).

## Scenarios

| Scenario | What it proves |
| :--- | :--- |
| `kickoff-asks-before-building` | A new e-commerce request invokes `eaz-project-kickoff`, asks a small first batch (2–5 questions, one decision each, with recommendations), says what comes in later batches, and writes no files |
| `ui-task-asks-design-choices` | A UI request with no `DESIGN.md` invokes `eaz-frontend-design` and asks about styling method, visual direction, motion, and inspiration (with a way to share links or images) before any code |
| `inspiration-image-is-read` | A screenshot placed in `inspiration/` is actually opened and described, and the agent confirms what it takes before writing code. The image is generated at run time, so no binary is committed |
| `build-gate-blocks-tbd` | "Everything is approved, build it" does not override core fields that are still `TBD` |
| `review-flags-planted-bugs` *(slow)* | Given a diff with planted defects (client-supplied payment amount, SQL built from request input, no authorization, a swallowed error that still reports success, a test that proves nothing), `eaz-code-review` gives a request-changes verdict with severity labels, names them, says what it verified and could not, and changes nothing |
| `mobile-task-asks-approach-choices` *(slow)* | A new mobile-app request invokes `eaz-mobile-app-development`, asks 2–5 single-decision questions (approach, platforms, offline, the audience's phones and networks) with recommendations, and writes no app code |
| `design-completes-full-token-set` *(slow)* | Given only the human choices (brand color, feel, typefaces, light only), the design flow generates every color token, runs `check-contrast.cjs`, writes calculated ratios into `DESIGN.md`, records the palette approval and typefaces, and writes no app code |
| `backend-task-asks-architecture-choices` *(slow)* | A new-backend request invokes `eaz-backend-engineering`, asks 2–5 single-decision architecture questions (authentication, architecture, hosting, integrations) with recommendations, and writes no server code |
| `compat-digital-marketing`, `compat-ai-automation`, `compat-business-solutions` *(slow)* | One realistic prompt per department activates a skill from that department — the Claude Code compatibility check recorded in `docs/COMPATIBILITY.md` |
| `kickoff-completes-after-answers` *(slow)* | Given complete answers, the kickoff invokes `eaz-project-kickoff`, `eaz-frontend-design` and `eaz-software-architecture`; writes `PROJECT.md`, `SPEC.md` (feature IDs with acceptance tests), `ARCHITECTURE.md`, `DESIGN.md`, `README.md`, `tasks.md` and the `CLAUDE.md` rules block; leaves the runbook, handoff and changelog for phase 6; and still does not build |

## Reading the results

Checks are **signals, not proofs**. They match the agent's wording with patterns, so a
failure can mean the behavior is wrong or just phrased differently. When a check fails,
open the transcript in `evals/results/` before changing a skill. Model output varies
between runs: run a failing scenario two or three times before trusting a single result.

## Adding a scenario

Add an entry to `evals/scenarios.js`:

- `turns`: the prompts to send, in order.
- `seed` (optional): files to create before the first prompt.
- `checks`: `{ name, test(ctx) }` — return `true`, or a string explaining the failure.
  `ctx` is documented at the top of `evals/run-evals.js`.

Prefer checks on **what the agent did** (skills invoked, files created, whether it
asked) over exact wording.
