# Wave 18 — Implementation Backlog

**Wave:** 18  
**Focus:** World-Class Auth + Profile-First Onboarding + Role-Based Dashboards  
**Status:** 📋 Planned  
**Date:** 2026-05-25

---

| ID | Priority | Task | Owner | Validation | Status |
| --- | --- | --- | --- | --- | --- |
| W18-001 | P0 | Add Prisma user fields (`nationality`, `emiratesId`, `passportNumber`, `emailVerified`, `profileCompletedAt`) and new models (`WebAuthnCredential`, `TrustedDevice`) | @Barbara | `prisma generate && npm run typecheck` | 📋 Planned |
| W18-002 | P0 | Implement role-aware profile completeness scoring on `GET /api/auth/profile` (`profileCompletionPct`, `profileMissingFields`, `profileComplete`) | @Mira | auth route tests + typecheck | 📋 Planned |
| W18-003 | P0 | Add account recovery endpoints (`forgot-password`, `reset-password`, `verify-email`) | @Mira + @Daniela | auth route tests | 📋 Planned |
| W18-004 | P1 | Add magic-link login (`/magic-link/request`, `/magic-link/verify`) with signed short-lived token handling | @Mira | auth route tests | 📋 Planned |
| W18-005 | P1 | Add WebAuthn/passkey register + authenticate endpoints and persistence wiring | @Mira + @Radia | integration tests | 📋 Planned |
| W18-006 | P0 | Implement refresh-token rotation + active session list/revoke endpoints | @Mira + @Daniela | auth/session regression tests | 📋 Planned |
| W18-007 | P1 | Add trusted-device detection + new-device notification flow | @Mira | manual flow + unit checks | 📋 Planned |
| W18-008 | P0 | Update frontend post-login destination logic to enforce profile-first onboarding gate in `authSession.ts` | @Mira + @Una | `npm run test:run -- src/hooks/useSignIn.test.ts src/pages/auth/SignInPage.test.tsx src/utils/authFetch.test.ts src/services/authService.test.ts src/features/auth/components/BiometricLogin/BiometricLoginButton.test.tsx` | 📋 Planned |
| W18-009 | P0 | Add profile onboarding wizard overlay (steps, role-specific fields, progress, skip constraints) | @Una + @Lea | component tests + Playwright smoke | 📋 Planned |
| W18-010 | P0 | Add `DashboardRouter` and role-group dashboard shell routes | @Mira + @Una | route tests + role navigation tests | 📋 Planned |
| W18-011 | P1 | Add role-group welcome banners (first-login dismissable) | @Una + @Lea | component tests | 📋 Planned |
| W18-012 | P1 | Upgrade auth page UX with Wave 17 token style + Framer Motion transitions | @Una + @Cyra | visual smoke + Playwright | 📋 Planned |
| W18-013 | P1 | Add password strength meter (`zxcvbn`) in register + profile password change flow | @Una | component tests | 📋 Planned |
| W18-014 | P1 | Add magic-link tab in auth method UI | @Mira + @Una | component tests | 📋 Planned |
| W18-015 | P1 | Add profile email-verification banner when `emailVerified === false` | @Una | component tests | 📋 Planned |
| W18-016 | P1 | Add active sessions panel to Profile → Security tab | @Una + @Lea | component tests | 📋 Planned |
| W18-017 | P1 | Add passkey enrollment control to Profile → Security tab | @Una + @Mira | WebAuthn integration test | 📋 Planned |
| W18-018 | P2 | Add first-login welcome splash animation and one-time dismissal persistence | @Una + @Cyra | visual smoke | 📋 Planned |
| W18-019 | P2 | Add quick-start checklist card for first 7 days in dashboard | @Lea | component tests | 📋 Planned |
| W18-020 | P0 | Final wave validation and tracker sync | @Katherine | `npm run typecheck && npm run lint && npm run build && npm run plans:validate` | 📋 Planned |

---

## Autopilot Trigger

When `@Ada — Context Ready (60% Readiness) — Coding Phase Approved` is issued for Wave 18, execute tasks W18-001 → W18-020 in order.

```
@Wave18 — AUTOPILOT: execute all tasks
```

Autopilot hard stops: build failure, typecheck failure, security policy violation, explicit human PAUSE.

---

## Dependency Chain

```
W18-001 → W18-002/W18-003/W18-005/W18-006 (backend contract foundation)
W18-002 + W18-006 → W18-008 (post-login profile gate)
W18-008 → W18-009 → W18-010 (onboarding + dashboard routing path)
W18-010 → W18-011/W18-018/W18-019 (first-login UX layer)
W18-003/W18-004/W18-005/W18-006/W18-007 → W18-014/W18-016/W18-017 (auth UI surfaces)
All tasks → W18-020 closeout
```

