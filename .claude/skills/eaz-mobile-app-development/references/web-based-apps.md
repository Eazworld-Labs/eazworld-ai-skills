# Web-Based App Notes (Capacitor & PWA)

Companion to the `eaz-mobile-app-development` skill. Apply when the "app" is a web
application delivered as a PWA or wrapped in a native shell with Capacitor. The interface
itself is governed by eaz-frontend-design.

## When it fits

- The product is mostly content, forms, and light interaction, and the team already builds web.
- Speed to market and one codebase matter more than the last bit of native feel.
- It does not fit when the app needs deep device integration, heavy graphics, or reliable
  background work — choose React Native, Flutter, or native instead.

## PWA

- A web app manifest, a service worker for caching and offline pages, and HTTPS are the
  foundation. Test install behavior on Android and iOS separately — support and limits differ,
  and some capabilities (for example push on iOS) have conditions and may change; check the
  current platform documentation.
- Cache deliberately: version the cache, avoid serving stale data for sensitive screens, and
  provide an offline fallback page.
- Performance matters more, not less: keep the bundle small, load lazily, and test on a
  low-end phone over a slow connection.
- A PWA is not in the stores by default; if store presence matters, plan for a wrapper.

## Capacitor (web app in a native shell)

- The web build runs inside a web view with native plugins for device features. Keep the web
  app responsive and touch-friendly, and use the official or well-maintained plugins for
  camera, storage, push, and so on.
- Secure storage for credentials through a plugin that uses the Keychain and Keystore — not
  `localStorage`.
- Treat the web view as a trust boundary: load only your own content, restrict navigation,
  and limit what scripts can call into native code.
- Stores may reject apps that are only a thin wrapper around a website with no app-like
  value — plan real native-feeling features, and read the current guidelines.
- Native projects still need signing, versioning, privacy declarations, and a staged release —
  see Release & Stores.

## Verification

Test the installed experience on real Android and iOS devices, on a slow connection, and
offline; run the web app's own tests and Lighthouse checks.
