# Quick Mode

Companion to the `eaz-frontend-design` skill. A client who writes one short line
("landing page for my church in Kumasi") should still get a complete, good design. Quick
mode replaces the question flow with **one proposal and one approval**.

## When it applies

- The request is for a **whole site, app, or landing page** and gives only a business or
  idea, with no design details; or the user says "you decide", "surprise me", or "quick".
- It does **not** apply to a single component, section (a hero, a navbar, a pricing table),
  or one page of an existing project, even when `DESIGN.md` is missing — those run the full
  choice flow in `SKILL.md`. It also does not apply when `DESIGN.md` is already filled; use
  that file.
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

## Never generic

A fast design must still look like it belongs to this client and no one else. Before
showing the proposal, run [Design Quality](./design-quality.md) section 1 against it, and
require all of these:

1. **Signature element.** Name one memorable detail and the two places it appears. It comes
   from something real about the client — their place, product, craft, name, history, or
   audience — not a decorative flourish. Example: a bakery's "oven-stamp" mark from the
   street it sits on, not a generic wheat icon.
2. **"Why this is theirs" line.** One sentence tying the palette, type, and signature to a
   specific fact about the client. If the sentence would fit any competitor, redo it.
3. **Palette from the client's world,** not from the business-type table: sample the
   product, the building, the street, the flag, the fabric. The table is only a place to
   start; push at least one choice away from the most obvious answer for the category.
4. **Typographic contrast with character.** Do not default to Inter, Roboto, Arial, or the
   system font as the display face, and avoid the same pairing for every project (for
   example Fraunces + Inter). Pick a display face with a point of view and a quiet text face.
5. **Break one template habit on purpose,** such as an off-centre hero, one oversized
   element, an unusual section order, or a dense section next to an airy one.
6. **No tells:** purple-to-blue gradients, three identical feature cards, icon-in-a-circle
   bullets, emoji as icons, stock "diverse team" photos, invented testimonials.

If the client dislikes it, give a **different direction**, not a tweak of the same one.

## Business type to starting point (not the answer)

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
