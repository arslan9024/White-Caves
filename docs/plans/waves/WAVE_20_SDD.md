# Wave 20 — System Design Document (SDD)

**Wave:** 20
**Focus:** RBAC Hardening + Audit Export Security + Contract Parity
**Status:** ✅ Complete (implemented + validated)
**Date:** 2026-06-18
**Owners:** @Mira + @Radia + @Katherine

---

## Objective

Close concrete RBAC/security gaps discovered during the Wave 19 gap registry analysis. Every change here is a real, runnable security fix — no planning theatre.

---

## Scope

### 1. Audit Log Export Permission Tightening (P0 — OWASP A01)

- `GET /api/activities/export/csv` currently gated with `view_leads`
- `GET /api/activities/export/xlsx` currently gated with `view_leads`
- `buyer` and `tenant` roles have `view_leads` → can export the full company audit trail
- **Fix:** re-gate both routes with `view_audit_logs` which is only granted to agent-rank roles and above

### 2. Compliance Route Auth Gaps (P0)

- Several `POST`/`PATCH` mutations inside `server/routes/compliance.ts` use `requireMinRole('agent')` without an additional ownership/role check — e.g. POST `/reports`, POST `/brn-check`, PATCH `/kyc/documents/:id/review`
- **Fix:** add explicit allowed-roles guard (`owner/manager/admin/finance`) on each mutation

### 3. KYC/AML Consent Mutations (P0)

- POST/DELETE for PDPL consent and PATCH for KYC review documents need explicit manager+ guards — not just `requireMinRole('agent')`
- **Fix:** harden each mutation handler with an explicit allowed-roles check (`owner/manager/admin/finance`) + audit log entry

### 4. Wave 20 Closeout Governance (P0)

- Sync tracker evidence and pass `npm run plans:validate`

---

## Architecture Constraints

- No new middleware files — use the existing `requirePermission` + inline role guards pattern already established in Wave 19.
- Changes are additive only — no breaking changes to response shapes.
- Each hardened route must have a focused regression test.

---

## Requirement IDs

| ID          | Description                                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| REQ-SEC-001 | Audit log exports must require `view_audit_logs` permission                                                                |
| REQ-SEC-002 | Compliance mutations (`POST /reports`, `POST /brn-check`, `PATCH /kyc/*/review`) must require explicit manager+ role guard |
| REQ-SEC-003 | PDPL consent mutations (`POST /consent`, `DELETE /consent/:id`) must require manager+ role guard                           |
| REQ-SEC-004 | All security fixes must have targeted route tests with RBAC negative-path assertions                                       |
