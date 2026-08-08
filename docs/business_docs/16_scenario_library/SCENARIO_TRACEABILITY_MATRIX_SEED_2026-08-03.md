# Scenario Traceability Matrix (Seed)

**Status:** Active Seed  
**Owner:** Scenario Governance + QA  
**Last Updated:** 2026-08-03  
**Next Review:** 2026-08-21  
**Source of Truth:** Seed matrix binding scenario IDs to requirements, controls, and validation evidence

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- scenario-governance and release-readiness lanes in `docs/plans/waves/WAVE_35_*` and `WAVE_36_*`

## 1. Purpose

Provide an initial traceability seed that binds business scenarios to requirements, policy controls, and test/UAT evidence.

## 2. Matrix fields

| Field | Description |
| --- | --- |
| Scenario ID | `SCN-*` unique ID |
| Journey Ref | `JRN-*` critical journey anchor |
| Requirement Links | `REQ/FR/BR/NFR/AC` IDs |
| Policy Controls | `POL-*` IDs |
| API/Module | Route/service/component touchpoint |
| Audit Event | Expected immutable event name |
| Test/UAT Ref | Test ID or UAT case ID |
| Owner | Team accountable |

## 3. Seed mappings (first 20)

| Scenario ID | Journey Ref | Requirement Links | Policy Controls | API/Module | Audit Event | Test/UAT Ref | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCN-COMP-DOC-REGISTER-COMP-0001 | JRN-017 | REQ-COMP-001, FR-COMP-003 | POL-RERA-001 | /api/compliance/corporate-documents | corporate_document_created | UAT-COMP-001 | Compliance |
| SCN-COMP-DOC-UPDATE-COMP-0002 | JRN-017 | REQ-COMP-002, BR-COMP-001 | POL-RERA-001 | /api/compliance/corporate-documents/:id | corporate_document_updated | UAT-COMP-002 | Compliance |
| SCN-COMP-DOC-ARCHIVE-COMP-0003 | JRN-017 | REQ-COMP-003, BR-COMP-004 | POL-RERA-001 | /api/compliance/corporate-documents/:id/archive | corporate_document_archived | UAT-COMP-003 | Compliance |
| SCN-COMP-ALERT-ACK-COMP-0004 | JRN-017 | REQ-COMP-004, FR-COMP-007 | POL-PDPL-001 | /api/compliance/corporate-documents/alerts/:id/acknowledge | corporate_document_alert_acknowledged | UAT-COMP-004 | Compliance |
| SCN-LEASE-EJARI-REGISTER-COMP-0005 | JRN-008 | REQ-LEASE-010, FR-LEASE-012 | POL-EJARI-001 | /api/compliance/ejari/activate | ejari_registered | UAT-LEASE-008 | Leasing |
| SCN-LEASE-EJARI-RENEW-COMP-0006 | JRN-009 | REQ-LEASE-011, BR-LEASE-009 | POL-EJARI-001 | /api/compliance/ejari/renew | ejari_renewal_processed | UAT-LEASE-009 | Leasing |
| SCN-LEASE-EJARI-EXPIRE-COMP-0007 | JRN-009 | REQ-LEASE-012, NFR-OPS-004 | POL-EJARI-001 | compliance expiry scheduler | ejari_expiry_alert_created | UAT-LEASE-010 | Leasing |
| SCN-FIN-COMMISSION-CALC-FIN-0008 | JRN-012 | REQ-FIN-003, FR-FIN-004 | POL-AML-001 | commission engine | commission_calculated | UAT-FIN-004 | Finance |
| SCN-FIN-COMMISSION-APPROVE-FIN-0009 | JRN-012 | REQ-FIN-004, BR-FIN-006 | POL-AML-001 | commission approval workflow | commission_approved | UAT-FIN-005 | Finance |
| SCN-FIN-VAT-REPORT-FIN-0010 | JRN-013 | REQ-FIN-006, FR-FIN-010 | POL-PDPL-001 | /api/compliance/vat-summary | vat_summary_generated | UAT-FIN-007 | Finance |
| SCN-COMP-KYC-UPLOAD-COMP-0011 | JRN-010 | REQ-COMP-010, FR-COMP-014 | POL-AML-001 | /api/compliance/kyc/:leadId/documents | kyc_document_uploaded | UAT-COMP-010 | Compliance |
| SCN-COMP-KYC-REVIEW-COMP-0012 | JRN-010 | REQ-COMP-011, BR-COMP-014 | POL-AML-001 | /api/compliance/kyc/documents/:id/review | kyc_document_reviewed | UAT-COMP-011 | Compliance |
| SCN-COMP-AML-SCREEN-COMP-0013 | JRN-010 | REQ-COMP-014, FR-COMP-019 | POL-AML-001 | /api/compliance/aml/screen | aml_screened | UAT-COMP-014 | Compliance |
| SCN-COMP-AML-RESOLVE-COMP-0014 | JRN-017 | REQ-COMP-015, BR-COMP-018 | POL-AML-001 | /api/compliance/aml/alerts/:id/resolve | aml_alert_resolved | UAT-COMP-015 | Compliance |
| SCN-COMP-CONSENT-CREATE-COMP-0015 | JRN-011 | REQ-PRIV-001, FR-PRIV-002 | POL-PDPL-001 | /api/compliance/consent | pdpl_consent_created | UAT-PRIV-001 | Compliance |
| SCN-COMP-CONSENT-REVOKE-COMP-0016 | JRN-011 | REQ-PRIV-002, BR-PRIV-005 | POL-PDPL-001 | /api/compliance/consent/:id/revoke | pdpl_consent_revoked | UAT-PRIV-002 | Compliance |
| SCN-SALES-VIEWING-BOOK-OPS-0017 | JRN-005 | REQ-SALES-007, FR-SALES-009 | POL-PDPL-001 | /api/viewings | viewing_created | UAT-SALES-005 | Sales |
| SCN-SALES-OFFER-SUBMIT-FIN-0018 | JRN-006 | REQ-SALES-010, BR-SALES-011 | POL-AML-001 | /api/offers | offer_submitted | UAT-SALES-010 | Sales |
| SCN-OPS-MAINTENANCE-OPEN-OPS-0019 | JRN-014 | REQ-OPS-003, FR-OPS-005 | POL-PDPL-001 | /api/maintenance | maintenance_request_opened | UAT-OPS-003 | Operations |
| SCN-EXEC-KPI-REFRESH-OPS-0020 | JRN-019 | REQ-DA-004, NFR-DA-003 | POL-PDPL-001 | executive KPI panel | executive_kpi_refreshed | UAT-DA-004 | Executive |

## 4. Expansion rule

All future batches must append mappings in this file or a partitioned continuation matrix with identical columns.

## 5. A2 seed mappings (0201–0220 sample)

| Scenario ID | Journey Ref | Requirement Links | Policy Controls | API/Module | Audit Event | Test/UAT Ref | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCN-SALES-LEAD-INGEST-OPS-0201 | JRN-001 | REQ-SALES-001, FR-SALES-001 | POL-PDPL-001 | /api/leads | lead_created | UAT-SALES-001 | Sales |
| SCN-SALES-LEAD-INGEST-OPS-0202 | JRN-001 | REQ-SALES-002, FR-SALES-002 | POL-PDPL-001 | /api/webhooks/meta | lead_created_from_whatsapp | UAT-SALES-002 | Sales |
| SCN-SALES-LEAD-INGEST-OPS-0208 | JRN-001 | REQ-SALES-008, BR-SALES-006 | POL-PDPL-001 | lead dedup service | lead_duplicate_flagged | UAT-SALES-003 | Sales |
| SCN-SALES-LEAD-QUALIFY-OPS-0211 | JRN-002 | REQ-SALES-010, FR-SALES-010 | POL-PDPL-001 | lead scoring service | lead_qualified_scored | UAT-SALES-004 | Sales |
| SCN-SALES-LEAD-ASSIGN-OPS-0221 | JRN-003 | REQ-SALES-018, BR-SALES-020 | POL-PDPL-001 | assignment router | lead_assigned | UAT-SALES-005 | Sales |
| SCN-SALES-LEAD-STAGE-OPS-0233 | JRN-004 | REQ-SALES-026, FR-SALES-020 | POL-PDPL-001 | /api/leads/:id/stage | lead_stage_transitioned | UAT-SALES-006 | Sales |
| SCN-SALES-VIEWING-BOOK-OPS-0266 | JRN-005 | REQ-SALES-055, FR-SALES-052 | POL-PDPL-001 | /api/viewings | viewing_created | UAT-SALES-007 | Sales |
| SCN-SALES-VIEWING-BOOK-OPS-0268 | JRN-005 | REQ-SALES-057, BR-SALES-053 | POL-PDPL-001 | viewing conflict checker | viewing_conflict_detected | UAT-SALES-008 | Sales |
| SCN-SALES-VIEWING-REMINDER-OPS-0281 | JRN-005 | REQ-SALES-068, FR-SALES-057 | POL-PDPL-001 | viewing reminder scheduler | viewing_reminder_sent | UAT-SALES-009 | Sales |
| SCN-SALES-VIEWING-COMPLETE-OPS-0316 | JRN-005 | REQ-SALES-097, FR-SALES-068 | POL-PDPL-001 | /api/viewings/:id/complete | viewing_completed | UAT-SALES-010 | Sales |
| SCN-SALES-OFFER-CREATE-FIN-0331 | JRN-006 | REQ-SALES-120, FR-SALES-080 | POL-AML-001 | /api/offers | offer_submitted | UAT-SALES-011 | Sales |
| SCN-SALES-OFFER-NEGOTIATE-FIN-0341 | JRN-006 | REQ-SALES-130, FR-SALES-084 | POL-AML-001 | offer negotiation engine | offer_counter_submitted | UAT-SALES-012 | Sales |
| SCN-SALES-OFFER-APPROVE-FIN-0351 | JRN-006 | REQ-SALES-139, FR-SALES-088 | POL-AML-001 | /api/offers/:id/approve | offer_accepted | UAT-SALES-013 | Sales |
| SCN-SALES-OFFER-REJECT-FIN-0361 | JRN-006 | REQ-SALES-149, FR-SALES-092 | POL-AML-001 | /api/offers/:id/reject | offer_rejected | UAT-SALES-014 | Sales |
| SCN-SALES-OFFER-EXPIRY-FIN-0371 | JRN-006 | REQ-SALES-159, FR-SALES-096 | POL-AML-001 | offer expiry scheduler | offer_expired | UAT-SALES-015 | Sales |
| SCN-SALES-OFFER-DOCS-FIN-0381 | JRN-007 | REQ-SALES-167, FR-SALES-100 | POL-PDPL-001 | document generation service | mou_draft_generated | UAT-SALES-016 | Sales |
| SCN-SALES-CONVERT-KYC-COMP-0411 | JRN-008 | REQ-SALES-200, FR-SALES-115 | POL-AML-001 | conversion compliance gate | conversion_kyc_gate_checked | UAT-SALES-017 | Compliance |
| SCN-SALES-CONVERT-AML-COMP-0418 | JRN-008 | REQ-SALES-206, BR-SALES-116 | POL-AML-001 | conversion compliance gate | conversion_blocked_aml_open | UAT-SALES-018 | Compliance |
| SCN-SALES-CONVERT-STAGE-OPS-0426 | JRN-009 | REQ-SALES-214, FR-SALES-122 | POL-PDPL-001 | /api/leads/:id/convert | lead_converted_to_deal | UAT-SALES-019 | Sales |
| SCN-SALES-CLOSE-OPS-0450 | JRN-009 | REQ-SALES-238, FR-SALES-133 | POL-AML-001 | deal closure engine | deal_closed | UAT-SALES-020 | Sales |

## 6. A3 seed mappings (0501–0520 sample)

| Scenario ID | Journey Ref | Requirement Links | Policy Controls | API/Module | Audit Event | Test/UAT Ref | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SCN-OPS-MNT-INTAKE-OPS-0501 | JRN-014 | REQ-OPS-001, FR-OPS-001 | POL-PDPL-001 | /api/maintenance | maintenance_ticket_created | UAT-OPS-001 | Operations |
| SCN-OPS-MNT-INTAKE-OPS-0509 | JRN-014 | REQ-OPS-008, BR-OPS-006 | POL-HSE-001 | maintenance triage engine | maintenance_priority_emergency_set | UAT-OPS-002 | Operations |
| SCN-OPS-MNT-INTAKE-OPS-0520 | JRN-014 | REQ-OPS-014, BR-AUDIT-100 | POL-PDPL-001 | /api/maintenance | maintenance_ticket_created_audit | UAT-OPS-003 | Operations |
| SCN-OPS-DISPATCH-OPS-0561 | JRN-015 | REQ-OPS-050, FR-OPS-020 | POL-PDPL-001 | dispatch assignment engine | maintenance_contractor_assigned | UAT-OPS-004 | Operations |
| SCN-OPS-DISPATCH-SCHED-0581 | JRN-015 | REQ-OPS-069, FR-OPS-026 | POL-PDPL-001 | /api/maintenance/:id/schedule | maintenance_visit_scheduled | UAT-OPS-005 | Operations |
| SCN-OPS-DISPATCH-VENDOR-0610 | JRN-015 | REQ-OPS-095, FR-OPS-034 | POL-HSE-001 | contractor completion module | maintenance_work_checklist_submitted | UAT-OPS-006 | Operations |
| SCN-OPS-INCIDENT-SLA-0621 | JRN-016 | REQ-OPS-110, NFR-OPS-100 | POL-PDPL-001 | SLA engine | maintenance_sla_timer_started | UAT-OPS-007 | Operations |
| SCN-OPS-INCIDENT-SLA-0631 | JRN-016 | REQ-OPS-116, NFR-OPS-102 | POL-PDPL-001 | SLA engine | maintenance_sla_breached | UAT-OPS-008 | Operations |
| SCN-OPS-INCIDENT-EMR-0641 | JRN-016 | REQ-OPS-126, FR-OPS-042 | POL-HSE-001 | incident response module | maintenance_incident_opened | UAT-OPS-009 | Operations |
| SCN-OPS-INCIDENT-ESC-0661 | JRN-016 | REQ-OPS-143, FR-OPS-047 | POL-PDPL-001 | escalation engine | maintenance_incident_escalated | UAT-OPS-010 | Operations |
| SCN-OPS-INCIDENT-RCA-0681 | JRN-016 | REQ-OPS-162, FR-OPS-051 | POL-PDPL-001 | RCA workflow module | incident_rca_opened | UAT-OPS-011 | Operations |
| SCN-OPS-RESOLVE-QA-0705 | JRN-014 | REQ-OPS-184, FR-OPS-061 | POL-PDPL-001 | QA review module | maintenance_resolution_approved | UAT-OPS-012 | Operations |
| SCN-OPS-RESOLVE-FIN-0721 | JRN-018 | REQ-OPS-199, FR-FIN-060 | POL-PDPL-001 | finance invoice module | maintenance_invoice_draft_created | UAT-OPS-013 | Finance |
| SCN-OPS-RESOLVE-CSAT-0741 | JRN-014 | REQ-OPS-217, FR-OPS-068 | POL-PDPL-001 | CSAT survey module | maintenance_csat_requested | UAT-OPS-014 | Operations |
| SCN-OPS-ANALYTICS-0761 | JRN-019 | REQ-OPS-240, FR-DA-100 | POL-PDPL-001 | operations dashboard | operations_dashboard_metric_refreshed | UAT-OPS-015 | Executive |
| SCN-OPS-AUTO-0771 | JRN-019 | REQ-OPS-249, FR-OPS-076 | POL-PDPL-001 | snapshot engine | operations_snapshot_generated | UAT-OPS-016 | Operations |
| SCN-OPS-GOV-VERIFY-0781 | JRN-020 | REQ-GOV-047, BR-GOV-045 | POL-PDPL-001 | governance validator | scenario_batch_uniqueness_verified | UAT-GOV-011 | Governance |
| SCN-OPS-GOV-VERIFY-0788 | JRN-020 | REQ-GOV-054, BR-GOV-052 | POL-PDPL-001 | governance validator | coverage_matrix_sync_verified | UAT-GOV-012 | Governance |
| SCN-OPS-GOV-VERIFY-0799 | JRN-020 | REQ-GOV-065, BR-GOV-060 | POL-PDPL-001 | governance publication module | scenario_batch_completion_memo_published | UAT-GOV-013 | Governance |
| SCN-OPS-GOV-VERIFY-0800 | JRN-020 | REQ-GOV-066, AC-GOV-028 | POL-PDPL-001 | governance signoff module | scenario_batch_closed | UAT-GOV-014 | Governance |
