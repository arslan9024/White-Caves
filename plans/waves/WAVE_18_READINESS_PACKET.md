# Wave 18 — Readiness Packet

**Wave:** 18  
**Focus:** World-Class Auth + Profile-First Onboarding + Role-Based Dashboards  
**Status:** 📋 Planned  
**Date:** 2026-05-25  
**Readiness Goal:** 60% unlock / 90% target

---

## Prerequisite Gate

| Gate | Check | Status |
| --- | --- | --- |
| Wave 17 complete | UI/UX luxury upgrade closeout complete | ✅ Complete |
| Canonical planning synced | `MASTER_PLAN`, `PENDING_TASKS_ONLY`, `waves/README` updated with Wave 18 | ✅ Complete |
| Wave artifact bundle present | SDD + Readiness + Backlog + Test Rollout files exist | ✅ Complete |
| Coding approval phrase issued | `@Ada — Context Ready (60% Readiness) — Coding Phase Approved` | ⏳ Pending |

---

## Free-Agent Pre-Work Checklist

| Agent | Output Target | Acceptance Criteria | Status |
| --- | --- | --- | --- |
| @Daniela | `wave-18-auth-security.md` | WebAuthn model, refresh rotation contract, trusted-device schema defined | ⏳ Pending |
| @Basma | `wave-18-auth-audit.md` | Auth event taxonomy + audit payload + breach notification SLA documented | ⏳ Pending |
| @Marissa | `wave-18-onboarding-ux.md` | Multi-step onboarding UX with mandatory/optional step split + progress logic | ⏳ Pending |
| @Joelle | `wave-18-dashboard-personalization.md` | Role-group welcome content + quick-start checklist mapped by role | ⏳ Pending |
| @Vera | `wave-18-auth-threats.md` | ASVS L2 audit against current auth stack + top-5 mitigation priorities | ⏳ Pending |

---

## Technical Readiness Matrix

| Check | Requirement | Status |
| --- | --- | --- |
| Data model design | User/profile completion fields + WebAuthn/TrustedDevice schema accepted | ⏳ Pending |
| API contract definition | New auth/session/profile endpoints mapped with request/response structure | ⏳ Pending |
| Security controls | Rate-limit matrix + audit event schema approved | ⏳ Pending |
| Frontend flow contract | profile-first gate + onboarding wizard state machine documented | ⏳ Pending |
| Dashboard routing contract | Role-group routes + shell mapping finalized | ⏳ Pending |
| Regression matrix | Auth/session/profile/dashboard tests enumerated | ⏳ Pending |

---

## 60% Readiness Unlock Definition

Wave 18 unlocks coding when:

1. At least 3 of 5 free-agent outputs are committed and reviewed.
2. Data model + endpoint contracts are frozen in the Wave 18 bundle.
3. Regression test matrix exists in `WAVE_18_TEST_ROLLOUT.md`.
4. Canonical trackers remain in sync and `npm run plans:validate` passes.
5. Approval phrase is issued exactly:

```
@Ada — Context Ready (60% Readiness) — Coding Phase Approved
```

---

## 90% Readiness Target

Wave 18 reaches 90% when all five free-agent outputs are integrated, endpoint payload examples are finalized, and high-risk flows (session rotation + onboarding gate + dashboard router) have explicit rollback notes and validation commands defined.

