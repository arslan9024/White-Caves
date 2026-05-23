# Change Management Policy — White Caves CRM Platform

> **Document ID:** WC-CHG-001  
> **Version:** 1.0  
> **Date:** March 2026

---

## 1. Purpose

This document defines how changes to the White Caves CRM Platform are requested, assessed, approved, implemented, and tracked. It ensures that:
- No unplanned changes are made to production
- All stakeholders are informed of changes
- Risk is assessed before deployment
- Changes can be rolled back if they cause issues

---

## 2. Change Categories

| Category | Description | Approval Required | Example |
|---------|-------------|------------------|---------|
| **Standard** | Low-risk, pre-approved change type | Team lead sign-off | UI text fix, dependency update |
| **Normal** | Planned, medium-risk change | Product owner + developer sign-off | New feature deployment |
| **Major** | High-impact or architectural change | Product owner + MD sign-off | Database schema change, new integration |
| **Emergency** | Immediate fix for P1 incident | Post-implementation approval | Hotfix for production crash |

---

## 3. Change Request Process

```
[CHANGE IDENTIFIED]
       │
       ▼
[SUBMIT CHANGE REQUEST]
│ Fill in: description, reason, impact, rollback plan
│ Assign: category (Standard/Normal/Major/Emergency)
       │
       ▼
[IMPACT ASSESSMENT]
│ What systems are affected?
│ What is the risk if it fails?
│ What is the rollback plan?
│ Is a maintenance window needed?
       │
       ▼
[APPROVAL]
│ Standard: Team Lead
│ Normal: Product Owner
│ Major: Product Owner + Managing Director
│ Emergency: Post-implementation (within 24 hours)
       │
       ▼
[SCHEDULED & IMPLEMENTED]
│ Implement during approved window
│ Follow deployment runbook
│ Verify after deployment
       │
       ▼
[POST-IMPLEMENTATION REVIEW]
│ Did the change succeed?
│ Any unexpected side effects?
│ Update change log
```

---

## 4. Change Request Template

```
CHANGE REQUEST — WC-CHG-[YYYYMMDD-NNN]
Date: ___________
Requestor: ___________
Category: Standard / Normal / Major / Emergency

Description:
[What change is being made?]

Business Reason:
[Why is this change needed?]

Systems Affected:
[ ] Frontend (React app)
[ ] Backend API
[ ] Database (schema or data)
[ ] Authentication
[ ] Third-party integrations
[ ] Documentation

Risk Assessment:
Risk level: Low / Medium / High
[Describe potential risks]

Test Plan:
[What will be tested before and after the change?]

Rollback Plan:
[Exactly how to revert this change if it fails]

Scheduled Window:
Date: ___________  Time: ___________  Duration: ___________
Is maintenance window needed? Yes / No

Approvers:
Team Lead: ___________  Signed: ___________
Product Owner: ___________  Signed: ___________
MD (Major only): ___________  Signed: ___________

Post-Implementation:
Status: Success / Failed / Partial
Notes: ___________
```

---

## 5. Emergency Changes

In a P1 incident, normal approval process is bypassed:
1. Implement the minimum necessary fix
2. Notify manager immediately (even at off-hours)
3. Document the change within 24 hours using the template above
4. Category = Emergency; note the P1 incident ID
5. Present change at next team meeting for retrospective review

---

## 6. Change Freeze Periods

No changes to production during these periods:
- **Ramadan:** Reduced capacity — standard changes only (no major releases)
- **National Day (Dec 1–3):** Change freeze
- **Eid Al Fitr & Eid Al Adha:** Change freeze during public holiday period
- **Year-end (Dec 28 – Jan 3):** Change freeze
- **During active P1 incidents:** No new changes until incident resolved

---

## 7. Audit Trail

All change requests and approvals are stored in:
- This document folder: `business_docs/15_release_management/`
- Git commit history (every production change must have a meaningful commit message)
- CHANGELOG.md

---

**Document ID:** WC-CHG-001 | **Version:** 1.0 | **Date:** March 2026
