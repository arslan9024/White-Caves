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
- **AI Assistant Hub**: Unified command center for all AI assistants with quick stats overview, visual assistant cards, feature map view, and live activity feed.
- **AI CRM Assistants**: Five specialized AI-powered CRM systems integrated into the Owner Dashboard:
    - **Linda (WhatsApp CRM)**: Conversation management, AI insights, lead scoring, real-time chat interface.
    - **Mary (Inventory CRM)**: Full CRUD operations for property management with comprehensive filtering and data display.
    - **Clara (Leads CRM)**: Full CRUD operations for lead management with stage tracking, scoring, and activity timeline.
    - **Nina (WhatsApp Bot Developer)**: WhatsApp bot session management, QR code scanning, web terminal, and bot analytics.
    - **Nancy (HR Manager)**: Complete HR management system with employee directory, job board, applicant tracking, attendance monitoring, and performance reviews.

## External Dependencies

- **Stripe**: Payment processing.
- **Google Calendar API**: Appointment scheduling and reminders.
- **Google Maps API**: Property location visualization.
- **Firebase**: User authentication.
- **MongoDB**: Primary data store.
- **PDF.js**: Client-side PDF document rendering.
- **React Signature Canvas**: Digital signature capture.
- **Google Drive API**: Storing signed tenancy contracts and documents.
- **WhatsApp Business API**: Customer support and chatbot integration.
- **Matterport**: Virtual tour integration.