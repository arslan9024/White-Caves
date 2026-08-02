# White Caves: Prioritized TypeScript Conversion List
## ALL Remaining .js and .jsx Files Blocking Converted .tsx Pages

**Generated:** March 12, 2026  
**Total Files:** 150+ files requiring conversion  
**Focus:** Files imported by converted .tsx pages

---

## 📊 PRIORITY SUMMARY

| Priority | File Count | Pages Affected | Blockers |
|----------|-----------|----------------|----------|
| **HIGH** | 65 files | 36+ pages | CRITICAL - Pages won't compile |
| **MEDIUM** | 35 files | 20+ pages | IMPORTANT - Dashboard/CRM features |
| **LOW** | 35+ files | Various | OPTIONAL - Enhancement features |
| **TOTAL** | 150+ | ALL | Must convert Phase 1 (HIGH) |

---

## 🔴 HIGH PRIORITY - UNBLOCK ALL PAGES NOW

### Redux Store Files (16 files)
**Status:** BLOCKING all pages | **Impact:** ALL PAGES
```
src/store/store.js | Central Redux store config - ALL pages fail without this | HIGH
src/store/propertySlice.js | Imported by HomePage, PropertiesPage | HIGH
src/store/userSlice.js | Imported by ProfilePage, UnifiedDashboardPage | HIGH
src/store/authSlice.js | Auth state - SignInPage, ProfilePage fail | HIGH
src/store/dashboardSlice.js | Imported by PropertiesPage, dashboard pages | HIGH
src/store/navigationSlice.ts | ALREADY CONVERTED - but depends on others | HIGH
src/store/contentSlice.js | CRM/dashboard state | HIGH
src/store/roleSlice.js | Role state - all role pages | HIGH
src/store/crmDataSlice.js | CRM data for dashboards | HIGH
src/store/featuresSlice.js | Feature flags | HIGH
src/store/analyticsSlice.js | Analytics state | HIGH
src/store/managingDirectorDashboardSlice.js | Manager dashboard | HIGH
src/store/slices/inventorySlice.js | Inventory state | HIGH
src/store/slices/aiAssistantDashboardSlice.js | AI assistant state | HIGH
src/store/slices/sidebarSlice.js | Sidebar state | HIGH
src/store/middleware/eventBusMiddleware.js | Redux event bus middleware | HIGH
```

### Configuration Files (5 files)
**Status:** BLOCKING page functionality | **Impact:** 25+ pages
```
src/config/ROLE_TAB_MAPPING.js | Role tab config - UnifiedDashboardPage line 4 uses this | HIGH
src/config/navigation.js | Navigation structure - all pages with nav | HIGH
src/config/assistantRegistry.js | AI assistant definitions - UnifiedDashboardPage | HIGH
src/config/businessModel.js | Business model config - owner dashboard | HIGH
src/config/platformFeatures.js | Feature definitions - DesignSystemTest + features | HIGH
```

### Layout Components - DIRECTLY IMPORTED (15 files)
**Status:** BLOCKING 15+ pages | **Impact:** IMMEDIATE page failures
```
src/components/layout/AppLayout.jsx | HomePage line 4 imports - 6 pages depend | HIGH
src/components/layout/MainNavBar/MainNavBar.jsx | Navigation bar - many pages | HIGH
src/components/layout/MainNavBar/MainNavBarUpdated.jsx | MainNavBar fallback | HIGH
src/components/layout/MainNavBar/index.js | Export wrapper for MainNavBar | HIGH
src/components/layout/SidebarContainer/SidebarContainer.jsx | UnifiedDashboardPage line 7 | HIGH
src/components/layout/SidebarContainer/index.js | Export wrapper | HIGH
src/components/layout/AIAssistantsPanel/AIAssistantsPanel.jsx | UnifiedDashboardPage line 8 | HIGH
src/components/layout/AIAssistantsPanel/index.js | Export wrapper | HIGH
src/components/layout/DepartmentContentPanel/DepartmentContentPanel.jsx | UnifiedDashboardPage line 9 | HIGH
src/components/layout/DepartmentContentPanel/index.js | Export wrapper | HIGH
src/components/layout/UnifiedDashboardLayout/UnifiedDashboardLayout.jsx | BuyerDashboardPage, SellerDashboardPage, TenantDashboardPage | HIGH
src/components/layout/UnifiedDashboardLayout/useDashboardState.js | Dependency of UnifiedDashboardLayout | HIGH
src/components/layout/UnifiedDashboardLayout/index.js | Export wrapper | HIGH
src/components/layout/RolePageLayout.jsx | Role page wrapper component | HIGH
src/components/layout/TopNavBar.jsx | Top navigation bar | HIGH
```

### Homepage Components - MASS IMPORT (17 files)
**Status:** BLOCKING HomePage completely | **Impact:** HomePage won't render
```
src/components/homepage/Hero/Hero.jsx | HomePage line 7 imports | HIGH
src/components/homepage/Hero/index.js | Export wrapper | HIGH
src/components/homepage/Features/Features.jsx | HomePage line 8 imports | HIGH
src/components/homepage/Features/index.js | Export wrapper | HIGH
src/components/homepage/Locations/Locations.jsx | HomePage line 9 imports | HIGH
src/components/homepage/Locations/index.js | Export wrapper | HIGH
src/components/homepage/Team/Team.jsx | HomePage line 10 imports | HIGH
src/components/homepage/Team/index.js | Export wrapper | HIGH
src/components/homepage/Testimonials/Testimonials.jsx | HomePage line 11 imports | HIGH
src/components/homepage/Testimonials/index.js | Export wrapper | HIGH
src/components/homepage/Contact/ContactCTA.jsx | HomePage line 12 imports | HIGH
src/components/homepage/Contact/index.js | Export wrapper | HIGH
src/components/InteractiveMap.jsx | HomePage line 13 imports | HIGH
src/components/PropertyComparison.jsx | HomePage line 14 imports | HIGH
src/components/OffPlanTracker.jsx | HomePage line 15 imports | HIGH
src/components/NeighborhoodAnalyzer.jsx | HomePage line 16 imports | HIGH
src/components/RentVsBuyCalculator.jsx | HomePage line 17 imports | HIGH
```

### Core Components (6 files)
**Status:** BLOCKING multiple pages | **Impact:** 6+ pages missing key features
```
src/components/Footer.jsx | HomePage, PropertiesPage, AboutPage, CareersPage, ContactPage, ServicesPage import | HIGH
src/components/ClickToChat.jsx | HomePage, PropertiesPage, AboutPage, CareersPage, ContactPage, ServicesPage import | HIGH
src/components/ErrorBoundary.jsx | Error handling wrapper | HIGH
src/components/Error.jsx | Error display component | HIGH
src/components/Auth.jsx | Authentication UI | HIGH
src/components/RecentlyViewed.jsx | HomePage line 24 imports | HIGH
```

### Shared Property Components (3 files)
**Status:** BLOCKING PropertiesPage | **Impact:** Property rendering fails
```
src/shared/components/property/PropertyImageSlider.jsx | PropertiesPage line 9 imports | HIGH
src/shared/components/property/PropertyDetailModal.jsx | PropertiesPage line 9 imports | HIGH
src/shared/components/property/index.js | Export wrapper | HIGH
```

### Common Components - EXPORT HUB (16 files)
**Status:** BLOCKING 30+ component imports | **Impact:** Component library broken
```
src/components/common/index.js | CRITICAL HUB - exports DataCard, PageHeader, DataCardGrid, DataList, DataListItem, ActionButton, QuickLinks, LeadCard, PropertyCard, etc. | HIGH
src/components/common/DataCard.jsx | TenantDashboardPage line 5 imports DataCard,DataCardGrid,DataList,DataListItem | HIGH
src/components/common/DataCard/index.js | Export wrapper | HIGH
src/components/common/PageHeader.jsx | Layout/header pages import | HIGH
src/components/common/PageHeader/index.js | Export wrapper | HIGH
src/components/common/UniversalNav.jsx | Layout pages use this | HIGH
src/components/common/SuspenseLoader.jsx | UnifiedDashboardPage line 5 imports | HIGH
src/components/common/RoleSwitcher.jsx | Dashboard pages | HIGH
src/components/common/SubNavBar.jsx | Dashboard pages | HIGH
src/components/common/TabbedPanel.jsx | Dashboard pages | HIGH
src/components/common/StatusNotification.jsx | Status/notification displays | HIGH
src/components/common/QuickLinks.jsx | Dashboard pages | HIGH
src/components/common/LeadCard.jsx | LeadsTab, CRM pages | HIGH
src/components/common/PropertyCard.jsx | Properties, listings | HIGH
src/components/common/ContentSlider.jsx | Content sections | HIGH
src/components/common/RequirePermission.jsx | Permission gates | HIGH
```

### Custom Hooks (9 files)
**Status:** BLOCKING component functionality | **Impact:** UI interactivity fails
```
src/hooks/useRecentlyViewed.js | HomePage line 24 imports useRecentlyViewed | HIGH
src/hooks/useAdvancedFilters.js | Filter components use this | HIGH
src/hooks/usePermissions.js | Permission checks throughout | HIGH
src/hooks/useApi.js | All data fetching | HIGH
src/hooks/useActionHandler.js | Dashboard action handlers | HIGH
src/hooks/useVirtualTour.js | VirtualTourGallery component | HIGH
src/hooks/useRecommendations.js | Recommendation components | HIGH
src/hooks/useSwipeGesture.js | Swipeable components | HIGH
src/hooks/usePWA.js | PWA functionality | HIGH
```

---

## 🟡 MEDIUM PRIORITY - DASHBOARD & CRM FEATURES

### Owner/Dashboard Tabs (8 files)
**Status:** BLOCKING UnifiedDashboardPage functionality | **Impact:** Dashboard tabs won't render
```
src/components/owner/tabs/OverviewTab.jsx | UnifiedDashboardPage line 19 imports | MEDIUM
src/components/owner/tabs/PropertiesTab.jsx | UnifiedDashboardPage line 20 imports | MEDIUM
src/components/owner/tabs/AgentsTab.jsx | UnifiedDashboardPage line 21 imports | MEDIUM
src/components/owner/tabs/LeadsTab.jsx | UnifiedDashboardPage line 22 imports | MEDIUM
src/components/owner/tabs/ContractsTab.jsx | UnifiedDashboardPage line 23 imports | MEDIUM
src/components/owner/tabs/AnalyticsTab.jsx | UnifiedDashboardPage line 24 imports | MEDIUM
src/components/owner/tabs/SettingsTab.jsx | UnifiedDashboardPage line 25 imports | MEDIUM
src/components/owner/tabs/UsersTab.jsx | UnifiedDashboardPage line 26 imports | MEDIUM
```

### CRM Dashboard Components (10 files)
**Status:** BLOCKING CRM feature pages | **Impact:** CRM/dashboard pages fail
```
src/components/dashboard/DashboardHeader.jsx | Dashboard header component | MEDIUM
src/components/dashboard/AssistantNavSidebar.jsx | Assistant navigation | MEDIUM
src/components/dashboard/MarketAnalyticsDashboard.jsx | Analytics dashboard | MEDIUM
src/components/crm/AIAssistantHub.jsx | AI assistant interface | MEDIUM
src/components/crm/AICommandCenter.jsx | Command center | MEDIUM
src/components/crm/AIAssistantSelector.jsx | Assistant selection | MEDIUM
src/components/crm/PropertyValuationModule.jsx | Property valuation | MEDIUM
src/components/crm/LeadScoringModule.jsx | Lead scoring | MEDIUM
src/components/crm/DLDIntegrationModule.jsx | DLD integration | MEDIUM
src/components/dashboards/RoleSelector.jsx | Role selection UI | MEDIUM
```

### Specialized Dashboards (6 files)
**Status:** BLOCKING role-specific pages | **Impact:** Role dashboards fail
```
src/components/dashboards/TenantDashboard.jsx | Tenant-specific dashboard | MEDIUM
src/components/dashboards/LandlordDashboard.jsx | Landlord-specific dashboard | MEDIUM
src/components/dashboards/BuyerDashboard.jsx | Buyer-specific dashboard | MEDIUM
src/components/dashboards/SellerDashboard.jsx | Seller-specific dashboard | MEDIUM
src/components/dashboards/AgentDashboard.jsx | Agent-specific dashboard | MEDIUM
src/components/dashboards/TeamLeaderDashboard.jsx | Team leader dashboard | MEDIUM
```

### Form & Input Components (5 files)
**Status:** BLOCKING form rendering | **Impact:** Forms won't work
```
src/components/ui/Input/Input.jsx | Form input component | MEDIUM
src/components/ui/Button/Button.jsx | Form button component | MEDIUM
src/components/ui/Card/Card.jsx | Card layout component | MEDIUM
src/components/ui/Badge/Badge.jsx | Badge component | MEDIUM
src/components/common/forms/* | Form utility components | MEDIUM
```

### Property-Related Components (5 files)
**Status:** BLOCKING property pages | **Impact:** Property display fails
```
src/components/PropertyDetail.jsx | Property detail view | MEDIUM
src/components/PropertySearch.jsx | Property search | MEDIUM
src/components/SwipeablePropertyCards.jsx | Swipeable property cards | MEDIUM
src/components/VirtualTourGallery.jsx | Virtual tour gallery | MEDIUM
src/components/DubaiMap.jsx | Dubai map display | MEDIUM
```

### Module Export Wrappers (7 files)
**Status:** BLOCKING exports | **Impact:** Module imports fail
```
src/components/layout/AppLayout/index.js | AppLayout export wrapper | MEDIUM
src/components/layout/TopNavBar/index.js | TopNavBar export wrapper | MEDIUM
src/components/layout/UnifiedProfile/index.js | UnifiedProfile export wrapper | MEDIUM
src/components/layout/RightPanelContainer/index.js | RightPanelContainer export wrapper | MEDIUM
src/components/layout/CrimsonSidebar/index.js | CrimsonSidebar export wrapper | MEDIUM
src/components/layout/DashboardShell/index.js | DashboardShell export wrapper | MEDIUM
src/shared/components/index.js | Shared components export hub | MEDIUM
```

---

## 🟢 LOW PRIORITY - OPTIONAL/SECONDARY FEATURES

### Profile & Authentication (5 files)
```
src/components/Profile.jsx | User profile display | LOW
src/components/RoleGateway.jsx | Role entry point | LOW
src/components/RoleNavigation.jsx | Role-based navigation | LOW
src/components/RoleSelector.jsx | Role selection UI | LOW
src/components/OnboardingGateway.jsx | Onboarding flow | LOW
```

### Navigation & UI Components (10 files)
```
src/components/Breadcrumb.jsx | Breadcrumb navigation | LOW
src/components/FeaturedAgents.jsx | Featured agents display | LOW
src/components/ThemeToggle.jsx | Theme switching | LOW
src/components/LanguageToggle.jsx | Language switching | LOW
src/components/Loading.jsx | Loading state | LOW
src/components/PageLoader.jsx | Page loader | LOW
src/components/SkeletonLoader.jsx | Skeleton loading | LOW
src/components/Error.jsx | Error display (alternative) | LOW
src/components/TestimonialsCarousel.jsx | Testimonials carousel | LOW
src/components/BlogSection.jsx | Blog section (has .tsx too) | LOW
```

### Image & Media Components (5 files)
```
src/components/LazyImage.jsx | Lazy loading images | LOW
src/components/OptimizedImage.jsx | Image optimization | LOW
src/components/ImageGallery.jsx | Image gallery | LOW
src/components/VirtualTour.jsx | Virtual tour component | LOW
src/components/DubaiMap.jsx | Map display (MEDIUM if used) | LOW
```

### Specialized Features (8 files)
```
src/components/Checkout.jsx | E-commerce checkout | LOW
src/components/MortgageCalculator.jsx | Mortgage calculation tool | LOW
src/components/TenancyContract.jsx | Contract display | LOW
src/components/TenancyAgreementSigning.jsx | Contract signing | LOW
src/components/PassportUpload.jsx | File upload | LOW
src/components/ProfileCompletion.jsx | Profile setup | LOW
src/components/SignaturePad.jsx | Signature input | LOW
src/components/ServiceTracker.jsx | Service tracking | LOW
```

### Owner Features (4 files)
```
src/components/owner/tabs/WhatsAppTab.jsx | WhatsApp integration | LOW
src/components/owner/tabs/ChatbotTab.jsx | Chatbot features | LOW
src/components/owner/tabs/UAEPassTab.jsx | UAE Pass integration | LOW
src/components/owner/ProductivityTools.jsx | Productivity tools | LOW
```

### CRM Modules (15+ files)
```
src/components/crm/inventory/ClusterBrowser.jsx | Inventory clusters | LOW
src/components/crm/inventory/PropertyMatrix.jsx | Property matrix | LOW
src/components/crm/inventory/WebDataHarvester.jsx | Web data harvesting | LOW
src/components/crm/inventory/ImageDataExtractor.jsx | Image extraction | LOW
src/components/crm/inventory/DamacAssetFetcher.jsx | Asset fetching | LOW
src/components/crm/inventory/DataQualityIndicators.jsx | Data quality | LOW
src/components/crm/inventory/FilterPanel.jsx | Filter UI | LOW
src/components/crm/ClientsDashboard/ClientsDashboard.jsx | Client dashboard | LOW
src/components/crm/AgentsDashboard/AgentsDashboard.jsx | Agent dashboard | LOW
src/components/crm/NancyHRCRM_NEW/* | HR CRM module | LOW
src/components/crm/ClaraLeadsCRM_NEW/* | Leads CRM module | LOW
src/components/crm/DaisyLeasingCRM_NEW/* | Leasing CRM module | LOW
src/components/crm/OliviaMarketingCRM_NEW/* | Marketing CRM module | LOW
src/components/crm/ZoeExecutiveCRM_NEW/* | Executive CRM module | LOW
src/components/crm/HazelFrontendCRM_NEW/* | Frontend CRM module | LOW
src/components/crm/WillowBackendCRM_NEW/* | Backend CRM module | LOW
src/components/crm/LailaComplianceCRM_NEW/* | Compliance CRM module | LOW
src/components/crm/MaryInventoryCRM_NEW/* | Inventory CRM module | LOW
src/components/crm/NinaWhatsAppBotCRM_NEW/* | WhatsApp bot CRM | LOW
src/components/crm/TheodoraFinanceCRM_NEW/* | Finance CRM module | LOW
src/components/crm/AuroraCTODashboard_NEW/* | CTO dashboard | LOW
```

### Configuration & Data Files (5 files)
```
src/config/firebase.js | Firebase configuration | LOW
src/features/featureRegistry.js | Feature registry | LOW
src/i18n/translations.js | i18n translations | LOW
src/data/whatsappAgentsData.js | WhatsApp agents data | LOW
src/data/dummyLeads.js | Dummy lead data | LOW
```

### Other Secondary Components (10+ files)
```
src/components/CompanyProfile.jsx | Company profile | LOW
src/components/NewsletterSubscription.jsx | Newsletter signup | LOW
src/components/ExampleErrorHandling.jsx | Error handling example | LOW
src/components/PerformanceTracker.jsx | Performance tracking | LOW
src/components/SEO.jsx | SEO metadata | LOW
src/components/common/Toast/Toast.jsx | Toast notifications | LOW
src/components/common/Notification/Notification.jsx | Notifications | LOW
src/components/common/Alert/Alert.jsx | Alert component | LOW
src/components/common/Spinner/Spinner.jsx | Loading spinner | LOW
src/components/common/Empty/Empty.jsx | Empty state | LOW
```

---

## 📋 CONVERSION CHECKLIST

### Phase 1: Unblock All Pages (65 files) - **DO FIRST**
- [ ] Store files (16 files)
  - [ ] src/store/store.js
  - [ ] src/store/*.js (all slices)
  - [ ] src/store/slices/*.js (all reducer files)
  - [ ] src/store/middleware/eventBusMiddleware.js
  
- [ ] Config files (5 files)
  - [ ] src/config/ROLE_TAB_MAPPING.js
  - [ ] src/config/navigation.js
  - [ ] src/config/assistantRegistry.js
  - [ ] src/config/businessModel.js
  - [ ] src/config/platformFeatures.js

- [ ] Layout components (15 files)
  - [ ] AppLayout and subdirectories
  - [ ] MainNavBar and index.js
  - [ ] SidebarContainer and index.js
  - [ ] AIAssistantsPanel and index.js
  - [ ] DepartmentContentPanel and index.js
  - [ ] UnifiedDashboardLayout and useDashboardState.js
  - [ ] RolePageLayout.jsx
  - [ ] TopNavBar.jsx

- [ ] Homepage components (17 files)
  - [ ] Hero, Features, Locations, Team, Testimonials, Contact folders
  - [ ] InteractiveMap, PropertyComparison, OffPlanTracker, NeighborhoodAnalyzer, RentVsBuyCalculator

- [ ] Core components (6 files)
  - [ ] Footer, ClickToChat, ErrorBoundary, Error, Auth, RecentlyViewed

- [ ] Shared components (3 files)
  - [ ] PropertyImageSlider, PropertyDetailModal, and index.js

- [ ] Common components (16 files)
  - [ ] index.js (FIRST - it's the hub)
  - [ ] DataCard and index.js
  - [ ] PageHeader and index.js
  - [ ] SuspenseLoader, UniversalNav, RoleSwitcher, SubNavBar
  - [ ] TabbedPanel, StatusNotification, QuickLinks, LeadCard, PropertyCard, ContentSlider, RequirePermission

- [ ] Hooks (9 files)
  - [ ] useRecentlyViewed, useAdvancedFilters, usePermissions, useApi, useActionHandler
  - [ ] useVirtualTour, useRecommendations, useSwipeGesture, usePWA

### Phase 2: Dashboard Features (35 files) - **DO SECOND**
- [ ] Owner tabs (8 files)
- [ ] CRM components (10 files)
- [ ] Specialized dashboards (6 files)
- [ ] Form/Input (5 files)
- [ ] Property components (5 files)
- [ ] Export wrappers (7 files)

### Phase 3: Optional Features (35+ files) - **DO LAST**
- [ ] Profile/Auth components
- [ ] Navigation/UI components
- [ ] Image/Media components
- [ ] Specialized features
- [ ] CRM modules
- [ ] Configuration files
- [ ] Secondary components

---

## 🎯 ESTIMATED EFFORT

| Phase | Files | Est. Hours | Complexity |
|-------|-------|-----------|-----------|
| **Phase 1** | 65 | 25-30 | LOW-MEDIUM |
| **Phase 2** | 35 | 12-15 | MEDIUM |
| **Phase 3** | 35+ | 12-15 | LOW-MEDIUM |
| **TOTAL** | **150+** | **50-60** | **MEDIUM** |

**Quick Win:** Phase 1 unblocks ALL pages in 25-30 hours

---

## 🚀 RECOMMENDED EXECUTION ORDER (Phase 1)

1. **src/store/store.js** - Foundation
2. **src/store/*.js** - All reducers (propertySlice, authSlice, userSlice, etc.)
3. **src/config/*.js** - Config (ROLE_TAB_MAPPING, navigation, assistantRegistry, etc.)
4. **src/components/common/index.js** - Component hub
5. **src/components/layout/AppLayout.jsx** - Core layout
6. **src/components/layout/MainNavBar files** - Navigation
7. **src/components/layout/SidebarContainer** etc - Dashboard panels
8. **src/components/layout/UnifiedDashboardLayout** - Dashboard wrapper
9. **src/components/homepage/** - Homepage components (Hero, Features, etc.)
10. **src/components/common/DataCard.jsx** etc - Common components
11. **src/hooks/** - React hooks
12. **src/components/Footer.jsx, ClickToChat.jsx, ErrorBoundary.jsx** - Core UI

---

**Document:** White Caves TypeScript Conversion Priority  
**Version:** 1.0  
**Date:** March 12, 2026  
**Status:** ✅ READY FOR EXECUTION
