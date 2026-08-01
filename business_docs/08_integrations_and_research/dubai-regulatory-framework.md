# Dubai Real Estate Regulatory Framework — RERA & DLD

> **Last updated:** March 29, 2026  
> **Regulatory bodies:** RERA (Real Estate Regulatory Agency), DLD (Dubai Land Department)  
> **Applicable to:** All White Caves platform property listings and transactions

---

## 1. RERA (Real Estate Regulatory Agency)

### Overview
RERA is the regulatory arm of the Dubai Land Department (DLD), established under Law No. 16 of 2007. It governs all real estate activities in Dubai including brokerage, property management, and development.

### Key Requirements for White Caves

#### Broker License
- **Requirement:** All real estate brokers must hold a valid RERA broker license
- **Renewal:** Annual renewal via DLD/RERA portal
- **Display:** License number must be displayed on all marketing materials, business cards, and platform profiles
- **Platform impact:** `brokerLicenseNumber` field on Agent profiles

#### Property Advertising (Trakheesi)
- **Requirement:** All property advertisements must have a valid Trakheesi permit number
- **System:** Trakheesi is RERA's advertising permit system
- **Validity:** Each permit is property-specific and time-limited
- **Platform impact:** `permitNumber` field required on all property listings before publication
- **Penalty:** AED 50,000 fine for advertising without a valid permit

#### Agent Registration
- **Requirement:** All sales/leasing agents must be registered with RERA
- **BRN (Broker Registration Number):** Unique identifier for each registered agent
- **Training:** Agents must complete RERA-certified training
- **Platform impact:** `reraRegistrationNumber` field on agent profiles

### RERA Compliance Checklist for Platform
- [ ] Display RERA permit number on every property listing
- [ ] Display broker registration number on agent profiles
- [ ] Display company trade license on company profile
- [ ] Include RERA disclaimer footer on all property pages
- [ ] Auto-check permit expiry and flag expired listings
- [ ] Generate Trakheesi-compliant property exports

---

## 2. Ejari (Tenancy Contract Registration)

### Overview
Ejari ("My Rent") is Dubai's official tenancy contract registration system, mandatory since 2007 under Decree No. 26 of 2013.

### Key Requirements
- **All rental contracts must be registered on Ejari**
- Registration creates a legally binding record
- Required for: DEWA activation, visa processing, school enrollment
- Managed through DLD's Ejari portal or authorized typing centres

### Integration Points for White Caves
1. **Contract Generation:** Auto-populate Ejari-compliant contract templates
2. **Document Requirements:** Tenant Emirates ID, Passport, Visa, Title Deed
3. **Fee Structure:** AED 220 (typing centre) or AED 175 (online Ejari)
4. **Renewal:** Automatic renewal reminders (30 days before expiry)
5. **Cancellation:** Track and process Ejari cancellations on tenant moveout

### Platform Impact
- `ejariContractNumber` field on Lease model
- `ejariRegistrationDate` and `ejariExpiryDate` fields
- Integration service: `server/services/integrations/EjariService.ts` (planned)

---

## 3. Dubai Land Department (DLD) Requirements

### Title Deed Transfer
- All property sales must be registered with DLD
- Transfer fee: 4% of property value (typically split 2% buyer / 2% seller)
- Admin fee: AED 580 per transaction
- Platform should track: DLD reference number, transfer date, fee breakdown

### Oqood (Off-Plan Registration)
- All off-plan property sales must be registered via Oqood system
- SPA (Sales & Purchase Agreement) registration with DLD
- Progress payment tracking required

### Fees Structure (2026)
| Fee Type | Amount | Paid By |
|----------|--------|---------|
| Transfer Fee | 4% of property value | Buyer/Seller (negotiable) |
| DLD Admin Fee | AED 580 | Buyer |
| Broker Commission (Sale) | 2% of property value | Seller (standard) |
| Broker Commission (Lease) | 5% annual rent | Landlord (standard) |
| NOC Fee | Varies by developer | Seller |
| Ejari Registration | AED 175-220 | Tenant |

---

## 4. Anti-Money Laundering (AML) Requirements

### UAE Federal Decree Law No. 20 of 2018
- Customer Due Diligence (CDD) required for all transactions
- Enhanced Due Diligence for high-value transactions (>AED 55,000)
- Suspicious Transaction Reports (STRs) to Financial Intelligence Unit
- Record retention: minimum 5 years

### Platform Compliance
- KYC verification workflow (Laila AI assistant manages this)
- Emirates ID / Passport verification
- Source of funds documentation
- Transaction monitoring for unusual patterns
- SAR (Suspicious Activity Report) generation

---

## 5. Portal Integration Requirements

### PropertyFinder
- Leading UAE property portal
- API integration for listing syndication
- XML feed format for bulk listing uploads
- Real-time availability sync required
- Premium features: Featured listings, neighborhood guides

### Bayut
- Major UAE property portal (Dubizzle group)
- API integration for listing syndication
- Status synchronization (available, rented, sold)
- Lead capture from portal inquiries
- Agent profile linking

### Integration Architecture
```
White Caves Platform
    ├── PortalSyncService
    │   ├── PropertyFinder API
    │   │   ├── POST /listings (create)
    │   │   ├── PUT /listings/:id (update)
    │   │   ├── DELETE /listings/:id (remove)
    │   │   └── GET /inquiries (lead capture)
    │   └── Bayut API
    │       ├── POST /listings (create)
    │       ├── PUT /listings/:id (update)
    │       ├── DELETE /listings/:id (remove)
    │       └── GET /leads (lead capture)
    └── Webhook receivers for inbound leads
```

---

## 6. Multi-Currency Support

### Required Currencies
| Currency | Code | Symbol | Primary Use |
|----------|------|--------|------------|
| UAE Dirham | AED | د.إ | Default |
| US Dollar | USD | $ | International buyers |
| British Pound | GBP | £ | UK investors |
| Euro | EUR | € | European buyers |
| Saudi Riyal | SAR | ﷼ | GCC buyers |
| Qatari Riyal | QAR | ﷼ | GCC buyers |
| Indian Rupee | INR | ₹ | Indian investors |
| Chinese Yuan | CNY | ¥ | Chinese investors |
| Russian Ruble | RUB | ₽ | Russian buyers |

### Exchange Rate Integration
- Real-time rates from reputable API (ExchangeRate-API or Open Exchange)
- Daily rate caching to minimize API calls
- Display: "Prices shown in AED. International currency conversions are approximate."
- AED always shown as primary with conversion below

---

## 7. Complete RERA/DLD Fee Schedule (2026 — AED)

### 7.1 DLD Transfer & Registration Fees

| Fee Type | Amount (AED) | Paid By | Legal Basis |
|----------|-------------|---------|-------------|
| DLD Property Transfer Fee | 4% of sale price | Buyer & Seller (negotiable split) | Law No. 7 of 2006 |
| DLD Admin Fee (sales) | 580 | Buyer | DLD circular |
| DLD Admin Fee (mortgage) | 290 | Buyer | DLD circular |
| Trustee Office Fee (< AED 500K) | 2,000 | Buyer | DLD circular |
| Trustee Office Fee (≥ AED 500K) | 4,000 | Buyer | DLD circular |
| Trustee Office Fee (mortgage reg.) | 4,000 | Buyer | DLD circular |
| Title Deed Issuance Fee | 520 | Buyer | DLD circular |
| Map Issuance Fee (unit) | 250 | Buyer | DLD circular |
| Map Issuance Fee (villa) | 100 | Buyer | DLD circular |
| Mortgage Registration Fee | 0.25% of loan + AED 290 | Buyer | DLD circular |
| Mortgage Release Fee | 1,020 | Owner | DLD circular |

### 7.2 RERA Brokerage & Advertising Fees

| Fee Type | Amount (AED) | Notes |
|----------|-------------|-------|
| RERA Broker License (new) | 5,020 | Via Dubai REST app |
| RERA Broker License (renewal) | 5,020/year | Annual |
| RERA Agent Registration (BRN) | 3,720 (incl. training) | DREI certified course required |
| Trakheesi Advertising Permit | 1,020 per property | Validity: 3 months |
| Advertising without permit (fine) | 50,000 per violation | RERA circular 2014 |
| Broker Commission (sale — standard) | 2% of sale price | Paid by seller |
| Broker Commission (lease — standard) | 5% of annual rent | Paid by landlord (RERA guidance) |
| Short-term rental (holiday home) fee | 370 per unit/year | DTCM permit |

### 7.3 Ejari & Tenancy Registration Fees

| Fee Type | Amount (AED) | Notes |
|----------|-------------|-------|
| Ejari Registration (online) | 175 | DLD online or app |
| Ejari Registration (typing centre) | 220 | RERA-approved centres |
| Ejari Amendment | 100 | Per change |
| Ejari Cancellation | 100 | On tenant departure |
| Rental Dispute Centre (RDC) Filing | 3.5% of annual rent (min 500, max 20,000) | Per RDC tariff 2023 |
| RDC Execution Order | 200 | Per case |

### 7.4 NOC Fees (Developer-Issued)

| Developer | NOC Fee (AED) | Processing Time |
|-----------|--------------|-----------------|
| Emaar | 5,250 | 7–10 business days |
| Nakheel | 5,250 | 7–10 business days |
| DAMAC | 5,250 | 7–10 business days |
| Meraas | 5,250 | 7–10 business days |
| Generic (most developers) | 500–5,250 | Varies |

> **Platform Implementation:** `property.nocFee` and `property.nocApprovedDate` fields must be populated before DLD transfer workflow is triggered. Auto-block transfer if NOC not yet issued.

---

## 8. RERA 2024 Updates & Circulars

### 8.1 Key 2024 Regulatory Changes

| Update | Effective Date | Impact |
|--------|--------------|--------|
| Trakheesi permit mandatory for all platforms (incl. social media) | Jan 2024 | All listing posts on Instagram/Facebook must display permit number |
| RERA Form A mandatory before property marketed | Q1 2024 | Seller must sign Form A before listing goes live |
| Off-plan project escrow threshold increased | Q2 2024 | Developer must deposit 20% construction completion before release |
| Agent continuous education requirement (15 CPD hours/year) | 2024 | BRN renewal blocked without CPD completion proof |
| Dubai Holiday Homes (DTCM) registration required for all STR | 2024 | CRM must track DTCM permit per short-term unit |

### 8.2 Mandatory RERA Forms — Platform Integration

| Form | Purpose | Required When | CRM Field |
|------|---------|--------------|-----------|
| Form A | Seller appointment of broker | Before listing | `listing.formASignedDate` |
| Form B | Buyer appointment of broker | Before offer | `lead.formBSignedDate` |
| Form I | Disclosure of dual agency | Dual agent scenario | `transaction.dualAgencyDisclosed` |
| Form F (MOU) | Memorandum of Understanding | On offer acceptance | `offer.mouSignedDate` |
| Form 7 | Landlord rent increase notice (90 days) | Rent increase | `lease.form7IssuedDate` |
| Form 12 | Eviction notice (various grounds) | Eviction process | `lease.form12IssuedDate` |
| Form 6 | Non-renewal notice (12 months) | Lease non-renewal | `lease.form6IssuedDate` |

> **Acceptance Criteria:** CRM must prevent listing publication if `listing.formASignedDate` is null. Display warning in UI: "Form A required before this property can be advertised."

---

## 9. Oqood Off-Plan Registration Requirements

### 9.1 Overview
Oqood ("contracts" in Arabic) is DLD's mandatory registration system for all off-plan sales, governed by Law No. 13 of 2008 (amended by Law No. 19 of 2020).

### 9.2 Registration Timeline & Requirements

| Step | Action | Deadline | Penalty for Non-Compliance |
|------|--------|---------|--------------------------|
| 1 | Developer registers project with DLD | Before sales launch | Cannot sell legally |
| 2 | Escrow account opened (Law No. 8/2007) | Before first SPA | Criminal liability |
| 3 | Buyer signs SPA | At sale | — |
| 4 | Oqood registration (SPA) | 60 days from SPA date | 2% of property value fine |
| 5 | Payment milestones deposited to escrow | Per SPA schedule | RERA investigation |
| 6 | DLD Oqood certificate issued | Post-registration | — |
| 7 | Title deed issued | On handover + full payment | — |

### 9.3 Required Fields for Oqood Registration

```json
{
  "developerId": "DLD-DEV-XXXXX",
  "projectId": "DLD-PROJ-XXXXX",
  "unitNumber": "B-1203",
  "buyerEmiratesId": "784-XXXX-XXXXXXX-X",
  "buyerPassportNumber": "XXXXXXXX",
  "spaDate": "2026-06-01",
  "salePriceAED": 1500000,
  "paymentPlanType": "60/40",
  "oqoodCertificateNumber": null
}
```

> **Testability:** Integration test must verify that `POST /api/properties/off-plan/register-oqood` returns HTTP 422 if `spaDate` is null or `buyerEmiratesId` fails checksum validation.

---

## 10. Escrow Law — Law No. 8 of 2007

### 10.1 Key Provisions

| Provision | Requirement |
|-----------|------------|
| Developer obligation | Must open RERA-approved escrow account before marketing off-plan units |
| Deposit requirement | 100% of collected buyer payments deposited to escrow |
| Release trigger | RERA-approved inspection confirms % construction completion |
| Release thresholds | 5% at 20% completion; further releases per RERA-approved schedule |
| Insolvency protection | Escrow funds protected from developer creditors |
| Cancellation | If developer defaults: buyers refunded from escrow proportionally |

### 10.2 Platform Compliance

- `project.escrowAccountNumber` — required field, RERA-verified
- `project.escrowBank` — must be RERA-approved bank
- `paymentMilestone.escrowReleaseApproved` — boolean, set only after DLD/RERA inspection
- White Caves must not accept developer partnerships where escrow is not confirmed

---

## 11. AML/CFT Obligations for Real Estate Brokers

### 11.1 FATF Recommendation 22 & UAE Implementation

Under FATF Recommendation 22, real estate agents are designated non-financial businesses and professions (DNFBPs). UAE Cabinet Decision No. 10 of 2019 implements this domestically.

**White Caves obligations as DNFBP:**

| Obligation | Threshold | Action Required |
|-----------|----------|----------------|
| Customer Due Diligence (CDD) | All transactions | ID verification, address, purpose |
| Enhanced Due Diligence (EDD) | > AED 55,000 or high-risk | Source of funds, wealth verification |
| Cash Transaction Report (CTR) | Cash ≥ AED 55,000 (single or aggregated in 30 days) | File with CBUAE within 2 business days |
| Suspicious Transaction Report (STR) | Any amount, suspicious pattern | File with UAE FIU via goAML immediately |
| PEP Screening | All clients | Screen against PEP database at onboarding |
| Sanctions Screening | All clients | Real-time screen against UN/UAE/OFAC |
| Record Retention | All CDD records | 7 years (Cabinet Decision No. 10/2019 Art. 22) |

> **Note:** The 7-year retention overrides the 5-year reference in the existing KYC section — update KYC doc accordingly. Authority: AML Law Federal Decree-Law No. 20 of 2018, Article 20(2), as amended.

### 11.2 CBUAE Reporting Obligations

- **goAML portal:** https://goaml.uaefiu.gov.ae
- **STR deadline:** As soon as suspicion arises (no time limit delay permitted)
- **CTR deadline:** Within 2 business days of transaction
- **Annual report:** DNFBP annual compliance statement to CBUAE

---

## 12. Rental Dispute Procedures (RDC Process)

### 12.1 Rental Disputes Centre (RDC) — Established under Law No. 26 of 2013

| Stage | Process | Timeline | Platform Support |
|-------|---------|---------|-----------------|
| 1. Filing | Claimant files via RDC portal or office | Day 0 | Generate RDC filing pack from lease record |
| 2. Fee | Pay 3.5% of annual rent (min AED 500, max AED 20,000) | Day 0–1 | `dispute.rdcFilingFeeAED` field |
| 3. Notification | RDC notifies respondent | Within 15 days | Log notification date |
| 4. Reconciliation session | Mediation attempt | 7–14 days after notification | `dispute.reconciliationDate` |
| 5. Hearing | Judge hearing if no reconciliation | 30–45 days post-filing | `dispute.hearingDate` |
| 6. Judgment | Written judgment issued | 7–14 days post-hearing | `dispute.judgmentDate`, `dispute.judgmentOutcome` |
| 7. Appeal | Court of First Instance (30-day window) | Within 30 days of judgment | `dispute.appealFiledDate` |
| 8. Execution | Execution order to enforce judgment | Post-final judgment | `dispute.executionOrderDate` |

### 12.2 Landlord Notice Forms — Legal Requirements

| Form | Purpose | Notice Period | Legal Basis |
|------|---------|--------------|-------------|
| Form 7 | Rent increase notice to tenant | 90 days before renewal | Law No. 26 of 2013, Art. 9; RERA Rental Index |
| Form 12 | Eviction notice (personal use, renovation, demolition, sale) | 12 months notice | Law No. 26 of 2013, Art. 25(b) |
| Form 12 (non-payment) | Eviction for non-payment of rent | 30 days notice to pay | Law No. 26 of 2013, Art. 25(a) |
| Form 6 | Non-renewal notice (landlord not renewing) | 12 months notice | Law No. 26 of 2013, Art. 25 |

**RERA Rental Index Compliance:**
- Rent increases are capped based on the RERA Rental Index
- Increase cap: 0% if current rent is within 10% of index; up to 20% if rent is 40%+ below index
- CRM must pull RERA Rental Index API or manual input to validate Form 7 increase percentage

> **Testability:** Unit test must verify `validateRentIncrease(currentRent, indexRent)` returns `{ allowed: false, reason: "Increase exceeds RERA cap" }` when increase > permitted percentage.

