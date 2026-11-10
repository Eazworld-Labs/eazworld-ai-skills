# Layout Implementation

Companion to the `eaz-frontend-design` skill. Working layout examples in HTML/CSS, CSS Grid, Flexbox, Tailwind CSS, and React & Next.js.

All examples use semantic HTML and design tokens — no raw hex or arbitrary pixel values in components.

## HTML & CSS (plain)

Single-column centered container that becomes a two-column layout on desktop:

```html
<main class="page">
  <article class="article">
    <h1>Title</h1>
    <p>Body copy…</p>
  </article>
  <aside class="sidebar">…</aside>
</main>
```

```css
.page {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  padding: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .page {
    grid-template-columns: 3fr 1fr;
  }
}
```

## CSS Grid

Dashboard shell with sidebar, header, main area, and widget grid:

```html
<div class="dashboard" role="region" aria-label="Dashboard">
  <aside class="sidebar">…</aside>
  <header class="header">…</header>
  <main class="main">…</main>
  <div class="widgets">…</div>
</div>
```

```css
.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  gap: var(--space-6);
  height: 100dvh;
}

.sidebar { grid-area: sidebar; }
.header { grid-area: header; }
.main { grid-area: main; }

.widgets {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}
```

## Flexbox

Navigation bar and a card with actions pinned to the bottom:

```html
<nav class="navbar">
  <a class="logo" href="/">Brand</a>
  <ul class="nav-links">
    <li><a href="/products">Products</a></li>
  </ul>
</nav>
```

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block: var(--space-4);
  padding-inline: var(--space-6);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
}

.card-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: auto;
}
```

## Tailwind CSS

```jsx
<section className="mx-auto max-w-7xl px-6 py-12">
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
    <article className="col-span-1 lg:col-span-2">…</article>
    <aside>…</aside>
  </div>
</section>
```

Tokens live in `tailwind.config` / `@theme`; no arbitrary values (`w-[13px]`, `text-[#123456]`) in components.

## React & Next.js (App Router)

```tsx
"use client";

import { Grid } from "@/components/ui/grid"; // project primitive

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section className="my-12">
      <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="space-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Grid>
    </section>
  );
}
```

Server Component by default; add `"use client"` only where state, effects, event handlers, or browser APIs are genuinely needed, and push it as far down the tree as possible. Match the project's installed component library (shadcn/ui, MUI, Chakra) before writing a primitive from scratch.
