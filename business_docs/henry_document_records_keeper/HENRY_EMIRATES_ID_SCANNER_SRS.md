# 📋 Software Requirements Specification (SRS): Henry AI Emirates ID Optical Scanner & Extraction Engine

**Target System:** Henry AI Records Keeper & Document Studio  
**Module:** `src/services/HenryEmiratesIdScannerService.ts` & `src/components/crm/HenryDocumentStudio/`  
**Governing Authority:** Federal Authority for Identity & Citizenship, Customs & Port Security (ICP) / Dubai Land Department (DLD)  

---

## 1. Objective & Scope

This specification defines the functional, structural, and regulatory requirements for the **Emirates ID Optical Scanner & Data Ingestion Engine** integrated into **Henry AI**.

The engine enables real estate brokers, compliance officers, and property managers to upload images or PDF scans of UAE Resident Identity Cards (Front & Back), automatically parse **18 discrete data fields** (including visual text and 3-line ICAO 9303 TD1 MRZ), and export these variables directly into CRM lead records, Tenancy Contracts, Ejari registration registers, and AML compliance audits.

---

## 2. Functional Requirements (F-REQ)

### F-REQ-01: Dual-Side Image Ingestion
- Ingest JPEG, PNG, WEBP, and PDF scans of Emirates ID Front and Back sides.
- Support single-image or dual-image simultaneous drag-and-drop.

### F-REQ-02: Algorithmic ICAO 9303 TD1 3-Line MRZ Parsing
- Parse the 30-character 3-line Machine Readable Zone (MRZ) located on the card back:
  - **Line 1:** Document Type (`IL`), Issuing Country (`ARE`), Card Serial Number, and 15-digit Emirates ID (`784-YYYY-XXXXXXX-Z`).
  - **Line 2:** Date of Birth (`YYMMDD` + check digit), Gender (`M`/`F`), Expiry Date (`YYMMDD` + check digit), Nationality Code (`PAK`/`ARE`/etc.).
  - **Line 3:** Primary and Secondary Names in `<` delimited format (`BASHIR<AHMAD<<ARSLAN<MALIK<<<<`).

### F-REQ-03: Visual OCR & Arabic Field Extraction
- Extract bilingual fields:
  - Full Name in English and Arabic (`ارسلان مالك بشير احمد`).
  - Employer / Sponsor in English and Arabic (`White Caves Real Estate L.L.C` / `وايت كيفز للعقارات ذ.م.م`).
  - Occupation in English and Arabic (`Managing Director` / `مدير إدارة`).
  - Issuing Place in English and Arabic (`Dubai` / `دبي`).
  - Card Serial Number (`144597571`) and Chip ID (`2500069345`).

### F-REQ-04: Variable Export & 1-Click Platform Distribution
- Expose typed JavaScript/TypeScript variables (`EmiratesIdExtractedData`).
- 1-Click mapping to:
  1. `TenancyContractPayload.tenant` or `landlord`.
  2. `ViewingFormPayload.clientName` / `clientPassportOrEid`.
  3. `GovernmentEjariRecord.tenantName` / `landlordName`.
  4. CRM Lead Profile contact sync.
  5. JSON clipboard payload export.
