# Component Choices

Companion to the `eaz-frontend-design` skill. Reusable components are decided **once per
project**, so every page looks like one product. Ask after the style is chosen, because the
style suggests the defaults.

## The two-path question

After the style and variation are confirmed, ask exactly this, with the suggested defaults
shown as a short list:

> "Based on **[style / variation]**, here are the suggested component defaults: [list].
> Do you want to **(A) use these defaults**, or **(B) go through the component questions**
> and choose each one?"

- **A — defaults:** record the suggested values in `DESIGN.md` and move on. Say that any
  component can be changed later by asking.
- **B — more questions:** ask the groups below, at most 5 questions at a time, each with a
  recommended answer. The client may stop at any point with "use defaults for the rest".
- Skip components the project does not have (no tables, no forms, no modals).

## Component groups

| Group | Options to offer | Record |
| :--- | :--- | :--- |
| **Buttons** | Square, slightly rounded, pill; filled, outlined, ghost; hover = darken, lift, underline | shape, fill, hover |
| **Forms** | Label above, floating label, inline; error text under the field, summary at top; field height | label style, error style |
| **Cards** | Flat, bordered, shadowed, glass; image-top, image-side, text-only | card style |
| **Navigation** | Standard bar, sticky bar, sidebar, mega menu, hamburger, floating; mobile: slide-in, bottom bar, full-screen | desktop + mobile pattern |
| **Hero** | Text-focused, image, video background, split, product showcase, animated | hero type |
| **Footer** | Minimal, standard links, large (links, newsletter, socials, map) | footer size |
| **Modals and sheets** | Centred dialog, side panel, bottom sheet on mobile | overlay pattern |
| **Tables and lists** | Zebra, bordered, borderless; compact or roomy; mobile = cards or horizontal scroll | table style |
| **Feedback** | Toast, banner, inline message; position; auto-dismiss time | notification pattern |
| **Loading and empty states** | Spinner, skeleton, progress bar; illustrated or plain empty state | loading style |
| **Imagery** | Photography-led, illustration-led, 3D, icon-led, product photography, abstract; image ratios and corner radius | image style |
| **Interaction** | Hover effects, scroll animations, cursor effects, micro-interactions — within the motion level | interaction set |

Icon set and motion level are separate choices already asked in the setup batch; do not ask
them twice.

## Suggested defaults by style

Use as the starting proposal in the two-path question. These are suggestions, not rules.

| Style | Buttons | Cards | Navigation | Hero | Forms |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Minimalist / Swiss | Slightly rounded, outlined or solid single colour | Borderless or hairline | Simple top bar | Text-focused | Label above |
| Corporate | Slightly rounded, solid | Bordered, light shadow | Sticky bar, mega menu if many pages | Split | Label above, errors inline |
| Luxury | Square or thin outline, wide letter-spacing | Borderless, large images | Minimal or floating | Full-screen image or video | Floating label |
| Brutalist | Square, thick border, hard shadow | Thick border | Plain visible links | Oversized type | Boxed, thick border |
| Creative / Playful | Pill, bold colour | Rounded, offset shadow | Floating or playful | Animated | Rounded fields |
| Editorial | Underline or text link style | Image-led, no box | Top bar with section links | Image-led | Label above |
| Dark | Solid accent, glow on focus only | Surface-fill elevation | Sticky bar | Product showcase or video | Floating label |
| Glassmorphism | Translucent fill, solid focus ring | Frosted glass (needs solid text backing) | Floating glass bar | Split with blurred backdrop | Glass fields, strong border |
| Bento | Rounded, solid | Mixed-size rounded tiles | Sticky bar | Bento hero | Label above |
| Organic / Cultural | Rounded, warm colour | Soft shadow, organic radius | Standard bar | Image-led, pattern accent | Rounded fields |

## Rules

- Every component choice is stored as a **token or a component spec** in `DESIGN.md`
  (radius tier, shadow tier, border width), never as a one-off in a page.
- Build each reusable component once in the project's component folder and reuse it; a new
  variant needs a reason recorded in `DESIGN.md`.
- Each interactive component needs default, hover, focus-visible, active, disabled, and
  (where relevant) loading and error states.
- Check every chosen pairing against the contrast script after components are set.
