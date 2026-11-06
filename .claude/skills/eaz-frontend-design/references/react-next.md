# React & Next.js Notes

Companion to the `eaz-frontend-design` skill. Apply on top of the core rules when the
manifest shows `react` or `next`. Match the project's installed versions — check
`package.json` before using any API below.

## Defaults

- Strict TypeScript: no `any` in component props; an exported type or interface for
  every public component API.
- **Next.js App Router:** Server Components by default. Add `"use client"` only when a
  component genuinely needs state, effects, event handlers, or browser APIs, and push
  it as far down the tree as possible.
- Fetch data in Server Components or route handlers; do not fetch in effects when a
  server path exists.
- Use the framework's `next/image` and `next/font` for images and fonts — they handle
  sizing, lazy loading, and layout shift.
- Public environment variables use the `NEXT_PUBLIC_` prefix and only for values meant
  to be public.

## Styling

- Tailwind: tokens live in the theme (`@theme` in v4, `tailwind.config` in v3); no
  arbitrary values (`w-[13px]`, `text-[#123456]`) in components.
- CSS Modules / CSS-in-JS: tokens as CSS variables on `:root`, consumed by name.
- Match the component library already installed (shadcn/ui, MUI, Chakra) before writing
  a primitive from scratch.

## Accessibility & states

- Prefer native elements (`button`, `a`, `label`) before `div` with roles.
- Use the framework's `loading.tsx` and `error.tsx` for route-level states; build
  component-level skeletons and empty states explicitly.
- Forms: associate every input with a label, announce validation errors, and keep
  server-side validation authoritative.

## Animation

- CSS first (transitions, `@starting-style`, view transitions, scroll-driven animation) —
  see [Motion & Animation](./motion-and-animation.md). Add **Motion** (npm `motion`,
  import from `motion/react`) only when CSS cannot do the job and a dependency is
  approved.
- Motion components need the client. Keep them in small leaf components marked
  `"use client"` so the surrounding page stays a Server Component.
- Wire the reduced-motion setting (Motion offers `MotionConfig` with
  `reducedMotion="user"` — confirm in the installed version's docs).
- Animate `transform` and `opacity`; use `AnimatePresence` or CSS for exits rather than
  unmounting instantly.

## Verification

Run the project's scripts — typically `tsc --noEmit`, `npm run lint`, `npm test`, and
`npm run build` — and check the page at 360 / 768 / 1440px.
