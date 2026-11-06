# Vue & Nuxt Notes

Companion to the `frontend-design` skill. Apply on top of the core rules when the
manifest shows `vue` or `nuxt`. Check the installed major version before choosing
APIs.

## Defaults

- Vue 3 Composition API with `<script setup lang="ts">`; typed props via
  `defineProps<...>()` and typed emits via `defineEmits<...>()`.
- Keep components small and single-purpose; share logic through composables, not
  mixins.
- **Nuxt:** prefer server rendering or static generation; use `useFetch` /
  `useAsyncData` for data so it is fetched once on the server, and `<ClientOnly>` only
  for genuinely browser-only widgets.
- Public runtime config goes in `runtimeConfig.public`; secrets stay in private
  `runtimeConfig` and never reach components.
- Use `<NuxtImg>` / `<NuxtLink>` (or the Vue equivalents the project uses) for image
  optimization and routing.

## Styling

- Tokens as CSS variables on `:root`, consumed by name in scoped styles or the utility
  framework's theme; no raw hex or arbitrary pixel values in components.
- Match the UI library already installed (Vuetify, PrimeVue, Nuxt UI) before
  building primitives.

## Animation

- Use the built-in `<Transition>` and `<TransitionGroup>` with CSS classes tied to the
  motion tokens in [Motion & Animation](./motion-and-animation.md); add a library only
  with approval.
- Nuxt page and layout transitions are configured in the app or per page — keep them
  short and honor `prefers-reduced-motion`.

## Safety

- Avoid `v-html`; if unavoidable, sanitize with a reviewed library and document why.

## Verification

Run the project's `vue-tsc`, lint, test, and build scripts, and check 360 / 768 /
1440px.
