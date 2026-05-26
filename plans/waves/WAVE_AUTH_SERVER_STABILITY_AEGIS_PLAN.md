# WAVE_AUTH_SERVER_STABILITY_AEGIS_PLAN

## Objective

Stabilize dev server startup and complete MD Google auth/profile reliability fixes for `arslanmalikgoraha@gmail.com`.

## Task ID

Aegis-Auth-Server-2026-05-25

## Scope

- Server startup crash path (`EADDRINUSE` behavior + startup reliability)
- Google social login for Managing Director account
- Post-login routing/profile visibility consistency
- Superuser role/status enforcement across auth paths

## 6-Step AEGIS Execution Plan

### Step 1 — Proper pull/sync baseline

- **Files touched**: repository state only
- **Acceptance criteria**:
  1. Branch synchronized with `origin/main`
  2. Merge conflicts resolved
  3. Working tree returns to actionable state
- **Validation**: `git pull --rebase origin main`, conflict resolution, `git status`

### Step 2 — Resolve startup crash blocker

- **Files touched**: runtime/session ops + server bootstrap verification
- **Acceptance criteria**:
  1. Port conflict root cause identified (`3001` occupancy)
  2. Dev server can restart after stale process cleanup
  3. Crash no longer blocks iterative auth testing
- **Validation**: `Get-NetTCPConnection -LocalPort 3001`, `npm run dev`

### Step 3 — MD Google login hardening (backend)

- **Files touched**: `server/routes/auth.ts`
- **Acceptance criteria**:
  1. `firebase-sync` always forces superuser role to `managing_director`
  2. `firebase-sync` always forces superuser status to `active`
  3. Response user payload returns role/status explicitly
- **Validation**: targeted route review + auth flow run

### Step 4 — Auth flow consistency (frontend)

- **Files touched**: `src/hooks/useSignIn.ts`, `src/services/authService.ts`, `src/hooks/useSignIn.test.ts`
- **Acceptance criteria**:
  1. Social/email login route resolution is deterministic
  2. Superuser skips role friction and lands in CRM route
  3. Error handling remains user-safe and retry-capable
- **Validation**: `npm run test:run -- src/hooks/useSignIn.test.ts`

### Step 5 — Profile visibility guarantee

- **Files touched**: `server/routes/auth.ts`, frontend auth/profile integration paths
- **Acceptance criteria**:
  1. Token-backed `/api/auth/profile` request succeeds post-login
  2. Superuser profile fields (email/role/status) are available
  3. No post-login redirect loop to signup/role pages
- **Validation**: runtime auth test in dev session

### Step 6 — Aegis validation gate

- **Files touched**: changed auth/server files only
- **Acceptance criteria**:
  1. Targeted auth tests pass
  2. No TypeScript diagnostics for touched files
  3. Dev stack runs with client+server concurrently
- **Validation**: `npm run test:run -- src/hooks/useSignIn.test.ts`, `get_errors`, `npm run dev`

## Handoff Contract

- **Task ID**: Aegis-Auth-Server-2026-05-25
- **Files touched**: `server/routes/auth.ts`, `src/hooks/useSignIn.ts`, runtime startup terminal session
- **Acceptance criteria**: listed above per-step
- **Validation steps**: listed above per-step
- **Blocker status**: Active blocker tracked — stale local process on port 3001 can still interrupt startup unless terminated before/while running concurrent dev sessions
