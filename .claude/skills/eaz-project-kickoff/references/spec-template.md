# SPEC.md

Copy this file to the root of a client project as `SPEC.md`. It says **what the product
must do** — the agreed requirements — so every build session and every review has
something concrete to check against. Keep it short: one to three pages for a small site,
longer only for a store or app. Mark unknowns `TBD`. Never put secrets or private client
data in this file.

## 1. Goal and Non-Goals

- **Goal:** <!-- the one job the product must do, for whom -->
- **Success looks like:** <!-- one or two measurable outcomes, e.g. "enquiries per month" -->
- **Non-goals (out of scope for this release):**
  -

## 2. Users and Roles

| Role | Who they are | What they can do |
| :--- | :--- | :--- |
| <!-- Visitor / Customer / Staff / Admin --> | | |

## 3. Key Journeys

<!-- Two to five end-to-end stories, each a short numbered list. -->

1. **<Journey name>:** <step> → <step> → <outcome>

## 4. Features and Acceptance Criteria

Each feature has an ID. A feature is done only when its acceptance test passes. Tasks in
`tasks.md` point back to these IDs.

| ID | Feature | Priority | Acceptance test (done when…) |
| :--- | :--- | :--- | :--- |
| F1 | | Must / Should / Later | <!-- a check someone can run, not a feeling --> |

## 5. Rules and Edge Cases

<!-- Business rules and what happens when things go wrong: out of stock, payment fails or
     stays pending, duplicate submission, offline, missing data, expired link. -->

-

## 6. Quality Requirements

- **Performance:** <!-- e.g. a mid-range phone on 4G loads the home page in under 3 s -->
- **Accessibility:** <!-- e.g. WCAG AA, keyboard path, reduced motion -->
- **Security and privacy:** <!-- roles enforced on the server; personal data and the law
  that applies, e.g. Nigeria's NDPA or Ghana's Data Protection Act -->
- **Browsers and devices:** <!-- supported set -->
- **Languages:**

## 7. Content Needed

<!-- Pages and screens at launch, who writes the copy, who supplies photos; details in
     CONTENT.md for content-heavy projects. -->

## 8. Open Questions

<!-- Every TBD that affects the build, with an owner and a date to resolve it. -->

| # | Question | Owner | Needed by |
| :--- | :--- | :--- | :--- |

## 9. Change Log

<!-- Date — what changed — who approved. Scope added after approval gets a new feature ID. -->
