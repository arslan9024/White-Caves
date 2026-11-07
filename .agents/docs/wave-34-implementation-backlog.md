**Wave:** 34  
**Focus:** RERA Permit Enforcement + Financial Report Export  
**Phase:** A (Foundation Completion)  
**Priority:** P0 Critical (RERA is Critical per tech debt register)  
**Status:** ✅ Complete  
**Date:** 2026-08-09  
**SRS Refs:** REQ-PROP-002, REQ-FIN-001, REQ-FIN-002, SRS §4.3  
**Business Doc Refs:** `09_crm_features/trakheesi-integration.md`; `09_crm_features/financial-reporting.md`

---

| ID | Category | Priority | Task | Owner | Validation Command | Status |
|----|----------|----------|------|-------|--------------------|--------|
| W34-001 | RERA | P0 | RERA `reraPermitNumber` + `reraPermitExpiryDate` in Prisma schema & publish enforcement | @Barbara | `npx vitest run server/routes/properties.test.ts` | ✅ Complete |
| W34-002 | RERA | P0 | Daily auto-unpublish cron service for expired RERA permits (`server/services/reraPermitCron.ts`) | @Sofia | `npx vitest run server/services/reraPermitCron.test.ts` | ✅ Complete |
| W34-003 | Finance | P1 | Commission Detail Report → Excel (`DocumentService.generateCommissionDetailExcel`) | @Invoice | `npx vitest run server/routes/reporting.test.ts` | ✅ Complete |
| W34-004 | Finance | P1 | Monthly P&L Report → PDF (`DocumentService.generateMonthlyPnLPdf`) | @Invoice | `npx vitest run server/routes/reporting.test.ts` | ✅ Complete |
| W34-005 | Governance | P0 | Wave 34 closeout & typecheck | @Katherine | `npm run typecheck && npm run plans:validate` | ✅ Complete |

---

## Acceptance Gate (Wave-Level)

Wave 34 is complete when:
1. Attempting to publish a property without `permitNumber` returns 422.
2. Daily cron job correctly unpublishes expired RERA permit properties in test.
3. Commission Detail Report exports a valid `.xlsx` file.
4. Monthly P&L Report exports a valid `.pdf` file.
5. `npm run plans:validate` passes.
6. `npm run quality:quick` passes.

---

## Dependencies
- ExcelJS package: `npm install exceljs`
- PDFKit package: `npm install pdfkit`
- Prisma schema: `permitNumber` and `permitExpiryDate` fields must exist on Property model
