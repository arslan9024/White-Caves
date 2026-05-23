# WAVE_07_SDD.md

## Wave

- **Wave ID:** WAVE_07
- **Theme:** Auth Reliability + Post-Login UX Refactor Foundation
- **Priority:** P0
- **Date:** 2026-05-22

## Objective

Stabilize Google/Firebase login first (no backend-sync bypass), then establish the execution architecture for full refactor of authenticated UX: **Profile v2 + Dashboard v2**.

## Scope (This Wave)

1. Fix social-login reliability in `useSignIn` (backend sync required).
2. Fix tests to enforce strict authentication contract.
3. Publish cross-team implementation plan with explicit hook/subagent/copilot references.

## Non-Goals (This Wave)

- Complete dashboard visual replacement.
- Complete profile UI rebuild.
- Remove all legacy layout files in one pass.

---

## Architecture Decisions

### A1 — Auth Session Contract (Immediate)

- Login is considered successful **only** when backend session/token setup succeeds.
- Firebase popup success without backend sync is treated as failure for protected routes.
- Best-effort Firebase sign-out on sync failure to avoid inconsistent session states.

### A2 — Hook-Oriented Separation

- Side effects in hooks/services only.
- `useSignIn` owns social flow + backend sync gate.
- Next wave will add session-selector facade for app bootstrap, guards, and socket.

### A3 — Refactor Delivery Mode

- Full refactor objective, shipped in macro/huge-waves.
- Full refactor objective, shipped in micro-waves.
- Keep route hosts stable while replacing internals incrementally.

---

## Copilot Collaboration Matrix

### Instruction Layer

- `.github/instructions/agentic-workflow.instructions.md`
  - Handoff packet required per macro/huge-wave.
  - Handoff packet required per micro-wave.
- `.github/instructions/typescript.instructions.md`
  - strict-safe DTO contracts, no silent async failures.

### Skills Layer

- `.github/skills/ts-typecheck-triage/SKILL.md`
- `.github/skills/security-audit/SKILL.md`
- `.github/skills/pr-review-checklist/SKILL.md`
- `.github/skills/release-readiness/SKILL.md`

### Prompt Layer

- `.github/prompts/macro-huge-wave-implementation.prompt.md`
  - reused as the macro/huge-wave execution prompt for auth/profile/dashboard bundles with acceptance criteria.
- `.github/prompts/micro-wave-implementation.prompt.md`
  - reused to run auth/profile/dashboard waves with acceptance criteria.

---

## Subagent / Hook Handoff Contract

### Task Packet Format (Mandatory)

- Task ID
- Owner
- Files touched
- Acceptance criteria (>=3 measurable)
- Validation commands
- Blocker status
- `CONSUMES←...` + `FEEDS→...`

### Wave 07 Handoffs

1. **AUTH-07-001**
   - `CONSUMES←Explore: auth flow map`
   - `FEEDS→Mira: useSignIn implementation`
2. **AUTH-07-002**
   - `CONSUMES←Mira: updated useSignIn`
   - `FEEDS→Katherine: integration test assertions`
3. **PLAN-07-003**
   - `CONSUMES←AUTH-07-001/002 outcomes`
   - `FEEDS→Ada/Margaret: Wave 08–10 execution packet`

---

## Files in Direct Implementation Track

- `src/hooks/useSignIn.ts`
- `src/hooks/useSignIn.test.ts`
- `src/App.tsx` (next wave)
- `src/hooks/useUserProfile.ts` (next wave)
- `src/pages/auth/ProfilePage.tsx` (next wave)
- `src/hooks/useUnifiedDashboard.ts` (next wave)
- `src/pages/UnifiedDashboardPage.tsx` (next wave)

---

## Risks & Controls

1. **Risk:** Regression in social signup flow.
   - **Control:** Keep signup path working when backend sync succeeds; block only sync-failure bypass.
2. **Risk:** UI teams move ahead before auth stabilization.
   - **Control:** Hard gate: Wave 07 auth tests green before Profile/Dashboard visual migration.
3. **Risk:** State duplication (`auth` vs `user`) causes future instability.
   - **Control:** Schedule selector facade in Wave 08 as first task.

---

## Exit Criteria

- `useSignIn` no longer allows Firebase-only fallback login/signup progression.
- Focused tests pass for social auth success/failure paths.
- Wave 08 backlog references this SDD and consumes validated auth contract.
