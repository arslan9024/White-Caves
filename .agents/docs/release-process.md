# Release Management Process — White Caves CRM Platform

> **Document ID:** WC-REL-001  
> **Version:** 1.0  
> **Date:** March 2026

---

## 1. Overview

This document defines how software releases are planned, versioned, approved, deployed, and communicated at White Caves Real Estate.

---

## 2. Versioning Scheme

The platform follows **Semantic Versioning (SemVer)**: `MAJOR.MINOR.PATCH`

| Component | When to Increment | Example |
|-----------|------------------|---------|
| MAJOR | Breaking changes to API or major feature redesign | 1.0.0 → 2.0.0 |
| MINOR | New features (backward-compatible) | 1.0.0 → 1.1.0 |
| PATCH | Bug fixes, hotfixes (no new features) | 1.0.0 → 1.0.1 |

**Current version:** See `package.json` → `"version"` field.

**Pre-release tags:**
- `1.2.0-alpha.1` — Internal testing
- `1.2.0-beta.1` — UAT / Staging
- `1.2.0` — Production release

---

## 3. Release Types

| Type | Frequency | Size | Process |
|------|-----------|------|---------|
| Feature release (MINOR) | Every 2–4 weeks | Medium–large | Full release process |
| Patch release (PATCH) | As needed | Small | Expedited process |
| Hotfix | As needed (P1 only) | Minimal | Emergency process |
| Major release (MAJOR) | Quarterly+ | Large | Extended process with stakeholder review |

---

## 4. Release Calendar

| Phase | Duration | Activities |
|-------|---------|-----------|
| Development | Variable | Feature development, unit tests |
| Code Freeze | 2 days before release | No new features; bug fixes only |
| Staging Validation | 2 days | Integration tests, E2E, performance |
| UAT | 3–5 business days | Business user acceptance testing |
| Release Approval | 1 day | Sign-off from product owner |
| Production Deploy | Day of release | Deploy + post-deploy verification |
| Release Monitoring | 48 hours | Watch error rates and user reports |

---

## 5. Release Process (Step by Step)

### Step 1: Feature Freeze and Branch Creation
```bash
# Create release branch from main
git checkout main && git pull
git checkout -b release/v1.x.0
```

### Step 2: Version Bump
```bash
# Update version in package.json
npm version minor --no-git-tag-version
git add package.json
git commit -m "chore: bump version to v1.x.0"
```

### Step 3: Update CHANGELOG
Edit `CHANGELOG.md`:
```markdown
## [1.x.0] — YYYY-MM-DD

### New Features
- Feature A: description
- Feature B: description

### Bug Fixes
- Fixed: issue description (#PR-number)

### Security
- Updated: dependency name to version X.Y.Z

### Breaking Changes
- None
```

### Step 4: Run Full Test Suite
```bash
npm test           # All tests must pass
npm run lint       # Zero errors
npx tsc --noEmit   # Zero type errors
```

### Step 5: Deploy to Staging
```bash
git push origin release/v1.x.0
# CI pipeline auto-deploys to staging
```

### Step 6: Run Staging Validation
- Execute integration test suite against staging
- Run E2E critical path tests (E2E-001 to E2E-010)
- Run performance smoke test
- Check `staging.whitecaves.ae` manually

### Step 7: UAT
- Notify UAT participants via email: "UAT for v1.x.0 is ready on staging"
- UAT participants execute scenarios from `business_docs/13_testing/uat-scenarios.md`
- Collect UAT sign-off form

### Step 8: Release Approval
Product owner signs off using QA Release Checklist (`business_docs/13_testing/qa-checklist.md`).

### Step 9: Production Deployment
```bash
# Merge release branch to main
git checkout main
git merge --no-ff release/v1.x.0

# Tag the release
git tag -a v1.x.0 -m "Release v1.x.0 — [date]"
git push origin main --tags

# Production auto-deploys from tag
```

### Step 10: Post-Release Monitoring
- Monitor error rate and performance for 48 hours
- Be available for hotfix if P1 issue emerges
- Delete release branch: `git branch -d release/v1.x.0`

---

## 6. Hotfix Release Process

For P1 production issues requiring immediate fix:

```bash
# 1. Branch from production tag
git checkout -b hotfix/v1.x.x-description v1.x.x

# 2. Make minimal fix
# 3. Run tests: npm test

# 4. Bump patch version
npm version patch --no-git-tag-version

# 5. Tag and push
git tag -a v1.x.1 -m "Hotfix: [description]"
git push origin hotfix/v1.x.x-description --tags

# 6. Also merge hotfix back to main
git checkout main
git merge --no-ff hotfix/v1.x.x-description
git push origin main
```

---

## 7. Release Communication

### Internal Communication (every release)
Post in team WhatsApp group:
```
🚀 Release v1.x.0 is now live
Date: [date]
Key changes:
• [Feature 1]
• [Feature 2]
• [Bug fix 1]
Full changelog: [link]
```

### User-Facing Communication (major feature releases)
- Email to all CRM users via SendGrid template
- WhatsApp broadcast to team managers
- In-app banner for 48 hours post-release

---

## 8. Dependency Updates

### Monthly Security Review
```bash
# Check for outdated packages
npm outdated

# Check for vulnerabilities
npm audit

# Fix automatically fixable
npm audit fix
```

### Process for dependency updates:
1. Run `npm audit` — fix all critical and high vulnerabilities immediately
2. Monthly: update minor versions of all non-breaking dependencies
3. Major version upgrades: treated as a feature release with full testing

---

## 9. CHANGELOG Maintenance

`CHANGELOG.md` at the repo root is the authoritative release history. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

**Document ID:** WC-REL-001 | **Version:** 1.0 | **Date:** March 2026
