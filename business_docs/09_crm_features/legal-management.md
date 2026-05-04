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
