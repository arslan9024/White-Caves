# Wave 19 — Dashboard API Contract (Execution-Grade)

**Wave:** 19  
**Scope:** Dashboard data contracts for MD split workspaces and executive discoverability  
**Status:** ✅ Complete (locked for implementation)  
**Date:** 2026-06-17

---

## Contract Rules

1. Endpoint contracts are additive-first and backward-compatible with existing dashboard consumers.
2. Every response uses a normalized envelope: `success`, `data`, `meta`, `error`.
3. Error payloads are user-safe; internal diagnostics are logged server-side only.
4. Data freshness fields are mandatory for KPI-bearing responses.
5. All protected endpoints require role resolution before payload generation.

---

## Response Envelope

### Success

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_123",
    "generatedAt": "2026-06-17T10:00:00.000Z",
    "freshnessSeconds": 42
  },
  "error": null
}
```

### Failure

```json
{
  "success": false,
  "data": null,
  "meta": {
    "requestId": "req_123",
    "generatedAt": "2026-06-17T10:00:00.000Z"
  },
  "error": {
    "code": "DASHBOARD_ROUTE_FALLBACK",
    "message": "We couldn't load this section right now. Please retry.",
    "retryable": true
  }
}
```

---

## Endpoint Contracts

## 1) Executive Summary (Workspace A)

- **Method/Path:** `GET /api/dashboard/summary`
- **Purpose:** first-screen strategic KPI overview + urgent actions
- **Primary Consumer:** `crmDataSlice` overview + `UnifiedDashboardPage`

### Query Params — Executive Summary

- `workspace=company|ai` (optional; default `company`)
- `timeRange=7d|30d|90d` (optional; default `30d`)

### Data Shape — Executive Summary

```json
{
  "kpis": [
    {
      "id": "lead_response_time",
      "label": "Lead Response Time",
      "value": 14,
      "unit": "minutes",
      "deltaPct": -12.5,
      "trend": "down",
      "status": "healthy"
    }
  ],
  "urgentActions": [
    {
      "id": "kyc_violations",
      "title": "KYC approvals pending",
      "count": 3,
      "severity": "high",
      "route": "/crm?module=compliance"
    }
  ],
  "systemHealth": {
    "status": "healthy",
    "apiP95Ms": 420,
    "errorRatePct": 0.6
  },
  "assistantStatus": {
    "online": 5,
    "degraded": 1,
    "offline": 0
  }
}
```

---

## 2) Funnel Economics (Workspace A)

- **Method/Path:** `GET /api/dashboard/funnel-economics`
- **Purpose:** lead→viewing→offer→close conversion flow
- **Primary Consumer:** Wave 18.1 funnel components and executive cards

### Query Params — Funnel Economics

- `period=week|month|quarter`
- `channel=all|web|whatsapp|referral`
- `department` (optional)

### Data Shape — Funnel Economics

```json
{
  "stages": [
    { "stage": "lead", "count": 1280 },
    { "stage": "viewing", "count": 490 },
    { "stage": "offer", "count": 180 },
    { "stage": "close", "count": 74 }
  ],
  "conversion": {
    "leadToViewingPct": 38.3,
    "viewingToOfferPct": 36.7,
    "offerToClosePct": 41.1,
    "leadToClosePct": 5.8
  },
  "benchmarks": {
    "targetLeadToViewingPct": 40,
    "targetOfferToClosePct": 45
  }
}
```

---

## 3) KPI Baseline Tracker (Workspace A)

- **Method/Path:** `GET /api/dashboard/kpi-baseline`
- **Purpose:** 90-day baseline/target tracking with deltas
- **Primary Consumer:** KPI baseline widgets + tracker cards

### Query Params — KPI Baseline Tracker

- `window=30|60|90`
- `includeForecast=true|false` (default true)

### Data Shape — KPI Baseline Tracker

```json
{
  "items": [
    {
      "metricId": "mobile_crm_completion",
      "label": "Mobile CRM Completion",
      "baseline": 31,
      "current": 36,
      "target": 42,
      "unit": "%",
      "progressPct": 45.5,
      "etaDays": 21
    }
  ],
  "summary": {
    "onTrack": 5,
    "atRisk": 2,
    "offTrack": 1
  }
}
```

---

## 4) Agent Performance Report + Exports (Workspace A)

- **Method/Path:**
  - `GET /api/dashboard/agent-performance`
  - `POST /api/dashboard/agent-performance/export`
  - `GET /api/dashboard/agent-performance/export/:jobId`
- **Purpose:** filterable agent performance + async XLSX/PDF export
- **Primary Consumer:** Session 3 `W18.1-P1-003`

### Query Params — Agent Performance

- `agentId` (optional)
- `from`, `to` (ISO date)
- `stage=all|lead|viewing|offer|close`
- `page`, `limit`

### Data Shape — Agent Performance

```json
{
  "rows": [
    {
      "agentId": "a1",
      "agentName": "Sara Khan",
      "leads": 120,
      "viewings": 44,
      "offers": 18,
      "closes": 7,
      "leadToViewingPct": 36.7,
      "offerToClosePct": 38.9,
      "avgResponseMinutes": 11
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 87 }
}
```

### Export Contract

```json
{
  "jobId": "exp_abc123",
  "status": "queued",
  "format": "xlsx",
  "estimatedSeconds": 25
}
```

---

## 5) AI Command Center Summary (Workspace B)

- **Method/Path:** `GET /api/dashboard/ai-command-center`
- **Purpose:** assistant usage, queue health, escalation quality
- **Primary Consumer:** MD Workspace B command center panel

### Data Shape — AI Command Center

```json
{
  "assistants": [
    { "assistantId": "nina", "online": true, "activeConversations": 42, "escalationRatePct": 8.1 }
  ],
  "queues": {
    "pending": 19,
    "inProgress": 7,
    "stuck": 1
  },
  "quality": {
    "confidenceAvg": 82.4,
    "handoffSlaMinutes": 4.7
  }
}
```

---

## Workspace KPI + Drill-Down Boundaries (REQ-MDIA-003 / REQ-MDIA-004)

### Workspace A — Company Structure & Business Process

- **Allowed KPI domains:** properties, leads, revenue, agents, contracts, pipeline velocity, compliance health
- **Allowed drill-down tabs:** `overview`, `properties`, `agents`, `leads`, `contracts`, `analytics`, `users`
- **AI command controls:** not rendered in Workspace A surfaces

### Workspace B — AI Command Center

- **Allowed KPI domains:** assistant online/degraded/offline, queue pending/in-progress/stuck, handoff SLA, confidence quality
- **Allowed drill-down tabs:** `ai-command`, `ai-hub`
- **Centralization rule:** assistant orchestration controls MUST render only in Workspace B

### Ownership Constraint

Every KPI family and drill-down route maps to exactly one top-level workspace. No KPI card or command-center control can appear in both workspaces simultaneously.

---

## Non-Functional Contract Thresholds

1. **Dashboard load p95:** <= 2200ms on production profile.
2. **Dashboard API p95:** <= 700ms for summary/funnel/KPI endpoints.
3. **Export start latency p95:** <= 1200ms for export job creation.
4. **Export completion success:** >= 98% (rolling 7-day).
5. **Freshness SLA:** >= 95% of KPI responses with `freshnessSeconds <= 300`.

---

## Rollout + Rollback Trigger Matrix

| Metric Gate                                                          | Rollout Pass Trigger                            | Rollback Trigger                      | Required Action                                                             |
| -------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| Dashboard API p95 (`/summary`, `/funnel-economics`, `/kpi-baseline`) | p95 <= 700ms for 2 consecutive checks           | p95 > 700ms for 2 consecutive checks  | Revert to prior endpoint response path/feature flag and open P0 remediation |
| Dashboard load p95                                                   | p95 <= 2200ms on production profile             | p95 > 2200ms for 2 consecutive checks | Disable non-critical cards and revert latest dashboard bundle changes       |
| Export reliability (`agent-performance/export`)                      | >= 98% success on rolling 7-day window          | < 98% on rolling 7-day window         | Pause new export rollout and route jobs to stable fallback pipeline         |
| KPI freshness SLA                                                    | >= 95% responses with `freshnessSeconds <= 300` | < 95% in two audits                   | Force degraded freshness banner + rollback freshness-dependent widgets      |

All rollback triggers must be logged with request IDs and wave task references in `plans/AEGIS_RUN_LOG.md`.

---

## Compatibility + Rollback Notes

- Existing consumers expecting legacy payload keys must be supported via additive aliases during Wave 19 rollout.
- If any endpoint violates p95/error thresholds for two consecutive checks, rollback to prior response shape/feature flag path and open a P0 remediation item.
- Fallback UI must render safe degraded cards instead of blank surfaces.

---

## Requirement Mapping

- `REQ-MDIA-003` -> KPI ownership + drill-down boundaries
- `REQ-MDIA-004` -> AI command center centralization contract
- `REQ-UXMD-001` -> first-screen executive impact payload
- `REQ-UXMD-002` -> degraded/error-safe contract behavior
- `REQ-UXMD-004` -> discoverability payload supports direct route actions
