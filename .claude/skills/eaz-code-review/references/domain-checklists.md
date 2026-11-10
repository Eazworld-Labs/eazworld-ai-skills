# Domain Checklists

Companion to the `eaz-code-review` skill. Load the sections that match the files in the
diff. Each item is a question to answer from the code, not a box to tick blindly. The
owning skill is named so the reviewer can check the full standard.

## UI and front end (`eaz-frontend-design`)
- Does it match `DESIGN.md` — tokens used by name, no raw colors or off-grid pixel values?
- Are loading, empty, and error states built, not only the happy path?
- Keyboard path and visible focus; labels on inputs; contrast; touch targets.
- Motion has a purpose, uses duration tokens, and has a reduced-motion path.
- Layout at 360, 768, and 1440 px; no horizontal scroll; images reserve space.
- No secrets or private data in the client bundle; no raw HTML injection.
- Did the author render it and look at it, or only compile it?

## Server and API (`eaz-backend-engineering`, `eaz-api-development`)
- Every inbound payload validated at the boundary; unknown input rejected.
- Authorization on every route, including object-level and tenant checks; deny by default.
- Errors use the agreed envelope; nothing internal reaches the client.
- Side effects are idempotent; webhooks verify signatures over the raw body and
  deduplicate; jobs retry with backoff and have a dead-letter path.
- Outbound calls have timeouts; transactions wrap multi-step writes; jobs enqueue after
  commit.
- Configuration comes from validated environment variables; `.env.example` updated.
- Does the contract change break existing callers (field removed, meaning changed)?

## Database and migrations (`eaz-database-architecture`)
- Is the migration reversible, and has it run up, down, and up on a real engine?
- Will it lock a large table or rewrite data during peak traffic? Is it backward
  compatible with the version still running during the deploy?
- New query paths have supporting indexes; no N+1 patterns introduced.
- Constraints enforce what the code assumes (unique, not null, foreign keys).
- Destructive changes (drop, truncate) need explicit human approval and a backup plan.

## Payments and webhooks (`eaz-payments`)
- Amounts are computed server-side, in the smallest currency unit, never trusted from the
  client.
- Pending states and reconciliation exist (mobile money and transfers confirm later).
- Webhook signature checked in constant time; events deduplicated; refunds role-gated.
- No provider secret in code, logs, or the client; live and test modes cannot be mixed up.

## Mobile (`eaz-mobile-app-development`)
- Works offline or degrades clearly; handles app backgrounding and permission denial.
- Sensitive data stored in secure storage, not plain preferences; no secrets in the binary.
- Tested on a small and a large device, and a mid-range Android phone.

## Automations (`eaz-n8n-automation`, `eaz-whatsapp-automation`, `eaz-crm-automation`)
- Credentials live in the tool's credential store, not in the exported workflow.
- Every external call has an error branch, retries with backoff, and an alert.
- Triggers are idempotent; production and test endpoints are separate.
- WhatsApp: opt-in recorded, templates approved, the 24-hour window respected.

## Infrastructure and CI (`eaz-cloud-devops`)
- Workflow permissions are least-privilege; third-party actions are pinned.
- Secrets come from the secret store; none echoed to logs.
- Deploys have a rollback path; production deploys need explicit human confirmation.
- Containers run as a non-root user with minimal base images.

## Dependencies
- A new package has a stated reason, an active upstream, and a compatible license.
- The name is spelled exactly right (typosquatting) and the version is pinned by the
  lockfile.
- Install scripts and transitive additions are reasonable; nothing replaces a working
  dependency without cause.

## Documentation and tests
- Behavior changes update the README, `.env.example`, and the API docs.
- Tests cover the new failure paths, not only the happy path; they would fail if the
  feature were removed.
