---
name: mobile-app-development
description: Build mobile applications with React Native, Expo, and EAS. Use when creating
  app screens and navigation, integrating push notifications, handling offline data,
  configuring builds and releases, or debugging device-specific behavior on iOS and
  Android.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Mobile App Development

## 1. Overview & Purpose

Builds native-feeling mobile apps on the React Native and Expo stack: screens,
navigation, platform conventions, offline behavior, and the release pipeline. Ships apps
that behave correctly on both iOS and Android — back gestures, keyboards, safe areas, and
interruptions included — not just on the simulator where they were written.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to build or change screens, navigation, or app flows in
  a React Native or Expo project.
- **Trigger 2:** When adding push notifications, deep links, camera/location permissions,
  or offline data handling.
- **Trigger 3:** When configuring EAS builds, internal distribution, or store releases.
- **Trigger 4:** When debugging device-specific behavior — crashes, layout differences,
  or keyboard and safe-area problems on iOS or Android.
- **Anti-Trigger:** Do not activate for web interfaces (route to frontend-design) or
  server APIs the app calls (route to backend-engineering and api-development).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. Target platforms and minimum OS versions.
  2. Navigation structure: the screens and how users move between them.
  3. Data and connectivity expectations: online-only, offline-first, or sync-on-reconnect.
- **Codebase Audit Checklist:**
  1. Read `app.json` or `app.config` for the Expo SDK version and existing plugins.
  2. Inspect `package.json` for native libraries already in use — reuse them before
     adding new ones.
  3. Review existing screens, navigation setup, and state management patterns.
  4. Check the EAS configuration and any existing store submission setup.

## 4. Technical Standards & Rules

- Follow the Expo SDK and the project's existing libraries; adding native modules or
  ejecting requires explicit human approval.
- Honor platform conventions: iOS uses swipe-back and large titles, Android uses the
  hardware back button and different floating action behavior — handle both.
- Render large lists with virtualized lists (`FlatList`/`FlashList`) and keep images
  sized and cached; never block the JavaScript thread with synchronous heavy work.
- Navigation is typed: route names and params are defined once and enforced by the
  compiler.
- State management follows the project's established pattern (context, Zustand, Redux) —
  do not introduce a second state library.
- Strict TypeScript in every component; props and route params use explicit interfaces.

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the screens, the user flow, and the platforms to
   support.
2. **Step 2: Inspect Context** — Execute the audit checklist; reuse existing components,
   navigation, and state patterns.
3. **Step 3: Formulate Plan** — List the screens, their states (loading, empty, error),
   and the data each one needs.
4. **Step 4: Verify Security** — Confirm no secret ships in the bundle and tokens will
   use secure storage.
5. **Step 5: Apply Edits** — Build screens bottom-up: shared components, then screens,
   then navigation wiring.
6. **Step 6: Execute Tests** — Run lint and type-check, launch on both simulators, and
   exercise navigation, back behavior, and keyboard handling manually.
7. **Step 7: Report Status** — Report what shipped, what was verified on each platform,
   and any device-specific caveats.

## 6. Security & Edge Case Guidelines

- **Zero Hardcoding:** The app bundle is public — only explicitly public values use
  `EXPO_PUBLIC_*` variables; server secrets never enter the client.
- **Secure Storage:** Tokens and credentials go in Keychain/Keystore via
  `expo-secure-store` or the auth session flow — never in plain AsyncStorage.
- **Deep Links:** Validate incoming deep link URLs before acting on them; an untrusted
  link must not trigger authenticated actions.
- **Permissions:** Request camera, location, or media access only when the feature needs
  it, with a clear explanation — and degrade gracefully when permission is denied.
- **Interruptions:** Handle backgrounding, incoming calls, and low-memory kills — state
  survives a cold relaunch, and payments resume rather than restart.

## 7. Definition of Done & Quality Gates

- [ ] Runs on both iOS and Android simulators without red screens or console errors.
- [ ] Lint and type-check pass.
- [ ] Navigation verified including back gestures (iOS) and hardware back (Android).
- [ ] Loading, empty, and error states present on every data screen.
- [ ] No secrets in the bundle; tokens stored in secure storage.
- [ ] Keyboard, safe area, and permission-denied paths checked manually.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; Expo and React Native docs are the
  reference for platform APIs at implementation time.
