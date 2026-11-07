# Agent & Staff Onboarding Workflow — White Caves CRM Platform

> **Version:** 1.0 | **Date:** March 2026

---

## Overview
This document defines the workflow for onboarding new sales agents, leasing agents, and admin staff into the White Caves CRM system.

---

## 1. New Agent Onboarding — Full Flowchart

```
[HR Creates Offer Letter]
         │
         ▼
[New Agent Accepts & Signs Contract]
         │
         ▼
[HR Submits CRM Access Request]
│ Required info: Full name, email, role, department, phone
│ Tool: Admin → User Management → Add User
         │
         ▼
[System Creates Account with status=pending_approval]
│ Auto-generated temporary password
│ System sends welcome email with login link
         │
         ▼
[Admin Approves Account]
│ Admin navigates to User Management → Pending
│ Verifies identity + role selection
│ Sets: status=active, role=agent (or specified role)
         │
         ▼
[RERA BRN Verification (if licensed agent)]
│ Compliance Officer checks RERA portal
│ Enters BRN in agent profile
│ Sets credential_verified = true
│ Sets BRN expiry date
│ Agent cannot list properties until BRN verified
         │
         ▼
[IT/Admin Setup Checklist]
│ ☐ CRM account active and correct role
│ ☐ WhatsApp business number assigned (if applicable)
│ ☐ PropertyFinder/Bayut profile linked
│ ☐ Company email signature configured
│ ☐ Business cards ordered
│ ☐ Access to team WhatsApp group
         │
         ▼
[CRM Onboarding Training]
│ Day 1: System walkthrough (2 hours)
│   - Login + profile setup
│   - Lead capture and management
│   - WhatsApp inbox usage
│   - Activity logging
│ Day 2: Role-specific training (1 hour)
│   - Sales agents: Pipeline + commission tracking
│   - Leasing agents: Tenant management + Ejari
│ Day 3: Compliance training (1 hour)
│   - KYC requirements
│   - AML obligations
│   - RERA compliance rules
│   - Data privacy (PDPL)
         │
         ▼
[Buddy Assignment]
│ New agent paired with experienced agent for first 30 days
│ Buddy reviews first 5 leads created by new agent
│ Buddy validates first 2 property listings
         │
         ▼
[First 30-Day Checklist Review]
│ Manager reviews with new agent at Day 30:
│ ☐ 20+ leads created
│ ☐ At least 1 completed activity per lead
│ ☐ Pipeline updated daily
│ ☐ No compliance flags raised
│ ☐ RERA BRN verified (if required)
│ ☐ 2FA enabled on CRM account
         │
         ▼
[Full Active Status Confirmed]
         │
         ▼
[Ongoing: Quarterly Performance Review via CRM]
```

---

## 2. Off-boarding Workflow (Departing Staff)

```
[Resignation / Termination Notice]
         │
         ▼
[Manager Notifies HR + Admin]
         │
         ▼
[Day of Departure — Admin Actions in CRM]
│ ☐ Disable account: status = inactive
│ ☐ Reassign all open leads to another agent
│ ☐ Reassign all active tenancies
│ ☐ Reassign all pending commissions for review
│ ☐ Revoke WhatsApp number assignment
│ ☐ Remove from team groups
│ ☐ Document: note in user profile "departed YYYY-MM-DD"
         │
         ▼
[HR Compliance Checklist]
│ ☐ Equipment returned
│ ☐ RERA transfer (if license in company name)
│ ☐ Final commission payment processed
│ ☐ NDA reminder + data return confirmation
│ ☐ Access audit log reviewed (last 90 days)
         │
         ▼
[Account Preserved for Audit Trail]
│ Account never deleted — status=inactive
│ All historical activities, leads, commissions retained
│ Required for: AML 5-year retention + commission dispute resolution
```

---

## 3. Role Change Workflow

```
[Manager Requests Role Change]
│ e.g., Agent → Senior Agent or Leasing Agent → Leasing Manager
         │
         ▼
[Admin Updates Role in CRM]
│ User Management → Edit User → Role dropdown
│ New permissions take effect immediately after next login
         │
         ▼
[Notification Sent to User]
│ In-app notification + email
│ "Your role has been updated to [role]"
         │
         ▼
[Brief re-orientation if significant permissions change]
│ (e.g., agent → manager: commission approval walkthrough)
```

---

## 4. System Access by Role — Quick Reference

| Role | Key CRM Access |
|------|---------------|
| `agent` | Own leads, own commissions, property inventory (read) |
| `senior_agent` | Own leads + assigned team leads, mentor mode |
| `manager` | All leads, all commissions, team performance |
| `leasing_agent` | Tenant management, own leases |
| `leasing` | All tenancies, Ejari management |
| `finance` | All commissions, financial reports, P&L |
| `compliance` | KYC queue, AML alerts, RERA compliance |
| `admin` | User management, system settings |
| `owner` | Full access to all modules |

---

**Version:** 1.0 | **Date:** March 2026
