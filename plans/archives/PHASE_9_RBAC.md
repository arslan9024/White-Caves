# Phase 9 — Multi-User CRM & Full RBAC

> **Priority**: #9 (after Phase 8)
> **Goal**: Extend the CRM from single managing director access to a full multi-user platform with role-specific views, self-service registration, and per-agent data segmentation
> **Prerequisite**: Phases 1–8 complete; the core CRM must be stable before opening to multiple users
> **Status**: 🔲 Not Started — RBAC framework exists (29 roles, authMiddleware), but multi-user flows not wired
> **Detailed context**: See [`PHASE_3_AND_BEYOND.md`](./PHASE_3_AND_BEYOND.md#phase-9--multi-user-crm--rbac-after-phase-8)

---

## Why This Is Phase 9

Delaying RBAC to Phase 9 was an intentional decision (see `MASTER_PLAN.md`). Getting the
homepage, portals, and the managing director CRM working end-to-end is higher value than supporting
other user roles on an incomplete CRM. Once the CRM is production-ready, adding other roles is a
controlled expansion.

---

## What Already Exists ✅

| Item                       | Location                             | Status                                  |
| -------------------------- | ------------------------------------ | --------------------------------------- |
| 29-role tab mapping        | `src/config/ROLE_TAB_MAPPING.ts`     | ✅ Exists                               |
| `authMiddleware`           | `server/middleware/auth.ts`          | ✅ JWT validation on all /api routes    |
| `requireRole()` middleware | `server/middleware/auth.ts`          | ✅ Per-endpoint role checks             |
| `requirePermission()`      | `server/middleware/auth.ts`          | ✅ 21 permissions defined               |
| `PendingApprovalPage.tsx`  | `src/pages/PendingApprovalPage.tsx`  | ✅ Exists — needs wiring                |
| Signup category selection  | `src/pages/auth/SignUpPage.tsx`      | ✅ Exists — role categories present     |
| `UnifiedDashboardPage`     | `src/pages/UnifiedDashboardPage.tsx` | ✅ ROLE_TAB_MAPPING drives tab display  |
| 24 backend roles aliased   | RBAC config                          | ✅ 24 frontend roles → 12 backend roles |

---

## What Needs To Be Done 🚧

### 9.1 — User Registration & Role Approval Flow

- [ ] New user signs up → selects category (Agent, Accountant, Legal, etc.) → account created with status `pending`
- [ ] Create `RoleRequest` Prisma model:
  ```prisma
  model RoleRequest {
    id          String   @id @default(auto()) @map("_id") @db.ObjectId
    userId      String   @db.ObjectId
    requestedRole String
    status      String   @default("pending") // pending, approved, rejected
    reviewedBy  String?  @db.ObjectId
    reviewedAt  DateTime?
    createdAt   DateTime @default(now())
  }
  ```
- [ ] `POST /api/users/role-request` — create role request for current user (throttled: 1 per user)
- [ ] Managing director sees pending users in "Users" tab → Approve / Reject buttons
  - Approve: set `User.status = "active"`, assign the requested role, send welcome notification
  - Reject: set `User.status = "rejected"`, send rejection notification
- [ ] `PendingApprovalPage.tsx` — wire to `GET /api/users/role-request/me` to show pending status
- [ ] `GET /api/users/role-requests` — list all pending requests (managing_director only)
- [ ] `PATCH /api/users/role-requests/:id` — approve or reject

---

### 9.2 — Role-Specific CRM Views

**Goal**: Each role sees only their permitted tabs, not the full managing director view.

- [ ] Verify `UnifiedDashboardPage` correctly reads `ROLE_TAB_MAPPING[user.role]` and renders only those tabs
- [ ] Backend data segmentation — agents see only their own data:
  - Leads: filter by `Lead.assignedToId = req.user.id` for agent role
  - Properties: filter by `Property.agentId = req.user.id` for agent role
  - Commissions: filter by `Commission.agentId = req.user.id`
- [ ] Add `assignedToId` filter to `GET /api/leads` when `req.user.role === 'agent'`
- [ ] Add `agentId` filter to `GET /api/properties` when `req.user.role === 'agent'`
- [ ] Add `agentId` filter to `GET /api/finance/commissions` when `req.user.role === 'agent'`
- [ ] Test: verify agent A cannot see agent B's leads via API

---

### 9.3 — Agent Onboarding Flow

- [ ] First login after approval: check `User.onboardingComplete` (add boolean field)
- [ ] If `!onboardingComplete`: redirect to `/onboarding` wizard (4 steps):
  1. Profile photo upload
  2. Phone number + WhatsApp number
  3. Department selection + specialisation areas
  4. Bio / self-introduction
- [ ] On completion: set `User.onboardingComplete = true`, redirect to CRM dashboard
- [ ] Welcome notification: `POST /api/notifications` — "Welcome to White Caves CRM, [name]!"
- [ ] Welcome email via `EmailService` (Phase 4 dependency): subject "Welcome to White Caves"

---

### 9.4 — CSRF Protection

- [ ] Install `csurf` or implement `double-submit cookie` pattern manually
- [ ] Generate CSRF token per session: set as `HttpOnly` cookie + return in `GET /api/auth/csrf-token`
- [ ] All state-changing endpoints (`POST`, `PATCH`, `DELETE`) validate `X-CSRF-Token` header
- [ ] Frontend: include CSRF token in all API mutation requests via Axios interceptor
- [ ] Exclude: webhook endpoints (`/api/webhook/*`, `/api/portal-feeds/lead-webhook`) from CSRF (use HMAC instead)

---

### 9.5 — API Versioning

- [ ] Prefix all API routes with `/api/v1/` (breaking change — update all frontend `apiClient` calls)
- [ ] Create alias: `/api/` → `/api/v1/` for backward compatibility during migration
- [ ] Document versioning policy in `plans/API_VERSIONING.md`: when to bump to v2
- [ ] Update `openapi.json` to use `/api/v1/` paths
- [ ] Swagger UI at `/api-docs` using `swagger-ui-express`: `npm install swagger-ui-express`

---

### 9.6 — Audit Log UI

- [ ] `AuditLog` Prisma model: verify or add — `userId`, `action`, `resource`, `resourceId`, `before`, `after`, `ip`, `timestamp`
- [ ] Wire audit logging middleware: auto-log all `POST/PATCH/DELETE` requests to AuditLog model
- [ ] `GET /api/audit-logs` — list audit events (managing_director only, paginated)
- [ ] Audit Log UI in CRM: searchable table of all system events, filterable by user/action/resource/date

---

### 9.7 — JWT Refresh Token Flow

- [ ] On login: return both `accessToken` (15 min TTL) and `refreshToken` (7 day TTL)
- [ ] Store `refreshToken` in `HttpOnly` cookie (not localStorage)
- [ ] `POST /api/auth/refresh` — validate `refreshToken` cookie, return new `accessToken`
- [ ] Frontend: Axios interceptor on 401 → call `/api/auth/refresh` → retry original request
- [ ] On logout: invalidate `refreshToken` in DB (`User.refreshTokenHash = null`)
- [ ] Revoke all sessions: `POST /api/auth/revoke-all` — clear `refreshTokenHash` (security audit action)

---

## Definition of Done — Phase 9

- [ ] New user signs up, selects role, lands on PendingApprovalPage
- [ ] Managing director approves user → user can log in and sees their role-specific CRM tabs
- [ ] Agent can only see leads/properties/commissions assigned to them
- [ ] CSRF protection active on all state-changing endpoints
- [ ] JWT refresh tokens work: access token expires after 15min, refreshes silently
- [ ] Audit log records every create/update/delete with user + timestamp
- [ ] API routes respond at `/api/v1/` with backward-compat alias at `/api/`
- [ ] Tests pass: `npx vitest run`
- [ ] Build passes: `npm run build`

---

## Next Phase After This

Once Phase 9 is complete, move to **[PHASE_10_PWA.md](./PHASE_10_PWA.md)** — Mobile PWA & Advanced Features.
