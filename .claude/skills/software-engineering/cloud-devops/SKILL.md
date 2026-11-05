---
name: cloud-devops
description: Set up deployment, CI/CD, and infrastructure for applications. Use when
  configuring GitHub Actions workflows, Dockerizing services, managing environments and
  secrets, planning rollbacks, adding health checks and monitoring, or hardening the
  delivery pipeline.
license: MIT
metadata:
  author: Eazworld
  version: "1.0.0"
---

# Cloud DevOps

## 1. Overview & Purpose

Owns the path from committed code to a running, observable service: continuous
integration, environments, deployments, health checks, monitoring, and rollback. Ships
pipelines that are safe by default — least-privilege permissions, secrets outside the
repository, pinned dependencies, and a tested way back when a release goes wrong.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to set up or modify CI/CD, GitHub Actions, or a build
  pipeline.
- **Trigger 2:** When containerizing a service with Docker or configuring a deployment
  target.
- **Trigger 3:** When managing environments, deployment secrets, health checks,
  monitoring, or alerting.
- **Trigger 4:** When designing a rollback strategy or hardening an existing delivery
  pipeline.
- **Anti-Trigger:** Do not activate for writing application features (route to the
  implementation skills) or for application-level performance work (route to
  performance-optimization).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The deployment target platform and the environments required (preview, staging,
     production).
  2. The inventory of secret names the service needs — names only, never values.
  3. Uptime expectations and who gets alerted, and when.
- **Codebase Audit Checklist:**
  1. Read existing workflow files and their permission blocks before adding new ones.
  2. Inspect the `Dockerfile` or build configuration for reproducibility.
  3. Review `.env.example` and deployment docs to map required environment variables.
  4. Check branch protection and required checks so the pipeline actually gates merges.

## 4. Technical Standards & Rules

- CI runs lint and tests before any merge; the pipeline is the gate, not a suggestion.
- Workflow permissions are least-privilege — read-only by default, write only where a
  step genuinely requires it.
- Third-party actions are pinned to exact versions; floating tags are a supply-chain
  risk.
- Secrets live in the platform's secret store — never in the repository, workflow files,
  images, or logs.
- Build once and promote the same artifact through environments; rebuilding per
  environment produces different binaries under the same version number.
- Every service exposes a health check endpoint, and every deploy has a documented
  rollback path that has been exercised at least once.
- Infrastructure that matters is defined as code so environments are reproducible, and
  cost is treated as a design constraint.

Example of a least-privilege pull-request workflow:

```yaml
on: [pull_request]
permissions:
  contents: read # write only where a step genuinely requires it
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4.2.2 # pin exact versions, never @v4
      - run: npm ci && npm test
```

## 5. Execution Workflow (Step-by-Step)

1. **Step 1: Parse Task** — Restate the target platform, environments, and what "working
   deployment" means for this service.
2. **Step 2: Inspect Context** — Execute the audit checklist; describe the pipeline as
   it exists before proposing changes.
3. **Step 3: Formulate Plan** — Lay out the stages: build, test, publish, deploy,
   verify — plus the rollback path and who approves production.
4. **Step 4: Verify Security** — Confirm least-privilege permissions, pinned action
   versions, and that no secret will enter the diff or the logs.
5. **Step 5: Apply Edits** — Implement the workflow, container, or configuration in
   small commits, one concern each.
6. **Step 6: Execute Tests** — Run the pipeline on a branch, verify the health check
   after deploy, and deliberately fail a step to prove the gate actually blocks.
7. **Step 7: Report Status** — Report the pipeline stages, verification evidence, the
   rollback procedure, and any remaining gaps.

## 6. Security & Edge Case Guidelines

- **Least Privilege:** CI tokens carry the minimum scope needed; no workflow runs with
  repository-wide write access because it was convenient once.
- **Secret Hygiene:** Secrets are masked in logs, rotated on a schedule, and stored per
  environment — preview never inherits production credentials.
- **Pinned Supply Chain:** Actions and base images are pinned to versions or digests;
  updates happen through reviewed changes, not silent drift.
- **Protected Deploys:** Production deploys originate only from the protected branch after
  required checks pass.
- **Destructive Operations:** Database resets, environment teardowns, and data migrations
  in a pipeline require explicit human confirmation — automated jobs never run them on
  production without approval.
- **Failure Modes:** A failed deploy leaves the previous version running; a failed health
  check triggers rollback, not hope.

## 7. Definition of Done & Quality Gates

- [ ] Pipeline runs lint and tests on every pull request and blocks on failure.
- [ ] Deploy succeeds and the health check endpoint reports healthy afterward.
- [ ] Rollback path documented and exercised at least once.
- [ ] Workflow permissions read-only by default; actions pinned to exact versions.
- [ ] No secrets in the repository, workflow files, images, or logs.
- [ ] Monitoring or alerting in place so failures are visible without reading logs.

## 8. Supporting References & Assets

- No supporting files — this skill is self-contained; the target platform's documentation
  is the reference at implementation time.
