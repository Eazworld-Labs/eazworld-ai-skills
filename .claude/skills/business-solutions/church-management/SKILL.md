---
name: church-management
description: Run church operations across members, groups, attendance, events, and
  giving. Use when managing member directories, tracking tithes and offerings
  through Paystack or Mobile Money, organizing small groups and events, or securing
  pastoral notes and giving records.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Church Management

## 1. Overview & Purpose

Runs the people side of a church: member directory, families, small groups,
attendance, events, and giving. Target users are pastors, administrators, and
treasurers who carry real trust — members share personal struggles and financial
records with the church. Payment architecture for giving: pledge or offering
initiated through Paystack or Mobile Money, callback verified server-side, giving
recorded idempotently. The defining constraint: pastoral notes are among the most
sensitive records any system can hold.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build member directories, family records, or
  small group management.
- **Trigger 2:** When tracking tithes, offerings, pledges, or giving campaigns with
  Paystack or Mobile Money.
- **Trigger 3:** When managing service attendance, events, or volunteer rosters.
- **Trigger 4:** When deciding who may read pastoral notes or giving records.
- **Anti-Trigger:** Do not activate for payment rail specifics (route to
  ghana-payments), email campaigns to the congregation (route to email-marketing), or
  social content for the church (route to social-media-management).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The ministry structure: services, groups, ministries, and who leads each.
  2. The giving model: tithes, offerings, pledges, campaigns, and how records are
     reconciled with the bank or wallet statements.
  3. Role definitions: who pastures, who leads groups, who counts and records money.
- **Research & Audience Audit Checklist:**
  1. Review how membership and giving are recorded today and where duplicates or
     gaps appear.
  2. Identify every sensitive record class: pastoral notes, giving history, and
     minors' data.
  3. Confirm member consent for directory visibility and communication.
  4. Read existing reconciliation pain: which giving records disagree with the
     statement and why.

## 4. Technical Standards & Rules

- RBAC is explicit: administrators configure, pastors read and write pastoral notes,
  group leaders access only their own group, treasurers record and read giving,
  members read only their own profile — every query scoped by role.
- Pastoral notes carry the strictest access in the system — pastor and administrator
  only, never surfaced in search results or exports to wider roles, and access itself
  is logged.
- Data privacy follows Ghana's Data Protection Act: directory visibility is member-
  consented, giving records are confidential, and retention rules exist for both.
- Audit logging is immutable: giving edits, member merges, and pastoral note access
  record who, what, and when — money and confidentiality both demand it.
- Giving payments: the callback signature is verified server-side and idempotent — a
  retried webhook credits a tithe exactly once, and the browser redirect is never
  proof of payment.
- Attendance and giving capture works offline at the service and syncs idempotently
  when connectivity returns — one gift, one record, no duplicates.

Example of sensitivity-scoped access rules:

```json
{
  "pastoral_notes": { "read": ["pastor", "admin"], "write": ["pastor"], "logAccess": true },
  "giving_records": { "read": ["treasurer", "admin"], "export": ["admin"] },
  "member_directory": { "read": ["member:own", "group_leader:own_group"], "write": ["admin"] }
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the ministry process in scope, the roles
   touching it, and the records it creates.
2. **Step 2: Inspect Context** — Execute the audit checklist; report current record
   sources and giving reconciliation reality before designing.
3. **Step 3: Formulate Plan** — Draw the role matrix and record sensitivity classes
   first, then flows: membership, attendance, giving to callback.
4. **Step 4: Verify Security** — Confirm role scoping, pastoral note isolation,
   audit coverage, and environment-only payment keys.
5. **Step 5: Apply Edits** — Implement structure and roles, then records, then
   giving with verification and idempotency from day one.
6. **Step 6: Execute Tests** — Run role-crossing access tests (a group leader cannot
   read another group, a member cannot see others' giving), replay a giving callback
   to prove single credit, and simulate offline sync.
7. **Step 7: Report Status** — Report what shipped, isolation and callback evidence,
   and open items.

## 6. Security & Edge Case Guidelines

- **Environment Isolation:** Payment API keys live in environment variables only —
  never in code, configs, or exported workflow files.
- **Callback Verification:** Verify signature and amount on every giving callback;
  unsigned or mismatched callbacks are rejected before any record changes.
- **Idempotency:** Giving callbacks, attendance sync, and pledge payments carry
  stable keys — retries never double-credit a tithe.
- **Confidentiality Edges:** Pastoral notes never appear in aggregate reports,
  directory exports, or integrations; a departing volunteer's access is revoked the
  same day, and shared logins are prohibited — each worker has their own.
- **Privacy Edges:** Member directory visibility defaults to private with consent-
  based sharing; giving history is visible only to the member and the treasurer
  role, never to group leaders.

## 7. Definition of Done & Quality Gates

- [ ] Role matrix implemented; crossing-role access tests pass.
- [ ] Pastoral notes isolated to pastor/admin with access logging.
- [ ] Giving callback signature verified; replay credits exactly once (tested).
- [ ] Offline attendance and giving sync produces no duplicates (tested).
- [ ] No payment keys outside environment variables.
- [ ] KPIs defined with baseline and target — giving reconciliation rate, active
      member ratio, and attendance capture rate.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the church's own policies on
  confidentiality and giving are the reference at implementation time.
