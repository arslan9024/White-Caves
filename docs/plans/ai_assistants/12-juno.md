# 12 — Juno · Smart Community & Facilities Manager

> **ID:** `juno`  
> **Department:** Operations  
> **Title:** Smart Community & Facilities Manager  
> **Color:** `#14B8A6` (Teal)  
> **Avatar:** 🏢  
> **Phase:** Phase 10 (Planned)  
> **Status:** 🔲 Planned — to be registered in code  
> **Access:** Managing Director, Facilities Manager, Community Manager, Residents

---

## 1. Overview

Juno manages **community and facilities operations** within White Caves managed buildings and communities. She handles everything beyond the individual unit: shared amenities, community events, owner association meetings, service requests for common areas, utility monitoring, and resident communications. Juno is where Sentinel's property-level monitoring scales to the community level.

---

## 2. Core Responsibilities

1. Manage community amenity bookings (pool, gym, meeting rooms, BBQ areas)
2. Community events calendar: owner association meetings, social events, maintenance windows
3. Service requests for common areas: lifts, lobbies, parking, landscaping
4. Energy monitoring and optimisation for common areas
5. Resident communications portal: announcements, circulars, meeting minutes
6. Service charge collection tracking and dispute management

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Amenity booking | Self-service booking of pool, gym, courts, party rooms |
| Booking conflict guard | No double-bookings; max capacity enforcement |
| Community calendar | Unified calendar for all events, maintenance windows, meetings |
| Announcement board | Broadcast notices to all residents in a building |
| Common area service requests | Submit and track requests for lifts, lobbies, parking lights |
| Energy dashboard | kWh usage for common areas; compare to last month; recommendations |
| Service charge tracker | Quarterly charge collection status per unit; payment reminders |
| Meeting management | Create agendas, record minutes, assign action items |
| Resident directory | Building tenant/owner contact list (privacy-controlled) |
| Visitor access log | Pre-register visitors; log entry/exit |

---

## 4. How It Works — End to End

### Step 1 — Amenity Booking
Resident logs into portal → selects amenity (pool, gym) → selects date/time → `POST /api/bookings { amenityId, date, timeSlot, residentId }`. System checks for conflicts. Confirmation sent via WhatsApp (Nadia).

### Step 2 — Booking Enforcement
On booking day, access code or key card updated in building access system (integration if available). Post-session: amenity automatically released.

### Step 3 — Service Request
Resident submits common-area issue → `POST /api/community-requests { title, area: 'lobby', priority }`. Juno auto-assigns to the relevant facilities vendor. Sentinel is notified if IoT sensor confirms the issue (e.g., sensor shows lift power draw anomaly).

### Step 4 — Energy Monitoring
Building BMS (Building Management System) pushes daily kWh readings → stored as energy records. Juno compares current month vs same month last year → shows % variance → recommends energy-saving actions if variance > 10%.

### Step 5 — Service Charge
Quarterly: Juno generates service charge notice for each unit → `POST /api/service-charges { unitId, amount, dueDate }`. Payment reminders sent via Nadia. Disputes logged and assigned to Evangeline for resolution.

### Step 6 — Community Announcement
Facilities manager writes announcement → `POST /api/announcements { buildingId, message, priority }` → all residents in that building receive WhatsApp message via Nadia + posted on portal announcement board.

### Step 7 — Owner Association Meeting
Create meeting → agenda shared → `POST /api/meetings { date, agenda, attendees }`. Post-meeting: minutes uploaded → `PATCH /api/meetings/:id { minutes, actionItems }`. Action items assigned with due dates.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/amenities` | List amenities by building |
| POST | `/api/bookings` | Create amenity booking |
| GET | `/api/bookings` | List bookings (by amenity or resident) |
| DELETE | `/api/bookings/:id` | Cancel booking |
| POST | `/api/community-requests` | Submit common-area service request |
| GET | `/api/community-requests` | List requests |
| GET | `/api/energy` | Energy usage dashboard data |
| POST | `/api/announcements` | Broadcast community announcement |
| POST | `/api/service-charges` | Generate service charge batch |
| POST | `/api/meetings` | Create community meeting |

---

## 6. Data Flows

- **Receives from:** Sentinel (IoT sensor alerts for common areas), Daisy (move-in/move-out triggers new resident registration)
- **Sends to:** Nadia (announcements, booking confirmations, reminders), Evangeline (service charge disputes), Theodora (service charge income)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Juno CRM dashboard | `src/components/owner/ai/JunoCRM/` | 🔲 Planned |
| Amenity booking calendar | Inside dashboard | 🔲 Planned |
| Community announcements board | Portal | 🔲 Planned |
| Energy dashboard | Inside dashboard | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| Bookings CRUD | `server/routes/bookings.ts` | 🔲 Planned |
| Announcements | `server/routes/announcements.ts` | 🔲 Planned |
| Energy monitoring | `server/routes/energy.ts` | 🔲 Planned |
| Service charges | `server/routes/serviceCharges.ts` | 🔲 Planned |
| Community requests | `server/routes/communityRequests.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full community management |
| `facilities_manager` | Service requests, energy, bookings |
| `community_manager` | Announcements, meetings |
| `landlord` | Own unit bookings + service charges |
| `tenant` | Amenity booking + service requests |

---

## 10. Implementation Checklist

- [ ] Register `juno` in `AI_ASSISTANTS_REGISTRY`
- [ ] Create `JunoCRM` component (stub)
- [ ] Amenity model + booking CRUD
- [ ] Community requests CRUD
- [ ] Announcements broadcast + Nadia hook
- [ ] Energy monitoring ingestion
- [ ] Service charge model + collection tracking
- [ ] Meeting management
- [ ] Tests: `server/routes/bookings.test.ts`

---

## 11. Dependencies

- Sentinel (IoT common-area sensor data)
- Nadia (resident WhatsApp communication)
- Theodora (service charge income records)
- Building Management System (BMS) API (external)

---

## 12. Future Enhancements

- Smart home device control for residents (lights, AC, door locks)
- Community social network (neighbour messaging within building)
- Carbon footprint tracking per building
- Predictive energy optimisation (ML-based)
