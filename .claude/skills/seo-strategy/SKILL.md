---
name: seo-strategy
description: Plan search strategy with keyword research, intent mapping, and content
  roadmaps. Use when researching keywords, analyzing competitor search presence, mapping
  search intent to pages, prioritizing content opportunities, or defining SEO KPIs.
  Technical implementation belongs to the seo-engineering skill.
license: MIT
metadata:
  author: Eazworld
  department: digital-marketing
  version: "1.0.0"
---

# SEO Strategy

## 1. Overview & Purpose

Defines what to rank for and why — the research and prioritization half of search
marketing. Target users are founders, marketers, and content leads who need a defensible
keyword-to-page plan rather than guesswork. Produces keyword clusters with intent,
competitor gap analysis, and a prioritized content roadmap with KPIs. Technical
implementation (tags, sitemaps, structured data) is owned by the `seo-engineering` skill;
this skill hands it a clear brief.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to research keywords, plan content for search, or find
  what the audience is querying.
- **Trigger 2:** When analyzing competitors' search presence or identifying keyword
  gaps and opportunities.
- **Trigger 3:** When mapping search intent to pages, prioritizing a content roadmap, or
  defining SEO KPIs and reporting.
- **Anti-Trigger:** Do not activate for implementing metadata, sitemaps, or structured
  data (route to seo-engineering) or paid search campaigns (route to google-ads).

## 3. Required Inputs & Project Audit

Structured research comes before any recommendation:

- **Mandatory Inputs:**
  1. The business: products, margins, and the regions served (for example Ghana plus
     diaspora markets).
  2. Existing performance data: Search Console queries, impressions, and positions.
  3. The audience's own language — reviews, support tickets, and sales calls are the
     best keyword sources available.
- **Research & Audience Audit Checklist:**
  1. Export current Search Console queries and bucket them by intent.
  2. Study the top 10 results per target query — what content format already wins.
  3. Audit competitor sites for content gaps and weak points (topics they cover
     poorly).
  4. Check seasonality and local events that shift demand.

## 4. Technical Standards & Rules

- Follow Google's spam policies: no keyword stuffing, no hidden text, no deceptive
  redirects — short-term tricks cost the whole domain long-term.
- Cluster keywords by intent first, keywords second — one page serves one intent.
- Prioritize with a simple score: business value × achievable difficulty; a page one
  cannot win is not an opportunity.
- Every cluster maps to exactly one target URL; competing pages for the same query are
  consolidated with canonicals.
- Content briefs state the query, intent, questions to answer, and internal links — not a
  word count target.
- Paid and organic strategies share keyword research but never the same success
  metrics.

Example of a keyword cluster entry:

```json
{
  "cluster": "ankara shoes accra",
  "intent": "commercial",
  "primaryKeyword": "ankara shoes price in ghana",
  "secondaryKeywords": ["ankara sneakers accra", "african print shoes"],
  "targetPage": "/collections/ankara-shoes"
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the business goal, the market, and the timeframe for
   measurable search growth.
2. **Step 2: Inspect Context** — Execute the research checklist; describe where traffic
   and rankings stand today before proposing targets.
3. **Step 3: Formulate Plan** — Build the keyword cluster map, score opportunities, and
   sequence the roadmap by effort versus value.
4. **Step 4: Verify Security** — Confirm no tactic violates search engine policies and
   no competitor data was obtained dishonestly.
5. **Step 5: Apply Edits** — Write the cluster map, briefs, and roadmap into the
   project's docs or content tool.
6. **Step 6: Execute Tests** — Cross-check every cluster against a live search result
   page: does the intent match what actually ranks?
7. **Step 7: Report Status** — Report clusters prioritized, expected outcomes, and the
   KPIs that will be tracked monthly.

## 6. Security & Edge Case Guidelines

- **Honesty:** Never recommend hidden text, cloaking, or fake engagement — violations
  trigger manual actions that take months to recover from.
- **Data Privacy:** Search Console and analytics access is least-privilege; reports
  aggregate and never expose individual queries tied to users.
- **Edge Cases:** New domains need an authority ramp — set expectations accordingly;
  brand queries are won with snippets, not content volume.
- **Policy Changes:** Search engine updates can invalidate assumptions — re-validate the
  roadmap quarterly.

## 7. Definition of Done & Quality Gates

- [ ] Every cluster has intent, a target URL, and a priority score.
- [ ] Competitor gap analysis completed with sources cited.
- [ ] Roadmap sequenced by effort versus business value.
- [ ] KPIs defined with baseline and target — impressions, non-brand clicks, average
      position, and assisted conversions.
- [ ] No policy-violating tactics anywhere in the plan.
- [ ] Handoff brief for `seo-engineering` written for implementation items.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the cluster map lives in the
  project's own content documentation.
