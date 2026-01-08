# White Caves - Luxury Real Estate Dubai

## Overview
White Caves is a luxury real estate platform specializing in the Dubai market, offering comprehensive services for property sales, rentals, appointment scheduling, tenancy agreement management, and payment processing. It also includes internal HR functionalities. The platform supports diverse user roles with robust role-based access control, aiming to be the leading digital platform for Dubai's luxury property sector by providing a seamless experience for all users.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with Vite, utilizing Redux Toolkit for state management.
- **UI/UX**: Custom React components with CSS modules, featuring a premium dark mode, glassmorphism styling, mobile responsiveness, interactive elements (calculators, advanced search, property comparison, interactive SVG Dubai map), and full-screen galleries. Role-based routing is implemented.
- **Shared Components**: Extensive library of reusable UI, layout, property, service, and data components in `src/shared/components/`.
- **Navigation**: Features a `UniversalNav` for global navigation and `SubNavBar` for role-specific dashboards, both dynamically configured via a `featureRegistry`.
- **Theming**: Consistent brand theme with a Red and White color scheme, Montserrat/Open Sans typography, and comprehensive light/dark theme support.

### Backend
- **Framework**: Express.js, providing a RESTful API with organized routes.
- **System Design**: Frontend and backend are separated with a proxy setup, and comprehensive error handling.

### Data Storage
- **Primary Database**: MongoDB with Mongoose ODM, utilizing document-based schemas for all core entities.

### Authentication & Authorization
- **Provider**: Firebase Authentication (supporting various social logins, email/password, phone/SMS OTP).
- **Biometric Authentication**: WebAuthn/Passkeys support for Face ID and Touch ID login.
- **Role-Based Access Control**: Multi-role system (`BUYER`, `SELLER`, `LANDLORD`, `TENANT`, `AGENT`, `ADMIN`) with `isSuperUser` and `isDecisionMaker` flags, supported by a comprehensive permission system and `usePermissions` hook.
- **Role Approval Workflow**: Admin interface for managing pending role requests.
- **Session Management**: Enhanced session tracking with device/browser detection, timeout, token refresh, and activity monitoring.
- **Social-First Authentication**: Prioritizes social login options on the SignInPage.

### Key Features & Design Decisions
- **Unified Layouts**: `AppLayout` and `RolePageLayout` provide consistent page and dashboard wrappers, respectively.
- **Content Management**: Redux slices for managing navigation, dashboard state, and dynamic content (featured properties, services, etc.).
- **Content Slider**: Responsive `ContentSlider` component for dynamic content display.
- **Owner-Exclusive Features**: Dedicated owner dashboard for WhatsApp Business, system health, user management, and global settings.
- **Transaction Timelines**: Comprehensive `TenancyTimeline` and `SaleTimeline` models with stage progression and verification workflows.
- **Ejari System**: Compliant tenancy contract generation and digital signature workflows.
- **Web Traffic Analytics**: Integration with Vercel Speed Insights and `web-vitals` for real-time Core Web Vitals tracking and a system health page.
- **Status Notification System**: Global toast notifications for various status updates.
- **Advanced Tools**: Smart Rent vs. Buy Calculator, Off-Plan Property Tracker, AI Neighborhood Analyzer, and Virtual Tour Gallery.
- **Interactive Mapping**: SVG-based Dubai map with custom markers and filtering.
- **SEO Optimization**: Comprehensive meta tags, structured data, and performance optimizations.
- **AI-Powered Automation**: Enhanced property schema, bilingual support (Arabic/English), AI Chatbot Service for intent classification, and an AI Agent Assignment Engine using a weighted scoring algorithm.
- **Google Calendar Integration**: For property viewing events and tasks.
- **Market Analytics Dashboard**: Provides KPIs, transaction breakdowns, and agent performance insights.
- **WhatsApp Business Integration**: Session management, QR code generation, Meta Business OAuth, and an AI Chatbot for customer support and lead scoring.
- **Chatbot Training Data Module**: Comprehensive bilingual training data for the AI chatbot.
- **Platform Features Explorer**: Owner-exclusive Feature Explorer component with Redux state management displaying all 33 implemented platform features. Features organized into 10 categories (Authentication, User Management, Property, Transactions, Communication, Analytics, Integrations, UI Components, Tools, System) with search, category filtering, grid view, and detailed feature panels showing implementation dates, source files, and capabilities.
- **Enhanced Owner Dashboard**: Comprehensive tabbed dashboard with 14 sections (Overview, Properties, Agents, Leads, Contracts, Analytics, Linda AI, Mary AI, Clara AI, AI Settings, WhatsApp, UAE Pass, Features, Settings). Features sticky tab navigation, real-time statistics, quick actions, data tables with filtering/search, agent performance cards, lead management, contract/Ejari tracking, analytics charts, chatbot stats, WhatsApp Business integration, UAE Pass user management, and system settings with feature toggles. Backend API at `/api/dashboard/owner/summary` serves mock data ready for real database integration.
- **Dynamic Role Selector**: RoleSelectorDropdown component (`src/shared/components/ui/RoleSelectorDropdown.jsx`) supporting 17 real estate industry roles with dynamic dashboard switching, permissions, and navigation. Roles include: Company Owner, Super Admin, Branch Manager, Sales Manager, Leasing Manager, Agent, Property Consultant, Legal Officer, Finance Officer, Marketing Manager, Document Controller, Landlord, Tenant, Buyer, Seller, Developer, and Valuation Expert.
- **Dynamic Theme System**: Comprehensive CSS variable-based theme system (`src/shared/styles/theme.css`) with proper light/dark mode contrast, including background, text, border, shadow, status, and component-specific color variables.
- **Reusable UI Components**: BigTile component (`src/shared/components/ui/BigTile.jsx`) for feature tiles with sizes, stats, and hover effects. FullScreenDetailModal (`src/shared/components/ui/FullScreenDetailModal.jsx`) for expanded views with image galleries, tabs, and action buttons.
- **AI CRM Assistants**: Three specialized AI-powered CRM systems integrated into the Owner Dashboard:
  - **Linda (WhatsApp CRM)**: `src/components/crm/LindaWhatsAppCRM.jsx` - Conversation management, AI insights, lead scoring, quick replies, real-time chat interface, and lead pre-qualification.
  - **Mary (Inventory CRM)**: `src/components/crm/MaryInventoryCRM.jsx` - Full CRUD operations for property management with filters, sorting, search, detail views, and comprehensive property forms.
  - **Clara (Leads CRM)**: `src/components/crm/ClaraLeadsCRM.jsx` - Full CRUD operations for lead management with stage tracking, scoring, activity timeline, and contact management.

## External Dependencies

- **Stripe**: Payment processing for property transactions.
- **Google Calendar API**: Appointment scheduling and reminders.
- **Google Maps API**: Property location visualization.
- **Firebase**: User authentication.
- **MongoDB**: Primary data store.
- **PDF.js**: Client-side PDF document rendering.
- **React Signature Canvas**: Digital signature capture.
- **Google Drive API**: Storing signed tenancy contracts and documents.
- **WhatsApp Business API**: Customer support and chatbot integration.
- **Matterport**: Virtual tour integration.