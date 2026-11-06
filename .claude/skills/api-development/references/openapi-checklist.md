# OpenAPI Review Checklist

Companion to the `api-development` skill. Use when writing or reviewing an OpenAPI 3.x
specification so it matches the implementation and the department's REST standards.

## Document Level

- [ ] `info.title`, `info.version`, and `info.description` present; version follows
      semantic versioning.
- [ ] `servers` lists only intended environments — no internal hostnames in public specs.
- [ ] Spec file lives in the repository and is validated in CI (for example with
      Spectral).

## Paths & Operations

- [ ] Paths are plural nouns without trailing verbs (`/orders`, not `/getOrders`).
- [ ] Each operation uses the correct verb — GET is safe and idempotent, POST creates.
- [ ] Every operation has a unique `operationId` (client SDKs depend on it).
- [ ] `summary` and `description` written for a consumer, not for the implementer.
- [ ] Deprecated operations marked `deprecated: true` instead of deleted.

## Parameters & Bodies

- [ ] Every parameter has a `schema`, and required parameters marked `required: true`.
- [ ] Path parameters always required; query parameters documented with defaults.
- [ ] Request bodies define schemas for every accepted content type.
- [ ] Unknown fields rejected on write operations (documented via `additionalProperties`
      or explicit schemas).

## Responses

- [ ] Every operation documents all realistic status codes — 2xx plus 4xx/5xx paths.
- [ ] Error responses share one envelope schema via `components/schemas`.
- [ ] Examples provided for success and primary failure responses.
- [ ] 401, 403, and 429 responses present on protected or rate-limited operations.

## Security

- [ ] `securitySchemes` defined once in `components` and applied per operation.
- [ ] Deny-by-default: unauthenticated access only on operations that are intentionally
      public, marked with `security: []`.
- [ ] No secrets, webhook secrets, or API keys appear in the spec — only variable names
      and scheme types.

## Pagination & Versioning

- [ ] Collection endpoints document pagination parameters (cursor preferred) and the
      response envelope for items and cursors.
- [ ] Breaking changes bump the path version (`/v1` → `/v2`) rather than silently
      changing schemas.

## Webhooks (when applicable)

- [ ] Webhook payload schema documented alongside HTTP paths.
- [ ] Signature verification described (header name, algorithm, replay window) without
      revealing the shared secret.

## Contract Fidelity

- [ ] Every documented path exists in the implementation, and every implemented route is
      documented.
- [ ] Schema field names and types match the runtime validation schemas.
- [ ] Contract tests exercise success, validation failure, auth denial, and rate limiting
      against the documented behavior.
