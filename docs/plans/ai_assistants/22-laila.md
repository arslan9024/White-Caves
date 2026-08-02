# 22 — Laila · Compliance Officer (KYC/AML/RERA)

> **ID:** `laila`  
> **Department:** Compliance  
> **Title:** Compliance Officer — KYC / AML / RERA / PDPL  
> **Color:** `#6366F1` (Indigo)  
> **Avatar:** 👩‍⚖️  
> **Phase:** Phase 3 (Active) / Phase 6 (Full)  
> **Status:** ✅ In Code — `src/components/owner/ai/LailaComplianceCRM_NEW/`  
> **Access:** Managing Director, Compliance Officer

---

## 1. Overview

Laila is White Caves' **regulatory compliance guardian**. She ensures the company operates in full compliance with UAE law: RERA (Real Estate Regulatory Agency) property permit requirements, KYC (Know Your Customer) client verification, AML (Anti-Money Laundering) screening, and PDPL (Personal Data Protection Law) data governance. She proactively surfaces compliance risks before they become violations.

---

## 2. Core Responsibilities

1. RERA permit tracking: every listed property must have a valid permit; auto-block if expired
2. KYC workflow: collect and verify client identity documents (passport, Emirates ID, proof of funds)
3. AML screening: screen clients against PEP/Sanctions lists via ComplyAdvantage API
4. PDPL: consent management, data access requests, right to deletion
5. Compliance audit log: every significant action timestamped and logged
6. Risk dashboard: red/amber/green status per client, per property, per transaction

---

## 3. Capabilities

| Capability | Description |
|---|---|
| RERA permit register | All properties + permit numbers + expiry dates; block if expired or missing |
| KYC workflow | Upload → review → verify/reject with reason → re-request if needed |
| AML screening | Auto-screen on client creation; manual re-screen available |
| PEP/Sanctions match | Flag matches for SAR (Suspicious Activity Report) if match found |
| Risk rating | Low / Medium / High / Unacceptable risk per client |
| PDPL consent log | Consent checkbox record per form submission: userId, date, version, IP |
| Data export (GDPR-like) | Export all data held for a user on request |
| Account deletion | Process right-to-erasure requests (anonymise data) |
| Compliance reports | Monthly RERA, KYC, AML status report |
| Permit expiry alerts | 30-day warning → Zoe and agent notified |

---

## 4. How It Works — End to End

### Step 1 — RERA Permit Check on Publish
Agent tries to set property to `listed` → backend middleware `reraperCheck(property)`:
- No `permitNumber` → 400 "RERA permit required"
- `permitExpiryDate < today` → 400 "RERA permit expired"
- `permitExpiryDate < today + 30 days` → allow, but create Laila alert: "Permit expiring in X days"

### Step 2 — Client KYC on Lead Creation
Lead created with `transactionType: 'sale'` → KYC initiated: `POST /api/kyc { clientId, requiredDocuments: ['passport', 'emirates_id', 'proof_of_funds'] }`. Client receives WhatsApp request via Nadia to upload documents.

### Step 3 — Document Upload and Review
Client uploads documents via portal (Multer). Laila's dashboard shows: Pending Review. Compliance officer reviews → `PATCH /api/kyc/:id { status: 'verified' }` or `{ status: 'rejected', reason: 'ID expired' }`.

### Step 4 — Transaction Gate
Sophia tries to create a deal → backend validates: if `client.kycStatus !== 'verified'` → 403 "KYC verification required before transaction creation."

### Step 5 — AML Screening
On client creation (or on demand): `AMLService.screen(client)` → POST to ComplyAdvantage API → returns: `{ result: 'clear' | 'match', matches: [...] }`. If match: create SAR draft task in Laila's dashboard.

### Step 6 — PDPL Consent
Every data collection form fires `POST /api/consent { userId, formId, version, ipAddress, consentGiven: true }`. Stored in `Consent` model.

### Step 7 — Data Export Request
Client requests their data → `POST /api/gdpr/export { userId }` → background job collects all records across models → generates JSON/PDF → sends download link.

### Step 8 — Monthly Compliance Report
Cron (1st of month): `LailaService.generateMonthlyReport()` → counts: KYC verified/pending/rejected, AML screens, RERA violations, PDPL consent records → Quill generates PDF → sent to MD and compliance officer.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/compliance/permits` | List all RERA permits + expiry status |
| PATCH | `/api/compliance/permits/:propertyId` | Update permit number/expiry |
| GET | `/api/kyc` | List all KYC applications |
| POST | `/api/kyc` | Initiate KYC for client |
| PATCH | `/api/kyc/:id` | Update KYC status |
| POST | `/api/aml/screen` | Trigger AML screen for client |
| GET | `/api/aml/results/:clientId` | Get AML screening result |
| POST | `/api/consent` | Record PDPL consent |
| GET | `/api/gdpr/export` | Export user data |
| DELETE | `/api/gdpr/delete/:userId` | Right-to-erasure |

---

## 6. Data Flows

- **Receives from:** Mary (permit data), Sophia (transaction trigger → KYC gate), Nadia (document upload notifications), ComplyAdvantage API
- **Sends to:** Sophia (KYC gate result), Zoe (compliance risk alerts), Quill (monthly compliance report PDF), Henry (audit log)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `LailaComplianceCRM_NEW` | `src/components/owner/ai/LailaComplianceCRM_NEW/` | ✅ Exists |
| RERA permit table | Inside dashboard | ✅ Exists (mock) |
| KYC workflow board | Inside dashboard | ✅ Exists (mock) |
| AML results panel | Inside dashboard | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| Compliance routes | `server/routes/compliance.ts` | ✅ Exists (partial) |
| AML screening | `server/services/AMLService.ts` | 🔲 Phase 6 |
| KYC workflow | `server/routes/kyc.ts` | 🔲 Phase 6 |
| PDPL consent | Prisma `Consent` model | 🔲 Phase 6 |
| Permit cron | Daily expiry check | 🔲 Phase 6 |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full compliance view + SAR approval |
| `compliance_officer` | Full compliance management |
| `agent` | KYC status view for own clients |
| Client | Own KYC document upload via portal |

---

## 10. Implementation Checklist

- [x] `LailaComplianceCRM_NEW` renders (mock)
- [x] Laila registered in `AI_ASSISTANTS_REGISTRY`
- [ ] RERA permit check middleware on property publish
- [ ] KYC model + workflow endpoints
- [ ] Document upload for KYC (Multer — Phase 6)
- [ ] AML screening service (ComplyAdvantage — Phase 6, requires contract)
- [ ] PDPL consent model + endpoints
- [ ] Data export (GDPR-like)
- [ ] Monthly compliance report (Quill)
- [ ] Permit expiry cron alerts

---

## 11. Dependencies

- ComplyAdvantage API subscription (Phase 6 — external)
- `multer` (Phase 6) — KYC document uploads
- Quill (compliance reports)
- `node-cron` (permit expiry check)

---

## 12. Future Enhancements

- Automated Ejari verification via DLD API
- Blockchain-based immutable KYC record
- Real-time RERA data sync from DLD API
- AML monitoring for ongoing transactions (not just at onboarding)
