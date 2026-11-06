---
name: eaz-whatsapp-automation
description: Build WhatsApp Business automations on the Cloud API. Use when sending
  template and session messages, verifying webhooks and signatures, handling the
  24-hour customer service window, building opt-in flows, or diagnosing template
  rejections and delivery failures.
license: MIT
metadata:
  author: Eazworld
  department: ai-automation
  version: "1.0.0"
---

# WhatsApp Automation

## 1. Overview & Purpose

Automates customer messaging on WhatsApp through the Meta Cloud API — the channel
where much of Ghana's commerce actually happens. Target users are support, sales, and
growth teams sending order updates, reminders, and campaigns without getting the
business number blocked. Supported architectures: REST calls outbound, signed webhooks
inbound, and approved template flows for messaging outside the service window. The
platform's rules are strict and enforced by Meta; this skill designs within them so
the channel stays alive.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to send or automate WhatsApp messages — templates,
  session messages, or broadcasts.
- **Trigger 2:** When wiring Cloud API webhooks for inbound messages and delivery
  status updates.
- **Trigger 3:** When managing opt-ins, the 24-hour service window, or template
  approval and rejections.
- **Trigger 4:** When diagnosing failed deliveries, rate-limit errors, or a blocked
  number.
- **Anti-Trigger:** Do not activate for designing bot conversation logic (route to
  eaz-chatbot-development), general webhook workflows (route to eaz-n8n-automation), or email
  programs (route to eaz-email-marketing).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The message use cases: transactional (orders, OTPs), service replies, and
     marketing — each has different policy treatment.
  2. Opt-in sources: where and when each recipient consented.
  3. The Meta app setup: phone number ID, template catalog, and webhook
     configuration.
- **Research & Audience Audit Checklist:**
  1. Review existing templates and their approval status before planning new sends.
  2. Read recent webhook logs: delivery failures, signature rejections, and gaps.
  3. Verify opt-in records exist for every segment to be contacted.
  4. Check the current messaging tier and throughput the number has earned.

## 4. Technical Standards & Rules

- Follow Meta's WhatsApp policies: explicit opt-in before the first message, no
  purchased or scraped lists, and marketing content only in approved templates.
- The 24-hour window is absolute — free-form replies are allowed only within 24
  hours of the customer's last message; outside it, only category-approved templates
  (utility, authentication, marketing) may be sent.
- Inbound webhooks verify the `X-Hub-Signature-256` HMAC against the app secret
  before any payload is processed, and answer the GET verification challenge.
- Delivery statuses (sent, delivered, read, failed) are processed idempotently and
  drive downstream state — a failed message triggers a fallback, not silence.
- Outbound calls respect messaging tiers and rate limits; 429 and 5xx responses
  retry with exponential backoff and jitter, capped before they cascade.
- Every automation states its category honestly — reclassifying marketing as
  "utility" to bypass approval is a policy violation that blocks the number.

Example of webhook signature verification before any payload is trusted:

```ts
import crypto from 'node:crypto';

export function verifyMetaSignature(rawBody: string, header: string): boolean {
  const expected = crypto
    .createHmac('sha256', process.env.META_APP_SECRET!)
    .update(rawBody)
    .digest('hex');
  return header === `sha256=${expected}`;
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the use cases, the recipient segments, and the
   policy category each message belongs to.
2. **Step 2: Inspect Context** — Execute the audit checklist; report template status,
   webhook health, and opt-in coverage before building.
3. **Step 3: Formulate Plan** — Map the flows: opt-in → first message → session
   replies → template follow-ups → delivery status handling.
4. **Step 4: Verify Security** — Confirm signature verification, environment-only
   tokens, and recorded consent for every segment.
5. **Step 5: Apply Edits** — Implement the send path and the webhook handler with
   idempotency and backoff in place from the first commit.
6. **Step 6: Execute Tests** — Send to a test number, forge a webhook to prove
   signature rejection, replay a webhook to prove idempotency, and force a rate-limit
   response to prove backoff.
7. **Step 7: Report Status** — Report flows shipped, policy categories used, test
   evidence, and any templates awaiting approval.

## 6. Security & Edge Case Guidelines

- **Environment Isolation:** The permanent access token, app secret, and phone
  number ID live in environment variables only — never in code, configs, or logs;
  tokens rotate on staff changes.
- **Signature Verification:** Webhooks that fail HMAC verification are rejected
  before parsing — an unsigned inbound payload is treated as hostile.
- **Consent:** Opt-in records store source and timestamp; a STOP or block is honored
  immediately and permanently until fresh consent arrives.
- **Retry Discipline:** Meta retries webhooks, so handlers are idempotent by message
  ID; outbound transient failures back off exponentially and dead-letter after the
  cap instead of hammering the API.
- **Privacy Edge Cases:** Message content and phone numbers are masked in
  application logs, transcripts have a retention limit, and recipient lists never
  leave the system for unapproved tools.

## 7. Definition of Done & Quality Gates

- [ ] Forged webhook rejected; valid signature accepted (both tested).
- [ ] Opt-in recorded for every recipient before first contact.
- [ ] Templates approved in the correct category; no reclassification tricks.
- [ ] Delivery statuses processed idempotently; failure path reaches a fallback.
- [ ] Backoff proven on a forced 429; dead-letter alert fires after the cap.
- [ ] No tokens or secrets anywhere except environment variables.
- [ ] KPIs defined with baseline and target — delivery rate, response rate, opt-out
      rate, and template rejection rate.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; Meta's Cloud API documentation
  and the app dashboard are the reference surfaces at implementation time.
