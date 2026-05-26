# White Caves Real Estate — Master Plan (Canonical)

**Purpose:** Canonical roadmap for execution decisions.  
**Owners:** @Ada + @Margaret  
**Last Updated:** 2026-05-26  
**Update cadence:** Weekly roadmap refresh (daily execution goes to `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`)

---

## Status Snapshot

- N+1 through N+9 implementation stream: **✅ Completed**
- Wave 08 stabilization/governance pass: **✅ Completed**
- Active implementation focus: **Wave 18 (workflow parity audit closeout) → Wave 19 (Identity & Access v2 + MD workspace split)**
- Canonical planning stack: `MASTER_PLAN.md` + `PENDING_TASKS_ONLY.md` + `waves/README.md`
- Superseded Wave 12 market-intelligence documents were archived to avoid naming collisions with the active automation Wave 12 bundle

### AEGIS Turn Log (Autopilot)

- **Turn 1 (2026-05-27)** — `AEGIS-T1-ORCH-HEALTH-001`
  - Scope: Orchestrator stability hygiene + planning trace reliability.
  - Files: `scripts/orchestrator/ten-task-loop.ps1`, `plans/AEGIS_CURRENT_RUN.md`, `plans/MASTER_PLAN.md`.
  - Result: Replaced unapproved PowerShell helper verb with approved verb naming to improve health/lint compliance in orchestrator diagnostics.
  - Validation target: `npm run build` (must pass).

---

## Implementation Operating Model

| Step | Purpose                                                          | Canonical artifact                                                            |
| ---- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1    | Confirm roadmap order and status                                 | [`MASTER_PLAN.md`](./MASTER_PLAN.md)                                          |
| 2    | Confirm the live queue and entry gate                            | [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)                            |
| 3    | Open the ordered execution bundle                                | [`waves/README.md`](./waves/README.md)                                        |
| 4    | Implement only against approved source backlogs and bundle tasks | `plans/waves/WAVE_##_*`                                                       |
| 5    | Close out with tracker updates + governance validation           | `PROJECT_PROGRESS.md`, `DAILY_MILESTONE_TRACKER.md`, `npm run plans:validate` |

---

## Active Execution Ladder

| Sequence | Wave | Objective                                                                                       | Owners                                              | Status      | Source Backlog(s)                                                                                                                                                                                                                                                                                                                                      | Entry Gate                                                              | Exit Criteria                                                                                                                      |
| -------- | ---- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 0        | 08   | TypeScript/errors stabilization                                                                 | @Mira + @Katherine                                  | ✅ Complete | Governance + stabilization bundle                                                                                                                                                                                                                                                                                                                      | `npm run plans:validate` + baseline clean                               | TypeScript baseline confirmed green                                                                                                |
| 1        | 09   | UX loading-state + interaction hardening                                                        | @Una + @Lea + @Tracy + @Inas                        | 🟢 Ready    | [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md)                                                                                                                                                                                                                                                                                                           | S1 green + readiness 72% + @Ada approval phrase                         | Items 30–33 closed; typecheck/lint/build + wave validation green                                                                   |
| 2        | 10   | Performance + SEO + security uplift                                                             | @Ruchi + @Rachel + @Radia                           | 📋 Planned  | [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md), [`IMPROVEMENTS_SEO.md`](./IMPROVEMENTS_SEO.md), [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md)                                                                                                                                                                               | Wave 09 green + readiness 65% + @Ada approval phrase                    | Perf/SEO/security tasks closed; typecheck/lint/build + wave validation green                                                       |
| 3        | 11   | Incomplete features closure + architecture refactor                                             | @Ada + @Mira + @Barbara                             | 📋 Planned  | [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md), [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md)                                                                                                                                                                                                       | Wave 10 green + readiness 60% + @Ada approval phrase                    | Scheduler/documents/email + architecture tasks closed; wave validation green                                                       |
| 4        | 12   | Automation engine (cron + documents + email wiring)                                             | @Cron + @Puppeteer + @Handlebars + @Mira            | 📋 Planned  | [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) items 6–8                                                                                                                                                                                                                                                               | Wave 11 green + readiness 60% + @Ada approval phrase                    | Automation bundle closed + tracker sync + governance validation green                                                              |
| 5        | 13   | Real-time notifications + media + virtual tours                                                 | @Socket + @Cloudinary + @Pannellum + @Mira          | ✅ Complete | [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md) items 10–12                                                                                                                                                                                                                                                             | Wave 12 green + readiness 60% + @Ada approval phrase                    | Real-time/media bundle closed + validation green                                                                                   |
| 6        | 14   | Product features closure                                                                        | @LeadScore + @Mortgage + @Zod + @Mira               | ✅ Complete | [`IMPROVEMENTS_PRODUCT.md`](./IMPROVEMENTS_PRODUCT.md) items 34–38                                                                                                                                                                                                                                                                                     | Wave 13 green + readiness 60% + @Ada approval phrase                    | Product feature bundle closed + validation green                                                                                   |
| 7        | 15   | Cache + PWA readiness                                                                           | @Redis + @PWA + @Ruchi + @Una                       | ✅ Complete | [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md), [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md)                                                                                                                                                                                                                                           | Wave 14 green + readiness 60% + @Ada approval phrase                    | Cache/PWA bundle closed + validation green                                                                                         |
| 8        | 16   | Security hardening + API versioning                                                             | @S5 + @Radia + @Mira                                | ✅ Complete | [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md), [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md)                                                                                                                                                                                                                             | Wave 15 green + readiness 60% + @Ada approval phrase                    | `/api/v1`, CSRF, error-envelope hardening closed + validation green                                                                |
| 9        | 17   | Full UI/UX luxury upgrade (design tokens + animations + mobile + PWA + WCAG 2.2)                | @Una + @Lea + @Tracy + @Africa + @Cyra + @Katherine | ✅ Complete | [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md), [`ui-ux-specification.md`](../../business_docs/06_design_architecture/ui-ux-specification.md)                                                                                                                                                                                                            | Wave 16 green + free-agent specs + readiness 60% + @Ada approval phrase | Glassmorphism + animations + mobile + PWA + WCAG 2.2 all closed; Lighthouse CI gate green                                          |
| 10       | 18   | Cross-platform workflow parity audit + prioritized gap backlog                                  | @Ada + @Margaret + @Mira + @Katherine               | 📋 Planned  | [`WAVE_18_WORKFLOW_PARITY_MATRIX.md`](./waves/WAVE_18_WORKFLOW_PARITY_MATRIX.md), [`functional-requirements.md`](../business_docs/05_requirements/functional-requirements.md), [`business_docs/04_workflows/README.md`](../business_docs/04_workflows/README.md)                                                                                       | Wave 17 green + readiness 60% + @Ada approval phrase                    | Parity matrix finalized, P0/P1/P2 gap queue generated, canonical plans updated, `npm run plans:validate` green                     |
| 11       | 19   | Identity & Access v2 + dashboard routing + MD workspace IA split + executive UX discoverability | @Ada + @Mira + @Una + @Katherine + @Radia           | 📋 Planned  | [`WAVE_19_SDD.md`](./waves/WAVE_19_SDD.md), [`WAVE_19_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_19_IMPLEMENTATION_BACKLOG.md), [`WAVE_19_TEST_ROLLOUT.md`](./waves/WAVE_19_TEST_ROLLOUT.md)                                                                                                                                                             | Wave 18 governance closeout + readiness 60% + @Ada approval phrase      | Auth/profile/routing gates green, MD split IA complete, UX state/discoverability evidence complete, `npm run plans:validate` green |
| 10       | 18   | Cross-platform workflow parity audit + prioritized gap backlog                                  | @Ada + @Margaret + @Mira + @Katherine               | 📋 Planned  | [`WAVE_18_WORKFLOW_PARITY_MATRIX.md`](./waves/WAVE_18_WORKFLOW_PARITY_MATRIX.md), [`WAVE_18_1_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_18_1_IMPLEMENTATION_BACKLOG.md), [`functional-requirements.md`](../business_docs/05_requirements/functional-requirements.md), [`business_docs/04_workflows/README.md`](../business_docs/04_workflows/README.md) | Wave 17 green + readiness 60% + @Ada approval phrase                    | Parity matrix finalized, top-20 P0 queue locked, canonical plans updated, `npm run plans:validate` green                           |

---

## Bundle Directory

Use [`waves/README.md`](./waves/README.md) for the full bundle list.

| Wave | Status      | Bundle                              |
| ---- | ----------- | ----------------------------------- |
| 08   | ✅ Complete | [`Wave 08`](./waves/WAVE_08_SDD.md) |
| 09   | 🟢 Ready    | [`Wave 09`](./waves/WAVE_09_SDD.md) |
| 10   | 📋 Planned  | [`Wave 10`](./waves/WAVE_10_SDD.md) |
| 11   | 📋 Planned  | [`Wave 11`](./waves/WAVE_11_SDD.md) |
| 12   | 📋 Planned  | [`Wave 12`](./waves/WAVE_12_SDD.md) |
| 13   | ✅ Complete | [`Wave 13`](./waves/WAVE_13_SDD.md) |
| 14   | ✅ Complete | [`Wave 14`](./waves/WAVE_14_SDD.md) |
| 15   | ✅ Complete | [`Wave 15`](./waves/WAVE_15_SDD.md) |
| 16   | ✅ Complete | [`Wave 16`](./waves/WAVE_16_SDD.md) |
| 17   | ✅ Complete | [`Wave 17`](./waves/WAVE_17_SDD.md) |
| 18   | 📋 Planned  | [`Wave 18`](./waves/WAVE_18_SDD.md) |
| 19   | 📋 Planned  | [`Wave 19`](./waves/WAVE_19_SDD.md) |

---

## Governance Hard Gate

1. Every planning update must run `npm run plans:validate`.
2. Active queue changes must be mirrored in:
   - `plans/PENDING_TASKS_ONLY.md`
   - `PROJECT_PROGRESS.md`
   - `DAILY_MILESTONE_TRACKER.md`
3. Completion claims require verification command evidence.
4. New active implementation bundles belong under `plans/waves/`.
5. Root/reference docs are context only unless explicitly promoted into the canonical stack.

---

## Canonical Links

- Queue: [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)
- Wave index: [`waves/README.md`](./waves/README.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Navigation: [`INDEX.md`](./INDEX.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Daily log: [`../DAILY_MILESTONE_TRACKER.md`](../DAILY_MILESTONE_TRACKER.md)

---

## Reference-Only Material

Historical and superseded planning material lives in `plans/archives/` or other reference folders under `plans/`.
Implementers should not treat those files as live status authority unless `MASTER_PLAN.md` or `PENDING_TASKS_ONLY.md` points back to them.
