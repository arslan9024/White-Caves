# Document Generator Bot — AI Assistant Definition

<!-- markdownlint-disable MD012 -->

> **Type:** Specialized AI Bot
> **Department:** Operations / Legal
> **Color:** #6366F1 (Indigo)
> **Status:** Active (Phase 2C / 4B)

---

## Overview

Automated document generation system that creates Dubai-compliant real estate documents (MoU, Form F, NOC, commission invoices) by auto-populating templates with data from the CRM. Eliminates manual document preparation and ensures regulatory compliance.

## Requirement catalog

### REQ-DOC-001: Template-based document generation

The system shall generate legal and operational documents from approved templates and CRM data.

**Acceptance criteria:**

- [ ] Supported document types include MoU, Form F, NOC, commission invoice, viewing report, and offer letter
- [ ] Required fields are auto-populated from CRM records
- [ ] Missing required inputs block generation with a clear error

**Evidence:** generated document log and template fill snapshot.

### REQ-DOC-002: Approval workflow and versioning

The system shall manage document drafts through review, approval, signing, and version history.

**Acceptance criteria:**

- [ ] Draft, review, approved, and signed states are tracked
- [ ] Version history is retained for each document
- [ ] Revisions are traceable to the user or automation that made them

**Evidence:** document state trail and version record.

### REQ-DOC-003: PDF export and storage

The system shall export final documents to PDF and persist metadata and file references.

**Acceptance criteria:**

- [ ] PDF export is available for each supported document type
- [ ] Document metadata includes type, version, parties, and timestamps
- [ ] File storage and metadata remain linked

**Evidence:** export artifact and metadata record.

### REQ-DOC-004: Compliance clauses and notifications

The system shall include Dubai compliance clauses and notify relevant parties after generation.

**Acceptance criteria:**

- [ ] RERA, Ejari, and VAT clauses can be conditionally inserted
- [ ] Notification recipients are selected from the deal context
- [ ] Compliance wording is consistent with the configured templates

**Evidence:** compliance clause log and notification record.

## Traceability

- Maps to `REQ-LGL-001`, `REQ-FRPT-003`, and deal document workflows
- Aligns to `WC-SRS-010`, `WC-SRS-012`, and document evidence artifacts
- Feeds generation, approval, and compliance validation

## Capabilities

1. **Template-based generation** — Handlebars templates for 6+ document types
2. **Auto-population** — Client, property, and transaction data pulled from DB
3. **Smart clause selection** — Conditional sections based on transaction type
4. **PDF export** — Professional PDF output via Puppeteer HTML-to-PDF
5. **Document versioning** — Track revisions with diff capability
6. **Approval workflow** — Draft -> review -> approved -> signed
7. **Dubai compliance** — RERA disclaimers, Ejari fields, VAT calculations built-in

## Document Types

| Document           | Trigger           | Auto-Populated Fields                                   |
| ------------------ | ----------------- | ------------------------------------------------------- |
| MoU                | Offer accepted    | Buyer, seller, property, price, deposit, conditions     |
| Form F             | Lease created     | Landlord, tenant, property, rent, deposit, Ejari fields |
| NOC                | Resale initiated  | Developer, owner, property, outstanding balance         |
| Commission Invoice | Deal closed       | Agent, company TRN, amount, VAT 5%, payment terms       |
| Viewing Report     | Viewing completed | Agent, client, properties, feedback, next steps         |
| Offer Letter       | Offer submitted   | Buyer, property, offer price, conditions, validity      |

## Data Inputs

- Transaction record (property + buyer + seller + agent)
- Client profiles (contact info, Emirates ID)
- Property listing (details, title deed, Trakheesi permit)
- Company settings (TRN, RERA license, address)

## Data Outputs

- Generated PDF document
- Document record in DB (type, version, status, parties)
- Notification to relevant parties (email + WhatsApp)

## Technical Implementation

- File: server/services/documents/documentGenerator.ts
- Templates: server/templates/documents/ (Handlebars .hbs files)
- API: POST /api/documents/generate, GET /api/documents/:id
- Storage: Document metadata in MongoDB, PDFs in file storage
<!-- end of document generator spec -->
Document generator spec status: active.

