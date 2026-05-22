# White Caves Real Estate — Master Plan (Canonical)

**Purpose:** Canonical roadmap for execution decisions.  
**Owners:** @Ada + @Margaret  
**Last Updated:** 2026-05-22  
**Update cadence:** Weekly roadmap refresh (daily progress in `PROJECT_PROGRESS.md`)

---

## Status Snapshot

- N+1 through N+9 implementation stream: **✅ Completed**
- Active planning focus: **S1 Errors Stabilization**, **S2 Phase 26 deferred closeout**, **S3 Phase 27 micro-wave prep**
- Planning authority remains centralized in `MASTER_PLAN.md` + `PENDING_TASKS_ONLY.md`

---

## Active Streams (Now)

| Stream | Objective                                                                 | Owners                    | Status      | Entry Gate                                                              | Exit Criteria                                                               |
| ------ | ------------------------------------------------------------------------- | ------------------------- | ----------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| S1     | Errors stabilization lane (fast/medium/deep buckets)                      | @Mira + @Katherine        | 🔨 Active   | `npm run plans:validate` + baseline validation clean                    | Typecheck/lint/build + targeted suites pass and evidence logged in trackers |
| S2     | Close Phase 26 deferred workstream with explicit owner/date + clear scope | @Margaret                 | 🕒 Deferred | Deferred item remains explicit in queue with owner/date                 | Either reactivated as wave or moved to superseded archive record            |
| S3     | Execute next phase in short micro-waves with artifact bundle              | @Ada + @Margaret + squads | 📋 Planned  | Readiness >=60% + exact approval phrase + wave bundle linked from queue | Wave backlog complete with validation evidence and rollback notes recorded  |

---

## Micro-Wave Execution Target

| Wave | Focus                                             | Bundle                                                                                                                                                                                                                                                           |
| ---- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 08   | Errors stabilization + planning hard-gate rollout | [`WAVE_08_SDD.md`](./waves/WAVE_08_SDD.md), [`WAVE_08_READINESS_PACKET.md`](./waves/WAVE_08_READINESS_PACKET.md), [`WAVE_08_IMPLEMENTATION_BACKLOG.md`](./waves/WAVE_08_IMPLEMENTATION_BACKLOG.md), [`WAVE_08_TEST_ROLLOUT.md`](./waves/WAVE_08_TEST_ROLLOUT.md) |

---

## Governance Hard Gate

1. Every planning update must run `npm run plans:validate`.
2. Active queue changes must be mirrored in:
   - `plans/PENDING_TASKS_ONLY.md`
   - `PROJECT_PROGRESS.md`
   - `DAILY_MILESTONE_TRACKER.md`
3. Completion claims require verification command evidence.

---

## Canonical Links

- Queue: [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Governance policy: [`PLANNING_GOVERNANCE.md`](./PLANNING_GOVERNANCE.md)
- Active index: [`INDEX.md`](./INDEX.md)
- Backlog reference: [`IMPROVEMENTS_BACKLOG.md`](./IMPROVEMENTS_BACKLOG.md)

---

## Archive Policy

Historical/superseded plan documents remain in `archives/`.  
New active planning docs require merging or superseding an existing active doc (no plan bloat).
