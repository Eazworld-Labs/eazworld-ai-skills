---
name: eaz-cloud-devops
description: Set up deployment, CI/CD, and infrastructure for applications. Use when
  configuring GitHub Actions workflows, Dockerizing services, managing environments and
  secrets, planning rollbacks, adding health checks and monitoring, or hardening the
  delivery pipeline.
license: MIT
metadata:
  author: Eazworld
  department: software-engineering
  version: "1.2.0"
---

# Cloud DevOps

## 1. Overview & Purpose

Owns the path from committed code to a running, observable service: continuous
integration, environments, deployments, health checks, monitoring, and rollback. Ships
pipelines that are safe by default — least-privilege permissions, secrets outside the
repository, pinned dependencies, and a tested way back when a release goes wrong.

Supports deployment to platform-as-a-service (Fly.io, Render, Vercel, Netlify, Heroku)
and infrastructure-as-code targets (AWS, GCP, Azure, or self-hosted), with deployment
strategies (blue-green, canary, rolling), container registry management, database
migration handling, log aggregation, monitoring, alerting, and cost optimization.

## 2. Activation Conditions & Triggers

- **Trigger 1:** When a user asks to set up or modify CI/CD, GitHub Actions, or a build
  pipeline.
- **Trigger 2:** When containerizing a service with Docker or configuring a deployment
  target.
- **Trigger 3:** When managing environments, deployment secrets, health checks,
  monitoring, or alerting.
- **Trigger 4:** When designing a rollback strategy or hardening an existing delivery
  pipeline.
- **Trigger 5:** When choosing a deploy platform (Fly.io, Render, Vercel, Netlify,
  Heroku, AWS, GCP, Azure, or self-hosted).
- **Trigger 6:** When defining a deployment strategy (blue-green, canary, rolling).
- **Trigger 7:** When configuring container registry, image tagging, or image promotion.
- **Trigger 8:** When adding database migrations to the deployment pipeline.
- **Trigger 9:** When setting up log aggregation, monitoring, or alerting.
- **Trigger 10:** When optimizing cloud infrastructure costs.
- **Anti-Trigger:** Do not activate for writing application features (route to the
  implementation skills) or for application-level performance work (route to
  eaz-frontend-design/references/performance-optimization.md).

## 3. Required Inputs & Project Audit

- **Mandatory Inputs:**
  1. The deployment target platform and the environments required (preview, staging,
     production).
  2. The deployment strategy: blue-green, canary, rolling, or direct.
  3. The inventory of secret names the service needs — names only, never values.
  4. Uptime expectations and who gets alerted, and when.
  5. The container registry and image tagging approach.
  6. Database migration tooling and how migrations run relative to deploys.
- **Codebase Audit Checklist:**
  1. Read existing workflow files and their permission blocks before adding new ones.
  2. Inspect the `Dockerfile` or build configuration for reproducibility.
  3. Review `.env.example` and deployment docs to map required environment variables.
  4. Check branch protection and required checks so the pipeline actually gates merges.
  5. Look for existing container images, registries, or infrastructure-as-code files.

## 4. Technical Standards & Rules

- At launch (phase 6), write `RUNBOOK.md` from the
  [Runbook Template](./references/runbook-template.md): service map, deploy, rollback,
  backups and restore, secret rotation, common problems, incident response, and routine
  maintenance. Write it from the setup that actually exists, and update it whenever the
  operating setup changes. Production deploys, rollbacks, and restores need explicit human
  confirmation.
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

### Deploy platforms

Choose the platform based on the project's needs, team expertise, and budget. Do not
assume a platform without asking.

| Platform | Best for | Notes |
| :--- | :--- | :--- |
| **Fly.io** | Full-stack apps needing edge deployment, Docker-native | Global edge, built-in Postgres/Redis, good for SaaS |
| **Render** | Web apps, background workers, simple Docker deploys | Easy setup, free tier available, good for MVPs |
| **Vercel** | Frontend-heavy sites, Next.js, serverless functions | Excellent DX for frontend frameworks, edge functions |
| **Netlify** | Static sites, frontend frameworks, serverless functions | Great for JAMstack, form handling, edge functions |
| **Heroku** | Traditional web apps, easy Docker or buildpack deploys | Mature, add-on ecosystem, higher cost at scale |
| **AWS** | Enterprise, complex infrastructure, full control | EC2, ECS, EKS, Lambda; steeper learning curve |
| **GCP** | Data-heavy apps, Kubernetes, AI/ML workloads | GKE, Cloud Run, strong data and analytics |
| **Azure** | Enterprise Microsoft shops, hybrid cloud | AKS, App Service, strong AD integration |
| **Self-hosted** | Full control, data sovereignty, existing hardware | Most operational overhead, highest flexibility |

### Deployment strategies

| Strategy | Description | Best for | Trade-off |
| :--- | :--- | :--- | :--- |
| **Rolling** | Replace instances gradually, old and new coexist | Most web apps, stateless services | Brief mixed-version period |
| **Blue-green** | Switch all traffic at once between two identical environments | Critical apps needing instant rollback | Double infrastructure cost during switch |
| **Canary** | Route small % of traffic to new version, ramp up | High-traffic apps, risk-averse releases | More complex routing, slower rollout |
| **Direct** | Single deploy replacing the previous version | Internal tools, low-risk apps, MVPs | No zero-downtime guarantee |

- **Default:** rolling for stateless web apps; blue-green for critical apps where instant
  rollback matters more than cost.
- **Never** deploy directly to production without a tested rollback path.
- **Never** skip health checks — a deploy that fails its health check triggers rollback.

### Container registry

- Push built images to a container registry (GitHub Container Registry, Docker Hub,
  AWS ECR, GCP Artifact Registry, or the platform's built-in registry).
- Tag images with the commit SHA, not just `latest`.
- Pin base images to exact digests (`node:20.11.0@sha256:...`).
- Scan images for vulnerabilities before deployment.
- Do not store secrets in image layers; inject them at runtime via environment variables.

### Database migrations

- Run migrations as a separate pipeline step before the deploy, never as part of the app
  startup.
- Migrations must be backward-compatible — the current running version must work with
  the migrated schema.
- Run migrations in a transaction where the database supports it.
- Have a rollback migration ready for every forward migration.
- Never drop columns or tables in the same deploy that removes code referencing them;
  deprecate first, remove later.
- Test migrations on a copy of production data before running on production.

### Monitoring, logging, and alerting

- **Health checks:** Every service exposes a `/health` or equivalent endpoint; the
  pipeline verifies it after every deploy.
- **Log aggregation:** Ship logs to a central system (platform logs, CloudWatch, GCP
  Logging, Datadog, or ELK). Do not rely on `docker logs` in production.
- **Alerting:** Alert on high error rate, elevated latency, high memory/CPU, and failed
  deploys. Route alerts to the on-call person or team channel.
- **Uptime monitoring:** Synthetic pings from outside the infrastructure to catch
  DNS, SSL, and network issues internal monitors miss.
- **Distributed tracing:** For microservices, trace requests across service boundaries.

### Cost optimization

- Treat cost as a design constraint, not an afterthought.
- Right-size instances; don't over-provision for headroom that isn't used.
- Use spot/preemptible instances for stateless, interruptible workloads.
- Shut down or scale to zero for preview environments outside business hours.
- Review cloud bills monthly; identify unused or orphaned resources (load balancers,
  IPs, volumes, snapshots).
- Set budget alerts at 50%, 80%, and 100% of monthly target.
- Prefer managed services over self-hosting when engineering time is more expensive than
  the service fee.

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

1. **Step 1: Parse Task** — Restate the target platform, environments, deployment
   strategy, and what "working deployment" means for this service.
2. **Step 2: Inspect Context** — Execute the audit checklist; describe the pipeline as
   it exists before proposing changes. Identify existing containers, registries, or
   infrastructure-as-code files.
3. **Step 3: Formulate Plan** — Lay out the stages: build, test, publish, deploy,
   verify — plus the rollback path, migration strategy, and who approves production.
   Choose the platform and deployment strategy with the user, never assume.
4. **Step 4: Verify Security** — Confirm least-privilege permissions, pinned action
   versions, and that no secret will enter the diff or the logs.
5. **Step 5: Apply Edits** — Implement the workflow, container, or configuration in
   small commits, one concern each.
6. **Step 6: Execute Tests** — Run the pipeline on a branch, verify the health check
   after deploy, run a migration on a copy of production data, and deliberately fail a
   step to prove the gate actually blocks.
7. **Step 7: Report Status** — Report the pipeline stages, verification evidence, the
   rollback procedure, platform costs, and any remaining gaps.

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
- [ ] `RUNBOOK.md` written from the template and checked against the real setup by someone
      other than its author.
- [ ] Workflow permissions read-only by default; actions pinned to exact versions.
- [ ] No secrets in the repository, workflow files, images, or logs.
- [ ] Monitoring or alerting in place so failures are visible without reading logs.
- [ ] Platform and deployment strategy chosen with the user, not assumed.
- [ ] Images tagged with commit SHA and pushed to a container registry.
- [ ] Database migrations tested on a copy of production data before production deploy.
- [ ] Health check endpoint verified after every deploy.
- [ ] Cost budget and alerts configured for the chosen platform.

## 8. Supporting References & Assets

- [Runbook Template](./references/runbook-template.md) — the project-root `RUNBOOK.md`
  skeleton for launch and operations.
- [Deploy Platforms](./references/deploy-platforms.md) — platform comparison, provisioning
  examples, and configuration notes for Fly.io, Render, Vercel, Netlify, Heroku, AWS,
  GCP, Azure, and self-hosted.
- [Deployment Strategies](./references/deployment-strategies.md) — rolling, blue-green,
  canary, and direct deployment guidance with examples.
- [Container Registry](./references/container-registry.md) — image tagging, registry
  selection, base image pinning, and vulnerability scanning.
- [Database Migrations](./references/database-migrations.md) — backward-compatible
  migrations, rollback migrations, and pipeline ordering.
- [Monitoring & Logging](./references/monitoring-logging.md) — health checks, log
  aggregation, alerting, uptime monitoring, and distributed tracing.
- [Cost Optimization](./references/cost-optimization.md) — right-sizing, spot instances,
  preview environment scheduling, budget alerts, and bill review.
- No supporting files — each provider's official API and webhook documentation is the
  reference at implementation time.
