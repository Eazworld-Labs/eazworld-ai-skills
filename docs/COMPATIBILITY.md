# Agent Compatibility Matrix

Cross-agent verification for the Eazworld AI Skills Library. This document records
test outcomes and runner versions for every compatibility check in tasks.md Phase 7.

## Test Environment

| Component | Version |
| --- | --- |
| OpenCode | v2.0.15 (checked 2026-11-06 with the free model `opencode/nemotron-3.5-super-vl-free`) |
| Claude Code CLI | 2.1.319 (Claude Code checks, 2026-11-06); 2.1.312 (OpenCode-era checks) |
| Node.js | v24.21.0 |
| Library size | 33 skills — 14 software-engineering, 7 digital-marketing, 5 ai-automation, 7 business-solutions |
| Skill source | `.claude/skills/<skill-name>/SKILL.md` (one level deep — deeper nesting is not discovered) |

## OpenCode Verification

Shared loader reading `.claude/skills/`. Re-verified 2026-11-06 on OpenCode v2.0.15, after
the `eaz-` rename and the flat layout, by running `opencode run --standalone` against a
throwaway project that held a copy of the skills, using the free model
`opencode/nemotron-3.5-super-vl-free` (no charge).

| Check | Status | Evidence |
| --- | --- | --- |
| Skill discovery from `.claude/skills/` | PASS | Asked to list its skills, the agent named all 33 `eaz-` skills with no tool calls — the names came from OpenCode's own skill list |
| Activation on domain triggers | PASS | Each prompt below made OpenCode call its `skill` tool and load a matching skill |
| Relative `references/` link resolution | PASS | Loading `eaz-api-development` returned its `references/` files in the skill's file list, and the agent then read `references/openapi-checklist.md` |
| No duplicate skills under `.opencode/` | PASS | No `.opencode/` directory exists in the repository |

| Department | Prompt (summary) | Skills loaded |
| --- | --- | --- |
| digital-marketing | Google Ads campaign structure for a Lagos store | `eaz-google-ads` |
| ai-automation | n8n workflow from a Paystack webhook to WhatsApp | `eaz-n8n-automation`, `eaz-whatsapp-automation` (and `eaz-ghana-payments`) |
| business-solutions | School fees by Mobile Money in Kumasi | `eaz-school-management`, `eaz-ghana-payments` |
| software-engineering | Reviewing an OpenAPI spec for an orders API | `eaz-api-development` |

Limits: one run per prompt, one OpenCode version, one free model — other models may choose
different skills. The checks confirm that the right skills are discovered and load, not
that every skill works.

### Known observations (OpenCode)

- Earlier releases named this skill `frontend-design`, which was shadowed by a built-in
  or personal skill with the same name. Resolved by the `eaz-` prefix on every skill
  name — see Naming Standards in `docs/SKILL_AUTHORING_GUIDE.md`.
- Transient registry churn was observed on a few skill IDs — briefly listed as
  unavailable, then re-registered without intervention. Self-resolved; monitor only.
- Post-release addition: `eaz-nigeria-payments` (Phase 10, Nigeria-first fintech
  expansion) — registered live in OpenCode on creation, validating at 32 skills.

## Claude Code Verification

Native loader reading `.claude/skills/`. Verified 2026-11-06 on Claude Code 2.1.319 by
running `claude -p` headless against throwaway projects (`npm run eval`); raw transcripts
are written locally to `evals/results/` (git-ignored) and can be regenerated.

| Check | Status | Evidence |
| --- | --- | --- |
| Native skill discovery | PASS | All 33 `eaz-` skills appear in the session's startup skill list |
| Activation on domain triggers | PASS | Each prompt below activated a skill from the expected department |
| Relative `references/` link resolution | PASS | The agent read 14 files through `references/` links during live runs; the validator also resolves every link statically |
| Representative skills across all 4 departments | PASS | See the table below |

| Department | Prompt (summary) | Skills activated |
| --- | --- | --- |
| software-engineering | New e-commerce project; a UI task; a new backend | `eaz-project-kickoff`, `eaz-frontend-design`, `eaz-backend-engineering` |
| digital-marketing | Google Ads campaign structure for a Lagos store | `eaz-google-ads` |
| ai-automation | n8n workflow from a Paystack webhook to WhatsApp | `eaz-n8n-automation`, `eaz-whatsapp-automation` |
| business-solutions | School fees by Mobile Money in Kumasi | `eaz-school-management`, `eaz-ghana-payments` |

Reproduce with `npm run eval -- --scenario compat-digital-marketing` (and the other
`compat-*` scenarios). These runs call the model and cost a few cents each.

Limits: one run per department, a single Claude Code version, and the checks only confirm
that a skill from the expected department activated — not that every skill works.

## Discrepancy Log

| # | Environment | Discrepancy | Resolution |
| --- | --- | --- | --- |
| 1 | OpenCode | `frontend-design` ID shadowed by a built-in skill | Resolved 2026-11-06: every skill carries the `eaz-` prefix, and OpenCode lists and loads all 33 |
| 2 | OpenCode | Transient availability churn on some skill IDs | Self-resolved; no action required |
| 3 | Claude Code | Verification blocked by weekly quota | Resolved 2026-11-06 — §7.1 checks completed (see above) |

## Maintaining This Matrix

Re-run both agents' checks when Claude Code or OpenCode ships a major change, or when the
skill layout or naming changes. Claude Code: `npm run eval -- --scenario compat-<department>`
(calls the model, a few cents per run). OpenCode: `opencode run --standalone --format json -m <model> "<prompt>"`
in a throwaway project, then read the `skill` tool calls in the output.
