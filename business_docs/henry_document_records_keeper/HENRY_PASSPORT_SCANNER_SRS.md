# 📋 Software Requirements Specification (SRS): Henry AI International Passport Optical Scanner & KYC Engine

**Target System:** Henry AI Records Keeper & Document Studio (`WC-AI-003`)  
**Module:** `src/services/HenryPassportScannerService.ts` & `src/components/crm/HenryDocumentStudio/HenryPassportScannerView.tsx`  
**Governing Authority:** ICAO Standard 9303 / UAE Federal Authority for Identity, Citizenship, Customs and Port Security (ICP) / goAML UAE FIU  
**Standard:** 3-Part UI Architecture + Temporary Session Store

---

## 1. Objective & Scope

This specification defines the functional, structural, and regulatory compliance requirements for the **3.19.4 Scan International Passport (جواز السفر الدولي)** module within **Henry AI Document Studio**.

The engine enables real estate brokers, conveyancers, and compliance officers to:
1. Ingest digital scans and photographed bio-pages of International Passports across **all file formats** (PDF single/multi-page, PNG, JPG, JPEG, WEBP).
2. Automatically parse **16+ discrete personal, biometric, national identity, and 2-line ICAO Doc 9303 TD3 Machine Readable Zone (MRZ)** variables.
3. Cache extracted attributes in a **temporary session memory store** with reactive listeners for immediate cross-consumption in:
   - **3.19.1 Unified Tenancy Contracts & Ejari Records** (for non-resident tenants/landlords).
   - **DLD Form F / MOU Real Estate Sale Agreements** (Buyer & Seller identification).
   - **RERA Form B Client Viewing Registers**.
   - **goAML UAE Anti-Money Laundering & PEP Screening Vaults**.

---

## 2. Document Format & Algorithmic Requirements

### F-REQ-01: Universal Multi-Format Ingestion
- **Formats Supported:**
  - `application/pdf` (Electronic / e-Passport bio-data scans)
  - `image/png`, `image/jpeg`, `image/jpg`, `image/webp` (Photographed passport bio booklets)
- Drag-and-drop dropzone with preloaded benchmark samples (`Pakistani`, `British`, `US`, `Russian`, `Indian` passports).

### F-REQ-02: Algorithmic ICAO 9303 TD3 2-Line MRZ Parsing
- Parse the 44-character 2-line Machine Readable Zone (MRZ):
  - **Line 1 (44 chars):** Document Type (`P`), Issuing Country Code (`PAK`), Surname (`MALIK`), and Given Names (`ARSLAN`).
  - **Line 2 (44 chars):** Passport Number (`DR0760143`), Check Digit (`1`), Nationality (`PAK`), Date of Birth (`YYMMDD` + check digit), Gender (`M`/`F`), Expiry Date (`YYMMDD` + check digit), Optional National ID/CNIC (`3230343390149`), and Composite Check Digits.

### F-REQ-03: Visual Bio-Data Text Extraction
- Extract visual bio-data fields:
  - **Full Name:** `Arslan Malik` (Surname: `MALIK`, Given Names: `ARSLAN`).
  - **Father's Name:** `Bashir Ahmad`.
  - **National Identity / Citizenship Number (CNIC):** `32303-4339014-9`.
  - **Place of Birth:** `MUZAFFARGARH, PAK`.
  - **Dates:** Date of Birth (`10/02/1993`), Date of Issue (`22/02/2024`), Date of Expiry (`21/02/2034`).
  - **Security & Tracking:** Booklet Number (`R7587163`), Tracking Number (`99992498902`), Issuing Authority (`PAKISTAN`).

---

## 3. Temporary Session Store & Cross-Feature Integration

### F-REQ-04: Session Caching Contract
- Temporary cache stored at `safeStorage` key `'whitecaves_henry_active_passport_cache_v1'`.
- React subscribers listen via `onPassportUpdated((data) => ...)` to instantly propagate passport updates.
- Explicit lifecycle methods: `setCachedPassport`, `getCachedPassport`, and `clearCachedPassport`.

### F-REQ-05: 1-Click Platform Cross-Actions
- **Auto-Fill Tenancy Lease (as Tenant):** Injects non-resident tenant details into active Tenancy Contract draft (`HenryTenancyContractTemplateService`).
- **Auto-Fill Tenancy Lease (as Landlord):** Injects international landlord details into active Tenancy Contract draft.
- **Save to KYC Vault:** Commits verified passport record to encrypted client vault.
- **Copy JSON:** Formatted JSON clipboard export.

---

## 4. 3-Part User Interface Architecture

1. **Component 1: Upload File Component** — Drag-and-drop dropzone supporting PDF, PNG, JPG, WEBP + benchmark sample presets.
2. **Component 2: Preview Document Component** — Zoomable canvas viewer with Zoom In/Out controls and certified ICAO passport booklet card.
3. **Component 3: Extracted Information Section** — 5 categorized editable cards (Passport & Issuing State, Full Legal Names, Demographics, Validity Lifespan, ICAO 9303 TD3 MRZ Terminal) with live action buttons.
