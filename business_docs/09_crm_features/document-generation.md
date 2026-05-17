# Document Generation

> **Owner:** @Annie | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Purpose:** PDF generation for Ejari certificates, tenancy agreements, NOC letters and receipts.
> **Status:** Stub -- awaiting expansion by @Annie.

---

## 1. Overview

> _TODO: expand this section with full spec._

## 2. Document Types and Template Variables

> _TODO: expand this section with full spec._

## 3. Template Engine Selection (Puppeteer vs PDFKit)

> _TODO: expand this section with full spec._

## 4. Required Document Catalog

- Ejari certificate
- Tenancy agreement
- NOC letter
- Maintenance work order
- Payment receipt

## 5. Template Variable Schema

- Party details, property data, financial terms, signature blocks.
- Validation for required placeholders before render.

## 6. Storage and Naming Rules

- Path: `uploads/documents/{tenantId}/`.
- Naming: `{docType}_{leaseId}_{timestamp}.pdf`.

## 7. Generation API Contract

- `POST /api/documents/generate`
- `GET /api/documents/:id/download`
- `POST /api/documents/:id/sign`

## 8. E-Signature Hooks

- Signature provider integration events: requested, signed, rejected.
- Signed copy replaces draft version with immutable revision.

## 9. Error Handling and Retry

- Template validation errors returned with field-level details.
- Render failures retried with capped backoff.

## 10. Acceptance Criteria

- All 5 core documents render with valid data.
- Downloads and signatures are traceable in audit trail.
- Document generation latency within defined SLA.

## 11. Test Plan

- Snapshot tests for templates.
- Integration tests for generate/download/sign flow.
- Negative tests for missing variables.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
