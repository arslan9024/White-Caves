# Wave 18 — Server Remediation Backlog (P0/P1/P2)

**Date:** 2026-05-26  
**Scope:** backend hardening and parity closure for CRM/dashboard modernization.

---

## P0 — Must Ship First

| ID | Item | Owner(s) | Acceptance Gate | Validation |
| --- | --- | --- | --- | --- |
| SR-P0-01 | Decompose `server/index.ts` into bootstrap modules (middleware, routes, startup, schedulers) | @Mira | Main entrypoint reduced to composition layer with no inline business handlers | `npm run typecheck` + `npm run build` |
| SR-P0-02 | Introduce dependency-readiness policy for DB-dependent API classes | @Mira + @Katherine | Degraded-mode behavior explicit (readiness flags + controlled response strategy) | Health checks + targeted route tests |
| SR-P0-03 | Close lead import parity gaps (`REQ-LEAD-008` path) | @Mira | End-to-end import workflow (validation + persistence + audit) available for CRM users | route tests + CRM integration tests |
| SR-P0-04 | Enforce KYC gate before high-risk transitions | @Sofia + @Mira | Sensitive workflow state transitions blocked until KYC compliant | compliance tests + RBAC tests |
| SR-P0-05 | WhatsApp conversation-to-lead conversion and ownership routing | @Joelle + @Mira | One-click conversion path with assignee routing and audit evidence | WhatsApp route tests + CRM flow checks |
| SR-P0-06 | Rent/Ejari/permit lifecycle closure (alerts + escalations) | @Victoria + @Sofia + @Mira | Expiry/reminder/escalation pipeline complete and testable | scheduler tests + notification tests |

---

## P1 — Important Wave Follow-through

| ID | Item | Owner(s) | Acceptance Gate | Validation |
| --- | --- | --- | --- | --- |
| SR-P1-01 | Migrate remaining critical JS routes to TS contracts | @Mira | Priority route surface typed and linted under TS contracts | `npm run typecheck` |
| SR-P1-02 | Standardize request validation coverage for mutation endpoints | @Mira + @Katherine | High-risk route groups enforce schema validation uniformly | route contract tests |
| SR-P1-03 | Normalize error envelope and status semantics across legacy route groups | @Mira | Error shape parity across major APIs and compatibility aliases | API contract tests |
| SR-P1-04 | Convert operational stubs to service-backed implementations for CRM-critical flows | @Mira | Stub usage reduced for executive/CRM critical journeys | targeted route + UI integration tests |
| SR-P1-05 | Build funnel economics API + KPI aggregation endpoints | @Invoice + @Mira | Lead→Viewing→Offer→Close metrics available with periodized filters | reporting tests + dashboard checks |

---

## P2 — Optimization + Governance Maturity

| ID | Item | Owner(s) | Acceptance Gate | Validation |
| --- | --- | --- | --- | --- |
| SR-P2-01 | Formalize `/api` → `/api/v1` deprecation milestones | @Mira + @Katherine | Migration policy + timeline captured and tracked in wave docs | `npm run plans:validate` |
| SR-P2-02 | Strengthen parity evidence automation for weekly benchmark refresh | @Margaret | Delta evidence pack generated and linked to backlog updates | weekly parity report check |
| SR-P2-03 | Enhance operational SLO dashboard (latency/error/SLA/security) | @Invoice + @Katherine | KPI rollup has trend + release gate metadata | dashboard validation + plans governance check |

---

## Dependencies & Sequencing

1. SR-P0-01 must start first (reduces regression blast radius for all subsequent items).
2. SR-P0-02 should complete before major parity features to avoid false “healthy” rollouts.
3. SR-P0-03/04/05/06 can run in parallel lanes once contracts are stable.
4. P1/P2 items start after P0 acceptance gates are green.

---

## Exit Criteria

- All P0 gates green.
- No duplicate server mounts/rules in bootstrap composition layer.
- Critical CRM/dashboard parity workflows no longer stub-dependent.
- `npm run plans:validate` green after tracker updates.
