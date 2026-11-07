# Wave 12: Email Wiring Specifications

## 1. Overview
The `EmailService` acts as the outbound SMTP gateway for system-generated notifications, marketing broadcasts, and SLA escalations.

## 2. Template Registry
| Template ID | Subject | Parameters |
|---|---|---|
| `rent-reminder` | Rent Due Notice | `tenantName`, `amount`, `dueDate` |
| `lease-expiry` | Action Required: Lease Expiry | `tenantName`, `daysRemaining`, `date` |
| `sla-escalation` | URGENT: SLA Breach | `leadName`, `agentName`, `hoursOverdue` |

## 3. Event-to-Template Binding
The system uses an event-bus architecture. Whenever Prisma triggers an `InvoiceCreated` event, the event bus pushes the payload to the Email Service queue, which binds it to the corresponding Handlebars template.

## 4. Retry Logic
- Uses `bullmq` (or equivalent queue) backed by Redis.
- Implements a 5-minute exponential backoff.
- Drops messages into a Dead Letter Queue (DLQ) after 5 consecutive SMTP failures.
