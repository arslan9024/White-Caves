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
