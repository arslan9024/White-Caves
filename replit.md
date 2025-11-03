# White Caves - Luxury Real Estate Dubai

## Overview

White Caves is a comprehensive real estate platform focused on the Dubai luxury property market. The application handles property listings (both sales and rentals), appointment scheduling, tenancy agreement management, payment processing, job applications, and employee performance tracking. It serves multiple user types including visitors, agents, employees, buyers, sellers, tenants, landlords, and property owners, with role-based access control and special permissions for super users and decision makers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with Vite as the build tool, providing fast Hot Module Reloading (HMR) and optimized production builds.

**State Management**: Redux Toolkit for global state management, handling:
- Property listings and filtering
- User authentication and profile data
- Complex filter combinations (price, location, beds, amenities, property type, etc.)

**Rationale**: Redux Toolkit reduces boilerplate and provides built-in best practices for state management. The centralized store makes it easier to manage complex filtering logic and user sessions across multiple components.

**UI Components**: Custom React components with CSS modules for styling. No external UI library is used, allowing for full design control.

**Key Features**:
- Dark mode support with theme transitions
- Property search and filtering
- Interactive map integration via Google Maps API
- PDF document handling for tenancy agreements
- Digital signature capture using SignaturePad
- WhatsApp integration for customer support

### Backend Architecture

**Framework**: Express.js server running separately from the Vite development server.

**API Structure**: RESTful API with route-based organization:
- `/api/users` - User management
- `/api/properties` - Property CRUD operations
- `/api/appointments` - Appointment scheduling
- `/api/payments` - Payment processing via Stripe
- `/api/tenancy-agreements` - Tenancy contract management

**Proxy Configuration**: Vite dev server proxies `/api` requests to the Express backend (localhost:3000), enabling seamless development without CORS issues.

**Rationale**: Separating frontend and backend servers allows independent scaling and deployment. The proxy setup simplifies development while maintaining a production-ready architecture.

### Data Storage

**Primary Database**: MongoDB via Mongoose ODM for flexible document-based storage.

**Schema Design**:
- **User**: Supports multiple roles, passport verification, contact information
- **Property**: Detailed specifications, features, amenities, and relationships to owners/managers
- **Appointment**: Links properties, agents, and clients with calendar integration
- **Service**: Tracks client services with dependency management (EJARI, DEWA, move-in permits)
- **TenancyAgreement**: Digital contract management with multi-party signatures
- **Job/JobApplication**: Recruitment system for real estate positions
- **Performance**: Employee performance tracking with metrics and rewards

**ORM Layer**: Prisma Client is included in dependencies but not actively used. The application currently uses Mongoose exclusively.

**Rationale**: MongoDB's document model fits the varied and nested data structures common in real estate (property features, amenities, user roles). Mongoose provides schema validation and relationship management.

### Authentication & Authorization

**Provider**: Firebase Authentication supporting:
- Google OAuth
- Apple Sign-In
- Email/password authentication

**Role-Based Access Control**: Multi-role system where users can have multiple roles simultaneously:
- VISITOR, AGENT, EMPLOYEE, BUYER, SELLER, TENANT, LANDLORD, PROPERTY_OWNER, SUPER_USER
- Special flags: `isSuperUser`, `isDecisionMaker`

**Rationale**: Firebase handles the complexity of authentication across multiple providers. The multi-role system allows users to act in different capacities (e.g., a landlord who is also buying property).

## External Dependencies

### Payment Processing
- **Stripe**: Payment intent creation for property transactions
- **Integration Points**: Checkout component, payment routes
- **Configuration**: Requires `STRIPE_SECRET_KEY` environment variable

### Calendar Management
- **Google Calendar API**: Appointment scheduling and tenancy renewal reminders
- **Integration Points**: Appointment creation, tenancy agreement tracking
- **Configuration**: Requires `GOOGLE_API_KEY` environment variable

### Mapping Services
- **Google Maps API**: Property location visualization via `@react-google-maps/api`
- **Use Case**: Interactive property maps for location browsing

### Authentication
- **Firebase**: User authentication and session management
- **Providers**: Google, Apple, Email/Password
- **Configuration**: Firebase configuration object required in environment

### Database
- **MongoDB**: Primary data store
- **Configuration**: Requires `MONGODB_URI` environment variable
- **Fallback**: Application runs with limited functionality if MongoDB is not configured

### Document Processing
- **PDF.js**: Client-side PDF rendering for tenancy agreements
- **Use Case**: Display and review contracts before signing

### State Management
- **Redux Toolkit**: Global state container with middleware support
- **Redux DevTools**: Enabled for development debugging

### Third-Party Services
- **WhatsApp Business API**: Customer support integration via floating button
- **Configuration**: Static integration, no API key required