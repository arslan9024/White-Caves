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

| Law / Regulation                    | Key Requirement for Real Estate                                                         |
| ----------------------------------- | --------------------------------------------------------------------------------------- |
| Federal Decree-Law No. 20 of 2018   | AML/CFT — applies to real estate brokers as Designated Non-Financial Businesses (DNFBs) |
| Cabinet Decision No. 10 of 2019     | AML executive regulations; defines DNFBs                                                |
| RERA Circular (2022)                | RERA-registered agents must conduct CDD on all clients                                  |
| FATF Guidance on Real Estate (2022) | Real estate sector identified as high-risk for money laundering                         |
| AED 55,000 threshold                | CDD required for any single transaction or linked transactions above this value         |

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

| Product                            | Risk Level | Rationale                                         |
| ---------------------------------- | ---------- | ------------------------------------------------- |
| Residential property sales (ready) | Medium     | High transaction values; may involve mortgages    |
| Off-plan property sales            | High       | Large cash-stage payments; escrow laundering risk |
| Residential lettings (long-term)   | Low        | Relatively small values; ongoing relationship     |
| Commercial leases                  | Medium     | Business clients; varied source of funds          |
| Property management                | Low        | Recurring small amounts; known clients            |
| Mortgage referral                  | Low        | Bank conducts own AML checks                      |

### 3.2 Customer Risk Factors

| Factor                | Risk Indicator                           | Weight |
| --------------------- | ---------------------------------------- | ------ |
| Residency             | Non-UAE resident                         | +2     |
| Nationality           | FATF grey/blacklisted country            | +3     |
| Occupation            | Politically Exposed Person (PEP)         | +3     |
| Transaction size      | > AED 5M                                 | +2     |
| Source of funds       | Business income (not salary)             | +1     |
| Legal entity          | Complex corporate structure              | +2     |
| Payment method        | Unusual (cash, crypto requested)         | +4     |
| Third-party payment   | Payment from unrelated party             | +4     |
| Urgency               | Abnormal haste                           | +2     |
| Transaction structure | Multiple linked transactions < threshold | +3     |

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

| Indicator                                              | Action                                         |
| ------------------------------------------------------ | ---------------------------------------------- |
| Cash payment or cryptocurrency requested               | Decline cash; investigate crypto               |
| Payment from unrelated third party                     | Request explanation; EDD                       |
| Multiple transactions structured just below AED 55,000 | Treat as single transaction; SAR consideration |
| Purchase with no mortgage despite large sum            | Verify source of funds                         |
| Client offers a higher price than asked                | Investigate motivation                         |
| Rapid buy-sell with no apparent investment reason      | Monitor for round-tripping                     |
| Transaction abandonment after CDD request              | Log; possible SAR                              |

### 5.2 Red Flags — Client Behaviour

| Indicator                                         | Action                         |
| ------------------------------------------------- | ------------------------------ |
| Reluctance to provide identification              | Refuse to proceed without KYC  |
| Unusual urgency to complete transaction           | Slow down; full CDD required   |
| Unable to explain source of funds clearly         | EDD; possible SAR              |
| Uses multiple intermediaries with no clear reason | EDD; PEP/sanctions check       |
| Requests excessive confidentiality                | Note; EDD                      |
| Multiple changes to ownership structure           | Investigate; SAR consideration |

---

## 6. Sanctions Screening

### 6.1 Databases Screened

| List                                     | Authority      | Frequency                   |
| ---------------------------------------- | -------------- | --------------------------- |
| UAE Terrorist List (Cabinet Decision 74) | UAE Government | Per transaction + monthly   |
| UN Security Council Consolidated List    | United Nations | Per transaction + monthly   |
| OFAC SDN List                            | US Treasury    | Per transaction             |
| EU Consolidated Sanctions                | European Union | Per transaction             |
| Interpol Red Notices                     | Interpol       | Per transaction (high risk) |

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

| Field                   | Description                      |
| ----------------------- | -------------------------------- |
| Client ID               | CRM reference                    |
| Risk rating             | Low / Medium / High              |
| Risk factors identified | List of applicable factors       |
| CDD level completed     | Simplified / Standard / Enhanced |
| Date of last screening  | Sanctions + PEP                  |
| Next review date        | Within 12 months                 |
| EDD sign-off            | Compliance Officer name + date   |
| SAR filed?              | Yes / No / Under review          |

---

## 9. AML Training Requirements

| Role               | Training                          | Frequency        |
| ------------------ | --------------------------------- | ---------------- |
| All agents         | AML awareness (2 hours)           | Annual           |
| Compliance Officer | AML advanced + FATF updates       | Annual + updates |
| Managing Director  | AML executive briefing            | Annual           |
| New starters       | AML induction before first client | At onboarding    |

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

---

## 4.3 Enhanced Due Diligence (EDD) — Full Requirements

### 4.3.1 Trigger Criteria

EDD is **mandatory** when any of the following apply:

| Trigger                                                         | Threshold                                   |
| --------------------------------------------------------------- | ------------------------------------------- |
| PEP identified (domestic or foreign)                            | Automatic EDD                               |
| Client nationality — FATF grey/blacklisted country              | Automatic EDD                               |
| Transaction value                                               | > AED 5,000,000                             |
| Complex/opaque corporate ownership structure                    | ≥ 3 layers of entities OR any bearer shares |
| Third-party payment (payment from person not party to contract) | Any amount                                  |
| Risk score from Section 3.2                                     | ≥ 8 points                                  |
| Previous SAR filed or suspicious history                        | Automatic EDD                               |
| Client requests unusual confidentiality                         | Compliance Officer discretion               |

### 4.3.2 Source of Wealth Documentation Requirements

All EDD clients must provide documentation evidencing the **origin** of their entire wealth (not merely the funds for this transaction):

**Category A — Business Ownership:**

- Certificate of Incorporation for each business entity owned
- Share register or shareholder certificate confirming ownership stake
- Audited financial statements (most recent 2 years) for each material business
- Board resolution or directors' declaration confirming client's role and dividend/salary history
- If >25% stake: Ultimate Beneficial Owner (UBO) declaration (RERA Form or company affidavit)
- For UAE-based companies: DED trade license + Memorandum of Association
- For offshore companies: Registered agent certificate + Certificate of Good Standing

**Category B — Professional / Employment Income:**

- Salary certificate from current employer (on company letterhead, signed and stamped)
- Last 3 payslips (matching declared salary)
- Employment contract (for very high income claims)
- Tax returns (home country) for last 2 years — where available and applicable
- For self-employed professionals: signed declaration + accountant-certified P&L

**Category C — Investment Portfolio / Capital Gains:**

- Bank or investment institution statements (12 months, all relevant accounts)
- Portfolio valuation from licensed broker/bank as of date of transaction
- Trade history showing accumulation of funds (purchase + sale proceeds)
- Dividend certificates or fixed income coupon statements
- Property disposal: sale deed + DLD transfer certificate + bank credit entry confirming receipt

**Category D — Inheritance / Gift:**

- Grant of Probate or equivalent legal inheritance document (notarised + apostilled)
- If gift: gift deed (signed, notarised) + donor's source of wealth evidence at Category A/B/C level
- Estate valuation document
- Bank statements showing receipt of inherited/gifted funds

**Category E — Real Estate Proceeds:**

- Title deeds for sold properties
- Sale agreement + DLD/registry transfer records
- Bank statements confirming receipt of sale proceeds

**Verification Standard:** All documents must be:

- Original or certified copy (notarised where international)
- Translated to English or Arabic if in another language (certified translator)
- Consistent with each other (amounts, dates, parties cross-check)
- Within the last 6 months (financial statements) or 12 months (corporate documents)

---

### 4.3.3 Independent Verification Requirements

EDD documentation must be independently verified — agent self-review is **not** sufficient for EDD:

| Verification Step                | Method                                                                         | Responsible                |
| -------------------------------- | ------------------------------------------------------------------------------ | -------------------------- |
| Identity verification            | Cross-check passport vs. Emirates ID vs. visa                                  | Agent                      |
| Sanctions / PEP screening        | Automated screening tool (Phase 5) / manual check (Current)                    | Compliance Officer         |
| Corporate structure verification | Check UAE MoE UBO register; offshore — company registry of jurisdiction        | Compliance Officer         |
| Bank statement authenticity      | Contact bank for written confirmation if statement suspected as altered        | Compliance Officer         |
| Title deed verification          | DLD online verification portal                                                 | Agent + Compliance Officer |
| Third-party KYC service          | Phase 5: integration with Refinitiv World-Check or Dow Jones Risk & Compliance | Tech (Phase 5)             |

**Document:** All verification steps logged in CRM `AMLRecord.eddVerificationLog` with step, outcome, date, and officer name.

---

### 4.3.4 Senior Management Approval

Before any EDD client transaction proceeds:

```
EDD Client Identified
         │
         ▼
Compliance Officer reviews all documents
         │
         ▼
Compliance Officer prepares EDD Summary Report:
  ├── Client identification
  ├── Risk factors triggering EDD
  ├── Documents reviewed + verification outcome
  ├── Source of wealth conclusion
  ├── Residual risk rating (post-EDD)
  └── Recommendation: PROCEED / DO NOT PROCEED / FURTHER INFO NEEDED
         │
         ▼
EDD Summary Report submitted to Managing Director (MD)
         │
         ├── MD approves → Generate approval record with signature + date
         │                 Transaction may proceed
         │
         ├── MD requests further information → Pause transaction
         │                                     Maximum 10 additional business days
         │                                     Client informed only that "verification is ongoing"
         │
         └── MD declines → Refuse transaction
                           Log declination reason (internal use only)
                           Do NOT inform client of reason
                           Consider SAR if suspicion exists
```

**Record Keeping:** EDD Summary Report + MD approval email/signature stored in `AMLRecord.eddApproval`:

```
{
  eddReportId: string,
  submittedBy: string (Compliance Officer name),
  submittedAt: Date,
  mdDecision: 'APPROVED' | 'DECLINED' | 'MORE_INFO',
  mdSignedBy: string,
  mdDecisionAt: Date,
  rationale: string
}
```

---

### 4.3.5 6-Monthly Ongoing Review for EDD Clients

EDD clients remain subject to enhanced monitoring throughout the relationship:

**Review Frequency:** Every 6 months (or immediately on triggering event — see below)

**Triggering Events for Immediate EDD Review:**

- New transaction proposed (regardless of value)
- Change of ownership or structure of client's company
- Adverse media report (agent, Compliance Officer, or automated news monitoring)
- Client appears on new sanctions/PEP list screening
- Client requests unusual changes to payment instructions
- Transaction abandonment

**6-Monthly Review Contents:**

```
EDD Review Checklist — Every 6 Months:
☐ Re-run sanctions + PEP screening (manual current; automated Phase 5)
☐ Review any new transactions since last review
☐ Check for adverse media (Google search minimum; automated Phase 5)
☐ Confirm source of wealth remains consistent with profile
☐ Update CRM risk score if new information changes assessment
☐ Review account activity for unusual patterns
☐ Confirm documents not expired (passport validity, visa validity)
☐ Complete and log review in CRM: AMLRecord.eddReviews[]
☐ Compliance Officer sign-off
```

---

### 4.3.6 EDD Interview Questions Template

Where in-person or video verification is conducted (recommended for transactions > AED 10M):

**Client Background:**

1. Can you describe the main source(s) of your income and wealth?
2. Approximately what is your total net worth, and how did you accumulate it?
3. Are you currently or have you ever been in a politically exposed position (government, senior public official, military, judiciary)?
4. Are any of your immediate family members in such positions?

**Transaction-Specific:** 5. Why are you purchasing property in Dubai specifically? 6. How do you intend to fund this specific purchase? 7. Are the funds coming directly from your own account or from a third party? 8. Does anyone else have a beneficial interest in this property? 9. Will the property be used for personal use, rental income, or as a business asset? 10. What is the source of the deposit funds specifically?

**Corporate Clients (if applicable):** 11. Who are the ultimate beneficial owners of the purchasing entity? 12. Is the company actively trading? What is its main business? 13. From which countries does the company derive its revenues? 14. Are there any dormant subsidiaries or holding structures?

**Red Flag Follow-Up (if applicable):** 15. Why do you prefer [payment method]? 16. Can you explain the transfer from [third-party name or entity]? 17. Why is there urgency to complete within [specified timeframe]?

**Outcome:** Document responses in EDD Interview Form (store in CRM AMLRecord).

---

## 5. Politically Exposed Persons (PEP) Procedure

### 5.1 PEP Definition Under UAE Law

Per UAE AML Law No. 20 of 2018, Article 1, and Cabinet Decision No. 10 of 2019:

**A Politically Exposed Person (PEP)** is a natural person who is, or has been, entrusted with prominent public functions, including:

| Category                                        | Examples                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------ |
| Senior government officials                     | Ministers, Deputy Ministers, Secretaries of State                  |
| Senior legislators                              | Members of Parliament, National Assembly, Federal National Council |
| Senior judiciary officials                      | Supreme Court judges, Constitutional Court members                 |
| Senior military officials                       | Generals, Admirals, ranks above Brigadier                          |
| Senior executives of state-owned enterprises    | CEO/Board members of companies with >50% state ownership           |
| Senior officials of international organisations | UN Secretary-General level, World Bank President, etc.             |
| Senior party officials                          | Party leaders, deputy leaders of major political parties           |
| Members of royal families                       | Any member of a recognised royal family (UAE or foreign)           |

**Important UAE Specificity:** Under UAE law, local (domestic) PEPs are treated with the same level of scrutiny as foreign PEPs — unlike some interpretations of FATF guidance that treat domestic PEPs with lighter touch.

**Duration:** A person remains classified as a PEP for **at least 12 months** after leaving their public position. White Caves applies a **24-month** post-departure PEP flag as a conservative measure.

---

### 5.2 Identifying PEPs

**Method 1 — Client Self-Declaration (Mandatory):**

All clients must complete the White Caves Client Declaration Form, which includes:

```
CLIENT PEP DECLARATION (to be completed by all clients)

I confirm that I:
☐ Am NOT a Politically Exposed Person as defined above
☐ AM a Politically Exposed Person (please specify role and country): _________________
☐ Have a close associate or family member who is a PEP (please specify): _______________

I understand that providing false information is a criminal offence under UAE Federal Law.

Name: _______________________  Signature: _______________________  Date: ___________
```

**Method 2 — Automated Screening (Phase 5 target; manual current):**

Approved PEP Screening Databases:
| Database | Provider | Coverage | Update Frequency |
|----------|---------|----------|-----------------|
| World-Check One | Refinitiv (LSEG) | Global, 240+ countries | Real-time updates |
| Dow Jones Risk & Compliance | Dow Jones | Global PEPs + sanctions | Daily updates |
| LexisNexis WorldCompliance | LexisNexis | Global PEPs | Daily updates |
| ComplyAdvantage | ComplyAdvantage | Global, includes adverse media | Real-time |
| UNODC Databases | UNODC | UN sanctions + wanted lists | Regular updates |

**Current (Pre-Phase 5) Manual Process:**

1. Agent enters client name + nationality + DOB into each approved database
2. Agent documents search date and outcome in CRM
3. Any potential match → escalate to Compliance Officer immediately

**Phase 5 Target:** API integration with World-Check One via Refinitiv Screening API embedded in CRM client onboarding workflow.

---

### 5.3 Required Actions When PEP Identified

```
PEP Identified (self-declaration or screening match confirmed)
         │
         ▼
MANDATORY: Escalate to Compliance Officer within 1 business day
         │
         ▼
MANDATORY: EDD triggered (all Section 4.3 requirements apply)
         │
         ▼
MANDATORY: Senior Management (MD) approval required before ANY transaction
         │
         ▼
ONGOING: Quarterly re-screening (not 6-monthly as per standard EDD)
         │
         ▼
ONGOING: Adverse media monitoring (news search monthly minimum)
```

**Additional PEP-Specific Requirements:**

- Source of wealth must specifically address how public position relates to (or does not contribute to) assets being used
- Any conflict of interest with White Caves' business must be evaluated
- PEP relationship flag must remain on CRM record permanently (even after 24-month post-departure removal from EDD level, the flag remains for audit trail)
- Commission arrangements: Standard commission only — no enhanced fees or "facilitation" arrangements for PEP clients

---

### 5.4 Indirect PEPs — Family Members and Close Associates

**Close Family Members of PEPs** (apply PEP-level scrutiny):

- Spouse or civil/domestic partner
- Children and their spouses
- Parents

**Close Associates of PEPs** (apply PEP-level scrutiny where known):

- Natural persons known to have joint beneficial ownership of legal entities or legal arrangements
- Natural persons known to have close business relations with the PEP
- Natural persons who are sole beneficial owners of entities set up for the de facto benefit of the PEP

**Process for Indirect PEPs:**

1. If direct PEP relationship is identified → automatically screen all co-buyers and beneficial owners for PEP connections
2. If indirect PEP status becomes apparent during EDD → upgrade to full PEP procedure
3. Document the nature of the connection in CRM `AMLRecord.pepDetails`

---

### 5.5 PEP Record Keeping Requirements

| Record                  | Content                                   | Storage                       | Retention                |
| ----------------------- | ----------------------------------------- | ----------------------------- | ------------------------ |
| PEP declaration form    | Signed original                           | CRM AMLRecord + physical file | 7 years post-transaction |
| PEP screening results   | Database, date, outcome, reference number | CRM AMLRecord.pepScreening    | 7 years post-transaction |
| EDD Summary Report      | Full report per 4.3.4                     | CRM AMLRecord + secure drive  | 7 years post-transaction |
| MD approval record      | Signed email/form                         | CRM AMLRecord.eddApproval     | 7 years post-transaction |
| Ongoing monitoring logs | Each review date + outcome                | CRM AMLRecord.pepReviews[]    | 7 years post-last review |

---

## 6. Sanctions Screening Procedure

### 6.1 Sanctions Lists — Full Reference

White Caves screens all clients and transactions against the following lists:

| List                                                 | Authority      | URL / Access                                                 | Mandatory?       |
| ---------------------------------------------------- | -------------- | ------------------------------------------------------------ | ---------------- |
| UAE Terrorist List (Cabinet Decision No. 74 of 2020) | UAE Government | uaefiu.gov.ae                                                | ✅ Mandatory     |
| UN Security Council Consolidated List                | United Nations | scsanctions.un.org                                           | ✅ Mandatory     |
| OFAC SDN (Specially Designated Nationals) List       | US Treasury    | ofac.treas.gov/sdn                                           | ✅ Mandatory     |
| OFAC Non-SDN Lists (FSE, NS-MBS, etc.)               | US Treasury    | ofac.treas.gov                                               | ✅ Mandatory     |
| EU Consolidated Financial Sanctions List             | European Union | eeas.europa.eu/cfsp/sanctions                                | ✅ Mandatory     |
| HM Treasury Financial Sanctions (UK)                 | UK Government  | gov.uk/government/organisations/his-majestys-treasury        | ✅ Recommended   |
| Interpol Red Notices                                 | Interpol       | interpol.int (public list)                                   | ✅ For High-Risk |
| World Bank Debarred Entities                         | World Bank     | worldbank.org/projects-operations/procurement/debarred-firms | ✅ For Corporate |
| FATF High-Risk Jurisdictions List                    | FATF           | fatf-gafi.org                                                | Reference only   |

---

### 6.2 Screening Frequency

| Trigger                                    | Who is Screened                                                                 | Action                                |
| ------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------------- |
| Client onboarding (new lead enters CRM)    | Client name, DOB, nationality, any associated entities                          | Full list screen before first contact |
| Before transaction execution               | All parties to transaction (buyer, seller, representatives, corporate officers) | Full list screen                      |
| Annually (all active clients)              | All clients with active relationships or pending transactions                   | Batch re-screen                       |
| When client provides updated identity docs | Client and newly disclosed associates                                           | Re-screen                             |
| When new sanctions lists are updated       | All active clients (automated — Phase 5; manual currently)                      | Targeted batch screen                 |
| Before funds are received                  | Sending party                                                                   | Screen before accepting               |

---

### 6.3 Positive Match — Response Procedure

> ⚠️ **CRITICAL:** Never alert the client to a potential or confirmed sanctions match — this is a criminal tipping-off offence under UAE AML Law.

```
Step 1 — MATCH DETECTED (automated flag or manual identification)
  └── Agent IMMEDIATELY suspends all actions on the transaction
      Do NOT contact client, do NOT confirm or deny any appointment

Step 2 — ESCALATION (within 1 hour of detection)
  └── Agent notifies Compliance Officer directly (in person or phone — NOT email for initial alert)
      Pass: client name, transaction reference, list matched, entry reference

Step 3 — FREEZE (within 2 hours)
  └── Compliance Officer places "SANCTIONS HOLD" status on CRM record
      No funds accepted, no documents signed, no property keys transferred

Step 4 — VERIFICATION (within 4 hours)
  └── Compliance Officer performs full manual match verification:
      ├── Compare: full name (all variants) + DOB + nationality + passport number
      ├── Check: all name spellings, transliterations, aliases listed on sanctions entry
      ├── Determine: True Match / False Positive
      └── Document verification evidence

Step 5a — FALSE POSITIVE CONFIRMED
  └── Document false positive determination with evidence
      Release SANCTIONS HOLD in CRM
      Proceed with standard CDD level
      Record in FalsePositiveLog: { clientId, listChecked, matchedEntry, differentiatingFactors, officerName, date }

Step 5b — TRUE MATCH CONFIRMED
  └── DO NOT proceed with any aspect of the transaction
      DO NOT return funds already held (freeze)
      File SAR with UAE FIU within 24 hours (see Section 7)
      Contact UAE FIU directly for guidance on frozen funds
      Engage regulatory legal counsel within 24 hours
      Record in AMLRecord: { type: 'SANCTIONS_MATCH', listName, entryRef, fiuRef, actionsTaken }
```

---

### 6.4 False Positive Handling Procedure

False positives are common (particularly for common names). The following process prevents delays while maintaining compliance integrity:

**Differentiating Factors (any one of the following may confirm false positive):**

- Date of birth does not match (confirmed different person)
- Nationality does not match and no aliases suggest this nationality
- Passport number confirmed as different person by issuing authority
- Gender different from sanctions entry
- Deceased person on list; client clearly alive with current documents
- Entity: different country of incorporation, different registration number

**Documentation Required for False Positive File:**

```json
{
  "falsePositiveId": "FP-2026-001",
  "clientId": "CRM client reference",
  "screeningDate": "ISO date",
  "listMatched": "List name + entry reference",
  "matchedName": "Name that triggered match",
  "differentiatingFactors": ["DOB mismatch: client 1985-03-15, entry 1962-07-22"],
  "evidenceDocuments": ["passport copy", "DOB verification"],
  "determinedBy": "Compliance Officer name",
  "determinationDate": "ISO date",
  "transactionResumedAt": "ISO date"
}
```

**Review:** All false positives reviewed by MD monthly to identify systematic screening issues.

---

## 7. Suspicious Activity Report (SAR) Procedure

### 7.1 Who Can Identify Suspicious Activity

Any person at White Caves has a **legal obligation** to report suspicion of money laundering or terrorism financing. This includes:

- All licensed real estate agents
- Administrative staff handling documents or payments
- Compliance Officer (may identify through review)
- Managing Director
- IT staff (may identify unusual access patterns)
- Contractors with access to client data

**Important:** Suspicion does not require certainty or evidence of a crime. A **reasonable suspicion** based on facts, circumstances, or behaviour is sufficient to trigger reporting.

---

### 7.2 Internal Reporting Chain

```
Any staff member suspects money laundering / terrorism financing
         │
         ▼
STEP 1: INTERNAL REPORT (within 24 hours of suspicion forming)
  └── Staff member completes Internal Suspicion Report (ISR):
      ├── Their name + role
      ├── Date suspicion identified
      ├── Client name + transaction reference
      ├── Description of suspicious activity or behaviour
      ├── Documents or evidence supporting suspicion
      └── Submit to Compliance Officer (Laila) via secure CRM message or in person

         │
         ▼
STEP 2: COMPLIANCE OFFICER REVIEW (within 2 working days)
  └── Compliance Officer reviews ISR:
      ├── Requests additional information from reporting agent (if needed)
      ├── Reviews CRM history, documents, transaction records
      ├── Runs enhanced sanctions + PEP screening
      └── Makes preliminary determination: Credible / Not Credible

         │
         ▼
STEP 3: INTERNAL INVESTIGATION (maximum 5 working days total)
  └── If Credible:
      ├── Compile all evidence: ISR, transaction records, CDD documents, screening results
      ├── Check for prior SARs involving same client or connected parties
      ├── Review for patterns across multiple transactions
      └── Prepare SAR Investigation Report with recommendation

         │
         ▼
STEP 4: MD REVIEW & DECISION
  └── SAR Investigation Report submitted to MD
      ├── MD + Compliance Officer: jointly decide FILE / NO FILE
      ├── If disagreement: Compliance Officer's view prevails (they bear legal responsibility)
      ├── Document decision + reasoning regardless of outcome
      └── No-file decisions reviewed at next annual AML review

         │
         ▼
STEP 5a: DECISION — NO FILE
  └── Document reasons thoroughly
      Maintain record for 7 years
      Continue monitoring relationship if relationship continues

STEP 5b: DECISION — FILE SAR
  └── Proceed to Section 7.3
```

---

### 7.3 Filing the SAR — UAE FIU goAML System

**Portal:** UAE FIU goAML System — accessible via **uaefiu.gov.ae/en/goaml**

**Deadline:** SAR must be filed within **2 business days** of decision to file (total from initial identification should not exceed 7 calendar days).

**goAML Registration Requirement:** White Caves (DNFB entity) must be registered on the goAML system. Compliance Officer holds login credentials. Backup login credentials held by MD.

**Mandatory Fields in the SAR:**

```
Section 1 — Reporting Institution:
  ├── White Caves Real Estate LLC
  ├── RERA Brokerage License Number
  ├── ORN (Office Registration Number)
  ├── Reporting officer name + direct phone + email
  └── Date of report

Section 2 — Subject of the Report:
  ├── Full legal name (all name variants / aliases known)
  ├── Date of birth
  ├── Nationality/nationalities
  ├── Passport number(s) + issuing country
  ├── UAE residence status + visa details (if applicable)
  ├── Emirates ID number (if UAE resident)
  ├── Known address(es)
  ├── Occupation / business
  └── For entities: registered name, registration number, country, UBOs

Section 3 — Relationship / Transaction:
  ├── Nature of relationship (buyer / seller / tenant / landlord)
  ├── Transaction type (purchase / sale / lease / enquiry)
  ├── Property address and description
  ├── Transaction value (or proposed value)
  ├── Date(s) of transaction or engagement
  ├── Payment method(s) observed
  └── Current status (completed / in progress / abandoned)

Section 4 — Suspicious Activity Description:
  ├── Factual description of what occurred
  ├── Specific indicators that triggered suspicion (reference Section 8 Red Flags)
  ├── Timeline of events
  └── Any explanations offered by the subject and assessment of credibility

Section 5 — Supporting Documents (attachments):
  ├── Copy of client identification documents
  ├── Transaction records
  ├── Communications (emails, WhatsApp records if relevant)
  ├── CDD documents received
  ├── Internal Suspicion Report
  └── SAR Investigation Report
```

**Post-Filing:**

- goAML will issue a reference number — record in `AMLRecord.sarFiuRef`
- UAE FIU may contact White Caves for additional information — respond promptly
- UAE FIU may issue a "no consent to proceed" order — halt all actions if received
- UAE FIU may issue consent to proceed — document receipt and proceed

---

### 7.4 Tipping-Off Prohibition

Under UAE AML Law Article 17:

> It is a **criminal offence** to disclose to the person who is the subject of a SAR, or to any third party, that a SAR has been filed, is being considered, or that a FIU investigation is underway.

**What this means in practice:**

- Do NOT tell the client "we have concerns about your application"
- Do NOT tell the client "we cannot proceed at this time" with any hint of the reason
- Do NOT discuss the SAR with colleagues who do not need to know
- If the client asks why a transaction is delayed, an acceptable response is: "We are completing our standard verification process which is required by regulation"
- Do NOT share SAR records with the client in response to any Subject Access Request (exempt from DSAR disclosure)

**Persons who may know about a SAR (need-to-know basis only):**

- Compliance Officer (primary handler)
- Managing Director (approval)
- External legal counsel engaged specifically for this matter
- UAE FIU (recipient of the SAR)

---

### 7.5 SAR Record Keeping

| Record                          | Content                             | Retention |
| ------------------------------- | ----------------------------------- | --------- |
| Internal Suspicion Report (ISR) | Staff member's original report      | 7 years   |
| SAR Investigation Report        | Compliance Officer's analysis       | 7 years   |
| MD decision record              | Signed decision + reasoning         | 7 years   |
| SAR copy (goAML submission)     | Full text of filed SAR              | 7 years   |
| FIU reference number            | goAML reference                     | 7 years   |
| Post-filing monitoring log      | Actions taken after filing          | 7 years   |
| No-file decisions               | Full documentation of why not filed | 7 years   |

**CRM Storage:** All SAR-related records stored in `AMLRecord` model with `type: 'SAR'`. Access restricted to Compliance Officer + MD roles only. Audit log on every access.

---

### 7.6 Follow-Up Monitoring of Filed SARs

Where a SAR has been filed but the relationship or transaction continues (with FIU consent):

- Transaction elevated to EDD level (if not already)
- 30-day monitoring check after filing
- Quarterly review for 12 months
- Any new suspicious activity triggers immediate new SAR assessment
- Exit relationship at natural conclusion unless FIU directs otherwise

---

## 8. Red Flags Catalogue

The following catalogue contains at least 25 specific red flags relevant to real estate AML. Agents must be trained on all categories. Any identified red flag must be logged in `AMLRecord.redFlagsIdentified[]`.

### 8.1 Property Transaction Red Flags

| #     | Red Flag                                                                                         | Risk Level | Recommended Action                                            | CRM Field                                             |
| ----- | ------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| RT-01 | Client offers significantly more than asking price without clear reason (>10% above)             | HIGH       | EDD; investigate motivation; consider SAR if unexplained      | `AMLRecord.redFlagsIdentified` + note in `Lead.notes` |
| RT-02 | Client requests to purchase in a different name or a name change near completion                 | HIGH       | Refuse unless legitimate reason; EDD; consider SAR            | `AMLRecord.pepEddFlag`                                |
| RT-03 | Client requests property to be deliberately undervalued in SPA/transfer documents                | CRITICAL   | Refuse; immediate SAR filing                                  | `AMLRecord` type: SAR                                 |
| RT-04 | Client proposes adding or removing third parties to the transaction without clear reason         | HIGH       | EDD; KYC all parties; MD approval                             | `AMLRecord.eddRequired`                               |
| RT-05 | Rapid buy-sell (purchase and listing within 6 months) with no apparent investment rationale      | HIGH       | EDD; investigate; monitor for round-tripping                  | `Property.ownedSince` flag                            |
| RT-06 | Client purchases multiple properties simultaneously through different agents/entities            | HIGH       | Consolidate CRM records; EDD; UBO check all entities          | Cross-reference `Client.linkedEntities`               |
| RT-07 | Transaction abandonment specifically after CDD documentation is requested                        | MEDIUM     | Log abandonment reason; SAR consideration; retain all records | `Lead.abandonReason`                                  |
| RT-08 | Unusual interest in specific property without legitimate connection to area or investment thesis | MEDIUM     | Enhanced enquiry; note in CRM                                 | `Lead.notes`                                          |

### 8.2 Client Identity Red Flags

| #     | Red Flag                                                                                                   | Risk Level | Recommended Action                                       | CRM Field                              |
| ----- | ---------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------- | -------------------------------------- |
| CI-01 | Client refuses or is unable to produce standard identity documents                                         | HIGH       | Do not proceed; log refusal                              | `AMLRecord.cddStatus: 'REFUSED'`       |
| CI-02 | Identity documents show signs of alteration (different fonts, inconsistent details, poor quality reprints) | HIGH       | Do not accept; refer to Compliance Officer; consider SAR | `AMLRecord.docVerification: 'SUSPECT'` |
| CI-03 | Client uses multiple names or aliases without clear legal explanation                                      | HIGH       | EDD; request all historical identity documents           | `Client.aliases[]`                     |
| CI-04 | Client is unable to provide consistent details about their background, occupation, or place of residence   | MEDIUM     | EDD; detailed interview; cross-check documents           | `AMLRecord.eddInterview`               |
| CI-05 | Client nationality is from a FATF grey or blacklisted country (Iran, North Korea, Myanmar, etc.)           | HIGH       | Automatic EDD; check FATF current list                   | `Client.riskCountry` flag              |
| CI-06 | Corporate client with complex multi-layer ownership where UBO cannot be identified                         | HIGH       | Refuse transaction if UBO cannot be established; EDD     | `AMLRecord.uboUnidentified`            |
| CI-07 | Client is a legal entity with bearer shares or nominee shareholders                                        | HIGH       | EDD; require UBO declaration; consider refusing          | `AMLRecord.bearerSharesFlag`           |
| CI-08 | Client shares same address, phone, or email with multiple unrelated clients                                | MEDIUM     | Cross-check CRM; investigate connection; EDD             | CRM duplicate detection                |
| CI-09 | Third party acting for client cannot or will not provide authorisation documentation (Power of Attorney)   | HIGH       | Refuse to proceed without valid PoA; EDD on both         | `AMLRecord.poaFlag`                    |

### 8.3 Payment Red Flags

| #     | Red Flag                                                                                            | Risk Level | Recommended Action                                                               | CRM Field                            |
| ----- | --------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------- | ------------------------------------ |
| PA-01 | Client requests or attempts to pay in cash (any amount)                                             | HIGH       | Decline cash payment; log request; EDD; SAR if large amount                      | `AMLRecord.cashPaymentAttempt`       |
| PA-02 | Client requests to pay via cryptocurrency directly to White Caves                                   | HIGH       | Decline; explain White Caves does not accept crypto; log; EDD                    | `AMLRecord.cryptoPaymentAttempt`     |
| PA-03 | Payment received from a third-party account not party to the transaction                            | HIGH       | Return funds; request payment from buyer/client directly; EDD; SAR consideration | `AMLRecord.thirdPartyPayment`        |
| PA-04 | Multiple payments from different accounts just below the AED 55,000 CDD threshold (structuring)     | HIGH       | Treat as single transaction exceeding threshold; SAR filing                      | `AMLRecord.structuringFlag`          |
| PA-05 | Payment from an offshore account in a jurisdiction with no legitimate business connection to client | HIGH       | EDD; verify source; request explanation; SAR consideration                       | `AMLRecord.offshorePayment`          |
| PA-06 | Client requests to overpay and have excess refunded to a different account                          | HIGH       | Refuse; immediate SAR consideration                                              | `AMLRecord.overpaymentRequest`       |
| PA-07 | Late-stage change of payment instructions (different bank, different account holder)                | HIGH       | Pause transaction; verify with known contacts; EDD                               | `AMLRecord.paymentInstructionChange` |
| PA-08 | Use of unusual financial instruments (promissory notes, informal hawala transfers)                  | HIGH       | EDD; legal advice; SAR consideration                                             | `AMLRecord.unusualInstrument`        |

### 8.4 Behavioural Red Flags

| #     | Red Flag                                                                                                                             | Risk Level | Recommended Action                                                              | CRM Field                                  |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------- | ------------------------------------------ |
| BH-01 | Client displays unusual secrecy about the transaction or is unwilling to disclose information standard buyers typically share        | MEDIUM     | EDD; note behaviour; investigate                                                | `Lead.notes` + `AMLRecord.behaviouralFlag` |
| BH-02 | Client shows abnormal urgency to complete the transaction, particularly around year-end or regulatory reporting dates                | HIGH       | Slow down; full EDD; SAR consideration if unexplained                           | `AMLRecord.urgencyFlag`                    |
| BH-03 | Client appears disinterested in property features, price negotiation, or investment return — atypical for genuine property purchaser | HIGH       | EDD; verify genuine investment rationale                                        | `AMLRecord.behaviouralFlag`                |
| BH-04 | Client uses an unusual number of intermediaries, lawyers, or nominees without clear business reason                                  | HIGH       | EDD; KYC all intermediaries; consider SAR                                       | `AMLRecord.multipleIntermediaries`         |
| BH-05 | Client aggressively questions or resists CDD/KYC requirements beyond reasonable privacy concern                                      | MEDIUM     | Note; EDD; if persistent — consider refusing                                    | `AMLRecord.cddResistance`                  |
| BH-06 | Client appears to be acting on instructions from an undisclosed third party                                                          | HIGH       | Identify and KYC the third party; EDD                                           | `AMLRecord.thirdPartyController`           |
| BH-07 | Agent receives referral from unknown or unusual source for very large transaction with minimal prior contact                         | MEDIUM     | EDD; verify referral source                                                     | `Lead.referralSource`                      |
| BH-08 | Client becomes hostile, threatening, or unusually aggressive when compliance procedures are raised                                   | HIGH       | Stop engagement; escalate to MD + Compliance; do NOT proceed; SAR consideration | `AMLRecord.hostileSubjectFlag`             |

---

## 9. Annual AML Risk Review Process

### 9.1 Overview

White Caves must conduct a formal Annual AML Risk Review to demonstrate compliance with UAE AML Law and RERA requirements. The review must be **documented**, **approved**, and **retained** for regulatory inspection.

**Review Period:** 1 January to 31 December (or financial year equivalent)
**Target Completion Date:** 28 February of following year
**Document Output:** Updated AML Risk Assessment (this document, new version)

---

### 9.2 Who Conducts the Review

| Role                                 | Responsibility                                                      |
| ------------------------------------ | ------------------------------------------------------------------- |
| Compliance Officer (Laila)           | Primary conductor; compiles all inputs; drafts updated assessment   |
| Managing Director                    | Approves updated assessment; signs off annual report                |
| Technology Lead (Radia/Daniela)      | Provides system data: screening logs, access logs, CRM statistics   |
| Senior Agents                        | Provide input on emerging client patterns and red flags encountered |
| External Legal Counsel (if retained) | Reviews for regulatory changes and advises on updates               |

---

### 9.3 Input Documents for the Review

```
Required Inputs:
☐ CRM extract: all AML records (risk ratings, EDD approvals, SARs, screening logs)
☐ SAR log: count, FIU references, outcomes where known
☐ False positive log: count and analysis
☐ Training completion register: all staff AML training dates
☐ Sanctions list update log: dates lists were checked/updated
☐ Any RERA circulars or UAE FIU guidance published in the year
☐ FATF mutual evaluation or typologies reports (annual publication)
☐ Any regulatory inspection findings or correspondence
☐ Adverse media incidents involving clients (if any)
☐ Any changes to business model, new products, new client segments
```

---

### 9.4 Review Scope

The Annual Review must assess and update each of the following:

**A. Business Risk Profile:**

- Have new products or services been introduced?
- Have client segments changed (e.g., new source market nationalities)?
- Has transaction volume changed significantly (implying capacity strain)?
- Have any new high-risk jurisdictions been identified by FATF?

**B. Client Risk Register:**

- Are all medium and high-risk clients still correctly rated?
- Are EDD requirements complete for all high-risk clients?
- Are annual rescreening obligations met for all active clients?

**C. Red Flag Effectiveness:**

- Were any red flags identified in the past year? Were they handled correctly?
- Are there emerging typologies from FATF or UAE FIU guidance that require new red flags?

**D. Policies and Procedures:**

- Have changes to UAE AML Law or RERA regulations required policy updates?
- Are staff following the procedures documented here?

**E. Training:**

- Have all staff completed annual AML training?
- Have any training gaps been identified from incidents?

**F. System and Technology:**

- Is the CRM capturing AML data correctly?
- Are Phase 5 (automated screening) deliverables on track?

---

### 9.5 Output — Updated Risk Rating Per Business Line

Following the review, the risk rating for each business line (from Section 3.1) must be reaffirmed or updated:

| Business Line                      | Prior Year Rating | Updated Rating | Rationale for Change |
| ---------------------------------- | ----------------- | -------------- | -------------------- |
| Residential property sales (ready) | Medium            | [Updated]      | [Document reason]    |
| Off-plan property sales            | High              | [Updated]      | [Document reason]    |
| Residential lettings (long-term)   | Low               | [Updated]      | [Document reason]    |
| Commercial leases                  | Medium            | [Updated]      | [Document reason]    |
| Property management                | Low               | [Updated]      | [Document reason]    |
| Mortgage referral                  | Low               | [Updated]      | [Document reason]    |

---

### 9.6 Approval Chain

```
Compliance Officer completes draft Annual AML Risk Review
         │
         ▼
Draft circulated to MD for review (minimum 5 business days for review)
         │
         ▼
MD provides comments → Compliance Officer revises
         │
         ▼
MD formal sign-off: signature + date on cover page
         │
         ▼
Document filed: physical + CRM document vault
         │
         ▼
Prior version archived (do not delete — 7-year retention)
```

---

### 9.7 Regulatory Submission

**RERA Annual Compliance Report:**

- RERA may require submission of an annual compliance declaration confirming AML procedures are in place
- Check RERA portal announcements for annual submission deadline (typically Q1)
- Submit using RERA REST portal (compliance section)
- Retain submission confirmation for 7 years

**UAE FIU Annual Report:**

- DNFBs may be required to submit statistics on CDD, EDD, and SAR activity
- Monitor UAE FIU website for annual reporting requirements
- Compliance Officer responsible for checking requirement by 15 January each year

---

**Document Owner:** Compliance Department (Laila)
**Last Updated:** April 2026 (Version 1.0) — Version 2.0 due: February 2027
**Review Cycle:** Annually + immediately when UAE AML Law or RERA regulations change
**Related:** `business/06_flowcharts/compliance-kyc-aml-flow.md`, `business/08_compliance/rera-compliance-checklist.md`
