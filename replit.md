# White Caves - Luxury Real Estate Dubai

## Overview

White Caves is a comprehensive real estate platform focused on the Dubai luxury property market. The application handles property listings (both sales and rentals), appointment scheduling, tenancy agreement management, payment processing, job applications, and employee performance tracking. It serves multiple user types including visitors, agents, employees, buyers, sellers, tenants, landlords, and property owners, with role-based access control and special permissions for super users and decision makers.

## Recent Changes

**November 7, 2025** - Firebase integration and modern Profile component:
- Created comprehensive Firebase setup documentation (FIREBASE_SETUP.md) with step-by-step instructions for all authentication methods
- Centralized Firebase configuration in src/config/firebase.js with exportable authentication functions
- Refactored Auth component to use Firebase utility functions, reducing code duplication
- Fixed critical phone authentication bug - now properly stores confirmationResult for OTP verification
- All 6 authentication methods fully functional: Google, Facebook, Apple, Email/Password, Phone/SMS OTP
- Enhanced social login button styling with theme-specific designs (light/dark mode)
- Google button: white gradient in light mode, dark gradient in dark mode
- Facebook button: blue gradient in light mode, dark blue gradient in dark mode
- Completely redesigned Profile component with modern tabbed interface
- Profile tabs: Overview, Favorites, Saved Searches, Activity History, Settings
- Profile picture upload and management functionality
- Display of all connected login methods (social accounts, email, phone)
- Favorites section with property cards and remove functionality
- Saved searches management with run/delete actions
- Activity timeline showing user interactions
- Notification and privacy preference settings
- Security settings section for password, email, and 2FA management
- Account statistics dashboard (favorites count, saved searches, activities)
- Modern, responsive Profile styling with gradient backgrounds
- Full dark mode support for all Profile features
- Smooth animations and transitions throughout Profile UI
- Mobile-responsive grid layouts for all screen sizes
- Vite configuration updated with @assets alias for image imports

**November 3, 2025** - Company branding and enhanced authentication:
- Added company logo to navigation header and footer
- Logo displays in both light and dark modes with appropriate styling
- Logo file stored in public folder as company-logo.jpg
- Added tabbed authentication interface with 3 login options: Social Login, Email, Mobile
- Social login supports Google, Facebook, and Apple sign-in via Firebase
- Email authentication with sign-up/sign-in toggle, password validation, and confirmation
- Mobile/Phone authentication with OTP verification system using Firebase SMS
- Form validation with inline error messages using FormField component
- Toast notifications for authentication success/error messages
- Dark mode support for all authentication UI components
- Proper loading states and disabled buttons during authentication process
- Integration with existing Toast notification system and form validation hooks

**November 3, 2025** - Dubai property content update:
- Expanded property listings from 3 to 12 diverse properties across premium Dubai locations
- Added realistic Dubai locations: Palm Jumeirah, Downtown Dubai, Emirates Hills, Dubai Marina, Arabian Ranches, JVC, Business Bay, JBR, Dubai Hills Estate, City Walk, MBR City, The Springs
- Updated property types: Villas, Penthouses, Apartments, Townhouses
- Realistic Dubai luxury real estate pricing in AED (3.2M to 65M AED range)
- Enhanced property details with descriptions highlighting unique features and locations
- Added diverse amenities: Pool, Beach Access, Garden, Gym, Cinema, Concierge, Security
- Property sizes ranging from 2,100 to 15,000 sqft reflecting Dubai's luxury market

**November 3, 2025** - Comprehensive error handling implementation:
- Created custom error classes for different error types (AppError, ValidationError, PaymentError, etc.)
- Implemented HttpError class in API client for proper error propagation
- Added backend error handling middleware with asyncHandler for Express routes
- Created validation middleware for common validations (email, phone, required fields, etc.)
- Implemented React Error Boundary component for catching JavaScript errors
- Built Toast notification system for user-friendly error/success messages
- Created custom hooks: useApi, useFetch, useApiCall, useFormValidation
- Added FormField component with inline error display
- Updated payment routes with proper error handling and configuration checks
- Improved MongoDB connection error handling with better logging
- Created comprehensive error handling documentation (ERROR_HANDLING.md)
- Example component (ExampleErrorHandling.jsx) for testing error handling features

**November 3, 2025** - Landing page and development environment updates:
- Redesigned hero section with gradient overlay, improved typography, and fade-in animations
- Added statistics showcase (500+ properties, 1000+ clients, 15+ years experience, 50+ agents)
- New "Featured Locations" section highlighting Palm Jumeirah, Downtown Dubai, Emirates Hills, and Dubai Marina
- Modern hover effects and interactive elements
- Enhanced dark/light theme toggle with comprehensive styling across all sections
- Improved mobile responsiveness
- Added `concurrently` package to run frontend (Vite on port 5000) and backend (Express on port 3000) simultaneously
- Created unified development workflow using `npm run dev:all`

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
- Facebook OAuth
- Apple Sign-In
- Email/password authentication
- Phone/SMS OTP authentication

**Firebase Configuration**: Centralized in `src/config/firebase.js` with:
- Modular SDK v9 implementation
- Exported authentication functions for all sign-in methods
- User profile management utilities (updateUserProfile, updateUserEmail, updateUserPassword)
- Email verification and password reset functions
- Proper error handling and configuration checks

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