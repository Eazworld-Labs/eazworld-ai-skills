# Modern CSS

Companion to the `eaz-frontend-design` skill. Use the platform before a library: native CSS
now covers responsive components, fluid type, theming, and most motion. Facts here were
checked against the `modern-web-guidance` data on 2026-11-06.

## Support policy

| Baseline status | What to do |
| :--- | :--- |
| **Widely available** | Use freely, no fallback |
| **Newly available** | Use with a fallback, or progressive enhancement if the effect is decorative |
| **Limited availability** (some engines only) | Progressive enhancement only — the page must be complete without it |

If the project states a browser-support policy in `PROJECT.md`, that policy wins. To
re-check any feature, search the guidance index:
`npx -y modern-web-guidance@latest search "<what you want to do>"`, then `retrieve` the
matching guide. Never assert support from memory.

## Responsive layout

- **Container queries** (`@container`): make components respond to their own space, not
  the viewport. A card that lives in a sidebar and in a main column should not need two
  versions.
- **Dynamic viewport units** (`dvh`, `dvw`): use them instead of `vh`/`vw` so layouts do
  not break when a mobile address bar appears or hides.
- **`aspect-ratio`** on images and video: reserves space while they load and prevents
  layout shift.
- **Grid and flexbox first**: let content and `minmax()`/`auto-fit` shape the layout
  rather than stacks of media queries. Reserve media queries for real layout changes.

## Fluid typography and spacing

- Scale type with `clamp()` and a mix of viewport and font-relative units, for example
  `font-size: clamp(2rem, 1rem + 5vw, 4rem)`. Never use `vw` alone — it gets too small
  and too large on extreme screens.
- Keep the modular scale as the source of the steps; use `clamp()` only to move between
  a mobile and a desktop value of each step.
- Use `tabular-nums` (`font-variant-numeric: tabular-nums`) for prices, tables, and
  anything that must line up.

## Color and theming

- **Declare both schemes**: `<meta name="color-scheme" content="light dark">` in the head
  to avoid a flash of the wrong theme, and `color-scheme: light dark` on `:root` so
  scrollbars, form controls, and the canvas match.
- **`light-dark()`** defines a token's light and dark value in one place:
  `--color-brand: light-dark(var(--brand-light), var(--brand-dark));`. A manual theme
  toggle overrides `color-scheme` on `:root`.
- **Tints and shades**: prefer predefined tokens. If you must generate one, use
  `color-mix(in oklab, <color>, white 30%)` (safe in gamut, but can wash out colors).
  Do **not** adjust only the lightness of an `oklch()` color with relative syntax —
  browsers do not yet gamut-map it reliably, so results are unpredictable.
- **Never rely on color alone** for state: pair it with an icon or text.
- **Contrast**: 4.5:1 for body text, 3:1 for large text, icons, and the boundaries of
  controls. Use `@media (prefers-contrast: more)` only if the design uses low-contrast
  accents that need reinforcing.
- **Forced colors** (Windows High Contrast): shadows, backgrounds, and border images are
  stripped. Do not use them as the only border or state indicator; add `outline` or a
  real `border`, and use system color keywords (`CanvasText`, `Highlight`) there.

## Motion features

See [Motion & Animation](./motion-and-animation.md) for the support table covering
`@starting-style`, View Transitions, scroll-driven animations, `interpolate-size`, and
`linear()` easing.

## Writing maintainable CSS

- Tokens as custom properties on `:root`; components read tokens, never raw values.
- One naming approach per project (BEM, CSS Modules, utility classes) — follow the
  existing one.
- Keep specificity low and flat; avoid `!important` except to honor a user preference.
- Prefer logical properties (`margin-inline`, `padding-block`) where the product may be
  localized to right-to-left languages.
- Delete unused CSS; check the coverage panel before launch.
