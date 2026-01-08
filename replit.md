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
- **Content Management**: Redux slices for navigation, dashboard state, and dynamic content.
- **SEO Optimization**: Comprehensive meta tags, structured data, and performance optimizations.

### Backend
- **Framework**: Express.js, providing a RESTful API with organized routes.
- **System Design**: Frontend and backend separation with proxy setup and comprehensive error handling.
- **Environment Guard Middleware**: Server-side validation for required deployment secrets.

### Data Storage
- **Primary Database**: MongoDB with Mongoose ODM.

### Authentication & Authorization
- **Authentication**: Firebase Authentication (social logins, email/password, phone/SMS OTP) and WebAuthn/Passkeys for biometric authentication.
- **Role-Based Access Control**: Multi-role system (`BUYER`, `SELLER`, `LANDLORD`, `TENANT`, `AGENT`, `ADMIN`) with `isSuperUser` and `isDecisionMaker` flags, supported by a comprehensive permission system.
- **Workflow**: Admin interface for managing pending role requests.
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
- **AI Assistant Dashboard System**: Unified Redux state management for 12 AI assistants organized by department (Operations, Sales, Communications, Finance, Marketing, Executive, Compliance, Technology). Features include normalized state, memoized selectors, favorites, recent tracking, department filtering, search, real-time activity feed, and performance metrics.
- **AI CRM Assistants**: 12 specialized AI-powered assistants integrated into the Owner Dashboard, each with dedicated dashboards for specific functionalities (e.g., Linda for WhatsApp CRM, Mary for Inventory CRM, Clara for Leads CRM, Olivia for Marketing Automation, Aurora for CTO operations).
- **Olivia Automation System**: Automated property availability sync with Mary's inventory, market intelligence gathering from Bayut/Property Finder/Dubizzle, scheduling controls, and real-time activity logging. Redux-integrated automation state with persistent controls.
- **Zoe Executive Intelligence System**: Executive Suggestion Inbox receiving AI-powered strategic suggestions from all 12 assistants. Features priority filtering (critical/high/medium/low), department categorization, suggestion status management (unreviewed/acknowledged/escalated/archived), confidence scoring, and projected impact analysis.
- **Weekly Research Module**: Shared component enabling all assistants to perform automated intelligence gathering on configurable schedules (weekly/bi-weekly/monthly). Generates structured suggestions for Zoe's executive review.
- **Executive Suggestions Redux State**: Centralized suggestion pipeline with structured format including fromAssistant, department, priority, type (process_improvement/new_opportunity/risk_alert/cost_saving), analysis, dataPoints, projectedImpact, and confidence score.
- **AI Command Center**: Unified dashboard entry point with an AIDropdownSelector for selecting assistants, quick stats bar, lazy-loaded assistant dashboards, and an activity sidebar.
- **Shared Component Library**: Reusable UI components ensuring design consistency across all dashboards and features.

## AI Assistants Inventory (12 Total)

| Assistant | Role | Department | Key Features |
|-----------|------|------------|--------------|
| Linda | WhatsApp CRM Manager | Communications | 23+ Agent Management, Conversation Routing, Lead Pre-qualification |
| Mary | Inventory CRM Manager | Operations | DAMAC Hills 2 Inventory (9,378+ units), S3 Asset Fetcher, OCR Extractor |
| Clara | Leads CRM Manager | Sales | Lead Pipeline, Qualification Workflows, Lead Scoring, Auto-Assignment |
| Nina | WhatsApp Bot Developer | Communications | Bot Flow Design, Session Management, Template Builder |
| Nancy | HR Manager | Operations | Employee Directory, Recruitment Pipeline, Performance Tracking |
| Sophia | Sales Pipeline Manager | Sales | Deal Tracking, Pipeline Visualization, Sales Forecasting |
| Daisy | Leasing Manager | Operations | Lease Management, Tenant Communications, Ejari Integration |
| Theodora | Finance Director | Finance | Invoice Management, Payment Tracking, Budget Analysis |
| Olivia | Marketing & Automation Manager | Marketing | Property Sync, Market Intelligence, Website Monitoring, Multi-Portal Publishing |
| Zoe | Executive Assistant & Strategic Intelligence | Executive | Suggestion Inbox, Priority Alerts, Cross-Department Intelligence, Calendar Management |
| Laila | Compliance Officer | Compliance | KYC Verification, AML Monitoring, RERA Compliance |
| Aurora | CTO & Systems Architect | Technology | System Monitoring, Documentation, Architecture Planning |

## Redux State Structure

### Executive Suggestions State
```javascript
executiveSuggestions: {
  inbox: [{
    id: string,
    fromAssistant: string,
    assistantDepartment: string,
    priority: 'low' | 'medium' | 'high' | 'critical',
    type: 'process_improvement' | 'new_opportunity' | 'risk_alert' | 'cost_saving',
    title: string,
    analysis: string,
    dataPoints: string[],
    projectedImpact: string,
    confidence: number,
    timestamp: string,
    status: 'unreviewed' | 'acknowledged' | 'escalated' | 'archived'
  }],
  filters: { priority, department, status }
}
```

### Olivia Automation State
```javascript
oliviaAutomation: {
  syncSchedule: 'daily' | '3days' | '5days' | 'weekly',
  lastPropertySync: timestamp,
  lastMarketResearch: timestamp,
  activeMonitoring: boolean,
  activityLog: [],
  monitoredSites: [{ name, status, lastCheck, dataPoints }],
  coordination: { maryConnected, inventoryAccess }
}
```

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
- Added Executive Suggestions Redux state with priority filtering and department categorization
- Created WeeklyResearchModule shared component for automated intelligence gathering
- Upgraded Zoe's Executive Dashboard with Suggestion Inbox and Priority Alerts
- Enhanced Olivia's automation with Redux-integrated property sync and market intelligence
- Added selectors for filtered suggestions, unreviewed counts, and critical alerts
- Updated Aurora documentation with new AI assistant features

## Implementation Guidelines
- All AI assistants should use the WeeklyResearchModule for automated research
- Strategic suggestions flow from assistants to Zoe via Redux executiveSuggestions.inbox
- Olivia coordinates with Mary's inventory via selectInventoryStats selector
- Use priority levels (critical > high > medium > low) for suggestion sorting
- Confidence scores should be 0-1 range representing AI certainty
