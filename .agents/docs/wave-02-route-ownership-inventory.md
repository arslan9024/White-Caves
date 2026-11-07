# WAVE_02_ROUTE_OWNERSHIP_INVENTORY

**Date:** May 15, 2026  
**Source:** `server/routes/*` + wave scope docs  
**Status:** ACTIVE BASELINE FOR WAVES 03–11

---

## Ownership Buckets

### A) Public / Marketing-facing (homepage and unauthenticated)

- `homepage.ts`
- `contact.ts`
- selected read-only listing/search routes in `properties.ts`

**Primary owners:** @Mira + @Rachel

---

### B) Auth / Identity / Session control

- `auth.ts`
- `users.ts`
- `roleRequests.ts`

**Primary owners:** @Daniela + @Radia

---

### C) Core CRM operational routes

- `leads.ts`
- `properties.ts`
- `contracts.ts`
- `viewings.ts`
- `offers.ts`
- `leases.ts`
- `tenantPortal.ts`
- `landlord.ts`
- `finance.ts`
- `reporting.ts`

**Primary owners:** @Mira + @Barbara + @Katherine

---

### D) WhatsApp / communications (Wave 03 critical)

- `nadia.ts`
- `meta-webhook.ts`
- `communications.ts`
- `linda.ts`
- `nina.js`
- `olivia.routes.js`

**Primary owners:** @Jaime + @Mira (+ @Radia for webhook security)

---

### E) Compliance / governance (Wave 04 critical)

- `compliance.ts`
- `phase6.routes.ts`
- compliance-related workflows touching `properties.ts`, `transactions.ts`, `clients.ts`

**Primary owners:** @Sofia + @Timnit + @Mira

---

### F) Analytics / orchestration / system operations

- `analytics.ts`
- `orchestration.ts`
- `integrations.ts`
- `activities.ts`
- `notifications.js`

**Primary owners:** @Cassie + @Ruchi + @Lila

---

## Wave-boundary Route Focus

### Wave 03 (WhatsApp CRM Revenue Capture)

- Primary route surface: `nadia.ts`, `meta-webhook.ts`, `communications.ts`, `olivia.routes.js`, `nina.js`
- Cross-impact routes: `leads.ts` (source=whatsapp), `notifications.js`

### Wave 04 (Compliance Baseline)

- Primary route surface: `compliance.ts`, `phase6.routes.ts`
- Cross-impact routes: `properties.ts`, `transactions.ts`, `documents.ts`, `users.ts`

---

## Enforcement Rule

Any route touched in Wave 03/04 must include:

1. explicit auth/RBAC evaluation,
2. negative-path test case,
3. audit/log visibility where sensitive actions occur.
