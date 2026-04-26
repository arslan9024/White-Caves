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

## 6. Success Metrics

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
