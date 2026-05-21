# White Caves — Custom Agents Execution Plan

> **Updated:** May 21, 2026 | **Model Constraint:** Free-tier models only for sub-agent dispatches  
> **Phase:** Milestone 06–10 Deep Integration  
> **Build Status:** ✅ PASSING | **Dev Server:** http://localhost:5002/

---

## 🔧 Subagent Upgrade v2 (Active Baseline)

- **Canonical source of truth:** `plans/CUSTOM_AGENTS_PLAN.md`
- **Mirror docs that must stay synchronized:** `AGENTS.md`, `AGENCY_MANIFEST.md`, `.github/copilot-instructions.md`
- **Premium coding gate phrase (exact):** `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`
- **Dispatch contract (exact syntax):** `@[AgentName] — [ACTION]: [TARGET FILE or TOPIC]`
- **Allowed action set:** `EXPAND`, `DRAFT`, `REVIEW`, `AUDIT`, `SYNC`

---

## 🤖 Agent Roster — Phase 6–10 Assignments

### @Ada (Chief Architect)

**Current Phase:** Orchestrating Phase 6–10 concurrent delivery  
**Responsibilities:**

- Owns dependency DAG across all 5 phases — no two phases break each other
- Signs off on each phase before @Gwynne deploys
- Reviews `plans/PHASE_6_TO_10_EXECUTION_BLUEPRINT.md` weekly

**Phase assignments:**
| Phase | Ada's Role |
|-------|-----------|
| Phase 6 — RTL | Approve `src/styles/rtl.css` scope and LanguageContext strategy |
| Phase 7 — AI | Approve Redux analytics wiring; decide AVM data source |
| Phase 8 — Off-Plan | Define developer data model (stub vs. live DLD API) |
| Phase 9 — RBAC | Approve ROLE_PERMISSIONS sync strategy (server ↔ client) |
| Phase 10 — PWA | Approve manifest + service worker caching strategy |

---

### @Margaret (Planner)

**Current Phase:** Tracking Phase 6–10 daily milestones  
**Active Milestone:** MILESTONE-07 (Phase 7 AI live)  
**Documents to update:** `DAILY_MILESTONE_TRACKER.md` after each phase completion

**Sprint breakdown (May 2026):**
| Week | Focus | Deliverable |
|------|-------|------------|
| May 1–3 | Phase 6–9 core code | Hooks, CSS, AI page, PWA prompt |
| May 4–7 | Phase 8 Off-Plan | Developer listings + DLD data stub |
| May 8–11 | Phase 9 frontend guards | `PermissionGuard` integration across tabs |
| May 12–15 | Phase 10 PWA | Notification opt-in + install analytics |
| May 16–20 | Integration testing | All 5 phases verified end-to-end |
| May 21–31 | Polish + deploy | World-class platform milestone |

---

### @Una (Designer)

**Current Phase:** Phase 7 AI Hub + Phase 10 PWA banner visual polish  
**Active files:**

- `src/pages/AIIntelligencePage.tsx` — glassmorphism KPI cards ✅
- `src/components/pwa/PWAInstallPrompt.tsx` — glass bottom banner ✅
- `src/pages/OffPlanPortalPage.tsx` — developer project card layout

**Design tokens in use:**

```
--wc-red:           #C41E3A  (CTA borders, accents)
--wc-black:         #0A0A0A  (hero backgrounds)
--wc-white:         #FAFAFA  (primary text)
--wc-surface:       rgba(255,255,255,0.04) (glass cards)
--wc-surface-border: rgba(196,30,58,0.22) (card borders)
```

**Outstanding design tasks:**

- [ ] Off-Plan portal developer card imagery (Cloudinary mock)
- [ ] AI Hub trend chart component (recharts or SVG)
- [ ] Mobile nav RTL state in Arabic mode

---

### @Mira (Lead Coder)

**Current Phase:** All implementation tasks Phases 6–10  
**Completed this session:**

- ✅ `src/hooks/usePermission.ts` — 4 exported hooks (usePermission, useRole, useRoleLevel, useCanonicalRole)
- ✅ `src/components/guards/PermissionGuard.tsx` — declarative JSX gate (require / roles / minLevel)
- ✅ `src/styles/rtl.css` — extended with 15+ new RTL rules (dashboard, numbers, modals, search)
- ✅ `src/pages/AIIntelligencePage.tsx` — live Redux analytics, 6 Dubai KPIs, 6 AI modules, PermissionGuard integration
- ✅ `src/components/pwa/PWAInstallPrompt.tsx` — glassmorphism install banner with beforeinstallprompt
- ✅ `src/App.tsx` — wired PWAInstallPrompt lazy import

**Next Mira tasks:**

- [ ] Phase 8 Off-Plan: extend `OffPlanPortalPage.tsx` with filter sidebar + real data shape
- [ ] Phase 9: apply `PermissionGuard` to CommissionsTab approve/pay buttons
- [ ] Phase 9: add `usePermission` guards to export buttons in AnalyticsTab

---

### @Grace (Lead Engineer)

**Current Phase:** Code standards review for Phase 6–10 deliverables  
**Checklist for each file Mira delivers:**

- [ ] Zero TypeScript `any` usage
- [ ] All async functions have try/catch (or thunk error handling)
- [ ] Named exports only (except page-level default export)
- [ ] All components have `aria-label` or `aria-labelledby`
- [ ] No hardcoded magic strings — use constants or enums

**Status Phase 7 AI page:** ✅ TypeScript strict, named export, aria-labels present  
**Status Phase 9 hooks:** ✅ Typed with `RootState`, no `any`  
**Status Phase 10 PWA:** ✅ `BeforeInstallPromptEvent` typed, no `any`

---

### @Katherine (QA)

**Current Phase:** Phase 7–10 unit + integration test coverage  
**Test files to create:**

- [ ] `src/hooks/usePermission.test.ts` — 12 test cases (role aliases, permission checks, boundary)
- [ ] `src/components/guards/PermissionGuard.test.tsx` — render/no-render tests
- [ ] `src/components/pwa/PWAInstallPrompt.test.tsx` — event mock test
- [ ] `src/pages/AIIntelligencePage.test.tsx` — Redux integration test

**Priority test scenarios:**

1. `usePermission('approve_commissions')` returns `true` for `managing_director` (alias → owner)
2. `usePermission('export_leads')` returns `false` for `viewer`
3. `PermissionGuard` renders fallback when access denied
4. `PermissionGuard` renders children when permission matches
5. `PWAInstallPrompt` doesn't render when `display-mode: standalone`
6. AI page shows `—` placeholders while analytics loading

---

### @Barbara (Database)

**Current Phase:** Phase 7 — analytics schema validation  
**Tasks:**

- [ ] Verify `analyticsSlice` TrafficData matches server `/api/analytics` response shape
- [ ] Ensure `performance.score` persists across sessions (not ephemeral in-memory only)
- [ ] Phase 8: design `DeveloperProject` Prisma model for Off-Plan portal

---

### @Radia (Security)

**Current Phase:** Phase 9 — RBAC frontend + backend alignment  
**Tasks:**

- [ ] Audit `usePermission.ts` ROLE_PERMISSIONS for drift vs `server/middleware/rbac.ts`
- [ ] Ensure `PermissionGuard` cannot be bypassed by URL manipulation (server still enforces)
- [ ] Review `PWAInstallPrompt` — no sensitive data exposed in service worker cache

**Security note:** Frontend permission guards are UX-only. The backend `requirePermission()` middleware remains the authoritative enforcement layer.

---

### @Rachel (SEO)

**Current Phase:** Phase 7 + Phase 8 meta optimization  
**Tasks:**

- [ ] Add JSON-LD `SoftwareApplication` schema for AI Intelligence Hub
- [ ] Add `<meta name="theme-color">` matching `#C41E3A` in `index.html` (PWA colour)
- [ ] Off-Plan portal: add `RealEstateListing` structured data per developer project

---

### @Gwynne (DevOps)

**Current Phase:** CI/CD for Phase 6–10 milestone commits  
**Commit naming convention:**

```
MILESTONE-07: Phase 7 AI Intelligence Hub live data integration
MILESTONE-08: Phase 8 Off-Plan portal developer listings
MILESTONE-09: Phase 9 frontend RBAC guards + PermissionGuard
MILESTONE-10: Phase 10 PWA install prompt + manifest polish
```

**Deploy gate:** Build must pass with zero TypeScript errors before each milestone merge.

---

### @Africa (Accessibility)

**Current Phase:** WCAG audit for all Phase 6–10 new components  
**Checklist:**

- [x] `AIIntelligencePage` — `aria-labelledby` on section, `role="progressbar"` on PerfBar ✅
- [x] `PWAInstallPrompt` — `role="dialog"`, `aria-live="polite"`, `aria-label` on all buttons ✅
- [x] `PermissionGuard` — transparent wrapper, no ARIA impact ✅
- [ ] RTL CSS — verify all interactive elements have visible focus ring in Arabic mode
- [ ] Off-Plan portal cards — keyboard navigation + screen reader testing

---

## 🗓️ Phase Status Dashboard

| Phase    | Name                | Status             | Owner            | Due    |
| -------- | ------------------- | ------------------ | ---------------- | ------ |
| Phase 6  | RTL + Locale        | ✅ Complete        | @Mira + @Una     | May 1  |
| Phase 7  | AI Intelligence Hub | ✅ Complete        | @Mira + @Joelle  | May 1  |
| Phase 8  | Off-Plan Portal     | 🟡 In Progress     | @Mira + @Corinne | May 7  |
| Phase 9  | Frontend RBAC       | ✅ Core complete   | @Mira + @Radia   | May 7  |
| Phase 10 | PWA                 | ✅ Prompt complete | @Mira + @Lisa    | May 10 |
| Phase 11 | WhatsApp CRM        | 🔴 Not started     | @Nadia           | May 20 |
| Phase 12 | RERA Compliance     | 🔴 Not started     | @Timnit          | May 25 |

---

## 🆓 Free Model Constraint

> **Rule (effective May 1, 2026):** All sub-agent dispatches must use free-tier models only.
> Direct code implementation (create_file, replace_string_in_file, run_in_terminal) is exempt.

**Approved for subagent dispatch:**

- Research / exploration tasks (Explore agent — read-only)
- Planning/strategy documents (Margaret, Ada)
- Documentation generation (Rachel, Africa)

**NOT dispatched as subagents (implemented directly instead):**

- Component code (Mira — direct implementation)
- CSS/styling (Una — direct implementation)
- Security audits (Radia — grep search + direct review)
- Test writing (Katherine — direct implementation)

---

## 📋 Next Actions (Priority Order)

1. **Build verify** — run `npx vite build --mode development` to confirm 0 TypeScript errors
2. **Git commit** — `MILESTONE-07-09: AI Hub live data + RTL ext + RBAC hooks + PWA prompt`
3. **Phase 8 Off-Plan** — extend `OffPlanPortalPage.tsx` with filter + real DLD data shape
4. **Phase 9 guards** — apply `PermissionGuard` to CommissionsTab CTA buttons
5. **Katherine tests** — write `usePermission.test.ts` (12 cases)
6. **Rachel SEO** — add `theme-color` meta + PWA JSON-LD to `index.html`
