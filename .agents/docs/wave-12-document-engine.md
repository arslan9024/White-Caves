# Wave 12 — Document Engine: PDF/Excel Generation Contracts

**Drafted by:** @Puppeteer  
**Model:** DeepSeek V3  
**Status:** ✅ READY (retrospective spec for implemented Wave 12)  
**Last Updated:** 2026-05-25  

CONSUMES←@Handlebars: `business_docs/09_crm_features/wave-12-email-wiring.md#template-variables`  
FEEDS→@Mira: `server/services/DocumentService.ts`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-12-document-engine.md`

---

## 1. Overview

The Document Engine provides on-demand PDF and Excel generation for the White Caves CRM, backed by `DocumentService` (`server/services/DocumentService.ts`). It supports contract summaries, lease reports, commission reports, financial P&L exports, and lead list exports.

---

## 2. DocumentService API Contract

### 2.1 Common Return Type

```typescript
interface GeneratedFile {
  buffer: Buffer;    // raw file bytes
  mimeType: string;  // e.g. 'application/pdf'
  filename: string;  // e.g. 'contract-WC-2024-001.pdf'
}
```

### 2.2 Methods

| Method | Input | Output | Library |
|--------|-------|--------|---------|
| `generateContractPdf(contractId)` | `string` | `GeneratedFile` (PDF) | `pdf-lib` |
| `generateLeaseReportPdf(leaseId)` | `string` | `GeneratedFile` (PDF) | `pdf-lib` |
| `generateCommissionReportPdf(filters)` | `CommissionReportFilters` | `GeneratedFile` (PDF) | `pdf-lib` |
| `generateFinancialPLReport(filters)` | `FinancialPLFilters` | `GeneratedFile` (PDF) | `pdf-lib` |
| `generateLeadsExcel(filters)` | `LeadExportFilters` | `GeneratedFile` (XLSX) | `exceljs` |
| `generateCommissionReportExcel(filters)` | `CommissionReportFilters` | `GeneratedFile` (XLSX) | `exceljs` |

---

## 3. Document Definitions

### 3.1 Contract PDF (`generateContractPdf`)

**Fields rendered:**
- Contract Number
- Title
- Type (`sale` / `lease` / `mou` / `spa`)
- Status
- Value (AED)
- Start Date / End Date
- Created At

**MIME type:** `application/pdf`  
**Filename pattern:** `contract-{contractNumber}.pdf`

---

### 3.2 Lease Report PDF (`generateLeaseReportPdf`)

**Fields rendered:**
- Lease Reference
- Tenant name
- Landlord name
- Property address
- Monthly rent (AED)
- Lease term (start → end)
- Status
- Next payment due date
- Outstanding balance

**MIME type:** `application/pdf`  
**Filename pattern:** `lease-{leaseRef}.pdf`

---

### 3.3 Commission Report PDF (`generateCommissionReportPdf`)

**Filter inputs:**
```typescript
interface CommissionReportFilters {
  agentId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: 'pending' | 'approved' | 'paid';
}
```

**Fields rendered:**
- Agent name
- Deal reference
- Commission amount (AED)
- Status
- Date earned

**MIME type:** `application/pdf`  
**Filename pattern:** `commission-report-{YYYY-MM}.pdf`

---

### 3.4 Financial P&L Report PDF (`generateFinancialPLReport`)

**Filter inputs:**
```typescript
interface FinancialPLFilters {
  startDate: Date;
  endDate: Date;
  currency?: string;  // default 'AED'
}
```

**Fields rendered:**
- Total Revenue (AED)
- Total Commissions Paid
- Operating Expenses
- Net Profit / Loss
- Monthly breakdown table

**MIME type:** `application/pdf`  
**Filename pattern:** `pl-report-{YYYY-MM-start}_{YYYY-MM-end}.pdf`

---

### 3.5 Leads Excel Export (`generateLeadsExcel`)

**Filter inputs:**
```typescript
interface LeadExportFilters {
  status?: string[];
  assignedAgentId?: string;
  source?: string;
  createdFrom?: Date;
  createdTo?: Date;
}
```

**Columns (in order):**
`Name | Email | Phone | Status | Source | Assigned Agent | Budget (AED) | Area Preference | Created At | Last Activity`

**MIME type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`  
**Filename pattern:** `leads-export-{YYYY-MM-DD}.xlsx`

---

### 3.6 Commission Report Excel (`generateCommissionReportExcel`)

Mirrors the PDF version but as a structured spreadsheet with a summary row at the bottom.

**Filename pattern:** `commission-report-{YYYY-MM}.xlsx`

---

## 4. HTTP Routes

All routes are registered under `/api/documents` (or `/api/v1/documents` via the versioning middleware).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/documents/contracts/:id/pdf` | `agent` | Download contract PDF |
| `GET` | `/api/documents/leases/:id/pdf` | `agent` | Download lease report PDF |
| `GET` | `/api/documents/commissions/pdf` | `manager` | Commission report PDF |
| `GET` | `/api/documents/financial/pl/pdf` | `admin` | P&L report PDF |
| `GET` | `/api/documents/leads/excel` | `manager` | Leads export XLSX |
| `GET` | `/api/documents/commissions/excel` | `manager` | Commission report XLSX |

**Response headers for all download routes:**
```
Content-Type: {mimeType}
Content-Disposition: attachment; filename="{filename}"
Content-Length: {buffer.byteLength}
```

---

## 5. Rendering Pipeline

```
HTTP request
  → RBAC middleware (role check)
  → Route handler
  → DocumentService method
     → Prisma query (fetch entity data)
     → pdf-lib / exceljs render
     → return GeneratedFile { buffer, mimeType, filename }
  → res.setHeader + res.send(buffer)
```

---

## 6. Library Selection

| Library | Version | Purpose |
|---------|---------|---------|
| `pdf-lib` | `^1.17` | PDF creation — no headless browser needed, pure JS |
| `exceljs` | `^4.x` | XLSX generation with formatted tables and styling |

> **Note:** `pdf-lib` was chosen over Puppeteer/Playwright for server-side PDF generation to avoid launching a headless browser in production. For complex HTML-to-PDF requirements, `Puppeteer` may be introduced in a future wave.

---

## 7. Acceptance Criteria

- [x] `generateContractPdf` returns valid PDF buffer for any contract ID
- [x] `generateLeadsExcel` produces valid XLSX with correct column headers
- [x] `generateFinancialPLReport` includes monthly breakdown rows
- [x] All routes enforce RBAC (managers can download; agents limited to own entity PDFs)
- [x] `Content-Disposition: attachment` header triggers browser download
- [x] Missing entity throws descriptive error (not a 500)
