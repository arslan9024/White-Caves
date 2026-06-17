# Wave 21 — Readiness Packet

**Wave:** 21  
**Focus:** Finance, UAE VAT, Commission Engine & Compliance Reporting  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Readiness Score:** 68% (UAE VAT rules fully documented; commission rate matrix + FTA format need final confirmation)

---

## Readiness Checklist

| Category | Item | Status | Notes |
|---|---|---|---|
| Business Rules | UAE VAT 5% on residential sales commission | ✅ Documented | `financial-reporting.md`, FTA confirmed |
| Business Rules | Long-term residential rent commission is VAT-exempt | ✅ Documented | FTA Federal Decree 8 of 2017 |
| Business Rules | Commission rate matrix by deal type | ✅ Documented | `revenue-model.md` tables |
| Business Rules | Multi-party splits must sum to 100% | ✅ Documented | Validation rule in W21-004 |
| Business Rules | Commission clawback within 30 days | ✅ Documented | W21-006 |
| Business Rules | Monthly close lock prevents ledger edits | ✅ Documented | Immutable ledger rule |
| Business Rules | Invoice auto-number format `INV-YYYY-MMDD-####` | ✅ Documented | `financial-reporting.md` |
| API Contract | All commission endpoints defined | ✅ Complete | `WAVE_21_SDD.md` |
| API Contract | All invoice endpoints defined | ✅ Complete | `WAVE_21_SDD.md` |
| API Contract | Finance reporting endpoints defined | ✅ Complete | `WAVE_21_SDD.md` |
| Data Schema | Commission + CommissionSplit Prisma models | ✅ Complete | `WAVE_21_SDD.md` |
| Data Schema | Invoice Prisma model + enums | ✅ Complete | `WAVE_21_SDD.md` |
| Test Scenarios | VAT calc all transaction types | ✅ Defined | W21-001 |
| Test Scenarios | Commission approval chain | ✅ Defined | W21-005 |
| Test Scenarios | Monthly close lock test | ✅ Defined | W21-011 |
| Test Scenarios | Executive P&L RBAC gate | ✅ Defined | W21-014 |
| External Dependencies | ExchangeRate-API free tier (1500 req/month) | ✅ Available | W21-012 |
| External Dependencies | Company TRN for invoice templates | ⚠️ Needed | Required for FTA-compliant invoices |
| External Dependencies | FTA portal format confirmation | ⚠️ Pending | VAT return format verified against 2026 FTA portal |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Company TRN not available for invoice templates | Medium | High | Use placeholder `TRN-PENDING` in dev; production TRN unblocks FTA compliance only |
| FTA quarterly return format changes in 2026 | Low | Medium | Format parameterized; admin setting for FTA schema version |
| ExchangeRate-API 1500 req/month limit exceeded | Low | Low | 4-hour cache + Redis fallback; upgrade tier if needed |
| Commission split rounding errors (float) | Medium | Medium | Use integer AED fils (×100) for all calculations; round only on display |

---

## Pre-Coding Checklist (60% Readiness Gate)

- [x] UAE VAT rules documented in `financial-reporting.md`
- [x] Commission rate matrix documented in `revenue-model.md`
- [x] API contract defined in `WAVE_21_SDD.md`
- [x] Data schema defined in `WAVE_21_SDD.md`
- [x] At least 4 test scenarios defined per module
- [ ] Company TRN confirmed for invoice templates
- [ ] Wave 20 fully closed out

**Gate Status:** Ready for @Ada approval once Wave 20 closes out and TRN is confirmed
