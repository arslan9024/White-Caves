# 🏗️ ARCHITECTURE GUIDE
## Code Structure, Refactoring Details & Implementation Guide

**Last Updated:** March 12, 2026  
**Scope:** Full codebase structure, folder hierarchy, refactoring patterns, and best practices

---

## 📦 CURRENT FOLDER STRUCTURE

```
white-caves/
├── src/
│   ├── assets/                 (Images, fonts, videos)
│   ├── components/             (150+ files - NEEDS RESTRUCTURE)
│   │   ├── (CRM variants)      (Zoe, Linda, Mary, Daisy, etc. - DUPLICATE)
│   │   ├── (Modals)            (3+ versions - CONSOLIDATE)
│   │   ├── (Forms)             (Form components)
│   │   ├── (Cards)             (Property, Lead, Data cards)
│   │   ├── (Navigation)        (Navbars, Sidebars, Breadcrumbs)
│   │   └── ... (150+ more at root level)
│   ├── pages/                  (25 page routes)
│   ├── context/                (Theme, Language, Profile contexts)
│   ├── hooks/                  (Custom hooks - mostly at component level)
│   ├── services/               (3 services - NEEDS EXPANSION)
│   ├── store/                  (Redux slices + middleware)
│   ├── styles/                 (58 CSS files - CONSOLIDATE TO styled-components)
│   └── utils/                  (Helper functions - scattered)
├── server/
│   ├── controllers/            (Route handlers)
│   ├── middleware/             (Express middleware)
│   ├── models/                 (4 Mongoose models - NEEDS EXPANSION)
│   ├── routes/                 (API endpoints - basic)
│   └── services/               (Business logic - minimal)
├── public/                     (Static assets)
├── tests/                      (15-20% coverage - NEEDS EXPANSION)
├── .env.example                (Environment template)
├── package.json                (Project config)
├── tsconfig.json               (TypeScript config)
├── vite.config.js              (Vite bundler config)
├── vitest.config.js            (Unit test config)
├── cypress.config.ts           (E2E test config)
└── ... (339 .md files - CONSOLIDATE TO /plans/)
```

---

## 🔄 PROPOSED RESTRUCTURE

### Components Folder Reorganization

```
src/components/
├── 📁 ui/                      (Reusable UI components - design system)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Container.tsx
│   ├── Badge.tsx
│   ├── CheckBox.tsx
│   ├── Divider.tsx
│   ├── Icon.tsx
│   ├── Image.tsx
│   ├── Input.tsx
│   ├── Label.tsx
│   ├── Link.tsx
│   ├── Loader.tsx
│   ├── Modal.tsx               (UNIFIED - one version)
│   ├── Overlay.tsx
│   ├── Pagination.tsx
│   ├── Progress.tsx
│   ├── Radio.tsx
│   ├── Select.tsx
│   ├── Skeleton.tsx
│   ├── StatusBadge.tsx
│   ├── Table.tsx
│   ├── Tab.tsx
│   ├── TextArea.tsx
│   ├── Toast.tsx               (UNIFIED)
│   ├── Tooltip.tsx
│   └── index.ts                (Export all)
│
├── 📁 layout/                  (Layout wrappers & shell components)
│   ├── TopNavBar.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   ├── DualSidebarLayout.tsx
│   ├── MainLayout.tsx
│   ├── AuthLayout.tsx
│   ├── DashboardLayout.tsx
│   └── index.ts
│
├── 📁 features/                (Feature-specific business logic)
│   ├── authentication/
│   │   ├── LoginForm.tsx
│   │   ├── SignUpForm.tsx
│   │   ├── PasswordReset.tsx
│   │   ├── MFASetup.tsx
│   │   └── useAuth.ts
│   │
│   ├── property-management/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyForm.tsx
│   │   ├── PropertyDetails.tsx
│   │   ├── PropertyComparison.tsx
│   │   ├── PropertyFilters.tsx
│   │   ├── VirtualTour.tsx
│   │   ├── hooks/
│   │   │   ├── usePropertyData.ts
│   │   │   ├── usePropertyFilters.ts
│   │   │   └── usePropertyCompare.ts
│   │   └── index.ts
│   │
│   ├── crm-dashboard/          (CONSOLIDATED from 12 versions)
│   │   ├── CRMDashboard.tsx
│   │   ├── modules/
│   │   │   ├── OverviewModule.tsx
│   │   │   ├── LeadsModule.tsx
│   │   │   ├── PropertiesModule.tsx
│   │   │   ├── AnalyticsModule.tsx
│   │   │   ├── FinanceModule.tsx
│   │   │   └── SettingsModule.tsx
│   │   ├── hooks/
│   │   │   ├── useCRMData.ts
│   │   │   ├── useCRMFilters.ts
│   │   │   └── useCRMExport.ts
│   │   └── index.ts
│   │
│   ├── lead-management/
│   │   ├── LeadCard.tsx
│   │   ├── LeadForm.tsx
│   │   ├── LeadDetails.tsx
│   │   ├── LeadScoring.tsx
│   │   ├── hooks/
│   │   │   ├── useLeadData.ts
│   │   │   ├── useLeadAssignment.ts
│   │   │   └── useLeadScoring.ts
│   │   └── index.ts
│   │
│   ├── commission-tracking/
│   │   ├── CommissionDashboard.tsx
│   │   ├── CommissionForm.tsx
│   │   ├── CommissionReport.tsx
│   │   ├── hooks/
│   │   │   ├── useCommissionData.ts
│   │   │   └── useCommissionCalculations.ts
│   │   └── index.ts
│   │
│   ├── whatsapp-integration/
│   │   ├── WhatsAppChat.tsx
│   │   ├── WhatsAppStatus.tsx
│   │   ├── hooks/
│   │   │   ├── useWhatsApp.ts
│   │   │   ├── useWhatsAppSession.ts
│   │   │   └── useWhatsAppMessages.ts
│   │   └── index.ts
│   │
│   ├── analytics/
│   │   ├── DashboardCharts.tsx
│   │   ├── ReportBuilder.tsx
│   │   ├── ExportData.tsx
│   │   ├── hooks/
│   │   │   ├── useAnalyticsData.ts
│   │   │   └── useChartData.ts
│   │   └── index.ts
│   │
│   └── (other features...)
│
└── 📁 design-system/           (Tokens, themes, global styles)
    ├── tokens.ts               (Color palette, spacing, typography)
    ├── GlobalStyles.ts
    ├── ThemeProvider.tsx
    ├── hooks/
    │   ├── useTheme.ts
    │   └── useTokens.ts
    └── index.ts
```

---

## 🗄️ Server/Backend Restructure

### Current Structure (MINIMAL)

```
server/
├── controllers/
├── middleware/
├── models/                     (4 models)
├── routes/
└── services/
```

### Proposed Structure (PRODUCTION-READY)

```
server/
├── 📁 config/
│   ├── database.ts             (Prisma/MongoDB setup)
│   ├── jwt.ts
│   ├── firebase.ts
│   └── environment.ts
│
├── 📁 constants/
│   ├── roles.ts
│   ├── permissions.ts
│   ├── httpStatus.ts
│   └── errorMessages.ts
│
├── 📁 models/                  (Prisma or Mongoose schemas)
│   ├── User.ts
│   ├── Property.ts
│   ├── Lead.ts
│   ├── Commission.ts
│   ├── Transaction.ts
│   ├── ApiKey.ts
│   ├── AuditLog.ts
│   ├── ImportSession.ts
│   ├── WhatsAppSession.ts
│   ├── Template.ts
│   └── (more as needed)
│
├── 📁 services/                (Business logic layer)
│   ├── AuthService.ts
│   ├── PropertyService.ts
│   ├── LeadService.ts
│   ├── CommissionService.ts
│   ├── AnalyticsService.ts
│   ├── WhatsAppService.ts
│   ├── NotificationService.ts
│   ├── ExportService.ts
│   └── EmailService.ts
│
├── 📁 controllers/             (Route handlers)
│   ├── authController.ts
│   ├── propertyController.ts
│   ├── leadController.ts
│   ├── commissionController.ts
│   ├── analyticsController.ts
│   ├── whatsappController.ts
│   └── userController.ts
│
├── 📁 routes/
│   ├── auth.ts
│   ├── properties.ts
│   ├── leads.ts
│   ├── commissions.ts
│   ├── analytics.ts
│   ├── whatsapp.ts
│   ├── users.ts
│   └── index.ts (combine all routes)
│
├── 📁 middleware/
│   ├── authMiddleware.ts       (JWT verification)
│   ├── roleMiddleware.ts       (Role-based access)
│   ├── errorHandler.ts
│   ├── loggerMiddleware.ts
│   ├── validationMiddleware.ts
│   ├── rateLimitMiddleware.ts
│   └── corsMiddleware.ts
│
├── 📁 utils/
│   ├── validators.ts
│   ├── formatters.ts
│   ├── logger.ts
│   ├── errorHandler.ts
│   └── jwt.ts
│
├── 📁 tests/
│   ├── services.test.ts
│   ├── routes.test.ts
│   ├── middleware.test.ts
│   └── integration.test.ts
│
└── app.ts                      (Express app setup)
```

---

## 🔧 SERVICE LAYER ARCHITECTURE

### Current State (INCOMPLETE)
- 3 basic services
- Most logic in components/controllers

### Proposed State (PRODUCTION)

#### PropertyService
```typescript
class PropertyService {
  // Query methods
  async getAllProperties(filters) {}
  async getPropertyById(id) {}
  async searchProperties(query) {}
  async getPropertyComparisons(ids) {}
  
  // CRUD methods
  async createProperty(data) {}
  async updateProperty(id, data) {}
  async deleteProperty(id) {}
  async bulkUpdateProperties(updates) {}
  
  // Advanced methods
  async getPropertyAnalytics(propertyId) {}
  async getFeaturedProperties() {}
  async getPropertyStatistics(filters) {}
  
  // Validation
  private validatePropertyData(data) {}
}
```

#### LeadService
```typescript
class LeadService {
  async getAllLeads(filters) {}
  async getLeadById(id) {}
  async createLead(data) {}
  async updateLead(id, data) {}
  async deleteLead(id) {}
  async assignLeadToAgent(leadId, agentId) {}
  async scoreLeads() {}               // AI scoring
  async sendFollowUp(leadId) {}
  async getLeadAnalytics() {}
}
```

#### CommissionService
```typescript
class CommissionService {
  async getAllCommissions(filters) {}
  async getCommissionById(id) {}
  async createCommission(data) {}
  async updateCommission(id, data) {}
  async calculateCommission(transaction) {}
  async generateCommissionReport(filters) {}
  async distributeCommissions() {}
  async getCommissionStatistics() {}
}
```

#### AnalyticsService
```typescript
class AnalyticsService {
  async getDashboardMetrics() {}
  async getPropertyMetrics() {}
  async getLeadMetrics() {}
  async getCommissionMetrics() {}
  async generateReport(type, filters) {}
  async exportData(format, filters) {}
  async trackEvent(event, data) {}
}
```

#### And more...
- WhatsAppService
- NotificationService
- AuthService
- ExportService
- EmailService

---

## 🔌 API ENDPOINT STRUCTURE

### Authentication (Auth Service)
```
POST   /api/auth/register              (Create account)
POST   /api/auth/login                 (Login)
POST   /api/auth/login/social          (Social login)
POST   /api/auth/login/uae-pass        (UAE Pass)
POST   /api/auth/logout                (Logout)
POST   /api/auth/refresh               (Refresh token)
POST   /api/auth/password/reset        (Reset password)
GET    /api/auth/verify-email          (Email verification link)
POST   /api/auth/mfa/setup             (Setup MFA)
POST   /api/auth/mfa/verify            (Verify MFA code)
```

### Properties (Property Service)
```
GET    /api/properties                 (List all)
GET    /api/properties/:id             (Get detail)
GET    /api/properties/search          (Search)
GET    /api/properties/featured        (Featured list)
POST   /api/properties                 (Create)
PUT    /api/properties/:id             (Update)
DELETE /api/properties/:id             (Delete)
POST   /api/properties/bulk            (Bulk operations)
GET    /api/properties/compare         (Compare properties)
GET    /api/properties/analytics       (Analytics)
```

### Leads (Lead Service)
```
GET    /api/leads                      (List all)
GET    /api/leads/:id                  (Get detail)
POST   /api/leads                      (Create)
PUT    /api/leads/:id                  (Update)
DELETE /api/leads/:id                  (Delete)
POST   /api/leads/:id/assign           (Assign to agent)
POST   /api/leads/:id/score            (Calculate score)
GET    /api/leads/analytics            (Analytics)
POST   /api/leads/:id/followup         (Send follow-up)
```

### Commissions (Commission Service)
```
GET    /api/commissions                (List all)
GET    /api/commissions/:id            (Get detail)
POST   /api/commissions                (Create)
PUT    /api/commissions/:id            (Update)
DELETE /api/commissions/:id            (Delete)
POST   /api/commissions/calculate      (Calculate amount)
GET    /api/commissions/report         (Generate report)
GET    /api/commissions/analytics      (Analytics)
POST   /api/commissions/distribute     (Distribute)
```

### And more...
- `/api/analytics/*`
- `/api/whatsapp/*`
- `/api/notifications/*`
- `/api/users/*`
- `/api/exports/*`

---

## 🎨 Design System & Styling Strategy

### Current: 60% styled-components + 30% CSS + 10% inline styles
### Target: 100% styled-components (unified)

### Design Tokens (src/components/design-system/tokens.ts)

```typescript
export const tokens = {
  // COLOR PALETTE (Crimson theme + neutrals + functional)
  colors: {
    // Primary
    crimson: '#D4B5A0',
    crimsonDark: '#C39B86',
    crimsonLight: '#E6DDD5',
    
    // Secondary
    navy: '#1A2B4A',
    navyLight: '#2D4563',
    slate: '#4A5F7F',
    
    // Functional
    success: '#27AE60',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#3498DB',
    
    // Neutrals
    black: '#000000',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    white: '#FFFFFF',
  },
  
  // TYPOGRAPHY
  typography: {
    fontFamily: {
      primary: "'Inter', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },
  
  // SPACING
  spacing: {
    0: '0px',
    px: '1px',
    0.5: '2px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },
  
  // SHADOWS
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  // BORDER RADIUS
  borderRadius: {
    none: '0px',
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px',
  },
  
  // TRANSITIONS
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
  
  // BREAKPOINTS
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
    ultrawide: '1536px',
  },
};
```

### styled-components Usage Patterns

```typescript
// ✅ DO THIS - Use design tokens
import styled from 'styled-components';
import { tokens } from '@/components/design-system/tokens';

const ButtonWrapper = styled.button`
  padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
  background-color: ${tokens.colors.crimson};
  color: ${tokens.colors.white};
  border-radius: ${tokens.borderRadius.md};
  transition: background-color ${tokens.transitions.fast};
  
  &:hover {
    background-color: ${tokens.colors.crimsonDark};
  }
`;

// ✅ DO THIS - Use media queries with breakpoints
const ResponsiveContainer = styled.div`
  width: 100%;
  padding: ${tokens.spacing[4]};
  
  @media (min-width: ${tokens.breakpoints.tablet}) {
    padding: ${tokens.spacing[8]};
  }
`;

// ❌ DON'T DO THIS - Hardcoded values
const BadButton = styled.button`
  padding: 16px;
  background-color: #D4B5A0;
  color: #anything;
`;
```

---

## 📊 STATE MANAGEMENT (Redux)

### Current Redux Structure
- 15 slices for various features
- Some duplication between slices
- Async thunks for API calls

### Proposed Improvements

```typescript
// Better slice organization
store/
├── features/
│   ├── auth/
│   │   ├── authSlice.ts
│   │   ├── authThunks.ts
│   │   └── authSelectors.ts
│   ├── properties/
│   │   ├── propertiesSlice.ts
│   │   ├── propertiesThunks.ts
│   │   └── propertiesSelectors.ts
│   ├── leads/
│   │   ├── leadsSlice.ts
│   │   ├── leadsThunks.ts
│   │   └── leadsSelectors.ts
│   └── (other features...)
├── middleware/
│   ├── loggerMiddleware.ts
│   ├── analyticMiddleware.ts
│   └── errorMiddleware.ts
└── store.ts (combine everything)
```

### Best Practices

```typescript
// ✅ Use selectors (reusable, memoizable)
export const selectAllProperties = (state) => state.properties.items;
export const selectPropertiesLoading = (state) => state.properties.loading;
export const selectPropertiesByCity = (state, city) =>
  state.properties.items.filter(p => p.city === city);

// ✅ Use extraReducers for thunks
extraReducers: (builder) =>
  builder
    .addCase(fetchProperties.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchProperties.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    })
    .addCase(fetchProperties.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    })
```

---

## 📝 REFACTORING CHECKLIST

### Phase 1: Foundation (3-4 days)
- [ ] Create new folder structure
- [ ] Create design tokens file
- [ ] Create GlobalStyles with tokens
- [ ] Create UI component library (Button, Card, Modal, etc.)
- [ ] Setup ThemeProvider

### Phase 2: CRM Consolidation (2 days)
- [ ] Analyze 12 CRM variants
- [ ] Create unified CRM component
- [ ] Extract modules (Overview, Leads, Properties, etc.)
- [ ] Delete duplicate folders
- [ ] Update routes & imports

### Phase 3: Component Migration (3-4 days)
- [ ] Move layout components to src/components/layout/
- [ ] Move feature components to src/components/features/
- [ ] Convert CSS to styled-components
- [ ] Remove orphaned CSS files
- [ ] Update all imports

### Phase 4: Backend Restructure (2-3 days)
- [ ] Create service layer classes
- [ ] Extract business logic from controllers
- [ ] Create additional models (User, Lead, Property, etc.)
- [ ] Expand API endpoints
- [ ] Update middleware

### Phase 5: Testing (variable)
- [ ] Unit tests for utilities & services
- [ ] Component tests for UI library
- [ ] Integration tests for services
- [ ] E2E tests for user flows
- [ ] Target: 80%+ coverage

---

## ✅ SUCCESS CRITERIA

1. **Folder Structure:** Clean, organized, following feature-based architecture
2. **Code Duplication:** Reduced from 4+ patterns to 0 (100% unique)
3. **CSS/Styling:** 100% styled-components (no CSS files)
4. **Design Tokens:** Single source of truth for colors, spacing, typography
5. **Service Layer:** All business logic in services, not components
6. **Test Coverage:** 80%+ coverage across utilities, services, components
7. **Build:** 0 errors, <2MB bundle
8. **TypeScript:** <10 errors in strict mode
9. **Performance:** Core Web Vitals all green
10. **Documentation:** Updated ARCHITECTURE.md & TECHNICAL_REFERENCE.md

---

**This guide is your technical blueprint. Follow the folder structure, use design tokens, build services, and maintain consistency.**

**Architecture alignment = Production readiness! 🚀**