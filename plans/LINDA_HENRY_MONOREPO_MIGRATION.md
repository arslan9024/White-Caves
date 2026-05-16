# Linda + Henry Monorepo Migration (White Caves Canonical Plan)

**Date:** 2026-05-09  
**Status:** In Progress (Phase 1 started)

---

## Objective

Move Linda and Henry from "external integration" mindset to **in-project product modules** under White Caves, then rebuild/refactor them to White Caves standards (architecture, UX, reliability, compliance).

---

## Phase 1 — Snapshot Import (Completed)

- Imported full code snapshots into:
  - `modules/linda`
  - `modules/henry`
- Kept source references for historical/idea backtracking:
  - https://github.com/arslan9024/whatsapp-bot-linda
  - https://github.com/arslan9024/Henry
- Added root scripts:
  - `npm run install:ai-modules`
  - `npm run dev:linda`
  - `npm run dev:henry`
  - `npm run dev:ai-modules`

---

## Phase 2 — Stabilization and Compatibility

1. Install both modules in-place and run baseline checks.
2. Record all startup/build/lint/test errors from each module.
3. Create issue matrix by severity:
   - Blocker (startup/build fail)
   - High (runtime failure, API mismatch)
   - Medium (lint/type debt)
   - Low (UX polish)
4. Normalize shared assumptions:
   - Environment variables
   - Ports
   - Auth/session handling
   - Logging/error format

---

## Phase 3 — AI Command Center Integration

1. Keep Linda + Henry visible in assistant registry and command center routes.
2. Expose module health and availability cards in AI Command Center.
3. Wire module actions through White Caves backend gateway (`/api/integrations/*`) and/or in-repo adapters.
4. Align assistant role metadata everywhere:
   - `server/routes/assistants.ts`
   - `src/config/assistantRegistry.ts`
   - `src/store/slices/aiAssistant/registry.ts`

---

## Phase 4 — Product-Grade Refactor (Enhance Beyond Source Repos)

### Linda focus
- Harden WhatsApp message lifecycle, queue/retry semantics, and observability.
- Consolidate command system into White Caves domain model.
- Improve CRM-side operator UX and conversation timeline clarity.

### Henry focus
- Strengthen document/compliance engine contracts.
- Improve extraction confidence UX and audit transparency.
- Refactor records/archive workflows to White Caves storage standards.

### Shared standards
- Remove legacy inconsistencies and anti-patterns.
- Enforce TypeScript strictness where applicable.
- Enforce design system and accessibility consistency.
- Route all network calls through approved fetch client patterns.

---

## Immediate Commands (Team Runbook)

```bash
# from White-Caves root
npm run install:ai-modules

# run module dev servers (separate terminal tabs)
npm run dev:linda
npm run dev:henry

# run White Caves app
npm run dev
```

### Local Port Allocation (recommended)

- White Caves frontend: `5000`
- Henry module (dev): `5100` (via `HENRY_PORT=5100`)
- Linda module: module-default runtime (configure in module env as needed)

---

## Success Criteria

- Linda and Henry are maintained primarily inside White Caves.
- AI Command Center can surface module health + key actions.
- Build/dev workflows are deterministic and documented.
- UX and reliability exceed original source repos.
