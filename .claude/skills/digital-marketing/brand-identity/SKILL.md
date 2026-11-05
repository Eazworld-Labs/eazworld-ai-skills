---
name: brand-identity
description: Define and document brand identity systems. Use when creating logo usage
  rules, color and typography scales, voice and tone guidelines, messaging pillars, brand
  asset libraries, or auditing existing materials for consistency across channels.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Brand Identity

## 1. Overview & Purpose

Defines how a brand looks, sounds, and behaves, then documents it so anyone can apply it
consistently. Target users are founders and marketing teams building a coherent presence
across storefront, packaging, ads, and social. Delivers a usable identity system — visual
tokens, voice rules, messaging pillars, and do/don't examples — not a mood board that
dies in a slide deck.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to create or refresh a brand: logo rules, colors,
  typography, or a style guide.
- **Trigger 2:** When defining voice, tone, taglines, or messaging pillars.
- **Trigger 3:** When auditing existing materials (site, packaging, social) for visual
  or verbal inconsistency.
- **Anti-Trigger:** Do not activate for building UI components with an existing system
  (route to frontend-design), writing ad copy for a campaign (route to google-ads,
  meta-ads), or planning content calendars (route to social-media-management).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The audience: who the brand must persuade and what they already believe about the
     category.
  2. Positioning: the single difference the brand owns and the proof behind it.
  3. Existing assets: current logos, fonts, colors, and samples of past copy.
- **Research & Audience Audit Checklist:**
  1. Inventory every existing asset and mark what is actually in use versus abandoned.
  2. Map the competitive visual landscape — what colors and tones saturate the category.
  3. Collect audience language from reviews and support tickets for voice grounding.
  4. Verify trademark availability before finalizing a name or mark direction.

## 4. Technical Standards & Rules

- The system covers both halves: visual (logo usage, color, typography, imagery, spacing)
  and verbal (voice, tone, message pillars, vocabulary) — a brand with only one half
  drifts.
- Colors are defined with accessible contrast in mind — text and background pairs meet
  WCAG AA so the brand never ships unreadable content.
- Logo rules state minimum size, clear space, background variants, and explicit
  do-nots (no stretching, recoloring, or adding effects).
- Typography defines a display and a body family with a type scale — arbitrary font
  sizes are the first sign of system decay.
- Voice is described as traits with contrast pairs (for example "confident, never
  arrogant") and every trait ships with an example of right and wrong.
- Tokens are expressed in code form so design and implementation share one source:
  developers consume the same values designers approve.

Example token architecture (values come from the brand audit; the primitive
palette is illustrative placeholder input, final values come from your audit):

```css
/* Primitive palette — EXAMPLE-ONLY values, input to the audit only. */
:root {
  --ink-950: #0b0e14;
  --ink-900: #111827;
  --paper-50: #f8fafc;
  --accent-500: #f59e0b;
}

/* Semantic mappings, light theme — components consume only these names. */
:root {
  --color-bg-app: #f8fafc;
  --color-surface-base: #f8fafc;
  --color-surface-elevated: #ffffff;
  --color-border-subtle: #e2e8f0;
  --color-text-primary: #0f172a;
  --color-text-muted: #475569;
  --color-action-primary: #0f172a;
  --color-action-accent: #f59e0b;
  --radius-md: 8px;
  --font-display: "Sora", sans-serif;
  --font-body: "Inter", sans-serif;
}

/* Dark theme — deep neutral surfaces with low-opacity white elevation. */
[data-theme="dark"] {
  --color-bg-app: #090d16;
  --color-surface-base: #0b0e14;
  --color-surface-elevated: rgba(255, 255, 255, 0.04);
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-text-primary: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-action-primary: #f8fafc;
  --color-action-accent: #fbbf24;
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the brand's difference, the audience, and where the
   identity will be applied first.
2. **Step 2: Inspect Context** — Execute the audit checklist; report what exists and
   what conflicts before proposing a new system.
3. **Step 3: Formulate Plan** — Draft directions: visual options grounded in the
   positioning, then the messaging pillars that all copy must serve.
4. **Step 4: Verify Security** — Confirm trademark clearance is checked and no
   competitor's distinctive elements are being imitated.
5. **Step 5: Apply Edits** — Finalize the system: tokens, logo rules, type scale, voice
   pairs, and do/don't examples, written as a guide others can follow.
6. **Step 6: Execute Tests** — Apply the system to three real surfaces (a product page,
   a social post, an email) and check that both a designer and a developer could produce
   matching output from the guide alone.
7. **Step 7: Report Status** — Report the system delivered, surfaces verified, and open
   items (asset redraws, domain checks).

## 6. Security & Edge Case Guidelines

- **Trademark:** Search before finalizing — a beautiful mark that cannot be used is
  worthless; note the jurisdictions that matter (Ghana plus target export markets).
- **Accessibility:** Contrast failures make the identity unusable for part of the
  audience; test every text pairing before publishing the guide.
- **Consistency Edges:** Dark mode, photography-heavy layouts, and third-party
  co-branding are where systems break — define rules for each instead of improvising.
- **Asset Control:** The guide ships with a single asset library location; copies
  multiply into stale versions that undermine everything.
- **Honesty:** Claims in messaging pillars must be provable — a pillar the product
  cannot keep becomes a liability in advertising review and a violation of advertising
  policies in every market where the brand runs ads.

## 7. Definition of Done & Quality Gates

- [ ] Visual system complete: logo rules, color tokens with contrast pairs, type scale,
      imagery guidance.
- [ ] Verbal system complete: voice traits with contrast pairs, message pillars with
      proof, vocabulary do/don'ts.
- [ ] Every color pairing passes WCAG AA contrast.
- [ ] Trademark search documented before final approval.
- [ ] KPIs defined with baseline and target — consistency audit findings across
      surfaces, asset reuse rate, and brand-search volume over time.
- [ ] Guide tested by applying it to three real surfaces successfully.
- [ ] **Design Token Enforcement:** All colors, gaps, margins, padding, radii,
      and shadows are referenced strictly via CSS variables or framework theme
      tokens (zero raw/hardcoded hex or arbitrary pixel values in component files).
- [ ] **Type Scale Compliance:** All heading and body text sizing adheres to the
      1.250 modular type scale (`xs` through `2xl`) with no arbitrary font size
      overrides.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the finished guide lives in the
  project's own brand documentation as the single source of truth.
