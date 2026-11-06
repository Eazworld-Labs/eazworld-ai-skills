# Skill Selection Guide

Companion to the `project-kickoff` skill. Maps a project type to the library skills
that usually apply, in build order. Treat it as a starting recommendation: confirm it
with the user, and drop any skill that is not installed.

## Always (every project)

1. `software-architecture` — before building anything non-trivial.
2. `security-audit` — at each milestone and before launch.
3. `code-review` — on every pull request.
4. `performance-optimization` and `seo-engineering` — before launch for public sites.

## By project type

| Project type | Build order |
| :--- | :--- |
| **Marketing / business site** | `frontend-design` → `seo-engineering` → `performance-optimization` → `conversion-optimization` → `seo-strategy` |
| **E-commerce store** | `software-architecture` → `database-architecture` → `backend-engineering` → `api-development` → `ecommerce-development` → payments skill for the region → `frontend-design` → `seo-engineering` → `security-audit` |
| **Web app / SaaS** | `software-architecture` → `database-architecture` → `backend-engineering` → `api-development` → `frontend-design` → `software-testing` → `cloud-devops` |
| **Mobile app** | `software-architecture` → `mobile-app-development` → `frontend-design` (UI layer) → `backend-engineering` + `api-development` → `software-testing` |
| **School, church, POS, restaurant, or booking system** | `software-architecture` → `database-architecture` → the matching business skill (`school-management`, `church-management`, `pos-inventory`, `restaurant-management`, `booking-systems`) → payments skill → `frontend-design` |
| **Automation / chatbot** | `n8n-automation` and/or `ai-agent-development` → `chatbot-development` → `whatsapp-automation` → `crm-automation` |
| **Marketing campaign** | `brand-identity` → `seo-strategy` → `google-ads` / `meta-ads` → `social-media-management` → `email-marketing` → `conversion-optimization` |

## By region

| Region | Add |
| :--- | :--- |
| Ghana | `ghana-payments` |
| Nigeria | `nigeria-payments` |
| Other | Record `TBD` for payments and flag it as a blocker for e-commerce and booking work |

## Rules

- Recommend a skill only if it exists in the installed library; check
  `.claude/skills/` rather than trusting this table.
- Give a one-line reason for each recommended skill, tied to this project.
- Prefer a short list. Five well-chosen skills beat fifteen listed "just in case".
