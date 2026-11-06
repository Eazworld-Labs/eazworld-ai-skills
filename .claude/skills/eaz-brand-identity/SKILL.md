---
name: eaz-brand-identity
description: Define and document high-converting commercial client identity
  systems for Eazworld. Use when creating logo usage rules, color and
  typography scales, voice and tone guidelines, messaging pillars, brand
  asset libraries, or auditing existing materials for rapid client website
  builds at eazworldgh.com.
license: MIT
metadata:
  author: Eazworld
  department: digital-marketing
  version: "1.0.0"
---

# Brand Identity

## 1. Overview & Purpose

Defines how a commercial brand looks, sounds, and behaves, then documents it so
the identity ships fast and converts. Target users are founders and marketing
teams at Eazworld and eazworldgh.com clients who need a coherent,
high-converting presence across storefronts, packaging, ads, and social.
Delivers a usable identity system — visual tokens, voice rules, messaging
pillars, and production component blueprints — built for rapid client website
builds, not a mood board that dies in a slide deck.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to create or refresh a brand: logo rules,
  colors, typography, or a style guide.
- **Trigger 2:** When defining voice, tone, taglines, or messaging pillars.
- **Trigger 3:** When auditing existing materials (site, packaging, social) for
  visual or verbal inconsistency.
- **Anti-Trigger:** Do not activate for building UI components with an existing
  system (route to eaz-frontend-design), writing ad copy for a campaign (route
  to eaz-google-ads, eaz-meta-ads), or planning content calendars (route to
  eaz-social-media-management).

## 3. Required Inputs & Project Audit

Before anything is designed, capture the client in fifteen minutes:

- **Mandatory Inputs:**
  1. The audience: who the brand must persuade and what they already believe
     about the category.
  2. Positioning: the single difference the brand owns and the proof behind it.
  3. Existing assets: current logos, fonts, colors, and samples of past copy.

### Fast-Track Client Intake Audit (15-Minute Onboarding)

- **Core Offer:** what the client sells, to whom, at what price.
- **Brand Assets:** existing logos, colors, fonts, and copy samples.
- **Benchmark Sites:** three competitor or reference sites the client likes.
- **Conversion Goal:** the single action a visitor must take — book, buy, or sign up.
- **Trademark Clearance:** confirm the name or mark direction is usable in the target markets before design begins.

### Research & Audience Audit Checklist

1. Inventory every existing asset and mark what is actually in use versus abandoned.
2. Map the competitive visual landscape — what colors and tones saturate the category.
3. Collect audience language from reviews and support tickets for voice grounding.
4. Verify trademark availability before finalizing a name or mark direction.

## 4. Technical Standards & Rules

The system covers both halves: visual (logo usage, color, typography, imagery,
spacing) and verbal (voice, tone, message pillars, vocabulary) — a brand with
only one half drifts.

### Modular Type Scale — 1.250 (Major Third)

| Size | Value | Use |
|------|-------|-----|
| xs | 0.75rem | captions, small labels |
| sm | 0.938rem | supporting text |
| base | 1rem | body copy |
| lg | 1.25rem | section headings |
| xl | 1.563rem | page headings |
| 2xl | 1.953rem | hero headings |

Weights: 400 (body), 500 (emphasis), 700 (display). Line heights: body 1.5,
display 1.1. Display type serves headings and hero moments; body type serves
reading — no sizes outside the scale.

### Anti-Vibecoding & High-Speed Build Rules

**Banned:**
- Unstyled floating AI gradients — decorative gradients without a content reason.
- Generic AI copy — no "synergistic paradigm shifts" or insider-only buzzwords.

**Required 3-zone visual layout:**
1. Primary Hero — single offer, one CTA, above the fold.
2. Social Proof Bar — client logos, ratings, or case results under the hero.
3. High-Contrast Section Alternation — dark surface / light surface throughout the page.

### Production Component Blueprints

**Hero Block:** headline (type-xl), one subhead (type-base), primary CTA button,
hero image or illustration, action-primary / action-accent tokens only.

**Value Prop Grid:** three-up card grid (space-lg gaps), icon + type-lg heading +
type-sm body per card, radius-md, shadow-md, no gradients.

**Conversion CTA Section:** dark surface alternate zone, type-lg centered
headline, one outlined + one filled CTA, form fields with radius-md and
border-subtle.

### CSS Token Architecture

```css
/* Color tokens — Eazworld agency palette (EXAMPLE-ONLY input values). */
:root {
  --color-bg-app: #f8fafc;
  --color-surface-base: #ffffff;
  --color-surface-elevated: rgba(0,0,0,0.03);
  --color-border-subtle: #e2e8f0;
  --color-text-primary: #0f172a;
  --color-text-muted: #475569;
  --color-action-primary: #0f172a;
  --color-action-accent: #f59e0b;
}

/* Typography tokens (1.250 Major Third scale). */
:root {
  --font-display: "Sora", sans-serif;
  --font-body: "Inter", sans-serif;
  --type-xs: 0.75rem;
  --type-sm: 0.938rem;
  --type-base: 1rem;
  --type-lg: 1.25rem;
  --type-xl: 1.563rem;
  --type-2xl: 1.953rem;
  --type-leading-body: 1.5;
  --type-leading-display: 1.1;
}

/* Spatial & surface tokens. */
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}

/* Dark theme surface pairings. */
[data-theme="dark"] {
  --color-bg-app: #090d16;
  --color-surface-base: #0b0e14;
  --color-surface-elevated: rgba(255,255,255,0.06);
  --color-border-subtle: rgba(255,255,255,0.1);
  --color-text-primary: #f8fafc;
  --color-text-muted: #94a3b8;
}
```

Colors are defined with accessible contrast in mind — text and background pairs
meet WCAG AA so the brand never ships unreadable content.
Logo rules state minimum size, clear space, background variants, and explicit
do-nots (no stretching, recoloring, or adding effects).
Voice is described as traits with contrast pairs — see the Verbal System
Formatting Model below — and every trait ships with an example of right and
wrong.
Tokens are expressed in code form so design and implementation share one source:
developers consume the same values designers approve.

### Verbal System — Formatting Model

Voice Trait: Confident, Never Arrogant.

- DO: Lead with the offer. "We build stores that convert."
- DON'T: Apologize or hedge. "Hopefully this works for you."
- DO: Credit the client's expertise.
- DON'T: Claim sole credit or oversell results.
- DO: Specific outcomes — "Checkout in under a minute."
- DON'T: Vague buzzwords — "Synergistic paradigm shift."
- DO: Simple, plain English.
- DON'T: Jargon only insiders understand.

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the brand's difference, the audience, and
   where the identity will be applied first; run the 15-minute client intake
   audit (Core Offer, Brand Assets, Benchmark Sites, Conversion Goal,
   Trademark Clearance) before designing anything.
2. **Step 2: Inspect Context** — Execute the audit checklist; report what
   exists and what conflicts before proposing a new system.
3. **Step 3: Formulate Plan** — Draft directions: visual options grounded in
   the positioning, then the messaging pillars that all copy must serve, then
   the component blueprints (Hero Block, Value Prop Grid, Conversion CTA).
4. **Step 4: Verify Security** — Confirm trademark clearance is checked and no
   competitor's distinctive elements are being imitated.
5. **Step 5: Apply Edits** — Finalize the system: tokens, logo rules, type
   scale, voice pairs, and do/don'ts, written as a guide others can follow.
   Prepare the engineering handover to eaz-frontend-design.
6. **Step 6: Execute Tests** — Apply the system to three real surfaces (a
   product page, a social post, an email) and check that both a designer and a
   developer could produce matching output from the guide alone.
7. **Step 7: Report Status** — Report the system delivered, surfaces verified,
   open items (asset redraws, domain checks), and that blueprints are handed to
   eaz-frontend-design for rapid engineering.

## 6. Security & Edge Case Guidelines

- **Trademark:** Search before finalizing — a beautiful mark that cannot be used
  is worthless; note the jurisdictions that matter (Ghana plus target export
  markets).
- **Accessibility:** Contrast failures make the identity unusable for part of
  the audience; test every text pairing before publishing the guide.
- **Consistency Edges:** Dark mode, photography-heavy layouts, and third-party
  co-branding are where systems break — define rules for each instead of
  improvising.
- **Asset Control:** The guide ships with a single asset library location;
  copies multiply into stale versions that undermine everything.
- **Honesty:** Claims in messaging pillars must be provable — a pillar the
  product cannot keep becomes a liability in advertising review and a violation
  of advertising policies in every market where the brand runs ads.

## 7. Definition of Done & Quality Gates

- [ ] Visual system complete: logo rules, color tokens with contrast pairs,
      type scale, imagery guidance.
- [ ] Verbal system complete: voice traits with contrast pairs, message
      pillars with proof, vocabulary do/don'ts.
- [ ] Every color pairing passes WCAG AA contrast.
- [ ] Trademark search documented before final approval.
- [ ] KPIs defined with baseline and target — consistency audit findings across
      surfaces, asset reuse rate, and brand-search volume over time.
- [ ] Guide tested by applying it to three real surfaces successfully.
- [ ] Anti-vibecoding check passed: zero unstyled floating gradients, zero
      generic AI buzzwords, clear 3-zone visual layout.
- [ ] Fast-track client intake audit documented.
- [ ] Production component blueprints mapped for rapid engineering handover.
- [ ] Design Token Enforcement: All colors, spacing, radii, and shadows
      referenced strictly via CSS variables or framework tokens.
- [ ] Type Scale Compliance: All heading and body text sizing adheres to the
      1.250 modular type scale (xs through 2xl).

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the finished guide lives in
  the project's own brand documentation as the single source of truth.
