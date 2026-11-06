# Visual System Reference

Companion to the `frontend-design` skill. These are **default** values for projects
that have no token set of their own. If the client supplies tokens, a `DESIGN.md`, or a
Figma library, those win — adapt the structure below, not the numbers.

## Color tokens — three layers

1. **Primitive base** — raw palette values with no meaning (`--blue-500`).
2. **Semantic intent** — what a color means: `--color-bg-app`, `--color-surface-base`,
   `--color-surface-elevated`, `--color-border-subtle`, `--color-text-primary`,
   `--color-text-muted`, `--color-action-primary`, `--color-action-accent`.
3. **Component scope** — aliases semantic names for one fixed purpose
   (`--button-bg: var(--color-action-primary)`).

Components consume only semantic and component names.

## Dark-mode surfaces

Deep neutral app backgrounds (`#090d16` / `#0b0e14`). Express elevation with sequential
surface fills or low-opacity white overlays — never pure-black panels stacked on a
pure-black background.

## Glassmorphism (strict)

`backdrop-filter: blur(12px)` plus a translucent fill plus a 1px border — only on
neutral surfaces (navbars, dialogs, panels), never behind primary action buttons or
body copy.

## Typography — 1.250 modular scale (Major Third)

`xs` 0.75rem → `2xl` 1.953rem in 1.250 steps; weights 400 (body) through 700 (display
and emphasis only). Display type serves headings and hero moments (line height 1.1);
body type serves reading (line height 1.5) — nothing in between is invented. Native
apps map the same ratios to the platform's text styles and honor system text scaling.

## Spatial grid

8px base grid with 4px half-steps — every margin, padding, and gap resolves to the
grid; no arbitrary offsets.

## Surface finishes

Border-radius tiers `sm` 4px → `xl` 16px plus `full`; shadow elevation tiers
`sm` / `md` / `lg`. Elevation expresses hierarchy, so shadows are assigned by layer,
never by taste.

## Adapting to a client brand

1. Replace primitives with the client palette; keep the semantic names unchanged.
2. Verify every text/surface pairing at 4.5:1 (3:1 for large text and UI borders).
3. Record the result in the project's `DESIGN.md` so later work reads one source.
