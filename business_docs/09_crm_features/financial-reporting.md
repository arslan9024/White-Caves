# Financial Reporting — CRM Feature Specification

> **Status:** In Progress (Core reports active, advanced exports expanding)  
> **Module Owner:** Theodora (Finance Director AI) + Zoe (Executive AI)  
> **API Endpoints:** `/api/finance`, `/api/dashboard`, `/api/commissions`  
> **Priority:** High

---

## Overview

The Financial Reporting module delivers accurate, role-appropriate financial views across the platform — from agent-level commission statements to executive P&L dashboards. All reports are exportable to Excel and PDF.

---

## Report Types

### 1. Executive Summary Dashboard (Zoe)

**Access:** Owner, Managing Director, Executive  
**Frequency:** Real-time  
**Purpose:** Single-screen business health overview

**KPIs Displayed:**
| Metric | Calculation | Period |
|--------|-------------|--------|
| Revenue MTD | Sum of closed transaction values × commission rate | Current month |
| Pipeline Value | Sum of active lead budgets (not closed) | Live |
| Commissions Paid | Sum of paid commission amounts | Current month |
| Commissions Pending | Sum of pending + approved commission amounts | Live |
| Occupancy Rate | Active leases / Total managed properties × 100 | Live |
| Leads (Hot) | Count leads with score ≥ 90 | Live |
| Conversion Rate | Won leads / Total leads × 100 | Last 30 days |
| Revenue vs Target | Actual revenue / Monthly target × 100 | Current month |

**Charts:**

- Revenue trend (12-month bar chart)
- Commission by agent (horizontal bar, top 10)
- Lead pipeline funnel (stage counts)
- Transaction volume by type (sale vs lease — pie chart)

---

### 2. Monthly P&L Report

**Access:** Finance Director, Owner  
**Frequency:** Generated on demand (usually Day 5 after month-end)  
**Format:** PDF + Excel

**Structure:**

```
WHITE CAVES REAL ESTATE — MONTHLY P&L
Period: [Month Year]
────────────────────────────────────────────────────
REVENUE
  Sales commissions (2% of sale transactions)    AED X
  Lease commissions (5% of annual rent)          AED X
  Property management fees (6-8% monthly rent)   AED X
  Premium listing fees                           AED X
  Late fee income                                AED X
────────────────────────────────────────────────────
TOTAL REVENUE                                    AED X
────────────────────────────────────────────────────
EXPENSES
  Agent commissions paid (50% of gross)          AED X
  Marketing & advertising                        AED X
  Technology (cloud, APIs, tools)                AED X
  Salaries (operations staff)                    AED X
  Office rent & utilities                        AED X
  Legal & compliance                             AED X
────────────────────────────────────────────────────
TOTAL EXPENSES                                  (AED X)
────────────────────────────────────────────────────
OPERATING PROFIT                                 AED X
PROFIT MARGIN                                       X%
────────────────────────────────────────────────────
```

---

### 3. Commission Detail Report

**Access:** Finance Director, Sales Manager, Owner  
**Frequency:** Monthly or on demand  
**Format:** Excel + PDF

**Columns:** Agent Name | Transaction Reference | Property | Transaction Type | Transaction Value (AED) | Commission Rate | Gross Commission | Agent Split % | Agent Amount | Status | Paid Date | Payment Reference

**Grouping:** By agent, then by date

---

### 4. Agent Commission Statement

**Access:** Agent (own), Manager (all), Finance  
**Frequency:** Monthly (auto-sent on payment day)  
**Format:** PDF (letterhead)

**Contents:** Agent name, BRN, period, list of commissions with transaction references, total earned, total paid, pending amount

---

### 5. Rental Income Report

**Access:** Finance Director, Owner, Landlord (own properties)  
**Frequency:** Monthly  
**Format:** Excel + PDF

**Per Landlord Section:**

- Property address
- Tenant name
- Monthly rent (AED)
- Payments received this period
- Outstanding balance
- Late fees applied

---

### 6. Transaction Summary Report

**Access:** Finance, Manager, Owner  
**Frequency:** On demand  
**Format:** Excel

**Columns:** Transaction ID | Date | Type | Property | Buyer/Tenant | Agent | Offer Price (AED) | Final Price (AED) | Status | Commission Generated (AED)

---

### 7. Agent Performance Report

**Access:** Manager, Owner  
**Frequency:** Weekly/Monthly  
**Format:** Excel + PDF + On-screen

**Per Agent:**

- Leads handled
- Viewings arranged
- Offers made
- Deals closed
- Total transaction value
- Commission earned
- Conversion rate

---

## Financial Dashboard UI Components

### Summary Cards Row

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Revenue MTD     │ │ Commissions     │ │ Pending         │ │ Pipeline Value  │
│ AED 2.4M        │ │ Paid: AED 850K  │ │ AED 320K        │ │ AED 18.5M       │
│ +12% vs last mo │ │ 28 transactions │ │ 8 awaiting      │ │ 47 active deals │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Commission List Table

- Columns: Transaction, Agent, Property, Amount, Split, Status, Actions
- Filter bar: Status, Agent, Date Range, Type
- Bulk actions: Approve selected, Export selected
- Action buttons per row: View detail, Approve, Mark Paid

---

## Export Requirements

All reports:

- [ ] Include company name, RERA license number, and report generation date/time
- [ ] PDF: A4, company branding, page numbers
- [ ] Excel: Formatted headers, auto-fit columns, frozen header row
- [ ] Export max: 50,000 rows per file
- [ ] Export triggers download in browser (no email unless scheduled)

---

## Acceptance Criteria

- [ ] Executive dashboard loads in < 2 seconds
- [ ] All KPIs update in real-time when underlying data changes
- [ ] Monthly P&L report generated within 10 seconds for any calendar month
- [ ] Agent commission statement includes all required compliance fields
- [ ] Rental income report correctly groups by landlord
- [ ] All exports include correct column headers and data
- [ ] Reports honour role-based access (agent cannot export finance summary)
- [ ] Schedule option: daily/weekly report digest emailed automatically

---

**Version:** 1.0 | **Last Updated:** March 2026
