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

CONSUMES←@Sofia: business_docs/05_requirements/compliance-requirements.md#regulatory-rules
FEEDS→@Victoria: business_docs/09_crm_features/legal-management.md#contract-clauses

---

## 1. Oqood Off-Plan Registration

### Business Rule
All off-plan unit sales must be registered with DLD via Oqood within **60 days** of SPA signing. Failure incurs a penalty of AED 10,000 (developer-facing) and voids broker commission eligibility.

### Required Fields
| Field | Type | Validation |
|---|---|---|
| `developerId` | String | DLD-registered developer code |
| `projectId` | String | DLD project reference |
| `buyerEmiratesId` | String | 784-YYYY-NNNNNNN-N format |
| `unitNumber` | String | Building + floor + unit (e.g. TW-12-05) |
| `salePriceAed` | Number | ≥ AED 100,000 |
| `spaDate` | Date | ISO 8601, must be ≤ today |
| `paymentPlanType` | Enum | `post_handover` \| `construction_linked` \| `cash` |

### API Contract
```
POST /api/compliance/dld/oqood/register
Authorization: Bearer <jwt>
Body: { developerId, projectId, buyerEmiratesId, unitNumber, salePriceAed, spaDate, paymentPlanType }

Success 201: { oqoodNumber, registrationDate, dldReference, status: "pending_approval" }
Error 400: { error: "MISSING_FIELD", field: "buyerEmiratesId" }
Error 409: { error: "DUPLICATE_REGISTRATION", existingOqood: "..." }
Error 503: { error: "DLD_UNAVAILABLE", retryAfterMs: 30000 }
```

### Data Schema (Prisma)
```prisma
model OqoodRegistration {
  id              String   @id @default(cuid())
  oqoodNumber     String?  @unique
  developerId     String
  projectId       String
  buyerEmiratesId String
  unitNumber      String
  salePriceAed    Float
  spaDate         DateTime
  paymentPlanType String
  status          String   @default("pending")  // pending/approved/rejected
  dldReference    String?
  submittedAt     DateTime @default(now())
  approvedAt      DateTime?
  retryCount      Int      @default(0)
  createdBy       String   // userId
  leadId          String?
  propertyId      String?
}
```

---

## 2. Title Deed Transfer Workflow

### Business Rule
Secondary market sales require a DLD transfer appointment at an authorised trustee centre. Transfer fee is 4% of sale price (split buyer/seller per negotiation), plus AED 580 DLD admin fee, plus trustee fees (AED 4,000–10,000).

### Workflow Steps
1. **Agent submits transfer request** → CRM creates `TitleDeedTransfer` record
2. **Trustee appointment booked** → linked to `/api/viewings` schedule slot (type: `dld_transfer`)
3. **Fee calculation** → `4% × salePriceAed + 580 + trusteeFee`
4. **Documents checklist** → NOC from developer, original title deed, buyer/seller Emirates IDs, MOU signed
5. **DLD portal submission** → POST to DLD API with all documents
6. **New title deed issued** → DLD returns `titleDeedNumber`, stored on `Property` record
7. **CRM status update** → lead stage → `Transferred`, commission disbursement triggered

### Fee Calculator
```ts
function calcTransferFees(salePriceAed: number, trusteeFee = 4000): TransferFees {
  return {
    dldFee: Math.round(salePriceAed * 0.04),
    adminFee: 580,
    trusteeFee,
    total: Math.round(salePriceAed * 0.04) + 580 + trusteeFee,
  };
}
```

### API Contract
```
POST /api/compliance/dld/transfer
Body: { propertyId, buyerId, sellerId, salePriceAed, nocDocument, titleDeedScan }

Success 201: { transferId, estimatedFees, appointmentSlots[] }
PATCH /api/compliance/dld/transfer/:id  → update status
GET  /api/compliance/dld/transfer/:id  → get transfer record
```

---

## 3. DLD REST API Endpoints (External)

| Endpoint | Method | Purpose |
|---|---|---|
| `/oqood/register` | POST | Submit off-plan unit registration |
| `/titleDeed/{titleDeedNumber}` | GET | Verify existing title deed |
| `/transactions?propertyId=` | GET | List DLD transactions for a property |
| `/trustee/slots` | GET | Available trustee appointment slots |
| `/disputes/smartjudge` | POST | File rental dispute via Smart Judge |
| `/broker/authenticate` | POST | Obtain broker API session token |

### Authentication
DLD issues API keys per registered broker entity. Keys are stored as `DLD_API_KEY` env var (never in DB). Every outbound DLD call includes:
```
Authorization: ApiKey <DLD_API_KEY>
X-Broker-License: <RERA_BROKER_NUMBER>
```

---

## 4. Error Handling & Retry Queue

### DLD Downtime Strategy
DLD API experiences planned maintenance 02:00–04:00 GST daily and occasional outages.

```ts
// server/services/dld/dldQueue.ts
interface DldQueueItem {
  id: string;
  endpoint: string;
  payload: Record<string, unknown>;
  attempt: number;
  nextRetryAt: Date;
  status: 'pending' | 'retrying' | 'failed' | 'succeeded';
}

// Exponential backoff: 30s, 2m, 8m, 30m, 2h
const BACKOFF_MS = [30_000, 120_000, 480_000, 1_800_000, 7_200_000];
```

### Cron Job
```
// Runs every 5 minutes via node-cron
cron.schedule('*/5 * * * *', processDldQueue);
```

### Admin Alert
On 5th failure, send Slack webhook alert + email to `compliance@whitecaves.com`:
```
Subject: DLD API — 5 Consecutive Failures [propertyId: xxx]
Body: Last error, payload snapshot, queue item ID, next retry time
```

---

## 5. DLD Smart Judge — Rental Dispute Filing

### Business Rule
Landlords can file rental disputes online via Smart Judge (RERA/RDC). White Caves agents assist in filing. Required documents: tenancy contract, Emirates IDs, evidence of breach.

### API Contract
```
POST /api/compliance/dld/disputes
Body: {
  tenancyId, complainantType: 'landlord'|'tenant',
  groundsOfDispute, supportingDocuments: string[],  // storage URLs
  requestedOutcome: 'eviction'|'rent_arrears'|'maintenance'|'other'
}
Success 201: { caseNumber, rdcPortalUrl, expectedHearingDate }
```

### CRM Integration
- Dispute record linked to `Lease` and `Tenant` records
- Status tracked: `filed → hearing_scheduled → resolved → appealed`
- Activity log entry created on each status change

---

## 6. Broker Authentication & API Key Management

### Setup
1. Register White Caves LLC on DLD portal → receive `RERA_BROKER_NUMBER`
2. Apply for API access at DLD Smart Services portal → receive `DLD_API_KEY`
3. Store in environment: `DLD_API_KEY`, `DLD_BROKER_LICENSE`, `DLD_ENV` (sandbox/production)
4. API key rotated annually; rotation logged in audit trail

### Security Controls
- Keys encrypted at rest in server environment (never client-side)
- All DLD API calls proxied through `server/services/dld/dldClient.ts` — no direct frontend calls
- Rate limit: 100 requests/minute per DLD API spec
- Audit log entry for every outbound DLD call (endpoint, status, timestamp)

---

## 7. Data Retention & Compliance

| Record Type | Retention | Archive |
|---|---|---|
| OqoodRegistration | 7 years (UAE Commercial Law) | Cold storage after 3 years |
| TitleDeedTransfer | 7 years | Cold storage after 3 years |
| DLD API call logs | 5 years | CloudWatch/S3 |
| Dispute records | 10 years (legal hold) | Legal team access only |

---

## 8. UX States

| State | User-facing message | Action |
|---|---|---|
| Submitting to DLD | "Submitting registration to DLD…" + spinner | Disable form |
| DLD unavailable | "DLD system is temporarily unavailable. Your request has been queued and will be submitted automatically." | Show queue position |
| Registration approved | "Oqood registration confirmed. Reference: [number]" | Download PDF button |
| Validation error | Inline field errors in red | Highlight field |
| Mobile (375px) | Single-column layout, stacked form fields | Accordion for document upload |

---

## 9. Unit / Integration Tests

| Test | Type | Coverage |
|---|---|---|
| Fee calculator for AED 2M property | Unit | `calcTransferFees(2_000_000)` → correct totals |
| Oqood registration happy path | Integration | Mock DLD API 201 → OqoodRegistration created |
| DLD 503 → queue item created | Integration | Retry queue populated, backoff scheduled |
| 5th failure → admin alert fired | Integration | Slack webhook called |
| Emirates ID validation | Unit | Valid/invalid format rejection |
| Duplicate Oqood detection | Integration | 409 returned, existing record returned |

---

## 10. Observability / Metrics

| Metric | Tool | Alert Threshold |
|---|---|---|
| DLD API success rate | CloudWatch | < 95% → PagerDuty |
| Oqood pending queue depth | CloudWatch | > 20 → Slack alert |
| Transfer workflow p99 latency | CloudWatch | > 30s → Slack alert |
| Failed registrations (24h) | Dashboard tile | Any → email to compliance@ |

---

## 11. Rollback / Migration Plan

- All DLD operations write to local DB first, then attempt DLD submission async
- If DLD submission fails permanently → manual submission via DLD portal; `dldReference` updated manually by admin
- Schema migrations use Prisma migrate with `--preview-feature` shadow DB
- Rollback: revert migration file, run `prisma migrate reset` on staging only

---

## 12. Security & Compliance Controls

- DLD API key in environment variables only; never logged or exposed in API responses
- All DLD calls require JWT authentication on the CRM side
- RBAC: only `agent`, `manager`, `admin`, `superuser` roles can initiate DLD operations
- Buyer/seller Emirates ID stored encrypted (AES-256) in DB
- PDPL compliance: personal data used only for DLD submission; consent recorded at lead creation
- PEP screening required for buyers before title deed transfer for transactions > AED 5M
