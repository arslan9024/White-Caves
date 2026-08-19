# 🏛️ Software Design Document (SDD): Henry AI Tenancy Contract Optical Ingestion Architecture

**Target System:** Henry AI Optical Extraction Engine (`WC-AI-003`)  
**Module:** `src/services/HenryTenancyContractScannerService.ts` & `src/components/crm/HenryDocumentStudio/HenryTenancyContractScannerView.tsx`  
**Governing Authority:** Dubai Land Department (DLD) / RERA / Ejari  
**Standard:** 3-Part UI Architecture + Temporary Session Store + Continuous Machine Learning

---

## 1. System Architecture & Processing Pipeline

```mermaid
graph TD
    Upload[1. Upload File Component: PDF, PNG, JPG, WEBP] --> Scanner[HenryTenancyContractScannerService.scanContract]
    
    Scanner --> Domain1[Domain 1: Property Specifications & DEWA]
    Scanner --> Domain2[Domain 2: Landlord & Tenant Legal Parties]
    Scanner --> Domain3[Domain 3: Financial Terms & Cheque Schedules]
    Scanner --> Domain4[Domain 4: Addenda Terms & Endorsement Signatures]

    Domain1 --> Consolidator[Tenancy Agreement Consolidator]
    Domain2 --> Consolidator
    Domain3 --> Consolidator
    Domain4 --> Consolidator

    Consolidator --> OutputPayload[ScannedTenancyContractResult Object]
    OutputPayload --> SessionCache[(Temporary Session Cache: safeStorage)]
    OutputPayload --> LearningPool[(Continuous Training Pool: trainingMemory)]

    SessionCache --> Preview[2. Preview Document Component with Zoom]
    SessionCache --> ExtractionView[3. Extracted Information Section: 4 Domain Cards]

    ExtractionView --> Action1[1-Click Load into 3.19.1 Preparation Studio]
    ExtractionView --> Action2[1-Click Save to Ejari Government Vault]
    ExtractionView --> Action3[Export Variables as JSON]
```

---

## 2. TypeScript Data Schema (`ScannedTenancyContractResult`)

```typescript
export interface ScannedTenancyContractResult {
  // Classification & Fill State
  isFilled: boolean;
  fillScorePercent: number;
  totalFieldsCount: number;
  filledFieldsCount: number;
  missingFields: string[];
  classification: 'blank_template' | 'partially_filled' | 'fully_executed';
  documentFormat?: string;

  // Metadata
  contractDate: string;

  // Grouped Fields
  landlord: ScannedTenancyParty;
  tenant: ScannedTenancyParty;
  property: ScannedTenancyProperty;
  financials: ScannedTenancyFinancials;
  additionalTerms: string[];
  signatures: ScannedTenancySignatures;

  // Extraction Telemetry
  confidenceScore: number;
  scannedAt: string;
}
```

---

## 3. Temporary Session Store Architecture

```typescript
class HenryTenancyContractScannerService {
  private static readonly CACHE_KEY = 'whitecaves_henry_active_tenancy_contract_cache_v1';
  
  setCachedContract(data: ScannedTenancyContractResult): void;
  getCachedContract(): ScannedTenancyContractResult | null;
  clearCachedContract(): void;
  onContractUpdated(listener: (data: ScannedTenancyContractResult | null) => void): () => void;
}
```
