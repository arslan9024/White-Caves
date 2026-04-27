# Dubai Real Estate Compliance Requirements — Complete Reference

> **Last updated:** April 19, 2026
> **Supersedes:** Previous dubai-regulatory-framework.md (retained in archives)
> **Purpose:** Definitive compliance reference for all White Caves CRM features
> **Regulatory bodies:** RERA, DLD, Ejari, FTA (VAT), DIFC (for freehold)

---

## 1. RERA (Real Estate Regulatory Agency)

### 1.1 Overview

- Established: July 31, 2007 under Law No. 16 of 2007
- Parent body: Dubai Land Department (DLD)
- Director General: Marwan Bin Ghalita
- Full regulatory authority over all real estate activities in Dubai

### 1.2 Licensing Requirements

| License Type      | Who Needs It        | Renewal     | Fee (AED)     | Platform Field             |
| ----------------- | ------------------- | ----------- | ------------- | -------------------------- |
| Broker License    | All brokerage firms | Annual      | ~5,000-15,000 | `company.reraLicense`      |
| Agent BRN         | Individual agents   | Annual      | ~2,500-5,000  | `agent.brnNumber`          |
| Developer License | Property developers | Annual      | ~10,000+      | `developer.reraLicense`    |
| Property Manager  | PM companies        | Annual      | ~5,000        | `company.pmLicense`        |
| Trakheesi Permit  | Per-advertisement   | Per listing | ~500-1,000    | `property.trakheesiPermit` |

### 1.3 CRM Requirements

- [ ] Auto-track BRN expiry dates per agent (alert at 90/60/30/15/7 days)
- [ ] Validate Trakheesi permit before property listing goes live
- [ ] Display RERA number on all public property pages
- [ ] RERA disclaimer footer on all property marketing materials
- [ ] Block listing creation if agent BRN is expired
- [ ] Annual RERA training completion tracker per agent

### 1.4 Penalties (Non-Compliance)

| Violation                          | Fine (AED)    | Impact                    |
| ---------------------------------- | ------------- | ------------------------- |
| Advertising without Trakheesi      | 50,000        | Listing suspension + fine |
| Expired BRN operating              | 10,000-50,000 | Agent suspension          |
| Unlicensed brokerage               | 100,000+      | Business closure          |
| Unauthorized commission collection | Variable      | Legal action              |

---

## 2. DLD (Dubai Land Department) Transfer Fees

### 2.1 Sales Transactions

| Item                  | Rate                                   | Notes                                           |
| --------------------- | -------------------------------------- | ----------------------------------------------- |
| Transfer fee          | 4% of property value                   | Split: 2% buyer + 2% seller (industry standard) |
| Admin fee (property)  | AED 580                                | Fixed fee per transaction                       |
| Admin fee (mortgage)  | AED 290                                | If mortgage is involved                         |
| Knowledge fee         | AED 10                                 | Fixed                                           |
| Innovation fee        | AED 10                                 | Fixed                                           |
| Trustee fee           | AED 4,000 (>500K) or AED 2,000 (<500K) | Paid to registered trustee                      |
| Real estate agent fee | AED 1,050                              | Registration of agent in transaction            |

### 2.2 Lease Transactions

| Item               | Rate                                       | Notes                    |
| ------------------ | ------------------------------------------ | ------------------------ |
| Ejari registration | AED 175 (online) / AED 220 (typing center) | Mandatory for all leases |
| Knowledge fee      | AED 10                                     | Fixed                    |
| Innovation fee     | AED 10                                     | Fixed                    |

### 2.3 CRM Requirements

- [ ] Auto-calculate DLD fees based on transaction type and value
- [ ] DLD fee breakdown in transaction summary
- [ ] Fee split allocation between buyer and seller
- [ ] Trustee fee calculation based on property value threshold

---

## 3. Ejari (Rental Contract Registration)

### 3.1 Overview

- Mandatory since 2007 (Decree No. 26 of 2013)
- "Ejari" = "My Rent" in Arabic
- All rental contracts in Dubai MUST be registered on Ejari
- Required for: DEWA activation, visa processing, school enrollment, Emirates ID

### 3.2 Required Documents

| Document                  | Source         | CRM Storage            |
| ------------------------- | -------------- | ---------------------- |
| Original tenancy contract | Agent/landlord | `lease.contractPdf`    |
| Title deed copy           | DLD / landlord | `property.titleDeed`   |
| Tenant Emirates ID        | Tenant         | `tenant.emiratesId`    |
| Tenant passport copy      | Tenant         | `tenant.passportCopy`  |
| Tenant visa copy          | Tenant         | `tenant.visaCopy`      |
| Landlord Emirates ID      | Landlord       | `landlord.emiratesId`  |
| DEWA premise number       | DEWA           | `property.dewaPremise` |

### 3.3 CRM Requirements

- [ ] Auto-generate Ejari-compliant contract (Form F template)
- [ ] Ejari registration status tracker: pending -> submitted -> registered -> expired
- [ ] Document checklist per lease (missing docs highlighted)
- [ ] Ejari renewal reminders (30 days before expiry)
- [ ] Bulk Ejari CSV export for multi-lease registration
- [ ] Ejari number stored on lease record after registration

---

## 4. Commission Regulations

### 4.1 Standard Commission Rates (Dubai Market Practice)

| Transaction Type | Commission Rate         | Who Pays             | Notes                        |
| ---------------- | ----------------------- | -------------------- | ---------------------------- |
| Property sale    | 2% of sale price        | Seller (standard)    | Can be split buyer/seller    |
| Property rental  | 5% of annual rent       | Tenant (standard)    | One-time on new lease        |
| Lease renewal    | 2-5% of annual rent     | Negotiable           | Typically lower for renewals |
| Off-plan sale    | 3-7% of sale price      | Developer pays agent | Higher than resale           |
| Commercial lease | 5-10% of annual rent    | Tenant               | Higher than residential      |
| Referral fee     | 25% of agent commission | Referring agent      | Inter-agency referral        |

### 4.2 CRM Requirements

- [ ] Commission auto-calculation per transaction type
- [ ] Commission split rules (buyer agent / seller agent / company / referral)
- [ ] Approval workflow: calculated -> pending -> approved -> paid
- [ ] VAT calculation on commission: 5% VAT on commercial commissions
- [ ] Commission tax invoice generation with TRN number

---

## 5. VAT (Value Added Tax) — Federal Tax Authority

### 5.1 Applicability to Real Estate

| Property Type             | VAT Rate        | Notes                           |
| ------------------------- | --------------- | ------------------------------- |
| Residential sale (first)  | 0% (zero-rated) | First sale/lease within 3 years |
| Residential sale (resale) | Exempt          | No VAT on resale                |
| Residential rental        | Exempt          | No VAT on residential leases    |
| Commercial sale           | 5%              | Standard rate applies           |
| Commercial rental         | 5%              | Standard rate applies           |
| Brokerage commission      | 5%              | Always subject to VAT           |
| Property management fees  | 5%              | Always subject to VAT           |

### 5.2 TRN (Tax Registration Number)

- Required for businesses with taxable supplies > AED 375,000/year
- Must appear on all tax invoices
- Format: 15-digit number (e.g., 100123456789003)

### 5.3 CRM Requirements

- [ ] Store company TRN in settings
- [ ] Auto-apply correct VAT rate based on property type
- [ ] Generate VAT-compliant invoices (tax invoice format)
- [ ] VAT summary report for FTA filing

---

## 6. Escrow Accounts

### 6.1 Overview

- Required for all off-plan property sales
- Managed through DLD Real Estate Escrow Account Registration Trustee (REST)
- Developer must deposit buyer payments into designated escrow account
- Funds released only upon construction milestones

### 6.2 CRM Requirements

- [ ] Track escrow account details per off-plan project
- [ ] Payment milestone tracker (% completion -> % funds released)
- [ ] Escrow account number display on off-plan listings

---

## 7. Complete Compliance Checklist for Platform Launch

### Pre-Launch (P0)

- [ ] RERA permit display on all listings
- [ ] BRN display on agent profiles
- [ ] DLD fee calculator accurate (verified against dubailand.gov.ae)
- [ ] Commission rates match market practice
- [ ] Ejari contract template compliant with Form F
- [ ] VAT logic: 0% residential, 5% commercial, 5% on commissions
- [ ] TRN field in company settings
- [ ] RERA disclaimer footer on property pages

### Post-Launch (P1)

- [ ] Ejari bulk CSV export tested against portal
- [ ] RERA expiry auto-notifications (WhatsApp + email)
- [ ] Commission invoice PDF generation with TRN
- [ ] DLD transaction fee breakdown in deal summary
- [ ] Escrow tracking for off-plan projects
- [ ] Annual compliance audit report generation

---

## 8. Authoritative Sources

- RERA: rera.ae, dubailand.gov.ae/en/Pages/legislation.aspx
- Ejari: ejari.ae, dubailand.gov.ae/en/eservices/ejari/
- DLD: dubailand.gov.ae/en/Pages/default.aspx
- FTA (VAT): tax.gov.ae
- Commission practice: RERA market guidelines + industry standard
- Escrow: dubailand.gov.ae/en/eservices/trust-accounts/
