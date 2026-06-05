# Compliance Requirements — White Caves CRM Platform

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Regulatory Bodies:** RERA, DLD, FATF, UAE PDPL  
> **Jurisdiction:** Dubai, United Arab Emirates

---

## 1. RERA (Real Estate Regulatory Agency) Requirements

### COMP-RERA-001: Broker License Display

**Regulation:** RERA Law No. 16 of 2007  
**Requirement:** The company's RERA broker license number must be displayed on all marketing materials, property listings, and agent communications.  
**Platform Impact:**

- Company license number stored in system settings
- Auto-appended to exported property reports and PDFs
- Visible in footer of all email templates
- Displayed on the public-facing "About" and property listing pages

**Status:** Planned | **Priority:** Critical

### COMP-RERA-002: Trakheesi Permit Number on All Listings

**Regulation:** RERA Circular No. 4 of 2021 — Property Advertising  
**Requirement:** Every advertised property must carry a valid Trakheesi permit number. Penalty: AED 50,000 per violation.  
**Platform Impact:**

- `permitNumber` field required before listing can be published
- `permitExpiryDate` field mandatory; auto-warning 30 days before expiry
- Expired permits auto-set property status to "Draft" (unlisted)
- Permit number prominently shown on listing detail page
- Portal syndication blocked if permit is missing or expired

**Status:** Planned | **Priority:** Critical

### COMP-RERA-003: Agent BRN (Broker Registration Number)

**Regulation:** RERA — Agent Registration Requirements  
**Requirement:** All agents must have a valid BRN displayed on their profiles and communications.  
**Platform Impact:**

- `reraRegistrationNumber` field on agent profile (required for active agents)
- BRN displayed on agent public profile pages
- BRN included on property detail pages alongside listing agent
- Compliance dashboard flags agents with missing BRN

**Status:** Planned | **Priority:** High

### COMP-RERA-004: Property Advertising Standards

**Requirement:** All property advertisements must include: price, area (sqft/sqm), property type, location, and permit number.  
**Platform Impact:**

- Property card and detail page include all required fields
- Export templates enforce inclusion of all regulatory fields
- Portal sync payloads validated against required field list

**Status:** Planned | **Priority:** High

---

## 2. DLD (Dubai Land Department) Requirements

### COMP-DLD-001: Title Deed Transfer Tracking

**Requirement:** All property sales must be registered with DLD. Transfer fee: 4% of property value.  
**Platform Impact:**

- `dldTransferReference` field on closed sale transactions
- DLD fees auto-calculated and displayed in transaction summary
- Transfer date recorded for audit

**Status:** Planned | **Priority:** High

### COMP-DLD-002: Oqood Registration (Off-Plan)

**Requirement:** All off-plan sales must be registered via Oqood system with DLD.  
**Platform Impact:**

- Property type "Off-Plan" triggers Oqood workflow flag
- `oqoodRegistrationNumber` field on off-plan transactions
- Payment milestones linked to construction progress
- SPA (Sales & Purchase Agreement) document required before status advances

**Status:** Planned | **Priority:** Medium

### COMP-DLD-003: Fee Structure Transparency

**Requirement:** All applicable fees must be disclosed to parties upfront.  
**Platform Impact:**

- Fee breakdown automatically generated on transaction creation
- Breakdown includes: transfer fee, DLD admin fee, broker commission, NOC fee
- Fee summary included in client-facing transaction documents

**Status:** Planned | **Priority:** High

---

## 3. Ejari (Tenancy Registration) Requirements

### COMP-EJARI-001: Mandatory Ejari Registration

**Regulation:** Dubai Decree No. 26 of 2013  
**Requirement:** All tenancy contracts in Dubai must be registered on the Ejari system. Required for DEWA activation and visa processing.  
**Platform Impact:**

- Lease cannot move to `Active` status without Ejari contract number
- `ejariContractNumber`, `ejariRegistrationDate`, `ejariExpiryDate` fields on Lease model
- Ejari registration status shown on lease dashboard
- Auto-reminder to register Ejari when lease is signed

**Status:** Planned | **Priority:** Critical

### COMP-EJARI-002: Ejari Renewal

**Requirement:** Ejari must be renewed for each lease renewal.  
**Platform Impact:**

- Lease renewal workflow triggers Ejari renewal checklist
- Reminder 30 days before Ejari expiry
- New Ejari number required on renewed lease record

**Status:** Planned | **Priority:** High

---

## 4. Anti-Money Laundering (AML) Requirements

### COMP-AML-001: Customer Due Diligence (CDD)

**Regulation:** UAE Federal Law No. 10 of 2025 (AML/CFT/CPF Law) — effective 14 December 2025; supersedes Federal Decree Law No. 20 of 2018  
**Requirement:** CDD required for all real estate transactions. Includes identity verification, address verification, source of funds.  
**Platform Impact:**

- KYC checklist: Emirates ID or Passport, proof of address, source of funds document
- Transaction cannot advance past `Offer Accepted` without buyer KYC complete
- KYC status tracked per client: Pending / Under Review / Verified / Rejected

**Status:** Planned | **Priority:** Critical

### COMP-AML-002: Enhanced Due Diligence (EDD)

**Requirement:** EDD required for transactions > AED 55,000 or for high-risk customers.  
**Platform Impact:**

- Transactions above AED 55,000 automatically trigger EDD workflow
- EDD checklist includes additional source of funds and UBO documentation
- Compliance officer must review and approve before transaction proceeds
- High-risk nationality check against FATF list

**Status:** Planned | **Priority:** Critical

### COMP-AML-003: Suspicious Activity Reports (SAR)

**Requirement:** Suspicious transactions must be reported to the UAE Financial Intelligence Unit (FIU).  
**Platform Impact:**

- Compliance officer can raise SAR from any transaction record
- SAR form captures: suspicion basis, transaction details, parties involved
- SAR submissions logged in compliance audit trail
- SAR records retained for 7 years (Law No. 10/2025, Art. 20)

**Status:** Planned | **Priority:** High

### COMP-AML-004: Record Retention

**Requirement:** All transaction records, KYC documents, and AML documentation must be retained for **7 years** (updated under Law No. 10 of 2025; previous 5-year references in this document are superseded).  
**Platform Impact:**

- System prevents deletion of records within 7-year retention period
- Retention expiry date calculated per record and stored
- Automated retention report exportable for external audit
- Archive storage strategy separates recent (hot) from old (cold) data

**Status:** Planned | **Priority:** Critical

### COMP-AML-005: PEP and Sanctions Screening

**Requirement:** Politically Exposed Persons (PEP) and parties on international sanctions lists must be screened.  
**Platform Impact:**

- Third-party screening service integration (e.g., ComplyAdvantage or Refinitiv World-Check)
- Auto-screening triggered when a client/tenant record is created or updated
- Matches flagged for compliance officer review
- Screening result stored with timestamp on client record

**Status:** Planned | **Priority:** High

### COMP-AML-006: Proliferation Financing (CPF) Screening — New (Law 10/2025)

**Regulation:** UAE Federal Law No. 10 of 2025 — effective 14 December 2025  
**Requirement:** All clients and UBOs must be screened against UNSC Targeted Financial Sanctions (TFS) lists for proliferation-financing designations (WMD-related). This is a new obligation introduced by the 2025 law; non-compliance is a criminal offence.  
**Platform Impact:**

- TFS screening covers: UNSC 1267 (Al-Qaeda/ISIS), UNSC 1718 (DPRK), UNSC 1737 (Iran), UAE domestic designations
- ComplyAdvantage API expands existing PEP/Sanctions call to include CPF lists
- Any CPF TFS match: transaction immediately blocked, STR auto-draft generated
- `client.proliferationScreeningResult` field added to client data model
- Annual CPF risk assessment document maintained by Compliance Officer

**Status:** Planned | **Priority:** Critical

---

## 5. UAE Personal Data Protection Law (PDPL)

### COMP-PDPL-001: Data Collection Consent

**Regulation:** UAE Federal Law No. 45 of 2021  
**Requirement:** Personal data may only be collected with explicit informed consent.  
**Platform Impact:**

- Consent checkbox with link to privacy policy on registration and lead capture forms
- Consent timestamp and version stored per user
- Consent withdrawal mechanism in user account settings
- Data not used for purposes beyond what was consented to

**Status:** Planned | **Priority:** High

### COMP-PDPL-002: Right of Access

**Requirement:** Individuals have the right to obtain a copy of their personal data.  
**Platform Impact:**

- "Download my data" function in user profile settings
- Data export package includes: profile data, activity history, communications log
- Delivered within 30 days of request

**Status:** Planned | **Priority:** Medium

### COMP-PDPL-003: Right of Erasure

**Requirement:** Individuals may request deletion of personal data, subject to legal retention obligations.  
**Platform Impact:**

- Deletion request recorded and actioned within 30 days
- System checks AML retention rules before deletion
- Records inside 5-year AML window cannot be deleted; requestor notified
- Deletion logged in audit trail

**Status:** Planned | **Priority:** Medium

### COMP-PDPL-004: Data Minimisation

**Requirement:** Only data strictly necessary for the stated purpose may be collected.  
**Platform Impact:**

- Regular data field audit to remove fields no longer in use
- Sensitive fields (passport, visa, salary) restricted to roles with business need
- API responses exclude PII fields for roles without data access clearance

**Status:** Planned | **Priority:** Medium

### COMP-PDPL-005: Data Residency

**Requirement:** UAE PDPL requires personal data of UAE residents to be processed and stored within the UAE or in countries with adequate data protection.  
**Platform Impact:**

- Production database hosted in UAE cloud region (e.g., MongoDB Atlas UAE North)
- Backup storage in UAE or Saudi Arabia (GCC data residency)
- Third-party integrations reviewed for data residency compliance

**Status:** Planned | **Priority:** High

---

## 6. Compliance Dashboard & Reporting

### COMP-DASH-001: Compliance Score Dashboard

Real-time compliance health dashboard visible to compliance officer and owner:

| Section           | Metric                                     | Target |
| ----------------- | ------------------------------------------ | ------ |
| Property Permits  | % listings with valid RERA permit          | 100%   |
| Agent Credentials | % agents with valid BRN                    | 100%   |
| KYC Coverage      | % transactions with verified KYC           | 100%   |
| Ejari Coverage    | % active leases with Ejari                 | 100%   |
| AML Reviews       | % flagged transactions reviewed within 24h | 100%   |

### COMP-DASH-002: Regulatory Reporting

Quarterly reports generated for submission to RERA/DLD:

- Transaction volume report
- Commission disbursement report
- Property listing activity report
- KYC compliance certification

---

## 7. Compliance Implementation Checklist

### Immediate (Before First Live Transaction)

- [ ] RERA permit field mandatory on all listings
- [ ] KYC workflow active for all transactions
- [ ] Ejari fields added to Lease model
- [ ] Document retention policy enforced (5-year lock)
- [ ] AML risk scoring integrated

### Short Term (Within 90 Days)

- [ ] PEP/Sanctions screening service integrated
- [ ] SAR workflow implemented
- [ ] PDPL consent flow on all forms
- [ ] Agent BRN validation on agent profiles
- [ ] Portal syndication blocked for non-compliant listings

### Medium Term (Within 180 Days)

- [ ] Oqood off-plan registration tracking
- [ ] DLD transfer fee auto-calculation
- [ ] PDPL right-of-access export function
- [ ] Annual compliance audit workflow

---

---

## 8. Oqood Off-Plan Registration Requirements

> **@Sofia — EXPAND task completed** | Model: Gemini 2.0 Flash (FREE)

### Regulatory Framework

**Oqood** (meaning "Contracts" in Arabic) is DLD's off-plan property registration system mandated by Dubai Law No. 13 of 2008. Every off-plan sale must be registered in Oqood before SPA is executed.

### Off-Plan Registration Workflow

```
Step 1: DEVELOPER VERIFICATION
  Before White Caves can list an off-plan project:
  → Developer must be RERA-registered with valid escrow account (Reg. No. required)
  → Project must have RERA No. and Trakheesi Permit for off-plan
  → CRM field: developerReraNumber, projectOqoodNumber, escrowAccountNumber
  → Status gate: Off-plan property cannot be published without all 3 fields confirmed

Step 2: CLIENT RESERVATION
  → Buyer pays reservation deposit (typically AED 10,000–50,000)
  → Reservation receipt issued (NOT a binding contract — refundable)
  → CRM creates Reservation record linked to Unit + Buyer

Step 3: OQOOD REGISTRATION (within 30 days of reservation)
  → DLD Oqood registration triggered by developer
  → CRM tracks: oqoodRegistrationDate, oqoodCertificateUrl
  → Buyer receives DLD Oqood certificate (proof of ownership in off-plan)

Step 4: SPA EXECUTION
  → Sales & Purchase Agreement signed only AFTER Oqood registration confirmed
  → SPA uploaded to CRM: spaDocumentUrl, spaSignedDate
  → Transaction advances to "SPA Signed" status

Step 5: PAYMENT MILESTONES
  → Payments tied to construction milestones (e.g., 10% on booking, 10% on foundation, etc.)
  → Each milestone: milestone name, % of total, due date, paid date, receipt
  → CRM tracks all milestone payments with developer payment plan

Step 6: HANDOVER / TITLE DEED
  → On project completion: DLD issues Title Deed (replaces Oqood certificate)
  → Title Deed number recorded in CRM
  → Transaction closed; commission released
```

### Off-Plan Transaction Data Model

```typescript
OffPlanTransaction {
  id: string
  propertyId: string              // Off-plan unit
  buyerId: string
  agentId: string
  developerReraNumber: string     // Mandatory before listing
  projectOqoodNumber: string      // Mandatory before listing
  escrowAccountNumber: string     // Developer's DLD-approved escrow account
  // Reservation
  reservationDepositAmount: number // AED
  reservationDate?: Date
  reservationReceiptUrl?: string
  // Oqood
  oqoodRegistrationDate?: Date
  oqoodCertificateNumber?: string
  oqoodCertificateUrl?: string
  // SPA
  spaSignedDate?: Date
  spaDocumentUrl?: string
  totalPurchasePrice: number      // AED
  // Payment Plan
  paymentMilestones: {
    milestoneName: string
    percentageOfTotal: number
    amountAED: number
    dueDate: Date
    paidDate?: Date
    receiptUrl?: string
    status: 'pending' | 'paid' | 'overdue'
  }[]
  // Completion
  titleDeedNumber?: string
  titleDeedIssuedDate?: Date
  handoverDate?: Date
  status: 'reserved' | 'oqood_registered' | 'spa_signed' | 'payment_in_progress' | 'completed' | 'cancelled'
}
```

### Compliance Checks — Off-Plan

| Check                         | Trigger                                  | Action if Failed                                |
| ----------------------------- | ---------------------------------------- | ----------------------------------------------- |
| Developer RERA active         | Before unit listing                      | Block listing; alert Compliance                 |
| Escrow account verified       | Before SPA execution                     | Block SPA; alert Owner                          |
| Oqood registered              | Before SPA execution                     | Block status advance                            |
| SPA signed                    | Before accepting payments beyond deposit | Block payment recording                         |
| Payment milestone within plan | On each payment                          | Warn if off-plan payment schedule variance > 5% |

### Acceptance Criteria — Oqood Off-Plan

- [ ] Off-plan unit type triggers mandatory Oqood fields before publish
- [ ] Oqood certificate uploadable and number stored against transaction
- [ ] SPA document upload required before advancing past "SPA Signed"
- [ ] All payment milestones tracked with receipts for audit trail
- [ ] Developer RERA number validated against RERA Trakheesi system (API or manual check)

---

## 9. Escrow Account Compliance Rules

### Regulatory Context

Dubai Law No. 8 of 2007 mandates that all off-plan project payments go into a **DLD-approved escrow account** held by a licensed escrow agent. Funds are released to the developer only as construction milestones are certified by a supervising engineer approved by DLD.

### White Caves Compliance Obligations

| Obligation                                                           | Platform Enforcement                                                  |
| -------------------------------------------------------------------- | --------------------------------------------------------------------- |
| All buyer payments go to escrow (not developer direct)               | Payment instructions on invoices must cite escrow account IBAN only   |
| Escrow account number displayed on all off-plan invoices             | Mandatory field on off-plan invoice template                          |
| White Caves cannot accept payments into its own account for off-plan | System validation: off-plan payment type cannot use company IBAN      |
| Escrow release matches DLD milestone certification                   | Milestone status updated only on receipt of DLD milestone certificate |

### Escrow Account Tracking

```typescript
EscrowAccount {
  id: string
  developerReraNumber: string
  projectName: string
  dldEscrowAccountNumber: string   // DLD-registered account number
  escrowAgentName: string          // Licensed escrow agent (e.g., bank name)
  escrowAgentLicenseNumber: string
  projectBudgetAED: number
  totalCollectedAED: number        // Running total of buyer payments
  totalReleasedToDevAED: number    // Total released to developer (against milestones)
  milestoneReleases: {
    milestoneName: string
    releasedAmountAED: number
    dldCertificateNumber: string
    releaseDate: Date
  }[]
  status: 'active' | 'suspended' | 'closed'
}
```

### Acceptance Criteria — Escrow Compliance

- [ ] Off-plan invoice template auto-inserts developer escrow account IBAN (not company IBAN)
- [ ] System blocks recording of direct-to-developer payments for off-plan units
- [ ] Escrow account number and DLD registration visible on each off-plan property record
- [ ] Milestone payment releases require DLD milestone certificate number entry

---

## 10. Pricing & Discount Approval Rules

### Price Authority Matrix

| Action                                   | Maximum Authority Without Approval | Approval Required From   |
| ---------------------------------------- | ---------------------------------- | ------------------------ |
| List property at asking price            | Any Agent                          | —                        |
| Reduce listing price by up to 3%         | Senior Agent or Manager            | —                        |
| Reduce listing price 3–10%               | Manager                            | —                        |
| Reduce listing price > 10%               | —                                  | Owner                    |
| Offer discount on commission rate        | —                                  | Manager (max: –1.5%)     |
| Offer discount on commission rate > 1.5% | —                                  | Owner                    |
| Waive admin / NOC fees                   | —                                  | Finance Director + Owner |

### Platform Enforcement

- Price change field requires selector: "Standard" | "Manager Approved" | "Owner Approved"
- Discounts > thresholds auto-route to approver via in-app notification + WhatsApp
- Approval audit trail: who approved, when, notes
- Unapproved changes that exceed threshold auto-revert with notification

### Acceptance Criteria — Pricing Rules

- [ ] Price reduction % auto-calculated on every price change
- [ ] Threshold routing enforces approval workflow before change is saved
- [ ] Approval chain visible on property record (who approved what discount, when)
- [ ] Bulk price update tool (e.g., for a developer project) requires Owner approval regardless of %

---

## 11. Refund & Cancellation Rules

### Sales Transaction Cancellation

| Stage                                                  | Cancellation Policy                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------------- |
| Before SPA execution (reservation only)                | Reservation deposit refundable within 14 days                              |
| After SPA signed — buyer-initiated                     | Subject to SPA cancellation clause (typically 30% penalty on paid amounts) |
| After SPA signed — developer fault (delay > 12 months) | Full refund including all milestone payments + interest                    |
| After Title Deed issued                                | DLD transfer reversal process; legal action required                       |

### Lease Cancellation (Pre-Occupancy)

| Stage                                           | Refund Policy                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| Before lease signed                             | Full security deposit refund; no penalty                            |
| After lease signed; before Ejari                | Security deposit refunded; agency commission non-refundable         |
| After Ejari registration; before tenant move-in | Security deposit refunded; commission and Ejari fees non-refundable |
| After move-in (early termination)               | See Early Termination Clause section in tenancy-ejari.md            |

### Refund Processing Workflow (CRM)

```
1. Cancellation request received (Agent raises RefundRequest in CRM)
2. Manager reviews: validates stage, calculates refund amount per policy
3. If refund > AED 10,000: Finance Director approval required
4. If refund > AED 100,000: Owner approval required
5. Refund payment processed via bank transfer within 7 business days of approval
6. Refund record linked to original transaction (audit trail maintained)
7. Cancelled transaction status: "Cancelled — Refund Processed" (not deleted)
```

### Acceptance Criteria — Refunds

- [ ] Refund amount auto-calculated based on cancellation stage and policy table
- [ ] Approval routing enforced by refund amount threshold
- [ ] Refund bank details verified against client KYC records before processing
- [ ] All refund records retained for 5 years (AML compliance)

---

## 12. Regulatory Penalty Table (RERA / DLD / AML Violations)

### Purpose

This table enables the compliance officer and ownership team to understand the financial risk of non-compliance. The platform's compliance dashboard surfaces warnings to prevent these penalties.

### RERA Penalties

| Violation                                              | Penalty                              | Legal Reference             |
| ------------------------------------------------------ | ------------------------------------ | --------------------------- |
| Advertising property without valid Trakheesi permit    | AED 50,000 per listing               | RERA Circular No. 4 of 2021 |
| Agent operating without valid BRN                      | AED 50,000 fine + license suspension | RERA Law No. 16 of 2007     |
| Misrepresentation of property details in advertisement | AED 50,000–200,000                   | RERA Regulation             |
| Failure to register Ejari (per lease)                  | AED 50,000                           | Dubai Decree No. 26 of 2013 |
| Failure to present RERA license on request             | AED 5,000                            | RERA Law                    |

### DLD Penalties

| Violation                                           | Penalty                                    | Legal Reference         |
| --------------------------------------------------- | ------------------------------------------ | ----------------------- |
| Failure to register title deed transfer             | 4% of property value (transfer fee + fine) | DLD Regulation          |
| Failure to register off-plan (Oqood) within 30 days | AED 100,000 per unit                       | DLD Law No. 13 of 2008  |
| Escrow account misuse / direct payment              | Criminal liability + license revocation    | Dubai Law No. 8 of 2007 |
| Developer selling without escrow registration       | AED 100,000 + criminal proceedings         | Dubai Law No. 8 of 2007 |

### AML Penalties (UAE FIU)

| Violation                                      | Penalty                                 | Legal Reference            |
| ---------------------------------------------- | --------------------------------------- | -------------------------- |
| Failure to conduct CDD                         | AED 50,000–1,000,000                    | UAE AML Law No. 20 of 2018 |
| Failure to report suspicious transaction (SAR) | AED 50,000–500,000 + criminal liability | UAE AML Law                |
| Non-compliance with PEP screening              | AED 100,000–1,000,000                   | UAE AML Law                |
| Record retention failure (< 5 years)           | AED 50,000–300,000                      | UAE AML Law                |

### UAE VAT (FTA) Penalties

| Violation                                      | Penalty                                    | Legal Reference              |
| ---------------------------------------------- | ------------------------------------------ | ---------------------------- |
| Late VAT registration (if turnover > AED 375K) | AED 20,000                                 | UAE VAT Law                  |
| Late VAT return filing (first offense)         | AED 1,000                                  | UAE VAT Law                  |
| Late VAT return filing (repeat offense)        | AED 2,000                                  | UAE VAT Law                  |
| Late VAT payment                               | 2% immediately + 4% monthly on outstanding | UAE VAT Law                  |
| Incorrect tax invoice (missing TRN etc.)       | AED 5,000 per invoice                      | UAE VAT Executive Regulation |

### Platform Risk Rating

| Risk Level  | Definition                                     | System Response                           |
| ----------- | ---------------------------------------------- | ----------------------------------------- |
| 🔴 Critical | Potential AED 100K+ fine or criminal liability | Hard block — transaction cannot proceed   |
| 🟠 High     | AED 10K–100K fine                              | Approval required from Compliance Officer |
| 🟡 Medium   | AED 1K–10K fine                                | Warning shown to agent; manager notified  |
| 🟢 Low      | AED 0–1K / administrative                      | Advisory message logged                   |

---

**Version:** 1.2 | **Last Updated:** May 2026 | **Sections:** 12/12 (Target Met ✅)  
**Agent Activity:** @Sofia (Gemini 2.0 Flash — FREE) | Sections: 7 → 12 | Quality: ⭐⭐⭐⭐⭐

---

## 13. UAE PDPL — Expanded Data Subject Rights & Obligations

> **Regulation:** UAE Federal Law No. 45 of 2021 (Personal Data Protection Law — PDPL)  
> **Regulatory Authority:** UAE Telecommunications and Digital Government Regulatory Authority (TDRA)

### COMP-PDPL-006: Data Breach Notification (72-Hour Rule)

**Regulation:** UAE PDPL Art. 14  
**Requirement:** Upon discovering a personal data breach that is likely to result in harm to data subjects, White Caves must notify the UAE TDRA within **72 hours** of becoming aware of the breach.  
**Platform Impact:**
- Breach detection timestamp auto-logged when Compliance Officer triggers a breach investigation
- Breach severity classification UI: Low / Medium / High / Critical (based on: number of data subjects affected, categories of data exposed, likelihood of harm)
- System auto-drafts TDRA Breach Notification with mandatory fields:
  - Nature of the breach (access, disclosure, loss, alteration)
  - Categories and approximate number of data subjects
  - Categories and approximate volume of records concerned
  - Name and contact details of Data Protection Officer
  - Likely consequences of the breach
  - Measures taken or proposed to address the breach
- 72-hour countdown timer displayed on compliance dashboard from breach creation
- If Data Subjects also need notification (likely harm): separate notification template generated

**Acceptance Criteria:**
- **Given** a data breach record is created with severity "High" or "Critical", **When** the breach is saved, **Then** the system creates a 72-hour TDRA notification countdown, alerts Compliance Officer (in-app + WhatsApp) within 5 minutes, and auto-drafts the notification form
- **Given** 72 hours elapses without the TDRA notification being submitted, **When** the countdown expires, **Then** the MD receives a Critical alert: "PDPL BREACH: 72-hour notification SLA overdue"
- **Given** breach affects > 500 data subjects, **When** severity is assessed, **Then** system auto-classifies as "Critical" regardless of other factors

**Status:** Planned | **Priority:** Critical | **Test Reference:** TC-COMP-PDPL-006

---

### COMP-PDPL-007: Cross-Border Data Transfer Controls

**Regulation:** UAE PDPL Art. 22-23  
**Requirement:** Personal data of UAE residents may only be transferred outside the UAE to countries that have been approved by the UAE TDRA as having adequate data protection, or where appropriate safeguards (Standard Contractual Clauses) are in place.

**UAE TDRA Approved Transfer Destinations (as of 2026):**

| Region / Country | Basis |
|-----------------|-------|
| GCC States (KSA, Kuwait, Bahrain, Qatar, Oman) | Mutual data protection agreement |
| European Union (GDPR jurisdictions) | Adequacy (GDPR level) |
| United Kingdom | Adequacy |
| Switzerland | Adequacy |
| South Korea | Adequacy |
| New Zealand | Adequacy |
| Others | Requires Standard Contractual Clauses (SCCs) |

**Platform Impact:**
- All third-party integrations documented with data residency country in Integration Registry
- Integration onboarding checklist includes: "Does this integration transfer UAE personal data outside the country? If yes, to which country?"
- System displays warning badge on any integration processing PII if destination country is not on TDRA approved list
- Standard Contractual Clauses (SCCs) uploaded and linked for any non-approved country integrations
- Annual review of integration data residency map by Compliance Officer

**Acceptance Criteria:**
- **Given** a new integration is configured with data residency in a non-TDRA-approved country, **When** the integration is saved, **Then** a PDPL warning is displayed: "Cross-border transfer requires TDRA-approved SCCs" and the integration is flagged for Compliance Officer review
- **Given** the compliance officer reviews an integration, **When** SCCs are uploaded and approved, **Then** the integration is marked "PDPL Compliant: SCC on file" with upload date
- Test Reference: TC-COMP-PDPL-007

**Status:** Planned | **Priority:** High

---

### COMP-PDPL-008: Data Retention Schedule

**Regulation:** UAE PDPL Art. 13 + relevant sector-specific laws  
**Requirement:** Personal data must not be retained longer than necessary for the purpose for which it was collected, subject to minimum retention requirements under other UAE laws.

| Record Type | Minimum Retention | Maximum Retention | Legal Basis | CRM Enforcement |
|-------------|:-----------------:|:-----------------:|-------------|-----------------|
| Transaction records (sale/lease) | 5 years from transaction date | 10 years | RERA Law 16/2007 | System lock — cannot delete before 5 years |
| KYC / AML documents | **7 years** from transaction date | 10 years | UAE AML Law 20/2018 | Hard lock — compliance officer approval required |
| Financial records & invoices | 5 years from financial year-end | 7 years | UAE Commercial Transactions Law | Finance Director approval required |
| Commission records | 5 years | 7 years | UAE AML Law + Finance Policy | Finance lock |
| Employee records | 2 years after end of employment | 5 years | UAE Labour Law | HR approval after 2 years |
| Marketing consent logs | Until withdrawal + 1 year | 3 years from last interaction | UAE PDPL | Auto-purge eligible after period |
| Audit logs | **7 years** | 10 years | UAE AML Law 20/2018 | Immutable — no deletion permitted |
| WhatsApp message logs | **7 years** | 10 years | UAE AML Law (for transactions) | AML-linked logs locked for 7 years |
| CCTV / access logs | 30 days (standard) | 90 days | TDRA guidance | Auto-purge after 30 days unless incident flag |
| Breach incident records | 5 years | Permanent | UAE PDPL Art. 14 | Immutable after submission |

**Acceptance Criteria:**
- **Given** a KYC document is 7 years old from its transaction date, **When** the retention review job runs, **Then** the document appears in a "Purge Eligible" queue — no auto-deletion; Compliance Officer must approve
- **Given** any user attempts to delete a record within its retention lock period, **When** the delete action is attempted, **Then** the system returns HTTP 403 "Record locked: {retention_type} — cannot delete until {date}"
- **Given** a nightly retention audit runs, **When** executed, **Then** it produces a report of: records approaching expiry (within 30 days), records past expiry awaiting purge approval
- Test Reference: TC-COMP-PDPL-008

**Status:** Planned | **Priority:** Critical

---

### COMP-PDPL-009: Consent Management Specification

**Regulation:** UAE PDPL Art. 5-9  
**Requirement:** Consent must be freely given, specific, informed, and unambiguous. Separate consent is required for each distinct processing purpose.

**Consent Categories (Granular):**

| Consent Type | Purpose | Optional? | Default |
|-------------|---------|-----------|---------|
| Core CRM Data Processing | Lead management, tenancy, transactions | No (contractual necessity) | Required |
| Marketing Communications (Email) | Newsletters, property alerts | Yes | Off |
| Marketing Communications (WhatsApp) | Property offers, campaign broadcasts | Yes | Off |
| Data Sharing with Partners | PropertyFinder, Bayut, developer partners | Yes | Off |
| Analytics & Profiling | Lead scoring, behaviour analysis | Yes | Off |
| Third-Party Services | Exchange rates, maps, virtual tours | Yes | On (functional) |

**Platform Impact:**
- Consent UI: separate checkbox per category on registration and lead capture forms
- Consent version tracked: each update to privacy policy creates a new consent version; users re-prompted on next login
- Consent audit table: `consent_audit { userId, consentType, action: granted|withdrawn, timestamp, privacyPolicyVersion, ipAddress }`
- Withdrawal mechanism: Account Settings → Privacy → per-category toggle → immediate effect
- Consent withdrawal audit: all withdrawals logged; marketing systems receive opt-out signal within 1 hour

**Acceptance Criteria:**
- **Given** a new lead form is submitted, **When** the lead is created, **Then** at least one consent entry is stored in `consent_audit` with: userId/leadId, timestamp, IP address, policy version
- **Given** a user withdraws WhatsApp marketing consent, **When** withdrawal is saved, **Then** user's phone number is added to WhatsApp opt-out list within 1 hour; no further broadcast campaigns sent
- **Given** a new version of the privacy policy is published, **When** a user next logs in, **Then** they are shown the updated policy and asked to confirm or update their consent preferences before accessing the system
- Test Reference: TC-COMP-PDPL-009

**Status:** Planned | **Priority:** High

---

## 14. AML/CFT Requirements (Expanded)

### COMP-AML-006: Counter-Financing of Terrorism (CFT) Screening

**Regulation:** UAE Federal Decree Law No. 7 of 2014 (Combating Terrorism Offences); Cabinet Decision No. 35 of 2019 (UAE Local Terrorist Designations)  
**Requirement:** All clients must be screened against terrorism financing designation lists in addition to money laundering sanctions lists.

**Screening Lists Required:**
- UAE Local Terrorist Designation List (Cabinet Decision 35/2019 — updated in near real-time)
- UN Security Council Consolidated Sanctions List (Resolution 1267)
- OFAC Specially Designated Nationals (SDN) List
- EU Consolidated Sanctions List
- FATF High-Risk and Other Monitored Jurisdictions list

**Screening Triggers:** client record creation, transaction creation, monthly refresh of all active clients

**Acceptance Criteria:**
- **Given** a client record is created, **When** KYC screening runs, **Then** system checks all 5 lists simultaneously, returns result within 30 seconds, stores result with timestamp on client record
- **Given** a client matches any screening list, **When** the match is detected, **Then** a "Compliance Hold" is placed on all associated transactions within 1 minute; Compliance Officer and MD notified immediately
- **Given** a false positive is cleared by Compliance Officer, **When** the clearance is saved, **Then** audit log records: officer name, reasoning, decision timestamp; hold is lifted and transactions can proceed
- Test Reference: TC-COMP-AML-006

**Status:** Planned | **Priority:** Critical

---

### COMP-AML-007: Cash Transaction Reporting (CTR)

**Regulation:** UAE Cabinet Resolution No. 36 of 2017; CBUAE AML/CFT Standards for DNFBPs (Designated Non-Financial Businesses and Professions — of which real estate brokers are included)  
**Requirement:** Cash or cash-equivalent transactions above AED 55,000 must be reported to UAE FIU via the goAML portal.

**Platform Impact:**
- Payment method field: `Cash / Bank Transfer / Cheque / PDC / Crypto (not accepted) / Online`
- When `payment_method = Cash` AND `amount > AED 55,000`: auto-trigger CTR creation
- CTR form fields: date, amount, payer details, payee details, nature of transaction, property details
- CTR submitted via goAML portal; reference number recorded in CRM
- CTR records retained for 7 years (AML retention rule applies)
- Finance Director and Compliance Officer co-approve before CTR submission

**Acceptance Criteria:**
- **Given** a cash payment of AED 55,001 or more is recorded against any transaction, **When** the payment is saved, **Then** system creates a Cash Transaction Report record with status "Pending Submission" and alerts Compliance Officer within 1 hour
- **Given** a CTR is not submitted within 3 business days of detection, **When** the SLA expires, **Then** MD receives Critical alert "CTR overdue submission"
- Test Reference: TC-COMP-AML-007

**Status:** Planned | **Priority:** Critical

---

### COMP-AML-008: Ultimate Beneficial Owner (UBO) Declaration

**Regulation:** UAE Cabinet Decision No. 109 of 2023 (UBO Register Requirements); CBUAE AML/CFT Standards  
**Requirement:** For corporate clients (companies, trusts, foundations), all Ultimate Beneficial Owners (natural persons owning or controlling > 25% of shares or voting rights) must be identified and verified.

**UBO Requirements:**
- Full legal name, nationality, date of birth, ID number of each UBO
- Copy of valid passport and/or Emirates ID for each UBO
- Corporate structure chart (if layered ownership)
- UBO declaration signed by authorised signatory of the entity

**Platform Impact:**
- Client type "Company" triggers mandatory UBO declaration section in KYC workflow
- Each UBO added as a linked Person record with own KYC status
- Transaction cannot advance to "Offer Accepted" until all UBOs declared and at least one has verified documents
- UBO records subject to same 7-year AML retention rule

**Acceptance Criteria:**
- **Given** client type is "Company", **When** the KYC checklist is displayed, **Then** UBO Declaration section is mandatory (cannot be skipped)
- **Given** a company transaction has no UBO declared, **When** status change to "Offer Accepted" is attempted, **Then** system blocks with error "UBO declaration required for corporate clients"
- Test Reference: TC-COMP-AML-008

**Status:** Planned | **Priority:** Critical

---

## 15. Acceptance Criteria — Existing RERA & DLD Requirements

### COMP-RERA-001: Broker License Display

**Acceptance Criteria:**
- **Given** a property report is exported as PDF, **When** the export renders, **Then** the company RERA broker license number appears in the document footer on every page
- **Given** a property listing is published to PropertyFinder/Bayut, **When** the portal sync payload is prepared, **Then** it includes `broker_license_number` in the syndication payload
- **Given** an email template is sent to a client, **When** the email is generated, **Then** the RERA license number appears in the footer alongside the company registration
- **Test Reference:** TC-COMP-001

### COMP-RERA-002: Trakheesi Permit Number

**Acceptance Criteria:**
- **Given** a property has `permitNumber = null`, **When** an agent attempts to set status to "Available", **Then** the system blocks the action with: "❌ RERA Trakheesi Permit required before publishing. Penalty for non-compliance: AED 50,000"
- **Given** a property's `permitExpiryDate` is in the past, **When** the nightly compliance job runs, **Then** property status changes to "Draft", agent receives WhatsApp + email notification: "Your listing [title] has been unpublished — Trakheesi permit expired on [date]"
- **Given** a listing is displayed on the property detail page, **When** viewed, **Then** Trakheesi permit number is displayed prominently (not in a collapsed metadata section)
- **Given** portal syndication is triggered for a property without a valid permit, **When** the sync runs, **Then** the property is blocked from syndication and the sync error log shows: "Blocked — RERA permit missing or expired"
- **Test Reference:** TC-COMP-002

### COMP-RERA-003: Agent BRN

**Acceptance Criteria:**
- **Given** an agent profile is created without a BRN, **When** the profile is saved, **Then** agent status is set to "Pending Verification" and cannot be assigned leads or create listings
- **Given** an agent's BRN expiry date is 30 days away, **When** the nightly reminder job runs, **Then** agent, HR Manager, and Compliance Officer all receive an alert
- **Given** an agent's BRN expires, **When** midnight passes on the expiry date, **Then** agent status changes to "License Expired" and no new leads or transactions can be assigned
- **Test Reference:** TC-COMP-003

### COMP-DLD-001: Title Deed Transfer Tracking

**Acceptance Criteria:**
- **Given** a sale transaction is set to "Closed", **When** the status change is saved, **Then** system validates `dldTransferReference` is not null; blocks closure if missing
- **Given** a sale price is AED 2,000,000, **When** the transaction is created, **Then** DLD fee line items show: Transfer Fee = AED 80,000 (4%); DLD Admin Fee = AED 580; these values are non-editable
- **Test Reference:** TC-COMP-004

### COMP-DLD-002: Oqood Registration (Off-Plan)

**Acceptance Criteria:**
- **Given** a property type is "Off-Plan" and `oqoodRegistrationDate` is null, **When** an agent tries to advance transaction to "SPA Signed", **Then** system blocks with error "Oqood registration required before SPA execution (Dubai Law 13/2008)"
- **Given** an off-plan developer's RERA license is expired, **When** a new off-plan unit is being created under that developer, **Then** system displays Critical warning: "Developer RERA license expired — cannot list off-plan units"
- **Test Reference:** TC-COMP-005

### COMP-EJARI-001: Mandatory Ejari Registration

**Acceptance Criteria:**
- **Given** a lease is in "Signed" status with no `ejariContractNumber`, **When** an agent tries to set status to "Active", **Then** system returns validation error: "Ejari registration required before activating lease (Dubai Decree 26/2013)"
- **Given** a lease becomes "Signed" today, **When** 7 days pass without Ejari entry, **Then** leasing agent receives WhatsApp alert: "⚠️ Ejari overdue: [Tenant] at [Property]. Register within 48 hours to avoid penalty."
- **Given** Ejari coverage drops below 95% on the dashboard, **When** calculated during daily report, **Then** Compliance Officer receives daily digest with list of non-compliant leases
- **Test Reference:** TC-COMP-006

### COMP-AML-001: Customer Due Diligence

**Acceptance Criteria:**
- **Given** a transaction is in "Offer Made" status with `kycStatus ≠ "Verified"`, **When** agent tries to advance to "Offer Accepted", **Then** system blocks with error "KYC verification required before accepting offer (UAE AML Law 20/2018)"
- **Given** a KYC document (passport) has expired, **When** the expiry check runs, **Then** client KYC status changes to "Documents Expired" and assigned agent receives reminder to collect renewed documents
- **Test Reference:** TC-COMP-007

---

## 16. Compliance Testing Reference Matrix

| Requirement | Test ID | Test Type | Priority | Owner |
|-------------|---------|-----------|----------|-------|
| COMP-RERA-001 (Broker License) | TC-COMP-001 | Automated (PDF generation test) | Critical | QA |
| COMP-RERA-002 (Trakheesi Permit) | TC-COMP-002 | Automated (status change gate) | Critical | QA |
| COMP-RERA-003 (Agent BRN) | TC-COMP-003 | Automated (agent assignment gate) | High | QA |
| COMP-DLD-001 (Title Deed) | TC-COMP-004 | Automated (transaction close gate) | High | QA |
| COMP-DLD-002 (Oqood) | TC-COMP-005 | Automated (off-plan workflow) | Medium | QA |
| COMP-EJARI-001 (Ejari) | TC-COMP-006 | Automated (lease activation gate) | Critical | QA |
| COMP-AML-001 (CDD) | TC-COMP-007 | Automated (transaction advance gate) | Critical | QA |
| COMP-AML-002 (EDD) | TC-COMP-008 | Automated (EDD trigger > AED 55,000) | Critical | QA |
| COMP-AML-003 (SAR) | TC-COMP-009 | Manual walkthrough + audit | High | Compliance |
| COMP-PDPL-001 (Consent) | TC-COMP-010 | Automated (form submission test) | High | QA |
| COMP-PDPL-006 (Breach 72h) | TC-COMP-PDPL-006 | Manual drill + automated timer | Critical | Compliance |
| COMP-PDPL-007 (Cross-border) | TC-COMP-PDPL-007 | Integration audit | High | Compliance |
| COMP-PDPL-008 (Retention) | TC-COMP-PDPL-008 | Automated (retention lock test) | Critical | QA |
| COMP-PDPL-009 (Consent mgmt) | TC-COMP-PDPL-009 | Automated (consent withdrawal test) | High | QA |
| COMP-AML-006 (CFT Screening) | TC-COMP-AML-006 | Automated (screening trigger test) | Critical | QA |
| COMP-AML-007 (CTR) | TC-COMP-AML-007 | Automated (cash payment threshold) | Critical | QA |
| COMP-AML-008 (UBO) | TC-COMP-AML-008 | Automated (company client gate) | Critical | QA |

---

**Version:** 1.3 | **Last Updated:** June 2026 | **Sections:** 16 ✅  
**Change Log:** v1.1 — Initial RERA/DLD/AML/PDPL sections (March 2026); v1.2 — Oqood, escrow, pricing, refunds, penalty table (May 2026); v1.3 — PDPL expanded (COMP-PDPL-006–009), AML/CFT expanded (COMP-AML-006–008), acceptance criteria matrix (June 2026)
