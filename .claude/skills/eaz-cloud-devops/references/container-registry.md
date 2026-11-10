# Container Registry

Companion to the `eaz-cloud-devops` skill. Image tagging, registry selection, base image
pinning, and vulnerability scanning.

## Container registry selection

Choose a registry based on your platform and team:

| Registry | Best for | Notes |
| :--- | :--- | :--- |
| **GitHub Container Registry (ghcr.io)** | GitHub-centric teams | Integrated with GitHub Actions, free for public repos |
| **Docker Hub** | General purpose | Most familiar, rate limits on free tier |
| **AWS ECR** | AWS deployments | Integrates with ECS/EKS, IAM-based auth |
| **GCP Artifact Registry** | GCP deployments | Supports multiple formats, regional |
| **Azure Container Registry** | Azure deployments | Integrates with AKS/App Service |
| **Platform registry** (Fly.io, Render, etc.) | Platform-native deploys | Simplest for platform-specific deployments |

## Image tagging strategy

Never use `latest` as the only tag in production. Use multiple tags:

| Tag | Purpose | Example |
| :--- | :--- | :--- |
| **Commit SHA** | Immutable, traceable | `myapp:a1b2c3d` |
| **Semver** | Release versioning | `myapp:1.4.0` |
| **Environment** | Deployment target | `myapp:staging` |
| **Latest** | Convenience only, not production | `myapp:latest` |

### Example — tag and push

```bash
# Build with multiple tags
docker build -t ghcr.io/org/myapp:$(git rev-parse --short HEAD) \
             -t ghcr.io/org/myapp:latest \
             .

# Push all tags
docker push ghcr.io/org/myapp:$(git rev-parse --short HEAD)
docker push ghcr.io/org/myapp:latest

# Deploy using the SHA tag (immutable)
fly deploy --image ghcr.io/org/myapp:a1b2c3d
```

## Base image pinning

Pin base images to exact digests, not floating tags:

```dockerfile
# Bad - floating tag can change underneath you
FROM node:20

# Good - pinned digest
FROM node:20.11.0@sha256:abcd1234...
```

Update base images through a reviewed change, not silent drift.

## Vulnerability scanning

Scan images before deployment:

- **Trivy:** `trivy image ghcr.io/org/myapp:a1b2c3d`
- **Snyk:** `snyk container test ghcr.io/org/myapp:a1b2c3d`
- **GitHub Dependabot:** Automated PRs for vulnerable base images

Fail the pipeline if critical vulnerabilities are found.

## Multi-architecture images

Build for both `amd64` and `arm64` if deploying to mixed infrastructure (e.g., Apple
Silicon Macs for development, x86_64 for production):

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/org/myapp:$(git rev-parse --short HEAD) \
  --push .
```

## Image size optimization

- Use multi-stage builds to exclude build tools from the final image
- Use distroless or alpine base images where appropriate
- `.dockerignore` to exclude `node_modules`, `.git`, test files, and secrets
- Combine `RUN` commands to reduce layers

### Example — multi-stage Dockerfile

```dockerfile
# Build stage
FROM node:20.11.0@sha256:abcd1234 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Run stage - distroless, minimal
FROM gcr.io/distroless/nodejs:20
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
CMD ["dist/server.js"]
```
