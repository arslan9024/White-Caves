# White Caves Project Skills Guide

This file defines the practical skill set and execution standards for contributors working in this repository.

## 1) Core Development Skills

- **Planning discipline**: start from `plans/MASTER_PLAN.md`, then check `plans/PENDING_TASKS_ONLY.md`.
- **Agent governance**: follow `AGENTS.md` and `plans/CUSTOM_AGENTS_PLAN.md` for ownership, handoff, and status flow.
- **Frontend delivery**: React + TypeScript + Vite patterns in `src/`.
- **Backend/API delivery**: Express/TypeScript services and routes in `server/`.
- **Data/model work**: Prisma + schema-safe updates in `prisma/`.
- **Quality-first execution**: lint, build, and focused tests before/after changes.

## 2) Required Project Gates

- Premium coding approval phrase must be present when required:
  - `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`
- Prefer project-ready, minimal-risk changes over broad refactors.
- Keep only project-relevant patterns; do not copy full external frameworks blindly.

## 3) Standard Command Skills

Use these as default validation skills for this repo:

- Install dependencies:
  - `npm install`
- Lint:
  - `npm run lint`
- Build:
  - `npm run build`
- Type check:
  - `npm run typecheck`
- Plans governance check:
  - `npm run plans:validate`
- Focused tests:
  - `npm run test:run -- <paths>`

> Note: `npm run test:run:unit` may return “No test files found” depending on filters; use focused test paths when validating feature-specific changes.

## 4) Implementation Skill Workflow

1. Confirm scope in plan/tracker files.
2. Locate exact modules/files first.
3. Make small, surgical changes.
4. Validate impacted area (lint/build/typecheck + focused tests).
5. Update relevant docs/tracker entries when behavior or process changes.

## 5) Documentation Skill Standards

- Keep docs actionable and tied to executable commands.
- Use absolute repository paths when needed for clarity.
- Prefer concise checklists for operational steps.
- Keep governance docs synchronized (plans, progress, milestones) when process rules change.

## 6) Security and Reliability Skills

- Avoid introducing secrets or unsafe defaults.
- Preserve existing auth/compliance constraints.
- Use runtime and verification scripts when touching critical workflows:
  - `npm run test:ops`
  - `npm run verify:runtime`

## 7) What “Tailored for White Caves” Means

- Reuse only the parts that improve this repository’s delivery speed, quality, and compliance.
- Skip generic or heavyweight templates that do not map to current modules, gates, or business workflows.
- Treat this project’s own plans, agent docs, and scripts as source of truth.
