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
