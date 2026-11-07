# Dubai Real Estate Regulatory Frameworks & Standardized Legal Forms

**Version:** 2026.07-REG-V1  
**Authority:** Legal & Compliance Dept (@Sofia, @Neva)  
**Last Updated:** 2026-07-27  
**Governance Standard:** [business_docs/README.md](../README.md)

---

## 📜 Regulatory Overview (RERA & DLD Standardized Forms)

White Caves Real Estate LLC operates strictly within Dubai Land Department (DLD) and Real Estate Regulatory Agency (RERA) statutory requirements. All tenancy, leasing, and eviction workflows inside the application conform to UAE Law No. 26 of 2007 (as amended by Law No. 33 of 2008).

---

## 🏛️ Standard Legal Forms & Application Workflows

### 1. DLD Form 7 — Official Rent Increase / Lease Modification Notice
- **Statutory Authority**: Law No. 33 of 2008, Article 14.
- **Mandatory Advance Notice**: Exactly **90 calendar days** prior to the lease expiration date.
- **Application Logic**:
  - Automatically calculates expiration window using `contractEndDate - 90 days`.
  - Checks RERA Calculator index rates before generating proposed rent adjustments.
  - Dispatches formal notice via registered courier or notarized electronic notification.
  - Logs notification timestamp in `tenancy_contracts` MongoDB collection for legal auditability.

### 2. DLD Form 12 — 12-Month Eviction Notice
- **Statutory Authority**: Law No. 33 of 2008, Article 25(2).
- **Statutory Grounds for Eviction**:
  - Owner wishes to sell the property.
  - Owner or first-degree relative intends to occupy property for personal use.
  - Property requires major demolition or structural renovation preventing occupancy.
- **Mandatory Advance Notice**: Exactly **12 calendar months** served via Notary Public or Registered Mail.
- **Application Logic**:
  - Generates official bilingual (Arabic/English) legal notice payload.
  - Tracks 365-day countdown ticker in Landlord & Executive Dashboards.
  - Restricts landlord from re-renting property for 2 years (residential) or 3 years (commercial) if personal use ground is selected.

### 3. DLD Form 6 — Ejari Non-Renewal / Expiration Notice
- **Statutory Authority**: RERA Ejari Directive 2024-01.
- **Application Logic**:
  - Automatically triggers 60-day tenant response prompt before Ejari expiration.
  - Generates Ejari termination certificate payload upon non-renewal agreement.
  - Releases security deposit hold through escrow tracking module.

---

## 🔄 API Integration & Webhook Endpoints

| Legal Form | Trigger Event | API Endpoint | Output Payload |
| ---------- | ------------- | ------------ | -------------- |
| **Form 7** | 90-day expiry threshold | `POST /api/v1/contracts/:id/form7` | PDF Legal Notice + Dispatch Log |
| **Form 12**| Landlord eviction request | `POST /api/v1/contracts/:id/form12` | Notary Public Draft + 365-day Ticker |
| **Form 6** | Ejari non-renewal decision | `POST /api/v1/leases/:id/non-renewal` | Ejari Release Envelope |
