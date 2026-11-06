---
name: eaz-restaurant-management
description: Build restaurant operations systems. Use when designing menus, table and
  kitchen display workflows, order routing, modifiers and bill splits, delivery
  coordination, or tying kitchen tickets to inventory deduction.
license: MIT
metadata:
  author: Eazworld
  department: business-solutions
  version: "1.0.0"
---

# Restaurant Management

## 1. Overview & Purpose

Builds the flow from order to plate to payment: menus, table and counter orders,
kitchen display routing, modifiers, bill splits, delivery, and inventory deduction.
Target users are restaurant owners and managers whose service breaks when tickets
stop. Order architecture: order captured (dine-in, takeaway, or delivery) → kitchen
ticket → preparation states → service → settlement, with payment callbacks verified
server-side and settlement idempotent. The defining constraint: the kitchen runs at
peak when networks are worst — order flow must survive offline stretches without
losing or duplicating a ticket.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build menus, ordering, or table management
  features.
- **Trigger 2:** When designing kitchen display routing, preparation states, or
  delivery coordination.
- **Trigger 3:** When handling modifiers, bill splits, discounts, or settlement
  including Mobile Money callbacks.
- **Trigger 4:** When order flow must keep working through network drops.
- **Anti-Trigger:** Do not activate for generic retail checkout and stock ledgers
  (route to eaz-pos-inventory), payment rail specifics (route to eaz-ghana-payments), or the
  customer-facing marketing site (route to eaz-frontend-design).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The service model: dine-in, takeaway, delivery — and how each is captured.
  2. The menu: items, variants, modifiers, dayparts, and 86ing rules.
  3. The settlement mix: cash, card, Mobile Money, splits, and who may discount.
- **Research & Audience Audit Checklist:**
  1. Watch a real service: where do orders stall — capture, kitchen, or payment.
  2. Review void, comp, and discount history for abuse patterns.
  3. Map connectivity reality in the kitchen and at the counter.
  4. Check how inventory is consumed today and where waste disappears unrecorded.

## 4. Technical Standards & Rules

- RBAC is explicit: owners read reports, managers configure menus and prices,
  cashiers settle bills, waiters capture orders for their section, kitchen staff see
  tickets only — every discount and void role-scoped with reason codes.
- Order states are explicit and forward-moving: `received → confirmed → preparing →
  serving → settled`, with `cancelled` carrying a reason; tickets never skip states
  silently, and the kitchen display renders state, not intentions.
- Offline-first order capture: tickets write to a local queue, service continues
  through network drops, and sync replays idempotently — one order, one ticket, one
  inventory deduction.
- Settlement callbacks for card and Mobile Money are signature-verified and
  idempotent: a retried callback settles the bill exactly once, and splits reconcile
  per tender.
- Menu, pricing, and tax configuration live in settings — items change daily and
  levies change periodically; nothing is hardcoded.
- Privacy: customer contact details collected for delivery are used only for the
  order, masked in logs, and retained no longer than the stated window.
- Inventory deduction happens at consumption confirmation with a movement record, so
  the kitchen's reality and the stock ledger agree.

Example of an order ticket and its legal transitions:

```json
{
  "orderId": "ord_2026_1105_018",
  "table": "T4",
  "state": "preparing",
  "items": [{ "sku": "jollof_chicken", "mods": ["extra_shito"], "qty": 1 }],
  "history": ["received", "confirmed", "preparing"],
  "allowedNext": ["serving", "cancelled"]
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the service model, the order paths in scope,
   and what a correct ticket must carry.
2. **Step 2: Inspect Context** — Execute the audit checklist; report where service
   stalls today before designing.
3. **Step 3: Formulate Plan** — Draw the order state machine and kitchen routing
   first, then settlement and inventory on top.
4. **Step 4: Verify Security** — Confirm role scoping on voids and discounts,
   callback verification, and environment-only payment keys.
5. **Step 5: Apply Edits** — Implement the state machine and queue first, then
   capture, display, settlement, and deduction.
6. **Step 6: Execute Tests** — Run a full service simulation including a forced
   network drop, replay a settlement callback to prove single credit, and verify a
   split bill reconciles per tender.
7. **Step 7: Report Status** — Report what shipped, offline and settlement
   evidence, and open items.

## 6. Security & Edge Case Guidelines

- **Environment Isolation:** Payment keys live in environment variables only; staff
  sign in individually — shared waiter logins make voids unattributable.
- **Callback Verification:** Verify signature and amount on settlement callbacks;
  unsigned or mismatched callbacks never mark a bill settled.
- **Idempotency:** Order sync, settlement callbacks, and inventory deductions carry
  stable keys — retries never duplicate a ticket, a charge, or a stock decrement.
- **Abuse Edges:** Voids, comps, and discounts require role, reason code, and audit
  entry; an unusually high comp rate per staff member surfaces in reports rather
  than hiding in the ledger.
- **Service Edge Cases:** An offline ticket arriving after the table closed settles
  through the reconciliation path with a human, never by guessing; delivery orders
  track rider handoff so responsibility is never ambiguous.

## 7. Definition of Done & Quality Gates

- [ ] Order state machine implemented; no silent state skips in tests.
- [ ] Offline capture → reconnect → single ticket proven.
- [ ] Settlement callback verified; replay settles exactly once; splits reconcile.
- [ ] Voids and discounts role-gated with reason codes and audit entries.
- [ ] Inventory deduction matches confirmed consumption in tests.
- [ ] No payment keys outside environment variables.
- [ ] KPIs defined with baseline and target — table turn time, order-to-serve time,
      void rate, and stock variance.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the venue's own menu,
  service, and cash policies are the reference at implementation time.
