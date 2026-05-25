# Wave 18 — System Design Document (SDD)

**Wave:** 18  
**Focus:** Real-Estate Platform Workflow Parity Audit + Gap Backlog Generation  
**Status:** 📋 Planned  
**Date:** 2026-05-25  
**Owners:** @Ada + @Margaret + @Mira + @Sofia + @Victoria + @Invoice + @Katherine

---

## Objective

Create a benchmarked, evidence-backed workflow parity model comparing White Caves against top real-estate platforms, then convert uncovered gaps into executable planning artifacts and wave backlogs.

---

## Locked Scope (Wave 18 Defaults)

### Platform Set (v1)

1. Property Finder (Dubai/UAE listing ecosystem)
2. Bayut (Dubai/UAE listing ecosystem)
3. Dubizzle Property (Dubai/UAE listing ecosystem)
4. Betterhomes (brokerage operations benchmark)
5. Allsopp & Allsopp (brokerage operations benchmark)

### Region

- Primary: Dubai/UAE workflows
- Secondary: global CRM patterns only when needed to fill non-portal operational workflows

### Parity Model

- **UAE-adapted parity (default):** White Caves does not require pixel/process cloning if business outcome and compliance obligations are equivalent or stronger for UAE regulations.

---

## External Workflow Taxonomy (Normalized)

W18 taxonomy standardizes all benchmarks into the same process model:

1. Lead capture
2. Lead qualification/scoring
3. Listing lifecycle
4. Viewing scheduling & feedback
5. Offers/negotiation
6. Contracts & document lifecycle
7. Payments & finance workflows
8. Leasing & Ejari workflows
9. Maintenance & tenant support
10. Renewals
11. Compliance/KYC/AML
12. Reporting & analytics
13. Communications (WhatsApp/email)
14. Tenant/Landlord portals
15. Admin ops & governance

---

## White Caves Source-of-Truth Inputs

- Canonical planning stack:
  - `plans/MASTER_PLAN.md`
  - `plans/PENDING_TASKS_ONLY.md`
  - `plans/waves/README.md`
- Workflow docs:
  - `business_docs/04_workflows/*`
  - `business_docs/09_crm_features/*`
  - `business_docs/05_requirements/functional-requirements.md`
- Implementation surfaces:
  - `src/config/crmModuleRegistry.tsx`
  - `server/index.ts`
  - `server/routes/*`

---

## Core Artifact in Wave 18

- [`WAVE_18_WORKFLOW_PARITY_MATRIX.md`](./WAVE_18_WORKFLOW_PARITY_MATRIX.md)

This matrix is the canonical scoring surface with:

- standardized workflow rows
- benchmark platform columns
- White Caves doc/code coverage columns
- validation evidence column
- prioritized gap classification (P0/P1/P2)

---

## Key Design Decisions

1. **Documentation drift is corrected before scoring** (avoid false positives).
2. **Coverage requires both doc + code signal** for “Included”.
3. **Status scale is strict:** Included | Partial | Missing | Unknown.
4. **Unknown is acceptable in v1** when public evidence is weak; it must be converted into a follow-up evidence task.
5. **Gap output is backlog-ready** with impacted modules, dependencies, and acceptance criteria.

---

## Priority Framework

- **P0**: compliance/legal/revenue-critical workflows (KYC, AML, Ejari, payment controls, commission integrity)
- **P1**: conversion/retention operations (viewings, offers, reminders, comms, renewals)
- **P2**: UX/reporting/admin optimization enhancements

---

## Wave 18 Deliverables

1. v1 parity matrix (top 5 platforms, top 20+ workflows)
2. drift reconciliation in CRM feature index docs
3. prioritized gap list with implementation-ready entries
4. canonical queue updates in `MASTER_PLAN.md`, `PENDING_TASKS_ONLY.md`, `waves/README.md`
5. validation gate definition and weekly re-benchmark operating loop

---

## Exit Criteria

Wave 18 is complete when:

1. parity matrix exists and is linked in canonical plans
2. every gap has priority and owner mapping
3. queue updates are reflected in canonical planning files
4. validation gates are testable and explicit
5. `npm run plans:validate` passes
