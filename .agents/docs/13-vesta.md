# 13 — Vesta · Project & Snagging Coordinator

> **ID:** `vesta`  
> **Department:** Operations  
> **Title:** Off-Plan Project & Snagging Coordinator  
> **Color:** `#F97316` (Orange)  
> **Avatar:** 🏗️  
> **Phase:** Phase 5 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Project Manager, Buyer (read-only portal)

---

## 1. Overview

Vesta tracks the **off-plan property journey** from the moment a buyer signs a Sales Purchase Agreement (SPA) to the day they receive their keys. She automates communication with developers at each construction milestone, manages the digital snagging process using structured defect reporting, and ensures buyers are never left wondering what's happening with their investment.

---

## 2. Core Responsibilities

1. Register and track off-plan units bought by clients
2. Monitor developer-published construction milestones
3. Auto-notify buyers at each milestone (Foundation, Structure, Façade, Finishing, Handover)
4. Manage the snagging inspection: defect list creation, photos, developer submission
5. Track defect rectification by the developer
6. Coordinate handover: key collection, NOC, Ejari registration

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Off-plan register | All off-plan units linked to buyer, developer, project, unit number |
| Milestone tracker | Visual timeline: 5 standard milestones + custom milestones per project |
| Construction alerts | WhatsApp/email notifications at each milestone completion |
| Payment plan tracker | SPA payment schedule: on booking, on construction stages, on handover |
| Snagging form | Digital 50-item checklist per room + photo attachment |
| Defect tracker | Submit defect to developer; track status: Raised → Acknowledged → Fixed |
| Handover coordination | Key collection appointment, NOC retrieval, Ejari registration via Daisy |
| Developer API sync | Pull milestone updates from DAMAC/Emaar developer APIs where available |
| Buyer portal view | Buyer can see their unit status, milestones, and payment schedule |

---

## 4. How It Works — End to End

### Step 1 — Off-Plan Unit Registration
Sophia logs a completed SPA → `POST /api/off-plan-units { developerId, projectId, unitNumber, buyerId, agentId, purchasePrice, paymentPlan }`.

### Step 2 — Payment Plan Creation
`VestaService.createPaymentPlan(unit, spaPlan)` → creates `OffPlanPayment` records: `{ dueDate, amount, trigger: 'booking' | 'construction_X%' | 'handover', status: 'pending' }`.

### Step 3 — Milestone Monitoring
Cron (daily): `VestaService.checkMilestones()` → pulls developer API or checks manually updated milestones. When milestone completed → update `milestone.completedAt` → trigger buyer notification via Nadia.

### Step 4 — Construction Alert
Buyer receives: "Your unit [X] at [Project] has reached the Structural Completion milestone. Construction is 35% complete. Next milestone: Façade, expected July 2026."

### Step 5 — Payment Trigger
Milestone completion triggers payment dues → `PATCH /api/off-plan-payments/:id { status: 'due', dueDate: now }`. Buyer receives payment reminder via Nadia. Theodora records the expected income.

### Step 6 — Snagging
Near handover (30 days before): Vesta schedules snagging inspection → agent visits with digital snagging form → 50-item room-by-room checklist → photos per defect → `POST /api/snagging-reports { unitId, items: [...] }`.

### Step 7 — Defect Rectification
Report submitted to developer → each defect tracked: `raised → acknowledged → in_progress → fixed → verified`. Buyer can view status on portal.

### Step 8 — Handover
All defects fixed → `POST /api/handover { unitId, date, keyHandedOver: true }` → Daisy creates active lease record → Juno registers new resident → buyer congratulation message via Nadia.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/off-plan-units` | List off-plan units |
| POST | `/api/off-plan-units` | Register new off-plan unit |
| GET | `/api/off-plan-units/:id/milestones` | Get milestone timeline |
| PATCH | `/api/off-plan-units/:id/milestones/:mid` | Update milestone status |
| GET | `/api/off-plan-payments/:unitId` | Get payment schedule |
| POST | `/api/snagging-reports` | Submit snagging report |
| GET | `/api/snagging-reports/:unitId` | Get defect list |
| PATCH | `/api/snagging-reports/:id/defects/:defectId` | Update defect status |
| POST | `/api/handover` | Record handover completion |

---

## 6. Data Flows

- **Receives from:** Sophia (SPA completion → unit registration), Atlas (developer milestones), Developer APIs
- **Sends to:** Nadia (buyer milestone alerts), Theodora (payment triggers), Daisy (handover → lease creation), Quill (snagging report PDF generation)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Vesta CRM dashboard | `src/components/owner/ai/VestaCRM/` | 🔲 Planned |
| Milestone timeline | Inside dashboard | 🔲 Planned |
| Snagging form | Mobile-first digital form | 🔲 Planned |
| Defect tracker | Inside dashboard | 🔲 Planned |
| Buyer portal view | `/buyer-portal/my-property` | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| VestaService | `server/services/VestaService.ts` | 🔲 Planned |
| Off-plan units CRUD | `server/routes/offPlan.ts` | 🔲 Planned |
| Snagging reports | `server/routes/snagging.ts` | 🔲 Planned |
| Milestone cron | `server/jobs/milestoneSyncJob.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full project management |
| `project_manager` | All units and snagging |
| `agent` | Units assigned to them |
| `buyer` | Own unit only (read-only) |

---

## 10. Implementation Checklist

- [ ] Register `vesta` in `AI_ASSISTANTS_REGISTRY`
- [ ] Off-plan unit model + milestone model
- [ ] OffPlanPayment model
- [ ] Snagging report model
- [ ] CRUD endpoints for all models
- [ ] Milestone cron job (developer sync)
- [ ] Snagging digital form (mobile-optimised)
- [ ] Buyer portal view for unit status
- [ ] Quill PDF generation for snagging reports
- [ ] Tests

---

## 11. Dependencies

- Atlas (developer and project data)
- Sophia (SPA completion trigger)
- Nadia (milestone notifications)
- Quill (snagging PDF)
- Daisy (handover → lease)
- `node-cron` (milestone check job)

---

## 12. Future Enhancements

- AR defect marking: point camera at defect → tap to log with auto-location tag
- Developer portal integration for real-time milestone sync
- 3D model viewer showing construction progress
- Predicted handover delay risk score based on developer history
