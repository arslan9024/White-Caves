# Wave 46 — Backend Overlap Audit (`server/routes`, `server/services`, `api/`)

**Task ID:** W46-007  
**Date:** 2026-09-03  
**Owners:** @Mira + @Radia  
**Status:** ✅ Complete

## Scope

Audit backend overlap and duplicate handler risk across:

- `server/routes/`
- `server/services/`
- `api/`
- `app/api/` (Next API surface relevant to ownership conflicts)

## Evidence Snapshot

- `server/routes` files: `229`
- `server/services` files: `203`
- `api` files: `9`
- `app/api` files: `6`

Additional observed split:

- Express route layer is dense and mostly TypeScript-first with legacy JS coexistence.
- Next API route handlers exist in parallel (`app/api/auth`, `app/api/health`, `app/api/leads`).
- Legacy/alternate API surface exists under `api/relational-sidebar/*`.

## Duplicate Filename / Handler Signals

### Cross-surface duplicate filenames

- Duplicate names across `server/routes` + `api` + `app/api`:
  - `route.ts` (3)
  - `route.test.ts` (3)

### Duplicate non-test stems in `server/routes`

1. `contracts`
   - `server/routes/contracts.js`
   - `server/routes/contracts.ts`
2. `whatsapp`
   - `server/routes/whatsapp.js`
   - `server/routes/whatsapp.ts`

### Duplicate non-test stems in `server/services`

1. `contractservice`
   - `server/services/ContractService.js`
   - `server/services/contractService.ts`
2. `kycservice`
   - `server/services/kycService.ts`
   - `server/services/compliance/KYCService.js`
3. `leadscoringservice`
   - `server/services/LeadScoringService.js`
   - `server/services/leadScoringService.ts`
4. `ninaengine`
   - `server/services/ai/ninaEngine.ts`
   - `server/services/nadia/ninaEngine.ts`

## Overlap Risk Matrix

| Risk Area                                                  | Severity    | Evidence                                                         | Recommended Action                                                             |
| ---------------------------------------------------------- | ----------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| JS/TS dual route handlers                                  | High        | `contracts.*`, `whatsapp.*` dual implementations                 | Canonicalize to TS and keep JS as temporary adapters or archive in W46-008     |
| JS/TS dual service handlers                                | High        | `contractService`, `leadScoringService`, `kycService` duplicates | Choose one canonical TS path per domain; merge behavior and retire shadow copy |
| Domain-duplicated engines                                  | Medium      | `ninaEngine.ts` in two service subpaths                          | Define single owner module + re-export strategy                                |
| Parallel API stacks (Express vs Next API vs legacy `api/`) | Medium-High | `server/routes`, `app/api`, and `api/relational-sidebar` coexist | Publish endpoint ownership table and enforce collision checks in CI (W46-009)  |

## Candidate Consolidation Queue (for W46-008)

1. Route canonicalization candidates:
   - `server/routes/contracts.ts` (primary) + evaluate archival of `contracts.js`
   - `server/routes/whatsapp.ts` (primary) + evaluate archival of `whatsapp.js`
2. Service canonicalization candidates:
   - `server/services/contractService.ts` as canonical target
   - `server/services/leadScoringService.ts` as canonical target
   - `server/services/kycService.ts` as canonical target
3. Engine ownership candidate:
   - Consolidate `ninaEngine` to single domain owner and preserve import compatibility wrappers only where needed.

## Acceptance Criteria Check

- [x] Route/service/api overlap audited with measurable counts.
- [x] Duplicate handler candidates mapped with concrete file paths.
- [x] Merge/safe-delete candidate queue published for next wave tasks.
