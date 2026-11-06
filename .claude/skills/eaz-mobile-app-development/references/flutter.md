# Flutter Notes

Companion to the `eaz-mobile-app-development` skill. Apply on top of the core rules when
`pubspec.yaml` shows Flutter. Check the installed Flutter and Dart versions and package
versions before using any API below.

## Defaults

- Follow the project's structure and state approach (Provider, Riverpod, Bloc, or what is
  already there); do not introduce a second one. Keep UI, state, and data layers separate.
- Prefer small widgets and `const` constructors over large `build` methods and helper
  functions; extract widgets so rebuilds stay cheap.
- Colors, text styles, and spacing come from the theme (`ThemeData`) and a constants file — no
  literals in widgets (see Native Mobile UI Notes in eaz-frontend-design).
- Use `ListView.builder` (or slivers) for long lists; cache network images; avoid doing
  expensive work inside `build`.
- Async: never block the UI isolate; use isolates for heavy computation; guard `BuildContext`
  use across `await` gaps.
- Navigation: use the project's router (Navigator 2 or a router package) with typed route
  definitions; handle the Android system back button.
- Storage: secure storage package for credentials (Keychain/Keystore); a local database for
  structured offline data.
- Platform differences: use adaptive widgets or platform checks where iOS and Android
  conventions differ; test both.
- Build flavors for development, staging, and production, with environment values supplied at
  build time and kept out of the repository.
- Run `flutter analyze` and the project's lints; commit the lockfile.

## Pitfalls

- Rebuilding the whole tree on every state change — scope state and use `const`.
- Hard-coded sizes that break with large system text or on small screens.
- Plugins that are unmaintained or do not support both platforms — check before adopting.
- Testing only on the emulator; test a low-end Android phone and an iPhone.

## Verification

Run `flutter analyze` and `flutter test`, run on both platforms, and exercise navigation, back
behavior, keyboard handling, an offline start, and a slow connection.
