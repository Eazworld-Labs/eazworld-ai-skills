---
name: performance-optimization
description: Measure and improve application performance across frontend and backend. Use
  when pages load slowly, Core Web Vitals need work, bundles are too large, API latency
  is high, database queries are slow, or a caching strategy is needed.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.0.0"
---

# Performance Optimization

## 1. Overview & Purpose

Finds and fixes real bottlenecks with evidence instead of guesses. Every change follows
the same loop: measure a baseline, identify the bottleneck, apply the smallest fix that
addresses it, then re-measure. Delivers before-and-after numbers for every claim — a
performance change without a measurement is an opinion, not an optimization.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user reports that a page, query, or API is slow.
- **Trigger 2:** When Core Web Vitals (LCP, CLS, INP) need improvement or a Lighthouse
  score must rise.
- **Trigger 3:** When bundle size grows, API latency increases, or database queries are
  slow.
- **Trigger 4:** When asked to design or review a caching strategy (Redis, HTTP, or
  in-memory).
- **Anti-Trigger:** Do not activate for building new features (route to the
  implementation skills) or for general code review (route to code-review).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. What is slow, for whom, and on what device and network — a URL, endpoint, or query.
  2. The current metric if one exists (Lighthouse, response time, query duration).
  3. The acceptable target, or the slowest experience users currently tolerate.
- **Codebase Audit Checklist:**
  1. Capture a baseline measurement before changing anything — reproduce the slowness
     first.
  2. Check the network waterfall: what loads, in what order, and how much of it is
     render-blocking.
  3. Review bundle composition for duplicated or oversized dependencies.
  4. Read query plans (`EXPLAIN`) and slow-query output for the hot queries.

## 4. Technical Standards & Rules

- Baseline first, change second, re-measure always — never optimize from intuition alone.
- Attack the measured bottleneck: the fastest fix on the wrong component is wasted work.
- Biggest measured wins first; micro-optimizations wait until the large costs are gone.
- Caching requires an explicit TTL and an invalidation story — a cache that cannot be
  invalidated becomes a correctness bug with good latency.
- Cheap wins before expensive ones: image formats and compression, render-blocking
  resources, and query indexes usually beat architectural rewrites.
- One change at a time, measured in isolation, so each gain is attributable.
- Security features are never traded for speed — validation, signatures, and rate limits
  stay on.

Example of cache-aside with an explicit TTL and per-user key:

```ts
const key = `product:${userId}:${productId}`; // never share across users
const hit = await redis.get(key);
if (hit) return JSON.parse(hit) as Product;

const product = await loadProduct(productId); // the slow query
await redis.set(key, JSON.stringify(product), 'EX', 60); // TTL: 60s
return product;
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate what is slow, for whom, and the target metric.
2. **Step 2: Inspect Context** — Execute the audit checklist; record the baseline with
   the tool that matches the layer (Lighthouse, profiler, `EXPLAIN`, APM).
3. **Step 3: Formulate Plan** — Rank hypotheses by expected gain and cost; start with
   the top one.
4. **Step 4: Verify Security** — Confirm the planned fix does not weaken validation,
   authentication, or rate limiting, and that any cache keys cannot leak private data
   between users.
5. **Step 5: Apply Edits** — Implement the single highest-value fix in isolation.
6. **Step 6: Execute Tests** — Re-measure with the same tool and conditions as the
   baseline; run the test suite to catch regressions.
7. **Step 7: Report Status** — Report before/after numbers, what was ruled out, and the
   next bottleneck if the target is not yet met.

## 6. Security & Edge Case Guidelines

- **No Security Shortcuts:** Never disable signature verification, input validation, or
  rate limits to save milliseconds — a fast insecure path is a defect.
- **Cache Isolation:** Cached responses containing user-specific data must be keyed per
  user; a shared key leaks one user's data to another.
- **Sensitive Data:** Nothing personal or secret goes in URLs — they end up in logs,
  caches, and browser history.
- **Cold Paths:** Verify the optimized path still behaves when the cache is empty, the
  index is missing, or the upstream is slow — measure the cold case too.
- **Regression Watch:** After shipping, keep the metric monitored; performance gains that
  are not watched quietly disappear.

## 7. Definition of Done & Quality Gates

- [ ] Baseline and after measurements recorded with the same tool and conditions.
- [ ] Bottleneck verified as fixed, or the next one identified with numbers.
- [ ] Test suite, lint, and type-check pass after the change.
- [ ] No security feature weakened; cache keys proven user-isolated where applicable.
- [ ] Cold-path behavior (empty cache, slow upstream) still correct.
- [ ] Change is minimal — one bottleneck addressed per change where practical.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; measurement tools (Lighthouse,
  profilers, `EXPLAIN`, APM) are the source of truth at implementation time.
