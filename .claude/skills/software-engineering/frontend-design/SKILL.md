---
name: frontend-design
description: Design and build accessible, responsive user interfaces with React, Next.js,
  TypeScript, and Tailwind CSS. Use when creating UI components or pages, establishing
  design tokens, fixing styling and layout bugs, improving accessibility, or optimizing
  Core Web Vitals.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Frontend Design

## 1. Overview & Purpose

Turns designs, specs, and descriptions into production-quality user interfaces. Covers
component implementation, responsive layout, accessibility, styling systems, and
performance on the client. Delivers components that are keyboard-reachable, readable by
screen readers, and fast on mid-range mobile devices — not just correct in a desktop
browser.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build, restyle, or refactor a UI component, page, or
  layout.
- **Trigger 2:** When fixing styling bugs, responsive breakpoints, or visual regressions.
- **Trigger 3:** When improving accessibility, contrast, keyboard navigation, or Core Web
  Vitals (LCP, CLS, INP).
- **Anti-Trigger:** Do not activate for API contracts, server-side logic, or database
  work — route those to the department's backend skills.

## 3. Required Inputs & Project Audit

Before writing any UI code, inspect the target repository:

- **Mandatory Inputs:**
  1. Design reference: screenshot, Figma frame, `DESIGN.md`, or a written description.
  2. Content and copy that the interface must display (final text, not lorem ipsum).
  3. Target viewports and browser support expectations.
- **Codebase Audit Checklist:**
  1. Inspect `package.json` for React/Next.js/Tailwind versions and existing UI
     dependencies.
  2. Review the existing component library and reuse its primitives before adding new ones.
  3. Check lint and format configuration (ESLint, Prettier) and match its conventions.
  4. Look for existing design tokens, theme files, or global styles.

## 4. Technical Standards & Rules

- Strict TypeScript: no `any` in component props; interfaces for every public component
  API.
- Mobile-first responsive design — verify at 360px, 768px, and 1440px at minimum.
- Semantic HTML first; ARIA only where native semantics cannot express the pattern.
- Full keyboard support: every interactive element reachable and operable without a mouse,
  with a visible focus state.
- Contrast ratio of at least 4.5:1 for body text (WCAG AA).
- Compose small components; prefer composition over configuration-heavy prop APIs.
- Server Components by default — add `"use client"` only when the component genuinely
  needs state, effects, or browser APIs.
- No new dependencies without explicit human approval.

Example of a typed, single-purpose component:

```tsx
type BadgeProps = { label: string; tone: 'info' | 'warn' | 'danger' };

export function Badge({ label, tone }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{label}</span>;
}
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the screen or component, its states (default, loading,
   empty, error), and its responsive requirements.
2. **Step 2: Inspect Context** — Execute the audit checklist; identify which existing
   components and tokens can be reused.
3. **Step 3: Formulate Plan** — Sketch the component tree and state ownership before
   writing code.
4. **Step 4: Verify Security** — Confirm no secrets or private data will be shipped in the
   client bundle.
5. **Step 5: Apply Edits** — Implement the components with atomic, scoped changes to
   related files only.
6. **Step 6: Execute Tests** — Run type-check, lint, and the test suite; check the page at
   all target viewports.
7. **Step 7: Report Status** — Summarize what shipped, verification results, and any
   visual or accessibility caveats.

## 6. Security & Edge Case Guidelines

- **Zero Hardcoding:** No API keys or secrets in client code — the browser bundle is
  public. Use `NEXT_PUBLIC_*` variables only for values that are meant to be public.
- **Input Sanitization:** Treat all user-generated content as hostile — escape on render
  and never inject raw HTML unless it passes an explicit sanitizer.
- **Safe HTML:** Avoid `dangerouslySetInnerHTML`; if unavoidable, sanitize with a reviewed
  library and document why.
- **External Links:** Open external links with `rel="noopener noreferrer"`.
- **Edge States:** Every data-driven view implements loading, empty, and error states — a
  spinner is not an error state.

## 7. Definition of Done & Quality Gates

- [ ] Type-check, lint, and test suite pass (`tsc`, `npm run lint`, `npm test`).
- [ ] Layout verified at 360px, 768px, and 1440px viewports.
- [ ] Keyboard path works end to end with visible focus states.
- [ ] Text contrast meets WCAG AA (4.5:1).
- [ ] No secrets or private data present in the client bundle.
- [ ] Loading, empty, and error states implemented for data-driven views.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; design tokens and component
  conventions live in the target project's own theme and component library.
