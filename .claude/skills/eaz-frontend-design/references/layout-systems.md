# Layout Systems

Companion to the `eaz-frontend-design` skill. When to use each CSS layout system and practical examples.

Each system covers: what it is, when to use it, when to avoid it, and a practical CSS example using project tokens.

## 1. Block Layout

The default flow for block-level elements (`div`, `p`, `h1`–`h6`, `section`, `main`, `footer`). Each block starts on a new line and takes the full width available.

**When to use:** Page sections, stacked content, paragraphs, forms stacked vertically — anything that naturally reads top to bottom.

**When to avoid:** Side-by-side content, wrapping item lists, anything needing precise alignment.

**Example:**
```css
.hero-section {
  display: block;
  width: 100%;
  margin-block: var(--space-6);
  padding-block: var(--space-8);
}
```

## 2. Inline Layout

The default flow for inline elements (`span`, `a`, `strong`, `em`). Elements sit on the same line, wrapping as needed; width and height are ignored.

**When to use:** Text-level styling, links within a sentence, badges inline with copy.

**When to use caution:** You cannot set width/height, and vertical alignment is limited.

**Example:**
```css
.badge {
  display: inline;
  padding: var(--space-1) var(--space-3);
  background: var(--color-surface-elevated);
  border-radius: var(--radius-sm);
}
```

## 3. Inline-Block Layout

`display: inline-block` — sits on the line like inline content but accepts width, height, padding, and margins.

**When to use:** Buttons, inline cards, avatars next to text, small side-by-side blocks that should wrap.

**When to avoid:** Complex page structure; gaps between inline-block items need whitespace handling.

**Example:**
```css
.icon-button {
  display: inline-block;
  width: 44px;
  height: 44px;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  vertical-align: middle;
}
```

## 4. Flexbox

One-dimensional layout — a row OR a column. Controls alignment, distribution, and ordering along a single axis.

**When to use:** Navigation bars, centering content, distributing space between items, card action rows, reversing order on mobile.

**When to avoid:** Two-dimensional page layouts with both rows and columns (use Grid instead).

**Example:**
```css
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-4);
  padding-inline: var(--space-6);
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
```

## 5. CSS Grid

Two-dimensional layout — columns AND rows together. Best for page and section structure.

**When to use:** Overall page layout, galleries, dashboards, repeating card grids, anything where you control both axes.

**When to avoid:** Simple one-dimensional rows/columns (use Flexbox).

**Example:**
```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-6);
}

.dashboard {
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto 1fr;
  gap: var(--space-6);
  height: 100dvh;
}
```

## 6. Multi-Column Layout

`column-count` / `column-width` — splits content into newspaper-style columns.

**When to use:** Long-form reading (articles, blog posts, documentation).

**When to avoid:** Interactive content, grids, anything where scrolling between columns would be awkward.

**Example:**
```css
.article-body {
  column-count: 2;
  column-gap: var(--space-6);
  column-rule: 1px solid var(--color-border-subtle);
}
```

## 7. Position-Based Layout

`position: static | relative | absolute | fixed | sticky` — places an element relative to its normal flow, its nearest positioned ancestor, the viewport, or its scroll container.

**When to use:** Overlays, tooltips, sticky headers, back-to-top buttons, absolute badges on images.

**When to avoid:** Primary page structure (prefer Flow/Flex/Grid); overuse creates fragile layouts.

**Example:**
```css
.card-badge {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}
```
