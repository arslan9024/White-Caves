# Wave 31 — SDD

**Wave:** 31  
**Title:** Corporate Credentials & Compliance Automation  
**Status:** planned  
**Date:** 2026-08-02  
**Predecessor:** Wave 30 (complete)

---

## 1) Objective

Implement an end-to-end compliance document lifecycle for White Caves corporate credentials with:

- canonical document registry and metadata
- expiry monitoring and renewal alerting (90/60/30/14/7 day windows)
- dashboard visibility and auditability
- controlled storage references for PDFs and parsed extracts

This wave converts document handling from ad-hoc references into an operational compliance subsystem.

---

## 2) Scope

### In scope

1. Corporate credential registry model + API.
2. Seed/import path for existing reference documents in `company_documents/`.
3. Expiry status engine and scheduled checks.
4. Notification fanout (in-app + email, optional WhatsApp hook).
5. Compliance dashboard panel for executive/manager/compliance roles.
6. Immutable compliance activity logs for key actions.

### Out of scope

- OCR extraction pipeline implementation from raw scans.
- External government API verification integration (deferred).
- Full DMS migration of legacy files outside declared credential set.

---

## 3) Primary Data Contracts

## 3.1 Entity: `CorporateDocument`

Suggested fields:

- `id`
- `documentType` (enum)
- `authority` (DET / RERA / DLD-EJARI / GDRFA / DCCI / OTHER)
- `referenceNumber`
- `issueDate`
- `expiryDate`
- `status` (valid / expiring_soon / expired / archived)
- `ownerEntity` (default `WHITE_CAVES_REAL_ESTATE_LLC`)
- `storagePathPdf`
- `storagePathParsed`
- `notes`
- `createdBy`
- `updatedBy`
- `createdAt`
- `updatedAt`

## 3.2 Entity: `CorporateDocumentAlert`

- `id`
- `documentId`
- `thresholdDays` (90/60/30/14/7/0)
- `triggeredAt`
- `channel` (in_app / email / whatsapp)
- `deliveryStatus`

## 3.3 Entity: `CorporateDocumentAuditLog`

- `id`
- `documentId`
- `action` (create/update/status_change/alert_triggered/acknowledge/archive)
- `oldValue`
- `newValue`
- `actorUserId`
- `timestamp`

---

## 4) API Surface (Draft)

- `GET /api/v1/compliance/documents`
- `POST /api/v1/compliance/documents`
- `GET /api/v1/compliance/documents/:id`
- `PATCH /api/v1/compliance/documents/:id`
- `POST /api/v1/compliance/documents/:id/archive`
- `POST /api/v1/compliance/documents/import-reference`
- `GET /api/v1/compliance/documents/alerts`
- `POST /api/v1/compliance/documents/:id/acknowledge`

Role policy:

- read: `owner|manager|compliance|finance`
- mutate: `owner|manager|compliance`
- archive: `owner|compliance`

---

## 5) UI Surfaces

1. `ComplianceDocumentsPage` (table + filters + status badges + expiry countdown).
2. `CorporateDocumentForm` (create/edit).
3. `CorporateDocumentDetailDrawer` (history + alerts).
4. `ExecutiveComplianceKpiPanel` (expiring soon / expired / by authority).

---

## 6) Security & Compliance Rules

- Never store secrets or private keys in document metadata.
- Enforce strict RBAC on mutate/archive actions.
- Log all status transitions and alert acknowledgments.
- Keep predictable audit envelope (compatible with existing activity feeds).

---

## 7) Dependencies

- Existing auth + RBAC middleware.
- Existing activity logging patterns.
- Existing scheduler/cron infrastructure.
- Existing notification service abstraction.
- Business documentation governance sources in `docs/business_docs/`.
- Software PM governance sources in `docs/software_docs/`.

---

## 8) Completion Criteria

Wave 31 is complete only when:

1. Corporate document CRUD + import endpoint are live and tested.
2. Expiry status computation and scheduled alerts are running.
3. Compliance dashboard panel shows real metrics and drill-down.
4. Audit logs are emitted for all protected actions.
5. `npm run plans:validate` passes and trackers are synced.
