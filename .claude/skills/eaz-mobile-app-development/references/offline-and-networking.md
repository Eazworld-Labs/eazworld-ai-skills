# Offline & Networking

Companion to the `eaz-mobile-app-development` skill. Many users are on low-end phones, slow
or lossy networks, and metered data. An app that only works on fast Wi-Fi is not finished.

## 1. Decide how offline the app needs to be

| Level | Meaning | Use when |
| :--- | :--- | :--- |
| **Online only** | Needs a connection; shows a clear message without one | Live data is the point (live prices, chat) |
| **Offline read** | Cached data shows without a connection; changes need a connection | Catalogs, schedules, content, fee statements |
| **Offline write** | Changes are saved locally, queued, and sent when connected | Field data collection, orders taken in poor coverage |
| **Offline first** | The local database is the source of truth; the server syncs | Long periods without signal; collaborative data |

Choose the lowest level that meets the requirement — each step up multiplies complexity.

## 2. Rules for every level

- **Never block on the network at startup.** Show cached or placeholder content first.
- **Say what is happening:** offline banner, "last updated" time, sync status, and which
  actions are queued.
- **Timeouts and retries:** every request has a timeout; retry with exponential backoff and
  jitter and a cap; do not retry permanent failures (authentication, validation).
- **Respect data cost:** compress and page responses, cache images, request only the fields
  needed, avoid polling, and offer a data-saver choice for heavy media.
- **Handle flaky transitions:** requests fail mid-way when the network drops — design every
  write to be safe to repeat.

## 3. Queued writes and sync

- Give each queued action a client-generated **idempotency key**, so a retry after an
  uncertain failure never doubles an order or a payment (see `eaz-backend-engineering` Jobs,
  Webhooks & Idempotency).
- Keep the queue durable across app restarts, and show its contents to the user.
- Send in order where order matters; stop and surface the error when an action is
  permanently rejected, instead of silently dropping it.
- **Conflicts:** decide a rule up front — last write wins, server wins, field-level merge, or
  ask the user — and test it with two devices editing the same record.
- Version the local schema and migrate it on update; a broken migration must not wipe user
  data silently.

## 4. Payments and sensitive actions offline

- Do not take card or mobile-money payments from a queue silently. Money movements need a
  live confirmation; show **pending** until the server confirms, and resume rather than
  restart after the app is killed.
- Treat the provider's callback as the source of truth for payment status, not the app.

## 5. Storage

- Use the platform database or the framework's storage layer for structured data; secure
  storage for credentials; do not keep personal data longer than needed.
- Clear user data on sign-out, and encrypt sensitive local data where the platform allows.

## 6. What the tests must prove

- The app opens and shows cached content with the network off.
- A queued action sent twice (retry) produces one effect on the server.
- A dropped connection mid-request leaves the app in a recoverable state.
- A conflicting edit follows the chosen rule.
- Killing and relaunching the app mid-payment resumes cleanly.
- On a throttled connection, the app stays usable and does not time out the whole screen.
