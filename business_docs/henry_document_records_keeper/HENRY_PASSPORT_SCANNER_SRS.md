# 📋 Software Requirements Specification (SRS): Henry AI International Passport Optical Scanner & KYC Engine

**Target System:** Henry AI Records Keeper & Document Studio  
**Module:** `src/services/HenryPassportScannerService.ts` & `src/components/crm/HenryDocumentStudio/`  
**Governing Authority:** ICAO Standard 9303 / UAE Federal Authority for Identity, Citizenship, Customs and Port Security (ICP) / goAML UAE FIU  

---

## 1. Objective & Scope

This specification defines the functional, structural, and regulatory compliance requirements for the **International Passport Optical Scanner & KYC Data Ingestion Engine** integrated into **Henry AI**.

The engine enables real estate brokers, conveyancers, and compliance officers to upload digital scans or photos of International Passports, automatically parse **16+ discrete personal, biometric, national identity, and Machine Readable Zone (MRZ)** fields, and export these variables directly into:
1. **Unified Tenancy Contracts & Ejari Records** (for international non-resident tenants/landlords).
2. **DLD Form F / MOU Real Estate Sale Agreements** (Buyer & Seller identification).
3. **RERA Form B Client Viewing Registers**.
4. **goAML UAE Anti-Money Laundering & PEP Screening Vaults**.

---

## 2. Functional Requirements (F-REQ)

### F-REQ-01: Document Ingestion & Image Processing
- Ingest high-resolution scans and photographs of International Passport bio-data pages (PDF, JPEG, PNG, WEBP).
- Support passport pages from any ICAO 9303 compliant sovereign nation.

### F-REQ-02: Algorithmic ICAO 9303 TD3 2-Line MRZ Parsing
- Parse the 44-character 2-line Machine Readable Zone (MRZ):
  - **Line 1 (44 chars):** Document Type (`P`), Issuing Country Code (`PAK`), Surname (`MALIK`), and Given Names (`ARSLAN`).
  - **Line 2 (44 chars):** Passport Number (`DR0760143`), Check Digit (`1`), Nationality (`PAK`), Date of Birth (`YYMMDD` + check digit), Gender (`M`/`F`), Expiry Date (`YYMMDD` + check digit), Optional National ID/CNIC (`3230343390149`), and Composite Check Digits.

### F-REQ-03: Visual OCR Text Extraction
- Extract visual bio-data fields:
  - **Full Name:** `Arslan Malik` (Surname: `MALIK`, Given Names: `ARSLAN`).
  - **Father's Name:** `AHMAD, BASHIR` (`Bashir Ahmad`).
  - **National Identity / Citizenship Number (CNIC):** `32303-4339014-9`.
  - **Place of Birth:** `MUZAFFARGARH, PAK`.
  - **Dates:** Date of Birth (`10 FEB 1993`), Date of Issue (`22 FEB 2024`), Date of Expiry (`21 FEB 2034`).
  - **Security & Tracking:** Booklet Number (`R7587163`), Tracking Number (`99992498902`), Issuing Authority (`PAKISTAN`).

### F-REQ-04: Variable Export & 1-Click Platform Distribution
- Expose typed JavaScript/TypeScript variables (`InternationalPassportExtractedData`).
- 1-Click mapping to:
  1. `TenancyContractPayload.tenant` or `landlord` (for non-resident clients).
  2. `ViewingFormPayload.clientName` / `clientPassportOrEid`.
  3. goAML KYC Compliance Audit profile.
  4. JSON clipboard export for external CRM/API distribution.
