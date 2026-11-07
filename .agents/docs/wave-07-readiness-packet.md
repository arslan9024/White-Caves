# WAVE_07_READINESS_PACKET.md

## Wave

- **Wave ID:** WAVE_07
- **Name:** Google Login Reliability First + Full Refactor Planning Bootstrap
- **Readiness Target:** >=60%
- **Status:** READY

## 1) Business Readiness

- Priority explicitly confirmed by user: Google login fix first, then post-login dashboard/profile UX refactor.
- Acceptance intent: after successful login, user must have stable dashboard and profile update capability.
- Scope lock: authenticated experience only.

## 2) API Readiness

- Current canonical auth profile endpoint: `/api/auth/profile`.
- Current social sync endpoint: `/api/auth/firebase-sync`.
- Immediate rule: protected navigation requires backend sync success.
- Contract risk identified: parallel profile endpoints remain for legacy surfaces (address in Wave 08).

## 3) Data/State Readiness

- Known duplication: `auth` slice + `user` slice.
- Wave 07 patch avoids introducing new state branches.
- Planned for Wave 08: session selector facade (`selectSessionUser/selectSessionToken/selectIsAuthenticated`).

## 4) UX Readiness

- Immediate UX outcome: no false-success dashboard entry when backend sync fails.
- Planned UX program: Profile v2 + Dashboard v2 under new authenticated design system.
- Accessibility/performance requirements captured for next waves.

## 5) QA Readiness

- Focused test file available: `src/hooks/useSignIn.test.ts`.
- Required checks this wave:
  1. backend sync success -> navigates by role
  2. backend sync failure -> no navigation, explicit error
  3. signup mode sync failure -> no step advancement

## 6) Compliance / Sign-off Readiness

- No credential leakage or insecure fallback introduced.
- Error messages user-facing and explicit without exposing secrets.
- Handoff packet and validation logs included in wave docs.

---

## Evidence Summary

- Discovery completed for auth/profile/dashboard/hook architecture.
- Implementation started and focused tests passed.
- Planning artifacts created for coordinated full refactor delivery.

## Readiness Score

- Business: 5/5
- API: 4/5
- Data: 3/5
- UX: 4/5
- QA: 4/5
- Compliance: 4/5

**Total:** 24/30 = **80% (READY)**

---

## Blockers

- None for Wave 07 close.
- Known future blocker: legacy endpoint/layout duplicates (scheduled Wave 08+).
