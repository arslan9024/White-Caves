<!-- markdownlint-disable MD022 MD025 MD032 MD034 MD060 -->

# User Acceptance Testing (UAT) Scenarios
# White Caves CRM Platform

**Status:** Active / UAT Baseline (expanding to scenario-library posture)  
**Owner:** QA & Business Acceptance Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** UAT lane baseline (paired with scenario library)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend reliability/accessibility and release-readiness lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

> **Document ID:** WC-UAT-001  
> **Version:** 1.0  
> **Date:** March 2026  
> **Participants:** Business stakeholders, department heads, key users

## Canonical scenario expansion bridge

This UAT pack is the practical acceptance baseline for business signoff. Broader scenario-scale governance (including exception/regression/compliance scenario growth) is maintained in the canonical scenario library:

- [`../16_scenario_library/README.md`](../16_scenario_library/README.md)
- [`../16_scenario_library/SCENARIO_LIBRARY_MASTER_INDEX_2026-08-03.md`](../16_scenario_library/SCENARIO_LIBRARY_MASTER_INDEX_2026-08-03.md)
- [`../16_scenario_library/SCENARIO_TRACEABILITY_MATRIX_SEED_2026-08-03.md`](../16_scenario_library/SCENARIO_TRACEABILITY_MATRIX_SEED_2026-08-03.md)

Future wave updates should keep this file focused on business-user acceptance flows while publishing deep scenario-scale expansions in the scenario-library lane.

---

## UAT Overview

UAT validates that the system meets real business needs from the end-user perspective. Unlike technical tests, UAT is performed by business users — not developers — using real-world scenarios in the staging environment.

**UAT Sign-off Required From:**
- Managing Director (Zoe — Executive view)
- Sales Manager (Pipeline + commission approval)
- Leasing Manager (Tenancy + Ejari)
- Finance Director (Theodora — commission + reporting)
- Compliance Officer (Laila — KYC + RERA)

---

## UAT Environment Details

| Item | Value |
|------|-------|
| URL | https://staging.whitecaves.ae |
| Test data prefix | `[UAT]` |
| UAT period | 5 business days before each major release |
| Sign-off form | Shared via email after UAT completion |

---

## UAT Scenarios by Role

---

### 👤 SALES AGENT — UAT Scenarios

#### UAT-SA-001: Capture a New Walk-In Lead
**Business Goal:** Log a new lead within 60 seconds of a client walking in.  
**Steps:**
1. Log in as a sales agent
2. Click "New Lead" button
3. Enter: Name = "[UAT] Ahmed Al-Rashidi", Phone = +971501234567, Source = Walk-in
4. Enter Budget = AED 2,500,000, Property Type = Villa, Timeline = Urgent
5. Click Save
6. Verify lead appears in "New" column of pipeline
7. Verify a score ≥ 70 is shown (urgent + high budget = high score)

**Expected Result:** Lead created in under 60 seconds; score ≥ 70; appears in agent's list.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL  
**Notes:** ____________________________________

---

#### UAT-SA-002: Update Lead Status After First Call
**Business Goal:** Log a call and move lead to "Contacted" status.  
**Steps:**
1. Open the lead created in UAT-SA-001
2. Click "Log Activity" → Type = Call
3. Enter description: "Discussed 3BR villa in DAMAC Hills 2, budget confirmed"
4. Mark outcome = "Interested"
5. Change lead status to "Contacted"
6. Verify activity appears in timeline with timestamp

**Expected Result:** Activity logged; status changed; timeline updated.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-SA-003: Find a Matching Property and Send to Client
**Business Goal:** Find a matching property and share it with the lead.  
**Steps:**
1. Open the lead from UAT-SA-001
2. Click "Find Properties" or navigate to Property Inventory
3. Filter: Type = Villa, Min Price = 2M, Max Price = 3M, Beds ≥ 3
4. Select a property
5. Copy property link
6. Navigate to WhatsApp inbox
7. Find or create conversation with the client's phone
8. Paste and send the property link

**Expected Result:** Property found and link shareable via WhatsApp.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-SA-004: Set a Follow-up Reminder
**Steps:**
1. Open a lead
2. Click "Set Reminder"
3. Set date = tomorrow, time = 10:00 AM, note = "Call to confirm viewing"
4. Save reminder
5. Verify reminder shows in lead header
6. Verify reminder appears in "My Tasks" or reminder list

**Expected Result:** Reminder saved and visible.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-SA-005: View My Commission Summary
**Steps:**
1. Navigate to My Commissions or Finance section
2. Verify only own commissions are shown
3. Verify totals: This Month, This Quarter, YTD
4. Check status of one commission (should show Pending, Approved, or Paid)

**Expected Result:** Agent can see own commissions only.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

### 👤 SALES MANAGER — UAT Scenarios

#### UAT-SM-001: Review Team Pipeline
**Business Goal:** See all active team leads in pipeline at a glance.  
**Steps:**
1. Log in as Sales Manager
2. Navigate to Clara CRM → Pipeline View
3. Verify leads from ALL agents are visible (not just own)
4. Filter by status = "Negotiating"
5. Verify only Negotiating leads shown
6. Click on one lead → verify full detail accessible

**Expected Result:** Manager sees full team pipeline; filters work.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-SM-002: Identify and Reassign a Stalled Lead
**Business Goal:** Reassign a dormant lead to a more available agent.  
**Steps:**
1. In lead list, sort by "Last Activity" (oldest first)
2. Identify a lead with no activity for 8+ days
3. Click "Reassign" on the lead
4. Select a different agent from the dropdown
5. Enter reassignment reason
6. Save
7. Verify lead now shows the new agent

**Expected Result:** Reassignment saved; activity logged showing the change.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-SM-003: Approve a Commission
**Business Goal:** Review and approve an agent commission record.  
**Steps:**
1. Navigate to Finance → Commissions
2. Filter by Status = "Pending"
3. Click on one commission to view details
4. Verify: transaction reference, property, agent, amount, split breakdown
5. Click "Approve"
6. Confirm in dialog
7. Verify status changes to "Approved"
8. Verify agent would receive notification (check notification indicator)

**Expected Result:** Commission approved; status = Approved.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-SM-004: Download Agent Performance Report
**Steps:**
1. Navigate to Agent Performance
2. Select date range: Last Month
3. Verify table shows all agents with: leads handled, deals closed, value, conversion rate
4. Click Export → Excel
5. Verify file downloads with correct data

**Expected Result:** Report downloaded with all agents and correct metrics.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

### 👤 LEASING AGENT — UAT Scenarios

#### UAT-LA-001: Create a Tenant Application
**Steps:**
1. Log in as Leasing Agent
2. Navigate to Daisy CRM → Tenants
3. Click "New Tenant Application"
4. Fill in: Name = "[UAT] Fatima Al-Hashim", Phone = +971502345678, Nationality = UAE
5. Upload (or simulate): Emirates ID front/back, Passport
6. Set Employment Status = Employed, Employer = Dubai Municipality
7. Save
8. Verify tenant appears with KYC Status = "Pending"

**Expected Result:** Tenant application created; KYC pending.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-LA-002: View Active Leases and Expiry Dates
**Steps:**
1. Navigate to Daisy CRM → Leases
2. Verify list shows all active leases
3. Verify columns: Tenant, Property, Monthly Rent, Start Date, End Date, Ejari Status
4. Sort by End Date (ascending) to see soonest expiries
5. Identify leases expiring within 60 days
6. Verify these are highlighted or flagged

**Expected Result:** Lease list with expiry visibility; expiring leases highlighted.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-LA-003: Check Maintenance Requests
**Steps:**
1. Navigate to Daisy CRM → Maintenance
2. Verify list of maintenance requests with: tenant, property, category, priority, status
3. Filter by Status = "Open" and Priority = "Urgent"
4. Open a request and view details
5. Assign to a contractor
6. Change status to "In Progress"

**Expected Result:** Maintenance module works end-to-end.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

### 👤 FINANCE DIRECTOR — UAT Scenarios

#### UAT-FD-001: Monthly Commission Processing
**Steps:**
1. Log in as Finance Director
2. Navigate to Finance → Commissions
3. Filter by Status = "Approved"
4. Select all approved commissions for the current month
5. Click "Bulk Mark as Paid"
6. Enter payment date and method = "Bank Transfer"
7. Confirm
8. Verify all selected commissions status = "Paid"

**Expected Result:** Bulk payment processing works; all selected commissions marked paid.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-FD-002: Generate Monthly Financial Summary
**Steps:**
1. Navigate to Finance → Summary Dashboard
2. Select Period = "Last Month"
3. Verify KPIs are present: Revenue, Commissions Paid, Pending Commissions, Rental Income
4. Verify Revenue trend chart shows last 12 months
5. Export to PDF
6. Verify PDF contains company branding and correct numbers

**Expected Result:** Financial dashboard loads with correct data; PDF exports correctly.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

### 👤 COMPLIANCE OFFICER — UAT Scenarios

#### UAT-CO-001: RERA Compliance Dashboard Review
**Steps:**
1. Log in as Compliance Officer
2. Navigate to Compliance Dashboard (Laila)
3. Verify overall compliance score is displayed
4. Verify sections: Property Permits, Agent Credentials, KYC Coverage
5. Click on any non-compliant item to drill down
6. Verify specific listings or agents with issues are listed

**Expected Result:** Compliance dashboard works and drills down correctly.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-CO-002: Review a KYC Application
**Steps:**
1. Navigate to Compliance → KYC Review queue
2. Find tenant "[UAT] Fatima Al-Hashim" created in UAT-LA-001
3. Review uploaded documents
4. Add a compliance note
5. Change KYC status to "Verified"
6. Verify the tenant record shows KYC = Verified

**Expected Result:** KYC review workflow functional.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

### 👤 OWNER / MANAGING DIRECTOR — UAT Scenarios

#### UAT-OW-001: Executive Dashboard Overview
**Steps:**
1. Log in as Owner
2. Navigate to Zoe Executive Dashboard
3. Verify all KPIs visible: Hot Leads, Pipeline Value, Revenue MTD, Occupancy Rate
4. Switch period to "This Quarter"
5. Verify numbers update
6. Click on "Hot Leads" card to drill down to lead list
7. Navigate back to dashboard

**Expected Result:** Executive dashboard provides full business overview.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

#### UAT-OW-002: Access All Department CRMs
**Steps:**
1. Verify Owner can access: Clara (Sales), Daisy (Leasing), Nadia (WhatsApp), Theodora (Finance), Laila (Compliance), Aurora (Tech)
2. Navigate to each section and confirm data is visible
3. Verify Owner cannot accidentally delete critical data (UI confirmation guards)

**Expected Result:** All CRM sections accessible to owner.  
**Acceptance Criteria:** ✅ PASS / ❌ FAIL

---

## UAT Sign-off Form

| Role | Name | Date | Status | Notes |
|------|------|------|--------|-------|
| Sales Manager | | | ☐ Pass ☐ Fail ☐ Pass with issues | |
| Leasing Manager | | | ☐ Pass ☐ Fail ☐ Pass with issues | |
| Finance Director | | | ☐ Pass ☐ Fail ☐ Pass with issues | |
| Compliance Officer | | | ☐ Pass ☐ Fail ☐ Pass with issues | |
| Managing Director | | | ☐ Pass ☐ Fail ☐ Pass with issues | |

**Overall UAT Result:** ☐ APPROVED FOR RELEASE  ☐ CONDITIONAL APPROVAL  ☐ RELEASE BLOCKED

**Sign-off Authority:** ________________________________ (Managing Director)  
**Date:** _____________

---

**Document ID:** WC-UAT-001 | **Version:** 1.0 | **Date:** March 2026
