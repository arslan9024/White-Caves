# Department: Sales

> **Department ID:** `sales`
> **Color:** #EF4444 (Red)
> **Reporting To:** Managing Director
> **Status:** ✅ Active

---

## Mission

Convert every inbound enquiry into a qualified lead, progress it efficiently through the pipeline, and close deals at the highest possible value. The Sales department is the primary revenue engine of White Caves Real Estate LLC, operating across both off-plan and secondary market properties in Dubai.

---

## Team Structure

| Role | Headcount | Responsibilities |
|------|-----------|-----------------|
| Sales Director | 1 | Strategy, targets, agent management |
| Senior Sales Agent | 2–3 | High-value leads, VIP clients, mentoring |
| Sales Agent (Secondary) | 5–8 | Lead nurturing, viewings, closures |
| Sales Coordinator | 1 | CRM administration, scheduling, reporting |

---

## Key Responsibilities

1. **Lead Management** — Receive, qualify, assign, and track all inbound and outbound leads via Clara.
2. **Pipeline Management** — Progress deals through stages (New → Contacted → Qualified → Viewing → Offer → Closed) via Sophia.
3. **Lead Prospecting** — Proactive outbound campaigns and market prospecting via Hunter.
4. **Lead Scoring** — Prioritise leads by conversion probability via Archer.
5. **Property Matching** — Match client requirements to inventory via Prism.
6. **VIP Concierge** — Provide white-glove service to HNW clients via Kairos.
7. **Commission Tracking** — Calculate and track commissions per deal.
8. **Viewing Coordination** — Schedule and confirm property viewings.
9. **Offer Negotiation** — Facilitate offers, counter-offers, and deal structuring.
10. **Agent Performance** — Track individual agent metrics; coach under-performers.
11. **CRM Hygiene** — Ensure all deal data is accurate and up-to-date.
12. **Cross-sell / Upsell** — Identify upsell opportunities (e.g., premium finishes, parking, investment units).

---

## AI Assistants

| Assistant | Role | Status |
|-----------|------|--------|
| **Clara** | Leads CRM Manager | ✅ In Code |
| **Sophia** | Sales Pipeline Manager | ✅ In Code |
| **Hunter** | Lead Prospecting AI | ✅ In Code |
| **Kairos** | Luxury Concierge & VIP Experience | 🔲 Planned (Phase 10) |
| **Archer** | Lead Scoring Engine | 🔲 Planned (Phase 3) |
| **Prism** | AI Property Matching Engine | 🔲 Planned (Phase 10) |

### End-to-End Sales Flow

```
1. Enquiry arrives (WhatsApp/Web form/Walk-in)
      ↓
2. Nadia (Communications) captures & logs enquiry
      ↓
3. Clara creates Lead record; assigns to Sales Agent
      ↓
4. Archer scores lead (hot/warm/cold)
      ↓
5. Hunter enriches lead profile (social data, budget signals)
      ↓
6. Prism suggests matching properties from inventory
      ↓
7. Agent contacts lead (WhatsApp/call/email)
      ↓
8. If VIP flag → Kairos activates luxury concierge protocol
      ↓
9. Viewing scheduled → Mary confirms property availability
      ↓
10. Sophia moves deal to Offer stage
      ↓
11. Offer negotiated; Theodora calculates financials
      ↓
12. Laila runs KYC/AML verification
      ↓
13. Evangeline reviews contract risk
      ↓
14. Deal closed; Sophia marks Won; commission logged
      ↓
15. Halo triggers post-sale NPS survey
      ↓
16. Zoe aggregates to executive KPI dashboard
```

---

## Core Tools & Systems

| Tool | Purpose |
|------|---------|
| Clara CRM Panel | Lead inbox, assignment, status |
| Sophia Pipeline Board | Kanban deal stages |
| Hunter Prospecting Module | Outbound lead generation |
| Archer Scoring Widget | Lead priority scores (1–100) |
| Prism Property Matcher | AI-driven property suggestions |
| Kairos VIP Portal | White-glove client management |
| Commission Calculator | Automated fee calculations |

---

## API Ownership & Integration Points

| Endpoint | Purpose |
|----------|---------|
| `GET /api/leads` | Fetch all leads |
| `POST /api/leads` | Create new lead |
| `PATCH /api/leads/:id` | Update lead status |
| `GET /api/deals` | Fetch deal pipeline |
| `POST /api/deals` | Create new deal |
| `GET /api/pipeline` | Pipeline stage summary |
| `POST /api/leads/:id/score` | Trigger Archer rescoring |
| `GET /api/commissions` | Commission calculations |

---

## KPIs & Success Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Monthly Leads | >150 | Clara dashboard |
| Lead-to-Viewing Rate | >35% | Sophia pipeline |
| Viewing-to-Offer Rate | >40% | Sophia pipeline |
| Deal Closure Rate | >25% | Monthly report |
| Average Deal Size | >AED 1.5M | Finance data |
| Commission Accuracy | 100% | Theodora cross-check |
| CRM Data Completeness | >95% | Automated audit |
| Response Time to Lead | <2 hours | Clara timestamp |

---

## Inter-Department Data Flows

| Department | Direction | Data |
|-----------|-----------|------|
| Communications | Inbound | Enquiries captured by Nadia/Nina |
| Operations | Outbound | Property availability requests |
| Finance | Outbound | Deal values, commission requests |
| Compliance | Outbound | KYC/AML requests |
| Legal | Outbound | Contract review requests |
| Customer Experience | Outbound | VIP flag, post-sale NPS trigger |
| Intelligence | Outbound | Deal data for market analytics |
| Executive | Outbound | Pipeline KPIs |

---

## Implementation Status

- [x] Clara — lead CRM in code registry
- [x] Sophia — pipeline manager in code registry
- [x] Hunter — prospecting module in code registry
- [ ] Archer — lead scoring engine (Phase 3)
- [ ] Prism — property matching AI (Phase 10)
- [ ] Kairos — VIP concierge (Phase 10)
- [ ] Commission automation (Phase 5)
- [ ] Viewing scheduler integration (Phase 5)

---

## Future Roadmap

| Enhancement | Phase | Priority |
|-------------|-------|----------|
| Archer lead scoring live | Phase 3 | Critical |
| Commission auto-disbursement | Phase 5 | High |
| Prism property matching | Phase 10 | High |
| Kairos VIP concierge portal | Phase 10 | High |
| Predictive close-probability (Cipher) | Phase 7 | Medium |
| Arabic sales scripts via Mira | Phase 8 | Medium |
| Outbound calling integration | Phase 9 | Low |
