# Server-Rendered & CMS Notes

Companion to the `frontend-design` skill. Apply when the project renders HTML on the
server or runs on a CMS: Laravel Blade, WordPress themes, Django/Rails templates, or
plain HTML/CSS sites.

## Defaults

- Work within the existing template hierarchy and partials; extend a layout instead of
  duplicating markup.
- Tokens as CSS custom properties in one stylesheet (or the theme's `theme.json` for
  WordPress block themes); templates reference classes, never raw values.
- Ship progressively: HTML that works without JavaScript first, then enhance. Add a
  JS dependency only with explicit human approval.
- Escape every dynamic value with the template engine's default escaping (`{{ }}` in
  Blade, `esc_html()` / `esc_attr()` in WordPress, autoescape in Django); treat any
  raw-output directive (`{!! !!}`, `|safe`) as a review flag.

## WordPress specifics

- Build with the theme's template files and block patterns; keep business logic in a
  plugin, not `functions.php`.
- Enqueue assets through `wp_enqueue_style` / `wp_enqueue_script` with versions; never
  hardcode `<link>` or `<script>` tags.
- Do not edit a third-party parent theme or plugin — use a child theme or hooks.
- Make client-editable content editable: use blocks, ACF fields, or menus rather than
  hardcoding copy in templates.

## Animation

- Multi-page sites can get smooth page-to-page transitions with
  `@view-transition { navigation: auto; }` — a progressive enhancement (Chrome/Edge 126,
  Safari 18.2; other browsers navigate normally). Details and fallbacks in
  [Motion & Animation](./motion-and-animation.md).
- Keep animation in the theme's stylesheet, tied to motion tokens, and enqueue any
  animation script through the CMS's normal asset system.

## Performance & accessibility

- Responsive images with `srcset`/`sizes`, explicit width and height to prevent layout
  shift, and `loading="lazy"` below the fold.
- Self-host or preload fonts with `font-display: swap`; limit weights.
- Landmarks (`header`, `nav`, `main`, `footer`), a skip link, and labelled forms.

## Verification

Check the rendered page at 360 / 768 / 1440px, run a Lighthouse pass for accessibility
and performance, and confirm editors can still change the content they own.
