# Wave 18 — Test Rollout Plan

**Wave:** 18  
**Focus:** World-Class Auth + Profile-First Onboarding + Role-Based Dashboards  
**Status:** 📋 Planned  
**Date:** 2026-05-25

---

## Test Matrix

| Area | Test Type | Validation Command / Tool | Pass Condition |
| --- | --- | --- | --- |
| Prisma schema changes | Typecheck + generate | `prisma generate && npm run typecheck` | Client generation succeeds; no new schema/type errors introduced |
| Profile completeness scoring | API route tests | auth route test suite (targeted) | `profileCompletionPct`, `profileMissingFields`, `profileComplete` returned correctly by role |
| Forgot/reset password | API route tests | auth route test suite (targeted) | Reset token lifecycle valid; expired/invalid token paths handled |
| Verify-email flow | API route tests | auth route test suite (targeted) | Verification path updates `emailVerified` and audits event |
| Magic-link flow | API route tests | auth route test suite (targeted) | Request + verify work; single-use guard enforced |
| WebAuthn register/authenticate | Integration tests | backend integration tests | Credential stored and validated; fallback auth still available |
| Refresh token rotation | API route tests | auth/session regression tests | Old refresh token invalidated after rotation; reuse rejected |
| Session list/revoke | API route tests | auth/session regression tests | Active sessions visible; revoke removes targeted session |
| Trusted-device detection | Unit + manual | targeted unit tests + manual verification | New device creates trusted-device record and alert path |
| Post-login profile-first gate | Frontend unit tests | `npm run test:run -- src/hooks/useSignIn.test.ts src/pages/auth/SignInPage.test.tsx src/utils/authFetch.test.ts src/services/authService.test.ts src/features/auth/components/BiometricLogin/BiometricLoginButton.test.tsx` | First/incomplete profiles route to `/profile?onboarding=true` |
| Profile onboarding wizard | Component + E2E smoke | targeted component tests + Playwright smoke | Required steps enforced; role-specific fields captured; completion redirects correctly |
| DashboardRouter role resolution | Route tests | targeted route/navigation tests | Role groups resolve to expected shell routes |
| Role welcome banner | Component tests | targeted component tests | First-login banner shows role-specific copy; dismiss works |
| Auth UI luxury refresh | Visual + smoke | `npm run build` + Playwright smoke | Glassmorphism and transitions render with no regressions |
| Password strength meter | Component tests | targeted auth component tests | Strength states and enforcement behavior match thresholds |
| Magic-link auth tab | Component tests | targeted auth component tests | Tab appears and submits request flow correctly |
| Email verification banner | Component tests | targeted profile component tests | Banner appears only when `emailVerified` false |
| Active sessions panel | Component tests | targeted profile component tests | Sessions list and revoke action flow render and work |
| Passkey enrollment UI | Integration test | WebAuthn integration test | Enrollment CTA triggers API and reflects status |
| First-login splash + quick-start checklist | Visual + component tests | Playwright smoke + targeted components | One-time splash behavior and 7-day checklist behavior are correct |

---

## Wave Closeout Validation

Run at wave closeout:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. `npm run plans:validate`

Record all outcomes in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md` before marking Wave 18 complete.

