# Token Completeness

Companion to the `eaz-frontend-design` skill. A design is not finished until **every token the
build will need is written down and checked** — otherwise the build phase invents them, and the
client first sees the guesses after the code exists. The rule: **ask little, generate the rest,
verify by calculation, get one approval, record everything.**

## 1. Ask only what needs a person

At most five questions at a time, each one decision, each with a recommendation:

1. **Brand color** — an existing color (hex, or a logo to read it from), or "none yet"? *(if
   none: recommend one from the chosen visual direction and the audience, and say why)*
2. **Feel** — which visual direction? *(see Visual Directions)*
3. **Typefaces** — display and body? *(recommend a pairing from the direction recipe; confirm
   licensing, weights, and load cost)*
4. **Theme modes** — light only, dark only, or both? *(recommend light only unless the
   audience expects dark; dark is a second palette to design and test)*
5. **Colors to avoid or require** — a competitor's palette, cultural meanings, a regulated
   color? *(skip if none)*

Do **not** ask the client to choose neutrals, status colors, or focus rings one by one — they
are derived.

## 2. Generate the rest

Derive from the brand color and the direction, then adjust until the checks pass:

| Token | How to derive it |
| :--- | :--- |
| `bg-app`, `surface` | Near-white (or near-black for dark) tinted slightly toward the brand hue; `surface` one step lighter than `bg-app` in dark themes, one step apart in light |
| `text-primary` | A very dark (very light for dark) neutral tinted toward the brand hue; well above 4.5:1 |
| `text-muted` | Mid-neutral that still reaches 4.5:1 on both `bg-app` and `surface` |
| `border` | Mid-neutral that reaches 3:1 against `bg-app` — it marks control boundaries |
| `action-primary` | The brand color, darkened or lightened until `text-on-action` reaches 4.5:1 on it |
| `text-on-action` | White or near-black, whichever passes |
| `accent` | A contrasting hue for gauges, highlights, and icons — never body text |
| `success`, `danger` | Green and red tuned to 4.5:1 as text on `bg-app`; pair with an icon or word, never color alone |
| `warning` | Amber for icons and fills (3:1); body text next to it uses `text-primary` |
| `focus-ring` | High-contrast outline reaching 3:1 against `bg-app` and visible on `surface` |
| Dark values | Not an inversion: lift surfaces in steps, desaturate brand colors, re-derive status colors, and re-check every pair |

- Work in a perceptual space (OKLCH or `color-mix(in oklab, …)`) to pick steps, but **store the
  result as hex** and verify it. Do not rely on adjusting only the lightness of an `oklch()`
  color — browsers do not gamut-map it reliably (see Modern CSS).
- Check the whole set with `node scripts/check-contrast.cjs DESIGN.md` from this skill's folder.
  Iterate until it exits 0. Never write contrast numbers by estimate.

## 3. Show it, then ask once

Present the complete palette — every token with its light and dark value and each pair's
ratio — and ask **one** question: *"This is the full set. Approve it, or tell me what to
change?"* Do not scatter approvals across twelve questions.

## 4. Record it

Write the approved values into the `DESIGN.md` token tables (names exactly as in the
template), run `node scripts/check-contrast.cjs DESIGN.md --write` to fill the Contrast Check
section, and mark "Palette approved by the client" with the date. If something stays open
(for example the display typeface awaits a licence), mark it `TBD` **with a reason and an owner**
— it is then a visible blocker, not a silent gap.

## 5. Implement it (Phase 2)

The theme task copies the table into the project's token system with the same names (for
Tailwind, the theme config; otherwise CSS variables), and the token check must be clean.
Components use token names only — never the hex values.
