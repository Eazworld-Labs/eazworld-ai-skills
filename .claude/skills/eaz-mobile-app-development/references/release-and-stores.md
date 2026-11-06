# Release & Stores

Companion to the `eaz-mobile-app-development` skill. Getting an app to users is engineering
work with its own failure modes. Store rules change — **check the current official
guidelines before relying on anything here**, and never assume an old answer still holds.

## 1. Accounts and ownership

- The **client owns** the developer accounts (Apple Developer, Google Play) and the
  application identifiers; the agency is added as a team member. Losing access to an
  account can mean losing the app.
- Record who holds each account, the billing owner, and renewal dates in `HANDOFF.md` —
  never the credentials.

## 2. Signing and versions

- **Signing keys are irreplaceable.** Back up Android upload keys and use Play App Signing
  where offered; keep iOS certificates and provisioning managed, with more than one person
  able to renew them. Store keys in a secret store, never in the repository.
- Use semantic versions for users and an always-increasing build number for the stores.
- Tag every release in version control so a shipped build can be reproduced.

## 3. Store readiness checklist

- App name, icon, screenshots for the required device sizes, description, and category.
- A privacy policy at a public address, and the store's privacy declarations filled in to
  match what the app actually collects (including third-party SDKs).
- Account deletion available in-app where the stores require it for apps with accounts.
- Permissions: each one requested has a user-facing reason, and the store listing matches.
- Content rating questionnaire completed honestly.
- Demo access for reviewers if sign-in is required, with a test account that works.
- Payments follow the store's rules: **digital goods** usually must use the store's billing,
  while **physical goods and real-world services** usually may use other methods such as
  mobile money — verify the current guideline for the case at hand.

## 4. Quality gates before every release

- The project's tests, lint, and type-check pass on the release commit.
- A release candidate build is installed on real devices — a low-end Android phone and a
  recent iPhone at minimum — and the Must features from `SPEC.md` pass their acceptance
  tests.
- Upgrade path tested: install the previous version, then update, and check that data and
  sign-in survive.
- Crash and error reporting is wired up and receives a test event.
- A rollback plan exists: stores cannot un-ship a build, so keep the previous build ready
  and the server compatible with it.

## 5. Rolling out

- Use internal and closed testing tracks first (TestFlight, Play internal or closed
  testing), then a **staged rollout** to a small percentage, watching crashes and key
  metrics before widening.
- Keep the **server backward compatible** with older app versions still in the wild; plan a
  minimum-supported-version check with a friendly "please update" screen for forced updates.
- Over-the-air updates for the JavaScript layer (where the approach supports them) can ship
  fixes faster, but they must still follow the stores' rules — never use them to change
  what the app fundamentally does.

## 6. After launch

- Monitor crash-free sessions, startup time, and store reviews; respond to reviews.
- Keep dependencies and the target OS levels current — the stores raise minimum target
  levels over time and will block updates that fall behind.
- Record releases in `CHANGELOG.md` and keep `RUNBOOK.md` current with how to build, sign,
  and submit.
