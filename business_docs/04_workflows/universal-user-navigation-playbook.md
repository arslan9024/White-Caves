# Universal User Navigation Playbook
**White Caves Real Estate LLC — Internal Operations Manual**  
**Version:** 2026.07.27 | **Author:** AEGIS 2.0 | **Palette:** #EF4444 | #FFFFFF | #1E293B

---

## 1. Purpose & Scope

This playbook defines the canonical user navigation journey across the White Caves platform — from the public homepage through the authenticated Profile gate and into the role-gated CRM dashboard. It is the permanent institutional reference for all future frontend engineering sessions, preventing regression drift in navigation routing logic.

---

## 2. User Persona Taxonomy

| Access Level | Persona               | Primary Entry Point          | Data Visibility                          |
|--------------|-----------------------|------------------------------|------------------------------------------|
| **5 (MASTER)**   | Managing Director / Founder | `/profile` → `/crm/executive` | All 10 departments, global cash-flow, impersonation toggle |
| **4**        | VP / Department Head  | `/crm/{dept}`                | Own dept + cross-dept read               |
| **3**        | Senior Broker / Manager | `/crm/sales`               | Own leads + dept-level targets           |
| **2**        | Associate Broker / Agent | `/crm/sales`              | Personal pipeline + calendar only        |
| **1**        | Client / Tenant / Landlord | `/portal`              | Own property units, Ejari, maintenance   |

---

## 3. Core Business Workflows

### 3.1 Tenant Journey
```
[Public Homepage] → [Property Search] → [Property Detail Page]
       ↓
[WhatsApp Inquiry / Lead Form Submission]
       ↓
[Agent Routes Lead → Showing Calendar Booking]
       ↓
[Offer Accepted] → [Ejari Registration (Form A + Tenancy Contract)]
       ↓
[Tenant Portal Access (LEVEL_1)] → [View Ejari | Maintenance Tickets | Form 7 Notices]
```

### 3.2 Landlord Journey
```
[Landlord Onboarding Form] → [KYC / Title Deed Upload]
       ↓
[Property Listing Created in CRM] → [RERA Permit Verification]
       ↓
[Agent Assigned to Property] → [Viewing Management]
       ↓
[Landlord Portal Access (LEVEL_1)] → [View Active Listings | Rental Income | Maintenance Status]
```

### 3.3 Agent (LEVEL_2/3) Daily Workflow
```
[Login → Profile Page] → [Dashboard Redirects to /crm/sales]
       ↓
[Personal Kanban Board loads: New → Contacted → Negotiation → Closed]
       ↓
[Lead Detail Modal] → [Log Action Notes] → [Schedule Viewing via Calendar]
       ↓
[Close Deal] → [Commission Split Auto-Calculated] → [Ledger Entry Created]
       ↓
[Leaderboard Position Updates in real-time]
```

### 3.4 Managing Director (LEVEL_5_MASTER) "Lion Deck" Workflow
```
[arslanmalikgoraha@gmail.com Login]
       ↓ ← FOUNDER SHORT-CIRCUIT BYPASS
[ProfilePage.tsx] → [LEVEL_5_MASTER session injected via authSlice]
       ↓
[Universal Top Nav: Full Controls + Impersonation Dropdown Visible]
       ↓
[UnifiedWorkspaceLayout: Left sidebar expands ALL 10 departments]
       ↓
[UnifiedDashboardPage Variant 1: God-Mode Deck]
  ├─ Global Cash-Flow Strip (Total AED 42.85M)
  ├─ 4-Column Kanban Board (ALL agents' leads visible)
  ├─ Apex Leaderboard Podium (all broker rankings)
  ├─ Employee CRUD Lifecycle Manager (Add/Deactivate staff)
  └─ Ghost Session Impersonation (simulate any user's viewport)
```

---

## 4. Branding & UI Rules

- **Primary CTA / Active Menu Highlight:** `#EF4444` (White Caves Red)
- **Background Canvas:** `#FFFFFF` (Brilliant Crisp White)
- **Body Text / Sidebar Headers:** `#1E293B` (Deep Slate Gray)
- **Hover states:** Red with 10% opacity background (`rgba(239,68,68,0.1)`)
- **Typography:** Inter (Google Fonts), fallback: system-ui, -apple-system
- **PROHIBITED:** Any emerald greens, gold/amber colors, or deep obsidian panels

---

## 5. Navigation Zone Mapping

| Zone            | URL Pattern        | Layout Shell Used               | Sidebar? |
|-----------------|--------------------|---------------------------------|----------|
| Public Zone     | `/`, `/about`, `/properties` | `PublicLayout.tsx`     | No       |
| Auth Zone       | `/signin`, `/signup` | Standalone auth form           | No       |
| Profile Zone    | `/profile`         | `UnifiedWorkspaceLayout.tsx`    | Yes (condensed) |
| CRM Zone        | `/crm/*`           | `UnifiedWorkspaceLayout.tsx`    | Yes (full)  |
| Client Portal   | `/portal`          | `UnifiedWorkspaceLayout.tsx`    | Hidden   |

---

## 6. RBAC Gate Logic (Quick Reference)

```typescript
// Access level guard pattern (from src/config/rbacConfiguration.ts)
const isMaster = user.accessLevel === 5 || user.email === 'arslanmalikgoraha@gmail.com';
const isAgent  = user.accessLevel === 2 || user.accessLevel === 3;
const isClient = user.accessLevel === 1;

if (isMaster) → render Variant 1 (God-Mode Deck)
if (isAgent)  → render Variant 2 (Filtered Pipeline)
if (isClient) → render Variant 3 (Portal Shield)
```

---

## 7. Related Files (Canonical Source of Truth)

| Purpose                  | File Path                                               |
|--------------------------|---------------------------------------------------------|
| Flowcharts               | `software_docs/architecture/UNIVERSAL_NAVIGATION_FLOWCHARTS.md` |
| Dashboard Entry Page     | `src/pages/crm/UnifiedDashboardPage.tsx`                |
| RBAC Config              | `src/config/rbacConfiguration.ts`                       |
| Top Nav Component        | `src/components/navigation/TopNavbar.tsx`               |
| Workspace Context        | `src/context/WorkspaceContext.tsx`                      |
| Personnel Mock DB        | `src/mocks/companyMasterLedger.json`                    |
| CSS Layout Tokens        | `src/layouts/DashboardComponents.css`                   |
