# System Foundations

Companion to the `eaz-frontend-design` skill. Beyond tokens, styles, and components, a
design system needs ten more decisions. **Propose a default for each from the chosen style,
show them together, and get one approval**; ask follow-up questions only for the items the
client wants to change (the same defaults-or-more-questions path as
[Component Choices](./component-choices.md)). Record everything in the `System` sections of
`DESIGN.md`. Skip items that do not apply (no dark mode, no data tables, no blog).

## 1. Layout system

| Decision | Default proposal |
| :--- | :--- |
| Container widths | Content 1200px max, text 65ch, wide 1440px, full-bleed allowed per section |
| Grid | 4 columns on mobile, 8 on tablet, 12 on desktop; gutter = one spacing step |
| Breakpoints | 360 (small), 768 (tablet), 1024 (laptop), 1440 (wide); content-driven if a layout breaks earlier |
| Section spacing | Vertical rhythm of two spacing tiers: within a section, between sections |
| Z-index layers | Named layers, never raw numbers: `base` 0, `sticky` 10, `dropdown` 20, `overlay` 30, `modal` 40, `toast` 50 |

## 2. Light and dark mode rules

Only when theme modes include dark. Decide: images (dim 10–20% or swap variants), shadows
(replace with surface-fill elevation), glass and gradients (re-check contrast on the dark
background), pure black vs charcoal, and whether the choice follows the system setting and
is remembered. Every dark value must be in the token table and pass the contrast script.

## 3. Brand assets

Logo: clear space (the height of the logo's mark on each side), minimum size (24px height
on screens), light, dark, and mono versions, and what never to do (stretch, recolour, add
effects). Also: favicon set (SVG + 180px touch icon), social share image (1200×630), and
photo treatment (crop ratios, overlay, filter, or none). Ask for logo files; if none exist,
mark `TBD` with an owner and use a text wordmark in the meantime. Deeper brand work belongs
to `eaz-brand-identity`.

## 4. Voice and microcopy

Tone in three words, reading level, and conventions: button labels start with a verb
("Book a visit", not "Submit"), error messages say what happened and how to fix it, empty
states say what will appear and offer one action, no jargon, no blaming the user. Write six
sample strings (primary button, error, empty state, success, confirm, 404) and have the
client approve them. Copy status is already in Discovery.

## 5. Page templates

List the pages from `SPEC.md` and give each a section order. Starters: **Home** (hero,
proof, services, how it works, testimonials, call to action, footer); **About** (story,
team, values); **Services/Product** (benefit, details, price or enquiry, FAQ); **Pricing**
(plans, comparison, FAQ); **Contact** (form, map, hours, WhatsApp); **Blog/Article**
(headline, meta, body, related); **Product page** (gallery, price, variants, add to cart,
details). Each template uses only components from the component choices.

## 6. Accessibility specs

Focus ring from the `focus-ring` token, 2px offset, never removed; touch targets 44×44px
(48dp Android); body text 16px minimum; alt text rule (describe purpose; empty alt for
decoration); every form field has a visible label; reduced-motion path for every animation;
no information by colour alone; page language set. These apply to every style and are not
client choices — record them as the project's standard.

## 7. Localisation

Pick by region from `PROJECT.md`. Ghana: GH₵, `+233` phone numbers, `DD/MM/YYYY`, Mobile
Money wording. Nigeria: ₦, `+234`, `DD/MM/YYYY`. Note the language (English variant) and
whether any copy is multilingual; check for right-to-left only if an RTL language is needed.
Number and currency formatting goes through `Intl`, never string concatenation.

## 8. Performance budget

Defaults: at most 2 typefaces and 4 font weights, self-hosted, `font-display: swap`; images
in AVIF/WebP with explicit width and height, hero image under 200KB, lazy-load below the
fold; animate `transform` and `opacity` only; target LCP under 2.5s, CLS under 0.1, INP
under 200ms on a mid-range phone. Heavy styles (3D, Parallax, video backgrounds) must state
their cost and a fallback.

## 9. Responsive rules

Write what changes at each width: **navigation** (bar → menu), **grids** (columns collapse
4→2→1), **tables** (cards or scroll), **hero** (split → stacked), **type** (fluid scale with
`clamp()`), **images** (ratios and crop focus), **touch vs hover** (no hover-only
information). Verify at 360, 768, and 1440px.

## 10. Style guide sheet

Produce one readable page for the client: palette swatches, type specimens, buttons and
form fields in all states, cards, icons, and a sample of each page template. In a web
project it is a `/styleguide` route or static page that uses the real components and tokens;
otherwise a short document in `docs/`. The client approves it before pages are built.

## Recording

Fill the `System` sections of `DESIGN.md`. Each item holds a value or `TBD` with a reason
and an owner. If a decision is the default, write `default` and the value, so later work does
not re-ask.
