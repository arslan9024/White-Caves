# 23 — Evangeline · Legal Risk Analyst

> **ID:** `evangeline`  
> **Department:** Legal  
> **Title:** Legal Risk Analyst  
> **Color:** `#DC2626` (Red)  
> **Avatar:** 👩‍⚖️  
> **Phase:** Phase 3 (Active) / Phase 6 (Full)  
> **Status:** ✅ In Code — `src/components/owner/ai/EvangelineLegalCRM/`  
> **Access:** Managing Director, Legal Officer

---

## 1. Overview

Evangeline is the **proactive legal guardian** of White Caves. She monitors contracts, flags regulatory changes, provides legal risk assessments on transactions, maintains the company's legal document library, and coordinates with external legal counsel. She is not a lawyer but acts as a highly trained legal paralegal who ensures no contract is signed without the right approvals and no deal closes with unresolved legal exposure.

---

## 2. Core Responsibilities

1. Contract review and risk flagging before signing
2. Legal document library: store and version all templates (SPA, MoU, NOC, commission agreements)
3. Monitor UAE regulatory changes: RERA circulars, DLD fee updates, PDPL amendments
4. Litigation tracker: log and track all active disputes or legal matters
5. Coordinate external legal counsel referrals for complex transactions
6. Legal risk scoring per transaction: Low / Medium / High / Do Not Proceed

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Contract risk scanner | Upload contract → AI flags non-standard clauses, missing protections |
| Risk scoring | Overall legal risk score per transaction (0–100) |
| Document templates | Master library of UAE-compliant templates; version control |
| Regulatory monitor | Alert when RERA/DLD issues new circular affecting White Caves |
| Litigation tracker | Active cases: party, nature, status, next hearing, legal counsel |
| Legal opinion log | Record legal opinions received, date, counsel, summary |
| Clause library | Standard protective clauses for each transaction type |
| Approval gate | High-risk transactions require Evangeline sign-off before proceeding |

---

## 4. How It Works — End to End

### Step 1 — Transaction Intake
Sophia advances a deal to `spa_pending` → Evangeline receives notification: "New SPA requires legal review."

### Step 2 — Document Upload
Agent uploads draft SPA → `POST /api/legal/review { documentId, transactionId }` → Evangeline's AI scanner processes it.

### Step 3 — Contract Scanning
`EvangelineService.scanContract(documentId)`:
- Extract key clauses via GPT-4 (completion date, penalty clauses, exclusivity, title transfer conditions)
- Compare against Evangeline's clause library → flag deviations
- Returns: `{ riskScore, flaggedClauses: [{ clause, risk, recommendation }], verdict: 'review_required' | 'approved' | 'do_not_sign' }`

### Step 4 — Risk Report
Evangeline's dashboard shows risk report. Legal officer reviews flagged clauses → either approves (`PATCH /api/legal/review/:id { status: 'approved' }`) or requests changes from the other party.

### Step 5 — Approval Gate
Deal cannot advance to `spa_signed` unless `legalReview.status === 'approved'`. Backend validates this before accepting the stage update.

### Step 6 — Document Library
Agent requests standard SPA template → `GET /api/legal/templates/spa` → Quill pre-fills with transaction data → draft returned for editing.

### Step 7 — Regulatory Alert
Cron (weekly): `EvangelineService.checkRegulatoryFeed()` → pulls RERA/DLD RSS feeds → parses new circulars → if relevant to White Caves operations → creates alert in Evangeline dashboard → notifies MD.

### Step 8 — Litigation Management
New dispute filed → `POST /api/litigation { clientName, nature, value, status: 'pre_dispute', externalCounsel }`. Tracked through: Pre-dispute → Filed → Hearing → Settled/Judgment.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/legal/review` | Submit document for legal review |
| GET | `/api/legal/review` | List all legal reviews |
| PATCH | `/api/legal/review/:id` | Update review status |
| GET | `/api/legal/templates` | List legal document templates |
| GET | `/api/legal/templates/:type` | Get specific template |
| POST | `/api/litigation` | Create litigation record |
| GET | `/api/litigation` | List active litigation |
| PATCH | `/api/litigation/:id` | Update litigation status |
| GET | `/api/legal/regulatory-alerts` | RERA/DLD regulatory alerts |

---

## 6. Data Flows

- **Receives from:** Sophia (deals needing legal review), Quill (documents for review), RERA/DLD regulatory feeds
- **Sends to:** Sophia (legal approval gate result), Laila (legal + compliance coordination), Zoe (high-risk alerts), Quill (template generation)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `EvangelineLegalCRM` | `src/components/owner/ai/EvangelineLegalCRM/` | ✅ Exists |
| Contract review panel | Inside dashboard | ✅ Exists (mock) |
| Litigation tracker | Inside dashboard | ✅ Exists (mock) |
| Regulatory alerts feed | Inside dashboard | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| EvangelineService | `server/services/EvangelineService.ts` | 🔲 Planned |
| Legal review CRUD | `server/routes/legal.ts` | 🔲 Planned |
| Litigation CRUD | `server/routes/litigation.ts` | 🔲 Planned |
| Contract scanner | GPT-4 integration | 🔲 Phase 6 |
| Regulatory cron | `server/jobs/regulatoryFeedJob.ts` | 🔲 Phase 6 |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full legal dashboard + litigation |
| `legal_officer` | Full legal management |
| `agent` | Own deals' review status (read-only) |

---

## 10. Implementation Checklist

- [x] `EvangelineLegalCRM` renders (mock)
- [x] Evangeline registered in `AI_ASSISTANTS_REGISTRY`
- [ ] Legal review model + CRUD
- [ ] Contract scanner (GPT-4 — Phase 6)
- [ ] Legal document templates store
- [ ] Approval gate middleware on deal stage transitions
- [ ] Litigation tracker model + CRUD
- [ ] Regulatory feed cron job
- [ ] Legal risk scoring display
- [ ] Tests

---

## 11. Dependencies

- GPT-4 API (Phase 6) — contract scanning
- Quill (document templates)
- RERA/DLD RSS feeds (external)
- Sophia (deal stage gating)

---

## 12. Future Enhancements

- AI-generated contract redlines (suggest clause improvements)
- Direct DLD portal integration for registration and NOC requests
- Multi-jurisdiction support (for international buyer deals)
- Legal precedent database for UAE real estate disputes
