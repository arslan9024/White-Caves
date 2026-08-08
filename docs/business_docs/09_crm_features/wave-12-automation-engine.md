# Wave 12 — Automation Engine: SchedulerService + Cron Execution Model

<!-- markdownlint-disable MD022 MD032 MD040 MD060 -->

**Drafted by:** @Cron  
**Model:** Llama 3.1 70B via Groq  
**Status:** ✅ READY (retrospective spec for implemented Wave 12)  
**Last Updated:** 2026-05-25  
**Next Review:** 2026-08-21  
**Source of Truth:** CRM Wave 12 automation engine feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend automation observability/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

CONSUMES←@Mira: `server/services/SchedulerService.ts`  
FEEDS→@Handlebars: `business_docs/09_crm_features/wave-12-email-wiring.md#scheduled-triggers`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-12-automation-engine.md`

---

## 1. Overview

The White Caves Automation Engine provides a centralised, fault-tolerant cron execution framework that runs recurring background jobs on a fixed schedule. It is implemented in `server/services/SchedulerService.ts` and registered at server startup in `server/index.ts`.

---

## 2. Architecture: SchedulerService

### 2.1 Class Design

```
SchedulerService
  ├── jobs: Map<CronJobId, CronJobInfo>
  ├── started: boolean
  ├── start()          — registers all jobs, guards against double-start
  ├── stop()           — destroys all tasks, clears map
  ├── getStatus()      — returns job registry without the raw task handle
  └── register helpers (one per job)
```

### 2.2 CronJobId Registry

| Job ID | Name | Cron Expression | Timezone |
|--------|------|-----------------|----------|
| `lead-rescore-daily` | Lead Auto-Rescore | `0 2 * * *` | Asia/Dubai |
| `permit-checks-daily` | Permit Alert Scan | `0 3 * * *` | Asia/Dubai |
| `rent-generation-monthly` | Monthly Rent Generation | `0 6 1 * *` | Asia/Dubai |
| `rent-reminders-daily` | Rent Due Reminders | `0 9 * * *` | Asia/Dubai |
| `lease-expiry-reminders-daily` | Lease Expiry Reminders | `0 8 * * *` | Asia/Dubai |
| `sitemap-weekly-refresh` | Sitemap XML Refresh | `0 4 * * 0` | Asia/Dubai |

### 2.3 CronJobInfo Schema

```typescript
interface CronJobInfo {
  id: CronJobId;
  name: string;
  cronExpression: string;
  timezone: string;
  task: ScheduledTask;       // node-cron handle (excluded from status API)
  lastRunAt: string | null;  // ISO-8601 timestamp
  lastStatus: 'success' | 'failed' | 'skipped' | null;
}
```

---

## 3. Job Definitions

### 3.1 Lead Auto-Rescore (`lead-rescore-daily`)
- **Runs:** 02:00 AST daily  
- **Action:** Calls `batchRescoreLeads()` from `server/services/ai/leadScoringEngine.ts`  
- **Purpose:** Recalculate AI lead quality scores based on updated engagement, age, and activity data  
- **Failure mode:** Log error; mark `lastStatus = 'failed'`; no retry in same run window

### 3.2 Permit Alert Scan (`permit-checks-daily`)
- **Runs:** 03:00 AST daily  
- **Action:** Calls `runPermitAlertSchedulerTick()` from `server/services/compliance/permitAlertScheduler.ts`  
- **Purpose:** Identify expiring RERA permits and BRN registrations; generate compliance alerts  
- **Downstream effect:** Creates alerts surfaced in the Compliance dashboard

### 3.3 Property Permit Enforcement (`permit-enforcement-daily`)
- **Runs:** 03:30 AST daily  
- **Action:** Calls `runPropertyPermitEnforcementTick()` from `server/services/compliance/propertyPermitEnforcementScheduler.ts`  
- **Purpose:** Auto-set status `off_market` for listings whose permit has expired (hard enforcement)

### 3.4 Monthly Rent Generation (`rent-generation-monthly`)
- **Runs:** 06:00 AST on the 1st of each month  
- **Action:** Generates upcoming rent invoice records for all active leases  
- **Purpose:** Ensures the finance ledger is pre-populated before rent due dates

### 3.5 Rent Due Reminders (`rent-reminders-daily`)
- **Runs:** 09:00 AST daily  
- **Action:** Scans leases for payments due within 3 days; dispatches email reminder trigger  
- **Downstream effect:** Fires `payment_reminder` event via `emailTriggers.ts`

### 3.6 Lease Expiry Reminders (`lease-expiry-reminders-daily`)
- **Runs:** 08:00 AST daily  
- **Action:** Scans active leases expiring in 90 / 60 / 30 / 7 days; dispatches staged reminder emails  
- **Downstream effect:** Fires `lease_expiry_warning` email trigger event

### 3.7 Sitemap XML Refresh (`sitemap-weekly-refresh`)
- **Runs:** 04:00 AST every Sunday  
- **Action:** Regenerates `public/sitemap.xml` from live property and page data  
- **Purpose:** Keeps search-engine sitemap current without a full deploy

---

## 4. Failure & Escalation Model

| Scenario | Handling |
|----------|----------|
| Exception in job handler | `try/catch` wraps each tick; `lastStatus = 'failed'`; error logged via `server/utils/logger.ts` |
| Redis / Prisma unavailable | Logged at `warn` level; job skips tick gracefully |
| Double-start guard | `if (this.started) return;` prevents duplicate job registration |
| Graceful shutdown | `stop()` is wired to `SIGTERM` / `SIGINT` in `server/index.ts` |

---

## 5. Status API

| Endpoint | Auth | Response |
|----------|------|----------|
| `GET /api/admin/scheduler/status` | `admin` role | Array of `CronJobInfo` (without task handle) |

---

## 6. Dependency Map

```
SchedulerService
  ├── node-cron (cron scheduling)
  ├── @prisma/client (database reads)
  ├── leadScoringEngine.ts (rescore jobs)
  ├── permitAlertScheduler.ts (compliance jobs)
  ├── propertyPermitEnforcementScheduler.ts (enforcement jobs)
  └── emailTriggers.ts (reminder dispatch)
```

---

## 7. Acceptance Criteria

- [x] All 6 cron jobs registered and listed in `getStatus()`
- [x] `start()` / `stop()` lifecycle works without leaking handles
- [x] Failure in one job does not affect other running jobs
- [x] `lastRunAt` and `lastStatus` updated on every tick
- [x] Status endpoint returns JSON array with correct shape
- [x] Server-startup logs show all registered job IDs
