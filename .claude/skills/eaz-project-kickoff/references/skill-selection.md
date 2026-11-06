# Skill Selection Guide

Companion to the `eaz-project-kickoff` skill. Maps a project type to the library skills
that usually apply, in build order. Treat it as a starting recommendation: confirm it
with the user, and drop any skill that is not installed.

## Always (every project)

1. `eaz-software-architecture` — before building anything non-trivial.
2. `eaz-security-audit` — at each milestone and before launch.
3. `eaz-code-review` — on every pull request.
4. `eaz-performance-optimization` and `eaz-seo-engineering` — before launch for public sites.

## By project type

| Project type | Build order |
| :--- | :--- |
| **Marketing / business site** | `eaz-frontend-design` → `eaz-seo-engineering` → `eaz-performance-optimization` → `eaz-conversion-optimization` → `eaz-seo-strategy` |
| **E-commerce store** | `eaz-software-architecture` → `eaz-database-architecture` → `eaz-backend-engineering` → `eaz-api-development` → `eaz-ecommerce-development` → payments skill for the region → `eaz-frontend-design` → `eaz-seo-engineering` → `eaz-security-audit` |
| **Web app / SaaS** | `eaz-software-architecture` → `eaz-database-architecture` → `eaz-backend-engineering` → `eaz-api-development` → `eaz-frontend-design` → `eaz-software-testing` → `eaz-cloud-devops` |
| **Mobile app** | `eaz-software-architecture` → `eaz-mobile-app-development` → `eaz-frontend-design` (UI layer) → `eaz-backend-engineering` + `eaz-api-development` → `eaz-software-testing` |
| **School, church, POS, restaurant, or booking system** | `eaz-software-architecture` → `eaz-database-architecture` → the matching business skill (`eaz-school-management`, `eaz-church-management`, `eaz-pos-inventory`, `eaz-restaurant-management`, `eaz-booking-systems`) → payments skill → `eaz-frontend-design` |
| **Automation / chatbot** | `eaz-n8n-automation` and/or `eaz-ai-agent-development` → `eaz-chatbot-development` → `eaz-whatsapp-automation` → `eaz-crm-automation` |
| **Marketing campaign** | `eaz-brand-identity` → `eaz-seo-strategy` → `eaz-google-ads` / `eaz-meta-ads` → `eaz-social-media-management` → `eaz-email-marketing` → `eaz-conversion-optimization` |

## By region

| Region | Add |
| :--- | :--- |
| Ghana | `eaz-ghana-payments` |
| Nigeria | `eaz-nigeria-payments` |
| Other | Record `TBD` for payments and flag it as a blocker for e-commerce and booking work |

## Rules

- Recommend a skill only if it exists in the installed library; check
  `.claude/skills/` rather than trusting this table.
- Give a one-line reason for each recommended skill, tied to this project.
- Prefer a short list. Five well-chosen skills beat fifteen listed "just in case".
