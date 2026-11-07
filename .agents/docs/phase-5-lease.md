# Phase 5 — Lease & Tenancy Full Module

> **Priority**: #5 (after Phase 4)
> **Goal**: Complete tenancy lifecycle — from lease creation through Ejari, rent scheduling, and payment tracking
> **Prerequisite**: Phase 4 (WhatsApp integration) for payment reminders via WhatsApp
> **Status**: 🔲 Not Started — `Lease` and `Maintenance` models exist in schema; endpoints and rent schedules not yet built
> **Detailed context**: See [`PHASE_3_AND_BEYOND.md`](./PHASE_3_AND_BEYOND.md#phase-5--lease--tenancy-full-module-after-phase-4)

---

## Prisma Schema Status

| Model         | Status              | Notes                                          |
| ------------- | ------------------- | ---------------------------------------------- |
| `Lease`       | ✅ Exists in schema | Check fields against requirements below        |
| `Maintenance` | ✅ Exists in schema | Used for maintenance requests                  |
| `RentPayment` | ❌ Does not exist   | Must be added (see PHASE_3_AND_BEYOND.md §5.1) |
| `Tenant`      | ✅ Exists in schema | User with role `tenant`                        |

---

## What Already Exists ✅

| Item                        | Location                                    | Status             |
| --------------------------- | ------------------------------------------- | ------------------ |
| `Lease` Prisma model        | `prisma/schema.prisma`                      | ✅ Exists          |
| `Maintenance` Prisma model  | `prisma/schema.prisma`                      | ✅ Exists          |
| `Tenant` Prisma model       | `prisma/schema.prisma`                      | ✅ Exists          |
| Daisy Leasing CRM           | `src/components/crm/DaisyLeasingCRM_NEW/`   | ✅ UI exists       |
| Tenant portal (read-only)   | `src/pages/tenant/TenantPortalPage.tsx`     | ✅ Phase 2 UI done |
| Landlord portal (read-only) | `src/pages/landlord/LandlordPortalPage.tsx` | ✅ Phase 2 UI done |

---

## What Needs To Be Done 🚧

### 5.1 — RentPayment Prisma Model

- [ ] Add `RentPayment` model to `prisma/schema.prisma` (see `PHASE_3_AND_BEYOND.md` §5.1)
- [ ] Run `npx prisma generate` after schema update
- [ ] Add Prisma `@@index` on `[leaseId, dueDate]` and `[status]`

---

### 5.2 — Lease API (`/api/leases`)

- [ ] `GET /api/leases` — list leases (filter by status, tenantId, propertyId)
- [ ] `GET /api/leases/:id` — lease detail with related payments and maintenance
- [ ] `POST /api/leases` — create new lease (managing_director only)
- [ ] `PATCH /api/leases/:id` — update lease fields (status transitions, Ejari fields)
- [ ] `DELETE /api/leases/:id` — soft-delete (set status = "terminated")
- [ ] Status workflow enforcement: `draft → signed → active → expired/terminated`
- [ ] Ejari validation: cannot set status `active` without `ejariContractNumber`

**Auth**: `managing_director`, `admin`, `leasing_agent`

---

### 5.3 — Rent Schedule Auto-Generation

- [ ] On lease activation (`status → active`): auto-create monthly `RentPayment` records for the full lease term
- [ ] Each record: `dueDate` = 1st of each month, `amount` = `lease.monthlyRent`, `status = "pending"`
- [ ] Expose via: `GET /api/leases/:id/payments` — return all rent payment records for a lease

---

### 5.4 — Payment Status Updates

- [ ] `PATCH /api/rent-payments/:id` — mark as paid (set `paidDate`, `status = "paid"`)
- [ ] Auto-detect overdue: if `dueDate < today` and `status = "pending"`, set `status = "overdue"` and add late fee
- [ ] Late fee rule: configurable via Settings (default: AED 500 flat or 2% of monthly rent — whichever is higher)
- [ ] Phase 5 only: mark paid manually; Stripe payment gateway deferred (Stripe integration may overlap)

---

### 5.5 — Maintenance Request API (`/api/maintenance`)

- [ ] `GET /api/maintenance` — list maintenance requests (filter by status, propertyId, tenantId)
- [ ] `POST /api/maintenance` — submit new request (tenant role)
- [ ] `PATCH /api/maintenance/:id` — update status (agent/admin only: open → in_progress → closed)
- [ ] `PATCH /api/maintenance/:id/note` — add note/comment (landlord or agent)
- [ ] Tenant portal wire-up: replace mock data in `TenantMaintenanceTab` with real API calls

---

### 5.6 — Stripe Payment Gateway (Optional for Phase 5)

- [ ] Install Stripe SDK: `npm install stripe @stripe/stripe-js`
- [ ] `POST /api/payments/create-session` — create Stripe checkout session for a `RentPayment` ID
- [ ] Stripe webhook: `POST /api/payments/webhook` — on `checkout.session.completed`, mark `RentPayment` as paid
- [ ] Tenant portal "Pay Now" button: calls create-session API, redirects to Stripe Checkout
- [ ] If Stripe is not in scope for Phase 5, keep "Pay Now" button disabled with tooltip "Online payments coming soon"

---

### 5.7 — Ejari & DLD Compliance

- [ ] Lease form fields: `ejariContractNumber`, `ejariRegistrationDate`, `ejariExpiryDate`
- [ ] Display in Daisy Leasing CRM: Ejari status badge (Not Filed / Filed / Expired)
- [ ] 30-day expiry warning: query leases where `ejariExpiryDate < 30 days from now` → surface in Laila compliance dashboard
- [ ] DLD fee calculator: 4% of annual rent for sales; 5% + admin fees for lease registrations

---

### 5.8 — Tenant Portal Integration (Real Data)

Replace the Phase 2 mock data with real API calls:

- [ ] `TenantLeaseTab` → fetch from `GET /api/leases?tenantId=:currentUserId`
- [ ] `TenantPaymentHistoryTab` → fetch from `GET /api/leases/:leaseId/payments`
- [ ] `TenantMaintenanceTab` → fetch from `GET /api/maintenance?tenantId=:currentUserId`, POST on submit
- [ ] Loading states + error states on all API calls
- [ ] If tenant has no active lease: "No active lease found. Contact your agent."

---

### 5.9 — Landlord Portal Integration (Real Data)

Replace Phase 2 mock data:

- [ ] `LandlordPaymentsTab` → fetch from `/api/leases?landlordId=:currentUserId` + payments per lease
- [ ] `LandlordMaintenanceTab` → fetch from `/api/maintenance?landlordPropertyId=:currentUserId`
- [ ] Landlord tenant-detail drilldown → `/api/maintenance?tenantId=X` + `/api/leases/:leaseId/payments` filtered by tenant

---

### 5.10 — WhatsApp Rent Reminders (Requires Phase 4)

- [ ] Install `node-cron`: `npm install node-cron @types/node-cron`
- [ ] Cron job: daily at 08:00 UAE time (UTC+4) — query `RentPayment` where `dueDate = today + 5 days` and `status = "pending"`
- [ ] For each: call `WhatsAppBotService.sendTemplateMessage(tenant.phone, 'rent_reminder', { amount, dueDate })`
- [ ] Day 1 after overdue: send second reminder with late fee notice
- [ ] Day 10 after overdue: escalate to compliance dashboard (Laila)

---

## Definition of Done — Phase 5

- [ ] `RentPayment` model exists in schema and DB is migrated
- [ ] Lease lifecycle (draft → active → expired) enforced via API
- [ ] Ejari fields validated: cannot activate lease without `ejariContractNumber`
- [ ] Rent schedule auto-generated on lease activation
- [ ] Tenant portal shows real lease data and real payment schedule from API
- [ ] Landlord portal shows real payments and maintenance requests from API
- [ ] Maintenance requests submit from tenant portal and appear in landlord/agent views
- [ ] (If Stripe in scope) Tenant can pay rent online via Stripe Checkout
- [ ] Tests pass: `npx vitest run`
- [ ] Build passes: `npm run build`

---

## Next Phase After This

Once Phase 5 is complete, move to **[PHASE_6_COMPLIANCE.md](./PHASE_6_COMPLIANCE.md)** — Full UAE RERA/KYC/AML/PDPL compliance.
