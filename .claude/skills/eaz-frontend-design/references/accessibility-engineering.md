# Accessibility Engineering

Companion to the `eaz-frontend-design` skill. Build inclusive, accessible and usable web
applications. Accessibility is built into components from the start — not bolted on as a
final step.

## WCAG 2.2 standards

Conform to level **AA** by default; level A is the minimum; AAA only where the product
warrants it. Apply the POUR principles — Perceivable, Operable, Understandable, Robust —
to every component.

| Principle | Frontend application |
| :--- | :--- |
| Perceivable | Text alternatives, captions, contrast, resizable text, colour not alone |
| Operable | Keyboard access, enough time, no seizures, navigable |
| Understandable | Readable text, predictable behaviour, input assistance |
| Robust | Semantic HTML, ARIA, compatible with assistive technology |

## Semantic HTML first

Use native elements before `div` with roles: `button`, `a`, `label`, `fieldset`,
`legend`, `nav`, `main`, `section`, `article`, `aside`, `header`, `footer`. Native
elements carry name, role, and state for free.

## ARIA usage

- ARIA only when native HTML cannot express the pattern.
- Never override native semantics.
- Test that ARIA attributes reflect state (`aria-expanded`, `aria-selected`,
  `aria-checked`, `aria-pressed`).
- Icon-only buttons need an accessible name (`aria-label` or `aria-labelledby`).
- Decorative icons hidden: `aria-hidden="true"`.

## Keyboard accessibility

- All functionality reachable via keyboard alone (Tab, Enter, Space, arrows, Esc).
- Logical tab order follows visual order; never use positive `tabindex`.
- Visible focus indicator on every interactive element (focus ring from the
  `focus-ring` token, 2px offset, never removed).
- Focus trapping and restoration for modals/dialogs; Escape closes.
- Follow ARIA Authoring Practices (APG) key bindings for menus, tabs, dialogs,
  accordions.

## Screen readers

- **Accessible labels:** every interactive element has an accessible name; describe
  purpose, not appearance.
- **ARIA landmarks:** `banner`, `navigation`, `main`, `region`, `complementary`,
  `contentinfo`, `search`.
- **Heading hierarchy:** one `h1` per page; headings nest logically (h1 → h2 → h3).
- **Live regions:** `aria-live="polite"` for status, `aria-live="assertive"` for errors.
- **Form announcements:** errors announced; required fields marked.

## Visual accessibility

- **Contrast:** 4.5:1 body text, 3:1 large text and UI borders (WCAG AA) — verify in
  light and dark themes.
- **Text resizing:** usable at 200% zoom without loss.
- **Colour-independent status:** never communicate meaning through colour alone; pair
  with icon, text, or pattern.
- **Readable typography:** body text minimum 16px; line height ≥ 1.5.
- **Reduced motion:** respect `prefers-reduced-motion`; animations have a reduced-motion
  path.

## Accessible components

| Component | Key requirements |
| :--- | :--- |
| Buttons | Native `<button>`, accessible name, visible focus, `aria-pressed` for toggles |
| Links | Native `<a>` with `href`, meaningful text, `rel="noopener noreferrer"` |
| Navigation | `<nav>` landmark, keyboard traversable, `aria-current` on active page |
| Dialogs/Modals | `<dialog>` or role="dialog", focus trap, Escape closes, focus restored |
| Dropdowns | Native `<select>` or APG combobox, keyboard open/close/select |
| Tabs | `tablist`/`tab`/`tabpanel`, arrow navigation, `aria-selected` |
| Accordions | Native `<details>`/`<summary>` or APG pattern |
| Tooltips | `aria-describedby`, dismissible on Escape |
| Tables | `<caption>`, `<th>` with `scope`, `aria-sort` on sortable columns |
| Forms | See [Forms & Input](#forms-and-input) — labels, validation, error announcement |

## Testing

- **Keyboard-only testing:** navigate entire interface without a mouse.
- **Screen reader testing:** NVDA, JAWS, VoiceOver, or Orca; verify labels, landmarks,
  live regions.
- **Automated:** axe DevTools, Lighthouse accessibility audit,
  eslint-plugin-jsx-a11y (React).
- **Manual:** zoom to 200%, high-contrast mode, reduced motion, colour-blind
  simulation.

Accessibility is a Definition of Done gate — a component is not done until it passes
keyboard and screen reader testing.
