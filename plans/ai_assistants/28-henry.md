# 28 — Henry · Record Keeper & Timeline Master

> **ID:** `henry`  
> **Department:** Technology  
> **Title:** Record Keeper, Audit Trail & Timeline Master  
> **Color:** `#7C3AED` (Purple)  
> **Avatar:** 📚  
> **Phase:** Phase 3 (High Priority — Audit Log)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Compliance Officer (read-only), System-level write

---

## 1. Overview

Henry is the **immutable memory of the entire White Caves system**. Every significant action across all 39 other assistants and all backend routes generates an audit event that Henry ingests, categorises, and preserves. He provides the timeline visualisation, relationship mapping between entities, compliance audit exports, and SLA breach detection. Henry never deletes records — his entire purpose is permanent, queryable memory.

---

## 2. Core Responsibilities

1. Ingest audit events from all backend routes via middleware (`POST /api/events`)
2. Provide chronological timeline view of any entity (property, lead, client, user)
3. Cross-entity relationship mapping (who touched what, when, and why)
4. SLA monitoring: flag overdue tasks, delayed approvals, stale records
5. Compliance audit export: complete activity log for a specified time period
6. Search across all events: "show me everything that happened to lead #X"

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Universal event ingestion | All CRUD + status changes + logins → Henry audit log |
| Timeline view | Chronological feed for any entity type: lead, property, deal, user |
| Entity graph | Visual map: Lead 123 → Deal 45 → Commission 7 → Agent A |
| SLA monitor | Define SLA rules: KYC must complete within 3 business days → alert if breached |
| Compliance export | Date range + entity type → JSON or PDF audit report |
| Event search | Full-text search across all event descriptions |
| Change detection | What changed in this record between two timestamps |
| Retention policy | Configurable: keep all events for 7 years (UAE legal requirement) |
| Analytics | Most active users, most modified entities, peak activity times |

---

## 4. How It Works — End to End

### Step 1 — Event Emission
Every backend route wraps successful mutations in `HenryService.log(event)`:
```typescript
interface AuditEvent {
  actorId: string;       // who did it
  actorRole: string;
  action: string;        // 'lead.created', 'property.status_changed', 'user.login'
  entityType: string;    // 'Lead', 'Property', 'Deal'
  entityId: string;
  before?: object;       // state before change (for updates)
  after?: object;        // state after change
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  metadata?: object;
}
```

### Step 2 — Event Storage
Events written to dedicated `AuditLog` MongoDB collection. Collection is **append-only** — no update or delete operations permitted. Indexed on: `entityId`, `actorId`, `action`, `timestamp`.

### Step 3 — Timeline Query
`GET /api/henry/timeline/:entityType/:entityId` → returns all events for that entity, sorted chronologically. Frontend renders as a feed with icons per action type.

### Step 4 — SLA Monitoring
`HenryService.checkSLAs()` runs every hour via cron:
- KYC initiated > 3 business days ago and still `pending` → SLA breach alert
- Hot lead not contacted in > 8 hours → SLA breach
- Commission approval pending > 2 days → SLA breach
Breaches create notifications in Zoe's alert centre.

### Step 5 — Relationship Map
For a given lead: Henry traces all linked entities → lead → deal → commission → property → agent. Returns a graph object. Frontend visualises as a D3/Recharts node graph.

### Step 6 — Compliance Export
`GET /api/henry/export?from=2026-01-01&to=2026-03-31&actorId=X` → fetches matching events → Quill generates PDF audit report with: event count, summary table, full event log.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/henry/events` | Log an audit event |
| GET | `/api/henry/timeline/:type/:id` | Entity timeline |
| GET | `/api/henry/search` | Full-text event search |
| GET | `/api/henry/graph/:type/:id` | Entity relationship graph |
| GET | `/api/henry/sla-breaches` | Current SLA breach list |
| GET | `/api/henry/export` | Compliance audit export |
| GET | `/api/henry/analytics` | Activity analytics |

---

## 6. Data Flows

- **Receives from:** All 39 other assistants (backend middleware emits events), Auth system (login/logout events)
- **Sends to:** Zoe (SLA breach alerts), Laila (compliance audit requests), Quill (audit report generation)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Henry CRM dashboard | `src/components/owner/ai/HenryCRM/` | 🔲 Planned |
| Audit log tab | In CRM settings | 🔲 Planned (Phase 3 backlog #37) |
| Entity timeline | Embedded in lead/property detail | 🔲 Planned |
| SLA breach panel | Inside dashboard | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| HenryService | `server/services/HenryService.ts` | 🔲 Planned |
| AuditLog middleware | `server/middleware/auditMiddleware.ts` | 🔲 Planned |
| SLA cron | `server/jobs/slaCronJob.ts` | 🔲 Planned |
| Audit export | `server/routes/henry.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full audit log + analytics |
| `compliance_officer` | Read audit log + export |
| System (middleware) | Write events only |
| All others | ❌ |

---

## 10. Implementation Checklist

- [ ] Register `henry` in `AI_ASSISTANTS_REGISTRY`
- [ ] `AuditLog` Prisma model (append-only, 7-year retention)
- [ ] `HenryService.log()` function
- [ ] Audit middleware wrapper for all mutations
- [ ] Timeline endpoint
- [ ] SLA rules configuration + cron check
- [ ] Entity relationship graph endpoint
- [ ] Compliance export PDF (Quill)
- [ ] Audit log UI tab in CRM (Phase 3 #37)
- [ ] Tests: `HenryService.test.ts`

---

## 11. Dependencies

- `node-cron` (SLA check job)
- Quill (compliance audit PDF)
- All other assistants (they are event sources)

---

## 12. Future Enhancements

- Blockchain-based immutable audit chain
- Natural language query: "Show me everything Jane did last week"
- Anomaly detection: flag unusual access patterns
- Real-time audit stream via WebSocket for live compliance monitoring
