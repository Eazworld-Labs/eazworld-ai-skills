# Eazworld Security Policy
**Version:** 1.0.0  
**Owner:** Eazworld  
**Status:** Foundational Security Standard (Production-Grade Enhanced)  
**Applies To:** All AI Agents, Skills, Human Contributors, and Eazworld Projects  

---

## 1. Purpose

This policy establishes mandatory security requirements for the design, development, operation, maintenance, and deployment of all Eazworld software systems, databases, APIs, and AI agent skills.

Its primary objective is to protect:
* **Business Infrastructure:** Production servers, cloud accounts, container registries, and internal networks.
* **Customer Information:** Personally Identifiable Information (PII), credentials, and customer data.
* **Application Data:** Core database records, transactional histories, and business logic.
* **Authentication Credentials:** Passwords, private keys, API secrets, and access tokens.
* **Financial Transactions:** Paystack keys, Mobile Money (MoMo) callbacks, bank webhooks, and ledger entries.
* **Internal Systems:** Internal tools, communication webhooks, and CI/CD pipelines.
* **Third-Party Integrations:** External APIs, cloud services, and messaging gateways.
* **Production Environments:** Staging, production, and live client deployments.

Security is not an afterthought. It must be embedded into every stage of the Software Development Lifecycle (SDLC) and enforced continuously by both human contributors and AI coding agents.

---

## 2. Core Security Principles

All Eazworld projects and AI skills must strictly adhere to these eight core principles:

1. **Least Privilege:** Grant users, service accounts, database roles, and AI agents only the minimum permissions required to perform their explicit function.
2. **Defense in Depth:** Implement multiple layered, independent security controls so that the failure of one layer does not compromise the system.
3. **Secure by Default:** Default configurations must always take the most restrictive, secure posture (e.g., closed ports, HTTPS enforcement, strict CORS).
4. **Data Minimization:** Collect, process, and retain only the data strictly necessary for business operations.
5. **Zero Trust Architecture:** Never trust internal or external entities by default. Continuously verify identities, token signatures, session boundaries, and incoming payloads.
6. **Fail Securely:** When an application encounters an error, it must fail safely without leaking sensitive information, stack traces, or bypassing access controls.
7. **Accountability & Observability:** All security-sensitive actions (authentication attempts, privilege escalations, financial transactions) must be auditable via structured, immutable logs.
8. **Mandatory Human Oversight:** High-impact operations (production deployments, database drops, force git updates, payment secret rotations) strictly require human authorization.

---

## 3. Secret and Credential Management

Absolute Zero-Hardcoding Rule: Credentials, tokens, private keys, or passwords must **never** be hardcoded into source code, committed to version control (Git), or exposed in agent system prompts.

### Sensitive Values Include:
* API keys and bearer tokens.
* Database connection strings and passwords.
* JWT signing secrets and private asymmetric keys.
* OAuth client credentials and refresh tokens.
* Cloud provider credentials (AWS IAM keys, Cloudflare API tokens).
* Payment gateway secret keys (Paystack, Hubtel).
* SMTP / email service credentials.
* Webhook signing secrets.

### Mandatory Secret Requirements:
* Store all runtime secrets in isolated environment variables or approved vault management systems.
* Maintain a clean `.env.example` in repository roots containing **placeholder values only**.
* Add `.env`, `.env.local`, `.env.production`, and credential files to `.gitignore`.
* Never output or record secret values in console logs, screenshots, documentation, error reports, or AI agent context windows.
* Immediately revoke and rotate any credential suspected of exposure or leakage.
* Enforce isolated, distinct credential sets across **Development**, **Staging**, and **Production** environments.

```bash
# Correct .env.example format (Placeholders ONLY)
MONGODB_URI=YOUR_DATABASE_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_VALUE
PAYSTACK_SECRET_KEY=YOUR_SECRET_VALUE
HUBTEL_CLIENT_SECRET=YOUR_SECRET_VALU

4. Authentication and Authorization
4.1 Authentication Requirements
Use industry-standard, secure password hashing algorithms (e.g., Argon2id or bcrypt with appropriate cost factors). Plaintext passwords are strictly banned.

Enforce secure session or token management using short-lived JWTs paired with secure refresh tokens or encrypted server-side sessions.

Enforce HTTPS-only, HttpOnly, SameSite=Strict, and Secure cookie attributes for web session tokens.

Implement strict rate-limiting on sensitive endpoints (login, password reset, OTP verification) to neutralize brute-force attacks.

Design authentication failure responses to prevent user enumeration (e.g., return "Invalid email or password" rather than "User not found").

4.2 Authorization Requirements
Enforce server-side authorization checks on every single request. Never rely on client-side routing, hidden UI buttons, or frontend guards for security.

Implement robust Role-Based Access Control (RBAC) or Attribute-Based Access Control (ABAC).

Verify resource ownership on every transaction (e.g., ensure User A cannot view or edit User B's order by changing an ID in the URL parameter).

Protect against privilege escalation vulnerabilities across user tiers and administrative portals.

5. Application Security & Vulnerability Defense
All application implementations must guard against the OWASP Top 10 web application vulnerabilities:

Injection Defense: Use parameterized queries, Object-Relational Mappers (ORMs), or Object-Document Mappers (ODMs like Mongoose). Never concatenate raw input into SQL, NoSQL, or shell command strings.

XSS (Cross-Site Scripting): Sanitize and encode all untrusted output rendered in the browser. Enforce a strong Content Security Policy (CSP).

CSRF (Cross-Site Request Forgery): Utilize anti-CSRF tokens or SameSite cookie policies for state-changing HTTP requests.

Input Validation & Sanitization: Validate all incoming HTTP request bodies, path parameters, query strings, and headers using strict schemas (e.g., Zod, Joi). Reject unexpected parameters.

Security Headers: Enforce security headers across all responses (Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy).

CORS Policy: Restrict Cross-Origin Resource Sharing (CORS) to explicitly trusted, explicitly defined origin domains in production (Access-Control-Allow-Origin). Banish * in production environments.

Information Leakage Prevention: Catch global errors gracefully. Never expose framework stack traces, internal database details, or server directory structures in HTTP error responses.

6. Database Security
Databases represent core business assets and must be protected against unauthorized extraction, modification, and accidental destruction.

Requirements:
Restrict database network listeners to localhost or private VPC networks. Block public internet access to database ports (5432, 27017, 6379).

Require strong authentication credentials for all database connections.

Assign least-privilege roles to application database users (e.g., the web backend should not connect using database admin/root credentials).

Enforce encrypted connections in transit (TLS/SSL) between backend application instances and database servers.

Store sensitive columns/fields (such as national IDs, financial accounts, or tokens) using field-level encryption or hashing where required.

Maintain automated, point-in-time database backups. Regularly test and document backup restoration procedures.

Destructive Command Control: Database schema migrations, drops, or truncate operations strictly require tested migration scripts, a full recovery backup, and maintainer authorization.

7. API and Integration Security
All internal and external APIs must treat every incoming payload as potentially malicious.

Requirements:
Authenticate every non-public API endpoint using valid tokens or API keys.

Apply strict rate limiting per IP or authenticated user ID to prevent denial-of-service (DoS) attacks and resource depletion.

Verify incoming webhook authenticity by validating cryptographic signatures (e.g., Paystack x-paystack-signature HMAC SHA512 header) before processing payload data.

Enforce explicit request timeouts on all external API requests to prevent thread starvation.

Wrap external integrations in defensive error boundaries; gracefully handle upstream downtime, bad HTTP responses, and unexpected timeouts.

Encrypt all API communications using HTTPS (TLS 1.2/1.3). Banish unencrypted HTTP calls in staging and production.

8. Payment and Financial Security
Applications handling digital payments, mobile money (MTN MoMo, Telecel Cash, AT Money), Paystack, or credit card transactions must adhere to strict financial security controls:

Requirements:
Secret Key Isolation: Never expose secret payment keys (PAYSTACK_SECRET_KEY) to client-side applications or public repositories.

Server-Side Verification: Always verify transaction status directly via backend-to-backend API calls or signed webhooks before updating user balances, processing orders, or granting access. Never trust client-side transaction callbacks alone.

Idempotency: Enforce idempotency checks using unique transaction references (tx_ref) to prevent duplicate billing or double-fulfillment caused by retried webhooks.

PCI-DSS Compliance: Never collect, handle, log, or store raw credit card numbers, CVVs, or sensitive authentication data on Eazworld servers. Delegate card capture entirely to PCI-compliant provider gateways via secure widgets or hosted checkout fields.

Audit Trail: Maintain immutable, server-side transaction logs recording timestamps, references, masked account identifiers, and payment statuses for accounting reconciliation.

9. AI Agent Security & Guardrails
When AI coding agents (Claude Code, OpenCode) operate within Eazworld projects:

Zero Autonomy for Destructive Commands: AI agents are strictly prohibited from autonomously executing terminal commands that delete files (rm -rf), modify git commit history (git push --force), alter database schemas, or deploy code to production without explicit human review and confirmation.

Context Leak Prevention: AI agents must never capture, upload, transmit, or embed live API keys, database connection strings, or customer data into system prompts, context files, or generated code samples.

Automated Package Auditing: AI agents recommending or installing new third-party dependencies (npm install, pip install) must inspect the package for known vulnerabilities (npm audit) and license compatibility prior to installation.

Code Quality Gates: AI-generated code must be inspected for injection vulnerabilities, hardcoded values, and missing input validation before being merged into project codebases.

10. Incident Management and Vulnerability Reporting
If a security vulnerability, credential leak, or breach is discovered:

Immediate Containment: Revoke exposed credentials, isolate affected services, or disable vulnerable endpoints immediately.

Notification: Report the incident directly to the designated Eazworld Maintainer / Security Lead.

Assessment: Analyze the breach root cause, extent of data exposure, and impacted systems.

Remediation & Patching: Develop, test, and deploy a secure patch following standard quality gates.

Post-Mortem: Conduct a post-incident review to document lessons learned and update relevant engineering standards or security guidelines.

11. Enforcement and Compliance
Compliance with this Security Policy is mandatory for all Eazworld maintainers, staff, open-source contributors, and AI agents.

Any pull request or skill submission that violates this policy (e.g., hardcoded secrets, missing input sanitization, unsafe payment callbacks) will be rejected.

Security exceptions require a documented risk assessment and formal approval from the Eazworld Maintainer.

Maintained by: Eazworld

Document: Security Policy

Version: 1.0.0

License: MIT