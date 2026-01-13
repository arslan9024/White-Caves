# White Caves - Luxury Real Estate Dubai

## Overview
White Caves is a luxury real estate platform focused on the Dubai market, aiming to be the leading digital solution for luxury property transactions and management. It provides comprehensive services for sales, rentals, appointment scheduling, tenancy agreement management, and payment processing. The platform integrates internal HR functionalities, supports diverse user roles with robust access control, and leverages AI to streamline operations and enhance user experience. The project's vision is to be the premier digital real estate solution in Dubai, capitalizing on market potential with advanced technology.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with Vite and Redux Toolkit.
- **UI/UX**: Custom React components with CSS modules, **STRICT RED (#B03737) AND WHITE THEME** (no dark mode), Montserrat/Open Sans typography. Brand colors are enforced.
- **Navigation**: Two-tier system with `DashboardShell`, `TopNav`, and `CommandSidebar` for authenticated users.
- **Design System**: Complete UI component library; dark mode is disabled platform-wide.
- **SEO Optimization**: Comprehensive meta tags, structured data, and performance optimizations.

### Backend
- **Framework**: Express.js with a RESTful API.
- **System Design**: Frontend/backend separation with proxy setup and error handling.
- **Middleware**: Environment guard for server-side validation.

### Data Storage
- **Primary Database**: MongoDB with Mongoose ODM.

### Authentication & Authorization
- **Authentication**: Firebase Authentication (social logins, email/password, phone/SMS OTP) and WebAuthn/Passkeys.
- **Role-Based Access Control**: Multi-role system (MD, Owner, Buyer, Seller, Landlord, Tenant, Agent, Admin) with `isSuperUser` and `isDecisionMaker` flags.
- **Session Management**: Enhanced session tracking with device/browser detection, timeout, token refresh, and activity monitoring.

### Key Features & Design Decisions
- **Transaction Management**: `TenancyTimeline` and `SaleTimeline` models with stage progression.
- **Ejari System**: Compliant tenancy contract generation and digital signature workflows.
- **Analytics**: Vercel Speed Insights and `web-vitals` for Core Web Vitals tracking.
- **Advanced Tools**: Smart Rent vs. Buy Calculator, Off-Plan Property Tracker, AI Neighborhood Analyzer, Virtual Tour Gallery.
- **AI-Powered Automation**: Enhanced property schema, bilingual support (Arabic/English), AI Chatbot Service, AI Agent Assignment Engine, and an AI Assistant Dashboard System managing 32 assistants across 10 departments.
- **Market Analytics Dashboard**: Provides KPIs, transaction breakdowns, and agent performance insights.
- **WhatsApp Business Integration**: Session management, QR code generation, Meta Business OAuth, and an AI Chatbot for customer support and lead scoring.
- **Nina WhatsApp Bot Developer**: Comprehensive WhatsApp bot management system with an open-source AI/ML engine (Intent Classifier, Lead Scorer, Sentiment Analyzer, Language Detector, Response Generator, Entity Extractor, Smart Router). Includes AES-256-GCM encryption, audit logging, RBAC, timezone-aware scheduling, and a multi-tab dashboard.
- **Mary's Data Tools Suite**: Integrated data acquisition tools including DAMAC Asset Fetcher, Image Data Extractor (OCR), and Web Data Harvester.
- **Zoe Executive Intelligence System**: Executive Suggestion Inbox and Executive Visibility for strategic suggestions.
- **Confidential Vault System**: Redux state with dual-approval access request workflow and document management.
- **Lead Management Hub**: Redux state with lead pipeline, qualification engine, specialist routing, and scoring rules.
- **KYC/AML Compliance System**: Comprehensive UAE-compliant identity verification and anti-money laundering system with automated risk scoring, PEP/sanctions screening, Emirates ID validation, document verification, and a multi-tab shared dashboard. Integrates with various CRM modules.
- **Olivia Automation System**: Automated property availability sync, market intelligence gathering, and scheduling controls.
- **Henry Event System**: Universal event format for cross-assistant communication.
- **Centralized Assistant Registry**: Single source of truth for all AI assistants.
- **Event Bus Middleware**: Redux middleware for event-driven communication.
- **AI Command Center**: Unified `CommandSidebar` integrating quick stats, assistant list, notifications, and activity feed.
- **Company Services Registry**: 35 services across 6 categories with workflow stages and assigned AI assistants.
- **Reusable CRM Components**: StatsBar, DataTable, ActionButton, ActivityFeed, StatusBadge, FlowchartViewer.
- **PropertySearchHero**: Bayut/PropertyFinder-style property search with diverse filters and AI integration.
- **Homepage Components**: InterestWizard, PopularSearches, NewsletterSignup, MobileAppBanner.
- **AgentListingForm**: 6-step wizard for property listings with Dubai-specific fields.
- **CRM View State (crmViewSlice)**: Manages 38 AI assistants, UI toggles, breadcrumbs, favorites, and recent objects.
- **CRM Accordion Navigation**: Hierarchical left sidebar with 11 main groups and 40+ sub-items.
- **ContextualDashboardRenderer**: Renders dashboards based on active category and selected AI assistant, supporting mixed dashboard mode.
- **Mixed Dashboard Architecture**: Department-assistant integration system with `DEPT_ASSISTANT_MAP`, `MixedDashboard` component for stats, flowchart, table, activity feed, and quick actions, including 11 department-specific dashboards.
- **CRM View Components**: 11 category-specific view components handling sub-item routes.
- **CRM Styling**: White background for main dashboard with dark mode support and comprehensive CSS for various components.
- **Document Viewing System**: `CRMDocumentViewer` for PDF/HTML with navigation, zoom, print. Includes Aurora technical and company documents.
- **Knowledge Base & System Health**: AdminView with AuroraDocumentIndex and system health status cards.
- **WhatsApp Click-to-Chat**: Floating chat button with quick messages and multiple contact app options.
- **Footer Helpful Links**: External Dubai resource links.
- **DLD Transactions System**: Integration of real Dubai Land Department transaction data (5,400+ records) with MongoDB model, RESTful API (CRUD, filtering, aggregation), and `TransactionsView` component.
- **Off-Plan Properties System**: Complete off-plan project management with `OffPlanProject` and `OffPlanUnit` models, construction progress tracking, configurable payment plans, and a RESTful API.
- **Deal Management System**: Comprehensive TenancyDeal and SalesDeal models with full lifecycle tracking. Features DealJourneyTimeline component for visual stage progression, Redux dealsSlice for state management, and /api/deals REST API with 25+ endpoints.
- **Learning Demo Scenarios**: Interactive demo data seeder with 4 learning scenarios (Ejari tenancy, off-plan sale, secondary sale, KYC/AML high-risk case). DemoDataPanel component provides realistic examples to teach best practices.
- **Digital Marketing & SEO Tools**: MarketingSEOTools component with keyword research (Dubai property keywords), SEO audit checklist, AI content ideas generator, and analytics dashboard.

## External Dependencies

- **Stripe**: Payment processing.
- **Mashreq NEOBiz**: Primary bank account.
- **Aani Payment System**: QR code-based digital payments.
- **Google Calendar API**: Appointment scheduling.
- **Google Maps API**: Property location visualization.
- **Firebase**: User authentication.
- **MongoDB**: Primary data store.
- **PDF.js**: Client-side PDF rendering.
- **React Signature Canvas**: Digital signature capture.
- **Google Drive API**: Document storage.
- **WhatsApp Business API**: Customer support and chatbot.
- **Matterport**: Virtual tour integration.
- **Vercel Speed Insights**: Performance analytics.

## Deployment

- **Platform**: Replit Autoscale Deployment
- **Build Command**: `npm run build`
- **Run Command**: `node server/index.js`
- **Frontend Port**: 5000 (served by Express in production)
- **Backend Port**: 3000 (development) / 5000 (production)

## API Endpoints

### Deals API (`/api/deals`)
- `GET /tenancy` - List tenancy deals with pagination
- `GET /tenancy/:dealNumber` - Get tenancy deal by number
- `POST /tenancy` - Create new tenancy deal
- `PUT /tenancy/:dealNumber/status` - Update tenancy deal status
- `GET /sales` - List sales deals with pagination
- `GET /sales/:dealNumber` - Get sales deal by number
- `POST /sales` - Create new sales deal
- `PUT /sales/:dealNumber/status` - Update sales deal status
- `GET /demo` - Get demo data scenarios
- `POST /demo/seed` - Seed demo data
- `GET /stats` - Get deal statistics

## Recent Changes (January 2026)
- Added Deal Management System with TenancyDeal and SalesDeal models
- Created DealJourneyTimeline component for visual stage tracking
- Built DemoDataPanel with 4 learning scenarios
- Added MarketingSEOTools for digital marketing features
- Fixed .vercelignore deployment issue
- Updated Redux store with deals slice
- Configured Replit autoscale deployment