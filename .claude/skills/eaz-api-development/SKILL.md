---
name: eaz-api-development
description: Design, document, and verify HTTP APIs with REST and GraphQL conventions. Use
  when creating or reviewing endpoints, defining request and response contracts, adding
  pagination, versioning, rate limits, or authentication, verifying webhooks such as
  Paystack and Hubtel, or writing OpenAPI specifications.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.1.0"
---

# API Development

## 1. Overview & Purpose

Owns the contract layer between systems: resources and verbs, status codes, pagination,
versioning, authentication, rate limits, error envelopes, and webhook verification. Treats
the specification as the source of truth and keeps it in lockstep with the implementation,
so consumers can integrate without reading server code.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to design, add, review, or document API endpoints.
- **Trigger 2:** When defining request/response schemas, pagination, versioning, or status
  code behavior.
- **Trigger 3:** When implementing or verifying webhook handlers (Paystack, Hubtel,
  WhatsApp Business API) including signature checks.
- **Trigger 4:** When writing or updating an OpenAPI specification, or auditing an API for
  contract drift.
- **Anti-Trigger:** Do not activate for internal service structure or middleware internals
  (route to eaz-backend-engineering) or schema design (route to eaz-database-architecture).

## 3. Required Inputs & Project Audit

Before drafting a contract, inspect the target repository:

- **Mandatory Inputs:**
  1. Consumers: who calls this API and what they need from each operation.
  2. Payload samples or field lists for requests and responses.
  3. The authentication model and, for webhooks, the provider's verification
     documentation.
- **Codebase Audit Checklist:**
  1. Read the existing routes to learn the current URL and naming conventions.
  2. Check the current error format and status code usage — stay consistent with it.
  3. Review auth middleware to see how routes are protected today.
  4. Look for an existing OpenAPI file or API docs to extend rather than replace.

## 4. Technical Standards & Rules

- Keep the contract written down: an OpenAPI file, or `API.md` from the
  [API Document Template](./references/api-doc-template.md) when the project has no
  OpenAPI file. Write it from what is implemented, link each endpoint to its feature ID in
  `SPEC.md` when one exists, and update it in the same change as any endpoint.
- Resources are plural nouns (`/orders`, `/customers`); HTTP verbs carry the semantics —
  GET is safe and idempotent, POST creates, PUT replaces, PATCH updates, DELETE removes.
- Status codes tell the truth: 200/201/204 on success, 400 malformed input, 401
  unauthenticated, 403 unauthorized, 404 absent, 409 conflict, 422 semantic validation
  failure, 429 rate limited, 500 unexpected.
- Every error response uses one envelope, for example
  `{"error": {"code": "order_not_found", "message": "...", "details": {}}}`.
- Pagination defaults to cursor-based; offsets are allowed only when the dataset is small
  and stable. Version through a path prefix (`/v1/...`).
- Payment endpoints accept an idempotency key so client retries never double-charge.
- The OpenAPI specification lives with the code and is validated against the routes —
  spec drift is a defect.

Example of the single error envelope every failure uses:

```json
{
  "error": {
    "code": "order_not_found",
    "message": "Order 42 does not exist",
    "details": {}
  }
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the consumers, operations, and payloads the contract
   must cover.
2. **Step 2: Inspect Context** — Execute the audit checklist; list the conventions to
   stay consistent with.
3. **Step 3: Formulate Plan** — Draft the route table first: method, path, auth, request
   schema, response schema, status codes.
4. **Step 4: Verify Security** — Confirm deny-by-default auth, validation schemas, rate
   limits, and webhook signature checks.
5. **Step 5: Apply Edits** — Implement or update the specification, then the routes, in
   that order.
6. **Step 6: Execute Tests** — Run contract tests covering success, validation failure,
   auth denial, and rate limiting; verify webhook handlers against a signed sample payload.
7. **Step 7: Report Status** — Report the contract changes, test results, and any consumer
   breaking changes (which require an explicit version bump).

## 6. Security & Edge Case Guidelines

- **Deny by Default:** Every route declares its auth requirement explicitly — an
  unauthenticated request is rejected before any handler logic runs.
- **Input Validation:** Validate body, path, and query parameters with a schema; reject
  unknown fields on write endpoints.
- **Webhook Verification:** Verify the provider signature with the shared secret from the
  environment and enforce a replay window on timestamps before trusting the payload.
- **Secrets:** Secrets never appear in URLs, query strings, or logs — webhook secrets and
  API keys are read from environment variables only.
- **Rate Limits:** Authentication, payment, and webhook-replay endpoints carry rate limits;
  return 429 with a `Retry-After` header.
- **CORS:** Responses are served to an explicit origin allowlist — never a wildcard with
  credentials enabled.

## 7. Definition of Done & Quality Gates

- [ ] Specification matches the implementation — routes and schemas validated against it.
- [ ] `API.md` (or the OpenAPI file) exists, is current, and links endpoints to feature IDs.
- [ ] Status codes verified for success, validation failure, denial, and rate limit paths.
- [ ] Auth tested: allowed request passes, denied request returns 401/403 as designed.
- [ ] Webhook handler verified against a correctly signed sample payload.
- [ ] Contract tests and the existing test suite pass.
- [ ] Breaking changes flagged for a version bump before release.

## 8. Supporting References & Assets

- Checklist: [OpenAPI Review Checklist](./references/openapi-checklist.md)
- [API Document Template](./references/api-doc-template.md) — the project-root `API.md`
  skeleton: base URL, authentication, conventions, endpoints, webhooks.
