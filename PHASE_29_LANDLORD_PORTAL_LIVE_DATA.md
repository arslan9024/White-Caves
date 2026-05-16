# Phase 29: Landlord Portal — Live API Wiring ✅

**Commit:** `4f4af7d0`
**Branch:** `development`
**Date:** May 2026
**Status:** COMPLETE — 0 TypeScript errors, 0 ESLint warnings, build ✅ (11.65s)

---

## Overview

All 6 Landlord Portal tab components (plus the Home KPI dashboard) have been fully wired to live backend APIs. **Zero mock data remains in the `/landlord-portal` route.** This was the final blocker before the client demo (~May 17, 2026).

---

## Files Changed (7 total)

### Backend

| File                           | Change                                                                                                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/routes/maintenance.ts` | Added landlord role scoping: `where.property = { userId }` (Prisma nested filter). Previously only `owner`/`admin`/`manager` saw all requests; landlord users now see only requests for their own properties. |

### Frontend — `src/components/portal/landlord/`

| File                         | Mock Removed                                                             | Live API Added                                                                             |
| ---------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `LandlordPortalHome.tsx`     | 4 hardcoded metric values                                                | `Promise.all([leases, properties, maintenance])` — computes live KPIs                      |
| `LandlordPropertiesTab.tsx`  | `mockProperties` array                                                   | `GET /api/properties` + `GET /api/leases?role=landlord&status=active` merged by propertyId |
| `LandlordTenantsTab.tsx`     | `mockTenants` useMemo + `TENANT_PAYMENTS`/`TENANT_MAINTENANCE` constants | `GET /api/leases?role=landlord` — tenant derived from `lease.tenant`                       |
| `LandlordPaymentsTab.tsx`    | mock payments array                                                      | `GET /api/leases?role=landlord` + PDC modal: `GET /api/leases/:id/pdc`                     |
| `LandlordMaintenanceTab.tsx` | 5 mock requests                                                          | `GET /api/maintenance?pageSize=100` (now scoped by backend)                                |
| `LandlordDocumentsTab.tsx`   | mock document entries                                                    | `GET /api/leases?role=landlord` → `leasesToDocuments()` mapping                            |

---

## API Endpoints Per Tab

| Tab               | Endpoint(s)                                                                                                       | Notes                                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Home KPIs**     | `GET /api/leases?role=landlord&pageSize=100` `GET /api/properties?pageSize=100` `GET /api/maintenance?pageSize=1` | Parallel `Promise.all()`                                                                              |
| **My Properties** | `GET /api/properties?pageSize=100` `GET /api/leases?role=landlord&status=active&pageSize=100`                     | Merged: shows tenant name + occupied/vacant                                                           |
| **My Tenants**    | `GET /api/leases?role=landlord&pageSize=100`                                                                      | PDC on demand: `GET /api/leases/:id/pdc` Maintenance on demand: `GET /api/maintenance?propertyId=:id` |
| **Payments**      | `GET /api/leases?role=landlord&pageSize=100`                                                                      | PDC modal: `GET /api/leases/:id/pdc` Status derived by `derivePaymentStatus(lease)`                   |
| **Maintenance**   | `GET /api/maintenance?pageSize=100`                                                                               | Backend scopes by `property.userId = landlord.userId`                                                 |
| **Documents**     | `GET /api/leases?role=landlord&pageSize=100`                                                                      | `leasesToDocuments()`: 1 tenancy + 1 ejari (if `ejariNumber` set) per lease                           |

---

## Auth Pattern

All API calls use `authFetch` utility (`src/utils/authFetch.ts`):

```ts
authFetch('/api/leases?role=landlord&pageSize=100')
  .then(r => r.json())
  .then(data => data.data ?? []);
```

- Reads JWT from `localStorage` via `safeStorage.get('token')`
- Auto-adds `Authorization: Bearer <token>` header
- Handles 401/403 auto-logout

---

## KPIs Computed in LandlordPortalHome

```ts
propertiesCount = properties.length;
activeTenants = leases.filter(l => ['active', 'expiring_soon'].includes(l.status)).length;
overdueRent = leases
  .filter(l => new Date(l.nextPaymentDue) < now && l.status === 'active')
  .reduce((sum, l) => sum + l.monthlyRent, 0);
openMaintenance = maintenance.pagination?.total ?? 0;
```

---

## Backend Maintenance Route Change

```ts
// server/routes/maintenance.ts (GET handler)
if (userRole === 'owner' || userRole === 'admin' || userRole === 'manager') {
  // no extra filter – sees all
} else if (userRole === 'landlord') {
  where.property = { userId }; // ← NEW: Prisma nested filter
} else {
  where.requesterId = userId; // tenants/agents see own requests
}
```

---

## ESLint Notes

The `react-hooks/set-state-in-effect` rule (configured as `'warn'` with `--max-warnings 0`) disallows calling `setState(true)` synchronously at the top of `useEffect` bodies.

**Fix applied across all tabs:**

- Remove `setLoading(true); setError(null);` from effect start
- Initialize as `useState(true)` and `useState(null)` — only set to `false`/`null` in `.then()` / `.catch()` callbacks

**Exception — `LandlordTenantsTab` TenantDetailModal:**
The modal has lazy-fetch effects for PDC and maintenance that genuinely need to show a spinner on tab-switch. These use `// eslint-disable-next-line react-hooks/set-state-in-effect` — a legitimate, targeted disable for the lazy-load pattern where loading state reset is required on each tab switch.

---

## Demo Seed Checklist (Optional but Recommended)

To have data ready for the client demo:

- [ ] Create a landlord user account in the system
- [ ] Create 3 properties (linked to that user's `userId`)
- [ ] Create 3 leases (with `landlordId` = landlord user ID, status = `active`)
- [ ] Add tenants to each lease with `name`, `email`, `phone`
- [ ] Add 2–3 maintenance requests for those properties
- [ ] Add Ejari numbers to leases (to show Ejari documents tab)
- [ ] Set `nextPaymentDue` dates: 1 past (overdue), 2 future (pending)

---

## Rollback

If needed, revert to the previous state:

```bash
git revert 4f4af7d0
```

The previous commit (`2b8e0617`) had all tabs using mock data but build-passing.

---

## Sign-off

| Checklist                   | Status        |
| --------------------------- | ------------- |
| 0 TypeScript errors         | ✅            |
| 0 ESLint warnings           | ✅            |
| Build passing (11.65s)      | ✅            |
| All 6 tabs use live APIs    | ✅            |
| Mock data fully removed     | ✅            |
| Backend maintenance scoping | ✅            |
| Commit on `development`     | ✅ `4f4af7d0` |
| Pushed to remote            | ✅            |
| Phase 29 summary created    | ✅            |

**Phase 29: COMPLETE. Landlord Portal is demo-ready.**
