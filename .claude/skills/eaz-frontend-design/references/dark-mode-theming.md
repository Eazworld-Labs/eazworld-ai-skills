# Dark Mode & Theming

Companion to the `eaz-frontend-design` skill. Create consistent, maintainable and
flexible theme systems — light, dark, system-preference, and multiple brand themes —
using design tokens, CSS custom properties, and Tailwind CSS theming.

## Theme architecture

- **Light themes:** default surface, text, and accent colours for light mode.
- **Dark themes:** deep neutral surfaces; elevation via surface fills or low-opacity
  overlays — never pure-black on pure-black.
- **System-preference:** follow `prefers-color-scheme` as default; allow manual override.
- **Multiple brand themes:** separate brand colour sets sharing the same token structure.
- **Centralised design tokens:** one source of truth for colour, surface, text, border,
  shadow, typography, spacing, radius, elevation.

## Design tokens

Three layers — primitive (raw values), semantic (meaning), component scope (alias).
Components consume semantic/component names only, never raw hex.

| Category | Examples |
| :--- | :--- |
| Colours | `--color-bg-app`, `--color-text-primary`, `--color-action-primary` |
| Surfaces | `--color-surface-base`, `--color-surface-elevated` |
| Borders | `--color-border-subtle`, `--color-border-focus` |
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-lg` |
| Spacing | `--space-1` … `--space-12` (8px base grid) |
| Radius | `--radius-sm` (4px) → `--radius-xl` (16px), `--radius-full` |
| Focus ring | `--focus-ring` |

Dark mode surface rule: dark surfaces get lighter as they rise; re-check every contrast
pair in dark mode independently.

## CSS implementation

```css
:root {
  --color-bg-app: #ffffff;
  --color-text-primary: #111827;
  color-scheme: light;
}

[data-theme="dark"] {
  --color-bg-app: #090d16;
  --color-text-primary: #f3f4f6;
  color-scheme: dark;
}

body {
  background: var(--color-bg-app);
  color: var(--color-text-primary);
}
```

**`light-dark()` (modern CSS):**

```css
:root {
  --color-bg-app: light-dark(#ffffff, #090d16);
  color-scheme: light dark;
}
```

Tailwind: tokens in `@theme` (v4) or `tailwind.config` (v3); use `dark:` variant; no
arbitrary values (`text-[#123456]`) in components.

## Theme behaviour

- Light/dark/system selection with user override.
- OS preference detection via `prefers-color-scheme`.
- Persistence: cookie/localStorage/database profile; restore on return.
- Apply theme before paint to prevent flash; `color-scheme` meta tag.
- **Next.js hydration:** server and client must agree on initial theme; never read
  `localStorage` during server render; use `suppressHydrationWarning` where needed.
- Theme switching without layout disruption; respect `prefers-reduced-motion`.

## Accessibility in theming

- Contrast 4.5:1 body / 3:1 large text and borders verified in **every** theme.
- Visible focus ring from `focus-ring` token in every theme.
- Readable disabled states in both themes.
- Accessible theme toggle: labelled, keyboard reachable, announces change.
- Never communicate meaning through colour alone.

## Best practices

- No hardcoded colours in components; use semantic tokens.
- Consistent contrast across themes.
- One component, theme-aware tokens — no duplicated components per theme.
- Extend, don't replace, the project's existing design system.
