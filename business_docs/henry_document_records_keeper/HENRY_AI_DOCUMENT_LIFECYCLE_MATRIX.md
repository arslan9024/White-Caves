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

---

## 🛠️ Step-by-Step SOP

### Step 1: Lease Agreement & E-Signature
1. Broker inputs Tenant & Landlord parameters into Henry Studio (or triggers 1-Click AI Auto-Fill from CRM Lead profile).
2. Henry generates the Tenancy Contract draft with PDC schedule table.
3. Broker clicks **"Generate & Share E-Signature Link"**.
4. Client signs on mobile/desktop via digital signature canvas.
5. Signed PDF is sealed with cryptographic audit timestamp.

### Step 2: Ejari Registration & Archival
1. Broker takes the fully signed Tenancy Contract + Title Deed + Passports and registers with Dubai Land Department (Dubai REST system).
2. DLD issues official **Ejari Certificate** with official Ejari Number (`0120250814005322`).
3. Broker uploads the official government Ejari PDF into **Henry's Government Vault**.
4. Henry indexes the official document and activates automatic 90-day renewal alarms.

### Step 3: Viewing & Auxiliary Forms
1. When a client books a viewing, Henry auto-populates **Form B Viewing Register**.
2. Client signs viewing sheet at the premises.
3. Form is stored under the Lead's timeline in Henry Vault.

### Step 4: Financial Receipts & VAT Tax Invoices
1. Upon receiving broker commission and security deposit cheques, Henry compiles the official VAT Tax Invoice.
2. Invoices feature White Caves TRN, 5% VAT calculations, and invoice barcode.
