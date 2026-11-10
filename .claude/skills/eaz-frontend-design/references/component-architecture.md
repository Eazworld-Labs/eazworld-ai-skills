# Component Architecture

Companion to the `eaz-frontend-design` skill. Design reusable, maintainable and scalable
frontend component systems.

## Component fundamentals

- **One responsibility:** each component does one thing well; name reflects it.
- **Reusability:** extract repeated UI into shared components; parameterise via props.
- **Composition:** build complex UIs by composing small components, not configuration
  props.
- **Boundaries:** clear interface — props in, events out.
- **Separation of concerns:** presentation separate from business logic where possible.
- **Maintainable APIs:** typed props, sensible defaults, minimal required props; no
  untyped catch-all prop objects.

## Component organisation

| Layer | Purpose | Examples |
| :--- | :--- | :--- |
| UI primitives | Unstyled/lightly styled blocks | Button, Input, Card, Dialog, Badge |
| Shared components | Reusable across features | Header, Footer, Navigation, Pagination |
| Feature-specific | One feature | ProductCard, CheckoutForm, UserProfile |
| Page-level | Compose a full page | HomePage, LoginPage, DashboardPage |
| Layout | Page structure | Grid, Container, Sidebar, TwoColumn |

Apply atomic design pragmatically (atoms → molecules → organisms → templates → pages).
Use consistent folder structure and import organisation; barrel exports (`index.ts`) for
public surfaces, deep imports for internals.

## Composition patterns

- **Children/slots:** `children` for flexible content; named slots for dialog
  header/body/footer.
- **Compound components:** related parts sharing implicit state (Tabs: Tablist, Tab,
  TabPanel).
- **Render props:** logic reuse without prescribing DOM output (prefer hooks/composition
  in modern React).
- **Controlled/uncontrolled:** controlled for forms/validation; uncontrolled for simple
  display or file inputs. Never mix for the same input over its lifetime.
- **Variants:** discriminated unions (`size`, `tone`, `shape`); avoid boolean prop
  explosion.
- **Extension:** compose, don't subclass; spread props for passthrough.
- **Avoid prop drilling:** lift state only when shared; use context for theme/auth/prefs;
  don't pass props through 4+ layers.

## Design system integration

- Components consume semantic design tokens — never raw hex or arbitrary pixels.
- One implementation per primitive (one Button, one Input, one Card); variants via
  props.
- Consistent variant names across components (`onChange`, `value`, `disabled`, `size`).
- All spacing, colour, radius, shadow from the design system.
- Every primitive meets accessibility standards (see [Accessibility](#accessibility)).

## React & Next.js

- **Server vs Client:** Server Components by default; `"use client"` only when state,
  effects, event handlers, or browser APIs are genuinely needed — push it as far down
  the tree as possible.
- **State:** local first; lift only when shared; avoid global state for UI-only
  concerns; use URL state for shareable UI (search, filters).
- **Props/data flow:** props down, events up; TypeScript interface for every public API
  — no `any`.
- **Hooks:** extract reusable logic; keep near components unless shared.
- **Context:** theme, auth, user preferences — not transient UI state.
- **Suspense:** loading boundaries in Server Components.
- **Responsibilities:** data fetching on server; interactivity on client; keep
  client-side JS minimal.
- **Avoid unnecessary client components:** a page stays a Server Component unless a leaf
  needs interactivity.

## Quality & performance

- Naming: PascalCase (`ProductCard`); descriptive, not generic (`ConfirmDialog` not
  `Modal`).
- TypeScript: exported interface for every public component API.
- Avoid oversized components (> ~200 lines or 10 props — split them).
- Avoid unnecessary abstraction; don't abstract one-off use cases without clear benefit.
- Avoid duplicate components — inspect before creating; reuse or extend.
- Memoise only when measured (`React.memo`, `useMemo`, `useCallback` are not defaults).
- Lazy load below-the-fold/route components (`React.lazy` + `Suspense`).
- Document shared components with usage examples.

## Architecture rules

- Inspect existing components before creating new ones — reuse, don't duplicate.
- Check the component library first (shadcn/ui, MUI, Chakra).
- Keep business logic separate from presentation where appropriate.
- Maintain consistency across the application.
