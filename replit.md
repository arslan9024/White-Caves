# White Caves - Luxury Real Estate Dubai

## Overview
White Caves is a luxury real estate platform specializing in the Dubai market, offering comprehensive services for property sales, rentals, appointment scheduling, tenancy agreement management, and payment processing. It also includes internal HR functionalities. The platform supports diverse user roles with robust role-based access control, aiming to be the leading digital platform for Dubai's luxury property sector by providing a seamless experience for all users.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with Vite, utilizing Redux Toolkit for state management.
- **UI/UX**: Custom React components with CSS modules, featuring a premium dark mode, glassmorphism styling, mobile responsiveness, interactive elements (calculators, advanced search, property comparison, interactive SVG Dubai map), and full-screen galleries. Role-based routing is implemented.
- **Theming**: Consistent brand theme with a Red and White color scheme, Montserrat/Open Sans typography, and comprehensive light/dark theme support.
- **Unified Layouts**: `AppLayout` and `RolePageLayout` provide consistent page and dashboard wrappers.
- **Content Management**: Redux slices for managing navigation, dashboard state, and dynamic content.
- **SEO Optimization**: Comprehensive meta tags, structured data, and performance optimizations.

### Backend
- **Framework**: Express.js, providing a RESTful API with organized routes.
- **System Design**: Frontend and backend are separated with a proxy setup, and comprehensive error handling.
- **Environment Guard Middleware**: Server-side validation utility for required deployment secrets.

### Data Storage
- **Primary Database**: MongoDB with Mongoose ODM.

### Authentication & Authorization
- **Provider**: Firebase Authentication (supporting various social logins, email/password, phone/SMS OTP).
- **Biometric Authentication**: WebAuthn/Passkeys support.
- **Role-Based Access Control**: Multi-role system (`BUYER`, `SELLER`, `LANDLORD`, `TENANT`, `AGENT`, `ADMIN`) with `isSuperUser` and `isDecisionMaker` flags, supported by a comprehensive permission system.
- **Role Approval Workflow**: Admin interface for managing pending role requests.
- **Session Management**: Enhanced session tracking with device/browser detection, timeout, token refresh, and activity monitoring.

### Key Features & Design Decisions
- **Transaction Timelines**: Comprehensive `TenancyTimeline` and `SaleTimeline` models with stage progression and verification workflows.
- **Ejari System**: Compliant tenancy contract generation and digital signature workflows.
- **Web Traffic Analytics**: Integration with Vercel Speed Insights and `web-vitals` for real-time Core Web Vitals tracking.
- **Advanced Tools**: Smart Rent vs. Buy Calculator, Off-Plan Property Tracker, AI Neighborhood Analyzer, and Virtual Tour Gallery.
- **AI-Powered Automation**: Enhanced property schema, bilingual support (Arabic/English), AI Chatbot Service for intent classification, and an AI Agent Assignment Engine.
- **Market Analytics Dashboard**: Provides KPIs, transaction breakdowns, and agent performance insights.
- **WhatsApp Business Integration**: Session management, QR code generation, Meta Business OAuth, and an AI Chatbot for customer support and lead scoring.
- **Chatbot Training Data Module**: Comprehensive bilingual training data for the AI chatbot.
- **Platform Features Explorer**: Owner-exclusive Feature Explorer component with Redux state management displaying implemented platform features.
- **Enhanced Owner Dashboard**: Comprehensive tabbed dashboard with real-time statistics, quick actions, data tables with filtering/search, agent performance cards, lead management, contract/Ejari tracking, analytics charts, chatbot stats, WhatsApp Business integration, UAE Pass user management, and system settings with feature toggles.
- **Mary's Data Tools Suite**: Integrated data acquisition tools including:
    - **DAMAC Asset Fetcher**: S3 URL generator for fetching property images.
    - **Image Data Extractor**: OCR-based tool for extracting text from uploaded images.
    - **Web Data Harvester**: URL template iterator for scraping property data from web pages.
- **AI Assistant Dashboard System** (`src/store/slices/aiAssistantDashboardSlice.js`): Unified Redux state management for 12 AI assistants organized by department (Operations, Sales, Communications, Finance, Marketing, Executive, Compliance, Technology). Features:
    - byId/allIds normalized state pattern with memoized selectors
    - Favorites and recent tracking with owner preferences
    - Department filtering and search functionality
    - Real-time activity feed and performance metrics
    - Quick stats overview and critical alerts
- **AI Assistant Selector** (`src/components/crm/AIAssistantSelector.jsx`): Intelligent dropdown component with:
    - Search across all assistants by name, title, or department
    - Department filter buttons (All, Operations, Sales, Communications, etc.)
    - Favorites section with star toggle
    - Recently used assistants tracking
    - Quick stats footer showing total assistants, active count, and alerts
    - Redux-controlled open/close state
- **AI Assistant Hub** (`src/components/crm/AIAssistantHub.jsx`): Unified command center for all AI assistants with:
    - Department-grouped assistant cards with status indicators
    - Feature Map view showing 10 data flows between assistants
    - Live activity feed with real-time updates
    - Quick stats bar with system-wide metrics
    - Integration with AI Assistant Selector
- **WhatsApp Agents Data** (`src/data/whatsappAgentsData.js`): 23 agent records for Linda CRM with:
    - Status management (active/blocked/submitted/permanent_blocked)
    - Task priority system (Task1, Task2, Task3)
    - Performance metrics (response rate, conversion rate, satisfaction)
    - Message templates library with bilingual support
    - Daily analytics and trends data
- **AI CRM Assistants**: 12 specialized AI-powered assistants integrated into Owner Dashboard:
    - **Linda (WhatsApp CRM)**: Manages 23+ agent numbers, conversation routing, lead pre-qualification, template messaging.
    - **Mary (Inventory CRM)**: DAMAC Hills 2 property inventory with 9,378+ units, data tools, asset management.
    - **Clara (Leads CRM)**: Lead pipeline management, qualification workflows, conversion tracking.
    - **Nina (WhatsApp Bot Developer)**: Bot development, flow design, session management, analytics.
    - **Nancy (HR Manager)**: Employee management, recruitment, performance tracking, attendance.
    - **Theodora (Finance Director)**: Invoice management, payment tracking, financial reports.
    - **Olivia (Marketing Manager)**: Campaign management, social media, listing optimization.
    - **Zoe (Executive Assistant)**: Calendar management, meeting scheduling, task delegation.
    - **Laila (Compliance Officer)**: KYC verification, AML monitoring, contract reviews.
    - **Sophia (Sales Pipeline Manager)**: Sales pipeline, lead assignments, deal tracking, forecasting.
    - **Daisy (Leasing Manager)**: Rental properties, tenant communications, lease agreements.
    - **Aurora (CTO)**: Chief Technology Officer & Systems Architect overseeing all technical operations.
- **Aurora CTO Dashboard** (`src/components/crm/AuroraCTODashboard.jsx`): Tech Command Center with:
    - System Health Monitor with real-time CPU, memory, response time, and uptime tracking for 6 core components
    - Application Portfolio management for web and mobile apps with health scores, costs, and tech stacks
    - Development Projects tracker with sprint progress, deployment counts, and issue tracking
    - Deployment Pipeline timeline with success/failed/rollback status visualization
    - API Performance analytics with endpoint response times and success rates
    - Time range filtering (1h, 24h, 7d, 30d) for historical analysis
    - Feature flows connecting Aurora to Zoe (system health reporting) and Theodora (deployment cost tracking)
- **AI CRM Dashboard Components** (All 12 assistants now have full dashboard implementations):
    - `LindaWhatsAppCRM.jsx` - WhatsApp conversation management, agent monitoring
    - `MaryInventoryCRM.jsx` - DAMAC Hills 2 inventory with data tools
    - `ClaraLeadsCRM.jsx` - Lead pipeline with DualCategoryTabStrip for Buyers (Sale) vs Tenants (Rent)
    - `NinaWhatsAppBotCRM.jsx` - Bot development, session management with BotSessionManager
    - `NancyHRCRM.jsx` - Employee directory, recruitment, performance, JobPostComposer
    - `SophiaSalesCRM.jsx` - Sales pipeline, deal tracking, forecasting
    - `DaisyLeasingCRM.jsx` - Lease management, tenant communications, maintenance
    - `TheodoraFinanceCRM.jsx` - Invoice management, expenses, PaymentInstructionDeck
    - `OliviaMarketingCRM.jsx` - Campaign management, social media, PlatformPublisherForm
    - `ZoeExecutiveCRM.jsx` - Executive calendar, tasks, team management
    - `LailaComplianceCRM.jsx` - KYC verification, AML monitoring, contracts
    - `AuroraCTODashboard.jsx` - System health, deployments, API performance
- **Shared Assistant Dashboard Styles** (`src/components/crm/AssistantDashboard.css`): Unified styling for all CRM dashboards with:
    - Consistent header, stats, and tab components
    - Status badges, priority indicators, and risk levels
    - Pipeline stages, tables, and card layouts
    - Dark theme with glassmorphism effects
    - Responsive mobile layout
- **AI Command Center** (`src/components/crm/AICommandCenter.jsx`): Unified dashboard entry point with:
    - AIDropdownSelector for selecting assistants with department filtering and favorites
    - Quick stats bar showing active assistants, system health, active tasks, and alerts
    - Lazy-loaded assistant dashboards for optimized performance
    - Activity sidebar with real-time updates from all assistants
    - View toggle (grid/list) for layout preferences
- **Shared Component Library** (`src/components/crm/shared/`): Reusable UI components for design consistency:
    - `StatCard.jsx` - Stats display with trend indicators and color theming
    - `TabPanel.jsx` - Tab navigation with slot-based content and badges
    - `ActivityTimeline.jsx` - Timeline with status icons and timestamps
    - `BigTileCard.jsx` - Large feature cards with status and actions
    - `DataGridView.jsx` - Sortable/filterable data tables with pagination
    - `AssistantSidebar.jsx` - 25% width sidebar with favorites and quick actions
    - `UniversalAssistantLayout.jsx` - Layout shell with error boundaries and loading states
    - `AIDropdownSelector.jsx` - Smart dropdown with search, filters, favorites, and recent
    - `NotificationBadge.jsx` - Red badge with notification count and animations
    - `StatusIndicator.jsx` - Status indicators with color-coded icons
    - `PersistentAssistantSidebar.jsx` - Right-aligned activity sidebar with notifications
    - `PaymentInstructionDeck.jsx` - Payment method selector with QR code, cheque, and bank transfer templates
    - `DualCategoryTabStrip.jsx` - Category filter tabs for Rent vs Sale leads
    - `AssignmentDropdown.jsx` - Task/agent assignment dropdown selector
    - `PropertyMediaGallery.jsx` - Property image gallery with thumbnail navigation
    - `BotSessionManager.jsx` - WhatsApp bot session create/delete/refresh with QR codes
    - `PlatformPublisherForm.jsx` - Multi-portal property publishing (Bayut, Property Finder, Dubizzle)
    - `JobPostComposer.jsx` - Job posting form with validation, preview, and multi-platform publishing
    - `SharedComponents.css` - Unified styling for all shared components
    - `SidebarComponents.css` - Sidebar-specific styles
    - `PaymentComponents.css` - Payment instruction deck styles
    - `SessionComponents.css` - Bot session manager styles
    - `PublisherComponents.css` - Property publisher styles
    - `JobComponents.css` - Job composer styles with form validation and toast notifications

## Technical Architecture

### Redux State Management (Consolidated)
- **Single Source of Truth**: `aiAssistantDashboardSlice.js` manages all 12 AI assistants
- **State Structure**:
  - `allAssistants.byId` - Normalized assistant registry with capabilities and metrics
  - `allAssistants.allIds` - Array of assistant IDs for iteration
  - `ui.selectedAssistant` - Currently selected assistant ID
  - `ui.filters` - Department, status, and search filters
  - `favorites` - Array of favorited assistant IDs
  - `recent` - Recently accessed assistants (max 5)
  - `assistantPerformance` - System health, alerts, and activity feed
- **Memoized Selectors**: `selectAllAssistantsArray`, `selectFilteredAssistants`, `selectCurrentAssistant`

### Department Organization
| Department | Assistants | Color |
|------------|-----------|-------|
| Operations | Mary, Nancy, Daisy | Purple |
| Sales | Clara, Sophia | Red |
| Communications | Linda, Nina | Green |
| Finance | Theodora | Pink |
| Marketing | Olivia | Blue |
| Executive | Zoe | Teal |
| Compliance | Laila | Indigo |
| Technology | Aurora | Cyan |

## External Dependencies

- **Stripe**: Payment processing.
- **Mashreq NEOBiz**: Primary bank account for transfers and digital payments (Account: 019101501006, IBAN: AE960330000019101501006).
- **Aani Payment System**: QR code-based digital payment solution for UAE bank apps.
- **Google Calendar API**: Appointment scheduling and reminders.
- **Google Maps API**: Property location visualization.
- **Firebase**: User authentication.
- **MongoDB**: Primary data store.
- **PDF.js**: Client-side PDF document rendering.
- **React Signature Canvas**: Digital signature capture.
- **Google Drive API**: Storing signed tenancy contracts and documents.
- **WhatsApp Business API**: Customer support and chatbot integration.
- **Matterport**: Virtual tour integration.

## Recent Changes (January 2026)

- **Payment System Update**: Updated Theodora's PaymentInstructionDeck with real Mashreq NEOBiz bank details and Aani QR code for digital payments.
- **Linda Agent Assignment**: Added agent assignment dropdown to Linda's WhatsApp CRM for routing conversations to active agents.
- **Aurora Documentation Update**: Updated platform modules to reflect new features (Multi-Portal Publishing, Job Posting System, Agent Task Assignment, Bot Session Manager).
- **Build Verified**: Production build completed successfully with all 2458 modules transformed.