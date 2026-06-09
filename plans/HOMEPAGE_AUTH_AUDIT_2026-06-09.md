# Homepage + Auth UX Audit — 2026-06-09

## Scope

- Homepage quality/status check
- Auth module quality/status check
- Post-login UX quality/status check
- Aegis autopilot progress visibility

## Executive Verdict

- **Homepage fixed 100%?** ❌ **No (not proven)**
- **Auth module world class?** ⚠️ **Partially strong, but not world-class yet**
- **Post-login UX best-in-class?** ⚠️ **Improved (profile-first) but test/quality debt remains**
- **Aegis progress visibility upgraded?** ✅ **Yes (daily exec summary now includes cumulative progress)**

## Evidence Collected

### 1) Homepage

- Route wiring present: `/` -> `HomePage` in `src/App.jsx`.
- Homepage implementation includes:
  - LCP-first direct hero loading (`LuxuryHeroSection`)
  - fallback featured properties
  - structured data (`PageMeta`, `StructuredData`)
  - lazy-loading of below-fold sections
- **Blocking quality signal:** `HomePage.test.tsx` suite fails due test environment/localStorage issue:
  - `TypeError: localStorage.getItem is not a function` in `src/store/navigationSlice.ts` initialization.

### 2) Auth Module

- Auth frontend stack includes:
  - modal sign-in UX with keyboard escape + focus trap
  - social auth with retry/recovery UX
  - biometric button path
  - role selection flow in sign-up path
  - profile-first post-login route logic in `useSignIn.ts`
- Auth backend includes:
  - JWT middleware
  - account + IP lockout checks
  - csrf hooks and logging/audit support
  - Firebase admin token verification path
- **Quality gaps:**
  - `SignInPage.test.tsx` has 1 failing test (navigation expectation mismatch): expected `/crm` but app now navigates to `/profile`.
  - Indicates test contract drift after UX routing change.

### 3) Post-login UX

- Post-login routing now resolves to `/profile` for CRM-eligible users (profile-first journey) in `useSignIn.ts`.
- This is a strategic UX improvement, but **test suite has not fully aligned** to this updated journey.

### 4) Global Type Safety / Stability Signals

- `npm run typecheck` currently fails with **21 errors across 7 server files**.
- Major failing areas:
  - Prisma model mismatch (`cadenceRule`, `leadId`, property verification fields)
  - JSON type incompatibilities in route handlers
  - stale `@ts-expect-error` directives
  - auth request typing mismatch (`name`/`phone` missing on `req.user` type)
- This blocks any “world class” readiness claim right now.

## Aegis Upgrade Outcome

- Enhanced `scripts/orchestrator/aegis-generate-exec-summary.js` to be robust to log encoding and include:
  - last autopilot activity date
  - cumulative all-time progress metrics
- Latest generated summary (`DAILY_EXEC_SUMMARY_2026-06-09.md`) now shows:
  - **Total logged sessions:** 788
  - **Successful:** 776
  - **Non-success:** 12
  - **Success rate:** 98.5%

## Priority Fix Plan (to reach “world class”)

1. **Fix server typecheck blockers** (TS21 errors) as top priority.
2. **Align auth tests with profile-first route** (update expected route in failing test).
3. **Stabilize homepage test harness** (`localStorage` mock compatibility in navigation slice tests).
4. Re-run quality gates:
   - `npm run typecheck`
   - focused auth/homepage tests
   - optional e2e smoke on signin -> profile -> role/dashboard flow

## Handoff Contract

- **Task ID:** `QA-AUDIT-2026-06-09`
- **Files touched:**
  - `plans/HOMEPAGE_AUTH_AUDIT_2026-06-09.md`
  - `scripts/orchestrator/aegis-generate-exec-summary.js`
  - `plans/DAILY_EXEC_SUMMARY_2026-06-09.md`
- **Acceptance criteria:**
  1. Clear yes/no verdict on homepage/auth quality claim.
  2. Evidence-backed list of blockers and test results.
  3. Prioritized remediation path.
- **Blocker status:**
  - Build-quality blocker exists: TS errors and failing tests.
