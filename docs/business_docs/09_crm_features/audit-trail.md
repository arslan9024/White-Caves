# Audit Trail

> **Owner:** @Hedy | **Tool:** Groq Console (Llama 3.1 70B)
> **Purpose:** Immutable, append-only audit log for all CRM actions. Required for RERA compliance.
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM audit trail feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend trust/compliance surfaces in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

The audit trail is the immutable system record for all permission-sensitive and compliance-relevant CRM actions. It supports regulatory review, incident analysis, and forensic verification.

## Requirement catalog

### REQ-AUD-001: Immutable event capture

The system shall capture every compliance-relevant action in an append-only audit log.

**Acceptance criteria:**

- [ ] Create, update, delete, login, logout, and export actions are recorded
- [ ] Each event includes actor, entity, action, timestamp, and source metadata
- [ ] Audit events cannot be modified or deleted after write

**Evidence:** audit event record and append-only enforcement log.

### REQ-AUD-002: Search, filtering, and export

The system shall support searching and exporting the audit trail for authorized users.

**Acceptance criteria:**

- [ ] Search supports user, entity, action, and date filters
- [ ] Export produces CSV and PDF artifacts
- [ ] Results are paginated and stable

**Evidence:** search result snapshot and export file.

### REQ-AUD-003: Compliance retention and tamper evidence

The system shall retain audit events for the required period and prove tamper resistance.

**Acceptance criteria:**

- [ ] Retention meets the documented baseline
- [ ] Tamper attempts are rejected and logged
- [ ] Archived audit output remains readable for compliance review

**Evidence:** retention policy record, tamper test, and archive log.

### REQ-AUD-004: Access control and masking

The system shall restrict sensitive audit views based on role and mask protected values in lower-privilege views.

**Acceptance criteria:**

- [ ] Manager/admin/legal roles can access the audit trail
- [ ] Restricted fields are masked where required
- [ ] Access attempts are themselves audited

**Evidence:** access-control log, masked view snapshot, and audit access record.

## Traceability

- Maps to `REQ-ACP-001` through `REQ-ACP-004`
- Aligns to `WC-SRS-006` and compliance evidence artifacts
- Feeds regulator-ready exports and incident-forensics validation

## 2. Audit Log Schema

Schema fields should include actor, entity, action, previous value, new value, source IP, user agent, and timestamp.

## 3. Tracked Action Types

Tracked actions should include CRUD, authentication, permission changes, export events, and lifecycle state changes.

## 4. Write-Once Enforcement

- Append-only collection policy.
- No update/delete operations permitted.

## 5. Search and Retrieval

- Filters by user, action, entity, date range.
- Pagination and export support.

## 6. Compliance Export

- CSV/PDF exports for inspector audits.
- Export watermark with generation metadata.

## 7. Retention Policy

- 7-year retention baseline.
- Archival strategy with immutable storage.

## 8. API Contract

- `GET /api/audit-trail`
- `GET /api/audit-trail/:id`
- `POST /api/audit-trail/export`

## 9. Access Control

- Manager/admin/legal roles only.
- Sensitive values masked in non-privileged views.

## 10. Acceptance Criteria

- Every critical CRM action emits an audit event.
- Exports are complete and tamper-evident.
- Search latency acceptable under production volume.

## 11. Test Plan

- Event emission coverage tests.
- Tamper attempt rejection tests.
- Export completeness and mask validation tests.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
