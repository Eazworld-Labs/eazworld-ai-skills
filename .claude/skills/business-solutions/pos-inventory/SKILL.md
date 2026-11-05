---
name: pos-inventory
description: Build point-of-sale and inventory systems. Use when designing checkout
  flows, barcode scanning, stock movements, shift cash-ups, multi-outlet inventory,
  Ghana tax configuration, or offline-first POS with a local queue and sync.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# POS & Inventory

## 1. Overview & Purpose

Builds the counter: checkout, barcode scanning, stock movements, shift cash-ups, and
multi-outlet inventory that stays correct when the network does not. Target users are
retail teams whose margin lives in accurate stock and clean cash-ups. Payment
architecture: tender captured through card, Mobile Money, or cash, provider callbacks
verified server-side, and an offline queue that replays idempotently when the
connection returns. The defining constraint: this system runs when everything around
it fails — offline-first is the default, not a fallback.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build checkout, receipt, or barcode scanning
  flows.
- **Trigger 2:** When managing stock movements, reorder points, or multi-outlet
  inventory.
- **Trigger 3:** When designing shift cash-ups, tender counting, or variance
  reporting.
- **Trigger 4:** When a POS must work offline and sync without duplicating sales or
  overselling stock.
- **Anti-Trigger:** Do not activate for restaurant-specific kitchen and table
  workflows (route to restaurant-management), payment rail details (route to
  ghana-payments), or the storefront's e-commerce checkout (route to
  ecommerce-development).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The catalog: products, variants, barcodes, prices, and how tax applies.
  2. The tender mix: cash, card, Mobile Money, and split payments.
  3. The outlet structure: one store or many, and how stock moves between them.
- **Research & Audience Audit Checklist:**
  1. Review how sales and stock are recorded today and where variances appear.
  2. Map the cash-up process: who counts, who approves, and what happens on
     mismatch.
  3. Check connectivity reality per outlet — how often, and how long, the network
     drops.
  4. Identify shrinkage sources: voids, refunds, theft, and receiving errors.

## 4. Technical Standards & Rules

- RBAC is explicit: cashiers sell, supervisors approve voids, refunds, and price
  overrides, stock clerks record movements, owners read reports — every sensitive
  action role-scoped and named.
- Offline-first architecture: sales write to a local queue immediately, the device
  keeps selling without network, and sync replays each entry with a stable
  idempotency key so a reconnect never duplicates a sale.
- Stock is a ledger of movements (received, sold, adjusted, transferred) — never a
  mutable number; every movement carries source, actor, and timestamp.
- Tax and levy configuration lives in settings and updates without a release —
  Ghana's levies change; hardcoded rates become wrong silently.
- Payment callbacks for card and Mobile Money tenders are signature-verified and
  idempotent; an offline-tendered sale marked pending reconciles exactly once when
  the callback arrives.
- Privacy: customer details on receipts are minimal and masked in logs — name and
  phone only where the transaction needs them — with a stated retention window.
- Audit logging is immutable: voids, refunds, price overrides, and cash-up variances
  record who, what, and when — the cash-up depends on it.

Example of the offline sale queue and its replay rule:

```json
{
  "queue": [
    {
      "txId": "tx_local_0042",
      "tender": "momo",
      "amountMinor": 4500,
      "capturedOffline": true,
      "state": "pending_callback"
    }
  ],
  "replay": { "strategy": "idempotent_by_txId", "backoff": "exponential" }
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the outlet reality, the tender mix, and what a
   correct sale must produce.
2. **Step 2: Inspect Context** — Execute the audit checklist; report current stock
   and cash-up pain before designing.
3. **Step 3: Formulate Plan** — Draw the local queue and sync strategy first, then
   checkout, stock ledger, and cash-up flows on top.
4. **Step 4: Verify Security** — Confirm role scoping, callback verification, and
   that no key or PIN is stored in plaintext.
5. **Step 5: Apply Edits** — Implement the ledger and queue first, then checkout and
   tender flows, then reporting.
6. **Step 6: Execute Tests** — Run the offline scenario end to end (sell offline,
   reconnect, verify no duplicates), replay a payment callback, inject a duplicate
   stock entry, and force a cash-up variance path.
7. **Step 7: Report Status** — Report what shipped, offline and callback evidence,
   and open reconciliation items.

## 6. Security & Edge Case Guidelines

- **Environment Isolation:** Provider API keys live in environment variables only;
  staff access uses individual accounts with hashed PINs — no shared cashier logins.
- **Callback Verification:** Verify signature and amount on tender callbacks;
  unsigned or mismatched callbacks never mark a sale paid.
- **Idempotency:** The offline queue, callback replays, and stock sync all carry
  stable keys — one sale, one record, one stock decrement.
- **Offline Edge Cases:** Clock skew on queued devices is handled with server
  timestamps at sync time; conflicting stock edits resolve through the movement
  ledger, not last-write-wins; a queue older than its retention window is escalated
  to a human, not silently dropped.
- **Cash Integrity:** Price overrides and voids require supervisor role and reason
  codes; cash-up variances are reported, never auto-corrected.

## 7. Definition of Done & Quality Gates

- [ ] Offline sale → reconnect → sync proven with zero duplicates.
- [ ] Stock ledger balances after every test scenario; duplicate movement rejected.
- [ ] Callback signature verified; replay marks the sale paid exactly once.
- [ ] Void, refund, and override paths role-gated with reason codes.
- [ ] Cash-up variance flow reported, not auto-corrected.
- [ ] No keys or plaintext PINs anywhere.
- [ ] KPIs defined with baseline and target — stock accuracy, cash-up variance rate,
      and offline queue drain time.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the outlet's own cash-up
  policy and tax settings are the reference at implementation time.
