# 📋 Software Requirements Specification (SRS): Henry AI DLD Title Deed Optical Scanner & Property Extraction Engine

**Target System:** Henry AI Records Keeper & Document Studio (`WC-AI-003`)  
**Module:** `src/services/HenryTitleDeedScannerService.ts` & `src/components/crm/HenryDocumentStudio/HenryTitleDeedScannerView.tsx`  
**Governing Authority:** Dubai Land Department (DLD) / Real Estate Regulatory Agency (RERA)  
**Standard:** 3-Part UI Architecture + Temporary Session Store

---

## 1. Objective & Scope

This specification defines the functional, architectural, and data model requirements for the **3.19.3 Scan Title Deed (شهادة ملكية عقار / عقود)** module within **Henry AI Document Studio**.

The engine enables brokers, conveyancers, and portfolio managers to:
1. Ingest official Dubai Land Department Title Deed and Oqood certificates across **all file formats** (PDF single/multi-page, PNG, JPG, JPEG, WEBP).
2. Automatically extract **22+ structural, ownership, measurement, and conveyancing fields** with live DLD checksum validation.
3. Cache extracted attributes in a **temporary session memory store** with reactive listeners for immediate cross-consumption in:
   - **3.19.1 Unified Tenancy Contract & Ejari Preparation** (`src/services/HenryPdfEngineService.ts`)
   - **RERA Form A Exclusive Seller Listing Mandates** (Law No. 85 of 2006)
   - **Property Inventory & CRM Listings** (`src/store/slices/propertiesSlice.ts`)
   - **Valuation & Comparative Market Analysis (CMA) Engine**

---

## 2. Document Format & Side Ingestion Requirements

### F-REQ-01: Universal Multi-Format Ingestion
- **Formats Supported:**
  - `application/pdf` (Electronic Title Deed Certificates, Barcoded Certificates)
  - `image/png`, `image/jpeg`, `image/jpg`, `image/webp` (Photographed/scanned deeds)
- Drag-and-drop dropzone with fallback benchmark samples (`BUKO COMMODITY DMCC (Plot 7354 Madinat Hind 4 Land)`, `Viridis A 504`, `Janusia XH2858B`, `Marina Gate 2`).

### F-REQ-02: Bilingual Property & Unit Specification Extraction
- **Community:** English (`Madinat Hind 4`) and Arabic (`مدينة هند 4`).
- **Building / Plot Name & Number:** English (`Plot 7354 Madinat Hind 4` / `VIRIDIS A`) and Arabic (`أرض 7354 مدينة هند 4` / `فريديس ايه A`).
- **Property / Unit No & Floor:** Unit `7354` / Unit `504`, Floor `Ground` / `5`.
- **Property Type:** English (`Land` / `Hotel Apartment`) and Arabic (`ارض` / `شقة فندقية`).
- **Plot & Municipality Numbers:** Plot `7354` / `5120`, Municipality `914 - 20879` / `914 - 18558`.
- **Parking Allocation:** `N/A` or `P2-56`.
- **Mortgage Status:** English (`Not mortgaged`) and Arabic (`غير مرهونة`), Boolean `isMortgaged`.

### F-REQ-03: Area & Metric Measurements Normalization
- **Suite Area (Internal):** `192.49 m²` / `32.48 m²`.
- **Balcony Area:** `0.00 m²` / `6.28 m²`.
- **Total Area (Sq Meters):** `192.49 m²` / `38.76 m²`.
- **Total Area (Sq Feet):** `2,071.95 sq.ft` / `417.21 sq.ft` (calculated with ratio `10.7639`).
- **Common Area:** `0.00 m²` / `12.65 m²`.

### F-REQ-04: Registered Ownership & DLD Party ID
- **Owner DLD Number:** `5124391` / `6108481`.
- **Owner Full Name (English):** `BUKO COMMODITY DMCC` / `AKRAM DIB NEHME`.
- **Owner Full Name (Arabic):** `بوكو كوموديتي م د م س` / `أكرم ديب نعمة`.
- **Ownership Share:** `100%` (`192.49 m²` / `38.76 m²`).

### F-REQ-05: Conveyancing & Purchase History
- **Purchased From (Seller / Developer):** `FRONT LINE INVESTMENT MANAGEMENT L.L.C` (`شركة الخط الامامي لادارة الاستثمار ش.ذ.م.م`).
- **Land Registration Contract Number:** `22855/2023` / `131762/2023`.
- **Registration Date:** `13/10/2025` / `18/07/2023`.
- **Purchase Price (AED):** `1,717,600` (`One Million Seven Hundred Seventeen Thousand Six Hundred UAE Dirhams only`) / `353,000`.
- **DLD Certificate Barcode Number:** `93757/2025` / `140764/2023`.

---

## 3. Temporary Session Store, Database Sync & Cross-Feature Integration

### F-REQ-06: Session Caching & Database Sync Contract
- Temporary cache stored at `safeStorage` key `'whitecaves_henry_active_title_deed_cache_v1'`.
- Persistent database synchronization via `POST /api/henry/documents/save` storing full JSON schema, DLD certificate numbers, and audit metadata.
- React subscribers listen via `onTitleDeedUpdated((data) => ...)` to instantly reflect property modifications across the CRM.
- Explicit lifecycle methods: `setCachedTitleDeed`, `getCachedTitleDeed`, `saveToDatabase`, and `clearCachedTitleDeed`.

### F-REQ-07: 1-Click Platform Cross-Actions
- **Auto-Fill Tenancy Lease:** Injects property title, unit number, plot number, community, and landlord into active Tenancy Contract draft (`HenryTenancyContractTemplateService`).
- **Create CRM Listing:** Transforms deed data into typed `PropertyItem` draft for instant portal syndication.
- **Save to Property Vault & Database:** Commits validated certificate to persistent encrypted CRM vault and server database.
- **Copy JSON:** Formatted JSON clipboard and API export (`exportToJsonString()`).

---

## 4. 3-Part User Interface Architecture

1. **Component 1: Upload File Component** — Drag-and-drop dropzone supporting PDF, PNG, JPG, WEBP + benchmark sample presets (`BUKO COMMODITY DMCC Land`, `Viridis A 504`).
2. **Component 2: Preview Document Component** — Zoomable canvas viewer with Zoom In/Out controls and certified Dubai Land Department certificate layout.
3. **Component 3: Extracted Information Section** — 5 categorized editable cards (Ownership & DLD Keys, Property Specs, Metric Areas, Conveyancing & Financials, Blockchain & Registry QR) with live action buttons.

