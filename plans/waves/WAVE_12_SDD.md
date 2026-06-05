# Wave 12 — System Design Document (SDD)

**Wave:** 12  
**Focus:** Automation Engine (Cron + PDF/Excel + Email Wiring)  
**Status:** 📋 Planned  
**Date:** 2026-05-24  
**Owners:** @Cron + @Puppeteer + @Handlebars + @Mira + @Katherine  
**Entry Gate:** Wave 11 green + 60% readiness from @Cron/@Puppeteer/@Handlebars + `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`

---

## Scope

Wave 12 delivers automation-heavy implementation foundations for incomplete backlog items:

- Item 6: Job Scheduler / Cron (`node-cron`, `SchedulerService.ts`)
- Item 7: Document Generation (`DocumentService.ts`, PDF/Excel streaming)
- Item 8: Email Service Wiring (Handlebars templates + event trigger map)

Source of truth: `plans/IMPROVEMENTS_INCOMPLETE_FEATURES.md`.

---

## Architecture Modules

### 1) Scheduler Module

- `server/services/SchedulerService.ts`
- startup registration at `server/index.ts`
- overlap-safe execution + structured logging to Activity model (`type: system`)

### 2) Document Module

- `server/services/DocumentService.ts`
- routes:
  - `GET /api/documents/contract/:id/pdf`
  - `GET /api/documents/commission/:agentId/pdf`
  - `GET /api/reports/leads/excel`
  - `GET /api/reports/properties/excel`
- `/tmp` temporary generation + stream response only

### 3) Email Wiring Module

- template directory: `server/templates/email/`
- trigger registry: `server/services/emailTriggers.ts`
- event-to-template mapping for welcome, lead-assigned, viewing-confirmed, reminders, offer, contract, KYC

---

## Free-Agent Spec Ownership

| Agent | Model | Spec Output | Backlog Coverage |
| --- | --- | --- | --- |
| @Cron | Llama 3.1 70B Groq | `business_docs/09_crm_features/wave-12-automation-engine.md` | Item 6 |
| @Puppeteer | DeepSeek V3 | `business_docs/09_crm_features/wave-12-document-engine.md` | Item 7 |
| @Handlebars | Gemini 2.0 Flash | `business_docs/09_crm_features/wave-12-email-wiring.md` | Item 8 |

Each spec must include API contracts, data schema touchpoints, acceptance criteria, and test scenarios before coding.

---

## Validation Commands

```bash
npm run typecheck
npm run build
npm run plans:validate
```
