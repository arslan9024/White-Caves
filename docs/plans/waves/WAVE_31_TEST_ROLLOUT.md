# Wave 31 — Test Rollout

**Wave:** 31  
**Status:** planned  
**Date:** 2026-08-02

---

## Test Matrix

| Scope         | Test Type        | Target Files / Routes                           | Pass Criteria                                   |
| ------------- | ---------------- | ----------------------------------------------- | ----------------------------------------------- |
| Data model    | Unit             | Compliance document model helpers               | Date/status calculations correct at boundaries  |
| API auth      | Integration      | `/api/v1/compliance/documents*`                 | Manager/compliance role matrix enforced         |
| Import        | Integration      | `/api/v1/compliance/documents/import-reference` | Idempotent import + duplicate-safe behavior     |
| Scheduler     | Unit/Integration | Expiry check job                                | Alerts emitted once per threshold/document      |
| Notifications | Integration      | Notification service hooks                      | In-app/email payload contract passes            |
| UI list       | Component        | Compliance documents table/panel                | Filters, badges, and countdown render correctly |
| Executive KPI | Component        | Compliance KPI widgets                          | Accurate totals by status and authority         |
| Audit         | Integration      | Audit log persistence                           | Append-only records for regulated actions       |
| Governance    | Script           | `npm run plans:validate`                        | Full pass                                       |

---

## Suggested Commands

- `npm run test:run -- server/routes/compliance*.test.ts`
- `npm run test:run -- server/services/*compliance*.test.ts`
- `npm run test:run -- src/pages/**/Compliance*.test.tsx`
- `npm run test:run -- src/components/**/Compliance*.test.tsx`
- `npm run typecheck`
- `npm run plans:validate`

---

## Evidence Capture

- Route test output snapshot
- Scheduler boundary test output
- UI screenshot for expiring/expired states
- Governance pass log
