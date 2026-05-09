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

CONSUMES←@Sofia: business_docs/05_requirements/compliance-requirements.md#regulatory-rules
FEEDS→@Victoria: business_docs/09_crm_features/legal-management.md#contract-clauses

---

## 1. Contract Template Library

### Template Types & Variable Slots

| Template | Key Variables | Required Fields |
|---|---|---|
| **Standard Tenancy** | tenantName, landlordName, unitAddress, rentAed/year, startDate, endDate, PDCSchedule[] | Emirates IDs, passports, landlord title deed |
| **Luxury Tenancy** | + conciergeLevel, securityDepositAed, gracePeriodDays, NDA reference | Min rent AED 30K/month, professional photos |
| **Short-Term Holiday** | checkIn, checkOut, dailyRateAed, platformSource (Airbnb/Booking.com) | Tourist visa or Emirates ID, DTCM permit number |
| **Commercial Lease** | tradeLicenseNumber, commercialActivity, ejariCommercialCategory | Trade license, DED approval, landlord NOC |
| **MOU (Sale)** | buyerName, sellerName, propertyAddress, agreedPriceAed, depositAed, completionDate | Emirates IDs, buyer mortgage pre-approval if applicable |
| **SPA (Off-Plan)** | developerName, projectName, unitSpec, paymentMilestones[], oqoodDeadline | Developer RERA registration, buyer Emirates ID, payment plan schedule |

### Template Engine
- Templates stored as Handlebars `.hbs` files in `server/templates/legal/`
- Variable substitution at generation time via `server/services/legal/templateEngine.ts`
- PDF rendered via Puppeteer (headless Chrome, A4 format, bilingual Arabic/English)
- Storage: `uploads/legal/{leaseId}/{templateType}_{timestamp}.pdf`

### API Contract
```
POST /api/documents/generate
Body: { templateType, leaseId, variables: Record<string, unknown> }
Success 201: { documentId, downloadUrl, previewUrl }

GET /api/documents/:id → fetch document metadata
GET /api/documents/:id/download → stream PDF
```

---

## 2. Addendum Generation Workflow

### Rent Increase Addendum (Form 7 Basis)
**Business Rule:** RERA rental index determines maximum increase percentage per area. 90 days written notice required. Increase above RERA index is void and unenforceable.

```
Workflow:
1. Agent inputs: currentRentAed, proposedRentAed, area, lastRegisteredRent
2. System calls GET /api/compliance/rera/rental-index?area=&bedrooms= → allowed %
3. If proposedIncrease > allowed% → validation error with RERA index link
4. System generates Form 7-style notice PDF with: property address, current rent, new rent, effective date (today + 90 days)
5. Sent to tenant via e-signature
6. On acceptance → Lease record updated: rentAed, nextReviewDate
7. Ejari renewal triggered if within 30 days of lease end
```

### Early Termination Addendum
| Scenario | Notice Period | Penalty |
|---|---|---|
| Mutual agreement | None | Optional goodwill payment |
| Tenant breach (rent arrears) | 30 days Form 12 | Security deposit forfeiture |
| Landlord breach (habitability) | Immediate | Relocation cost + compensation |
| Sale of property (Art 25.2) | 12 months notice | None if notice served correctly |

---

## 3. Legal Notice Workflows

### Form 7 — Rent Increase Notice
- **Trigger:** Agent initiates from Lease record → Addendum tab
- **Content:** Current rent, proposed rent, effective date, RERA index reference
- **Delivery:** Via e-signature + WhatsApp confirmation + physical letter (optional)
- **90-day clock starts:** On tenant e-signature acknowledgement (or registered mail delivery)

### Form 12 — Eviction Notice
| Ground | Legal Basis | Notice Period |
|---|---|---|
| Non-payment of rent | Law No. 33 Art 25(1)(a) | 30 days |
| Property damage | Art 25(1)(b) | 30 days |
| Subletting without consent | Art 25(1)(c) | 30 days |
| Landlord self-use | Art 25(2)(a) | 12 months |
| Property demolition | Art 25(2)(b) | 12 months |
| Major renovation | Art 25(2)(c) | 12 months |

Form 12 PDF includes: property address, tenant name, ground, effective date, landlord signature, notarisation requirement flag.

### Form 6 — Non-Renewal Notice
- Must be served **90 days before lease expiry**
- CRM auto-flag: lease end date – 95 days → reminder task assigned to agent
- Content: confirmation lease will not be renewed, vacate date

---

## 4. E-Signature Integration

### Provider: DocuSign (primary), Adobe Sign (fallback)

```ts
// server/services/legal/eSignatureService.ts
interface SignatureRequest {
  documentId: string;
  signers: { name: string; email: string; phone?: string; role: 'landlord'|'tenant'|'agent' }[];
  subject: string;
  message: string;
  expiresInDays?: number; // default 14
}

async function sendForSignature(req: SignatureRequest): Promise<{ envelopeId: string; signingUrl: string }>;
```

### Webhook Handler
```
POST /api/webhooks/docusign
Events handled:
  envelope-sent → update Document.status = 'sent'
  recipient-completed → update Document.signedBy[] array
  envelope-completed → update Document.status = 'signed', store signed PDF URL
  envelope-voided → update Document.status = 'voided', create task for agent
```

### Signed PDF Storage
- Signed PDF downloaded from DocuSign → stored at `uploads/legal/{leaseId}/signed_{documentId}.pdf`
- URL stored on `Document.signedPdfUrl`
- Accessible via `GET /api/documents/:id/download` (auth required, owner-scoped)

---

## 5. RERA Dispute Filing (RDC Portal)

### Workflow
1. Agent opens **Dispute** tab on Lease record
2. Fills: complainantType (landlord/tenant), grounds, evidence files, requested outcome
3. CRM generates pre-filled dispute summary PDF
4. Agent submits to RDC online portal manually (no direct API — portal is web-only)
5. CRM stores: caseNumber, hearingDate, outcome, appealStatus
6. Status tracked: `filed → scheduled → heard → resolved → appealed`

### Required Documents Checklist
- [ ] Tenancy contract (Ejari-registered copy)
- [ ] Emirates IDs (both parties)
- [ ] Evidence of breach (payment receipts, maintenance photos, correspondence)
- [ ] Form 12 / Form 7 copies (if eviction or rent dispute)
- [ ] Rental index excerpt for area (if rent dispute)

### CRM API
```
POST /api/compliance/disputes
Body: { leaseId, complainantType, grounds, documents: string[], requestedOutcome }
Success 201: { disputeId, rdcPortalUrl, nextStep }

PATCH /api/compliance/disputes/:id → update caseNumber, hearingDate, outcome
GET /api/compliance/disputes?leaseId= → list disputes for a lease
```

---

## 6. Legal Hold Flag

- Property/lease can be marked `legalHold: true` by manager/admin
- When `legalHold = true`: all lease modifications locked, new tenant assignment blocked
- Activity log entry required explaining hold reason
- Auto-released when dispute.status = `resolved`

---

## 7. Data Schema (Prisma additions)

```prisma
model LegalDocument {
  id           String   @id @default(cuid())
  leaseId      String
  templateType String
  status       String   @default("draft")  // draft/sent/signed/voided
  signedPdfUrl String?
  envelopeId   String?  // DocuSign envelope ID
  createdBy    String
  createdAt    DateTime @default(now())
  signedAt     DateTime?
  expiresAt    DateTime?
}

model LegalDispute {
  id               String   @id @default(cuid())
  leaseId          String
  complainantType  String
  grounds          String
  requestedOutcome String
  caseNumber       String?
  hearingDate      DateTime?
  outcome          String?
  status           String   @default("filed")
  documents        String[]
  createdAt        DateTime @default(now())
  resolvedAt       DateTime?
}
```

---

## 8. Validation Rules

| Field | Rule |
|---|---|
| Rent increase % | Must not exceed RERA index for area + bedroom count |
| Form 12 notice period | Min 30 days for breach grounds, 12 months for landlord-use grounds |
| Form 6 notice | Must be served ≥ 90 days before lease end |
| SPA off-plan | Oqood registration deadline must be within 60 days of spaDate |
| E-signature expiry | Max 30 days; auto-void if not completed |

---

## 9. UX States

| State | Message | Action |
|---|---|---|
| Generating document | "Generating PDF…" + spinner | Disable generate button |
| Awaiting signature | "Sent to [tenant email] for signing" + progress bar | Cancel / Resend button |
| Signed | "✅ Document signed by all parties" + download button | Download PDF, View in DocuSign |
| Voided | "⚠️ Signature request voided" | Show reason, Re-send button |
| RERA index exceeded | "Proposed increase (X%) exceeds RERA limit (Y%) for this area" | Show RERA link, adjust input |
| Mobile 375px | Document list → card view, generate button sticky bottom | |

---

## 10. Unit / Integration Tests

| Test | Coverage |
|---|---|
| Rent increase above RERA index → validation error | Unit |
| Form 7 PDF generation with correct variables | Integration |
| DocuSign webhook → Document.status updated | Integration |
| Dispute creation → activity log entry created | Integration |
| Legal hold blocks lease modification | Unit |
| Non-renewal reminder 95 days before expiry | Unit (date logic) |

---

## 11. Observability / Logging

| Event | Log Level | Destination |
|---|---|---|
| Document generated | INFO | CloudWatch |
| Signature request sent | INFO | CloudWatch + CRM activity feed |
| Signature completed | INFO | CloudWatch + agent notification |
| Signature voided | WARN | CloudWatch + agent task created |
| Dispute filed | INFO | CloudWatch + compliance@ email |
| Legal hold placed | WARN | CloudWatch + manager notification |

---

## 12. Security & Compliance Controls

- All legal documents served over HTTPS only; download links are signed URLs (15-min expiry)
- Document access RBAC: agent (own leads), manager (team), admin/superuser (all)
- Signed PDFs immutable; no update/delete endpoint for `LegalDocument` once `status = signed`
- DocuSign API key stored in env; never logged or returned in API responses
- Personal data in documents covered by PDPL Art 4 — data minimisation enforced
- Audit log entry for every document generation, signature event, and dispute action
