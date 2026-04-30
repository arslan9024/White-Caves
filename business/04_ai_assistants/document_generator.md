# AI Assistant: Document Generator (Quill)

> **ID:** `quill`
> **Department:** Legal / Operations
> **Category:** AI-Powered Document Automation
> **Status:** Proposed (Phase 2 Research Implementation)
> **Created:** April 11, 2026

---

## 1. Overview

Quill is an AI-powered document generation assistant that automates the creation of contracts, agreements, disclosures, and compliance documents. Quill uses smart templates with conditional logic, auto-populates from CRM data, and ensures RERA/DLD compliance for all generated documents.

---

## 2. Capabilities

### 2.1 Document Types

| Category | Documents | Template Source |
|----------|-----------|----------------|
| **Sales** | MOU (Memorandum of Understanding), SPA (Sale Purchase Agreement), NOC Request | RERA-compliant templates |
| **Leasing** | Tenancy Contract (Ejari-ready), Renewal Notice, Rent Increase Notice | Ejari-standard format |
| **Compliance** | KYC Declaration, Source of Funds, PEP Screening Form | AML/KYC regulations |
| **Commission** | Brokerage Agreement, Commission Invoice, Fee Schedule | RERA commission rules |
| **Property** | Property Listing Sheet, Valuation Report, Inspection Checklist | Internal templates |
| **HR** | Employment Contract, NDA, Agent Onboarding Pack | UAE Labor Law |

### 2.2 Smart Template Engine

| Feature | Description |
|---------|-------------|
| **Conditional Sections** | Show/hide clauses based on property type, transaction type, nationality |
| **Auto-Population** | Pull data from Lead, Property, Transaction, Agent Prisma models |
| **Multi-Language** | Generate in English and Arabic (bilingual contracts) |
| **Version Control** | Track template versions, maintain audit trail of changes |
| **Digital Signatures** | Integration with DocuSign or Adobe Sign for e-signatures |
| **PDF Generation** | Server-side PDF rendering with puppeteer or PDFKit |

### 2.3 Compliance Validation

| Check | Description |
|-------|-------------|
| **RERA Clauses** | Ensure all RERA-required clauses are present |
| **Ejari Fields** | Validate all fields required for Ejari registration |
| **TRN/VAT** | Auto-calculate and include VAT where applicable |
| **Permit Numbers** | Validate Trakheesi permit on property-related documents |
| **Witness Requirements** | Flag documents requiring witness signatures |

---

## 3. Technical Architecture

### 3.1 Document Generation Pipeline

```
Template Selection → Data Extraction (Prisma) → Variable Substitution
        ↓
Conditional Logic Evaluation → Compliance Validation → PDF Rendering
        ↓
Digital Signature Request → Storage (S3) → Notification (Email + WhatsApp)
```

### 3.2 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/documents/templates` | List available templates |
| `GET` | `/api/documents/templates/:id` | Get template with variables |
| `POST` | `/api/documents/generate` | Generate document from template + data |
| `GET` | `/api/documents/:id` | Download generated document |
| `POST` | `/api/documents/:id/sign` | Request digital signature |
| `GET` | `/api/documents/:id/status` | Check signing status |
| `GET` | `/api/documents/audit/:entityId` | Audit trail for entity |

### 3.3 Database Schema Addition

```prisma
model DocumentTemplate {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  category    String   // sales, leasing, compliance, commission, property, hr
  version     Int      @default(1)
  content     String   // Handlebars template content
  variables   Json     // [{ name: "buyerName", source: "Lead.name", required: true }]
  conditions  Json     // [{ field: "propertyType", op: "eq", value: "villa", action: "include", section: "villa_clause" }]
  compliance  Json     // [{ check: "rera_clause", required: true }]
  language    String   @default("en") // en, ar, bilingual
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  documents   GeneratedDocument[]

  @@index([category, isActive])
}

model GeneratedDocument {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  templateId  String   @db.ObjectId
  template    DocumentTemplate @relation(fields: [templateId], references: [id])
  entityType  String   // lead, property, transaction, lease
  entityId    String   @db.ObjectId
  data        Json     // Populated template variables
  fileUrl     String   // S3 URL to generated PDF
  status      String   @default("draft") // draft, pending_signature, signed, expired
  signatureId String?  // DocuSign/Adobe Sign envelope ID
  generatedBy String   @db.ObjectId
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([entityType, entityId])
  @@index([status])
}
```

---

## 4. Integration Points

| System | Integration | Direction |
|--------|-------------|-----------|
| **Laila (Compliance)** | Compliance validation rules, RERA clause library | Read |
| **Evangeline (Legal)** | Legal review workflow, risk flagging | Bidirectional |
| **Sophia (Sales)** | Generate MOU/SPA from transaction | Trigger |
| **Daisy (Leasing)** | Generate tenancy contracts from lease | Trigger |
| **Theodora (Finance)** | Commission invoices from transaction | Trigger |
| **Nadia (WhatsApp)** | Send generated documents to clients | Output |

---

## 5. Template Examples

### 5.1 MOU Template Variables

```json
{
  "buyerName": "Lead.name",
  "buyerPassport": "Lead.passportNumber",
  "buyerEmiratesId": "Lead.emiratesId",
  "sellerName": "Property.owner.name",
  "propertyTitle": "Property.title",
  "propertyLocation": "Property.address",
  "propertyPermit": "Property.permitNumber",
  "salePrice": "Transaction.amount",
  "depositAmount": "Transaction.deposit",
  "agentName": "Agent.name",
  "agentBRN": "Agent.reraRegistrationNumber",
  "companyName": "Company.name",
  "companyTRN": "Company.taxRegistrationNumber",
  "date": "auto:currentDate",
  "witnessName": "manual:input"
}
```

---

## 6. Complete Template Library

The following table catalogs every active template in the Quill library. RERA form references are based on the 2024 RERA standard forms catalogue.

| # | Template Name | Category | RERA Form Ref | Variables Count | Conditional Sections | Language Support | Avg Generation Time |
|---|--------------|----------|--------------|----------------|---------------------|-----------------|---------------------|
| 1 | Memorandum of Understanding (MOU) | Sales | RERA Form-A (Buyer-Seller) | 24 | 4 (off-plan, villa, commercial, non-UAE buyer) | EN / Bilingual | 8 sec |
| 2 | Sale Purchase Agreement (SPA) | Sales | RERA Form-B | 38 | 6 (off-plan escrow, sub-developer, power of attorney, VAT applicable, payment plan, NOC pending) | EN / Bilingual | 12 sec |
| 3 | NOC Request Letter | Sales | RERA Form-F (DLD) | 12 | 2 (mortgage lender, developer-specific NOC) | EN only | 4 sec |
| 4 | Transfer of Ownership Letter | Sales | DLD Transfer Form | 18 | 3 (cash buyer, mortgage, off-plan reassignment) | EN / Bilingual | 6 sec |
| 5 | Tenancy Contract (Residential) | Leasing | Ejari Standard Form (Residential) | 31 | 5 (furnished, short-term <1yr, shared villa, DEWA included, pet policy) | EN / Bilingual | 10 sec |
| 6 | Tenancy Contract (Commercial) | Leasing | Ejari Standard Form (Commercial) | 35 | 4 (retail, office, warehouse, fit-out period) | EN / Bilingual | 11 sec |
| 7 | Tenancy Renewal Notice | Leasing | Internal | 8 | 1 (rent increase applicable) | EN / AR | 3 sec |
| 8 | Rent Increase Notice (90-Day) | Leasing | RERA Rent Index Notification | 10 | 2 (< RERA max, = RERA max) | EN / Bilingual | 3 sec |
| 9 | Lease Termination Notice | Leasing | Internal | 9 | 2 (12-month notice, mutual agreement) | EN / Bilingual | 3 sec |
| 10 | KYC Declaration Form | Compliance | AML/CFT Form K-1 | 20 | 3 (company buyer, PEP, non-resident) | EN / AR | 5 sec |
| 11 | Source of Funds Declaration | Compliance | AML/CFT Form K-2 | 15 | 4 (salary, business income, inheritance, investment) | EN / AR | 4 sec |
| 12 | PEP Screening Declaration | Compliance | MOEC PEP Form | 12 | 2 (direct PEP, family member PEP) | EN only | 4 sec |
| 13 | Brokerage Agreement (Buyer) | Commission | RERA Form-A (Agency) | 16 | 2 (exclusive, non-exclusive) | EN / Bilingual | 5 sec |
| 14 | Brokerage Agreement (Seller) | Commission | RERA Form-I | 14 | 3 (exclusive listing, open listing, co-agent split) | EN / Bilingual | 5 sec |
| 15 | Commission Invoice | Commission | Internal / VAT-compliant | 11 | 3 (VAT applicable, co-agency fee split, referral fee) | EN only | 3 sec |
| 16 | Fee Schedule — Leasing | Commission | Internal | 8 | 2 (residential, commercial) | EN only | 2 sec |
| 17 | Property Listing Sheet | Property | Internal | 22 | 3 (off-plan, secondary, furnished rental) | EN / AR | 7 sec |
| 18 | Property Valuation Report | Property | RERA Valuation Guidelines | 29 | 5 (residential, commercial, off-plan, mortgage valuation, insurance valuation) | EN only | 15 sec |
| 19 | Property Inspection Checklist | Property | RERA Handover Standards | 18 | 4 (villa, apartment, commercial, off-plan snagging) | EN / AR | 6 sec |
| 20 | Employment Contract | HR | UAE Labor Law Federal Decree 33/2021 | 26 | 4 (limited contract, unlimited, probation, remote work) | EN / AR | 9 sec |
| 21 | Non-Disclosure Agreement (NDA) | HR | Internal | 14 | 2 (mutual NDA, one-way NDA) | EN only | 4 sec |
| 22 | Agent Onboarding Pack | HR | Internal | 20 | 3 (senior agent, junior agent, off-plan specialist) | EN only | 12 sec |
| 23 | Power of Attorney (Property) | Sales | UAE Notary Standard | 16 | 3 (buy, sell, manage) | EN / Bilingual | 8 sec |
| 24 | RERA Developer Complaint Form | Compliance | RERA Complaint Form | 13 | 2 (delayed handover, defect claim) | EN / AR | 5 sec |

---

## 7. Field Mapping Specification

For each major document type, every field is mapped to its CRM source, validation rule, and default value.

### 7.1 MOU — Memorandum of Understanding

| Field Name | CRM Source | Required | Validation Rule | Default |
|-----------|-----------|----------|----------------|---------|
| `buyerFullName` | `Lead.name` | ✅ Yes | Non-empty, max 100 chars, matches passport name | — |
| `buyerPassportNumber` | `Lead.passportNumber` | ✅ Yes | Pattern: `[A-Z]{1,2}[0-9]{6,9}` | — |
| `buyerPassportExpiry` | `Lead.passportExpiry` | ✅ Yes | Date > today | — |
| `buyerEmiratesId` | `Lead.emiratesId` | Conditional | Required if `Lead.residencyStatus = 'resident'`; format: `784-YYYY-NNNNNNN-N` | N/A |
| `buyerNationality` | `Lead.nationality` | ✅ Yes | ISO 3166-1 alpha-3 country code | — |
| `buyerAddress` | `Lead.address` | ✅ Yes | Non-empty, max 200 chars | — |
| `buyerPhone` | `Lead.phone` | ✅ Yes | E.164 format (`+971XXXXXXXXX`) | — |
| `sellerFullName` | `Property.owner.name` OR `Lead.sellerContact.name` | ✅ Yes | Non-empty, max 100 chars | — |
| `sellerPassportNumber` | `Property.owner.passportNumber` | ✅ Yes | Pattern: `[A-Z]{1,2}[0-9]{6,9}` | — |
| `propertyTitle` | `Property.title` | ✅ Yes | Max 200 chars | — |
| `propertyAddress` | `Property.address` | ✅ Yes | Non-empty | — |
| `propertyPermitNumber` | `Property.permitNumber` | ✅ Yes | Trakheesi permit format validation API call | — |
| `propertySizesqft` | `Property.areaSqft` | ✅ Yes | Number > 0 | — |
| `agreedSalePrice` | `Transaction.amount` | ✅ Yes | Number > 0, AED currency | — |
| `depositAmount` | `Transaction.deposit` | ✅ Yes | Typically 10% of sale price; min AED 10,000 | 10% of `agreedSalePrice` |
| `depositPaymentDate` | `Transaction.depositDueDate` | ✅ Yes | Date >= today | today + 3 days |
| `completionDate` | `Transaction.completionDate` | ✅ Yes | Date > depositPaymentDate | today + 30 days |
| `agentName` | `Agent.name` | ✅ Yes | Non-empty | Assigned agent |
| `agentBRN` | `Agent.reraRegistrationNumber` | ✅ Yes | RERA BRN format validation | — |
| `companyName` | `Company.name` | ✅ Yes | Registered trade name | "White Caves Real Estate LLC" |
| `companyTRN` | `Company.taxRegistrationNumber` | ✅ Yes | UAE TRN format: 15 digits | — |
| `mouDate` | `auto:currentDate` | ✅ Yes | ISO 8601 date | today |
| `witnessName` | `manual:input` | Conditional | Required for non-UAE buyers | — |
| `conditionsPrecedent` | `Transaction.conditions` | Optional | Free text, max 500 chars | "Subject to NOC" |

### 7.2 SPA — Sale Purchase Agreement

| Field Name | CRM Source | Required | Validation Rule | Default |
|-----------|-----------|----------|----------------|---------|
| `buyerFullName` | `Lead.name` | ✅ Yes | Matches MOU buyerFullName | — |
| `buyerPassportNumber` | `Lead.passportNumber` | ✅ Yes | Matches MOU | — |
| `buyerLegalAddress` | `Lead.address` | ✅ Yes | Full legal address | — |
| `buyerBankDetails` | `Lead.bankDetails` | Conditional | Required if mortgage financing | — |
| `sellerFullName` | `Property.owner.name` | ✅ Yes | Non-empty | — |
| `sellerTitleDeedNumber` | `Property.titleDeedNumber` | ✅ Yes | DLD title deed format | — |
| `developerName` | `Property.developer.name` | Conditional | Required for off-plan | — |
| `projectName` | `Property.project.name` | Conditional | Required for off-plan | — |
| `plotNumber` | `Property.plotNumber` | ✅ Yes | DLD plot reference | — |
| `propertyType` | `Property.type` | ✅ Yes | Enum: apartment/villa/townhouse/penthouse/commercial | — |
| `totalPurchasePrice` | `Transaction.amount` | ✅ Yes | AED, numeric > 0 | — |
| `paymentSchedule` | `Transaction.paymentPlan` | ✅ Yes | JSON array of milestone+amount+date | — |
| `escrowAccountNumber` | `Transaction.escrowAccount` | Conditional | Required for off-plan; DLD escrow format | — |
| `mortgageLenderName` | `Transaction.mortgage.lenderName` | Conditional | Required if `Transaction.financingType = 'mortgage'` | — |
| `nocIssuedBy` | `Transaction.noc.issuedBy` | ✅ Yes | Developer name | — |
| `nocReferenceNumber` | `Transaction.noc.referenceNumber` | ✅ Yes | Alphanumeric, max 30 chars | — |
| `vatApplicable` | `computed: propertyType + buyerType` | ✅ Yes | Boolean; commercial sales attract 5% VAT | false |
| `vatAmount` | `computed: totalPurchasePrice * 0.05` | Conditional | Required if `vatApplicable = true` | — |
| `handoverDate` | `Property.handoverDate` | Conditional | Required for off-plan | — |
| `penaltyClause` | `Transaction.penaltyTerms` | Optional | Max 10% of purchase price per RERA | — |
| `governingLaw` | `auto:static` | ✅ Yes | Always "Laws of Dubai, UAE" | "Laws of Dubai, UAE" |
| `disputeResolution` | `auto:static` | ✅ Yes | Always "RERA / Dubai Courts" | "RERA / Dubai Courts" |
| `spaDate` | `auto:currentDate` | ✅ Yes | ISO 8601 | today |
| `registrationFee` | `computed: amount * 0.04` | ✅ Yes | DLD 4% transfer fee | — |

### 7.3 Tenancy Contract

| Field Name | CRM Source | Required | Validation Rule | Default |
|-----------|-----------|----------|----------------|---------|
| `tenantFullName` | `Lead.name` | ✅ Yes | Non-empty, max 100 chars | — |
| `tenantEmiratesId` | `Lead.emiratesId` | ✅ Yes | UAE resident; format: `784-YYYY-NNNNNNN-N` | — |
| `tenantPassportNumber` | `Lead.passportNumber` | ✅ Yes | Valid passport format | — |
| `tenantPhone` | `Lead.phone` | ✅ Yes | E.164 format | — |
| `tenantEmail` | `Lead.email` | ✅ Yes | Valid email format | — |
| `landlordFullName` | `Property.owner.name` | ✅ Yes | Non-empty | — |
| `landlordEmiratesId` | `Property.owner.emiratesId` | ✅ Yes | Valid UAE Emirates ID | — |
| `propertyAddress` | `Property.address` | ✅ Yes | Full address including unit | — |
| `ejariUnitNumber` | `Property.ejariUnitNumber` | ✅ Yes | Ejari registered unit reference | — |
| `propertyType` | `Property.type` | ✅ Yes | Residential or Commercial | — |
| `leaseStartDate` | `Lease.startDate` | ✅ Yes | Date >= today | — |
| `leaseEndDate` | `Lease.endDate` | ✅ Yes | Date > leaseStartDate | leaseStartDate + 365 days |
| `annualRent` | `Lease.annualRent` | ✅ Yes | AED, numeric > 0 | — |
| `chequeCount` | `Lease.chequeCount` | ✅ Yes | Integer 1–12 | 4 |
| `chequeDates` | `Lease.chequeDates` | ✅ Yes | Array of dates, count matches chequeCount | — |
| `securityDeposit` | `computed: annualRent * 0.05` | ✅ Yes | Min 5% annual rent | 5% of annualRent |
| `agencyFee` | `computed: annualRent * 0.05` | ✅ Yes | 5% RERA standard (residential) | 5% of annualRent |
| `furnisingStatus` | `Property.furnished` | ✅ Yes | Enum: furnished/semi-furnished/unfurnished | unfurnished |
| `dewaAccountTransfer` | `manual:input` | ✅ Yes | Boolean — tenant responsibility | true |
| `noOfOccupants` | `Lease.occupantsCount` | ✅ Yes | Integer 1–20 | 1 |
| `petsAllowed` | `Property.petsAllowed` | ✅ Yes | Boolean | false |
| `ejariRegistrationDate` | `Lease.ejariRegistrationDate` | Conditional | Required within 30 days of signing | — |

### 7.4 Commission Invoice

| Field Name | CRM Source | Required | Validation Rule | Default |
|-----------|-----------|----------|----------------|---------|
| `invoiceNumber` | `auto:generated` | ✅ Yes | Format: `WC-INV-{YYYY}-{NNNN}` | Auto-assigned |
| `invoiceDate` | `auto:currentDate` | ✅ Yes | ISO 8601 | today |
| `clientName` | `Lead.name` OR `Property.owner.name` | ✅ Yes | Depends on who pays commission | — |
| `clientTRN` | `Lead.trn` OR `Property.owner.trn` | Conditional | Required if VAT-registered client | — |
| `propertyAddress` | `Property.address` | ✅ Yes | Full property address | — |
| `transactionType` | `Transaction.type` | ✅ Yes | Enum: sale/lease/renewal | — |
| `transactionValue` | `Transaction.amount` | ✅ Yes | AED, numeric > 0 | — |
| `commissionRate` | `Transaction.commissionRate` | ✅ Yes | % value; sales: 2%, leasing: 5% (RERA standard) | 2% (sale), 5% (lease) |
| `commissionAmountNet` | `computed: transactionValue * commissionRate / 100` | ✅ Yes | AED | — |
| `vatRate` | `auto:static` | ✅ Yes | Always 5% UAE VAT | 0.05 |
| `vatAmount` | `computed: commissionAmountNet * 0.05` | ✅ Yes | AED | — |
| `totalPayable` | `computed: commissionAmountNet + vatAmount` | ✅ Yes | AED | — |
| `agentName` | `Agent.name` | ✅ Yes | Non-empty | — |
| `agentBRN` | `Agent.reraRegistrationNumber` | ✅ Yes | Valid RERA BRN | — |
| `paymentDueDate` | `Transaction.commissionDueDate` | ✅ Yes | Date >= invoiceDate | invoiceDate + 7 days |
| `bankAccountIBAN` | `Company.bankIBAN` | ✅ Yes | UAE IBAN format: `AE{26 digits}` | Company default IBAN |
| `coAgencyName` | `Transaction.coAgent.companyName` | Conditional | Required if co-agency deal | — |
| `coAgencyShare` | `Transaction.coAgent.splitPercentage` | Conditional | % of net commission to co-agent | 50% |

---

## 8. PDF Generation Technical Specification

### 8.1 Library Selection

After evaluating three candidates, **Puppeteer** was selected as the primary PDF rendering engine:

| Library | Pros | Cons | Decision |
|---------|------|------|---------|
| **Puppeteer** | Full HTML/CSS rendering, supports complex layouts, excellent Arabic RTL support, CSS Grid/Flexbox, web fonts | Higher memory usage (~150 MB per instance), slower cold start | ✅ **Selected** |
| **PDFKit** | Lightweight, fast, low memory | Programmatic layout only (no HTML), limited Arabic support, complex table rendering | ❌ Rejected |
| **@react-pdf/renderer** | React component-based, good DX | Limited Arabic RTL support, no CSS Grid, fonts must be pre-embedded | ❌ Rejected |

### 8.2 Puppeteer Configuration

```typescript
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--font-render-hinting=medium',
  ],
});

const page = await browser.newPage();
await page.setContent(renderedHTML, { waitUntil: 'networkidle0' });

const pdf = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-size:8px;width:100%;text-align:right;padding-right:15mm;">
    White Caves Real Estate LLC — CONFIDENTIAL
  </div>`,
  footerTemplate: `<div style="font-size:8px;width:100%;text-align:center;">
    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
  </div>`,
});
```

### 8.3 HTML Template Structure

```html
<!DOCTYPE html>
<html lang="{{language}}" dir="{{direction}}">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('/fonts/NotoNaskhArabic.css');
    @import url('/fonts/Playfair.css');
    /* Base styles */
    body { font-family: 'Playfair Display', serif; font-size: 11pt; color: #1a1a1a; }
    .arabic { font-family: 'Noto Naskh Arabic', serif; direction: rtl; text-align: right; }
    .bilingual-container { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    /* ... document-specific styles ... */
  </style>
</head>
<body>
  <div class="document-header">
    <img src="{{logoUrl}}" alt="White Caves" />
    <h1 class="document-title">{{documentTitle}}</h1>
    <p class="document-ref">Ref: {{documentRef}}</p>
  </div>
  <div class="document-body">
    {{> content}}   <!-- Handlebars partial for document body -->
  </div>
  <div class="signature-block">
    {{> signatureSection}}
  </div>
</body>
</html>
```

### 8.4 Fonts

| Font | Usage | License | Arabic Support |
|------|-------|---------|---------------|
| **Noto Naskh Arabic** | Arabic body text, bilingual contracts | OFL (Open) | ✅ Full Unicode Arabic |
| **Playfair Display** | English headings, document titles | OFL (Open) | ❌ Latin only |
| **Source Sans Pro** | English body text, tables, clauses | OFL (Open) | ❌ Latin only |
| **Courier Prime** | Reference numbers, codes, IBANs | OFL (Open) | ❌ Latin only |

All fonts are self-hosted in S3 at `s3://white-caves-assets/fonts/` and embedded in PDFs to ensure offline rendering fidelity.

### 8.5 File Naming Convention

```
WC_{docType}_{entityId}_{date}.pdf

Examples:
  WC_MOU_507f1f77bcf86cd799439011_20260415.pdf
  WC_SPA_507f1f77bcf86cd799439012_20260415.pdf
  WC_TEN_507f1f77bcf86cd799439013_20260415.pdf
  WC_INV_507f1f77bcf86cd799439014_20260415.pdf

docType codes:
  MOU = Memorandum of Understanding
  SPA = Sale Purchase Agreement
  TEN = Tenancy Contract
  INV = Commission Invoice
  KYC = KYC Declaration
  NOC = NOC Request
  BRK = Brokerage Agreement
  EMP = Employment Contract
  VAL = Valuation Report
```

### 8.6 S3 Storage Path

```
s3://white-caves-documents/{year}/{month}/{entityType}/{entityId}/{filename}

Example:
  s3://white-caves-documents/2026/04/transaction/507f1f77bcf86cd799439011/
    WC_MOU_507f1f77bcf86cd799439011_20260415.pdf
    WC_SPA_507f1f77bcf86cd799439011_20260420.pdf
```

- **Bucket:** `white-caves-documents` (private, no public access)
- **Encryption:** SSE-S3 (AES-256) at rest
- **Access:** Pre-signed URLs with 1-hour expiry for download
- **Lifecycle:** Retain all versions indefinitely (compliance requirement)

### 8.7 Performance & Size Constraints

| Constraint | Specification |
|-----------|---------------|
| **Maximum file size** | 2 MB per PDF |
| **Compression** | Puppeteer output compressed with `zlib` level 6 post-generation |
| **Image compression** | Property photos embedded at max 150 DPI, JPEG quality 75 |
| **Generation timeout** | 30 seconds (hard limit); alert if > 15 seconds |
| **Concurrent renders** | Max 4 Puppeteer instances per server pod |
| **Puppeteer pooling** | Generic-pool with min=1, max=4, idleTimeoutMillis=30000 |

---

## 9. Digital Signature Workflow

### 9.1 End-to-End Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    QUILL DIGITAL SIGNATURE FLOW                          │
└──────────────────────────────────────────────────────────────────────────┘

[Agent] → POST /api/documents/generate
              ↓
         [Quill] PDF Generated (S3 stored)
              ↓
[Agent] → POST /api/documents/:id/sign (specifies signers)
              ↓
         [Quill] → DocuSign API: Create Envelope
              ↓                   ↓
         Envelope ID stored    Signature request emails sent
         in GeneratedDocument  to all signers (buyer, seller,
         .signatureId          agent, witness)
              ↓
         [DocuSign] → Signers receive email with signing link
              ↓
         [Signer] completes signature on DocuSign interface
              ↓
         [DocuSign] → Webhook: POST /api/webhooks/docusign
              ↓
         [Quill] Updates GeneratedDocument.status
              ↓
         All signed?
         ┌──── YES ────────────────────────────────────────┐
         │                                                  │
    status = 'signed'                              Final signed PDF
    Notification sent                             downloaded from
    to all parties                                DocuSign → S3
    (Email + WhatsApp)                            (replaces draft)
         │
         └──── NO (partial) → status = 'pending_signature'
                              Reminder schedule activated
```

### 9.2 Reminder Schedule

| Reminder # | Trigger | Message | Channel |
|-----------|---------|---------|---------|
| Reminder 1 | 24 hours after signature request sent (if unsigned) | "Please review and sign your document" | Email |
| Reminder 2 | 48 hours after request (if still unsigned) | "Your signature is still required — deadline approaching" | Email + WhatsApp |
| Reminder 3 | 72 hours after request (if still unsigned) | "Final reminder: document expires in 24 hours" | Email + WhatsApp + agent notification |
| Expiry | 96 hours after request (unsigned) | Document marked `status = 'expired'`; agent notified to resend | Email to agent |

### 9.3 Signature Positions in Document

| Signer Role | Position in Document | Signature Type | Required |
|-------------|---------------------|---------------|----------|
| **Buyer** | Page 1 (acknowledgment) + Final page (execution) | Full signature + initials per page | ✅ Yes |
| **Seller** | Final page (execution) | Full signature + initials per page | ✅ Yes |
| **Agent** | Final page (witness/certification) | Full signature | ✅ Yes |
| **Witness** | Final page | Full signature + Emirates ID number | Conditional (non-UAE buyers) |
| **Company Stamp** | Final page | Company seal image (pre-placed) | ✅ Yes (auto) |

### 9.4 DocuSign Integration

```typescript
interface DocuSignEnvelopeRequest {
  templateId: string;          // DocuSign template ID (pre-configured)
  emailSubject: string;        // "White Caves: Please sign your {docType}"
  emailBlurb: string;
  status: 'sent';
  recipients: {
    signers: DocuSignSigner[];
  };
  customFields: {
    textCustomFields: Array<{ name: string; value: string; required: true }>;
  };
}

interface DocuSignSigner {
  name: string;
  email: string;
  recipientId: string;         // "1", "2", "3" etc.
  routingOrder: string;        // "1" = buyer first, "2" = seller, "3" = agent
  tabs: {
    signHereTabs: SignHereTab[];
    initialHereTabs: InitialHereTab[];
    dateSignedTabs: DateSignedTab[];
  };
}
```

### 9.5 Legal Validity in UAE

Digital signatures generated through Quill/DocuSign are legally valid in the UAE under:

- **Federal Law No. 1 of 2006** on Electronic Commerce and Transactions (Electronic Transactions Law)
- **Cabinet Resolution No. 21 of 2021** on Electronic Notarization
- **RERA Circular 2021-04** permitting e-signatures on brokerage agreements and MOU documents
- **Ejari Online System** accepts electronically signed tenancy contracts for registration

**Limitations:** The following documents still require wet (physical) signatures per UAE law:
- Property Transfer Deeds at DLD (must be signed in person at DLD service center)
- Notarized Powers of Attorney
- Wills and inheritance documents

---

## 10. Bilingual Document Specification

### 10.1 Document Structure

Bilingual contracts use a two-column layout:

```
┌─────────────────────────────────────────────────────────────────────┐
│                     WHITE CAVES REAL ESTATE LLC                     │
│           مجموعة وايت كيفز للعقارات ذ.م.م                          │
├─────────────────────────────────┬───────────────────────────────────┤
│   ENGLISH (LEFT COLUMN)         │           (RIGHT COLUMN) العربية  │
│   Direction: LTR                │           Direction: RTL          │
│   Font: Source Sans Pro 10pt    │   الخط: Noto Naskh Arabic 10pt    │
│                                 │                                   │
│   1. PARTIES TO THIS           │   ١. أطراف هذه الاتفاقية          │
│   AGREEMENT                    │                                   │
│   This Memorandum of           │   يُبرم هذا الاتفاق المبدئي       │
│   Understanding is entered     │   بين الأطراف التالية...          │
│   into between...              │                                   │
├─────────────────────────────────┴───────────────────────────────────┤
│   SIGNATURE BLOCK (spans full width, bilingual)                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2 RTL/LTR Mixed Rendering Challenges & Solutions

| Challenge | Problem | Solution |
|-----------|---------|---------|
| **Column layout in PDF** | CSS columns break with mixed RTL/LTR | Use CSS Grid with explicit `direction` per column; each column is a separate `<div>` |
| **Arabic numerals** | Arabic-Indic vs. Western numerals in same doc | Force Western numerals in Arabic column using `font-variant-numeric: normal` + explicit Unicode override |
| **Table alignment** | Tables render reversed in RTL | Duplicate table structure; Arabic column has `dir="rtl"` wrapper with `text-align: right` on all `<td>` |
| **Paragraph numbering** | Arabic numbering system (١، ٢، ٣) | Use CSS `list-style-type: arabic-indic` for Arabic column clause numbering |
| **Hyphenation** | Arabic text cannot be hyphenated | Set `hyphens: none; word-break: break-word` on Arabic paragraphs |
| **Puppeteer font fallback** | Puppeteer may fall back to system fonts | Pre-load all fonts via `@font-face` with `font-display: block` before rendering |
| **Page breaks** | Clause must not split across pages | Use `page-break-inside: avoid` on all clause `<div>` elements |

### 10.3 Legal Preference Clause

All bilingual contracts include the following clause in both languages at the top of the document:

```
ENGLISH: "In the event of any conflict, ambiguity, or inconsistency between the English
and Arabic versions of this Agreement, the English version shall prevail and govern."

ARABIC: "في حال وجود أي تعارض أو غموض أو تناقض بين النسختين الإنجليزية والعربية من هذه
الاتفاقية، تسود النسخة الإنجليزية وتطبق أحكامها."
```

### 10.4 Translation Process

- **Machine translation:** DeepL API used for initial translation of new template sections
- **Human review:** All new Arabic translations reviewed by a UAE-licensed legal translator before template activation
- **Certification:** Templates used for RERA-submitted documents must have translations certified by a UAE Ministry of Justice–approved translator
- **Update sync:** When English template is updated, Arabic translation is flagged as "needs review" until manually re-approved

---

## 11. Version Control & Audit

### 11.1 Template Versioning (Semantic Versioning)

Templates follow semver (`MAJOR.MINOR.PATCH`):

| Version Component | When Bumped | Example |
|------------------|-------------|---------|
| **MAJOR** | RERA regulation change requiring clause restructure; new DLD requirement; legal framework change | `1.0.0` → `2.0.0` |
| **MINOR** | New optional clause added; new conditional section; new variable added | `1.2.0` → `1.3.0` |
| **PATCH** | Typo fix; formatting correction; translation improvement | `1.2.3` → `1.2.4` |

### 11.2 Version Bump Triggers

| Trigger | Version Bump | Approval Required |
|---------|-------------|------------------|
| RERA regulation change published | MAJOR | MD + Compliance Officer |
| DLD form update (new fields) | MAJOR or MINOR | MD + Compliance Officer |
| UAE Federal Law amendment | MAJOR | MD + Compliance Officer + External Counsel |
| New property type support | MINOR | Head of Operations |
| New conditional section | MINOR | Head of Operations |
| Translation correction | PATCH | Compliance Officer only |
| Formatting/styling update | PATCH | Lead Engineer |
| Typo fix | PATCH | Any admin |

### 11.3 Approval Workflow for Template Changes

```
Developer / Legal team proposes template change
              ↓
Change submitted to DocumentTemplate staging environment
              ↓
System generates diff showing all changed clauses (highlighted)
              ↓
Compliance Officer reviews diff (48h window)
              ↓
For MAJOR versions: MD also reviews (additional 24h)
              ↓
Approval → version bumped → template activated in production
Rejection → change discarded + comments returned to requester
              ↓
Notification sent to all agents: "Template {name} updated to v{version}"
```

### 11.4 Retention of Old Versions

```prisma
model DocumentTemplateVersion {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  templateId   String   @db.ObjectId
  version      String   // semver string e.g. "2.1.0"
  content      String   // Full template content snapshot
  variables    Json
  conditions   Json
  changedBy    String   @db.ObjectId
  approvedBy   String   @db.ObjectId
  changeReason String   // Required justification
  regulatoryRef String? // e.g., "RERA Circular 2026-07"
  createdAt    DateTime @default(now())

  @@index([templateId, version])
}
```

- **Retention policy:** All template versions retained indefinitely (no deletion permitted)
- **Rollback:** Any previously approved version can be reactivated by Compliance Officer
- **Legal requirement:** UAE records retention law requires 5-year minimum retention of contract templates

### 11.5 RERA Audit Trail Requirements

For RERA compliance audits, the following is automatically exportable per document:

| Audit Field | Source | Format |
|-------------|--------|--------|
| Document generation timestamp | `GeneratedDocument.createdAt` | ISO 8601 |
| Template version used | `DocumentTemplate.version` at time of generation | Semver string |
| Who generated the document | `GeneratedDocument.generatedBy` → `Agent.name` + `Agent.reraRegistrationNumber` | Name + BRN |
| Data values at generation time | `GeneratedDocument.data` | JSON snapshot |
| Signature timestamps | DocuSign envelope events | ISO 8601 per signer |
| Document storage URL | `GeneratedDocument.fileUrl` | S3 URL |
| Any amendments post-generation | `DocumentAmendment` collection | JSON diff |

RERA audit export is available at `GET /api/documents/audit/rera-export?from={date}&to={date}` returning a ZIP file containing all documents and their metadata.

---

## 12. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Document generation time | <30 seconds | From request to PDF ready |
| Compliance error rate | <1% | Documents flagged post-generation |
| Agent time saved | 2 hours/document → 5 minutes | Time tracking before/after |
| Template coverage | 20+ templates | Count of active templates |
| E-signature turnaround | <24 hours | Time from send to signed |

---

## Sources

- [AI Document Generation in Real Estate](https://www.orris.ai/blog/ai-automation-for-real-estate-practical-guide)
- [RERA Document Requirements](https://www.rera.gov.ae)
- [Ejari Contract Standards](https://www.ejari.ae)
- [DocuSign API](https://developers.docusign.com/)
- [UAE Electronic Transactions Law No. 1 of 2006](https://u.ae/en/information-and-services/justice-safety-and-the-law/electronic-transactions-and-laws)
- [Puppeteer PDF Generation](https://pptr.dev/)
- [Noto Naskh Arabic Font](https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic)
