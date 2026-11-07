# Wave 46 — Frontend Overlap Audit (`src/`, `app/`, `pages/`)

**Task ID:** W46-006  
**Date:** 2026-09-03  
**Owners:** @Mira + @Una  
**Status:** ✅ Complete

## Scope

Audit overlap and route-entry conflict risk between:

- `src/` (Vite React SPA)
- `app/` (Next.js App Router)
- `pages/` (Next.js Pages Router shim)

## Evidence Snapshot

- Root footprints:
  - `src` files: `3643`
  - `app` files: `21`
  - `pages` files: `1`
- Runtime scripts from `package.json` confirm dual frontends are intentionally available:
  - Vite path: `dev:client`, `build`
  - Next path: `next:dev`, `next:build`, `next:start`
- Route entry surfaces found:
  - Vite SPA bootstrap: `src/index.tsx` → mounts `src/App.tsx`
  - JSX compatibility shim: `src/App.jsx` re-exports `./App.tsx`
  - Next App Router homepage: `app/page.tsx`
  - Next Pages Router shield: `pages/_app.tsx` (explicitly prevents `src/pages/` from being treated as Next pages)

## Overlap / Conflict Findings

### 1) Dual Runtime Entry Model (Intentional)

- **Finding:** Repo supports both Vite SPA and Next.js builds.
- **Risk:** Route parity drift (same logical page can diverge across runtimes).
- **Severity:** Medium

### 2) `src/App.tsx` + `src/App.jsx` Duplicate Entry Name

- **Finding:** Two App entry files exist.
- **Assessment:** Current `.jsx` file is a compatibility shim only (safe), not a competing app implementation.
- **Risk:** Low (documentation clarity needed to avoid accidental edits in shim).

### 3) `src/pages/` vs `app/` Route Domain Split

- **Finding:** Next App Router has route files (`app/properties/*`, `app/off-plan/*`, `app/crm/leads/*`) while SPA routes are managed in `src/App.tsx` and `src/pages/*`.
- **Risk:** Medium-High for duplicate URL ownership across runtimes.
- **Current Mitigation:** `pages/_app.tsx` intentionally anchors root pages and avoids Next compiling `src/pages/`.

### 4) API Route Surface in `app/api/*`

- **Finding:** Next API routes (`app/api/auth`, `app/api/health`, `app/api/leads`) coexist with Express backend.
- **Risk:** Medium for endpoint ownership ambiguity if same paths are exposed through both stacks.

## Route-Entry Conflict Report (Current)

| Conflict Class                               | Status       | Evidence                                                                      | Action                                                            |
| -------------------------------------------- | ------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| SPA bootstrap conflict                       | ✅ Mitigated | `src/index.tsx` consistently mounts `App.tsx`; `App.jsx` shim only            | Keep shim comment + no logic in `.jsx`                            |
| Next vs `src/pages` compilation conflict     | ✅ Mitigated | `pages/_app.tsx` explicitly documents shielding behavior                      | Keep file and comment block intact                                |
| URL ownership split (`app/*` vs SPA routes)  | ⚠️ Open      | `app/properties/*`, `app/off-plan/*`, `app/crm/leads/*` alongside SPA routing | Publish canonical runtime ownership table (W46-008/W46-009 input) |
| API ownership split (`app/api/*` vs Express) | ⚠️ Open      | Next API route files present while Express API also exists                    | Add endpoint ownership policy + CI lint check                     |

## Recommended Canonical Ownership (Frontend)

1. **Primary application runtime:** Vite SPA (`src/`) for current production workflow (`npm run build`).
2. **Next runtime:** controlled parallel lane for incremental migration experiments only.
3. Keep `pages/_app.tsx` as mandatory guard file.
4. Treat `app/api/*` as migration/testing surface unless explicitly promoted to canonical backend ownership.

## Follow-On Actions

- Feed into **W46-007** for backend/API overlap with explicit endpoint ownership matrix.
- Feed into **W46-009** anti-dup checks:
  - detect duplicate route ownership declarations,
  - detect endpoint path collisions across Express and Next API.

## Acceptance Criteria Check

- [x] `src/`, `app/`, `pages/` overlap audited with measurable counts.
- [x] Route-entry surfaces identified and classified.
- [x] Conflict report published with mitigation status and next actions.
