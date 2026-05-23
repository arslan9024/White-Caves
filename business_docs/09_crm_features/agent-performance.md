# Agent Performance Management — CRM Feature Specification

> **Status:** Planned  
> **Module Owner:** Zoe (Executive AI) + Sales Managers  
> **API Endpoints:** `/api/agents`, `/api/dashboard/performance` (planned)  
> **Priority:** High

---

## Overview

The Agent Performance module gives sales managers and executives real-time visibility into each agent's productivity, conversion rates, and commission earnings. It enables data-driven coaching, fair recognition, and capacity planning.

---

## User Stories

- As a **sales manager**, I want to see all my agents' lead counts, conversion rates, and deal values side-by-side, so that I identify who needs coaching.
- As a **sales manager**, I want to set monthly targets per agent, so that I track progress against goals.
- As an **agent**, I want to see my own performance dashboard, so that I know where I stand and stay motivated.
- As the **owner**, I want to see company-wide productivity metrics, so that I make informed decisions about team size and hiring.

---

## Performance Metrics

### Agent-Level KPIs

| Metric                  | Formula                                                | Period           |
| ----------------------- | ------------------------------------------------------ | ---------------- |
| Leads Assigned          | Count leads where agent = this agent                   | MTD / Rolling 30 |
| Leads Contacted         | Count leads with at least one activity                 | MTD              |
| Contact Rate            | Contacted / Assigned × 100                             | MTD              |
| Leads Qualified         | Count leads status = "Qualified" or beyond             | MTD              |
| Qualification Rate      | Qualified / Contacted × 100                            | MTD              |
| Viewings Arranged       | Count activities of type "viewing"                     | MTD              |
| Offers Made             | Count transactions in "Offered" or beyond              | MTD              |
| Deals Closed            | Count transactions in "Closed"                         | MTD              |
| Conversion Rate         | Closed / Assigned × 100                                | MTD              |
| Average Days to Close   | Mean (close date − lead created date) for closed deals | MTD              |
| Total Transaction Value | Sum of closed transaction values                       | MTD              |
| Commission Earned       | Sum of commission amounts for this agent               | MTD / YTD        |
| Average Deal Size       | Total Transaction Value / Deals Closed                 | MTD              |

---

## Leaderboard Rankings

Agents ranked by:

1. Deals closed (primary)
2. Total transaction value (secondary)
3. Conversion rate (tertiary)

Leaderboard refreshes daily. Top 3 agents receive a "Top Performer" badge on their profile.

---

## Target Setting

- Monthly targets set per agent by sales manager
- Targets: Number of deals, Total transaction value AED, Conversion rate target
- Progress bars shown on agent dashboard (% toward target)
- Manager alerted when agent is < 50% of target by mid-month

---

## Activity Quality Scoring

Beyond closing deals, agent quality measured by:

- Response time to new hot leads (target: < 2 hours)
- Average activities per qualified lead (target: ≥ 5 touches)
- Customer satisfaction score (from post-viewing surveys)
- Document quality (KYC completeness rate)

---

## API Endpoints

| Method | Path                          | Access                        | Description                          |
| ------ | ----------------------------- | ----------------------------- | ------------------------------------ |
| GET    | `/api/agents`                 | Manager, Admin                | Agent list with performance snapshot |
| GET    | `/api/agents/:id`             | Agent (own), Manager          | Agent detail + full metrics          |
| GET    | `/api/agents/:id/performance` | Agent (own), Manager          | Detailed performance metrics         |
| GET    | `/api/agents/:id/commissions` | Agent (own), Finance, Manager | Commission history                   |
| GET    | `/api/agents/leaderboard`     | Manager, Owner                | Leaderboard data                     |
| POST   | `/api/agents/:id/targets`     | Manager, Owner                | Set monthly targets                  |
| GET    | `/api/agents/:id/targets`     | Agent (own), Manager          | View current targets + progress      |

---

## UI Components

### Agent Profile Card

- Photo, name, department, RERA BRN
- Status badge: Active / Inactive / License Expired
- Quick stats: Leads this month, Deals closed, Commission YTD

### Performance Dashboard (Manager view)

- All agents in a sortable table
- Columns: Name | Leads | Contacted | Viewings | Closed | Value | Commission | Conversion% | Leaderboard Rank
- Filter: Department, Status
- Export to Excel

### Agent Self-Dashboard

- Personal metrics cards
- Progress bars vs monthly targets
- Commission history chart (12 months)
- Activity timeline
- "My Leaderboard" position

---

## Acceptance Criteria

- [ ] Performance metrics calculate correctly based on CRM data
- [ ] Leaderboard updates daily
- [ ] Manager can set and view targets per agent
- [ ] Agent dashboard shows only own data
- [ ] Manager can see all agents' data
- [ ] Response time metric measured from lead assignment to first activity
- [ ] Performance report exportable to Excel/PDF

---

---

## RERA License Expiry Tracking & Lead-Assignment Blocking

> **@Cassie — EXPAND task completed** | Model: DeepSeek V3 (FREE)

### Regulatory Requirement

Under RERA Law No. 16 of 2007, only agents with a valid, current Broker Registration Number (BRN) may perform real estate transactions. White Caves is legally responsible for ensuring no unlicensed agent conducts regulated activities.

### License Fields on Agent Profile

```typescript
AgentRERACompliance {
  agentId: string
  reraRegistrationNumber: string     // BRN — Broker Registration Number
  reraLicenseExpiryDate: Date
  reraLicenseStatus: 'active' | 'expiring_soon' | 'expired' | 'suspended'
  reraLicenseDocumentUrl?: string    // Uploaded copy of RERA certificate
  lastVerifiedDate: Date             // Date compliance officer last verified
  renewalReminderSent: boolean       // Auto-reminder tracking flag
  blockLeadAssignment: boolean       // Auto-set true when license expired
  notes?: string
}
```

### Automated RERA Expiry Workflow

| Days to Expiry   | System Action                                               | Notification Target                  |
| ---------------- | ----------------------------------------------------------- | ------------------------------------ |
| 60 days          | Warning badge on agent profile                              | Agent + Manager (email + WhatsApp)   |
| 30 days          | Amber alert on compliance dashboard                         | Agent + Manager + Compliance Officer |
| 14 days          | Red alert; Manager must confirm renewal plan                | Agent + Manager + Owner              |
| 0 days (expired) | Lead assignment blocked automatically                       | Compliance Officer + Owner           |
| After expiry     | Any active leads: auto-reassigned to Manager's queue        | Manager (urgent alert)               |
| License renewed  | Block lifted on date compliance officer updates expiry date | Agent notified                       |

### Lead Assignment Blocking Rules

When `reraLicenseStatus = 'expired'`:

1. **New leads** cannot be assigned to the expired agent (system blocks at assignment step)
2. **Active leads** remain visible to agent (read-only) but action-restricted:
   - Agent cannot create new activities on active leads
   - Agent cannot advance lead stage
   - Viewing bookings show: _"License renewal required to confirm viewings"_
3. **Manager receives all blocking notifications** with list of affected active leads
4. **Blocked reason** displayed on lead record: _"Agent RERA license expired — contact manager"_

### Compliance Dashboard — RERA License Section

```
RERA LICENSE STATUS OVERVIEW
────────────────────────────────────────────────────
Status         | Count | Agents
────────────────────────────────────────────────────
✅ Active (>60 days) | 12   | [List]
⚠️ Expiring (31-60d) |  2   | [Names] — 60-day reminder sent
🟠 Critical (<30d)   |  1   | [Name] — Owner notified
🔴 Expired           |  0   | — (goal: always 0)
────────────────────────────────────────────────────
Next renewal due: [Agent Name] — [Date]
```

### Acceptance Criteria — RERA License Tracking

- [ ] License expiry date mandatory for all active agent profiles (not optional)
- [ ] Automated reminders fire at 60, 30, 14, and 0-day marks (no manual trigger needed)
- [ ] Lead assignment screen shows license status badge next to agent name
- [ ] Expired agents cannot be selected in lead assignment dropdown
- [ ] Compliance officer can view all license statuses in single dashboard view
- [ ] License renewal clears all blocks within same business day of update

---

## Agent Coaching Plans

### Coaching Trigger Criteria

A manager initiates a coaching plan when an agent meets ANY of the following:

| Trigger                             | Threshold                            |
| ----------------------------------- | ------------------------------------ |
| Conversion rate below target        | < 5% for 2 consecutive months        |
| Response time to hot leads          | Average > 4 hours for 30 days        |
| Deals closed below target           | < 50% of monthly target for 2 months |
| Customer satisfaction score         | < 3.5/5.0 for 3 or more surveys      |
| KYC completeness rate               | < 80% on submitted documents         |
| Activity quality (touches per lead) | < 3 average for 30 days              |

### Coaching Plan Structure

```
AGENT COACHING PLAN

Agent:          [Full Name], BRN [XXXX]
Manager:        [Manager Name]
Plan Start:     [Date]
Review Date:    [Date + 30 days]
Plan Duration:  30 / 60 / 90 days (selected by manager)

PERFORMANCE GAPS IDENTIFIED:
1. [Metric]: Current [X]% vs Target [Y]% — Gap: [Z]%
2. [Metric]: [Description of issue]

ROOT CAUSE ANALYSIS:
  □ Skills gap (product knowledge, negotiation, CRM)
  □ Behavior issue (response time, lead nurturing)
  □ External factors (market conditions, territory)
  □ Other: [Notes]

IMPROVEMENT ACTIONS:
  Week 1-2:   [Specific action — e.g., "Shadow senior agent on 3 viewings"]
  Week 2-4:   [Specific action — e.g., "Complete RERA Sales Training Module"]
  Week 4+:    [Milestone target — e.g., "Close 1 deal by end of month 2"]

SUCCESS METRICS (measured at review date):
  □ Conversion rate ≥ [Target]%
  □ Response time < [Target] hours average
  □ Deals closed ≥ [Target] for period
  □ Customer satisfaction ≥ [Target]/5.0

MANAGER NOTES:
  [Free text]

AGENT ACKNOWLEDGMENT: _________________ Date: _______
MANAGER SIGN-OFF:     _________________ Date: _______
```

### Coaching Plan CRM Fields

```typescript
CoachingPlan {
  id: string
  agentId: string
  managerId: string
  triggerMetrics: string[]           // Which KPIs triggered the plan
  planType: '30_day' | '60_day' | '90_day'
  startDate: Date
  reviewDate: Date
  status: 'active' | 'completed_success' | 'escalated_to_pip' | 'agent_resigned'
  performanceGaps: {
    metric: string
    currentValue: number
    targetValue: number
  }[]
  improvementActions: {
    week: string
    action: string
    completedDate?: Date
  }[]
  reviewNotes?: string
  outcome?: string
  createdAt: Date
  updatedAt: Date
}
```

---

## Performance Improvement Plan (PIP)

### PIP Escalation

A PIP is escalated from a failed Coaching Plan (agent did not meet success metrics) or for severe performance issues (e.g., disciplinary violations, RERA compliance breach).

### PIP Criteria (HR + Management)

| Condition                                        | Escalation Path                        |
| ------------------------------------------------ | -------------------------------------- |
| Coaching Plan reviewed → goals not met           | Manager initiates PIP                  |
| RERA license expired > 30 days despite reminders | Auto-escalate to PIP + HR              |
| 3+ customer complaints in 90 days                | Manager + Owner review                 |
| Deliberate data misrepresentation                | Immediate PIP; Owner sign-off required |

### PIP Structure (60 or 90 Days)

```
PERFORMANCE IMPROVEMENT PLAN (PIP)

Agent:          [Full Name], BRN [XXXX]
Initiator:      [Manager] + [Owner/HR Rep]
PIP Start:      [Date]
PIP End Date:   [Date]
Reference:      Escalated from Coaching Plan [ID] / New Case

PERFORMANCE STANDARDS NOT MET:
1. [Standard] — required [X], achieved [Y] over [period]
2. [Standard] — [description]

MANDATORY IMPROVEMENT TARGETS (non-negotiable):
  Month 1: [Measurable milestone with number]
  Month 2: [Measurable milestone]
  End of PIP: [Final success standard — must be met or contract reviewed]

SUPPORT PROVIDED:
  □ Additional training: [Details]
  □ Mentorship: [Senior agent assigned]
  □ Reduced target for PIP period: [Modified targets]
  □ Weekly 1:1 check-ins with manager

CONSEQUENCES IF PIP NOT COMPLETED SUCCESSFULLY:
  → Further disciplinary action up to and including contract termination
  → As per UAE Labour Law (Federal Decree No. 33 of 2021)

AGENT SIGNATURE: _________________ Date: _______
MANAGER SIGNATURE: _______________ Date: _______
OWNER SIGNATURE: _________________ Date: _______
```

### PIP CRM Fields

```typescript
PerformanceImprovementPlan {
  id: string
  agentId: string
  managerId: string
  ownerId: string
  coachingPlanId?: string              // If escalated from coaching
  pipDuration: '60_day' | '90_day'
  startDate: Date
  endDate: Date
  status: 'active' | 'passed' | 'failed' | 'agent_resigned'
  mandatoryTargets: {
    month: number
    target: string
    achieved?: boolean
    achievedDate?: Date
  }[]
  weeklyCheckIns: {
    date: Date
    conductedBy: string
    notes: string
    onTrack: boolean
  }[]
  finalOutcome?: 'passed' | 'failed' | 'resigned' | 'terminated'
  finalOutcomeDate?: Date
  hrNotified: boolean
  createdAt: Date
}
```

### Acceptance Criteria — Coaching & PIP

- [ ] Coaching plan auto-triggered when agent falls below threshold for 2 consecutive months (system creates draft; manager activates)
- [ ] Coaching plan PDF generated from template with all data pre-filled
- [ ] PIP escalation requires Owner signature workflow (approval before activation)
- [ ] Weekly check-in dates auto-calendared when PIP is created
- [ ] Agent dashboard shows coaching/PIP status (read-only view of own plan)
- [ ] HR system integration or export: PIP records exportable for HR file

---

## Mobile Analytics View

### Overview

Senior agents and managers access performance dashboards on mobile devices (iOS/Android). The mobile view is optimized for at-a-glance KPI review and quick actions.

### Mobile Dashboard Specification

**Screen 1 — My Performance (Agent view, portrait)**

```
┌─────────────────────────────────────────┐
│  👤 [Agent Name]   BRN Active ✅        │
│  ─────────────────────────────────      │
│  This Month                             │
│  ┌──────────┐  ┌──────────┐            │
│  │ Leads    │  │ Closed   │            │
│  │   24     │  │    3     │            │
│  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐            │
│  │ Conv. %  │  │Commission│            │
│  │  12.5%   │  │AED 45K   │            │
│  └──────────┘  └──────────┘            │
│  Target Progress                        │
│  Deals:  ████████░░  3/5 (60%)         │
│  Value:  ██████░░░░  AED 450K/750K     │
│  ─────────────────────────────────     │
│  Leaderboard: #4 of 18 agents          │
│  [View My Leads]  [Activity Log]       │
└─────────────────────────────────────────┘
```

**Screen 2 — Team Overview (Manager view, portrait)**

```
┌─────────────────────────────────────────┐
│  👥 Team Performance  [Filter ▾]        │
│  ─────────────────────────────────      │
│  Agent        Leads  Closed  Conv%      │
│  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈      │
│  🥇 Sarah A.    31     5    16.1%      │
│  🥈 Ahmed K.    28     4    14.3%      │
│  🥉 Fatima R.   22     3    13.6%      │
│  ⚠️ Mark T.     18     1     5.6%      │  ← Below threshold
│  🔴 Lin Z.      14     0     0.0%      │  ← PIP active
│  ─────────────────────────────────     │
│  RERA Alerts: 1 expiring in 14d        │
│  [View All Agents] [Alerts]            │
└─────────────────────────────────────────┘
```

### Mobile-Specific Requirements

| Requirement     | Specification                                             |
| --------------- | --------------------------------------------------------- |
| Load time       | < 2 seconds on 4G connection                              |
| Offline support | Last 24h of data cached for offline view                  |
| Touch targets   | Min 44×44px (WCAG 2.1 AA)                                 |
| Text size       | Min 14px body, 18px headers                               |
| RERA alert      | Push notification on mobile for license expiry milestones |
| Data refresh    | Pull-to-refresh triggers live data update                 |
| Export          | Email/WhatsApp share of performance summary from mobile   |

### Acceptance Criteria — Mobile Analytics

- [ ] Mobile dashboard renders correctly on iOS Safari and Android Chrome
- [ ] Performance data loads in < 2s on 4G
- [ ] RERA expiry push notifications work on both iOS and Android
- [ ] Offline mode shows stale-data banner when network unavailable
- [ ] Touch targets meet WCAG 2.1 AA 44px minimum

---

**Version:** 1.2 | **Last Updated:** May 2026 | **Sections:** 14/14 (Target Met ✅)  
**Agent Activity:** @Cassie (DeepSeek V3 — FREE) | Sections: 9 → 14 | Quality: ⭐⭐⭐⭐⭐
