# Mobile Discovery Questions

Companion to the `eaz-mobile-app-development` skill. Use before building a new app, so the
approach rests on the audience and the requirements instead of habit.

## How to ask

1. **Skip what is already answered** — read `PROJECT.md`, `SPEC.md`, any ADR, and the
   codebase first. Never re-ask.
2. **At most five questions at a time, each asking for one decision**, with a recommended
   answer and a one-line trade-off the client can accept in one word. Do not bundle several
   decisions into one numbered question.
3. **Only the groups this app needs.**
4. **Unanswered becomes `TBD`.** An open approach or platform decision blocks the build.
5. Record answers in `PROJECT.md` and write an ADR for the approach.

## Question bank

### Approach and platforms
- Which approach? *(recommend: cross-platform — React Native or Flutter — for most business
  apps: one codebase for both stores; choose native only for heavy device features or peak
  performance; choose a PWA or Capacitor shell when the app is mostly a web experience)*
- Which platforms at launch — Android, iOS, or both? *(recommend: both if the audience
  splits; in many African markets Android dominates, so Android-first can be valid)*
- Which minimum OS versions? *(recommend: the oldest versions still used by the audience,
  weighed against maintenance cost)*
- Does a team already know a framework? *(recommend: use what the team can maintain)*

### Users and accounts
- Who uses it, and do they sign in? *(then see `eaz-backend-engineering` Auth & Access)*
- Which sign-in method suits the audience — email and password, phone one-time code, social
  login, or a managed provider? *(recommend: phone one-time code where the phone is the main
  identity, with its SMS cost and SIM-swap caveats)*

### Data and connectivity
- Does it have to work offline? Which screens, and what can the user change offline?
  *(recommend: offline-read plus queued writes for the few actions that need it; full
  offline-first only when the use case demands it)*
- What are the audience's phones and networks? *(recommend: assume low-end Android and slow,
  metered data until told otherwise)*
- Is there an existing backend or API, or must one be built? *(route to
  `eaz-backend-engineering` and `eaz-api-development`)*

### Device features and integrations
- Which device features are needed — camera, location, contacts, biometrics, notifications,
  background tasks? *(recommend: only what the Must features need; each adds a permission
  and store disclosure)*
- Push notifications: for what events, to whom, and in which languages?
- Payments: mobile money, cards, or in-app purchase? *(route to the regional payments skill;
  note that store rules on digital goods differ from physical goods and services — check the
  current store guidelines before choosing)*

### Distribution and operations
- How will it reach users — the public stores, an internal distribution, or a private link?
  Which developer accounts exist, and who owns them? *(recommend: the client owns the store
  accounts)*
- Who monitors crashes and ships updates after launch, and how often?
- Which languages and accessibility needs apply?

## Approach table

Use only when the approach is not already fixed. The team's skills and existing code outrank it.

| Situation | Reasonable starting point |
| :--- | :--- |
| Business app, one team, both stores | React Native with Expo, or Flutter |
| Heavy device access, custom animation, peak performance | Native (Swift / Kotlin) or Flutter |
| Existing web team, content-led, light device use | PWA, or Capacitor around the web app |
| Prototype to test an idea | PWA or Expo, with the promise that the architecture may change |

## Recording the answers

```markdown
- **Mobile approach:** React Native with Expo (recommended; one team, both stores)
- **Platforms / minimum OS:** Android 8+ and iOS 15+ — TBD, check audience devices
- **Offline:** read cached lists; queue payments confirmations — TBD for other screens
- **Push / payments:** order updates via push; Paystack — details in PROJECT.md
- **Distribution:** public stores; client owns the developer accounts — accounts TBD
```
