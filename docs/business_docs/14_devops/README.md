# 14 - DevOps & Infrastructure

DevOps documentation index for the White Caves Real Estate platform covering CI/CD, deployment, monitoring, and incident response.

> Last Updated: May 2026

---

## Documents in This Section

| File                          | Description                                                   |
| ----------------------------- | ------------------------------------------------------------- |
| `deployment-runbook.md`       | Step-by-step deployment procedures for all environments       |
| `environment-setup.md`        | Environment configuration and local development setup         |
| `incident-response.md`        | Incident classification, escalation, and resolution playbooks |
| `monitoring-observability.md` | Monitoring stack, alerting rules, and observability strategy  |

---

## Branch & Release Governance (Authoritative)

### Branch Model

```
main (production, monthly release-only)
└── development (daily integration branch)
    ├── feature/*
    ├── fix/*
    ├── refactor/*
    ├── docs/*
    └── test/*
```

### Mandatory Rules

1. Daily coding and commits happen on `development` or feature branches.
2. Routine direct commits to `main` are not allowed.
3. Release promotion from `development` to `main` happens once per month.
4. Hotfix exceptions on `main` require explicit approval and mandatory back-merge to `development`.

---

## CI/CD Pipeline

| Stage                  | Tool                      | Trigger                                    |
| ---------------------- | ------------------------- | ------------------------------------------ |
| Lint                   | ESLint + Prettier         | PR to `development` and monthly release PR |
| Type Check             | TypeScript `tsc --noEmit` | PR to `development` and monthly release PR |
| Unit/Integration Tests | Vitest/Jest               | PR to `development` and monthly release PR |
| Build                  | Vite + server build       | PR to `development` and monthly release PR |
| E2E Smoke              | Playwright                | monthly release PR + pre-prod validation   |
| Security Scan          | npm audit + SAST          | monthly release PR                         |

### Required Monthly Release Gates

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Critical tests and smoke checks pass
- Release notes + rollback note attached to PR

---

## Environment Promotion

| Environment | Branch Source                        | Deploy Mode            |
| ----------- | ------------------------------------ | ---------------------- |
| Development | `development`                        | frequent/continuous    |
| Staging     | release candidate from `development` | pre-release validation |
| Production  | `main`                               | monthly release window |

---

## Operational Validation Standard

For every release cycle:

1. Validate development environment with `npm run dev`
2. Validate production artifact with `npm run build`
3. Run post-deploy smoke checks (homepage, auth, dashboard, key APIs)

---

## Incident Response Reminder

In SEV-1/SEV-2 events, prioritize service restoration first, then complete governance steps:

- rollback or hotfix,
- production validation,
- back-merge to `development`,
- post-incident review.
