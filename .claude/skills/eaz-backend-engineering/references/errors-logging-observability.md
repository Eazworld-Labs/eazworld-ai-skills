# Errors, Logging & Observability

Companion to the `eaz-backend-engineering` skill. A service is finished when it fails
correctly and when someone can tell, from outside, what it is doing.

## 1. One error envelope

Follow the project's existing contract. If none exists, use a stable shape:

```json
{
  "error": {
    "code": "invalid_input",
    "message": "Validation failed",
    "requestId": "req_9f2c",
    "details": [{ "field": "qty", "issue": "must be a positive integer" }]
  }
}
```

- `code` is stable and machine-readable; `message` is safe for people; `details` appears
  only for validation problems; `requestId` lets support find the log line.
- Never return stack traces, SQL, file paths, library names, or internal identifiers.
- Some stacks have a standard (for example ProblemDetails in ASP.NET Core) — prefer it
  when the framework provides it.

## 2. Status codes

| Code | Meaning |
| :--- | :--- |
| 400 / 422 | Malformed request / valid shape but failed validation |
| 401 | Not authenticated |
| 403 | Authenticated but not allowed |
| 404 | Not found (also use for records the caller may not know exist) |
| 409 | Conflict — duplicate, stale version, illegal state transition |
| 429 | Rate limited; include a retry hint |
| 5xx | Our fault or an upstream's; generic message, full detail in logs |

## 3. Centralized handling

- One handler converts exceptions to the envelope; routes do not build error responses by
  hand.
- Separate **expected** errors (validation, not found, conflict) from **unexpected** ones
  (bugs, outages). Log expected ones at a low level; log unexpected ones with the full
  stack and context, and alert on their rate.
- Never swallow an exception silently. Unhandled rejections and uncaught exceptions are
  defects: log them, fail the request, and let the process supervisor decide on restart.

## 4. Structured logging

- Log one JSON object per line: timestamp, level, message, request id, route, status,
  duration, and (where relevant) the user or tenant id — an identifier, not personal data.
- Generate a request id at the edge, return it in a response header, and pass it to
  downstream calls and jobs.
- **Redact** passwords, tokens, authorization headers, card numbers, one-time codes, and
  personal data. Review a sample of real logs for leaks before launch.
- Use levels consistently: `error` needs a human, `warn` is unusual but handled, `info`
  is normal flow, `debug` is off in production.

## 5. Health checks and metrics

- **Liveness:** "the process is running" — cheap, no dependencies.
- **Readiness:** "ready to serve" — checks the database, cache, and queue.
- Track the basics: request rate, error rate, and latency (p50, p95, p99), plus queue depth
  and job failures. Alert on symptoms users feel: error rate and latency, not CPU alone.
- Add an external uptime check on a public health URL.
- Add distributed tracing when more than one service takes part in a request.

## 6. Resilience and shutdown

- **Timeouts on every outbound call**, retries with backoff and a cap, and no retries for
  permanent errors. Consider a circuit breaker for a dependency that fails often.
- **Fail fast at startup** when required configuration is missing or invalid.
- **Graceful shutdown:** on a termination signal, stop accepting new requests, finish
  in-flight work and jobs, close connections, then exit.
- Keep schema migrations backward compatible with the running version during a deploy.

## 7. What the tests must prove

- Each error class returns the right status and the same envelope, with no internals.
- An unexpected exception returns a generic 500 and logs the full detail once.
- Logs carry the request id and contain no secrets.
- Readiness fails when the database is unreachable.
