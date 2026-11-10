# Performance Optimization

Companion to the `eaz-frontend-design` skill. Measure and improve frontend web
performance: Core Web Vitals (LCP, CLS, INP), performance budgets, font optimization,
image optimization, and bundle size.

## Core Web Vitals

Core Web Vitals are Google's user-centric performance metrics. Measure them at the
75th percentile (p75) of real-user experiences, separately for mobile and desktop.

| Metric | What it measures | Good target | Poor threshold |
| :--- | :--- | :--- | :--- |
| **LCP** | Largest Contentful Paint — loading performance | ≤ 2.5 seconds | > 4 seconds |
| **CLS** | Cumulative Layout Shift — visual stability | ≤ 0.1 | > 0.25 |
| **INP** | Interaction to Next Paint — interaction responsiveness | ≤ 200 ms | > 500 ms |

### LCP — Largest Contentful Paint

LCP marks when the largest visible content element (usually a hero image, heading, or
block of text) is rendered. It measures loading performance.

- Optimize: server response time, render-blocking resources, resource load times, and
  client-side rendering.
- **Never** lazy-load the LCP image; eager-load it instead.
- Identify the LCP element in Lighthouse or Chrome DevTools and prioritize its delivery.

### CLS — Cumulative Layout Shift

CLS measures unexpected layout shifts that move visible content after it has rendered.
It measures visual stability.

- Always set width/height or `aspect-ratio` on images and iframes; avoid injecting
  content above existing content; reserve space for ads and embeddings; avoid
  web-font-driven layout shifts (use `font-display: optional` or `swap` with
  well-matched fallbacks).

### INP — Interaction to Next Paint

INP measures the latency of all page interactions (clicks, taps, keyboard presses) and
reports the worst-case (or near-worst-case) interaction latency. It measures interaction
responsiveness.

- Reduce JavaScript execution time, break up long tasks, avoid blocking the main thread,
  and use `isInputIdle` or `scheduler.yield` where supported.
- **Do not** use FID (First Input Delay) — it is deprecated; INP replaces it.

### Measurement rules

- **Measure at p75:** Core Web Vitals are evaluated at the 75th percentile of page
  loads, segmented by mobile and desktop. A p50 "good" score can hide poor p75
  experiences.
- **Distinguish lab from field data:** Lab data (Lighthouse, WebPageTest) is useful for
  debugging and regressions; field data (CrUX, Real User Monitoring) is what Google
  uses for rankings. Do not assume a good Lighthouse score guarantees good real-world
  performance.
- Use both: lab for iteration, field for truth.

## Performance Budgets

A performance budget is a hard or advisory limit on a measurable aspect of page
performance. Budgets prevent regressions and give the team a shared target.

Budgets must account for project complexity and device/network conditions. Do not
impose arbitrary universal limits; derive them from your baseline and user conditions.

| Budget | What is measured | Why it matters | How to monitor | On violation |
| :--- | :--- | :--- | :--- | :--- |
| **Initial JavaScript bundle** | Size of JS parsed/compiled on first load | Blocks main thread, delays TTI and INP | Bundle analyzer, `next/bundle-analyzer`, webpack stats | Code-split, lazy-load, remove unused dependencies |
| **Total JavaScript transferred** | All JS downloaded over the network | Data cost and parse/compile time | Network panel, Lighthouse, webpagetest | Defer non-critical JS, compress |
| **CSS assets** | Size of CSS on first render | Render-blocking; delays LCP | Network panel, Coverage tab | Remove unused CSS, inline critical CSS |
| **Font files** | Size of web font downloads | Can block text rendering; causes layout shift | Network panel, `next/font` metrics | Use WOFF2, subset, font-display, local hosting |
| **Images** | Total image bytes | Often the largest page contributor; delays LCP | Lighthouse, image audits | Use AVIF/WebP, resize, compress, lazy-load |
| **Third-party scripts** | Size and execution time of external scripts | Often render-blocking and main-thread heavy | Lighthouse third-party audit, network panel | Self-host, defer, lazy-load, or remove |
| **Network requests** | Total HTTP requests on load | Connection overhead, especially on high-latency networks | Network panel | Bundle resources, use HTTP/2, inline small assets |
| **Total page weight** | All resources transferred | Overall load cost and data usage | Lighthouse, WebPageTest | Optimize each category above |
| **LCP / CLS / INP** | Core Web Vitals | Primary user-experience metrics | CrUX, RUM, Lighthouse | Optimize per metric (see below) |

### Starting budgets

**Lightweight website** (marketing page, blog, small business site):

| Budget | Limit |
| :--- | :--- |
| Initial JavaScript bundle | ≤ 100 KB gzipped |
| Total JavaScript transferred | ≤ 150 KB gzipped |
| CSS assets | ≤ 50 KB gzipped |
| Font files | ≤ 60 KB total (WOFF2, subset) |
| Images | ≤ 500 KB total |
| Third-party scripts | ≤ 100 KB gzipped |
| Network requests | ≤ 40 |
| Total page weight | ≤ 1 MB |
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |

**Complex web application** (dashboard, SaaS, e-commerce storefront):

| Budget | Limit |
| :--- | :--- |
| Initial JavaScript bundle | ≤ 200 KB gzipped |
| Total JavaScript transferred | ≤ 400 KB gzipped |
| CSS assets | ≤ 100 KB gzipped |
| Font files | ≤ 100 KB total (WOFF2, subset) |
| Images | ≤ 1 MB total |
| Third-party scripts | ≤ 200 KB gzipped |
| Network requests | ≤ 70 |
| Total page weight | ≤ 2 MB |
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.1 |
| INP | ≤ 200 ms |

### Enforcing budgets

- Add budget checks to CI (e.g., `lighthouse-ci`, `bundlesize`, `webpack performance
  hints`, `next/bundle-analyzer`).
- Treat budget violations as blocking issues in PR reviews.
- Review budgets quarterly; tighten them as optimizations ship.

## Font Optimization

Web fonts are render-blocking and can cause layout shifts. Optimize them before
optimizing almost anything else.

- **Prefer WOFF2:** best compression and broad support. Serve WOFF2 first with fallbacks
  for older browsers.
- **Use variable fonts when beneficial:** one file covers multiple weights, reducing
  total font bytes at the cost of a larger single file — worthwhile when you use 3+
  weights.
- **Load only necessary weights and styles:** do not load an entire family if you only
  use regular and bold.
- **Avoid excessive font families:** two families maximum (one display, one reading).
- **Use `font-display` appropriately:** `swap` for body text, `optional` for non-critical
  display text, `block` only when the font must load before text is readable.
- **Preload only critical fonts:** use `<link rel="preload">` on the font needed for
  above-the-fold text; do not preload every font.
- **Avoid unnecessary external font requests:** self-host fonts when possible to remove
  DNS, SSL, and connection overhead; if using a third-party host, preconnect to its
  origin.
- **Use fallback font stacks:** match the fallback's metrics (x-height, line height,
  weight) to the web font to minimize layout shift on swap.
- **Minimize layout shifts from font loading:** size the fallback to closely match the
  web font using `size-adjust`, `ascent-override`, `descent-override`, and
  `line-gap-override` in `@font-face`.
- **Prefer local font hosting when appropriate:** removes third-party latency and
  privacy concerns.
- **Next.js:** use `next/font` (Google Fonts, local fonts, or custom fonts) — it
  automatically self-hosts, subsets, and preloads critical fonts with zero layout shift.

**Example — `next/font` with Google Fonts:**

```tsx
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['400', '700'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## Image Optimization

Images are often the largest contributors to page weight and LCP. Optimize format,
delivery, and loading.

- **AVIF and WebP:** serve AVIF where supported (best compression), WebP as fallback.
  Avoid JPEG/PNG unless transparency or compatibility requires it.
- **Responsive image delivery:** serve different sizes for different viewports; do not
  send a 2000px-wide image to a 360px phone.
- **`srcset` and `sizes`:** let the browser pick the right image for the screen density
  and layout size.
- **Correct image dimensions:** never scale a large image down with CSS; serve the size
  you display.
- **Image compression:** compress aggressively while preserving acceptable quality;
  use tools like `imagemin`, `sharp`, or your CDN's optimization.
- **Lazy load below-the-fold images:** `loading="lazy"` on images not in the initial
  viewport.
- **Eager load critical images:** the LCP image must not be lazy-loaded; use
  `loading="eager"` (default) and prioritize it.
- **Image aspect ratios:** set `width`/`height` or `aspect-ratio` so the browser
  reserves space before the image loads — this prevents CLS.
- **CDN and image transformation:** use an image CDN (Cloudinary, ImageKit, AWS
  Image Builder, or your provider's image optimization) to resize, compress, and
  format-convert on the fly.
- **Avoid unnecessarily large image downloads:** a full-resolution hero image on mobile
  is wasteful; serve per-device variants.

### Next.js — `next/image`

- Use `next/image` for automatic optimization (format, resize, lazy loading).
- Configure `width`, `height`, or `fill` layout correctly:
  - Fixed: `width` and `height` set; browser reserves space.
  - Fill: `style={{ position: 'absolute' }}` with a relatively positioned parent;
    requires `sizes`.
- Use `sizes` for responsive image delivery so the browser requests the right width.
- Prioritize the actual LCP image using the `priority` prop. Never lazy-load the LCP
  image.
- Configure remote image domains in `next.config.js` when using external images.

**Example:**

```tsx
import Image from 'next/image';

// LCP image: eager, prioritized, correct dimensions
<Image
  src="/hero.jpg"
  alt="Hero heading"
  width={1200}
  height={628}
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Below-the-fold image: lazy (default)
<Image
  src="/gallery-1.jpg"
  alt="Gallery item"
  width={800}
  height={600}
  loading="lazy"
/>
```

## LCP / CLS / INP Optimization Techniques

### LCP optimization

1. **Identify the LCP element** (hero image, heading, or hero text) via Lighthouse or
   Chrome DevTools Performance panel.
2. **Reduce server response time:** optimize backend, use a CDN, enable HTTP/2 or HTTP/3.
3. **Eliminate render-blocking resources:** inline critical CSS, defer non-critical CSS
   and JS.
4. **Prioritize the LCP resource:** `preload` the hero image,
   `fetchpriority="high"` on the LCP image, `priority` in `next/image`.
5. **Avoid client-side rendering of above-the-fold content** where possible; use server
   rendering or static generation.

### CLS optimization

1. **Always set dimensions:** `width`/`height` or `aspect-ratio` on images, iframes,
   and video.
2. **Reserve space** for ads, embeddings, and dynamic content.
3. **Avoid inserting content above existing content** (banners, cookie notices) unless
   space is reserved.
4. **Use `font-display: swap` or `optional`** and match fallback metrics to minimize
   font-swap shifts.
5. **Avoid animations that change layout properties** (top, left, width, height); use
   `transform` and `opacity`.

### INP optimization

1. **Reduce JavaScript execution time:** defer or lazy-load non-critical JS.
2. **Break up long tasks:** use `scheduler.yield()` or `setTimeout` chunking to keep
   main-thread tasks under 50 ms.
3. **Avoid blocking the main thread on interaction:** move heavy computation to web
   workers or the server.
4. **Use `passive: true`** on scroll/touch event listeners where possible.
5. **Debounce and throttle** expensive handlers (scroll, resize, search input).

## Implementation rules

- Baseline first, change second, re-measure always — never optimize from intuition alone.
- Attack the measured bottleneck: the fastest fix on the wrong component is wasted work.
- Biggest measured wins first; micro-optimizations wait until the large costs are gone.
- One change at a time, measured in isolation, so each gain is attributable.
- Security features are never traded for speed — validation, signatures, and rate limits
  stay on.
