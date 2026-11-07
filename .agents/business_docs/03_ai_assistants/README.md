# AI Lead Scoring Re-Trigger Automation

> **Tracking:** `DU009` | **Agent:** `@Joelle` (AI Predictive Lead Scoring Specialist) | **Status:** `ACTIVE SPECIFICATION`  
> **CONSUMES:** `src/store/slices/crm/leadsCrudThunks.ts`, `server/routes/v1Customers.ts`  
> **FEEDS:** `business_docs/03_ai_assistants/README.md`  
> **FEEDS_ACK:** `AEGIS-V5-AI-LEAD-SCORE-RETRIGGER-ACK`

---

## 1. Overview & Dynamic Scoring Triggers
Lead scores (0–100) must dynamically recompute whenever any high-intent engagement event occurs:
1. **WhatsApp Engagement**: Incoming query or brochure request received.
2. **Floorplan / Matterport Interaction**: > 90 seconds spent exploring 3D visualizer.
3. **Budget Modification**: Inquiry price range updated or pre-approval certificate uploaded.
4. **Agent Action**: Stage progression in Clara CRM pipeline (`Lead` -> `Qualified` -> `Viewing`).

---

## 2. Dynamic Weighting Model (0 to 100)
- **Financial Viability (40%)**: Proof of funds / pre-approval verified (+25), Cash buyer status (+15).
- **Engagement Velocity (35%)**: Responded within 15 min (+20), Multiple viewings scheduled (+15).
- **Inventory Affinity (25%)**: Unit type matches active developer allocation (+25).

---

## 3. Automation SLA
- Re-scoring must complete in `< 50ms` using in-memory vector embeddings and trigger real-time Redux updates across the CRM without reloading pages.
