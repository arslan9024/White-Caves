# 10 — Nancy · HR Manager

> **ID:** `nancy`  
> **Department:** Operations  
> **Title:** Human Resources Manager  
> **Color:** `#F97316` (Orange)  
> **Avatar:** 👩‍💼  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/NancyHRCRM_NEW/`  
> **Access:** Managing Director, HR Manager, Agent (own profile only)

---

## 1. Overview

Nancy manages all **human capital operations** for White Caves. She handles the employee lifecycle from job posting and candidate screening to onboarding, performance management, attendance, and offboarding. She is the bridge between the business leadership and the 29-role agent team.

---

## 2. Core Responsibilities

1. Manage employee records for all staff
2. Recruitment: job postings, application intake, CV screening, interview scheduling
3. Onboarding: welcome checklist, document collection, system access provisioning
4. Performance reviews: quarterly goal-setting and review cycles
5. Attendance and leave management
6. Offboarding: exit interview, account deactivation, final settlement calculation

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Employee directory | Full profile: name, role, department, join date, contact, RERA card |
| Recruitment pipeline | Job posting → applicant tracking → interview → offer → onboarding |
| CV bank | Store and search CVs by role, experience, language |
| Onboarding checklist | Auto-generated task list for new hires (16 standard tasks) |
| Performance goals | Quarterly OKRs per employee; progress tracking |
| Attendance log | Manual entry or integration with access control |
| Leave management | Annual, sick, emergency leave; balances + approval workflow |
| RERA registration | Track RERA card numbers and renewal dates for all agents |
| Payroll export | Export monthly payroll data to Excel for finance processing |
| Org chart | Visual hierarchy of all 29 roles |

---

## 4. How It Works — End to End

### Step 1 — Job Posting
HR manager creates job posting → `POST /api/jobs` → published on careers page (`/careers`). Candidates submit via `POST /api/jobs/:id/apply`.

### Step 2 — Applicant Screening
Applications appear in Nancy's recruitment pipeline. CV attached (PDF upload via Multer). HR manager rates applicants (1–5 stars) and moves them through stages: Applied → Screening → Interview → Offer → Hired / Rejected.

### Step 3 — Interview Scheduling
HR schedules interview → `POST /api/interviews` → calendar event created → candidate receives WhatsApp confirmation via Nadia.

### Step 4 — Onboarding
Applicant moved to `hired` → `POST /api/employees` creates employee record. Onboarding checklist auto-generated: collect Emirates ID, set up email, assign CRM role, RERA card upload, assign manager.

### Step 5 — Performance Review
Quarterly: HR creates review cycle → each employee + manager fills in goal progress → final rating submitted → stored against employee record.

### Step 6 — Attendance
Daily: agent checks in/out (manual entry or biometric integration) → `POST /api/attendance`. Monthly summary auto-calculated.

### Step 7 — Leave Request
Employee submits leave → `POST /api/leave-requests` → manager approves/rejects → calendar updated → attendance adjusted.

### Step 8 — Offboarding
HR initiates offboarding → checklist: collect equipment, revoke CRM access, close email → `PATCH /api/employees/:id { status: 'terminated' }` → user account deactivated.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/employees` | List all employees |
| POST | `/api/employees` | Create employee record |
| PATCH | `/api/employees/:id` | Update employee profile |
| GET | `/api/jobs` | List job postings |
| POST | `/api/jobs` | Create job posting |
| POST | `/api/jobs/:id/apply` | Submit job application |
| GET | `/api/jobs/:id/applications` | List applications for a job |
| POST | `/api/leave-requests` | Submit leave request |
| GET | `/api/attendance` | Get attendance records |
| GET | `/api/hr/payroll-export` | Download monthly payroll CSV |

---

## 6. Data Flows

- **Receives from:** Job portal (applications), Nadia (interview confirmation), manager approvals
- **Sends to:** Aurora (new user system access), Nadia (HR comms), Theodora (payroll data), Zoe (team size KPI)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `NancyHRCRM_NEW` | `src/components/owner/ai/NancyHRCRM_NEW/` | ✅ Exists |
| Employee directory | Inside `NancyHRCRM_NEW` | ✅ Exists (mock) |
| Recruitment pipeline | Inside `NancyHRCRM_NEW` | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| Agents/Employees | `server/routes/agents.ts` | ✅ Exists (partial) |
| Job Applications | `server/routes/` | 🔲 Planned (501 stub) |
| Leave management | `server/routes/leave.ts` | 🔲 Planned |
| Payroll export | `server/services/PayrollService.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Access |
|---|---|
| `managing_director` | Full HR access |
| `hr_manager` | Full HR access |
| `manager` | Team members only |
| `agent` | Own profile, leave requests |

---

## 10. Implementation Checklist

- [x] `NancyHRCRM_NEW` renders (mock data)
- [x] Agents CRUD (`server/routes/agents.ts`)
- [ ] Wire frontend to live `/api/agents`
- [ ] Job applications endpoint (currently 501 stub)
- [ ] Leave request model + CRUD
- [ ] Attendance logging
- [ ] Onboarding checklist auto-generation
- [ ] Payroll export (CSV/Excel)
- [ ] RERA card tracking fields on User model

---

## 11. Dependencies

- Aurora (system access provisioning on hire/terminate)
- Nadia (interview/onboarding WhatsApp messages)
- Theodora (payroll data consumer)
- `multer` (CV upload, Phase 6)
- `exceljs` (payroll export, Phase 7)

---

## 12. Future Enhancements

- AI CV scoring against job description (GPT-4)
- Biometric attendance integration (Phase 10)
- Training module management
- Employee self-service mobile portal (Phase 10 PWA)
