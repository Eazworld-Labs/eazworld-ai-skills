---
name: crm-automation
description: Automate CRM data flows and pipeline operations. Use when syncing contacts
  between systems, defining pipeline stages, scoring leads, triggering follow-ups,
  deduplicating records, or debugging failed or duplicate syncs.
license: MIT
metadata:
  author: Eazworld
  department: ai-automation
  version: "1.0.0"
---

# CRM Automation

## 1. Overview & Purpose

Keeps one trustworthy customer record across the tools a business runs — storefront,
support desk, ad platforms, spreadsheets — with syncs that neither duplicate nor lose
data. Target users are sales and operations teams whose pipeline truth has eroded into
conflicting copies. Supported architectures: a named source of truth with
webhook-driven syncs outward, scheduled reconciliation jobs for systems without
webhooks, and deterministic conflict rules for the rare two-way case. The CRM is a
mirror of reality; automation that pollutes it is worse than manual entry.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to sync contacts or companies between systems.
- **Trigger 2:** When defining or changing pipeline stages, entry/exit criteria, or
  lead scoring rules.
- **Trigger 3:** When triggering follow-ups, reminders, or task assignment from
  record changes.
- **Trigger 4:** When duplicates appear, syncs fail, or records silently diverge
  between systems.
- **Anti-Trigger:** Do not activate for email campaigns to contacts (route to
  email-marketing), WhatsApp message rules (route to whatsapp-automation), or
  chatbot dialogue design (route to chatbot-development).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The systems of record: which system owns contacts, deals, and events — stated
     explicitly.
  2. Field mappings between systems, including which fields are authoritative where.
  3. Stage definitions with entry and exit criteria, and the scoring model's inputs.
- **Research & Audience Audit Checklist:**
  1. Audit current data health: duplicate counts, missing fields, and conflicting
     values across systems.
  2. Read existing sync tools and their failure history before adding another.
  3. Check API rate limits and available webhooks on each system in the path.
  4. Review how records are created today — manual entry patterns reveal the fields
     that actually matter.

## 4. Technical Standards & Rules

- One system is named the source of truth per data domain; every other system
  follows it — bidirectional sync without conflict rules is a future data incident.
- Deduplication runs before insert on normalized keys (lowercased email, normalized
  phone); merge rules are defined in advance — newest wins or richest record wins,
  chosen deliberately, never accidentally.
- Pipeline stages have explicit entry and exit criteria — a stage without criteria is
  a rumor, and reporting built on rumors misleads everyone.
- Every outbound sync carries a stable idempotency key: a retried sync must update
  the same record, never create a second one.
- Automated changes are audited — each record stores which automation changed it and
  when, so pipeline truth can be traced to its source.
- Scoring models stay transparent: visible weights, recalculated when inputs change,
  and never a black number sales cannot challenge.

Example of deduplication with an idempotency key:

```ts
function normalizeEmail(email: string): string {
  const [local, domain] = email.trim().toLowerCase().split('@');
  return `${local.split('+')[0]}@${domain}`; // aliases collapse
}

const existing = await crm.findByEmail(normalizeEmail(contact.email));
const key = contact.sourceId; // stable idempotency key
if (existing) return crm.update(existing.id, contact, { idempotencyKey: key });
return crm.create(contact, { idempotencyKey: key });
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the systems, the direction of sync, and the data
   domain in scope.
2. **Step 2: Inspect Context** — Execute the audit checklist; report data health and
   existing sync failures before designing new ones.
3. **Step 3: Formulate Plan** — Draw the flow: source → transform → dedup →
   destination, plus the error path and conflict rules.
4. **Step 4: Verify Security** — Confirm least-privilege API scopes, environment-only
   keys, and that contact PII stays within approved systems.
5. **Step 5: Apply Edits** — Implement mapping, dedup, and idempotency first, then
   triggers and scoring on top of the trustworthy layer.
6. **Step 6: Execute Tests** — Run a round-trip sync, inject a duplicate to prove
   dedup, force a transient failure to prove backoff, and verify a retry creates no
   second record.
7. **Step 7: Report Status** — Report the sync architecture, test evidence, data
   health findings, and open conflicts needing human review.

## 6. Security & Edge Case Guidelines

- **Environment Isolation:** CRM API keys and tokens live in environment variables
  only, with least-privilege scopes — a sync that only needs contact read/write must
  not carry admin rights.
- **Retry Discipline:** Transient failures retry with exponential backoff and
  jitter; after the cap, the record lands in a dead-letter queue with an alert —
  never a silent partial write.
- **Idempotency:** Every create and update request carries an idempotency key so
  provider-side retries cannot duplicate records.
- **PII Discipline:** Contact data moves over HTTPS between approved systems only,
  is masked in application logs, and is never exported to unapproved tools or
  spreadsheets.
- **Conflict Edges:** Ambiguous merges route to a manual review queue rather than a
  guess; automated activity is never fabricated — fake logged calls and invented
  engagement corrupt scoring and pipeline reporting.

## 7. Definition of Done & Quality Gates

- [ ] Source of truth named per data domain; direction of sync documented.
- [ ] Deduplication proven with an injected duplicate; merge rules documented.
- [ ] Round-trip sync consistent; retry proven to create no second record.
- [ ] Backoff and dead-letter alerting configured on every sync path.
- [ ] Pipeline stages have explicit entry and exit criteria.
- [ ] Audit trail records automation actor on every automated change.
- [ ] Keys environment-only with least-privilege scopes.
- [ ] KPIs defined with baseline and target — duplicate rate, sync failure rate, and
      follow-up SLA adherence.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; each system's API documentation
  and the sync's own audit log are the references at implementation time.
