# White Caves - Luxury Real Estate Dubai

## Overview
White Caves is a luxury real estate platform focused on the Dubai market, offering comprehensive services for property sales, rentals, appointment scheduling, tenancy agreement management, and payment processing, alongside internal HR functionalities. The platform supports diverse user roles with robust role-based access control. The vision is to be the premier digital solution for luxury real estate in Dubai, leveraging advanced technology and AI to streamline operations and enhance user experience for all stakeholders.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with Vite, utilizing Redux Toolkit for state management.
- **UI/UX**: Custom React components with CSS modules, featuring a premium dark mode, glassmorphism styling, mobile responsiveness, interactive elements (calculators, advanced search, property comparison, interactive SVG Dubai map), and full-screen galleries. Role-based routing is implemented.
- **Theming**: Consistent brand theme with a Red and White color scheme (#D32F2F primary, white backgrounds), Montserrat/Open Sans typography, and comprehensive light/dark theme support.
- **Design System**: Complete UI component library with Button, Input, Card, and Badge components featuring variants, sizes, states, and theme support, managed by an enhanced design token system for programmatic access to styles.
- **SEO Optimization**: Comprehensive meta tags, structured data, and performance optimizations.
- **Two-Tier Navigation System (Project Crimson)**:
  - **MainNavBar (Public)**: For website visitors - logo, public nav links (Home/Properties/Services/About/Contact), Buy/Rent/Sell dropdowns, Sign In button. No search, theme toggle, notifications, or profile.
  - **DashboardHeader (Internal)**: For authenticated company users - logo, Dashboard tabs (Dashboard/AI Command/AI Hub), search bar with Cmd+K shortcut, theme toggle, notifications bell, user profile dropdown.
  - **CrimsonSidebar**: 40% screen width (resizable 25-50%), drag-to-resize with localStorage persistence, user profile section, ZOE Executive AI command hub, AI assistants grouped by department, management/integration/system nav sections.
  - **DashboardShell**: Layout wrapper using DashboardHeader and CrimsonSidebar with dynamic margin based on sidebar width.

### Backend
- **Framework**: Express.js, providing a RESTful API with organized routes.
- **System Design**: Frontend and backend separation with proxy setup and comprehensive error handling.
- **Environment Guard Middleware**: Server-side validation for required deployment secrets.

### Data Storage
- **Primary Database**: MongoDB with Mongoose ODM.

### Authentication & Authorization
- **Authentication**: Firebase Authentication (social logins, email/password, phone/SMS OTP) and WebAuthn/Passkeys for biometric authentication.
- **Role-Based Access Control**: Multi-role system (`BUYER`, `SELLER`, `LANDLORD`, `TENANT`, `AGENT`, `ADMIN`) with `isSuperUser` and `isDecisionMaker` flags, supported by a comprehensive permission system.
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
- **AI Assistant Dashboard System**: Unified Redux state management for 24 AI assistants organized by department (Operations, Sales, Communications, Finance, Marketing, Executive, Compliance, Technology, Intelligence, Legal). Features include normalized state, memoized selectors, favorites, recent tracking, department filtering, search, real-time activity feed, performance metrics, and event-driven communication via Redux middleware.
- **Centralized Assistant Registry**: Single source of truth for all AI assistants with department configuration, capabilities, permissions, and data flow definitions.
- **Event Bus Middleware**: Redux middleware enabling event-driven communication between assistants with automated routing and audit trail logging.
- **UnifiedProfile Component**: Consistent user profile component with 3 variants (navbar, sidebar, dashboard) and ProfileContext for state management.
- **Henry Event System**: Universal event format for cross-assistant communication with correlation tracking and workflow tracing.
- **Olivia Automation System**: Automated property availability sync with inventory, market intelligence gathering from Bayut/Property Finder/Dubizzle, scheduling controls, and real-time activity logging.
- **Zoe Executive Intelligence System**: Executive Suggestion Inbox receiving AI-powered strategic suggestions from all assistants with priority filtering, department categorization, status management, confidence scoring, and projected impact analysis.
- **Weekly Research Module**: Shared component enabling all assistants to perform automated intelligence gathering on configurable schedules, generating structured suggestions for executive review.
- **AI Command Center**: Unified dashboard entry point with an AIDropdownSelector for selecting assistants, quick stats bar, lazy-loaded assistant dashboards, and an activity sidebar.
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
- **Vercel Speed Insights**: Performance analytics.
- **GitHub API**: (Implied, for development tooling)