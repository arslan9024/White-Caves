# 08 — Mary · Inventory CRM Manager

> **ID:** `mary`  
> **Department:** Operations  
> **Title:** Inventory CRM Manager  
> **Color:** `#3B82F6` (Blue)  
> **Avatar:** 👩‍💻  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/MaryInventoryCRM_NEW/`  
> **Access:** Managing Director, Property Manager, Agent

---

## 1. Overview

Mary is the **property inventory master**. She manages the full lifecycle of every property listing — from initial data entry and media upload through to listing, under-offer, sold, or withdrawn status. She is the single source of truth for all 9,378+ properties in the White Caves portfolio, with tools for bulk import, OCR data extraction, and developer API sync.

---

## 2. Core Responsibilities

1. Manage the master property inventory (CRUD for all property records)
2. Property status workflow: Draft → Listed → Under Offer → Sold / Leased / Withdrawn
3. Bulk import via Excel/CSV upload
4. OCR extraction from DLD title deeds and developer brochures
5. Media management: images, floor plans, virtual tour links
6. Feed property data to Prism, Sophia, Daisy, Olivia, and the public portal

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Property CRUD | Full create/read/update/delete with validation |
| Status workflow | Enforced transitions — cannot go from Listed to Sold without Under Offer |
| Bulk Excel import | Upload `.xlsx` with headers; Mary maps columns and validates before insert |
| OCR extraction | Upload title deed image → Mary extracts: plot number, area, owner name |
| Developer API sync | Sync inventory from DAMAC, Emaar, Nakheel APIs (where available) |
| Media gallery | Up to 50 images, 1 video, 3 floor plan files per property |
| Search & filter | By area, type, price range, bedrooms, status, agent, RERA permit |
| RERA permit tracking | `permitNumber` + `permitExpiryDate`; auto-warns on expiry |
| DLD fee calculator | Instant: 4% for sale, 5% for lease + admin fees |
| Export | CSV / Excel export of filtered property list |

---

## 4. How It Works — End to End

### Step 1 — Property Creation
Agent opens "Add Property" modal → fills: title, type (villa/apartment/townhouse/plot), status, price, bedrooms, bathrooms, sqft, area, description, RERA permit number, permit expiry. → `POST /api/properties`.

### Step 2 — Validation
Backend validates: `price > 0`, `bedroomsMin ≤ bedrooms`, `permitNumber` format matches UAE RERA pattern. On error, returns 422 with field-level messages.

### Step 3 — Media Upload
Agent uploads images → `POST /api/properties/:id/media` (Multer + Cloudinary — Phase 6). Images stored in Cloudinary, URLs saved to `property.images[]`. Primary image set via drag-and-drop order.

### Step 4 — RERA Permit Gate
If `permitExpiryDate < today` → property cannot be set to `status: 'listed'`. API returns 400: "RERA permit expired. Please renew before publishing." Laila is notified.

### Step 5 — Listing
Property status → `listed` → visible on the public portal (`GET /api/properties?status=listed` for anonymous users). Olivia picks up new listings for marketing automation.

### Step 6 — Status Progression
Agent updates → `under_offer` (Sophia receives deal), `sold` (commission triggered), `leased` (Daisy takes over for tenancy). Each transition timestamped and logged in Henry's audit trail.

### Step 7 — Excel Import
Agent uploads `.xlsx` → `POST /api/properties/import` → Mary reads rows with `exceljs`, validates each row, inserts in bulk, returns: `{ inserted: 45, failed: 2, errors: [...] }`.

### Step 8 — Developer Sync
Scheduled cron (daily 02:00): `DeveloperSyncService.syncDAMAC()` → calls DAMAC API → upserts properties (update if permit number exists, insert if new).

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/properties` | List properties (filter, search, paginate) |
| POST | `/api/properties` | Create property |
| GET | `/api/properties/:id` | Get full property detail |
| PATCH | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Delete property (owner only) |
| POST | `/api/properties/:id/media` | Upload media files |
| POST | `/api/properties/import` | Bulk Excel import |
| POST | `/api/properties/:id/assign` | Assign agent |
| GET | `/api/properties/stats` | Inventory counts by status and type |

---

## 6. Data Flows

- **Receives from:** Developer APIs (sync), Excel imports, agent manual entry
- **Sends to:** Prism (inventory for matching), Sophia (status changes), Daisy (leased properties), Olivia (new listings for marketing), Laila (permit expiry alerts), Public portal (listed properties)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `MaryInventoryCRM_NEW` | `src/components/owner/ai/MaryInventoryCRM_NEW/` | ✅ Exists |
| `PropertyManagementPage` | `src/pages/crm/PropertyManagementPage.tsx` | ✅ Exists |
| `PropertiesTab` | `src/components/owner/tabs/PropertiesTab.tsx` | ✅ Exists |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| Properties CRUD | `server/routes/properties.ts` | ✅ Exists |
| Media upload | Multer middleware | 🔲 Phase 6 |
| Excel import | `server/services/ExcelImportService.ts` | 🔲 Planned |
| Developer sync | `server/jobs/developerSync.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Can View | Can Create | Can Edit | Can Delete |
|---|---|---|---|---|
| `managing_director` | All | ✅ | ✅ | ✅ |
| `property_manager` | All | ✅ | ✅ | ❌ |
| `agent` | Assigned | ✅ | Assigned | ❌ |
| Public (portal) | `listed` only | ❌ | ❌ | ❌ |

---

## 10. Implementation Checklist

- [x] `MaryInventoryCRM_NEW` renders
- [x] Properties CRUD backend
- [x] `PropertyManagementPage` with add/edit/delete modals
- [ ] Wire `MaryInventoryCRM_NEW` to live `/api/properties`
- [ ] Media upload (Multer + Cloudinary — Phase 6)
- [ ] Excel bulk import endpoint + `ExcelImportService`
- [ ] RERA permit expiry gate enforcement
- [ ] Developer API sync job
- [ ] Property stats endpoint

---

## 11. Dependencies

- `multer` (Phase 6) — file upload
- `exceljs` (Phase 7) — bulk Excel import
- Cloudinary or S3 account (Phase 6)
- DAMAC / Emaar developer API keys (external)

---

## 12. Future Enhancements

- AI-generated property descriptions from photos (GPT-4 Vision)
- Automatic price benchmarking against comparable listings
- Virtual staging integration (Iris)
- 3D floor plan generation from uploaded 2D plans
