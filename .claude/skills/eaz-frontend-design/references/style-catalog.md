# Style Catalog

Companion to the `eaz-frontend-design` skill. A client picks a look in **three levels** so a
visual style is never confused with what the site does:

1. **Primary style** — the family of look (Minimalist, Luxury, Dark, ...).
2. **Variation** — a specific flavour inside that style (Dark Luxury, Neo-Brutalism, ...).
3. **Preferences** — colour direction, typography, layout, navigation, hero, interaction,
   imagery. Components are covered separately in
   [Component Choices](./component-choices.md).

Offer **2–3 styles** that fit the design purpose, with a recommendation and a one-line
trade-off each, then offer that style's variations. Never read out the whole catalog.
Styles combine (Luxury + Dark, Editorial + Minimalist); record the primary and the
variation. How to turn the pick into token values: [Visual Directions](./visual-directions.md).

## Not styles — never ask these as style choices

- **Responsive and mobile-first** are defaults on every project, not options.
- **Accessibility** (WCAG AA, keyboard, reduced motion) applies to every style.
- **Dashboard** is a project type (already captured at kickoff); its look still comes from
  the styles below, usually Minimalist, Corporate, Dark, or Bento.
- **One page vs many pages** is a structure decision for the sitemap in `SPEC.md`, not a look.

## Styles and variations

| Style | Variations |
| :--- | :--- |
| **Minimalist** | Ultra-minimalist, clean, modern, Scandinavian, monochromatic, Japanese (Ma / Zen), warm minimalist, quiet luxury |
| **Corporate** | Traditional, modern, professional business, enterprise, financial, tech / SaaS, healthcare, government / institutional, NGO / trust-led |
| **Luxury** | Premium, elegant, editorial, minimalist, dark, gold-accented, Art Deco, noir black-and-white, heritage / classic, fashion-house |
| **Brutalist** | Raw, modern, neo-brutalism, experimental, typography-driven, monospace / terminal, anti-design |
| **Creative** | Artistic, playful, colourful, illustration-based, experimental, portfolio-focused, hand-drawn / doodle, collage, Memphis, Y2K / retro-futurist, kinetic typography |
| **Editorial** | Magazine, newspaper, fashion, image-led, typography-led, long-form storytelling, photo-essay, newsletter-style |
| **Dark** | Pure black / OLED, charcoal, dark gradient, dark minimal, neon-accented, midnight blue, cyberpunk / synthwave, developer dark |
| **Glassmorphism** | Frosted glass, transparent glass cards, layered panels, colourful glass, dark glass, liquid glass, aurora / gradient-mesh backdrop |
| **Neumorphism** | Light, dark, soft UI, inset elements, raised elements (low contrast — offer only the soft-UI variant with a contrast check) |
| **3D and Immersive** | 3D product showcase, interactive 3D, WebGL, virtual environments, immersive storytelling, 3D scroll, product configurator, isometric illustration |
| **Swiss** | International typographic style, grid-based, asymmetric grid, minimalist typography, geometric layout |
| **Asymmetrical** | Split-screen, offset grid, overlapping sections, diagonal layouts, irregular composition |
| **Full-Screen Immersive** | Full-screen hero, video background, image-led, cinematic, immersive storytelling |
| **Parallax and Motion** | Scroll-triggered animation, parallax scrolling, micro-interactions, animated transitions, motion storytelling |
| **Bento Grid** | Equal-card grid, mixed-size cards, modular grid, dashboard bento, editorial bento, bento hero only, bento features section, bento portfolio |
| **Flat / Material** | Flat colour, Material-inspired, card-and-elevation, safe business default |
| **Playful / Friendly** | Rounded and bouncy, kid-friendly / education, claymorphism, sticker style |
| **Organic / Natural** | Earthy, soft shapes, hand-made feel, botanical, wellness, farm-to-table |
| **Retro / Vintage** | 80s, 90s, print-era, vaporwave, skeuomorphic |
| **Gradient / Aurora** | Mesh gradients, soft glow, SaaS gradient hero |
| **Cultural / Afrocentric** | Kente- and Adinkra-inspired patterns, Ankara prints, bold warm palettes, modern African editorial — use patterns as accents and credit the source; never as a full-page texture that hurts legibility |

## Rules for use

- **Contrast beats style.** If a variation (Neumorphism, Glassmorphism, neon Dark, pale
  Minimalist) cannot reach 4.5:1 for text and 3:1 for control borders, adjust the palette,
  not the standard. The contrast script decides.
- **Motion-heavy styles** (Parallax, Immersive, 3D, Creative) must have a tested
  reduced-motion path and a performance budget; say so when recommending them.
- **Pick fit over taste.** Match the style to the audience and the one impression in
  `DESIGN.md`; a church, a law firm, and a streetwear store should not get the same offer.
- Record the answer in `DESIGN.md` as `Primary style`, `Variation`, and `Combined with`.
