# UI/UX Specification — White Caves CRM Platform

> **Document ID:** WC-UX-001  
> **Version:** 1.0  
> **Date:** March 2026

---

## 1. Design Principles

| Principle          | Description                                                                     |
| ------------------ | ------------------------------------------------------------------------------- |
| **Luxury Minimal** | Clean dark interface with gold accents — communicates premium real estate brand |
| **Data-Forward**   | Key metrics always visible without scrolling on desktop                         |
| **Role-Adaptive**  | Navigation, actions, and data automatically adjust to user role                 |
| **Speed**          | Instant local state updates; skeleton loaders for async data                    |
| **Mobile-Ready**   | Responsive from 360px; full functionality on tablet (1024px)                    |

---

## 2. Design Tokens

### Colour System

```css
/* Primary */
--color-gold-primary: #c8a96e;
--color-gold-hover: #d4b97e;
--color-gold-muted: #c8a96e33;

/* Background */
--color-bg-base: #0a0a0a; /* Page background */
--color-bg-surface: #111111; /* Cards, panels */
--color-bg-elevated: #1a1a1a; /* Modals, dropdowns */
--color-bg-input: #151515; /* Form inputs */

/* Border */
--color-border: #2a2a2a;
--color-border-focus: #c8a96e;

/* Text */
--color-text-primary: #ffffff;
--color-text-secondary: #888888;
--color-text-muted: #555555;
--color-text-gold: #c8a96e;

/* Status */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;

/* Role badge colours */
--color-role-owner: #ffd700;
--color-role-agent: #c8a96e;
--color-role-manager: #a78bfa;
--color-role-finance: #34d399;
--color-role-tenant: #60a5fa;
```

### Typography

```css
/* Font stack */
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;

/* Scale */
--text-xs: 11px / 16px;
--text-sm: 13px / 20px;
--text-base: 15px / 24px;
--text-md: 17px / 26px;
--text-lg: 20px / 30px;
--text-xl: 24px / 34px;
--text-2xl: 30px / 40px;
--text-3xl: 36px / 48px;

/* Weights */
regular: 400;
medium: 500;
semibold: 600;
bold: 700;

/* Arabic (Phase F) */
font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif;
direction: rtl;
```

### Spacing

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.4);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.6);
--shadow-gold: 0 0 12px rgba(200, 169, 110, 0.15);
```

---

## 3. Layout Specification

### Dashboard Layout (Desktop ≥ 1280px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ TOP HEADER (60px height)                                             │
│ [White Caves Logo] [Breadcrumb ───────────────] [🔔] [Avatar▼]     │
├──────────────┬──────────────────────────────────────────────────────┤
│              │                                                        │
│ SIDEBAR      │  PAGE CONTENT AREA                                    │
│ (240px)      │  Max-width: 1400px, centered, padding: 24px          │
│              │                                                        │
│ Navigation   │  [Page Title]           [Actions: Export | Filter]   │
│ items        │  ─────────────────────────────────────────────        │
│              │  [KPI Cards Row]                                      │
│ Role-        │  ─────────────────────────────────────────────        │
│ adaptive     │  [Main Content: Table / Kanban / Charts]              │
│              │                                                        │
└──────────────┴──────────────────────────────────────────────────────┘
```

### Dashboard Layout (Tablet 768–1279px)

```
Sidebar: Hidden; hamburger menu reveals slide-over (280px)
Content: Full width with 16px padding
```

### Dashboard Layout (Mobile < 768px)

```
Sidebar: Hidden; hamburger → bottom sheet navigation
Content: Single column, 12px padding
Tables: Horizontally scrollable
```

---

## 4. Screen Specifications

### 4.1 Sign In Page

**Purpose:** Authenticate users  
**URL:** `/sign-in`

**Layout:**

```
Centered card (400px wide) on dark background
Logo at top
"Welcome Back" headline
Email input
Password input (show/hide toggle)
"Remember me" checkbox
[Sign In] CTA button (full width, gold)
[Sign in with Google] (outlined)
"Forgot password?" link
```

**Behaviour:**

- Email and password validated client-side before submit
- "Sign in" button shows loading spinner during API call
- Error message shown below form (never field-level for security)
- Google button opens Firebase popup
- Redirect to `/dashboard` on success
- If user status = `pending_approval`: redirect to `/pending-approval` page

---

### 4.2 CRM Hub Page (Role Picker)

**Purpose:** Navigate to the correct AI assistant CRM for the user's role  
**URL:** `/crm`

**Layout:**

```
Page heading: "Your CRM Command Centre"
Grid of role-cards (3 per row on desktop, 1 on mobile):
  Each card: [AI assistant avatar] [Name] [Role] [Feature highlights] [Open →]
```

**Behaviour:**

- Cards filtered to show most relevant CRMs for current user's role
- Admin/Owner can see all 24 assistants
- Clicking a card navigates to that assistant's CRM page

---

### 4.3 Lead Management Page (Clara CRM)

**Purpose:** Manage all real estate leads  
**URL:** `/crm/leads`

**Layout (Desktop):**

```
┌─────────────────────────────────────────────────────────┐
│ [Clara CRM — Lead Management]  [+ New Lead] [Import]    │
├─────────────────────────────────────────────────────────┤
│ Filter Bar: [Status▼] [Source▼] [Score▼] [Agent▼] [🔍] │
├─────────────────────────────────────────────────────────┤
│ Tabs: [Pipeline] [All Leads] [My Leads] [Analytics]     │
├─────────────────────────────────────────────────────────┤
│ Pipeline Tab (default):                                  │
│ Kanban columns: New | Contacted | Qualified | ...       │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐                 │
│   │LeadCard │ │LeadCard │ │LeadCard │ ...              │
│   │Name     │ │Name     │ │Name     │                  │
│   │Score 85 │ │Score 60 │ │Score 72 │                  │
│   │Agent    │ │Agent    │ │Agent    │                  │
│   └─────────┘ └─────────┘ └─────────┘                 │
└─────────────────────────────────────────────────────────┘
```

**Lead Card Design:**

- Background: `--color-bg-surface`
- Top-right: score badge (green ≥ 80, yellow 50–79, red < 50)
- Source icon (WhatsApp, website, phone, etc.)
- Last activity timestamp
- Hover: gold border + action icons appear

**Detail Drawer (opens right):**

- Width: 480px (desktop), full screen (mobile)
- Tabs: Overview | Activities | Tasks | Notes
- Activity timeline: chronological list of all actions

---

### 4.4 Property Management Page (Mary CRM)

**Purpose:** Manage property inventory  
**URL:** `/crm/properties`

**Layout:**

```
Header: [Mary CRM — Property Management] [+ Add Property] [Import Excel]
Filter Bar: [Type▼] [Status▼] [Area▼] [Beds▼] [Price range] [Search]
View toggle: [Grid icon] [List icon]

Grid View:
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ [Image]      │ │ [Image]      │ │ [Image]      │
  │ Type badge   │ │ Type badge   │ │              │
  │ Title        │ │ Title        │ │              │
  │ AED 2.5M    │ │ AED 1.8M    │ │              │
  │ 3🛏 2🚿 2000ft │ │              │ │              │
  │ Status badge │ │              │ │              │
  └──────────────┘ └──────────────┘ └──────────────┘
```

---

### 4.5 WhatsApp Dashboard (Nadia)

**Purpose:** Manage all WhatsApp conversations  
**URL:** `/crm/whatsapp`

**Layout:**

```
┌───────────────────────┬──────────────────────────────────┐
│ CONVERSATION LIST     │ MESSAGE THREAD                    │
│ (320px)              │                                   │
│                       │ [Contact header + phone number]  │
│ [🔍 Search]          │ [Messages timeline]               │
│                       │   Outbound: right-aligned        │
│ ─────────────────     │   Inbound:  left-aligned         │
│ [Avatar] Name         │                                   │
│ Last message preview  │ ─────────────────────────────    │
│ Time ago   [Unread 3] │ [Assign to me] [Template] [Send] │
│                       │                                   │
│ ─────────────────     │                                   │
│ [Avatar] Name ...     │                                   │
└───────────────────────┴──────────────────────────────────┘
```

---

## 5. Component States

Every interactive component must implement all states:

| State    | Description                                   |
| -------- | --------------------------------------------- |
| Default  | Normal resting state                          |
| Hover    | Cursor over — gold border or background shift |
| Focus    | Keyboard focus — gold ring outline            |
| Active   | Being clicked — scale 0.98                    |
| Disabled | Greyed out (opacity 0.4), cursor: not-allowed |
| Loading  | Spinner or skeleton animation                 |
| Error    | Red border + error message                    |
| Success  | Green border/icon + success message           |
| Empty    | Empty state illustration + CTA                |

---

## 6. Loading and Empty States

### Loading State (async data)

```
Skeleton loaders match the shape of the real content
Animated shimmer: left → right
Duration: max 500ms shimmer cycle
Skeleton colour: #1E1E1E → #252525
```

### Empty State

```
[Relevant icon in gold, 48px]
[Heading: "No [items] yet"]
[Subtext: helpful explanation]
[Optional CTA button: "Add your first [item]"]
```

### Error State

```
[Error icon in red, 48px]
[Heading: "Something went wrong"]
[Subtext: user-friendly error message]
[Retry button]
```

---

## 7. Form Design Standards

- Labels: above the input, `--text-sm`, `--color-text-secondary`
- Input height: 40px
- Input background: `--color-bg-input`
- Border: `--color-border` (default) → `--color-gold-primary` (focus)
- Error message: `--color-error`, below input, `--text-xs`
- Required fields: asterisk (\*) after label
- Form buttons: primary action on right; secondary (cancel) on left

---

## 8. Responsive Breakpoints

| Name    | Breakpoint  | Layout                                      |
| ------- | ----------- | ------------------------------------------- |
| Mobile  | < 768px     | Single column; bottom nav; stacked cards    |
| Tablet  | 768–1279px  | Collapsible sidebar; 2-column cards         |
| Desktop | 1280–1919px | Fixed sidebar (240px); full layout          |
| Wide    | ≥ 1920px    | Same as desktop; max-width: 1400px centered |

---

## 9. Component Composition Standard (i18n/RTL Ready)

### 9.1 Principle

Use the **smallest meaningful cohesive React functional components**.

- ✅ Good: `LeadCardHeader`, `LeadCardMeta`, `LeadCardActions` (clear responsibility)
- ❌ Avoid: splitting every small `<span>` or icon into its own component when no reuse/value exists

### 9.2 Required Rules

1. **One responsibility per component** (display, interaction, or orchestration).
2. **Translation boundary at leaf UI level** (labels, statuses, CTA text must be externalized).
3. **No business logic inside presentational leaf components**.
4. **Stable props contract** for reusable blocks (cards, rows, tiles, form fields).
5. **Composition first**: build feature sections from reusable atoms and section-level composites.

### 9.3 Arabic/RTL Impact Rules

- Text expansion tolerance: components must handle **+30% string length** without overflow.
- Direction-aware spacing: use logical CSS properties (`margin-inline-*`, `padding-inline-*`).
- Icon mirroring rules:
  - directional icons (arrows, chevrons, breadcrumbs) must auto-flip in RTL
  - semantic icons (home, phone, chart) remain unchanged
- Truncation policy:
  - never truncate critical values (price, date, contract ID)
  - truncate decorative/secondary text only with tooltip fallback

---

## 10. Event-Driven Interaction Contract

### 10.1 Rendering Policy

Components should rerender **only when the state they consume changes**.

- Use selector-based state reads (Redux slices/selectors)
- Keep state local for local UI behavior (dropdown open, tab hover, modal visibility)
- Avoid parent-wide rerender cascades caused by broad object props

### 10.2 Interaction Pattern

Every primary user action follows an event chain:

```
User Action → UI Event → Domain Action Dispatch → Async Effect (if needed)
→ Store Update → Targeted UI Repaint → Feedback (success/error/loading)
```

### 10.3 Mandatory Feedback States

For each action-triggered component path:

- Loading: deterministic pending UI (button spinner / skeleton)
- Success: explicit confirmation (toast/banner/inline state)
- Error: actionable message + retry path
- Empty: guidance + next CTA

---

## 11. Localization-First UX Constraints

### 11.1 Language Parity

- English and Arabic must have **functional parity** for all critical flows:
  - Sign-in (`/signin`)
  - CRM hub (`/crm`)
  - Core dashboard tabs (overview, leads, properties, contracts)

### 11.2 Layout Parity Checklist

For each critical page, verify both LTR and RTL:

1. Heading hierarchy intact
2. CTA prominence preserved
3. Navigation directionality correct
4. Data tables/cards readable without clipping
5. Form validation and helper text placement correct

---

## 12. Acceptance Criteria for This Standard

1. **Component granularity audit** completed for top 20 high-traffic UI sections.
2. **Translation extraction coverage** reaches all user-facing strings in critical flows.
3. **Rerender optimization proof** captured using React Profiler spot checks on `/signin` and `/crm`.
4. **RTL parity validation** documented for all critical dashboards and auth pages.
5. Unit/integration tests remain green after decomposition and event-driven updates.

---

**Document ID:** WC-UX-001 | **Version:** 1.0 | **Date:** March 2026
