# Motion & Animation

Companion to the `eaz-frontend-design` skill. Motion is a **choice** made with the client,
like the styling method — and it is held to the same standards as color and spacing:
defined once as tokens, used by name, and always with a reduced-motion path.

CSS support facts below were checked against the `modern-web-guidance` data on
2026-11-06. Re-check before relying on a feature (see [Modern CSS](./modern-css.md)).

## 1. Choose the motion level

Ask the user, recommend **Subtle**, and record the answer in `DESIGN.md`.

| Level | What it means | Budget |
| :--- | :--- | :--- |
| **None** | No animation beyond instant state changes | Focus and loading indicators only |
| **Subtle** (default) | Motion confirms actions and eases changes | State feedback, one entrance moment per page, durations ≤ 250ms |
| **Expressive** | Motion carries the brand: scroll storytelling, shared-element transitions, springs | Needs a performance check and a reduced-motion variant for every effect |

## 2. Purpose before polish

Each animation must do one of these jobs. If it does none, delete it.

1. **Feedback** — the interface acknowledged the action (button press, saved, added to cart).
2. **Orientation** — show where something came from or went (menu slides from its
   trigger, list item morphs into its detail page).
3. **Attention** — point at the one thing that changed (new item, error field).
4. **Continuity** — hide waiting (skeleton loaders, optimistic updates).
5. **Brand** — a single signature moment, used sparingly.

## 3. Motion tokens

Define once, next to color and spacing tokens, and consume by name.

```css
:root {
  --duration-fast: 150ms;   /* hover, press, toggles */
  --duration-base: 250ms;   /* menus, tooltips, small reveals */
  --duration-slow: 400ms;   /* page and panel transitions */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);   /* most movement */
  --ease-enter: cubic-bezier(0, 0, 0, 1);        /* arriving: fast start, soft landing */
  --ease-exit: cubic-bezier(0.3, 0, 1, 1);       /* leaving: soft start, fast finish */
}
```

- Entrances use `--ease-enter`; exits are shorter (about 60–70% of the entrance) and use
  `--ease-exit`.
- Stagger lists with an index property — `animation-delay: calc(var(--i) * 40ms)` — and
  cap the total (about 400ms) so the last item is never waiting.
- Springs and bounces: use `linear()` easing (Baseline widely available since 2023-12-11).
  Always set a duration — `linear()` does not derive one — and provide a normal easing
  as the fallback declaration before it.
- These values are starting points; tune them to the chosen visual direction.

## 4. Performance rules

- Animate **`opacity` and `transform`** (including the individual `translate`, `scale`,
  and `rotate` properties) — they stay on the compositor thread. Do not animate
  `width`, `height`, `top`, `left`, or `margin`; use `transform` or the techniques below.
- Use `will-change` only on elements about to animate, and remove it afterwards.
- Never animate on every scroll event in JavaScript; use scroll-driven CSS or an
  `IntersectionObserver`.
- Keep interactions responsive: an animation must never delay the response to a tap or
  keypress.
- Test on a mid-range Android phone, not only a laptop.

## 5. Accessibility rules (non-negotiable)

- Every animation has a `prefers-reduced-motion` path. Nest the media query inside the
  rule so both versions stay together.
- **Do not** apply a global `animation-duration: 0.01ms` — it can make some animations
  more jarring. Decide per effect: remove movement (keep a fade), slow it down, or
  switch to a static state.
- Anything that loops or starts by itself (carousels, banners, background video) needs a
  visible **pause** control and should default to static where practical.
- Never flash more than three times per second.
- Do not use motion as the only signal; pair it with text or an icon.
- After a view or page transition, move focus to the new view's heading
  (`tabindex="-1"`), because transitions do not manage focus.

```css
.toast {
  animation: slide-in var(--duration-base) var(--ease-enter);
  @media (prefers-reduced-motion: reduce) {
    animation: fade-in var(--duration-fast) linear;   /* keep the cue, remove the travel */
  }
}
```

## 6. Patterns — CSS first

Reach for the platform before a library. Support status from the guidance data:

| Pattern | Technique | Support (checked 2026-11-06) | If unsupported |
| :--- | :--- | :--- | :--- |
| Micro-interactions (hover, press, focus) | `transition` on `transform`/`opacity`/color | Universal | — |
| Dialog, popover, and menu entry/exit | `@starting-style` + `transition-behavior: allow-discrete` (+ `overlay` for top-layer elements) | Baseline newly available since 2024-08-06; `overlay` is Chrome/Edge 117+ only | Instant open/close — acceptable |
| Shared-element and view changes (SPA) | View Transitions API: `document.startViewTransition()` with `view-transition-name` | Baseline newly available since 2025-10-14 (Chrome/Edge 111, Safari 18, Firefox 144) | Feature-detect; update the DOM without animation |
| Page-to-page transitions (multi-page sites) | `@view-transition { navigation: auto; }` | Chrome/Edge 126, Safari 18.2 — not Firefox | Normal navigation — acceptable |
| Scroll-linked reveals and progress bars | `animation-timeline: view()` / `scroll()` inside `@supports` | Chrome/Edge 115, Safari 26 — not Firefox | Show the content with no effect; do **not** use the scroll-timeline polyfill |
| Accordion / expanding card to `auto` height | `interpolate-size: allow-keywords` on `:root`, then transition `block-size` | Chrome/Edge 129 only | Instant jump; keep `block-size: auto` as the fallback and sync `aria-expanded` |
| Spring or bounce | `linear()` timing function | Baseline widely available | Standard easing declared first |
| Skeleton loading | Static placeholder shapes with a slow opacity or gradient shift | Universal | Static shapes |

Decorative scroll effects should be treated as **progressive enhancement**: no fallback
needed if the page is complete without them.

View-transition rules worth remembering: only one element may hold a given
`view-transition-name` before and after; remove temporary names when the transition
finishes; do not transition elements that already have running animations; transition
only the primary content people are tracking (hero image, heading).

## 7. Libraries — when CSS is not enough

Choose the lightest tool that does the job. Add a dependency only with explicit human
approval, and weigh its size against the page's performance budget.

| Need | Web | Notes |
| :--- | :--- | :--- |
| Enter/exit, layout, and gesture animation in React | **Motion** — npm package `motion`, import from `motion/react` | The successor to Framer Motion. Verified on npm: `motion` exports `./react` and `./react-client`. Needs client components in Next.js — keep animated parts in small leaf components |
| Complex timelines, scroll sequences, SVG | **GSAP** (+ ScrollTrigger) | Framework-agnostic; check the current license terms before client use |
| Rich illustrations and icons that animate | **Lottie** or **Rive** | Design-tool exports; mind file size; give a static fallback |
| Vue / Nuxt | Built-in `<Transition>` / `<TransitionGroup>`; Nuxt page and layout transitions | Often no library needed |
| React Native / Expo | **Reanimated** (entering/exiting and layout animations) | Run animations on the UI thread |
| Flutter | Implicit animations (`AnimatedContainer`, `AnimatedOpacity`), then explicit controllers; **Rive** for illustration | Respect the platform's "reduce motion" setting |

Library API names (for example `MotionConfig reducedMotion="user"` or Reanimated's
`useReducedMotion`) change between versions — confirm them in the installed version's
documentation, and always wire the reduced-motion setting.

## 8. Motion QA — add to Definition of Done

- [ ] Motion level chosen and recorded; no animation without a purpose from Section 2.
- [ ] Durations and easings come from tokens (run `scripts/check-tokens.cjs`).
- [ ] Only `transform`/`opacity` animated, except documented progressive enhancements.
- [ ] Reduced-motion path exists for every animation and was tested with the OS setting on.
- [ ] Looping or automatic motion has a pause control.
- [ ] Focus is moved after view or page transitions.
- [ ] Checked on a mid-range mobile device or throttled CPU: no dropped frames on key
      interactions.
