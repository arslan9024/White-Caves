# Henry — Document Hub Manager (The Record Keeper)

> **Department:** Legal  
> **ID:** `henry`  
> **Title:** Document Hub Manager & Compliance Engine  
> **Color:** #7C3AED (Violet)  
> **Avatar:** 📄  
> **Status:** Production-Ready  
> **Dashboard URL:** `/owner/dashboard?tab=henry`

---

## Overview

**Henry is the centralised document and compliance hub** for White Caves Real Estate LLC. He manages the full lifecycle of legal documents — from upload and OCR extraction through RERA/DLD compliance checking to immutable audit records — all calibrated for Dubai's regulatory framework.

**Core Role**:
- ✅ Archive PDF documents (tenancy agreements, title deeds, Ejari certificates, NOCs, SPAs)
- ✅ Run RERA/DLD compliance checks against Dubai-specific rule sets
- ✅ Extract structured data from Emirates ID cards via Ollama OCR
- ✅ AI field extraction from unstructured documents via Groq
- ✅ Maintain an immutable HenryRecord audit trail in PostgreSQL (Prisma)
- ✅ Serve secure file downloads with path-traversal protection

**Key differentiator**: Henry bridges the gap between raw PDF uploads and structured, compliance-verified records — no manual re-keying of data from scanned documents.

---

## Core Responsibilities

### 1. Document Archive Management
- Upload, index, and serve PDFs with secure path validation
- Tag records by type: `tenancy_agreement`, `title_deed`, `ejari`, `noc`, `spa`, `emirates_id`, `other`
- Full-text search across record metadata (title, description, tags)
- Pagination (default 20 per page) with total count
- Soft status tracking: `active` | `archived` | `pending_review`

### 2. RERA / DLD Compliance Engine
- **Template-level rule sets**: Validates required clauses per document type
- **Field checks**: Rent amount caps (RERA rental index), party identification, DLD permit numbers
- **Violation reporting**: Returns rule ID, severity (`critical` / `warning`), description, and suggested fix
- **Compliance summary**: Available rule counts by template for dashboard KPIs

### 3. Emirates ID OCR (Ollama)
- Accepts base64 image of Emirates ID
- Sends to local Ollama instance (vision model)
- Returns structured JSON: `name`, `id_number`, `nationality`, `expiry_date`, `dob`
- Gracefully falls back with error message if Ollama unavailable

### 4. AI Field Extraction (Groq)
- Accepts raw document text
- Uses Groq LLM to extract structured fields matching the target document type
- Returns JSON with confidence scores
- Used for onboarding landlord/tenant documents without manual data entry

### 5. Audit Trail (HenryRecord)
- Every record operation (create, update, delete) is appended to `HenryRecord` in PostgreSQL
- Fields: `id`, `title`, `description`, `filePath`, `fileType`, `tags[]`, `status`, `metadata JSON`, `createdAt`, `updatedAt`
- Write-once enforcement at application layer; deletions are soft-logged before hard delete

---

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| **GET** | `/api/henry/health` | None | Service health check |
| **GET** | `/api/henry/records` | JWT | List/search archived records |
| **POST** | `/api/henry/records` | JWT | Create new record index entry |
| **GET** | `/api/henry/records/file` | JWT | Download stored PDF (`?path=...`) |
| **POST** | `/api/henry/records/file` | JWT | Upload & archive a PDF |
| **DELETE** | `/api/henry/records/:id` | JWT | Delete a record entry |
| **POST** | `/api/henry/compliance/check` | JWT | Run RERA/DLD compliance check |
| **GET** | `/api/henry/compliance/summary` | JWT | Rule counts by template |
| **POST** | `/api/henry/ocr/emirates-id` | JWT | OCR Emirates ID via Ollama |
| **POST** | `/api/henry/ai/extract` | JWT | AI field extraction via Groq |

### Query Parameters — GET /api/henry/records
| Param | Default | Description |
|-------|---------|-------------|
| `page` | 1 | Page number |
| `limit` | 20 | Records per page (max 100) |
| `search` | — | Full-text search on title/description/tags |
| `type` | — | Filter by document type |
| `status` | — | Filter by status (active / archived / pending_review) |

---

## Data Model (Prisma)

```prisma
model HenryRecord {
  id          String   @id @default(cuid())
  title       String
  description String?
  filePath    String?
  fileType    String?  // tenancy_agreement | title_deed | ejari | noc | spa | emirates_id | other
  tags        String[]
  status      String   @default("active")  // active | archived | pending_review
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## Compliance Engine Rules (Dubai-Specific)

### Tenancy Agreement Rules
| Rule ID | Severity | Check |
|---------|----------|-------|
| `TA-001` | Critical | Ejari registration number present |
| `TA-002` | Critical | RERA form number (Form A / B / I) referenced |
| `TA-003` | Warning | Rent amount within RERA rental index ±20% |
| `TA-004` | Warning | PDC cheque schedule matches contracted term |
| `TA-005` | Critical | Landlord Emirates ID / trade licence attached |
| `TA-006` | Critical | Tenant Emirates ID attached |
| `TA-007` | Warning | Security deposit ≤ 5% annual rent |
| `TA-008` | Warning | Notice period clause (90 days per RERA) present |

### Title Deed / SPA Rules
| Rule ID | Severity | Check |
|---------|----------|-------|
| `TD-001` | Critical | DLD permit number present |
| `TD-002` | Critical | Oqood registration reference (off-plan) |
| `TD-003` | Warning | Transfer fee acknowledgement (4% DLD) |
| `SPA-001` | Critical | Escrow account details present (Law No. 8/2007) |
| `SPA-002` | Warning | Payment milestone schedule attached |

### NOC Rules
| Rule ID | Severity | Check |
|---------|----------|-------|
| `NOC-001` | Critical | Developer name and project match title deed |
| `NOC-002` | Warning | NOC validity date not expired |

---

## Data Flows

### Inbound
← **Laila** (Compliance Officer): Flags documents for review  
← **Victoria** (Contracts): Sends signed tenancy agreements for archiving  
← **Daisy** (Leasing Manager): Submits Ejari certificates post-registration  
← **Agent Upload**: Direct PDF upload via `/api/henry/records/file`

### Outbound
→ **Laila**: Compliance check results for regulatory review  
→ **Zoe** (Executive Assistant): Audit summary for ownership reporting  
→ **Aurora** (CTO): System health metrics via `/api/henry/health`  
→ **PostgreSQL (HenryRecord)**: All record operations persisted

---

## Access Control (RBAC)

| Role | View Records | Upload | Compliance Check | Delete |
|------|-------------|--------|-----------------|--------|
| **Owner** | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Sales Manager** | ✅ | ✅ | ✅ | ❌ |
| **Agent** | Own only | Own only | ❌ | ❌ |
| **Tenant / Landlord** | Own lease docs only | ❌ | ❌ | ❌ |

Enforced via `requireMinRole` / `requirePermission` from `server/middleware/rbac.ts`.

---

## Frontend Integration

**Component**: `src/features/henry/HenryDocumentHub.tsx`  
**CRM Module Key**: `'henry'` (registered in `CRM_MODULES`)  
**Dashboard URL**: `/owner/dashboard?tab=henry`

### UI Panels
1. **Document Library** — searchable, paginated table of HenryRecords with download links
2. **Upload & Archive** — drag-and-drop PDF upload with type tagging
3. **Compliance Checker** — paste/upload document → get violation report
4. **OCR Panel** — upload Emirates ID image → structured JSON output
5. **AI Extraction** — paste raw text → extracted fields form auto-fill

---

## Configuration

```bash
# Henry service
HENRY_UPLOAD_DIR=./uploads/henry         # Secure PDF storage directory
HENRY_MAX_FILE_SIZE_MB=25                # Per-upload limit

# OCR via Ollama (local vision model)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_VISION_MODEL=llava:13b

# AI field extraction via Groq
GROQ_API_KEY=...
GROQ_MODEL=llama-3.1-70b-versatile

# PostgreSQL (via Prisma)
DATABASE_URL=postgresql://...
```

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| PDF upload + index | < 3 seconds | 25 MB max |
| Compliance check | < 2 seconds | Rule evaluation only |
| OCR (Emirates ID) | < 10 seconds | Ollama local inference |
| AI field extraction | < 5 seconds | Groq API |
| Record list query | < 500 ms | Paginated, indexed |

---

## Example: Compliance Check Request

```json
POST /api/henry/compliance/check
{
  "documentText": "TENANCY CONTRACT\nEjari Ref: EJ-2024-...\nAnnual Rent: AED 85,000...",
  "documentType": "tenancy_agreement"
}

Response:
{
  "passed": false,
  "violations": [
    {
      "ruleId": "TA-005",
      "severity": "critical",
      "description": "Landlord Emirates ID or trade licence not found",
      "suggestion": "Attach a copy of landlord Emirates ID (front and back) or trade licence"
    }
  ],
  "warnings": [
    {
      "ruleId": "TA-003",
      "severity": "warning",
      "description": "Rent AED 85,000 is 18% above RERA index for this area",
      "suggestion": "Verify tenant has signed rent increase acknowledgement"
    }
  ],
  "checkedAt": "2026-05-09T12:00:00.000Z"
}
```

---

## Integration with Other Assistants

| Assistant | Relationship |
|-----------|-------------|
| **Laila** | Receives compliance flags; sends approved docs to Henry for archive |
| **Daisy** | Sends Ejari certificates and leases after signing |
| **Victoria** | Sends generated contracts for archival post-signature |
| **Zoe** | Pulls compliance summary for weekly executive report |
| **Aurora** | Monitors `/api/henry/health` in system health dashboard |

---

## Security & Compliance

- ✅ **Path traversal protection**: `filePath` validated against `HENRY_UPLOAD_DIR` before file serve
- ✅ **JWT-gated endpoints**: All write and read operations require valid JWT
- ✅ **RBAC enforcement**: Role hierarchy checked per operation
- ✅ **Audit trail**: All create/update/delete operations logged in `HenryRecord`
- ✅ **RERA compliance**: Rule set aligned with RERA 2024 regulatory requirements
- ✅ **Data retention**: Records with `status: archived` retained for 7 years (UAE Commercial Transactions Law)

---

## Future Enhancements

- [ ] Automatic Ejari number validation via DLD REST API
- [ ] E-signature workflow integration (DocuSign / Adobe Sign)
- [ ] Bulk PDF import from Google Drive / SharePoint
- [ ] RERA rental index live feed integration
- [ ] WhatsApp document delivery via Linda
- [ ] Arabic OCR support for Arabic Emirates IDs
