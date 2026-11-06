# Visual Directions & Token Choices

Companion to the `eaz-frontend-design` skill. The look of a project is a **choice** made
with the client, not a default of this skill.

## How to offer a direction

1. Skip this step if `DESIGN.md`, a Figma file, or brand guidelines already define the
   look — follow them.
2. Otherwise pick **2–3 directions** below that fit the design purpose (Section 1A of
   the skill: audience, one job, one impression), describe each in one line, recommend
   one, and wait for the answer. Do not offer all of them.
3. Turn the chosen direction into concrete token values (next section), show them, and
   get approval before building.
4. Save the result to `DESIGN.md`.

## Directions

| Direction | Feel | Typical fit | Token tendencies |
| :--- | :--- | :--- | :--- |
| **Clean & minimal** | Calm, trustworthy, lots of space | Professional services, SaaS, clinics | Neutral palette + one accent, generous spacing, small radii, light shadows |
| **Bold & vibrant** | Energetic, memorable | Consumer brands, events, youth products | Saturated primaries, large display type, large radii, strong contrast |
| **Dark & premium** | Sleek, modern, confident | Fintech, tech, luxury, media | Deep neutral surfaces, restrained accent, elevation by surface fill |
| **Warm & friendly** | Approachable, human | Schools, churches, food, community | Warm neutrals, rounded shapes, friendly type, soft shadows |
| **Editorial** | Content-first, typographic | Blogs, news, portfolios | Serif or expressive display type, tight grid, minimal color |
| **Utility / dashboard** | Dense, efficient, clear | Admin tools, POS, internal systems | Compact spacing, strong table and form styles, status colors |

## Direction recipes

A direction is more than a palette. For the one you pick, specify all five parts and
record them in `DESIGN.md`. Typeface names are examples — confirm availability and
license, self-host, and limit weights.

| Direction | Type pairing (display + body) | Layout pattern | Component feel | Motion default |
| :--- | :--- | :--- | :--- | :--- |
| **Clean & minimal** | One family at two weights, e.g. a geometric sans | Wide margins, single column, strong left alignment | Hairline borders, small radii, almost no shadow | Subtle: fades, 150ms |
| **Bold & vibrant** | Characterful display sans + a quiet text sans | Oversized headings, asymmetric blocks, full-bleed color | Large radii, solid fills, strong press states | Expressive: springs, scroll reveals |
| **Dark & premium** | High-contrast serif or refined sans + neutral sans | Generous space, centered hero, restrained accent | Surface-fill elevation, thin accent lines, soft glow only on focus | Subtle to expressive: slow fades, view transitions |
| **Warm & friendly** | Soft rounded display + highly legible sans | Rounded containers, photo-led sections, short paragraphs | Pill buttons, soft shadows, friendly empty states | Subtle: gentle bounce on confirmation |
| **Editorial** | Expressive serif display + clean sans | Strong grid, large type, pull quotes, image-led spreads | Minimal chrome, underlines instead of boxes | Subtle: image and text reveals on scroll |
| **Utility / dashboard** | One sans plus a monospace for figures | Dense grid, sticky navigation, tables and filters | Compact controls, clear status colors, visible focus | None to subtle: instant feedback |

Whatever the direction, add the **signature element** from
[Design Quality](./design-quality.md) — one memorable detail, used in two places.

## Choosing token values

Decide these with the client, in this order:

1. **Brand color + accent** (primitives), then map to semantic names. Check every
   text/surface pairing at 4.5:1 (3:1 for large text and UI borders).
2. **Typefaces:** one for display, one for body (or one family for both). Confirm
   licensing and load performance (limit weights, `font-display: swap`).
3. **Type scale:** ratio and base size. The skill's default is 1.250 on 1rem; 1.200 or
   1.333 are common alternatives.
4. **Spacing unit:** the default is an 8px grid with 4px half-steps; a 4px base suits
   dense UIs.
5. **Radius and shadow tiers:** small and sharp, or large and soft, per the direction.
6. **Light, dark, or both.**

The values in [Visual System Reference](./visual-system.md) are the starting proposal
when the client has no preference — present them as a suggestion, not a requirement.
