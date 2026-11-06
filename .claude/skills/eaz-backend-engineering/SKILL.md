---
name: eaz-backend-engineering
description: Build and refactor server-side applications on any backend stack (Node.js
  with Express, Fastify, or NestJS; PHP with Laravel; Python with Django or FastAPI;
  ASP.NET Core). Use when choosing a backend architecture, implementing business logic,
  services, authentication and authorization, background jobs, webhooks, middleware, or
  centralized error handling, or when debugging server-side behavior.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.1.0"
---

# Backend Engineering

## 1. Overview & Purpose

Implements the server side of the stack on whatever backend the project already uses:
application layers, business logic, authentication and authorization, background jobs,
webhooks, and error handling. The standards below are stack-agnostic — layering,
validation at the boundary, access control, idempotency, predictable failure, and
observability — and stack-specific idioms load on demand from `references/`. Works
against an agreed API contract and data model, keeps route handlers thin and logic
testable, and produces services that fail predictably and leak nothing: not stack traces,
not secrets, not internal structure.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build or refactor server-side code, services, or
  business logic, or to choose a backend architecture for a project.
- **Trigger 2:** When implementing authentication or authorization, background jobs,
  webhooks, middleware, or centralized error handling.
- **Trigger 3:** When debugging server behavior — 5xx responses, hangs, race conditions,
  duplicate processing, or unhandled errors.
- **Anti-Trigger:** Do not activate for designing the API contract itself (route to
  eaz-api-development), designing schemas and indexes (route to
  eaz-database-architecture), payment-rail specifics (route to eaz-ghana-payments or
  eaz-nigeria-payments), or UI work (route to eaz-frontend-design).

## 3. Required Inputs & Project Audit

Before writing server code, inspect the target repository:

- **Mandatory Inputs:**
  1. The API contract or a written description of the operations to implement.
  2. The environment variable schema (`.env.example`) the service expects.
  3. The authentication model: who calls the service and how they prove who they are.
- **Stack Detection (do this first, never assume):**
  1. Read `PROJECT.md`, `SPEC.md`, `ARCHITECTURE.md`, and `tasks.md` if present — they hold
     the stack and decisions, what each feature must do (feature IDs and acceptance
     tests), the structure to build in, and the current phase. Build what `SPEC.md`
     describes in the structure `ARCHITECTURE.md` sets out; when the work changes a
     boundary, update `ARCHITECTURE.md` and add an ADR.
  2. Otherwise infer from manifests: `package.json` (express, fastify, `@nestjs/core`,
     next), `composer.json` (laravel/framework), `pyproject.toml` or `requirements.txt`
     (django, fastapi), `*.csproj` (Microsoft.AspNetCore), `go.mod`, `Gemfile`.
  3. Load the matching stack file from Section 8. If none matches, apply the core rules
     in the project's own idiom — and say which stack you detected.
- **Architecture Choices (ask, never assume):** unless `PROJECT.md`, an ADR, or the
  existing code already settles them, get the user's decision before building — at most
  five questions at a time, each asking for **one decision**, each with a recommendation
  and a one-line trade-off. Use [Discovery Questions](./references/discovery-questions.md):
  whether a custom backend is needed at all, architecture shape, authentication method,
  integrations, background work, hosting, and compliance. Record the answers in
  `PROJECT.md` (and an ADR for significant choices); leave unknowns as `TBD`.
- **Codebase Audit Checklist:**
  1. Review the current layout of routes, services, and data access — follow it rather
     than inventing a parallel structure.
  2. Check how errors are currently formatted and logged.
  3. Check the test setup and mirror existing test patterns.
  4. Look for existing authentication, authorization, and job infrastructure before
     adding anything new.

## 4. Technical Standards & Rules

- Follow the project's existing stack, language, and conventions; never migrate or add a
  framework as a side effect of a backend task.
- Layered structure: entry point (route, controller) → service (business logic) → data
  access. No business logic in route handlers; no raw framework objects in services.
- Validate every inbound body, query, header, and path parameter against a schema at the
  boundary, before any logic runs; reject unknown or malformed input with a clear error.
- Authentication proves who the caller is; **authorization is checked on the server for
  every request**, including object-level checks (does this caller own this record?) and
  tenant scoping. Deny by default. See [Auth & Access](./references/auth-and-access.md).
- Centralized error handling: one place converts errors to the agreed response envelope;
  clients get a stable code and a correlation id, never internals. See
  [Errors, Logging & Observability](./references/errors-logging-observability.md).
- Configuration comes from environment variables only, loaded and validated at startup so
  a bad deploy fails fast; ship `.env.example` with placeholder names.
- Any side-effecting path — payments, bookings, emails, webhook handling — is idempotent:
  a repeated request or redelivered event must not act twice. Slow, retryable, or
  third-party work runs in background jobs with retries and a dead-letter path. See
  [Jobs, Webhooks & Idempotency](./references/jobs-webhooks-idempotency.md).
- Every outbound call has a timeout; retries use exponential backoff with jitter and a
  cap; transient and permanent failures are handled differently.
- Use transactions for multi-step writes, and enqueue jobs only after the data they
  depend on has committed.
- Expose liveness and readiness checks, log in a structured format with request ids, and
  shut down gracefully so in-flight work finishes.
- No new dependencies without explicit human approval.

Example of boundary validation before any business logic runs (TypeScript and Zod shown;
every stack has an equivalent — see the stack files):

```ts
const PlaceOrderSchema = z.object({
  sku: z.string().min(1),
  qty: z.number().int().positive(),
});

const parsed = PlaceOrderSchema.safeParse(req.body);
if (!parsed.success) {
  return res.status(422).json({
    error: { code: 'invalid_input', message: 'Validation failed' },
  });
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the operation, its inputs, outputs, and failure
   modes. If the task is a new backend or a new subsystem, settle the architecture
   choices (Section 3) before opening any file.
2. **Step 2: Inspect Context** — Detect the stack, load its reference file, and execute
   the audit checklist; note existing patterns to reuse.
3. **Step 3: Formulate Plan** — List the files to touch and the tests that will prove the
   change works, including the denial and failure cases.
4. **Step 4: Verify Security** — Confirm auth coverage, object-level checks, input
   validation, and that no secret will enter the diff.
5. **Step 5: Apply Edits** — Implement in small layers: schema → service → route → tests.
6. **Step 6: Execute Tests** — Run the project's test, lint, and type-check commands;
   exercise the new paths against a local server, including a rejected request and a
   duplicate delivery where the path is idempotent.
7. **Step 7: Report Status** — Report operations added, the stack detected, test results,
   and residual risks. If the project has a `tasks.md`, update the status of each task
   you worked on — mark it done only when its acceptance criterion passed — and stop at
   any approval point it defines.

## 6. Security & Edge Case Guidelines

- **Zero Hardcoding:** Secrets come from environment variables only — ship `.env.example`
  with placeholder names, never real values.
- **Transport Hardening:** Set security headers, configure CORS as an explicit allowlist,
  and rate-limit authentication, password-reset, one-time-code, and payment routes.
- **Injection:** Use parameterized queries or the framework's query builder; never build
  SQL, shell commands, or file paths from raw input. Guard against mass assignment by
  allowlisting writable fields.
- **Token & Credential Handling:** Verify tokens on every protected route (signature,
  expiry, audience); hash passwords with a slow, salted algorithm; never log tokens,
  passwords, or card data.
- **Uploads & Outbound Requests:** Validate file type and size, store files outside the
  web root or in object storage under generated names. When fetching a URL supplied by a
  user, block private and internal addresses to prevent server-side request forgery.
- **Error Hygiene:** Clients receive a generic message plus a correlation id — stack
  traces and SQL stay in server logs.
- **Least Privilege:** The database account the service uses should only hold the
  permissions its queries require.
- **Edge Cases:** Handle timeouts, upstream failures, duplicate and out-of-order events,
  and malformed payloads explicitly — an unhandled error is a defect.

## 7. Definition of Done & Quality Gates

- [ ] Stack detected and stated in the report; matching reference file followed.
- [ ] Architecture choices recorded (`PROJECT.md`, or an ADR for significant ones), and
      `TBD` marked where undecided.
- [ ] The project's test, lint, and type-check commands pass.
- [ ] Every inbound payload validated against a schema before use.
- [ ] Authorization tested with allow and deny cases, including object-level and
      cross-tenant access where the product has tenants.
- [ ] Error responses use the agreed envelope; no stack traces reach clients.
- [ ] Webhook handlers verify signatures and are idempotent; background jobs are
      idempotent with a retry policy and a dead-letter path.
- [ ] Configuration validated at startup; `.env.example` updated; no secrets in the diff.
- [ ] Liveness and readiness checks exist; logs are structured, carry request ids, and
      were reviewed for sensitive data.
- [ ] `tasks.md` updated if the project has one.

## 8. Supporting References & Assets

- [Discovery Questions](./references/discovery-questions.md) — architecture questions to
  ask, a starting-point stack table, and how to record the answers.
- [Auth & Access](./references/auth-and-access.md) — sessions vs tokens vs managed
  providers, password and one-time-code rules, and authorization patterns.
- [Jobs, Webhooks & Idempotency](./references/jobs-webhooks-idempotency.md) — background
  work, retries, webhook receipt, and idempotency keys.
- [Errors, Logging & Observability](./references/errors-logging-observability.md) —
  error envelope, status codes, structured logs, health checks, and shutdown.
- [Node.js & TypeScript Notes](./references/node-typescript.md) — load when the manifest
  shows express, fastify, or `@nestjs/core`.
- [PHP & Laravel Notes](./references/php-laravel.md) — load when `composer.json` shows
  laravel/framework.
- [Python Notes](./references/python.md) — load for Django or FastAPI.
- [ASP.NET Core Notes](./references/dotnet.md) — load when a `*.csproj` references
  Microsoft.AspNetCore.
