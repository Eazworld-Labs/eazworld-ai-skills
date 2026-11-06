---
name: eaz-google-ads
description: Plan, structure, and measure Google Ads campaigns. Use when creating search
  or performance max campaigns, choosing keywords and match types, writing ad copy,
  setting bids and budgets, adding negative keywords, or diagnosing Quality Score and
  conversion tracking problems.
license: MIT
metadata:
  author: Eazworld
  department: digital-marketing
  version: "1.0.0"
---

# Google Ads

## 1. Overview & Purpose

Designs and evaluates paid search on Google: campaign structure, keyword and negative
strategy, ad copy, bidding, and conversion tracking. Target users are growth marketers
and founders spending budget that must return more than it costs. Every campaign ships
with a tracking plan and a stop-loss — spend without measurement is waste, and waste
without a cap is damage.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to create, restructure, or optimize Google Ads
  campaigns.
- **Trigger 2:** When choosing keywords, match types, negative keyword lists, or writing
  Responsive Search Ads.
- **Trigger 3:** When diagnosing falling CTR, rising CPA, Quality Score drops, or broken
  conversion tracking.
- **Anti-Trigger:** Do not activate for social advertising (route to eaz-meta-ads), organic
  search strategy (route to eaz-seo-strategy), or landing page implementation (route to
  eaz-frontend-design).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. Unit economics: margin per sale and the maximum acceptable cost per acquisition.
  2. The product feed or service list with the offers that may be advertised.
  3. Existing account history: spend, conversions, and any disapproval history.
- **Research & Audience Audit Checklist:**
  1. Pull the search terms report — real queries, not tool guesses.
  2. Study the live SERP: who is bidding, what offers appear, what is missing.
  3. Review the conversion action setup before touching bids — tracking first.
  4. Check policy status of every asset; a disapproved ad cannot be optimized.

## 4. Technical Standards & Rules

- Follow Google Ads policies on prohibited content, personalized advertising, and
  landing page experience — disapprovals and account suspensions are preventable.
- Account structure is strict: one intent per ad group, ad groups per theme, campaigns
  split by goal and budget.
- Keywords use match types deliberately — exact and phrase for control, broad only with
  proven negatives; every launch ships with a negative keyword list.
- Responsive Search Ads carry pinned brand headlines where accuracy matters, and every
  headline respects the 30-character limit.
- Bidding starts on conversions or manual CPC with caps; automated strategies earn
  budget only after tracking is proven accurate.
- Conversion tracking fires on the valuable action (purchase, qualified lead), never on
  page views — and never on pages containing personal data.

Example of a campaign structure:

```json
{
  "campaign": "search_brand_gh",
  "objective": "conversions",
  "budgetDaily": { "amount": 20, "currency": "GHS" },
  "adGroup": {
    "name": "brand_terms",
    "keywords": ["eazworld", "eaz world shoes"],
    "matchTypes": ["exact", "phrase"],
    "negatives": ["free", "jobs", "repair"]
  }
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the goal, budget, and the CPA the business can
   survive.
2. **Step 2: Inspect Context** — Execute the audit checklist; report current account
   performance before proposing changes.
3. **Step 3: Formulate Plan** — Draft the campaign map: campaigns, ad groups, keyword
   themes, negatives, and budgets.
4. **Step 4: Verify Security** — Confirm conversion actions exclude PII pages, billing
   caps are set, and no policy-violating claims appear in copy.
5. **Step 5: Apply Edits** — Build the structure, upload keywords and negatives, write
   ad copy, and attach the conversion actions.
6. **Step 6: Execute Tests** — Verify tracking with a test conversion, review the
   preview for disapprovals, and confirm spend pacing against the daily cap.
7. **Step 7: Report Status** — Report structure shipped, tracking proof, and the KPI
   review schedule.

## 6. Security & Edge Case Guidelines

- **Spend Safety:** Daily budgets and account spending limits are set before launch —
  an uncapped account on a bad keyword drains cash overnight.
- **Tracking Integrity:** Conversion tags must not capture names, emails, or phone
  numbers; page-level personal data stays out of ad parameters.
- **Policy Edge Cases:** Health claims, before/after imagery, and personalized-attribute
  callouts are common disapproval causes — check before writing copy.
- **Search Term Hygiene:** Negate irrelevant and high-cost queries weekly; search
  intent drifts and yesterday's relevant term becomes today's waste.
- **Fraud:** Click anomalies from one geography or one hour get investigated with the
  invalid-traffic report, not ignored.

## 7. Definition of Done & Quality Gates

- [ ] Conversion tracking verified with a live test conversion before bids are raised.
- [ ] Every ad group has themed keywords plus a negative list.
- [ ] Ad copy complies with policy and pins brand claims accurately.
- [ ] Budget caps and bidding strategy set with a documented stop-loss.
- [ ] KPIs defined with baseline and target — CTR, CPC, conversion rate, CPA, ROAS, and
      impression share.
- [ ] Landing pages match ad promises (message match reviewed).

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; Google Ads Editor and the account's
  own change history are the audit trail at implementation time.
