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
