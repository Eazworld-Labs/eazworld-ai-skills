# Styling Methods

Companion to the `eaz-frontend-design` skill. The styling method is a **choice**, never an
assumption.

## How to choose

1. **Project already has one?** Use it. Detect it from the manifest and existing files
   (`tailwind.config.*`, `*.module.css`, `*.scss`, `styled-components`, `@emotion`,
   `theme.json`). Do not mix methods or migrate as a side effect of a UI task.
2. **Greenfield, or the user wants to change it?** Present the options below with a
   one-line trade-off each, recommend one for this project, and wait for the answer.
3. **Record the decision** in `PROJECT.md` / `DESIGN.md` so later work does not re-ask.

## Options

| Method | Choose when | Trade-off |
| :--- | :--- | :--- |
| **Tailwind CSS** | Fast delivery, a team that knows utilities, component-based UI | Long class lists; discipline needed to keep values in the theme |
| **Plain CSS + custom properties** | Small sites, CMS themes, maximum longevity, no build step | More manual structure; no scoping unless you add naming rules |
| **CSS Modules** | Component frameworks that want scoped styles without a runtime | Needs a bundler; cross-component theming goes through variables |
| **SCSS / Sass** | Existing Sass codebases, heavy mixin or function use | Extra build step; modern CSS covers much of what Sass added |
| **CSS-in-JS** (styled-components, Emotion) | Existing projects already using it | Runtime cost; weaker fit with server components |
| **Component library theming** (shadcn/ui, MUI, Vuetify, etc.) | Dashboards and admin tools where speed beats custom look | Look is shaped by the library; customization has limits |
| **Native platform styles** | React Native, Flutter | Use the platform theme object, not CSS |

## Where tokens live in each method

- **Tailwind:** the theme (`@theme` in v4, `tailwind.config` in v3); no arbitrary
  values in components.
- **Plain CSS / Modules / SCSS:** CSS custom properties on `:root`, consumed by name.
- **CSS-in-JS / library theming:** the theme provider object.
- **Native:** `ThemeData` or the theme provider.

Whatever the method, the rule from the core skill holds: components reference token
names, never raw hex or arbitrary pixel values.
