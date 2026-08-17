# 🏛️ Software Design Document (SDD): Henry AI — Record Keeper Architecture & Engine

**Target System:** Henry AI Architecture & PDF Studio Engine  
**Module:** `src/components/crm/HenryDocumentStudio/` & `src/services/HenryPdfEngineService.ts`  
**Standard:** 4-Way Folder Segregation (`View.tsx` / `Logic.logic.ts` / `Style.style.ts` / `Data.data.ts`)  

---

## 1. System Architecture Diagram

```mermaid
graph TD
    CRM[CRM Lead & Property DB] -->|Auto-Fill Data| HenryAI[Henry AI Document Engine]
    
    subgraph Stream 1: Tenancy Agreement
        HenryAI -->|1. Generate Draft| TC[Tenancy Contract PDF]
        TC -->|2. Generate Link| ESignLink[/sign/:token - E-Signature Portal]
        ESignLink -->|3. Signed PDF| Vault[(Henry Sovereign Vault)]
    end

    subgraph Stream 2: Government Ejari Archival
        Agent[Licensed Broker] -->|Register with DLD REST| DLD[Dubai Land Department]
        DLD -->|Official Certificate| EjariCert[Government Ejari PDF]
        EjariCert -->|Archive & OCR Barcode| Vault
    end

    subgraph Stream 3: AI Auto-Fill Forms & Receipts
        HenryAI -->|Auto-Fill| ViewForm[Form B Viewing Sheet]
        HenryAI -->|Auto-Fill| Mandate[Form A Seller Mandate]
        HenryAI -->|Auto-Fill| TaxInv[FTA 5% VAT Tax Invoice]
        ViewForm --> Vault
        Mandate --> Vault
        TaxInv --> Vault
    end
```

---

## 2. Component Design & Code Structure

### 2.1 Service Layer: `HenryPdfEngineService.ts`
- **`generateTenancyContractHtml(payload)`**: Compiles private tenancy contract ready for e-signature with PDC schedule table.
- **`generateEsignSharingLink(contractId)`**: Generates time-limited cryptographic URL for remote client signing.
- **`archiveGovernmentEjariCertificate(metadata, fileBlob)`**: Ingests and stores government Ejari certificate (`0120250814005322`) with DLD barcode tag.
- **`autoFillDocumentFromCrm(templateId, lead, property)`**: Intelligent field mapping populating Form B viewing registers, Form A mandates, and VAT invoices.
- **`generateSecurityDepositReceipt(receiptPayload)`**: Generates proof-of-payment certificate for tenant and landlord.

### 2.2 View Layer: `HenryDocumentStudio.tsx`
- **Template Switcher:** 4 distinct tabs:
  1. `Tenancy Contract (E-Signature)`
  2. `Government Ejari Vault (Official Records)`
  3. `Viewing & Leasing Forms (AI Auto-Fill)`
  4. `Tax Invoices & Receipts (VAT 5%)`
- **Interactive Action Bar:**
  - `Generate E-Signature Link`
  - `1-Click AI Auto-Fill`
  - `High-DPI Laser Print / PDF Export`
  - `Archive Government Certificate`

---

## 3. Data Schema & Contracts

```typescript
export interface TenancyContractData {
  contractId: string;
  contractNumber: string;
  property: {
    unit: string;
    building: string;
    community: string;
    makaniNumber: string;
  };
  landlord: {
    name: string;
    emiratesId: string;
    phone: string;
    email: string;
  };
  tenant: {
    name: string;
    emiratesId: string;
    phone: string;
    email: string;
  };
  financials: {
    annualRentAed: number;
    securityDepositAed: number;
    numberOfCheques: number;
    pdcSchedule: Array<{
      chequeNo: string;
      dueDate: string;
      amountAed: number;
      bankName: string;
      status: 'pending' | 'cleared' | 'bounced';
    }>;
  };
  esignStatus: 'draft' | 'shared' | 'landlord_signed' | 'tenant_signed' | 'fully_executed';
  esignUrl?: string;
}

export interface GovernmentEjariRecord {
  ejariNumber: string; // e.g. "0120250814005322"
  issueDate: string;
  expiryDate: string;
  dldBarcode: string;
  registeredRentAed: number;
  officialCertificateUrl: string;
  archivedAt: string;
  verifiedByBrokerBrn: string;
}
```
