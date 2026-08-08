# Software Design Document (SDD)

White Caves Real Estate CRM Platform.

<!-- markdownlint-disable MD022 MD031 MD032 MD040 MD060 -->

**Status:** Active  
**Owner:** Software Architecture & Delivery  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Business-side SDD bridge for implementation architecture traceability

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend architecture decomposition and reliability lanes in `docs/plans/waves/WAVE_37_*` through `WAVE_40_*`

> **Document ID:** WC-SDD-001  
> **Version:** 1.0  
> **Date:** March 2026  
> **Status:** Approved  
> **Reference Standard:** IEEE Std 1016-2009 (Software Design Descriptions)

---

## 1. Introduction

### 1.1 Purpose
This Software Design Document describes the architecture, component design, interfaces, and design decisions for the White Caves CRM Platform. It bridges the high-level architecture (system-architecture.md) and the implementation code.

### 1.2 Scope
Covers: frontend component hierarchy, backend module design, service layer patterns, data access patterns, and cross-cutting concerns (auth, error handling, logging).

---

## 2. System Design Overview

```
┌────────────────────────────────────────────────────────────────┐
│                    DESIGN LAYERS                               │
├────────────────────────────────────────────────────────────────┤
│  PRESENTATION     React 18 SPA                                 │
│  LAYER            Pages → Feature Components → Shared UI       │
│                   Redux Store (state management)               │
├────────────────────────────────────────────────────────────────┤
│  SERVICE          Axios API client (with interceptors)          │
│  LAYER            Service modules per domain (auth, leads, ...) │
├────────────────────────────────────────────────────────────────┤
│  API              Express.js REST API                           │
│  LAYER            Route handlers → Controller functions         │
│                   Middleware pipeline (auth, rate limit, ...)   │
├────────────────────────────────────────────────────────────────┤
│  BUSINESS         Service classes (LeadsService, etc.)         │
│  LOGIC            Business rule enforcement                     │
│  LAYER            Domain event triggers                         │
├────────────────────────────────────────────────────────────────┤
│  DATA             Prisma ORM                                    │
│  ACCESS           MongoDB Atlas                                 │
│  LAYER            Indexed queries, aggregation pipelines        │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. Frontend Component Design

### 3.1 Component Hierarchy

```
App.tsx (Root)
├── BrowserRouter
│   ├── AuthProvider (Firebase + Redux auth state)
│   │   ├── Layout (sidebar + header wrapper)
│   │   │   ├── Sidebar (role-adaptive navigation)
│   │   │   │   ├── NavGroup (sections: CRM, Finance, etc.)
│   │   │   │   └── NavItem (link + icon + badge)
│   │   │   ├── TopHeader
│   │   │   │   ├── Breadcrumb
│   │   │   │   ├── NotificationBell
│   │   │   │   └── UserAvatar
│   │   │   └── PageContent (router outlet)
│   │   │       ├── Public Routes (no auth)
│   │   │       │   ├── HomePage
│   │   │       │   ├── PropertiesPage
│   │   │       │   ├── AboutPage
│   │   │       │   ├── ServicesPage
│   │   │       │   └── ContactPage
│   │   │       └── Protected Routes (auth required)
│   │   │           ├── UnifiedDashboardPage (Zoe)
│   │   │           ├── CRM Routes
│   │   │           │   ├── CRMHubPage
│   │   │           │   ├── LeadManagementPage (Clara)
│   │   │           │   ├── PropertyManagementPage (Mary)
│   │   │           │   └── AgentPerformancePage
│   │   │           ├── Sales Routes
│   │   │           │   └── SalesPipelinePage (Sophia)
│   │   │           ├── Leasing Routes
│   │   │           │   ├── ContractManagementPage (Daisy)
│   │   │           │   └── TenantScreeningPage
│   │   │           ├── Owner Routes
│   │   │           │   ├── WhatsAppDashboardPage (Nadia)
│   │   │           │   ├── WhatsAppAnalyticsPage
│   │   │           │   ├── WhatsAppChatbotPage (Nina)
│   │   │           │   └── SystemHealthPage (Aurora)
│   │   │           └── Buyer/Seller Routes
│   │   │               ├── DLDFeesPage
│   │   │               ├── MortgageCalculatorPage (Henry)
│   │   │               └── PricingToolsPage
│   │   └── SignInPage (auth pages)
│   └── NotFoundPage (404)
```

### 3.2 Key Feature Component Design

#### ClaraLeadsCRM (Lead Management)
```
ClaraLeadsCRM/
├── index.tsx                 # Root component; tab state management
├── ClaraLeadsCRM.css
├── data/
│   └── features.ts           # Static feature config data
├── hooks/
│   └── useLeadsData.ts       # Data fetching + local state
└── tabs/
    ├── ProspectsTab.tsx       # Lead list + Kanban switcher
    ├── DealsTab.tsx           # Active deals view
    ├── ActivityTab.tsx        # Timeline feed
    ├── TasksTab.tsx           # Follow-up reminders
    ├── InsightsTab.tsx        # Analytics/charts
    └── FeaturesTab.tsx        # Feature capability display
```

**Data flow in ClaraLeadsCRM:**
1. `useLeadsData` hook dispatches `fetchLeads` Redux thunk on mount
2. Redux slice stores leads in `crmDataSlice.leads`
3. `ProspectsTab` selects from store + applies local filter state
4. User actions (status update, assign) dispatch update thunks → optimistic UI → API call → re-sync

#### DaisyLeasingCRM (Tenancy Management)
```
DaisyLeasingCRM/
├── index.tsx
├── data/
│   ├── features.ts
│   └── leasing.ts            # Mock lease/tenant data (replaced by API)
├── hooks/
│   └── useLeasingData.ts
└── tabs/
    ├── LeasesTab.tsx          # Active leases table
    ├── InquiriesTab.tsx       # Rental inquiries
    ├── RenewalsTab.tsx        # Expiry tracking
    └── MaintenanceTab.tsx     # Maintenance requests
```

### 3.3 Shared Component Library Design

All shared components live in `src/shared/components/` and follow this contract:

```typescript
// Component interface pattern
interface SharedComponentProps {
  children?: React.ReactNode;
  className?: string;
  'data-testid'?: string;   // Testing hook
  // ... component-specific props
}
```

**Design tokens sourced from CSS variables:**
```css
:root {
  --color-primary: #C8A96E;    /* Gold */
  --color-background: #0A0A0A; /* Dark */
  --color-surface: #111111;
  --color-border: #2A2A2A;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #888888;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

---

## 4. Redux State Management Design

### 4.1 Store Structure

```typescript
RootState {
  auth: AuthState           // JWT, user profile, loading, error
  crmData: CrmDataState     // leads, transactions, clients
  property: PropertyState   // property list, filters, currentProperty
  role: RoleState           // current user role + permissions map
  dashboard: DashboardState // KPIs, analytics
  analytics: AnalyticsState // charts, reports data
  whatsapp: WhatsAppState   // conversations, messages, templates
  inventory: InventoryState // filtered property inventory
  aiAssistantDashboard: AIState // assistant metadata + plan content
  notifications: NotifState // in-app notification queue
  sidebar: SidebarState     // open/closed, active item
  navigation: NavState      // current route, breadcrumbs
}
```

### 4.2 Async Action Pattern

All async operations follow this pattern:
```typescript
// Thunk pattern (Redux Toolkit createAsyncThunk)
export const fetchLeads = createAsyncThunk(
  'crmData/fetchLeads',
  async (filters: LeadFilters, { rejectWithValue }) => {
    try {
      const response = await leadsService.getLeads(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice handles pending / fulfilled / rejected
extraReducers: (builder) => {
  builder
    .addCase(fetchLeads.pending,   (state) => { state.loading = true; })
    .addCase(fetchLeads.fulfilled, (state, action) => {
      state.loading = false;
      state.leads = action.payload.data;
      state.pagination = action.payload.pagination;
    })
    .addCase(fetchLeads.rejected,  (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
}
```

---

## 5. Backend Module Design

### 5.1 Express Middleware Pipeline

Every request passes through this ordered middleware stack:
```
Request
  → helmet() (security headers)
  → cors() (origin whitelist)
  → compression() (gzip)
  → morgan() (access log)
  → express.json({ limit: '1mb' }) (body parse)
  → Content-Type check (mutation endpoints)
  → apiLimiter (rate limit: 100 req/15min/IP)
  → [authMiddleware if production] (JWT verify → req.user)
  → Route handler
  → asyncHandler (try/catch wrapper)
  → errorHandler (global error formatter)
Response
```

### 5.2 Route Handler Pattern

All route handlers follow this pattern:
```typescript
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  // 1. Authorization check
  const allowedRoles = ['owner', 'manager'];
  if (!allowedRoles.includes(req.user?.role || '')) {
    throw new AppError('Access denied', 403);
  }
  // 2. Input extraction and sanitisation
  const { search } = req.query;
  const cleanSearch = search ? sanitizeString(search as string) : undefined;
  // 3. Pagination
  const { page, limit, skip } = parsePagination({ page: req.query.page, limit: req.query.pageSize });
  // 4. Database query
  const [data, total] = await Promise.all([
    prisma.lead.findMany({ where, skip, take: limit }),
    prisma.lead.count({ where }),
  ]);
  // 5. Response
  res.status(200).json({
    success: true,
    data,
    pagination: { page, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
}));
```

### 5.3 Error Handling Design

```typescript
class AppError extends Error {
  statusCode: number;
  isOperational: boolean; // true = safe to expose message to client

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Global error handler (last middleware)
errorHandler(err, req, res, next) {
  if (err.isOperational) {
    // Safe to return to client
    res.status(err.statusCode).json({ success: false, error: err.message });
  } else {
    // Internal error — log full details, return generic message
    logger.error(err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
```

### 5.4 Input Sanitisation Design

```typescript
// sanitize.ts — applied to all user-provided strings
function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')        // strip HTML angle brackets
    .substring(0, 1000);          // max length guard
}

// Used in every route handler before database operations
const name = sanitizeString(req.body.name);
```

### 5.5 Authentication Middleware Design

```typescript
authMiddleware(req, res, next) {
  1. Extract token from Authorization: Bearer <token>
  2. If no token → 401 Unauthorized
  3. jwt.verify(token, JWT_SECRET)
  4. If expired or invalid → 401
  5. Look up user by decoded.userId in DB (optional, for status checks)
  6. Attach to req.user = { id, email, role, ... }
  7. next()
}
```

---

## 6. Data Access Layer Design

### 6.1 Prisma Query Patterns

**Paginated list query (standard pattern):**
```typescript
const [items, total] = await Promise.all([
  prisma.lead.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
    include: { assignedTo: { select: { id: true, name: true } } },
  }),
  prisma.lead.count({ where: whereClause }),
]);
```

**Aggregation (dashboard):**
```typescript
const stats = await prisma.lead.groupBy({
  by: ['status'],
  _count: { _all: true },
});
```

### 6.2 Database Index Strategy

Indexes are defined in `schema.prisma` using `@@index` directives. Key compound indexes:

| Model | Index Fields | Query Pattern |
|-------|-------------|---------------|
| Lead | `[status, assignedToId]` | Agent's active leads |
| Lead | `[status, createdAt]` | Time-filtered pipeline |
| Property | `[status, type, price]` | Filtered property search |
| Commission | `[agentId, status, createdAt]` | Agent commission history |
| Activity | `[leadId, createdAt]` | Lead timeline |

---

## 7. Cross-Cutting Concerns

### 7.1 Logging

```typescript
// Winston logger — structured JSON in production
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

// Correlation ID: every request gets an X-Request-ID header
// Logged with every request for tracing
```

### 7.2 Pagination

Centralised pagination logic in `server/config/pagination.ts`:
```typescript
parsePagination({ page, limit }) {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
  return { page: pageNum, limit: limitNum, skip: (pageNum - 1) * limitNum };
}
```

### 7.3 Config and Secrets Management

Environment variables validated at startup in `server/config/env.ts`:
```typescript
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'FIREBASE_PROJECT_ID'];
requiredEnvVars.forEach(key => {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
});
```

---

## 8. Security Design

### 8.1 Authentication Token Design

| Attribute | Value |
|-----------|-------|
| Algorithm | HS256 (configurable to RS256 for production) |
| Expiry | 24 hours |
| Payload | `{ userId, email, role, iat, exp }` |
| Storage (client) | Memory (Redux state) or httpOnly cookie (preferred) |
| Revocation | Not supported (stateless); use short expiry |

### 8.2 RBAC Permission Model

Permissions checked at the route level, not the controller level:
```
Request arrives at route
→ authMiddleware sets req.user.role
→ Route handler checks: allowedRoles.includes(req.user.role)
→ 403 if not allowed
→ Additional data scoping: agents filtered to own records
```

Role hierarchy (for convenience checks):
```
owner > admin > manager > finance > agent > viewer
```

---

## 9. Deployment Design

Refer to `business_docs/14_devops/deployment-runbook.md` for full deployment procedures.

**Container design:**
```dockerfile
# Node.js API container
FROM node:20-alpine
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["node", "dist/server/index.js"]
```

---

**Document ID:** WC-SDD-001 | **Version:** 1.0 | **Date:** March 2026
