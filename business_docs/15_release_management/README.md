# 15 — Release Management

Release management index for the White Caves Real Estate platform — process, versioning, change management, and rollback procedures.

> Last Updated: April 2026

---

## Documents in This Section

| File | Description |
|------|-------------|
| `release-process.md` | Detailed release workflow from planning to post-release |
| `change-management.md` | Change request process, approval workflows, impact assessment |

---

## Release Management Overview

White Caves follows a structured release cadence combining continuous delivery for low-risk changes with gated releases for major features, ensuring platform stability while maintaining development velocity.

---

## 1. Release Process

### Release Types

| Type | Cadence | Scope | Approval | Downtime |
|------|---------|-------|----------|----------|
| **Major** (v2.0.0) | Quarterly | New features, breaking changes, architecture updates | CTO + Product Owner | Scheduled maintenance window |
| **Minor** (v1.1.0) | Bi-weekly | New features, enhancements, non-breaking changes | Engineering Lead | Zero-downtime rolling deploy |
| **Patch** (v1.0.1) | As needed | Bug fixes, security patches, hotfixes | Engineering Lead | Zero-downtime rolling deploy |
| **Hotfix** | Emergency | Critical bug or security vulnerability | Any senior engineer | Zero-downtime, immediate |

### Release Workflow

```
Planning → Development → Code Freeze → QA/Staging → Go/No-Go → Production → Post-Release
   │            │              │             │            │            │            │
 Sprint      Feature        Branch         E2E +       Release     Rolling      Monitor
 Planning    Branches       Cut           UAT         Committee    Deploy       + Retro
```

### Release Checklist

#### Pre-Release

- [ ] All planned features merged to `develop`
- [ ] Release branch created (`release/v1.x.x`)
- [ ] Version number updated in `package.json`
- [ ] Changelog generated and reviewed
- [ ] All CI/CD checks passing
- [ ] E2E tests passing on staging
- [ ] UAT sign-off from product owner
- [ ] Database migration scripts reviewed
- [ ] API documentation updated (if applicable)
- [ ] Security scan clean (no critical/high findings)

#### Release Day

- [ ] Go/No-Go decision confirmed
- [ ] Release tag created and pushed
- [ ] Production deployment initiated
- [ ] Health checks verified (all endpoints green)
- [ ] Smoke tests passed
- [ ] Stakeholder notification sent
- [ ] Release notes published

#### Post-Release

- [ ] Monitor error rates for 2 hours post-deploy
- [ ] Confirm no performance regression
- [ ] Merge release branch back to `develop`
- [ ] Close completed tickets in project tracker
- [ ] Schedule retrospective (for major releases)

---

## 2. Change Management

### Change Request Process

```
Request → Impact Assessment → Review → Approval → Implementation → Verification
   │              │               │         │              │              │
 Requester    Engineering     Change     Decision       Dev Team      QA Team
              Lead           Advisory    (approve/
                             Board      defer/reject)
```

### Change Categories

| Category | Risk Level | Approval Required | Lead Time |
|----------|-----------|-------------------|-----------|
| **Standard** | Low | Auto-approved (follows template) | Same sprint |
| **Normal** | Medium | Engineering Lead | 1 sprint |
| **Significant** | High | Engineering Lead + Product Owner | 2 sprints |
| **Emergency** | Critical | Any senior engineer (retroactive review) | Immediate |

### Impact Assessment Criteria

| Factor | Low | Medium | High |
|--------|-----|--------|------|
| Users affected | < 100 | 100–10,000 | > 10,000 |
| Data migration | None | Additive only | Schema change |
| API changes | Internal only | Backward compatible | Breaking change |
| Third-party deps | None | Minor update | Major version |
| Rollback complexity | Simple revert | Config restore | Data rollback needed |

*Full change management process: [change-management.md](change-management.md)*

---

## 3. Version Numbering

### Semantic Versioning (SemVer)

White Caves follows [Semantic Versioning 2.0.0](https://semver.org/):

```
MAJOR.MINOR.PATCH[-prerelease][+build]

Examples:
  1.0.0       — Initial production release
  1.1.0       — New feature (backward compatible)
  1.1.1       — Bug fix
  2.0.0       — Breaking API change
  1.2.0-beta.1 — Pre-release for testing
  1.2.0-rc.1  — Release candidate
```

### Version Sources

| Artifact | Version Location | Update Method |
|----------|-----------------|---------------|
| Application | `package.json` → `version` | `npm version` command |
| API | `openapi.json` → `info.version` | Manual (matches app) |
| Docker Image | Tag: `whitecaves:v1.2.3` | CI/CD pipeline |
| Database | Prisma migration timestamp | `prisma migrate dev` |
| Helm Chart | `Chart.yaml` → `appVersion` | Manual (matches app) |

### Git Tagging Convention

```bash
# Release tags
git tag -a v1.2.3 -m "Release v1.2.3: Feature X, Fix Y"

# Pre-release tags
git tag -a v1.3.0-beta.1 -m "Beta: New dashboard"

# Format
v{MAJOR}.{MINOR}.{PATCH}[-{prerelease}]
```

---

## 4. Release Calendar

### 2026 Release Schedule

| Release | Version | Target Date | Theme | Status |
|---------|---------|-------------|-------|--------|
| Q1 Launch | v1.0.0 | Jan 15, 2026 | MVP: CRM Core, Property Listings | ✅ Released |
| Q1 Patch | v1.0.1 | Feb 1, 2026 | Bug fixes, performance tuning | ✅ Released |
| Sprint 3 | v1.1.0 | Feb 15, 2026 | WhatsApp integration, lead scoring | ✅ Released |
| Sprint 4 | v1.2.0 | Mar 1, 2026 | AI assistant, advanced search | ✅ Released |
| Sprint 5 | v1.3.0 | Mar 15, 2026 | Portal syndication, reports | ✅ Released |
| Sprint 6 | v1.4.0 | Apr 1, 2026 | Arabic/RTL support, notifications | 🔄 In Progress |
| Sprint 7 | v1.5.0 | Apr 15, 2026 | Facility management module | 📋 Planned |
| Q2 Major | v2.0.0 | May 1, 2026 | Multi-tenant architecture, API v2 | 📋 Planned |
| Sprint 9 | v2.1.0 | May 15, 2026 | Mobile app API, offline support | 📋 Planned |
| Sprint 10 | v2.2.0 | Jun 1, 2026 | Payment integration, invoicing | 📋 Planned |

### Release Windows

| Day | Time (GST) | Type | Notes |
|-----|-----------|------|-------|
| Tuesday | 10:00–12:00 | Standard releases | Lowest traffic period |
| Thursday | 10:00–12:00 | Backup window | If Tuesday blocked |
| Any day | Any time | Hotfixes | Emergency only |

### Blackout Periods

| Period | Reason |
|--------|--------|
| Ramadan final week | High traffic, cultural sensitivity |
| National Day (Dec 2–3) | Holiday, reduced team availability |
| New Year (Dec 31–Jan 2) | Holiday period |
| Major exhibitions (Cityscape) | High-traffic lead generation period |

---

## 5. Rollback Procedures

### Rollback Decision Matrix

| Scenario | Action | RTO | Data Impact |
|----------|--------|-----|-------------|
| UI regression (cosmetic) | Deploy previous build | < 10 min | None |
| API error rate spike (> 5%) | Revert to previous Docker image | < 5 min | None |
| Performance degradation | Revert + investigate | < 15 min | None |
| Database migration failure | Run down migration | < 30 min | Possible data loss (assessed) |
| Security vulnerability found | Immediate revert + hotfix | < 15 min | Audit required |
| Third-party service failure | Feature flag disable | < 2 min | None |

### Rollback Steps

#### Application Rollback (< 5 minutes)

```bash
# 1. Identify last known good version
git log --oneline --tags | head -5

# 2. Deploy previous version
# Via CI/CD: Re-run last successful deployment
# Via Docker: Roll back to previous image tag
docker pull whitecaves/app:v1.2.2
docker service update --image whitecaves/app:v1.2.2 whitecaves_app

# 3. Verify health
curl -s https://whitecaves.ae/api/health | jq .

# 4. Notify team
# Automated Slack notification on rollback
```

#### Database Rollback

```bash
# 1. Check migration status
npx prisma migrate status

# 2. Revert last migration (if safe)
npx prisma migrate resolve --rolled-back <migration_name>

# 3. Verify data integrity
npx prisma db pull  # Compare with expected schema
```

#### Feature Flag Rollback (< 2 minutes)

```
Feature flags allow instant rollback without deployment:
1. Navigate to feature flag dashboard
2. Toggle the affected feature OFF
3. Verify feature is disabled in production
4. Investigate root cause at normal priority
```

### Post-Rollback Actions

1. **Incident ticket created** — Document what happened and why
2. **Root cause analysis** — Within 24 hours for SEV-1/SEV-2
3. **Fix forward** — Develop and test the fix on a branch
4. **Re-release** — Follow standard release process with the fix
5. **Retrospective** — Discuss prevention measures

---

## Quick Reference

| Action | Command / Process |
|--------|------------------|
| Check current version | `cat package.json \| jq .version` |
| Create release tag | `git tag -a v1.x.x -m "Release notes"` |
| View release history | `git tag --sort=-version:refname` |
| Check deployment status | CI/CD dashboard or `/api/health` |
| Emergency rollback | Re-deploy previous tag via CI/CD |

---

*For the full release process, see [release-process.md](release-process.md).*
*For change management procedures, see [change-management.md](change-management.md).*
