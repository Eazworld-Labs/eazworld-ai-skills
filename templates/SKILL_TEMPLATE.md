---
name: skill-name-in-kebab-case
description: Third-person descriptive summary of what this skill does and the exact
  scenarios, user requests, or conditions that trigger its activation.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# [Skill Title: Clear & Professional]

## 1. Overview & Purpose

Provide a concise summary of the skill's capabilities, primary goals, architectural
context, and expected engineering outcomes.

---

## 2. Activation Conditions & Triggers

Explicitly list the keywords, user prompts, system states, or task requirements that
trigger the activation of this skill.

- **Trigger 1:** When a user asks to build, configure, or audit X...
- **Trigger 2:** When modifying Y or debugging Z...
- **Anti-Trigger:** Do not activate for unrelated general queries.

---

## 3. Required Inputs & Project Audit

Before executing any code changes or workflows, the AI agent must perform an inspection
audit of the target repository:

- **Mandatory Inputs:** List required environment variables, configuration schemas, or
  user specifications.
- **Codebase Audit Checklist:**
  1. Inspect `package.json` for existing framework versions and dependencies.
  2. Review existing folder structure and architectural patterns.
  3. Verify that required `.env` placeholders exist without exposing secrets.

---

## 4. Technical Standards & Rules

Non-negotiable technical rules, constraints, design patterns, and tech-stack requirements:

- Strict adherence to TypeScript, React/Next.js, Node.js, or selected stack specifications.
- Enforcement of modular architecture and Single Responsibility Principle (SRP).
- Strict adherence to Eazworld engineering standards and clean code conventions.

---

## 5. Execution Workflow (Step-by-Step)

Provide a deterministic, step-by-step procedure that the AI agent must follow:

1. **Step 1: Parse & Plan** — Analyze user requirements and verify constraints.
2. **Step 2: Inspect Context** — Review existing files, dependencies, and configurations.
3. **Step 3: Scaffold / Implement** — Apply atomic, well-scoped code changes.
4. **Step 4: Verify & Test** — Run build scripts, linters, and unit tests.

---

## 6. Security & Edge Case Guidelines

Enforce security guardrails and edge-case handling:

- **Zero Hardcoding:** Never hardcode API keys, database credentials, or secret tokens.
  Use `.env.example`.
- **Input Validation:** Validate and sanitize all external payloads using strict schemas
  (e.g., Zod).
- **Destructive Command Protection:** Require explicit human confirmation before executing
  destructive shell commands (`rm -rf`, `git push --force`) or database drops.
- **Error Handling:** Gracefully handle network timeouts, failed API requests, and
  unhandled exceptions.

---

## 7. Definition of Done & Quality Gates

Checklist required for the AI agent to mark the task complete:

- [ ] Code successfully builds without syntax or compilation errors.
- [ ] Automated linters and test suites pass (`npm test`, `npm run lint`).
- [ ] No hardcoded secrets or credentials introduced.
- [ ] Changes verified against supported agents (Claude Code & OpenCode).
- [ ] Documentation and inline comments updated where necessary.

---

## 8. Supporting References & Assets

Link supporting technical documents or boilerplate templates dynamically:

- Reference Guide: [Technical Spec Reference](./references/technical-guide.md)
- Template Asset: [Configuration Template Example](./assets/config-template.json)
