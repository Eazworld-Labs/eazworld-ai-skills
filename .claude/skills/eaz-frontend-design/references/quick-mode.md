# Quick Mode

Companion to the `eaz-frontend-design` skill. A client who writes one short line
("landing page for my church in Kumasi") should still get a complete, good design. Quick
mode replaces the question flow with **one proposal and one approval**.

## When it applies

- The request is for a whole site, app, or landing page and gives only a business or idea,
  with no design details; or the user says "you decide", "surprise me", or "quick".
- It does **not** apply when the user asks for a single component or section on a project
  that already has design choices, or when `DESIGN.md` is already filled — use that file.
- The user can leave quick mode at any time ("let me choose"): switch to the full flow.

## Steps

1. **Infer** from the prompt and `PROJECT.md`: business type, audience, region, tone, and
   the one job of the site. State the inferences in one line so a wrong guess is visible.
2. **Build the whole proposal** from the table below plus the Style Catalog, Component
   Choices, and System Foundations defaults: style and variation, palette (generated,
   contrast-checked), two typefaces, component defaults, layout, page list with section
   order, voice in three words, icon set, motion level.
3. **Show it as one short summary** — about fifteen lines, not a document. Name the style,
   show the palette as hex values, name the typefaces, list the pages, and give the
   component defaults in one line.
4. **Ask one question:** "Approve this, or tell me what to change?" Do not write code or
   ask a questionnaire first.
5. **Ask only what cannot be guessed**, folded into that same message as at most two extra
   lines: the real business name, a logo (or "use a text wordmark"), or a brand colour.
6. On approval, write everything to `DESIGN.md` (mark accepted defaults `default: ...`),
   run the contrast check, and build. On "change X", change only X and re-show that line.

## Business type to starting proposal

| Business | Style and variation | Palette feel | Type feel | Hero |
| :--- | :--- | :--- | :--- | :--- |
| Church / ministry | Organic or Editorial, warm | Deep blue or burgundy, gold accent | Serif display + sans | Image-led, service times |
| School / education | Playful or Flat, friendly | Bright primary + warm neutral | Rounded sans | Split, enquiry button |
| Restaurant / bakery / food | Organic or Editorial | Earthy warm tones | Expressive serif + sans | Photo-led, menu and order |
| Clinic / healthcare | Corporate, healthcare | Calm blue or green, white | Clean sans | Text-focused, book button |
| Fintech / payments | Corporate or Dark | Deep neutral + one vivid accent | Geometric sans | Product showcase |
| E-commerce / fashion | Editorial or Luxury | Neutral with a brand accent | Display serif + sans | Product showcase |
| Beauty / spa / hotel | Luxury, minimal | Soft neutral, gold or sage | Elegant serif + sans | Full-screen image |
| Tech / SaaS / agency | Dark, Gradient, or Bento | Dark surface + vivid accent | Modern sans + mono | Animated or product |
| Portfolio / creative | Creative or Swiss | Monochrome + one colour | Characterful display | Typography-led |
| NGO / community | Corporate (trust-led) or Cultural | Warm, earthy, high contrast | Humanist sans | Image-led, donate button |
| Admin / POS / internal | Minimalist, utility | Neutral + status colours | Sans + mono figures | None (dashboard) |

Use a Cultural / Afrocentric accent (pattern, palette) when the audience is local and the
client welcomes it; offer it, do not impose it.

## Rules

- A short prompt never lowers the standard: contrast, accessibility, tokens, and the
  performance budget still apply, and the full token set is still recorded.
- Never invent facts about the business (prices, addresses, testimonials); use clearly
  marked placeholders and list them as `TBD` with an owner.
- Keep the proposal short. If it needs scrolling, it is too long.
