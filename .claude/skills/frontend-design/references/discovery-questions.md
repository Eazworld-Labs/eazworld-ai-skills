# Discovery Questions

Companion to the `frontend-design` skill. Use before settling the design choices, so
the design rests on real content, features, and constraints instead of guesses.

## How to ask

1. **Skip what is already answered** — read `PROJECT.md`, `DESIGN.md`, any brief, and
   the codebase first. Never re-ask.
2. **Only the groups this project type needs** (table below). A marketing site does not
   get payment questions.
3. **At most 5 questions at a time**, each with a recommended answer the client can
   accept in one word. Wait for answers before the next batch.
4. **Unanswered becomes `TBD`.** Record it in `DESIGN.md` under "Discovery"; the build
   gate in `project-kickoff` treats open core fields as blockers.
5. Record answers in `DESIGN.md` so later work reads them instead of asking again.

## Groups by project type

| Project type | Groups to ask, in order |
| :--- | :--- |
| Marketing / business site | Audience & goal → Content → Brand → Behavior → Constraints |
| E-commerce store | Audience & goal → Content → Brand → Features → Constraints |
| Web app / SaaS / dashboard | Audience & goal → Features → Brand → Behavior → Constraints |
| Mobile app | Audience & goal → Features → Brand → Behavior → Constraints |
| School, church, POS, booking system | Audience & goal → Features → Content → Constraints |

## Question bank

### Audience & goal
- Who makes the decision, and who uses it day to day? *(recommend: name the one primary
  audience)*
- What device and network do they use most? *(recommend: mobile on variable networks
  unless told otherwise)*
- What should a visitor do in the first ten seconds? *(this becomes the primary action)*
- What should they feel afterwards? *(this becomes the one impression)*

### Content
- Which pages or screens are needed at launch? *(recommend: the smallest set that does
  the one job)*
- Who writes the copy, and is it ready? *(recommend: real copy before layout; if not
  ready, mark pages "placeholder" in `tasks.md`)*
- Are real photos, video, or illustrations available? *(recommend: real over stock)*
- Which languages? *(recommend: one at launch unless required)*

### Brand
- Do they already have a logo, colors, and fonts? *(if yes, collect the files)*
- Two or three sites they like, and one they dislike — and why?
- Any words the tone must or must not use?

### Features
- Which of these are needed at launch: contact or enquiry form, booking, search,
  accounts, payments, blog or news, gallery, multilingual? *(recommend: only what the
  one job needs; push the rest to a later phase)*
- Who edits content after launch, and how technical are they? *(decides CMS or not)*
- Any third-party tools to connect — analytics, email, chat, CRM, maps?

### Behavior
- How much motion? *(recommend: one subtle moment; respect reduced motion)*
- Light, dark, or both? *(recommend: light only unless the audience expects dark)*
- Any accessibility requirements beyond WCAG AA — such as large-text users or
  low-vision audiences?

### Constraints
- Deadline and what is fixed about it?
- Budget limits that affect scope or tooling?
- Hosting, performance, or compliance requirements already decided?
- What is explicitly out of scope?

## Recording the answers

Add to `DESIGN.md` a "Discovery" section with one line per answer, `TBD` where open:

```markdown
## Discovery

- **Pages at launch:** Home, About, Admissions, Contact
- **Copy status:** TBD — client to supply by 20 Nov
- **Photos:** real campus photos, supplied later (placeholder until then)
- **Features at launch:** enquiry form only; booking deferred to phase 2
- **Editors after launch:** TBD
```
