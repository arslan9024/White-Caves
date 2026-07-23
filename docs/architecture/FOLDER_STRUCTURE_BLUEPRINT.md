# White Caves Architecture Blueprint: Modular Codebase Separation

**Version:** 2.0  
**Authority:** @Ada (Chief Architect)  
**Status:** Active Architectural Standard

---

## 🏗️ Clean Separation of Concerns (Frontend vs Backend)

```
c:\Users\HP\WCAG\White-Caves\
├── src/                     # 🎨 FRONTEND CLIENT DOMAIN (React 18 + Vite + Styled Components)
│   ├── assets/              # Static branding media, logos, Quiet Luxury design assets
│   ├── components/          # Reusable UI component atoms & molecules
│   │   ├── common/          # Modals, buttons, indicators, inputs, loading skeletons
│   │   ├── dashboard/       # ModuleCard, KPICard, DashboardKpiStrip
│   │   ├── layout/          # MobileBottomNav, MobileMenuDrawer, Header, Footer
│   │   ├── owner/           # LeaderboardTab, Executive controls
│   │   └── property/        # Listing cards, spatial viewports, media galleries
│   ├── config/              # Frontend module registries, role mappings, RBAC constants
│   ├── design-tokens/       # Color palette (#0f0f0f, #C9A84C, #10B981), typography, shadows
│   ├── hooks/               # Custom hooks (useDashboardMetrics, useUserProfile, useDocumentTitle)
│   ├── layouts/             # Master layout shells (UnifiedWorkspaceLayout.tsx)
│   ├── locales/             # Localization sheets (en.json, ar.json)
│   ├── mocks/               # Client-side synthetic data engines (dubaiFinanceEngine.ts)
│   ├── pages/               # Top-level page views (UnifiedDashboardPage.tsx, ProfilePage.tsx)
│   ├── store/               # Client state management (Redux slices, hydration handlers)
│   └── utils/               # Client utilities (routing.ts, authSession.ts, apiClient.ts)
│
├── server/                  # ⚙️ BACKEND SERVER DOMAIN (Express.js + Prisma + Node 20)
│   ├── config/              # Server env, CORS settings, database pool configuration
│   ├── database.ts          # Central Prisma Client connection lifecycle & disconnect hooks
│   ├── index.ts             # Express server entry point, Nodemon SIGUSR2 signal listeners
│   ├── middleware/          # Server middlewares (auth.ts, departmentAuth.ts, rateLimiter.ts)
│   ├── routes/              # Modular Express API endpoints (/api/v1/leads, /api/v1/auth, etc.)
│   ├── services/            # Backend business logic, regulatory mocks, notification queues
│   └── utils/               # Server utility functions (logger.ts, sanitize.ts)
│
├── prisma/                  # 🗄️ DATABASE SCHEMA & MIGRATIONS
│   └── schema.prisma        # Prisma Object Relational Mapping schema
│
├── plans/                   # 🗺️ AEGIS AUTOPILOT ROADMAPS & GOVERNANCE
│   ├── MASTER_PLAN.md       # Master execution roadmap
│   ├── PENDING_TASKS_ONLY.md# Active backlog queue
│   ├── PLANNING_GOVERNANCE.md # 90% Readiness Checkpoint Framework
│   ├── AEGIS_RUN_LOG.md     # Audit run log & token preservation stats
│   └── waves/               # Wave execution specifications (Waves 01 - 35)
│
└── docs/                    # 📚 ARCHITECTURE & DECISION RECORDS
    └── architecture/        # Architecture flowcharts, folder blueprints, API registries
```

---

## 🔒 Domain Separation Principles

1. **Frontend Isolation (`src/`)**: Client components MUST NOT directly import server files. All communication occurs via structured HTTP/WebSocket APIs (`apiClient.ts`).
2. **Backend Isolation (`server/`)**: Express controllers MUST NOT import React components or client hooks.
3. **Mock Data Layer (`src/mocks/`)**: Client mock data providers allow full offline operation without requiring an active database connection.
4. **Nodemon Watch Boundary**: Server hot-reloading monitors `server/**` and `prisma/**`, preventing unnecessary frontend bundle rebuilds.
