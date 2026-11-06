---
name: eaz-ghana-payments
description: Integrate Ghana payment rails including Paystack, Hubtel, and Mobile
  Money. Use when initiating charges, verifying payment callbacks and signatures,
  handling pending states and reconciliation, processing refunds, or diagnosing
  failed and duplicated transactions.
license: MIT
metadata:
  author: Eazworld
  department: business-solutions
  version: "1.0.0"
---

# Ghana Payments

## 1. Overview & Purpose

Integrates the rails Ghana actually pays on: Paystack (cards and Mobile Money),
Hubtel, and direct Mobile Money collections across MTN, Telecel, and AT. Target users
are developers and operations teams wiring collections, refunds, and reconciliation
into their products. Provider architecture: charge initiated server-side → customer
completes on the provider's hosted flow → asynchronous callback verified by
signature → ledger updated idempotently → reconciliation confirms nothing was
missed. The defining constraint: Mobile Money is asynchronous and occasionally
flaky — `pending` is a first-class state, never an error to guess about.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to integrate Paystack, Hubtel, or Mobile Money
  collections.
- **Trigger 2:** When verifying payment callbacks, signatures, or webhook payloads.
- **Trigger 3:** When reconciling pending, failed, or duplicated transactions.
- **Trigger 4:** When processing refunds or diagnosing money that moved but was not
  recorded.
- **Anti-Trigger:** Do not activate for cart and checkout UX flows (route to
  eaz-ecommerce-development), generic API design (route to eaz-api-development), or the
  offline POS tender queue (route to eaz-pos-inventory).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The providers in use and their products: collections, transfers, refunds.
  2. The money model: amounts in minor units, currency GHS, and who may refund.
  3. The callback endpoints: URLs, secrets, and which environment they belong to.
- **Research & Audience Audit Checklist:**
  1. Review the existing integration: how charges are initiated and where
     callbacks land today.
  2. Read recent callback logs: signature rejections, missed deliveries, and
     retries.
  3. Pull reconciliation reports and find where ledger and provider disagree.
  4. Confirm test versus live credentials are separated per environment.

## 4. Technical Standards & Rules

- Callback verification is mandatory and provider-specific: Paystack's
  `x-paystack-signature` is HMAC-SHA512 of the raw body with the secret key,
  compared timing-safe; Hubtel and Mobile Money callbacks verify their documented
  signature or checksum before any parsing beyond transport.
- Idempotency is ledger-level: every callback credits by its unique event or
  reference exactly once — `INSERT ... ON CONFLICT DO NOTHING` semantics, so
  provider retries and replays are harmless by construction.
- Amounts are integers in minor units and re-verified against the expected charge —
  a callback claiming a different amount is rejected, not reconciled optimistically.
- Pending is honest: a charge waiting on network confirmation sits in `pending`
  with a reconciliation job that queries the provider — never flipped to paid on a
  browser redirect, never assumed failed.
- Refunds are role-gated and written to the audit log: who approved, which
  transaction, which amount — and partial refunds track remaining balance
  explicitly.
- RBAC is explicit: operations staff read transactions, support issues refunds
  within stated limits, administrators approve large refunds and configure
  providers — every money action is role-scoped.
- Payment record privacy: customer names, phone numbers, and references are masked
  in logs and exports, retention follows the finance policy, and nothing beyond the
  transaction need is stored.
- Secrets stay server-side: secret keys and webhook secrets live in environment
  variables only; the client never sees anything that can authorize money.

Example of timing-safe callback verification with one-credit crediting:

```ts
import crypto from 'node:crypto';

export function verifyPaystack(rawBody: string, header: string): boolean {
  const expected = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest('hex');
  return header.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected));
}

// credit by unique event id — replays and retries are harmless
await ledger.creditOnce(event.id, event); // ON CONFLICT DO NOTHING
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the providers, the flow (collection, refund, or
   reconciliation), and the money invariants that must hold.
2. **Step 2: Inspect Context** — Execute the audit checklist; report current
   integration state and disagreement points before changing anything.
3. **Step 3: Formulate Plan** — Draw the flow end to end: initiate → provider →
   callback → verify → credit once → reconcile, including failure branches.
4. **Step 4: Verify Security** — Confirm signature verification, amount checks,
   idempotent crediting, and that no secret enters the diff.
5. **Step 5: Apply Edits** — Implement verification and ledger crediting first,
   then initiation, then refunds and reconciliation.
6. **Step 6: Execute Tests** — In test mode: complete a charge, replay its callback
   to prove single credit, send a forged signature to prove rejection, and force a
   pending state to prove reconciliation resolves it.
7. **Step 7: Report Status** — Report flows shipped, verification and replay
   evidence, and any reconciliation gaps.

## 6. Security & Edge Case Guidelines

- **Environment Isolation:** Secret keys and webhook secrets come from environment
  variables only, separated per environment — test secrets never touch production
  code and live secrets never touch a repository, log, or error message.
- **Signature Verification:** Verify on the raw body before parsing; compare
  timing-safe; reject on mismatch without side effects — an unsigned callback
  changes nothing.
- **Idempotency:** Callback handling is a pure function of event ID — replays,
  retries, and duplicates produce the same ledger result: exactly one credit.
- **Reconciliation Edges:** Late callbacks (minutes to hours on Mobile Money) are
  expected — the reconciliation job covers the gap; a callback for an unknown
  reference lands in a review queue with an alert, never silently posted.
- **Refund and Chargeback Edges:** Refunds require role approval and leave an audit
  entry; chargebacks are recorded as their own ledger event so the balance sheet
  still balances; PCI scope stays minimal — hosted flows mean no card data touches
  the system.

## 7. Definition of Done & Quality Gates

- [ ] Callback signatures verified per provider; forged callback rejected (tested).
- [ ] Replay of a valid callback credits exactly once (tested).
- [ ] Amount mismatch rejected; pending states resolve through reconciliation
      (tested).
- [ ] Refunds role-gated, audited, and balance-tracked.
- [ ] No secrets anywhere except environment variables.
- [ ] Test and live credentials strictly separated.
- [ ] KPIs defined with baseline and target — callback success rate, pending age,
      and ledger-versus-provider disagreement count.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; each provider's official API
  and webhook documentation is the reference at implementation time.
