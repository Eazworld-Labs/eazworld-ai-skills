# Cost Optimization

Companion to the `eaz-cloud-devops` skill. Right-sizing, spot instances, preview
environment scheduling, budget alerts, and bill review.

## Cost as a design constraint

Treat cloud cost like performance or security — review it regularly, not after the bill
surprises you.

## Right-sizing

Don't over-provision for headroom you don't use:

| Resource | Right-sizing guidance |
| :--- | :--- |
| **CPU** | Match actual usage; burstable instances for spiky workloads |
| **Memory** | Match actual usage; don't over-allocate "just in case" |
| **Storage** | Use appropriate tier (SSD vs HDD, standard vs premium) |
| **Bandwidth** | Watch data transfer costs between regions and to internet |

### Review cadence

- **Weekly:** Check CPU/memory utilization; downsize idle resources
- **Monthly:** Review the full bill; identify unused resources
- **Quarterly:** Re-evaluate instance types and reserved capacity

## Spot / preemptible instances

Use for stateless, interruptible workloads:

- Batch jobs
- CI workers
- Preview environments
- Non-critical background workers

**Not for:** Databases, primary application servers, anything requiring persistent state.

## Preview environment scheduling

Preview environments (from PRs) should not run 24/7:

- **Scale to zero** when not in use
- **Auto-delete** after PR is merged or closed (e.g., after 7 days)
- **Schedule shutdown** outside business hours (e.g., 7 PM–8 AM local)

### Example — scheduled shutdown (GitHub Actions)

```yaml
name: Stop preview environments
on:
  schedule:
    - cron: '0 23 * * 1-5' # Weekdays at 11 PM
jobs:
  stop:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
        flyctl apps list --json | jq -r '.[].name' | \
          grep -E '^pr-' | \
          xargs -I {} flyctl apps stop {}
```

## Budget alerts

Set alerts at thresholds:

| Threshold | Action |
| :--- | :--- |
| 50% of monthly budget | Notify team, review spend |
| 80% of monthly budget | Notify manager, investigate anomalies |
| 100% of monthly budget | Notify leadership, freeze non-essential spend |

### Tools

- AWS Budgets, GCP Budgets, Azure Cost Management
- Platform-native billing alerts (Fly.io, Render, Heroku)
- Third-party: CloudHealth, Datadog Cloud Cost Management

## Monthly bill review

Review the cloud bill every month:

1. **Total spend vs budget:** Are we on track?
2. **Top services:** Which services cost the most? (Compute, storage, data transfer)
3. **Unused resources:** Orphaned load balancers, unattached volumes, old snapshots
4. **Data transfer:** Unexpected cross-region or internet data transfer charges
5. **Reserved instances:** Are reserved instances being utilized?

### Common waste sources

- Unattached EBS volumes and elastic IPs
- Old database snapshots
- Load balancers without backends
- Over-sized instances
- Data transfer between regions unnecessarily
- Preview environments left running

## Cost by platform

| Platform | Cost model | Typical starting point |
| :--- | :--- | :--- |
| **Fly.io** | Usage-based (CPU, memory, bandwidth) | ~$2–10/mo for small apps |
| **Render** | Usage-based + instance hours | ~$7–20/mo for small apps |
| **Vercel** | Hobby free, Pro $20/user/mo | Free for personal, $20/mo for teams |
| **Netlify** | Starter free, Pro $19/user/mo | Free for personal, $19/mo for teams |
| **Heroku** | Dyno hours + add-ons | ~$25+/mo for basic apps |
| **AWS/GCP/Azure** | Pay-as-you-go + reserved | Variable; can start low, scale high |

## Cost optimization checklist

- [ ] Right-size instances based on actual usage metrics
- [ ] Use spot/preemptible instances for interruptible workloads
- [ ] Scale preview environments to zero or delete after PR closure
- [ ] Set budget alerts at 50%, 80%, 100%
- [ ] Review cloud bill monthly for waste
- [ ] Pin base images and tag images with commit SHA (reduces rebuild cost)
- [ ] Use reserved instances or savings plans for steady-state workloads
- [ ] Enable auto-scaling with appropriate min/max bounds
- [ ] Monitor data transfer costs between regions
