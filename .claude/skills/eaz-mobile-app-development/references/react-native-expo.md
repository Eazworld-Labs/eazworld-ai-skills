# React Native & Expo Notes

Companion to the `eaz-mobile-app-development` skill. Apply on top of the core rules when the
manifest shows `react-native` or `expo`. Match the installed SDK and library versions —
check `package.json` and `app.json` / `app.config.*` before using any API below.

## Defaults

- Follow the Expo SDK and the project's existing libraries; adding native modules, using a
  development build instead of Expo Go, or ejecting needs explicit human approval.
- Strict TypeScript: explicit prop and route-parameter types; typed navigation so route names
  and params are defined once and enforced by the compiler.
- Navigation: use the project's router (Expo Router or React Navigation); handle iOS swipe-back
  and the Android system back button on every stack.
- State: follow the established pattern (context, Zustand, Redux) — do not add a second library.
- Lists: virtualized lists (`FlatList` or `FlashList`); stable keys; avoid anonymous inline
  components in render paths; size and cache images (for example with `expo-image`).
- Keep the JavaScript thread free: move heavy work to native modules, background tasks, or
  the server; run animations on the UI thread (Reanimated) — see the motion notes in
  eaz-frontend-design.
- Environment: only values meant to be public use `EXPO_PUBLIC_*`; server secrets never enter
  the app.
- Builds and releases: EAS Build for signed binaries, EAS Submit for the stores, EAS Update for
  over-the-air JavaScript fixes within the stores' rules; define build profiles for development,
  preview, and production.

Example of token storage on the secure keystore:

```ts
import * as SecureStore from 'expo-secure-store';

export async function saveSession(token: string) {
  await SecureStore.setItemAsync('session_token', token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}
```

## Pitfalls

- Tokens in plain AsyncStorage instead of secure storage.
- Testing only on a simulator — keyboards, safe areas, permissions, and performance differ on
  devices, and the low-end Android phone is the one that exposes jank.
- Library versions out of step with the Expo SDK — use the version Expo's tooling recommends.
- Forgetting the Android back button in custom modals and stacks.

## Verification

Run the project's type-check, lint, and test scripts; start the app on both platforms; exercise
navigation, back behavior, keyboard handling, an offline start, and a slow connection.
