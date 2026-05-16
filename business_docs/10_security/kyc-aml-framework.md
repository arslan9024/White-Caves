# KYC & AML Service Framework — White Caves

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Regulation:** UAE AML Law — Federal Decree Law No. 20 of 2018

---

## 1. Overview

White Caves is required under UAE law to conduct Know Your Customer (KYC) and Anti-Money Laundering (AML) checks on all parties to real estate transactions. This document defines the framework, third-party service options, verification workflows, and record-keeping requirements.

---

## 2. Legal Requirements

| Requirement | Source | Threshold | Action |
|-------------|--------|-----------|--------|
| Customer Due Diligence (CDD) | AML Law Art. 12 | All transactions | Identity + address verification |
| Enhanced Due Diligence (EDD) | AML Law Art. 13 | > AED 55,000 | Source of funds documentation |
| PEP Screening | AML Law Art. 14 | All clients | Politically Exposed Person check |
| Sanctions Screening | UN/OFAC/UAE lists | All clients | Real-time screening |
| SAR Filing | AML Law Art. 16 | Suspicious activity | Report to UAE FIU via goAML |
| Record Retention | AML Law Art. 20 | All records | 5 years minimum |

---

## 3. Third-Party KYC/AML Service Options

### Option A: ComplyAdvantage (Recommended)
- **Type:** SaaS API — PEP, Sanctions, Adverse Media screening
- **Coverage:** 200+ countries, real-time sanctions lists (UN, OFAC, EU, UK, UAE)
- **API:** REST, JSON
- **Pricing:** From $500/month (volume-based)
- **UAE Client:** Yes — UAE entity available
- **Integration:** `POST /v2/searches` with customer name + date of birth + nationality
- **Response Time:** < 2 seconds
- **DPA Available:** Yes (PDPL-compatible)

### Option B: Refinitiv World-Check (Thomson Reuters)
- **Type:** Enterprise SaaS — comprehensive database
- **Coverage:** Most comprehensive database (1.7M+ records)
- **Pricing:** Enterprise contract (more expensive)
- **Suitable For:** Large transaction volumes (1,000+/month)

### Option C: Onfido (Identity + AML combined)
- **Type:** Full KYC — document verification + liveness check + AML screening
- **Benefit:** Can replace manual document review
- **Coverage:** 195 countries
- **API:** REST
- **Pricing:** Per-check pricing
- **Suitable For:** Automated tenant/buyer onboarding without manual review

### Option D: Jumio
- **Type:** Full identity verification + AML
- **Benefit:** Very high accuracy for UAE documents (Emirates ID, UAE Passport)
- **Pricing:** Per-check; enterprise plans available
- **Suitable For:** UAE-first deployment with local document expertise

---

## 4. Recommended Integration Strategy

### Phase 1 (Immediate — Manual Assisted)
- Agents upload documents manually
- Laila reviews documents through CRM dashboard
- Basic sanctions screening done via ComplyAdvantage API
- Manual verification process with checklist in CRM

### Phase 2 (Q3 2026 — Automated)
- Integrate ComplyAdvantage for automated PEP/Sanctions screening
- Screening triggered on client record creation/update
- Matches flagged automatically for Laila's review
- Full KYC workflow in CRM with status tracking

### Phase 3 (Q4 2026 — Full Automation)
- Integrate Onfido or Jumio for document scanning + liveness
- Biometric identity verification for high-value transactions
- Real-time ID document authenticity check (OCR + fraud detection)
- Reduced manual review for standard transactions

---

## 5. KYC Document Requirements

### For Individual Buyers/Sellers/Tenants
| Document | When Required | Valid For |
|----------|--------------|-----------|
| Passport (original + copy) | Always | 6 months post-expiry |
| UAE Residence Visa | UAE residents | Current visa |
| Emirates ID (front + back) | UAE residents | Current ID |
| Proof of Address (utility bill / bank statement) | Always | < 3 months old |
| Source of Funds declaration | > AED 55,000 | Per transaction |
| Bank statement (3 months) | EDD trigger | Last 3 months |
| Salary certificate | Tenancy applications | < 3 months old |

### For Corporate Clients (Companies)
| Document | When Required |
|----------|--------------|
| Trade License | Always |
| Certificate of Incorporation | Always |
| Memorandum of Association | Always |
| UBO (Ultimate Beneficial Owner) declaration | Always |
| Power of Attorney (if applicable) | If agent acting |
| Financial statements | EDD trigger |

---

## 6. AML Risk Scoring

The system calculates an AML risk score (Low / Medium / High / Critical) at transaction creation:

| Factor | Weight |
|--------|--------|
| Transaction value > AED 1M | +20 |
| Transaction value > AED 5M | +30 additional |
| Client nationality: FATF high-risk country | +25 |
| PEP match detected | +40 |
| Sanctions match detected | CRITICAL (block) |
| Previous flagged transactions by same client | +20 |
| Cash / cheque payment offered | +15 |
| Multiple transactions by same client in 30 days | +15 |
| First-time client (no history) | +5 |
| Client referred by existing trusted client | −5 |

**Score thresholds:**
- 0–20: Low — Standard CDD; automated approval if clean screening
- 21–40: Medium — Enhanced CDD; Laila review within 24h
- 41–60: High — EDD required; Laila + management review
- 60+: Critical — Transaction blocked pending investigation

---

## 7. goAML Portal — SAR Submission

White Caves is registered with the UAE Financial Intelligence Unit (FIU) and submits Suspicious Activity Reports (SARs) via the goAML portal.

**Process:**
1. Laila identifies suspicious transaction/pattern in CRM
2. SAR drafted in SAR section of Compliance module
3. SAR reviewed and approved by Managing Director (for high-value cases)
4. SAR submitted via goAML portal
5. goAML reference number recorded in CRM
6. Transaction placed on "Compliance Hold" pending FIU response
7. FIU response recorded; transaction either cleared or cancelled

**Tipping Off Prohibition:**
Informing the subject of a SAR is a criminal offence. The CRM enforces this by:
- SAR records visible only to Compliance Officer and Owner
- No automated communication to the client is triggered when a SAR is filed
- SAR status excluded from any client-facing views

---

## 8. Record Keeping

All KYC records must be retained for **minimum 5 years** from transaction date:
- Document files (storage — never deleted within window)
- Screening results (ComplyAdvantage API responses archived)
- Manual review notes (Laila's compliance notes)
- SAR submissions and FIU responses
- Risk score calculation audit trail

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Compliance (Laila)

---

## 9. Customer Risk Classification

### 9.1 Risk Tiers

| Risk Level | Definition | CDD Level | Approval Required |
|-----------|-----------|-----------|------------------|
| **Low** | UAE/GCC national, salaried, standard transaction < AED 500K, no adverse media | Standard CDD | System (automated) |
| **Medium** | Expat resident, transaction AED 500K–2M, or single risk factor present | Enhanced CDD | Agent review within 24h |
| **High** | First-time client, transaction > AED 2M, non-resident, complex ownership, cash payment, FATF-listed country | EDD | Compliance Officer review |
| **PEP** | Current or former politically exposed person or immediate family/close associate | EDD + ongoing monitoring | MD/Owner sign-off |
| **Sanctioned** | Match on UN/OFAC/UAE sanctions list | BLOCK transaction | Do NOT proceed; file STR |

### 9.2 Risk Score Factors (Additive)

| Factor | Risk Points |
|--------|------------|
| Transaction value > AED 2M | +20 |
| Transaction value > AED 5M | +30 (additional) |
| Client nationality: FATF high-risk country (as per FATF public list) | +25 |
| Non-UAE resident (no Emirates ID) | +10 |
| Corporate buyer with nominee directors or bearer shares | +30 |
| PEP confirmed | +40 |
| Sanctions match | BLOCK (regardless of score) |
| Cash payment offered | +20 |
| Urgency to complete without standard documentation | +15 |
| Multiple transactions same client within 30 days | +15 |
| Adverse media hit | +20 |
| Previous STR on client | +30 |
| Referred by existing verified client | −5 |

**Thresholds:** 0–20 = Low; 21–40 = Medium; 41–60 = High; 61+ = Critical/PEP-equivalent

---

## 10. KYC Document Checklist by Customer Type

### 10.1 UAE National (GCC National treated identically)

| Document | Mandatory | Notes |
|---------|-----------|-------|
| Emirates ID (front + back) | ✅ | Must be valid; scan + MRZ verification |
| Passport | ✅ | Bio page copy |
| Source of Funds declaration | ✅ (> AED 55,000) | Signed form |
| Bank statement (3 months) | High/EDD only | Last 3 months, stamped |
| Salary certificate / trade license | Medium+ | Confirms income source |

### 10.2 Expatriate Resident (Non-GCC)

| Document | Mandatory | Notes |
|---------|-----------|-------|
| Passport (bio page) | ✅ | Valid at time of transaction |
| UAE Residence Visa | ✅ | Current, not expired |
| Emirates ID (front + back) | ✅ | Must match visa |
| Proof of address (utility bill / DEWA / bank statement) | ✅ | < 3 months old |
| Source of Funds declaration | ✅ (> AED 55,000) | Signed; supporting docs for EDD |
| Bank statement (6 months) | EDD trigger | Stamped by bank |
| Employment letter / salary certificate | Medium+ | On company letterhead |
| Mortgage pre-approval letter | If mortgage-financed | Issued by UAE bank |

### 10.3 Non-Resident Foreign National (No Emirates ID)

| Document | Mandatory | Notes |
|---------|-----------|-------|
| Passport (all pages with visas) | ✅ | Certified copy |
| Home country proof of address | ✅ | < 3 months old, apostilled |
| Source of Funds declaration | ✅ | Mandatory for all non-resident buyers |
| Bank reference letter | ✅ | From home country bank |
| Bank statement (6 months) | ✅ | Certified / notarised |
| Tax residence certificate | EDD | For buyers from high-risk jurisdictions |
| Source of Wealth declaration | Transaction > AED 2M | Signed by client |

### 10.4 Corporate Client (Company Buyer/Tenant)

| Document | Mandatory | Notes |
|---------|-----------|-------|
| Trade License (UAE) or Certificate of Incorporation | ✅ | Valid and current |
| Certificate of Good Standing | ✅ | < 6 months old |
| Memorandum & Articles of Association | ✅ | All pages |
| UBO Declaration (Ultimate Beneficial Owner) | ✅ | All persons owning ≥ 25% |
| Passport + Emirates ID of each UBO | ✅ | Apply individual KYC per UBO |
| Board Resolution authorising representative | ✅ | Original or notarised copy |
| Power of Attorney (if applicable) | If agent acting | Notarised + attested |
| Audited financial statements (2 years) | EDD trigger | For high-value or high-risk |
| Company bank statement (6 months) | EDD trigger | Business account |
| Sanctions screening on company + all directors + UBOs | ✅ | Via ComplyAdvantage |

---

## 11. Enhanced Due Diligence (EDD) Triggers

Any one of the following triggers mandatory EDD — standard CDD is insufficient:

| Trigger | Mandatory EDD Action |
|---------|---------------------|
| Transaction value ≥ AED 2,000,000 | Source of wealth declaration + 6-month bank statement |
| Client classified as High or PEP | Senior management sign-off; ongoing annual review |
| Client from FATF high-risk or monitored jurisdiction | Certified copies of all documents; approval from Compliance Officer |
| Cash or crypto payment offered | Enhanced source of funds investigation; mandatory STR consideration |
| Complex corporate structure (multiple layers, offshore) | Corporate structure chart; identify all UBOs; registrar certificates |
| Third-party funding (someone else paying) | Full KYC on third party; reason for third-party payment documented |
| Adverse media or negative background check | Investigation report; management decision to proceed or decline |
| Mismatch between stated income and transaction value | Independent income verification; escalate to management |

> **Acceptance Criteria:** `POST /api/kyc/submit` must return HTTP 403 with `{ error: "EDD_REQUIRED", triggeredBy: ["PEP_MATCH"] }` if any EDD trigger is detected and EDD documents have not been uploaded.

---

## 12. Transaction Monitoring Rules

### 12.1 Cash Transaction Report (CTR) — Mandatory

- **Threshold:** AED 55,000 in cash (single transaction or aggregated within 30 calendar days for same client)
- **Filing deadline:** Within 2 business days of transaction
- **Filed via:** CBUAE goAML portal (https://goaml.uaefiu.gov.ae)
- **CRM automation:** System must auto-generate CTR draft when `payment.method = "CASH"` and `payment.amountAED >= 55000`
- **Legal basis:** Cabinet Decision No. 10 of 2019, Article 16

### 12.2 Suspicious Transaction Report (STR) — Mandatory

- **Threshold:** No minimum — any amount that raises suspicion
- **Filing deadline:** Immediately upon suspicion (no delay permitted)
- **Filed via:** CBUAE goAML portal
- **Tipping off prohibition:** Federal Decree-Law No. 20 of 2018, Article 17 — informing the client is a criminal offence
- **CRM enforcement:** STR records visible ONLY to Compliance Officer and Owner; excluded from all client-facing views

### 12.3 Automated Monitoring Patterns (System Alerts)

| Pattern | Alert Type | Action |
|---------|-----------|--------|
| Client transacts AED 55,000+ in cash in any 30-day window | CTR trigger | Auto-generate CTR draft; notify Compliance Officer |
| Same client has 3+ transactions within 6 months | AML flag | Compliance Officer review |
| Property sold significantly below market value (>20% below AVM) | STR consideration | Flag for manual review |
| Multiple related parties buying same property/same block simultaneously | Structuring flag | Compliance Officer review |
| Client declines to provide source of funds | High-risk flag | Transaction suspended |
| Payment received from unrelated third party | STR consideration | Mandatory explanation + EDD on third party |

---

## 13. PEP Screening Sources & Procedure

### 13.1 PEP Definition (FATF Standard)

A Politically Exposed Person (PEP) is an individual who is or has been entrusted with a prominent public function, including:
- Heads of state, government ministers, senior government officials
- Senior judicial or military officials
- Senior executives of state-owned corporations
- Senior officials of political parties
- Immediate family members: spouse, children, parents, siblings
- Known close associates: business partners, beneficial owners of associated companies

### 13.2 PEP Screening Sources

| Source | Type | Frequency |
|--------|------|-----------|
| ComplyAdvantage API | Automated — PEP + sanctions + adverse media | Real-time at onboarding; re-screen monthly |
| World-Check (Refinitiv) | Enterprise database (if contracted) | Real-time |
| UAE Local Order No. 2 of 2014 (UAE Designated Lists) | Government list | Automated + manual check |
| UN Security Council Consolidated List | Sanctions | Automated via ComplyAdvantage |
| OFAC SDN List | Sanctions | Automated via ComplyAdvantage |
| EU Consolidated Financial Sanctions List | Sanctions | Automated via ComplyAdvantage |

### 13.3 PEP Match Response Protocol

1. System flags PEP match → transaction suspended automatically
2. Compliance Officer notified immediately
3. EDD documents requested from client (without disclosing specific reason)
4. Source of funds + source of wealth investigation completed
5. Managing Director/Owner sign-off required before proceeding
6. Annual review of PEP client relationships
7. If cannot complete EDD → decline transaction; consider STR filing

---

## 14. Record Retention — 7 Years (Corrected)

> **Important update:** Record retention for AML-related records is **7 years** under Cabinet Decision No. 10 of 2019, Article 22. This supersedes any earlier reference to 5 years in this document.

| Record Type | Retention Period | Legal Basis |
|------------|-----------------|-------------|
| KYC documents (ID, passport, visa) | 7 years from transaction end | Cabinet Decision No. 10/2019, Art. 22 |
| CDD/EDD reports and decisions | 7 years | Same |
| STR submissions and FIU responses | 7 years | Same |
| CTR submissions | 7 years | Same |
| Screening results (PEP/Sanctions) | 7 years | Same |
| Transaction records | 7 years | Same |
| AML risk score calculation logs | 7 years | Same |
| Staff AML training records | 5 years | Internal policy |

---

## 15. Staff AML Training Requirements

### 15.1 Mandatory Training Schedule

| Staff Category | Initial Training | Refresher | Content |
|---------------|-----------------|-----------|---------|
| All staff (on hire) | Within 30 days of joining | Annual | AML overview, red flags, reporting obligations, tipping-off prohibition |
| Front-line agents | Within 30 days + RERA course | Annual + RERA CPD | Customer onboarding, document verification, STR triggers |
| Compliance Officer | Before appointment | Bi-annual + CBUAE updates | Full AML/CFT framework, goAML portal, EDD procedures |
| Senior Management | Within 60 days | Annual | AML governance, liability, sign-off responsibilities |

### 15.2 Training Content Requirements (CBUAE Standards)

- UAE AML legal framework (Federal Decree-Law No. 20 of 2018; Cabinet Decision No. 10 of 2019)
- Real estate-specific red flags and typologies (FATF Guidance for Real Estate Sector 2022)
- Customer due diligence procedures
- Internal STR/CTR reporting procedure
- goAML portal usage for STR/CTR filing
- Tipping-off prohibition
- Consequences of non-compliance (criminal and civil liability)

### 15.3 Training Records (CRM Tracking)

- `staff.amlTrainingDate` — date of most recent training
- `staff.amlTrainingCertificateUrl` — uploaded certificate
- `staff.amlTrainingExpiryDate` — calculated as `trainingDate + 365 days`
- System alert to HR/Compliance 30 days before expiry
- BRN renewal blocked if AML training expired

---

## 16. CBUAE Reporting Requirements Summary

| Report | Trigger | Deadline | Filed Via | CRM Field |
|--------|---------|---------|-----------|-----------|
| CTR | Cash ≥ AED 55,000 | 2 business days | goAML | `transaction.ctrFiledDate` |
| STR | Any suspicious activity | Immediately | goAML | `transaction.strFiledDate` |
| Annual Compliance Statement | Year-end | 31 March each year | CBUAE | Internal record |
| DNFBP Registration renewal | Annual | Before expiry | CBUAE portal | `company.dnfbpExpiryDate` |

