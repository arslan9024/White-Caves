# Wave 31 — Implementation Backlog

**Wave:** 31  
**Focus:** Corporate Credentials & Compliance Automation  
**Status:** planned  
**Date:** 2026-08-02  
**Entry Gate:** Wave 30 closeout + readiness 60% + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`

---

| ID      | Priority | Task                                                                                                                   | Owner              | Validation                                           |
| ------- | -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------- |
| W31-001 | P0       | Add data model + migration for `CorporateDocument`, `CorporateDocumentAlert`, and audit trail entity                   | @Mira + @Barbara   | Typecheck + migration smoke + model unit tests       |
| W31-002 | P0       | Implement document CRUD routes with role guards and structured validation                                              | @Mira + @Radia     | Route tests: 2xx + 403 + validation 400 paths        |
| W31-003 | P0       | Build import endpoint that ingests `company_documents/normalized/company_documents_registry.json` into canonical store | @Mira              | Integration test validates idempotent import         |
| W31-004 | P1       | Implement expiry status engine (`valid`, `expiring_soon`, `expired`) with threshold metadata                           | @Barbara + @Mira   | Unit tests for boundary dates and status transitions |
| W31-005 | P1       | Add scheduler for expiry checks and alert generation (90/60/30/14/7/0 days)                                            | @Mira              | Scheduler test with mocked dates + dedupe checks     |
| W31-006 | P1       | Integrate notification fanout (in-app/email, optional WhatsApp hook) for generated alerts                              | @Jaime + @Mira     | Integration test confirms delivery event emissions   |
| W31-007 | P0       | Emit immutable audit log records for create/update/status/acknowledge/archive actions                                  | @Katherine + @Mira | Audit route tests ensure records are append-only     |
| W31-008 | P1       | Build Compliance Documents UI (list, filters, badge states, expiry countdown)                                          | @Una + @Tracy      | Vitest component coverage + accessibility checks     |
| W31-009 | P1       | Add Executive KPI panel (expiring soon / expired / authority breakdown)                                                | @Cassie + @Una     | Dashboard contract + rendering tests                 |
| W31-010 | P0       | Closeout: tracker sync + governance validation + targeted regression pack                                              | @Katherine         | `npm run plans:validate` + targeted tests green      |

---

## Sequencing

1. Data model + CRUD + import (`W31-001` to `W31-003`)
2. Expiry engine + scheduler + notifications (`W31-004` to `W31-006`)
3. Audit guarantees + UI/Executive surfaces (`W31-007` to `W31-009`)
4. Governance closeout (`W31-010`)
5. Documentation governance hardening (`W31-011` to `W31-013`)

---

## Documentation Governance Hardening Tasks

- **W31-011 (P0)** — Confirm canonical docs structure and normalize planning references to `docs/*` paths.
  - **Owner:** @Ada + @Margaret
  - **Validation:** Index/tracker consistency review + `npm run plans:validate`

- **W31-012 (P1)** — Publish business documentation coverage matrix + roadmap (profile/org/services/inventory/finance/HR/policies/trends).
  - **Owner:** @Dena + @Victoria
  - **Validation:** Coverage matrix + roadmap linked from business docs README

- **W31-013 (P1)** — Publish software PM governance index + software docs upgrade roadmap for SDLC/traceability/quality gates.
  - **Owner:** @Mala + @Gwynne
  - **Validation:** Governance index/roadmap linked from software docs index

---

## Acceptance Gate

Wave 31 is complete only when:

1. Canonical corporate documents can be created/read/updated/archived under RBAC.
2. Existing reference registry imports idempotently from `company_documents`.
3. Expiry alerts trigger exactly once per threshold per document.
4. Compliance dashboard and executive KPI surfaces are operational.
5. Audit trail is complete and immutable for regulated actions.
6. `npm run plans:validate` passes and trackers reflect Wave 31 state.
