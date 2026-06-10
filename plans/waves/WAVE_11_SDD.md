# Wave 11 — System Design Document (SDD)

**Wave:** 11  
**Focus:** Incomplete Features Closure + Architecture Refactor  
**Status:** 🔮 Backlog (activates when Wave 10 is green)  
**Date:** 2026-05-22  
**Owners:** @Ada + @Mira + @Barbara + @Katherine  
**Entry Gate:** Wave 10 green + readiness ≥ 60% + `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`

---

## Scope

Wave 11 closes the partially-built features that have UI shells but no working backend, and performs architecture refactors to prepare the platform for production scale.

Sources:

- [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](../IMPROVEMENTS_INCOMPLETE_FEATURES.md)
- [`IMPROVEMENTS_ARCHITECTURE.md`](../IMPROVEMENTS_ARCHITECTURE.md)

---

## Feature Closures

### Item 6 — Job Scheduler / Cron

| Component             | File                                                   | Description                                         |
| --------------------- | ------------------------------------------------------ | --------------------------------------------------- |
| Scheduler service     | `server/services/SchedulerService.ts`                  | Registers all cron jobs at startup                  |
| Daily permit check    | Via existing `runPropertyPermitEnforcementTick`        | Already partially built in Wave 04                  |
| Daily lead rescore    | `server/services/LeadScoringService.ts#batchRescore()` | New batch method                                    |
| Monthly rent payments | `server/services/RentPaymentService.ts`                | Auto-generate RentPayment records for active leases |
| Rent reminders        | `server/services/RentReminderService.ts`               | Day-5/10/15/25 WhatsApp reminders                   |
| Sitemap refresh       | Weekly cron → `GET /sitemap.xml` route                 | Regenerate from live properties                     |

### Item 7 — Document Generation (PDF Engine)

| Component            | File                                               | Description                   |
| -------------------- | -------------------------------------------------- | ----------------------------- |
| Document service     | `server/services/DocumentService.ts`               | PDF/Excel generation methods  |
| Dependencies         | `puppeteer`, `exceljs`                             | Add to package.json           |
| Contract PDF         | `generateContractPDF(contractId)`                  | Tenancy agreement PDF         |
| Commission statement | `generateAgentCommissionStatement(agentId, month)` | PDF with company letterhead   |
| P&L report           | `generateMonthlyPLReport(month)`                   | Monthly P&L summary PDF       |
| Lead export          | `exportLeadsToExcel(filters)`                      | Filtered leads as `.xlsx`     |
| Property export      | `exportPropertiesToExcel(filters)`                 | Property inventory as `.xlsx` |

### Item 8 — Email Service Wiring

| Component            | File                                          | Description                            |
| -------------------- | --------------------------------------------- | -------------------------------------- |
| Email triggers       | `server/services/emailTriggers.ts`            | Wire all orphaned email trigger points |
| Lease expiry         | Trigger on 90/60/30 days before `endDate`     | Already scheduled in SchedulerService  |
| Welcome email        | Trigger on new user `POST /api/auth/register` | Wire to email service                  |
| Viewing confirmation | Trigger on `POST /api/viewings`               | Wire to email service                  |

---

## Architecture Refactors

### Error Handling Standardization

```typescript
// Target: every route uses the shared AppError class
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {}
}
// Centralized error handler in server/middleware/errorHandler.ts
```

### Service Layer Extraction

- Extract business logic out of route files into dedicated service files
- Target: `server/routes/*.ts` files > 300 lines → split into `route + service`

### Database Index Audit

- Audit MongoDB collections for missing compound indexes
- Priority: `Lead` (email + status), `Property` (area + status + price), `Lease` (tenant + endDate)

---

## Non-Functional Targets

| Metric                | Target                                 |
| --------------------- | -------------------------------------- |
| Server startup time   | < 3 seconds                            |
| Cron job registration | All jobs registered at startup, logged |
| PDF generation time   | < 5 seconds for standard contract      |
| Excel export time     | < 10 seconds for 1000-row export       |

---

## Validation Commands

```bash
npm run typecheck
npm run lint
npm run build
npm run plans:validate
npm run test:run -- server/services
```
