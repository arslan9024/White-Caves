# DLD (Dubai Land Department) Integration — Business Specification

**Owner:** @Timnit (Gemini 2.0 Flash — Google AI Studio)
**Status:** 🟡 STUB — awaiting @Timnit Task 1
**Target:** 12 sections
**CRM Module:** DLD Integration layer (server/routes/compliance.ts + server/services/dld/)
**API Base:** `/api/compliance/dld`, external DLD REST API

---

## Overview

The DLD Integration connects White Caves CRM to the Dubai Land Department's official systems for property registration, title deed verification, transaction recording, and dispute resolution. All off-plan sales require Oqood registration within 60 days of SPA signing, and all secondary sales require a DLD transfer appointment.

**Key Capabilities:**
- Oqood off-plan property registration (mandatory, RERA enforcement)
- Title deed issuance and transfer workflow
- Transaction fee calculation (4% of sale price + AED 580 admin)
- DLD Smart Judge integration for rental disputes
- API error handling and retry queue for DLD downtime
- White Caves broker authentication with DLD

---

## TODO — @Timnit Task 1

Paste the output from this prompt into the sections below:

```
@Timnit — DRAFT: dld-integration.md → spec DLD API integration: Oqood off-plan registration (required fields: developer ID, project ID, buyer Emirates ID, unit number, sale price AED, SPA date, payment plan type), title deed transfer workflow (application submission, trustee appointment, fee calculation: 4% transfer fee + AED 580 admin + trustee fees), DLD REST API endpoints (POST /oqood/register, GET /titleDeed/{titleDeedNumber}, GET /transactions?propertyId=), error handling for DLD system downtime (queue failed requests, retry with exponential backoff, alert admin), DLD Smart Judge integration for disputes, White Caves as authorized trustee or broker authentication (API key management).
```
