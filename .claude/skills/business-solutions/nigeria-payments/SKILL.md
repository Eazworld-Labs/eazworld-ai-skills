---
name: nigeria-payments
description: Integrate Nigerian payment rails: Paystack, Flutterwave, OPay, and bank
  transfers. Use when initiating kobo-denominated charges, verifying webhook
  signatures, handling USSD and transfer confirmations, processing refunds, or
  reconciling pending transactions.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Nigeria Payments

## 1. Overview & Purpose

Integrates the rails Nigeria actually pays on: Paystack (cards, transfers, USSD),
Flutterwave (cards, USSD, bank transfer collections), OPay merchant payments, and
direct bank transfers into virtual or dedicated accounts. Target users are developers
and operations teams wiring collections, refunds, and reconciliation into Nigerian
products. Provider architecture: charge initiated server-side in kobo → customer
completes on the provider's hosted flow or USSD session → asynchronous webhook
verified by signature → ledger credited idempotently by provider reference →
reconciliation confirms nothing was missed. The defining constraint: bank transfers
and USSD resolve asynchronously and late — `pending` is a first-class state, never
an error to guess about.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to integrate Paystack Nigeria, Flutterwave, OPay,
  or Nigerian bank transfer collection.
- **Trigger 2:** When verifying webhook signatures or processing payment callbacks.
- **Trigger 3:** When reconciling pending, failed, or duplicated transactions.
- **Trigger 4:** When processing refunds or diagnosing money that moved but was not
  recorded — including USSD and transfer edge cases.
- **Anti-Trigger:** Do not activate for Ghanaian rails (route to ghana-payments),
  cart and checkout UX flows (route to ecommerce-development), or the offline POS
  tender queue (route to pos-inventory).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The providers in use and their products: collections, USSD, transfers, refunds.
  2. The money model: amounts in minor units (kobo), currency NGN, and who may refund.
  3. The callback endpoints: URLs, secrets, and which environment they belong to.
- **Research & Audience Audit Checklist:**
  1. Review the existing integration: how charges are initiated and where callbacks
     land today.
  2. Read recent webhook logs: signature rejections, missed deliveries, and retries.
  3. Pull reconciliation reports and find where ledger and provider disagree.
  4. Confirm test versus live credentials are separated per environment.

## 4. Technical Standards & Rules

- Callback verification is mandatory and provider-specific: Paystack's
  `x-paystack-signature` is HMAC-SHA512 of the raw body with the secret key,
  compared timing-safe; Flutterwave's `verif-hash` is HMAC-SHA256 of the raw payload
  with the webhook secret, compared timing-safe; OPay callbacks verify per OPay's
  documented signing scheme — an unverified callback changes nothing.
- Idempotency is ledger-level: every callback credits by its provider reference
  exactly once — `INSERT ... ON CONFLICT DO NOTHING` semantics, so provider retries
  and replays are harmless by construction.
- Amounts are integers in kobo (100 kobo = ₦1) and re-verified against the expected
  charge — a callback claiming a different amount is rejected, not reconciled
  optimistically.
- Pending is honest: a transfer or USSD charge waiting on network confirmation sits
  in `pending` with a reconciliation job that queries the provider — never flipped
  to paid on a browser redirect, never assumed failed.
- RBAC is explicit: operations staff read transactions, support issues refunds
  within stated limits, administrators approve large refunds and configure
  providers — every money action is role-scoped.
- Refunds are role-gated and audited: who approved, which transaction, which
  amount — and partial refunds track remaining balance explicitly.
- Secrets stay server-side: secret keys, webhook secrets, and merchant credentials
  live in environment variables only; the client never sees anything that can
  authorize money, and customer BVN or NIN values are never logged or stored unless
  the product strictly requires them.

Example of per-provider timing-safe verification with one-credit crediting:

```ts
import crypto from 'node:crypto';

type Provider = 'paystack' | 'flutterwave';

function verify(provider: Provider, rawBody: string, header: string): boolean {
  const secret = process.env[
    provider === 'paystack' ? 'PAYSTACK_SECRET_KEY' : 'FLUTTERWAVE_WEBHOOK_SECRET'
  ]!;
  const expected = crypto
    .createHmac(provider === 'paystack' ? 'sha512' : 'sha256', secret)
    .update(rawBody)
    .digest('hex');
  return header.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected));
}

// credit by provider reference — replays and retries are harmless
await ledger.creditOnce(event.reference, event); // ON CONFLICT DO NOTHING
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the providers, the flow (collection, USSD,
   transfer, refund, or reconciliation), and the invariants that must hold.
2. **Step 2: Inspect Context** — Execute the audit checklist; report current
   integration state and disagreement points before changing anything.
3. **Step 3: Formulate Plan** — Draw the flow end to end: initiate → provider →
   webhook → verify → credit once → reconcile, including failure branches.
4. **Step 4: Verify Security** — Confirm signature verification, amount checks,
   idempotent crediting, and that no secret or identity number enters the diff.
5. **Step 5: Apply Edits** — Implement verification and ledger crediting first,
   then initiation, then refunds and reconciliation.
6. **Step 6: Execute Tests** — In test mode: complete a charge, replay its webhook
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
- **Idempotency:** Callback handling is a pure function of provider reference —
  replays, retries, and duplicates produce the same ledger result: exactly one
  credit.
- **Reconciliation Edges:** Late callbacks (minutes on transfers) are expected —
  the reconciliation job covers the gap; a callback for an unknown reference lands
  in a review queue with an alert, never silently posted; Flutterwave credits are
  additionally confirmed with a server-side transaction query before ledger credit.
- **Refund and Chargeback Edges:** Refunds require role approval and leave an audit
  entry; chargebacks are recorded as their own ledger event so the balance sheet
  still balances; PCI scope stays minimal — hosted flows mean no card data touches
  the system.
- **Identity Privacy:** Customer BVN, NIN, and full account data are masked in logs
  and exports, retention follows the finance policy, and nothing beyond the
  transaction need is stored.

## 7. Definition of Done & Quality Gates

- [ ] Callback signatures verified per provider; forged callback rejected (tested).
- [ ] Replay of a valid callback credits exactly once (tested).
- [ ] Amount mismatch rejected; pending states resolve through reconciliation
      (tested).
- [ ] Refunds role-gated, audited, and balance-tracked.
- [ ] No secrets and no customer identity numbers outside environment variables and
      logs, respectively.
- [ ] Test and live credentials strictly separated.
- [ ] KPIs defined with baseline and target — callback success rate, pending age,
      and ledger-versus-provider disagreement count.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; each provider's official API
  and webhook documentation is the reference at implementation time.
