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
- **Status:** ⏳ Not Started

---

## Dependency Order

1. AUTH-07-001
2. AUTH-07-002
3. QA-07-003
4. AUTH-08-001 ✅
5. PROFILE-08-002 ✅
6. DASH-08-003 (next)
