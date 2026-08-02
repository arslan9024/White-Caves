# Homepage Public Site Modernization Backlog

> **Created**: 2026-06-07  
> **Status**: 📋 Planned  
> **Source**: User-requested homepage reliability + UX modernization scope  
> **Priority**: P0 public website reliability and conversion impact

---

## Objective

Upgrade the public homepage so it behaves like a modern, production-ready React experience:

- fix the live market data 500/fallback issue,
- remove duplicate or redundant homepage components,
- make homepage rendering more dynamic and event/state driven,
- improve UI/UX quality to a premium standard,
- ensure cards and homepage modules route correctly to listing/detail pages,
- preserve accessibility, responsiveness, and best-practice React architecture.

---

## Problem Statement

The public homepage currently has several gaps that reduce trust and conversion quality:

1. Live market data can fail with the visible message: `Live market data is temporarily unavailable. Showing trusted fallback data. (Server error 500 — please try again later)`.
2. Some homepage components look visually weak or inconsistent.
3. Duplicate or overlapping sections/components likely exist and should be consolidated.
4. Homepage composition should be more dynamic and state/event driven instead of feeling overly static.
5. Cards/components should route cleanly to their corresponding listing and detail pages.

---

## Scope Boundaries

### In scope

- Homepage public route reliability and UI behavior
- Live market data request/fallback flow on homepage
- Homepage card routing and CTA navigation
- Removal/consolidation of duplicate homepage components
- Dynamic composition triggers for homepage sections
- Responsive, accessible UI/UX uplift

### Out of scope

- Full CRM dashboard redesign
- Non-homepage backend feature work unrelated to homepage data dependencies
- New unrelated marketing pages unless needed for homepage route correctness

---

## Workstream Backlog

| Task ID | Priority | Workstream | Files Touched (expected) | Acceptance Criteria | Validation | Blocker Status |
| --- | --- | --- | --- | --- | --- | --- |
| HPM-001 | P0 | Fix homepage live market data 500 root cause and preserve graceful fallback | `src/pages/HomePage.tsx`, homepage data hooks/services, relevant backend market-data endpoint/service | Homepage no longer shows broken 500 path during normal operation; fallback remains user-safe and trusted when upstream data fails; loading/error/fallback states are explicit | Homepage manual check, targeted API check, `npm run typecheck`, `npm run build` | None |
| HPM-002 | P0 | Audit and remove duplicate/redundant homepage components or repeated visual sections | `src/pages/HomePage.tsx`, `src/components/homepage/**`, shared UI components | Duplicate UI blocks consolidated into reusable components; no conflicting duplicate sections remain | Visual diff/manual QA, component smoke test, `npm run typecheck` | None |
| HPM-003 | P1 | Make homepage composition more dynamic and event/state driven | `src/pages/HomePage.tsx`, homepage section orchestration hooks/components | Sections render based on state/events/data readiness/interaction triggers where appropriate; no brittle hardcoded sequencing where dynamic state should drive output | Manual interaction QA, targeted component checks, `npm run build` | None |
| HPM-004 | P0 | Correct homepage card and CTA routing to listing/detail destinations | Homepage cards/components, route helpers, affected page links | Property cards go to properties listing/detail pages; service cards go to services listing/detail pages; other cards route to the correct destination pages without dead links | Manual route verification, route smoke test, `npm run build` | None |
| HPM-005 | P1 | Upgrade homepage UI/UX to modern premium standard | `src/components/homepage/**`, shared UI primitives/styles | Better hierarchy, spacing, responsiveness, hover/focus/empty/error/loading states, accessibility, and visual consistency across homepage | Manual UX review, accessibility spot check, `npm run lint` if available, `npm run build` | None |
| HPM-006 | P0 | Validate rollout with production-safe evidence | affected homepage files + tests/docs if added | Changes are production-safe, validated, and documented with rollback notes | `npm run typecheck`, `npm run lint`, `npm run build`, targeted tests/manual QA | None |

---

## Detailed Acceptance Criteria

### HPM-001 — Live market data reliability

- The homepage market-data request no longer exposes a visible broken 500 path in normal flow.
- Backend and/or frontend error handling is normalized.
- Fallback data remains available as graceful degradation.
- User-facing messaging is trustworthy and non-alarming.
- Logging adds diagnostic context without leaking secrets.

### HPM-002 — Duplicate component removal

- Duplicate homepage sections are identified and removed.
- Shared presentation logic is consolidated into reusable components.
- No parallel/competing versions of the same homepage block remain.

### HPM-003 — Dynamic homepage behavior

- Section rendering is driven by data, state, viewport, interaction, or feature intent where appropriate.
- Homepage behavior feels dynamic and interactive rather than rigidly static.
- Changes follow existing React architecture instead of adding ad hoc patterns.

### HPM-004 — Route correctness

- Properties cards route to properties list/detail flows.
- Services cards route to services list/detail flows.
- Supporting homepage modules route to relevant destination pages.
- No dead links, circular links, or broken route transitions remain.

### HPM-005 — UI/UX uplift

- Homepage looks premium and visually coherent on mobile/tablet/desktop.
- Cards, section headers, CTAs, and spacing align with modern standards.
- Loading, error, empty, and hover/focus states are intentionally designed.
- Accessibility semantics and keyboard flow are preserved or improved.

---

## Validation Checklist

- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Manual homepage verification of market-data states
- [ ] Manual verification of card routing to listing/detail pages
- [ ] Mobile/tablet/desktop UI pass
- [ ] Accessibility spot check for homepage interactions

---

## Suggested Aegis Dispatch Packets

### Packet A — Reliability fix

- **Task ID**: HPM-001
- **Owner**: `@Mira`
- **Objective**: Fix live market data 500 flow on homepage while keeping graceful fallback behavior.
- **Input Artifacts**: `plans/PHASE_1_HOMEPAGE.md`, this backlog, homepage market-data codepath
- **Output Artifact**: validated homepage data flow + evidence notes
- **Acceptance Criteria**:
  1. Live market data no longer breaks homepage UX.
  2. Fallback state is graceful and user-safe.
  3. Validation evidence is captured.
- **Handoff**: `FEEDS→@Katherine: homepage market-data validation evidence`

### Packet B — Dynamic homepage architecture + dedupe

- **Task ID**: HPM-002/HPM-003
- **Owner**: `@Mira + @Una`
- **Objective**: Remove duplicate homepage components and modernize homepage composition into a dynamic, maintainable React flow.
- **Input Artifacts**: `plans/PHASE_1_HOMEPAGE.md`, this backlog, homepage component tree
- **Output Artifact**: deduplicated homepage architecture with dynamic section rendering
- **Acceptance Criteria**:
  1. Duplicate blocks removed.
  2. Dynamic rendering strategy implemented.
  3. UX quality improved without architectural drift.
- **Handoff**: `FEEDS→@Katherine: homepage component/routing regression checklist`

### Packet C — Route correctness + UX polish

- **Task ID**: HPM-004/HPM-005/HPM-006
- **Owner**: `@Una + @Katherine`
- **Objective**: Correct homepage card routing and finish premium UX/responsive/accessibility polish with validation.
- **Input Artifacts**: this backlog, homepage route map, destination pages
- **Output Artifact**: verified homepage routing + UX evidence bundle
- **Acceptance Criteria**:
  1. Homepage cards route correctly.
  2. UI/UX is polished across breakpoints.
  3. Validation gate passes or blockers are recorded.
- **Handoff**: `FEEDS→@Margaret: homepage modernization completion summary`

---

## Blockers to Watch

- Existing duplicate legacy homepage variants may be split across multiple folders/components.
- Market-data 500 may originate from backend integration rather than UI only.
- Some target detail pages may exist but need route normalization before homepage links can be corrected.

---

## Definition of Done

This backlog is complete when:

1. Homepage market-data experience is reliable and graceful.
2. Duplicate homepage components are consolidated.
3. Homepage behavior is more dynamic and interactive in a modern React way.
4. Card routing is correct across homepage sections.
5. UI/UX quality is visibly improved and responsive.
6. Typecheck/build/lint and targeted homepage validation evidence are recorded.
