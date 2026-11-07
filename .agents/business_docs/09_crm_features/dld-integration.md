# DLD Integration & Oqood Off-Plan Registration Workflow

> **Tracking:** `DU004` | **Agent:** `@Timnit` (Compliance & Regulatory Gate Specialist) | **Status:** `ACTIVE SPECIFICATION`  
> **Authority:** Dubai Land Department (DLD) Law No. 13 of 2008 & Law No. 7 of 2013  
> **CONSUMES:** `server/routes/aegis.ts`, `src/config/crmModuleRegistry.tsx`  
> **FEEDS:** `business_docs/09_crm_features/dld-integration.md`  
> **FEEDS_ACK:** `AEGIS-V5-COMPLIANCE-OQOOD-ACK`

---

## 1. Statutory Context & Regulatory Scope
In accordance with Dubai Land Department regulations, all off-plan unit sales must be registered through the **DLD Oqood System** within the statutory deadline. This document defines the White Caves CRM integration architecture for automated Oqood filing, 4% DLD fee calculation, escrow account validation, and idempotent submission tracking (`AEG-012`).

---

## 2. Oqood Registration Lifecycle Flow

```
[ Unit Reservation / SPA Signed ]
              │
              ▼
[ Escrow Verification Gate ]
   - Validate RERA Escrow Account Number
   - Confirm Developer Project Registration
              │
              ▼
[ Statutory Fee Computation ]
   - Buyer DLD Fee: 4% of Purchase Price + AED 580 Admin Fee
   - Oqood Registration Fee: AED 1,000 + 5% VAT (AED 1,050)
              │
              ▼
[ DLD Gateway Client Handshake (AEG-011) ]
   - Timeout: Strict 1,500ms SLA
   - Idempotency Key: `AEG-OQOOD-{projectCode}-{unitNumber}`
              │
              ▼
[ Certificate Generation & Vault Sync ]
   - Download Official DLD Pre-Registration Certificate (Oqood)
   - Store SHA-256 Checksum in PostgreSQL/Prisma Ledger
```

---

## 3. Data Schema & Payload Validation

```typescript
export interface OqoodRegistrationPayload {
  projectNumber: string;
  developerId: string;
  unitNumber: string;
  buyerPassportOrEmiratesId: string;
  purchasePriceAed: number;
  dldFeeAed: number; // 4% of purchasePriceAed
  escrowAccountNumber: string;
  idempotencyKey: string; // e.g. AEG-OQOOD-EMAAR-104-B
}
```

---

## 4. Verification & Acceptance Criteria
1. **Idempotency Enforcement**: Re-submitting the same unit registration payload must return the existing transaction envelope without triggering secondary registration fees.
2. **1,500ms Gateway Circuit Breaker**: If DLD REST gateway fails to acknowledge within 1,500ms, transaction gracefully enqueues to fallback offline retry queue.
3. **Escrow Guarantee**: Unit cannot transition to `REGISTERED` without verified bank escrow deposit proof.
