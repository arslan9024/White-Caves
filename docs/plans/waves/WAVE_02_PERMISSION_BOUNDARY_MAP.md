# WAVE_02_PERMISSION_BOUNDARY_MAP

**Date:** May 15, 2026  
**Source:** `server/middleware/rbac.ts`  
**Status:** ACTIVE FOR WAVES 03–11

---

## Canonical Role Resolution

Use backend role resolution via `ROLE_ALIAS_MAP` and `resolveBackendRole()` in `rbac.ts`.

High-level role groups:

- Executive: `owner`, `manager`, `admin`
- Operations: `agent`, `leasing-agent`, `secondary-sales-agent`
- Finance: `finance`
- Client/read-heavy: `viewer`, `buyer`, `seller`, `landlord`, `tenant`

---

## Critical Permission Boundaries

### Wave 03 — WhatsApp CRM

Required permissions (by action):

- view inbox/conversations: `view_dashboard` + communication module access
- reply/assign/close conversation: managerial/agent communication capabilities
- campaign/broadcast send: owner/manager/admin scope only
- webhook ingestion: system endpoint, no UI role access, signature-verified

### Wave 04 — Compliance Baseline

Required permissions (by action):

- compliance review and status updates: owner/manager/admin/compliance-designated scope
- KYC document decisions: restricted reviewer roles only
- consent export/delete or regulated data operations: restricted privileged roles
- listing/transaction enforcement checks: server-side mandatory, non-bypassable

---

## Non-negotiable Rules

1. UI visibility is not sufficient; authorization must be enforced server-side.
2. New sensitive actions require both `requirePermission()` and audit logging.
3. Unauthorized attempts must return 401/403 and be test-covered.
4. Alias roles must map to canonical backend roles before permission evaluation.

---

## Validation Checklist for Any New Route

- [ ] Role resolution applied via `resolveBackendRole`
- [ ] Permission check present (`requirePermission`/`requireRole`)
- [ ] Negative test for unauthorized actor
- [ ] Sensitive mutations are audit-visible
