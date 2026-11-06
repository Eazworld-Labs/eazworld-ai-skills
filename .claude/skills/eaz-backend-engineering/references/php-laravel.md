# PHP & Laravel Notes

Companion to the `eaz-backend-engineering` skill. Apply on top of the core rules when
`composer.json` shows `laravel/framework`. Check the installed Laravel and PHP versions
before using any API below.

## Defaults

- **Validation:** use Form Requests so validation and authorization sit at the boundary,
  not in controllers. Return the project's error envelope from the exception handler.
- **Layers:** thin controllers → services or action classes → Eloquent models and
  repositories. Keep business rules out of controllers and out of models' view logic.
- **Authorization:** policies and gates for object-level checks (`$this->authorize()` or
  the `can` middleware); never rely on hiding a button. Test deny cases.
- **Authentication:** use the starter's or Sanctum's flow for SPAs and mobile tokens,
  rather than custom code; passwords hash with the framework hasher.
- **Mass assignment:** define `$fillable` (or guard explicitly) on every model; never pass
  `$request->all()` straight into `create()`.
- **Queries:** avoid N+1 by eager loading with `with()`; consider
  `Model::preventLazyLoading()` outside production so slips fail loudly. Use database
  transactions for multi-step writes.
- **Configuration:** read `env()` only inside `config/*.php`, and everywhere else use
  `config()` — otherwise values vanish when configuration is cached. Never commit `.env`;
  keep `.env.example` current. Run `config:cache`, `route:cache`, and `event:cache` in
  deployment.
- **Queues:** database or Redis queue with a supervised worker (Horizon for Redis);
  jobs implement retries, backoff, and a `failed()` handler; dispatch after commit
  (`afterCommit`) when a job depends on a transaction. Schedule recurring work in the
  scheduler with overlap protection (`withoutOverlapping`).
- **Webhooks:** exclude the route from CSRF protection, verify the provider signature over
  the raw body, store the event id, and process in a job.
- **Rate limiting:** define named limiters and apply them to login, password reset,
  one-time-code, and payment routes.
- **Logging:** use the logging channels with a JSON formatter in production and add a
  request-id middleware; never log request bodies that hold credentials.

## Pitfalls

- Debug mode (`APP_DEBUG=true`) in production leaks configuration and stack traces.
- Running migrations that lock large tables during peak traffic.
- Storing uploads on the app server's local disk when the deployment has more than one
  instance.

## Verification

Run the project's tests (Pest or PHPUnit), static analysis if configured, and
`php artisan migrate` against a clean database; exercise denial cases and a duplicate
webhook delivery.
