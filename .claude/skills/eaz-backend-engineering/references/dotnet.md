# ASP.NET Core Notes

Companion to the `eaz-backend-engineering` skill. Apply on top of the core rules when a
`*.csproj` references `Microsoft.AspNetCore`. Check the target framework and package
versions before using any API below.

## Defaults

- **Structure:** controllers or minimal-API endpoint groups stay thin; business logic
  lives in services registered through dependency injection; data access sits behind an
  interface or the EF Core `DbContext` used inside services.
- **Validation:** validate at the boundary with data annotations or FluentValidation, and
  return the project's error shape. ASP.NET Core's ProblemDetails support gives a standard
  envelope — prefer it when the project has no contract of its own.
- **Authentication and authorization:** ASP.NET Core Identity or a managed provider;
  policy-based authorization with resource-based checks for ownership; apply
  `[Authorize]` by default and mark public routes explicitly.
- **Configuration:** the options pattern with validation on start
  (`ValidateOnStart`) so a bad deploy fails immediately; secrets from environment
  variables or a secret store, never from `appsettings.json` committed to the repository.
- **EF Core:** use `AsNoTracking` for read-only queries, `Include` deliberately to avoid
  N+1, and reviewed migrations; wrap multi-step writes in a transaction.
- **Background work:** hosted services for simple loops, or a job library such as Hangfire
  for retries, scheduling, and a dashboard; make jobs idempotent and enqueue after commit.
- **Webhooks:** read the raw body (enable buffering), verify the signature in constant
  time, store the event id, and process asynchronously.
- **Logging and health:** `ILogger` with structured output (Serilog or the built-in JSON
  formatter), a correlation id middleware, and health checks mapped for liveness and
  readiness.
- **Hardening:** HTTPS redirection and HSTS, an explicit CORS policy, request size limits,
  and the built-in rate limiting middleware on authentication and payment endpoints.
- **Shutdown:** the host handles graceful shutdown — make long-running work honor the
  cancellation token.

## Pitfalls

- Capturing a scoped service (such as the `DbContext`) in a singleton.
- Blocking on async calls (`.Result`, `.Wait()`), which can deadlock or starve threads.
- Developer exception pages enabled in production.

## Verification

Run `dotnet build`, `dotnet test`, and the analyzers the project configures; apply
migrations to a clean database; exercise denial cases and a duplicate webhook delivery.
