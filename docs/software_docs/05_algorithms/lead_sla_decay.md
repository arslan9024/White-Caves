# Lead SLA Decay & Escalation Algorithm Specification

> **Algorithm Code:** `ALG-COMMS-01`  
> **Associated Department:** Corporate Communications & Client Experience (`comms`)  
> **Mathematical Model:** Weight-Based Distribution with Time-To-Live (TTL) Decay Penalty Counters  
> **Cross-Linked SDD Reference:** `../02_software_design/rbac_state_gating_sdd.md`  

---

## 1. Overview & Objective

The Lead SLA Decay Algorithm continuously computes active lead responsiveness scores and enforces automatic broker escalation cascades when inbound WhatsApp or portal leads remain uncontacted beyond the mandatory 15-minute response SLA window.

---

## 2. Mathematical Decay Protocol

The instant SLA score \( S(t) \) for an uncontacted lead at elapsed time \( t \) (minutes) is modeled as:

$$S(t) = S_0 \times e^{-\lambda t} - \sum_{i=1}^{n} w_i \cdot P_i$$

Where:
- \( S_0 = 100 \): Baseline initial SLA score upon lead ingestion webhook.
- \( \lambda = 0.0462 \): Decay constant calibrated to hit 50% score degradation at \( t = 15 \) minutes.
- \( w_i \): Severity weight factor of unhandled inbound message complexity (VIP High-Net-Worth Lead = 1.5, Standard Inbound = 1.0).
- \( P_i \): Escalation penalty count.

---

## 3. Automated Escalation Matrix

| Elapsed Time (\( t \)) | SLA Score Range | Action & Routing Directive | Visual UI Marker |
| :--- | :--- | :--- | :--- |
| **0 – 5 mins** | 90 – 100 | Assigned broker primary WhatsApp push notification sent | Green Pulse Indicator |
| **5 – 10 mins** | 65 – 89 | Secondary broker pool backup notification fired | Yellow Warning Indicator |
| **10 – 15 mins** | 30 – 64 | Supervisor pool auto-escalation alert triggered | Orange Alert Pulse |
| **> 15 mins** | 0 – 29 | **SLA BREACH**: Lead auto-reassigned to active online broker pool; penalty logged | **Pulsing Red SLA Warning** |

---

## 4. State Machine Implementation Contract

```typescript
export interface LeadSlaState {
  leadId: string;
  ingestionTimestamp: number; // Unix epoch ms
  assignedBrokerId: string;
  vipTierWeight: number;
  slaStatus: 'OPTIMAL' | 'WARNING' | 'ESCALATED' | 'BREACHED';
}

export function computeLeadSlaScore(ingestionTimestamp: number, vipWeight: number = 1.0): number {
  const elapsedMinutes = (Date.now() - ingestionTimestamp) / (1000 * 60);
  const lambda = 0.0462;
  const rawScore = 100 * Math.exp(-lambda * elapsedMinutes * vipWeight);
  return Math.max(0, Math.round(rawScore));
}
```
