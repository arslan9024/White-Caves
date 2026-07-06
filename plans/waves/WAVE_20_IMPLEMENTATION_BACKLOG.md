# Wave 20 — Implementation Backlog

**Wave:** 20
**Focus:** RBAC Hardening + Audit Export Security
**Status:** ✅ Complete
**Date:** 2026-06-18

---

| ID      | REQ         | Priority | Task                                                                                                 | Owner          | Validation                                                             | Status      |
| ------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------- | ----------- |
| W20-001 | REQ-SEC-001 | P0       | Re-gate audit log CSV + XLSX exports from `view_leads` → `view_audit_logs`                           | @Mira + @Radia | Route tests: buyer/tenant get 403, manager gets 200                    | ✅ Complete |
| W20-002 | REQ-SEC-002 | P0       | Add explicit manager+ role guard on compliance POST/PATCH mutations (reports, brn-check, kyc-review) | @Mira + @Radia | Negative-path tests: agent gets 403; manager/finance/admin get 200/201 | ✅ Complete |
| W20-003 | REQ-SEC-003 | P0       | Add explicit manager+ role guard on PDPL consent POST + DELETE mutations                             | @Mira + @Radia | Negative-path tests: agent gets 403; manager/finance/admin get 200/201 | ✅ Complete |
| W20-004 | REQ-SEC-004 | P0       | Wave closeout: regression tests green + `npm run plans:validate`                                     | @Katherine     | All W20-001..003 route tests pass; governance validation green         | ✅ Complete |

---

## Dependency Order

W20-001 → W20-002 → W20-003 → W20-004
