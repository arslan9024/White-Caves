# Software Requirements Specification (SRS)
## Henry AI — Official DLD Unified Tenancy Contract Template & Preparation Journey
**Document Version:** 1.0.0  
**Authority:** White Caves Real Estate L.L.C (DET: `1388443`, RERA ORN: `44483`)  
**Standard:** Dubai Land Department (DLD) Unified Tenancy Contract (عقد إيجار)  
**System Module:** `HenryDocumentStudio` / `HenryTenancyContractTemplateService`

---

### 1. Executive Summary & Regulatory Objective
In the Emirate of Dubai, all residential, commercial, and industrial lease agreements must comply with **Law No. (26) of 2007** (as amended by **Law No. (33) of 2008**) and **Law No. (43) of 2013** governing rent increases. The standard contract format approved by the **Dubai Land Department (DLD)** and the **Real Estate Regulatory Agency (RERA)** is the **Unified Tenancy Contract (عقد إيجار)**.

This specification governs the storage, optical variable extraction, local storage template persistence, and interactive 2-pane preparation workflow for generating legally compliant, bilingual DLD Tenancy Contracts within **Henry AI (Sovereign Record Keeper)**.

---

### 2. Full Extractable Variable Inventory (Complete Schema)

| Category | Field Name | English Label | Arabic Label (بالعربية) | Type | Source Ingestion |
|---|---|---|---|---|---|
| **Header** | `contractDate` | Contract Date | التاريخ | `date (DD/MM/YYYY)` | System / Manual |
| **Owner / Lessor** | `ownerName` | Owner's Name | اسم المالك | `string` | Title Deed OCR |
| **Owner / Lessor** | `lessorName` | Lessor's Name | اسم المؤجر | `string` | Title Deed / POA |
| **Owner / Lessor** | `lessorEmiratesId` | Lessor's Emirates ID | الهوية الإماراتية للمؤجر | `string` | EID OCR |
| **Owner / Lessor** | `lessorLicenseNo` | License No. (In case of Company) | رقم الرخصة (في حال كانت شركة) | `string` | Trade License OCR |
| **Owner / Lessor** | `lessorLicensingAuthority` | Licensing Authority | سلطة الترخيص | `string` | Trade License OCR |
| **Owner / Lessor** | `lessorEmail` | Lessor's Email | البريد الإلكتروني للمؤجر | `string` | CRM Landlord Profile |
| **Owner / Lessor** | `lessorPhone` | Lessor's Phone | رقم هاتف المؤجر | `string` | CRM Landlord Profile |
| **Tenant** | `tenantName` | Tenant's Name | اسم المستأجر | `string` | EID / Passport OCR |
| **Tenant** | `tenantEmiratesId` | Tenant's Emirates ID | الهوية الإماراتية للمستأجر | `string` | EID / Passport OCR |
| **Tenant** | `tenantLicenseNo` | License No. (In case of Company) | رقم الرخصة (في حال كانت شركة) | `string` | Corporate Tenant File |
| **Tenant** | `tenantLicensingAuthority` | Licensing Authority | سلطة الترخيص | `string` | Corporate Tenant File |
| **Tenant** | `tenantEmail` | Tenant's Email | البريد الإلكتروني للمستأجر | `string` | CRM Lead Profile |
| **Tenant** | `tenantPhone` | Tenant's Phone | رقم هاتف المستأجر | `string` | CRM Lead Profile |
| **Property** | `propertyUsage` | Property Usage | استخدام العقار | `residential` \| `commercial` \| `industrial` | Title Deed / Selection |
| **Property** | `plotNo` | Plot No. | رقم الأرض | `string` | Title Deed OCR |
| **Property** | `makaniNo` | Makani No. | رقم مكاني | `string` | Title Deed / DEWA |
| **Property** | `buildingName` | Building Name | اسم المبنى | `string` | Title Deed OCR |
| **Property** | `propertyNo` | Property / Unit No. | رقم العقار / الوحدة | `string` | Title Deed OCR |
| **Property** | `propertyType` | Property Type | نوع الوحدة | `string` | Title Deed OCR |
| **Property** | `propertyAreaSqM` | Property Area (Sq.M) | مساحة العقار (متر مربع) | `number` | Title Deed OCR |
| **Property** | `location` | Location / Area | الموقع | `string` | Title Deed OCR |
| **Property** | `premisesNoDewa` | Premises No. (DEWA) | رقم المبنى (ديوا) | `string` | DEWA Bill / Landlord |
| **Contract** | `contractPeriodFrom` | Contract Period From | فترة العقد من | `date (DD/MM/YYYY)` | Lease Term Selection |
| **Contract** | `contractPeriodTo` | Contract Period To | فترة العقد إلى | `date (DD/MM/YYYY)` | Lease Term Selection |
| **Contract** | `contractValue` | Contract Value (AED) | قيمة العقد (درهم) | `number` | Calculated / Input |
| **Contract** | `annualRent` | Annual Rent (AED) | الايجار السنوي (درهم) | `number` | Input / Negotiated |
| **Contract** | `securityDepositAmount` | Security Deposit Amount (AED) | مبلغ التأمين (درهم) | `number` | Input (5% - 10%) |
| **Contract** | `modeOfPayment` | Mode of Payment | طريقة الدفع | `string` (e.g., 4 Cheques) | PDC Schedule |
| **Signatures** | `tenantSignature` | Tenant Signature | توقيع المستأجر | `string (Base64 / E-Sign)` | E-Signature Token |
| **Signatures** | `tenantSignatureDate` | Tenant Sign Date | تاريخ توقيع المستأجر | `date (DD/MM/YYYY)` | E-Sign Timestamp |
| **Signatures** | `lessorSignature` | Lessor's Signature | توقيع المؤجر | `string (Base64 / E-Sign)` | E-Signature Token |
| **Signatures** | `lessorSignatureDate` | Lessor Sign Date | تاريخ توقيع المؤجر | `date (DD/MM/YYYY)` | E-Sign Timestamp |
| **Addendum** | `additionalTerms` | Additional Terms (1 to 5) | شروط إضافية (١ إلى ٥) | `string[]` | Custom Special Clauses |

---

### 3. Functional Requirements (FR)

- **FR-01: Blank Template Local Storage Persistence:** The system must maintain an immutable default blank template in `localStorage` under `whitecaves_dld_tenancy_template_v1`, enabling instant recall, resetting, and draft preservation.
- **FR-02: Interactive Split-Screen Modal:** When the user clicks **"Prepare New Tenancy Contract"**, an interactive high-fidelity modal opens:
  - **Left Pane (50%):** Live 3-page bilingual DLD official contract visual preview with zoom, page pagination, and real-time data hydration.
  - **Right Pane (50%):** 4-Step sequential preparation workflow with Title Deed OCR ingestion, Tenant EID/Passport OCR ingestion, financial configuration, and E-Sign generation.
- **FR-03: Multi-Source OCR Ingestion:** Seamless integration with `HenryTitleDeedScannerService` and `HenryEmiratesIdScannerService` / `HenryPassportScannerService` for 1-click field auto-population.
- **FR-04: Print & PDF Compilation:** High-resolution compilation conforming strictly to Dubai Land Department print dimensions (A4, 300 DPI, bilingual Arabic/English layout, official headers and legal terms).
