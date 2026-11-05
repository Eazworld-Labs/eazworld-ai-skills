---
name: school-management
description: Manage school operations including students, classes, attendance,
  gradebooks, and fee collection. Use when building enrollment and rosters, recording
  grades or attendance, invoicing school fees with Paystack or Mobile Money,
  designing parent portals, or defining staff and parent data access.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# School Management

## 1. Overview & Purpose

Builds the operational core of a school: enrollment, class rosters, attendance,
gradebooks, timetables, and fee collection. Target users are administrators, teachers,
and bursars who need accurate records and parents who need trustworthy visibility.
Payment architecture for fees: invoice issued by the system, customer redirected to
Paystack or Mobile Money, callback verified server-side, invoice credited
idempotently. The defining constraint: most records describe minors — privacy and
access control are not optional extras here.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build student, enrollment, class, or roster
  features.
- **Trigger 2:** When recording attendance, grades, report cards, or timetables.
- **Trigger 3:** When invoicing and collecting school fees, including Paystack or
  Mobile Money callbacks.
- **Trigger 4:** When defining who may see which records — staff, parents, or
  students.
- **Anti-Trigger:** Do not activate for general payment rail integration details
  (route to ghana-payments), generic CRM contact sync (route to crm-automation), or
  building the parent-facing UI polish (route to frontend-design).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The school structure: terms, grades, classes, sections, and enrollment flow.
  2. The fee model: items, installments, discounts, and who is authorized to grant
     them.
  3. Role definitions: who works in the office, who teaches, who pays.
- **Research & Audience Audit Checklist:**
  1. Map existing records — paper or spreadsheet — and their data quality before
     migrating.
  2. Review how fees are collected today: cash, bank transfer, or mobile money, and
     where reconciliations fail.
  3. Identify sensitive records: medical notes, guardianship, and discipline files.
  4. Confirm consent and disclosure rules for contacting parents.

## 4. Technical Standards & Rules

- RBAC is explicit: administrators configure, teachers write only their own classes'
  attendance and grades, bursar handles fees, parents read only their children,
  students read only their own record — every query scoped by role.
- Student data privacy follows Ghana's Data Protection Act and the equivalent
  principle everywhere: collect what the school needs, expose nothing extra, and
  define retention for alumni records.
- Audit logging is immutable: grade changes, fee adjustments, enrollment edits, and
  record access log who, what, and when — grades especially, since they are contested
  territory.
- Fee payments: the callback signature is verified server-side and every callback is
  idempotent — a retried webhook credits the invoice exactly once, and the browser
  redirect is never trusted as proof of payment.
- Fee and levy configuration lives in settings, never hardcoded — rates and items
  change between terms.
- Attendance works offline: classrooms with poor connectivity queue entries locally
  and sync idempotently when the connection returns, without duplicating or losing a
  register.

Example of the role matrix every query is scoped against:

```json
{
  "roles": {
    "admin": ["students.*", "fees.*", "reports.*"],
    "teacher": ["attendance.write:own_class", "grades.write:own_class"],
    "bursar": ["fees.read", "fees.record_payment"],
    "parent": ["children.read:own"],
    "student": ["profile.read:own"]
  }
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the school process in scope, the roles touching
   it, and the records it creates.
2. **Step 2: Inspect Context** — Execute the audit checklist; report the current
   record sources and fee collection reality before designing.
3. **Step 3: Formulate Plan** — Draw the data model and role matrix first, then the
   flows: enrollment, attendance, grading, and fee invoicing to callback.
4. **Step 4: Verify Security** — Confirm role scoping, privacy of minor data, audit
   log coverage, and environment-only payment keys.
5. **Step 5: Apply Edits** — Implement in dependency order: structure and roles,
   then records, then payments with verification and idempotency from day one.
6. **Step 6: Execute Tests** — Run role-crossing access tests (a parent cannot read
   another child), replay a payment callback to prove single credit, and simulate an
   offline attendance sync.
7. **Step 7: Report Status** — Report what shipped, access-control and callback
   evidence, and open items.

## 6. Security & Edge Case Guidelines

- **Environment Isolation:** Payment and messaging API keys live in environment
  variables only — never in code, configs, or client-facing pages.
- **Callback Verification:** Verify signature and amount on every payment callback;
  unsigned or mismatched callbacks are rejected before any record changes.
- **Idempotency:** Payment callbacks, attendance sync, and enrollment submissions
  carry stable keys — retries never double-credit or double-enroll.
- **RBAC Edges:** Privilege escalation paths are tested directly: a teacher changing
   another teacher's class, a parent viewing a sibling's record — all denied by
   default, allowed only by explicit grant.
- **Privacy Edges:** Exports and reports are role-scoped like every other read;
  guardianship disputes and medical information get the narrowest access list
  defined in writing.

## 7. Definition of Done & Quality Gates

- [ ] Role matrix implemented and crossing-role access tests pass.
- [ ] Audit log captures grade, fee, and enrollment changes immutably.
- [ ] Payment callback signature verified; replay credits exactly once (tested).
- [ ] Offline attendance queue syncs without duplicates or loss (tested).
- [ ] No payment or messaging keys outside environment variables.
- [ ] KPIs defined with baseline and target — attendance capture rate, fee
      collection rate, and reconciliation time.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the school's own policy
  documents and fee schedules are the reference at implementation time.
