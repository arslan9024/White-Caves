
**Wave:** 42  
**Focus:** AML Screening + PDPL Consent Management  
**Phase:** E (Compliance & Security)  
**Priority:** P1 High  
**Status:** ✅ Complete  
**Date:** 2026-08-09  
**SRS Refs:** COMP-AML-001 to 005, COMP-PDPL-001 to 005  
**Business Doc Refs:** `05_requirements/compliance-requirements.md`; `implementation-plan.md` §E2, §E3

---

| ID | Category | Priority | Task | Owner | Validation Command | Status |
|----|----------|----------|------|-------|--------------------|--------|
| W42-001 | AML | P0 | ComplyAdvantage & PEP/Sanctions screening service — `server/services/amlScreeningService.ts` | @Sofia | `npx vitest run server/services/amlScreeningService.test.ts` | ✅ Complete |
| W42-002 | AML | P0 | Auto-screening on client record creation (PEP/Sanctions) | @Sofia | `npx vitest run server/services/amlScreeningService.test.ts` | ✅ Complete |
| W42-003 | AML | P0 | AML risk score calculation (low/medium/high) | @Sofia | `npx vitest run server/services/amlScreeningService.test.ts` | ✅ Complete |
| W42-004 | AML | P1 | SAR workflow: creation, approval, goAML submission tracking — `server/routes/sar.ts` | @Sofia | `npx vitest run server/routes/sar.test.ts` | ✅ Complete |
| W42-005 | PDPL | P0 | Consent API & privacy policy version tracking — `server/routes/consent.ts` | @Sofia | `npx vitest run server/routes/consent.test.ts` | ✅ Complete |
| W42-006 | PDPL | P0 | Consent record storage (`WhatsAppConsent` model) | @Barbara | `npx vitest run server/routes/consent.test.ts` | ✅ Complete |
| W42-007 | PDPL | P1 | Opt-out mechanism for marketing (`POST /api/consent/opt-out`) | @Sofia | `npx vitest run server/routes/consent.test.ts` | ✅ Complete |
| W42-008 | PDPL | P1 | Data export function (Right of Access) — `server/routes/dataExport.ts` | @Sofia | `npx vitest run server/routes/dataExport.test.ts` | ✅ Complete |
| W42-009 | PDPL | P2 | Account deletion request workflow (Right to Erasure) — `server/routes/dataDelete.ts` | @Sofia | `npx vitest run server/routes/dataDelete.test.ts` | ✅ Complete |
| W42-010 | Governance | P0 | Wave 42 closeout & typecheck | @Katherine | `npm run typecheck && npm run plans:validate` | ✅ Complete |

---

## Dependencies
- ComplyAdvantage API contract + API key in `.env`
- UAE FIU goAML portal account for SAR submissions
