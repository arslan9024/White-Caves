# WAVE_07_IMPLEMENTATION_BACKLOG.md

## Wave Goal

Ship login reliability fix now and prepare strict execution graph for profile/dashboard full refactor.

## Backlog

### AUTH-07-001 — Enforce backend-sync gate in social login

- **Owner:** Mira
- **Files:** `src/hooks/useSignIn.ts`
- **CONSUMES←** Explore auth-flow audit
- **FEEDS→** AUTH-07-002 test updates
- **Acceptance Criteria:**
  1. No fallback navigation on backend sync failure.
  2. Sync failure sets user-visible error.
  3. Best-effort Firebase session cleanup occurs.
- **Status:** ✅ Completed

### AUTH-07-002 — Update integration tests for strict auth contract

- **Owner:** Katherine
- **Files:** `src/hooks/useSignIn.test.ts`
- **CONSUMES←** AUTH-07-001 code change
- **FEEDS→** Wave gate validation
- **Acceptance Criteria:**
  1. Signin mode sync failure does not navigate.
  2. Signup mode sync failure does not advance steps.
  3. Success path behavior remains intact.
- **Status:** ✅ Completed

### QA-07-003 — Focused validation

- **Owner:** Katherine
- **Commands:** `npx vitest run src/hooks/useSignIn.test.ts`
- **Acceptance Criteria:**
  1. All tests in target file pass.
  2. No TS diagnostics in changed files.
- **Status:** ✅ Completed

---

## Next Wave Queue (Wave 08 kickoff)

### AUTH-08-001 — Session selector facade

- Introduce canonical selectors used by App bootstrap + route guards + socket.
- **Files:** `src/store/selectors/sessionSelectors.ts`, `src/App.tsx`, `src/hooks/useSocket.ts`
- **Status:** ✅ Completed

### PROFILE-08-002 — Canonical profile API path unification

- Migrate active runtime profile writes to one endpoint contract.
- **Files:** `src/components/portal/PortalProfileTab.tsx`, `src/components/portal/PortalProfileTab.test.tsx`
- **Status:** ✅ Completed

### DASH-08-003 — Authenticated shell DSv2 scaffold

- Introduce shared post-login shell primitives and migration adapters.
- **Files:** `src/components/layout/authenticated/AuthenticatedPageShell.tsx`, `src/pages/UnifiedDashboardPage.tsx`
- **Status:** ✅ Baseline scaffold completed (behavior-neutral wrapper + migration entry point)

### AUTH-08-004 — Social login recovery UX after backend sync failures

- Preserve strict backend-sync gate while guiding users with actionable retry flow.
- **Files:** `src/hooks/useSignIn.ts`, `src/pages/auth/SignInPage.tsx`, `src/pages/auth/AuthPages.css`, `src/hooks/useSignIn.test.ts`
- **Status:** ✅ Completed (recovery metadata + retry CTA + hook/UI focused tests)

### AUTH-08-007 — Social recovery dismiss control

- Add explicit dismiss action for social recovery prompt to reduce UI friction after transient failures.
- **Files:** `src/hooks/useSignIn.ts`, `src/pages/auth/SignInPage.tsx`, `src/pages/auth/AuthPages.css`, `src/pages/auth/SignInPage.test.tsx`
- **Status:** ✅ Completed (dismiss handler + UI action + regression test)

### AUTH-08-008 — Dismiss flow clears backend-sync error banner

- Ensure recovery dismissal removes both retry affordance and stale backend-sync error copy.
- **Files:** `src/pages/auth/SignInPage.test.tsx`
- **Status:** ✅ Completed (added regression assertion for error clearing on dismiss)

### AUTH-08-009 — Hook contract: clearSocialRecovery resets state

- Add hook-level regression coverage that `clearSocialRecovery()` clears both recovery metadata and sync error state.
- **Files:** `src/hooks/useSignIn.test.ts`
- **Status:** ✅ Completed (clearSocialRecovery contract assertion)

### AUTH-08-010 — Disable recovery dismiss during retry loading

- Prevent recovery-dismiss race conditions while social retry is in flight by disabling dismiss action when `loading` is true.
- **Files:** `src/pages/auth/SignInPage.tsx`, `src/pages/auth/SignInPage.test.tsx`
- **Status:** ✅ Completed (UI loading guard + regression test)

### AUTH-08-011 — Preserve recovery panel during retry attempt

- Keep social recovery UI mounted during retry so users get consistent loading state and action affordances.
- **Files:** `src/hooks/useSignIn.ts`, `src/pages/auth/SignInPage.test.tsx`
- **Status:** ✅ Completed (retry-specific hook behavior + UI regression coverage)

### AUTH-08-012 — Retry CTA loading-state guard coverage

- Ensure social recovery retry CTA becomes disabled and switches to loading copy (`Retrying...`) while retry is in flight.
- **Files:** `src/pages/auth/SignInPage.test.tsx`
- **Status:** ✅ Completed (loading-state retry CTA regression test)

### AUTH-08-013 — Recovery panel busy-state accessibility coverage

- Surface retry-in-progress state to assistive tech by exposing `aria-busy` on recovery panel and covering it in regression tests.
- **Files:** `src/pages/auth/SignInPage.tsx`, `src/pages/auth/SignInPage.test.tsx`
- **Status:** ✅ Completed (aria-busy wiring + busy-state regression test)

### AUTH-08-014 — Recovery reason refresh on repeated retry failures

- Ensure social recovery reason text updates to the latest backend-sync failure reason after retry attempts.
- **Files:** `src/pages/auth/SignInPage.test.tsx`
- **Status:** ✅ Completed (reason-refresh regression coverage)

### AUTH-08-015 — Social retry limit enforcement (macro auth resilience bundle)

- Enforce max social retry attempts with explicit user guidance and stop additional backend-sync calls beyond limit.
- **Files:** `src/hooks/useSignIn.ts`, `src/pages/auth/SignInPage.tsx`, `src/hooks/useSignIn.test.ts`, `src/pages/auth/SignInPage.test.tsx`
- **Status:** ✅ Completed (hook guard + UI behavior + hook/UI regression tests)

### AUTH-08-016 — Retries-remaining recovery visibility (macro auth resilience bundle)

- Expose retries-remaining counter from auth hook and render it in recovery UI so users see deterministic retry budget.
- **Files:** `src/hooks/useSignIn.ts`, `src/pages/auth/SignInPage.tsx`, `src/hooks/useSignIn.test.ts`, `src/pages/auth/SignInPage.test.tsx`
- **Status:** ✅ Completed (hook surface + UI hint + decrement regression coverage)

### DASH-08-005 — Dashboard profile completion guidance card

- Add post-login profile completeness guidance with direct CTA to `/profile`.
- **Files:** `src/pages/UnifiedDashboardPage.tsx`, `src/pages/UnifiedDashboardPage.css`, `src/pages/UnifiedDashboardPage.test.tsx`
- **Status:** ✅ Completed (UI card + responsive styles + rendering + CTA navigation/visibility tests)

### PROFILE-08-006 — Portal profile completion + save guard UX

- Add profile completion checklist and prevent no-op profile save submissions.
- **Files:** `src/components/portal/PortalProfileTab.tsx`, `src/pages/RolePages.css`, `src/components/portal/PortalProfileTab.test.tsx`
- **Status:** ✅ Completed (completion card + disabled save on unchanged values + focused tests)

---

## Dependency Order

1. AUTH-07-001
2. AUTH-07-002
3. QA-07-003
4. AUTH-08-001 ✅
5. PROFILE-08-002 ✅
6. DASH-08-003 ✅
7. AUTH-08-004 ✅
8. DASH-08-005 ✅
9. PROFILE-08-006 ✅
10. AUTH-08-007 ✅
11. AUTH-08-008 ✅
12. AUTH-08-009 ✅
13. AUTH-08-010 ✅
14. AUTH-08-011 ✅
15. AUTH-08-012 ✅
16. AUTH-08-013 ✅
17. AUTH-08-014 ✅
18. AUTH-08-015 ✅
19. AUTH-08-016 ✅
