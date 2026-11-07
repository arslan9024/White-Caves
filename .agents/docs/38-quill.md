# 38 — Quill · Document Generator Engine

> **ID:** `quill`  
> **Department:** AI Engine / Operations  
> **Title:** Automated Document Generator  
> **Color:** `#6366F1` (Indigo)  
> **Avatar:** ✍️  
> **Phase:** Phase 3 (High Priority)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** All agents (generate), Managing Director (template management)

---

## 1. Overview

Quill is the **document generation engine** for White Caves. She automatically produces Dubai-compliant real estate documents — Memorandum of Understanding (MoU), Form F, NOC letters, commission invoices, tenancy agreements, snagging reports, quarterly financial statements, and compliance audit reports — by auto-populating Handlebars templates with live CRM data. Quill eliminates manual document preparation and ensures every document is legally correct and professionally branded.

---

## 2. Core Responsibilities

1. Generate MoU, Form F, SPA cover sheets, and NOC letters for transactions
2. Generate commission invoices for agents (branded, VAT-compliant)
3. Generate tenancy agreements from Daisy's lease records
4. Generate snagging reports from Vesta's defect lists
5. Generate PDF financial reports for Theodora
6. Generate compliance audit reports for Laila
7. Maintain the master template library with version control

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Template library | 16+ document templates; each versioned, named, and categorised |
| Data auto-population | Templates receive CRM data: client name, property, prices, dates, permit numbers |
| PDF generation | Puppeteer renders HTML template to PDF with full styling |
| DOCX output | Handlebars + docxtemplater for editable Word documents |
| Preview mode | Render template with sample data before generating final doc |
| Digital signature placeholder | Signature boxes placed correctly for DLD-required signatories |
| Watermark support | Add "DRAFT" watermark to previews; remove for final |
| Document versioning | Each generated document stored with timestamp, generated-by, related entity |
| Branded output | White Caves letterhead, logo, gold accent colours on all documents |
| WhatsApp delivery | Generated PDF sent directly via Nadia to client/agent |

---

## 4. How It Works — End to End

### Step 1 — Document Request
Any assistant or agent calls `QuillService.generate(request)`:
```typescript
interface GenerationRequest {
  templateId: string;       // e.g., 'mou', 'form_f', 'commission_invoice'
  entityId: string;         // lead/deal/lease/commission ID
  entityType: string;
  requestedBy: string;      // agentId
  deliverTo?: 'download' | 'whatsapp' | 'email';
  recipientPhone?: string;
}
```

### Step 2 — Data Assembly
`QuillService.assembleData(entityType, entityId)`:
- Fetch entity from relevant service (e.g., `GET /api/deals/:id` for Form F)
- Join related data: client profile, property details, agent info, company info
- Returns a flat data object matching template variable names

### Step 3 — Template Rendering
Template loaded from template store (`.hbs` file) → `Handlebars.compile(template)(data)` → produces HTML string with all variables replaced.

### Step 4 — PDF Generation
`QuillService.htmlToPDF(html)` → Puppeteer:
- Launch browser in headless mode
- Set page HTML
- Set options: A4 size, margins, header/footer
- Call `page.pdf()` → returns Buffer

### Step 5 — Storage
PDF saved to Cloudinary (or local storage in dev): `documents/{entityType}/{entityId}/{templateId}-{timestamp}.pdf`. Document record created in `Document` model: `{ entityId, entityType, type, url, generatedAt, generatedBy }`.

### Step 6 — Delivery
Based on `deliverTo`:
- `download` → return signed URL for browser download
- `whatsapp` → Nadia `POST /api/whatsapp/messages { type: 'document', url, caption: 'Your [Doc Type] is ready' }`
- `email` → `POST /api/email/send { to, subject, attachment: url }`

### Step 7 — Template Management
Owner/admin can: upload new `.hbs` template, test it with sample data, version it, activate/deactivate. `GET /api/quill/templates` lists all; `POST /api/quill/templates` uploads new.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/quill/generate` | Generate a document |
| GET | `/api/quill/preview/:templateId` | Preview template with sample data |
| GET | `/api/quill/documents` | List generated documents |
| GET | `/api/quill/documents/:id` | Get document details + download URL |
| GET | `/api/quill/templates` | List all document templates |
| POST | `/api/quill/templates` | Upload new template |
| PATCH | `/api/quill/templates/:id` | Update template |
| DELETE | `/api/quill/templates/:id` | Deactivate template |

---

## 6. Data Flows

- **Receives from:** All assistants that need document generation (Sophia, Daisy, Theodora, Laila, Vesta, Evangeline)
- **Sends to:** Nadia (WhatsApp document delivery), Email service, Document store

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Quill engine dashboard | `src/components/owner/ai/QuillCRM/` | 🔲 Planned |
| Document history | Per-entity document list | 🔲 Planned |
| Template preview UI | Test template with sample data | 🔲 Planned |
| "Generate Document" button | On deal/lease/lead detail pages | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| QuillService | `server/services/QuillService.ts` | 🔲 Planned |
| Template store | `server/templates/*.hbs` files | 🔲 Planned |
| Document model | Prisma `Document` | ✅ Exists in schema (check) |
| PDF renderer | Puppeteer | 🔲 Planned (`npm install puppeteer`) |

---

## 9. Templates Required

| Template | Description | Status |
|---|---|---|
| `mou` | Memorandum of Understanding | 🔲 |
| `form_f` | RERA Form F (Agency Agreement) | 🔲 |
| `commission_invoice` | Agent commission invoice (VAT) | 🔲 |
| `tenancy_agreement` | Standard UAE tenancy agreement | 🔲 |
| `noc_letter` | No Objection Certificate | 🔲 |
| `snagging_report` | Defect inspection report | 🔲 |
| `rera_compliance` | Monthly RERA compliance report | 🔲 |
| `financial_pnl` | Monthly P&L statement | 🔲 |

---

## 10. Access Control

| Role | Access |
|---|---|
| `managing_director` | Template management + all docs |
| `agent` | Generate for assigned entities |
| Client | Receive their documents (read-only) |

---

## 11. Implementation Checklist

- [ ] Register `quill` in `AI_ASSISTANTS_REGISTRY`
- [ ] `QuillService.generate()` endpoint
- [ ] Puppeteer PDF generation
- [ ] Handlebars template engine
- [ ] Template store (`.hbs` files in `server/templates/`)
- [ ] Document model in Prisma
- [ ] 8 core templates (MoU, Form F, Commission Invoice, Tenancy, NOC, Snagging, Compliance, P&L)
- [ ] WhatsApp delivery via Nadia
- [ ] Template management API
- [ ] Tests: `QuillService.test.ts`

---

## 12. Dependencies

- `puppeteer` npm package (PDF generation)
- `handlebars` npm package (templates)
- Cloudinary (document storage — Phase 6)
- Nadia (WhatsApp document delivery)

---

## 13. Future Enhancements

- E-signature integration (DocuSign or Adobe Sign)
- DLD-formatted RERA submission PDFs
- Arabic document generation (Mira translation)
- AI-generated custom contract clauses (Evangeline)
