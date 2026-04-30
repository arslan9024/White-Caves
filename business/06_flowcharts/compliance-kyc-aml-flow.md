# Compliance, KYC & AML Flow
# White Caves Real Estate Platform

> **Document ID:** WC-FLOW-COMP-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Phase 5 Design (regulatory framework active; system implementation Phase 5)
> **Owner:** Compliance Department (Laila — Compliance & Legal Officer)
> **Scope:** Client onboarding KYC, AML screening, DLD NOC, transaction clearance

---

## 1. UAE AML/KYC Legal Framework

| Law | Requirement |
|-----|------------|
| UAE AML Law No. 20 of 2018 | Real estate agents must perform CDD on clients |
| RERA regulations | All agents must be RERA-licensed (BRN required) |
| DLD requirements | All property transfers registered with DLD |
| UAE PDPL 2021 | Client data protected; consent required |
| FATF Guidance (2022) | Real estate sector high-risk for money laundering |
| UAE FIU requirements | SAR filing for suspicious transactions |
| AED 55,000 threshold | CDD required for transactions above this value |

---

## 2. Client Onboarding KYC Flow

```
New client begins relationship with White Caves
(buyer, seller, investor, landlord)
          │
          ▼
  Client type determined:
  ├── Individual (natural person)
  └── Corporate entity (company)
          │
          ▼
  ┌── INDIVIDUAL KYC ──────────────────────────────────────┐
  │                                                        │
  │  Required documents:                                   │
  │  ├── Passport (valid, clear photo page)                │
  │  ├── UAE Residence Visa (if UAE resident)              │
  │  ├── Emirates ID (front + back)                        │
  │  └── Proof of address (utility bill or bank statement) │
  │      — dated within last 3 months                      │
  │                                                        │
  │  Source of funds (for transactions > AED 1M):          │
  │  ├── Bank statement (6 months)                         │
  │  ├── Employment letter / salary certificate            │
  │  └── Investment portfolio statement (if applicable)    │
  └────────────────────────────────────────────────────────┘
          │
  ┌── CORPORATE KYC ───────────────────────────────────────┐
  │                                                        │
  │  Required documents:                                   │
  │  ├── Trade license (UAE or home country)               │
  │  ├── Certificate of incorporation                      │
  │  ├── Memorandum & Articles of Association             │
  │  ├── Board resolution authorising transaction          │
  │  ├── UBO (Ultimate Beneficial Owner) declaration       │
  │  ├── Passport + Emirates ID of all directors           │
  │  └── Shareholder registry (25%+ ownership threshold)   │
  └────────────────────────────────────────────────────────┘
          │
          ▼
  Documents uploaded to CRM:
  ├── Encrypted storage (UAE data residency)
  ├── Retention period: 5 years minimum (UAE AML Law)
  └── Accessible only to compliance officer + MD
```

---

## 3. AML Screening Flow

```
KYC documents collected
          │
          ▼
  Transaction value check:
  ├── Below AED 55,000 → Simplified CDD (basic KYC only)
  └── AED 55,000 and above → Enhanced CDD required
          │
          ▼
  Sanctions screening (all clients regardless of value):
  
  Screen against:
  ├── UN Security Council Consolidated Sanctions List
  ├── UAE Local Terrorist List (Cabinet Decision 74)
  ├── OFAC SDN List (US)
  ├── EU Consolidated Sanctions List
  └── Interpol Red Notices (high-risk clients)
          │
          ├── MATCH FOUND:
          │   ├── Transaction immediately frozen
          │   ├── Compliance officer and MD alerted immediately
          │   ├── SAR filed with UAE FIU within 2 business days
          │   ├── Client NOT informed (tipping-off offence)
          │   └── Regulatory counsel engaged
          │
          ├── POSSIBLE MATCH (name similarity):
          │   ├── Manual review by compliance officer
          │   ├── 24h hold on transaction
          │   └── Enhanced due diligence conducted
          │
          └── CLEAR:
              Enhanced CDD complete
              Risk rating assigned → Proceed
          │
          ▼
  PEP (Politically Exposed Person) check:
  ├── Screen name against PEP database
  │
  ├── PEP identified:
  │   ├── Senior management approval required
  │   ├── Source of funds: enhanced scrutiny
  │   └── Ongoing monitoring (annual review)
  │
  └── Not PEP → Continue normal CDD
```

---

## 4. Risk Rating Assignment

```
Each client assigned a risk rating:

LOW RISK:
├── UAE national or long-term resident
├── Salaried employment (verifiable income)
├── Transaction in line with income
├── Property in established community
└── No PEP or sanctions hits

MEDIUM RISK:
├── Non-resident buyer
├── GCC national
├── Large transaction (AED 5M+)
├── Multiple simultaneous transactions
└── Source of funds: business income (not salary)

HIGH RISK:
├── Politically exposed person (PEP)
├── High-risk jurisdiction (FATF grey/black list country)
├── Complex corporate structure (multiple layers)
├── Cash payments requested
├── Unusual urgency or pressure
└── Transaction structure appears to avoid thresholds

ACTION BY RISK LEVEL:
Low    → Standard CDD, file record, proceed
Medium → Enhanced CDD, senior review, proceed with approval
High   → Enhanced CDD, MD approval, enhanced monitoring,
         consider filing SAR if suspicious indicators present
```

---

## 5. Transaction Clearance Flow

```
All KYC/AML completed + risk rating assigned
          │
          ▼
  Clearance checklist:
  ☐ Passport verified (not expired)
  ☐ Visa verified (active)
  ☐ Sanctions screening: CLEAR
  ☐ PEP check: N/A or cleared by management
  ☐ Source of funds: adequate explanation on file
  ☐ Risk rating: assigned and documented
  ☐ All documents stored in CRM
          │
          ├── Any item unchecked → Hold transaction → Notify agent
          │
          ▼
  AML compliance sign-off:
  Laila (Compliance Officer) digitally signs clearance
          │
          ▼
  Transaction proceeds:
  ├── DLD NOC applied for
  ├── SPA / Lease Agreement prepared
  └── Commission calculation triggered
```

---

## 6. DLD Registration Flow

```
Sale agreed + AML clearance obtained
          │
          ▼
  DLD (Dubai Land Department) transfer process:

  Step 1: Pre-transfer checklist
  ├── NOC from developer (DAMAC, Emaar, etc.)
  │   — Required to confirm no outstanding service charges
  ├── Mortgage clearance letter (if property is mortgaged)
  └── Title deed (original)
          │
          ▼
  Step 2: DLD appointment booking
  ├── Book via Dubai REST app or DLD counter
  └── Both parties (buyer + seller) or authorised POA required
          │
          ▼
  Step 3: DLD fees payable (buyer)
  ├── Transfer fee: 4% of property value
  ├── Admin fee: AED 4,000 (standard)
  ├── Title deed issuance: AED 250
  └── Map registration: AED 100–500
          │
          ▼
  Step 4: Title deed transfer
  ├── DLD issues new title deed in buyer's name
  ├── Mortgage registered if financed (3 business days)
  └── Copy filed in CRM (compliance record)
          │
          ▼
  CRM updated:
  ├── Property status → SOLD
  ├── New owner recorded
  └── Commission released (if DLD completion = trigger)
```

---

## 7. SAR Filing Flow

```
Suspicious transaction indicators detected:
  ├── Client on sanctions list
  ├── Unusual transaction structure (splitting large payments)
  ├── Inconsistent source of funds explanation
  ├── Unusual urgency / pressure on transaction
  ├── Cash or cryptocurrency payment requested
  └── Third-party payment (different person paying)
          │
          ▼
  Compliance officer documents suspicion:
  { clientId, transactionId, indicators[], assessmentDate }
          │
          ▼
  MD review and decision:
  ├── File SAR → Proceed (do not tip off client)
  └── Not suspicious → Document decision + continue
          │
          ▼
  SAR filed with UAE FIU:
  Portal: AMLSCU (Anti-Money Laundering and Suspicious Cases Unit)
  URL: https://uaefiu.gov.ae
  Deadline: Within 2 business days of identification
  Contents: {
    reporter details,
    subject details (client),
    nature of relationship,
    transaction details,
    suspicious indicators,
    supporting documents
  }
          │
          ▼
  Record in CRM:
  AMLRecord: { type: 'SAR', fiuRef, filedAt, status }
  Accessible only to MD + Compliance Officer
          │
          ▼
  Ongoing monitoring:
  ├── Transaction held pending FIU guidance
  └── Annual review of high-risk clients
```

---

## 8. RERA Advertising Compliance

```
Before marketing any property:
          │
          ▼
  RERA advertising checklist:
  ├── Agent has valid RERA BRN (Broker Registration Number)
  ├── Property has valid RERA permit (Form A signed by owner)
  ├── Ad includes RERA permit number
  ├── Ad includes TRN (Tax Registration Number) if VAT-applicable
  ├── Property photos are real (not AI-generated)
  ├── Price is accurate (within 5% of listed price)
  └── No misleading claims (e.g., "beachfront" if not beachfront)
          │
          ├── Any violation → Listing not published
          └── Repeat violations → RERA may fine / revoke license
          │
          ▼
  Portal compliance:
  ├── PropertyFinder: requires valid RERA permit in every listing
  ├── Bayut: same requirement
  └── White Caves website: same requirement
```

---

**Document Owner:** Compliance Department (Laila)
**Related:** `business_docs/10_security/kyc-aml-framework.md`, `business/08_compliance/aml-risk-assessment.md`, `business/08_compliance/rera-compliance-checklist.md`


---

## 8. AML Screening Tools and Integration

### 8.1 Recommended Screening Services

| Provider | Coverage | Integration | Cost |
|---------|---------|------------|------|
| **ComplyAdvantage** | Sanctions, PEP, adverse media — 200+ lists | REST API; webhooks | $300–800/month (volume-based) |
| **World-Check (Refinitiv)** | FATF lists, DBI sanctions, PEP — industry standard | REST API | $500–2,000/month |
| **Dow Jones Risk & Compliance** | Comprehensive; banking-grade | API | $1,000–3,000/month |
| **UAE-specific: goAML portal** | UAE FIU — SAR submission | Web portal (no API) | Free (FIU-mandated) |

**Recommendation for White Caves:** ComplyAdvantage (AED 1,100–2,900/month) — best cost/coverage for a brokerage of White Caves' size. API integration with CRM (Phase 2).

### 8.2 CRM AML API Integration (Phase 2)

```typescript
// Compliance service — AML screening
interface AMLScreeningRequest {
  clientId: string;
  name: string;            // full legal name from ID
  nationality: string;     // ISO 3166 country code
  dateOfBirth: string;     // YYYY-MM-DD
  idNumber: string;        // passport or Emirates ID
  screeningTypes: ('sanctions' | 'pep' | 'adverse_media')[];
}

interface AMLScreeningResult {
  screeningId: string;     // provider reference
  status: 'CLEAR' | 'POTENTIAL_MATCH' | 'CONFIRMED_MATCH';
  riskScore: number;       // 0–100
  matches?: AMLMatch[];
  screenedAt: Date;
  validUntil: Date;        // re-screen after 12 months for existing clients
}
```

### 8.3 SAR (Suspicious Activity Report) Process

```
Trigger: Compliance officer suspects money laundering / terrorism financing

Step 1: Do NOT inform the client (tipping-off is a criminal offence)
Step 2: Document suspicion in CRM (compliance-only access)
Step 3: Escalate internally to MD within 24 hours
Step 4: File SAR on UAE FIU goAML portal within 30 days
         └── Required information:
             ├── Reporter details (White Caves + compliance officer)
             ├── Suspicious person/entity details
             ├── Nature of suspicion (narrative)
             ├── Relevant transactions/documents
             └── Actions taken (e.g., transaction halted)
Step 5: Do NOT complete the transaction until FIU response
         └── FIU has 7 days to consent or refuse
Step 6: Record SAR reference number in SAR register (CRM compliance module)
Step 7: Annual SAR register audit by MD + compliance officer
```

**goAML portal:** aml.gov.ae
**FIU contact:** Financial Intelligence Unit, Central Bank of UAE, P.O. Box 854, Abu Dhabi

---

## 9. Enhanced Due Diligence (EDD) Triggers

Standard KYC is sufficient for most clients. EDD (Enhanced Due Diligence) is required when:

| Trigger | Action |
|---------|--------|
| Transaction value > AED 2,000,000 | Full source of funds declaration + supporting documents |
| Client is a PEP (Politically Exposed Person) | Senior management approval required; enhanced ongoing monitoring |
| Client from FATF high-risk jurisdiction | EDD mandatory; consider whether to proceed at all |
| Complex or unusual transaction structure | Document business rationale; escalate to MD |
| Multiple related transactions just below AED 55,000 threshold (structuring) | Aggregate and treat as one — file SAR |
| Client reluctant to provide documents | Consider refusal; document reasons |
| Business purpose unclear | Request full explanation in writing |

### 9.1 EDD Process

```
EDD = Standard KYC PLUS:
1. Certified copies of identity documents (not just copies)
2. Source of funds: salary slips, bank statements (3 months), investment statements
3. Source of wealth: how did client accumulate their wealth overall?
4. Business purpose: why this property? why Dubai? why now?
5. Ultimate Beneficial Owner declaration (if buying through company)
6. Third-party verification where possible (e.g., employer letter for salaried)
7. MD sign-off before proceeding with transaction
8. Ongoing monitoring: re-screen AML at 6 months AND at any significant transaction
```

---

**Document Owner:** Compliance Department (Laila — Compliance Officer)
**Version History:** v1.0 April 2026; v2.0 April 2026 (AML tools integration, SAR process, EDD)
**Related:** `business/08_compliance/aml-risk-assessment.md`, `business/08_compliance/rera-compliance-checklist.md`
