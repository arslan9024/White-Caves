# 📜 Henry AI: Document Lifecycle Matrix & SOP (Standard Operating Procedures)

**Authority:** White Caves Real Estate LLC  
**Department:** Henry AI Records, Compliance & Document Vault  
**Reference:** DET `1388443` | RERA ORN `44483` | Ejari `0120250814005322`  

---

## 🔱 The 4 Exact Operational Pillars

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        HENRY AI 4-PILLAR DOCUMENT WORKFLOW                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. TENANCY CONTRACT PREPARATION & E-SIGNATURE                                          │
│    • Filled by Broker/CRM with Landlord, Tenant, Unit details and PDC payment terms.    │
│    • Generates secure e-signature URL link sent to Landlord & Tenant for remote sign.  │
│    • Status progression: Draft ➔ Shared ➔ Signed ➔ Ready for Ejari.                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. GOVERNMENT-ISSUED EJARI CERTIFICATE ARCHIVAL                                        │
│    • The actual Ejari registration is executed by the licensed agent via DLD/REST.      │
│    • Once government issues the official Ejari Certificate (PDF), it is uploaded.     │
│    • Henry acts as the immutable Record Keeper & Vault, tracking the 365-day expiry.   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. LEASING & VIEWING FORMS (1-CLICK AI AUTO-FILL)                                      │
│    • Form B Viewing Register: AI auto-fills client details & property address.         │
│    • Form A Listing Mandate: AI auto-fills title deed & Trakheesi permit details.      │
│    • Maintenance Work Orders: AI auto-fills repair scope & contractor TRN.            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. PAYMENT RECEIPTS & TAX INVOICES                                                     │
│    • Security Deposit Receipt: Generated upon cheque clearance proof.                  │
│    • Agency Commission Tax Invoice: Formatted with White Caves TRN and FTA 5% VAT.     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## 🔱 The Complete 5-Module Optical Intelligence & Document Ecosystem

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        HENRY AI 5-MODULE OPTICAL INTELLIGENCE MESH                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3.19.1 PREPARE TENANCY CONTRACT (JOURNEY WIZARD)                                      │
│    • 4-Stage Stepper: Property/Lessor ➔ Tenant KYC ➔ Terms & PDCs ➔ Preview & Sign.     │
│    • Real-time reactive cache ingestion from Emirates ID, Title Deed, and Passports.  │
│    • Automatic PDC Cheque Breakdown (1, 2, 4, 6 cheques) with VAT calculations.        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3.19.2 SCAN EMIRATES ID (الهوية الإماراتية)                                            │
│    • Universal multi-format ingestion (PDF, PNG, JPG, WEBP) with dual-side flip review. │
│    • 18+ fields extracted: 15-digit ID, TD1 3-line MRZ, photo, employer & occupation. │
│    • Multi-client presets: Khalif Mohamednur, Mansoor Almarzooqi, Arslan Malik.       │
│    • Auto-sync to Session Memory and POST /api/henry/documents/save Database.         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3.19.3 SCAN TITLE DEED (شهادة ملكية عقار / عقود)                                      │
│    • Ingestion of DLD Land Deeds, Hotel Apartments, Villas & Commercial Plots.        │
│    • 22+ fields extracted: Plot, Municipality Grid (914-20879), Gross Area, Owners,   │
│      Purchase Price (1.717M AED), Seller Entity, and Contract Number.                 │
│    • 1-click injection as Landlord/Property in Tenancy Contracts & CRM Listings.       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3.19.4 SCAN INTERNATIONAL PASSPORT (جواز السفر الدولي)                                │
│    • 2-Line ICAO Doc 9303 TD3 MRZ Parsing + Visual Bio-Data Extraction.               │
│    • 16+ fields: Full Name, Passport No, Nationality, DOB, Expiry, National ID.       │
│    • 1-click injection into Tenancy Journey and KYC Compliance Vault.                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 3.19.5 SCAN & EXTRACT TENANCY CONTRACT (عقد إيجار)                                    │
│    • 4-domain extraction: Landlord, Tenant, Property, Financials & Signatures.        │
│    • Fill completeness scoring & adaptive reference training set.                      │
│    • 1-click loading into 3.19.1 Preparation Studio & Government Ejari Vault.          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Step-by-Step SOP

### Step 1: Optical Ingestion & Extraction (3.19.2 – 3.19.5)
1. Broker or client uploads documents (Emirates ID, Title Deed, Passport, or Tenancy Agreement).
2. Henry runs local Tesseract + PDF.js + ICAO MRZ optical parsing engines to decode visual text and machine-readable zones.
3. Extracted variables are normalized into structured TypeScript/JSON interfaces and validated against official UAE checksum standards.
4. Extracted payloads are instantly saved to both **reactive session storage (`safeStorage`)** and the **server database (`POST /api/henry/documents/save`)**.

### Step 2: Automated Lease Journey Assembly (3.19.1)
1. Broker navigates to **3.19.1 Prepare Tenancy Contract**.
2. Reactive listeners (`onTitleDeedUpdated`, `onEmiratesIdUpdated`, `onPassportUpdated`) automatically detect active cached documents.
3. Quick-fill banners offer 1-click ingestion to populate Stage 1 (Property/Lessor) and Stage 2 (Tenant KYC).
4. Broker selects PDC Cheque schedule (1, 2, 4, or 6 cheques) in Stage 3.
5. In Stage 4, Henry generates the finalized bilingual DLD Tenancy Contract.

### Step 3: E-Signature & Government Ejari Registration
1. Broker generates the secure e-signature URL link for the Landlord and Tenant.
2. Both parties sign electronically; signatures and timestamps are sealed onto the document.
3. Broker registers the signed contract via Dubai REST / DLD system.
4. Government issues official **Ejari Certificate** (`0120250814005322`).
5. The official Ejari is archived in **Henry's Government Vault** with automated 365-day expiry tracking and 90-day renewal alerts.

### Step 4: Auxiliary Forms & Financial Invoices
1. Viewing appointments automatically draw client and property records into **Form B Viewing Register**.
2. Exclusive mandates populate **RERA Form A** with Title Deed and Trakheesi permit details.
3. Agency commissions and deposit receipts generate FTA 5% VAT Tax Invoices with official TRN details.

