**Wave:** 35  
**Focus:** Full Lease & Tenancy Module  
**Phase:** B (Lease & Tenancy Full Module)  
**Priority:** P1 High  
**Status:** ✅ Complete  
**Date:** 2026-08-09  
**SRS Refs:** REQ-TENANT-001 to REQ-TENANT-004  
**Business Doc Refs:** `implementation-plan.md` §B1, §B2; `09_crm_features/tenancy-ejari.md`; `09_crm_features/landlord-portal.md`

---

| ID | Category | Priority | Task | Owner | Validation Command | Status |
|----|----------|----------|------|-------|--------------------|--------|
| W35-001 | Schema | P0 | Add full Lease model to Prisma schema | @Barbara | `npx prisma generate && npm run typecheck` | ✅ Complete |
| W35-002 | Schema | P0 | Add RentPayment model to Prisma schema (schedule, status, dueDate, paidDate) | @Barbara | `npx prisma generate && npm run typecheck` | ✅ Complete |
| W35-003 | Schema | P0 | Add PDCSchedule model to Prisma schema (chequeNumber, bankName, amount, clearanceDate, status) | @Barbara | `npx prisma generate && npm run typecheck` | ✅ Complete |
| W35-004 | API | P0 | Lease CRUD API — `server/routes/leases.ts` (full lifecycle: draft→signed→active→expired/terminated) | @Mira | `npx vitest run server/routes/leases.test.ts` | ✅ Complete |
| W35-005 | API | P1 | Rent payment status tracking API & receipt generator — `server/routes/rentPayments.ts` | @Mira | `npx vitest run server/routes/rentPayments.test.ts` | ✅ Complete |
| W35-006 | API | P0 | Auto-generate rent schedule on lease activation — `server/services/rentScheduleService.ts` | @Mira | `npx vitest run server/services/rentScheduleService.test.ts` | ✅ Complete |
| W35-007 | Automation | P1 | Day 5/10 WhatsApp payment reminder cron — `server/services/rentReminderCron.ts` | @Mira | `npx vitest run server/services/rentReminderCron.test.ts` | ✅ Complete |
| W35-008 | Automation | P2 | Day 15 late fee calculation — `processOverdueLateFees` | @Invoice | `npx vitest run server/services/rentScheduleService.test.ts` | ✅ Complete |
| W35-009 | Governance | P0 | Wave 35 closeout & typecheck | @Katherine | `npm run typecheck && npm run plans:validate` | ✅ Complete |

---

## Acceptance Gate (Wave-Level)

Wave 35 is complete when:
1. Prisma schema includes Lease, RentPayment, PDCCheque models.
2. Lease CRUD API handles full lifecycle transitions with validation.
3. Rent schedule is auto-generated (12 monthly payments) on lease activation.
4. `npm run plans:validate` passes.
5. `npm run quality:quick` passes.

---

## Dependencies
- Wave 33 (Ejari schema fields) must be complete first
- PDFKit for lease PDF generation
