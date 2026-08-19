# 📋 Software Requirements Specification (SRS): Henry AI DLD Tenancy Contract Optical Parser & Learning Engine

**Target System:** Henry AI Records Keeper & Document Studio (`WC-AI-003`)  
**Module:** `src/services/HenryTenancyContractScannerService.ts` & `src/components/crm/HenryDocumentStudio/HenryTenancyContractScannerView.tsx`  
**Governing Authority:** Dubai Land Department (DLD) / Real Estate Regulatory Agency (RERA) / Ejari  
**Standard:** 3-Part UI Architecture + Temporary Session Store + Multi-Sample Adaptive Training

---

## 1. Executive Summary & Multi-Sample Training Pool

The **3.19.5 Scan & Extract Tenancy Agreement (عقد إيجار)** module within **Henry AI Document Studio** enables automated ingestion and machine learning from executed and draft Dubai Land Department Unified Tenancy Contracts across **all file formats** (PDF single/multi-page, PNG, JPG, JPEG, WEBP).

The system extracts **4 complete DLD contract domains**:
1. **Property & Premises Specifications** (Building Name, Unit Number, Plot Number, Makani Number, DEWA Premise Number, Area SqM & SqFt, Location/Community, Permitted Usage).
2. **Lessor / Property Owner Identity & Contacts** (Owner Name, Lessor Name, Emirates ID/Passport, Phone, Email, Licensing Authority).
3. **Tenant Identity & Contacts** (Tenant Name, Emirates ID/Passport, Phone, Email, Nationality).
4. **Contract Terms & Financial Schedules** (Period From/To, Duration, Annual Rent AED, Security Deposit AED, Payment Frequency, Number of Cheques, 5 Addenda Clauses).

---

## 2. Document Ingestion & Optical Classification

### F-REQ-01: Universal Multi-Format Ingestion
- Ingests `application/pdf` (Electronic DLD contracts, scanned executed agreements) and `image/png`, `image/jpeg`, `image/jpg`, `image/webp`.
- Drag-and-drop dropzone with fallback benchmark samples (`Camelia 608`, `Janusia XH2858B`, `Blank DLD Template`).

### F-REQ-02: Autonomous Fill Classification & Scoring
- Classifies ingested contracts into:
  - `blank_template` (0% fill score)
  - `partially_filled` (1% - 89% fill score)
  - `fully_executed` (90%+ fill score)
- Computes `fillScorePercent`, `totalFieldsCount`, `filledFieldsCount`, and lists `missingFields`.

### F-REQ-03: Machine Learning & Reference Training Pool
- Archives parsed agreements into continuous training memory (`whitecaves_henry_contract_training_set_v1`).
- Trains Henry AI auto-completion weights for community lease rates, deposit percentages, and standard addenda clauses.

---

## 3. Temporary Session Store & Cross-Feature Integration

### F-REQ-04: Session Caching Contract
- Temporary cache stored at `safeStorage` key `'whitecaves_henry_active_tenancy_contract_cache_v1'`.
- React subscribers listen via `onContractUpdated((data) => ...)` to synchronize lease data across Document Studio.
- Lifecycle methods: `setCachedContract`, `getCachedContract`, and `clearCachedContract`.

### F-REQ-05: 1-Click Platform Cross-Actions
- **Load into 3.19.1 Preparation Studio:** Instantly converts extracted contract into `DldTenancyContractData` and updates active draft for modification, renewal, or e-signature dispatch.
- **Save to Government Vault:** Archives validated agreement into encrypted Ejari records vault.
- **Copy JSON:** Exports clean structured JSON payload.

---

## 4. 3-Part User Interface Architecture

1. **Component 1: Upload File Component** — Drag-and-drop dropzone supporting PDF, PNG, JPG, WEBP + benchmark presets (`Camelia 608`, `Janusia XH2858B`, `Blank Template`).
2. **Component 2: Preview Document Component** — Zoomable canvas preview with Zoom In/Out controls and certified live DLD contract HTML render.
3. **Component 3: Extracted Information Section** — 4 categorized editable cards (Property Specs, Landlord & Tenant Parties, Financial Schedules, Addenda & Terms) with live accuracy badge and platform cross-actions.
