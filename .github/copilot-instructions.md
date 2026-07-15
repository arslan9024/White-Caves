# White Caves Copilot Instructions

> Repository-specific engineering guardrails for major web app development.
> These instructions are **authoritative for code generation and edits** in this repo.

## 1) Stack & Runtime Reality (Use this, not generic assumptions)

- **Frontend:** React 18 + TypeScript 5 + Vite
- **State:** Redux Toolkit (`src/store/store.tsx` + slices in `src/store/slices/**`)
- **Backend:** Express 5 + TypeScript + Prisma + MongoDB
- **Tests:** Vitest + Testing Library + Playwright (multi-browser)
- **Lint/Format:** ESLint 9 flat config + Prettier
- **Node:** >= 20.x

Always align implementations with these concrete technologies and existing scripts in `package.json`.

---

## 2) Architecture Rules (MANDATORY)

### 2.0 SDLC Code Standards (AEGIS Mode)

- **Adversarial Integrity:** All code is subject to adversarial review. Assume your code will be actively challenged by a QA agent for robustness, security, and side-effects.
- **Small Iterative Batches:** Do not rewrite massive files at once. Keep Diff sizes < 500 lines or risk automated rejection.
- **Goal Frame Consistency:** Ensure your changes strictly align with the `goal_frame` set during the Automated Discovery phase. Do not inject out-of-scope features.
- **Technical Debt:** Unused exports and dead code will be aggressively swept. Remove deprecated logic immediately when refactoring.

### 2.1 Frontend structure

- Keep page-level composition in `src/pages/**`.
- Keep reusable UI in `src/components/**`.
- Keep stateful domain logic in Redux slices/services/hooks, not inside presentational components.
- Use existing typed store hooks from `src/store/store.tsx`:
  - `useAppDispatch`
  - `useAppSelector`
- Reuse existing route/error boundaries (`RouteErrorBoundary`, protected route patterns) where applicable.

### 2.2 Backend structure

- Keep HTTP routing in `server/routes/**`.
- Keep business logic in `server/services/**` and controllers in `server/controllers/**`.
- Keep cross-cutting concerns in `server/middleware/**` (auth, RBAC, rate limits, request IDs, error handling).
- Reuse `AppError`, `asyncHandler`, and centralized `errorHandler` from `server/middleware/errorHandler.js` patterns.

### 2.3 No architectural drift

- Do not introduce competing frameworks/patterns when an existing pattern is already established.
- Do not create duplicate abstractions for store, logging, error handling, routing, or validation.
- Extend existing modules before creating new parallel systems.

---

## 3) Type Safety Rules (MANDATORY)

1. Preserve strict TypeScript discipline (`strict: true` in client/server tsconfig).
2. Prefer explicit types/interfaces for:
   - API payloads (request/response)
   - slice state
   - service return values
   - component props
3. Avoid `any`. If unavoidable, scope narrowly and document why inline.
4. Keep exported function signatures precise and stable.
5. Use discriminated unions for status/state flows where practical.

---

## 4) Error Handling + Logging Rules (MANDATORY for all new functions)

Every new non-trivial function must include appropriate failure handling and logging.

### 4.1 Backend

- Wrap async route handlers with existing `asyncHandler`.
- Throw/forward structured errors via `AppError` for predictable API responses.
- Log operational failures with existing logger (`server/utils/logger.js`).
- Never silently swallow errors.

### 4.2 Frontend

- Use `try/catch` around async service/thunk logic.
- Return/dispatch normalized user-safe error messages.
- Log diagnostics with existing logger utility (`src/utils/logger`) when available.
- Keep UI resilient (loading + error + empty states).

### 4.3 Logging quality

- Logs must include actionable context (module/function/entity IDs when relevant).
- Do not log secrets, raw tokens, passwords, or sensitive PII.

---

## 5) Modular & Testable Code Rules (MANDATORY)

1. Write small, composable functions with single responsibility.
2. Separate orchestration from pure logic where possible.
3. Add or update tests for behavior changes:
   - unit tests for core logic
   - integration/E2E where route/UI behavior changes
4. Prefer dependency injection or parameterization over hidden globals.
5. **No placeholders or omitted logic** in production code:
   - ❌ `[Action Required: Enforce production-ready engineering constraints]: implement`
   - ❌ stub returns that fake completion
   - ❌ incomplete branches hidden behind comments

If functionality is intentionally deferred, wire an explicit safe fallback + tracked task reference.

---

## 6) Implementation Quality Gates

Before finishing any meaningful change, verify:

1. **Types:** `npm run typecheck`
2. **Lint:** `npm run lint`
3. **Build:** `npm run build`
4. **Tests:** run targeted tests for changed scope (Vitest/Playwright as applicable)

If full matrix is too expensive, run focused scope checks first and clearly report what was/was not executed.

---

## 7) API & Security Expectations

- Validate input at route/service boundaries.
- Enforce auth/RBAC via existing middleware patterns.
- Respect existing rate-limit and CORS/security middleware setup.
- Keep responses consistent with existing API envelope conventions.
- Never bypass security checks for convenience.

---

- Free-planning agents MUST use only approved free models: Gemini 2.0 Flash / 1.5 Flash (Google AI Studio), Llama 3.1 70B / 3.3 70B (Groq), DeepSeek V3 / R1 (DeepSeek Chat), Mistral Small (Mistral Le Chat), Qwen2.5 72B (HuggingFace / Together.ai). See `plans/AGENT_SKILLS_UPGRADE_V3.md` for the full model assignment matrix by role type.
- Senior coding/design agents use GPT-4o by default for coding and verification.
- Claude 3.5 Sonnet is reserved for explicit complex architecture/design reviews by: @Ada, @Mira, @Barbara, @Una, @Daniela, @Framer, @Radia.

## 8) Frontend UX/Resilience Expectations

For any new UI surface:

- include loading state
- include error state
- include empty/no-data state
- preserve accessibility semantics (labels/roles/keyboard flow)
- avoid brittle selectors and flaky timing assumptions in tests

---

## 9) Editing Behavior for Copilot/Agents

When generating or modifying code in this repo:

1. Follow existing file-local style and naming conventions first.
2. Prefer minimal, vertical-slice changes over broad refactors.
3. Keep commits coherent by concern (frontend/backend/tests/docs).
4. Do not invent APIs/routes/state keys that conflict with existing contracts.
5. If uncertain, inspect neighboring files and mirror established patterns.

---

## 10) Definition of Done (DoD)

A task is done only when:

- Architecture patterns are respected
- Types are safe
- Error handling + logging are present in new functions
- Code is modular and testable
- No placeholder logic remains
- Relevant checks/tests pass or are explicitly reported with blockers

---

## 11) Quick Command Reference

- Dev: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Unit tests: `npm run test:run:unit`
- E2E (local chromium): `npm run test:e2e:local`
- E2E matrix: `npm run test:e2e:matrix`
- Orchestration dashboard (watch): `npm run orchestrator:dashboard:watch`
- Progress intelligence snapshot: `npm run orchestrator:progress:intel`
- Progress intelligence brief: `npm run orchestrator:progress:intel:brief`

Use these as defaults unless task scope requires something narrower.

---

## 11.1) Progress Visibility Requirement (MANDATORY)

For any multi-step implementation wave, ensure progress is measurable and visible:

1. Refresh progress intelligence (`orchestrator:progress:intel`) at least once per active cycle.
2. Verify dashboard reflects:
   - daily movement (`developed`, `fixed`, `upgraded`)
   - monthly movement (`developed`, `fixed`, `upgraded`)
   - ETA forecast toward the configured improvement target (`targetProjectBoostPct` in policy)
3. If ETA/velocity data is missing, treat it as an orchestration observability bug and fix it before closing the wave.

---

## 12) Governance Bridge (Read Before Multi-Agent Execution)

This file governs **engineering quality and implementation behavior**.

Decision order note: evaluate Rule 7 checklist first, then Rule 11 readiness requirements, then Rule 24 mode behavior, and finally Rule 25 runtime policy values.

For orchestration/governance rules (handoff contracts, readiness gates, approval phrases, FEEDS/CONSUMES/FEEDS_ACK, and agent routing), use:

- `AGENTS.md`
- `.github/instructions/agentic-workflow.instructions.md`
- `plans/CUSTOM_AGENTS_PLAN.md` (when applicable)

### Policy precedence

1. Engineering/code quality rules -> this file (`.github/copilot-instructions.md`)
2. Workflow/orchestration rules -> `AGENTS.md` + agentic workflow instructions

When rules overlap, follow both; when they conflict, apply precedence above and document the decision in task notes.

---

## 13) Autopilot Mode V3 (Wave Execution)

Use this mode when coding is approved for a wave by the exact phrase:
`@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`

### Execution Contract

1. Execute wave tasks strictly in the order listed in that wave's `IMPLEMENTATION_BACKLOG.md`.
2. After each task, run the inline validation command before continuing.
3. On validation failure, self-correct up to 2 retries.
4. If unresolved, mark task `BLOCKED` and escalate to `@Ada` + `@Katherine` with blocker details.
5. After finishing all tasks, run:
   - `npm run quality:quick`
   - `npm run plans:validate`
6. Publish completion via `report_progress`.

### Allowed Triggers

- `npm run orchestrator:agent-loop:autopilot`
- `npm run orchestrator:agent-loop:auto`
- `npm run orchestrator:agent-loop:auto:nobrowser`
- explicit command: `@Wave[N] — AUTOPILOT: execute all tasks`

### Mandatory Pause Conditions

- Hard build failure (`npm run build` non-zero)
- TypeScript failure (`npm run typecheck` non-zero)
- Security policy violation risk (credentials, XSS, injection, CSRF)
- Explicit human `PAUSE` instruction

### Prohibited During Autopilot

- Destructive DB actions (`DROP`, destructive/irreversible migration)
- Production secret/env rewrites
- Introducing a dependency not already approved in the active wave backlog
