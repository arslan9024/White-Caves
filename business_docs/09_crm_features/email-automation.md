# Email Automation

> **Owner:** @Annie | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Module:** AnnieEmailService via Resend API
> **Status:** Production-ready specification

`CONSUMES←@Victoria: business_docs/09_crm_features/tenancy-ejari.md#tenant-obligations`
`FEEDS→@Marissa: business_docs/09_crm_features/tenant-portal.md#ux-requirements`

---

## 1. Overview

The Email Automation module delivers transactional and scheduled emails through the **Resend API** (resend.com). All emails are triggered by CRM lifecycle events — lease expiry, rent due, maintenance updates, portal first login, and PDC bounce alerts. Delivery tracking is stored in the `email_log` MongoDB collection and surfaced in the CRM activity feed.

**Provider:** Resend (`resend` npm package, v6.x)
**From address:** `noreply@whitecaves.com` (verified domain)
**Reply-to:** `support@whitecaves.com`

---

## 2. Automated Email Triggers

### 2.1 Lease Expiry Reminder

| Rule | Value |
|------|-------|
| Triggers | 90 days, 60 days, 30 days before `lease.endDate` |
| Recipients | Tenant (primary) + Landlord (cc) + Assigned Agent (bcc) |
| Resend Template ID | `tmpl_lease_expiry` |
| Cron schedule | Daily at 08:00 Gulf Standard Time (UTC+4) |
| Suppress if | Lease already has a renewal in `signing` or `active` status |

**Dynamic variables:**

```json
{
  "tenantName": "string",
  "propertyAddress": "string",
  "leaseEndDate": "DD MMM YYYY",
  "daysRemaining": 90,
  "renewalLink": "https://portal.whitecaves.com/tenant?tab=lease",
  "agentName": "string",
  "agentPhone": "string"
}
```

### 2.2 Rent Due Reminder

| Rule | Value |
|------|-------|
| Triggers | 3 days before `nextPaymentDue` on active lease |
| Recipients | Tenant only |
| Resend Template ID | `tmpl_rent_due` |
| Skip if | Payment already marked `paid` for that period |

**Dynamic variables:**

```json
{
  "tenantName": "string",
  "amountAED": 12500,
  "dueDate": "DD MMM YYYY",
  "paymentMethods": ["PDC cheque", "bank transfer", "cash"],
  "bankDetails": { "iban": "...", "accountName": "White Caves LLC" }
}
```

### 2.3 Maintenance Status Update

| Rule | Value |
|------|-------|
| Triggers | On `status` field change of MaintenanceRequest |
| Recipients | Tenant + Landlord (if approved/completed) |
| Resend Template ID | `tmpl_maintenance_update` |
| Status transitions | `open → assigned`, `assigned → in_progress`, `in_progress → completed` |

**Dynamic variables:**

```json
{
  "tenantName": "string",
  "ticketId": "MNT-001234",
  "category": "Plumbing",
  "newStatus": "in_progress",
  "contractorName": "string",
  "scheduledAt": "DD MMM YYYY HH:mm",
  "notes": "string"
}
```

### 2.4 Welcome Email (Tenant Portal First Login)

| Rule | Value |
|------|-------|
| Triggers | `POST /api/auth/login` — first login with `tenant` role |
| Recipients | Tenant |
| Resend Template ID | `tmpl_tenant_welcome` |
| Idempotency | Send once per user — track `welcomeEmailSentAt` on User model |

**Dynamic variables:**

```json
{
  "tenantName": "string",
  "portalUrl": "https://portal.whitecaves.com/tenant",
  "agentName": "string",
  "agentEmail": "string",
  "agentPhone": "string",
  "propertyAddress": "string"
}
```

### 2.5 PDC Bounce Alert

| Rule | Value |
|------|-------|
| Triggers | On PDC status updated to `bounced` by agent |
| Recipients | Landlord (primary) + Assigned Agent |
| Resend Template ID | `tmpl_pdc_bounce` |
| SLA | Deliver within 1 hour of status update |
| Priority | High (Resend priority header set) |

**Dynamic variables:**

```json
{
  "landlordName": "string",
  "tenantName": "string",
  "chequeNo": "string",
  "amount": 12500,
  "dueDate": "DD MMM YYYY",
  "bankName": "Emirates NBD",
  "propertyAddress": "string",
  "agentName": "string",
  "nextStepsUrl": "https://crm.whitecaves.com/leads/{leaseId}"
}
```

---

## 3. Resend API Integration and Retry Logic

### 3.1 Resend Client Setup

```ts
// server/services/email/resendClient.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
export default resend;
```

### 3.2 Send Function with Retry

```ts
export async function sendEmail(params: EmailParams): Promise<void> {
  const MAX_ATTEMPTS = 3;
  const RETRY_DELAY_MS = 600_000; // 10 minutes

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const result = await resend.emails.send({
        from: 'White Caves <noreply@whitecaves.com>',
        to: params.to,
        cc: params.cc,
        bcc: params.bcc,
        subject: params.subject,
        html: params.html,
        headers: { 'X-Priority': params.priority ?? 'normal' },
      });
      await logEmailDelivery(result.id, params, 'sent');
      return;
    } catch (err) {
      if (attempt === MAX_ATTEMPTS) {
        await logEmailDelivery(null, params, 'failed', String(err));
        logger.error('email.send.failed', { params, error: err, attempt });
        throw err;
      }
      await sleep(RETRY_DELAY_MS);
    }
  }
}
```

### 3.3 Email Log Schema

```ts
// MongoDB collection: email_logs
interface EmailLog {
  _id: ObjectId;
  resendMessageId: string | null;
  triggerType: 'lease_expiry' | 'rent_due' | 'maintenance_update' | 'welcome' | 'pdc_bounce';
  recipientEmail: string;
  recipientName: string;
  entityId: string;         // leaseId, ticketId, etc.
  entityType: string;
  status: 'sent' | 'failed' | 'bounced' | 'unsubscribed';
  attempts: number;
  sentAt: Date | null;
  failReason?: string;
  createdAt: Date;
}
```

---

## 4. Cron Jobs

| Job | Schedule (GST UTC+4) | Function |
|-----|---------------------|----------|
| Lease expiry scanner | Daily 08:00 | Find leases expiring in 90/60/30 days, dedupe, send |
| Rent due scanner | Daily 07:00 | Find payments due in 3 days, skip if paid |

Cron powered by `node-cron` (or Vercel Cron Jobs for hosted deployments).

---

## 5. Unsubscribe Handling

- All marketing/reminder emails include a 1-click unsubscribe link
- Unsubscribe URL: `POST /api/email/unsubscribe?token={signed_token}`
- On unsubscribe: set `user.emailOptOut = true` in DB
- Transactional emails (PDC bounce, maintenance) bypass opt-out

---

## 6. Validation Rules

| Rule | Logic |
|------|-------|
| Lease must be `active` | Skip expiry reminder for terminated/expired |
| Payment period deduplication | Check `email_logs` for same `triggerType + entityId + period` within 25h |
| Valid email format | Regex before send |
| Template variables | All required fields must be non-null; missing → log error, skip send |

---

## 7. Failure and Edge Handling

| Scenario | Handling |
|----------|----------|
| Resend API down | Retry 3×, escalate to Slack alert |
| Invalid email address | Log as `invalid`, skip without retry |
| Tenant has no email | WhatsApp fallback trigger via Linda/Nadia |
| Duplicate send | Idempotency check on `email_logs` within 25h window |
| Template missing | Fall back to plain-text version, alert admin |

---

## 8. Security & Compliance Controls

- `RESEND_API_KEY` stored in environment variables only (never committed)
- Email content never includes Emirates ID or passport numbers
- Unsubscribe tokens are HMAC-signed (1-week TTL)
- TLS enforced for all Resend API calls
- Email logs retained 12 months per UAE commercial retention rules

---

## 9. UX States (CRM Side)

| State | Display |
|-------|---------|
| Email queued | CRM activity feed: "Lease expiry reminder queued for tenant@email.com" |
| Email delivered | Green tick in activity feed |
| Email failed | Red badge, retry option visible to agent |
| Unsubscribed | Orange badge, note in tenant profile |

---

## 10. Observability / Logging

```ts
logger.info('email.trigger', { triggerType, entityId, recipientCount });
logger.info('email.sent', { resendMessageId, triggerType, entityId, durationMs });
logger.error('email.failed', { triggerType, entityId, attempt, error });
```

**Metrics:**
- `email_sent_total{trigger_type}` — counter
- `email_failed_total{trigger_type, reason}` — counter
- `email_delivery_duration_ms{trigger_type}` — histogram

---

## 11. Tests

| Test | Type | Target |
|------|------|--------|
| `POST /api/email/send` triggers Resend API | Integration | server |
| Retry fires after failure | Unit | sendEmail() |
| Duplicate suppressed within 25h window | Unit | deduplication logic |
| Unsubscribe token validated | Unit | token utils |
| Cron scanner finds correct leases | Unit | leaseExpiryScan() |
| PDC bounce sends within 1h | Integration | event-driven path |

---

## 12. Rollback / Migration Plan

- Adding new trigger: new cron or event handler only, no DB migration
- Removing a trigger: disable cron entry, no data loss
- Email log schema stable; new fields additive
- Resend template updates: deploy new template ID, keep old ID valid for 48h overlap