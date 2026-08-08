# DLD (Dubai Land Department) Integration — Business Specification

**Owner:** @Timnit (Gemini 2.0 Flash — Google AI Studio)  
**Status:** ✅ [GATE PASSED — 12/12 Complete]  
**Last Updated:** 2026-07-22  
**CRM Module:** DLD Integration layer (`server/routes/compliance.ts` + `server/services/dld/`)  
**API Base:** `/api/compliance/dld`, external DLD REST API  
**CONSUMES:** `business_docs/05_requirements/compliance-requirements.md`  
**FEEDS:** `docs/plans/waves/WAVE_25_IMPLEMENTATION_BACKLOG.md`  
**FEEDS_ACK:** @Ada (Chief Architect) + @Margaret (Strategic Planner) — 2026-07-22

---

## 1. Overview & Regulatory Context

The DLD Integration connects White Caves Real Estate LLC CRM to the Dubai Land Department's official systems for property registration, title deed verification, transaction recording, and dispute resolution. All off-plan sales require Oqood registration within 60 days of SPA signing, and all secondary sales require a DLD transfer appointment.

**Key Capabilities:**

- Oqood off-plan property registration (mandatory RERA enforcement)
- Title deed issuance and transfer workflow
- Transaction fee calculation (4% of sale price + AED 580 admin)
- DLD Smart Judge integration for rental disputes
- API error handling and retry queue for DLD downtime
- White Caves broker authentication with DLD

---

## 2. Governance & Compliance Authority

- **Regulatory Framework:** Dubai Real Estate Regulatory Agency (RERA) Law No. 7 of 2006 & Law No. 13 of 2008 (Off-Plan Registration).
- **Mandatory Exclusivity:** All off-plan registrations must be submitted via authorized DLD OAuth 2.0 broker credentials under White Caves Real Estate LLC license (`DLD-WCAG-2026`).
- **Data Privacy & PDPL:** UAE Federal Decree-Law No. 45 of 2021 compliant payload hashing.

---

## 3. Oqood Off-Plan Registration Workflow & Data Contract

### 3.1 Data Payload Schema (`OqoodRegistrationPayload`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OqoodRegistrationPayload",
  "type": "object",
  "required": [
    "developerId",
    "projectId",
    "buyerEmiratesId",
    "buyerPassportNumber",
    "unitNumber",
    "salePriceAed",
    "spaDate",
    "paymentPlanType"
  ],
  "properties": {
    "developerId": { "type": "string", "example": "DEV-DAMAC-001" },
    "projectId": { "type": "string", "example": "PRJ-DH2-VARDON" },
    "buyerEmiratesId": { "type": "string", "pattern": "^784-[0-9]{4}-[0-9]{7}-[0-9]{1}$" },
    "buyerPassportNumber": { "type": "string", "minLength": 6 },
    "unitNumber": { "type": "string", "example": "VAR-504" },
    "salePriceAed": { "type": "number", "minimum": 100000 },
    "spaDate": { "type": "string", "format": "date" },
    "paymentPlanType": {
      "type": "string",
      "enum": ["POST_HANDOVER", "CONSTRUCTION_LINKED", "FULL_CASH"]
    }
  }
}
```

### 3.2 Validation Rules & Field Constraints

- **Emirates ID Checksum:** Validated against UAE official Luhn-based checksum algorithm.
- **Price Bounds:** Sale price must be ≥ AED 100,000 and within ±15% of project AVM valuation limits.
- **SPA Date Boundary:** Cannot be backdated beyond 60 days or future-dated.

---

## 4. Title Deed Transfer Workflow & Settlement Checkpoints

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: CREATE TRANSFER REQUEST IN CRM (Attach Buyer/Seller KYC)                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ STEP 2: CALCULATE DLD FEES (4% Transfer Fee + AED 580 Admin + Trustee Fee Band)       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ STEP 3: RESERVE TRUSTEE SLOT & RECEIVE APPOINTMENT REFERENCE                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ STEP 4: SUBMIT PACKAGE TO DLD & PERSIST dldSubmissionId                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ STEP 5: CALLBACK SETTLEMENT CHECKPOINT — STATUS: transfer_completed                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Fee Settlement Formula:**
  $$\text{Total DLD Fees} = (\text{Sale Price AED} \times 0.04) + 580 + \text{Trustee Fee (AED 4,000)}$$

---

## 5. DLD REST API Endpoint Mapping

| Internal CRM Endpoint                 | DLD Remote REST Endpoint           | Method | Purpose                                    |
| :------------------------------------ | :--------------------------------- | :----- | :----------------------------------------- |
| `/api/compliance/dld/oqood/register`  | `POST /oqood/register`             | `POST` | Submit off-plan Oqood registration package |
| `/api/compliance/dld/title-deed/:id`  | `GET /titleDeed/{titleDeedNumber}` | `GET`  | Verify title deed status & ownership       |
| `/api/compliance/dld/transactions`    | `GET /transactions?propertyId=`    | `GET`  | Historical DLD sales transactions query    |
| `/api/compliance/dld/transfer/submit` | `POST /transfer/submit`            | `POST` | Composite title deed transfer package      |

---

## 6. Authentication, OAuth 2.0 & Key Management

- **Credentials Storage:** Managed via secure secrets (`DLD_API_KEY`, `DLD_CLIENT_ID`, `DLD_CLIENT_SECRET`).
- **Rotation Policy:** Auto-rotated every 90 days or immediately upon security trigger.
- **Payload Signing:** Requests signed with HMAC-SHA256 timestamp and cryptographic nonce to prevent replay attacks.

---

## 7. Retry Queue, Exponential Backoff & Exception Handling

- **Downtime Retry Queue:** Failed submissions enter `dld_retry_queue` with exponential backoff strategy:
  $$\text{Delay} = \text{Base Delay (1m)} \times 2^{\text{Attempt Number}}$$
  - Attempt 1: 1 minute delay
  - Attempt 2: 2 minutes delay
  - Attempt 3: 4 minutes delay
  - Attempt 4: 8 minutes delay
  - Attempt 5: 16 minutes delay → Escalation to Manual Compliance Review
- **Escalation Notification:** Auto-dispatch in-app banner + WhatsApp to Compliance Manager.

---

## 8. Smart Judge / Dispute Integration

- **Dispute Packet:** Includes rental contract, cheque scan copy, payment history, and notice records.
- **Status Sync:** Background cron runs every 6 hours syncing `smartJudgeCaseNumber`.
- **Urgent Escalation:** Triggered when hearing deadline is < 48 hours.

---

## 9. Compliance & Audit Logging Requirements

- **Audit Record Schema:** All DLD actions logged with `actorId`, `entityId`, `action`, `payloadHash`, `timestamp`.
- **Retention Period:** 7 years mandatory minimum (UAE commercial law).
- **Access Boundary:** Level 4+ RBAC clearance required for submission.

---

## 10. KPI Metrics & SLA Performance Targets

- **Oqood Submission Success Rate:** ≥ 98%
- **Median DLD API Response Time:** ≤ 2.5 seconds
- **Transfer Completion Cycle Time:** ≤ 10 business days
- **Retry Queue Aging:** 0 items older than 24 hours

---

## 11. Test Scenarios & Acceptance Criteria

- **Happy Path:** Valid Oqood registration payload returns `200 OK` with `dldRegistrationNumber`.
- **Validation Path:** Missing Emirates ID or bad checksum rejected before external call (`400 Bad Request`).
- **Retry Path:** Transient 503 from DLD retried and recovered automatically.
- **Security Path:** Unauthorized Level 1-2 role blocked from transfer submission (`403 Forbidden`).

---

## 12. Document Sign-Off & Verification

- **Governance Approval:** `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`
- **Validation Command:** `npm run plans:validate`
