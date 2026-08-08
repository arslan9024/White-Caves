# Wave 12 — Email Wiring: Template Registry + Event Trigger Matrix

<!-- markdownlint-disable MD040 MD060 -->

**Drafted by:** @Handlebars  
**Model:** Gemini 2.0 Flash  
**Status:** ✅ READY (retrospective spec for implemented Wave 12)  
**Last Updated:** 2026-05-25  
**Next Review:** 2026-08-21  
**Source of Truth:** CRM Wave 12 email wiring feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend notification/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

CONSUMES←@Cron: `business_docs/09_crm_features/wave-12-automation-engine.md#job-definitions`  
FEEDS→@Annie: `business_docs/09_crm_features/email-automation.md#trigger-events`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-12-email-wiring.md`

---

## 1. Overview

The Email Wiring layer connects CRM events (user actions, cron jobs, status changes) to outbound email delivery via the Resend API. It uses Handlebars templates compiled server-side and dispatched through `emailTriggers.ts` and `emailService.ts`.

---

## 2. Email Stack

| Layer | File | Responsibility |
|-------|------|----------------|
| Trigger dispatcher | `server/services/emailTriggers.ts` | Maps event enum → template + subject |
| Email send | `server/services/emailService.ts` | Resend API call, branded wrapper, delivery tracking |
| Template engine | Handlebars (server-side compile) | Renders `.hbs` templates with variables |
| Template files | `server/templates/email/*.hbs` | HTML email bodies |

---

## 3. Trigger Event Registry

```typescript
type EmailTriggerEvent =
  | 'welcome'
  | 'lead_assigned'
  | 'viewing_confirmed'
  | 'payment_reminder'
  | 'offer_submitted'
  | 'contract_ready'
  | 'kyc_required';
```

### 3.1 Event → Template Mapping

| Event | Template File | Subject Template | Triggered By |
|-------|--------------|------------------|--------------|
| `welcome` | `welcome.hbs` | `Welcome to White Caves, {{name}}!` | User first sign-in |
| `lead_assigned` | `lead-assigned.hbs` | `New Lead Assigned: {{leadName}}` | Agent assignment action |
| `viewing_confirmed` | `viewing-confirmed.hbs` | `Viewing Confirmed: {{propertyTitle}}` | Viewing status → `confirmed` |
| `payment_reminder` | `payment-reminder.hbs` | `Payment Due: AED {{amount}} on {{dueDate}}` | Cron `rent-reminders-daily` |
| `offer_submitted` | `offer-submitted.hbs` | `New Offer Received: {{propertyTitle}}` | Offer creation API |
| `contract_ready` | `contract-ready.hbs` | `Your Contract is Ready: {{contractNumber}}` | Contract status → `ready` |
| `kyc_required` | `kyc-required.hbs` | `Action Required: Complete Your KYC` | Tenant portal onboarding |

---

## 4. Trigger Input Contract

```typescript
interface TriggerEmailInput {
  event: EmailTriggerEvent;
  to: string | string[];              // recipient(s)
  variables: Record<string, string | number | boolean | null | undefined>;
}
```

### 4.1 Variable Map per Event

| Event | Required Variables |
|-------|--------------------|
| `welcome` | `name` |
| `lead_assigned` | `leadName`, `agentName`, `leadPhone`, `leadEmail` |
| `viewing_confirmed` | `propertyTitle`, `viewingDate`, `viewingTime`, `agentName` |
| `payment_reminder` | `tenantName`, `amount`, `dueDate`, `propertyAddress` |
| `offer_submitted` | `propertyTitle`, `offerAmount`, `buyerName`, `agentName` |
| `contract_ready` | `contractNumber`, `tenantName`, `propertyAddress`, `signingLink` |
| `kyc_required` | `tenantName`, `portalLink`, `deadline` |

---

## 5. Email Service Contract (`sendEmailTracked`)

```typescript
interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;           // compiled from Handlebars template
  replyTo?: string;
  tags?: string[];        // for Resend tracking/categorisation
}
```

**Branded wrapper:** `wrapInBrandedTemplate(innerHtml)` injects White Caves header, footer, unsubscribe link and `tel:+971-xxx` support number into every outbound email.

---

## 6. Retry Logic

| Attempt | Delay | Condition |
|---------|-------|-----------|
| 1 | Immediate | Initial send |
| 2 | 10 minutes | HTTP 429 / 5xx from Resend |
| 3 | 30 minutes | HTTP 429 / 5xx from Resend |
| Fail | — | Log error + mark delivery status `failed` |

Retry state is managed by the calling cron job or route; no persistent retry queue is implemented in Wave 12 (planned for Wave 18).

---

## 7. Delivery Tracking

Each triggered email is recorded in the CRM activity log:

| Field | Value |
|-------|-------|
| `activityType` | `email_sent` |
| `entityType` | `lead` / `lease` / `contract` (contextual) |
| `entityId` | ID of the related entity |
| `metadata.event` | e.g. `payment_reminder` |
| `metadata.to` | recipient address(es) |
| `metadata.resendId` | Resend message ID (for webhook reconciliation) |

---

## 8. Template Directory

```
server/templates/email/
  ├── welcome.hbs
  ├── lead-assigned.hbs
  ├── viewing-confirmed.hbs
  ├── payment-reminder.hbs
  ├── offer-submitted.hbs
  ├── contract-ready.hbs
  └── kyc-required.hbs
```

All templates use UTF-8, AED currency symbols, and include a plain-text fallback for clients that block HTML.

---

## 9. Acceptance Criteria

- [x] All 7 trigger events map to a template file and subject string
- [x] `TriggerEmailInput` dispatches correctly via Resend API
- [x] Branded wrapper applied to every outbound email
- [x] Missing variable in template gracefully renders empty string (no crash)
- [x] Delivery event logged to activity feed
- [x] Unsubscribe link present in footer for marketing/reminder emails
