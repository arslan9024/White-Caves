# White Caves Real Estate — Master Plan (Canonical)

**Purpose:** Canonical roadmap for execution decisions.  
**Owners:** @Ada + @Margaret  
**Last Updated:** 2026-05-22  
**Update cadence:** Weekly roadmap refresh (daily progress in `PROJECT_PROGRESS.md`)

---

## Status Snapshot

- N+1 through N+9 implementation stream: **✅ Completed**
- Repo cleanup: **✅ Completed** — 293 legacy docs archived to `plans/archives/` and root cleaned
- Active planning focus: **Wave 08** (errors stabilization) → **Wave 09** (UX hardening) → **Wave 10** (performance)
- Planning authority centralized in `MASTER_PLAN.md` + `PENDING_TASKS_ONLY.md`

---

## Active Streams (Now)

| Stream | Objective                                                    | Owners                    | Status     | Entry Gate                                        | Exit Criteria                                                                    |
| ------ | ------------------------------------------------------------ | ------------------------- | ---------- | ------------------------------------------------- | -------------------------------------------------------------------------------- |
| S1     | Wave 08 — TypeScript/errors stabilization (fast/medium/deep) | @Mira + @Katherine        | 🔨 Active  | `npm run plans:validate` + baseline clean         | Typecheck clean + targeted suites pass; evidence in trackers                     |
| S2     | Wave 09 — UX loading-state & interaction hardening           | @Una + @Lea + @Katherine  | 📋 Planned | S1 green + readiness >=60% + @Ada approval phrase | IMPROVEMENTS_UX.md items 30–33 delivered; `quality:quick` pass                   |
| S3     | Wave 10 — Performance, SEO & security uplift                 | @Ruchi + @Rachel + @Radia | 📋 Planned | S2 green + readiness >=60% + @Ada approval phrase | IMPROVEMENTS_PERFORMANCE + IMPROVEMENTS_SEO + IMPROVEMENTS_SECURITY items closed |

---

## Micro-Wave Execution Target

| Wave | Focus                                                | Status     | Bundle                                                                                                                                                                                                                                                           |
| ---- | ---------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 08   | Errors stabilization + planning governance hard-gate | 🔨 Active  | [`WAVE_08_SDD.md`](./waves/WAVE_08_SDD.md), [`WAVE_08_READINESS_PACKET.md`](./waves/WAVE_08_READINESS_PACKET.md), [`WAVE_08_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_08_IMPLEMENTATION_BACKLOG.md), [`WAVE_08_TEST_ROLLOUT.md`](./waves/WAVE_08_TEST_ROLLOUT.md) |
| 09   | UX hardening — loading states, error boundaries, RTL | 📋 Planned | Create `waves/WAVE_09_*` bundle before execution; source: [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md) items 30–33                                                                                                                                               |
| 10   | Performance + SEO + security uplift                  | 📋 Planned | Create `waves/WAVE_10_*` bundle before execution; source: [`IMPROVEMENTS_PERFORMANCE.md`](./IMPROVEMENTS_PERFORMANCE.md), [`IMPROVEMENTS_SEO.md`](./IMPROVEMENTS_SEO.md), [`IMPROVEMENTS_SECURITY.md`](./IMPROVEMENTS_SECURITY.md)                               |
| 11   | Incomplete features closure + architecture refactor  | 🔮 Backlog | Source: [`IMPROVEMENTS_INCOMPLETE_FEATURES.md`](./IMPROVEMENTS_INCOMPLETE_FEATURES.md), [`IMPROVEMENTS_ARCHITECTURE.md`](./IMPROVEMENTS_ARCHITECTURE.md)                                                                                                         |

---

## Governance Hard Gate

1. Every planning update must run `npm run plans:validate`.
2. Active queue changes must be mirrored in:
   - `plans/PENDING_TASKS_ONLY.md`
   - `PROJECT_PROGRESS.md`
   - `DAILY_MILESTONE_TRACKER.md`
3. Completion claims require verification command evidence.
4. No new standalone plan docs — update existing files or create a wave bundle under `plans/waves/`.

---

## Canonical Links

- Queue: [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Active index: [`INDEX.md`](./INDEX.md)
- Improvements backlogs: [`IMPROVEMENTS_BACKLOG.md`](./IMPROVEMENTS_BACKLOG.md), [`IMPROVEMENTS_UX.md`](./IMPROVEMENTS_UX.md), [`IMPROVEMENTS_CRITICAL.md`](./IMPROVEMENTS_CRITICAL.md)

---

## Archive Policy

Historical/superseded plan documents live in `plans/archives/`.  
New active planning docs must update an existing file or be created as a wave bundle under `plans/waves/` (no ad-hoc plan bloat in `plans/`).
