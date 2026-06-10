# Wave 19 — Readiness Packet

**Wave:** 19  
**Focus:** Identity & Access v2 + Dashboard Routing + MD Workspace IA Split  
**Status:** 🟢 Ready (planning)  
**Date:** 2026-05-26  
**Readiness Score:** 82% (planning bundle prepared; implementation pending approval)

---

## Entry Gate Checklist

| Gate | Requirement | Status |
| --- | --- | --- |
| Canonical stack aligned | `MASTER_PLAN` + `PENDING_TASKS_ONLY` + `waves/README` updated for Wave 19 | ✅ |
| Requirement IDs defined | `REQ-IAMV2-*`, `REQ-ROUTEV2-*`, `REQ-MDIA-*`, `REQ-UXMD-*` published | ✅ |
| Existing auth/routing baseline understood | Sign-in, profile page, dashboard route, role resolution reviewed | ✅ |
| Existing MD module architecture understood | CRM module registry + dashboard surfaces reviewed | ✅ |
| Validation gates drafted | Wave 19 test rollout includes auth/routing/IA/UX gates | ✅ |

---

## Baseline Validation Context (Pre-Wave)

- `npm run build` → ✅ pass
- `npm run lint` → ❌ pre-existing baseline errors
  - `server/services/SchedulerService.ts` (unreachable code)
  - `src/components/VirtualTour.tsx` (constant truthiness expression)
- `npm run test:run` → ❌ pre-existing suite failures (not introduced by Wave 19 planning docs)

Wave 19 scope here is planning-artifact updates only.

---

## Clarification Defaults (Locked for Wave 19 Planning)

1. Profile completion gate applies to all CRM-bound roles with role-specific required fields.
2. Forgot-password journey is specified for request/verify/reset/success + lockout/rate-limit coverage.
3. Biometric login is documented as optional convenience unless policy elevation is explicitly approved.
4. MD `/crm` entry defaults to the split workspace landing for creator/lion context.
5. Workspace mapping must avoid overlap ambiguity (single ownership per module).

---

## Required Approval Phrase for Implementation

```
@Ada — Context Ready (60% Readiness) — Coding Phase Approved
```

Wave 19 implementation (beyond planning docs) should not start without this gate.
