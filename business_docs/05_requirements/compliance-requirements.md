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
**Regulation:** UAE Federal Decree Law No. 20 of 2018 (AML Law)  
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
- SAR records retained for 5 years

**Status:** Planned | **Priority:** High

### COMP-AML-004: Record Retention
**Requirement:** All transaction records, KYC documents, and AML documentation must be retained for minimum 5 years.  
**Platform Impact:**
- System prevents deletion of records within 5-year retention period
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

| Section | Metric | Target |
|---------|--------|--------|
| Property Permits | % listings with valid RERA permit | 100% |
| Agent Credentials | % agents with valid BRN | 100% |
| KYC Coverage | % transactions with verified KYC | 100% |
| Ejari Coverage | % active leases with Ejari | 100% |
| AML Reviews | % flagged transactions reviewed within 24h | 100% |

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

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Compliance (Laila) & Legal Teams
