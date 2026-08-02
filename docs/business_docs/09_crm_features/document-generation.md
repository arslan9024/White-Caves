# Document Generation

> **Owner:** @Annie | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Purpose:** PDF generation for Ejari certificates, tenancy agreements, NOC letters, maintenance work orders, and payment receipts.
> **Status:** In Progress — expanded with governed templates, storage rules, and e-signature hooks.

---

## 1. Overview

The Document Generation module creates legally consistent property-operation documents from structured CRM records. It must support tenant, landlord, agent, and finance workflows without requiring manual Word document editing.

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
- `GET /api/documents/:id/download`
- `POST /api/documents/:id/sign`

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

## 11. Test Plan

- Snapshot tests for templates
- Integration tests for generate/download/sign flow
- Negative tests for missing variables
- Regression tests for versioned template changes

---

_This file was scaffolded by `scripts/orchestrator/scaffold-docs.ps1` and then expanded into a governed document-generation spec._
