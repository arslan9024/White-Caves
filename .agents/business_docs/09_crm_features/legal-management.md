# RERA Form 7 & Form 12 Automated Legal Generation

> **Tracking:** `DU005` | **Agent:** `@Timnit` (Legal Operations & RERA Conveyance Lead) | **Status:** `ACTIVE SPECIFICATION`  
> **Statutory Baseline:** Dubai Law No. 26 of 2007, Law No. 33 of 2008 & RERA Brokerage Bylaws  
> **CONSUMES:** `server/routes/aegis.ts`, `src/config/crmModuleRegistry.tsx`  
> **FEEDS:** `business_docs/09_crm_features/legal-management.md`  
> **FEEDS_ACK:** `AEGIS-V5-LEGAL-RERA-FORM-ACK`

---

## 1. Statutory Context & Legal Requirements
- **RERA Form 7**: Official Notice to Evict / Legal Eviction Notice (12 months notarized notice requirement via Dubai Courts or Registered Notary Public).
- **RERA Form 12**: Notice of Rental Increase / Rental Index Compliance Notice (90-day statutory notice prior to lease expiration).

---

## 2. Automated Notice Generation Pipeline

```
[ Lease Expiry Tracker (AEG-027) ]
            │
            ├─ [ 90-Day Threshold Reached ] ──> Generate RERA Form 12 (Rental Increase Notice)
            │                                    - Check RERA Rental Index Calculator
            │                                    - Max allowable increase: 0% / 5% / 10% / 15% / 20%
            │
            └─ [ 12-Month Eviction Notice ] ──> Generate RERA Form 7 (Eviction Notice)
                                                 - Grounds: Personal use, Demolition, Major Renovation
                                                 - Export Court-Formatted Arabic/English Biling Document
```

---

## 3. Bilingual Document Output & Notary Payload
Form generation must comply with statutory bilingual requirements (`AEG-005` & `AEG-025`):
- Right-to-Left (RTL) Arabic legal clauses paired side-by-side with English certified translations.
- Embed QR code containing verified verification URL pointing to the White Caves legal deed registry.

---

## 4. Acceptance Criteria
1. **RERA Calculator Match**: Form 12 calculated rent increase cannot exceed official DLD calculator thresholds.
2. **Statutory Timeline Enforced**: System locks generation of Form 12 if less than 90 days remain on tenancy contract without mutual consent toggle.
3. **PDF Output Compliance**: Rendered via headless canvas / static vector PDF renderer in strict conformance with `AEG-026`.
