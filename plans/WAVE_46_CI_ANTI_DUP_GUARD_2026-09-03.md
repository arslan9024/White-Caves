# Wave 46 — CI Anti-Duplication Guard Implementation

**Task ID:** W46-009  
**Date:** 2026-09-03  
**Owners:** @Gwynne + @Katherine  
**Status:** ✅ Complete

## Objective

Add enforceable CI checks for duplicate-path governance and canonical tracker consistency.

## Implemented Changes

### 1) New guard script

- Added: `aegis/scripts/validate-dedup-governance.js`

Checks implemented:

1. Required Wave 46 governance artifacts exist.
2. Mirror planning docs include `REFERENCE COPY` banner.
3. Active trackers avoid legacy `business_docs` alias drift.
4. Regression check ensures deleted `docs/plans/PHASE1_COMPLETE.md` is not reintroduced.
5. Wave 46 backlog includes anti-dup task pointer.

### 2) NPM script wiring

- Added in `package.json`:
  - `plans:dedup:guard`
  - `plans:validate:full` (`plans:validate` + `plans:dedup:guard`)

### 3) CI workflow enforcement

Updated workflows to run the new combined gate:

- `.github/workflows/ci.yml`
- `.github/workflows/pr-validation.yml`
- `.github/workflows/node.js.yml`

## Validation Evidence

- Local execution: `npm run plans:validate:full` ✅ passed
- Output included one non-blocking advisory warning on mirror banner consistency.

## Acceptance Criteria Check

- [x] Anti-dup path governance check added as executable script.
- [x] Combined validation command added for local + CI usage.
- [x] CI workflows updated to enforce the new gate.
- [x] Local run demonstrates passing status.
