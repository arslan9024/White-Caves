# WAVE 08 — Implementation Backlog

**Date:** 2026-05-22  
**Status:** Active Backlog

## Backlog Items

| ID     | Stream | Task                                                                  | Owner              | Validation                                                                                                                                             | Status  |
| ------ | ------ | --------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| W8-001 | S1     | Execute fast-fix bucket and clear touched strict diagnostics          | @Mira + @Katherine | `npm run typecheck && npm run test:run -- server/routes/linda.routes.test.ts server/routes/nadia.routes.test.ts server/routes/nadia.assistant.test.ts` | Planned |
| W8-002 | S1     | Execute medium-fix bucket for notifications/compliance route cohesion | @Mira + @Katherine | `npm run test:run -- server/routes/henry.routes.test.ts && npm run build`                                                                              | Planned |
| W8-003 | S1     | Execute deep-refactor bucket only after W8-001/W8-002 pass            | @Mira + @Gwynne    | `npm run quality:quick`                                                                                                                                | Planned |
| W8-004 | S2     | Revisit deferred Phase 26 item and decide closeout path               | @Margaret          | `npm run plans:validate`                                                                                                                               | Planned |
| W8-005 | S3     | Confirm Wave 08 bundle + tracker consistency + queue promotion rules  | @Margaret + @Ada   | `npm run plans:validate`                                                                                                                               | Planned |

## Completion Rule

No item is marked complete until validation output is reflected in:

- `plans/PENDING_TASKS_ONLY.md`
- `PROJECT_PROGRESS.md`
- `DAILY_MILESTONE_TRACKER.md`
