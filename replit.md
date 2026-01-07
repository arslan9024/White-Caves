# White Caves - Luxury Real Estate Dubai

## Overview
White Caves is a luxury real estate platform focused on the Dubai market. It offers comprehensive services for property sales and rentals, appointment scheduling, tenancy agreement management, payment processing, and internal HR functions like job applications and employee performance tracking. The platform supports diverse user roles including buyers, sellers, tenants, landlords, agents, and administrators, with robust role-based access control. The primary goal is to establish White Caves as the leading digital platform for Dubai's luxury property market, delivering a seamless and all-encompassing experience for all participants.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with Vite.
- **State Management**: Redux Toolkit.
- **UI/UX**: Custom React components with CSS modules, featuring a premium dark mode, glassmorphism styling, mobile responsiveness, and interactive elements. Includes mortgage/DLD fees calculators, advanced search, property comparison, interactive SVG Dubai map, and full-screen galleries. Role-based routing is implemented.

### Backend
- **Framework**: Express.js, providing a RESTful API.
- **API Structure**: Organized routes for users, properties, appointments, payments, and tenancy agreements.
- **System Design**: Frontend and backend operate on separate servers with a proxy setup. Features comprehensive error handling with custom classes and middleware.

### Data Storage
- **Primary Database**: MongoDB with Mongoose ODM.
- **Schema Design**: Document-based schemas for `User` (multi-role), `Property`, `Appointment`, `Service`, `TenancyAgreement`, `Job/JobApplication`, and `Performance`. MongoDB's flexibility supports dynamic real estate data.

### Authentication & Authorization
- **Provider**: Firebase Authentication (Google, Facebook, Apple, Email/Password, Phone/SMS OTP).
- **Role-Based Access Control**: Multi-role system (`BUYER`, `SELLER`, `LANDLORD`, `TENANT`, `AGENT`, `ADMIN`) with `isSuperUser` and `isDecisionMaker` flags.

### Key Features & Design Decisions
- **Ejari Unified Tenancy Contract System**: Implements compliant contract generation, secure digital signature workflows for multiple parties (Broker, Lessor, Tenant) with tokenized links, and status tracking.
- **Brand Theme**: Red and White color scheme, Montserrat/Open Sans typography, consistent design system with CSS variables, and comprehensive light/dark theme support.
- **Company Profile Section**: Comprehensive company information display with downloadable PDF brochure.
- **Click-to-Chat WhatsApp**: Enhanced WhatsApp integration with quick message options and custom message support.
- **Owner Dashboards**: Includes System Health monitoring, Productivity Tools (Google Workspace integration), and Multi-Role Navigation for owners to browse as different user types.
- **WhatsApp Business Dashboard** (Owner-Exclusive): Complete messaging management system for the company owner (arslanmalikgoraha@gmail.com):
  - Messages Dashboard: Real-time chat interface with contacts, message history, quick replies, and stats overview
  - Chatbot Rules Manager: Automated response configuration with trigger types (keyword, contains, regex, any), priority levels, and usage tracking
  - Analytics: Message tracking, peak hours analysis, top contacts, and chatbot automation metrics
  - MongoDB schemas: WhatsAppMessage, WhatsAppChatbotRule, WhatsAppSettings, WhatsAppContact
  - API routes protected by owner middleware at /api/whatsapp/*
  - Webhook endpoints for Meta Business API integration
- **Advanced Tools**: Features include Smart Rent vs. Buy Calculator (Dubai-specific), Off-Plan Property Tracker, AI Neighborhood Analyzer (investment scoring, demographics, amenities), and Virtual Tour Gallery (Matterport integration).
- **Interactive Mapping**: Enhanced SVG-based Dubai map with custom, color-coded markers, property previews, and filtering.
- **SEO Optimization**: Comprehensive meta tags, Open Graph, Twitter Cards, structured data (JSON-LD), sitemap, robots.txt, and performance optimizations (lazy loading, prefetching).
- **Session Management**: Utility for storing user preferences, search history, favorites, recently viewed properties, and form data autofill (excluding sensitive information).

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
- **WhatsApp Business API**: For customer support via Click-to-Chat component.
- **Matterport**: For virtual tour integration.

## Deployment Configuration

### Vercel Setup
- **vercel.json**: Configured with SPA rewrites (preserves /api/* routes)
- **Build**: Uses Vite with esbuild minification for faster builds
- **Output**: `dist/` directory with code-split chunks (vendor, firebase, redux)
- **Assets**: Static files (robots.txt, sitemap.xml, PDF brochure) copied to dist on build

### Environment Variables
- All client-side variables must use `VITE_` prefix
- See `.env.example` for full list of required variables

## Recent Changes (January 2026)
- **Major Homepage Redesign**: Complete redesign with modern 2024 web standards
  - New modular component architecture in `src/components/homepage/` folder
  - Hero section with animated stats counter, floating shapes, trust badges, and scroll indicator
  - Features section with 8 animated service cards showcasing platform capabilities
  - Locations section highlighting 4 premier Dubai neighborhoods with interactive cards
  - Team section with 4 team member profiles, social links, and career CTA
  - Testimonials carousel with auto-play, navigation dots, star rating invitation, and trust badges
  - Contact CTA section with modern form design and contact methods
  - All animations powered by Framer Motion with scroll-triggered reveals
  - New HomePage.jsx in src/pages/ integrating all sections while preserving existing tools
- **Multi-Channel Contact Support**: ClickToChat now supports 4 contact methods:
  - WhatsApp (+971 56 361 6136)
  - Botim app (botim://call?number=+971563616136)
  - GoChat UAE (https://gochat.me/+971563616136)
  - Direct call
- **Dubai Real Estate Data**: Comprehensive database in `src/data/dubaiDevelopers.js`:
  - 10 major developers (Emaar, DAMAC, Nakheel, Sobha, Meraas, etc.) with RERA registration
  - 32 Dubai projects with images, price ranges, and features
  - RERA regulatory information (laws, online services, license types)
  - Dubai Land Department information (fees, services, contact)
- **Social Media Integration**: TikTok, Instagram, Facebook links in Footer and SocialLinks component
- **Star Rating Invitations**: Added to testimonials section and ClickToChat to encourage reviews
- **Enhanced Footer**: 5-column layout with RERA/DLD badges, app buttons, quick links
- **Animation Libraries**: Added framer-motion, swiper, and lucide-react for modern animations
- **Vercel Deployment Ready**: Added vercel.json with proper SPA routing that preserves API routes
- **Build Optimization**: Switched from terser to esbuild for faster production builds
- **ClickToChat Enhancement**: Added online/offline status based on business hours (9am-10pm GST)
- **Loading Components**: Added PageLoader and LazyImage for better UX
- **Path Aliases**: Added @assets, @components, @utils aliases in Vite config
- Added CompanyProfile component with PDF download functionality
- Generated company profile PDF using pdf-lib
- Added SSR/deployment guards for window/document availability
- Updated navigation to include Properties and About pages in mobile menu
- Fixed SEO schema.org address and phone number

## Company Contact Information
- **Company Name**: White Caves Real Estate LLC
- **Address**: Office D-72, El-Shaye-4, Port Saeed, Dubai
- **Office Landline**: +971 4 335 0592
- **Mobile/WhatsApp**: +971 56 361 6136
- **Email**: admin@whitecaves.com
- **Website**: https://www.whitecaves.com
- **TikTok**: https://www.tiktok.com/@the.white.caves
- **Instagram**: https://www.instagram.com/the.white.caves/
- **Facebook**: https://www.facebook.com/the.white.caves/

## Homepage Component Structure
```
src/components/homepage/
├── Hero/           - Animated hero with parallax, stats, and floating shapes
├── Features/       - 8 service cards with hover effects
├── Locations/      - 4 Dubai neighborhoods with property previews
├── Team/           - Team member profiles with social links
├── Testimonials/   - Auto-playing carousel with navigation
└── Contact/        - Contact form and business information
```

## WhatsApp Business Dashboard (Owner-Exclusive)
```
src/pages/owner/
├── WhatsAppDashboardPage.jsx   - Main messaging interface with chat UI
├── WhatsAppChatbotPage.jsx     - Chatbot rules configuration
├── WhatsAppAnalyticsPage.jsx   - Analytics and performance tracking
└── *.css                       - Styling with WhatsApp green (#25D366) theme
```
Routes: /owner/whatsapp, /owner/whatsapp/chatbot, /owner/whatsapp/analytics
Access: Protected by ProtectedRoute (owner role only)

## AI-Powered Business Automation (January 2026)

### Enhanced Property Schema
- UAE-specific fields: permit numbers, Ejari, DEWA, RERA, DLD, Makani numbers
- Comprehensive property types: Apartment, Villa, Townhouse, Penthouse, Office, Warehouse, Land, Studio
- Emirates support: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, Umm Al Quwain
- 30+ UAE-specific amenities (Private Pool, Sea View, Burj Khalifa View, Palm View, etc.)
- Document management with verification status and expiry tracking
- Listing source tracking (WhatsApp, email, call, website, walk-in)
- Lead scoring with market trend analysis
- Viewing management with calendar integration
- Status tracking with full history

### Arabic/English Bilingual Support
- Language context provider at `src/context/LanguageContext.jsx`
- Comprehensive translations at `src/i18n/translations.js`
- RTL (Right-to-Left) CSS support at `src/styles/rtl.css`
- Language toggle component with multiple variants
- Cairo/Noto Sans Arabic font support
- Number/currency/date formatting for Arabic locale

### AI Chatbot Service
- Located at `src/services/ChatbotService.js`
- Intent classification for property inquiries, viewings, budget, contact
- Entity extraction: property type, location, bedrooms, budget
- Full Arabic support with intents and responses
- Context management for multi-turn conversations
- Lead scoring based on conversation analysis
- Suggested actions for quick responses

### AI Agent Assignment Engine
- Located at `src/services/AgentAssignmentService.js`
- Weighted scoring algorithm:
  - Expertise: 30% (property type, location, price range)
  - Availability: 25% (current load, calendar, working hours)
  - Performance: 20% (closure rate, response time, ratings)
  - Proximity: 15% (primary/secondary areas)
  - Client Preference: 10% (language, previous agent)
- Round-robin fallback assignment
- Team workload analysis

### Google Calendar Integration
- Located at `server/lib/googleCalendar.js`
- OAuth 2.0 with Calendar and Tasks scopes
- Property viewing event creation with Google Meet
- Automatic attendee invitations
- Task creation for follow-ups
- API routes: /api/calendar/*, /api/tasks/*

### Market Analytics Dashboard
- Located at `src/components/dashboard/MarketAnalyticsDashboard.jsx`
- KPIs: Monthly Deals, Avg Close Time, Lead Conversion, Satisfaction
- Emirates transaction breakdown with growth trends
- Property type distribution with pie chart
- Lead sources visualization (WhatsApp, Website, Referral)
- Top performing areas with demand indicators
- Agent performance leaderboard

### WhatsApp Business Connection (January 2026)
- **Session Management**: MongoDB model at `server/models/WhatsAppSession.js`
  - Connection status tracking (disconnected, connecting, qr_pending, connected, authenticated)
  - QR code generation with 5-minute expiry
  - Meta Business OAuth support
  - Automation settings (chatbot, auto-reply, business hours)
  - Quick replies configuration
- **Settings Page**: `src/pages/owner/WhatsAppSettingsPage.jsx`
  - QR code connection flow with visual instructions
  - Meta Business OAuth integration option
  - AI chatbot and auto-reply toggles
  - Business hours configuration
  - Welcome/away message templates
  - Quick replies management
- **API Routes** at `/api/whatsapp/*`:
  - GET /session - Fetch current session state
  - POST /connect - Initiate QR or Meta connection
  - POST /disconnect - Disconnect WhatsApp account
  - PUT /session/settings - Update automation settings
  - GET /qr/refresh - Generate new QR code
  - POST /simulate/connect - Test connection (development)
  - GET /meta/callback - OAuth callback handler
- Access: Protected by owner middleware (arslanmalikgoraha@gmail.com only)