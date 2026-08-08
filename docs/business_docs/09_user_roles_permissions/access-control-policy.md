# White Caves — Access Control Policy

<!-- markdownlint-disable MD022 MD031 MD032 MD040 MD058 MD060 -->

> **Version:** 1.0  
> **Last updated:** March 29, 2026  
> **Scope:** Frontend route guards, backend middleware, database-level filtering

---

## 1. RBAC Architecture Overview

White Caves implements a **three-layer RBAC** security model:

```
┌─────────────────────────────────────────┐
│ Layer 1: Frontend Route Guards          │
│  - React Router protected routes        │
│  - Role-based component rendering       │
│  - Navigation filtering by permissions  │
├─────────────────────────────────────────┤
│ Layer 2: Backend Middleware             │
│  - Express auth middleware              │
│  - Firebase token verification          │
│  - Role permission checks               │
├─────────────────────────────────────────┤
│ Layer 3: Database-Level Filtering       │
│  - Prisma query scoping                 │
│  - Row-level security (`.own` rules)    │
│  - Tenant isolation                     │
└─────────────────────────────────────────┘
```

## 2. Permission Model

## Requirement catalog

### REQ-ACP-001: Three-layer access enforcement

The system shall enforce access control at the frontend, backend, and data layers.

**Acceptance criteria:**

- [ ] Protected routes hide unauthorized screens
- [ ] Backend middleware rejects unauthorized requests
- [ ] Database scoping prevents cross-tenant data leakage

**Evidence:** access-control test, middleware log, and scoped query audit.

### REQ-ACP-002: Permission and ownership scoping

The system shall support resource permissions and `.own` ownership scoping for user-visible records.

**Acceptance criteria:**

- [ ] `resource.*` permissions grant full access on the resource
- [ ] `.own` permissions restrict access to owned or assigned records
- [ ] Permission inheritance rules remain explicit and auditable

**Evidence:** permission matrix, query scope log, and ownership check.

### REQ-ACP-003: Role lifecycle and role-change controls

The system shall allow only authorized roles to change user roles and ensure the change is logged.

**Acceptance criteria:**

- [ ] Only super admin and managing director can change roles
- [ ] Role changes take effect immediately
- [ ] Role changes are captured in the audit trail

**Evidence:** role change log and audit record.

### REQ-ACP-004: Sensitive data classification

The system shall classify data into public, internal, confidential, and restricted access tiers.

**Acceptance criteria:**

- [ ] Data classification is documented by category
- [ ] Financial and system settings remain restricted
- [ ] Cross-border restrictions are enforced for protected data

**Evidence:** data-classification matrix and restricted access test.

## Traceability

- Supports role-gated execution across `functional-requirements.md`
- Aligns to `WC-SRS-001`, `WC-SRS-006`, and `WC-SRS-016`
- Feeds frontend, middleware, and database enforcement validation

### Permission Format
Permissions follow the `resource.action` pattern:

- `resource.*` — Full access to all actions on a resource
- `resource.action` — Specific action (view, create, edit, delete, approve, own)
- `*` — Superuser access (Managing Director only)

### Ownership Scoping (`.own` suffix)
When a permission ends in `.own`, the user can only access records they created or are assigned to:

```typescript
// Example: leads.own
// Agent can only see their own leads
const leads = await prisma.lead.findMany({
  where: { assignedAgentId: currentUser.id }
});
```

### Permission Inheritance
- `*` grants all permissions
- `resource.*` grants all actions on that resource
- No automatic inheritance between role categories

## 3. Frontend Enforcement

### Route Protection
```typescript
// Protected route pattern
<ProtectedRoute requiredPermissions={['properties.view']}>
  <PropertyListPage />
</ProtectedRoute>
```

### Component-Level Access Control
```typescript
// Conditional rendering based on role
{hasPermission('properties.approve') && (
  <ApproveButton onClick={handleApprove} />
)}
```

### Sidebar Navigation Filtering
The `SidebarContainer` component filters department navigation items based on the current user's role category and permissions.

## 4. Backend Enforcement

### Express Middleware Chain
```
Request → authMiddleware → roleMiddleware → routeHandler
```

1. **authMiddleware**: Verifies Firebase JWT token
2. **roleMiddleware**: Checks `req.user.role` against required permissions
3. **routeHandler**: Processes request with scoped data access

### API Endpoint Protection
All `/api/*` endpoints require authentication. Specific endpoints require additional role permissions:

| Endpoint Group | Required Permissions |
|---------------|---------------------|
| `/api/properties` | `properties.view` (GET), `properties.*` (POST/PUT/DELETE) |
| `/api/leads` | `leads.view` or `leads.own` |
| `/api/finance` | `finance.*` |
| `/api/admin` | `admin.*` |
| `/api/users` | `users.*` |

## 5. Security Policies

### Session Management
- Firebase-managed sessions with configurable expiry
- Token refresh on activity
- Automatic logout on session expiry

### Audit Trail
- All permission-sensitive actions logged with timestamp, user ID, and action
- Henry (AI assistant) manages universal audit trail

### Data Classification
| Level | Description | Access |
|-------|-------------|--------|
| **Public** | Property listings, company info | All users |
| **Internal** | Lead data, tenant info | Authenticated users with role permission |
| **Confidential** | Financial reports, commission data | Management and above |
| **Restricted** | System settings, user management | Super Admin and Managing Director |

## 6. Dubai-Specific Compliance

### RERA Requirements
- All property listings must display RERA permit number
- Agent listings require broker license number
- Company profile must display DED license

### Data Protection
- Client data stored in compliance with UAE Federal Law No. 45 of 2021 (Personal Data Protection)
- Financial data encrypted at rest
- Cross-border data transfer restrictions enforced

## 7. Role Lifecycle

### Role Assignment Flow
1. User registers / is created by admin
2. Admin assigns role via UsersTab → RoleSelectorDropdown
3. Role normalized via `normalizeRoleKey()` function
4. Dashboard path set based on `RoleDefinition.dashboardPath`
5. Permissions loaded from `RoleDefinition.permissions`

### Role Change Policy
- Only `super_admin` and `managing_director` can change user roles
- Role changes take effect immediately (no cached permissions)
- All role changes logged in audit trail
