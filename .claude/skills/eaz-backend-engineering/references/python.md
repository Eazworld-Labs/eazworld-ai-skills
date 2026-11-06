# Python Notes (Django & FastAPI)

Companion to the `eaz-backend-engineering` skill. Apply on top of the core rules when
`pyproject.toml` or `requirements.txt` shows `django` or `fastapi`. Check the installed
versions before using any API below.

## Shared

- Use virtual environments and a lock file; pin dependencies.
- Read configuration from environment variables through one settings module, validated at
  startup; keep secrets out of the repository and keep `.env.example` current.
- Type-hint public functions and run a type checker if the project already uses one.
- Avoid N+1 queries: use eager loading appropriate to the ORM.
- Tests with pytest; mirror the project's existing fixtures and factories.

## Django

- **Validation and serialization:** Django REST Framework serializers (or forms for
  server-rendered views) at the boundary; permission classes for authorization, with
  object-level permissions for ownership checks.
- **Authentication:** use `django.contrib.auth` and its password hashers; add a package
  for tokens or social login rather than writing one.
- **Queries:** `select_related` and `prefetch_related` to avoid N+1; wrap multi-step writes
  in `transaction.atomic`, and use `transaction.on_commit` before dispatching jobs.
- **Production settings:** `DEBUG=False`, a strict `ALLOWED_HOSTS`, secure cookie flags,
  HTTPS redirect and HSTS, and `python manage.py check --deploy` clean.
- **Migrations:** commit them, review generated SQL for locks on large tables, and keep
  them backward compatible during a deploy.
- **Background work:** Celery (or a lighter queue the project already uses) with
  idempotent tasks, retries, and a dead-letter path; schedule with the queue's scheduler.
- **Webhooks:** exempt the view from CSRF, verify the signature over the raw body, store
  the event id, and hand off to a task.

## FastAPI

- **Validation:** Pydantic models for request and response bodies; dependency injection
  for authentication, authorization, and database sessions.
- **Sync versus async:** do not call blocking code (blocking database drivers, file or
  network calls) inside `async def` endpoints — use async libraries or plain `def`
  endpoints, which run in a thread pool.
- **Migrations:** Alembic, reviewed like code.
- **Background work:** `BackgroundTasks` is for light, loss-tolerant work only; use a real
  queue for anything that must survive a restart or be retried.
- **Errors:** register exception handlers that produce the project's error envelope;
  keep validation error details free of internals.
- **Docs:** the generated OpenAPI is a contract — keep it accurate, and disable the
  interactive docs in production if the API is private.

## Verification

Run the test suite, the linter, the type checker if configured, and the framework's
deployment check (`manage.py check --deploy` for Django); exercise denial cases and a
duplicate event delivery.
