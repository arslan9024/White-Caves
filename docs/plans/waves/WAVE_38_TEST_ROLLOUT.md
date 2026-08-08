# Wave 38 — Test Rollout

**Wave:** 38  
**Status:** planned  
**Date:** 2026-08-07

---

## Validation Matrix

| Scope | Validation Type | Target | Pass Criteria |
| --- | --- | --- | --- |
| State normalization | Behavior parity review | Refactored state flows | No functional regressions |
| Client consolidation | Contract/flow validation | Unified client migration slices | No auth/error-flow regressions |
| Performance optimization | Baseline vs post-change comparison | High-traffic frontend views | Measurable improvement or documented rationale |
| Rollback readiness | Rollback trigger review | State/client optimization slices | Explicit rollback criteria per slice |
| Planning sync | Script | `npm run plans:validate` | Pass |

## Suggested Commands

- `npm run plans:validate`
- Targeted frontend lint/typecheck/tests during implementation

## Evidence Capture

- state-boundary map
- client migration checklist
- performance delta summary
- rollback matrix and tracker snapshot
