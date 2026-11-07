# Wave 12: Automation Engine Specifications

## 1. Overview
The `SchedulerService` acts as the central orchestration engine for all background tasks and cron jobs in the White Caves CRM. 

## 2. Cron Cadence Table

| Job ID | Description | Expression | Frequency | Timezone |
|---|---|---|---|---|
| `lead-sla-escalation` | Escalates leads that breach SLAs | `0 * * * *` | Hourly | Asia/Dubai |
| `lead-rescore-daily` | Re-runs AI lead propensity models | `15 1 * * *` | Daily at 01:15 | Asia/Dubai |
| `permit-checks-daily` | Verifies RERA and DLD permits | `0 2 * * *` | Daily at 02:00 | Asia/Dubai |
| `rent-generation-monthly` | Auto-generates rent invoices | `0 3 1 * *` | 1st of Month at 03:00 | Asia/Dubai |
| `rent-reminders-daily` | Emails past-due rent reminders | `0 8 * * *` | Daily at 08:00 | Asia/Dubai |
| `lease-expiry-reminders` | Emails upcoming lease expiries (90/60/30 days) | `0 9 * * *` | Daily at 09:00 | Asia/Dubai |

## 3. Failure Escalation Matrix
- **Severity Low (e.g., Sitemap Refresh Failure)**: Logs silently to error stream. Re-attempts next cycle.
- **Severity Medium (e.g., Email Failure)**: Retries up to 3 times with exponential backoff.
- **Severity High (e.g., SLA Escalation Failure)**: Dispatches immediate webhook to `@Ada` (Chief Architect) and triggers an alert on the IT monitoring dashboard.
