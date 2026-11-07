# WAVE 08 — Test Rollout

**Date:** 2026-05-22  
**Status:** Planned

## Validation Sequence

1. **Governance check**  
   `npm run plans:validate`

2. **Scope-level stabilization checks**  
   `npm run typecheck`  
   `npm run test:run -- server/routes/linda.routes.test.ts server/routes/nadia.routes.test.ts server/routes/nadia.assistant.test.ts`  
   `npm run test:run -- server/routes/henry.routes.test.ts`

3. **Build + quick release checks**  
   `npm run build`  
   `npm run quality:quick`

## Pass Criteria

- Governance validation passes after each planning update.
- Stream S1 bucket validations pass with no new regressions.
- Canonical tracker files remain status-consistent.

## Failure Handling

- Revert the last inconsistent tracker mutation.
- Re-run `npm run plans:validate` before continuing.
