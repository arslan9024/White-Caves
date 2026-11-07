# Post-Dated Cheque (PDC) Bounce Escalation Workflow

> **Tracking:** `DU008` | **Agent:** `@Victoria` (Leasing Operations & Asset Management Lead) | **Status:** `ACTIVE SPECIFICATION`  
> **Statutory Authority:** UAE Commercial Transactions Law No. 50 of 2022 (Cheque Decriminalization & Civil Execution) & DLD Tenancy Laws  
> **CONSUMES:** `server/routes/aegis.ts`, `business_docs/09_crm_features/tenancy-ejari.md`  
> **FEEDS:** `business_docs/09_crm_features/tenancy-ejari.md`  
> **FEEDS_ACK:** `AEGIS-V5-LEASING-PDC-BOUNCE-ACK`

---

## 1. Statutory Context & Legal Rights
Under UAE Federal Decree-Law No. (14) of 2020 and Law No. (50) of 2022:
- Bounced cheques on insufficient funds permit immediate **Direct Civil Execution** via Dubai Courts Execution Judge without filing a full substantive civil lawsuit.
- Cheque bearer can petition the execution judge directly using the bank's formal **Certificate of Return / Dishonour Certificate**.

---

## 2. PDC Bounce State Machine & Escalation Deadlines

```
[ Bank Return / Dishonour Notice Received ]
                     │
                     ▼
[ Day 0: System Flag & Grace Period Initiation ]
   - Status: `PDC_BOUNCED`
   - Trigger Automated WhatsApp & Certified Email to Tenant
   - Grace Period: Strict 5 business days for bank transfer / cash settlement
                     │
                     ├─ [ Cleared within 5 days ] ──> Status: `RESOLVED_SETTLED`
                     │
                     ▼
[ Day 6: Landlord Notification & Formal Legal Warning ]
   - Automated Landlord Portal Alert & SMS Notification
   - Issue Formal 30-Day Notarized Eviction Notice under Law 33/2008 (Default on Rent)
                     │
                     ▼
[ Day 30: Dubai Courts Direct Civil Execution ]
   - Compile Certified Bank Return Slip + Original Ejari Certificate + Tenancy Contract
   - Submit Direct Execution Order to Dubai Courts (Order of Payment)
   - Freeze Tenant Banking Facilities & Travel Ban Application
```

---

## 3. Data Schema & Evidence Envelope

```typescript
export interface PdcBounceIncident {
  chequeNumber: string;
  chequeAmountAed: number;
  bankName: string;
  dueDate: string;
  bounceDate: string;
  reasonCode: 'INSUFFICIENT_FUNDS' | 'ACCOUNT_CLOSED' | 'SIGNATURE_MISMATCH';
  tenantId: string;
  landlordId: string;
  contractNumber: string;
  bankReturnSlipUrl: string;
  currentEscalationState: 'GRACE_PERIOD' | 'FORMAL_WARNING' | 'COURT_EXECUTION' | 'SETTLED';
}
```

---

## 4. Acceptance Criteria
1. **Automated Landlord Escalation**: Landlord must receive real-time notification with bank return slip within 15 minutes of status change (`AEGIS P0 SLA`).
2. **Direct Civil Execution Dossier**: Automated generation of Dubai Courts execution package in bilingual Arabic/English format.
3. **Audit Trail**: Every interaction and grace period extension recorded immutably in Prisma `Activity`.
