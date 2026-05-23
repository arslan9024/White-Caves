# 🏛️ White Caves — Role & Rank Matrix (ROLE_MATRIX.md)

> **Single source of truth** for all user roles, ranks, permissions, and routing in the White Caves CRM platform.
> **Version:** 2.0 | **Updated:** 2026-05-17 | **Owner:** @Ada (Chief Architect)

---

## 📐 The 3-Rank Model

White Caves users are grouped into **three ranks** based on their relationship to the platform:

| Rank       | Name                     | Who                                 | Portal      | Post-Login Route                 |
| ---------- | ------------------------ | ----------------------------------- | ----------- | -------------------------------- |
| **Rank 1** | General User             | Public/guest registrants            | `/app/*`    | `/app/home`                      |
| **Rank 2** | White Caves Staff        | Internal CRM users                  | `/crm/*`    | `/crm/dashboard` (role-specific) |
| **Rank 3** | Customer / Property-Side | Landlords, tenants, buyers, sellers | `/portal/*` | `/portal/{role}`                 |

---

## 👥 Complete Role Definitions

### Rank 1 — General Users

| Role ID | Display Name | Hierarchy | Description                                                                       |
| ------- | ------------ | --------- | --------------------------------------------------------------------------------- |
| `user`  | General User | 5         | Default after registration. Browse, search, save favourites, set property alerts. |

**Post-login:** `/app/home`

---

### Rank 2 — White Caves Staff (Internal CRM)

| Role ID          | Display Name      | Hierarchy | Badge Color          | Description                                                                      |
| ---------------- | ----------------- | --------- | -------------------- | -------------------------------------------------------------------------------- |
| `owner`          | Managing Director | 100       | 🟡 Gold `#C9A84C`    | Absolute full access. All modules, all data, system settings.                    |
| `manager`        | Manager           | 90        | 🟣 Indigo `#6366f1`  | Full operational access. Legacy alias, maps to owner-level.                      |
| `admin`          | Admin             | 80        | 🟣 Indigo `#6366f1`  | Full operational access. User management, approvals. No system settings.         |
| `hr_staff`       | HR                | 65        | 🔵 Sky `#0ea5e9`     | Employee management, payroll, leave, RERA license tracking. No client data.      |
| `accounts_staff` | Accounts          | 65        | 🔵 Sky `#0ea5e9`     | Finance: invoices, commissions, VAT, P&L. No client contact data.                |
| `leasing_agent`  | Leasing Agent     | 55        | 🟢 Emerald `#10b981` | Manage rental portfolio. Own leads, own properties, tenancy contracts, Ejari.    |
| `sales_agent`    | Sales Agent       | 55        | 🟢 Emerald `#10b981` | Manage sales portfolio. Own leads, own properties, sale contracts, DLD transfer. |
| `agent`          | Agent             | 50        | 🟢 Emerald `#10b981` | Generic agent role — legacy, use leasing_agent or sales_agent for new users.     |
| `finance`        | Finance           | 70        | 🔵 Sky `#0ea5e9`     | Legacy finance role. Use accounts_staff for new users.                           |
| `viewer`         | Viewer            | 10        | ⚫ Gray `#6b7280`    | Read-only advisory role.                                                         |

**Post-login:**

- `owner`, `admin`, `manager` → `/crm/dashboard`
- `leasing_agent` → `/crm/leasing`
- `sales_agent` → `/crm/sales`
- `hr_staff` → `/crm/hr`
- `accounts_staff`, `finance` → `/crm/accounts`
- others → `/crm/dashboard`

---

### Rank 3 — Customers / Property-Side Users

| Role ID          | Display Name   | Hierarchy | Badge Color         | Description                                                                  |
| ---------------- | -------------- | --------- | ------------------- | ---------------------------------------------------------------------------- |
| `landlord`       | Landlord       | 30        | 🟡 Amber `#f59e0b`  | Lists rental properties, manages tenants, views lease + payments.            |
| `property_owner` | Property Owner | 25        | 🟠 Orange `#f97316` | Owns property but not actively transacting. Investment tracking, valuation.  |
| `seller`         | Seller         | 20        | 🔵 Blue `#3b82f6`   | Lists properties for sale, tracks viewings, manages offers, signs contracts. |
| `tenant`         | Tenant         | 10        | 🟣 Violet `#8b5cf6` | Views lease, pays rent, submits maintenance, downloads Ejari.                |
| `buyer`          | Buyer          | 10        | 🔵 Blue `#3b82f6`   | Searches properties, saves favourites, tracks offers, schedules viewings.    |

**Post-login:**

- `landlord` → `/portal/landlord`
- `tenant` → `/portal/tenant`
- `buyer` → `/portal/buyer`
- `seller` → `/portal/seller`
- `property_owner` → `/portal/owner`

---

## 🔑 Permission Catalogue

### New Permissions (added in v2.0)

| Permission Key           | Granted To                                     | Description                         |
| ------------------------ | ---------------------------------------------- | ----------------------------------- |
| `submit_maintenance`     | `tenant`                                       | Submit maintenance requests         |
| `pay_rent_online`        | `tenant`                                       | Make rent payments through portal   |
| `view_own_lease`         | `tenant`, `landlord`, `property_owner`         | View their specific lease document  |
| `manage_maintenance`     | `landlord`, `property_owner`                   | Manage/approve maintenance requests |
| `track_offers`           | `buyer`, `seller`                              | Track offer status                  |
| `schedule_viewings`      | `buyer`, `seller`                              | Book property viewings              |
| `upload_documents`       | All agents, all customers                      | Upload KYC/contract documents       |
| `manage_hr`              | `hr_staff`                                     | Employee records, payroll data      |
| `manage_payroll`         | `accounts_staff`, `hr_staff`                   | Payroll processing                  |
| `view_commission`        | All agents                                     | View own commission                 |
| `approve_commission`     | `owner`, `admin`, `accounts_staff`             | Approve commission payments         |
| `manage_rera_compliance` | `owner`, `admin`, `manager`                    | RERA compliance module              |
| `view_audit_logs`        | `owner`, `admin`, `manager`                    | Full audit trail                    |
| `approve_role_request`   | `admin`, `owner`, `manager`                    | Approve role upgrade requests       |
| `manage_listings`        | All agents                                     | Create/edit/delete own listings     |
| `manage_all_listings`    | `owner`, `admin`, `manager`                    | Manage all listings globally        |
| `export_reports`         | `owner`, `admin`, `hr_staff`, `accounts_staff` | Export PDF/CSV reports              |

---

## 🔐 Staff Permission Grid (Rank 2)

| Permission             | Owner |   Admin   |     HR     |    Accounts     | Leasing Agent  |  Sales Agent   |
| ---------------------- | :---: | :-------: | :--------: | :-------------: | :------------: | :------------: |
| Full system access     |  ✅   |    ❌     |     ❌     |       ❌        |       ❌       |       ❌       |
| System settings        |  ✅   |    ❌     |     ❌     |       ❌        |       ❌       |       ❌       |
| User management        |  ✅   |    ✅     |     ❌     |       ❌        |       ❌       |       ❌       |
| Approve role requests  |  ✅   |    ✅     |     ❌     |       ❌        |       ❌       |       ❌       |
| Manage all listings    |  ✅   |    ✅     |     ❌     |       ❌        |       ❌       |       ❌       |
| Manage own listings    |  ✅   |    ✅     |     ❌     |       ❌        |       ✅       |       ✅       |
| View all leads         |  ✅   |    ✅     |     ❌     |       ❌        |    Own only    |    Own only    |
| Manage leads           |  ✅   |    ✅     |     ❌     |       ❌        |       ✅       |       ✅       |
| View all contracts     |  ✅   |    ✅     |     ❌     |       ❌        |    Own only    |    Own only    |
| Create contracts       |  ✅   |    ✅     |     ❌     |       ❌        |  ✅ (tenancy)  |   ✅ (sale)    |
| View all payments      |  ✅   |    ✅     |     ❌     |       ✅        |    Own only    |    Own only    |
| Process payments       |  ✅   |    ❌     |     ❌     |       ✅        |       ❌       |       ✅       |
| Manage HR/employees    |  ✅   | View only |     ✅     |       ❌        |       ❌       |       ❌       |
| Manage payroll         |  ✅   |    ❌     |     ✅     |       ✅        |       ❌       |       ❌       |
| View commission        |  ✅   |    ✅     |     ❌     |       ✅        |    Own only    |    Own only    |
| Approve commission     |  ✅   |    ✅     |     ❌     |       ✅        |       ❌       |       ❌       |
| View all reports       |  ✅   |    ✅     | HR reports | Finance reports |    Own only    |    Own only    |
| Export reports         |  ✅   |    ✅     |  HR only   |  Finance only   |       ❌       |       ❌       |
| RERA compliance        |  ✅   |    ✅     |     ❌     |       ❌        |   Upload own   |   Upload own   |
| Manage RERA compliance |  ✅   |    ✅     |     ❌     |       ❌        |       ❌       |       ❌       |
| WhatsApp Business      |  ✅   |    ✅     |     ❌     |       ❌        | View/reply own | View/reply own |
| Chatbot management     |  ✅   |    ✅     |     ❌     |       ❌        |       ❌       |       ❌       |
| Audit logs             |  ✅   |    ✅     |     ❌     |       ❌        |       ❌       |       ❌       |
| Approve role requests  |  ✅   |    ✅     |     ❌     |       ❌        |       ❌       |       ❌       |

---

## 🌐 Customer Portal Permission Grid (Rank 3)

| Permission           | Landlord | Tenant | Buyer |  Seller  | Property Owner |
| -------------------- | :------: | :----: | :---: | :------: | :------------: |
| Browse all listings  |    ✅    |   ✅   |  ✅   |    ✅    |       ✅       |
| Save favourites      |    ✅    |   ✅   |  ✅   |    ✅    |       ✅       |
| Create/list property |    ✅    |   ❌   |  ❌   |    ✅    |       ✅       |
| View own lease       |    ✅    |   ✅   |  ❌   |    ❌    |       ✅       |
| Submit maintenance   |    ❌    |   ✅   |  ❌   |    ❌    |       ❌       |
| Manage maintenance   |    ✅    |   ❌   |  ❌   |    ❌    |       ✅       |
| Pay rent online      |    ❌    |   ✅   |  ❌   |    ❌    |       ❌       |
| Track tenants        |    ✅    |   ❌   |  ❌   |    ❌    |       ✅       |
| Track offers         |    ❌    |   ❌   |  ✅   |    ✅    |       ❌       |
| Schedule viewings    |    ❌    |   ❌   |  ✅   |    ✅    |       ❌       |
| View own payments    |    ✅    |   ✅   |  ✅   |    ✅    |       ✅       |
| Sign contracts       |    ✅    |   ✅   |  ✅   |    ✅    |       ✅       |
| Upload documents     |    ✅    |   ✅   |  ✅   |    ✅    |       ✅       |
| Property analytics   | ✅ (own) |   ❌   |  ❌   | ✅ (own) |    ✅ (own)    |

---

## 🧭 Post-Login Route Resolver

Single function `getPostLoginRoute(role)` in `src/utils/routing.ts`:

```
No role / null           → /select-role
Rank 1 (user)            → /app/home
Rank 2 staff:
  owner / admin /manager → /crm/dashboard
  leasing_agent          → /crm/leasing
  sales_agent            → /crm/sales
  hr_staff               → /crm/hr
  accounts_staff/finance → /crm/accounts
  others                 → /crm/dashboard
Rank 3 customers:
  landlord               → /portal/landlord
  tenant                 → /portal/tenant
  buyer                  → /portal/buyer
  seller                 → /portal/seller
  property_owner         → /portal/owner
  others                 → /portal/dashboard
```

---

## 🔄 Role Alias Map

Legacy or UI role strings that are normalized to canonical backend roles:

| Input String            | Resolves To             | Notes                             |
| ----------------------- | ----------------------- | --------------------------------- |
| `lion`                  | `owner`                 | **Deprecated** — legacy alias     |
| `managing_director`     | `owner`                 | Legacy alias                      |
| `super_admin`           | `admin`                 | Legacy alias                      |
| `leasing_agent`         | `leasing_agent`         | Canonical (underscore)            |
| `leasing-agent`         | `leasing-agent`         | Legacy (hyphen) — keep for compat |
| `sales_agent`           | `sales_agent`           | Canonical (underscore)            |
| `secondary-sales-agent` | `secondary-sales-agent` | Legacy (hyphen)                   |
| `branch_manager`        | `manager`               | Legacy alias                      |
| `finance_officer`       | `finance`               | Legacy alias                      |
| `developer`             | `seller`                | Client-type alias                 |
| `investor`              | `buyer`                 | Client-type alias                 |
| `hr_staff`              | `hr_staff`              | Canonical                         |
| `accounts_staff`        | `accounts_staff`        | Canonical                         |
| `property_owner`        | `property_owner`        | Canonical                         |
| `user`                  | `user`                  | Canonical                         |

---

## 🐛 Bugs Fixed in v2.0

### Auth/Routing Bugs

- ✅ **Removed double-hop redirect:** Google OAuth and email login now both use `getPostLoginRoute()` as single resolver
- ✅ **Stripped localStorage role from permission decisions:** `localStorage userRole` is only for UI tab memory, never for access control
- ✅ **`lion` role normalized on JWT issue** — not on every request (prevents leaking into requireRole checks)
- 🔲 **Redirect-loop guard** — max redirect counter (to implement in App.tsx Phase 4)

### Data Integrity Bugs

- ✅ **New role IDs with underscore canonical forms** (`leasing_agent`, `sales_agent`, `hr_staff`, `accounts_staff`, `property_owner`)
- ✅ **`leasing-agent` (hyphen) kept as backward-compat alias** — both forms now work
- 🔲 **User.role enum in Prisma** — deferred (MongoDB Prisma limitation; validated at application layer)
- 🔲 **Seed data `managing_director` string** — should be unified to `owner` in seed files

### Permission System Bugs

- ✅ **`hr_staff` and `accounts_staff` now have full `ROLE_PERMISSIONS` entries** — no more silent 403s
- ✅ **`property_owner` now has permissions** — landlord-level + investment tracking
- ✅ **`user` (Rank 1) now has minimal permissions** — no CRM access
- ✅ **`ROLE_ALIAS_MAP` unified** — `super_admin → admin` is the only path, removing dual code paths in App.tsx

### UI/UX Bugs

- 🔲 **Role selection form** — should only show staff roles after admin approval flow, not as public selection
- 🔲 **"Pending role approval" state** — UI card needed after requesting a role upgrade
- 🔲 **`BiometricLoginButton`** — should read role from Redux auth state, not localStorage

---

## 🏗️ File Structure

```
src/
  utils/
    permissions.ts          ← canonical role/rank/permission map (updated v2.0)
    routing.ts              ← getPostLoginRoute() single resolver (new)
    roleHelpers.ts          ← getRank, isStaff, isCustomer, getRoleDisplayName, etc. (new)
  components/
    guards/
      index.ts              ← barrel exports (new)
      RankGuard.tsx         ← renders children only if user rank >= n (new)
      RoleGuard.tsx         ← renders children only if user has role (new)
      PermissionGuard.tsx   ← renders children only if user has permission (updated)
server/
  middleware/
    rbac.ts                 ← ROLE_RANK, requireMinRank, all new roles + permissions (updated v2.0)
business_docs/
  02_user_roles/
    ROLE_MATRIX.md          ← this file (new)
```

---

## 📋 How to Add a New Role

1. **Define the role** in `src/utils/permissions.ts`:
   - Add to `ROLES` constant
   - Add to `ROLE_HIERARCHY` with appropriate level
   - Add to `ROLE_PERMISSIONS` with all permissions
   - Add to `ROLE_ALIAS_MAP` (self-referential identity mapping)
   - Add to appropriate `RANK_N_ROLES` array

2. **Mirror to backend** in `server/middleware/rbac.ts`:
   - Add to `ROLE_ALIAS_MAP`
   - Add to `ROLE_HIERARCHY`
   - Add to `ROLE_RANK`
   - Add to `ROLE_PERMISSIONS`

3. **Update routing** in `src/utils/routing.ts`:
   - Add case in `getPostLoginRoute()` switch statement

4. **Update tests** in `server/middleware/rbac.test.ts`:
   - Add role to `expectedRoles` array in the completeness test

5. **Create business doc**:
   - Add row to the role table in this file (`ROLE_MATRIX.md`)
   - Document which portal/dashboard the user lands on

6. **Prisma schema** (when database supports it):
   - Add to `UserRole` enum
   - Write migration from old string values

---

## ✅ Approval Status

| Question                                 | Decision                      |
| ---------------------------------------- | ----------------------------- |
| 3-rank model                             | ✅ Confirmed                  |
| `property_owner` as separate Rank 3 role | ✅ Confirmed                  |
| HR/Accounts cannot see customer portal   | ✅ Confirmed                  |
| Buyers/sellers/tenants can self-register | ⏳ Pending confirmation       |
| MD distinctive visual theme/badge        | ✅ Confirmed — Gold `#C9A84C` |

---

_This document is the canonical reference for the White Caves role system. All changes to roles must be reflected here first._
