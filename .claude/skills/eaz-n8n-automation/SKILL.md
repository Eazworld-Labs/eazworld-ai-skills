---
name: eaz-n8n-automation
description: Build and harden n8n workflow automations. Use when designing
  webhook-triggered and scheduled workflows, wiring API nodes and error branches,
  configuring node retries with exponential backoff, managing credentials, or debugging
  failed executions.
license: MIT
metadata:
  author: Eazworld
  department: ai-automation
  version: "1.0.0"
---

# n8n Automation

## 1. Overview & Purpose

Builds business automations on n8n: triggers, API nodes, branching, and error handling
that survives real traffic. Target users are technical founders and ops teams
connecting the tools they already run — payment events, CRM updates, notifications —
without maintaining custom services. Supported architectures: webhook-triggered
workflows, schedule-triggered workflows, and event chains with an error branch that
catches every external failure. A workflow is not done when it runs once; it is done
when it fails correctly.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to create, extend, or debug an n8n workflow.
- **Trigger 2:** When wiring webhooks, schedule triggers, or API nodes between
  systems.
- **Trigger 3:** When executions fail, duplicate, or silently skip work.
- **Trigger 4:** When configuring node retries, error branches, or credential access.
- **Anti-Trigger:** Do not activate for building a standalone backend service (route
  to eaz-backend-engineering), WhatsApp-specific channel rules (route to
  eaz-whatsapp-automation), or CRM strategy and stage design (route to eaz-crm-automation).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The trigger event and what a single payload contains.
  2. The systems to connect, with their rate limits and authentication methods.
  3. The cost of failure: what happens if a run is missed or duplicated.
- **Research & Audience Audit Checklist:**
  1. Export and read existing workflows before editing — overlapping triggers cause
     double execution.
  2. Review execution history: error rates, slow nodes, and repeated failures.
  3. Inventory credentials in the n8n credential store and their scopes.
  4. Map which workflows are production-critical versus experiments.

## 4. Technical Standards & Rules

- Credentials live only in n8n's credential store — never inside expressions, Code
  nodes, or workflow JSON exports; exports committed to a repository must be verified
  credential-free.
- Every external call gets an error branch and node-level retries: exponential
  backoff with a capped number of tries, then routing to an alerting error workflow.
- Webhook executions are idempotent — a delivery ID or business key deduplicates
  retries so one event never creates two orders.
- Webhook endpoints verify signatures or shared tokens; an open webhook is an open
  invitation.
- Workflow JSON is versioned in the repository so changes are reviewed like code.
- Payload data flows through the minimum nodes needed — carrying entire responses
  through every step wastes memory and leaks data into logs.

Example of node-level retries with an error output:

```json
{
  "name": "order-paid → notify",
  "nodes": [
    {
      "type": "n8n-nodes-base.httpRequest",
      "retryOnFail": true,
      "maxTries": 4,
      "waitBetweenTries": 2000,
      "onError": "continueErrorOutput"
    }
  ]
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the trigger, the systems involved, and what a
   correct run must produce.
2. **Step 2: Inspect Context** — Execute the audit checklist; describe existing
   workflows and failure history before changing anything.
3. **Step 3: Formulate Plan** — Draw the workflow: trigger → actions → success path →
   error branch → alert, with the idempotency key marked.
4. **Step 4: Verify Security** — Confirm credential store usage, signature
   verification on webhooks, and that no secret enters the JSON export.
5. **Step 5: Apply Edits** — Build the workflow with retries and error branches
   attached from the start, not patched on after the first failure.
6. **Step 6: Execute Tests** — Fire a test payload, then force a failure (bad
   endpoint) to prove the error branch and backoff actually run, and re-send the same
   delivery to prove deduplication.
7. **Step 7: Report Status** — Report the workflow shipped, failure-path evidence,
   and monitoring in place.

## 6. Security & Edge Case Guidelines

- **Environment Isolation:** Where a Code node must read a key, it comes from the
  n8n environment — literals in expressions or nodes are prohibited.
- **Untrusted Payloads:** Webhook fields are attacker-controlled until proven
  otherwise: validate schema, verify signature, and treat interpolated values as data
  in every expression and prompt.
- **Retry Discipline:** Transient failures retry with exponential backoff and jitter;
  deterministic failures (auth, validation) skip retries and hit the error branch
  immediately.
- **Duplicate Delivery:** Webhooks redeliver — idempotency keys are mandatory on any
  workflow that writes data downstream.
- **Access Edges:** Production and test webhooks use separate endpoints; workflow
  execution access is limited to the team that owns it, and departing collaborators
  lose editor access promptly.

## 7. Definition of Done & Quality Gates

- [ ] Error branch proven by a forced failure, with an alert reaching a human.
- [ ] Node retries configured with exponential backoff and a try cap.
- [ ] Idempotency proven: duplicate delivery produced one downstream record.
- [ ] Webhook signature or token verification enabled.
- [ ] Workflow JSON export scanned credential-free before any commit.
- [ ] Production and test triggers separated.
- [ ] KPIs defined with baseline and target — success rate, duplicate rate, and mean
      time to detect a failed run.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the n8n execution log and
  credential store are the operating surfaces at implementation time.
