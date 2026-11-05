# Changelog

All notable changes to the **Eazworld AI Skills Library** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-05

### Added

- **Foundational Architecture Suite (`docs/ARCHITECTURE.md`):** Established core principles,
  Single Source of Truth (SSOT) repository layout, progressive disclosure models, and
  cross-agent interoperability guidelines.
- **Engineering Standards (`docs/ENGINEERING_STANDARDS.md` v2.0.0):** Defined rigorous
  coding rules, file inspection protocols, and behavioral guardrails for AI coding agents.
- **Skill Authoring Guide (`docs/SKILL_AUTHORING_GUIDE.md`):** Standardized the 7 mandatory
  Markdown sections, YAML frontmatter schemas, naming conventions (kebab-case), and quality
  matrices.
- **Agent Compatibility Matrix (`docs/COMPATIBILITY.md`):** Recorded native skill
  discovery, activation, and reference-link test outcomes with runner versions across
  **Claude Code** and **OpenCode**, without code duplication.
- **Security Policy (`docs/SECURITY_POLICY.md`):** Enforced zero-hardcoding rules,
  zero-trust patterns, OWASP Top 10 defense, and secret isolation.
- **Development Roadmap (`docs/ROADMAP.md`):** Outlined the 31 planned skills across 4 core
  departments (Software Engineering, Digital Marketing, AI & Automation, Business
  Solutions) and execution phases.
- **Task Management Tracking (`tasks.md`):** Established tracking procedures and acceptance
  criteria across all implementation phases.
- **Project Specification (`PROJECT_SPEC.md`):** Documented ecosystem scope, target tech
  stack, and versioning rules.
- **Software Engineering Skills (13):** architecture, frontend, backend, databases, APIs,
  security auditing, testing, code review, e-commerce, mobile, performance, SEO
  engineering, and cloud DevOps — each with triggers, audit checklists, workflows,
  security guardrails, and a Definition of Done.
- **Digital Marketing Skills (7):** SEO strategy, Google Ads, Meta Ads, social media
  management, brand identity, email marketing, and conversion optimization.
- **AI & Automation Skills (5):** agent development, n8n workflows, WhatsApp automation,
  chatbot development, and CRM automation — with retry, idempotency, and
  environment-isolation patterns throughout.
- **Business Solutions Skills (6):** school and church management, POS and inventory,
  restaurant operations, booking systems, and Ghana payments (Paystack, Hubtel, Mobile
  Money) — RBAC, audit logging, callback verification, and offline-first guidance.
- **Validation Tooling (`scripts/validate-skills.js`):** Automated linter for YAML
  frontmatter, kebab-case naming, the 7 mandatory sections, reference-link integrity,
  and secret scanning — with a Node test suite (`npm test`).
- **Governance & CI/CD Templates:** Pull request and issue templates under `.github/`,
  plus the `lint-skills` GitHub Actions workflow gating every push and pull request on
  Node 24.
- **Developer Experience Documentation:** Per-agent installation steps in `README.md`,
  a step-by-step skill creation guide in `CONTRIBUTING.md`, and
  `docs/TROUBLESHOOTING.md` with troubleshooting and FAQ.
- **Open Source Licensing:** Added the permissive **MIT License**.

---

*Maintained by Eazworld*
