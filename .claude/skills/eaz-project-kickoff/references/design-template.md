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
- **Primary style:** <!-- from the Style Catalog: Minimalist | Corporate | Luxury | Dark | Editorial | Bento | ... -->
- **Variation:** <!-- e.g. Dark Luxury, Neo-Brutalism, Scandinavian minimalist -->
- **Combined with:** <!-- optional second style, or none -->
- **Visual direction:** <!-- clean & minimal | bold & vibrant | dark & premium | warm & friendly | editorial | dashboard -->
- **Component choices:** <!-- defaults accepted | answered one by one -->
- **Buttons / forms / cards:** <!-- shape, fill, hover; label and error style; card style -->
- **Navigation / hero / footer:** <!-- desktop + mobile pattern; hero type; footer size -->
- **Overlays / tables / feedback:** <!-- modal pattern; table style; toast vs banner; loading style -->
- **Imagery + interaction:** <!-- image style; hover and scroll effects within the motion level -->
- **Motion level:** <!-- none | subtle | expressive -->
- **Icon set:** <!-- Lucide | Phosphor | Heroicons | Tabler | Material Symbols | SF Symbols | custom SVG -->
- **Icon style, stroke, sizes:** <!-- e.g. outline, 2px, 16/20/24 -->
- **Icons needed:** <!-- list, from SPEC.md features; add or remove with the client -->
- **Signature element:** <!-- the one memorable detail, used in two places -->
- **Theme modes:** <!-- light | dark | both -->

## System

<!-- One line per item; write `default: <value>` when the proposal was accepted, or TBD with
     a reason and an owner. See System Foundations in eaz-frontend-design. -->

- **Layout:** <!-- container widths, grid columns, breakpoints, section spacing, z-index layers -->
- **Light / dark rules:** <!-- images, shadows, glass in each mode; or n/a -->
- **Brand assets:** <!-- logo versions + clear space + min size; favicon; share image; photo treatment -->
- **Voice and microcopy:** <!-- tone in three words; button/error/empty-state rules; approved sample strings -->
- **Page templates:** <!-- page -> section order, for every page in SPEC.md -->
- **Accessibility specs:** <!-- focus ring, touch targets, min text size, alt-text rule, reduced motion -->
- **Localisation:** <!-- currency, phone format, date format, language -->
- **Performance budget:** <!-- fonts/weights, image formats and sizes, LCP/CLS/INP targets -->
- **Responsive rules:** <!-- what changes at 360 / 768 / 1440: nav, grids, tables, hero, type -->
- **Style guide sheet:** <!-- route or doc path; approved: yes / date -->

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
