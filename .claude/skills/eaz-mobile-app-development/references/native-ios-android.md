# Native iOS & Android Notes

Companion to the `eaz-mobile-app-development` skill. Apply on top of the core rules for
projects written in Swift (iOS) and Kotlin (Android). Check the project's deployment targets
and library versions before using any API below.

## Shared

- Choose native when the app needs heavy device features, custom rendering, or the best
  possible performance — it costs two codebases, so the SPEC should justify it.
- Keep the same architecture on both platforms where possible (for example a presentation
  layer, a domain layer, and a data layer) so features stay in step.
- Follow each platform's design language and accessibility APIs; the two apps may look
  different on purpose.
- Keep secrets out of the binary; use the platform keystore for credentials.

## iOS (Swift)

- SwiftUI for new screens where the minimum OS allows it; UIKit where it does not or where
  the project already uses it. Keep views small and state explicit.
- Concurrency: use structured concurrency (`async`/`await`); keep UI updates on the main actor.
- Credentials in the Keychain; background modes and capabilities only when needed, each with a
  clear reason for review.
- Respect Dynamic Type, VoiceOver, and safe areas; test with large text.
- Dependencies through Swift Package Manager; review each one.

## Android (Kotlin)

- Jetpack Compose for new screens where the project allows it; keep composables small and
  state hoisted. Follow the ViewModel and unidirectional data-flow pattern the project uses.
- Coroutines and Flow for asynchronous work; never block the main thread.
- Credentials in the Android Keystore (and encrypted storage); request runtime permissions at
  the moment of use.
- Respect font scaling, TalkBack, and the system back behavior and gesture navigation.
- Test on low-memory devices and handle process death: state must survive a kill and restore.
- Build with Gradle and version catalogs; keep minification and shrinking on for release builds
  and test the release build, not only debug.

## Verification

Run unit tests and UI tests on each platform, run on real devices, and test the release
configuration — debug builds hide performance and shrinking problems.
