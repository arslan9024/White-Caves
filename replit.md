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
  - Testimonials carousel with auto-play, navigation dots, and client logos
  - Contact CTA section with modern form design and contact methods
  - All animations powered by Framer Motion with scroll-triggered reveals
  - New HomePage.jsx in src/pages/ integrating all sections while preserving existing tools
- **Animation Libraries**: Added framer-motion, swiper, and lucide-react for modern animations
- **Vercel Deployment Ready**: Added vercel.json with proper SPA routing that preserves API routes
- **Build Optimization**: Switched from terser to esbuild for faster production builds
- **ClickToChat Enhancement**: Added online/offline status based on business hours (9am-10pm GST)
- **Loading Components**: Added PageLoader and LazyImage for better UX
- **Path Aliases**: Added @assets, @components, @utils aliases in Vite config
- Added CompanyProfile component with PDF download functionality
- Created enhanced ClickToChat WhatsApp component with quick message options
- Generated company profile PDF using pdf-lib
- Added SSR/deployment guards for window/document availability
- Updated navigation to include Properties and About pages in mobile menu
- Fixed SEO schema.org address and phone number

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