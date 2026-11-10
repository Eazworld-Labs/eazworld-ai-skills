# Responsive Layouts

Companion to the `eaz-frontend-design` skill. Responsive layout approaches: when to use each, breakpoints, flexible dimensions, responsive typography, spacing, and component behaviour.

## 1. Mobile-First

Write base styles for narrow screens, then add enhancements for wider viewports with `min-width` media queries.

**When to use:** Default for web projects — matches the skill's verification at 360 → 768 → 1440px.

**Breakpoints:** 360 (small), 768 (tablet), 1024 (laptop), 1440 (wide); content-driven when a layout breaks earlier.

**Example:**
```css
.card {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .card {
    padding: var(--space-6);
  }
}
```

## 2. Desktop-First

Write base styles for wide screens, then override for narrower viewports with `max-width` media queries.

**When to use:** Legacy projects or complex desktop interactions that do not translate simply to mobile.

**Caution:** Can ship unused desktop CSS to mobile users; prefer mobile-first for new work.

## 3. Fluid Layout

Elements scale continuously with the viewport using percentages, `dvw`, and `clamp()`.

**When to use:** Hero typography, full-width sections, containers that should stretch smoothly.

**Example:**
```css
.hero-title {
  font-size: clamp(2rem, 1rem + 5vw, 4rem);
}

.container {
  width: 90%;
  max-width: 1200px;
}
```

Never use `vw` alone — it gets too small and too large on extreme screens.

## 4. Fixed Layout

Elements use fixed pixel widths; the page does not stretch.

**When to use:** Rarely — print-style documents, fixed-size widgets, exact-match designs.

**Caution:** Causes horizontal scroll on narrow screens; avoid for general web layouts.

## 5. Adaptive Layout

Distinct layouts at specific breakpoints (snapping between fixed states), not continuous fluidity.

**When to use:** When content genuinely needs different structures at different sizes (e.g., cards → list).

**Implementation:** Media queries at 360/768/1024/1440; each breakpoint has its own grid or column count.

## 6. Responsive Layout

The umbrella approach: fluid dimensions + media queries + container queries, adapting to both viewport and component size.

**When to use:** All production web layouts — the default.

**Breakpoints:** 360 (small), 768 (tablet), 1024 (laptop), 1440 (wide); content-driven when a layout breaks earlier.

**Flexible dimensions:** `fr` units, percentages, `minmax()`, `auto-fit`/`auto-fill`, `clamp()`, logical properties (`margin-inline`, `padding-block`).

**Responsive typography:** `clamp()` between type-scale steps; line height 1.5 for body, 1.1 for display; `tabular-nums` for prices.

**Responsive spacing:** gaps and padding from the spacing scale; vertical rhythm — space between sections is clearly larger than space inside them.

**Component behaviour:**
- Navigation: bar → menu
- Grids: columns collapse 4 → 2 → 1
- Tables: cards or horizontal scroll
- Hero: split → stacked
- Images: reserve space with `aspect-ratio`, serve responsive sizes
- Touch vs hover: no hover-only information

Use container queries (`@container`) so components respond to their own space, not the viewport.
