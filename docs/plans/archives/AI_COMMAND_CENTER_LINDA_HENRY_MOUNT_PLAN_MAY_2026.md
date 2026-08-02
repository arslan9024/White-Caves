# AI Command Center — Linda/Henry Internal Mount Plan (May 2026)

## Scope

Implement canonical internal mounting behavior for Linda and Henry inside `AICommandCenter` without breaking existing native dashboards.

## What Is Already In Place

- `AICommandCenter.tsx` already maps assistant IDs to dashboards, including:
  - `linda -> LindaWhatsAppCRM`
  - `henry -> HenryRecordsCRM`
- Frontend orchestration profile config exists:
  - `src/config/subagentOrchestration.ts`
- Backend orchestration API exists:
  - `server/routes/orchestration.ts`

## Gap Identified

The dashboards were always native-only. There was no mount contract for externally hosted module runtimes (e.g., dedicated Henry UI runtime) while keeping a safe fallback path.

## Delivery in This Wave

### 1) Internal Module Mount Contract

Added `src/config/internalModuleMounts.ts`:

- Defines per-assistant mount behavior (`native | iframe | api`)
- Adds environment-driven mounting:
  - `VITE_HENRY_MODULE_URL`
  - `VITE_LINDA_MODULE_URL`
  - `VITE_LINDA_API_URL` (health integration target)
- Defaults to safe native mode when URLs are not provided

### 2) Reusable Mount Host

Added `src/components/crm/shared/InternalModuleMount.tsx`:

- Reads assistant mount config
- If iframe mount is configured, renders embedded module + "Open module" link
- If mount config is incomplete, renders warning and native fallback
- If mount not enabled or native mode, renders fallback immediately

### 3) Linda/Henry Runtime Mounting

Updated:

- `src/components/crm/LindaWhatsAppCRM.tsx`
- `src/components/crm/HenryRecordsCRM.tsx`

Both dashboards now:

- Use `InternalModuleMount`
- Preserve existing native dashboard UI as fallback content
- Support zero-downtime external mount enablement via env variables

### 4) Orchestration Config Alignment

Updated backend route profile capabilities in:

- `server/routes/orchestration.ts`

Linda/Henry capability lists are now aligned with frontend orchestration definitions.

### 5) Mount Observability in AI Command Center

Updated `src/components/crm/AICommandCenter.tsx` and tests to expose lightweight runtime mount metadata:

- Mount mode badge (`native` / `iframe`) when a module mount config exists.
- Health badge when `healthUrl` is configured (status labels: `checking`, `healthy`, `degraded`, `unreachable`, `n/a`).
- Health checks run with timeout + abort protection so stale requests do not leak.

Validation coverage added in `src/components/crm/AICommandCenter.test.tsx`:

- mount mode badge render
- healthy endpoint response
- failed endpoint (`unreachable`) response

## Operational Notes

### Local (default)

No env vars required. Linda/Henry run in native CRM panels.

### Remote mount (optional)

Set one or both:

```bash
VITE_HENRY_MODULE_URL=http://localhost:5100
VITE_LINDA_MODULE_URL=http://localhost:5200
VITE_LINDA_API_URL=http://localhost:3005
```

Then restart Vite.

## Sanity Checklist

- [ ] Select Linda in AI Command Center → dashboard renders
- [ ] Select Henry in AI Command Center → dashboard renders
- [ ] With `VITE_HENRY_MODULE_URL` set → Henry embeds iframe runtime
- [ ] With URL removed → fallback native dashboard still works
- [ ] `/api/orchestration/status` returns aligned Linda/Henry capabilities

## Risks / Rollback

- Risk: incorrect URL causes unreachable iframe module
- Mitigation: automatic native fallback path remains in place
- Rollback: remove env vars or revert mount wrapper usage in Linda/Henry components
