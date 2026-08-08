# Document Generation

> **Owner:** @Annie | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Purpose:** PDF generation for Ejari certificates, tenancy agreements, NOC letters, maintenance work orders, and payment receipts.
> **Status:** In Progress — expanded with governed templates, storage rules, and e-signature hooks.
> **Priority Scope:** MD + Leasing Agent first with receipt generation reliability as P0 requirement.  
> **Last Updated:** 2026-08-07  
> **Next Review:** 2026-08-21  
> **Source of Truth:** CRM document generation feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend reliability and closure lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

The Document Generation module creates legally consistent property-operation documents from structured CRM records. It must support tenant, landlord, agent, and finance workflows without requiring manual Word document editing.

### Priority persona alignment (P0)

- **MD (`owner`)**: requires audit-grade visibility of receipt and contract document integrity.
- **Leasing Agent (`leasing_agent`)**: requires reliable, fast generation/delivery of tenancy and receipt documents.
- **Reference scenario profile:** `agent.one.whitecaves@gmail.com` for first-agent leasing and receipt flow acceptance.

## Requirement catalog

### REQ-DOC-001: Template-based document generation

The system shall generate legally governed documents from approved templates and structured records.

**Acceptance criteria:**

- [ ] Core documents can be generated from pre-approved templates
- [ ] Required fields are validated before render
- [ ] Template version is stored with the generated output

**Evidence:** generated document record and template version audit.

### REQ-DOC-002: Storage, naming, and download controls

The system shall store generated documents using safe file names and tenant-scoped paths.

**Acceptance criteria:**

- [ ] Document paths follow the documented folder convention
- [ ] Download endpoints require authentication
- [ ] Draft and signed copies remain separated

**Evidence:** storage record, download audit, and path snapshot.

### REQ-DOC-003: E-signature integration and failure handling

The system shall support signature workflows and preserve failure state for manual recovery.

**Acceptance criteria:**

- [ ] Signature events update document status
- [ ] Failed renders return a structured error
- [ ] Retry behavior is capped and observable

**Evidence:** signature webhook log and failure audit.

### REQ-DOC-004: Document-specific validation rules

The system shall enforce document-specific variables for Ejari, tenancy, NOC, maintenance, and payment documents.

**Acceptance criteria:**

- [ ] Each document type has a documented variable set
- [ ] Missing variables stop generation with a clear message
- [ ] Generated files contain the correct metadata and signatures

**Evidence:** template validation log and sample output review.

### REQ-DOC-005: Receipt generation, delivery, and archive continuity

The system shall enforce receipt lifecycle continuity for paid tenancy events.

**Acceptance criteria:**

- [ ] Receipt records include lease ID, payment reference, and issuance timestamp
- [ ] Receipt delivery status is visible to leasing workflow owners
- [ ] Failed delivery paths create actionable retry/escalation events

**Evidence:** receipt lifecycle audit and delivery status report.

## Traceability

- Maps to `REQ-LGL-001`, `REQ-LGL-003`, and `REQ-FRPT-002`
- Aligns to `WC-SRS-012`, `WC-SRS-016`, and document evidence artifacts
- Feeds generation, signing, and download validation
- Priority linkage: aligns with MD oversight and Leasing Agent receipt completion controls

### Core Goals

- Generate standard documents from pre-approved templates
- Enforce required fields before rendering
- Track every generated document in audit logs
- Support both preview and download flows
- Integrate with e-signature providers without rewriting templates

## 2. Document Types and Template Variables

### Required Document Catalog

- Ejari certificate
- Tenancy agreement
- NOC letter
- Maintenance work order
- Payment receipt

### Shared Template Variables

- Party details: names, IDs, contact information
- Property details: address, unit, community, title deed or permit references
- Financial terms: rent, commission, fees, payment schedule, VAT fields
- Signature blocks: tenant, landlord, agent, authorized signatory
- Metadata: generatedBy, generatedAt, documentId, leaseId, version

### Document-Specific Variables

| Document               | Required Variables                                                                |
| ---------------------- | --------------------------------------------------------------------------------- |
| Ejari certificate      | Ejari number, lease term, tenant ID, landlord ID, property address, rental amount |
| Tenancy agreement      | contract parties, unit details, term, renewal terms, PDC schedule                 |
| NOC letter             | requester name, purpose, property reference, landlord approval statement          |
| Maintenance work order | request category, priority, contractor assignment, SLA target                     |
| Payment receipt        | payment amount, date, method, reference number, outstanding balance               |

## 3. Template Engine Selection (Puppeteer vs PDFKit)

### Decision

Use **Puppeteer** for the primary generation path because it preserves brand layout, typography, and complex legal formatting more reliably than a low-level PDF canvas.

### Engine Rules

- Puppeteer renders approved HTML templates to PDF
- PDFKit may be used only for lightweight receipts or fallback generation
- Templates must be validated before render to prevent blank or malformed PDFs
- Rendering must be deterministic for the same input payload

### Failure Handling

- If the HTML renderer fails, return a structured error with template name and missing field list
- If the browser render process times out, retry once with a smaller context set
- If all render paths fail, preserve the draft payload for manual recovery

## 4. Required Document Catalog

- Ejari certificate
- Tenancy agreement
- NOC letter
- Maintenance work order
- Payment receipt

## 5. Template Variable Schema

- Party details, property data, financial terms, signature blocks
- Validation for required placeholders before render
- Immutable template version ID stored with every generated document

## 6. Storage and Naming Rules

- Path: `uploads/documents/{tenantId}/`
- Naming: `{docType}_{leaseId}_{timestamp}.pdf`
- Drafts and signed copies are stored separately
- Filenames must remain safe for download URLs and audit exports

## 7. Generation API Contract

- `POST /api/documents/generate`
- `GET /api/documents/:id`
- `GET /api/documents/:id/html`
- `POST /api/documents/generate-auto`
- `PATCH /api/documents/:id/status`

**Compatibility note:** dedicated download and e-signature endpoints such as `GET /api/documents/:id/download` and `POST /api/documents/:id/sign` remain future integration surfaces unless explicit runtime routes are added.

### Receipt contract mapping (canonical)

- Receipt generation uses `POST /api/documents/generate` with `type = payment_receipt`.
- Receipt status retrieval uses `GET /api/documents/:id`.
- Receipt lifecycle updates use `PATCH /api/documents/:id/status`.
- Dedicated `/api/documents/receipts/*` paths are treated as legacy conceptual aliases unless explicitly implemented in a future wave.

## 8. E-Signature Hooks

- Signature provider integration events: requested, signed, rejected
- Signed copy replaces draft version with immutable revision
- Webhook events must update document status and append audit entries

## 9. Error Handling and Retry

- Template validation errors returned with field-level details
- Render failures retried with capped backoff
- Audit log records the failure reason and retry count

## 10. Acceptance Criteria

- All 5 core documents render with valid data
- Downloads and signatures are traceable in audit trail
- Document generation latency stays within the defined SLA
- Missing required fields fail fast with clear feedback
- Receipt generation and delivery events are visible in leasing operations dashboards
- Receipt archival is traceable with immutable audit linkage

## 11. Test Plan

- Snapshot tests for templates
- Integration tests for generate/retrieve/status lifecycle flow
- Negative tests for missing variables
- Regression tests for versioned template changes

---

_This file was scaffolded by `scripts/orchestrator/scaffold-docs.ps1` and then expanded into a governed document-generation spec._
