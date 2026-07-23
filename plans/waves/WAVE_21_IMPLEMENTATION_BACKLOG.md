# Wave 21 — Implementation Backlog

**Wave:** 21  
**Focus:** Finance, UAE VAT, Commission Engine & Compliance Reporting  
**Status:** ✅ Complete  
**Date:** 2026-06-17  
**Entry Gate:** Wave 20 closeout + readiness 60% + `@Ada — Context Ready (90% Readiness) — High-Fidelity Coding Phase Approved`

---

| ID      | Requirement IDs                 | Priority | Task                                                                                                                                        | Owner              | Validation Command                                                                                   | Status      |
| ------- | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------- | ----------- |
| W21-001 | REQ-FIN-001, REQ-FIN-002        | P0       | Implement UAE VAT engine: 5% on taxable transactions, 0% on exempt (long-term residential rent), VAT amount computed server-side only       | @Mira + @Barbara   | Unit: VAT calc for all transaction types in `WAVE_21_SDD.md` VAT reference table                     | ✅ Complete |
| W21-002 | REQ-FIN-003                     | P1       | Build quarterly VAT return report: FTA-formatted summary (output taxable, output VAT, input VAT, net payable) — PDF + Excel export          | @Mira              | Integration: VAT return for test quarter with known transactions; output verified against FTA format | ✅ Complete |
| W21-003 | REQ-FIN-004, REQ-FIN-005        | P0       | Build Tax Invoice generator: TRN fields, line items, VAT breakdown, auto-numbering `INV-YYYY-MMDD-####`, Pro Forma and Credit Note variants | @Mira              | Unit: auto-number uniqueness; Integration: PDF output includes all required FTA fields               | ✅ Complete |
| W21-004 | REQ-FIN-006, REQ-FIN-007        | P0       | Implement commission auto-calculation on deal closure: rate matrix by deal type, multi-party splits must sum to 100%                        | @Barbara + @Mira   | Unit: split sum validation (pass/fail), rate matrix all deal types                                   | ✅ Complete |
| W21-005 | REQ-FIN-008                     | P0       | Build commission approval workflow: agent submits → manager approves → finance marks paid; role guards enforced at each step                | @Mira + @Katherine | Integration: full approval chain; RBAC: agent cannot self-approve                                    | ✅ Complete |
| W21-006 | REQ-FIN-009                     | P1       | Implement commission clawback rules: flag for clawback if deal cancelled within 30 days of payment; deduct from next payout                 | @Mira              | Unit: clawback trigger at day 0, 29, 30, 31; Integration: clawback deducted from agent next payout   | ✅ Complete |
| W21-007 | REQ-FIN-010                     | P0       | Build rolling 12-month cash-flow forecast: actuals from locked months + projected from pipeline value for remaining months                  | @Barbara + @Mira   | Integration: forecast updates on transaction create/lock; UI: chart with actuals vs projected        | ✅ Complete |
| W21-008 | REQ-FIN-011                     | P0       | Build monthly P&L report: revenue by stream, direct costs, gross profit, overheads, net profit; monthly close lock prevents edits           | @Mira + @Barbara   | Integration: close-month locks period; Unit: P&L math with known test data                           | ✅ Complete |
| W21-009 | REQ-FIN-012                     | P1       | Build AR aging report: outstanding invoices bucketed by 30/60/90/120+ days; export to Excel                                                 | @Mira              | Integration: invoices spread across aging buckets; Export: Excel columns verified                    | ✅ Complete |
| W21-010 | REQ-FIN-013                     | P1       | Build Budget vs Actual variance report: per revenue stream and cost category; configurable budget targets per period                        | @Barbara           | Unit: variance calculation; UI: colour-coded over/under budget                                       | ✅ Complete |
| W21-011 | REQ-FIN-014                     | P0       | Enforce immutable ledger: financial records append-only once locked; API rejects updateOne/deleteOne on locked entries                      | @Katherine + @Mira | Integration: attempt to edit locked entry returns 403; audit trail entry created                     | ✅ Complete |
| W21-012 | REQ-FIN-015                     | P1       | Integrate ExchangeRate-API for multi-currency display: 4-hour TTL cache, fallback to last known rate, AED primary always                    | @Mira              | Unit: cache TTL expiry + fallback; Integration: USD/GBP/EUR display on invoice                       | ✅ Complete |
| W21-013 | REQ-FIN-006 through REQ-FIN-009 | P1       | Build commission statement PDF per agent per period (agent name, deals, splits, VAT, gross/net, payment dates)                              | @Mira              | Integration: PDF generated with correct totals; E2E: agent downloads own statement                   | ✅ Complete |
| W21-014 | REQ-FIN-011                     | P1       | Executive P&L dashboard UI (Owner/MD role only): revenue tiles, margin %, YTD vs prior year comparison                                      | @Una + @Mira       | E2E: Owner role sees P&L; non-owner role cannot access                                               | ✅ Complete |
| W21-015 | All REQ-FIN-\*                  | P0       | Wave 21 closeout: governance validation, tracker sync, `npm run plans:validate` green                                                       | @Katherine         | `npm run plans:validate` passes; trackers updated                                                    | ✅ Complete |

---

## Dependency Order

1. W21-001 (VAT engine) → W21-002 (VAT return) → W21-003 (invoices)
2. W21-004 (commission calc) → W21-005 (approval workflow) → W21-006 (clawback) → W21-013 (statement PDF)
3. W21-007 (cash flow) + W21-008 (P&L) → W21-014 (executive dashboard)
4. W21-011 (immutable ledger) runs in parallel, gate for W21-008
5. All tasks → W21-015 (closeout)

---

## Acceptance Gate (Wave-Level)

Wave 21 can be marked complete only when:

1. UAE VAT engine computes correctly for all transaction types in the FTA reference table
2. Tax Invoice PDF passes FTA format verification (TRN, line items, VAT breakdown, total)
3. Commission approval workflow end-to-end verified with RBAC guards
4. Immutable ledger blocks edits to locked periods
5. Rolling cash-flow + P&L renders for Owner/MD; other roles blocked
6. `npm run plans:validate` green
7. Evidence in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
