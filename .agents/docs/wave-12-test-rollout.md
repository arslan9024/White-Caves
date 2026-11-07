# Wave 12 — Test Rollout Plan

**Wave:** 12  
**Focus:** Automation Engine  
**Status:** 📋 Planned  
**Date:** 2026-05-24

---

## Test Matrix

| Area | Test Type | Command | Pass Condition |
| --- | --- | --- | --- |
| Scheduler registration | Startup integration | `npm run typecheck` | jobs register without runtime error |
| Cron execution | Service tests | targeted scheduler tests | expected jobs run and log |
| PDF generation | Route integration | targeted document route tests | valid PDF stream response |
| Excel export | Route integration | targeted report route tests | valid `.xlsx` stream response |
| Email triggers | Route integration | targeted auth/lead/viewing tests | template event fired once |
| Regression | Build + governance | `npm run build && npm run plans:validate` | both pass |

---

## Exit Criteria

- All W12 tasks validated
- No unresolved P0/P1 defects
- Evidence synced to `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
