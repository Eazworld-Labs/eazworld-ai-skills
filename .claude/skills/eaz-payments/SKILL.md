---
name: eaz-payments
description: Integrate Ghana and Nigeria payment rails including Paystack, Hubtel,
  Mobile Money, Flutterwave, OPay, and bank transfers. Use when initiating charges,
  verifying payment callbacks and signatures, handling pending states and reconciliation,
  processing refunds, or diagnosing failed and duplicated transactions.
license: MIT
metadata:
  author: Eazworld
  department: business-solutions
  version: "1.1.0"
---

# Payments (Ghana & Nigeria)

## 1. Overview & Purpose

Integrates the payment rails West African customers actually pay on. Ghana: Paystack
(cards and Mobile Money), Hubtel, and direct Mobile Money collections across MTN,
Telecel, and AT — currency GHS. Nigeria: Paystack (cards, transfers, USSD), Flutterwave
(cards, USSD, bank transfer collections), OPay merchant payments, and direct bank
transfers into virtual or dedicated accounts — currency NGN.

Target users are developers and operations teams wiring collections, refunds, and
reconciliation into e-commerce websites, mobile applications, SaaS platforms,
marketplaces, and other digital products. Provider architecture: charge initiated
server-side → customer completes on the provider's hosted flow or USSD session →
asynchronous callback/webhook verified by signature → ledger updated idempotently →
reconciliation confirms nothing was missed. The defining constraint: Mobile Money, bank
transfers, and USSD resolve asynchronously and occasionally late — `pending` is a
first-class state, never an error to guess about.

**Country codes:** Ghana = GH, Nigeria = NG.

**Cross-country rule:** Never assume that a payment method available in one country is
available in the other. MTN Mobile Money, Telecel Cash, and AT Money are Ghana-only;
USSD, Verve, and Nigerian bank apps/wallets are Nigeria-only. Always scope payment
methods to the selected country.


## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to integrate Paystack, Hubtel, Mobile Money, Flutterwave,
  OPay, or bank transfer collections for Ghana or Nigeria.
- **Trigger 2:** When verifying payment callbacks, signatures, or webhook payloads.
- **Trigger 3:** When reconciling pending, failed, or duplicated transactions.
- **Trigger 4:** When processing refunds or diagnosing money that moved but was not
  recorded — including USSD and transfer edge cases.
- **Trigger 5:** When building payments for e-commerce websites, mobile applications,
  SaaS platforms, or marketplaces — including split payments, vendor payouts, and escrow
  where applicable.
- **Anti-Trigger:** Do not activate for cart and checkout UX flows (route to
  `eaz-ecommerce-development`), generic API design (route to `eaz-api-development`), or
  the offline POS tender queue (route to `eaz-pos-inventory`).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The countries in scope (Ghana GH, Nigeria NG, or both) and the providers in use and their
     products: collections, transfers, USSD, refunds.
  2. The money model: amounts in minor units, currency (GHS pesewas or NGN kobo), and
     who may refund.
  3. The callback endpoints: URLs, secrets, and which environment they belong to.
  4. The product type: e-commerce website, mobile application, SaaS platform, marketplace,
     or other — this determines which payment methods and flows apply.
  5. Provider operational details: sandbox vs live credentials, webhook URLs, API versions,
     and any provider-specific requirements per country.
- **Research & Audience Audit Checklist:**
  1. Review the existing integration: how charges are initiated and where callbacks
     land today.
  2. Read recent callback/webhook logs: signature rejections, missed deliveries, and
     retries.
  3. Pull reconciliation reports and find where ledger and provider disagree.
  4. Confirm test versus live credentials are separated per environment.

## 4. Country Reference

| | Ghana (GH) | Nigeria (NG) |
| :--- | :--- | :--- |
| **Country code** | GH | NG |
| **Currency** | Ghanaian Cedi (GHS) | Nigerian Naira (NGN) |
| **Currency symbol** | GH₵ | ₦ |
| **Locale** | en-GH | en-NG |
| **Minor unit** | pesewas | kobo (100 kobo = ₦1) |
| **Phone calling code** | +233 | +234 |
| **Phone format** | +233 24 123 4567 | +234 803 123 4567 |
| **Date format** | DD/MM/YYYY | DD/MM/YYYY |
| **Time zone** | Africa/Accra | Africa/Lagos |
| **Card schemes** | Visa, Mastercard | Verve, Visa, Mastercard |
| **Mobile Money** | MTN Mobile Money, Telecel Cash, AT Money | USSD, bank apps, supported wallets |
| **Bank transfers** | Yes | Yes |
| **Providers** | Paystack, Hubtel, Mobile Money direct | Paystack, Flutterwave, OPay, bank transfers |

**Cross-country rule:** Never assume that a payment method available in one country is
available in the other. MTN Mobile Money, Telecel Cash, and AT Money are Ghana-only;
USSD, Verve, and Nigerian bank apps/wallets are Nigeria-only. Always scope payment
methods to the selected country and validate against the provider's supported method
list for that country before offering it at checkout.

See `eaz-frontend-design/references/localisation.md` for currency, phone, and date
formatting details.

## 5. Technical Standards & Rules

### Shared rules (all countries)

- **Cross-country assumption:** Never assume a payment method available in one country
  is available in the other. MTN Mobile Money, Telecel Cash, and AT Money are
  Ghana-only; USSD, Verve, and Nigerian bank apps/wallets are Nigeria-only. Scope
  payment methods to the selected country and validate against the provider's supported
  method list for that country before offering it at checkout.
- **Callback verification is mandatory and provider-specific:** Paystack's
  `x-paystack-signature` is HMAC-SHA512 of the raw body with the secret key, compared
  timing-safe; Flutterwave's `verif-hash` is HMAC-SHA256 of the raw payload with the
  webhook secret, compared timing-safe; Hubtel and Mobile Money callbacks verify their
  documented signature or checksum; OPay callbacks verify per OPay's documented signing
  scheme — an unverified callback changes nothing.
- **Idempotency is ledger-level:** every callback credits by its unique event or
  provider reference exactly once — `INSERT ... ON CONFLICT DO NOTHING` semantics, so
  provider retries and replays are harmless by construction.
- **Amounts are integers in minor units** and re-verified against the expected charge —
  a callback claiming a different amount is rejected, not reconciled optimistically.
- **Pending is honest:** a charge waiting on network confirmation sits in `pending`
  with a reconciliation job that queries the provider — never flipped to paid on a
  browser redirect, never assumed failed.
- **Refunds are role-gated and written to the audit log:** who approved, which
  transaction, which amount — and partial refunds track remaining balance explicitly.
- **RBAC is explicit:** operations staff read transactions, support issues refunds
  within stated limits, administrators approve large refunds and configure providers —
  every money action is role-scoped.
- **Payment record privacy:** customer names, phone numbers, and references are masked
  in logs and exports, retention follows the finance policy, and nothing beyond the
  transaction need is stored.
- **Secrets stay server-side:** secret keys and webhook secrets live in environment
  variables only; the client never sees anything that can authorize money.
- **Identity privacy (Nigeria):** customer BVN, NIN, and full account data are never
  logged or stored unless the product strictly requires them.

### Ghana-specific

- Mobile Money is asynchronous and occasionally flaky — `pending` is a first-class
  state, never an error to guess about.
- Late callbacks (minutes to hours on Mobile Money) are expected — the reconciliation
  job covers the gap; a callback for an unknown reference lands in a review queue with
  an alert, never silently posted.

### Nigeria-specific

- Bank transfers and USSD resolve asynchronously and late — `pending` is a first-class
  state, never an error to guess about.
- Flutterwave credits are additionally confirmed with a server-side transaction query
  before ledger credit.
- Late callbacks (minutes on transfers) are expected — the reconciliation job covers
  the gap; a callback for an unknown reference lands in a review queue with an alert,
  never silently posted.

### Product-Type Payment Guidance

- **E-commerce website:** Standard card, Mobile Money, and bank transfer flows with
  hosted checkout pages. Webhooks confirm payment asynchronously; order state moves
  `pending → paid → fulfilled` only on verified callback.
- **Mobile application:** Use provider SDKs or mobile-optimized checkout URLs. Mobile
  Money flows often redirect to the telco's USSD or SIM toolkit session — handle the
  return URL carefully and treat `pending` as normal until the callback arrives. Do not
  assume the user completed payment because they returned to the app.
- **SaaS platform:** Recurring billing (subscriptions) where supported; otherwise
  prepaid top-ups. Store payment method tokens via the provider's tokenization — never
  raw card data. Webhooks must handle failed recurring charges and downgrade access
  accordingly.
- **Marketplace:** Multi-party transactions — see Marketplace-specific rules below.

### Provider Operational Details

- **Sandbox vs live:** Always start in sandbox mode. Switch to live only after an
  end-to-end sandbox pass: charge → webhook → ledger credit → refund. Keep sandbox and
  live credentials strictly separated; never mix them in the same environment.
- **Webhook URLs:** Register a distinct webhook URL per environment (sandbox/live) and
  per provider. The endpoint must be publicly reachable and return `200` quickly after
  signature verification; offload heavy processing to a background job.
- **API versions:** Pin to a specific provider API version where possible; review
  provider changelogs before upgrading. Different providers may have different API
  versions for Ghana vs Nigeria — verify per country.

### Mobile App Considerations

- **Mobile Money flows:** The customer often leaves the app to complete USSD or SIM
  toolkit authentication on their telco. Handle deep-linking back to the app and
  treat `pending` as expected until the webhook confirms.
- **USSD sessions (Nigeria):** USSD is session-based and stateful; the customer dials a
  code and navigates menus on their phone. Do not assume instant completion — poll or
  wait for the webhook.
- **Bank apps and wallets:** Some providers redirect to the customer's banking app.
  Support `universal links`/`app links` for return navigation and verify payment
  status via webhook, not app return state.
- **Native vs web:** Prefer provider SDKs for native apps; use mobile-optimized hosted
  checkout for web views. Test on real devices — telco simulators rarely replicate
  Mobile Money behavior accurately.

### Marketplace-specific


- **Split payments:** When a marketplace facilitates a transaction between a buyer and a
  vendor, split the payment at the provider level where supported (Paystack Split
  Payments, Flutterwave Subaccounts) rather than collecting the full amount and
  remitting manually.
- **Vendor payouts:** Payouts to vendors are separate ledger events from customer
  collections; track them independently with their own reconciliation cycle.
- **Escrow:** If the product holds funds in escrow (e.g., until delivery is confirmed),
  model escrow as a distinct balance state — funds are not available to the vendor
  until the escrow condition is met.
- **Commission and fees:** Deduct marketplace commission at the time of collection and
  record it as a separate line item; never net it silently from the vendor's payout.
- **Disputes and chargebacks:** Marketplaces are liable for disputes on transactions
  they facilitate; maintain a dispute handling flow that notifies both buyer and vendor.

## 6. Code Examples

### Timing-safe callback verification (all providers)

```ts
import crypto from 'node:crypto';

type Provider = 'paystack' | 'flutterwave' | 'hubtel' | 'momo' | 'opay';

function verify(
  provider: Provider,
  rawBody: string,
  header: string,
): boolean {
  const secretName =
    provider === 'paystack'
      ? 'PAYSTACK_SECRET_KEY'
      : provider === 'flutterwave'
        ? 'FLUTTERWAVE_WEBHOOK_SECRET'
        : provider === 'opay'
          ? 'OPAY_WEBHOOK_SECRET'
          : `${provider.toUpperCase()}_SECRET_KEY`;
  const secret = process.env[secretName]!;
  const algo = provider === 'flutterwave' ? 'sha256' : 'sha512';
  const expected = crypto
    .createHmac(algo, secret)
    .update(rawBody)
    .digest('hex');
  return (
    header.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(header), Buffer.from(expected))
  );
}
```

### Idempotent crediting

```ts
// credit by unique event id or provider reference — replays and retries are harmless
await ledger.creditOnce(event.id ?? event.reference, event); // ON CONFLICT DO NOTHING
```

### Marketplace split payment (Paystack Subaccount example)

```ts
import { splitPayment } from '@/lib/payments/paystack';

// Collect from customer, split to vendor and marketplace at charge time
await splitPayment({
  amount: 100000, // ₦1,000.00 in kobo
  subaccount: vendor.subaccountId, // vendor receives their share
  transactionCharge: 5000, // marketplace commission in kobo (₦50.00)
  bearer: 'subaccount', // who bears the transaction fee
});
```


## 7. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the countries, providers, the flow (collection,
   refund, or reconciliation), and the money invariants that must hold.
2. **Step 2: Inspect Context** — Execute the audit checklist; report current
   integration state and disagreement points before changing anything.
3. **Step 3: Formulate Plan** — Draw the flow end to end: initiate → provider →
   callback/webhook → verify → credit once → reconcile, including failure branches.
4. **Step 4: Verify Security** — Confirm signature verification, amount checks,
   idempotent crediting, and that no secret enters the diff.
5. **Step 5: Apply Edits** — Implement verification and ledger crediting first,
   then initiation, then refunds and reconciliation.
6. **Step 6: Execute Tests** — In test mode: complete a charge, replay its callback
   to prove single credit, send a forged signature to prove rejection, and force a
   pending state to prove reconciliation resolves it.
7. **Step 7: Report Status** — Report flows shipped, verification and replay
   evidence, and any reconciliation gaps.

## 8. Security & Edge Case Guidelines

- **Environment Isolation:** Secret keys and webhook secrets come from environment
  variables only, separated per environment — test secrets never touch production
  code and live secrets never touch a repository, log, or error message.
- **Signature Verification:** Verify on the raw body before parsing; compare
  timing-safe; reject on mismatch without side effects — an unsigned callback
  changes nothing.
- **Idempotency:** Callback handling is a pure function of event ID or provider
  reference — replays, retries, and duplicates produce the same ledger result:
  exactly one credit.
- **Reconciliation Edges:** Late callbacks are expected — the reconciliation job
  covers the gap; a callback for an unknown reference lands in a review queue with an
  alert, never silently posted.
- **Refund and Chargeback Edges:** Refunds require role approval and leave an audit
  entry; chargebacks are recorded as their own ledger event so the balance sheet still
  balances; PCI scope stays minimal — hosted flows mean no card data touches the
  system.

## 9. Definition of Done & Quality Gates

- [ ] Callback signatures verified per provider; forged callback rejected (tested).
- [ ] Replay of a valid callback credits exactly once (tested).
- [ ] Amount mismatch rejected; pending states resolve through reconciliation
      (tested).
- [ ] Refunds role-gated, audited, and balance-tracked.
- [ ] No secrets anywhere except environment variables.
- [ ] Test and live credentials strictly separated.
- [ ] KPIs defined with baseline and target — callback success rate, pending age,
      and ledger-versus-provider disagreement count.
- [ ] Cross-country payment method scoping verified — Ghana-only methods not offered
      in Nigeria and vice versa.
- [ ] Mobile app flows tested on real devices — return URLs, USSD sessions, and bank
      app redirects handled correctly.
- [ ] Marketplace split payments verified — vendor share and marketplace commission
      settled correctly (if applicable).

## 10. Supporting References & Assets

- [Localisation](../eaz-frontend-design/references/localisation.md) — currency,
  phone, and date formatting for Ghana and Nigeria.
- [E-commerce Development](../eaz-ecommerce-development/SKILL.md) — cart/checkout
  UX flows, server-authoritative totals, minor-unit storage.
- No supporting files — each provider's official API and webhook documentation is the
  reference at implementation time.
