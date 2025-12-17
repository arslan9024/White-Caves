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

### Third-Party Services
- **WhatsApp Business API**: Integrated for customer support via a floating button.