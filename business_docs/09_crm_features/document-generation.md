# Document Generation

> **Owner:** @Annie | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Module:** HenryDocumentHub + Annie PDF Service
> **Status:** Production-ready specification

`CONSUMES←@Victoria: business_docs/09_crm_features/tenancy-ejari.md#tenant-obligations`
`FEEDS→@Marissa: business_docs/09_crm_features/tenant-portal.md#ux-requirements`

---

## 1. Overview

The Document Generation module converts CRM data into legally-valid, branded PDFs for the Dubai real estate lifecycle. All documents are generated server-side via PDFKit (Node.js), stored in `uploads/documents/{entityId}/`, and exposed through the `/api/documents` route secured by JWT + RBAC.

**In-scope documents (initial release):**

| # | Document | Trigger | Legal Requirement |
|---|----------|---------|-------------------|
| 1 | Ejari Certificate | On lease registration | RERA mandatory |
| 2 | Tenancy Agreement | On lease creation | Dubai Tenancy Law |
| 3 | NOC Letter (landlord→tenant) | On-demand request | Visa/bank/school use |
| 4 | Maintenance Work Order | On maintenance ticket creation | SLA proof |
| 5 | Payment Receipt | On rent payment confirmation | VAT Act 2017 |
| 6 | Commission Invoice | On deal closure | UAE VAT compliance |
| 7 | MOU / Letter of Intent | On offer acceptance | RERA Form B |

---

## 2. Document Types and Template Variables

### 2.1 Ejari Certificate

**Required RERA fields (all mandatory):**

```ts
interface EjariCertificateData {
  ejariContractNo: string;          // RERA-assigned e.g. "EJR-2025-XXXXXX"
  registrationDate: string;         // ISO date
  landlordName: string;
  landlordEmiratesId: string;
  tenantName: string;
  tenantEmiratesId: string;
  propertyAddress: string;          // Flat No + Building + Area + Dubai
  propertyType: 'apartment' | 'villa' | 'commercial';
  buildingPermitNo: string;
  deedNo: string;
  startDate: string;
  endDate: string;
  annualRent: number;               // AED
  securityDeposit: number;          // AED
  numberOfCheques: number;
  reraStampCode: string;            // QR-scannable
}
```

### 2.2 Tenancy Agreement

```ts
interface TenancyAgreementData {
  agreementNo: string;              // e.g. "WC-2025-001234"
  landlord: Party;
  tenant: Party;
  property: PropertyDetails;
  term: { startDate: string; endDate: string; durationMonths: number };
  financials: {
    annualRent: number;             // AED
    monthlyEquivalent: number;
    securityDeposit: number;
    agencyFee: number;              // 5% of annual rent
    vatOnAgencyFee: number;         // 5% of agency fee
  };
  pdcSchedule: PDCCheque[];         // Array of post-dated cheques
  specialConditions: string[];
  signatories: Signatory[];         // landlord + tenant + witness + agent
}

interface PDCCheque {
  chequeNo: string;
  bankName: string;
  amount: number;
  dueDate: string;
}
```

### 2.3 NOC Letter

```ts
interface NOCLetterData {
  nocType: 'visa' | 'bank' | 'school' | 'other';
  issuedBy: Party;          // landlord details
  issuedFor: Party;         // tenant details
  propertyAddress: string;
  leaseStartDate: string;
  leaseEndDate: string;
  purposeStatement: string; // e.g. "for the purpose of UAE visa renewal"
  generatedAt: string;      // ISO timestamp
  agentName: string;
  agentLicenseNo: string;   // RERA BRN
  stampFieldPlaceholder: boolean; // true = reserve bottom space for stamp
}
```

### 2.4 Payment Receipt

```ts
interface PaymentReceiptData {
  receiptNo: string;                // WC-RCP-YYYYMMDD-XXXX
  paymentDate: string;
  tenantName: string;
  propertyAddress: string;
  amountAED: number;
  vatAmount: number;                // 0 for residential, 5% for commercial
  totalAED: number;
  paymentMethod: 'cheque' | 'bank_transfer' | 'cash';
  chequeNo?: string;
  periodCovered: string;            // e.g. "January 2026"
  receivedBy: string;               // agent name
  companyTRN: string;               // White Caves Tax Registration Number
}
```

### 2.5 Commission Invoice

```ts
interface CommissionInvoiceData {
  invoiceNo: string;                // WC-INV-YYYYMMDD-XXXX
  invoiceDate: string;
  client: Party;
  propertyAddress: string;
  dealType: 'sale' | 'lease' | 'renewal';
  salePrice?: number;               // for sale deals
  annualRent?: number;              // for lease deals
  commissionRate: number;           // e.g. 2 for 2%
  commissionAmountAED: number;
  vatRate: 5;
  vatAmountAED: number;
  totalDueAED: number;
  bankDetails: BankDetails;
  paymentDueDate: string;           // invoice date + 7 days
  companyTRN: string;
}
```

---

## 3. Template Engine Selection

### Decision: PDFKit (chosen) vs Puppeteer

| Criteria | PDFKit | Puppeteer |
|----------|--------|-----------|
| Server overhead | Minimal (pure Node.js) | High (headless Chromium) |
| Startup time | < 50ms | 2–5 seconds |
| Arabic/RTL support | Via custom font embedding | Native browser RTL |
| Table layout control | Programmatic | HTML/CSS |
| Memory (Vercel) | ~30MB | ~300MB |
| **Decision** | ✅ **CHOSEN** | ❌ Too heavy for Vercel |

PDFKit with embedded fonts (Montserrat + Cairo for Arabic sections) and a thin layout abstraction layer in `server/services/henry/pdfGenerator.ts`.

### 3.1 Font Strategy

```
server/assets/fonts/
  Montserrat-Regular.ttf
  Montserrat-Bold.ttf
  Cairo-Regular.ttf      ← Arabic sections / bilingual headers
```

### 3.2 Layout Abstraction

```ts
// server/services/henry/pdfGenerator.ts
export interface DocumentTemplate<T> {
  buildHeader(doc: PDFDocument, data: T): void;
  buildBody(doc: PDFDocument, data: T): void;
  buildFooter(doc: PDFDocument, data: T, pageNum: number): void;
}
```

---

## 4. API Contract

### POST /api/documents/generate

**Request:**
```json
{
  "type": "tenancy_agreement | ejari | noc | receipt | commission_invoice | mou | work_order",
  "entityId": "string",         // leaseId, ticketId, offerId — source of truth
  "overrides": {}               // optional field-level overrides (manager only)
}
```

**Response:**
```json
{
  "success": true,
  "documentId": "doc_abc123",
  "downloadUrl": "/api/documents/doc_abc123/download",
  "filename": "WC-TenancyAgreement-2025-001234.pdf",
  "expiresAt": "ISO timestamp (24h)"
}
```

**Auth:** JWT required. Role access:
- `tenant`: receipt, noc (own lease only)
- `agent`: all types for their deals
- `manager/admin/owner`: all types, all deals

### GET /api/documents/:id/download

Returns `Content-Type: application/pdf` stream. Download token verified (signed URL, 24h TTL).

### GET /api/documents?entityId=&type=

Lists all documents for an entity (paginated, 20/page).

---

## 5. Storage Path

```
uploads/
  documents/
    {entityType}/          ← lease | maintenance | offer
      {entityId}/
        {documentId}.pdf
```

Files are served from `/api/documents/:id/download` (not directly from disk), ensuring auth check on every download.

---

## 6. Validation Rules

| Field | Rule | Error |
|-------|------|-------|
| `entityId` | Must exist in DB | 404 |
| `type` | Must be in allowed enum | 400 |
| Lease status | Must be `active` or `signed` for Ejari | 422 |
| VAT calculation | totalDue = commission + (commission × 0.05) | recalculate if mismatch |
| TRN | Must be set in SystemSetting `company.trn` | 503 |

---

## 7. Failure and Edge Handling

| Scenario | Handling |
|----------|----------|
| Missing template font | Fall back to Helvetica, log warning |
| Missing entity data | 422 with field-level error list |
| PDF write failure | Delete partial file, return 500, alert via Winston |
| Storage disk full | Return 503, notify admin via email |
| Concurrent same doc | Idempotency: return existing if generated < 5min ago |
| Arabic characters | Always embed Cairo font; fallback to Unicode encoding |

---

## 8. Security & Compliance Controls

- All downloads require valid JWT + document ownership check
- Signed URLs expire after 24 hours
- Documents are never publicly accessible (no `public/documents/` exposure)
- RERA-required documents (Ejari, Tenancy) include RERA stamp code QR
- Commission invoices include company TRN per UAE VAT law
- Audit log entry created on each document generation (`henry_audit_log`)

---

## 9. UX States (Portal / Mobile)

| State | Display |
|-------|---------|
| Generating | Spinner in button, "Generating PDF…" label |
| Ready | Download button active, preview thumbnail |
| Expired | "Link expired — regenerate" with one-click re-request |
| Error | Toast: "Document generation failed. Try again." |
| Mobile (375px) | Full-width download button, document type icon |

---

## 10. Observability / Logging

```ts
// Winston log on each generation
logger.info('document.generated', {
  documentId, type, entityId, agentId,
  durationMs, fileSizeBytes
});

// Metrics (future Prometheus)
// doc_generation_count{type}
// doc_generation_duration_ms{type}
// doc_generation_errors_total{type, reason}
```

---

## 11. Tests

| Test | Type | Target |
|------|------|--------|
| `POST /api/documents/generate` returns 200 with pdf | Integration | server |
| Unauthorized user gets 403 | Integration | server |
| Missing entityId returns 422 | Unit | validation |
| VAT calculation matches expected total | Unit | pdfGenerator |
| Download URL expires after 24h | Unit | token utils |
| Arabic characters render without fallback | Unit | pdfGenerator |

---

## 12. Rollback / Migration Plan

- Documents are file-based; no schema migration required for new types
- Adding a new document type: add entry to `DocumentTypeEnum`, create template class, deploy
- Rollback: previous type handlers remain unaffected (open/closed principle)
- Old documents remain downloadable at original path after updates