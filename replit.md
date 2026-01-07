# White Caves - Luxury Real Estate Dubai

## Overview
White Caves is a luxury real estate platform specializing in the Dubai market. It provides comprehensive services for property sales and rentals, appointment scheduling, tenancy agreement management, and payment processing. The platform also includes internal HR functionalities for job applications and employee performance tracking. Supporting diverse user roles (buyers, sellers, tenants, landlords, agents, administrators) with robust role-based access control, White Caves aims to be the leading digital platform for Dubai's luxury property sector, offering a seamless experience for all users.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with Vite.
- **State Management**: Redux Toolkit.
- **UI/UX**: Custom React components with CSS modules, featuring a premium dark mode, glassmorphism styling, mobile responsiveness, and interactive elements like calculators, advanced search, property comparison, an interactive SVG Dubai map, and full-screen galleries. Role-based routing is implemented.

### Backend
- **Framework**: Express.js, providing a RESTful API.
- **API Structure**: Organized routes for users, properties, appointments, payments, and tenancy agreements.
- **System Design**: Frontend and backend are separated with a proxy setup, and comprehensive error handling is implemented.

### Data Storage
- **Primary Database**: MongoDB with Mongoose ODM.
- **Schema Design**: Document-based schemas for multi-role `User`, `Property`, `Appointment`, `Service`, `TenancyAgreement`, `Job/JobApplication`, `Performance`, `WhatsAppMessage`, `WhatsAppChatbotRule`, `WhatsAppSettings`, and `WhatsAppContact`.

### Authentication & Authorization
- **Provider**: Firebase Authentication (Google, Facebook, Apple, Email/Password, Phone/SMS OTP).
- **Role-Based Access Control**: Multi-role system (`BUYER`, `SELLER`, `LANDLORD`, `TENANT`, `AGENT`, `ADMIN`) with `isSuperUser` and `isDecisionMaker` flags.

### Key Features & Design Decisions
- **Global Top Navigation System**: Replaced sidebar navigation with global TopNavBar featuring live time/date display, profile picture dropdown, and role-based menu items. AppLayout wrapper provides universal navigation structure.
- **Transaction Timeline System**: Comprehensive TenancyTimeline and SaleTimeline MongoDB models with document tracking, stage progression (16 tenancy stages, 14 sale stages), and verification workflows. API routes at `/api/timelines`.
- **Ejari Unified Tenancy Contract System**: Compliant contract generation, secure digital signature workflows, and status tracking.
- **Brand Theme**: Red and White color scheme, Montserrat/Open Sans typography, consistent design system with CSS variables, and comprehensive light/dark theme support.
- **Company Profile Section**: Displays company information with downloadable PDF brochure.
- **Click-to-Chat WhatsApp**: Enhanced WhatsApp integration with quick message options.
- **Owner Dashboards**: Includes System Health monitoring, Productivity Tools (Google Workspace integration), and Multi-Role Navigation.
- **WhatsApp Business Dashboard** (Owner-Exclusive): Comprehensive messaging management with real-time chat, chatbot rules manager, and analytics.
- **Advanced Tools**: Smart Rent vs. Buy Calculator (Dubai-specific), Off-Plan Property Tracker, AI Neighborhood Analyzer, and Virtual Tour Gallery (Matterport integration).
- **Interactive Mapping**: Enhanced SVG-based Dubai map with custom, color-coded markers, property previews, and filtering.
- **SEO Optimization**: Comprehensive meta tags, Open Graph, Twitter Cards, structured data (JSON-LD), sitemap, robots.txt, and performance optimizations.
- **Session Management**: Stores user preferences, search history, favorites, recently viewed properties, and form data autofill.
- **AI-Powered Automation**: Includes enhanced property schema with UAE-specific fields, Arabic/English bilingual support with RTL CSS, an AI Chatbot Service for intent classification and entity extraction, and an AI Agent Assignment Engine using a weighted scoring algorithm.
- **Google Calendar Integration**: For property viewing event creation, follow-up tasks, and meeting invitations.
- **Market Analytics Dashboard**: Provides KPIs, transaction breakdowns, lead source visualization, and agent performance leaderboards.
- **WhatsApp Business Connection**: Session management, QR code generation, Meta Business OAuth support, and automation settings.
- **AI Chatbot Integration with WhatsApp**: Server-side chatbot with bilingual support, intent recognition, entity extraction, context management, and lead scoring.
- **Agent Assignment Engine**: Weighted scoring algorithm with expertise (35%), availability (25%), performance (20%), proximity (10%), and client match (10%) for intelligent agent matching.
- **Chatbot Training Data Module**: Comprehensive bilingual training data with intents, entities, patterns, and quick replies for property inquiries.
- **Language Configuration Utility**: Centralized language config with translations, RTL settings, number/currency formatting for Arabic and English.
- **Dashboard Service**: Analytics API for market insights, agent performance, property distribution, and real-time metrics.
- **Notification Service**: Multi-channel notification system supporting email, SMS, WhatsApp, and push notifications.
- **Deployment Verification Scripts**: Automated deployment checks and code validation tools (`npm run validate`, `npm run verify-deploy`).
- **Chatbot Testing Interface**: Interactive testing UI in WhatsApp Settings with real-time response analysis and conversation history.
- **Production Deployment Readiness**: System Health page includes 8 automated deployment checks with deployability score.
- **Proprietary Licensing**: README.md and LICENSE updated with White Caves Real Estate LLC company information.

## External Dependencies

### Payment Processing
- **Stripe**: For property transaction payments.

### Calendar Management
- **Google Calendar API**: For appointment scheduling and reminders.

### Mapping Services
- **Google Maps API**: For property location visualization.

### Authentication
- **Firebase**: For user authentication.

### Database
- **MongoDB**: Primary data store.

### Document Processing
- **PDF.js**: Client-side rendering of PDF documents.
- **React Signature Canvas**: Digital signature capture.

### Cloud Storage
- **Google Drive API**: For saving signed tenancy contracts and documents.

### Third-Party Services
- **WhatsApp Business API**: For customer support and chatbot integration.
- **Matterport**: For virtual tour integration.