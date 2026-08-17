# Software Requirements Specification (SRS)
## Henry AI — Tenancy Contract Optical AI Scanner, Fill Detection & Learning Engine
**Document Version:** 1.0.0  
**Authority:** White Caves Real Estate L.L.C (DET: `1388443`, RERA ORN: `44483`)  
**Standard:** Dubai Land Department (DLD) Unified Tenancy Contract (عقد إيجار) Analysis  
**System Module:** `HenryTenancyContractScannerService.ts` / `HenryDocumentStudio`

---

### 1. Executive Summary & Regulatory Objective
The **Dubai Land Department (DLD)** Unified Tenancy Contract is the standard legal document required for leasing in the Emirate of Dubai under **Law No. (26) of 2007** and **Law No. (33) of 2008**. 

This system enables **Henry AI (Sovereign Record Keeper)** to autonomously scan, classify, and extract data from any uploaded DLD Tenancy Contract PDF or image, determining whether the document is:
1. **Unfilled / Blank Template**: Reusable base contract format.
2. **Filled & Executed Contract**: Active legal lease agreement containing party identities, property parameters, financial rent schedules, and bespoke addenda.

The extracted information is structured into semantic groups, scored for completeness, archived in LocalStorage/Henry Vault, and used to train Henry AI's auto-fill preparation engine.

---

### 2. Live Extracted Benchmark Dataset (`SANIT_SINGH_CAMELIA_608_SAMPLE`)

From the benchmark document provided by White Caves operations:

#### 🔹 Group 1: Contract Header & Meta
| Field | Extracted Value | Status |
|---|---|---|
| **Contract Date** | `10-07-2026` | ✅ Filled |
| **Document Classification** | `DLD Unified Tenancy Contract (3 Pages)` | ✅ Validated |
| **Fill Status** | `FILLED & EXECUTED (92% Completeness)` | ✅ Active Lease |

#### 🔹 Group 2: Landlord / Lessor Information
| Field | Extracted Value | Status |
|---|---|---|
| **Owner's Name** | `SANIT SINGH NAGPAL` | ✅ Filled |
| **Lessor's Name** | `SANIT SINGH NAGPAL` | ✅ Filled |
| **Lessor Emirates ID** | `784-1999-5371408-8` | ✅ Filled |
| **Lessor Email** | `nagpalsanit@gmail.com` | ✅ Filled |
| **Lessor Phone** | `0504458097` (`+971 50 445 8097`) | ✅ Filled |
| **Company Trade License** | `N/A (Individual Landlord)` | ⚪ Optional/Blank |

#### 🔹 Group 3: Tenant Information
| Field | Extracted Value | Status |
|---|---|---|
| **Tenant's Name** | `KESHIVANI MAYADEVAN` | ✅ Filled |
| **Tenant Emirates ID** | `784-1984-7391875-7` | ✅ Filled |
| **Tenant Email** | `shivanimayadevan9@gmail.com` | ✅ Filled |
| **Tenant Phone** | `050 7915250` (`+971 50 791 5250`) | ✅ Filled |
| **Company Trade License** | `N/A (Individual Tenant)` | ⚪ Optional/Blank |

#### 🔹 Group 4: Property Information
| Field | Extracted Value | Status |
|---|---|---|
| **Property Usage** | `Residential (سكني)` | ✅ Selected |
| **Building Name** | `CAMELIA` | ✅ Filled |
| **Property / Unit No.** | `608` | ✅ Filled |
| **Plot Number** | `176` | ✅ Filled |
| **Property Type** | `LAND` (Townhouse / Villa Plot) | ✅ Filled |
| **Property Area (Sq.M)** | `112.24` ($1,208.14 \text{ sq.ft}$) | ✅ Filled |
| **Location / Community** | `DAMAC HILLS 2` | ✅ Filled |
| **DEWA Premise Number** | `Pending Connection` | ⚪ Blank |
| **Makani Number** | `Pending Registration` | ⚪ Blank |

#### 🔹 Group 5: Lease Financials & Terms
| Field | Extracted Value | Status |
|---|---|---|
| **Contract Period** | `13-07-2026` to `12-07-2027` (1 Year) | ✅ Filled |
| **Annual Rent (AED)** | `112,000 AED` | ✅ Filled |
| **Contract Value (AED)** | `112,000 AED` | ✅ Filled |
| **Security Deposit (AED)** | `5,600 AED` (5% Standard Deposit) | ✅ Filled |
| **Mode of Payment** | `3 CHEQUES` | ✅ Filled |

#### 🔹 Group 6: Additional Terms & Addenda (Page 3)
| # | Term Clause Extracted | Status |
|---|---|---|
| **1** | `Addendum is part of contract.` | ✅ Filled |
| **2** | `Contract valid 1 year; renewal needs landlord approval.` | ✅ Filled |
| **3** | `Deposit non-refundable if house not clean, undamaged, with service proof.` | ✅ Filled |
| **4** | `Landlord arranges pre-move-in cleaning, painting, AC service.` | ✅ Filled |
| **5** | `Key handover after EJARI, DEWA receipt, DAMAC permit.` | ✅ Filled |

---

### 3. Functional Requirements (FR)

- **FR-01: Optical Fill State Detection:** The parser must evaluate field density and output `isFilled: boolean`, `fillScorePercent: number`, and an array of `missingFields`.
- **FR-02: Grouped Variable Extraction:** All 35+ fields must be structured into `lessor`, `tenant`, `property`, `contract`, `addenda`, and `signatures` JSON objects.
- **FR-03: Variable Export & Inter-Module Distribution:** Extracted data must be exportable with 1-click to JSON clipboard, CRM Landlord/Tenant profiles, and the Tenancy Contract Preparation Studio.
- **FR-04: Machine Learning Reference Training:** Henry AI saves scanned benchmark contracts to LocalStorage under `whitecaves_henry_contract_training_set` to continuously optimize auto-fill mapping.
