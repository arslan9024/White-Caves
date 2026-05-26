# White Caves — Custom Agents & Subagents Plan

> **Updated:** 2026-05-25  
> **Status:** Active governance guide — Aegis 150 (supersedes V3/V2 governance baselines)

---

## Purpose

This file defines how custom agents/subagents are dispatched **today** and how their work maps to canonical planning files.

---

## Canonical References

- Roadmap authority: [`MASTER_PLAN.md`](./MASTER_PLAN.md)
- Pending queue authority: [`PENDING_TASKS_ONLY.md`](./PENDING_TASKS_ONLY.md)
- Operational dashboard: [`../PROJECT_PROGRESS.md`](../PROJECT_PROGRESS.md)
- Daily execution log: [`../DAILY_MILESTONE_TRACKER.md`](../DAILY_MILESTONE_TRACKER.md)
- Agent roster + current free-agent queue: [`../AGENTS.md`](../AGENTS.md)
- Runtime policy authority: [`../.github/copilot-instructions.md`](../.github/copilot-instructions.md)
- **V3 upgrade details:** [`./AGENT_SKILLS_UPGRADE_V3.md`](./AGENT_SKILLS_UPGRADE_V3.md)

---

## Dispatch Policy (Aegis 150 — 150-Agent Model)

1. **Free planning/research agents remain docs-only** and use free-tier models only. Approved: Gemini 2.0 Flash / 1.5 Flash, Groq Llama 3.1/3.3 70B, DeepSeek V3/R1, Mistral Small, Qwen2.5 72B.
2. **Research preflight is mandatory:** @Elena (CRO) publishes a daily research preflight brief before any premium coding day. No preflight = no premium coding.
3. **Premium coding/design requests** are blocked until the exact approval phrase exists:  
   `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`
4. Every planning handoff must include:
   - `CONSUMES←@Agent: file#section`
   - `FEEDS→@Agent: file#section`
   - `FEEDS_ACK←@DownstreamAgent: accepted|revise + file#section`
5. Every planning prompt must follow the custom dispatch packet fields (`Task ID`, `Owner`, `Objective`, `Input Artifacts`, `Output Artifact`, `Acceptance Criteria`, `Validation`, `Handoff`).
6. Free-agent outputs are synchronized through `AGENTS.md` sprint table and reflected in `PROJECT_PROGRESS.md` / `DAILY_MILESTONE_TRACKER.md`.
7. Planning must reach the **60% readiness gate** before premium coding (90% target for large-wave execution).
8. **WIP limits enforced by @Zoe (COO):** 3 active tasks/delivery team | 6 for Research Division.

---

## Aegis Workflow Upgrade (Planning + Development + Git)

Effective with `scripts/orchestrator/policy.json` version `2026.05.26-aegis-170-v3`:

1. **Planning workflow profile is explicit**: required readiness evidence is standardized as business rules, API contract, data schema, and test scenario.
2. **Development workflow profile is explicit**: delivery stays vertical-slice with required checks (`typecheck`, `lint`, `build`) and targeted tests for touched scope.
3. **Git workflow profile is explicit**:
   - integration branch defaults to `develop` with fallback to `development`/`main`,
   - release branch remains `main`,
   - remote defaults to `origin`,
   - release merges are PR-first by default (`autoMergeReleaseBranch=false`).
4. **Session scripts consume policy-based git routing** instead of hard-coded branch names, improving consistency across planning loops and implementation sessions.

---

## Subagent Routing Matrix (Aegis 170 V3)

| Work Type | Primary Agent(s) | Output Location | Promotion Rule |
| --------- | ---------------- | --------------- | -------------- |
| Research preflight briefs (daily) | @Elena + Research Division (#73–91) | `business_docs/` + daily preflight doc | Must publish before premium coding starts |
| Business rules, legal, compliance, KPI specs | @Victoria, @Invoice, @Sofia, @Cassie, @Joelle + delivery teams | `business_docs/` | Must reach 60%+ planning evidence before coding (90% target) |
| Sprint decomposition and queue maintenance | @Margaret + @Zoe | `plans/`, `PROJECT_PROGRESS.md`, `DAILY_MILESTONE_TRACKER.md` | Must align with `MASTER_PLAN.md` and `PENDING_TASKS_ONLY.md` |
| Architecture and premium gate decision | @Ada | policy declaration in tracker/session | Must use exact approval phrase: `@Ada — Context Ready (60% Readiness) — Coding Phase Approved` |
| Cross-team SLA and WIP enforcement | @Zoe (COO) | `DAILY_MILESTONE_TRACKER.md` | Continuous monitoring |
| Coding implementation | Senior coding/design agents | codebase + tests | Allowed only after Gate approval |
| QA/runtime guard | @Katherine + @Vera + @Gwynne | tests, runtime guard logs | Required after big premium wave commits |

---

## Session Start Checklist for Subagent-Orchestrated Work

- [ ] Target feature/module identified
- [ ] Business docs exist with 60%+ planning evidence (90% target for large-wave execution)
- [ ] Plan exists in canonical queue
- [ ] @Margaret sign-off present
- [ ] @Ada exact approval phrase present: `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`
- [ ] Daily premium cap logged
- [ ] FEEDS/CONSUMES/FEEDS_ACK chain complete for upstream planning outputs
- [ ] Parallel team topology includes the additional team lane (6-team planning model Aegis 150)

If any box is unchecked, route back to planning agents (no premium coding).

---

## Subagent Performance Upgrade Pack (Effective 2026-05-17)

### 1) Standard Task Packet (Required)

Every dispatched subagent task must include these fields in one block:

- `Task ID`
- `Owner Agent`
- `Objective`
- `Input Artifacts` (exact file + section)
- `Output Artifact` (exact file + section)
- `Acceptance Criteria` (3+ measurable checks)
- `Validation Command` (if applicable)
- `Handoff Target` (`FEEDS→...`)

Tasks missing any field are treated as invalid and must be rewritten before execution.

### 2) Definition of Done (DoD) for Planning Agents

A planning task is complete only when all conditions are true:

- Output text is committed in the declared file/section.
- `CONSUMES`, `FEEDS`, and `FEEDS_ACK` lines are present.
- At least one testable acceptance criterion is explicitly documented.
- The corresponding sprint/dashboard rows are updated (`AGENTS.md`, `PROJECT_PROGRESS.md`, `DAILY_MILESTONE_TRACKER.md`).

### 3) Blocker Escalation SLA

- **P0 blocker:** escalate to @Ada and @Margaret immediately.
- **P1 blocker:** escalate within 30 minutes if unresolved.
- **P2 blocker:** escalate within 4 hours.
- Every escalation must include: blocker type, impacted file(s), dependency owner, and next action.

### 4) Anti-Stall Rotation Rule

If a free-agent task is blocked by dependency lag:

1. move the agent to their next backlog item within the same ownership scope,
2. mark original task as `Blocked (Dependency)`,
3. log dependency owner in the tracker,
4. requeue the blocked task after dependency ack.

This keeps the no-idle policy enforceable without violating ownership boundaries.

### 5) Dispatch Quality Gate (Pre-Run)

Before launching any subagent task, run:

- `npm run orchestrator:verify-prompts`
- `npm run orchestrator:health:brief`

If either check fails, fix queue/prompts first and do not dispatch.

---

## Notes on Historical Content

The old Phase 6–10 assignment snapshot (May 2026) is now historical context.
Current execution authority has moved to the canonical references above and the active AGENTS roster.
