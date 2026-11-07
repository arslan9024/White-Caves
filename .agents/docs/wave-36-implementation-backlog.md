
**Wave:** 36  
**Focus:** Maintenance Module + Tenant Portal  
**Phase:** B (Lease & Tenancy Full Module)  
**Priority:** P1 High  
**Status:** ✅ Complete  
**Date:** 2026-08-09  
**SRS Refs:** REQ-TENANT-004  
**Business Doc Refs:** `09_crm_features/maintenance.md`; `09_crm_features/tenant-portal.md`

---

| ID | Category | Priority | Task | Owner | Validation Command | Status |
|----|----------|----------|------|-------|--------------------|--------|
| W36-001 | Maintenance | P0 | MaintenanceRequest Prisma model (priority, status, contractorId, tenantId, propertyId, SLA clock) | @Barbara | `npx prisma generate && npm run typecheck` | ✅ Complete |
| W36-002 | Maintenance | P0 | MaintenanceRequest CRUD API — `server/routes/maintenance.ts` | @Mira | `npx vitest run server/routes/maintenance.test.ts` | ✅ Complete |
| W36-003 | Maintenance | P0 | Contractor assignment & rating endpoints — `PATCH /api/maintenance/:id/assign` & `/rate` | @Mira | `npx vitest run server/routes/maintenance.test.ts` | ✅ Complete |
| W36-004 | Automation | P1 | 48-hour SLA alert cron — `server/services/maintenanceSLACron.ts` | @Mira | `npx vitest run server/services/maintenanceSLACron.test.ts` | ✅ Complete |
| W36-005 | Tenant Portal | P1 | Tenant Portal API — `server/routes/tenantPortal.ts` (overview, documents, quick submit) | @Mira | `npx vitest run server/routes/tenantPortal.test.ts` | ✅ Complete |
| W36-006 | Governance | P0 | Wave 36 closeout & typecheck | @Katherine | `npm run typecheck && npm run plans:validate` | ✅ Complete |

---

## Acceptance Gate (Wave-Level)

Wave 36 is complete when:
1. Maintenance requests can be created, assigned, and closed via API.
2. 48-hour SLA cron fires alerts for unresolved normal-priority requests.
3. Basic tenant portal routes return tenant-specific lease and payment data.
4. `npm run plans:validate` passes.
5. `npm run quality:quick` passes.

---

## Dependencies
- Wave 35 (Lease + RentPayment models) must be complete first
