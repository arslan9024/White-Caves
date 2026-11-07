# 11 — Sentinel · Property Monitoring AI

> **ID:** `sentinel`  
> **Department:** Operations  
> **Title:** Property Monitoring AI  
> **Color:** `#7C3AED` (Purple)  
> **Avatar:** 🛡️  
> **Phase:** Phase 6 (Planned)  
> **Status:** ✅ In Code — registered in registry; full implementation planned  
> **Access:** Managing Director, Property Manager, Facilities Team

---

## 1. Overview

Sentinel is the **eyes and ears of every physical property** in the White Caves portfolio. He integrates with building IoT sensor networks, tracks property condition scores, schedules and tracks preventive maintenance, coordinates emergency response, and ensures every property meets health-and-safety standards before tenant move-in.

---

## 2. Core Responsibilities

1. Connect to building IoT sensors: temperature, humidity, water leak, fire alarms
2. Monitor property condition score (0–100) based on inspection results
3. Schedule preventive maintenance based on equipment age and sensor trends
4. Receive and dispatch emergency alerts (fire, flood, power failure)
5. Manage vendor assignments for repair and maintenance jobs
6. Track maintenance job completion and update condition scores

---

## 3. Capabilities

| Capability | Description |
|---|---|
| IoT dashboard | Live sensor readings per property: temp, humidity, water, electricity |
| Condition scoring | 0–100 score per property based on last inspection + sensor health |
| Alert triage | Severity classification: Critical (fire/flood), High (HVAC failure), Medium, Low |
| Preventive schedule | Auto-schedule jobs based on equipment lifecycle calendar |
| Vendor dispatch | Assign approved vendors to jobs; track acceptance and completion |
| Inspection reports | Digital inspection form → PDF report (via Quill) |
| Emergency playbook | Step-by-step response for each alert type |
| Maintenance history | Full log of all jobs per property with cost and outcome |
| Cost tracking | Maintenance spend per property, per month, vs budget |

---

## 4. How It Works — End to End

### Step 1 — IoT Sensor Data
Building sensors push data to `POST /api/sentinel/readings` every 5 minutes. Data stored as time-series records.

### Step 2 — Anomaly Detection
Backend service `SentinelService.analyseReadings()` runs on each new batch:
- Temperature > 35°C in occupied unit → High alert
- Water sensor triggered → Critical alert (potential flood)
- No readings for > 1 hour → Connectivity alert

### Step 3 — Alert Creation
On anomaly: `POST /api/alerts { propertyId, type, severity, description }`. Alert appears on Sentinel dashboard. If severity = Critical: Nadia sends WhatsApp to property manager + owner immediately.

### Step 4 — Vendor Dispatch
Property manager reviews alert → selects job type → `GET /api/vendors?specialty=plumbing` → selects vendor → `POST /api/maintenance-jobs { propertyId, vendorId, description, scheduledDate }`. Vendor receives WhatsApp notification via Nadia.

### Step 5 — Job Execution
Vendor marks job started → `PATCH /api/maintenance-jobs/:id { status: 'in_progress' }`. Vendor completes → uploads photos → `PATCH { status: 'completed', photos: [...], notes: '...' }`.

### Step 6 — Condition Score Update
On job completion: `SentinelService.updateConditionScore(propertyId)` — recalculates score from last inspection date, open jobs, sensor health. Score updated on property record.

### Step 7 — Inspection
Quarterly scheduled inspection: agent opens digital checklist → 40-item form → submits → `POST /api/inspections`. Quill generates PDF report. Score updated.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/sentinel/readings` | IoT sensor data ingestion |
| GET | `/api/sentinel/readings/:propertyId` | Sensor history |
| GET | `/api/alerts` | List property alerts |
| POST | `/api/alerts` | Create alert |
| PATCH | `/api/alerts/:id` | Acknowledge / resolve alert |
| GET | `/api/maintenance-jobs` | List maintenance jobs |
| POST | `/api/maintenance-jobs` | Create maintenance job |
| PATCH | `/api/maintenance-jobs/:id` | Update job status |
| GET | `/api/vendors` | List approved vendors |
| POST | `/api/inspections` | Submit inspection report |

---

## 6. Data Flows

- **Receives from:** IoT building sensors (external MQTT/HTTP), Daisy (move-in/move-out triggers for inspections)
- **Sends to:** Nadia (emergency alerts), Juno (community/facilities coordination), Laila (safety compliance), Zoe (property condition KPIs), Quill (inspection report PDFs)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| Sentinel CRM | `src/components/owner/ai/SentinelCRM/` | ✅ Exists (mock) |
| IoT sensor panel | Inside dashboard | 🔲 Planned |
| Alert feed | Inside dashboard | 🔲 Planned |
| Maintenance job board | Inside dashboard | 🔲 Planned |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| SentinelService | `server/services/SentinelService.ts` | 🔲 Planned |
| Alerts CRUD | `server/routes/alerts.ts` | 🔲 Planned |
| Maintenance jobs | `server/routes/maintenanceJobs.ts` | 🔲 Planned |
| Vendor directory | `server/routes/vendors.ts` | 🔲 Planned |
| IoT ingestion | `server/routes/sentinel.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full + emergency override |
| `property_manager` | All properties in portfolio |
| `facilities_manager` | Job management |
| `landlord` | Own properties (read-only alerts) |
| `tenant` | Own unit (maintenance requests only) |

---

## 10. Implementation Checklist

- [x] Sentinel registered in `AI_ASSISTANTS_REGISTRY`
- [x] Sentinel CRM component renders (mock)
- [ ] IoT sensor data model (time-series)
- [ ] Alert model + CRUD
- [ ] Maintenance jobs model + CRUD
- [ ] Vendor directory model
- [ ] SentinelService anomaly detection
- [ ] Condition score calculation
- [ ] Emergency WhatsApp alert (via Nadia)
- [ ] Digital inspection form + PDF (via Quill)

---

## 11. Dependencies

- IoT sensor hardware / MQTT broker (external, Phase 6)
- Nadia (alert notifications)
- Quill (inspection report PDF)
- Juno (facilities coordination)
- `node-cron` (preventive maintenance scheduler)

---

## 12. Future Enhancements

- Computer vision: analyse CCTV footage for security anomalies
- Predictive failure modelling (HVAC, lifts) based on sensor trends
- AR maintenance guide overlaid on property plans
- Energy efficiency scoring and optimisation recommendations
