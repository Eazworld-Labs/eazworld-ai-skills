# API.md

Copy this to the root of a project that exposes an API as `API.md`, or keep the same
information in an OpenAPI file and link to it. It is the contract between the front end
(or other callers) and the back end — write it from what is actually implemented, and update
it in the same change as any endpoint. Never put real tokens or keys in examples.

## 1. Overview

- **Base URL(s):** <!-- local, staging, production -->
- **Versioning:** <!-- e.g. /v1 in the path -->
- **Format:** <!-- JSON; dates in ISO 8601; money in the smallest currency unit -->

## 2. Authentication

- **Method:** <!-- session cookie, bearer token, API key — see ARCHITECTURE.md -->
- **How to obtain and refresh credentials:**
- **Errors:** `401` not authenticated, `403` not allowed.

## 3. Conventions

- **Error envelope:**

```json
{ "error": { "code": "invalid_input", "message": "Validation failed", "requestId": "req_example" } }
```

- **Pagination:** <!-- cursor or page parameters, default and maximum size -->
- **Rate limits:** <!-- per route class, and the headers returned -->
- **Idempotency:** <!-- which POST routes accept an Idempotency-Key -->

## 4. Endpoints

<!-- One block per endpoint, grouped by resource. Link each to its feature ID in SPEC.md. -->

### `POST /v1/orders` — Place an order (F#)

- **Who may call it:** <!-- role -->
- **Request:** <!-- fields, types, required, limits -->
- **Success:** `201` with <!-- body -->
- **Errors:** `422` validation, `409` conflict, `429` rate limited
- **Notes:** <!-- idempotency, side effects, webhooks triggered -->

## 5. Webhooks

| Event | Sent to / received from | Signature | Retries | Dedup key |
| :--- | :--- | :--- | :--- | :--- |

## 6. Change Log

<!-- Date — endpoint — change — breaking? -->
