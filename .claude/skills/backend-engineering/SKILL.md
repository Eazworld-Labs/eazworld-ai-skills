---
name: backend-engineering
description: Build and refactor server-side applications with Node.js, Express, and
  TypeScript. Use when implementing business logic, services, authentication flows,
  background jobs, middleware, or centralized error handling on the backend, or when
  debugging server-side behavior.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.0.0"
---

# Backend Engineering

## 1. Overview & Purpose

Implements the server side of the stack: application layers, business logic,
authentication flows, background jobs, and error handling. Works against an agreed API
contract and data model, keeping route handlers thin and logic testable. Produces services
that fail predictably, validate everything at their boundaries, and leak nothing — not
stack traces, not secrets, not internal structure.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build or refactor server-side code, services, or
  business logic.
- **Trigger 2:** When implementing authentication/authorization flows, background jobs, or
  centralized error handling.
- **Trigger 3:** When debugging server behavior — 5xx responses, hangs, race conditions, or
  unhandled promise rejections.
- **Anti-Trigger:** Do not activate for designing the API contract itself (route to
  api-development), designing schemas (route to database-architecture), or UI work (route
  to frontend-design).

## 3. Required Inputs & Project Audit

Before writing server code, inspect the target repository:

- **Mandatory Inputs:**
  1. The API contract or a written description of the operations to implement.
  2. The environment variable schema (`.env.example`) the service expects.
  3. The authentication model: how callers prove who they are.
- **Codebase Audit Checklist:**
  1. Inspect `package.json` for framework versions and existing middleware.
  2. Review the current layout of routes, services, and repositories — follow it rather
     than inventing a parallel structure.
  3. Check how errors are currently formatted and logged.
  4. Check the test setup (Jest or Vitest) and mirror existing test patterns.

## 4. Technical Standards & Rules

- Layered structure: route handler → service (business logic) → repository (data access).
  No business logic inside route handlers.
- Strict TypeScript — validate every inbound body, query, and params object with Zod (or
  the project's existing validator) before use.
- Centralized error middleware: one place converts errors to the agreed response envelope.
- Configuration read from environment variables only, loaded and validated at startup.
- Structured logging (level, message, context) with sensitive fields redacted.
- Payment and other side-effecting paths are idempotent — a repeated request must not
  charge or book twice.
- Express-specific rules: register middleware in order (security → parsing → routes →
  404 → error), and never call `next()` after a response has been sent.

Example of boundary validation before any business logic runs:

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

1. **Step 1: Parse Task** — Restate the operation, its inputs, outputs, and failure modes.
2. **Step 2: Inspect Context** — Execute the audit checklist; note existing patterns to
   reuse.
3. **Step 3: Formulate Plan** — List the files to touch and the tests that will prove the
   change works.
4. **Step 4: Verify Security** — Confirm auth coverage, input validation, and that no
   secret will enter the diff.
5. **Step 5: Apply Edits** — Implement in small layers: schema → service → route → tests.
6. **Step 6: Execute Tests** — Run the test suite, lint, and type-check; exercise the new
   paths manually against a local server.
7. **Step 7: Report Status** — Report operations added, test results, and residual risks.

## 6. Security & Edge Case Guidelines

- **Zero Hardcoding:** Secrets come from environment variables only — ship `.env.example`
  with placeholder names, never real values.
- **Transport Hardening:** Enable `helmet`, configure CORS as an explicit allowlist, and
  rate-limit authentication and payment routes.
- **Token Handling:** Verify JWTs on every protected route (signature, expiry, audience);
  never log tokens, passwords, or card data.
- **Error Hygiene:** Clients receive a generic message plus a correlation id — stack
  traces and SQL stay in server logs.
- **Least Privilege:** The database account the service uses should only hold the
  permissions its queries require.
- **Edge Cases:** Handle timeouts, upstream failures, and malformed payloads explicitly —
  an unhandled rejection is a defect.

## 7. Definition of Done & Quality Gates

- [ ] Test suite, lint, and type-check pass.
- [ ] Every inbound payload validated with a schema before use.
- [ ] Error responses use the agreed envelope; no stack traces reach clients.
- [ ] Authentication verified with both allow and deny test cases.
- [ ] No secrets or credentials present in the diff.
- [ ] Logs reviewed for sensitive data before shipping.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; see the related department skills
  for API contracts and schema design.
