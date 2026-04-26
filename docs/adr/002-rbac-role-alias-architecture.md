# ADR-002: RBAC Role Alias Architecture

**Status:** Accepted  
**Date:** 2026-03-31  
**Deciders:** Platform Team  

## Context

The White Caves platform evolved two distinct role systems over time:

1. **Backend canonical roles (12):** `owner`, `manager`, `admin`, `finance`, `agent`, `secondary-sales-agent`, `leasing-agent`, `landlord`, `seller`, `viewer`, `tenant`, `buyer`. These map to a hierarchy (100→10) and a 21-permission matrix.

2. **Frontend UI roles (24):** Domain-specific roles (`managing_director`, `branch_manager`, `sales_agent`, `mortgage_consultant`, etc.) with display names, icons, colours, and dashboard paths.

Users may have any of the 24 frontend roles stored in their JWT. Backend RBAC middleware only recognised 12 canonical keys — any unrecognised role caused **403 Access Denied**.

## Decision

Implement a **role alias resolution layer** rather than duplicating permission sets for all 24 roles.

- `ROLE_ALIAS_MAP` in `server/middleware/rbac.ts` maps every frontend role ID → one of 12 canonical backend roles.
- `resolveBackendRole(role)` is called inside every middleware (`requireRole`, `requirePermission`, `requireAllPermissions`, `requireMinRole`, `scopeToOwn`) before any permission check.
- The same map is mirrored in `src/utils/permissions.ts` for client-side checks.

### Mapping summary

| Frontend Role | → Backend Role | Hierarchy Level |
|---|---|---|
| managing_director, real_estate_company | owner | 100 |
| property_mgmt_company, branch_manager, sales_manager, leasing_manager, marketing_manager | manager | 90 |
| super_admin, trustee_officer, legal_officer, document_controller | admin | 80 |
| finance_officer | finance | 70 |
| sales_agent, property_manager | agent | 50 |
| leasing_agent | leasing-agent | 50 |
| affiliated_agent | secondary-sales-agent | 50 |
| property_consultant, mortgage_consultant, valuation_expert | viewer | 10 |
| developer | seller | 20 |
| investor | buyer | 10 |

## Consequences

### Positive
- **Zero 403 errors** for any of the 24 frontend roles
- Single source of truth for permissions (12-role matrix unchanged)
- Adding a new UI role only requires one alias entry, not a full permission set
- Frontend and backend stay in sync via mirrored maps

### Negative
- Specialist roles (mortgage_consultant, valuation_expert) inherit generic `viewer` permissions — may need refinement later
- The alias map must be updated whenever a new frontend role is added

### Risks
- If a JWT contains a role not in the alias map, it falls through to the raw string (which may not match ROLE_PERMISSIONS). Mitigation: `resolveBackendRole()` returns the input unchanged, and permission check fails safely (empty permissions → denied).

## Files Changed
- `server/middleware/rbac.ts` — Added `ROLE_ALIAS_MAP`, `resolveBackendRole()`, updated all middleware
- `src/utils/permissions.ts` — Added `ROLE_ALIAS_MAP`, `resolveBackendRole()`, updated all helper functions
