# Wave 31 — Readiness Packet

**Wave:** 31  
**Title:** Corporate Credentials & Compliance Automation  
**Date:** 2026-08-02  
**Status:** under-review

---

## Readiness Score: 78% ✅ (above 60% unlock threshold)

---

## Gate Checklist

| #   | Gate                                | Status | Evidence                                                                   |
| --- | ----------------------------------- | ------ | -------------------------------------------------------------------------- |
| 1   | Business rules documented           | ✅     | `WAVE_31_SDD.md` sections 1–8                                              |
| 2   | API contract draft present          | ✅     | `WAVE_31_SDD.md` API Surface                                               |
| 3   | Data schema defined                 | ✅     | `CorporateDocument`, `CorporateDocumentAlert`, `CorporateDocumentAuditLog` |
| 4   | Validation path for each task       | ✅     | `WAVE_31_IMPLEMENTATION_BACKLOG.md` validation column                      |
| 5   | Security / RBAC posture clear       | ✅     | Role policy in SDD + existing middleware reuse                             |
| 6   | Source evidence available           | ✅     | `company_documents/normalized/company_documents_registry.json`             |
| 7   | Operational ownership clear         | ✅     | Compliance + Finance + Executive owners in backlog                         |
| 8   | External dependency blockers absent | 🟡     | Government API verification deferred (non-blocking)                        |

### Documentation Modernization Inputs (2026-08-02)

- Business coverage baseline: `docs/business_docs/BUSINESS_DOCS_COVERAGE_MATRIX_2026-08-02.md`
- Business roadmap: `docs/business_docs/BUSINESS_DOCS_UPGRADE_ROADMAP_2026-Q3.md`
- Software PM governance baseline: `docs/software_docs/PROJECT_MANAGEMENT_GOVERNANCE_INDEX_2026-08-02.md`
- Software docs roadmap: `docs/software_docs/SOFTWARE_DOCS_UPGRADE_ROADMAP_2026-Q3.md`

These artifacts are now prerequisite references for Wave 31 tracker sync and subsequent planning upgrades.

---

## Key Risks & Mitigations

| Risk                                      | Likelihood | Impact | Mitigation                                                      |
| ----------------------------------------- | ---------- | ------ | --------------------------------------------------------------- |
| Date-format mismatch for expiry fields    | Medium     | Medium | Normalize on ingest to ISO `YYYY-MM-DD`                         |
| Duplicate references across authorities   | Medium     | High   | Enforce `(documentType, authority, referenceNumber)` uniqueness |
| Alert fatigue from repeated notifications | Medium     | Medium | Idempotent threshold trigger log + per-document cooldown        |
| Permission drift in admin routes          | Low        | High   | Reuse existing RBAC guard + route tests for 403 paths           |

---

## Recommended Delivery Cadence

- Day 1–2: data model + CRUD + import
- Day 3: expiry engine + scheduler
- Day 4: notification fanout + audit logs
- Day 5: compliance dashboard + closeout checks

---

## Approval Phrase

Use the standard approval phrase before implementation autopilot:

`@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`
