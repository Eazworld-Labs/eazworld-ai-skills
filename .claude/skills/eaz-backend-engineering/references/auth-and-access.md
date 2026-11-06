# Auth & Access

Companion to the `eaz-backend-engineering` skill. Authentication answers "who is this?";
authorization answers "may they do this?". Both are decided on the server, on every
request.

## 1. Choose the authentication approach

| Approach | Choose when | Trade-offs |
| :--- | :--- | :--- |
| **Server-side sessions** (cookie) | A web app served from the same site as its API | Simple and revocable; needs session storage and CSRF protection |
| **Short-lived access tokens + refresh tokens** | Mobile apps, third-party API clients, separate front ends | Works across clients; revocation and rotation are your job |
| **Managed identity provider** (a hosted auth service) | Speed, social login, MFA, and compliance matter more than control | Vendor cost and lock-in; less custom flow |
| **Phone one-time code** | The phone is the primary identity, common in Ghana and Nigeria | SMS cost and delivery reliability; SIM-swap risk — not enough alone for high-value actions |

Never write your own cryptography or token format. Use the framework's authentication
system or a reviewed library.

## 2. Passwords

- Hash with Argon2id or bcrypt (or the framework default) using a tuned cost factor —
  never a fast hash such as MD5 or SHA-256 alone, never reversible encryption.
- Enforce a sensible minimum length and check against known breached passwords rather
  than imposing arbitrary complexity rules.
- **Reset flow:** single-use tokens with a short expiry, stored hashed; the response is
  identical whether or not the account exists (no account enumeration); old sessions
  end after a reset.
- **Login:** rate-limit by account and by address, add increasing delays or temporary
  lockout, and notify the user of new-device sign-ins where practical.
- Require MFA for administrator accounts.

## 3. Sessions and tokens

- Cookies: `HttpOnly`, `Secure`, and an appropriate `SameSite`; rotate the session id on
  login; expire idle sessions; invalidate on logout and password change.
- Cookie-based authentication needs CSRF protection on state-changing requests.
- Tokens: keep access tokens short-lived; rotate refresh tokens and detect reuse. Verify
  signature, expiry, issuer, and audience on **every** protected request, and pin the
  accepted algorithms. Avoid storing tokens where page scripts can read them — prefer
  `HttpOnly` cookies for browser clients.
- Never put secrets or sensitive personal data inside a token payload.

## 4. One-time codes (SMS, email, WhatsApp)

- Short expiry (a few minutes), single use, limited attempts per code, and rate limits per
  number and per address to control cost and abuse.
- Generate codes with a cryptographically secure random source; store only a hash.
- Add a second factor or a fresh check for sensitive actions such as changing the phone
  number or withdrawing money.

## 5. Authorization

- **Deny by default.** Every route declares who may call it; an unprotected route is a
  deliberate, reviewed exception.
- **Check the object, not just the role.** Confirm the caller owns or may access the
  specific record (the classic insecure-direct-object-reference bug). Use the framework's
  policy or permission layer rather than ad hoc `if` checks scattered through handlers.
- **Roles and permissions:** start with few roles; name permissions after actions
  (`orders.refund`), not people; keep the mapping in one place.
- **Multi-tenant:** derive the tenant from the authenticated context, never from a client
  parameter, and scope every query by it. Test that tenant A cannot read tenant B.
- Keep an audit log of sensitive actions: who, what, when, from where.
- Separate administrator surfaces and credentials from customer ones.

## 6. What the tests must prove

- A valid caller succeeds; a missing, expired, or tampered credential is rejected.
- A caller with the wrong role is rejected (403), and a caller reaching for another
  user's or tenant's record is rejected.
- Login, reset, and one-time-code endpoints are rate-limited.
- Logout, password change, and role removal actually end access.
