---
name: eaz-seo-engineering
description: Implement technical SEO for web applications. Use when adding or fixing meta
  tags, structured data, sitemaps, canonical URLs, robots directives, server rendering
  for crawlable content, redirects, or investigating indexing and ranking issues.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.0.0"
---

# SEO Engineering

## 1. Overview & Purpose

Handles the technical half of search visibility: making content crawlable, indexable, and
richly understood by search engines. Covers metadata, structured data, sitemaps,
canonicals, redirects, and server-rendered content on the Next.js stack. Content strategy
and link building belong to the marketing department — this skill makes sure what exists
can actually be found and correctly displayed in results.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to add or fix titles, descriptions, Open Graph tags, or
  metadata.
- **Trigger 2:** When implementing structured data (JSON-LD), sitemaps, robots.txt,
  canonical tags, or redirect maps.
- **Trigger 3:** When a page is not being indexed, not appearing as expected in search, or
  failing a rich-results validation.
- **Trigger 4:** When primary content is client-rendered and must become crawlable.
- **Anti-Trigger:** Do not activate for writing marketing copy or keyword research
  (digital-marketing department) or for general page speed without an SEO angle (route to
  eaz-frontend-design/references/performance-optimization.md).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. Target pages and the search intent each should satisfy.
  2. The rendering mode of the site (SSR, SSG, client-side) and the framework in use.
  3. Current indexing problems if any, with examples (URLs missing from search).
- **Codebase Audit Checklist:**
  1. View the raw HTML source of key pages — content hidden behind client-side JavaScript
     is invisible to crawlers.
  2. Read the current metadata setup (Next.js metadata API or equivalent).
  3. Check `sitemap.xml` and `robots.txt` for accuracy and accidental blocks.
  4. Look for existing JSON-LD and canonical tags before adding new ones.

## 4. Technical Standards & Rules

- Primary content is server-rendered — the HTML source carries the text, headings, and
  links; JavaScript enhances but never gates the main content.
- Every indexable page has a unique title (about 50–60 characters), a unique meta
  description (about 150–160 characters), and exactly one `h1`.
- Duplicate or near-duplicate pages use canonical tags; the default is self-referencing
  unless a deliberate consolidation exists.
- `sitemap.xml` lists only canonical, indexable URLs and stays current; `robots.txt` never
  blocks CSS, JS, or the sitemap itself.
- Structured data follows schema.org types that match the visible content — Product,
  Article, Organization, and BreadcrumbList cover most pages.
- URLs are clean and permanent; moved pages get permanent (301) redirects, never chains
  or temporary (302) redirects for permanent moves.
- Images carry descriptive alt text, next-gen formats, and lazy loading below the fold —
  image weight is also a ranking factor through Core Web Vitals.

Example of per-page metadata and Product structured data:

```ts
export const metadata: Metadata = {
  title: 'Ankara Print Shoes | EazWorld',
  description: 'Hand-finished Ankara print shoes, sizes 38–46, delivery across Accra.',
  alternates: { canonical: '/products/ankara-print-shoes' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Ankara Print Shoes',
  offers: { '@type': 'Offer', price: '250.00', priceCurrency: 'GHS' },
};
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the pages in scope, their search intent, and the
   symptom or feature requested.
2. **Step 2: Inspect Context** — Execute the audit checklist; read the HTML source as a
   crawler would before changing anything.
3. **Step 3: Formulate Plan** — Produce the metadata and schema map: one row per page
   with title, description, canonical, and JSON-LD type.
4. **Step 4: Verify Security** — Confirm no cloaking, hidden text, or deceptive redirects
   are involved, and internal-only pages stay out of the index.
5. **Step 5: Apply Edits** — Implement metadata, structured data, and sitemap changes in
   small commits per concern.
6. **Step 6: Execute Tests** — Validate JSON-LD with the rich-results validator, fetch
   the sitemap, view page sources, and run the Lighthouse SEO audit.
7. **Step 7: Report Status** — Report changes per page, validation results, and any items
   needing content-side follow-up.

## 6. Security & Edge Case Guidelines

- **No Deception:** Cloaking, hidden text, keyword stuffing, and deceptive redirects are
  prohibited — they are penalized and they violate the authoring guide's honesty rules.
- **Schema Truth:** Structured data must match what the user can actually see on the page
  — markup for content that is not present is a policy violation.
- **Staging Safety:** Non-production environments are authenticated and `noindex`-ed so
  draft content never enters the public index.
- **No PII in URLs:** Session identifiers and personal data never appear in links — they
  leak through referrers, logs, and caches.
- **Redirect Discipline:** Redirect loops and chains break crawling — every redirect map
  is verified end to end before release.

## 7. Definition of Done & Quality Gates

- [ ] Every target page has a unique title, description, `h1`, and canonical tag.
- [ ] HTML source contains the primary content without executing JavaScript.
- [ ] JSON-LD validates and matches visible content.
- [ ] `sitemap.xml` and `robots.txt` reachable, accurate, and unblocked.
- [ ] Moved pages answer with verified 301 redirects and no chains.
- [ ] Lighthouse SEO audit passes with no errors on target pages.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; schema.org and the search engine
  guidelines are the reference at implementation time.
