---
name: email-marketing
description: Design and run email marketing programs. Use when building lists and
  segments, writing campaigns and automation sequences, improving deliverability with
  SPF, DKIM, and DMARC, A/B testing subject lines, or measuring revenue per email with
  consent and privacy rules applied.
license: MIT
metadata:
  author: Eazworld
  department: digital-marketing
  version: "1.0.0"
---

# Email Marketing

## 1. Overview & Purpose

Builds and operates the email program: list growth with consent, segmentation,
campaigns, lifecycle automations, deliverability, and revenue measurement. Target users
are growth and CRM teams who treat the list as an owned asset — rented reach on social
platforms can vanish overnight, but a permissioned list stays. Delivers sequences and
campaigns with authentication in place, so messages reach the inbox instead of the spam
folder.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to plan campaigns, welcome series, abandoned-cart
  flows, or win-back sequences.
- **Trigger 2:** When improving deliverability — authentication records, sender
  reputation, or spam complaints.
- **Trigger 3:** When segmenting a list, A/B testing subject lines, or reporting on
  email revenue.
- **Anti-Trigger:** Do not activate for transactional email infrastructure (sending
  receipts and OTPs belongs to backend-engineering), social content (route to
  social-media-management), or one-off broadcast copy for other channels.

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The offer and lifecycle stages: what new, active, and lapsed customers need to
     hear.
  2. Consent records: how and when each subscriber opted in.
  3. Current list health: size, engagement distribution, and complaint history.
- **Research & Audience Audit Checklist:**
  1. Segment the list by engagement (active, cooling, dormant) before any send — one
     blast to everyone trains filters and people to ignore the brand.
  2. Review past campaign performance: opens, clicks, and unsubscribes by segment.
  3. Audit authentication: SPF, DKIM, and DMARC records for the sending domain.
  4. Map the lifecycle: which automations exist and which gaps leak revenue.

## 4. Technical Standards & Rules

- Consent is mandatory and documented — every subscriber has a recorded opt-in source,
  and Ghana's Data Protection Act and comparable privacy rules are respected: no
  purchased lists, ever. Content follows inbox-provider anti-spam policies — deceptive
  subjects and empty-body bait trigger filtering.
- Sending domain authenticates with SPF, DKIM, and DMARC; DMARC starts at monitoring
  and tightens only when reports are clean.
- Segmentation precedes copy: engaged, cooling, and dormant segments get different
  messages because their relationship with the brand differs.
- Automations run on triggers, not calendars: welcome on signup, abandoned cart on
  abandonment, win-back on dormancy — each with a stated goal and exit condition.
- Every email carries one primary call to action; subject and preview text agree with
  the content (no bait subjects — they cost sender reputation).
- Unsubscribe and preference links are one click, honored immediately, and suppression
  is permanent unless the person re-subscribes.

Example of the domain authentication records deliverability requires:

```text
TXT  @               v=spf1 include:_spf.<your-provider>.com ~all
TXT  send._domainkey  v=DKIM1; k=rsa; p=<public key supplied by your provider>
TXT  _dmarc          v=DMARC1; p=none; rua=mailto:dmarc@<your-domain>
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the goal (revenue, reactivation, onboarding), the
   audience segment, and the consent basis for sending.
2. **Step 2: Inspect Context** — Execute the audit checklist; report list health and
   authentication state before drafting anything.
3. **Step 3: Formulate Plan** — Choose the sequence or campaign, define segments, exit
   conditions, and the success metric per message.
4. **Step 4: Verify Security** — Confirm consent basis, that suppression lists are
   applied, and that no credentials or private data appear in copy or files.
5. **Step 5: Apply Edits** — Write the sequence: subject, preview, body, and CTA per
   message, plus the trigger and goal for each.
6. **Step 6: Execute Tests** — Send seed tests to major inbox providers, verify
   authentication alignment, and check rendering on mobile clients before the real
   send.
7. **Step 7: Report Status** — Report results against the defined KPIs and the next
   iteration (what to test, what to retire).

## 6. Security & Edge Case Guidelines

- **No Purchased Lists:** Sending to addresses you did not earn produces complaints,
  blocks, and legal exposure — refused without exception.
- **Suppression Honored:** Unsubscribed and bounced addresses never re-enter a send —
  the suppression list is checked programmatically before every campaign.
- **Credential Hygiene:** SMTP and provider API keys live in environment variables only;
  they never appear in code, docs, or screenshots.
- **Privacy:** Subscriber data stays in the ESP — exporting lists to spreadsheets or
  other tools needs a reason and a retention limit; PII never appears in campaign
  previews or reports.
- **Edge Cases:** Apple Mail Privacy Proxy inflates open rates — opens are a weak
  metric, clicks and revenue are the truth; a reputation crisis pauses sends rather
  than continuing into the spam folder.

## 7. Definition of Done & Quality Gates

- [ ] Authentication verified: SPF, DKIM, and DMARC records live and passing checks.
- [ ] Consent source recorded for every segment being mailed.
- [ ] Suppression list enforced programmatically before each send.
- [ ] Automations defined with trigger, goal, and exit condition per message.
- [ ] Seed tests rendered correctly across major inbox providers.
- [ ] KPIs defined with baseline and target — delivery rate, click-through rate,
      conversion rate, revenue per send, unsubscribe rate, and list growth.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the email service provider's
  campaign and automation builders are the operating surface at implementation time.
