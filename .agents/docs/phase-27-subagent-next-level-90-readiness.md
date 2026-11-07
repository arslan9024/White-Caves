# PHASE 27 — Subagent Next-Level Upgrade (90% Readiness)

**Date:** 2026-05-18  
**Status:** ⬜ Planned micro-wave execution stream  
**Last Updated:** 2026-05-22  
**Owner:** @Ada + @Margaret + guardian  
**Execution Mode:** Fast-track with strict policy routing  
**Objective:** Raise operational readiness from the current coding unlock floor (60%) to a managed target of **90%** before major premium waves.

**Canonical Status Sources:**

- [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)

---

## 1) Policy Position (No Conflict with Existing Gate)

- Keep **coding unlock gate** unchanged at **60%** with exact approval phrase:
  - `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`
- Add **execution target** for mature waves:
  - **90% readiness target** before large premium implementation bundles.
- Result:
  - 60% = minimum safe start
  - 90% = next-level quality target for full cross-team execution

---

## 2) Model Routing (Strict)

### Free/Unlimited research + planning (mandatory)

Use only free/unlimited tools for planning agents:

- Gemini 2.0 Flash
- Llama 3.1 70B (Groq)
- DeepSeek V3

Allowed work scope:

- `business_docs/`
- `plans/`

### Premium requests (restricted)

Premium allowed only for:

- Senior coding agents
- Senior design agents

Prerequisites:

1. Context packet exists
2. Readiness >=60% (unlock) and target plan toward 90%
3. Daily premium cap logged
4. @Ada approval phrase present

---

## 3) 90% Readiness Scorecard

Score on 6 domains (5 checks each = 30 checks total):

- Business
- API
- Data
- UX
- QA
- Compliance/Sign-off

### Thresholds

- **<60%**: blocked
- **60–89%**: controlled macro-wave only
- **>=90%**: full premium wave allowed

### Required evidence per domain

- business rule clarity
- contract/schema definition
- validation + error model
- minimum one test scenario
- rollback/mitigation note

---

## 4) Full-Team Collaboration Upgrade

All planning tasks must include:

- `CONSUMES←@Agent: file#section`
- `FEEDS→@Agent: file#section`
- `FEEDS_ACK←@DownstreamAgent: accepted|revise + file#section`

Task completion requires all three tags present and verifiable.

---

## 5) Daily Operating Loop (Next-Level)

1. `npm run orchestrator:verify-prompts`
2. `npm run orchestrator:health:brief`
3. `npm run orchestrator:next-agent:all`
4. `npm run orchestrator:blockers:brief`
5. Execute planning with free models
6. Sync trackers (`AGENTS.md`, `PROJECT_PROGRESS.md`, `DAILY_MILESTONE_TRACKER.md`, `plans/PENDING_TASKS_ONLY.md`)
7. If readiness >=60% and quota available, run premium macro/huge-wave bundle

---

## 6) Acceptance Criteria (Phase 27)

- [ ] Policy metadata updated for dual-threshold operation (60 unlock / 90 target)
- [ ] N+7 added to pending plan list
- [ ] Premium routing remains restricted to coding/design seniors only
- [ ] Daily queue health remains clean (0 blockers, 0 invalid statuses)
- [ ] Tracker sync gap closed across all four status files

---

## 7) KPI Targets

- Queue health pass rate: 100%
- Blocker count at handoff windows: 0
- FEEDS_ACK completion on required tasks: 100%
- Prompt verification errors: 0
- Readiness target for large waves: >=90%

---

## 8) Suggested Improvements (Recommended)

1. Add nightly auto-sync check that diffs:
   - `logs/orchestrator/task-queue.json` vs `plans/PENDING_TASKS_ONLY.md`
2. Add `readiness:target90` command to print domains below 90%.
3. Add lane-level SLA dashboard (A/B/C/D) with stale-task alerts.
4. Add weekly “premium efficiency” report:
   - premium requests used vs delivered modules/tests.
5. Add FEEDS_ACK audit command to detect missing downstream acceptance before close.
