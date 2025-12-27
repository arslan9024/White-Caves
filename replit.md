# White Caves - Luxury Real Estate Dubai

## Overview

White Caves is a luxury real estate platform specializing in the Dubai market. It facilitates property sales and rentals, manages appointments and tenancy agreements, processes payments, and handles job applications and employee performance. The platform supports a diverse set of users including buyers, sellers, tenants, landlords, agents, and administrators, with robust role-based access control to manage permissions and functionalities. The vision is to be the leading digital platform for Dubai's luxury property market, offering a seamless and comprehensive experience for all stakeholders.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with Vite for development and optimized builds.
**State Management**: Redux Toolkit for centralized global state, managing property listings, user authentication, and complex filtering logic.
**UI/UX**: Custom React components with CSS modules, featuring a premium dark mode, glassmorphism styling, and mobile-responsive layouts. Key UI elements include a MegaNav, skeleton loaders, and interactive components.
**Technical Implementations**: Includes mortgage and DLD fees calculators, advanced search filters, property comparison tools, interactive SVG-based Dubai map, full-screen image galleries, and a comprehensive user dashboard. Role-based routing ensures dedicated experiences for different user types.

### Backend Architecture

**Framework**: Express.js, providing a RESTful API for all core functionalities.
**API Structure**: Organized into logical routes such as `/api/users`, `/api/properties`, `/api/appointments`, `/api/payments`, and `/api/tenancy-agreements`.
**System Design Choices**: Frontend and backend run on separate servers (Vite on 5000, Express on 3000) with a proxy setup to handle API requests, ensuring independent scalability and simplified development. Comprehensive error handling with custom error classes, middleware, and React Error Boundaries is implemented.

### Data Storage

**Primary Database**: MongoDB, utilizing Mongoose ODM for schema definition and interaction.
**Schema Design**: Document-based schemas for `User` (multi-role support), `Property` (detailed specifications), `Appointment`, `Service`, `TenancyAgreement`, `Job/JobApplication`, and `Performance`.
**Rationale**: MongoDB's flexibility is well-suited for the dynamic and nested data structures inherent in real estate.

### Authentication & Authorization

**Provider**: Firebase Authentication, supporting Google, Facebook, Apple, Email/Password, and Phone/SMS OTP sign-in methods.
**Role-Based Access Control**: A multi-role system including `BUYER`, `SELLER`, `LANDLORD`, `TENANT`, `AGENT`, and `ADMIN` roles, with `isSuperUser` and `isDecisionMaker` flags for elevated permissions. Users can hold multiple roles simultaneously.

## External Dependencies

### Payment Processing
- **Stripe**: For handling property transaction payments.

### Calendar Management
- **Google Calendar API**: Used for appointment scheduling and tenancy renewal reminders.

### Mapping Services
- **Google Maps API**: Integrated via `@react-google-maps/api` for property location visualization.

### Authentication
- **Firebase**: Provides robust user authentication across multiple providers (Google, Apple, Email/Password).

### Database
- **MongoDB**: The primary data store for the application.

### Document Processing
- **PDF.js**: Client-side rendering of PDF documents, specifically for tenancy agreements.
- **React Signature Canvas**: Digital signature capture for tenancy contracts between landlords, tenants, and brokers.

### Cloud Storage
- **Google Drive API**: Integrated for saving signed tenancy contracts and documents to cloud storage.

### Third-Party Services
- **WhatsApp Business API**: Integrated for customer support via a floating button.

## Recent Changes (December 2024)

### Navigation System Update
- Added HomeButton component with multiple variants (default, primary, minimal, floating)
- Created centralized navigation configuration (`src/config/navigation.js`) with role-based menus
- Updated MegaNav with logo linking to home page
- Enhanced MobileNav with role-aware accordion menus and expandable sections
- Updated RoleNavigation sidebar with Quick Links section (Home, Properties, Services, Contact, Profile)

### PDF Signature Feature
- Created SignaturePad component using react-signature-canvas for digital signatures
- Built TenancyContract component with complete contract display and signature workflow
- Implemented three-party signing flow: Broker creates → Landlord signs → Tenant signs
- Contract status tracking: draft, partially_signed, fully_signed

### Google Drive Integration
- Set up Google Drive connector for document storage
- Created server endpoint for uploading signed contracts to Google Drive
- HTML contract generation with embedded signatures for cloud storage

### Contract Management (Leasing Agent)
- Created ContractManagementPage for leasing agents at `/leasing-agent/contracts`
- Contract creation form with property, landlord, tenant, and lease term fields
- Contract list view with status badges and actions
- Statistics dashboard for contract tracking

### Error Handling
- NotFoundPage with 5-second auto-redirect countdown
- ErrorBoundary component with automatic recovery
- Error component with styled countdown timer

### Ejari Unified Tenancy Contract System (December 2024)
- Created MongoDB schemas for Contract and SignatureToken with all Ejari-compliant fields
- Built complete server API for contract CRUD, signature link generation, and secure signing
- ContractManagementPage with bilingual Ejari form (English/Arabic):
  - Owner/Lessor information section
  - Tenant information section
  - Property details (usage, type, location, area, DEWA premises)
  - Contract terms (period, rent, deposit, payment mode)
  - Broker information
- Digital signature workflow:
  - Broker creates contract and signs first
  - Generates secure tokenized links for Lessor and Tenant (72-hour expiration)
  - Copy-to-clipboard functionality for manual link sharing
  - Public signature page at `/sign/:token` for external parties
  - Status tracking: draft → partially_signed → fully_signed
- Google Drive integration for storing fully signed contracts as HTML
- API response normalization ensures consistent `id` field across MongoDB and file-based storage

### System Health Dashboard (December 2024)
- Created owner-only System Health page at `/owner/system-health`
- Real-time monitoring of:
  - Server status (uptime, environment, port)
  - MongoDB connection status and storage mode
  - Firebase configuration (Project ID, Auth Domain, Admin SDK)
  - Stripe integration (API key status, test/live mode)
  - Google Drive credentials
  - Google Maps API key
- Environment variable overview showing configured/missing secrets
- Added quick access from Owner Dashboard

### Brand Theme Update (December 2024)
- Implemented comprehensive design system with new brand colors:
  - Primary: #1a365d (deep blue) for headers, main CTAs, and navigation
  - Secondary: #c53030 (warm red) for highlights, interactive elements, and accents
  - Neutral backgrounds: #f7fafc (light mode), #2d3748 (dark mode)
- Typography system using:
  - Montserrat for headings (font-weight 600-800)
  - Open Sans for body text (font-weight 300-600)
- Tile/Card system with:
  - 0.75rem (12px) rounded corners
  - 2rem minimum padding for generous spacing
  - Subtle box shadows (var(--shadow-md))
  - Smooth hover animations with lift effect
- Updated all major sections: hero, property cards, services, features, contact, footer
- CSS variables in `src/styles/design-system.css` for consistent theming
- Dark mode support with appropriate color mappings