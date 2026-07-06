# ADR-004 — Wave-Based Gated Delivery Model

**Status:** Accepted  
**Date:** 2026-03-20  
**Owners:** @Ada + @Margaret + @Grace  
**Related files:** `plans/MASTER_PLAN.md`, `plans/PENDING_TASKS_ONLY.md`,
`plans/waves/README.md`, `scripts/orchestrator/policy.json`,
`scripts/validate-plans-governance.js`

---

## Context

White Caves is built by a mixed team of premium (Copilot token-consuming) coding
agents and free (zero-token) planning and research agents. Without a clear gate model,
premium agents risk writing code against incomplete business specs, or against API
contracts that the planning agents have not yet finalised. Additionally, the codebase
has a non-trivial TypeScript surface (~120 k LOC at Wave 18); unchecked additions
compound type drift and lint regression.

The project also uses a cloud agent (GitHub Copilot coding agent) that must not
autonomously push to `main` — all changes must flow through a PR-based `develop → main`
protocol with per-wave verification.

---

## Decision

**All implementation work is gated through a wave-based delivery model with a
60% readiness floor (coding unlock) and a 90% readiness target (large-wave start).**

The exact unlock phrase is:

> `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`

No premium coding agent begins Wave N until this phrase appears in the session or
wave readiness packet. The phrase may only be issued after:

1. The Wave N `WAVE_##_READINESS_PACKET.md` exists with ≥60% acceptance criteria confirmed.
2. `npm run plans:validate` exits 0.
3. No P0 blockers are open in `plans/PENDING_TASKS_ONLY.md`.

### Dual-threshold model

| Threshold | Meaning | Who gates |
| --- | --- | --- |
| **60%** | Coding unlock — sufficient context to start without rework risk | @Ada |
| **90%** | Large-wave start — all acceptance criteria confirmed, dependency graph complete | @Ada + @Katherine |

### Wave artefact bundle (required before premium coding)

Each wave must produce under `plans/waves/`:
- `WAVE_##_SDD.md` — Software Design Document
- `WAVE_##_FLOWCHARTS.md` — Data flow and state transition diagrams
- `WAVE_##_READINESS_PACKET.md` — Readiness checklist with % score
- `WAVE_##_IMPLEMENTATION_BACKLOG.md` — Ordered task list with validation commands
- `WAVE_##_TEST_ROLLOUT.md` — Test strategy and acceptance criteria

### Governance scripts

`scripts/validate-plans-governance.js` verifies that required wave artefacts exist
and have valid YAML front-matter before a wave can be marked Ready.

`scripts/orchestrator/policy.json` is the machine-readable policy source. The
`approvalGatePhrase` field contains the canonical unlock string. Orchestrator scripts
compare session state against this string before advancing to premium tasks.

---

## Alternatives Considered

| Alternative | Reason Rejected |
| --- | --- |
| **Continuous trunk-based delivery (no gates)** | Acceptable for stable, fully-staffed teams; unsuitable when 120 free planning agents and 50 premium coding agents operate asynchronously. Without gates, premium agents repeatedly re-work features that planning agents later specify differently. |
| **Feature flags only (no wave structure)** | Feature flags control runtime behaviour; they do not prevent a half-implemented feature from being committed. The wave model gates at the commit stage, not the runtime stage. |
| **Single 100% readiness gate** | 100% readiness is frequently blocked by third-party API documentation gaps (DLD Sandbox, Ejari API). Waiting for 100% would stall the entire project for weeks. The 60%/90% dual threshold allows parallel progress. |
| **Manual approval per PR** | Requires a human to review every PR before merge. At the velocity of 150-agent parallel work, this creates a merge-queue bottleneck. The wave gate front-loads human review at the planning stage rather than per-PR. |

---

## Consequences

### Positive

- Premium Copilot tokens are not wasted on features whose specifications change
  within the same wave cycle.
- The 60%/90% dual threshold accommodates real-world external blockers (regulatory
  API sandboxes) without halting delivery.
- `npm run plans:validate` provides an automated CI-friendly check of governance
  compliance.
- The wave artefact bundle creates an auditable design history for every shipped feature.

### Negative / Risks

- **Planning bottleneck:** If free planning agents are behind, premium agents idle.
  Mitigated by the 60% unlock threshold and parallel free-agent planning.
- **Gate phrase hard-dependency:** Orchestrator scripts must check for the exact
  approval phrase. Any variation (typo, reformatting) silently blocks code execution.
  The phrase is canonically stored in `policy.json:approvalGatePhrase` to reduce drift.
- **Wave scope creep:** Developers may add tasks to a wave after it is approved,
  inflating the scope beyond what the gate reviewed. Mitigation: task additions after
  gate approval require a mini-gate from @Ada.
