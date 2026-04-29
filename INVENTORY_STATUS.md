# INVENTORY STATUS — White Caves Real Estate LLC

> **Manager:** @Mary — Inventory & Acquisition Manager  
> **Last Updated:** 2026-04-29  
> **Cadence:** Updated daily. Mary scans all active listings each morning.

---

## Today's Summary

| Metric | Count |
|---|---|
| Total Properties | — |
| 🟢 Verified / Active | — |
| 🟡 Under Offer (Locked) | — |
| 🔵 Leased / Sold | — |
| ⚪ Draft / Collected | — |
| ⚠️ Missing Documents | — |

---

## Inventory Pipeline Stages

| Stage | Code | Description |
|---|---|---|
| 1 | `draft_collected` | Newly collected from landlord — pending review |
| 2 | `verified_active` | Verified by @Mary — live on market |
| 3 | `under_offer` | Offer received — property **locked** to prevent double-booking |
| 4 | `leased_sold` | Deal completed — lease/sale signed |
| 5 | `handed_over` | Keys handed to tenant or buyer |

---

## Document Compliance

Properties with missing documents are automatically flagged. The following must be
on file before a property can move from **Draft** → **Verified/Active**:

- [ ] Title Deed  
- [ ] Landlord Passport / Emirates ID  
- [ ] Ejari (where applicable)

---

## Availability Guard

A property is **automatically locked** (`isLocked = true`) the moment an offer is
accepted (`status = accepted` on the `Offer` record). Only a `manager` or `owner`
role can unlock it manually.

If an accepted offer is subsequently rejected or withdrawn, and no other accepted
offers exist for the property, the system automatically unlocks the property and
returns it to `verified_active` stage.

---

## New Acquisitions — This Week

_To be updated daily by @Mary after morning scan._

| Date | Property Title | Unit | Area | Stage | Doc Status |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

---

## Recently Leased / Sold — This Week

_To be updated daily by @Mary._

| Date | Property Title | Type | Agent | Stage |
|---|---|---|---|---|
| — | — | — | — | — |

---

## 30-Day Stale Listings Alert

Properties active for **>30 days without a viewing** are escalated to the Project
Manager for marketing strategy review.

| Property | Days Active | Last Viewing | Action |
|---|---|---|---|
| — | — | — | — |

---

*This file is maintained by the @Mary AI agent and should be committed daily.*
