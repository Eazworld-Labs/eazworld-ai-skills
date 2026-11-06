---
name: eaz-mobile-app-development
description: Build mobile applications for iOS and Android on any approach — React Native
  with Expo, Flutter, native Swift and Kotlin, or a web-based app with Capacitor or a PWA.
  Use when choosing a mobile approach, creating app screens and navigation, integrating
  push notifications, handling offline data, configuring builds and store releases, or
  debugging device-specific behavior on iOS and Android.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.1.0"
---

# Mobile App Development

## 1. Overview & Purpose

Builds mobile apps on whichever approach the project uses or the client chooses: screens,
navigation, platform conventions, offline behavior, and the release pipeline. The standards
below are approach-agnostic — platform conventions, resilience on poor networks, secure
storage, permissions, accessibility, performance on low-end phones, and store-ready
releases — and approach-specific idioms load on demand from `references/`. Ships apps that
behave correctly on both iOS and Android — back gestures, keyboards, safe areas, and
interruptions included — and on the phones and networks the audience really uses, not just
on the simulator where they were written.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build a mobile app, or to choose between native,
  cross-platform, and web-based approaches.
- **Trigger 2:** When building or changing screens, navigation, or app flows.
- **Trigger 3:** When adding push notifications, deep links, camera or location
  permissions, payments, or offline data handling.
- **Trigger 4:** When configuring builds, signing, internal distribution, or store
  releases.
- **Trigger 5:** When debugging device-specific behavior — crashes, layout differences,
  or keyboard and safe-area problems on iOS or Android.
- **Anti-Trigger:** Do not activate for web interfaces (route to eaz-frontend-design — it
  still governs the visual design inside an app), server APIs the app calls (route to
  eaz-backend-engineering and eaz-api-development), or payment-rail specifics (route to
  eaz-ghana-payments or eaz-nigeria-payments).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. Target platforms and minimum OS versions.
  2. Navigation structure: the screens and how users move between them.
  3. Data and connectivity expectations: online-only, offline-first, or sync-on-reconnect.
- **Approach Detection (do this first, never assume):**
  1. Read `PROJECT.md`, `SPEC.md`, `ARCHITECTURE.md`, `DESIGN.md`, and `tasks.md` if
     present — they hold the approach, the features and acceptance tests, the structure,
     and the current phase.
  2. Otherwise infer from the repository: `package.json` with `react-native` or `expo`;
     `pubspec.yaml` (Flutter); `android/` with Gradle Kotlin and `ios/` with an Xcode
     project or `Package.swift` (native); `capacitor.config.*` or a web app manifest
     (web-based).
  3. Load the matching approach file from Section 8. If none matches, apply the core rules
     in the project's idiom — and say which approach you detected.
- **Mobile Choices (ask, never assume):** unless `PROJECT.md`, an ADR, or the existing
  code already settles them, get the user's decision before building — at most five
  questions at a time, each asking for **one decision**, each with a recommendation and a
  one-line trade-off. Use [Discovery Questions](./references/discovery-questions.md):
  approach, platforms and devices, offline needs, accounts and sign-in, push, payments,
  distribution, and the audience's network and phone reality. Record the answers in
  `PROJECT.md` (and an ADR for the approach); leave unknowns as `TBD`.
- **Codebase Audit Checklist:**
  1. Read the app configuration and manifests for the SDK or framework version and the
     plugins or native modules already in use — reuse them before adding new ones.
  2. Review existing screens, navigation setup, and state management patterns.
  3. Check the build and signing configuration and any existing store submission setup.

## 4. Technical Standards & Rules

- Follow the project's existing approach, framework, and libraries; never switch approach,
  add a native module, or eject as a side effect of a feature task — that needs explicit
  human approval.
- Honor platform conventions: iOS uses swipe-back and large titles; Android uses the
  system back button and its own navigation patterns — handle both.
- Navigation is typed or centrally defined: route names and parameters live in one place
  and the compiler or tests enforce them.
- State follows the project's established pattern — do not introduce a second state
  library.
- Render long lists with virtualized or lazily built lists; size and cache images; never
  block the UI thread with heavy synchronous work.
- **Design for the real phone and network.** Test on a low-end Android device and on a slow
  or lossy connection; keep the app small; load lazily; avoid assuming fast data.
  Read [Offline & Networking](./references/offline-and-networking.md).
- **Accessibility:** every control has an accessible label, text scales with the system
  setting, touch targets are at least 44×44 pt (48×48 dp on Android), and contrast meets
  WCAG AA — the visual rules in eaz-frontend-design (Native Mobile UI Notes) apply.
- **Releases are engineered:** signing keys are protected and backed up, versions and build
  numbers increase, crashes are reported, and rollouts are staged. See
  [Release & Stores](./references/release-and-stores.md).
- No new dependencies without explicit human approval.

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the screens, the user flow, and the platforms to
   support. If this is a new app, settle the mobile choices (Section 3) before opening any
   file.
2. **Step 2: Inspect Context** — Detect the approach, load its reference file, and execute
   the audit checklist; reuse existing components, navigation, and state patterns.
3. **Step 3: Formulate Plan** — List the screens, their states (loading, empty, error,
   offline), and the data each one needs.
4. **Step 4: Verify Security** — Confirm no secret ships in the app, tokens use secure
   storage, and deep links and permissions are handled safely.
5. **Step 5: Apply Edits** — Build screens bottom-up: shared components, then screens,
   then navigation wiring.
6. **Step 6: Execute Tests** — Run the project's lint, type-check, and test commands; run
   on both platforms; exercise navigation, back behavior, keyboard handling, an offline
   start, and a slow connection; and test on a low-end device where one is available.
7. **Step 7: Report Status** — Report the approach detected, what shipped, what was
   verified on each platform and what could not be, and device-specific caveats. If the
   project has a `tasks.md`, update the status of each task you worked on — done only when
   its acceptance criterion passed — and stop at any approval point it defines.

## 6. Security & Edge Case Guidelines

- **Zero Hardcoding:** The app package is public and can be unpacked — only values meant
  to be public ship in it; server secrets, payment secrets, and private API keys never do.
- **Secure Storage:** Tokens and credentials go in the platform keystore (Keychain on iOS,
  Keystore on Android) through the framework's secure-storage API — never in plain
  preferences or local storage.
- **Deep Links:** Validate incoming links before acting on them; an untrusted link must not
  trigger authenticated or destructive actions.
- **Permissions:** Request camera, location, contacts, or media access only when the feature
  needs it, with a clear reason — and degrade gracefully when it is denied.
- **Transport:** Use HTTPS only; consider certificate pinning only for high-risk apps, with
  a rotation plan.
- **Interruptions:** Handle backgrounding, incoming calls, and low-memory kills — state
  survives a cold relaunch, and payments resume rather than restart or double-charge.
- **Privacy:** Collect only what the feature needs, disclose it accurately in the store's
  privacy declarations, and respect the data-protection law of the audience's country.
- **Untrusted Content:** Web views and linked pages are untrusted — restrict what they can
  call into the app.

## 7. Definition of Done & Quality Gates

- [ ] Approach detected and stated in the report; matching reference file followed.
- [ ] Mobile choices recorded (`PROJECT.md`, or an ADR for the approach), `TBD` marked
      where undecided.
- [ ] Runs on both iOS and Android without crashes or console errors.
- [ ] The project's lint, type-check, and test commands pass.
- [ ] Navigation verified including back gestures (iOS) and the system back (Android).
- [ ] Loading, empty, error, and offline states present on every data screen.
- [ ] Verified on a slow connection and, where available, a low-end Android device.
- [ ] No secrets in the app; tokens in secure storage; deep links and permissions checked.
- [ ] Accessibility labels, text scaling, and touch targets checked.
- [ ] `tasks.md` updated if the project has one.

## 8. Supporting References & Assets

- [Discovery Questions](./references/discovery-questions.md) — mobile questions to ask, an
  approach-selection table, and how to record the answers.
- [Offline & Networking](./references/offline-and-networking.md) — offline-first design,
  sync and conflict rules, and resilience on slow or lossy networks.
- [Release & Stores](./references/release-and-stores.md) — signing, versioning, store
  readiness, staged rollout, crash reporting, and policy checks.
- [React Native & Expo Notes](./references/react-native-expo.md) — load when the manifest
  shows `react-native` or `expo`.
- [Flutter Notes](./references/flutter.md) — load when `pubspec.yaml` shows Flutter.
- [Native iOS & Android Notes](./references/native-ios-android.md) — load for Swift/SwiftUI
  or Kotlin/Jetpack Compose projects.
- [Web-Based App Notes](./references/web-based-apps.md) — load for Capacitor or a PWA.
