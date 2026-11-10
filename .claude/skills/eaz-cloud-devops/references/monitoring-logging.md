# Monitoring & Logging

Companion to the `eaz-cloud-devops` skill. Health checks, log aggregation, alerting,
uptime monitoring, and distributed tracing.

## Health checks

Every service exposes a health check endpoint. The pipeline verifies it after every
deploy; the platform uses it for load balancer decisions.

### Example — `/health` endpoint

```js
// Express example
app.get('/health', async (req, res) => {
  const dbHealthy = await db.query('SELECT 1');
  const checks = {
    status: dbHealthy ? 'ok' : 'degraded',
    checks: {
      database: dbHealthy ? 'ok' : 'fail',
      timestamp: new Date().toISOString(),
    },
  };
  res.status(dbHealthy ? 200 : 503).json(checks);
});
```

### Health check rules

- Return `200 OK` when healthy, `503 Service Unavailable` when not
- Include dependency checks (database, cache, external APIs)
- Keep it fast (< 1 second) — load balancers call it frequently
- Do not include sensitive information in the response
- The platform's load balancer should use this endpoint for traffic routing

## Log aggregation

Ship logs to a central system. Do not rely on `docker logs` or `kubectl logs` in
production — they don't survive container restarts or node failures.

| Option | Best for | Notes |
| :--- | :--- | :--- |
| **Platform logs** (Fly.io, Render, Heroku) | Simple setups | Built-in, limited retention |
| **AWS CloudWatch** | AWS deployments | Integrates with ECS/EKS/Lambda |
| **GCP Logging** | GCP deployments | Integrates with GKE/Cloud Run |
| **Datadog** | Multi-platform, APM | Strong dashboards, alerting |
| **ELK stack** (Elasticsearch, Logstash, Kibana) | Self-hosted, full control | High operational overhead |
| **Loki + Grafana** | Kubernetes, Grafana users | Cost-effective, integrates with Grafana |

### Structured logging

Log JSON, not plain text:

```js
// Bad
console.log('User logged in:', userId);

// Good
console.log(JSON.stringify({
  event: 'user_login',
  userId,
  timestamp: new Date().toISOString(),
  requestId,
  ip: req.ip,
}));
```

### What to log

- Request start/end with status code and duration
- Errors with stack traces
- Business events (signups, purchases, errors)
- Security events (failed logins, permission denials)
- Infrastructure events (deploys, migrations, scaling)

### What NOT to log

- Passwords, tokens, API keys, secrets
- Credit card numbers, PII, health data
- Full request bodies containing sensitive fields

## Alerting

Alert on conditions that require human action:

| Alert | Severity | Route to |
| :--- | :--- | :--- |
| Deploy failure | Critical | On-call engineer, team channel |
| Error rate > 5% | Critical | On-call engineer |
| Latency p99 > 2s | Warning | Team channel |
| Memory > 85% | Warning | On-call engineer |
| Disk > 85% | Warning | On-call engineer |
| SSL cert expiring < 7 days | Warning | Team channel |
| Health check failing | Critical | On-call engineer |

### Alert rules

- **Actionable:** Every alert should require a specific action
- **Not flaky:** Don't alert on transient blips; use sustained thresholds (e.g., 5 min)
- **Routed:** Know who receives each alert before it fires
- **Escalation:** If unacknowledged in 15 min, escalate to manager

## Uptime monitoring

Synthetic pings from outside the infrastructure to catch issues internal monitors miss:

- DNS resolution
- SSL certificate validity
- HTTP status codes on key pages
- Time to first byte
- Content verification (expected text present)

### Tools

- UptimeRobot, Pingdom, Statuscake, or platform-native uptime checks
- Check from multiple geographic regions
- Check every 1–5 minutes

## Distributed tracing

For microservices, trace requests across service boundaries:

- **AWS X-Ray** (AWS)
- **Google Cloud Trace** (GCP)
- **Datadog APM** (multi-platform)
- **Jaeger** (self-hosted, open source)
- **OpenTelemetry** (vendor-neutral instrumentation)

Trace IDs should propagate through request headers so you can follow a request from
edge to database and back.

## Example — alerting rule (Prometheus style)

```yaml
groups:
  - name: myapp-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.instance }}"
          description: "Error rate is {{ $value }} over the last 5 minutes."
      - alert: DeployFailed
        expr: deploy_success == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Deploy failed on {{ $labels.instance }}"
```
