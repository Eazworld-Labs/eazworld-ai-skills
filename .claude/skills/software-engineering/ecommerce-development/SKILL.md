---
name: ecommerce-development
description: Build e-commerce features end to end: product catalogs, carts, checkout
  flows, payment gateways, and order management. Use when integrating Paystack, Hubtel,
  or Ghana Mobile Money, building storefront pages, handling payment webhooks, or
  designing inventory and order lifecycle logic.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# E-commerce Development

## 1. Overview & Purpose

Builds the commerce domain: catalog, cart, checkout, payment, order, and fulfillment.
Money and stock correctness come before everything else — prices are recalculated on the
server, inventory is guarded against overselling, and payment events arrive twice without
causing double charges. Optimized for the Ghana market: GHS pricing, Paystack and Hubtel
gateways, and Mobile Money flows where the network is not always reliable.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build product, cart, checkout, or order features.
- **Trigger 2:** When integrating payment providers — Paystack, Hubtel, MTN/Telecel/AT
  Mobile Money — including webhook handlers.
- **Trigger 3:** When fixing payment discrepancies, stock overselling, or order state
  bugs.
- **Anti-Trigger:** Do not activate for generic API contract design (route to
  api-development) or pure UI styling with no commerce logic (route to frontend-design).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. Business rules: currency, pricing and discount rules, tax, shipping, refund policy.
  2. Payment provider documentation for the chosen gateway (sandbox credentials names).
  3. Product data shape and inventory rules (is stock tracked, is it reserved).
- **Codebase Audit Checklist:**
  1. Inspect existing cart, order, and payment code — extend it, never fork a second
     checkout path.
  2. Check which provider SDKs and webhook handlers already exist.
  3. Review the environment schema for provider key names (never their values).
  4. Read existing tests around money and stock handling.

## 4. Technical Standards & Rules

- Server-authoritative totals: the client sends a cart, the server recomputes prices,
  discounts, and stock — never trust a client-supplied total.
- Money is stored and computed in minor units (pesewas/cents) as integers — no floating
  point arithmetic on currency.
- Orders follow an explicit state machine: `pending → paid → shipped → delivered`, with
  `cancelled` and `refunded` branches; states move forward only through validated events.
- Checkout and webhook handling are idempotent — a retried request or a replayed webhook
  never double-charges or double-fulfills.
- Inventory is confirmed inside the payment-confirmation transaction (row lock or
  conditional update) so concurrent buyers cannot oversell.
- Provider integration starts in sandbox mode and switches to live only after an
  end-to-end sandbox pass.

Example of an idempotent webhook handler:

```ts
app.post('/webhooks/paystack', async (req, res) => {
  verifySignature(req); // shared secret read from the environment
  const event = parseEvent(req.body);

  const firstTime = await markEventProcessed(event.id); // unique insert
  if (!firstTime) return res.sendStatus(200); // replay — already handled

  await applyEvent(event);
  res.sendStatus(200);
});
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the flow to build or fix, the provider involved, and
   the money/stock invariants that must hold.
2. **Step 2: Inspect Context** — Execute the audit checklist; map the existing order
   states and checkout path before changing them.
3. **Step 3: Formulate Plan** — Draw the flow end to end: cart → checkout → provider →
   webhook → order state → confirmation, including failure branches.
4. **Step 4: Verify Security** — Confirm webhook signature verification, server-side
   price recomputation, and that no secret will enter the diff.
5. **Step 5: Apply Edits** — Implement in vertical slices: checkout endpoint, webhook
   handler, state transition, then the UI that calls them.
6. **Step 6: Execute Tests** — Run the suite plus a sandbox pass: pay, receive webhook,
   verify the order; replay the webhook and verify nothing breaks.
7. **Step 7: Report Status** — Report the flow shipped, sandbox results, and any
   reconciliation or edge cases left open.

## 6. Security & Edge Case Guidelines

- **Price Tampering:** Recompute every amount server-side; a client total is a display
  value, never a source of truth.
- **Webhook Verification:** Verify the provider signature with the shared secret from the
  environment and enforce a replay window before trusting the payload.
- **Card Data:** Never store card numbers or CVV — use the provider's hosted pages or
  tokenization to stay out of PCI scope.
- **Zero Hardcoding:** Provider secrets come from environment variables only; sandbox and
  live keys never appear in code, logs, or the repository.
- **Race Conditions:** Concurrent checkout attempts must not oversell — guard stock
  updates with transactions and conditional writes.
- **Network Failures:** Mobile Money flows can time out after the customer was debited —
  design the order for a `pending` state with reconciliation via provider status queries,
  never an assumption of failure.

## 7. Definition of Done & Quality Gates

- [ ] Sandbox end-to-end pass: payment → webhook → order reaches `paid`.
- [ ] Webhook replay produces no duplicate charge or duplicate order update.
- [ ] Totals verified against server-side calculation, stored in minor units.
- [ ] Stock guarded against concurrent overselling (test proves it).
- [ ] No card data stored; no secrets in code, logs, or the diff.
- [ ] Test suite, lint, and type-check pass.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; provider specifics come from the
  official Paystack, Hubtel, and Mobile Money documentation at implementation time.
