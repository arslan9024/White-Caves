# Compliance & Audit Workflow Flowcharts

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Owner:** Compliance Department (Laila)

---

## Workflow 1: KYC & AML Verification

```
┌────────────────────────────────────────────────────────────────┐
│    KYC / AML VERIFICATION WORKFLOW                             │
│    Triggered: On creation of any Transaction or Tenant record  │
└────────────────────────────────────────────────────────────────┘

[TRIGGER: Transaction Created or Tenant Application Submitted]
        │
        ▼
[INITIAL RISK CLASSIFICATION — Automated]
│ System checks:
│ ├── Transaction value (> AED 55,000 → EDD required)
│ ├── Client nationality (FATF high-risk list check)
│ ├── Property type (cash-intensive areas flagged)
│ └── Client history (previous transactions in system)
│
│ Risk Level assigned: LOW / MEDIUM / HIGH / CRITICAL
        │
├── LOW RISK ──▶
│       │
│       ▼
│   [STANDARD CDD]
│   Documents required:
│   ├── Valid passport or Emirates ID
│   └── Current residence address verification
│   
│   Auto-approved if:
│   ├── Documents uploaded and clear
│   └── No FATF / Sanctions match
│   
│   KYC Status → "Verified" (automated if clean)
│
├── MEDIUM RISK ──▶
│       │
│       ▼
│   [ENHANCED CDD — Agent-Assisted]
│   Documents required:
│   ├── Passport + Emirates ID
│   ├── Proof of address (utility bill < 3 months)
│   ├── Salary certificate / bank statements (3 months)
│   └── Employment letter or trade license
│   
│   Laila reviews submitted documents
│   Decision within 24 hours
│   KYC Status → "Verified" or "Rejected"
│
└── HIGH / CRITICAL RISK ──▶
        │
        ▼
    [ENHANCED DUE DILIGENCE (EDD) — Mandatory]
    Documents required (in addition to Medium):
    ├── Source of funds declaration (signed)
    ├── Source of wealth documentation (bank/investment statements)
    ├── UBO (Ultimate Beneficial Owner) declaration (for companies)
    ├── PEP declaration (politically exposed person)
    └── Any court orders / sanctions checks
    
    PEP/Sanctions screening:
    ├── System auto-screens against FATF list
    ├── Screen against UN/OFAC/EU sanctions list
    └── Match → Flag for manual review (never auto-approve)
    
    Laila reviews with senior management if value > AED 5M
    
    Possible outcomes:
    ├── Verified → Transaction may proceed
    ├── Additional info requested → 5-day window for client
    └── Rejected → Transaction blocked; client notified
            │
            ▼ (if Rejected and unusual pattern)
    [SUSPICIOUS ACTIVITY REPORT (SAR)]
    See SAR Workflow below
```

---

## Workflow 2: Suspicious Activity Report (SAR) Process

```
[SAR TRIGGER — Any of the following]
│ ├── Client's documents are inconsistent or appear forged
│ ├── Client refuses to provide source of funds
│ ├── Transaction structure appears designed to avoid thresholds
│ ├── Same client involved in multiple transactions in short period
│ ├── Cash payment offered for large transaction
│ ├── PEP match detected
│ └── System AML algorithm flags unusual pattern
        │
        ▼
[LAILA REVIEWS THE CASE — Within 24 hours]
│ Reviews all available information:
│ ├── Transaction details
│ ├── Client profile and history
│ ├── Communication logs
│ └── Documents submitted
│
│ Decision:
│ ├── False positive → Document reasoning, dismiss flag
│ └── Genuine concern → Proceed to SAR
        │
        ▼ (Genuine concern)
[SAR DRAFTED — Confidentially]
│ SAR includes:
│ ├── Subject details (client name, ID, nationality, address)
│ ├── Transaction details (value, type, property)
│ ├── Nature of suspicion (specific reason)
│ ├── Supporting evidence (documents, communications)
│ └── Laila's professional assessment
│
│ CRITICAL: SAR must NOT be disclosed to the subject
│           Tipping off is a criminal offence under UAE AML law
        │
        ▼
[SAR SUBMITTED TO UAE FIU]
│ Submitted via goAML portal (UAE Financial Intelligence Unit)
│ Submission reference number recorded
│ SAR locked in compliance records (cannot be edited after submission)
│ Retention: minimum 5 years
        │
        ▼
[TRANSACTION PUT ON HOLD]
│ Transaction status → "Compliance Hold"
│ No further progress until FIU provides guidance
│ Owner (Zoe) notified confidentially (without naming client)
        │
        ▼
[FIU RESPONSE]
│ FIU may:
│ ├── Provide no objection → Transaction may proceed (with records)
│ ├── Request more information → Laila provides within 14 days
│ └── Instruct no proceed → Transaction cancelled, funds returned via bank
```

---

## Workflow 3: Monthly RERA Compliance Audit

```
[TRIGGERS: 1st of Every Month]
        │
        ▼
[AUTOMATED COMPLIANCE CHECKS — System generates report]
│
│ PROPERTY COMPLIANCE:
│ ├── Count: Properties published without RERA permit → FLAG
│ ├── Count: Properties with permit expired → FLAG (auto-unpublished)
│ └── Count: Properties missing required fields → FLAG
│
│ AGENT COMPLIANCE:
│ ├── Agents with missing/expired BRN → FLAG
│ ├── Agents without valid RERA training certificate → FLAG
│ └── Agents inactive for 90+ days (still as Active status) → FLAG
│
│ KYC COMPLIANCE:
│ ├── Active transactions without completed KYC → CRITICAL FLAG
│ ├── Active leases without Ejari → FLAG
│ └── KYC documents expiring within 60 days → WARNING
        │
        ▼
[LAILA REVIEWS AUTOMATED REPORT — Within 2 Business Days]
│ Categorise each flag:
│ ├── Critical (RERA fine risk) → Immediate action required
│ ├── High (compliance breach) → Action within 7 days
│ ├── Medium (warning) → Action within 30 days
│ └── Info → Note for records
        │
        ▼
[REMEDIATION WORKFLOW]
│ Critical flags:
│ ├── Property permit missing → Contact agent to obtain permit within 48h
│ │   └── If not obtained → Unpublish listing
│ ├── Transaction without KYC → Block transaction from advancing
│ └── Agent BRN missing → Notify agent + HR (Nancy)
│
│ All remediations logged with action taken and timestamp
        │
        ▼
[MONTHLY COMPLIANCE REPORT — Distributed to]
│ ├── Managing Director (Zoe): Executive summary
│ ├── Operations Manager: Department-level details
│ └── Compliance records archive
        │
        ▼
[QUARTERLY FULL AUDIT — Q1/Q2/Q3/Q4]
│ External auditor engagement (H1 and H2)
│ Full transaction review (sample-based)
│ Contract compliance review
│ Data integrity check
│ RERA/DLD reporting submission
│ Board-level compliance certification
```

---

## Workflow 4: Agent License & Credential Tracking

```
[HR ONBOARDING (Nancy) — New Agent Joins]
        │
        ▼
[AGENT PROFILE CREATED]
│ Fields required before agent goes Active:
│ ├── Full name, Emirates ID number
│ ├── RERA BRN (Broker Registration Number)
│ ├── RERA training certificate (upload PDF)
│ ├── RERA license expiry date
│ └── Employment contract (signed)
        │
        ▼
[LAILA VERIFIES CREDENTIALS]
│ ├── BRN validated against RERA portal
│ ├── Training certificate reviewed
│ └── Approved → Agent status set to "Active"
        │
        ▼
[ONGOING MONITORING — Automated]
│ 90 days before BRN expiry:
│ └── Alert to agent + Nancy (HR) + Laila
│     "Your RERA BRN expires on [date]. Please renew."
│
│ 30 days before BRN expiry:
│ └── Second alert; block new lead assignments if not renewed
│
│ On expiry:
│ └── Agent status → "License Expired"
│     Cannot be assigned new leads or transactions
│     Existing deals monitored by manager
        │
        ▼
[RENEWAL COMPLETED]
│ Agent uploads new BRN certificate
│ Laila verifies
│ Agent status → "Active" restored
│ New expiry date recorded
```

---

## Compliance Dashboard KPIs

| Metric | Target | Alert Threshold | Frequency |
|--------|--------|-----------------|-----------|
| Properties with valid RERA permit | 100% | < 98% | Daily |
| Agents with valid BRN | 100% | < 100% | Weekly |
| Transactions with completed KYC | 100% | < 100% | Daily |
| Active leases with Ejari | 100% | < 95% | Weekly |
| SAR submitted within 24h of detection | 100% | < 100% | Per event |
| Monthly compliance report delivered | By Day 5 | After Day 5 | Monthly |
| AML alert review within 24h | 100% | < 100% | Daily |

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Owner:** Compliance (Laila)
