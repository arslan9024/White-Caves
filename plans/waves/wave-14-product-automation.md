# Wave 14: Product Automation Specifications

## 1. Overview
Product automation ensures that routine tasks—such as lead re-scoring and audit logging—run without manual intervention.

## 2. Lead Auto-Rescore
- **Trigger**: Runs via a cron job daily (`15 1 * * *`) via `SchedulerService`.
- **Logic**: Iterates over all active leads. Decay factors are applied to stale leads (no contact in 14 days). Leads with recent high-value intent signals (e.g., viewing a $5M property 3 times) are upgraded in score.
- **Outcome**: Persisted to the database and emitted to the WebSocket feed.

## 3. UI Audit Log 
- All automation outcomes and administrative actions (Updates, Deletes) are recorded in the `Activity` database table.
- The `SystemAuditLog` UI component fetches these records to provide transparency into automated and manual system modifications.
