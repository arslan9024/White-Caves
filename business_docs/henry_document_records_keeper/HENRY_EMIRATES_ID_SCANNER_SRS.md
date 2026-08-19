# 📋 Software Requirements Specification (SRS): 3.19.2 Scan Emirates ID

**Target System:** White Caves Document Studio & ERP Core — AI Assistant Henry (`WC-AI-003`)  
**Module Identifier:** `3.19.2 Scan Emirates ID` (`src/components/crm/HenryDocumentStudio/HenryEmiratesIdScannerView.tsx` & `src/services/HenryEmiratesIdScannerService.ts`)  
**Regulatory Standards:** Federal Authority for Identity, Citizenship, Customs and Port Security (ICP) / Dubai Land Department (DLD) / UAE Federal Decree-Law No. (45) of 2021 on Personal Data Protection (PDPL)  
**Version:** 3.0.0 (All-Format Front & Back Optical Ingestion + Session Cache)  

---

## 1. Executive Summary & Purpose

The **3.19.2 Scan Emirates ID** module is a core sovereign optical intelligence engine within Henry AI. It is designed to autonomously ingest, classify, optical-scan, validate, and extract structured identity data from UAE Resident Identity Cards across **all document formats** (PDF, PNG, JPG, JPEG, WEBP), recognize **Front and Back document sides**, temporarily store verified records in session memory, and distribute these attributes to downstream CRM and legal workflows (3.19.1 Tenancy Contracts, Ejari Vault, Form B Viewing Registers, and goAML KYC audits).

---

## 2. Document Format & Input Specifications

### 2.1 Supported File Types & MIME Types
| Format | Extension | Max File Size | Multi-Page Support |
| :--- | :--- | :--- | :--- |
| **Portable Document Format** | `.pdf` | 15 MB | Yes (Page 1 = Front, Page 2 = Back) |
| **Portable Network Graphics** | `.png` | 10 MB | Yes (via Dual-File Upload) |
| **Joint Photographic Experts Group** | `.jpg`, `.jpeg` | 10 MB | Yes (via Dual-File Upload) |
| **WebP Image Format** | `.webp` | 10 MB | Yes (via Dual-File Upload) |

### 2.2 Upload Configurations
1. **Single Unified File:** Upload a 2-page PDF or a single stitched composite image containing both Front and Back sides.
2. **Dual-File Ingestion:** Dedicated dropzones for **Front Side** (Visual Bio, Photo, ID Number) and **Back Side** (ICAO TD1 MRZ, Chip ID, Card Serial).
3. **1-Click Benchmark Presets:** Instant loading of pre-validated samples (e.g. Arslan Malik `784-1993-1805733-0`).

---

## 3. Side Recognition & Document Classification

The engine implements automatic heuristic and structural side detection:
- **Front Side Detection:** Identifies the presence of the 15-digit national ID header (`784-YYYY-XXXXXXX-Z`), bilingual card headers ("UNITED ARAB EMIRATES", "الهيئة الاتحادية للهوية"), visual photo box, and bilingual full names.
- **Back Side Detection:** Identifies the 3-line ICAO 9303 TD1 Machine Readable Zone (`ILARE...`), Card Serial Number, Chip Number, and Employer/Occupation text.
- **Composite/Dual Detection:** Automatically segments and correlates front visual data with back MRZ checksums when both are provided.

---

## 4. Exact 18+ Field Extraction Data Contract

The engine extracts and normalizes the following structured attributes into `EmiratesIdExtractedData`:

### 4.1 Identity Keys
1. `idNumber`: Normalized 15-digit formatted string (`784-YYYY-XXXXXXX-Z`).
2. `rawIdNumber`: Unformatted 15 digits (`784199318057330`).
3. `cardNumber`: 9-digit card serial number (e.g. `144597571`).
4. `chipNumber`: Embedded smart chip serial (e.g. `2500069345`).

### 4.2 Bilingual Personal Identity
5. `fullNameEn`: Full name in English (`Arslan Malik Bashir Ahmad`).
6. `fullNameAr`: Full name in Arabic (`ارسلان مالك بشير احمد`).
7. `firstName`: Primary given name (`Arslan`).
8. `lastName`: Family name / Patronymic (`Bashir Ahmad`).
9. `dateOfBirth`: Date of birth formatted as `DD/MM/YYYY` (e.g. `10/02/1993`).
10. `gender`: Biological sex code (`M` or `F`).
11. `nationalityEn`: Country of citizenship in English (`Pakistan`).
12. `nationalityAr`: Country of citizenship in Arabic (`باكستان`).
13. `nationalityCode`: ISO 3166-1 alpha-3 code (`PAK`).

### 4.3 Validity Lifespan & Status
14. `issueDate`: Date of card issue (`DD/MM/YYYY`).
15. `expiryDate`: Date of card expiration (`DD/MM/YYYY`).
16. `isExpired`: Boolean flag based on current timestamp comparison.
17. `daysUntilExpiry`: Numeric countdown to expiration.

### 4.4 Employment & Residency
18. `occupationEn`: Stated profession in English (`Managing Director`).
19. `occupationAr`: Stated profession in Arabic (`مدير إدارة`).
20. `employerEn`: Sponsoring entity / employer in English (`White Caves Real Estate L.L.C`).
21. `employerAr`: Sponsoring entity / employer in Arabic (`وايت كيفز للعقارات ذ.م.م`).
22. `issuingPlaceEn`: Emirate of issuance in English (`Dubai`).
23. `issuingPlaceAr`: Emirate of issuance in Arabic (`دبي`).

### 4.5 Machine Readable Zone (MRZ)
24. `mrz.line1`: 30-char TD1 Line 1 (`ILARE1445975719784199318057330`).
25. `mrz.line2`: 30-char TD1 Line 2 (`9302109M2611228PAK<<<<<<<<<<<6`).
26. `mrz.line3`: 30-char TD1 Line 3 (`BASHIR<AHMAD<<ARSLAN<MALIK<<<<`).

---

## 5. Temporary Session Storage & Cross-Module Reuse

### 5.1 Temporary Cache Architecture
- **In-Memory Reactive Cache:** Stored in `HenryEmiratesIdScannerService` session cache.
- **Session Persistence:** Backed by `safeStorage` (session storage) to survive hot reloads and cross-tab CRM navigation without permanent database exposure.
- **Event Bus:** Dispatches `onEmiratesIdUpdated` notifications whenever a new Emirates ID is scanned or updated.

### 5.2 Downstream Feature Injections
- **3.19.1 Prepare Tenancy Contract:** 1-click injection as Tenant or Landlord KYC party.
- **Ejari Registration Vault:** 1-click population of tenant/lessor identification registers.
- **Form B Viewing Register:** Auto-fill client name, contact, and ID credentials.
- **goAML & KYC Audit Records:** Direct payload ingestion for AML/CFT compliance verification.

---

## 6. Three-Part User Interface Architecture

The **3.19.2 Scan Emirates ID** user interface is organized into three distinct, non-modal components:

### 1. Upload File Component
- Drag-and-drop dropzone supporting PDF, PNG, JPG, JPEG, WEBP.
- Option for single file (auto-detect) or separate Front / Back dropzones.
- Instant feedback with scanning progress indicators, OCR accuracy status, and sample loader.

### 2. Preview Document Component
- High-fidelity zoomable document viewport (50% to 175% scaling).
- Interactive **Front / Back** flip toggle for dual-sided inspection.
- Optical canvas review with visual highlight boundaries.

### 3. Extracted Information Section
- Clear 5-card categorized presentation:
  1. *Identity Keys & Card Number* (with live Luhn/ICP checksum match indicator).
  2. *Bilingual Personal Information* (English & Arabic names, DOB, Gender, Nationality).
  3. *Validity & Expiry Dates* (Issue date, Expiry date, Active/Expired badge).
  4. *Employment & Sponsor Details* (Occupation, Employer, Issuing Emirate).
  5. *ICAO TD1 MRZ Terminal* (3-line monospace terminal display).
- Action buttons: *1-Click Auto-Fill Tenancy*, *Save to KYC Vault*, *Copy JSON*, *Clear Session*.

---

## 7. Security, Privacy & PDPL Compliance

1. **Client-Side Extraction Privacy:** OCR and MRZ decoding execute locally in browser memory or via private server endpoints; no third-party cloud data leakage.
2. **UAE PDPL Compliance:** Temporary cached data expires upon browser session termination or explicit clear action.
3. **Masking & Permissions:** Sensitive fields can be masked for non-authorized roles.
