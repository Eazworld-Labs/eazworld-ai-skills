# Jobs, Webhooks & Idempotency

Companion to the `eaz-backend-engineering` skill. Anything slow, retryable, or driven by a
third party belongs outside the request — and anything that can run twice must be safe to
run twice.

## 1. What goes in a background job

Move work out of the request when it is slow, can fail and be retried, calls a third
party, or does not change the response: sending email or SMS, generating reports,
importing files, syncing with other systems, and processing webhook events.

Choose the queue that fits the stack and the team: the framework's own queue (Laravel
queues, Django with Celery or a similar worker, Hangfire or hosted services in .NET) or a
Redis- or Postgres-backed queue for Node. Add a queue only when the need is real.

## 2. Rules for every job

- **Idempotent.** Running it twice must leave the same result. Check a "done" marker or
  rely on a unique constraint before acting; pass identifiers, not whole objects.
- **Retries with backoff.** Exponential backoff with jitter and a maximum number of
  attempts. Permanent failures (bad input, authentication) skip retries.
- **Dead-letter path.** After the final attempt the job lands somewhere a human can see,
  inspect, and replay, and an alert fires.
- **Timeouts.** Every job and every outbound call inside it has a time limit.
- **Enqueue after commit.** Do not queue a job for data that may still roll back. Enqueue
  after the transaction commits, or write the job to an outbox table inside the same
  transaction and publish from it.
- **Scheduled jobs.** Prevent overlap when several instances run (a lock or a single
  scheduler), and make each run safe to repeat.
- **Visibility.** Log start, finish, duration, and failures with the job id.

## 3. Receiving webhooks

Providers redeliver, reorder, and sometimes forge events. For every webhook endpoint:

1. **Verify authenticity** using the provider's signature scheme, computed over the **raw
   request body**, compared in constant time. Reject on mismatch. Check any timestamp to
   limit replay.
2. **Acknowledge fast.** Validate, store the event, return a 2xx, and process in a job.
3. **Deduplicate** on the provider's event id: record ids you have handled and skip repeats.
4. **Tolerate disorder.** Handle events arriving out of sequence or twice, and treat the
   provider's API (or your own state machine) as the source of truth for current status.
5. **Log** the event id and outcome, never secrets or full card data.

Payment-specific rules — pending states, reconciliation, refunds — live in
`eaz-ghana-payments` and `eaz-nigeria-payments`.

## 4. Idempotency keys for your own API

For operations that must not repeat (charging, booking, placing an order):

- Accept a client-supplied idempotency key on the request.
- Store the key with a hash of the request and the response you returned.
- On a repeat with the same key and the same request, return the stored response; with
  the same key and a different request, reject it.
- Back it with a unique database constraint as the final guard against races.

## 5. Concurrency and consistency

- Use transactions for multi-step writes; keep them short.
- Use unique constraints and row locks, or optimistic version checks, to prevent double
  booking and overselling instead of "check then write" in application code.
- Make state transitions explicit (placed → paid → shipped) and reject illegal ones.

## 6. What the tests must prove

- Delivering the same webhook or job twice produces one effect.
- A bad signature is rejected before any processing.
- A failing job retries with backoff, then reaches the dead-letter path and alerts.
- Two simultaneous requests for the last item produce one winner.
