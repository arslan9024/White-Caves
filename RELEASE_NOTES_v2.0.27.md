# Release Notes — `v2.0.27` (AEGIS V5.0 Sovereign Orchestrator & AIAMS Release)

**Release Date:** 2026-11-07  
**Version:** `2.0.27`  
**Policy:** `2026.11.06-aegis-v5-unified-mesh-v1`

---

## Highlights

### 1. Package & Lockfile Restoration (`package.json` & `package-lock.json`)
- Restored full dependency and script parity between [`package.json`](file:///C:/Users/Dell/Documents/White-Caves/package.json) and `package-lock.json`, resolving `EJSONPARSE` and lockfile drift errors so `npm ci` and CI/CD pipelines execute cleanly.
- Bumped package version to `2.0.27` and added `aegis:compliance` (`node .agents/orchestrator/compliance-export.js`) and `aegis:skills-sync` scripts.

### 2. Phase 9 — Core-Loop Modularization, JSDoc & Test Expansion
- Completed full JSDoc documentation across all exported symbols in [`.agents/aegis/core-loop/`](file:///C:/Users/Dell/Documents/White-Caves/.agents/aegis/core-loop/turingCore.ts) linking to `AEG-001`–`AEG-042` and `TURING-LAW-000`.
- Fixed TypeScript compilation issues in [`turingCore.ts`](file:///C:/Users/Dell/Documents/White-Caves/.agents/aegis/core-loop/turingCore.ts), [`turingOrchestrator.ts`](file:///C:/Users/Dell/Documents/White-Caves/.agents/aegis/core-loop/turingOrchestrator.ts), [`turingQueue.ts`](file:///C:/Users/Dell/Documents/White-Caves/.agents/aegis/core-loop/turingQueue.ts), [`turingRequestContext.ts`](file:///C:/Users/Dell/Documents/White-Caves/.agents/aegis/core-loop/turingRequestContext.ts), and [`turingLogger.ts`](file:///C:/Users/Dell/Documents/White-Caves/.agents/aegis/core-loop/turingLogger.ts).
- Added [`src/__tests__/turingStressFuzz.test.ts`](file:///C:/Users/Dell/Documents/White-Caves/src/__tests__/turingStressFuzz.test.ts) and updated [`src/__tests__/turingQueue.integration.test.ts`](file:///C:/Users/Dell/Documents/White-Caves/src/__tests__/turingQueue.integration.test.ts) covering:
  - 120-task concurrent queue stress testing (`maxConcurrent` enforcement & peak tracking)
  - Dynamic rule hot-reload (`bumpRulesVersion`) and plugin lifecycle (`registerPlugin`)
  - Adversarial & malformed prompt fuzz testing
  - Circuit breaker state transitions, SHA-256 plan integrity verification, async request context propagation, and Prometheus metric counters.

### 3. Phase 10 — Final Polish, Graceful Shutdown & Compliance Export
- Implemented graceful `shutdown()` on `TuringOrchestratorCore` and `TuringQueue` to drain/reset active queues and idempotency keys cleanly.
- Added [`.agents/orchestrator/compliance-export.js`](file:///C:/Users/Dell/Documents/White-Caves/.agents/orchestrator/compliance-export.js) to generate machine-readable JSON compliance reports across all 42 statutory rules (`AEG-001`–`AEG-042`) and the 235-agent mesh.
- Modularized [`SignInPage.tsx`](file:///C:/Users/Dell/Documents/White-Caves/src/pages/auth/SignInPage.tsx), [`useSignInController.ts`](file:///C:/Users/Dell/Documents/White-Caves/src/pages/auth/components/useSignInController.ts), and [`useSignInSocial.ts`](file:///C:/Users/Dell/Documents/White-Caves/src/pages/auth/components/useSignInSocial.ts) so every file strictly obeys the `< 350` line Single-Purpose File Law (`AEG-042`).
