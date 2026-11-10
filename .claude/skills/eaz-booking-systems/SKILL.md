---
name: eaz-booking-systems
description: Build booking and scheduling systems. Use when designing availability
  calendars, slot and resource management, deposits and confirmations, reminders and
  no-show policies, or preventing double bookings with idempotent reservations.
license: MIT
metadata:
  author: Eazworld
  department: business-solutions
  version: "1.0.0"
---

# Booking Systems

## 1. Overview & Purpose

Builds scheduling that two customers can never fight over: availability engines,
resources, slots, deposits, confirmations, reminders, and no-show handling. Target
users are service businesses — salons, clinics, studios, vehicle rentals — where an
overbooked calendar costs money and trust. Booking architecture: availability engine
computes open slots → tentative hold with expiry → deposit through Paystack or Mobile
Money with verified callback → confirmation → reminders, with every state change
idempotent. The defining constraint: concurrency — the same slot sold twice is the
failure this design exists to prevent.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build availability calendars, slots, or
  resource scheduling.
- **Trigger 2:** When adding deposits, confirmations, cancellations, or rescheduling
  rules.
- **Trigger 3:** When sending reminders or enforcing no-show and late policies.
- **Trigger 4:** When double bookings, deposit conflicts, or reminder failures occur.
- **Anti-Trigger:** Do not activate for internal staff meeting scheduling (routine
  calendars), payment rail specifics (route to eaz-payments), or CRM follow-up
  automation (route to eaz-crm-automation).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The resources: staff, rooms, vehicles — and what makes them bookable.
  2. The availability rules: hours, buffers, breaks, and capacity per slot.
  3. The money rules: deposit required, cancellation window, and refund policy.
- **Research & Audience Audit Checklist:**
  1. Review how bookings are taken today and where double bookings happened.
  2. Map the no-show reality: rates, patterns, and what the business currently
     loses.
  3. Check reminder channels actually reaching customers (SMS, WhatsApp, email).
  4. Identify peak contention — the slots everyone wants — before setting hold
     rules.

## 4. Technical Standards & Rules

- RBAC is explicit: administrators configure resources and policies, staff manage
  their own calendars, clients book and read only their own reservations — every
  query scoped by role.
- Concurrency is solved at the database: slot uniqueness or row locks make the
  second booking for an occupied slot fail cleanly; application-level checks alone
  are not enough.
- Holds expire: a tentative reservation releases its slot after a stated window so
  abandoned checkouts do not block the calendar.
- Deposit payments carry an idempotency key per booking — a retried callback
  confirms the booking exactly once and never double-charges; the browser redirect
  is never proof of payment.
- Audit logging is immutable: booking creation, changes, cancellations, and refund
  decisions record who, what, and when — disputes are routine in scheduling.
- Privacy: booking details are visible only to the client and assigned staff;
  reminders queue offline and send on reconnect without duplicating messages.

Example of a confirmed booking with an idempotent deposit:

```json
{
  "bookingId": "bkg_8871",
  "slot": "2026-11-08T10:30:00+00:00",
  "resource": "stylist_ade",
  "holdExpiresAt": "2026-11-05T18:00:00+00:00",
  "deposit": {
    "amountMinor": 5000,
    "currency": "GHS",
    "idempotencyKey": "bkg_8871_deposit"
  },
  "state": "confirmed"
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the resources, availability rules, and the
   deposit policy to enforce.
2. **Step 2: Inspect Context** — Execute the audit checklist; report how bookings
   are taken today and where conflicts occur.
3. **Step 3: Formulate Plan** — Draw the availability and hold model first, then
   booking, deposit, and reminder flows on top.
4. **Step 4: Verify Security** — Confirm role scoping, deposit callback
   verification, and environment-only payment keys.
5. **Step 5: Apply Edits** — Implement the concurrency control and hold expiry
   first, then booking flows, deposits, and reminders.
6. **Step 6: Execute Tests** — Fire two simultaneous bookings for one slot and
   prove exactly one wins, replay a deposit callback to prove single confirmation,
   and verify hold expiry releases the slot.
7. **Step 7: Report Status** — Report what shipped, concurrency and callback
   evidence, and open policy items.

## 6. Security & Edge Case Guidelines

- **Environment Isolation:** Payment and messaging keys live in environment
  variables only — never in code, configs, or calendar pages.
- **Callback Verification:** Verify signature and amount on deposit callbacks;
  unsigned or mismatched callbacks never confirm a booking.
- **Idempotency:** Booking submissions, deposit callbacks, and reminders carry
  stable keys — a client double-tapping confirm creates one reservation and one
  charge.
- **Concurrency Edges:** Holds, cancellations, and reschedules all re-check
  availability under the same lock discipline; a reschedule releases the old slot
  atomically with claiming the new one.
- **Policy Edges:** No-show and late-cancellation rules are stated to the client
  before payment and enforced by the audit trail — refunds follow policy with a
  recorded decision, not an ad-hoc refund button.

## 7. Definition of Done & Quality Gates

- [ ] Simultaneous double-booking test: exactly one reservation wins.
- [ ] Hold expiry releases slots; expired holds cannot confirm.
- [ ] Deposit callback verified; replay confirms exactly once; no double charge.
- [ ] Reschedule releases and claims slots atomically.
- [ ] Reminders queue and send without duplicates after a connectivity gap.
- [ ] No keys outside environment variables.
- [ ] KPIs defined with baseline and target — booking conversion, no-show rate, and
      double-booking count (target zero).

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the business's own scheduling
  and refund policies are the reference at implementation time.
