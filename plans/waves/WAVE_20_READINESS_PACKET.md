# Wave 20 — Readiness Packet

**Wave:** 20  
**Focus:** Full Leasing & Tenancy Implementation  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Readiness Score:** 65% (business rules + API contract complete; PDC math + e-sign integration need verification)

---

## Readiness Checklist

| Category | Item | Status | Notes |
|---|---|---|---|
| Business Rules | Ejari mandatory per Dubai Decree No. 26/2013 | ✅ Documented | `tenancy-ejari.md` |
| Business Rules | PDC schedule: total cheques × amount = annual rent | ✅ Documented | Validation in W20-005 |
| Business Rules | Bounced cheque: 1-hour escalation SLA | ✅ Documented | W20-006 |
| Business Rules | Form 7: 90-day advance notice for rent increase | ✅ Documented | RERA requirement confirmed |
| Business Rules | Form 12: eviction notice grounds and timing | ✅ Documented | `tenancy-ejari.md` |
| Business Rules | Early termination penalty per RERA Article 11 | ✅ Documented | `tenancy-ejari.md` |
| Business Rules | RERA rental index check on renewal | ✅ Documented | Annual RERA release |
| API Contract | Lease CRUD endpoints defined | ✅ Complete | `WAVE_20_SDD.md` |
| API Contract | PDC endpoints defined | ✅ Complete | `WAVE_20_SDD.md` |
| API Contract | Tenant portal endpoints defined | ✅ Complete | `WAVE_20_SDD.md` |
| API Contract | Landlord portfolio endpoint defined | ✅ Complete | `WAVE_20_SDD.md` |
| Data Schema | Lease Prisma model defined | ✅ Complete | `WAVE_20_SDD.md` |
| Data Schema | PDC Prisma model defined | ✅ Complete | `WAVE_20_SDD.md` |
| Data Schema | Enums (LeaseStatus, PDCStatus) defined | ✅ Complete | `WAVE_20_SDD.md` |
| Test Scenarios | Lease create → sign → Ejari flow | ✅ Defined | W20-003, W20-004 |
| Test Scenarios | PDC bounce → notification → Form 12 | ✅ Defined | W20-006 |
| Test Scenarios | Tenant portal six-tab smoke tests | ✅ Defined | W20-010 |
| Test Scenarios | RBAC boundary tests all roles | ✅ Defined | W20-013 |
| External Dependencies | DocuSign/Adobe Sign API credentials | ⚠️ Pending | Need production keys for e-sign |
| External Dependencies | DLD/Ejari API integration | ⚠️ Pending | Manual status until API granted |
| External Dependencies | Meta WABA template for bounce alert | ✅ Available | Reuse existing Wave 13 infra |
| UI Specs | Tenant portal six-tab layout | ✅ Documented | `tenant-portal.md` |
| UI Specs | Landlord portal portfolio view | ✅ Documented | `landlord-portal.md` |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| DocuSign API keys not available for Wave start | Medium | High | Use mock webhook in dev; production keys unblock e-sign only |
| DLD Ejari API access denied | High | Medium | Manual Ejari number entry covers compliance; API integration is enhancement |
| RERA rental index API not available | High | Low | Hardcode current 2026 index table; update quarterly |
| PDC schedule math edge cases (annual/semi-annual) | Low | Medium | Unit tests with all frequency variants before merge |

---

## Pre-Coding Checklist (60% Readiness Gate)

- [x] Business rules documented in `tenancy-ejari.md`
- [x] API contract defined in `WAVE_20_SDD.md`
- [x] Data schema defined in `WAVE_20_SDD.md`
- [x] At least 4 test scenarios defined per module
- [x] RBAC boundaries documented
- [ ] DocuSign credentials available in `.env.local`
- [ ] Wave 19 fully closed out

**Gate Status:** Ready for @Ada approval once Wave 19 closes out
