# SLA Reconciliation Matrix

**Status:** Draft  
**Owner:** @Cassie + @Ruchi  
**Last Updated:** 2026-08-02

This matrix reconciles business-promised SLAs with software-operational timers and alert expectations.

## Reconciliation model

- **External SLA** = customer- or business-facing promise.
- **Internal SLO / operational timer** = engineering/runtime target used to satisfy or monitor the SLA.
- Where a software doc uses a stricter timer than the commercial SLA, both should be preserved but clearly separated.

## SLA bridge matrix

| Business / service promise | Software / operational source | External SLA | Internal SLO / timer | Reconciliation note |
| --- | --- | --- | --- | --- |
| Platform uptime (`service-level-agreements.md`) | `api_architecture.md`; ops/monitoring surfaces | 99.5% / 99.9% / 99.95% by tier | health checks every 60s; API gateway and service monitoring | Commercial SLA is tiered; software monitoring is environment-wide |
| API performance p95 | `service-level-agreements.md`; `api_architecture.md` | `< 200ms` p95 | route/service instrumentation and backend optimization targets | Directly aligned in current docs |
| Lead response / speed-to-lead | `service-level-agreements.md`; `lead_distribution_sla.md`; `lead_ingestion_lifecycle.md` | business support SLA varies by severity; sales responsiveness implied | strict 15-minute lead distribution timer | Separate customer support response from sales lead-contact SLA |
| WhatsApp message relay | `service-level-agreements.md`; WhatsApp-related use cases | `< 3s` platform-to-WhatsApp | webhook processing `< 1s`; routing to available agent `< 5s` | Use chain: ingest <1s, relay <3s, assignment/routing <5s |
| Notification delivery | `service-level-agreements.md` | `< 5s` | WebSocket / notification pipeline targets | Internal queueing and push transport must stay below external promise |
| Maintenance request response | `maintenance.md` business spec | emergency/high/medium/low issue windows | no canonical software timer doc yet | Needs dedicated software-side maintenance SLO artifact |
| Portal syndication / integration latency | `service-level-agreements.md`; portal feature docs | integration and webhook expectations | webhook delivery `< 5s`, partner API variable | Must distinguish White Caves processing from third-party portal latency |
| Backup RPO / RTO | `service-level-agreements.md` | RPO 6h basic/pro, <1m continuous replication context; RTO by scenario | backup verification and restore drills | Primarily ops-governed; should cross-link to devops runbooks |

## Resolution rules

1. Distinguish customer-facing SLA from internal SLO.
2. Document measurement source for each critical timer.
3. Link each reconciled SLA to the relevant use case, route, or monitoring artifact.

## Priority follow-ups

1. Add a maintenance-specific software timer artifact or route-level contract.
2. Add route/service ownership references for API p95, webhook processing, and notification delivery.
3. Link these rows into `PROGRESS_DASHBOARD.md` or future observability summaries where appropriate.
