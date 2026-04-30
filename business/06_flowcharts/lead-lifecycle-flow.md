# Lead Lifecycle Flow

# White Caves Real Estate Platform

> **Document ID:** WC-FLOW-LEAD-001
> **Version:** 1.0
> **Date:** April 2026
> **Status:** Active
> **Owner:** Sales Department (Clara — Lead CRM Manager, Sophia — Pipeline Manager)
> **Scope:** Complete lead lifecycle from capture to close/lost + re-engagement

---

## 1. Lead State Machine

```
                    ┌─────────────────────────────────┐
                    │         LEAD STATUS STATES       │
                    └─────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────────┐
  │                         Entry Points                            │
  │   Website Form │ WhatsApp │ Portal Webhook │ Walk-in │ Referral │
  └──────────────────────────────┬──────────────────────────────────┘
                                 │
                                 ▼
                          ┌──────────┐
                          │  ● NEW   │  Auto-created, scored 0–100
                          └────┬─────┘
                               │ Assignment (round-robin or manual)
                               │ First contact required < 2h (Hot)
                               ▼
                       ┌───────────────┐
                       │  CONTACTED    │  First outreach logged
                       └───────┬───────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   No response x3       Interested           Not interested
   → DORMANT            → QUALIFIED           → LOST (reason required)
   (alert: 8 days)
          │
          ▼              ┌───────────────┐
   Auto-alert PM         │  QUALIFIED    │  BANT complete, score ≥ 60
   → Re-assign or        └───────┬───────┘
     close                       │
                          ┌──────┴──────┐
                          │             │
                          ▼             ▼
                     Score ≥ 60    Score < 60
                     → VIEWING     → Nurture sequence
                                   (re-qualify in 30d)
                          │
                          ▼
                    ┌───────────────┐
                    │   VIEWING     │  Property showing scheduled
                    └───────┬───────┘  (Appointment created)
                            │
                   ┌────────┴────────┐
                   │                 │
                   ▼                 ▼
             Not interested     Interested
             → LOST             → OFFER
                                     │
                            ┌────────┴────────┐
                            │                 │
                            ▼                 ▼
                       Declined           Accepted
                       → LOST             → WON ✓
                    (reason logged)    (Deal created)
```

---

## 2. Lead Capture Flow

### 2.1 Website Form Lead

```
Visitor fills contact form on whitecaves.ae
  { name, email, phone, budget, propertyType, message }
          │
          ▼
  POST /api/leads (public endpoint)
          │
          ▼
  Input validation:
  ├── email format check
  ├── phone: UAE format (+971 or 05x)
  ├── budget: numeric range
  └── XSS sanitization
          │
          ├── Invalid → 422 Validation error shown inline
          │
          ▼
  Duplicate check:
  ├── Same email in last 30 days → Update existing lead, add activity
  └── New → Create lead record
          │
          ▼
  Auto-scoring (initial):
    Source score:  website=20, WhatsApp=25, portal=30, walk-in=35, referral=40
    Budget score:  <500k=5, 500k-1M=15, 1M-3M=25, 3M+=35
    Engagement:    form filled=5, phone provided=5, specific ask=10
          │
          ▼
  Assignment:
  ├── Manage. Director zone → assign to managing_director
  ├── Round-robin pool → next agent in queue
  └── Agent preference rules (language match, area specialty)
          │
          ▼
  Notifications sent:
  ├── Assigned agent: WhatsApp + in-app notification
  ├── Manager: in-app dashboard update
  └── Lead: Confirmation email (SendGrid)
          │
          ▼
  Lead status: NEW
  Activity logged: "Lead created — source: website"
```

### 2.2 WhatsApp Inquiry Lead

```
User messages White Caves WhatsApp number
          │
          ▼
  [Nina Bot — auto-response < 10 seconds]
  "Hello! Welcome to White Caves. How can I help?
   I'm looking for: [Buy] [Rent] [Landlord Services]"
          │
          ▼
  User selects intent
          │
          ├── Intent: Buy/Rent → Nina collects:
          │   budget, property type, preferred area, timeline
          │
          ▼
  POST /api/leads (WhatsApp source)
  WhatsApp contact linked to lead record
  Score: WhatsApp source = 25 (higher intent than form)
          │
          ▼
  Human agent assigned → notified via WhatsApp + CRM
```

### 2.3 Portal Lead (Bayut / PropertyFinder)

```
User inquires on Bayut/PropertyFinder listing (Phase 8)
          │
          ▼
  Portal sends webhook: POST /api/leads/webhook/bayut
  { lead_name, phone, email, property_id, message }
          │
          ▼
  [Backend: webhook signature verified]
  Lead created with source: 'portal_bayut' or 'portal_pf'
  Score: portal = 30 (high intent — viewed specific property)
  Property linked to lead record
```

---

## 3. Lead Qualification Flow (BANT)

```
Agent opens lead in CRM
          │
          ▼
  Clara (AI) suggests qualification questions based on lead data
          │
          ▼
  Agent conducts qualification call / meeting

  BANT Assessment:
  ┌─────────────────────────────────────────────────────┐
  │ Budget    │ Can they afford target property range?   │
  │ Authority │ Are they the decision maker?             │
  │ Need      │ Clear property requirement?              │
  │ Timeline  │ Purchase/move in within 6 months?        │
  └─────────────────────────────────────────────────────┘
          │
          ├── BANT score ≥ 60 → Status: QUALIFIED
          │   Assign next activity: Property viewing
          │
          ├── Budget misalign → Log reason, suggest alternative area
          │   Status: NURTURE (re-qualify in 30 days)
          │
          └── Not a fit → Status: LOST
              Reason required: [No budget | No need | Competitor | Unresponsive | Other]
```

---

## 4. Viewing / Offer Flow

```
Lead QUALIFIED → Agent schedules viewing
          │
          ▼
  Appointment created (Phase 2 model):
  { leadId, propertyId, agentId, scheduledAt, type: 'viewing' }
          │
          ▼
  Confirmation sent:
  ├── Lead: WhatsApp message + email reminder 24h + 1h before
  └── Agent: Calendar invite + CRM reminder
          │
          ▼
  Viewing conducted
          │
          ├── Lead interested → Status: OFFER
          │   Agent submits offer via CRM
          │   → Manager reviews and approves (above AED 100k commission)
          │
          ├── Lead not interested → Log feedback → LOST or continue nurture
          │
          ▼
  OFFER stage:
  ├── Offer accepted → Status: WON
  │   → Deal record created
  │   → Commission calculation triggered (CommissionService)
  │   → Contract generated (Phase 2)
  │   → DLD registration initiated (Phase 5)
  │
  └── Offer declined → Negotiate or LOST
```

---

## 5. Deal Closure (WON)

```
Status: WON
          │
          ▼
  Deal record created:
  { leadId, propertyId, agentId, salePrice, commissionRate, closedAt }
          │
          ▼
  Commission calculated:
  ├── Off-plan new sale: 5–7% of sale price
  ├── Off-plan secondary: 2% of sale price
  ├── Ready property: 2% (primary) or 1–2% (secondary)
  └── Split: agent % + team lead % + company %
          │
          ▼
  Commission approval workflow:
  ├── Under AED 50k commission → Auto-approved
  ├── AED 50k–200k → Manager approval (24h SLA)
  └── Over AED 200k → Managing Director approval (48h SLA)
          │
          ▼
  Documents generated (Phase 2):
  ├── SPA (Sales & Purchase Agreement)
  ├── Commission statement (PDF)
  └── DLD transfer form (Phase 5)
          │
          ▼
  Client transitions to:
  ├── Buyer: → Property transferred to client record
  ├── Investor/Landlord: → Landlord portal access granted
  └── Tenant (if rental deal): → Tenant portal access granted
```

---

## 6. Lead Dormancy & Re-engagement

```
Agent inactivity on lead > 8 days (no activity logged)
          │
          ▼
  [Automated alert — cron job (Phase 2)]
  Notification to agent: "Lead [Name] has had no activity for 8 days"
          │
          ├── Agent responds → Activity logged → Alert cleared
          │
          ├── No agent response > 2 days → Manager escalation alert
          │
          └── Manager decision:
              ├── Re-assign to different agent
              ├── Move to DORMANT (bulk nurture sequence)
              └── Close as LOST

  Dormant leads re-entered into automation:
  Week 1: Value email (market update, new listings)
  Week 2: WhatsApp check-in via Nina bot
  Week 4: Personal agent outreach prompt
  Week 8: Final check-in → LOST if no response
```

---

## 7. Lead Scoring Model

| Signal                  | Score   | Notes                      |
| ----------------------- | ------- | -------------------------- |
| **Source**              |         |                            |
| Walk-in                 | 35      | Highest intent             |
| Referral                | 40      | Highest trust              |
| Portal webhook          | 30      | Property-specific interest |
| WhatsApp inquiry        | 25      | Active engagement          |
| Website form            | 20      | Passive browsing           |
| **Budget**              |         |                            |
| AED 3M+                 | 35      | Premium buyer              |
| AED 1M–3M               | 25      | Mid-market                 |
| AED 500k–1M             | 15      | Entry level                |
| Under AED 500k          | 5       | Affordable focus           |
| **Engagement**          |         |                            |
| Phone provided          | 5       |                            |
| Specific property asked | 10      |                            |
| Multiple messages       | 10      |                            |
| Responded within 1h     | 10      |                            |
| **Stage Bonus**         |         |                            |
| QUALIFIED (BANT)        | +10     |                            |
| Viewing completed       | +15     |                            |
| **Maximum score**       | **100** |                            |

**Qualification threshold:** Score ≥ 60 to progress to VIEWING

---

## 8. Lead Activity Log Events

| Event Type          | Who              | When                    |
| ------------------- | ---------------- | ----------------------- |
| `lead_created`      | System           | On capture              |
| `status_changed`    | Agent / System   | Each status transition  |
| `call_logged`       | Agent            | After phone call        |
| `whatsapp_sent`     | Agent / Bot      | After WhatsApp message  |
| `email_sent`        | Agent            | After email             |
| `viewing_scheduled` | Agent            | Appointment created     |
| `viewing_completed` | Agent            | After viewing           |
| `offer_made`        | Agent            | Offer submitted         |
| `score_updated`     | System           | After engagement event  |
| `assigned_to`       | Manager / System | On reassignment         |
| `dormancy_alert`    | System           | After 8 days inactivity |

---

**Document Owner:** Sales Department (Clara + Sophia)
**Related:** `business_docs/09_crm_features/lead-tracking.md`, `business_docs/04_workflows/lead-to-sale-flowchart.md`

---

## 9. Lead Reactivation Flow

Leads that have gone DORMANT or were marked LOST can be reactivated:

### 9.1 Automatic Re-Engagement (Nurturing)

```
DORMANT lead (no activity > 30 days)
          │
          ▼
Archer AI reassesses score
          │
  Score ≥ 40 (still valuable)?
          ├── YES → Move to NURTURING
          │    │
          │    ▼
          │   Schedule drip campaign:
          │   Week 1: "Market Update for DAMAC Hills 2" (email)
          │   Week 3: "New listings in your budget" (WhatsApp)
          │   Week 6: "Have your requirements changed?" (call prompt)
          │    │
          │    ▼
          │   Lead engages → Return to CONTACTED → Normal pipeline
          │
          └── NO → Mark LOST (dormant)
               Retain in CRM for 3 years (PDPL retention period)
               Annual re-engagement attempt
```

### 9.2 Manual Lead Revival

Manager can manually revive a LOST lead:

- Unlock lead from LOST status: Manager permission required
- Mandatory note: "Why is this lead being revived? What changed?"
- Reassign to agent (original or new)
- System auto-creates task: "Re-introduction call — revived lead"
- Track separately in "Revived Lead" pipeline view

### 9.3 Lost Reason Analysis (Quarterly)

| Lost Reason            | Count (Q3 2026 est.) | Action                                                 |
| ---------------------- | -------------------- | ------------------------------------------------------ |
| Chose competitor       | 45%                  | Battle card training; response time audit              |
| No longer looking      | 20%                  | Nurturing campaign (re-enter market in 6–12 months)    |
| Mortgage rejected      | 10%                  | Refer to Mortgage Finder; lower-value properties       |
| Personal circumstances | 15%                  | Sympathy; maintain relationship; re-engage in 3 months |
| Price too high         | 10%                  | Review pricing; offer alternative properties           |

---

## 10. Multi-Lead Management (Agent View)

High-performing agents manage 50–100+ active leads simultaneously. CRM design principles for scale:

### 10.1 Lead Priority Inbox

```
Archer AI prioritises agent's lead list into tiers:

TIER 1 (Act Now — HOT):
├── Score ≥ 80
├── New WhatsApp received in last 30 min
├── Viewing scheduled today
└── Offer stage reached

TIER 2 (Act Today — WARM):
├── Score 50–79
├── Activity in last 24h
└── Follow-up task due today

TIER 3 (Act This Week — COOL):
├── Score 30–49
├── Last activity 2–7 days ago
└── No overdue tasks

TIER 4 (Nurturing):
├── Score < 30
└── Last activity > 7 days ago
```

### 10.2 Agent Daily Workflow (Based on Priority Inbox)

```
8:30am  Open CRM → Priority Inbox view
         ├── Process all TIER 1 leads first (WhatsApps, calls, offers)
         ├── Review TIER 2 leads → plan follow-ups for today
         └── Glance at TIER 3 → any quick actions possible?

During day:
         ├── All client interactions logged in CRM within 1 hour
         ├── New lead assigned → respond within 1 hour (KPI requirement)
         └── Viewing completed → log outcome + schedule follow-up

End of day:
         ├── Update all status changes
         ├── Create tomorrow's tasks for any pending follow-ups
         └── Score update: Archer recalculates all leads overnight
```

---

**Document Owner:** Sales Department (Clara + Sophia)
**Version History:** v1.0 April 2026; v2.0 April 2026 (reactivation flow, agent inbox)
**Related:** `business_docs/09_crm_features/lead-tracking.md`, `business/07_strategy/kpi-dashboard-spec.md`
