# White Caves - Luxury Real Estate Dubai

## Overview
White Caves is a luxury real estate platform specializing in the Dubai market. It offers comprehensive services for property sales, rentals, appointment scheduling, tenancy agreement management, and payment processing, alongside internal HR functionalities. The platform supports diverse user roles with robust role-based access control, aiming to be the leading digital platform for Dubai's luxury property sector by providing a seamless experience for all users. The business vision is to be the premier digital solution for luxury real estate in Dubai, leveraging advanced technology and AI to streamline operations and enhance user experience.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with Vite, utilizing Redux Toolkit for state management.
- **UI/UX**: Custom React components with CSS modules, featuring a premium dark mode, glassmorphism styling, mobile responsiveness, interactive elements (calculators, advanced search, property comparison, interactive SVG Dubai map), and full-screen galleries. Role-based routing is implemented.
- **Theming**: Consistent brand theme with a Red and White color scheme, Montserrat/Open Sans typography, and comprehensive light/dark theme support.
- **Layouts**: `AppLayout` and `RolePageLayout` for consistent page and dashboard wrappers.
- **SEO Optimization**: Comprehensive meta tags, structured data, and performance optimizations.

### Backend
- **Framework**: Express.js, providing a RESTful API with organized routes.
- **System Design**: Frontend and backend separation with proxy setup and comprehensive error handling.
- **Environment Guard Middleware**: Server-side validation for required deployment secrets.

### Data Storage
- **Primary Database**: MongoDB with Mongoose ODM.

### Authentication & Authorization
- **Authentication**: Firebase Authentication (social logins, email/password, phone/SMS OTP) and WebAuthn/Passkeys for biometric authentication.
- **Role-Based Access Control**: Multi-role system (`BUYER`, `SELLER`, `LANDLORD`, `TENANT`, `AGENT`, `ADMIN`) with `isSuperUser` and `isDecisionMaker` flags, supported by a comprehensive permission system. Admin interface for managing pending role requests.
- **Session Management**: Enhanced session tracking with device/browser detection, timeout, token refresh, and activity monitoring.

### Key Features & Design Decisions
- **Transaction Management**: `TenancyTimeline` and `SaleTimeline` models with stage progression and verification workflows.
- **Ejari System**: Compliant tenancy contract generation and digital signature workflows.
- **Analytics**: Vercel Speed Insights and `web-vitals` for real-time Core Web Vitals tracking.
- **Advanced Tools**: Smart Rent vs. Buy Calculator, Off-Plan Property Tracker, AI Neighborhood Analyzer, and Virtual Tour Gallery.
- **AI-Powered Automation**: Enhanced property schema, bilingual support (Arabic/English), AI Chatbot Service for intent classification, and an AI Agent Assignment Engine.
- **Market Analytics Dashboard**: Provides KPIs, transaction breakdowns, and agent performance insights.
- **WhatsApp Business Integration**: Session management, QR code generation, Meta Business OAuth, and an AI Chatbot for customer support and lead scoring.
- **Chatbot Training Data Module**: Comprehensive bilingual training data for the AI chatbot.
- **Owner Dashboard**: Comprehensive tabbed dashboard with real-time statistics, quick actions, data tables, agent performance cards, lead management, contract/Ejari tracking, analytics charts, chatbot stats, WhatsApp Business integration, UAE Pass user management, and system settings with feature toggles.
- **Mary's Data Tools Suite**: Integrated data acquisition tools including DAMAC Asset Fetcher (S3 URL generator), Image Data Extractor (OCR-based), and Web Data Harvester (URL template iterator).
- **AI Assistant Dashboard System**: Unified Redux state management for 17 AI assistants organized by department (Operations, Sales, Communications, Finance, Marketing, Executive, Compliance, Technology, Legal). Features include normalized state, memoized selectors, favorites, recent tracking, department filtering, search, real-time activity feed, performance metrics, and event-driven communication via Redux middleware.
- **AI CRM Assistants**: 17 specialized AI-powered assistants integrated into the Owner Dashboard, each with dedicated dashboards for specific functionalities (e.g., Linda for WhatsApp CRM, Mary for Inventory CRM, Clara for Leads CRM, Olivia for Marketing Automation, Aurora for CTO operations, Hazel for Frontend Engineering, Willow for Backend Engineering, Evangeline for Legal Risk, Sentinel for Property Monitoring, Hunter for Lead Prospecting).
- **Centralized Assistant Registry**: Single source of truth (`src/config/assistantRegistry.js`) for all 17 AI assistants with department configuration, capabilities, permissions, and data flow definitions.
- **Event Bus Middleware**: Redux middleware (`src/store/middleware/eventBusMiddleware.js`) enabling event-driven communication between assistants with 25 event types, automated routing, and audit trail logging (max 1000 entries).
- **Design Tokens System**: CSS custom properties (`src/styles/design-tokens.css`) for consistent theming including colors, spacing, typography, shadows, transitions, and dark mode support.
- **Olivia Automation System**: Automated property availability sync with Mary's inventory, market intelligence gathering from Bayut/Property Finder/Dubizzle, scheduling controls, and real-time activity logging. Redux-integrated automation state with persistent controls.
- **Zoe Executive Intelligence System**: Executive Suggestion Inbox receiving AI-powered strategic suggestions from all 12 assistants. Features priority filtering (critical/high/medium/low), department categorization, suggestion status management (unreviewed/acknowledged/escalated/archived), confidence scoring, and projected impact analysis.
- **Weekly Research Module**: Shared component enabling all assistants to perform automated intelligence gathering on configurable schedules (weekly/bi-weekly/monthly). Generates structured suggestions for Zoe's executive review.
- **Executive Suggestions Redux State**: Centralized suggestion pipeline with structured format including fromAssistant, department, priority, type (process_improvement/new_opportunity/risk_alert/cost_saving), analysis, dataPoints, projectedImpact, and confidence score.
- **AI Command Center**: Unified dashboard entry point with an AIDropdownSelector for selecting assistants, quick stats bar, lazy-loaded assistant dashboards, and an activity sidebar.
- **Shared Component Library**: Reusable UI components ensuring design consistency across all dashboards and features.
- **Confidential Vault System**: Redux state with dual-approval access request workflow (AI + human), document management, and vault statistics.
- **Lead Management Hub**: Redux state with lead pipeline, qualification engine, specialist routing, funnel metrics, and lead scoring rules.
- **Compliance Engine**: KYC profile tracking, AML monitoring with flagged transactions and investigation queue, and an immutable audit log.

## External Dependencies

- **Stripe**: Payment processing.
- **Mashreq NEOBiz**: Primary bank account for transfers and digital payments.
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

### Dashboard Design Overhaul (Phase 1-4 Complete)
- **AssistantNavSidebar Component**: Fixed-position left sidebar (280px expanded, 72px collapsed) with:
  - Hierarchical navigation organized into 4 sections: Dashboard, AI Assistants, Management, Integrations, System
  - 9 department groups with color coding: Communications (#25D366), Operations (#3B82F6), Sales (#8B5CF6), Finance (#F59E0B), Marketing (#EC4899), Executive (#10B981), Compliance (#6366F1), Legal (#DC2626), Technology (#0EA5E9)
  - Collapsible departments with smooth animations
  - Notification badges per assistant
  - Active state highlighting with left-border accent

- **DashboardHeader Component**: New header with global search (Ctrl+K), theme toggle, notifications dropdown, user profile menu

- **Navigation Coverage**:
  - Dashboard: Overview, AI Command, AI Hub
  - AI Assistants: 17 assistants organized by 9 departments
  - Management: Users, Properties, Agents, Leads, Contracts, Analytics
  - Integrations: AI Settings, WhatsApp, UAE Pass
  - System: Features, Settings

- **Responsive Design**: Desktop (>1024px) full sidebar, Tablet (768px-1024px) compact mode, Mobile (<768px) overlay

- **SkeletonLoader Components**: Loading skeletons for Text, Circle, Card, StatCard, Table, Dashboard, and EmptyState

### AI Assistants Inventory (17 Total)
| ID | Name | Role | Department |
|----|------|------|------------|
| linda | Linda | WhatsApp CRM Manager | Communications |
| nina | Nina | WhatsApp Bot Developer | Communications |
| mary | Mary | Inventory CRM Manager | Operations |
| nancy | Nancy | HR Manager | Operations |
| daisy | Daisy | Leasing Manager | Operations |
| sentinel | Sentinel | Property Monitoring AI | Operations |
| clara | Clara | Leads CRM Manager | Sales |
| sophia | Sophia | Sales Pipeline Manager | Sales |
| hunter | Hunter | Lead Prospecting AI | Sales |
| theodora | Theodora | Finance Director | Finance |
| olivia | Olivia | Marketing & Automation Manager | Marketing |
| zoe | Zoe | Executive Assistant & Strategic Intelligence | Executive |
| laila | Laila | Compliance Officer | Compliance |
| evangeline | Evangeline | Legal Risk Analyst | Legal |
| aurora | Aurora | CTO & Systems Architect | Technology |
| hazel | Hazel | Elite Frontend Engineer | Technology |
| willow | Willow | Elite Backend Engineer | Technology |

### Technology Stack
- **Frontend**: React 18, Redux Toolkit, Vite 7.3, React Router v6, Framer Motion, Lucide Icons, CSS Modules
- **Backend**: Express.js, Node.js 20, Mongoose ODM, JWT Auth, RESTful API
- **Database**: MongoDB Atlas, Firebase Auth, PostgreSQL (Neon)
- **Integrations**: Stripe, WhatsApp Business API, Google Calendar/Drive/Maps, Vercel Speed Insights, GitHub API
- **DevOps**: Replit, Nix, Git, ESLint, Vitest

### Project Statistics
- Total AI Assistants: 14
- Departments: 8
- React Components: 47+
- API Endpoints: 45+
- DAMAC Inventory Units: 9,378+
- Build Size: ~8MB (main) + code-split chunks