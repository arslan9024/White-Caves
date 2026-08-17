# 📄 Software Requirements Specification (SRS): Henry AI — Record Keeper & Document Vault

**System Name:** Henry AI Document & Regulatory Vault  
**Parent Organization:** White Caves Real Estate LLC  
**Accreditations:** DET License `1388443` | RERA ORN `44483` | Ejari Registration `0120250814005322` | MOL `2/1/1192499`  
**Location:** Dubai, United Arab Emirates  

---

## 1. Document Scope & Boundary Definitions

Henry AI serves as the **Sovereign Record Keeper, Document Intelligence Engine, and Official Regulatory Vault** for White Caves Real Estate LLC. The system explicitly enforces strict segregation across the 4 core document classifications:

```
┌────────────────────────────────────────────────────────────────────────┐
│              HENRY AI SOVEREIGN DOCUMENT CLASSIFICATION               │
├──────────────────────────┬─────────────────────────────────────────────┤
│ 1. Tenancy Contract      │ • Filled with Landlord, Tenant & Unit Data  │
│    (Private Agreement)   │ • Shared via Secure E-Signature Link        │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 2. Govt Ejari Certificate│ • Issued by DLD / Dubai REST (via Agent)    │
│    (Official Record)     │ • Archived & Indexed in Henry Vault         │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 3. Leasing & Viewing     │ • Form B Viewing Register & Intake Forms    │
│    Forms                 │ • 1-Click AI Auto-Fill via CRM Lead Profile │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 4. Receipts & Invoices   │ • Security Deposit & Commission Receipts    │
│    (Financial Vouchers)  │ • FTA 5% VAT & Tax Invoice with TRN         │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. Functional Requirements (FR)

### FR-01: Tenancy Contract Preparation & E-Signature Link Sharing
- **FR-01.1:** System shall compile the standard Dubai Unified Tenancy Contract with:
  - Lessors and Lessees full identification (Name, Emirates ID, Passport, Contact details).
  - Property description (Unit number, building/cluster name, community, Makani number).
  - Annual rent, security deposit amount, lease commencement date, and lease expiration date.
  - Granular Post-Dated Cheques (PDC) repayment schedule table.
- **FR-01.2:** System shall generate a secure, tokenized digital link (`/sign/:contractToken`) permitting both Landlord and Tenant to sign electronically with cryptographic audit timestamps and IP verification.

### FR-02: Government-Issued Ejari Certificate Archival
- **FR-02.1:** Registration of Ejari is performed externally by the licensed broker with the Dubai Land Department (DLD / Dubai REST system).
- **FR-02.2:** Once issued, the official government PDF certificate shall be uploaded into Henry AI Vault.
- **FR-02.3:** Henry AI extracts and indexes:
  - Official Government Ejari Contract Number (e.g., `0120250814005322`).
  - DLD Barcode & QR verification hash.
  - Active tenancy validity dates and official registered rent value.
- **FR-02.4:** Henry AI flags expiry 90 days, 60 days, and 30 days prior to contract termination for mandatory renewal notifications.

### FR-03: AI Auto-Fill Engine for Viewing Forms & Intake Sheets
- **FR-03.1:** Henry AI provides 1-Click AI Auto-Fill for:
  - **Form B Viewing Register:** Auto-populates viewing date/time, client name, passport/EID, and target property address.
  - **Landlord Listing Mandate (Form A):** Auto-populates title deed number, plot number, and listing price.
  - **Maintenance Work Orders:** Auto-populates repair scope, contractor TRN, and DAMAC Hills 2 cluster location.
- **FR-03.2:** System converts unstructured WhatsApp client intake notes into structured form fields automatically.

### FR-04: Payment & Commission Tax Receipt Generation
- **FR-04.1:** Compiles official Security Deposit Receipt upon cheque clearance.
- **FR-04.2:** Compiles Corporate Brokerage Tax Invoices featuring White Caves Tax Registration Number (TRN) and FTA 5% VAT itemization.

---

## 3. Non-Functional Requirements (NFR)

- **Security & Data Retention:** 7-year regulatory retention period mandated by UAE Commercial Law and RERA guidelines.
- **High-DPI Print Ready:** All documents render at 300 DPI print fidelity with A4 standard sizing and laser-friendly color contrast.
- **Role-Based Access Control:**
  - Tenants & Buyers: Read-only access to their respective active contracts and receipts.
  - Brokers: Create contracts, share e-sign links, and upload Ejari certificates.
  - Managing Director (Level 5): Unrestricted access to master audit ledger and cryptographic vault.
