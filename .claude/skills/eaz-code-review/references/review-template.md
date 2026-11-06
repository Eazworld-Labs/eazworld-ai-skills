# Review Template

Companion to the `eaz-code-review` skill. Deliver the review in this shape. Keep it short:
a review that is too long does not get read.

```markdown
## Review: <change title or PR number>

**Verdict:** Approve | Request changes
**Intent as I understood it:** <one sentence — correct me if wrong>
**Risk areas touched:** <UI | server | database | payments | mobile | automation | infra>

### Blockers (must change before merge)
- `path/to/file.ext:LINE` — <what is wrong and why it matters>. Suggestion: <concrete fix>.

### Questions
- `path/to/file.ext:LINE` — <what I could not tell from the code>.

### Nits (optional)
- `path/to/file.ext:LINE` — <polish>.

### Praise
- <something done well, specifically>

### What I verified
- Ran: <commands, e.g. type-check, lint, tests> — <result>
- Exercised: <the new behavior, how>

### What I could not verify
- <e.g. no staging database available; did not run the migration; did not view on a device>
```

## Rules

- Blockers first. If there are none, say "No blockers" explicitly.
- Every item has a file and line, the reason, and a fix path.
- No credential values, exploit payloads, or long code dumps in the review.
- Approve only when there are no open blockers and the acceptance criterion is met.

## Recording it against `tasks.md`

If the project has a `tasks.md`:
- Mark the review task `[x]` only when the verdict is Approve and the task's "Done when"
  criterion is met (for example "open review findings are resolved").
- Otherwise mark it `[?]` with the number of open blockers, and leave the acceptance
  criterion unticked.
- Do not post the review to a pull request, or merge, unless the user asks.
