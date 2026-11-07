# White Caves Real Estate LLC — System Architecture & Commission Engine Specification

**Document Version:** 2.0  
**Owner:** @Margaret (Strategic Planner) + @Ada (Chief Architect)  
**Managing Director:** Arsalan Malik  
**Jurisdiction:** Dubai, UAE (Trade License: White Caves Real Estate LLC)  
**Target Areas:** DAMAC Hills, DAMAC Hills 2, Dubailand

---

## 1. System Overview & Context

This document serves as the absolute core truth for the business logic, user structures, commission rules, and database tracking frameworks of the White Caves Real Estate LLC web platform. The platform automates commission tracking, multi-agent deal reconciliation, tiered employee progression, and a real-time gamified leaderboard engine.

---

## 2. Core Operational Entities

### A. Company Profile

- **Company Name:** White Caves Real Estate LLC
- **Trade License Jurisdiction:** Dubai, UAE
- **Operational Headquarters:** DAMAC Hills, Dubai, UAE
- **Target Geographic Focus:** DAMAC Hills 2, DAMAC Hills, Dubailand
- **Managing Director:** Arsalan Malik

### B. Departmental Nodes

1. `DEPT_RES_LEASING` (Residential Leasing)
2. `DEPT_RES_SALES` (Residential Sales & Investment Advisory)
3. `DEPT_PROP_MGMT` (Property Management)
4. `DEPT_ADMIN_CRM` (Operations, CRM & Software Engineering)

---

## 3. Commission Framework & Tier Logic

### A. Fixed Static Splits

The following services operate on a strict, permanent static split from day one:

- **Residential Leasing (New Contracts):** 50% Agent / 50% Company (Paid Monthly)
- **Residential Leasing (Renewals):** 50% Agent / 50% Company (Paid Monthly)
- **Property Management (PM Fees):** 50% Agent / 50% Company (Paid Monthly/Milestone)

### B. Premium Recruitment & Onboarding Buffer

- **Program Name:** Accelerated Agent Onboarding Support
- **Promotional Sales Split:** 70% Agent / 30% Company
- **Validity Window:** Exactly 180 days (6 Months) from the Agent's verified onboarding date.
- **System Action on Expiry:** Automatically transition agent to the **Standard Performance Slab Structure** based on their previous rolling quarter's performance run-rate.

### C. Standard Performance Slab Structure (Dynamic Tiers)

For agents outside their onboarding window, splits are calculated monthly or annually using the following revenue matrices. A rolling **1-quarter grace period buffer** is hardcoded before any automatic downward tier movement is executed.

| Tier Level | Tier Name            | Agent % | Company % | Monthly Target Range (AED) | Annual Target Lock (AED) |
| :--------- | :------------------- | :-----: | :-------: | :------------------------- | :----------------------- |
| **Tier 1** | Executive Consultant |   50%   |    50%    | 0 – 49,999                 | 0 – 599,999              |
| **Tier 2** | Silver Producer      |   55%   |    45%    | 50,000 – 99,999            | 600,000 – 1,199,999      |
| **Tier 3** | Gold Producer        |   60%   |    40%    | 100,000 – 149,999          | 1,200,000 – 1,799,999    |
| **Tier 4** | Platinum Elite       |   70%   |    30%    | 150,000+                   | 1,800,000+               |

---

## 4. Multi-Agent Deal Splitting & Attribution Engine

When multiple agents collaborate on a transaction, the backend engine parses individual point metrics and split calculations using this deterministic routing logic:

- **Direct Deal:** One agent sources the client and the listing. $100\%$ leaderboard weight and payout matching current individual tier allocation.
- **Internal Split Deal:** Agent A holds listing; Agent B brings the client. $50\%$ split on points. $50\%$ of gross value calculated through Agent A's tier pool, $50\%$ through Agent B's tier pool.
- **Referral Deal:** Agent A registers raw contact data; Agent B closes the deal. Agent A receives $10\%$ point weight. Agent B receives $90\%$ point weight.

---

## 5. White Caves Apex Champions Leaderboard Engine

### A. Dual-Track Pipeline Execution

To ensure fair gamification, the leaderboard routes metrics into two parallel database tracks:

1. **Track A (Sales Elite):** Ranked primary by Gross Written Commission (GWC) revenue value.
2. **Track B (Leasing Volume Engine):** Ranked primary by total quantity of deal units transacted + net rental commission density.

### B. Automated Milestone Rewards

- **Monthly Milestone ("Cave Master of the Month"):** Highest point scorer receives an automated system alert triggering an AED 2,500 payout voucher + profile flag modification for frontend visibility.
- **Quarterly Milestone ("Elite Portfolio Director"):** Mid-tier leaderboard leader triggers automated CRM spotlight flags on connected marketing portal feeds.
- **Annual Milestone ("Chairman's Circle Club"):** Overall annual champion unlocks a hardcoded system override: **Uncapped 75% commission lock-in** for the entire following calendar year, ignoring rolling monthly dips.

---

## 6. Calculation Logic Implementation Reference

```typescript
export interface CommissionCalculationResult {
  agentPayout: number;
  companyRevenue: number;
  currentTierPct: number;
  tierName: string;
}

export function calculateAgentPayout(
  grossCommission: number,
  isOnboarding: boolean,
  monthlyRunRate: number
): CommissionCalculationResult {
  let agentPercentage = 0.5;
  let tierName = 'Executive Consultant';

  if (isOnboarding) {
    agentPercentage = 0.7; // 180-day onboarding buffer
    tierName = 'Accelerated Onboarding (70/30)';
  } else {
    if (monthlyRunRate >= 150000) {
      agentPercentage = 0.7;
      tierName = 'Platinum Elite';
    } else if (monthlyRunRate >= 100000) {
      agentPercentage = 0.6;
      tierName = 'Gold Producer';
    } else if (monthlyRunRate >= 50000) {
      agentPercentage = 0.55;
      tierName = 'Silver Producer';
    } else {
      agentPercentage = 0.5;
      tierName = 'Executive Consultant';
    }
  }

  const agentPayoutAmount = grossCommission * agentPercentage;
  const companyRetainedAmount = grossCommission - agentPayoutAmount;

  return {
    agentPayout: agentPayoutAmount,
    companyRevenue: companyRetainedAmount,
    currentTierPct: agentPercentage,
    tierName,
  };
}
```
