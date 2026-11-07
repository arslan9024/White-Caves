# Portal Lead Ingestion & 15-Minute SLA Escalation Protocol

**Document Ref:** MKT-PORTAL-SLA-2026  
**Sources:** Property Finder, Bayut, Dubizzle, Website Webhooks  
**Lead:** @Olivia (Marketing Lead) & @Mila (CRM Coordinator)  
**Status:** ✅ Canonical Operational Manual  

---

## 1. Webhook Lead Ingestion Engine

Inbound customer inquiries received from external portals (Property Finder, Bayut) pass through strict JSON payload validation, deduplication, and AI scoring before round-robin assignment to team brokers.

```
┌─────────────────────────────────────────────────────────────────────────┐
│               PORTAL LEAD INGESTION & SLA ESCALATION FLOW               │
├──────────────┬──────────────┬──────────────┬──────────────┬─────────────┤
│ Portal       │ Payload      │ AI Lead      │ Squad Broker │ 15-Min SLA  │
│ Webhook      │ Validation & │ Scoring      │ Assignment   │ Counter     │
│ Ingestion    │ Deduplication│ (0-100)      │ (Round Robin)│ Ticker      │
└──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
```

---

## 2. The 15-Minute SLA Counter & Escalation Rule

To maximize conversion on company-funded portal investments:

1. **Inbound Webhook Received**: Lead record created in MongoDB Atlas, `slaDeadline` set to `Date.now() + 15 minutes`.
2. **Broker Notification**: Assigned broker receives instant CRM notification, SMS alert, and Nadia WhatsApp ping.
3. **Action Threshold**: Assigned broker must change lead pipeline stage from `new` to `contacted` or log a call note within **15 minutes**.
4. **Automatic Escalation Path**:
   - **T+10 Mins**: Warning chime emitted in broker CRM toolbar.
   - **T+15 Mins (SLA Breach)**: Lead automatically re-assigned to the next available broker in round-robin queue, and alert notification dispatched to Department Manager (@Sophia / @Victoria).

---

## 3. SLA Metric Targets

| Metric | Benchmark Target | Escalation Trigger | Responsible Role |
|---|---|---|---|
| **First Response Speed** | **< 8 Minutes** | **> 15 Minutes** | Assigned Broker |
| **Lead Qualification** | **< 2 Hours** | **> 4 Hours** | Squad Supervisor |
| **Viewing Schedule** | **< 24 Hours** | **> 48 Hours** | Sales Specialist |
| **Manager Escalation Rate** | **< 2% of Total Leads** | **> 5% Escalated** | Department Manager |
