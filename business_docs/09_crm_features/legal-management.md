# Legal Management — Business Specification

**Owner:** @Timnit (Gemini 2.0 Flash — Google AI Studio)
**Status:** 🟡 STUB — awaiting @Timnit Task 2
**Target:** 12 sections
**CRM Module:** EvangelineLegalCRM (src/components/crm/EvangelineLegalCRM/)
**API Base:** `/api/documents`, `/api/leases`, `/api/compliance`

---

## Overview

EvangelineLegalCRM manages all legal documentation for White Caves: tenancy contracts, addendums, legal notices, e-signatures, and RERA dispute filings. It enforces UAE tenancy law and Dubai tenancy tribunal requirements at every step.

**Key Capabilities:**

- Contract template library (standard tenancy, luxury, short-term, commercial, MOU, SPA)
- Addendum generation (rent increase Form 7, early termination, pet permission)
- Legal notice workflows (Form 7 rent increase, Form 12 eviction, Form 6 non-renewal)
- E-signature integration (DocuSign or Adobe Sign API)
- RERA dispute filing via RDC online portal
- Legal hold flag for properties under active dispute

---

## TODO — @Timnit Task 2

Paste the output from this prompt into the sections below:

```
@Timnit — DRAFT: legal-management.md → spec EvangelineLegalCRM module: contract template library (standard tenancy, luxury tenancy, short-term holiday, commercial lease, MOU for sale, SPA for off-plan — each with variable slots and required fields), addendum generation workflow (rent increase Form 7: 90-day notice required, max % per RERA rental index; early termination: mutual agreement or breach), legal notice workflows (Form 7: rent increase notice, Form 12: eviction notice with grounds, Form 6: non-renewal 90-day notice), e-signature integration (DocuSign or Adobe Sign API: send for signature, webhook on completion, store signed PDF), RERA dispute filing (RDC online portal workflow, required documents checklist, case number tracking).
```

## Contract Template Registry

- Templates: standard tenancy, luxury tenancy, short-term holiday, commercial lease, MOU, SPA.
- Each template has required placeholders and conditional clauses.
- Versioning required; prior signed versions are immutable.

## Addendum Generation Rules

- Rent increase addendum requires Form 7 and 90-day notice proof.
- Early termination addendum requires cause code and settlement terms.
- Pet/furniture/service addendums use optional rider templates.

## Legal Notice Engine

- Form 7: rent increase notification.
- Form 12: eviction with legal ground and evidence.
- Form 6: non-renewal notice with deadline safeguards.

## E-Signature Integration

- Provider adapters: DocuSign and Adobe Sign.
- Webhook events: sent, viewed, signed, declined, expired.
- Signed files stored under tenant/lease document vault.

## RDC Dispute Filing Workflow

1. Create dispute case packet.
2. Validate required evidence checklist.
3. Submit to RDC and save case number.
4. Track hearing dates and status updates.

## API Endpoints

- `POST /api/documents/templates/:id/generate`
- `POST /api/leases/:id/addendums`
- `POST /api/compliance/notices/form7|form12|form6`
- `POST /api/compliance/rdc/cases`

## Permissions and Audit

- Only legal/compliance/manager roles can issue notices.
- All document events written to append-only audit trail.
- Redaction required for exports shared externally.

## KPIs

- Notice compliance rate.
- Signature completion time.
- Dispute case cycle time.
- Rejected filing count.

## Acceptance Criteria

- All legal notice types generated with valid data.
- E-signature callbacks update document status correctly.
- RDC filing flow captures case number and evidence.
- Audit trail entries present for every legal action.

## Test Scenarios

- Valid Form 7 generation with RERA cap validation.
- Unauthorized user blocked from eviction notice issuance.
- Signature webhook reconciliation and duplicate event handling.
- Dispute filing retry for transient API failures.
