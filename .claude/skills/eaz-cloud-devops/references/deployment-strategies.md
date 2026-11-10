# Deployment Strategies

Companion to the `eaz-cloud-devops` skill. Rolling, blue-green, canary, and direct
deployment guidance with examples and when to use each.

## Choosing a strategy

Ask the user which strategy fits their needs — never assume. Consider:

- **Downtime tolerance:** Can the app be unavailable for minutes? (rolling/direct) Or
  must it be zero-downtime? (blue-green/canary)
- **Traffic volume:** High-traffic apps benefit from canary; low-traffic can use rolling.
- **Infrastructure budget:** Blue-green doubles cost during switch; rolling and canary
  don't.
- **Rollback needs:** How fast must you recover from a bad deploy? Blue-green is fastest.
- **Risk tolerance:** Canary limits blast radius; rolling has brief mixed versions.

## Strategy comparison

| Strategy | Zero downtime | Instant rollback | Infrastructure cost | Complexity | Best for |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Direct** | No | No | 1× | Low | Internal tools, MVPs |
| **Rolling** | Yes | Minutes | 1× | Low–Medium | Most web apps, stateless |
| **Blue-green** | Yes | Seconds | 2× during switch | Medium | Critical apps, e-commerce |
| **Canary** | Yes | Minutes | 1× | High | High-traffic, risk-averse |

## Rolling deployment

Replace instances gradually. Old and new versions coexist briefly.

### How it works

1. Start new version instances alongside old ones
2. Route new traffic to new instances
3. Terminate old instances one by one
4. Monitor health checks throughout

### Example — GitHub Actions with rolling deploy

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        run: |
          fly deploy --strategy rolling
```

## Blue-green deployment

Maintain two identical environments (blue = current, green = new). Switch all traffic
at once.

### How it works

1. Deploy new version to green environment
2. Run health checks on green
3. Switch traffic from blue to green (DNS, load balancer, or feature flag)
4. Keep blue running as fallback; decommission after confidence period

### When to use

- Critical applications where instant rollback matters
- E-commerce during sales events
- When you can afford double infrastructure temporarily

### Rollback

Switch DNS/load balancer back to blue. Seconds, not minutes.

## Canary deployment

Route a small percentage of traffic to the new version, then ramp up if healthy.

### How it works

1. Deploy new version to a small subset (e.g., 5% of traffic)
2. Monitor error rate, latency, and business metrics
3. If healthy, increase to 25%, then 50%, then 100%
4. If unhealthy, roll back to 0% for the new version

### When to use

- High-traffic applications
- Risk-averse releases
- When you want to validate with real users before full rollout

### Example — Canary with Fly.io

```toml
# fly.toml with canary scaling
[deploy]
  strategy = "canary"
  canary_percentage = 10
```

## Direct deployment

Single deploy replacing the previous version. Simplest but no zero-downtime guarantee.

### When to use

- Internal tools and dashboards
- MVPs and early-stage products
- Low-traffic or non-critical apps
- Batch jobs and workers

### Risk mitigation

- Always test on staging first
- Keep the previous image tagged and available for quick rollback
- Notify users before deploying during business hours

## Rollback procedures

Every strategy needs a tested rollback path:

1. **Identify the problem:** Health check failures, error rate spike, latency increase
2. **Decide rollback vs fix-forward:** Roll back if the issue is severe; fix-forward
   only if the fix is quicker and safer than rollback
3. **Execute rollback:** Switch traffic back, revert infrastructure, or redeploy previous
   version
4. **Verify:** Confirm health checks pass and error rate returns to baseline
5. **Post-mortem:** Document what went wrong and how to prevent recurrence
