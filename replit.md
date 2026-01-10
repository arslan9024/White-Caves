# White Caves - Luxury Real Estate Dubai

## Overview
White Caves is a luxury real estate platform specializing in the Dubai market, aiming to be the leading digital solution for luxury property transactions and management in the region. The platform provides comprehensive services for property sales, rentals, appointment scheduling, tenancy agreement management, and payment processing. It integrates internal HR functionalities and supports diverse user roles with robust access control. The project focuses on leveraging advanced technology and AI to streamline operations and enhance the user experience for all stakeholders.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with Vite and Redux Toolkit for state management.
- **UI/UX**: Custom React components with CSS modules, featuring a premium dark mode, glassmorphism styling, mobile responsiveness, and interactive elements. Theming uses a consistent Red and White color scheme with Montserrat/Open Sans typography, supporting comprehensive light/dark modes.
- **Navigation**: A two-tier system with a `DashboardShell` for authenticated users, including a `TopNav` and a `CommandSidebar` for AI assistant and feature selection.
- **Design System**: A complete UI component library with variants, sizes, states, and theme support.
- **SEO Optimization**: Comprehensive meta tags, structured data, and performance optimizations.

### Backend
- **Framework**: Express.js, providing a RESTful API with organized routes.
- **System Design**: Frontend/backend separation with a proxy setup and comprehensive error handling.
- **Middleware**: Environment guard for server-side validation.

### Data Storage
- **Primary Database**: MongoDB with Mongoose ODM.

### Authentication & Authorization
- **Authentication**: Firebase Authentication (social logins, email/password, phone/SMS OTP) and WebAuthn/Passkeys.
- **Role-Based Access Control**: Multi-role system including MD (Super Admin), Owner, Buyer, Seller, Landlord, Tenant, Agent, and Admin roles, with `isSuperUser` and `isDecisionMaker` flags.
- **Session Management**: Enhanced session tracking with device/browser detection, timeout, token refresh, and activity monitoring.

### Key Features & Design Decisions
- **Transaction Management**: `TenancyTimeline` and `SaleTimeline` models with stage progression and verification workflows.
- **Ejari System**: Compliant tenancy contract generation and digital signature workflows.
- **Analytics**: Vercel Speed Insights and `web-vitals` for real-time Core Web Vitals tracking.
- **Advanced Tools**: Smart Rent vs. Buy Calculator, Off-Plan Property Tracker, AI Neighborhood Analyzer, Virtual Tour Gallery.
- **AI-Powered Automation**: Enhanced property schema, bilingual support (Arabic/English), AI Chatbot Service, AI Agent Assignment Engine, and an AI Assistant Dashboard System managing 32 assistants across 10 departments.
- **Market Analytics Dashboard**: Provides KPIs, transaction breakdowns, and agent performance insights.
- **WhatsApp Business Integration**: Session management, QR code generation, Meta Business OAuth, and an AI Chatbot for customer support and lead scoring.
- **Mary's Data Tools Suite**: Integrated data acquisition tools including DAMAC Asset Fetcher, Image Data Extractor (OCR), and Web Data Harvester.
- **Zoe Executive Intelligence System**: Executive Suggestion Inbox and Executive Visibility for strategic suggestions and organizational oversight.
- **Confidential Vault System**: Redux state with dual-approval access request workflow and document management.
- **Lead Management Hub**: Redux state with lead pipeline, qualification engine, specialist routing, and scoring rules.
- **Compliance Engine**: KYC profile tracking, AML monitoring, and an immutable audit log.
- **Olivia Automation System**: Automated property availability sync, market intelligence gathering, and scheduling controls.
- **Henry Event System**: Universal event format for cross-assistant communication with correlation tracking.
- **Centralized Assistant Registry**: Single source of truth for all AI assistants with department configuration, capabilities, and data flow definitions.
- **Event Bus Middleware**: Redux middleware for event-driven communication between assistants.
- **AI Command Center**: Unified `CommandSidebar` component integrating quick stats, department-grouped assistant list with real-time status, notification badges, and activity feed.
- **Company Services Registry**: 35 services across 6 categories with workflow stages and assigned AI assistants.
- **Reusable CRM Components**: StatsBar, DataTable, ActionButton, ActivityFeed, StatusBadge, FlowchartViewer.

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
- **Vercel Speed Insights**: Performance analytics.