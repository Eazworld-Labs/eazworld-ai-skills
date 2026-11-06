# DESIGN.md

Copy this file to the root of a client project. The `eaz-frontend-design` skill fills it in
from the choices you make, and reads it on later tasks instead of asking again. Never
put secrets in this file.

## Design Purpose

- **Audience + context:**
- **The one job:**
- **The one impression:**
- **Primary action:**

## Discovery

<!-- One line per answer from the discovery questions; TBD where open. -->

- **Pages / screens at launch:**
- **Copy status:**
- **Photos and media:**
- **Features at launch:**
- **Who edits content after launch:**
- **Reference sites (liked / disliked):** <!-- details in the Inspiration section -->
- **Constraints (deadline, budget, hosting):**

## Inspiration

<!-- Pages, apps, or images the client likes (and one they dislike). Write "none given"
     if there are none. Take principles, never assets. -->

| Source | What we like | What we take | What we avoid |
| :--- | :--- | :--- | :--- |
|  |  |  |  |

## Choices

- **Styling method:** <!-- Tailwind | plain CSS | CSS Modules | SCSS | CSS-in-JS | library theming | native -->
- **Visual direction:** <!-- clean & minimal | bold & vibrant | dark & premium | warm & friendly | editorial | dashboard -->
- **Motion level:** <!-- none | subtle | expressive -->
- **Icon set:** <!-- Lucide | Phosphor | Heroicons | Tabler | Material Symbols | SF Symbols | custom SVG -->
- **Icon style, stroke, sizes:** <!-- e.g. outline, 2px, 16/20/24 -->
- **Icons needed:** <!-- list, from SPEC.md features; add or remove with the client -->
- **Signature element:** <!-- the one memorable detail, used in two places -->
- **Theme modes:** <!-- light | dark | both -->

## Tokens

Every row below is **required** — none is left for the build phase to invent. Ask for the few
choices only a person can make (brand color, feel, typefaces, light/dark), **generate the rest**,
run the contrast check, show the whole set, and record the approved result here. Keep the token
names exactly as written: `scripts/check-contrast.cjs` finds them by name. Hex values only.
If there is no dark theme at launch, write `none` in every Dark cell.

### Colors

| Token | Light | Dark | Role |
| :--- | :--- | :--- | :--- |
| `bg-app` | | | Page background |
| `surface` | | | Cards, sheets, dialogs |
| `border` | | | Borders of inputs and controls (3:1 against the background) |
| `text-primary` | | | Body text and headings |
| `text-muted` | | | Secondary text (still 4.5:1) |
| `action-primary` | | | Primary buttons and links |
| `text-on-action` | | | Label on a primary button |
| `accent` | | | Highlights, gauges, icons (never body text) |
| `success` | | | Success text and icons |
| `warning` | | | Warning icons and fills (never body text) |
| `danger` | | | Error text, destructive actions |
| `focus-ring` | | | Keyboard focus outline |

### Type, space, and shape

| Token | Value | Notes |
| :--- | :--- | :--- |
| Display typeface | | Headings only; check license and load cost |
| Body typeface | | Reading and interface text |
| Type scale | | Ratio and base size, e.g. 1.250 on 1rem |
| Weights | | e.g. 400 body, 600 emphasis, 700 display |
| Spacing unit | | e.g. 8px grid with 4px half-steps |
| Radius tiers | | e.g. 8 / 12 / 16 px |
| Shadow tiers | | e.g. none / card / overlay |
| Motion durations and easings | | `fast`, `base`, `slow`, and the three easing curves |
| Theme modes | | light, dark, or both |

**Palette approved by the client:** [?] yes — date: ____ *(one approval for the whole set)*

Semantic names (`--color-bg-app`, `--color-text-primary`, `--color-action-primary`, ...)
stay the same across projects; only the values above change.

## Contrast Check

<!-- Generated: run `node scripts/check-contrast.cjs DESIGN.md --write` from the
     eaz-frontend-design skill folder. Do not fill this in by hand or by estimate. -->

TBD
