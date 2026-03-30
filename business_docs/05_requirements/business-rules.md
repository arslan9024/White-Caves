# Business Rules — White Caves CRM Platform

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Purpose:** Defines the core business logic that the platform must enforce

---

## BR-001: Lead Scoring Rules

| Rule ID | Condition | Score Impact |
|---------|-----------|-------------|
| BR-001-A | Budget ≥ AED 3 million | +25 points |
| BR-001-B | Budget AED 1M – 3M | +15 points |
| BR-001-C | Budget < AED 1M | +5 points |
| BR-001-D | Timeline: "Urgent" (< 1 month) | +20 points |
| BR-001-E | Timeline: "1–3 months" | +15 points |
| BR-001-F | Timeline: "3–6 months" | +10 points |
| BR-001-G | Timeline: "Future / Exploring" | +0 points |
| BR-001-H | Lead activity in last 3 days | +15 points |
| BR-001-I | Lead activity in last 7 days | +10 points |
| BR-001-J | Lead activity in last 14 days | +5 points |
| BR-001-K | No activity for 30+ days | −20 points |
| BR-001-L | Source: Referral | +10 points |
| BR-001-M | Source: WhatsApp inbound | +8 points |
| BR-001-N | Source: Property portal | +5 points |
| BR-001-O | Source: Cold call / walk-in | +2 points |

**Score Bands:**
- 90–100 = Hot 🔴 (priority follow-up within 2 hours)
- 60–89 = Warm 🟡 (follow-up within 24 hours)
- 0–59 = Cold 🔵 (weekly nurture cycle)

**Rule:** Score is recalculated automatically whenever any contributing factor changes. Score cannot be manually overridden.

---

## BR-002: Lead Assignment Rules

**BR-002-A: Default Assignment**
- When a lead is created without an assigned agent, the system assigns it using round-robin rotation across agents in the relevant department (Sales for sale leads, Leasing for rental leads).

**BR-002-B: Manual Override**
- Managers and admins can reassign a lead at any time. The reassignment is logged in the activity timeline with reason.

**BR-002-C: Agent Capacity**
- An agent may not be assigned more than 50 active (non-lost, non-won) leads simultaneously. The round-robin skips agents at capacity.

**BR-002-D: Unassigned Lead Alert**
- If a lead remains unassigned for more than 30 minutes, the sales manager receives an in-app notification.

---

## BR-003: Lead Lifecycle Rules

**BR-003-A: Status Progression**
Valid forward transitions:
```
New → Contacted → Qualified → Viewing → Offered → Negotiating → Won
Any status → Lost
Won → (no further transitions)
Lost → New (re-engagement)
```

**BR-003-B: Win Condition**
A lead can only be moved to `Won` when a transaction record in status `Closed` is linked to that lead.

**BR-003-C: Dormant Lead**
If a lead in any active status has no logged activity for 8 days, it is flagged as "Dormant" and the assigned agent receives a reminder notification.

**BR-003-D: Lost Lead Reason**
Moving a lead to `Lost` requires a reason to be selected from: "Budget too low", "Competition won", "Property not found", "No longer interested", "Unresponsive", "Other".

---

## BR-004: Property Listing Rules

**BR-004-A: RERA Permit Mandatory Before Publish**
A property listing cannot be set to status `Available` (published) unless it has a valid `permitNumber` and `permitExpiryDate` in the future.

**BR-004-B: Permit Expiry Auto-Unpublish**
When a property's RERA permit expiry date passes, the property status is automatically changed to `Draft` and the responsible agent is notified.

**BR-004-C: Status Lock on Transaction**
A property linked to a transaction in status `Contract Signed` or later cannot have its status changed to `Available` until the transaction is either Closed or Cancelled.

**BR-004-D: Duplicate DLD Reference**
The system prevents two active properties sharing the same DLD reference number. Archived properties are exempt from this check.

**BR-004-E: Required Media Before Publish**
A property must have at least 3 photos before it can be set to `Available`.

---

## BR-005: Transaction & Commission Rules

**BR-005-A: Commission Calculation (Sale)**
```
Commission = Sale Price × Commission Rate (default 2%)
Broker Share = Commission × Broker Split % (default 50%)
Agent Share = Commission × Agent Split % (default 50%)
```

**BR-005-B: Commission Calculation (Lease)**
```
Annual Rent = Monthly Rent × 12
Commission = Annual Rent × Lease Commission Rate (default 5%)
Broker Share = Commission × Broker Split % (default 50%)
Agent Share = Commission × Agent Split % (default 50%)
```

**BR-005-C: Commission Approval Workflow**
1. Transaction moves to `Closed` → commission record created with status `Pending`
2. Sales Manager reviews and sets status to `Approved`
3. Finance Director processes payment and sets status to `Paid` with payment date

**BR-005-D: Commission Cannot Be Edited After Payment**
Once a commission record status is `Paid`, its amount and split percentages are locked. Changes require a manual journal entry approved by the Finance Director.

**BR-005-E: DLD Fees on Sale**
When a sale transaction is created, the system automatically generates DLD fee line items:
- Transfer fee: 4% of sale price (split: 2% buyer, 2% seller by default, adjustable)
- DLD admin fee: AED 580 (buyer)

**BR-005-F: Minimum Transaction Value**
Transactions below AED 50,000 require manager approval before they can be progressed past the `Offer Made` stage.

---

## BR-006: Rental & Lease Rules

**BR-006-A: Ejari Required for Active Lease**
A lease cannot be moved to `Active` status without an `ejariContractNumber` and `ejariRegistrationDate`.

**BR-006-B: Rent Payment Schedule Generation**
When a lease is activated, the system automatically generates a rent payment schedule for the entire lease term (monthly instalments from start to end date).

**BR-006-C: Late Fees**
If a rent payment is not marked `Paid` within 5 days of its due date:
- Day 5: First reminder WhatsApp sent to tenant
- Day 10: Second reminder sent; flagged in leasing dashboard
- Day 15: Late fee assessed (default: 5% of monthly rent, configurable)
- Day 25: Escalated to Laila (compliance) for potential legal action

**BR-006-D: Security Deposit**
Security deposit must be equivalent to at least 1 month's rent and stored in a separate escrow record.

**BR-006-E: Lease Renewal Window**
60 days before a lease expires, the system creates a renewal task in the leasing agent's dashboard. Renewal must be confirmed or declined by 30 days before expiry.

---

## BR-007: WhatsApp Communication Rules

**BR-007-A: 24-Hour Rule**
WhatsApp Business API allows free-form messages only within a 24-hour session window after the last customer message. Outside this window, only approved templates may be sent.

**BR-007-B: Opt-Out Respect**
If a contact replies "STOP", "Unsubscribe", or equivalent, they are added to the opt-out list and no further outbound messages can be sent until they explicitly re-subscribe.

**BR-007-C: Bot Escalation Threshold**
The Nina bot must escalate to a human agent if:
- The customer explicitly requests a human
- Bot confidence score falls below 60%
- The query involves a price negotiation or contract
- The customer has sent 5+ messages in a row without resolution

**BR-007-D: Template Approval**
All new WhatsApp message templates must be submitted through the WhatsApp Business API approval process before they can be used. Unapproved templates cannot be added to the template library.

---

## BR-008: Compliance & KYC Rules

**BR-008-A: KYC Mandatory for Transactions Above AED 55,000**
Per UAE AML law (Federal Decree Law No. 20 of 2018), Enhanced Due Diligence (EDD) is required for any transaction above AED 55,000. The transaction cannot proceed to `Contract Signed` until KYC is fully verified.

**BR-008-B: Document Retention**
All KYC documents, contracts, and transaction records must be retained for a minimum of 5 years after the transaction date. Deletion is blocked by the system.

**BR-008-C: High-Risk Flag**
A transaction is automatically flagged as "High Risk" if:
- Client nationality is on the FATF high-risk list
- Transaction value is AED 2M or more in cash/cheque
- Same client is party to 3+ transactions within 30 days
- Client's source of funds documentation is missing

High-risk transactions require compliance officer review before proceeding.

**BR-008-D: RERA Broker License Display**
The company RERA broker license number must appear on:
- All exported property reports
- Agent profiles visible to external parties
- WhatsApp template footers (where applicable)

---

## BR-009: User Access & Session Rules

**BR-009-A: Session Timeout**
User sessions expire after 24 hours of inactivity. Users must re-authenticate.

**BR-009-B: Concurrent Sessions**
A user account may have up to 3 active sessions simultaneously (e.g., desktop + mobile). A 4th login from a new device triggers a notification and the oldest session is invalidated.

**BR-009-C: Password Complexity**
Passwords must be at least 8 characters and contain: uppercase, lowercase, digit, and a special character. Passwords cannot be reused (last 5 passwords blocked).

**BR-009-D: Account Lockout**
After 5 consecutive failed login attempts, the account is locked for 30 minutes. After 10 consecutive failures, a manual admin unlock is required.

**BR-009-E: Role Principle of Least Privilege**
Each role is granted only the minimum permissions required for their job function. Any additional access requires a formal request approved by an admin and logged in the audit trail.

---

## BR-010: Data Quality Rules

**BR-010-A: Phone Number Format**
All phone numbers must be stored in E.164 format (+971XXXXXXXXX for UAE). The UI formats numbers for display but stores in E.164.

**BR-010-B: Currency**
AED is the system default currency. All monetary values are stored in AED in the database. Display conversion to other currencies uses real-time exchange rates with the disclaimer: "Approximate conversion — for reference only".

**BR-010-C: Deduplication**
Before creating a new client, lead, or tenant record, the system checks for an existing record with the same phone number. If found, the user is prompted to merge or proceed with a duplicate.

**BR-010-D: Soft Delete Policy**
Records are never permanently deleted. They are soft-deleted (hidden from UI) and retained in the database. Hard deletion requires written approval from the Managing Director and a DBA operation.

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Product & Legal Teams
