# DLD (Dubai Land Department) Integration — Business Specification

**Owner:** @Timnit (Gemini 2.0 Flash — Google AI Studio)
**Status:** 🟡 [Pending specific implementation definition per 90% readiness guidelines] — awaiting @Timnit Task 1
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

## [Action Required: Enforce production-ready engineering constraints] — @Timnit Task 1

Paste the output from this prompt into the sections below:

```
@Timnit — DRAFT: dld-integration.md → spec DLD API integration: Oqood off-plan registration (required fields: developer ID, project ID, buyer Emirates ID, unit number, sale price AED, SPA date, payment plan type), title deed transfer workflow (application submission, trustee appointment, fee calculation: 4% transfer fee + AED 580 admin + trustee fees), DLD REST API endpoints (POST /oqood/register, GET /titleDeed/{titleDeedNumber}, GET /transactions?propertyId=), error handling for DLD system downtime (queue failed requests, retry with exponential backoff, alert admin), DLD Smart Judge integration for disputes, White Caves as authorized trustee or broker authentication (API key management).
```

## Oqood Registration Data Contract

- Required fields: `developerId`, `projectId`, `buyerEmiratesId`, `unitNumber`, `salePriceAed`, `spaDate`, `paymentPlanType`.
- Validation rules:
  - Emirates ID must pass checksum and expiry validation.
  - Sale price must be positive and within configured project bounds.
  - SPA date cannot be future-dated beyond contract issue window.
- Rejection handling: return structured errors mapped to UI field names.

## Title Deed Transfer Workflow

1. Create transfer request in CRM.
2. Validate buyer/seller KYC status and property eligibility.
3. Calculate fees (4% transfer fee + AED 580 admin + trustee fee band).
4. Reserve trustee slot and attach appointment reference.
5. Submit package to DLD and persist `dldSubmissionId`.
6. Update deal status to `transfer_submitted`, then `transfer_completed` on callback.

## DLD Endpoint Mapping

- `POST /api/compliance/dld/oqood/register` → forwards to DLD `POST /oqood/register`.
- `GET /api/compliance/dld/title-deed/:titleDeedNumber` → forwards to DLD `GET /titleDeed/{titleDeedNumber}`.
- `GET /api/compliance/dld/transactions` → forwards to DLD `GET /transactions?propertyId=`.
- `POST /api/compliance/dld/transfer/submit` → internal composite endpoint for transfer package.

## Authentication and Key Management

- Credentials stored in secure secrets (`DLD_API_KEY`, `DLD_CLIENT_ID`, `DLD_CLIENT_SECRET`).
- Rotation policy: every 90 days or immediately after suspected exposure.
- Requests signed with timestamp and nonce to prevent replay.
- Audit event required for every key use in privileged DLD actions.

## Retry Queue and Downtime Strategy

- Failed submissions enter `dld_retry_queue` with exponential backoff.
- Retry intervals: 1m, 5m, 15m, 60m, then manual review.
- Permanent failure after 5 attempts creates escalation task.
- Admin alert channels: in-app critical banner + WhatsApp to compliance manager.

## Smart Judge / Dispute Integration

- Dispute packet includes: contract copy, payment history, notice records, property details.
- CRM stores `smartJudgeCaseNumber`, filing date, and case status timeline.
- Case status sync job runs every 6 hours.
- Escalation trigger when hearing deadline is <48 hours.

## Compliance and Audit Requirements

- All DLD actions logged with `actorId`, `entityId`, `action`, `payloadHash`, `timestamp`.
- Retention: 7 years minimum.
- Permission boundary: only `managing_director`, `compliance_manager`, `legal_manager` may submit to DLD.
- Every rejected response must have mapped corrective guidance.

## KPI and Monitoring

- Oqood submission success rate (target: >= 98%).
- Median DLD response time (target: <= 2.5s for lookup endpoints).
- Transfer completion cycle time (target: <= 10 business days).
- Retry queue aging (critical if any item > 24h).

## Test Scenarios

- Happy path: valid Oqood registration accepted by DLD.
- Validation path: missing Emirates ID rejected before external call.
- Retry path: transient 503 from DLD retried and recovered.
- Security path: unauthorized role blocked from transfer submit.
- Dispute path: Smart Judge filing creates full case record.

## Rollback and Fallback Plan

- Feature flags for each external DLD endpoint adapter.
- On critical incident, switch to manual submission mode and preserve queue state.
- Export pending submissions CSV for compliance manual execution.
- Post-incident reconciliation compares manual DLD refs with queued records.
