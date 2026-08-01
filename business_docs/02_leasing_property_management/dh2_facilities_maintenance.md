# DAMAC Hills 2 On-Ground Logistics & Facilities Maintenance Manual

**Document Ref:** PM-DH2-LOGISTICS-2026  
**Scope:** 9,378 Managed Units in DAMAC Hills 2 (Akoya, Basswood, Camelia, Vardon, Pacifica, Claret)  
**Lead:** @Rania (Operations Lead) & @Dina (Maintenance Coordinator)  
**Status:** ✅ Active Operational Manual  

---

## 1. DAMAC Hills 2 Cluster Maintenance Architecture

White Caves oversees facilities management across **9,378+ residential units** in DAMAC Hills 2. Maintenance routing operates on dedicated emergency dispatch channels linked to certified local engineering contractors.

```
┌─────────────────────────────────────────────────────────────────────────┐
│              DAMAC HILLS 2 MAINTENANCE ROUTING ENGINE                   │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│ Tenant Incident   │ Categorization    │ Emergency Dispatch SLA          │
│ Ticket (Mobile)   │ (P0/P1/P2)        │ (< 30-min Contractor Assignment)│
└───────────────────┴───────────────────┴─────────────────────────────────┘
```

---

## 2. Maintenance Service Level Agreements (SLAs)

### 2.1 Priority 0 — Critical Emergency (P0)
- **Incidents:** Complete AC failure during summer months (May – October), major water pipe burst, gas leakage, total power failure.
- **Dispatch SLA:** On-site contractor assignment within **30 minutes**.
- **Resolution SLA:** Problem containment within **2 hours**; total repair completion within **12 hours**.

### 2.2 Priority 1 — Urgent Maintenance (P1)
- **Incidents:** Partial AC malfunction, water heater breakdown, drain blockage, lock failure.
- **Dispatch SLA:** Assignment within **2 hours**.
- **Resolution SLA:** On-site repair within **24 hours**.

### 2.3 Priority 2 — Routine Repair (P2)
- **Incidents:** Minor paint touch-ups, cabinet door adjustments, non-urgent appliance servicing.
- **Dispatch SLA:** Schedule appointment within **12 hours**.
- **Resolution SLA:** Completion within **48 hours**.

---

## 3. Contractor SLA Matrix & Quality Audit

| Priority Level | Incident Type | Dispatch Target | Resolution Target | Contractor Penalty for SLA Breach |
|---|---|---|---|---|
| **P0 (Emergency)** | AC Failure / Major Leak | **< 30 Mins** | **< 12 Hours** | 10% Ticket Deductible + Alert MD |
| **P1 (Urgent)** | Heater / Drain Block | **< 2 Hours** | **< 24 Hours** | 5% Ticket Deductible |
| **P2 (Routine)** | Cosmetic / Minor | **< 12 Hours** | **< 48 Hours** | Re-assignment to Secondary Contractor |
