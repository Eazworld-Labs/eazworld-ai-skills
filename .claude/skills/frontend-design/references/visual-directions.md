# Visual Directions & Token Choices

Companion to the `frontend-design` skill. The look of a project is a **choice** made
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
