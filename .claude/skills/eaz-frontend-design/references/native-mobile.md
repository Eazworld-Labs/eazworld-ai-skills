# Native Mobile UI Notes

Companion to the `eaz-frontend-design` skill. Covers the UI layer for React Native, Expo,
and Flutter. App structure, navigation, builds, and store release belong to the
`eaz-mobile-app-development` skill.

## Shared rules

- Use the platform's theme object (React Native theme provider, Flutter `ThemeData`)
  as the token source; components read tokens, never raw values.
- Touch targets at least 44×44 pt (iOS) / 48×48 dp (Android), with spacing between
  adjacent targets.
- Honor safe areas, notches, and the on-screen keyboard — test forms with the keyboard
  open.
- Support system text scaling and dark mode; verify layouts at the largest text size.
- Label every interactive element for screen readers (`accessibilityLabel` /
  `Semantics`) and keep reading order logical.
- Design every list for loading, empty, error, and offline states.
- Test on a small and a large device size, and on a real mid-range Android device, not
  only a simulator.

## React Native / Expo

- TypeScript with typed props; prefer the project's styling approach
  (`StyleSheet`, NativeWind, Tamagui) and keep tokens in one theme file.
- Use virtualized lists (`FlatList` / `FlashList`) for long data; avoid inline
  anonymous components in render paths.
- Use `expo-image` or an equivalent cached image component for remote images.

## Flutter

- Prefer `const` widgets and small widget classes over large `build` methods and
  helper functions.
- Colors, text styles, and spacing come from `Theme.of(context)` and a spacing
  constants file — no literals in widgets.
- Use `ListView.builder` for long lists and `LayoutBuilder` / breakpoints for tablets.

## Animation

- **React Native / Expo:** use Reanimated for entering/exiting and layout animations so
  motion runs on the UI thread; honor the system "reduce motion" setting (Reanimated
  provides `useReducedMotion` — confirm in the installed version).
- **Flutter:** start with implicit animations (`AnimatedContainer`, `AnimatedOpacity`),
  move to explicit controllers only when needed, and respect the platform's disable-
  animations setting.
- Use **Rive** or **Lottie** for illustrated animation, with a static fallback and a
  file-size check.
- Durations and curves come from a shared constants file mirroring the web motion
  tokens in [Motion & Animation](./motion-and-animation.md).

## Verification

Run the project's analyzer and tests (`tsc` + lint + tests, or `flutter analyze` +
`flutter test`) and walk the main flow on device or emulator.
