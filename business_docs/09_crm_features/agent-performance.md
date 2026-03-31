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

| Metric | Formula | Period |
|--------|---------|--------|
| Leads Assigned | Count leads where agent = this agent | MTD / Rolling 30 |
| Leads Contacted | Count leads with at least one activity | MTD |
| Contact Rate | Contacted / Assigned × 100 | MTD |
| Leads Qualified | Count leads status = "Qualified" or beyond | MTD |
| Qualification Rate | Qualified / Contacted × 100 | MTD |
| Viewings Arranged | Count activities of type "viewing" | MTD |
| Offers Made | Count transactions in "Offered" or beyond | MTD |
| Deals Closed | Count transactions in "Closed" | MTD |
| Conversion Rate | Closed / Assigned × 100 | MTD |
| Average Days to Close | Mean (close date − lead created date) for closed deals | MTD |
| Total Transaction Value | Sum of closed transaction values | MTD |
| Commission Earned | Sum of commission amounts for this agent | MTD / YTD |
| Average Deal Size | Total Transaction Value / Deals Closed | MTD |

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

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/agents` | Manager, Admin | Agent list with performance snapshot |
| GET | `/api/agents/:id` | Agent (own), Manager | Agent detail + full metrics |
| GET | `/api/agents/:id/performance` | Agent (own), Manager | Detailed performance metrics |
| GET | `/api/agents/:id/commissions` | Agent (own), Finance, Manager | Commission history |
| GET | `/api/agents/leaderboard` | Manager, Owner | Leaderboard data |
| POST | `/api/agents/:id/targets` | Manager, Owner | Set monthly targets |
| GET | `/api/agents/:id/targets` | Agent (own), Manager | View current targets + progress |

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

**Version:** 1.0 | **Last Updated:** March 2026
