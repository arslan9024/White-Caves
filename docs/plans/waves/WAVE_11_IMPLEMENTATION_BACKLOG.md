# Wave 11 — Implementation Backlog

**Wave:** 11  
**Focus:** Incomplete Features Closure + Architecture Refactor  
**Status:** 🔮 Backlog (activates when Wave 10 is green)  
**Date:** 2026-05-22

---

## Feature Closures

### F1 — Job Scheduler / Cron (Item 6)

| ID      | Priority | Task                                                                                                               | Owner          | Files Affected                                                     | Validation                                             | Status  |
| ------- | -------- | ------------------------------------------------------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------ | ------------------------------------------------------ | ------- |
| W11-001 | P0       | Install `node-cron @types/node-cron`; create `server/services/SchedulerService.ts` registering all jobs at startup | @Mira          | `server/services/SchedulerService.ts`, `package.json`              | Server starts, jobs logged                             | Planned |
| W11-002 | P0       | Daily lead rescore cron (03:00 UTC): `LeadScoringService.batchRescore()`                                           | @Mira          | `server/services/LeadScoringService.ts`                            | Service test + job test                                | Planned |
| W11-003 | P0       | Monthly rent payment auto-generation cron: creates `RentPayment` records for active leases                         | @Mira          | `server/services/RentPaymentService.ts`                            | Service test                                           | Planned |
| W11-004 | P1       | Rent reminders cron (day-5/10/15/25): WhatsApp reminder + late-fee escalation                                      | @Mira + @Jaime | `server/services/RentReminderService.ts`                           | Integration test                                       | Planned |
| W11-005 | P1       | Weekly sitemap refresh cron: calls `GET /sitemap.xml` logic and caches result                                      | @Rachel        | `server/services/SchedulerService.ts`                              | `npm run build`                                        | Planned |
| W11-006 | P2       | Add cron job audit trail: every job execution logged to `Activity` model (`type: 'system'`)                        | @Mira + @Hedy  | `server/services/SchedulerService.ts`, `server/models/Activity.ts` | `npm run test:run -- server/services/SchedulerService` | Planned |

### F2 — Document Generation PDF Engine (Item 7)

| ID      | Priority | Task                                                                                          | Owner            | Files Affected                                                               | Validation                      | Status  |
| ------- | -------- | --------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------- | ------------------------------- | ------- |
| W11-007 | P0       | Install `puppeteer exceljs pdfkit @types/pdfkit`; create `server/services/DocumentService.ts` | @Barbara         | `package.json`, `server/services/DocumentService.ts`                         | `npm run build`                 | Planned |
| W11-008 | P0       | `generateContractPDF(contractId)` — render tenancy agreement to PDF, stream response          | @Barbara         | `server/services/DocumentService.ts`, `server/routes/documents.ts`           | Download test — valid PDF       | Planned |
| W11-009 | P0       | `exportLeadsToExcel(filters)` — filtered leads as `.xlsx`; wire to CRM Export button          | @Barbara + @Mira | `server/services/DocumentService.ts`, `src/pages/crm/LeadManagementPage.tsx` | Download test — valid `.xlsx`   | Planned |
| W11-010 | P1       | `generateAgentCommissionStatement(agentId, month)` — PDF with company letterhead              | @Barbara         | `server/services/DocumentService.ts`                                         | Download test — valid PDF       | Planned |
| W11-011 | P1       | `generateMonthlyPLReport(month)` — P&L summary PDF for MD                                     | @Barbara         | `server/services/DocumentService.ts`                                         | Download test — valid PDF       | Planned |
| W11-012 | P1       | `exportPropertiesToExcel(filters)` — property inventory as `.xlsx`                            | @Barbara         | `server/services/DocumentService.ts`                                         | Download test — valid `.xlsx`   | Planned |
| W11-013 | P2       | Wire export buttons in all CRM tabs to new document routes                                    | @Mira + @Una     | Various CRM component files                                                  | `npm run build` + UI click test | Planned |

### F3 — Email Service Wiring (Item 8)

| ID      | Priority | Task                                                                                        | Owner            | Files Affected                                                            | Validation                                       | Status  |
| ------- | -------- | ------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------- | ------------------------------------------------ | ------- |
| W11-014 | P0       | Audit all orphaned email trigger points; create `server/services/emailTriggers.ts` registry | @Mira            | `server/services/emailTriggers.ts`                                        | `npm run lint`                                   | Planned |
| W11-015 | P0       | Wire welcome email on `POST /api/auth/register`                                             | @Mira + @Daniela | `server/routes/auth.ts`                                                   | `npm run test:run -- server/routes/auth.test.ts` | Planned |
| W11-016 | P1       | Wire viewing confirmation email on `POST /api/viewings`                                     | @Mira            | `server/routes/viewings.ts`                                               | Route test                                       | Planned |
| W11-017 | P1       | Wire lease expiry reminders (90/60/30 days) via SchedulerService                            | @Mira            | `server/services/SchedulerService.ts`, `server/services/emailTriggers.ts` | Scheduler test                                   | Planned |

## Architecture Refactors

| ID      | Priority | Task                                                                                                | Owner        | Files Affected                                                     | Validation                           | Status  |
| ------- | -------- | --------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------ | ------------------------------------ | ------- |
| W11-018 | P1       | Standardize error handling: `AppError` class + centralized `errorHandler` middleware for all routes | @Mira + @Ada | `server/middleware/errorHandler.ts`, all route files               | `npm run typecheck && npm run lint && npm run build`              | Planned |
| W11-019 | P1       | Extract business logic from route files > 300 lines into dedicated service files                    | @Mira        | `server/routes/properties.ts`, `server/routes/leads.ts` (priority) | `npm run build` + route tests        | Planned |
| W11-020 | P2       | MongoDB compound index audit: add missing indexes on Lead, Property, Lease collections              | @Barbara     | `server/models/*.ts`                                               | Query explain plan + `npm run build` | Planned |

---

## Execution Order

```
Wave 10 complete →
  F1 (scheduler): W11-001 → W11-002 → W11-003 → W11-004 → W11-005 → W11-006
  F2 (documents): W11-007 → W11-008 → W11-009 → W11-010 → W11-011 → W11-012 → W11-013
  F3 (email):     W11-014 → W11-015 → W11-016 → W11-017
  Arch:           W11-018 → W11-019 → W11-020
```

---

## Completion Rule

No item marked complete until:

- Validation command(s) pass
- Evidence in `PROJECT_PROGRESS.md` + `DAILY_MILESTONE_TRACKER.md`
- `npm run plans:validate` passes after tracker update
