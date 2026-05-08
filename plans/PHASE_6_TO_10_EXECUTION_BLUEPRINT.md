# White Caves — Phase 6 to Phase 10 Implementation Blueprint

**Date:** 2026-05-01
**Status:** IN PROGRESS
**Execution Mode:** Parallel sub-agent collaboration (Ada + Mira + Radia + Katherine)

---

## Objective
Implement the next 5 phases with concrete starter code, clear ownership, and high team throughput:

- **Phase 6:** Arabic + RTL
- **Phase 7:** Data & AI Intelligence
- **Phase 8:** Off-Plan Portal + Syndication foundations
- **Phase 9:** Multi-user RBAC hardening
- **Phase 10:** PWA + Mobile-readiness

---

## Sub-agent Outputs Consolidated

### @Ada (Architecture)
- Enforce dependency order: **6 → 7 → 8 → 9 → 10**
- Build shared foundation first (flags, test gates, reusable infra)
- Keep each phase behind incremental rollout boundaries

### @Mira (Frontend)
- Add locale switch + RTL utilities for immediate Phase 6 progress
- Add AI intelligence and Off-Plan route/page scaffolding for Phases 7/8
- Keep all additions strict TypeScript and accessible

### @Radia (Security)
- Expand permission map for commission approval/export and data access controls
- Keep RBAC checks server-side only
- Add auditable security posture for Phase 9 rollout

### @Katherine (QA)
- Add deterministic test scaffolding for RTL and module smoke tests
- Keep smoke verification fast (build + boot) to preserve velocity

---

## This Session — Implemented Scope

1. **Phase 6 (Arabic/RTL):**
   - Add reusable locale helper hook (using existing `LanguageContext`)
   - Add shared language switcher component

2. **Phase 7/8 (AI + Off-plan):**
   - Add AI Intelligence page scaffold
   - Add Off-Plan portal page scaffold
   - Wire routes in `App.tsx`

3. **Phase 9 (RBAC):**
   - Extend backend role permissions with commission and export capabilities

4. **Phase 10 (PWA):**
   - Add service worker registration utility
   - Register SW at app startup

---

## Efficiency Multipliers Applied

- Parallel planning by specialized agents before implementation
- Small, merge-safe scaffolding increments instead of massive risky PRs
- Route-level scaffolding to unlock parallel module development
- Security capability introduced early (before feature sprawl)

---

## Next Sprint (immediate)

- Integrate language switcher into public header and dashboard top bar
- Connect AI Intelligence page to real analytics slice / API
- Connect Off-Plan page to listing source adapter (PF/Bayut integration boundaries)
- Add Playwright smoke tests for `/ai-intelligence` and `/off-plan`
- Add CI quality gate for RBAC unit tests
