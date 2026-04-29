# AML Risk Assessment Framework
# White Caves Real Estate LLC

> **Document ID:** WC-AML-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active — Annual Review Required
> **Owner:** Compliance Department (Laila — Compliance & Legal Officer)
> **Legal Basis:** UAE AML Law No. 20 of 2018, Cabinet Decision No. 10 of 2019
> **Classification:** Confidential — Regulatory Document

---

## 1. Legal Framework

| Law / Regulation | Key Requirement for Real Estate |
|-----------------|-------------------------------|
| Federal Decree-Law No. 20 of 2018 | AML/CFT — applies to real estate brokers as Designated Non-Financial Businesses (DNFBs) |
| Cabinet Decision No. 10 of 2019 | AML executive regulations; defines DNFBs |
| RERA Circular (2022) | RERA-registered agents must conduct CDD on all clients |
| FATF Guidance on Real Estate (2022) | Real estate sector identified as high-risk for money laundering |
| AED 55,000 threshold | CDD required for any single transaction or linked transactions above this value |

---

## 2. Risk-Based Approach

White Caves adopts a **risk-based approach** to AML compliance:

- **Low risk** clients receive simplified due diligence
- **Medium risk** clients receive standard CDD
- **High risk** clients receive enhanced due diligence (EDD)
- All clients are rescreened annually or upon transaction trigger

---

## 3. Inherent Risk Assessment — Business

### 3.1 Product/Service Risk

| Product | Risk Level | Rationale |
|---------|-----------|-----------|
| Residential property sales (ready) | Medium | High transaction values; may involve mortgages |
| Off-plan property sales | High | Large cash-stage payments; escrow laundering risk |
| Residential lettings (long-term) | Low | Relatively small values; ongoing relationship |
| Commercial leases | Medium | Business clients; varied source of funds |
| Property management | Low | Recurring small amounts; known clients |
| Mortgage referral | Low | Bank conducts own AML checks |

### 3.2 Customer Risk Factors

| Factor | Risk Indicator | Weight |
|--------|--------------|--------|
| Residency | Non-UAE resident | +2 |
| Nationality | FATF grey/blacklisted country | +3 |
| Occupation | Politically Exposed Person (PEP) | +3 |
| Transaction size | > AED 5M | +2 |
| Source of funds | Business income (not salary) | +1 |
| Legal entity | Complex corporate structure | +2 |
| Payment method | Unusual (cash, crypto requested) | +4 |
| Third-party payment | Payment from unrelated party | +4 |
| Urgency | Abnormal haste | +2 |
| Transaction structure | Multiple linked transactions < threshold | +3 |

**Scoring:**
- 0–3 points: Low Risk → Simplified CDD
- 4–7 points: Medium Risk → Standard CDD
- 8+ points: High Risk → Enhanced Due Diligence

---

## 4. Customer Due Diligence (CDD) Procedures

### 4.1 Simplified CDD (Low Risk)

**When:** Individual client, UAE resident, salary income, transaction < AED 1M

**Minimum requirements:**
- Passport copy (valid)
- UAE Residence Visa (if resident)
- Emirates ID (front + back)
- Self-declared source of funds
- RERA-standard client file

---

### 4.2 Standard CDD (Medium Risk)

**When:** Non-resident buyer, business income, transaction AED 1M–5M

**Requirements (in addition to Simplified CDD):**
- 3 months bank statements
- Employment letter or salary certificate
- For business income: trade license + audited accounts
- Sanctions screening (automated)
- PEP screening (automated)

---

### 4.3 Enhanced Due Diligence (EDD — High Risk)

**When:** PEP identified, high-risk jurisdiction, transaction > AED 5M, complex structure, suspicious indicators

**Requirements (in addition to Standard CDD):**
- 6 months bank statements
- Source of wealth explanation (not just source of funds)
- Company structure diagram (for corporate buyers)
- UBO (Ultimate Beneficial Owner) declaration (all > 25% stake)
- Independent wealth verification (Phase 5: third-party KYC provider)
- Senior management approval before proceeding
- Ongoing monitoring: quarterly review during relationship

---

## 5. Suspicious Activity Indicators

### 5.1 Red Flags — Transaction Structure

| Indicator | Action |
|-----------|--------|
| Cash payment or cryptocurrency requested | Decline cash; investigate crypto |
| Payment from unrelated third party | Request explanation; EDD |
| Multiple transactions structured just below AED 55,000 | Treat as single transaction; SAR consideration |
| Purchase with no mortgage despite large sum | Verify source of funds |
| Client offers a higher price than asked | Investigate motivation |
| Rapid buy-sell with no apparent investment reason | Monitor for round-tripping |
| Transaction abandonment after CDD request | Log; possible SAR |

### 5.2 Red Flags — Client Behaviour

| Indicator | Action |
|-----------|--------|
| Reluctance to provide identification | Refuse to proceed without KYC |
| Unusual urgency to complete transaction | Slow down; full CDD required |
| Unable to explain source of funds clearly | EDD; possible SAR |
| Uses multiple intermediaries with no clear reason | EDD; PEP/sanctions check |
| Requests excessive confidentiality | Note; EDD |
| Multiple changes to ownership structure | Investigate; SAR consideration |

---

## 6. Sanctions Screening

### 6.1 Databases Screened

| List | Authority | Frequency |
|------|-----------|---------|
| UAE Terrorist List (Cabinet Decision 74) | UAE Government | Per transaction + monthly |
| UN Security Council Consolidated List | United Nations | Per transaction + monthly |
| OFAC SDN List | US Treasury | Per transaction |
| EU Consolidated Sanctions | European Union | Per transaction |
| Interpol Red Notices | Interpol | Per transaction (high risk) |

### 6.2 Screening Process

```
Client data entered in CRM
          │
          ▼
[Phase 5: Automated screening API integration]
[Current Phase: Manual name check — agent checks lists]
          │
          ├── CLEAR → Proceed with CDD level as determined
          │
          ├── POTENTIAL MATCH:
          │   ├── Agent escalates to Compliance Officer immediately
          │   ├── Transaction placed on hold
          │   ├── Manual verification (full name match, DOB, nationality)
          │   └── Decision within 24 hours
          │
          └── CONFIRMED MATCH:
              ├── Transaction refused
              ├── SAR filed with UAE FIU within 2 business days
              ├── Client NOT informed (tipping-off offence)
              └── Regulatory counsel engaged
```

---

## 7. SAR (Suspicious Activity Report) Procedure

### 7.1 SAR Filing Obligation

A SAR must be filed with the UAE Financial Intelligence Unit (FIU) when:
- There are reasonable grounds to suspect a transaction involves money laundering or terrorism financing
- A client is found on a sanctions list
- EDD identifies unresolvable concerns

**Tipping-off prohibition:** It is a criminal offence under UAE law to inform the client or any third party that a SAR has been or may be filed.

### 7.2 SAR Filing Steps

```
1. Compliance Officer documents suspicion:
   { clientId, transactionId, indicators, assessmentDate }

2. MD review and decision:
   ├── Concur → File SAR
   └── Disagree → Document disagreement + retain anyway

3. File on UAE FIU portal: https://uaefiu.gov.ae
   Deadline: Within 2 business days of identification

4. Contents of SAR:
   ├── White Caves company details
   ├── Subject: full name, DOB, nationality, passport, address
   ├── Nature of relationship and transaction
   ├── Suspicious indicators
   └── Supporting documents

5. Record in CRM:
   AMLRecord { type: 'SAR', fiuRef, filedAt, subjectId }
   Accessible: Compliance Officer + MD only

6. Ongoing monitoring if relationship continues
```

---

## 8. Customer Risk Register

All clients with medium or high risk rating must be recorded:

| Field | Description |
|-------|------------|
| Client ID | CRM reference |
| Risk rating | Low / Medium / High |
| Risk factors identified | List of applicable factors |
| CDD level completed | Simplified / Standard / Enhanced |
| Date of last screening | Sanctions + PEP |
| Next review date | Within 12 months |
| EDD sign-off | Compliance Officer name + date |
| SAR filed? | Yes / No / Under review |

---

## 9. AML Training Requirements

| Role | Training | Frequency |
|------|---------|-----------|
| All agents | AML awareness (2 hours) | Annual |
| Compliance Officer | AML advanced + FATF updates | Annual + updates |
| Managing Director | AML executive briefing | Annual |
| New starters | AML induction before first client | At onboarding |

**Training records:** Stored in HR system + CRM staff profile

---

## 10. Annual AML Risk Assessment Review

Each year, White Caves must review:
```
☐ Update client risk profiles (new transactions, new information)
☐ Re-screen all active clients against current sanctions lists
☐ Review SAR log (counts, outcomes, patterns)
☐ Update red flag list based on RERA/UAE FIU guidance
☐ Review staff AML training completion
☐ Check CDD documentation completeness for all active clients
☐ Assess new products/services for AML risk
☐ File annual compliance report with RERA (if required)
☐ Document review in AML Risk Assessment (update this document)
```

---

**Document Owner:** Compliance Department (Laila)
**Review Cycle:** Annually + when UAE AML regulations updated
**Related:** `business/06_flowcharts/compliance-kyc-aml-flow.md`, `business/08_compliance/rera-compliance-checklist.md`
