# Phase 2 — Landlord & Tenant Self-Service Portals

> **Priority**: #2 — High  
> **Goal**: Separate, simple portals for landlords and tenants to log in and self-serve  
> **Approach**: Read-only views of their own data — no CRM editing required  
> **Status**: 🔲 Not Started

---

## Why This Is Priority #2

Landlords and tenants need immediate value from day one — they want to see their own properties,
lease status, payment schedule, and submit maintenance requests without calling the office.
These portals are simpler to build than the full CRM (read-only, limited scope) and create
immediate client-facing value that can be demoed to prospects.

---

## Super User for This Phase

The primary super user who oversees these portals:

| Detail | Value |
|--------|-------|
| Email | `arslanmalikgoraha@gmail.com` |
| Role | `managing_director` |
| CRM Tabs | Overview, Properties, Agents, Leads, Contracts, Analytics, Users, Settings (8 tabs) |
| Access | Full executive access — can view all landlord and tenant accounts |

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
- [ ] Landlord can register at `/signup` with category "Landlord" → role set to `landlord`
- [ ] Redirect after login → `/landlord-portal` (dedicated portal page, not the CRM dashboard)
- [ ] If a user with role `landlord` navigates to `/dashboard`, redirect them to `/landlord-portal`
- [ ] Protected route: `/landlord-portal` requires `landlord` role

### 2.2 — Landlord Portal: My Properties
- [ ] List of properties owned by this landlord (filtered by `ownerId` = current user)
- [ ] Each property card: title, address, type, status (vacant / occupied), monthly rent, tenant name
- [ ] Click property → property detail view: lease start/end date, tenant contact info, deposit amount
- [ ] If no properties: empty state — "No properties registered yet. Contact your agent."
- [ ] No add/edit/delete controls (read-only)

### 2.3 — Landlord Portal: Tenants
- [ ] List of current and past tenants across all their properties
- [ ] Each tenant row: name, email, phone, property, lease dates, status (active / expired)
- [ ] Click tenant → tenant detail: payment history, maintenance requests logged by this tenant

### 2.4 — Landlord Portal: Rent Payments
- [ ] Payment schedule for all properties (monthly breakdown)
- [ ] Each payment row: property name, due date, amount, paid date, status (paid / pending / overdue)
- [ ] Summary card at top: total monthly income, total collected this month, outstanding balance
- [ ] Filter by property or date range
- [ ] Note: payments are from seed data for Phase 2 — live Stripe payments are deferred to Phase 5

### 2.5 — Landlord Portal: Maintenance Requests
- [ ] List of maintenance requests submitted by tenants for their properties
- [ ] Each request: property, title, submitted date, priority (urgent / high / normal), status (open / in progress / closed)
- [ ] Landlord can add a note/comment on a request
- [ ] Cannot close requests (only the managing agent can close)

### 2.6 — Landlord Portal: Documents
- [ ] List of documents: tenancy agreements, Ejari certificates, NOC letters
- [ ] Each document: name, type, date, "Download" link (placeholder PDF URL for Phase 2)
- [ ] No upload ability for Phase 2

---

## Tenant Portal

### What Tenants See After Login

A tenant logs in and sees **only their own lease, payment schedule, and maintenance requests**.

### 2.7 — Tenant Authentication
- [ ] Tenant can register at `/signup` with category "Tenant" → role set to `tenant`
- [ ] Redirect after login → `/tenant-portal`
- [ ] If a user with role `tenant` navigates to `/dashboard`, redirect to `/tenant-portal`
- [ ] Protected route: `/tenant-portal` requires `tenant` role

### 2.8 — Tenant Portal: My Lease
- [ ] Lease summary card: property address, start date, end date, monthly rent, deposit paid
- [ ] Days remaining in lease (countdown)
- [ ] Lease status badge: Active / Expiring Soon (< 60 days) / Expired
- [ ] "Download Tenancy Agreement" button (placeholder PDF for Phase 2)
- [ ] "Download Ejari Certificate" button (placeholder PDF for Phase 2)
- [ ] If no active lease: "No active lease found. Contact your agent."

### 2.9 — Tenant Portal: Rent Payments
- [ ] Monthly payment schedule: due date, amount, status (paid / pending / overdue)
- [ ] Summary: next payment due date and amount (prominent card at top)
- [ ] Payment history: list of all past payments with dates and amounts
- [ ] Late fee shown if applicable
- [ ] "Pay Now" button → Phase 5 (Stripe) — disabled with tooltip for Phase 2

### 2.10 — Tenant Portal: Submit Maintenance Request
- [ ] "New Request" button → form: title, description, priority (urgent/high/normal/low), optional photo URL
- [ ] Submit → creates a `MaintenanceRequest` record (stub model for Phase 2 — or use Activity model as a workaround)
- [ ] List of submitted requests: title, submitted date, priority, status
- [ ] Cannot edit or delete submitted requests
- [ ] Status updates shown when agent updates the request

### 2.11 — Tenant Portal: My Documents
- [ ] Same as Landlord documents section but filtered to this tenant's documents
- [ ] Download links for their tenancy agreement and Ejari certificate

---

## Shared Portal Features

### 2.12 — Portal Navigation & Layout
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
- [ ] Add `landlord@whitecaves.ae` with role `landlord` to seed script
- [ ] Add `tenant@whitecaves.ae` with role `tenant` to seed script
- [ ] Associate seeded `Tenant` record to `tenant@whitecaves.ae` user
- [ ] Add 3 sample `RentPayment` records (Note: requires Phase 5 Prisma models — use Activity workaround for Phase 2 if needed)
- [ ] Add 2 sample maintenance request Activity records

---

## Routes Required

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/landlord-portal` | `LandlordPortalPage.tsx` | `landlord` role |
| `/landlord-portal/properties` | `LandlordPropertiesTab.tsx` | `landlord` role |
| `/landlord-portal/tenants` | `LandlordTenantsTab.tsx` | `landlord` role |
| `/landlord-portal/payments` | `LandlordPaymentsTab.tsx` | `landlord` role |
| `/landlord-portal/maintenance` | `LandlordMaintenanceTab.tsx` | `landlord` role |
| `/landlord-portal/documents` | `LandlordDocumentsTab.tsx` | `landlord` role |
| `/tenant-portal` | `TenantPortalPage.tsx` | `tenant` role |
| `/tenant-portal/lease` | `TenantLeaseTab.tsx` | `tenant` role |
| `/tenant-portal/payments` | `TenantPaymentsTab.tsx` | `tenant` role |
| `/tenant-portal/maintenance` | `TenantMaintenanceTab.tsx` | `tenant` role |
| `/tenant-portal/documents` | `TenantDocumentsTab.tsx` | `tenant` role |

---

## Definition of Done — Phase 2

- [ ] `arslanmalikgoraha@gmail.com` signs in → managing_director CRM dashboard (8 tabs) loads without error
- [ ] `landlord@whitecaves.ae` signs in → `/landlord-portal` loads with their properties, tenants, payments
- [ ] `tenant@whitecaves.ae` signs in → `/tenant-portal` loads with their lease, payments, maintenance
- [ ] If landlord navigates to `/dashboard` → redirect to `/landlord-portal`
- [ ] If tenant navigates to `/dashboard` → redirect to `/tenant-portal`
- [ ] Maintenance request form submits and appears in the list
- [ ] All portal pages are responsive at 375px
- [ ] No console errors on any portal page
- [ ] Seed script runs without errors: `npm run db:seed`
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npx vitest run`

---

## Next Phase After This

Once Phase 2 is complete, move to **[PHASE_3_CRM_SUPERUSER.md](./PHASE_3_CRM_SUPERUSER.md)** — Full CRM for `arslanmalikgoraha@gmail.com` (managing_director).
