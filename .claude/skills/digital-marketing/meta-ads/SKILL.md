---
name: meta-ads
description: Build and evaluate Meta ads across Facebook and Instagram. Use when
  structuring campaigns and ad sets, building custom and lookalike audiences, setting up
  the Meta pixel and Conversions API, writing creative briefs, or diagnosing ROAS and
  delivery problems.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Meta Ads

## 1. Overview & Purpose

Designs and measures advertising on Meta's family of apps: campaign structure, audiences,
pixel and Conversions API tracking, creative direction, and ROAS evaluation. Target users
are growth teams and founders selling to consumers — especially in markets like Ghana
where Instagram and Facebook carry a large share of discovery. Every plan balances
audience, creative, and budget as three levers, because fixing one cannot rescue the
other two.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to create, restructure, or audit Facebook or Instagram
  ad campaigns.
- **Trigger 2:** When building custom audiences, lookalikes, or fixing pixel and
  Conversions API tracking.
- **Trigger 3:** When ROAS drops, frequency climbs, delivery stalls, or creative needs a
  tested brief.
- **Anti-Trigger:** Do not activate for Google Search campaigns (route to google-ads),
  organic social content (route to social-media-management), or landing page code (route
  to frontend-design).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. Unit economics: margin, average order value, and target return on ad spend.
  2. Customer sources: existing lists, engagement audiences, and past purchasers.
  3. Creative inventory: photos, video, and claims that are allowed to run.
- **Research & Audience Audit Checklist:**
  1. Review Meta Ad Library for competitors' live ads and angles.
  2. Check pixel and Conversions API event health before changing budgets.
  3. Pull delivery diagnostics: audience size, frequency, and placement breakdowns.
  4. Confirm the customer list is consented before uploading it as an audience.

## 4. Technical Standards & Rules

- Follow Meta Advertising Policies — personal-attribute callouts ("still struggling with
  acne?"), sensationalized claims, and before/after imagery cause disapprovals.
- Campaign structure is explicit: campaign (objective) → ad set (audience and budget) →
  ads (creative); budget decisions are made at the level chosen deliberately (CBO versus
  ad set budgets).
- Tracking is dual-layer: browser pixel plus server-side Conversions API, deduplicated
  with event IDs so purchases are never counted twice.
- Audiences follow a ladder: custom audiences for retargeting, lookalikes built from the
  highest-quality source (purchasers over all visitors), broad for algorithmic reach.
- Creative is briefed per placement — Reels, Stories, and Feed have different safe areas
  and durations — and every ad states a clear single offer.
- Attribution windows are stated with every result; numbers from different windows are
  never compared directly.

Example of a consented custom audience:

```json
{
  "name": "IG_engagers_180d_GH",
  "type": "custom_audience",
  "source": "instagram_engagement",
  "windowDays": 180,
  "geo": ["GH"],
  "age": [18, 45],
  "placements": ["instagram_reels", "instagram_feed"]
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the offer, the audience hypothesis, and the ROAS the
   business needs.
2. **Step 2: Inspect Context** — Execute the audit checklist; report current delivery
   and tracking health before proposing changes.
3. **Step 3: Formulate Plan** — Draft the campaign map: objective, audiences, budget
   split, and the creative angles to test.
4. **Step 4: Verify Security** — Confirm audience lists are consented, no sensitive
   personal attributes are referenced, and no secret enters the diff.
5. **Step 5: Apply Edits** — Build campaigns and ad sets, connect audiences, upload
   creative, and verify pixel plus Conversions API events.
6. **Step 6: Execute Tests** — Run a small budget validation phase: confirm events fire,
   check disapprovals, and watch frequency for 48 hours.
7. **Step 7: Report Status** — Report structure, validation results, KPIs, and the
   creative testing queue.

## 6. Security & Edge Case Guidelines

- **Consent:** Customer lists are uploaded only with recorded consent; scraped or bought
  lists are prohibited and violate platform policy.
- **Event Integrity:** Purchase events carry values and currencies; duplicate or
  misfiring events corrupt optimization — deduplicate with event IDs.
- **Sensitive Attributes:** Never reference health, finances, or personal struggles in
  targeting or copy — policy violations and ethical failures at once.
- **Budget Edges:** New ad sets enter learning; do not judge or cut them within the
  first 48–72 hours or minimum spend window.
- **Account Safety:** Two-factor authentication on the business account, roles instead
  of shared passwords, and no agency access without an expiry date.

## 7. Definition of Done & Quality Gates

- [ ] Pixel and Conversions API events verified and deduplicated end to end.
- [ ] Audiences consented, sized within viable ranges, and mapped to funnel stages.
- [ ] Creative briefed per placement with one clear offer per ad.
- [ ] Validation phase completed before full budget is released.
- [ ] KPIs defined with baseline and target — ROAS, CPA, CTR, CPM, frequency, and
      conversion rate.
- [ ] Attribution window stated with every reported number.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; Meta Ads Manager and the Ad
  Library are the reference surfaces at implementation time.
