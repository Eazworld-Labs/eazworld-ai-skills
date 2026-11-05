Eazworld AI Skills Library — Architecture
Version: 1.0.0
Owner: Eazworld
Status: Foundational Architecture (Production-Grade Enhanced)
Supported Agents: Claude Code, OpenCode

1. Purpose
This document defines the comprehensive technical architecture, repository organization, skill design patterns, integration strategies, validation protocols, and compatibility requirements of the Eazworld AI Skills Library.

It establishes a single, authoritative, and maintainable source of truth for reusable, production-grade AI agent skills across all Eazworld software, marketing, automation, and business solutions.

2. Architectural Principles
The architecture strictly adheres to ten core principles:

Single Source of Truth (SSOT): Maintain one authoritative, version-controlled copy of each skill to prevent divergence.

Agent Interoperability: Seamlessly support Claude Code, OpenCode, and standard Open Agent Skills runners without core duplication.

Modularity & Isolation: Each skill must operate independently, encapsulating specific domain logic with minimal cross-dependencies.

Progressive Disclosure: Load metadata at startup, core instructions on trigger, and deep technical references/assets dynamically on demand.

Universal Reusability: Skills must be framework-agnostic where possible and portable across multiple Eazworld enterprise projects.

Security by Design: Enforce zero-trust guidelines; skills must never expose credentials, API secrets, or perform unverified operations.

Maintainability & Extensibility: Keep the repository structure clean, testable, well-documented, and easy to scale.

Deterministic Execution: Standardize step-by-step execution workflows to eliminate agent hallucinations and guesswork.

Localization Readiness: Built-in support for African fintech, localized payment gateways (Paystack, Hubtel, MoMo), and regional business compliance.

Verifiable Quality Gates: Every skill must pass automated linting, schema validation, and test scenario verification before release.

3. High-Level Architecture
The repository is organized into five major functional layers:

Skill Layer (skills/.claude/): Contains modular, reusable AI engineering, marketing, automation, and business capabilities.

Documentation Layer (docs/): Defines master specifications, engineering standards, authoring guides, security policies, and roadmaps.

Integration Layer (.claude/, adapters): Provides cross-agent compatibility and runtime execution bindings for Claude Code and OpenCode.

Validation Layer (scripts/, workflows): Programmatically checks skill structure, YAML frontmatter metadata, references, schema compliance, and security guardrails.

Governance Layer (.github/, root files): Controls open-source contributions, pull request templates, security advisories, semantic releases, and licensing.

4. Repository Structure
The target repository structure is designed as follows. Directories and files are introduced progressively as the ecosystem matures:
eazworld-ai-skills/
│
├── .claude/
│   └── skills/                         # Authoritative shared skill definitions
│       ├── software-engineering/       # Department 1: Core tech, architecture & mobile
│       │   ├── software-architecture/
│       │   │   └── SKILL.md
│       │   ├── frontend-design/
│       │   │   └── SKILL.md
│       │   └── ...
│       ├── digital-marketing/          # Department 2: SEO, Ads & Brand
│       ├── ai-automation/              # Department 3: n8n, Chatbots & APIs
│       ├── business-solutions/         # Department 4: POS, ERP & Fintech
│       └── device-services/            # Department 5: Technical workflows & repair
│
├── docs/
│   ├── ARCHITECTURE.md                 # This architecture specification
│   ├── ENGINEERING_STANDARDS.md        # Master coding & behavioral rules (v2.0.0)
│   ├── SKILL_AUTHORING_GUIDE.md        # Authoring rules for new skills
│   ├── COMPATIBILITY.md                # Agent interoperability guide
│   ├── SECURITY_POLICY.md              # Threat model & zero-trust rules
│   └── ROADMAP.md                      # Feature & skill release roadmap
│
├── templates/                          # Reusable code skeletons and boilerplate assets
├── examples/                           # Reference implementations and test runs
├── scripts/                            # Validation linters and CI automation scripts
│
├── .github/
│   ├── workflows/                      # CI/CD validation pipelines (GitHub Actions)
│   ├── ISSUE_TEMPLATE/                 # Structured bug and skill request templates
│   └── PULL_REQUEST_TEMPLATE.md        # PR checklist enforcing engineering standards
│
├── README.md                           # Public landing page and installation instructions
├── SPEC.md                             # Project specification and metadata
├── CONTRIBUTING.md                     # Contributor guidelines
├── CODE_OF_CONDUCT.md                  # Community behavioral code
├── SECURITY.md                         # Vulnerability reporting policy
├── CHANGELOG.md                        # Semantic version release log
└── LICENSE                             # MIT License

5. Skill Architecture & Directory Layout
Every skill must reside in its own dedicated directory under its respective department, following the standardized Open Agent Skills structure:
skill-name/
├── SKILL.md            # Mandatory entry point (Frontmatter + Core Directives)
├── references/         # Optional technical specs, guidelines, and API docs
├── scripts/            # Optional validated automation scripts or helpers
└── assets/             # Optional templates, configuration examples, and diagrams

5.1 SKILL.md Specification
The mandatory entry point for every skill. It must contain:

- Valid YAML frontmatter (name, description, version, author, license).

- Clear activation triggers and domain scope.

- Technical standards and non-negotiable rules.

Step-by-step execution workflows (Inspection → Implementation → Verification).

- Security and edge-case handling rules.

- Concrete code templates or examples.

- Definition of done and quality gates.

5.2 References (references/)
Optional supporting documentation containing detailed technical specifications, architecture decision records (ADRs), API schemas, and domain knowledge loaded dynamically by agents on demand.

5.3 Scripts (scripts/)
Optional executable helper utilities (Node.js scripts, Python utilities, shell scripts) used by a skill. All scripts must be thoroughly reviewed for security vulnerabilities, sandboxed, and tested before execution.

5.4 Assets (assets/)
Optional boilerplate templates, JSON configurations, environment examples (.env.example), and UI wireframe assets.

6. Agent Integration Architecture
6.1 Claude Code
Claude Code serves as the primary development, runtime, and skill-authoring environment. Skills are linked or maintained under .claude/skills/ and discovered natively through the Open Agent Skills protocol.

6.2 OpenCode
OpenCode serves as the secondary development and compatibility environment. The repository maintains a single source of truth under .claude/skills/, and OpenCode environments are configured via symlinks or workspace settings to reference this shared directory. Agent-specific configuration overrides are maintained separately without duplicating core skill instructions.

6.3 Shared Skill Strategy
To eliminate drift and code duplication, the authoritative skill source is strictly .claude/skills/. Compatibility checks must be performed across both runners before pushing breaking changes.

7. Skill Departments & Focus MatrixThe library is organized into five core operational departments:DepartmentFocus & Domain Coverage1. Software EngineeringArchitecture, frontend systems, backend services, SQL/NoSQL databases, REST/GraphQL APIs, automated testing, and CI/CD DevOps.2. Digital MarketingTechnical SEO, Google Ads, Meta Ads management, social media automation, brand identity guidelines, and email marketing frameworks.3. AI & AutomationCustom AI agent architecture, n8n workflow automation, WhatsApp Business API, intelligent LLM chatbots, and CRM lead pipelines.4. Business SolutionsSchool management, church administration, restaurant POS, inventory systems, booking frameworks, and regional fintech (Paystack, Hubtel, MoMo).5. Device ServicesHardware repair workflows, diagnostic procedures, component sourcing logs, and technical service center management.

8. Skill Discovery and Execution Lifecycle
When handling user requests, AI agents must follow a deterministic 7-step execution lifecycle:

Context & Intent Analysis: Identify the user's core task, project tech stack, and constraints.

Skill Matching: Evaluate available skill frontmatter descriptions to determine relevant domain skills.

Progressive Loading: Load only the relevant SKILL.md instructions and required references/.

Mandatory Project Audit: Inspect existing repository files, package manifests, and architecture before writing code (adhering to ENGINEERING_STANDARDS.md).

Execution Workflow: Follow the skill's step-by-step instructions precisely.

Verification & Testing: Run local builds, linters, and test suites to validate the implementation.

Transparent Reporting: Report completed work, test outcomes, and any unresolved edge cases honestly.

Agents must never load or apply every skill indiscriminately.

9. Technology Architecture & Supported Stack
Skills may cover the following production technologies where appropriate:

Frontend: React, Next.js, TypeScript, HTML, CSS, Tailwind CSS, styled-components.

Backend: Node.js, Express.js, TypeScript, REST APIs, Serverless functions.

Databases: PostgreSQL, MongoDB, Mongoose, Redis.

Mobile: React Native, Expo, EAS (Expo Application Services), TypeScript.

State & Data Fetching: TanStack Query, Zustand, Redux Toolkit.

Automation & AI: n8n, webhooks, REST APIs, LLM APIs, agent frameworks, MCP.

Infrastructure: AWS, Docker, Linux (AlmaLinux/Ubuntu), GitHub Actions, Cloudflare.

Testing: Jest, Vitest, Playwright.

Payments & Fintech: Paystack, Hubtel, Ghana Mobile Money (MTN MoMo, Telecel Cash, AT Money).

Technology choices must respect existing project architecture. Skills must not force unapproved technology migrations.

10. Validation Architecture
The validation layer guarantees quality through automated checks:

YAML frontmatter metadata schema validation.

Directory and file naming convention enforcement (kebab-case).

Required documentation section checks.

Internal reference link validation.

Static code analysis and security script auditing.

Cross-agent compatibility verification.

Automated testing via GitHub Actions CI pipelines on every pull request.

11. Security Architecture
All skills, scripts, and generated code must strictly comply with Eazworld's Engineering Standards and Security Policy. The architecture explicitly prevents:

Hardcoded secrets, API keys, or private environment variables.

Unauthorized or destructive production changes without explicit human confirmation.

Uncontrolled external API calls or unverified network requests.

Excessive data exposure or non-compliance with privacy standards.

Unreviewed package installations or arbitrary script execution.

12. Versioning and Releases
The repository strictly follows Semantic Versioning (SemVer):

MAJOR (X.0.0): Breaking architectural changes, core schema modifications, or runner compatibility shifts.

MINOR (0.X.0): Addition of new skills, departmental capabilities, or backward-compatible features.

PATCH (0.0.X): Bug fixes, rule clarifications, and documentation improvements.

Individual skills may also maintain independent version metadata in their frontmatter. All significant changes must be logged in CHANGELOG.md.

13. Architecture Change Management
Changes to this foundational architecture document (ARCHITECTURE.md) require:

A documented technical justification.

Compatibility evaluation across Claude Code and OpenCode.

Security impact assessment.

Updates to corresponding engineering standards and guides.

Successful passing of all validation tests.

Explicit maintainer approval before merge.

14. Definition of Architectural Completion
The architecture is successfully implemented when:

The repository strictly matches the documented directory structure.

All skills adhere to the unified Open Agent Skills format.

Claude Code and OpenCode successfully discover and utilize the shared skills.

Automated validation scripts run cleanly in CI/CD pipelines.

Security and contribution policies are fully enforced.

Maintained by: Eazworld

Document: Architecture

Version: 1.0.0