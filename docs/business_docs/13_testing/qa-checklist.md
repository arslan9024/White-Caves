# QA Release Checklist — White Caves CRM Platform

**Status:** Active  
**Owner:** QA & Release Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Business-layer release quality gate checklist

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- release/readiness verification lanes in `docs/plans/waves/WAVE_36_*`, `WAVE_39_*`, and `WAVE_40_*`

> **Version:** 1.0 | **Last Updated:** March 2026

---

## Purpose

Complete this checklist before every production release. All items must be ✅ before deploying to production. P1 blockers prevent release; P2 require sign-off.

---

## Pre-Release Checklist

### Code Quality

- [ ] All feature branches merged to `main` (no pending PRs for this release)
- [ ] Code review approved by at least 1 other developer
- [ ] TypeScript: `tsc --noEmit` passes with 0 errors
- [ ] ESLint: 0 errors (warnings allowed)
- [ ] No `console.log` left in production code
- [ ] No hardcoded secrets, API keys, or passwords in code
- [ ] No unresolved scaffold comments that block functionality

### Automated Tests

- [ ] All unit tests pass: `npm test` → 0 failures
- [ ] Test coverage ≥ 80% for changed business logic files
- [ ] API integration tests pass: 0 failures
- [ ] E2E critical path (E2E-001 to E2E-010) pass on staging
- [ ] CI pipeline green (GitHub Actions all checks ✅)

### Functionality

- [ ] All features in this release manually verified on staging
- [ ] New features tested with all relevant user roles
- [ ] Error states tested (invalid inputs, network errors)
- [ ] Pagination works on all list endpoints
- [ ] Filters work correctly on all filterable lists
- [ ] Export functions (Excel/PDF) produce correct output
- [ ] Authentication: login, 2FA, logout, token expiry all work

### Security

- [ ] No new secrets committed to Git (`.env` files not tracked)
- [ ] CORS still restricted to approved origins
- [ ] Rate limiting active on auth endpoints
- [ ] New API endpoints have RBAC checks
- [ ] Input sanitisation applied to all new form fields
- [ ] File upload limits enforced on new upload endpoints

### Database

- [ ] Prisma schema changes have migration files
- [ ] Migration run on staging successfully
- [ ] No N+1 query issues introduced in new endpoints
- [ ] New queries have appropriate indexes

### Regulatory Compliance

- [ ] RERA permit enforcement still active (test by attempting to publish without permit)
- [ ] AML thresholds still enforced (test by creating transaction without KYC)
- [ ] Audit log still recording all mutations
- [ ] No PII exposed in list API responses for non-privileged roles

### Performance

- [ ] Dashboard endpoints respond within 1 second on staging
- [ ] No new slow queries added (MongoDB logs checked)
- [ ] Bundle size not increased by more than 5% (`npm run build` output checked)
- [ ] No memory leaks in new API routes (verified via load brief test)

### Documentation

- [ ] API reference updated for any new or changed endpoints
- [ ] Business rules updated if any rule changed
- [ ] Relevant SRS/SDD sections updated
- [ ] CHANGELOG.md updated with release notes

### UAT Sign-off

- [ ] UAT scenarios completed on staging by business users
- [ ] UAT sign-off form signed by relevant department heads
- [ ] No open P1 defects
- [ ] All P2 defects acknowledged with written acceptance by product owner

---

## Release Approval

| Role                                | Name | Date | Signature |
| ----------------------------------- | ---- | ---- | --------- |
| Lead Developer                      |      |      |           |
| Product Owner                       |      |      |           |
| QA Lead                             |      |      |           |
| Managing Director (P1 release only) |      |      |           |

**RELEASE APPROVED:** ☐ YES ☐ NO — Reason: ********\_********

---

**Version:** 1.0 | **Last Updated:** March 2026
