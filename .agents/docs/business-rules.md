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

---

## Business Rule Metadata Reference

Each rule has the following governance attributes for regulatory traceability and audit purposes.

| Rule ID | Category | Source Regulation | Exception Handling | Last Reviewed |
|---------|----------|------------------|--------------------|---------------|
| BR-001 | Lead Scoring | Internal Policy — Sales Operations Manual v1.0 | Manager can flag a lead as "Manually Hot" via override button (logged with reason in audit trail) | March 2026 |
| BR-002 | Lead Assignment | Internal Policy — HR Operations | Admin can bypass round-robin and directly assign (logged in activity trail) | March 2026 |
| BR-003 | Lead Lifecycle | Internal CRM Policy | Re-opening a Won deal requires MD approval; logged in audit trail | March 2026 |
| BR-004 | Property Compliance | RERA Circular No. 4/2021 | Zero tolerance — no exception for unpermitted listings (AED 100,000 fine per advert) | March 2026 |
| BR-005 | Commission | Internal Finance Policy + RERA Agency Rules | Commission rate adjustable per deal with Sales Manager approval; logged and auditable | March 2026 |
| BR-006 | Rental & Lease | Dubai Decree No. 26/2013 (Ejari) + RERA Rental Rules | Security deposit waiver requires MD written approval for institutional tenants | March 2026 |
| BR-007 | WhatsApp Comms | Meta Business API Terms + UAE Telecom Regulations | No exception to 24-hour window rule — Meta policy is legally binding | March 2026 |
| BR-008 | KYC/AML | UAE Federal Decree Law No. 20/2018 + FATF Recommendations | No exception for AED 55,000 threshold — EDD is mandatory by law | March 2026 |
| BR-009 | User Access | Internal Security Policy + UAE PDPL Art. 5 | Admin can extend session for specific operations with documented approval | March 2026 |
| BR-010 | Data Quality | UAE PDPL + Internal Data Governance | Hard delete requires MD written approval + Legal review + DBA operation | March 2026 |

---

## Acceptance Criteria by Existing Rule

### BR-001 Lead Scoring — Acceptance Criteria
- **Given** an agent updates a lead's budget from AED 800K to AED 3.5M, **When** the lead is saved, **Then** the score increases by the correct delta (BR-001-B vs BR-001-C) within 1 second
- **Given** a lead has had no activity for 31 days, **When** the nightly score job runs, **Then** the score decreases by 20 points (BR-001-K) and lead is flagged "Dormant"
- **Given** a lead score reaches 90+, **When** recalculated, **Then** a "Hot Lead 🔴" notification is sent to the assigned agent within 1 minute via in-app notification
- **Given** score is manually overridden (exception path), **When** the override is saved, **Then** audit trail records: userId, original score, override score, reason, timestamp
- **Test Reference:** TC-BR-001

### BR-002 Lead Assignment — Acceptance Criteria
- **Given** a new lead is created without an assigned agent, **When** the lead is saved, **Then** it is assigned to the next agent in round-robin rotation within 30 seconds
- **Given** an agent has exactly 50 active leads, **When** new leads are created via round-robin, **Then** that agent is skipped and the next agent in rotation is assigned
- **Given** a lead remains unassigned for 30 minutes, **When** the assignment check runs, **Then** sales manager receives in-app notification: "Unassigned lead: [lead name] — created 30 minutes ago"
- **Test Reference:** TC-BR-002

### BR-004 Property Listing — Acceptance Criteria
- **Given** `permitNumber` is null, **When** an agent tries to set property status to "Available", **Then** the action is blocked with error "RERA Trakheesi Permit number required before publishing (Penalty: AED 50,000)"
- **Given** `permitExpiryDate` is today at 23:59, **When** midnight passes and the nightly job runs, **Then** property status changes to "Draft" and WhatsApp + email notification sent to agent
- **Given** a property has fewer than 3 photos, **When** publish is attempted, **Then** error displayed: "Minimum 3 photos required before publishing"
- **Test Reference:** TC-BR-004

### BR-005 Commission — Acceptance Criteria
- **Given** a sale price of AED 1,500,000 with 2% rate and 50/50 split, **When** the transaction closes, **Then** commission record shows: Total = AED 30,000; Broker = AED 15,000; Agent = AED 15,000
- **Given** a commission is in "Paid" status, **When** any user attempts to edit the commission amount, **Then** system returns HTTP 403 "Commission record locked after payment"
- **Given** DLD fees are calculated on a AED 2,000,000 sale, **When** fee breakdown is displayed, **Then** Transfer Fee = AED 80,000 (4%) and DLD Admin = AED 580
- **Test Reference:** TC-BR-005

### BR-006 Rental & Lease — Acceptance Criteria
- **Given** a lease has no `ejariContractNumber`, **When** status change to "Active" is attempted, **Then** system returns validation error: "Ejari registration required (Dubai Decree 26/2013)"
- **Given** a rent payment is 5 days overdue, **When** the daily overdue check runs, **Then** WhatsApp reminder is sent to tenant and "Overdue 🔴" flag appears on lease dashboard
- **Given** lease expiry is 60 days away, **When** the renewal job runs, **Then** a renewal task is created in the leasing agent's dashboard with alert: "[Tenant] lease expires in 60 days"
- **Test Reference:** TC-BR-006

### BR-008 KYC/AML — Acceptance Criteria
- **Given** a transaction value is AED 60,000 (above EDD threshold), **When** the transaction is created, **Then** EDD workflow is auto-triggered and transaction status is set to "KYC Pending" blocking further progression
- **Given** a client nationality is on the FATF high-risk list, **When** the KYC screening runs, **Then** the record is flagged "High Risk 🔴" and Compliance Officer receives in-app notification within 5 minutes
- **Given** a cash payment of AED 55,001 is recorded, **When** the payment is saved, **Then** a Cash Transaction Report is auto-created with status "Pending goAML submission"
- **Test Reference:** TC-BR-008

### BR-009 User Access — Acceptance Criteria
- **Given** a user session is inactive for 24 hours, **When** the user attempts any API call, **Then** the system returns HTTP 401 "Session expired — please log in again"
- **Given** a user attempts a 4th concurrent login, **When** the login succeeds, **Then** the oldest session is invalidated and the user on that session receives: "You have been signed out — new login detected"
- **Given** 5 consecutive failed login attempts occur, **When** the 5th attempt fails, **Then** account is locked for 30 minutes and an alert is sent to the account owner's email
- **Test Reference:** TC-BR-009

---

## BR-011: Commission Split Calculation Rules

**Rule ID:** BR-011  
**Rule Category:** Finance — Commission Management  
**Source Regulation:** RERA Agency Regulations — Broker Remuneration Rules; Internal Finance Policy  
**Last Reviewed:** June 2026

### BR-011-A: Standard Sale Commission Split
```
Gross Commission = Sale Price × Commission Rate (default 2%)
Company Share    = Gross Commission × Company Split % (configurable, default 50%)
Agent Share      = Gross Commission × Agent Split %   (configurable, default 50%)
Constraint: Company Split % + Agent Split % = 100% (validated by system)
```

### BR-011-B: Referral Commission — Tri-Party Split
When a referring external agent is involved:
```
Referral Fee          = Gross Commission × Referral % (max 25%; must be agreed in writing and uploaded)
Remaining Commission  = Gross Commission − Referral Fee
Company Share         = Remaining Commission × Company Split %
Originating Agent Share = Remaining Commission × Agent Split %
```
Referral agreement PDF must be uploaded before the split is applied. System blocks referral fee if no document attached.

### BR-011-C: Co-Broking Split (Internal)
When two White Caves agents co-broker a deal:
```
Combined Agent Pool = Gross Commission × Agent Split %
Agent 1 Share       = Combined Agent Pool × Agent1 Co-Broker %
Agent 2 Share       = Combined Agent Pool × Agent2 Co-Broker %
Constraint: Agent1 % + Agent2 % = 100%
```
Co-broker percentages must be agreed and entered before deal status = "Offer Accepted".

### BR-011-D: Performance Tier Escalator
| Monthly Closed Deals (Calendar Month) | Agent Split Override |
|--------------------------------------|---------------------|
| 1–3 deals | 50% (default) |
| 4–6 deals | 55% |
| 7–10 deals | 60% |
| 11+ deals | 65% |

Tier override is approved by Finance Director; applies to all deals in the qualifying month.

**Acceptance Criteria:**
- **Given** a sale of AED 2,000,000 at 2% commission with default 50/50 split, **When** the deal closes, **Then** Total = AED 40,000; Company = AED 20,000; Agent = AED 20,000
- **Given** a co-broker deal: Agent A (60%), Agent B (40%) on a AED 40,000 agent pool, **When** calculated, **Then** Agent A = AED 24,000; Agent B = AED 16,000
- **Given** referral fee is 20% on a AED 30,000 gross commission, **When** calculated, **Then** Referral = AED 6,000; Remaining = AED 24,000 split per BR-011-A
- **Given** no referral agreement PDF is uploaded, **When** referral fee > 0 is entered, **Then** system blocks with "Referral agreement document required"
- **Test Reference:** TC-BR-011

**Exception Handling:** All split overrides require Finance Director approval before deal reaches "Closed" status. No retroactive split changes after commission status = "Paid".

---

## BR-012: Post-Dated Cheque (PDC) Validity Rules

**Rule ID:** BR-012  
**Rule Category:** Finance — Payment Management  
**Source Regulation:** UAE Federal Decree Law No. 14 of 2020 (Commercial Transactions Law); RERA Rental Payment Rules  
**Last Reviewed:** June 2026

### BR-012-A: PDC Collection for Leases
- Maximum cheques per lease year: 12 (monthly); minimum: 1 (annual lump sum)
- Each PDC covers exactly one rental period; no partial cheques
- All PDCs collected before lease activation (Ejari registration date)
- CRM PDC record fields: `chequeNumber, bankName, bankBranchUAE, amountAED, dueDate, status, imageUrl`

### BR-012-B: PDC Status Lifecycle
```
Scheduled → Presented → Cleared
                      ↘ Bounced → Replaced (new PDC) / Legal Escalation
Cancelled
```

### BR-012-C: Bounced Cheque Procedure
Upon a cheque dishonour notification from the bank:
1. Finance records `status = "Bounced"` immediately on bank notification
2. WhatsApp to tenant within 2 hours: "Your cheque [number] for AED [amount] dated [date] was returned by your bank. Please arrange replacement within 5 business days."
3. Late fee applied: 5% of cheque amount (minimum AED 200)
4. Bank return fee charged to tenant (per bank schedule: typically AED 100–200)
5. Tenant has **5 business days** to replace with new PDC or bank transfer
6. Day 5 (no replacement): Compliance (Laila) initiates formal legal demand letter
7. Under UAE law (Federal Decree 14/2020 Art. 635): bounced cheque is a criminal offence and may be reported to Dubai Police

### BR-012-D: PDC Validity Warning
A cheque presented more than 6 months after its date may be dishonoured by the bank under UAE Cheque Law. System alerts Finance team when a PDC is within 30 days of its 6-month validity limit.

### BR-012-E: Replacement PDC
- Original bounced cheque record status → "Bounced" (preserved for audit — never deleted)
- New PDC created as separate record with field `replacesChequePdcId` linking to original

**Acceptance Criteria:**
- **Given** a PDC is collected with a due date 7 months in the future, **When** the record is saved, **Then** system displays warning: "⚠️ PDC validity may expire (6-month limit) before presentation date"
- **Given** a cheque bounces on Day 1, **When** status is updated to "Bounced", **Then** WhatsApp notification sent to tenant within 2 hours AND late fee record auto-created
- **Given** a tenant has 2+ bounced cheques in the current lease period, **When** the 2nd bounce is recorded, **Then** Compliance Officer receives Critical alert and eviction notice workflow task is auto-created
- **Given** it is Day 5 with no replacement after a bounce, **When** the business-day counter expires, **Then** Laila (Compliance) receives Critical alert "Legal demand letter required for [Tenant]"
- **Test Reference:** TC-BR-012

**Exception Handling:** Cheque waivers (waiving late fees) require Finance Director written approval. Criminal filings (police report) are the exclusive decision of MD in consultation with Legal counsel.

---

## BR-013: RERA Rental Index Compliance Rules

**Rule ID:** BR-013  
**Rule Category:** Leasing — Rent Increase Compliance  
**Source Regulation:** RERA Rental Increase Calculator; Dubai Decree No. 43 of 2013 (Rental Increase Regulation); RERA Annual Rental Index  
**Last Reviewed:** June 2026

### BR-013-A: Maximum Permissible Rent Increase Calculation
Per Dubai Decree No. 43/2013 Schedule of Permissible Increases:
```
Current Rent as % of RERA Index → Maximum Permissible Increase
≥ 90% of RERA Index Price      → 0%  (no increase permitted)
75–89% of RERA Index Price     → 5%
65–74% of RERA Index Price     → 10%
< 65% of RERA Index Price      → 15%
```
Note: In exceptional market conditions RERA may issue circular allowing up to 20% — system must be configurable.

### BR-013-B: RERA Index Data Integration
- RERA index data sourced from RERA's official Rental Index API (or manually updated quarterly if API unavailable)
- Index lookup parameters: community/area, property type, number of bedrooms
- System displays on renewal screen: "RERA Index for this property: AED [amount]/year — Last updated: [date]"
- If index data > 90 days old: system shows warning banner: "⚠️ RERA Index data may be outdated — verify before processing increase"
- If index data unavailable for specific community: any rent increase above 5% requires Compliance Officer approval

### BR-013-C: Rent Increase Notice Requirements
Per UAE Law No. 26 of 2007 (Tenancy Law) Art. 14:
- Landlord must give **90 days written notice** before rent increase effective date
- System auto-calculates: `effective_date = notice_date + 90 calendar days`
- Notice sent via: registered letter (physical) AND WhatsApp (digital record both logged in CRM)
- CRM auto-generates **RERA Form 7** (Rent Increase Notice) pre-populated with:
  - Current registered rent (from Ejari), proposed rent, increase %, RERA index reference, effective date, both party details

### BR-013-D: Tenant Right to Request Rent Reduction
If current rent is more than 10% above RERA market index at renewal, tenant has the right to request a rent reduction. System flags this scenario:
- Alert to Leasing Manager: "Market rate has dropped — current rent may be challengeable by tenant"
- Proactive notification to Landlord recommended

**Acceptance Criteria:**
- **Given** current rent is AED 80,000/year and RERA index for that unit is AED 100,000/year (80% of index), **When** renewal is initiated, **Then** system shows "Maximum permissible increase: 5%"; any proposed rent above AED 84,000 is blocked with validation error
- **Given** a rent increase notice is generated, **When** the notice date is set, **Then** effective date = notice date + 90 days; system blocks sending notice if effective date < 90 days away from today
- **Given** RERA index data is stale (> 90 days old), **When** a renewal screen is opened, **Then** system displays amber warning banner "⚠️ RERA Index data may be outdated"
- **Given** current rent is 60% of RERA index, **When** renewal is processed, **Then** system shows "Maximum permissible increase: 15%" and RERA index comparison tool shows the gap
- **Test Reference:** TC-BR-013

**Exception Handling:** Any rent increase above the RERA maximum requires written consent from both landlord and tenant PLUS Compliance Officer review. System requires document upload and CO approval before allowing the exception.

---

**Version:** 1.2 | **Last Updated:** June 2026 | **Maintained By:** Product & Legal Teams  
**Change Log:** v1.1 — Added rule metadata reference table and acceptance criteria for BR-001 to BR-010 (June 2026); v1.2 — Added BR-011 (Commission Split), BR-012 (PDC Validity), BR-013 (RERA Rental Index) (June 2026)
