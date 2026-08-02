# Wave 12 — Readiness Packet

**Wave:** 12  
**Focus:** Automation Engine  
**Status:** 📋 Planned  
**Date:** 2026-05-24  
**Readiness Score:** 60% (unlock threshold met when Wave 11 is green)

---

## Gate Checklist

| Gate | Check | Status |
| --- | --- | --- |
| Wave 11 complete | Prior wave all-green | ⬜ Pending |
| Planning governance | `npm run plans:validate` passes | ⬜ Pending rerun |
| Scheduler spec | @Cron output committed | ⬜ Pending |
| Document spec | @Puppeteer output committed | ⬜ Pending |
| Email spec | @Handlebars output committed | ⬜ Pending |
| API contracts | Routes and payloads defined | ⬜ Pending |
| Test scenarios | Unit/integration checks mapped | ⬜ Pending |
| Rollback plan | Feature-safe rollback documented | ⬜ Pending |

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Cron double execution in multi-instance runtime | Medium | High | lock/overlap-safe strategy + idempotent handlers |
| Heavy PDF dependency impact | Medium | Medium | lazy generation + streaming + timeout limits |
| Email trigger duplication | Medium | Medium | central trigger registry + event dedupe key |

---

## FEEDS / CONSUMES

- `CONSUMES←@Zod: business_docs/09_crm_features/wave-14-validation-architecture.md#error-envelope`
- `FEEDS→@Socket: business_docs/09_crm_features/wave-12-automation-engine.md#event-trigger-contract`
