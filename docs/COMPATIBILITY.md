# Agent Compatibility Matrix

Cross-agent verification for the Eazworld AI Skills Library. This document records
test outcomes and runner versions for every compatibility check in tasks.md Phase 7.

## Test Environment

| Component | Version |
| --- | --- |
| OpenCode | v2.0.15 |
| Claude Code CLI | 2.1.319 (Claude Code checks, 2026-11-06); 2.1.312 (OpenCode-era checks) |
| Node.js | v24.21.0 |
| Library size | 33 skills — 14 software-engineering, 7 digital-marketing, 5 ai-automation, 7 business-solutions |
| Skill source | `.claude/skills/<skill-name>/SKILL.md` (one level deep — deeper nesting is not discovered) |

## OpenCode Verification

Shared loader reading `.claude/skills/`.

| Check | Status | Evidence |
| --- | --- | --- |
| Skill discovery from `.claude/skills/` | PASS | All 31 skills registered live as they were created; IDs present in the session's available skill list |
| Activation on domain triggers | PASS | `eaz-api-development` loaded end to end through the skill tool — full SKILL.md content returned |
| Relative `references/` link resolution | PASS | Static resolution 3/3 (eaz-api-development, eaz-software-architecture, eaz-database-architecture); the live load resolved `./references/openapi-checklist.md` to its file |
| No duplicate skills under `.opencode/` | PASS | No `.opencode/` directory exists in the repository |

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
| 1 | OpenCode | `frontend-design` ID shadowed by a built-in skill | Renamed: every skill now carries the `eaz-` prefix. Not yet re-verified in OpenCode (see Next Run) |
| 2 | OpenCode | Transient availability churn on some skill IDs | Self-resolved; no action required |
| 3 | Claude Code | Verification blocked by weekly quota | Resolved 2026-11-06 — §7.1 checks completed (see above) |

## Next Run (to close the OpenCode half of tasks.md §7)

The OpenCode results above were recorded on v2.0.15 **before** the `eaz-` rename and the
flat layout. Re-run them:

1. Open the repository in OpenCode and confirm all 33 `eaz-` skills are listed.
2. Activate one skill per department.
3. Confirm a `references/` link resolves at runtime.
4. Update the OpenCode table and close discrepancy #1.
