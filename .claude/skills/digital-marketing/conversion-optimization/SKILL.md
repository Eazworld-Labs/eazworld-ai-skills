---
name: conversion-optimization
description: Improve conversion rates with research and controlled experiments. Use when
  analyzing funnels and drop-off, forming test hypotheses, designing A/B tests,
  optimizing landing pages and checkout flows, or reading analytics and heatmap data to
  decide what to change.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Conversion Optimization

## 1. Overview & Purpose

Turns traffic into customers through evidence: funnel analysis, qualitative research,
honest experiments, and measured rollouts. Target users are growth teams with real
traffic but soft conversion numbers. Delivers prioritized experiments with clear
hypotheses and statistically valid conclusions — not a list of opinions about button
colors. What gets built from the findings belongs to the implementation skills; this
skill decides what is worth building and proves whether it worked.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user reports funnel drop-off, cart abandonment, or a landing
  page that underperforms.
- **Trigger 2:** When forming test hypotheses, designing A/B tests, or deciding what to
  experiment on next.
- **Trigger 3:** When reading analytics, heatmaps, or session recordings to find
  friction.
- **Anti-Trigger:** Do not activate for implementing the UI change itself (route to
  frontend-design), buying more traffic (route to google-ads or meta-ads), or
  general performance work with no conversion angle (route to performance-optimization).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The funnel: each step from entry to conversion with volume and rate.
  2. The goal: the single conversion that matters and its current baseline.
  3. Traffic volume available — it determines whether an experiment can finish at all.
- **Research & Audience Audit Checklist:**
  1. Pull funnel metrics by segment (device, source, new versus returning) — averages
     hide the broken path.
  2. Review session recordings and heatmap data around the drop-off step.
  3. Collect stated friction: exit surveys, support tickets, and checkout complaints.
  4. Verify analytics events fire correctly before trusting any number.

## 4. Technical Standards & Rules

- Research precedes opinions: at least one quantitative signal and one qualitative
  signal support every hypothesis.
- Hypotheses follow the format: because we observed X, we believe doing Y will move
  metric Z by N percent — an unfalsifiable hypothesis is not a hypothesis.
- Experiments run to a predetermined sample size and duration; peeking at results and
  stopping early is prohibited — it manufactures false wins.
- One variable changes per test unless a full redesign ships as a single package with
  the honest note that attribution to one element is impossible.

Example of an experiment brief:

```json
{
  "hypothesis": "Trust badges above the pay button raise checkout completion",
  "metric": "checkout_completion_rate",
  "baseline": 0.42,
  "target": "+5% relative",
  "minSamplePerVariant": 1200,
  "durationDays": 14,
  "guardrails": ["average_order_value", "refund_rate"]
}
```
- Guardrail metrics watch for damage: a lift in clicks that tanks average order value
  is a loss, not a win.
- Dark patterns are prohibited — fake urgency, forced continuity, and hidden costs lift
  short-term numbers and destroy trust (and violate consumer protection policies in
  most markets).

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the funnel, the target metric, and the baseline
   conversion rate.
2. **Step 2: Inspect Context** — Execute the audit checklist; find the step where the
   money leaks before proposing tests.
3. **Step 3: Formulate Plan** — Rank hypotheses by evidence strength and expected
   impact; design the first experiment with sample size and guardrails stated.
4. **Step 4: Verify Security** — Confirm analytics are trustworthy, recording tools
   mask personal data with consent, and no dark pattern is proposed as a fix.
5. **Step 5: Apply Edits** — Write the experiment brief: hypothesis, variants,
   metrics, sample size, and stop conditions — then hand implementation specs to the
   relevant build skill.
6. **Step 6: Execute Tests** — Validate the tracking of both variants before launch,
   run the experiment to completion, and evaluate with the predetermined method.
7. **Step 7: Report Status** — Report the result (win, loss, or inconclusive), what was
   learned either way, and the next experiment in the queue.

## 6. Security & Edge Case Guidelines

- **Statistical Honesty:** Underpowered tests report "inconclusive," never "winner" —
  shipping noise as a win trains the team to distrust experiments.
- **Privacy:** Heatmaps and session recordings mask names, emails, and payment fields;
  recording tools run only with consent where law requires it.
- **No Dark Patterns:** Countdown timers that reset, pre-checked boxes, and buried
  cancellation paths are rejected even when they would raise the metric.
- **Edge Cases:** Low-traffic sites cannot support A/B tests — switch to before/after
  comparisons with seasonal caution and say so plainly; mobile and desktop may need
  separate analysis because they behave like different funnels.
- **Data Trust:** If analytics events misfire, every downstream number is fiction —
  fix tracking first, always.

## 7. Definition of Done & Quality Gates

- [ ] Funnel mapped with volumes and rates per step; the drop-off step identified.
- [ ] Every hypothesis carries evidence (one quantitative, one qualitative) and a
      falsifiable prediction.
- [ ] Experiment states sample size, duration, and guardrail metrics before launch.
- [ ] Tracking validated on both variants before the test runs.
- [ ] Results evaluated with the predetermined method; inconclusive labeled honestly.
- [ ] KPIs defined with baseline and target — conversion rate, revenue per visitor,
      cart abandonment rate, and the guardrails protecting order value.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the analytics platform and
  experimentation tool are the operating surfaces at implementation time.
