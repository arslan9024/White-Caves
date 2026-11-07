# Wave 14 — Product Automation: Lead Rescore Triggers + Audit Log UI

**Drafted by:** @LeadScore  
**Model:** DeepSeek V3  
**Status:** ✅ READY (retrospective spec for implemented Wave 14)  
**Last Updated:** 2026-05-25  

CONSUMES←@Cron: `business_docs/09_crm_features/wave-12-automation-engine.md#lead-auto-rescore`  
FEEDS→@Cassie: `business_docs/09_crm_features/analytics-dashboard.md#lead-quality-signals`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-14-product-automation.md`

---

## 1. Overview

Wave 14 delivers two closely coupled product features:

1. **Lead Auto-Rescore** — AI-powered lead quality score recalculation triggered automatically on events and via a daily cron job
2. **Audit Log UI** — Filterable, paginated front-end view of the system audit trail with inline activity context

---

## 2. Lead Auto-Rescore

### 2.1 Trigger Sources

| Trigger | Source | Debounce |
|---------|--------|---------|
| Daily cron (`02:00 AST`) | `SchedulerService` → `batchRescoreLeads()` | None — full scan |
| Lead status change | `leads.ts` route → `rescoreSingleLead(leadId)` | 2 seconds |
| Viewing completed | `appointments.ts` route → `rescoreSingleLead(leadId)` | None |
| Offer submitted | `offers.ts` route → `rescoreSingleLead(leadId)` | None |
| Manual trigger (admin) | `POST /api/leads/:id/rescore` | None |

### 2.2 Lead Scoring Engine (`server/services/ai/leadScoringEngine.ts`)

**Score inputs (0–100 composite):**

| Signal | Weight | Description |
|--------|--------|-------------|
| Engagement recency | 25% | Days since last contact (decay curve) |
| Activity count | 20% | Total interactions (calls, emails, viewings) |
| Budget range | 20% | AED budget vs median area price |
| Source quality | 15% | Portal lead vs cold call vs referral |
| Response rate | 10% | Agent reply within 24h |
| Profile completeness | 10% | Email + phone + area preference filled |

**Output:**
```typescript
interface LeadScoreResult {
  leadId: string;
  score: number;          // 0–100
  tier: 'hot' | 'warm' | 'cold';
  signals: Record<string, number>;
  scoredAt: string;       // ISO-8601
}
```

**Tier thresholds:**
- `hot`: score ≥ 70
- `warm`: score 40–69
- `cold`: score < 40

### 2.3 `batchRescoreLeads()`

Rescores all active (non-closed, non-rejected) leads in batches of 50 to avoid memory pressure. Updates `lead.score`, `lead.tier`, and `lead.lastScoredAt` in the database.

### 2.4 REST API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/leads/:id/rescore` | `manager` | Manual rescore for one lead |
| `POST` | `/api/leads/rescore-batch` | `admin` | Trigger full batch rescore |
| `GET` | `/api/leads/:id/score-history` | `agent` | Paginated score history |

---

## 3. Audit Log UI

### 3.1 Audit Trail Data Model

```
audit_logs
  id          String   @id @default(cuid())
  userId      String
  action      String   // CREATE | UPDATE | DELETE | STATUS_CHANGE | LOGIN | EXPORT
  entityType  String   // lead | property | lease | contract | user | commission
  entityId    String
  oldValue    Json?
  newValue    Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
```

All audit records are **append-only** — no UPDATE or DELETE queries are run on this collection.

### 3.2 REST Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/audit-logs` | `admin` | List with filters + pagination |
| `GET` | `/api/audit-logs/:id` | `admin` | Single audit record detail |
| `GET` | `/api/audit-logs/export` | `admin` | CSV export (max 10,000 rows) |

**Query parameters for list:**

| Param | Type | Description |
|-------|------|-------------|
| `userId` | string | Filter by acting user |
| `entityType` | string | Filter by entity category |
| `action` | string | Filter by action type |
| `from` | ISO-8601 | Start of date range |
| `to` | ISO-8601 | End of date range |
| `page` | number | Default 1 |
| `limit` | number | Default 50, max 200 |

### 3.3 Frontend Component (`AuditLogPage`)

**Filters panel (sidebar):**
- Date range picker (from/to)
- Entity type dropdown
- Action type multi-select
- User search (agent name / email)

**Table columns:**
`Timestamp | User | Action | Entity Type | Entity ID | Changes Summary`

**Row expansion:** Click a row to see `oldValue` vs `newValue` diff displayed as a two-column JSON comparison.

**Pagination:** Server-side cursor pagination, 50 rows per page.

**CSV Export:** `admin`-only button; downloads all matching rows (max 10,000) as `audit-log-{date}.csv`.

---

## 4. Acceptance Criteria

### Lead Rescore
- [x] Daily cron rescores all active leads by 02:00 AST
- [x] Single lead rescore triggered on status change / viewing / offer events
- [x] Score stored on lead record with `lastScoredAt` timestamp
- [x] Tier assignment (`hot` / `warm` / `cold`) reflects score thresholds

### Audit Log UI
- [x] All mutating API actions create an audit log entry
- [x] Audit log records are append-only (no updates/deletes)
- [x] Filter by user, entity type, action, and date range
- [x] Row expansion shows oldValue / newValue diff
- [x] CSV export available for `admin` role
- [x] Pagination works correctly with all active filters applied
