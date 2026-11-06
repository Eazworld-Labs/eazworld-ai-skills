# Eazworld AI Skills Library (`eazworld-ai-skills`)

## Project Specification & Standards Manual

---

### 1. Project Identity

- **Name:** Eazworld AI Skills Library
- **Repository:** `eazworld-ai-skills`
- **Owner:** Eazworld
- **Type:** Open-source AI Skills & Engineering Automation Ecosystem
- **License:** MIT License
- **Target AI Agents:** Claude Code, OpenCode, and Open Agent Skills-compliant runners

---

### 2. Project Mission

Build a modular, open-source collection of production-grade AI skills that empower AI
coding agents to deliver enterprise software, digital marketing systems, workflow
automations, and localized business solutions across Africa and global markets.

---

### 3. Project Objectives

1. **Standardize AI Development:** Enforce consistent engineering standards and code
   architecture across AI-assisted builds.
2. **Eliminate Repetitive Boilerplate:** Accelerate development cycles by codifying
   domain-specific logic, templates, and patterns.
3. **Elevate Security & Quality:** Prevent AI agents from hardcoding credentials,
   introducing performance bottlenecks, or generating unverified code.
4. **Localize Business Solutions:** Provide specialized skills for African fintech, Ghana
   Mobile Money (MoMo), Paystack, Hubtel, and local business management systems.
5. **Cross-Agent Portability:** Ensure complete compatibility with Claude Code, OpenCode,
   and open-source agent ecosystems.

---

### 4. Repository & Directory Architecture

Skills are organized into four core departmental domains, following the standard Open Agent
Skills layout:

```text
eazworld-ai-skills/
├── .claude/
│   └── skills/                # Local runtime link for Claude Code
│       ├── eaz-frontend-design/       # one folder per skill; department is a
│       ├── eaz-backend-engineering/   # `metadata.department` label, not a folder
│       ├── eaz-ghana-payments/
│       └── ...
├── templates/                 # Reusable code skeletons and assets
├── CONTRIBUTE.md              # Open-source submission guide
├── LICENSE                    # MIT
└── README.md                  # Installation & activation guide
```

---

### 5. Skill Departments & Skill Matrix

**Department 1: Software Engineering**

- Software Architecture & Microservices
- Frontend Design & Component Systems
- Backend Engineering & Microservices
- RESTful & GraphQL API Development
- Database Architecture (SQL & NoSQL)
- E-commerce & Shopping Cart Engineering
- Mobile App Development (React Native / Expo)
- Automated Software Testing (Unit, E2E, Integration)
- Code Review & Static Analysis
- Security Audit & Vulnerability Assessment
- Performance Optimization & Memory Profiling
- Technical SEO Engineering
- Cloud, Docker & DevOps CI/CD Pipelines

**Department 2: Digital Marketing**

- Technical SEO & Schema Strategy
- Google Ads Campaign Management
- Meta (Facebook/Instagram) Ads Optimization
- Social Media Automation & Content Scheduling
- Brand Identity & Aesthetic Design Guidelines
- Transactional & Promotional Email Marketing
- Conversion Rate Optimization (CRO)

**Department 3: AI & Automation**

- Custom AI Agent Architecture
- n8n Workflow Automation
- WhatsApp Business API Automation
- Intelligent Chatbot Development (Claude / OpenAI APIs)
- CRM & Lead Pipeline Automation

**Department 4: Business Solutions**

- School Management Systems
- Church & Fellowship Administration
- POS, Inventory & Stock Management
- Restaurant & Hospitality Systems
- Booking & Appointment Frameworks
- Ghana & West Africa Payment Gateways (Paystack, Hubtel, MoMo API)

---

### 6. Supported Technology Stack

- **Frontend:** React, Next.js, TypeScript, CSS, styled-components, Tailwind CSS
- **Backend:** Node.js, Express.js, TypeScript, REST APIs
- **Databases:** PostgreSQL, MongoDB, Mongoose, Redis
- **Mobile:** React Native, Expo, EAS (Expo Application Services)
- **Automation:** n8n, Webhooks, REST Integrations
- **Infrastructure:** AWS, Docker, Linux (AlmaLinux/Ubuntu), GitHub Actions, Cloudflare
- **Testing:** Jest, Vitest, Playwright
- **Payments & Local APIs:** Paystack, Hubtel, Ghana Mobile Money (MTN MoMo, Telecel Cash,
  AT Money)

---

### 7. AI Agent Directives (The 15 Operational Rules)

Every AI agent interacting with repositories governed by the Eazworld AI Skills Library
must strictly adhere to these 15 execution rules:

1. **Audit Context First:** Inspect existing files, configuration, and architecture before
   writing or altering code.
2. **Confirm Requirements & Scope:** Clarify ambiguous specifications and identify
   constraints prior to implementation.
3. **Follow Established Conventions:** Match existing code styles, directory structures, and
   design patterns.
4. **Minimize Dependencies:** Prefer built-in language capabilities before introducing
   third-party packages.
5. **Zero-Trust Security:** Never hardcode API keys, passwords, tokens, or sensitive
   environment data.
6. **Write Readable & Type-Safe Code:** Maintain strict modularity, explicit typing, and
   clean self-documenting logic.
7. **Scope Edits Strictly:** Refrain from refactoring or reformatting unrelated code
   outside the requested task.
8. **Verify via Builds & Tests:** Run tests, linters, or compilation commands to validate
   changes.
9. **Handle Edge Cases Explicitly:** Implement robust error handling and avoid silent
   failures.
10. **Protect Backward Compatibility:** Avoid breaking existing APIs, public methods, or
    database schemas without explicit authorization.
11. **Update Documentation:** Keep READMEs, code comments, and schema docs synchronized
    with code changes.
12. **Report Partial Work Honestly:** Clearly list incomplete tasks, edge cases left
    unhandled, or added TODO items.
13. **Require Verification for Claims:** Never state a feature works unless verified through
    test execution or build output.
14. **Pause on High-Risk Actions:** Stop and seek human confirmation before performing
    destructive schema edits, file deletions, or force updates.
15. **Maintain Clean Git History:** Provide clear, descriptive commit messages outlining
    specific changes made.

---

### 8. Skill Specification Standard (SKILL.md)

All skills in this library must include a valid SKILL.md formatted as follows:

```markdown
---
name: department-skill-name
description: Use when the user requests [action X], building [feature Y], or modifying [system Z]. Be explicit with trigger keywords.
version: 1.0.0
author: Eazworld
license: MIT
---

# Skill Title

## 1. Overview & Purpose
Brief summary of the domain expertise provided by this skill.

## 2. Technical Standards & Rules
- Directive 1
- Directive 2

## 3. Workflow & Step-by-Step Execution
1. Step 1: Inspection & Audit
2. Step 2: Implementation
3. Step 3: Verification

## 4. Code Templates & Examples
Include 1-2 production-ready, minimal examples.

## 5. Security & Edge Case Guidelines
- Specific security risks to prevent.
- Known error scenarios and recovery tactics.
```

---

### 9. Quality & Contribution Gates

Before any skill is merged into the eazworld-ai-skills repository, it must pass these
validation checks:

- **Metadata Validation:** Valid YAML frontmatter with precise routing rules in the
  description.
- **Zero Secrets:** No internal URLs, private keys, or API tokens committed.
- **Tested Examples:** All code blocks inside SKILL.md or supplementary `assets/` must be
  syntactically valid and tested.
- **Portable Dependencies:** Explicitly state external CLI requirements (e.g.,
  `node>=18.0.0`, `eas-cli`, `docker`).

---

### 10. Release Strategy

The repository strictly follows Semantic Versioning (SemVer):

- **MAJOR (X.0.0):** Breaking changes to skill file structures, frontmatter schemas, or
  agent execution rules.
- **MINOR (0.X.0):** Addition of new skills, departments, or workflow tools.
- **PATCH (0.0.X):** Bug fixes, rule refinements, and documentation updates.

**Initial Release Target:** v1.0.0

---

### 11. Long-Term Vision

To establish the Eazworld AI Skills Library as the premiere open-source repository for
AI-driven software development, digital agency automation, and localized African fintech
solutions—empowering developers globally to build faster, safer, and better with AI.
