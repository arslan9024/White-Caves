**Wave:** 33  
**Focus:** WhatsApp Cloud API Real Integration + Ejari Schema Fix  
**Phase:** A (Foundation Completion)  
**Priority:** P0 Critical  
**Status:** ✅ Complete  
**Date:** 2026-08-09  
**SRS Refs:** REQ-TENANT-003, REQ-COMM-001, SRS §4.7  
**Business Doc Refs:** `09_crm_features/tenancy-ejari.md`; `09_crm_features/whatsapp-hub.md`

---

| ID | Category | Priority | Task | Owner | Validation Command | Status |
|----|----------|----------|------|-------|--------------------|--------|
| W33-001 | WhatsApp | P0 | Meta webhook HMAC signature verification handler (`server/routes/meta-webhook.ts`) | @Daniela | `npx vitest run server/routes/meta-webhook.routes.test.ts` | ✅ Complete |
| W33-002 | WhatsApp | P0 | WhatsApp Cloud API send client (`server/services/whatsapp/metaAPI.ts`) | @Corinne | `npx vitest run server/services/whatsapp/WhatsAppBotService.test.ts` | ✅ Complete |
| W33-003 | Tenancy | P0 | Ejari lease activation enforcement — `server/routes/leases.ts` (returns 422 if ejariNumber missing) | @Victoria | `npx vitest run server/routes/leases.test.ts` | ✅ Complete |
| W33-004 | Tenancy | P1 | 30-day Ejari expiry warning cron (`server/services/ejariExpiryCron.ts`) | @Victoria | `npx vitest run server/services/ejariExpiryCron.test.ts` | ✅ Complete |
| W33-005 | Governance | P0 | Wave 33 closeout & typecheck | @Katherine | `npm run typecheck && npm run plans:validate` | ✅ Complete |

---

## Acceptance Gate (Wave-Level)

Wave 33 is complete when:
1. `server/routes/whatsapp.test.ts` passes cleanly — HMAC webhook verified.
2. `cloudApiClient.ts` sends text and template messages without errors.
3. Prisma schema updated with Ejari fields and `npx prisma generate` succeeds.
4. Lease status→`active` transition blocked without `ejariContractNumber`.
5. `npm run plans:validate` passes with exit code 0.
6. `npm run quality:quick` passes (typecheck + lint + build).

---

## Dependencies
- Meta WhatsApp Business Account (WABA) credentials in `.env`
- Prisma schema migration requires `npx prisma migrate dev`
