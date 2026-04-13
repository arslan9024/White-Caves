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

## 5. RERA Fee Schedule (2026)

### Brokerage & Agent Fees
| Fee Type | Amount | When Due |
|----------|--------|----------|
| New broker license (company) | AED 5,100 + trade license | Initial registration |
| Broker license renewal | AED 5,100/year | Annual |
| Agent BRN registration | AED 3,710 | Initial (includes RERA training) |
| Agent BRN renewal | AED 510/year | Annual |
| Branch office registration | AED 5,100 | Per branch |
| Trakheesi permit (ad authorization) | AED 220/listing | Per property ad |
| Trakheesi bulk upload | AED 220 × listing count | Bulk sync to portals |
| RERA training certificate | AED 3,200 | Per agent (mandatory) |
| Real estate appraiser license | AED 5,100 | Per appraiser |

### Transaction Fees (DLD)
| Fee Type | Amount | Paid By |
|----------|--------|---------|
| Transfer fee (sale) | 4% of sale price | Split buyer/seller (negotiable) |
| DLD admin fee | AED 580 | Buyer |
| Mortgage registration | 0.25% of loan amount | Buyer |
| Mortgage release | AED 1,290 | Seller (upon payoff) |
| Oqood (off-plan SPA) | 4% of purchase price | Buyer |
| Title deed issuance | AED 250 | Buyer |
| NOC (No Objection Certificate) | AED 500-5,000 | Seller (varies by developer) |

### Escrow Account Requirements
- **Law**: Under Dubai Law No. 8 of 2007, escrow accounts are **mandatory** for off-plan developments
- **Regulated by**: RERA (escrow account registration required)
- **Platform impact**: Track escrow status for off-plan transaction pipeline
- **Developer obligations**:
  - Must deposit 20% of project cost before selling off-plan
  - All buyer payments go to RERA-registered escrow account
  - Escrow agent must be RERA-approved bank (Emirates NBD, ADCB, etc.)
  - Progress-linked payment plans: disbursement tied to construction milestones
- **Our integration** (planned): Track escrow milestone payments for off-plan transactions

---

## 6. VAT & TRN (Tax Registration Number)

### VAT in UAE Real Estate (Federal Decree-Law No. 8 of 2017)
| Transaction Type | VAT Rate | Notes |
|-----------------|----------|-------|
| **Commercial property sale** | 5% | Standard rated |
| **Residential property sale (first sale)** | 0% | Zero-rated (first supply within 3 years of completion) |
| **Residential property sale (resale)** | Exempt | No VAT on resale of residential |
| **Commercial property lease** | 5% | Standard rated |
| **Residential property lease** | Exempt | No VAT |
| **Brokerage commission** | 5% | Standard rated (always) |
| **Property management fees** | 5% | Standard rated |
| **Valuation/consulting fees** | 5% | Standard rated |
| **Bare land** | Exempt | No VAT |

### TRN Requirements for White Caves
- **TRN (Tax Registration Number)**: Mandatory for businesses with annual taxable supplies > AED 375,000
- **Voluntary registration**: Available for > AED 187,500
- **White Caves must**:
  - Display TRN on all invoices (commission invoices, management fee invoices)
  - Charge 5% VAT on commission invoices
  - File quarterly VAT returns via FTA (Federal Tax Authority) portal
  - Issue tax-compliant invoices (tax invoice requirements per Article 59)
- **Platform impact**:
  - `trnNumber` field on Company profile
  - VAT calculation on Commission model: `commission × 1.05` for invoicing
  - Tax invoice template in document generator (Form F + VAT line)
  - VAT line item on all commission invoices: `{ baseAmount, vatRate: 0.05, vatAmount, totalAmount }`

### Corporate Tax (Federal Decree-Law No. 47 of 2022)
- **Rate**: 9% on taxable income > AED 375,000 (effective June 2023)
- **Free zone exemption**: Available for qualifying free zone companies
- **White Caves impact**: Standard 9% corporate tax applies to net profits
- **Platform impact**: Financial reports should track revenue for tax filing purposes

---

## 7. Portal Integration Requirements

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

## 8. Multi-Currency Support

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
