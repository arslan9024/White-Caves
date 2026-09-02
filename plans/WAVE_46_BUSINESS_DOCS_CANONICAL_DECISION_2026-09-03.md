# Wave 46 — Business Docs Canonical Root Decision & Migration Map

**Task ID:** W46-005  
**Date:** 2026-09-03  
**Owners:** @Ada + @Sofia  
**Status:** ✅ Complete

## Decision (Canonical Root)

Canonical business documentation root is:

- **`docs/business_docs/`** ✅ (existing, populated, and currently referenced)

Non-canonical root:

- **`business_docs/`** ❌ (not present at repository root)

## Evidence

- Existence checks:
  - `docs/business_docs` exists: `True`
  - `business_docs` exists: `False`
- Corpus size:
  - `docs/business_docs` files: `209`
- Reference drift snapshot:
  - `plans` references to `business_docs/`: `18`
  - `plans` references to `docs/business_docs/`: `2`
  - `docs/plans` references to `business_docs/`: `679`
  - `docs/plans` references to `docs/business_docs/`: `1`

## Canonical Path Policy (Business Docs)

1. All new business-doc links MUST use `docs/business_docs/...`.
2. Existing `business_docs/...` references are considered **legacy path aliases** and must be rewritten in active trackers first.
3. Archive artifacts may retain legacy strings if not used as active execution inputs.
4. Any new wave bundle that introduces business-doc dependencies must include a canonical-path check item.

## Migration Map (Redirect/Pointers)

### Phase A — Active Trackers (P0)

- Update canonical trackers under `/plans` that still use `business_docs/...` to `docs/business_docs/...`.
- Scope-first targets:
  - `plans/MASTER_PLAN.md`
  - `plans/PENDING_TASKS_ONLY.md`
  - `plans/INDEX.md`

### Phase B — Active Wave/Control Surfaces (P1)

- Update currently active wave and governance-facing docs under `docs/plans/`.
- Scope-first targets:
  - `docs/plans/waves/WAVE_46_IMPLEMENTATION_BACKLOG.md`
  - `docs/plans/README.md`

### Phase C — Historical Archives (P2)

- For archived docs, prefer pointer note over mass rewrites unless files are re-activated.
- Keep historical provenance intact.

## Top-Level Domain Pointer Map

Use these canonical prefixes in future links:

- `docs/business_docs/01_company_structure/`
- `docs/business_docs/02_leasing_property_management/`
- `docs/business_docs/03_ai_assistants/`
- `docs/business_docs/04_workflows/`
- `docs/business_docs/05_requirements/`
- `docs/business_docs/06_design_architecture/`
- `docs/business_docs/07_business_model/`
- `docs/business_docs/08_integrations_and_research/`
- `docs/business_docs/09_crm_features/`
- `docs/business_docs/10_design_system_and_security/`
- `docs/business_docs/11_seo/`
- `docs/business_docs/12_srs/`
- `docs/business_docs/13_testing/`
- `docs/business_docs/14_devops/`
- `docs/business_docs/15_release_management/`

## Acceptance Criteria Check

- [x] Canonical root selected using measurable evidence.
- [x] Redirect/migration map defined with phased execution.
- [x] Domain-level pointer prefixes documented for consistent future linking.
