# Phase 3 — CRM Full Super User Access (Executive Identity Unified)

> **Priority**: #3 — High  
> **Goal**: A fully working CRM accessible through a single executive superuser identity, all features usable  
> **Approach**: Log in as `arslanmalikgoraha@gmail.com` → canonical executive route → access every CRM tab and feature  
> **Status**: 🔲 Not Started — dashboard shell and routes exist, full integration in progress

> **Linked P0 Module:** `plans/PHASE_33_PRIORITY_MODULE_HOMEPAGE_SUPERUSER_LEASING.md`

---

## Why This Is Phase 3

After the Landlord & Tenant portals (Phase 2) give immediate client-facing value, the next priority
is getting the managing director's full internal CRM working end-to-end. This validates the core
product and creates a solid foundation before bringing in multi-user RBAC, external integrations,
and compliance features.

---

## Super User Definition (Canonical)

The primary super user is the **Managing Director**.

| Detail         | Value                                                                               |
| -------------- | ----------------------------------------------------------------------------------- |
| Email          | `arslanmalikgoraha@gmail.com`                                                       |
| Password       | `password123` (change via seed env `SEED_PASSWORD`)                                 |
| Role           | Canonical executive behavior (`owner`-equivalent with alias normalization support)  |
| CRM Tabs       | Overview, Properties, Agents, Leads, Contracts, Analytics, Users, Settings (8 tabs) |
| Backend access | Full executive access across all API endpoints                                      |

> **No duplicate**: `owner@whitecaves.ae` is a seed/dummy data account only. The real super user
> is `arslanmalikgoraha@gmail.com`.

### Executive alias unification policy

The business identity is one person with multiple historical labels:

- `lion`
- `owner`
- `managing_director`

Implementation direction for this phase:

1. Continue accepting aliases for backward compatibility
2. Normalize authorization behavior to canonical executive role semantics
3. Ensure dashboard entry is single-path from successful login

> **How to seed**: Run `npm run db:seed` — creates both accounts + 6 agents + sample data.

---

## What Already Exists ✅

| Feature                  | Location                                      | Status                                                                                                 |
| ------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Sign-in page             | `src/pages/auth/SignInPage.tsx`               | ✅ Email/password + Firebase OAuth                                                                     |
| JWT auth backend         | `server/routes/auth.ts`                       | ✅ Login returns token, bcrypt verify                                                                  |
| `lion` role tab mapping  | `src/config/ROLE_TAB_MAPPING.ts`              | ✅ 11 tabs configured                                                                                  |
| UnifiedDashboardPage     | `src/pages/UnifiedDashboardPage.tsx`          | ✅ Dual sidebar, role-based tabs                                                                       |
| Overview tab             | `src/components/owner/tabs/OverviewTab.tsx`   | ✅ KPI cards, recent activity                                                                          |
| Properties tab           | `src/components/owner/tabs/PropertiesTab.tsx` | ✅ Property list with CRUD                                                                             |
| Agents tab               | `src/components/owner/tabs/AgentsTab.tsx`     | ✅ Agent list                                                                                          |
| Leads tab                | `src/components/owner/tabs/LeadsTab.tsx`      | ✅ Lead list with status                                                                               |
| Contracts tab            | `src/components/owner/tabs/ContractsTab.tsx`  | ✅ Contract list                                                                                       |
| Analytics tab            | `src/components/owner/tabs/AnalyticsTab.tsx`  | ✅ Charts and KPIs                                                                                     |
| Settings tab             | `src/components/owner/tabs/SettingsTab.tsx`   | ✅ System settings                                                                                     |
| Users tab                | `src/components/owner/tabs/UsersTab.tsx`      | ✅ User management                                                                                     |
| Admin dashboard          | `src/components/admin/AdminDashboard.tsx`     | ✅ Admin panel                                                                                         |
| AI Hub                   | `src/components/crm/AIAssistantHub.tsx`       | ✅ 17 AI assistants listed                                                                             |
| AI Command Center        | `src/components/crm/AICommandCenter.tsx`      | ✅ Assistant interface                                                                                 |
| CRM Hub page             | `src/pages/crm/CRMHubPage.tsx`                | ✅ Department selector                                                                                 |
| All 13 AI dashboards     | `src/components/crm/*CRM_NEW/`                | ✅ Clara, Mary, Sophia, Daisy, Laila, Nadia, Zoe, Nina, Olivia, Nancy, Aurora, Hazel, Willow, Theodora |
| Lead management page     | `src/pages/crm/LeadManagementPage.tsx`        | ✅ Full CRUD UI                                                                                        |
| Property management page | `src/pages/crm/PropertyManagementPage.tsx`    | ✅ Full CRUD UI                                                                                        |
| Agent performance page   | `src/pages/crm/AgentPerformancePage.tsx`      | ✅ Performance charts                                                                                  |
| Backend APIs             | `server/routes/` (12 route files)             | ✅ leads, properties, agents, transactions, finance, tenants, compliance, reporting, crm, assistants   |

---

## What Needs To Be Done 🚧

### 2.1 — Sign-In Flow End-to-End

**Goal**: Managing director can open the app, sign in, and land on the CRM dashboard in < 5 clicks.

- [ ] **Canonical executive login policy** documented and enforced for `arslanmalikgoraha@gmail.com`
- [ ] **Sign-in page renders cleanly** — no layout breaks, loading spinner works
- [ ] **Email login works**: `arslanmalikgoraha@gmail.com` + `password123` → success → redirect to `/dashboard`
- [ ] **JWT stored in localStorage** via `safeStorage` — verify `auth_token` is set after login
- [ ] **Redux user state** populated: `state.user.currentUser` or `state.auth.user` has `id`, `email`, `role: 'managing_director'`
- [ ] **Protected route** on `/dashboard`: redirect to `/signin` if no token
- [ ] **"Skip category selection" for managing director**: if a user logs in with role `managing_director`, bypass the signup category flow and go straight to the dashboard
- [ ] **Alias normalization**: `lion` and `managing_director` must route/authorize identically to canonical executive behavior
- [ ] **Error state**: wrong password shows "Invalid credentials" in the form
- [ ] **Loading state**: button shows spinner during API call, disabled while loading

**Files to check/fix**:

- `src/pages/auth/SignInPage.tsx` — `handleSignInSuccess()` and redirect logic
- `src/services/authService.ts` — `loginWithEmail()` function
- `src/App.tsx` — protected route guarding `/dashboard`

---

### 2.2 — Dashboard Landing (Overview Tab)

**Goal**: First screen after login shows meaningful data.

- [ ] **Overview tab loads** without errors or blank state
- [ ] **KPI cards** show: Total Properties, Active Leads, Agents, Revenue (numbers from API or dummy)
- [ ] **Recent activity feed** renders (from `/api/dashboard/summary` or dummy data)
- [ ] **Quick stats**: Today's enquiries, Pending deals, Expiring contracts
- [ ] If API is unavailable (dev without DB), show graceful empty states — not error crashes
- [ ] Animated number counters on KPI cards

---

### 2.3 — Properties Tab (Full CRUD)

**Goal**: Owner can add, view, edit, and delete properties.

- [ ] **Property list** loads from `/api/properties` — shows title, price, status, location, type, beds/baths
- [ ] **Search/filter bar**: filter by status (available/sold/rented), type (villa/apartment), location
- [ ] **"Add Property" button** opens a modal/drawer with a form
- [ ] **Add form fields**: title, description, type, status, price, bedrooms, bathrooms, sqft, location, area, amenities, images (URLs for now)
- [ ] **Edit property** — pencil icon on each row opens edit modal pre-filled
- [ ] **Delete property** — confirmation dialog before delete
- [ ] **Success toasts** on create/update/delete
- [ ] **Pagination** if > 20 properties
- [ ] **Empty state** if no properties: "No properties yet — add your first one"

---

### 2.4 — Leads Tab (Full CRUD)

**Goal**: Owner can manage the full sales pipeline.

- [ ] **Lead list** loads from `/api/leads` with status badges (new/contacted/qualified/hot/cold/won/lost)
- [ ] **Pipeline view toggle**: table view ↔ kanban board
- [ ] **Add Lead** button → form: name, email, phone, budget, source, notes, assign to agent
- [ ] **Edit lead** modal (pre-filled)
- [ ] **Status change**: drag-and-drop (kanban) or dropdown (table)
- [ ] **Lead score** badge (0–100)
- [ ] **Search by name/email/phone**
- [ ] **Filter by status, source, assigned agent**
- [ ] **Activity log** per lead (calls, emails, visits logged)
- [ ] **Delete lead** with confirmation

---

### 2.5 — Agents Tab (Full CRUD)

**Goal**: Owner can manage the agent team.

- [ ] **Agent list** loads from `/api/agents` — name, email, role, status, department
- [ ] **Invite/Add agent** button → form: name, email, role, department, phone
- [ ] **Edit agent** — update role, status, department
- [ ] **Deactivate/Activate agent** — status toggle
- [ ] **Agent performance card**: leads assigned, properties listed, commissions earned (from existing API)
- [ ] **Search/filter** by role, department, status

---

### 2.6 — Users Tab (User Management)

**Goal**: Owner can manage all user accounts in the system.

- [ ] **Users list** loads from `/api/user-management` (already mounted at this path)
- [ ] **Show all users** with role, status, last login
- [ ] **Role change** — dropdown to change any user's role (calls `POST /api/users/role`)
- [ ] **Activate / Deactivate user** accounts
- [ ] **Delete user** with confirmation
- [ ] **Invite new user** form

---

### 2.7 — Analytics Tab

**Goal**: Owner sees real charts with live or dummy data.

- [ ] **Revenue chart** (monthly bar chart — Recharts) — from `/api/finance/summary` or dummy
- [ ] **Lead pipeline funnel** — count per stage
- [ ] **Agent leaderboard** — top 5 agents by deals/commissions
- [ ] **Property type breakdown** — pie chart
- [ ] **Date range filter** (last 7d, 30d, 90d, 1y)
- [ ] All charts use the gold/dark theme tokens (no default blue Recharts colors)

---

### 2.8 — AI Assistant Hub

**Goal**: Owner can browse and interact with all 17 registered AI assistants.

- [ ] **AI Hub tab** shows all 17 assistant cards: name, role description, avatar
- [ ] **Click an assistant** → opens the corresponding CRM dashboard (Clara → `/dashboard?tab=leads`, Mary → properties, etc.)
- [ ] **AI Command Center** tab: text input for sending instructions to an AI assistant
- [ ] **AssistantPlanView**: clicking "View Plan" on any assistant shows the markdown plan from `/api/assistants/:id/plan`
- [ ] **AssistantPlanEditor** (super user only): owner can edit an assistant's plan markdown inline and save via `PUT /api/assistants/:id/plan`

---

### 2.9 — Individual CRM Dashboards (All 13 AI Assistants)

**Goal**: Every AI assistant dashboard is navigable and renders without errors.

| Assistant | Dashboard                | Key Tabs                                         | Status                                       |
| --------- | ------------------------ | ------------------------------------------------ | -------------------------------------------- |
| Clara     | `ClaraLeadsCRM_NEW`      | Prospects, Deals, Activity, Insights, Tasks      | ✅ UI exists — verify renders                |
| Mary      | `MaryInventoryCRM_NEW`   | Inventory, Details, Tools                        | ✅ UI exists — verify renders                |
| Sophia    | `SophiaSalesCRM_NEW`     | Pipeline, Deals, Forecasting, Agents             | ✅ UI exists — verify renders                |
| Theodora  | `TheodoraFinanceCRM_NEW` | Overview, Payments, Reports                      | ✅ UI exists — verify renders                |
| Daisy     | `DaisyLeasingCRM_NEW`    | Leases, Maintenance, Renewals, Inquiries         | ✅ UI exists — verify renders                |
| Laila     | `LailaComplianceCRM_NEW` | KYC, AML, Contracts, Regulations                 | ✅ UI exists — verify renders                |
| Nadia     | `NadiaWhatsAppCRM`       | Conversations, Agent Assignment, Insights        | ✅ UI exists — verify renders                |
| Zoe       | `ZoeExecutiveCRM_NEW`    | Executives, Reports, Calendar, Suggestions       | ✅ UI exists — verify renders                |
| Nina      | `NinaWhatsAppBotCRM_NEW` | Bots, Sessions, Analytics, Settings              | ✅ UI exists — backend stub (OK for Phase 2) |
| Olivia    | `OliviaMarketingCRM_NEW` | Campaigns, Automation, Listings, Publish         | ✅ UI exists — backend stub (OK for Phase 2) |
| Nancy     | `NancyHRCRM_NEW`         | HR module tabs                                   | ✅ UI exists — verify renders                |
| Aurora    | `AuroraCTODashboard_NEW` | API Perf, Applications, Architecture, Assistants | ✅ UI exists — verify renders                |
| Hazel     | `HazelFrontendCRM_NEW`   | Components, Design, Accessibility, Performance   | ✅ UI exists — verify renders                |

**Task**: Navigate to each one and confirm no crash, no blank screen, no missing import errors.

---

### 2.10 — Settings Tab

**Goal**: Owner can update system settings.

- [ ] Company name, logo URL, contact email, phone, RERA license number fields
- [ ] Save button → `PATCH /api/settings` (stub is OK for Phase 2 — show success toast)
- [ ] Theme toggle (light/dark — if not already working)
- [ ] Language selector (English only for Phase 2 — Arabic deferred to Phase 3)

---

### 2.11 — Navigation & Sidebar Polish

**Goal**: Moving between tabs feels fast and professional.

- [ ] Left sidebar shows department icons + labels for all 13 AI assistant dashboards
- [ ] Right sidebar shows AI assistant list — clicking opens the assistant's CRM view
- [ ] Active tab is visually highlighted (gold border/background)
- [ ] Sidebar collapse button works on both sidebars
- [ ] Breadcrumb or page title updates when tab changes
- [ ] Mobile: sidebars collapse to icons at 1024px, hidden with drawer toggle at 768px

---

### 2.12 — Error States & Loading States

**Goal**: Nothing crashes when the backend is unavailable or returns empty data.

- [ ] Every API call has a loading spinner (existing `SuspenseLoader` or `<Skeleton>`)
- [ ] Every API call has a visible error state with retry button
- [ ] If no data exists (empty DB), show empty-state illustrations, not blank grids
- [ ] No unhandled promise rejections in the console
- [ ] React Error Boundaries on all lazy-loaded tab components

---

### 2.13 — Super User "Demo Mode" with Dummy Data

**Goal**: CRM is fully usable even without a live database connection.

Since the seed script already populates data, document the steps for a full demo:

```bash
# 1. Set up env
cp .env.example .env
# Edit .env: set DATABASE_URL to your MongoDB Atlas URL

# 2. Seed the database
npm run db:seed

# 3. Start the server
npm run server   # Terminal 1
npm run dev      # Terminal 2 (or npm run dev:all for both)

# 4. Open the app
# Go to http://localhost:5173
# Click Sign In
# Email: arslanmalikgoraha@gmail.com
# Password: password123
```

- [ ] Confirm this flow works end-to-end on a clean install
- [ ] Document the seed data: how many properties, leads, agents, commissions are created
- [ ] Add a `DEMO.md` note in the root or plans/ with these exact steps

---

## Definition of Done — Phase 3

- [ ] Managing director can sign in with `arslanmalikgoraha@gmail.com` / `password123`
- [ ] Dashboard loads immediately after login with no errors
- [ ] All 11 CRM tabs navigate without crashing
- [ ] All 13 AI assistant dashboards render correctly
- [ ] Properties tab: full CRUD works (add, edit, delete, list, search)
- [ ] Leads tab: full CRUD + pipeline view works
- [ ] Agents tab: list, add, edit works
- [ ] Users tab: list and role-change works
- [ ] Analytics tab: all charts render with real or dummy data
- [ ] AI Hub: all 17 assistant cards visible and clickable
- [ ] Settings tab: form renders, save shows success toast
- [ ] No console errors or React warnings in any tab
- [ ] Responsive at 1024px and 1440px (mobile view deferred to Phase 3)
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npx vitest run`

---

## Next Phase After This

Once Phase 3 is complete, move to **[PHASE_3_AND_BEYOND.md](./PHASE_3_AND_BEYOND.md)** — starting with Phase 4 (WhatsApp Real Integration).
