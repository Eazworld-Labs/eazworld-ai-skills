# Agent Compatibility Matrix

Cross-agent verification for the Eazworld AI Skills Library. This document records
test outcomes and runner versions for every compatibility check in tasks.md Phase 7.

## Test Environment

| Component | Version |
| --- | --- |
| OpenCode | v2.0.15 |
| Claude Code CLI | 2.1.312 |
| Node.js | v24.21.0 |
| Library size | 32 skills — 13 software-engineering, 7 digital-marketing, 5 ai-automation, 7 business-solutions |
| Skill source | `.claude/skills/<department>/<skill-name>/SKILL.md` |

## OpenCode Verification

Shared loader reading `.claude/skills/`.

| Check | Status | Evidence |
| --- | --- | --- |
| Skill discovery from `.claude/skills/` | PASS | All 31 skills registered live as they were created; IDs present in the session's available skill list |
| Activation on domain triggers | PASS | `api-development` loaded end to end through the skill tool — full SKILL.md content returned |
| Relative `references/` link resolution | PASS | Static resolution 3/3 (api-development, software-architecture, database-architecture); the live load resolved `./references/openapi-checklist.md` to its file |
| No duplicate skills under `.opencode/` | PASS | No `.opencode/` directory exists in the repository |

### Known observations (OpenCode)

- `frontend-design` is shadowed by a built-in skill with the same ID. The file exists
  and passes validation, but the built-in loads instead. The name is kept per
  tasks.md; logged as a known issue (Phase 3 decision).
- Transient registry churn was observed on a few skill IDs — briefly listed as
  unavailable, then re-registered without intervention. Self-resolved; monitor only.
- Post-release addition: `nigeria-payments` (Phase 10, Nigeria-first fintech
  expansion) — registered live in OpenCode on creation, validating at 32 skills.

## Claude Code Verification

Native loader reading `.claude/skills/`.

| Check | Status | Evidence |
| --- | --- | --- |
| Native skill discovery | PENDING | CLI returns the weekly-limit message (resets 12am Africa/Accra) |
| Activation on domain triggers | PENDING | Blocked by the same quota |
| Relative `references/` link resolution | PENDING (static PASS) | Static resolution passes 3/3; runtime confirmation awaits quota |
| Representative skills across all 4 departments | PENDING | Blocked by the same quota |

## Discrepancy Log

| # | Environment | Discrepancy | Resolution |
| --- | --- | --- | --- |
| 1 | OpenCode | `frontend-design` ID shadowed by a built-in skill | Keep name per tasks.md; documented as known issue |
| 2 | OpenCode | Transient availability churn on some skill IDs | Self-resolved; no action required |
| 3 | Claude Code | Verification blocked by weekly quota | Re-run §7.1 checks when quota resets |

## Next Run (to close tasks.md §7.1)

1. Run a `claude -p` discovery probe from the repository root.
2. Activate one representative skill per department (4 total).
3. Confirm `references/` links resolve at runtime.
4. Update this matrix to PASS for Claude Code and close §7.1.
