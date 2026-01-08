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
- **AI CRM Assistants**: 12 specialized AI-powered assistants integrated into the Owner Dashboard, each with dedicated dashboards for specific functionalities (e.g., Linda for WhatsApp CRM, Mary for Inventory CRM, Clara for Leads CRM, Aurora for CTO operations).
- **AI Command Center**: Unified dashboard entry point with an AIDropdownSelector for selecting assistants, quick stats bar, lazy-loaded assistant dashboards, and an activity sidebar.
- **Shared Component Library**: Reusable UI components ensuring design consistency across all dashboards and features.

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