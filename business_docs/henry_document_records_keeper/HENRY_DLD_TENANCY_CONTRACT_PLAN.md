# Implementation Plan
## Henry AI — Official DLD Tenancy Contract Template & Interactive Preparation Journey
**Document Version:** 1.0.0  
**Authority:** White Caves Real Estate L.L.C  
**System Module:** `HenryDocumentStudio` / `HenryTenancyContractTemplateService`

---

### Implementation Phases

1. **Phase 1: Core Service & LocalStorage Layer (`HenryTenancyContractTemplateService.ts`)**
   - Define TypeScript data interfaces for all 35+ DLD variables.
   - Implement pristine blank template initializer.
   - Implement `safeStorage` CRUD (save draft, load active draft, reset to blank, list saved contracts).
   - Implement pixel-faithful 3-page DLD official HTML compiler with Dubai Government and Land Department styling, bilingual tables, checkboxes, 14 standard legal terms, and addendum clauses.
   - Write unit tests in `src/services/HenryTenancyContractTemplateService.test.ts`.

2. **Phase 2: Interactive Modal Component (`HenryTenancyContractModal.tsx`)**
   - Create 4-way component architecture for the modal:
     - `HenryTenancyContractModal.tsx` (View Layer)
     - `logic/HenryTenancyContractModal.logic.ts` (State, Step navigation & OCR auto-population)
     - `styles/HenryTenancyContractModal.style.ts` (Styled components & Split-pane theme)
     - `data/HenryTenancyContractModal.data.ts` (Default values & sample presets)
   - Step 1: Title Deed Ingestion (connect with `HenryTitleDeedScannerService`).
   - Step 2: Tenant KYC Ingestion (connect with `HenryEmiratesIdScannerService` & `HenryPassportScannerService`).
   - Step 3: Financial & Lease Config (Annual Rent, Cheques, DEWA, Additional Addenda).
   - Step 4: Live Actions (Save Draft, E-Sign Link Generation, Print / PDF, Ejari Vault Export).

3. **Phase 3: Integration into `HenryDocumentStudio` & Dashboard**
   - Add **"Prepare New Tenancy Contract"** prominent primary trigger button in `HenryDocumentStudio` header and action bar.
   - Integrate modal state triggers into `HenryDocumentStudio.logic.ts`.
   - Update `HenryDocumentStudio.test.tsx` and write dedicated tests for the modal.

4. **Phase 4: Verification & Git Checkpoint**
   - Run `npm run typecheck` $\rightarrow$ 0 errors.
   - Run `npx vitest run` $\rightarrow$ 100% Green tests.
   - Commit & push to `origin main`.
