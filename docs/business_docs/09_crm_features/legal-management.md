# Legal Management — CRM Feature Specification

<!-- markdownlint-disable MD024 MD031 MD032 MD040 MD060 -->

**Owner:** @Timnit (Gemini 2.0 Flash — Google AI Studio)
**Status:** ✅ Complete — full spec (May 2026)
**Target:** 12 sections
**CRM Module:** EvangelineLegalCRM (`src/components/crm/EvangelineLegalCRM/`)
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

## Contract Template Registry

### Template Library

| Template ID          | Name                        | Use Case                                    | Required Variables                                                                                  |
| -------------------- | --------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `TMPL-TENANCY-STD`   | Standard Tenancy Agreement  | Residential rental                          | landlordName, tenantName, unitAddress, annualRent, paymentSchedule, startDate, endDate, noOfCheques |
| `TMPL-TENANCY-LUX`   | Luxury Tenancy Agreement    | Properties ≥ AED 30K/month or premium areas | All above + conciergeTerms, ndaClause, accessRestrictions                                           |
| `TMPL-TENANCY-SHORT` | Short-Term Holiday Tenancy  | < 90 days, DTCM-licensed                    | landlordName, tenantName, dailyRate, checkInDate, checkOutDate, securityDeposit, dtcmPermitNumber   |
| `TMPL-COMMERCIAL`    | Commercial Lease Agreement  | Retail, office, warehouse                   | All standard + fitOutPeriod, permittedUse, renewalOption, serviceChargeRate                         |
| `TMPL-MOU`           | Memorandum of Understanding | Sale/purchase preliminary                   | buyerName, sellerName, propertyDetails, agreedPrice, depositAmount, completionDate, conditions      |
| `TMPL-SPA`           | Sale and Purchase Agreement | Off-plan or secondary sale                  | All MOU fields + paymentPlan, spaDate, developerName, oqoodObligations                              |

### Template Versioning Rules

- All templates are versioned (`v1.0`, `v1.1`, etc.)
- Live signed documents reference the exact template version at time of signing
- Prior signed versions are immutable — no edits allowed after signature
- Template updates create new version; old version retained for 7 years

### Variable Slot Format

Template variables use Handlebars syntax:

```
{{landlordName}} — required
{{#if mortgageClause}}...{{/if}} — conditional
{{paymentScheduleTable}} — dynamic table injected by service
```

---

## Addendum Generation Rules

### Rent Increase — Form 7 Addendum

**Legal basis:** Dubai Law No. 33 of 2008; RERA Rental Index (published annually)

| Rule               | Requirement                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| Notice period      | Minimum 90 days written notice before increase takes effect                                    |
| Maximum increase % | Per RERA Rental Index — calculated as: `RERA index for area - current rent / RERA index × 100` |
| Exempt increases   | Tenant waiving rights in writing (not recommended by RERA)                                     |
| Form required      | RERA Form 7 (Rent Increase Notice) — must reference current RERA index                         |

**CRM Workflow:**

1. Agent opens lease record → "Generate Rent Increase Notice"
2. System fetches current RERA Rental Index for the property's area
3. System calculates maximum permissible increase % and maximum permitted new rent (AED)
4. If requested increase > RERA cap: error "Proposed rent exceeds RERA permitted maximum of AED X"
5. Agent confirms → Form 7 PDF generated with 90-day notice date auto-calculated
6. Sent via DocuSign for landlord signature → delivered to tenant via registered email + WhatsApp

### Early Termination Addendum

| Scenario           | Required Elements                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Mutual agreement   | Both parties' consent, settlement amount (if any), surrender date, deposit return schedule        |
| Breach by tenant   | Breach description, notice period given, outstanding amounts, forfeiture of deposit if applicable |
| Breach by landlord | Compensation amount per RERA guidelines (1 month rent + reasonable moving costs)                  |

**CRM Workflow:**

1. Agent selects termination type → template auto-populated with lease details
2. Settlement amount (if any) entered; linked to financial module for payment tracking
3. DocuSign envelope sent to both landlord and tenant
4. On both signatures: lease status → `Terminating`; move-out date set; deposit refund triggered

### Other Addendum Types

| Addendum             | Trigger                      | Key Fields                                             |
| -------------------- | ---------------------------- | ------------------------------------------------------ |
| Pet Permission       | Tenant request               | pet type, weight limit, deposit top-up AED             |
| Furniture/Fit-Out    | Tenant improvement request   | item list, approval date, reinstatement obligation     |
| Sub-Lease Approval   | Tenant sub-let request       | sub-tenant name, term, landlord consent                |
| Name Change (Entity) | Corporate tenant restructure | old entity name, new entity name, trade license update |

---

## Legal Notice Engine

### Form 7 — Rent Increase Notice

- **Issue via:** `POST /api/compliance/notices/form7`
- **Required:** Valid RERA Rental Index data; lease ID; proposed new rent within RERA cap
- **Output:** Form 7 PDF (RERA-mandated format) with notice date, effective date, amount
- **Delivery:** Registered email to tenant + WhatsApp + PDF stored in lease documents
- **Audit:** Notice issuance logged with timestamp, agent ID, delivery status

### Form 12 — Eviction Notice

**Legal basis:** Dubai Law No. 33 of 2008, Article 25

Grounds for eviction (only valid grounds are accepted by the CRM):

| Ground Code | Description                                                 | Notice Period Required              |
| ----------- | ----------------------------------------------------------- | ----------------------------------- |
| `GROUND_A`  | Rent arrears                                                | 30 days after formal written demand |
| `GROUND_B`  | Landlord or first-degree relative requires unit for own use | 12 months                           |
| `GROUND_C`  | Demolition / major renovation requiring vacant possession   | 12 months                           |
| `GROUND_D`  | Property sale (buyer requires vacant possession)            | 12 months                           |
| `GROUND_E`  | Tenant has subleased without permission                     | 30 days                             |
| `GROUND_F`  | Tenant is using property for illegal purposes               | Immediate (court order)             |

**CRM Workflow:**

1. Manager selects eviction ground → CRM validates notice period requirement
2. Supporting evidence checklist displayed per ground (e.g., for GROUND_A: arrears statement, prior demand letter)
3. Agent confirms all evidence uploaded → Form 12 generated
4. Manager sign-off required before form is issued
5. Form delivered to tenant via registered email + physical courier (recommended)
6. Delivery confirmation stored; failure to deliver triggers escalation alert

### Form 6 — Non-Renewal Notice

- **Notice period:** 90 days before lease expiry (mandatory)
- **Issue via:** `POST /api/compliance/notices/form6`
- **Auto-reminder:** CRM alerts agent 120 days before lease expiry if non-renewal is indicated
- **Output:** Form 6 PDF with expiry date and vacate date

---

## E-Signature Integration

### Provider Options

| Provider   | Recommended For                        | Setup                                |
| ---------- | -------------------------------------- | ------------------------------------ |
| DocuSign   | Standard tenancy, commercial, MOU, SPA | OAuth 2.0 + JWT grant; envelopes API |
| Adobe Sign | Alternative; good for bulk signing     | OAuth 2.0 + REST API                 |

### DocuSign Integration Spec

```typescript
// server/services/legal/ESignatureService.ts
class ESignatureService {
  async sendForSignature(documentId: string, signers: Signer[]): Promise<EnvelopeResult>;
  async getEnvelopeStatus(envelopeId: string): Promise<EnvelopeStatus>;
  async downloadSignedDocument(envelopeId: string): Promise<Buffer>;
}

Signer {
  name: string;
  email: string;
  role: 'landlord' | 'tenant' | 'agent' | 'witness';
  signingOrder: number;   // 1 = first; 2 = second (sequential or parallel configurable)
  tabs: SignatureTab[];
}
```

### Webhook Events (DocuSign → CRM)

| Event                | CRM Action                                                                   |
| -------------------- | ---------------------------------------------------------------------------- |
| `envelope-sent`      | Document status → `sent`; log timestamp                                      |
| `envelope-viewed`    | Document status → `viewed`; log who viewed and when                          |
| `envelope-completed` | Document status → `signed`; download signed PDF; store in lease documents    |
| `envelope-declined`  | Document status → `declined`; alert agent; log reason                        |
| `envelope-voided`    | Document status → `voided`; alert agent                                      |
| `envelope-expired`   | Document status → `expired` (after 30 days unsigned); alert agent to re-send |

### Signed Document Storage

- Path: `uploads/documents/{leaseId}/signed/{documentType}-{version}-signed.pdf`
- Endpoint: `GET /api/documents/{documentId}/download` (auth required)
- Retention: 7 years (AML + contract law requirements)
- Immutable: delete and overwrite operations blocked by middleware after `signed` status

---

## RDC Dispute Filing Workflow

The Rental Disputes Centre (RDC) is the Dubai-specific court for landlord-tenant disputes.

### Case Types

| Case Type             | Description                                | Filing Fee (AED)                    |
| --------------------- | ------------------------------------------ | ----------------------------------- |
| Rent arrears          | Landlord sues tenant for unpaid rent       | 3.5% of claim (min 500, max 20,000) |
| Unlawful eviction     | Tenant disputes landlord's eviction notice | 3.5% of annual rent                 |
| Deposit dispute       | Tenant disputes unfair deposit deduction   | 500 flat fee                        |
| Maintenance failure   | Tenant claims landlord failed to maintain  | 500 flat fee                        |
| Rent increase dispute | Tenant challenges unlawful rent increase   | 500 flat fee                        |

### Evidence Checklist (Auto-Generated per Case Type)

**Rent Arrears:**

- [ ] Signed tenancy agreement
- [ ] Ejari certificate
- [ ] Bank statements showing unpaid cheques or lack of payment
- [ ] Prior written demand letter (30 days notice)
- [ ] PDC cheques if applicable (originals)

**Unlawful Eviction:**

- [ ] Tenancy agreement (showing remaining term)
- [ ] Eviction notice received
- [ ] Proof of full rent payment up to eviction date

### CRM Dispute Case Workflow

1. Manager/Legal opens "New RDC Case" from lease record
2. Case type selected → evidence checklist auto-populated
3. Agent uploads all required documents (checklist validates completeness)
4. RDC case submission packet PDF generated (all documents + cover sheet)
5. Agent submits packet via RDC e-services portal ([rdrdubai.gov.ae](https://www.rdrdubai.gov.ae))
6. RDC case number entered in CRM → `dispute.caseNumber` field
7. Property flagged with `legalHold: true` (blocks certain automated workflows during dispute)
8. Hearing dates tracked: `dispute.nextHearingDate`, `dispute.hearingHistory[]`
9. Outcome recorded: `dispute.outcome` → `won` | `lost` | `settled`
10. On settlement: financial module notified of any agreed payment/compensation

### Legal Hold Flag

When `legalHold: true`:

- Eviction notices blocked (court handles eviction)
- Automatic lease renewal blocked
- Rent increase blocked until dispute resolved
- Alert shown to all agents viewing the property

---

## API Endpoints

| Method  | Path                                    | Auth    | Description                       |
| ------- | --------------------------------------- | ------- | --------------------------------- |
| `GET`   | `/api/documents/templates`              | Agent+  | List available contract templates |
| `POST`  | `/api/documents/templates/:id/generate` | Agent   | Generate document from template   |
| `POST`  | `/api/documents/:id/sign`               | Agent   | Send document for e-signature     |
| `GET`   | `/api/documents/:id/status`             | Agent+  | Get signature status              |
| `GET`   | `/api/documents/:id/download`           | Agent+  | Download signed PDF               |
| `POST`  | `/api/leases/:id/addendums`             | Agent   | Generate addendum                 |
| `POST`  | `/api/compliance/notices/form7`         | Manager | Issue rent increase notice        |
| `POST`  | `/api/compliance/notices/form12`        | Manager | Issue eviction notice             |
| `POST`  | `/api/compliance/notices/form6`         | Agent   | Issue non-renewal notice          |
| `POST`  | `/api/compliance/rdc/cases`             | Manager | Create RDC dispute case           |
| `GET`   | `/api/compliance/rdc/cases/:leaseId`    | Manager | Get dispute cases for lease       |
| `PATCH` | `/api/compliance/rdc/cases/:id`         | Manager | Update case status/hearing dates  |

---

## Permissions and Audit

| Action                       | Required Role               |
| ---------------------------- | --------------------------- |
| Generate tenancy agreement   | Agent                       |
| Issue Form 7 (rent increase) | Manager+                    |
| Issue Form 12 (eviction)     | Manager + Owner sign-off    |
| Issue Form 6 (non-renewal)   | Agent (with manager review) |
| Create RDC dispute case      | Manager+                    |
| Override legal hold          | Owner only                  |

All document events are written to the audit trail (append-only):

- Template generated: `documentId`, `templateId`, `agentId`, `timestamp`
- Sent for signature: `envelopeId`, `signers`, `timestamp`
- Signed: `signedAt`, `envelopeId`, `signatories`
- Notice issued: `noticeType`, `leaseId`, `deliveryMethod`, `timestamp`
- Dispute filed: `caseNumber`, `caseType`, `filedAt`, `filedBy`

---

## KPIs

| Metric                    | Definition                                        | Target     |
| ------------------------- | ------------------------------------------------- | ---------- |
| Notice compliance rate    | % of rent increases with valid Form 7             | 100%       |
| Signature completion time | Average days from send to fully signed            | < 3 days   |
| Dispute case cycle time   | Average days from filing to outcome               | < 60 days  |
| Rejected RDC filings      | Count of filings rejected for incomplete evidence | < 5%       |
| Addendum turnaround       | Average hours from request to signed addendum     | < 48 hours |

---

## Acceptance Criteria

- [ ] All legal notice types (Form 6, 7, 12) generated with valid data; RERA cap validated for Form 7
- [ ] Form 12 blocks invalid eviction grounds with clear error message
- [ ] E-signature callbacks update document status correctly; signed PDF stored within 60 seconds of webhook
- [ ] RDC filing flow captures case number, evidence checklist, and sets `legalHold: true`
- [ ] Audit trail entries present for every legal action (document generate, send, sign, notice issue, dispute file)
- [ ] Immutable document enforcement: `PUT/DELETE /api/documents/:id` returns HTTP 403 for signed documents

---

## Test Scenarios

- Valid Form 7 generation with RERA cap validation (within cap: succeeds; above cap: HTTP 422)
- Unauthorized role (agent) blocked from eviction notice issuance (HTTP 403)
- Signature webhook reconciliation: duplicate events handled idempotently
- Dispute filing retry for transient API failures (queued retry with exponential backoff)
- Legal hold correctly blocks lease renewal workflow when active dispute exists
