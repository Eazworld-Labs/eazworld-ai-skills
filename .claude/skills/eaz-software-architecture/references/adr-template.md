# Architecture Decision Record Template

Companion to the `eaz-software-architecture` skill. Copy this skeleton for every
non-trivial decision and keep one file per decision in `docs/adr/` (or the project's
equivalent), named `NNNN-short-kebab-title.md`.

## Usage Rules

- Write the **Context** before the **Decision** — a decision without its constraints is
  just an opinion.
- List real alternatives, including "do nothing"; each with honest pros and cons.
- Keep each ADR short enough to read in five minutes.
- Never include secrets, credentials, or internal hostnames — reference environment
  variable names instead.

## Template

```markdown
# ADR-NNNN: Title of the Decision

**Status:** Proposed | Accepted | Superseded by ADR-NNNN | Deprecated
**Date:** YYYY-MM-DD
**Deciders:** (roles or names)

## Context

What forces are at play — scale expectations, team constraints, deadlines, compliance,
existing systems. Include the requirement or pain that made this decision necessary.

## Options Considered

### Option A — Name

- Pros: ...
- Cons: ...

### Option B — Name

- Pros: ...
- Cons: ...

## Decision

The chosen option and the reasoning that beat the alternatives. State explicitly what
was rejected and why.

## Consequences

- Positive: ...
- Negative / accepted trade-offs: ...
- Follow-up work this decision creates: ...

## Review Trigger

The condition that should cause this decision to be revisited (for example, "team grows
beyond eight engineers" or "write load exceeds X per second").
```

## Quality Checklist

- [ ] Context states the problem without assuming the answer.
- [ ] At least two real alternatives compared with trade-offs.
- [ ] Consequences include the downsides, not only benefits.
- [ ] A review trigger is defined so the decision has an expiry path.
- [ ] No secrets, credentials, or internal-only endpoints referenced by value.
