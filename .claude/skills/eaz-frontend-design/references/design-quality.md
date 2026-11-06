# Design Quality

Companion to the `eaz-frontend-design` skill. How to move from "correct" to "good": avoid
the generic look, build clear hierarchy, design every state, and review the rendered
result against the stated purpose.

## 1. Avoid the generic look

These are the tells of a templated or AI-default design. If the draft shows several,
rework it before showing it to anyone.

- Purple-to-blue gradient hero with gradient text.
- One sans-serif family at every size, with no typographic contrast.
- Centered hero, then three identical feature cards, then a call to action.
- Icon-in-a-circle bullets and emoji used as icons.
- Every card the same radius, shadow, and padding; glass effect on everything.
- Stock "diverse team" photos, lorem ipsum, or invented testimonials.
- No point of view — nothing that could only belong to this client.

**The signature rule:** give every project **one signature element** that expresses the
brand (a stepped skyline line, a woven stripe, an oversized price figure, a distinctive
image crop), and use it in **two places only**. Everything else stays quiet so the
signature and the content lead.

## 2. Hierarchy

- Three levels of emphasis at most per screen: primary (one thing), secondary, tertiary.
- Create hierarchy with size, weight, color, and space — not with boxes and borders.
- **One primary action per view.** Other actions are visibly lower in rank.
- The squint test: blur your eyes (or the screenshot). The primary action and the main
  heading should still stand out.

## 3. Composition

- **Grid and alignment:** one grid per breakpoint; edges align. Break the grid on
  purpose, never by accident.
- **Spacing rhythm:** space *between* sections is clearly larger than space *inside*
  them. All gaps come from the spacing scale.
- **Measure:** body text 45–75 characters per line; narrow the column rather than
  stretching it.
- **Density:** vary it. A page of identical blocks reads as a template; alternate
  dense and airy sections.
- **Imagery:** art-direct it. One crop style and one treatment across the site; real
  photography over stock; reserve space with `aspect-ratio`; serve responsive sizes.
- **Type:** two families at most — one for display, one for reading — and about four
  weights. Contrast comes from scale and weight. Use tabular numerals for prices.

## 4. Design every state

A component is not finished until each applicable state has a deliberate design:

| State | Requirement |
| :--- | :--- |
| Default | The resting appearance |
| Hover | For pointer devices only — never the sole way to reveal something |
| `focus-visible` | A clear ring with at least 3:1 contrast in every theme |
| Active / pressed | Immediate feedback |
| Disabled | Visibly inactive and explained when it matters |
| Loading | A skeleton shaped like the final content, not a bare spinner |
| Empty | Says why it is empty and offers the next step |
| Error | Says what went wrong and how to fix it, in text, near the problem |
| Success | Confirms the result; does not rely on color alone |

**Forms:** visible labels above fields, correct `type` and `autocomplete`, inline errors
next to the field, a clear submit state, and touch targets of at least 44×44 px.

**Icons:** one icon set, one stroke weight; icon-only buttons carry an accessible name.

## 5. Dark mode is a design, not an inversion

- Dark surfaces get lighter as they rise; do not stack pure black on pure black.
- Reduce saturation of brand colors and re-check contrast pair by pair.
- Check photography and logos on dark backgrounds.
- Provide both a system-following default and a manual toggle where the audience expects it.

## 6. Content first

- Design with real copy and real images; mark placeholders in `tasks.md`.
- Test the longest and shortest realistic content, a missing image, and a long name.
- Allow roughly 30–40% extra length for translated text if more languages will follow.

## 7. Visual QA — render it and look

Do not report a UI task finished from the code alone.

1. **Render** the page or screen (dev server, simulator, or emulator).
2. **Capture** it at 360, 768, and 1440 px — and in dark mode and with reduced motion
   on when those are in scope. If browser tooling is available (Chrome DevTools, a
   Chrome automation tool), take the screenshots yourself and save the paths; if it is
   not, give the user the exact URLs and widths to check and ask for screenshots.
3. **Review** each capture against the rubric below.
4. **Fix** what fails, re-capture, and only then report. Include what you checked and
   what you could not check.
5. Run a Lighthouse pass for accessibility and performance when tooling allows.

| Check | Question |
| :--- | :--- |
| Purpose | Does the screen make the one job obvious, and the primary action findable in seconds? |
| Hierarchy | Does the squint test still show the right things? |
| Spacing & alignment | Do gaps follow the scale, and do edges line up? |
| Contrast | Does every text and control pair meet its ratio in each theme? |
| Consistency | Are values taken from tokens (`check-tokens.cjs` clean)? |
| Personality | Is the signature present — twice, not twenty times — and does the page avoid the generic tells? |
| States | Are loading, empty, error, and focus states designed? |
| Motion | Does each animation serve a purpose and respect reduced motion? |
| Responsiveness | No horizontal scroll, no cut-off content, comfortable touch targets? |
