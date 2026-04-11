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
