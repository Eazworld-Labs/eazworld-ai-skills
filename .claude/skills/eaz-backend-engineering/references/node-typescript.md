# Node.js & TypeScript Notes

Companion to the `eaz-backend-engineering` skill. Apply on top of the core rules when the
manifest shows `express`, `fastify`, `@nestjs/core`, or Next.js route handlers. Match the
installed versions — check `package.json` before using any API below.

## Defaults

- Strict TypeScript; no `any` at module boundaries. Validate every inbound body, query,
  and params object with a schema library (Zod, or the framework's own: Fastify's JSON
  Schema, NestJS pipes with DTOs) **before** use, and derive types from the schema.
- Layers: route or controller → service → repository. Route handlers only parse, call a
  service, and shape the response. In Next.js route handlers, keep the handler thin and
  call a service that is importable and testable without HTTP; mark server-only modules
  so they cannot reach the client bundle.
- **Express:** register middleware in order (security headers → body parsing → routes →
  404 → error handler). Never call `next()` after sending a response. Express 5 forwards
  rejected promises from async handlers to the error handler; on 4.x wrap async handlers
  or use a helper so rejections are not lost.
- **Fastify:** declare a schema per route; use encapsulated plugins for modules; its
  built-in logger is structured already.
- **NestJS:** one module per feature; guards for authorization; a global exception filter
  for the error envelope; `ValidationPipe` with whitelisting enabled.
- Configuration: read `process.env` in one module, validate it with a schema at startup,
  and export a typed object. Nothing else touches `process.env`.
- Logging: a structured logger such as pino, with redaction paths configured and a request
  id per request.
- Hardening: security headers (helmet or the framework equivalent), an explicit CORS
  allowlist, request body size limits, and rate limiting on authentication and payment
  routes.
- Background work: a Redis-backed queue (for example BullMQ) or a Postgres-backed queue
  when Redis is not already in the stack — see Jobs, Webhooks & Idempotency. For webhook
  signatures, use the **raw** body and `crypto.timingSafeEqual`.
- Handle `SIGTERM`: stop the server, drain in-flight requests and jobs, close pools, exit.
- Treat unhandled rejections and uncaught exceptions as defects: log and let the process
  manager restart.

## Pitfalls

- Blocking the event loop with CPU-heavy work in a request — move it to a worker or job.
- Forgetting `await` on a promise that can reject.
- Parsing JSON bodies before a webhook's signature is checked against the raw bytes.
- Unbounded concurrency when calling an upstream in a loop — limit it.

## Verification

Run the project's scripts — typically type-check, lint, the test runner (Vitest or Jest,
with supertest-style HTTP tests), and build — and exercise a rejected request and a
duplicate delivery against a local server.
