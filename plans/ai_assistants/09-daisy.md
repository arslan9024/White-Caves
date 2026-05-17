# 09 — Daisy · Leasing & Tenant Manager

> **ID:** `daisy`  
> **Department:** Operations  
> **Title:** Leasing & Tenant Manager  
> **Color:** `#14B8A6` (Teal)  
> **Avatar:** 👩‍🔧  
> **Phase:** Phase 3 (Active) / Phase 5 (Full)  
> **Status:** ✅ In Code — `src/components/owner/ai/DaisyLeasingCRM_NEW/`  
> **Access:** Managing Director, Leasing Agent, Tenant (portal — read own data)

---

## 1. Overview

Daisy manages the **entire tenancy lifecycle** — from tenant screening and lease drafting through to rent collection, maintenance requests, lease renewals, and move-out. She is the operating heart of White Caves' rental business, ensuring every tenant interaction is tracked and every landlord is kept informed.

---

## 2. Core Responsibilities

1. Manage all active leases: start/end dates, rent amounts, deposit, Ejari status
2. Rent schedule: auto-generate monthly payment schedule on lease activation
3. Track rent payments: paid, pending, overdue, late fees
4. Receive and triage maintenance requests from tenants
5. Manage lease renewals: 90/60/30 day reminders, new rent negotiation
6. Produce tenancy certificates and payment receipts (via Quill)

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Lease creation | New lease wizard: tenant, property, dates, rent, deposit, Ejari |
| Ejari integration | Track Ejari registration number + expiry; block activation if missing |
| Rent schedule | Auto-create `RentPayment` records for every month of the lease |
| Payment recording | Mark payments as paid; auto-apply late fee after Day 15 |
| Overdue alerts | WhatsApp reminder via Nadia on Day 5, 10, 15 post due date |
| Maintenance tracker | Log, triage, assign, update, close maintenance requests |
| Renewal pipeline | 90/60/30-day expiry alerts; offer new terms; counter-offer workflow |
| Tenant directory | Full profile: contact, emergency contact, vehicle, pet info |
| Document store | Upload/download: tenancy agreement, Ejari, NOC, receipts |
| Landlord view | Landlord portal shows their properties + Daisy's data (read-only) |

---

## 4. How It Works — End to End

### Step 1 — Lease Creation
Leasing agent creates new lease: tenant (from User model with `role: tenant`), property (from Mary), dates, monthly rent, deposit amount. → `POST /api/leases`.

### Step 2 — Ejari Registration Gate
`lease.status` can only advance to `active` if `ejariContractNumber` is set. If missing, API returns 400: "Ejari number required to activate lease." Laila is notified.

### Step 3 — Rent Schedule Generation
On `lease.status = 'active'`: backend auto-creates `RentPayment` records for each month from `startDate` to `endDate`:
```
{ leaseId, dueDate: 1st of each month, amount: monthlyRent, status: 'pending' }
```

### Step 4 — Rent Collection
Tenant pays → agent marks payment → `PATCH /api/rent-payments/:id { status: 'paid', paidDate: now }`.
If `paidDate > dueDate + 15 days`: `lateFee = monthlyRent × 0.05` applied automatically.

### Step 5 — Overdue Reminder Sequence
Cron (daily 09:00): find payments where `dueDate + N days = today`:
- Day 5: Friendly reminder WhatsApp via Nadia
- Day 10: Second reminder + late fee warning
- Day 15: Late fee applied + Laila notified for compliance escalation

### Step 6 — Maintenance Request
Tenant submits via portal → `POST /api/maintenance` → `{ title, description, priority, propertyId }`.
Daisy's dashboard shows it. Agent triages, assigns vendor, updates status.

### Step 7 — Lease Renewal
90 days before `endDate`: Daisy generates renewal task in Zoe's calendar. Agent contacts tenant with new terms. If agreed → `POST /api/leases` (new lease) linked to previous. If rejected → `lease.status = 'not_renewing'` → vacant flag on property.

### Step 8 — Move-Out
Final inspection logged → deposit return/deduction calculated → `PATCH /api/leases/:id { status: 'terminated', depositReturnAmount: X }`. Quill generates deposit refund letter.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/leases` | List leases |
| POST | `/api/leases` | Create lease |
| PATCH | `/api/leases/:id` | Update lease status/fields |
| GET | `/api/leases/:id/payments` | Get rent payment schedule |
| PATCH | `/api/rent-payments/:id` | Mark payment paid / apply late fee |
| POST | `/api/maintenance` | Submit maintenance request |
| GET | `/api/maintenance` | List maintenance requests |
| PATCH | `/api/maintenance/:id` | Update maintenance status |

---

## 6. Data Flows

- **Receives from:** Mary (leased property data), User model (tenant profiles)
- **Sends to:** Nadia (rent reminder messages), Laila (Ejari compliance, overdue alerts), Theodora (rent income records), Quill (document generation), Landlord portal (read-only view)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `DaisyLeasingCRM_NEW` | `src/components/owner/ai/DaisyLeasingCRM_NEW/` | ✅ Exists |
| Lease list tab | Inside `DaisyLeasingCRM_NEW` | ✅ Exists (mock) |
| Maintenance tab | Inside `DaisyLeasingCRM_NEW` | ✅ Exists (mock) |
| Renewal pipeline tab | Inside `DaisyLeasingCRM_NEW` | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| Leases CRUD | `server/routes/leases.ts` | 🔲 Phase 5 |
| Rent payment CRUD | `server/routes/rentPayments.ts` | 🔲 Phase 5 |
| Maintenance CRUD | `server/routes/maintenance.ts` | 🔲 Phase 5 |
| Late fee cron | `server/jobs/lateFeeJob.ts` | 🔲 Phase 6 |
| Renewal reminder cron | `server/jobs/renewalJob.ts` | 🔲 Phase 6 |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full access — all leases, payments, maintenance |
| `leasing_agent` | All leases assigned to them |
| `landlord` | Own properties only (read-only via portal) |
| `tenant` | Own lease + payments + maintenance (via portal) |

---

## 10. Implementation Checklist

- [x] `DaisyLeasingCRM_NEW` renders (mock data)
- [ ] `Lease` Prisma model (Phase 5)
- [ ] `RentPayment` Prisma model (Phase 5)
- [ ] `MaintenanceRequest` Prisma model (Phase 5)
- [ ] Leases CRUD backend
- [ ] Rent schedule auto-generation on lease activation
- [ ] Late fee calculation + cron job
- [ ] Overdue reminder sequence (via Nadia)
- [ ] Lease renewal pipeline
- [ ] Wire `DaisyLeasingCRM_NEW` to live API

---

## 11. Dependencies

- `Lease`, `RentPayment`, `MaintenanceRequest` Prisma models (Phase 5)
- `node-cron` (Phase 6) — late fee and renewal reminder jobs
- Nadia (WhatsApp reminders)
- Quill (tenancy agreement PDF generation)
- Laila (Ejari + compliance gate)

---

## 12. Future Enhancements

- Online rent payment via Stripe (Phase 5)
- Automated Ejari registration via DLD API
- Maintenance vendor rating system
- AI-predicted renewal probability score
- Digital key handover integration
