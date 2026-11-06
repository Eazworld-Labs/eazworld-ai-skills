# RUNBOOK.md

Written in phase 6 and kept current after launch. It tells whoever is on call how to keep
the system running without having to understand all of it. Keep steps short and numbered,
and say who may run each one. Never put passwords, keys, or tokens in this file — name where
they are stored. Any step that changes production data or infrastructure needs explicit
human confirmation.

## 1. Service Map

- **Live address(es):**
- **Where it runs:** <!-- provider, region, servers or containers -->
- **Health checks:** <!-- liveness and readiness URLs -->
- **Dashboards and logs:** <!-- where to look -->
- **Owner and on-call contact:**

## 2. Deploy

1. <!-- preconditions: tests green, migrations reviewed, approval recorded -->
2. <!-- the exact command or pipeline step -->
3. <!-- how to confirm success -->

## 3. Roll Back

1. <!-- how to redeploy the previous version -->
2. <!-- what to do if a migration already ran -->
3. <!-- how to confirm recovery -->

## 4. Backups and Restore

- **What is backed up, how often, where, and for how long:**
- **Last restore test (date, result):**
- **Restore steps:**

## 5. Secrets and Access

- **Where each secret lives:** <!-- secret store, not this file -->
- **How to rotate a payment, database, or email key:** <!-- steps and who approves -->
- **Who has production access and how it is removed when someone leaves:**

## 6. Common Problems

| Symptom | Likely cause | First action |
| :--- | :--- | :--- |
| Site down or 5xx | | |
| Payments stuck pending | | |
| Emails or messages not sending | | |
| Slow pages | | |
| Disk or database full | | |

## 7. Incident Response

1. **Acknowledge** and say who is handling it.
2. **Contain** — stop the bleeding (disable a feature, scale up, roll back).
3. **Communicate** — who is told, in what words, how often.
4. **Fix and verify.**
5. **Review** — what happened, why, what changes so it cannot repeat.

## 8. Routine Maintenance

| Task | How often | Owner |
| :--- | :--- | :--- |
| Apply security updates | | |
| Renew domain and certificates | | |
| Review logs and alerts | | |
| Test a restore | | |

## 9. Change Log

<!-- Date — change to the operating setup — who. -->
