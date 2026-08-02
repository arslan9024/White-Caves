# Automated Nadia Lead Distribution & 15-Minute SLA Matrix

> **Document Class:** Functional Use Case  
> **Repository Path:** `software_docs/03_use_cases/lead_distribution_sla.md`  
> **Actor:** Nadia WhatsApp Bot / AI Lead Router / Assigned Broker

---

## 🎨 Brand Palette Compliance

- Primary Red (`#EF4444`): SLA countdown timers, breached SLA alerts, escalation badges.
- Pure White (`#FFFFFF`): Lead detail cards, contact attempt forms.
- Slate Text (`#1E293B`): Lead score text, phone number annotations.

---

## 🔗 Inter-Linked Navigation References

- [Sales SRS](../01_requirements_engineering/srs_sales_brokerage.md) — Software Requirements Specification for Sales & Luxury Brokerage.
- [Navigation Map](../04_flowcharts/universal_navigation_map.md) — Universal ASCII navigation flowchart tracing workspace canvas views.

---

## 🎯 Use Case Overview

When a new lead inquires via WhatsApp, Website Portal, or Property Finder, the system MUST route the lead via round-robin allocation to an available licensed broker and start a strict 15-minute speed-to-lead SLA countdown timer.

---

## 📋 Step-Sequence Execution Flow

1. **Trigger**: Incoming webhook payload received from WhatsApp / Property Finder API.
2. **Step 1 — Ingestion & Deduplication**: System checks `clientPhone` and `clientEmail` against existing database records.
3. **Step 2 — AI Scoring**: Nadia AI analyzes inquiry intent and assigns lead score (0-100).
4. **Step 3 — Round-Robin Assignment**: System identifies active brokers in target property category/area and assigns lead.
5. **Step 4 — 15-Min SLA Timer Start**: `slaDeadline` set to `Date.now() + 15 * 60 * 1000`.
6. **Step 5 — WhatsApp Acknowledgment**: Instant automated WhatsApp reply sent to client.
7. **Step 6 — Broker Notification**: Push notification & Red SLA badge rendered on assigned broker's `DragDropLeadGrid`.
8. **Step 7 — Resolution / Escalation**:
   - *If broker contacts lead within 15 mins*: SLA marked `MET` (Green indicator).
   - *If 15 mins elapse without contact*: SLA marked `BREACHED` (Red pulse) and hot-lead alert escalated to Managing Director flight deck.
