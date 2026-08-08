# Wave 33 — SDD

**Wave:** 33  
**Title:** Business Docs Canonicalization and Coverage Completion  
**Status:** planned  
**Date:** 2026-08-07  
**Predecessor:** Wave 32 (documentation governance, traceability & progress intelligence)

---

## 1) Objective

Bring `docs/business_docs/` to a fully current, navigable, implementation-ready state by repairing stale entrypoints, rebuilding canonical indexes from actual file inventory, hardening requirement framing, and surfacing missing operating-model coverage such as scenario-library posture, HR/policy entrypoints, and release-governance freshness.

---

## 2) Scope

### In scope

1. Canonical refresh of `docs/business_docs/README.md`.
2. Canonical refresh of `docs/business_docs/09_crm_features/README.md`.
3. Requirements-front-door hardening in `docs/business_docs/05_requirements/README.md` and `requirements-framework.md`.
4. Testing/scenario posture upgrade centered on `docs/business_docs/13_testing/uat-scenarios.md`.
5. Release-management freshness repair centered on `docs/business_docs/15_release_management/README.md`.
6. Clear surfacing of HR/policy/company-ops entrypoints from within canonical business docs.

### Out of scope

- Source-code implementation under `src/` or `server/`.
- Large-scale rewriting of every individual CRM feature specification.
- Automatic code-traceability generation from the application source.

---

## 3) Primary Deliverables

### 3.1 Canonical business-doc entrypoints

- `docs/business_docs/README.md`
- `docs/business_docs/09_crm_features/README.md`
- `docs/business_docs/05_requirements/README.md`
- `docs/business_docs/05_requirements/requirements-framework.md`

### 3.2 Coverage and gap artifacts

- refreshed scenario posture in `docs/business_docs/13_testing/uat-scenarios.md`
- refreshed release-management entrypoint in `docs/business_docs/15_release_management/README.md`
- wave companion coverage matrices referenced from backlog tasks

---

## 4) Quality Rules

All Wave 33 updates must:

- use canonical `docs/` paths only;
- include owner, status, and last-updated metadata on key index files;
- distinguish active guidance from historical snapshot material;
- avoid stale governance phrases that conflict with current wave-gate rules;
- point future implementation teams toward exact canonical business references.

---

## 5) Dependencies

- Wave 32 governance and traceability normalization outputs.
- Canonical source-of-truth ordering from `docs/AUTHORITATIVE_DOC_MAP_2026-08-06.md`.
- Existing business requirements inventory in `docs/business_docs/05_requirements/functional-requirements.md`.

---

## 6) Completion Criteria

Wave 33 is complete only when:

1. Canonical business-doc front doors reflect the actual 2026 file inventory.
2. Stale dates, legacy navigation, and contradictory readiness phrases are removed or marked historical.
3. Requirements framework references are either validated, replaced, or explicitly retired.
4. Scenario-library posture is upgraded from narrow UAT framing to broader business-scenario coverage guidance.
5. Release-management entrypoints reflect current operational reality and future-wave handoff expectations.
6. `npm run plans:validate` passes after tracker synchronization.
