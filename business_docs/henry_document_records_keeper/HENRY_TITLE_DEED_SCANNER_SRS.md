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
- Drag-and-drop dropzone with fallback benchmark samples (`Viridis A 504`, `Janusia XH2858B`, `Marina Gate 2`).

### F-REQ-02: Bilingual Property & Unit Specification Extraction
- **Community:** English (`Madinat Hind 4`) and Arabic (`مدينة هند 4`).
- **Building Name & Number:** English (`VIRIDIS A`, Building `1`) and Arabic (`فريديس ايه A`).
- **Property / Unit No & Floor:** Unit `504`, Floor `5`.
- **Property Type:** English (`Hotel Apartment`) and Arabic (`شقة فندقية`).
- **Plot & Municipality Numbers:** Plot `5120`, Municipality `914 - 18558`.
- **Parking Allocation:** `P2-56`.
- **Mortgage Status:** English (`Not mortgaged`) and Arabic (`غير مرهونة`), Boolean `isMortgaged`.

### F-REQ-03: Area & Metric Measurements Normalization
- **Suite Area (Internal):** `32.48 m²` (`349.61 sq.ft`).
- **Balcony Area:** `6.28 m²` (`67.60 sq.ft`).
- **Total Area (Sq Meters):** `38.76 m²`.
- **Total Area (Sq Feet):** `417.21 sq.ft` (calculated with ratio `10.7639`).
- **Common Area:** `12.65 m²`.

### F-REQ-04: Registered Ownership & DLD Party ID
- **Owner DLD Number:** `6108481`.
- **Owner Full Name (English):** `AKRAM DIB NEHME`.
- **Owner Full Name (Arabic):** `أكرم ديب نعمة`.
- **Ownership Share:** `100%` (`38.76 m²`).

### F-REQ-05: Conveyancing & Purchase History
- **Purchased From (Seller / Developer):** `FRONT LINE INVESTMENT MANAGEMENT L.L.C` (`شركة الخط الأمامي لإدارة الاستثمار ش.ذ.م.م`).
- **Land Registration Contract Number:** `131762/2023`.
- **Registration Date:** `18/07/2023`.
- **Purchase Price (AED):** `353,000` (`Three Hundred Fifty Three Thousand UAE Dirhams only`).
- **DLD Certificate Barcode Number:** `140764/2023`.

---

## 3. Temporary Session Store & Cross-Feature Integration

### F-REQ-06: Session Caching Contract
- Temporary cache stored at `safeStorage` key `'whitecaves_henry_active_title_deed_cache_v1'`.
- React subscribers listen via `onTitleDeedUpdated((data) => ...)` to instantly reflect property modifications across the CRM.
- Explicit lifecycle methods: `setCachedTitleDeed`, `getCachedTitleDeed`, and `clearCachedTitleDeed`.

### F-REQ-07: 1-Click Platform Cross-Actions
- **Auto-Fill Tenancy Lease:** Injects property title, unit number, plot number, community, and landlord into active Tenancy Contract draft (`HenryTenancyContractTemplateService`).
- **Create CRM Listing:** Transforms deed data into typed `PropertyItem` draft for instant portal syndication.
- **Save to Property Vault:** Commits validated certificate to persistent encrypted CRM vault.
- **Copy JSON:** Formatted JSON clipboard export.

---

## 4. 3-Part User Interface Architecture

1. **Component 1: Upload File Component** — Drag-and-drop dropzone supporting PDF, PNG, JPG, WEBP + benchmark sample presets.
2. **Component 2: Preview Document Component** — Zoomable canvas viewer with Zoom In/Out controls and certified Dubai Land Department certificate layout.
3. **Component 3: Extracted Information Section** — 5 categorized editable cards (Ownership & DLD Keys, Property Specs, Metric Areas, Conveyancing & Financials, Blockchain & Registry QR) with live action buttons.
