# White Caves CRM Platform - Phase 1 Development Scaffold

## Overview

This is the foundational scaffold for the **White Caves Real Estate CRM Platform**, a comprehensive, enterprise-grade customer relationship management system for a luxury real estate brokerage in Dubai.

**Current Status**: Phase 1 Foundation Complete ✅
- Redux store scaffolding complete
- Backend API structure established
- Service layer foundation ready
- Type definitions comprehensive
- Development server running at `http://localhost:5000`

## Project Structure

```
white-caves/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Login, 2FA, password reset
│   │   ├── dashboard/      # Dashboard, KPIs, analytics
│   │   ├── leads/          # Lead management UI
│   │   ├── properties/     # Property browsing, search
│   │   ├── transactions/   # Transaction pipeline
│   │   ├── finance/        # Commission, payments
│   │   ├── leasing/        # Tenant, lease management
│   │   └── common/         # Shared components
│   ├── store/              # Redux store
│   │   ├── index.ts        # Store configuration
│   │   ├── hooks.ts        # Custom Redux hooks
│   │   ├── authSlice.ts    # Authentication state
│   │   ├── leadsSlice.ts   # Leads state
│   │   ├── propertiesSlice.ts # Properties state
│   │   ├── dashboardSlice.ts  # Dashboard state
│   │   └── uiSlice.ts      # UI state
│   ├── services/           # API services & business logic
│   │   ├── apiClient.ts    # Axios HTTP client
│   │   ├── LeadsService.ts
│   │   ├── PropertiesService.ts
│   │   └── WhatsAppBotService.ts
│   ├── types/              # TypeScript definitions
│   │   └── index.ts        # All type definitions
│   ├── utils/              # Utility functions
│   │   └── index.ts        # Formatting, validation, calculations
│   ├── styles/             # Global styles
│   └── App.tsx             # Main app component
│
├── server/                 # Node.js/Express backend
│   ├── index.ts           # Express app setup
│   ├── database.ts        # Prisma MongoDB connection
│   ├── middleware/        # Express middleware
│   │   ├── errorHandler.ts
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── routes/            # API route handlers
│   │   ├── auth.ts        # /api/auth
│   │   ├── leads.ts       # /api/leads
│   │   ├── properties.ts  # /api/properties
│   │   ├── agents.ts      # /api/agents
│   │   ├── transactions.ts # /api/transactions
│   │   ├── communications.ts # /api/communications (WhatsApp)
│   │   └── crm.ts         # /api/crm (Dashboard)
│   ├── services/          # Business logic
│   │   ├── LeadsService.ts
│   │   ├── PropertiesService.ts
│   │   └── WhatsAppBotService.ts
│   ├── models/            # Data models & Prisma schemas
│   └── controllers/       # Route controllers (coming)
│
├── bot/                   # WhatsApp bot
│   ├── controllers/
│   └── services/
│
├── business/              # Business documentation (Phase 0.2)
│   ├── company/          # Company structure, departments, team
│   ├── products/         # Services, features, pricing
│   ├── workflows/        # Business workflows, processes
│   ├── requirements/     # Functional, technical requirements
│   ├── architecture/     # System architecture, integrations
│   ├── business-model/   # Revenue, growth, financial models
│   └── market/           # Market research, competitors, positioning
│
├── package.json           # Dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
├── vitest.config.ts      # Vitest testing configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── eslint.config.js      # ESLint configuration
├── prettier.config.js    # Prettier formatting
└── README.md            # This file
```

## Technology Stack

**Frontend**
- React 18 with TypeScript
- Redux Toolkit for state management
- Vite for fast development & building
- Tailwind CSS for styling
- Vitest for unit testing
- Playwright for E2E testing

**Backend**
- Node.js with Express 5
- TypeScript for type safety
- Prisma 6.6 as ORM
- MongoDB for database
- Firebase for authentication (planned)

**DevOps & Tools**
- Docker & Podman for containerization
- GitHub Actions for CI/CD
- ESLint & Prettier for code quality
- Nginx for reverse proxy

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or connection string available
- Git for version control

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd white-caves

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# The app will be available at http://localhost:5000
```

### Available Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run dev:server      # Start backend server only
npm run dev:vite        # Start frontend only

# Building
npm run build           # Build for production
npm run build:server    # Build backend
npm run build:frontend  # Build frontend

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm test:e2e            # Run E2E tests with Playwright
npm run test:coverage   # Generate coverage report

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier

# Documentation
npm run docs            # Generate documentation
```

## Key Features (Phase 1)

### 1. User Authentication
- Email/password login
- Two-factor authentication (2FA)
- Role-based access control (RBAC)
- Session management
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/verify-2fa`

### 2. Lead Management (Clara's Module)
- Create, read, update, delete leads
- Lead scoring system (0-100)
- Lead source tracking (WhatsApp, website, phone, referral)
- Lead status pipeline (new → won/lost)
- Lead assignment to agents
- Activity tracking per lead
- `GET/POST /api/leads`
- `GET/PATCH/DELETE /api/leads/:id`

### 3. Property Management (Mary's Module)
- Property listing and inventory
- Advanced search and filtering
- Multiple property types (villa, apartment, townhouse, etc.)
- Image gallery and virtual tours
- Property status tracking (available, reserved, sold, rented)
- Popularity metrics (view count, bookmarks)
- `GET/POST /api/properties`
- `GET/PATCH/DELETE /api/properties/:id`

### 4. Transaction Management (Sophia & Theodora's Module)
- Sales and leasing transactions
- Multi-stage pipeline (inquiry → closed)
- Commission calculation and tracking
- Document management
- Timeline tracking
- `GET/POST /api/transactions`
- `PATCH /api/transactions/:id`

### 5. WhatsApp Integration (Linda & Nina's Module)
- Bot-assisted messaging
- Lead capture from WhatsApp
- Conversation history
- Message templates
- Agent escalation
- `POST /api/communications/messages/send`
- `GET /api/communications/messages/:recipientId`
- `GET /api/communications/status`

### 6. Dashboard & Analytics (Zoe's Module)
- KPI monitoring
- Sales metrics and pipeline analysis
- Agent performance tracking
- Financial summaries
- Custom reporting
- `GET /api/crm/dashboard`
- `GET /api/crm/analytics`

## Redux Store Structure

```typescript
// Access store via custom hooks
import { useLeads, useProperties, useAuth, useDashboard, useUI } from '@/store/hooks';

// Example usage in component
const { items, loading, error, dispatch } = useLeads();
```

**Available Slices:**
- `auth` - User authentication state
- `leads` - Leads and lead pipeline
- `properties` - Property inventory and search
- `dashboard` - Dashboard KPIs and analytics
- `ui` - Theme, sidebar state, notifications

## API Documentation

All API endpoints are documented in the route files:
- `/server/routes/auth.ts`
- `/server/routes/leads.ts`
- `/server/routes/properties.ts`
- `/server/routes/agents.ts`
- `/server/routes/transactions.ts`
- `/server/routes/communications.ts`
- `/server/routes/crm.ts`

**Base URL**: `http://localhost:5000/api`

**Authentication**: Include JWT token in Authorization header
```
Authorization: Bearer <token>
```

## Business Context

For comprehensive business documentation, see `/business/` folder:
- Company structure and team (9 personas)
- Services and pricing models
- Business workflows and processes
- Technical and functional requirements
- System architecture and integrations
- Market positioning and research

## Development Workflow

1. **Feature Development**
   - Create feature branch from `develop`
   - Implement feature with components + tests
   - Create Redux slices if state is needed
   - Add TypeScript types
   - Write unit tests (target 80%+ coverage)

2. **Testing**
   - Unit tests: `npm run test`
   - E2E tests: `npm run test:e2e`
   - Visual regression: Use Playwright
   - Performance: Use Lighthouse

3. **Code Quality**
   - Run ESLint: `npm run lint`
   - Format code: `npm run format`
   - Check TypeScript: `npm run type-check`

4. **Commit & Push**
   - Follow conventional commits
   - Push to feature branch
   - Create pull request

## Next Steps

- [ ] Implement Redux async thunks for API integration
- [ ] Build React components for leads, properties, dashboard
- [ ] Implement authentication flows (login, signup, 2FA)
- [ ] Connect frontend to backend API
- [ ] Integrate WhatsApp bot
- [ ] Write comprehensive E2E tests
- [ ] Performance optimization and monitoring
- [ ] Production deployment

## Team & Roles

The platform is designed for 9 key personas:

1. **Zoe** (Executive) - Dashboard, KPIs, reporting
2. **Clara** (Lead Manager) - Lead management, scoring, CRM
3. **Mary** (Inventory Manager) - Property listings, inventory
4. **Sophia** (Pipeline Manager) - Transaction pipeline
5. **Theodora** (Finance Director) - Commissions, payments
6. **Daisy** (Leasing Manager) - Tenants, leases
7. **Linda** (WhatsApp CRM) - WhatsApp messaging
8. **Nina** (Bot Manager) - Bot automation
9. **Ethan** (Support) - Customer support

## Support & Documentation

- **Architecture Docs**: See `/business/architecture/`
- **API Docs**: See `/server/routes/`
- **Type Documentation**: See `/src/types/`
- **Business Requirements**: See `/business/requirements/`

## License

Copyright © 2026 White Caves Real Estate LLC. All rights reserved.

---

**Last Updated**: January 2026
**Phase**: 1 - Foundation Complete
**Status**: ✅ Ready for Component & Controller Implementation
