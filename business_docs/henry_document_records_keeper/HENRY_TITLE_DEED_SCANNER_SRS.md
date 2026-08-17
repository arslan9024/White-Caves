# 📋 Software Requirements Specification (SRS): Henry AI DLD Title Deed Optical Scanner & Property Extraction Engine

**Target System:** Henry AI Records Keeper & Document Studio  
**Module:** `src/services/HenryTitleDeedScannerService.ts` & `src/components/crm/HenryDocumentStudio/`  
**Governing Authority:** Dubai Land Department (DLD) / Real Estate Regulatory Agency (RERA)  

---

## 1. Objective & Scope

This specification defines the functional, architectural, and data model requirements for the **DLD Title Deed Optical Scanner & Ingestion Engine** in **Henry AI**.

The engine enables brokers, conveyancers, and portfolio managers to upload official Dubai Land Department Title Deed documents (`شهادة ملكية عقار`), automatically extract **22+ structural, ownership, measurement, and historical transaction fields**, and distribute these variables directly into:
1. **Property Inventory & CRM Listings** (`src/store/slices/propertiesSlice.ts`).
2. **Unified Tenancy Contracts & Ejari Records** (`src/services/HenryPdfEngineService.ts`).
3. **RERA Form A Exclusive Seller Listing Mandates** (Law No. 85 of 2006).
4. **Valuation & Comparative Market Analysis (CMA) Engines**.

---

## 2. Functional Requirements (F-REQ)

### F-REQ-01: Document Ingestion & Format Support
- Ingest PDF, JPEG, PNG, and WEBP scans of official Dubai Land Department Title Deeds.
- Support both digital electronic certificates and photographed hard copies.

### F-REQ-02: Bilingual Property & Unit Specification Extraction
- **Community:** English (`Madinat Hind 4`) and Arabic (`مدينة هند 4`).
- **Building Name & Number:** English (`VIRIDIS A`, Building `1`) and Arabic (`فريديس ايه A`).
- **Property / Unit No & Floor:** Unit `504`, Floor `5`.
- **Property Type:** English (`Hotel Apartment`) and Arabic (`شقة فندقية`).
- **Plot & Municipality Numbers:** Plot `5120`, Municipality `914 - 18558`.
- **Parking Allocation:** `P2-56`.
- **Mortgage Status:** English (`Not mortgaged`) and Arabic (`غير مرهونة`).

### F-REQ-03: Area & Measurement Dual-Unit Normalization
- Extract and calculate:
  - **Suite Area (Internal):** `32.48 m²` (`349.61 sq.ft`).
  - **Balcony Area:** `6.28 m²` (`67.60 sq.ft`).
  - **Total Area (Sq Meters):** `38.76 m²`.
  - **Total Area (Sq Feet):** `417.21 sq.ft`.
  - **Common Area:** `12.65 m²`.

### F-REQ-04: Ownership & DLD Registration Identification
- **Owner DLD Number:** `6108481`.
- **Owner Full Name (English):** `AKRAM DIB NEHME`.
- **Owner Full Name (Arabic):** `أكرم ديب نعمة`.
- **Ownership Share:** `100%` (`38.76 m²`).

### F-REQ-05: Conveyancing & Purchase History Ingestion
- **Purchased From (Seller / Developer):** `FRONT LINE INVESTMENT MANAGEMENT L.L.C` (`شركة الخط الأمامي لإدارة الاستثمار ش.ذ.م.م`).
- **Land Registration Contract Number:** `131762/2023`.
- **Registration Date:** `18/07/2023` (`7/18/2023`).
- **Purchase Price (AED):** `353,000` (`Three Hundred Fifty Three Thousand UAE Dirhams only`).
- **DLD Certificate Barcode Number:** `140764/2023`.

### F-REQ-06: Platform Variable Distribution & 1-Click Action Hub
- Expose typed JavaScript/TypeScript variables (`DldTitleDeedExtractedData`).
- 1-Click mapping to:
  1. `TenancyContractPayload` (injects property address, unit number, community, and landlord name).
  2. Property Inventory Listing object (`PropertyItem`).
  3. RERA Form A Seller Mandate.
  4. JSON clipboard export for external APIs.
