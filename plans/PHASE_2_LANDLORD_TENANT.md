# Phase 2 — Landlord & Tenant Self-Service Portals

> **Priority**: #2 — High  
> **Goal**: Separate, simple portals for landlords and tenants to log in and self-serve  
> **Approach**: Read-only views of their own data — no CRM editing required  
> **Status**: 🟡 In Progress — UI MVP implemented for both portals; auth/data integration, seed accounts, mobile validation, and persistence still pending

---

## Why This Is Priority #2

Landlords and tenants need immediate value from day one — they want to see their own properties,
lease status, payment schedule, and submit maintenance requests without calling the office.
These portals are simpler to build than the full CRM (read-only, limited scope) and create
immediate client-facing value that can be demoed to prospects.

---

## Super User for This Phase

The primary super user who oversees these portals:

| Detail   | Value                                                                               |
| -------- | ----------------------------------------------------------------------------------- |
| Email    | `arslanmalikgoraha@gmail.com`                                                       |
| Role     | `managing_director`                                                                 |
| CRM Tabs | Overview, Properties, Agents, Leads, Contracts, Analytics, Users, Settings (8 tabs) |
| Access   | Full executive access — can view all landlord and tenant accounts                   |

> **No duplicate**: `owner@whitecaves.ae` is the seed/dummy data account only. The real super user
> is `arslanmalikgoraha@gmail.com` with role `managing_director`. Do not create a second
> `managing_director` account for the same email.

> **How to seed**: Run `npm run db:seed` — creates both accounts, 6 agents, and sample data.

---

## Landlord Portal

### What Landlords See After Login

A landlord logs in with their email/password and sees **only their own properties and tenants**.
No CRM data from other clients is visible.

### 2.1 — Landlord Authentication

- [x] Landlord can register at `/signup` with category "Landlord" → role set to `landlord`
- [x] Redirect after login → `/landlord-portal` (enforced via role-aware `/dashboard` redirect)
- [x] If a user with role `landlord` navigates to `/dashboard`, redirect them to `/landlord-portal`
- [x] Protected route: `/landlord-portal` requires `landlord` role

### 2.2 — Landlord Portal: My Properties

- [x] List of properties owned by this landlord (mock/read-only Phase 2 UI)
- [x] Each property card: title, address, type, status (vacant / occupied), monthly rent, tenant name
- [x] Click property → property detail view: lease start/end date, tenant contact info, deposit amount
- [x] If no properties: empty state — "No properties registered yet. Contact your agent."
- [x] No add/edit/delete controls (read-only)

### 2.3 — Landlord Portal: Tenants

- [x] List of current and past tenants across all their properties
- [x] Each tenant row: name, email, phone, property, lease dates, status (active / expired)
- [ ] Click tenant → tenant detail: payment history, maintenance requests logged by this tenant

### 2.4 — Landlord Portal: Rent Payments

- [x] Payment schedule for all properties (monthly breakdown)
- [x] Each payment row: property name, due date, amount, paid date, status (paid / pending / overdue)
- [x] Summary card at top: total monthly income, total collected this month, outstanding balance
- [ ] Filter by property or date range _(property search exists; date-range filter still pending)_
- [ ] Note: payments are from seed data for Phase 2 — live Stripe payments are deferred to Phase 5

### 2.5 — Landlord Portal: Maintenance Requests

- [x] List of maintenance requests submitted by tenants for their properties
- [x] Each request: property, title, submitted date, priority (urgent / high / normal), status (open / in progress / closed)
- [x] Landlord can add a note/comment on a request
- [x] Cannot close requests (only the managing agent can close)

### 2.6 — Landlord Portal: Documents

- [x] List of documents: tenancy agreements, Ejari certificates, NOC letters
- [x] Each document: name, type, date, "Download" link (placeholder PDF URL for Phase 2)
- [x] No upload ability for Phase 2

---

## Tenant Portal

### What Tenants See After Login

A tenant logs in and sees **only their own lease, payment schedule, and maintenance requests**.

### 2.7 — Tenant Authentication

- [x] Tenant can register at `/signup` with category "Tenant" → role set to `tenant`
- [x] Redirect after login → `/tenant-portal` (enforced via role-aware `/dashboard` redirect)
- [x] If a user with role `tenant` navigates to `/dashboard`, redirect to `/tenant-portal`
- [x] Protected route: `/tenant-portal` requires `tenant` role

### 2.8 — Tenant Portal: My Lease

- [x] Lease summary card: property address, start date, end date, monthly rent, deposit paid
- [x] Days remaining in lease (countdown)
- [x] Lease status badge: Active / Expiring Soon (< 60 days) / Expired
- [x] "Download Tenancy Agreement" button (placeholder PDF for Phase 2)
- [x] "Download Ejari Certificate" button (placeholder PDF for Phase 2)
- [ ] If no active lease: "No active lease found. Contact your agent."

### 2.9 — Tenant Portal: Rent Payments

- [x] Monthly payment schedule / history list with status (paid / pending / overdue)
- [ ] Summary: next payment due date and amount (prominent card at top)
- [x] Payment history: list of all past payments with dates and amounts
- [ ] Late fee shown if applicable
- [ ] "Pay Now" button → Phase 5 (Stripe) — disabled with tooltip for Phase 2

### 2.10 — Tenant Portal: Submit Maintenance Request

- [x] "New Request" form UI: title, description _(priority/photo URL still pending)_
- [ ] Submit → creates a `MaintenanceRequest` record (stub model for Phase 2 — or use Activity model as a workaround)
- [x] List of submitted requests: title, submitted date, priority, status
- [x] Cannot edit or delete submitted requests
- [ ] Status updates shown when agent updates the request

### 2.11 — Tenant Portal: My Documents

- [x] Same as Landlord documents section but filtered to this tenant's documents
- [x] Download links for their tenancy agreement and Ejari certificate

---

## Shared Portal Features

### 2.12 — Portal Navigation & Layout

- [x] Portal-specific page headers and tabbed layouts implemented
- [ ] Separate top navbar for portals (not the CRM sidebar layout)
- [ ] Logo + portal name ("Landlord Portal" / "Tenant Portal") + user avatar + logout
- [ ] Mobile-first layout (portals are most often used on mobile)
- [ ] Responsive at 375px, 768px, 1024px

### 2.13 — Portal Home / Dashboard

- [ ] Landing page after login shows a summary of the most important info:
  - **Landlord**: total properties, active tenants, rent due this month, open maintenance requests
  - **Tenant**: next payment due, days left on lease, open maintenance requests
- [ ] Quick links to each section

### 2.14 — Profile Settings

- [ ] User can update: name, phone number, profile photo URL
- [ ] Change password form
- [ ] Cannot change email or role

---

## Seed Data for Phase 2 Demo

The seed already creates a `Tenant` model record. For the portal demo, we need:

```bash
# Seed creates:
# - arslanmalikgoraha@gmail.com (managing_director — primary super user)
# - owner@whitecaves.ae (owner — seed/dummy account)
# - 6 agents (clara, mary, sophia, theodora, daisy, laila)
# + we need to add:
# - At least 1 landlord account (landlord@whitecaves.ae / password123)
# - At least 1 tenant account (tenant@whitecaves.ae / password123)
# - Sample lease + payment schedule + maintenance requests
```

**Tasks**:

- [x] Add `landlord@whitecaves.ae` with role `landlord` to seed script
- [x] Add `tenant@whitecaves.ae` with role `tenant` to seed script
- [x] Associate seeded `Tenant` record to `tenant@whitecaves.ae` user _(email-aligned in Phase 2 data model)_
- [x] Add 3 sample `RentPayment` records _(Activity workaround used for Phase 2)_
- [x] Add 2 sample maintenance request Activity records

---

## Routes Required

| Route                          | Component                    | Auth Required   |
| ------------------------------ | ---------------------------- | --------------- |
| `/landlord-portal`             | `LandlordPortalPage.tsx`     | `landlord` role |
| `/landlord-portal/properties`  | `LandlordPropertiesTab.tsx`  | `landlord` role |
| `/landlord-portal/tenants`     | `LandlordTenantsTab.tsx`     | `landlord` role |
| `/landlord-portal/payments`    | `LandlordPaymentsTab.tsx`    | `landlord` role |
| `/landlord-portal/maintenance` | `LandlordMaintenanceTab.tsx` | `landlord` role |
| `/landlord-portal/documents`   | `LandlordDocumentsTab.tsx`   | `landlord` role |
| `/tenant-portal`               | `TenantPortalPage.tsx`       | `tenant` role   |
| `/tenant-portal/lease`         | `TenantLeaseTab.tsx`         | `tenant` role   |
| `/tenant-portal/payments`      | `TenantPaymentsTab.tsx`      | `tenant` role   |
| `/tenant-portal/maintenance`   | `TenantMaintenanceTab.tsx`   | `tenant` role   |
| `/tenant-portal/documents`     | `TenantDocumentsTab.tsx`     | `tenant` role   |

---

## Definition of Done — Phase 2

- [ ] `arslanmalikgoraha@gmail.com` signs in → managing_director CRM dashboard (8 tabs) loads without error
- [ ] `landlord@whitecaves.ae` signs in → `/landlord-portal` loads with their properties, tenants, payments
- [ ] `tenant@whitecaves.ae` signs in → `/tenant-portal` loads with their lease, payments, maintenance
- [x] If landlord navigates to `/dashboard` → redirect to `/landlord-portal`
- [x] If tenant navigates to `/dashboard` → redirect to `/tenant-portal`
- [ ] Maintenance request form submits and appears in the list
- [ ] All portal pages are responsive at 375px
- [ ] No console errors on any portal page
- [x] Seed script runs without errors: `npm run db:seed`
- [x] Build passes: `npm run build`
- [x] Tests pass: focused portal Vitest suites passing (latest 139 portal tests)

---

## April 29, 2026 Progress Snapshot

### Completed in Current UI MVP

- Landlord portal page + 5 landlord tabs implemented and tested
- Tenant portal page + 4 tenant tabs implemented and tested
- Protected routes for `/landlord-portal` and `/tenant-portal`
- Redirect aliases for `/landlord/dashboard` and `/tenant/dashboard`
- Generic `/dashboard` now auto-redirects landlord/tenant users to their dedicated portals
- Seeded Phase 2 demo accounts: landlord@whitecaves.ae + tenant@whitecaves.ae (password123)
- Seeded Activity-based payment + maintenance demo timeline for portal views
- Focused regression coverage for landlord + tenant portal areas

### Still Pending Before Phase 2 Can Be Marked Complete

- Tenant maintenance request persistence (currently UI/mock only)
- Landlord tenant-detail drilldown for payment history + maintenance history
- Tenant payments: next-payment card, late-fee display, disabled "Pay Now"
- Responsive/mobile verification at 375px / 768px / 1024px
- Portal-specific navbar/profile settings pages

---

## Next Phase After This

Once Phase 2 is complete, move to **[PHASE_3_CRM_SUPERUSER.md](./PHASE_3_CRM_SUPERUSER.md)** — Full CRM for `arslanmalikgoraha@gmail.com` (managing_director).
