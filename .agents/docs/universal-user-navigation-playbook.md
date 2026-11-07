# Universal User Navigation Playbook — White Caves Real Estate LLC

## Purpose
This playbook defines the standardized user navigation workflows across all 5 user tiers (Managing Director, C-Suite / Department Leads, Sales / Leasing Brokers, Operations / Finance Personnel, and Clients / Landlords / Tenants).

---

## Access Level Matrix & Navigation Maps

| Access Level | Role / Persona | Landing View | Sidebar Access | Impersonation Privileges |
|--------------|----------------|--------------|----------------|--------------------------|
| **LEVEL_5_MASTER** | Founder / Managing Director (`arslanmalikgoraha@gmail.com`) | Profile Overview (`/crm/profile`) & Full Cockpit (`/crm`) | All 10 Department Modules + Leaderboard + Finance + AI Hub | Full (Can preview platform as any employee or client) |
| **LEVEL_4_EXECUTIVE** | C-Suite / Head of Operations | Department Dashboard (`/crm/operations`) | Assigned Department + Analytics + Compliance | Partial (Department Scope) |
| **LEVEL_3_SENIOR** | Senior Broker / Manager | Department Dashboard (`/crm/sales`) | Sales + Inventory + CRM Kanban | None |
| **LEVEL_2_BROKER** | Sales / Leasing Agent | Personal Workspace (`/crm`) | Personal Leads + Showings + Leaderboard Podium | None |
| **LEVEL_1_PORTAL** | Client / Landlord / Tenant | Portal (`/landlord-portal` or `/tenant-portal`) | None (Shielded Minimalist Portal View) | None |

---

## Core Navigation Workflows

### 1. Founder / MD Session Shortcut
- **Trigger**: Authentication matching `arslanmalikgoraha@gmail.com`.
- **Behavior**: Auto-assigned `accessLevel: 5` (`LEVEL_5_MASTER`). Bypasses lower-tier locks, suppresses white-screen flashes, and opens the Top Navbar Impersonation Control Dropdown.
- **Global Shortcut**: Pressing `Ctrl + K` (or `Cmd + K`) opens the Command Palette search overlay anywhere across the app.

### 2. Impersonation Protocol ("Ghost Session")
- **Trigger**: MD selects an employee or client from the Top Navbar dropdown.
- **Behavior**: Context state switches `activeUser` to the target personnel. Page viewports re-render in real-time to match the exact RBAC permissions of the selected user without logging out.

### 3. Portal Data-Shielding
- **Trigger**: User with `accessLevel: 1` logs in (e.g., Tenant or Landlord).
- **Behavior**: Hides internal CRM navigation links and sidebars. Renders minimalist asset management portal (Ejari certificates, Form 7 notices, maintenance ticket dispatches).
