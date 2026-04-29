# 24 — Rex · Regulatory Document Verifier

> **ID:** `rex`  
> **Department:** Compliance  
> **Title:** Regulatory Document Verifier  
> **Color:** `#B45309` (Brown/Amber)  
> **Avatar:** 🔍  
> **Phase:** Phase 6 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Compliance Officer, Agent (submit only)

---

## 1. Overview

Rex is a **specialist document verification engine** for UAE regulatory documents. Where Laila handles the KYC workflow and AML screening, Rex focuses on verifying the authenticity and validity of real estate-specific documents: RERA permits, Ejari contracts, title deeds, NOCs, DLD receipts, and Form F/MoU templates. Rex reduces fraud risk and ensures every document accepted by White Caves is valid before it is processed.

---

## 2. Core Responsibilities

1. Verify RERA permit numbers against the official DLD portal
2. Verify Ejari contract numbers and their registration status
3. Validate title deed authenticity (DLD reference check)
4. Check Form F and MoU formats against RERA-approved templates
5. OCR-extract data from uploaded documents (auto-populate CRM fields)
6. Maintain a fraud indicator log: suspicious documents, duplicate permit numbers

---

## 3. Capabilities

| Capability | Description |
|---|---|
| RERA permit verification | Check permit against DLD Trakheesi portal API |
| Ejari verification | Check Ejari number against RERA's Ejari system |
| Title deed verification | DLD title deed reference number validation |
| OCR extraction | Extract text from uploaded PDFs/images: name, number, dates, amounts |
| Auto-fill CRM | Extracted data pre-fills property or client forms |
| Fraud indicator | Flag: duplicate permit on different properties, expired documents submitted as current |
| Format checker | Validate Form F against standard RERA format (required fields present) |
| Batch verification | Upload multiple permits and verify in one job |
| Verification log | Immutable log of every verification result (when, by whom, outcome) |

---

## 4. How It Works — End to End

### Step 1 — Document Upload
Agent or Laila uploads a regulatory document → `POST /api/rex/verify { documentId, type: 'rera_permit' | 'ejari' | 'title_deed' | 'form_f' }`.

### Step 2 — OCR Extraction
`RexService.ocr(document)` → uses Tesseract.js (or AWS Textract for PDFs) → extracts text fields → identifies: document type, reference number, issue date, expiry date, parties, property details.

### Step 3 — External Verification
For RERA permits: `RexService.verifyRERA(permitNumber)` → GET request to DLD Trakheesi portal (or scraper if no API available) → confirms: property address, agent/agency name, permit validity.

For Ejari: `RexService.verifyEjari(ejariNumber)` → RERA Ejari portal check.

For title deeds: match extracted reference number against DLD title deed registry.

### Step 4 — Result Evaluation
Responses mapped to: `{ status: 'valid' | 'invalid' | 'expired' | 'not_found' | 'mismatch', details: {...} }`.

`mismatch` = document text says Permit #X but DLD says that permit belongs to a different property → fraud indicator flagged.

### Step 5 — CRM Auto-Fill
If `status = 'valid'`: extracted + verified data auto-fills CRM fields: `property.permitNumber`, `property.permitExpiryDate`, `lease.ejariContractNumber`, etc. Agent reviews and confirms.

### Step 6 — Fraud Flagging
If duplicate permit number detected (same permit on 2 different properties in the system) → `POST /api/fraud-indicators` → alert to Laila + MD. Property status set to `under_review` pending resolution.

### Step 7 — Verification Log
All verification events stored: `{ documentId, type, verifiedAt, verifiedBy, result, details }`. Henry picks these up for the audit trail.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/rex/verify` | Submit document for verification |
| GET | `/api/rex/results/:documentId` | Get verification result |
| GET | `/api/rex/log` | Verification audit log |
| GET | `/api/rex/fraud-indicators` | List fraud indicators |
| POST | `/api/rex/batch` | Batch verify multiple documents |
| POST | `/api/rex/ocr` | OCR-only extraction (no external verification) |

---

## 6. Data Flows

- **Receives from:** Laila (KYC documents), Mary (property permits), Daisy (Ejari contracts), Agents (manual uploads)
- **Sends to:** Laila (verification results), Mary (auto-fill permit fields), Daisy (auto-fill Ejari fields), Henry (audit log), Fraud alerts → MD and Laila

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Rex CRM dashboard | `src/components/owner/ai/RexCRM/` | 🔲 Planned |
| Document upload + verify | Drag-drop with result badge | 🔲 Planned |
| Fraud indicator panel | Inside dashboard | 🔲 Planned |
| Verification log table | Inside dashboard | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| RexService | `server/services/RexService.ts` | 🔲 Planned |
| OCR integration | Tesseract.js or AWS Textract | 🔲 Planned |
| DLD Trakheesi client | `server/integrations/TrakheesiClient.ts` | 🔲 Planned |
| Ejari client | `server/integrations/EjariClient.ts` | 🔲 Planned |
| Fraud indicators | `server/routes/rex.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full access + fraud alerts |
| `compliance_officer` | Full verification and log |
| `agent` | Submit documents; read own results |

---

## 10. Implementation Checklist

- [ ] Register `rex` in `AI_ASSISTANTS_REGISTRY`
- [ ] `RexService` with OCR extraction
- [ ] DLD Trakheesi API integration (or scraper fallback)
- [ ] RERA Ejari verification
- [ ] Title deed reference validator
- [ ] CRM auto-fill on verification success
- [ ] Fraud duplicate detection
- [ ] Verification log (Henry-linked)
- [ ] Batch verification endpoint
- [ ] Tests: `RexService.test.ts`

---

## 11. Dependencies

- `tesseract.js` npm package (or AWS Textract — external)
- DLD Trakheesi portal API (external — may require partnership)
- RERA Ejari API (external)
- Laila (document workflow)
- Henry (audit log)

---

## 12. Future Enhancements

- AI-powered forgery detection (image manipulation analysis)
- Real-time DLD blockchain record lookup (when DLD implements it)
- Cross-check property on multiple listing portals for fraud patterns
- International document verification (for overseas buyer passports)
