# Deploy Platforms

Companion to the `eaz-cloud-devops` skill. Platform comparison, provisioning examples,
and configuration notes for each supported deployment target.

## Platform selection guidance

Ask the user which platform to use — never assume. Consider:

- **Team expertise:** What does the team already know?
- **Budget:** What is the monthly infrastructure budget?
- **App type:** Frontend-heavy (Vercel/Netlify), full-stack (Fly.io/Render/Heroku),
  enterprise/complex (AWS/GCP/Azure), or data sovereignty (self-hosted)?
- **Geography:** Where are the users? Choose regions close to them.
- **Compliance:** Are there data residency requirements?

## Platform quick reference

| Platform | Primary use | Free tier | Best for |
| :--- | :--- | :--- | :--- |
| **Fly.io** | Full-stack Docker apps | Yes | Edge deployment, SaaS, global apps |
| **Render** | Web apps + workers | Yes | MVPs, simple Docker deploys |
| **Vercel** | Next.js / frontend | Yes | Frontend frameworks, serverless |
| **Netlify** | Static + serverless | Yes | JAMstack, static sites |
| **Heroku** | Web apps | Limited (paid now) | Traditional web apps, add-ons |
| **AWS** | Anything | Limited (12mo free) | Enterprise, full control |
| **GCP** | Anything | Limited (free tier) | Data-heavy, Kubernetes |
| **Azure** | Anything | Limited (free tier) | Microsoft shops, hybrid |
| **Self-hosted** | Anything | No | Full control, data sovereignty |

## Platform-specific notes

### Fly.io

- Docker-native; deploy with `fly deploy`
- Built-in Postgres and Redis add-ons
- Global edge regions; choose regions near users
- `fly.toml` for configuration
- Good for: full-stack apps, APIs, background workers

### Render

- `render.yaml` for infrastructure as code
- Web services, background workers, cron jobs
- Managed Postgres and Redis
- Automatic HTTPS with custom domains
- Good for: MVPs, simple full-stack apps, teams wanting low ops overhead

### Vercel

- Zero-config for Next.js, React, Vue, etc.
- Serverless functions (Edge and Node runtimes)
- Automatic preview deployments on PRs
- Good for: frontend-heavy sites, Next.js apps, marketing sites

### Netlify

- Static site generation + serverless functions
- Form handling, identity, split testing
- Automatic preview deployments
- Good for: JAMstack, static sites, documentation sites

### Heroku

- Buildpacks or Docker deploys
- Add-on ecosystem (Postgres, Redis, etc.)
- `heroku.yml` or `Procfile`
- Good for: traditional Rails/Node/Python apps, teams wanting simplicity

### AWS

- Services: ECS/EKS (containers), Lambda (serverless), EC2 (VMs)
- Deployment: CodePipeline, CodeDeploy, or GitHub Actions + ECS/EKS
- Highest complexity, highest flexibility
- Good for: enterprise apps, complex infrastructure needs, teams with AWS expertise

### GCP

- Services: GKE (Kubernetes), Cloud Run (containers), Cloud Functions (serverless)
- Deployment: Cloud Build or GitHub Actions + GKE/Cloud Run
- Strong data and analytics integration
- Good for: data-heavy apps, ML workloads, GKE users

### Azure

- Services: AKS (Kubernetes), App Service (web apps), Functions (serverless)
- Strong Active Directory integration
- Good for: enterprise Microsoft shops, hybrid cloud scenarios

### Self-hosted

- Full control over hardware and network
- Highest operational overhead (patching, backups, monitoring)
- Data sovereignty and compliance
- Good for: regulated industries, existing hardware investments

## Example — `fly.toml`

```toml
app = "myapp"
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8080"

[experimental]
  auto_rollback = true

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.checks]]
    type = "http"
    path = "/health"
    interval = 10s
    timeout = 2s
```

## Example — `render.yaml`

```yaml
services:
  - type: web
    name: myapp
    env: docker
    region: ohio
    plan: starter
    dockerContext: .
    dockerfilePath: Dockerfile
    envVars:
      - key: NODE_ENV
        value: production
    healthCheckPath: /health
    autoDeploy: false
```
