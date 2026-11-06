# Icon Sets

Ask for the icon set during setup, the same way as styling method and motion level. Show the
list below for the detected stack, give a recommendation with a one-line trade-off, and record
the answer in the "Icons" rows of `DESIGN.md`. Do not pick a family silently, and do not mix
families afterwards.

## What to ask (one decision at a time)

1. **Family** — pick from the list for the stack.
2. **Style** — outline, solid, duotone, or mixed (outline for rest state, solid for active).
3. **Stroke and sizes** — stroke width and the size steps (default 2px stroke; 16, 20, 24).
4. **Which icons the project needs** — ask for the list, or propose one from the
   features in `SPEC.md` (see "Starter set" below) and let the client add or remove.
   Get the client's explicit confirmation of the final list before recording it.
5. **Custom or brand icons** — will any come from a designer as SVG? If so, they must match the
   chosen stroke and grid.

## Families

| Family | Style | Best for | Trade-off |
| :--- | :--- | :--- | :--- |
| Lucide | Outline | Default for React/Next.js, Vue, Svelte; large, consistent set | One style only |
| Phosphor | 6 weights, duotone | Boutique or editorial feel; weight can match typography | Larger package, tree-shake it |
| Heroicons | Outline and solid | Tailwind projects | Smaller set, limited commerce icons |
| Tabler | Outline | Dashboards, admin panels | Very large set; import only what is used |
| Material Symbols | Variable weight/fill | Android, Flutter, Material look | Distinct Google look |
| SF Symbols | Native | iOS apps | Apple platforms only, license limits |
| Custom SVG sprite | Any | Brand-specific identity | Design and maintenance cost |

Check the library's current maintenance status and license before recording it.

## Starter set by project type

- **E-commerce:** search, cart/bag, wishlist/heart, account, menu, close, chevrons, filter, sort,
  delivery truck, returns, secure payment/shield, star rating, plus/minus, trash, check.
- **Booking / services:** calendar, clock, location pin, phone, message, user, check, alert.
- **Dashboard / admin:** home, chart, table, settings, bell, search, filter, download, edit, delete.
- **Church / school / community:** calendar, users/group, book, bell, map pin, gift/giving, phone.
- **Mobile app:** tab-bar icons (home, search, activity, profile) and a back chevron, from the
  platform set where possible.

## Rules (also recorded in DESIGN.md)

- One family, one stroke weight, sizes only from the chosen steps.
- Icons inherit `currentColor` and use design tokens; icon-only meaning needs 3:1 contrast.
- Icon-only buttons carry an accessible name; decorative icons are hidden from assistive tech.
- Do not rely on an icon alone to convey state — pair it with text.
- Import icons individually (tree-shaking); never load a whole family for a few icons.
- No emoji as icons, and no icon-in-a-circle bullets as decoration.
