# Dubai Real Estate Regulations — Compliance Checklist & Implementation

> **Last Updated:** April 11, 2026
> **Regulatory Bodies:** RERA, DLD, Ejari, DTCM
> **Purpose:** Comprehensive compliance checklist for White Caves platform with actionable implementation steps

---

## 1. RERA (Real Estate Regulatory Agency)

### 1.1 Overview

RERA is the regulatory arm of the Dubai Land Department (DLD), established under Law No. 16 of 2007. It governs all real estate brokerage, property management, and development activities in Dubai.

### 1.2 Licensing Requirements

| Requirement | Details | Platform Impact |
|-------------|---------|-----------------|
| **Broker License** | All brokers must hold valid RERA broker license (annual renewal) | `brokerLicenseNumber` field on Agent model; auto-expiry alerts |
| **BRN (Broker Registration Number)** | Unique per-agent identifier from RERA | `reraRegistrationNumber` field on Agent profiles |
| **Trade License** | Company must hold valid DED trade license | Display on company profile, footer |
| **RERA Training** | Agents must complete certified training annually | Training status tracking in HR module |

### 1.3 Trakheesi (Property Advertising Permits)

| Rule | Details | Implementation |
|------|---------|----------------|
| **Permit Required** | Every property ad must have a valid Trakheesi permit number | `permitNumber` required field on Property model |
| **Validity Check** | Permits are property-specific and time-limited | Cron job: check expiry daily, auto-flag expired |
| **Penalty** | AED 50,000 fine for advertising without permit | Block publishing if no valid permit |
| **Display** | Permit number must be visible on all advertising | Show on listing cards, detail pages, exports |

### 1.4 Commission Regulations

| Rule | Details | Implementation |
|------|---------|----------------|
| **Standard Rate** | ~2% for sales, 5% of annual rent for leasing | Default commission calculator in Transaction model |
| **Written Agreement** | Commission terms must be in written brokerage agreement | Contract template generation |
| **Transparency** | Commissions must be declared upfront | Commission disclosure in offer workflows |
| **Digital Registration** | Smart contracts for deal registration | DLD REST Dubai integration (future) |

### 1.5 Implementation Checklist

- [x] `brokerLicenseNumber` field on Agent profiles (Prisma model exists)
- [x] `reraRegistrationNumber` field on Agent profiles (Prisma model exists)
- [x] RERA compliance module in frontend (Laila assistant handles this)
- [x] Commission tracking system (Commission model exists)
- [ ] **Auto-check Trakheesi permit expiry** — Add cron job with `node-cron`
- [ ] **Block listing publish without valid permit** — Add validation middleware
- [ ] **RERA disclaimer footer** — Add to all property detail pages
- [ ] **Trakheesi-compliant export** — XML/JSON feed for portal syndication
- [ ] **Agent training status tracking** — Add `trainingExpiry` field to Agent model
- [ ] **DLD REST Dubai API integration** — For digital deal registration

---

## 2. Ejari (Tenancy Contract Registration)

### 2.1 Overview

Ejari ("My Rent") is Dubai's mandatory tenancy contract registration system per Decree No. 26 of 2013. All rental contracts must be registered.

### 2.2 Requirements

| Requirement | Details | Implementation |
|-------------|---------|----------------|
| **Mandatory Registration** | All tenancy contracts must be registered with Ejari | Ejari reference field on Lease model |
| **Required Documents** | Title deed, tenant passport/visa, Emirates ID, tenancy contract | Document checklist in lease workflow |
| **Registration Fee** | AED 220 (online) | Include in fee calculations |
| **Annual Renewal** | Must re-register on contract renewal | Auto-reminder 30 days before expiry |
| **RERA Rent Index** | Rent increases governed by RERA Rent Calculator | Integrate RERA rent calculator API |

### 2.3 Implementation Checklist

- [x] Lease model with Ejari reference field
- [x] Tenancy agreement workflow exists
- [ ] **Ejari document checklist** — Guided workflow for required documents
- [ ] **RERA Rent Calculator integration** — API call for rent increase validation
- [ ] **Auto-renewal reminders** — 30/60/90 day email + WhatsApp via Nadia
- [ ] **Ejari certificate generation** — PDF template with all required fields

---

## 3. TRN (Tax Registration Number)

### 3.1 VAT Requirements

| Rule | Details | Implementation |
|------|---------|----------------|
| **VAT Rate** | 5% on commercial property transactions | Auto-calculate in transaction totals |
| **TRN Display** | Must show TRN on all invoices and receipts | Add `taxRegistrationNumber` to Company model |
| **Commercial Only** | Residential first sales exempt; commercial always taxable | Property type-based tax rules |
| **Filing** | Quarterly VAT returns required | Report generation for finance team |

### 3.2 Implementation Checklist

- [x] Transaction model supports tax calculations
- [ ] **VAT auto-calculation** — Add tax rules engine based on property type
- [ ] **TRN on invoices** — Display on all generated PDF invoices
- [ ] **VAT report generation** — Quarterly summary for FTA filing
- [ ] **Tax configuration panel** — Admin settings for tax rates and rules

---

## 4. Escrow Accounts (Off-Plan)

### 4.1 DLD Escrow Requirements

| Rule | Details | Implementation |
|------|---------|----------------|
| **100% Deposit** | All buyer payments into DLD-approved escrow | Escrow tracking in Payment model |
| **Milestone Release** | Funds released on construction certification | Milestone tracker UI |
| **Annual Audit** | External audit by RERA-approved auditors | Audit report upload and storage |
| **Project Registration** | Every off-plan project registered with DLD | Project model with DLD registration |

### 4.2 Implementation Checklist

- [ ] **Escrow account model** — Track deposits, milestones, releases
- [ ] **Construction milestone tracker** — Visual progress with fund release triggers
- [ ] **Audit report management** — Upload, store, and track annual audits
- [ ] **DLD project registration validation** — Verify project registration number

---

## 5. Anti-Money Laundering (AML) / KYC

### 5.1 UAE PDPL & AML Requirements

| Rule | Details | Implementation |
|------|---------|----------------|
| **KYC Verification** | Emirates ID, passport, proof of funds for transactions > AED 55,000 | KYC workflow in onboarding |
| **Source of Funds** | Must verify source for high-value transactions | SOF declaration form |
| **PEP Screening** | Check Politically Exposed Persons lists | Third-party PEP screening API |
| **SAR Filing** | Suspicious Activity Reports to FIU | SAR template and filing workflow |
| **Record Retention** | 5-year retention for all KYC documents | Data retention policy enforcement |

### 5.2 Implementation Checklist

- [x] KYC/AML framework documented (`business_docs/10_security/kyc-aml-framework.md`)
- [ ] **KYC verification workflow** — Step-by-step document collection + validation
- [ ] **PEP screening integration** — API call to ComplyAdvantage or similar
- [ ] **SAR reporting template** — Form with FIU submission workflow
- [ ] **5-year retention automation** — Data lifecycle management for compliance
- [ ] **Enhanced due diligence** — Additional checks for transactions > AED 1M

---

## 6. Data Protection (UAE PDPL)

### 6.1 Requirements

| Rule | Details | Implementation |
|------|---------|----------------|
| **Consent** | Explicit consent for data collection and processing | Consent management system |
| **Data Minimization** | Collect only necessary data | Audit all data collection points |
| **Right to Access** | Users can request their data | Data export endpoint |
| **Right to Erasure** | Users can request deletion | Soft-delete with 30-day grace period |
| **Data Breach Notification** | 72-hour notification requirement | Incident response automation |
| **Cross-Border Transfer** | Restrictions on data transfer outside UAE | Data residency in UAE region |

### 6.2 Implementation Checklist

- [x] GDPR/PDPL compliance documented (`business_docs/10_security/uae-pdpl-compliance.md`)
- [x] Rate limiting implemented (5 limiters)
- [x] Input validation and XSS sanitization
- [ ] **Consent management UI** — Cookie consent + marketing opt-in/out
- [ ] **Data export endpoint** — `GET /api/users/:id/export` (GDPR Article 20)
- [ ] **Data erasure endpoint** — `DELETE /api/users/:id/erase` with audit log
- [ ] **Data breach playbook** — Automated notification within 72 hours
- [ ] **Data residency enforcement** — Ensure MongoDB hosted in UAE/GCC region

---

## 7. Compliance Score & Monitoring

### Current Compliance Status

| Area | Status | Score | Next Action |
|------|--------|-------|-------------|
| **RERA Licensing** | ✅ Implemented | 90% | Add training expiry tracking |
| **Trakheesi** | ⚠️ Partial | 60% | Add auto-expiry, block invalid |
| **Ejari** | ⚠️ Partial | 50% | Add document checklist, rent calculator |
| **TRN/VAT** | ⚠️ Partial | 40% | Add auto-calculation, reports |
| **Escrow** | ❌ Not Started | 0% | Build escrow tracking module |
| **AML/KYC** | ⚠️ Documented | 30% | Build verification workflow |
| **Data Protection** | ⚠️ Partial | 50% | Add consent, export, erasure |
| **Overall** | | **46%** | Target: 90% by Q4 2026 |

---

## Sources

- [RERA Dubai](https://www.rera.gov.ae) — Official regulations
- [DLD (Dubai Land Department)](https://dubailand.gov.ae) — Transaction and escrow rules
- [Ejari](https://www.ejari.ae) — Tenancy registration system
- [Federal Tax Authority UAE](https://tax.gov.ae) — VAT and TRN requirements
- [UAE PDPL (Federal Decree-Law No. 45 of 2021)](https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws) — Data protection
- [RERA Audits UAE 2025](https://taxadepts.com/rera-audits-uae-escrow-compliance-guide-2025-2026) — Compliance guide
- [Dubai Real Estate Laws 2025-2026](https://houseandhedges.ae/blog/dubai-real-estate-laws-regulations-2025-2026) — Regulatory updates
- [Metropolitan RERA Guide](https://metropolitan.realestate/blog/guides/rera-dubai-2025-handbook/) — Complete handbook


---

## 8. DLD Transaction Process — Step-by-Step

### 8.1 Ready Property Sale — Full Transfer Process

```
PHASE 1: PRE-CONTRACT (1-5 days)
Step 1:  Buyer submits offer in writing via CRM (Quill generates offer letter)
Step 2:  Seller accepts/counters (negotiated via agents)
Step 3:  Agents agree: Form I (co-brokerage) or confirm sole agency
Step 4:  Manager Cheque (Buyer's deposit — typically 10%) collected

PHASE 2: MOU SIGNING (1-3 days)
Step 5:  Memorandum of Understanding (MOU) prepared (Quill generates)
Step 6:  Both parties sign MOU (can be done via DocuSign Phase 2)
Step 7:  MOU includes: agreed price, payment terms, conditions precedent

PHASE 3: NOC APPLICATION (5-15 days for managed communities)
Step 8:  Listing agent applies to developer for No Objection Certificate (NOC)
         Required for: DAMAC, Emaar, Nakheel, Meraas, and other managed communities
         Documents: buyer + seller passports, title deed copy, signed MOU
Step 9:  Developer issues NOC (confirms no service charges outstanding)
Step 10: Developer NOC fee: AED 500–5,000 depending on developer

PHASE 4: MORTGAGE PROCESSING (if applicable — 2-4 weeks)
Step 11: Buyer's bank values the property (bank appoints surveyor)
Step 12: Bank issues formal mortgage offer letter
Step 13: Seller's bank issues mortgage clearance letter (if property under mortgage)

PHASE 5: DLD TRANSFER APPOINTMENT (1 day)
Step 14: Book DLD appointment at DLD Trustee Office (online via dubailand.gov.ae)
Step 15: Prepare all documents (checklist below)
Step 16: Both buyer and seller (or Power of Attorney holder) attend
Step 17: DLD verifies all documents; conducts identity check
Step 18: Buyer pays:
         ├── 4% Transfer Fee of sale price (DLD fee — buyer pays)
         ├── AED 4,000 DLD admin fee
         ├── AED 580 Title deed issuance fee
         └── AED 500–1,000 Trustee office service fee
Step 19: Seller pays:
         ├── NOC fee (if not already paid)
         └── Mortgage clearance fee (if applicable)
Step 20: Balance of sale price transferred (buyer's manager cheque to seller)
Step 21: Title deed issued in buyer's name (same day at trustee office)
```

### 8.2 DLD Transfer Checklist

```
BUYER documents:
☐ Original passport (+ copy)
☐ UAE Residence Visa (if resident; + copy)
☐ Emirates ID (+ copy)
☐ Original signed MOU
☐ Manager's cheques (deposit + balance + DLD fees)
☐ Mortgage offer letter (if applicable)
☐ Power of Attorney (if buying through POA holder — must be notarised + UAE apostille)

SELLER documents:
☐ Original passport (+ copy)
☐ UAE Residence Visa (if resident)
☐ Emirates ID (if resident)
☐ Original title deed
☐ Signed MOU
☐ NOC from developer (original)
☐ Mortgage clearance letter (if property has existing mortgage)
☐ Power of Attorney (if selling through POA holder)

AGENT documents:
☐ Form A (listing authority) — original signed
☐ Commission agreement (signed by seller/landlord)
☐ Agent BRN + company ORN
```

### 8.3 DLD Fees Summary

| Fee | Amount | Paid By |
|-----|--------|---------|
| Transfer fee | 4% of sale price | Buyer |
| DLD admin fee | AED 4,000 (sales < AED 500k: AED 2,000) | Buyer |
| Title deed issuance | AED 580 | Buyer |
| Trustee office fee | AED 500–1,000 (varies by trustee) | Buyer |
| NOC (developer) | AED 500–5,000 | Seller (usually) |
| Mortgage clearance | AED 1,000–3,000 (bank fee) | Seller |
| Mortgage registration fee | 0.25% of mortgage value + AED 290 (DLD) | Buyer |
| Agent commission (sale) | 2% of sale price | Seller (standard) |

**Important:** No VAT on residential property sales in the UAE. 5% VAT applies to commercial property sales and on agent commission (agent invoices + 5% VAT to seller).

---

## 9. RERA Fee Structure — Complete Schedule

| License / Certificate | Cost (approx.) | Frequency | Paying Entity |
|---------------------|--------------|-----------|--------------|
| DED Real Estate Brokerage License | AED 10,000–20,000 | Annual | Company |
| RERA Brokerage Registration Certificate | AED 5,000–10,000 | Annual | Company |
| RERA BRN (per agent) — new registration | AED 5,020 | Once (then annual renewal) | Company / Agent |
| RERA BRN Annual Renewal | AED 5,020 | Annual (usually January) | Company / Agent |
| DREI Training Course | AED 3,000–5,000 | Once (before BRN) | Company / Agent |
| CPD hours (external provider) | AED 500–2,000/year | Annual (8 hours required) | Company / Agent |
| Trakheesi permit per listing | AED 10–20 per permit | Per listing (3-month validity) | Company |
| Ejari registration | AED 220 + 5% VAT | Per tenancy | Landlord (agent facilitates) |
| DLD NOC (community) | AED 500–5,000 | Per transaction | Seller |
| Off-plan Oqood registration | 4% of property value (DLD fee) | Per off-plan transaction | Buyer |

---

## 10. UAE VAT on Real Estate

### 10.1 VAT Rate by Transaction Type

| Transaction | VAT Rate | Notes |
|------------|---------|-------|
| Residential property sale (ready) | 0% | Exempt — first supply is zero-rated |
| Residential property resale (secondary) | 0% | Exempt |
| Commercial property sale | 5% | Standard rate |
| Residential property rental (long-term) | 0% | Exempt |
| Commercial property rental | 5% | Standard rate |
| Holiday homes / short-term rentals | 5% | Treated as commercial service |
| Agent commission (residential sale) | 5% | Agent's service = taxable supply |
| Agent commission (commercial) | 5% | Standard rate |
| Property management fee | 5% | Service = taxable |
| Off-plan property first sale by developer | 0% | Zero-rated per FTA |

### 10.2 White Caves VAT Obligations

- White Caves must register for VAT if annual taxable supplies exceed AED 375,000
- Issue VAT invoices to clients for all taxable services (commission invoices)
- File quarterly VAT returns with FTA (Federal Tax Authority)
- Maintain records for 5 years (FTA audit requirement)
- VAT Invoice must include: TRN number, date, buyer/seller details, service description, amount, VAT amount

**Quill (Document Generator):** Auto-include VAT on commission invoices; confirm with Finance whether property type is residential (0%) or commercial (5%).

---

## 11. Dubai Golden Visa — Real Estate Pathway

### 11.1 Eligibility Criteria

| Requirement | Details |
|------------|---------|
| Minimum property value | AED 2 million (off-plan or ready) |
| Property must be | Located in Dubai; freehold |
| Mortgage allowed | Yes — if equity (paid amount) ≥ AED 2 million |
| Multiple properties | Combined value can qualify if each ≥ AED 2M or combined portfolio ≥ AED 4M (under Platinum Visa) |
| Visa duration | 10 years (renewable) |
| Family sponsorship | Spouse + children included |
| Business requirement | None (pure property investment) |

### 11.2 Process for Golden Visa via Property

```
Step 1: Property purchase completed (title deed in buyer's name)
Step 2: Obtain DLD valuation certificate (confirms AED 2M+ market value)
         └── Apply online at dubailand.gov.ae → Certificates
Step 3: Apply for Golden Visa via General Directorate of Residency and Foreigners Affairs (GDRFA)
         └── Online: gdrfad.gov.ae
Step 4: Medical fitness test (UAE-approved medical centre)
Step 5: Emirates ID application (Federal Authority for Identity)
Step 6: 10-year visa issued
```

### 11.3 White Caves Business Opportunity

- **Target buyers:** European, Asian, and Russian investors seeking Dubai residency
- **Positioning:** "Buy your DAMAC Hills 2 villa with White Caves and qualify for your UAE Golden Visa — we handle everything from the search to the visa introduction."
- **CRM:** Add Golden Visa interest flag to Lead profile (for targeting)
- **Partnerships:** Introduce clients to GDRFA-approved visa consultants (referral fee opportunity)
- **Marketing:** Create Golden Visa landing page + dedicated WhatsApp follow-up sequence for investors

### 11.4 Common Golden Visa Client Questions

| Question | Answer |
|---------|--------|
| "Can I buy off-plan and get the visa?" | Yes, if paid amount from developer invoices totals ≥ AED 2M |
| "Does the AED 2M include DLD fees?" | No — property value alone must be ≥ AED 2M |
| "Can I rent out the property and still keep the visa?" | Yes — owning the property is sufficient; occupancy not required |
| "What if the property value drops below AED 2M?" | Visa is not automatically cancelled; renewal may require re-qualification |

---

## 12. Ejari Registration — Detailed Procedure

### 12.1 What is Ejari?

Ejari (Arabic: "My Rent") is the mandatory tenancy contract registration system operated by RERA/DLD. All residential and commercial tenancies in Dubai must be Ejari-registered within 30 days of lease commencement.

**Why it matters:**
- Legal requirement — unregistered leases not enforceable at RDSC (Rental Dispute Settlement Centre)
- Required for DEWA (water/electricity) connection
- Required for residency visa renewal (for tenants on UAE residency visa)
- Required for work permit renewals (for some government schemes)

### 12.2 Step-by-Step Ejari Registration

```
Documents Required:
☐ Original signed tenancy contract (RERA-approved format)
☐ Tenant's passport copy
☐ Tenant's UAE visa copy (if resident)
☐ Tenant's Emirates ID copy
☐ Landlord's passport copy
☐ Landlord's Emirates ID copy (if UAE resident)
☐ Title deed copy (in landlord's name)
☐ Power of Attorney (if landlord registers via agent)

Registration Methods:
A) RERA Service Centre (in-person):
   → At DLD Customer Happiness Centre, Baniyas Road, Deira
   → Hours: Mon–Thu 7:30am–3:30pm; Fri 7:30am–12pm
   → Processing: Same day

B) Smart Dubai App (online):
   → Download Dubai REST app or Ejari app
   → Upload documents → Submit → Receive Ejari certificate by email
   → Processing: 24–48 hours

C) Authorised Typing Centre:
   → Network of private typing centres across Dubai
   → Lower fee than DLD (AED 165 + AED 10 knowledge fee)
   → Agent can use these on behalf of landlord/tenant

Registration Fee: AED 220 + AED 10 knowledge fee + 5% VAT = ~AED 240 total
```

### 12.3 Ejari Renewal

When a lease renews, a new Ejari must be registered:
- New registration required even if same parties, same property
- Old Ejari remains in records but new registration must reflect renewal dates
- Failure to re-register: tenant cannot renew residency visa; landlord cannot file RDSC case for overdue rent

### 12.4 CRM Action

```
Lease.ejariNumber: stored after registration
Lease.ejariExpiry: auto-calculated as lease.endDate
Auto-alert: if Lease.status = ACTIVE AND ejariNumber is null AND createdAt > 30 days → alert compliance officer
Tenant portal: ejariCertificate available to download (PDF stored in S3)
```

---

## 13. Upcoming Regulatory Changes (2026–2027)

### 13.1 RERA Digital Transformation Roadmap

| Change | Expected Timeline | Impact on White Caves |
|--------|-----------------|---------------------|
| Mandatory digital Form A submissions via RERA REST portal | Q3 2026 | Phase 5: CRM → RERA API integration for Form A |
| Agent license: annual proficiency test (expanded from every 2 years) | Q4 2026 | HR must track test dates; schedule training support |
| New off-plan buyer protection regulations (enhanced escrow rules) | Q1 2027 | Update off-plan compliance checklist; Quill template updates |
| RERA API for permit validation (Trakheesi real-time check) | Q4 2026 | Phase 5: integrate `/api/properties/permit-validate` call |
| New tenancy dispute fast-track process at RDSC (< 14 days for low-value claims) | Q2 2027 | Update dispute resolution guidance for tenants |
| DLD blockchain title deed registry (pilot expansion) | Q2 2027 | Phase 8: consider blockchain title verification integration |

### 13.2 UAE Federal Real Estate Law (Anticipated)

A federal-level real estate law (complementing Dubai-specific laws) is anticipated to:
- Unify real estate broker licensing across all seven emirates
- Create a federal RERA-equivalent body
- Impact agents with licenses outside Dubai
- Timeline: Q3 2026–Q1 2027 (under consultation)

**White Caves Action:** Monitor UAE Ministry of Economy announcements; subscribe to legal counsel newsletter; attend Dubai Chamber of Commerce real estate working group meetings.

---

**Document Owner:** Compliance (Laila) + Research (Zuri — Research Specialist)
**Version History:** v1.0 April 2026 (initial)
**Review Cycle:** Quarterly — regulations change frequently in Dubai
**Related Documents:**
- `business/08_compliance/rera-compliance-checklist.md`
- `business/08_compliance/aml-risk-assessment.md`
- RERA: www.rera.gov.ae | DLD: www.dubailand.gov.ae | FTA: www.tax.gov.ae
