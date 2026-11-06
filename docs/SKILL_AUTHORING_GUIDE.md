# Eazworld Skill Authoring Guide

**Version:** 1.0.0  
**Owner:** Eazworld  
**Status:** Foundational Standard  
**Supported Agents:** Claude Code, OpenCode  
**Applies To:** All Eazworld AI Skills  

---

## 1. Purpose

This document establishes the mandatory standards for designing, creating, documenting,
testing, reviewing, and maintaining skills within the Eazworld AI Skills Library.

It ensures that every skill is:

- **Reliable & Production-Oriented:** Focused on delivering deterministic, clean, and tested
  code.
- **Clearly Scoped & Reusable:** Designed with a single primary responsibility across
  projects.
- **Secure by Design:** Enforcing zero-trust patterns, input validation, and secret
  protection.
- **Consistent in Quality:** Formatted strictly according to Open Agent Skills standards.
- **Cross-Agent Compatible:** Seamlessly executable across Claude Code and OpenCode.
- **Easy to Maintain:** Structured for progressive disclosure and rapid contributor
  onboarding.

All AI agents and human contributors creating or modifying Eazworld skills must strictly
adhere to this guide.

---

## 2. What Is an Eazworld Skill?

An Eazworld skill is a self-contained, modular unit of domain expertise, instructions,
workflows, and optional technical assets. It equips AI coding agents with procedural
knowledge to execute specialized tasks with high consistency.

Examples of Eazworld Skills:

- Software architecture and microservice design.
- Frontend, backend, and API engineering.
- Database schema design and migration management.
- Security audits and vulnerability assessments.
- Technical SEO and conversion rate optimization (CRO).
- Workflow automations (n8n, WhatsApp Business API).
- Industry verticals (POS systems, School/Church management, Local Payment Gateways).

**Crucial Rule:** A skill provides guidance and structural execution patterns. It does not
grant an AI agent autonomous permission to run destructive terminal commands, expose
environment variables, drop production databases, or execute unverified shell scripts.

---

## 3. Core Skill Design Principles

### 3.1 Single Responsibility Principle (SRP)

Each skill must cover one clear domain. Never combine unrelated capabilities (e.g.,
combining eaz-seo-strategy with eaz-database-architecture) into a single skill.

### 3.2 High Portability & Reusability

Skills must remain framework-agnostic where possible and project-neutral, allowing them to
be applied across any repository managed by Eazworld.

### 3.3 Progressive Disclosure Model

Keep the primary SKILL.md clean and direct. Move deep technical specifications, extensive
code templates, and schemas into supporting reference files (`references/`) to prevent
flooding the agent's context window.

### 3.4 Production First & Zero Hallucination

Skills must prioritize correctness over speed. AI agents following a skill must verify their
implementations via builds and test suites before declaring work complete.

### 3.5 Context Inspection First

A skill must instruct the AI agent to inspect the target codebase's directory structure,
dependencies (`package.json`), and existing coding standards before making modifications.

### 3.6 Cross-Agent Interoperability

Write instructions that run cleanly across Claude Code and OpenCode without depending on
agent-specific proprietary extensions.

---

## 4. Mandatory Directory Structure

Every skill must reside within its own dedicated directory under `skills/` or
`.claude/skills/`, using lowercase kebab-case.

```text
skill-name/
├── SKILL.md                  # Mandatory: Primary entry point & directives
├── references/               # Optional: Dynamic specs, guidelines, schemas
│   ├── technical-guide.md
│   └── implementation-examples.md
├── scripts/                  # Optional: Safe validation linters or helper utilities
│   └── validate-schema.js
└── assets/                   # Optional: Boilerplate templates, env samples, icons
    └── config-template.json
```

Only `SKILL.md` is strictly required. Do not create empty directories (`references/`,
`scripts/`, `assets/`) if no supporting files are present.

---

## 5. Naming Standards

Directory names and metadata `name` fields must strictly match and adhere to the following
rules:

- **Format:** Lowercase kebab-case only (`[a-z0-9-]`).
- **Prefix:** Every skill name starts with `eaz-` (`eaz-frontend-design`). Agents give a
  user's personal skills priority over project skills of the same name, so an unprefixed
  name can be silently shadowed by someone's own `frontend-design`. The validator
  rejects names without the prefix.
- **Conciseness:** Descriptive, specific, and clear.
- **Prohibited Characters:** No uppercase letters, spaces, underscores, or special symbols.

| Valid Skill Name | Invalid Skill Name | Reason for Invalidity |
| :--- | :--- | :--- |
| `eaz-frontend-design` | Frontend Design | Uppercase letters and spaces used |
| `eaz-backend-engineering` | `backend_engineering` | Underscores used instead of hyphens |
| `eaz-ghana-payments` | GhanaPayments | CamelCase used |
| `eaz-n8n-automation` | N8N-Automation | Uppercase letters used |
| `eaz-code-review` | `code-review` | Missing the `eaz-` prefix |

---

## 6. Mandatory SKILL.md Frontmatter & Format

Every SKILL.md file must begin with valid YAML frontmatter using standard string quotes
for versions.

```yaml
---
name: skill-name
description: Explicit activation trigger. Use when the user requests building X, configuring Y, or modifying Z. Include natural language keywords.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.0.0"
---
```

### 6.1 Metadata Field Specifications

| Field | Requirement | Description |
| :--- | :---: | :--- |
| `name` | Mandatory | Must match the parent folder name exactly (kebab-case). |
| `description` | Mandatory | Third-person narrative describing what the skill does and when it should be activated. |
| `license` | Recommended | Defaults to MIT. |
| `metadata.author` | Recommended | Eazworld. |
| `metadata.department` | Mandatory | One of `software-engineering`, `digital-marketing`, `ai-automation`, `business-solutions`. A label for grouping — never a folder. |
| `metadata.version` | Recommended | Semantic version string wrapped in quotes (e.g., `"1.0.0"`). |

### 6.2 Description Quality Standards

The `description` field determines skill routing. It must contain explicit trigger phrases
and domain keywords.

- **BAD:** "Helps with software development." (Too vague, causes false positives or missed
  triggers).
- **GOOD:** "Design and implement accessible, responsive frontend user interfaces using
  React, Next.js, TypeScript, and Tailwind CSS. Use when building UI components, fixing
  styling bugs, or optimizing Web Vitals."

---

## 7. Mandatory SKILL.md Structure

Every SKILL.md must contain the following core sections, formatted in Markdown:

```markdown
# [Skill Title]

## 1. Overview & Purpose
Brief summary of the skill's capabilities, primary goals, and expected outcomes.

## 2. Activation Conditions & Triggers
Explicit situations, keywords, and user requests that trigger this skill.

## 3. Required Inputs & Project Audit
- Mandatory inputs needed before starting (e.g., API keys schema, user requirements).
- Context inspection instructions (e.g., check `package.json`, read existing UI components).

## 4. Technical Standards & Rules
Non-negotiable architectural rules, technology constraints, and domain-specific practices.

## 5. Execution Workflow (Step-by-Step)
1. Step 1: Audit & Inspection
2. Step 2: Implementation & Code Scaffolding
3. Step 3: Local Verification & Testing

## 6. Security & Edge Case Guidelines
Zero-trust practices, OWASP rules, input sanitization, error handling, and fallback states.

## 7. Definition of Done & Quality Gates
Explicit checklist required to mark the task complete (e.g., build passes, linters green).
```

---

## 8. Execution Workflow Design

Skills must enforce a deterministic, 7-step execution workflow for the AI agent:

```text
[1. Parse Task] ──> [2. Audit Project] ──> [3. Formulate Plan] ──> [4. Verify Security]
                                                                          │
[7. Report Status] <── [6. Execute Tests] <── [5. Apply Edits] <──────────┘
```

- **Parse Task:** Understand the user's objective and constraints.
- **Audit Project:** Inspect target repository structure, package manifests, and code style.
- **Formulate Plan:** Create a clear mental or written implementation strategy.
- **Verify Security:** Ensure no secrets are exposed and destructive actions are halted for
  human approval.
- **Apply Edits:** Make atomic, scoped changes without touching unrelated files.
- **Execute Tests:** Run builds, linters, or unit tests to verify changes.
- **Report Status:** Document completed work, test outcomes, and any remaining edge cases.

---

## 9. Technology Alignment

Skills must respect Eazworld's primary technology stack:

- **Frontend:** React, Next.js, TypeScript, CSS, Tailwind CSS, styled-components.
- **Backend:** Node.js, Express.js, TypeScript, REST & GraphQL APIs.
- **Databases:** PostgreSQL, MongoDB (with Mongoose), Redis.
- **Mobile:** React Native, Expo, EAS.
- **Automation:** n8n workflows, Webhooks, WhatsApp Business API.
- **Testing:** Jest, Vitest, Playwright.
- **Payments & Regional Tech:** Paystack, Hubtel, Ghana Mobile Money APIs (MTN, Telecel, AT).

Agents must never force unapproved technology migrations or introduce bloated third-party
packages.

---

## 10. Security Guardrails

All skills must incorporate the following non-negotiable security directives:

- **Zero Hardcoded Secrets:** Never hardcode API keys, JWT secrets, passwords, or
  connection strings.
- **Environment Isolation:** Require environment variables (`.env.example`) for sensitive
  inputs.
- **Input Sanitization:** Validate and sanitize all user and external API payloads (using
  Zod/Joi).
- **Destructive Command Protection:** Require explicit human confirmation before dropping
  tables, deleting files, or force-pushing git branches.
- **Least Privilege:** Write code that operates under minimal required access roles.

---

## 11. Reference Documentation Guidelines

Auxiliary documentation inside `references/` must be linked directly within SKILL.md. For
deep technical specs regarding Paystack webhook verification, refer to:

`[Paystack Webhook Reference](./references/paystack-spec.md)`

**Rules for Reference Files:**

- Use clean Markdown with kebab-case filenames (`references/schema-guide.md`).
- Keep reference files modular and domain-specific.
- Instruct the agent to read reference files dynamically only when needed.

---

## 12. Supporting Script Guidelines

Scripts located in `scripts/` must:

- Be written in Node.js, Python, or Shell script.
- Be thoroughly documented with usage examples.
- Never run automatically without verifying input parameters.
- Avoid making unauthenticated network calls or modifying production environments.

---

## 13. Comprehensive Skill Quality Matrix

Before a skill is merged into eazworld-ai-skills, it must pass this validation matrix:

| Quality Area | Acceptance Requirement |
| :--- | :--- |
| Metadata | Valid YAML syntax, valid kebab-case name, and accurate trigger description. |
| Scope | Single responsibility; no overlap with existing departmental skills. |
| Structure | All 7 mandatory Markdown sections present. |
| Security | Zero hardcoded credentials, explicit input validation, and safe fallback logic. |
| Code Examples | Syntactically valid TypeScript, JavaScript, SQL, or JSON snippets. |
| Interoperability | Tested and verified in both Claude Code and OpenCode environments. |
| Completeness | References and assets correctly linked with no broken relative links. |

---

## 14. Skill Review & Approval Process

```text
[Draft Skill] ──> [Schema & YAML Lint] ──> [Agent Test Execution] ──> [Maintainer Approval] ──> [Merged v1.0.0]
```

- **Validation Linter:** Run automated validation scripts to check YAML frontmatter and
  folder naming.
- **Dry Run Execution:** Test the skill against real prompts in Claude Code and OpenCode.
- **Security Review:** Confirm no proprietary keys or insecure commands exist.
- **Maintainer Sign-Off:** Eazworld core maintainers review and approve the pull request.

AI agents are strictly prohibited from approving their own skill submissions without human
review.

---

## 15. Prohibited Practices

The following actions are strictly prohibited in Eazworld skills:

- ❌ Hardcoding real API keys, credentials, or internal server IPs.
- ❌ Creating duplicate skills across different agent configurations.
- ❌ Writing broad, generic descriptions that hijack unrelated prompts.
- ❌ Including destructive shell scripts that execute without human verification.
- ❌ Marking a skill as v1.0.0 or "Production Ready" without testing it against an agent run.
- ❌ Silently suppressing error states or falsifying test outputs.

---

## 16. Definition of Done (DoD)

A skill is officially marked complete when:

- [ ] Folder structure adheres to `skill-name/SKILL.md`.
- [ ] YAML frontmatter passes schema validation.
- [ ] All 7 mandatory sections are thoroughly written.
- [ ] Security guidelines and input validation rules are enforced.
- [ ] Auxiliary files in `references/` and `assets/` are correctly linked.
- [ ] Tested and verified in Claude Code and OpenCode.
- [ ] Approved by an Eazworld maintainer and logged in CHANGELOG.md.

---

Maintained by: Eazworld  
Document: Skill Authoring Guide  
Version: 1.0.0  
License: MIT
