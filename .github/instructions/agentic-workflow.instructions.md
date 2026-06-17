---
description: 'Agentic workflow and handoff standards for planning-to-implementation'
applyTo: '**/*.{md,ts,tsx,js,mjs,cjs,yml,yaml}'
---

# Agentic Workflow Instructions (White Caves)

## Layered Model

- Foundation: `.github/copilot-instructions.md` + `AGENTS.md`
- Specialists: `.github/agents/*.agent.md`
- Capabilities: `.github/skills/*/SKILL.md`

## Handoff Contract

Every meaningful task handoff should include:

- Task ID
- Files touched
- Acceptance criteria
- Validation steps
- Blocker status

### Plan-first packet

Before premium execution, include a short plan packet with:

- goal
- files in scope
- validation path
- recommended model tier
- context-size expectation

### Minimal-context rules

- Start with `plans/MASTER_PLAN.md`, `plans/PENDING_TASKS_ONLY.md`, and `plans/waves/README.md`.
- Load only the exact wave bundle, business-doc sections, and instruction files needed for the task.
- Carry forward compressed handoff summaries, not broad transcript replays.

## Change Strategy

- Prefer dependency-safe macro-wave bundles with internal test checkpoints.
- Resolve compile/lint/test blockers before widening scope.
- Update trackers only after validation results are known.

## Validation Order

1. Focused file diagnostics
2. Scope-level compile/test
3. Whole-workspace diagnostics

## Safety

- Avoid risky global refactors when a local fix is sufficient.
- Keep commit chunks coherent: backend, frontend, docs/resource.

<!-- Inspired by github/awesome-copilot workflow patterns -->
