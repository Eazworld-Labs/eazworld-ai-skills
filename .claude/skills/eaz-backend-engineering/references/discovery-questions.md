# Backend Discovery Questions

Companion to the `eaz-backend-engineering` skill. Use before building a new backend or a
new subsystem, so the architecture rests on real requirements instead of habit.

## How to ask

1. **Skip what is already answered** — read `PROJECT.md`, any ADR in `docs/adr/`, and the
   codebase first. Never re-ask.
2. **At most five questions at a time, each asking for one decision**, with a recommended
   answer and a one-line trade-off the client can accept in one word. Do not bundle
   several decisions into one numbered question.
3. **Only the groups this project needs.** A brochure site with a contact form skips
   queues and multi-tenancy.
4. **Unanswered becomes `TBD`.** Record it; an open core decision blocks the build.
5. Record answers in `PROJECT.md` (Back end, Database, Hosting, Authentication, Decisions
   & Trade-offs) and write an ADR for decisions that are expensive to reverse.

## Question bank

### Architecture
- Does this project need a custom backend at all? *(recommend: no, when a CMS, a hosted
  form handler, or a backend-as-a-service covers the need — less to build and maintain)*
- What shape should it take? *(recommend: a modular monolith — one deployable with clear
  module boundaries; choose separate services only for a proven scaling or team reason)*
- Is there an existing backend or database to integrate with or take over?

### Authentication & access
- Who signs in — customers, staff, admins, partners, other systems?
- How should they sign in? *(email and password, phone one-time code, social login, or a
  managed identity provider — see Auth & Access for trade-offs)*
- Which roles exist, and what may each do? *(recommend: start with the fewest roles that
  separate real responsibilities)*
- Is this multi-tenant — does one deployment serve several separate organizations?

### Data
- What is the expected data volume and growth? *(then route schema and engine choices to
  `eaz-database-architecture`)*
- Are there reporting or analytics needs beyond the operational screens?

### Integrations
- Which payment providers are needed? *(route to `eaz-payments` by region)*
- Which email, SMS, or WhatsApp provider sends messages? *(route to
  `eaz-whatsapp-automation` for WhatsApp)*
- Where do uploaded files and images live? *(recommend: object storage, not the app
  server's disk)*
- Any third parties — maps, analytics, CRM, accounting — and do they send webhooks?

### Background work & real time
- What must happen outside the request: emails, reports, imports, scheduled jobs,
  webhooks? *(see Jobs, Webhooks & Idempotency)*
- Is anything real-time — live order status, chat, notifications?

### Hosting & operations
- Where will it run — a VPS, a managed platform, serverless? Who deploys and monitors it?
  *(recommend: the option the client's team can actually operate; a VPS means they own
  patching, backups, TLS, and monitoring)*
- What uptime, backup, and recovery expectations apply, and what is the budget?

### Compliance & scale
- Which personal data is stored, and under which law — for example Nigeria's NDPA or
  Ghana's Data Protection Act? *(affects retention, consent, and deletion)*
- What traffic is expected, and are there peaks such as sales or school-fee deadlines?

## Starting-point stack table

Use only when the stack is not already fixed. The client's team skills and existing code
always outrank this table.

| Project | Reasonable starting points |
| :--- | :--- |
| Brochure or content site with forms | No custom backend: CMS plus a hosted or serverless form handler |
| Custom online store | Next.js route handlers with PostgreSQL, or Laravel — both mature for carts, orders, and payments; weigh Shopify or a headless store first |
| Admin-heavy systems (school, church, POS, bookings) | Laravel or Django — authentication, admin screens, and an ORM come built in |
| API for a mobile app, real-time features | Node.js (NestJS or Fastify), or a backend-as-a-service to ship quickly |
| Data, ML, or AI-heavy features | Python with FastAPI |
| Organizations already on Microsoft tooling | ASP.NET Core |

## Recording the answers

Add to `PROJECT.md`, `TBD` where open:

```markdown
- **Back end / API:** Laravel 11 modular monolith (recommended; client has a PHP developer)
- **Authentication:** email and password plus phone one-time code for customers; staff
  accounts with roles; managed provider TBD
- **Background jobs / integrations:** Paystack webhooks, order emails (queue), nightly
  stock report (scheduled)
- **Hosting / deployment:** managed VPS — provider TBD; backups TBD
```
