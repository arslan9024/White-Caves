# Sharjah Tenancy Law & Fee Verification Standard (Al Nabba Case Study)

**Document Owner:** @Sofia (Compliance Specialist) & @Victoria (Leasing Specialist)  
**Applicable Jurisdictions:** Emirate of Sharjah (Law No. 5 of 2024) & Emirate of Dubai (RERA / DLD Law 26 of 2007)  
**Target Purpose:** Public & Enterprise Tenancy Fee Audit, Overcharge Prevention, and Legal Rights Compliance  
**Last Updated:** 2026-08-12  

---

## 1. Case Study Overview — Al Nabba, Sharjah (Studio Lease Audit)

- **Location:** Al Nabba, Sharjah
- **Property Type:** Unfurnished Residential Studio Apartment
- **Annual Rent:** AED 12,000 / year
- **Total Quoted Initial Outlay:** AED 18,790
- **Total Legal & Fair Outlay:** AED 15,930
- **Potential Tenant Savings Identified:** **AED 2,860**

---

## 2. Itemized Fee Verification Matrix

| Fee Name | Quoted Amount (AED) | Legal Amount (AED) | Status | Refundable? | Legal Basis & Governing Rule | Authority / Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Annual Rent** | AED 12,000 | AED 12,000 | `valid` | No | Standard market price for unfurnished studio in Al Nabba. | [Bayut](https://bayut.com) |
| **Building Security Deposit** | AED 1,500 | AED 1,500 | `valid` | **Yes** | Acceptable landlord requirement. Must be explicitly written as refundable upon move-out. | Lease Contract |
| **Building Management & Maintenance** | AED 1,000 | **AED 0** | **`illegal`** | No | Under Sharjah Rental Law, landlords/management are legally responsible for building maintenance. Service fees cannot be passed to tenants. | [Almawarid Real Estate](https://almawaridrealestate.ae) |
| **SEWA Deposit** | AED 1,010 | **AED 500** | **`overcharged`** | **Yes** | SEWA strictly fixes security deposit for a residential Studio Apartment at AED 500 flat. | [Dubizzle / SEWA](https://dubizzle.com) |
| **Municipality Attestation** | AED 930 | **AED 580** | **`overcharged`** | No | Sharjah Municipality charges 4% of annual rent (AED 480) plus AED 100 authentication form fee. | [SELES / Sharjah Municipality](https://seles.io) |
| **File Typing Fee** | AED 350 | AED 350 | `valid` | No | Standard administrative processing fee charged by typing centers or Tasheel platforms. | [SELES](https://seles.io) |
| **Agency Commission** | AED 2,000 | **AED 1,000** | **`inflated`** | No | Market commission for low-rent studios ranges from AED 1,000 to AED 1,500. AED 2,000 represents an aggressive 16.6% markup. | UAE Market Benchmark |

---

## 3. Mandatory Sharjah Legal Protections

### 🛡️ Mandatory 3-Year Rent Freeze Rule (Sharjah Law No. 5 of 2024)
Under **Sharjah Law No. 5 of 2024**, residential tenancy contracts in the Emirate of Sharjah enjoy a **mandatory 3-year rent freeze** starting from the initial lease commencement date. Landlords are legally prohibited from increasing rent during the first 3 years of tenancy.

---

## 4. Structured JSON Payload Reference

```json
{
  "property_details": {
    "location": "Al Nabba, Sharjah",
    "property_type": "Studio",
    "annual_rent_aed": 12000
  },
  "fee_verification": [
    {
      "fee_name": "Annual Rent",
      "quoted_amount_aed": 12000,
      "legal_amount_aed": 12000,
      "status": "valid",
      "is_refundable": false,
      "legal_basis_or_rule": "Standard market price for an unfurnished studio in Al Nabba.",
      "source_link": "https://bayut.com"
    },
    {
      "fee_name": "Building Security Deposit",
      "quoted_amount_aed": 1500,
      "legal_amount_aed": 1500,
      "status": "valid",
      "is_refundable": true,
      "legal_basis_or_rule": "Acceptable landlord requirement. Must be explicitly written as refundable upon move-out in the contract.",
      "source_link": ""
    },
    {
      "fee_name": "Building Management & Maintenance",
      "quoted_amount_aed": 1000,
      "legal_amount_aed": 0,
      "status": "illegal",
      "is_refundable": false,
      "legal_basis_or_rule": "Under Sharjah Rental Law, landlords/management are legally responsible for building maintenance. They cannot pass community or service fees to residential tenants.",
      "source_link": "https://almawaridrealestate.ae"
    },
    {
      "fee_name": "SEWA Deposit",
      "quoted_amount_aed": 1010,
      "legal_amount_aed": 500,
      "status": "overcharged",
      "is_refundable": true,
      "legal_basis_or_rule": "Sharjah Electricity and Water Authority (SEWA) strictly fixes the security deposit for a residential Studio Apartment at AED 500.",
      "source_link": "https://dubizzle.com"
    },
    {
      "fee_name": "Municipality Attestation",
      "quoted_amount_aed": 930,
      "legal_amount_aed": 580,
      "status": "overcharged",
      "is_refundable": false,
      "legal_basis_or_rule": "Sharjah Municipality charges exactly 4% of the annual rent (AED 480) plus a flat AED 100 fee for the contract authentication form.",
      "source_link": "https://seles.io"
    },
    {
      "fee_name": "File Typing Fee",
      "quoted_amount_aed": 350,
      "legal_amount_aed": 350,
      "status": "valid",
      "is_refundable": false,
      "legal_basis_or_rule": "Standard administrative processing fee charged by real estate typing centers or Tasheel/Amer platforms.",
      "source_link": "https://seles.io"
    },
    {
      "fee_name": "Agency Commission",
      "quoted_amount_aed": 2000,
      "legal_amount_aed": 1000,
      "status": "inflated",
      "is_refundable": false,
      "legal_basis_or_rule": "Sharjah agencies typically charge a minimum flat-rate commission for low-rent studios ranging from AED 1,000 to AED 1,500. AED 2,000 represents an aggressive 16.6% markup.",
      "source_link": ""
    }
  ],
  "totals": {
    "total_quoted_aed": 18790,
    "total_legal_and_fair_aed": 15930,
    "potential_tenant_savings_aed": 2860
  },
  "legal_protections": {
    "rent_freeze_rule": "Under Sharjah Law No. 5 of 2024, residential tenancies enjoy a mandatory 3-year rent freeze starting from the lease commencement date."
  }
}
```
