# Department: Operations

> **Department ID:** `operations`
> **Color:** #3B82F6 (Blue)
> **Reporting To:** Managing Director
> **Status:** ✅ Active

---

## Mission

Manage White Caves' full property portfolio, tenant relationships, HR function, and physical maintenance operations with precision. The Operations department ensures that every property asset is accurately inventoried, every lease is well-managed, and every tenant or employee interaction is handled professionally.

---

## Team Structure

| Role | Headcount | Responsibilities |
|------|-----------|-----------------|
| Operations Manager | 1 | Strategy, department oversight, vendor management |
| Property Coordinator | 2 | Inventory updates, handover coordination |
| HR Officer | 1 | Recruitment, payroll, employee records |
| Leasing Agent | 2–4 | Rental listings, tenant applications, lease renewals |
| Maintenance Supervisor | 1 | Maintenance requests, contractor coordination |
| Community Manager | 1 | Owner/tenant relations, community events |

---

## Key Responsibilities

1. **Property Inventory Management** — Maintain accurate records for all 9,378+ units in DAMAC Hills 2 and across portfolio via Mary.
2. **Leasing & Tenant Management** — Handle rental listings, tenant screening, lease creation, renewals, and evictions via Daisy.
3. **HR Management** — Manage employee records, onboarding, payroll processing, and performance reviews via Nancy.
4. **Property Condition Monitoring** — IoT sensor monitoring for temperature, humidity, water leaks, and security breaches via Sentinel.
5. **Maintenance Coordination** — Log, assign, and track maintenance requests from tenants and landlords.
6. **Smart Community Management** — Manage amenities booking, community events, and common area operations via Juno.
7. **Off-Plan Snagging** — Coordinate property handover inspections and snagging punch lists via Vesta.
8. **Vendor Management** — Oversee facility management contractors and service providers.
9. **Key/Access Management** — Control physical and digital access to property units.
10. **Utilities Coordination** — Register DEWA, Etisalat/du, and cooling accounts for new tenants.
11. **Occupancy Rate Optimisation** — Identify and act on vacant units quickly to maximise revenue.
12. **Tenant Satisfaction** — Monitor and improve tenant satisfaction scores.

---

## AI Assistants

| Assistant | Role | Status |
|-----------|------|--------|
| **Mary** | Inventory CRM Manager | ✅ In Code |
| **Daisy** | Leasing & Tenant Manager | ✅ In Code |
| **Nancy** | HR Manager | ✅ In Code |
| **Sentinel** | Property Monitoring AI (IoT) | ✅ In Code |
| **Juno** | Smart Community & Facilities Manager | 🔲 Planned (Phase 10) |
| **Vesta** | Off-Plan Project & Snagging Coordinator | 🔲 Planned (Phase 5) |

### End-to-End Operations Flow

```
Property Onboarding
  → Mary receives new property listing from Landlord
  → Property record created (unit number, type, floor plan, photos)
  → Sentinel begins IoT monitoring (if sensors connected)
  → Daisy makes property available for rental listing

Leasing Flow
  → Tenant enquiry received (WhatsApp/portal)
  → Daisy logs application; checks tenant eligibility
  → Landlord notified; viewing scheduled
  → Daisy generates lease agreement
  → Laila runs KYC/AML check
  → Evangeline reviews lease risk
  → Lease signed; Theodora logs rent schedule
  → Tenant key handover; Vesta records handover condition

Maintenance Flow
  → Tenant/Landlord submits maintenance request
  → Nancy routes to maintenance supervisor
  → Contractor assigned; work order created
  → Sentinel monitors affected area (if IoT connected)
  → Work completed; tenant confirms resolution
  → Cost logged to Theodora (Finance)

HR Flow
  → New hire request from department head
  → Nancy creates employee record; onboarding checklist
  → Payroll schedule set; leave tracker activated
  → Performance review scheduled quarterly
  → Offboarding: access revoked, final pay processed
```

---

## Core Tools & Systems

| Tool | Purpose |
|------|---------|
| Mary Inventory Panel | Property database (9,378+ units) |
| Daisy Leasing CRM | Tenant applications, leases, renewals |
| Nancy HR Module | Employee records, payroll, leave |
| Sentinel IoT Dashboard | Real-time property condition monitoring |
| Juno Community Platform | Amenities booking, community management |
| Vesta Snagging App | Handover checklists, punch lists |
| Maintenance Tracker | Work orders, contractor management |

---

## API Ownership & Integration Points

| Endpoint | Purpose |
|----------|---------|
| `GET /api/inventory` | Property inventory list |
| `POST /api/inventory` | Add new property |
| `PATCH /api/inventory/:id` | Update property status |
| `GET /api/properties` | Public-facing property listings |
| `GET /api/leases` | Active leases |
| `POST /api/leases` | Create new lease |
| `GET /api/hr/employees` | Employee records |
| `POST /api/maintenance` | Create maintenance request |
| `GET /api/iot/sensors` | Sentinel sensor readings |
| `GET /api/community/bookings` | Juno amenity bookings |

---

## KPIs & Success Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Inventory Accuracy | >99% | Monthly audit |
| Property Occupancy Rate | >90% | Monthly report |
| Lease Renewal Rate | >70% | Annual review |
| Maintenance Response Time | <24 hours | Work order timestamps |
| Tenant Satisfaction Score | >4.2/5 | Halo NPS surveys |
| HR Onboarding Time | <5 business days | Nancy tracker |
| IoT Alert Response Time | <15 minutes | Sentinel logs |

---

## Inter-Department Data Flows

| Department | Direction | Data |
|-----------|-----------|------|
| Sales | Inbound | New landlord onboarding, property handovers |
| Finance | Outbound | Rent schedules, maintenance costs |
| Compliance | Outbound | KYC/AML tenant checks |
| Legal | Outbound | Lease review requests |
| Communications | Inbound | Tenant enquiries from WhatsApp |
| Customer Experience | Outbound | Tenant satisfaction data |
| Intelligence | Outbound | Occupancy, maintenance data for analytics |

---

## Implementation Status

- [x] Mary inventory CRM in code registry
- [x] Daisy leasing module in code registry
- [x] Nancy HR module in code registry
- [x] Sentinel IoT monitoring in code registry
- [ ] Lease agreement generation (Quill — Phase 3)
- [ ] Vesta snagging coordinator (Phase 5)
- [ ] Juno community platform (Phase 10)
- [ ] Rent payment tracking models (Phase 5)
- [ ] Maintenance request Prisma models (Phase 5)

---

## Future Roadmap

| Enhancement | Phase | Priority |
|-------------|-------|----------|
| Lease/RentPayment/MaintenanceRequest Prisma models | Phase 5 | Critical |
| Vesta snagging app | Phase 5 | High |
| Automated lease renewal reminders | Phase 5 | High |
| Juno community management portal | Phase 10 | Medium |
| Full IoT sensor integration API | Phase 7 | Medium |
| Arabic tenant portal via Mira | Phase 8 | Medium |
| Tenant mobile app (PWA) | Phase 10 | Low |
