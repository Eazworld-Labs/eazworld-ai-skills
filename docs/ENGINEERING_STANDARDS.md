# Eazworld Engineering Standards

Version: 1.0.0
Owner: Eazworld
Status: Foundational Standard (Enforced for AI Agents & Human Contributors)

---

## 1. Purpose

This document defines the mandatory engineering standards, architectural patterns, and
behavioral rules that all AI agents (Claude Code, OpenCode) and human contributors must
follow when developing, maintaining, or deploying Eazworld projects.

The objective is to consistently deliver secure, highly reliable, observable, and
production-ready solutions that real businesses and customers depend on.

---

## 2. Core Engineering Principles

Every implementation must strictly prioritize:

1. **Correctness over speed:** Code must be logically sound, type-safe, and thoroughly tested before delivery.
2. **Security over convenience:** Never bypass security controls for the sake of quick scaffolding or temporary testing.
3. **Maintainability over unnecessary complexity:** Write clean, modular, and self-documenting code. Avoid clever hacks.
4. **Reusability over duplication:** Abstract common business logic into shared libraries or reusable modules.
5. **Performance without sacrificing reliability:** Optimize data access, rendering, and compute overhead responsibly.
6. **Comprehensive documentation:** Keep architecture records and documentation synchronized with code changes.
7. **Automated testing:** Validate all functional logic with appropriate automated test coverage.
8. **Consistent architecture:** Adhere strictly to the established design patterns of the target repository.
9. **Responsible dependency management:** Minimize external packages to reduce bundle size
   and vulnerability surface area.
10. **Verifiable implementation:** Never claim a task or feature is complete unless
    verified through actual test runs or builds.

---

## 3. Mandatory Project Inspection

Before altering any existing project, the AI agent must perform a rigorous code audit:

1. Inspect the repository directory structure and workspace configuration.
2. Read the `README.md` and core system documentation.
3. Inspect `package.json`, `Cargo.toml`, `requirements.txt`, or equivalent manifests.
4. Identify programming languages, runtime versions, and active frameworks.
5. Map out the existing architectural layers and data flow patterns.
6. Inspect existing implementations and helper utilities to maintain style consistency.
7. Locate existing test suites and runner configurations.
8. Identify environment variable requirements (`.env.example`) and build configurations.
9. Identify existing linters, formatters, and type-checking rules.

*Never assume an existing project uses a particular framework or directory layout without
checking it first. Never rewrite or rebuild a feature that already exists.*

---

## 4. Requirements Analysis & Execution Planning

Before writing code:

- Deconstruct the requested functionality into explicit functional and non-functional requirements.
- Identify external service dependencies, rate limits, and API contracts.
- Map out edge cases, failure states, and security threat vectors.
- Evaluate potential breaking changes to existing APIs, databases, or UI components.
- For complex multi-file or multi-service features, formulate a step-by-step implementation plan before coding.

*Ask for immediate clarification if essential requirements are ambiguous. Do not invent
business requirements or create unauthorized product features.*

---

## 5. Architecture Standards

All software architecture must prioritize:

- **Separation of Concerns (SoC):** Isolate business logic from UI rendering, data access
  layers, and transport protocols.
- **Modular Design:** Build small, loosely coupled, and highly cohesive components/modules.
- **Clear Data Boundaries:** Enforce strict type boundaries and validation between service layers.
- **Resilient Error Handling:** Implement graceful degradation, retry logic for transient
  errors, and structured error boundaries.

**Strictly Avoid:**
- Circular dependencies between modules or packages.
- Large monolithic files or God-components exceeding 300 lines of complex logic.
- Duplicated business logic across services.
- Tightly coupled modules that prevent independent unit testing.

---

## 6. Frontend Engineering

Frontend implementations (React, Next.js, TypeScript, React Native/Expo) must:

- Be fully responsive across mobile, tablet, and desktop viewports.
- Follow accessible design principles, adhering to **WCAG 2.2 AA** standards where applicable.
- Use semantic HTML elements and accessible ARIA attributes.
- Maintain consistent spacing, design tokens, and typography systems.
- Leverage reusable component libraries.
- Explicitly handle all UI states: **Loading, Empty, Error, and Success**.
- Optimize rendering performance to protect Core Web Vitals (LCP, FID/INP, CLS).
- Prevent unnecessary re-renders through proper state management and memoization where required.

---

## 7. Backend Engineering

Backend implementations (Node.js, Express, TypeScript, Serverless) must:

- Validate and sanitize all incoming payloads at the transport boundary using robust
  validation schemas (e.g., Zod, Joi).
- Enforce authentication (JWT, Session tokens) on all protected endpoints.
- Enforce role-based or attribute-based authorization independently of frontend routing.
- Return consistent, standard HTTP status codes (`200`, `201`, `400`, `401`, `403`, `404`, `422`, `500`).
- Implement centralized, structured JSON error logging.
- Protect sensitive runtime parameters and keys via secure environment configuration management.
- Apply strict rate limiting on public and authentication-sensitive endpoints.
- Securely validate uploaded files (type checking, size caps, safe storage isolation).

*Never trust client-side validation alone under any circumstances.*

---

## 8. Database Engineering

Database implementations (PostgreSQL, MongoDB/Mongoose, Redis) must:

- Use appropriate schemas, strict typing, and normalization where applicable.
- Enforce referential integrity, constraints, and validation rules at the database level.
- Define proper indexes based on actual query execution paths and access patterns.
- Handle transactional operations safely (ACID compliance where money or critical state changes are involved).
- Protect sensitive or PII data using hashing, encryption at rest, or masking.
- Plan safe, backward-compatible schema migrations and backup strategies.

*Never change or drop production database structures without an explicit migration script and a rollback/recovery plan.*

---

## 9. API & Integration Engineering

APIs must maintain:

- Predictable, well-documented request and response payloads.
- Strict input validation and standardized error formatting.
- Comprehensive endpoint documentation (OpenAPI/Swagger or clear Markdown specs).
- Built-in pagination, sorting, and filtering for list endpoints.
- API versioning strategies (`/api/v1/...`) when breaking changes are introduced.

**External API Integrations must gracefully handle:**
- Network timeouts and intermittent failures.
- Upstream rate limits (implement exponential backoff and retry patterns).
- Invalid, malformed, or unexpected responses.
- Circuit-breaker patterns for unstable external dependencies.

---

## 10. Security Standards

Security must be embedded into every phase of development, aligning with **OWASP Top 10** guidelines.

**Mandatory Practices:**
- Never hardcode secrets, passwords, connection strings, or private tokens.
- Never commit unencrypted API keys or private environment variables (`.env`).
- Protect against injection attacks (SQL injection, NoSQL injection, XSS, CSRF).
- Use secure cryptographic password hashing (e.g., Argon2, bcrypt).
- Enforce HTTPS across all environments in production.
- Avoid logging sensitive fields (passwords, tokens, PII, financial data).
- Apply the **Principle of Least Privilege** for database users, IAM roles, and file permissions.

*Never execute destructive terminal commands (e.g., recursive deletes, force-drops,
unauthenticated remote calls) without explicit human confirmation.*

---

## 11. Testing Standards

Every feature must include appropriate automated tests before it is marked ready.

**Required Testing Layers:**
- **Unit Testing:** Isolate and test individual functions, hooks, and utility logic.
- **Integration Testing:** Test API endpoints, database interactions, and service layers.
- **Component / UI Testing:** Verify interactive frontend component behavior.
- **End-to-End (E2E) Testing:** Validate critical user journeys (e.g., checkout,
  authentication flow, payment processing).

**Testing Rules:**
1. Test normal execution paths, invalid user input, failure states, and boundary conditions.
2. Never claim tests passed unless they were physically executed and output logs were inspected.
3. Never delete or bypass failing tests simply to manufacture a green build report. Fix the
   underlying bug or specification discrepancy.

---

## 12. Code Quality & Formatting

All code must prioritize:
- High readability, clean structure, and descriptive variable/function naming.
- Small, single-purpose functions (aim for < 30 lines per function logic).
- Strict type safety (TypeScript strict mode enabled where applicable).
- Elimination of dead code, commented-out blocks, and unused package imports.

*All code changes must adhere strictly to the project's existing ESLint, Prettier, or
language-specific linter configurations.*

---

## 13. Performance Standards

Performance metrics must be evaluated during design and implementation:
- **Database:** Prevent N+1 query problems; analyze query execution plans.
- **APIs:** Keep response overhead low; implement caching strategies (Redis) for frequent read operations.
- **Frontend:** Minimize bundle sizes, optimize asset loading, and defer non-critical scripts.
- **Memory Management:** Prevent memory leaks in long-running Node.js processes or uncleaned component subscriptions.

*Base performance assertions on real measurements rather than assumptions.*

---

## 14. Dependency Management

Before introducing any new third-party package:
1. Check if an existing package or native language feature already solves the problem.
2. Evaluate the package's maintenance health, release frequency, and community adoption.
3. Review security advisories and vulnerability records.
4. Measure bundle size and performance overhead impact.
5. Verify open-source license compatibility (MIT, Apache 2.0 preferred).

*Avoid dependency bloat. Never perform blind major-version upgrades on critical core dependencies.*

---

## 15. Version Control & Git Discipline

Follow **Conventional Commits** syntax for all commit messages:

- `feat:` for introducing a new feature.
- `fix:` for bug fixes.
- `refactor:` for code restructuring without behavior changes.
- `test:` for adding or updating test suites.
- `docs:` for documentation updates.
- `perf:` for performance optimizations.
- `chore:` for tooling, config, or maintenance tasks.

**Safety Rules:**
- Never overwrite, delete, or discard existing user changes.
- Never force-push or rewrite shared remote git history without explicit authorization.

---

## 16. Documentation Standards

Significant code additions or architecture modifications must be accompanied by documentation updates covering:
- Architecture decision records (ADRs) or rationale.
- Updated environment variable schemas (`.env.example`).
- Setup and installation procedures.
- Updated API contracts or schemas.
- Known limitations or edge cases.

*Keep documentation synchronized with actual code. Never document unimplemented features as completed.*

---

## 17. Deployment & Operations Standards

Before any production deployment:
- Execute the full test suite successfully.
- Run static analysis, linters, and type-checks with zero errors.
- Validate production environment configurations and secrets mapping.
- Verify database migration scripts.
- Confirm backup and recovery checkpoints are active.
- Perform post-deployment health checks and smoke tests.

*Production deployments require explicit human authorization.*

---

## 18. AI Agent Behavior & Guardrails

All autonomous or assisted AI agents must adhere to these behavioral rules:
1. **Inspect before modifying:** Always read existing files before editing.
2. **Plan complex changes:** Outline your approach before writing sprawling multi-file
   modifications.
3. **Preserve existing functionality:** Do not break unrelated features or regressions.
4. **Explain key trade-offs:** Clearly communicate technical decisions and architectural choices to human supervisors.
5. **Report failures honestly:** If an error occurs, a test fails, or a build breaks,
   disclose it immediately without fabrication.

*Never fabricate test outputs, fake build successes, or pretend an operation succeeded when it was unverified.*

---

## 19. Definition of Done (DoD)

A task or feature is officially complete only when:
- [ ] Requirements are fully implemented and verified.
- [ ] Automated tests are executed and passing successfully.
- [ ] Code meets project style, linter, and type-safety standards.
- [ ] Security implications have been reviewed.
- [ ] Existing core functionality remains fully preserved.
- [ ] Documentation and environment files are updated.
- [ ] Any known limitations or technical debt are explicitly reported.

*If any criterion remains unmet, the feature must be reported as incomplete.*

---

## 20. Standard of Excellence

Eazworld software is built for real businesses, communities, and production users who
depend on its reliability every single day.

Production quality is non-negotiable. Reliability, security, maintainability, and precision
must drive every single engineering decision we make.
