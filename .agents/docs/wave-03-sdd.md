# WAVE_03_SDD — WhatsApp CRM Revenue Capture

## 1. Feature Overview

- **Feature/Module:** WhatsApp CRM revenue capture (Nadia inbox, Nina automation, Olivia campaign foundation)
- **Wave ID:** WAVE_03
- **Owner:** @Jaime + @Mira
- **Date:** May 15, 2026

## 2. Business Context & Objectives

- Activate WhatsApp as a production lead-capture and conversation-routing channel
- Reduce response time and eliminate manual lead entry from WhatsApp traffic
- Establish safe inbound/outbound messaging foundation for UAE real-estate workflows

**Success metrics**

- Inbound messages create/update CRM conversation records
- Agents can reply from Nadia inbox
- Nina bot handles first-response classification and escalation
- Olivia campaign/send foundation is ready behind rate limits

**Out-of-scope**

- Full OpenAI conversational upgrade (deferred to later AI waves)
- Full campaign analytics maturity beyond basic sent/delivered tracking

## 3. Architecture Context

**Related modules**

- `server/services/WhatsAppBotService.ts`
- `server/services/MetaAPIClient.ts`
- `server/routes/whatsapp.ts` / `server/routes/nadia.ts`
- `src/components/crm/NadiaWhatsAppCRM/`
- `src/components/crm/NinaWhatsAppBotCRM_NEW/`
- `src/components/crm/OliviaMarketingCRM_NEW/`

**Integration boundaries**

- Meta Cloud API is external system of record for message delivery state
- CRM stores conversation/message history and assignment state
- Lead creation integrates with Clara lead pipeline

**Dependencies**

- Wave 02 route/permission inventory
- Meta Business credentials and webhook configuration
- Existing auth/RBAC middleware

## 4. API Contract

**Core endpoints**

- `GET /api/nadia/conversations`
- `GET /api/nadia/conversations/:id`
- `POST /api/nadia/conversations/:id/reply`
- `PATCH /api/nadia/conversations/:id/assign`
- `PATCH /api/nadia/conversations/:id/close`
- inbound webhook endpoint for Meta WhatsApp callbacks

**Error model**

- 401/403 for unauthorized access
- 400 for invalid message payloads
- 502 for upstream Meta delivery failures
- idempotent webhook handling for duplicate delivery events

**Auth/permissions**

- Inbox access restricted by role/permission
- Reply/assign/close actions audit logged
- webhook endpoints excluded from CSRF and protected by signature verification

## 5. Data Model & Storage

- Reuse Nadia conversation/message/queue models already present in Prisma
- Add campaign model if not present for Olivia scheduling/tracking
- Store delivery direction, timestamps, assignee, escalation flags, and source metadata
- Retain conversation audit history for support/compliance traceability

## 6. Validation & Failure Handling

- Verify webhook authenticity via HMAC/signature strategy
- Deduplicate inbound webhook events
- Queue failed outbound sends with retry/backoff
- Nina confidence/escalation threshold routes uncertain flows to Nadia human inbox

## 7. Security & Compliance

- No unauthenticated inbox access
- No unsigned webhook acceptance
- Respect opt-in / template restrictions for outbound WhatsApp campaigns
- PII in message logs must follow retention/redaction policy from compliance wave

## 8. UX States

- Inbox loading/empty/error states
- Real-time refresh or safe polling fallback
- Mobile-safe conversation layout
- Accessibility for conversation lists, reply actions, and unread state

## 9. Testing Strategy

- Unit: Nina intent classification, webhook parsing, retry policy
- Integration: inbound webhook → conversation/message creation; reply endpoint → Meta client adapter
- E2E: agent opens inbox, replies, assigns, closes conversation
- Regression: no duplicate conversations from repeated webhook events

## 10. Observability

- Metrics: inbound volume, response time, escalation rate, delivery failure rate
- Logs: webhook signature status, outbound send attempts, escalation events
- Alerts: sustained delivery failures or webhook verification failures
- Dashboard: simple operational inbox health metrics

## 11. Rollout & Rollback

- Start behind env/config guard
- Enable inbound logging first, then agent replies, then Nina automation, then Olivia campaigns
- Roll back by disabling WhatsApp send/automation flags while retaining conversation history

## 12. Readiness Scoring

- **DU (Depth Units):** 38
- **DRI (Doc Readiness Index):** 0.68
- **Readiness score (%):** 68%
- **Sign-offs:** Pending @Margaret / @Sofia / @Katherine / @Ada
