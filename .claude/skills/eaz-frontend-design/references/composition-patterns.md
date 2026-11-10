# Composition Patterns

Companion to the `eaz-frontend-design` skill. Website composition patterns: structure, suitable use cases, advantages, and implementation approaches.

Each pattern includes: structure, when to use, advantages, and implementation notes.

## 1. Single-Column Layout

**Structure:** One centered content column, either full-width sections or a constrained max-width container.

**Suitable use cases:** Blog posts, articles, landing pages, onboarding flows, documentation.

**Advantages:** Easy to read, strong focus on one primary action, mobile-friendly by default.

**Implementation:** Centered container with `max-width: 65ch` for body text; wider `1440px` for media sections; stack vertically on all breakpoints.

## 2. Two-Column Layout

**Structure:** Two vertical columns — typically main content plus a sidebar, or image beside text.

**Suitable use cases:** Blog with sidebar, product page (gallery + details), contact page (form + info).

**Advantages:** Pairs related content side by side; efficient use of horizontal space.

**Implementation:** Grid or Flexbox on desktop; stack to a single column below 768px.

## 3. Three-Column Layout

**Structure:** Three vertical columns — sidebar, main content, sidebar (or three equal cards).

**Suitable use cases:** Dashboards with nav + content + widgets, pricing tables (three plans), feature showcases.

**Advantages:** Balances navigation, content, and supplementary information.

**Implementation:** 12-column grid (e.g., 3–6–3) collapsing to one column on mobile.

## 4. Split-Screen Layout

**Structure:** Screen divided vertically into two distinct halves, often with different treatments.

**Suitable use cases:** Auth pages (form + brand image), sales pages (copy + testimonial), service vs product comparison.

**Advantages:** Strong visual contrast, clear separation of two messages.

**Implementation:** Grid `1fr 1fr` or Flexbox; stack on mobile, choosing which half appears first based on content priority.

## 5. Asymmetrical Layout

**Structure:** Uneven column widths, overlapping elements, or off-centre focal points.

**Suitable use cases:** Creative portfolios, editorial designs, brands wanting a distinctive look.

**Advantages:** Memorable, breaks the templated look, guides the eye deliberately.

**Implementation:** Grid with fractional columns (`2fr 1fr`), `grid-column`/`grid-row` spans on individual items, `z-index` layering; keep body text within a readable measure.

## 6. Bento Grid Layout

**Structure:** Variable-size rectangular tiles that fit together like a bento box — a mix of large and small cards.

**Suitable use cases:** Feature showcases, dashboards, app home screens, pricing with mixed card sizes.

**Advantages:** Visually interesting, mixes content densities, works well with responsive reflow.

**Implementation:** CSS Grid with `grid-template-columns: repeat(auto-fit, minmax(...))` and `grid-column-span`/`grid-row-span` on individual items; use `grid-auto-flow: dense` only when tile order does not matter.

## 7. Masonry Layout

**Structure:** Items of varying height arranged in columns with no vertical gaps between them (like Pinterest).

**Suitable use cases:** Image galleries, user-generated content feeds, portfolios with mixed aspect ratios.

**Advantages:** No wasted vertical space; natural for image-heavy content.

**Implementation:** CSS Grid `grid-template-rows: masonry` where supported with a fallback; otherwise `column-count` with `break-inside: avoid` on items. Check baseline support before using `masonry` value.

## 8. Full-Width Layout

**Structure:** Content stretches edge to edge with no side margins, section by section.

**Suitable use cases:** Hero sections, immersive storytelling, video backgrounds, bold marketing pages.

**Advantages:** Impactful, modern, no constrained container.

**Implementation:** `width: 100vw` sections with an inner constrained content block; watch for horizontal scroll; use `overflow-x: hidden` on the body only when needed.

## 9. Centered Container Layout

**Structure:** All content sits in a centered container with a max-width and generous side gutters.

**Suitable use cases:** Corporate sites, SaaS marketing pages, dashboards, documentation.

**Advantages:** Readable measure, predictable, works on all screen sizes.

**Implementation:** `.container { max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6); }`; narrow body text to `65ch`.

## 10. Dashboard Layout

**Structure:** Fixed or sticky sidebar (navigation), top header, main content area, often with a grid of widgets or cards.

**Suitable use cases:** Admin tools, analytics, SaaS applications, management interfaces.

**Advantages:** Persistent navigation, clear content region, scalable widget grid.

**Implementation:** Grid `grid-template-columns: 250px 1fr; grid-template-rows: auto 1fr`; sticky sidebar and header; responsive — sidebar collapses to icons or a drawer below 1024px.
