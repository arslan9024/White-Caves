# Wave 20 — Test Rollout Plan

**Wave:** 20
**Focus:** RBAC Hardening + Audit Export Security
**Status:** ✅ Complete (executed + evidence-backed)
**Date:** 2026-06-18

---

## Validation Matrix

| Area                       | Requirement IDs | Test File                                     | Pass Condition                                                                     |
| -------------------------- | --------------- | --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Audit log export RBAC      | REQ-SEC-001     | `server/routes/activities.test.ts`            | buyer/tenant → 403; manager/owner → 200                                            |
| Compliance mutation guards | REQ-SEC-002     | `server/routes/compliance.test.ts` (targeted) | agent → 403; manager/finance/admin → 200/201 on reports, brn-check, and KYC review |
| PDPL consent guards        | REQ-SEC-003     | `server/routes/compliance.test.ts` (targeted) | agent → 403; manager/finance/admin → 200/201 on consent create/revoke/delete       |
| Governance closeout        | All             | `npm run plans:validate`                      | 0 governance violations                                                            |

---

## Completion Rules

Wave 20 cannot close unless:

1. Audit export RBAC tests confirm buyer/tenant are blocked
2. Compliance mutation negative-path tests pass
3. `npm run plans:validate` passes
4. Evidence recorded in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
