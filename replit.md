# White Caves - Luxury Real Estate Dubai

## Overview
White Caves is a luxury real estate platform specializing in the Dubai market. It provides comprehensive services for property sales, rentals, appointment scheduling, tenancy agreement management, and payment processing, integrated with internal HR functionalities. The platform supports diverse user roles with robust access control. The primary goal is to become the leading digital solution for luxury real estate in Dubai, utilizing advanced technology and AI to streamline operations and enhance the user experience for all stakeholders. The project aims to deliver a high-tech, user-friendly system that sets a new standard for property transactions and management in the region.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with Vite, utilizing Redux Toolkit for state management.
- **UI/UX**: Custom React components with CSS modules, featuring a premium dark mode, glassmorphism styling, mobile responsiveness, interactive elements (calculators, advanced search, property comparison, interactive SVG Dubai map, full-screen galleries), and role-based routing.
- **Theming**: Consistent brand theme with a Red and White color scheme, Montserrat/Open Sans typography, and comprehensive light/dark theme support, managed by an enhanced design token system.
- **Navigation System**: A three-tier navigation system comprising a public `MainNavBar`, an authenticated `DashboardHeader` with dynamic feature tabs, and an `AssistantHubSidebar` for 24 AI assistants. A `DashboardAppLayout` uses CSS Grid for responsive design.
- **Design System**: A complete UI component library with variants, sizes, states, and theme support.
- **SEO Optimization**: Comprehensive meta tags, structured data, and performance optimizations.

### Backend
- **Framework**: Express.js, providing a RESTful API with organized routes.
- **System Design**: Frontend and backend separation with a proxy setup and comprehensive error handling.
- **Middleware**: Environment guard middleware for server-side validation of required deployment secrets.

### Data Storage
- **Primary Database**: MongoDB with Mongoose ODM.

### Authentication & Authorization
- **Authentication**: Firebase Authentication (social logins, email/password, phone/SMS OTP) and WebAuthn/Passkeys for biometric authentication.
- **Role-Based Access Control**: Multi-role system (`BUYER`, `SELLER`, `LANDLORD`, `TENANT`, `AGENT`, `ADMIN`) with `isSuperUser` and `isDecisionMaker` flags, supported by a comprehensive permission system.
- **Session Management**: Enhanced session tracking with device/browser detection, timeout, token refresh, and activity monitoring.

### Key Features & Design Decisions
- **Transaction Management**: `TenancyTimeline` and `SaleTimeline` models with stage progression and verification workflows.
- **Ejari System**: Compliant tenancy contract generation and digital signature workflows.
- **Analytics**: Vercel Speed Insights and `web-vitals` for real-time Core Web Vitals tracking.
- **Advanced Tools**: Smart Rent vs. Buy Calculator, Off-Plan Property Tracker, AI Neighborhood Analyzer, Virtual Tour Gallery.
- **AI-Powered Automation**: Enhanced property schema, bilingual support (Arabic/English), AI Chatbot Service for intent classification, AI Agent Assignment Engine, and an AI Assistant Dashboard System for managing 24 assistants across 10 departments.
- **Market Analytics Dashboard**: Provides KPIs, transaction breakdowns, and agent performance insights.
- **WhatsApp Business Integration**: Session management, QR code generation, Meta Business OAuth, and an AI Chatbot for customer support and lead scoring.
- **Mary's Data Tools Suite**: Integrated data acquisition tools including DAMAC Asset Fetcher, Image Data Extractor (OCR), and Web Data Harvester.
- **Zoe Executive Intelligence System**: Executive Suggestion Inbox for AI-powered strategic suggestions, and Zoe Executive Visibility for organizational oversight.
- **Confidential Vault System**: Redux state with dual-approval access request workflow, document management, and vault statistics.
- **Lead Management Hub**: Redux state with lead pipeline, qualification engine, specialist routing, funnel metrics, and lead scoring rules.
- **Compliance Engine**: KYC profile tracking, AML monitoring with flagged transactions, and an immutable audit log.
- **Olivia Automation System**: Automated property availability sync, market intelligence gathering from Bayut/Property Finder/Dubizzle, and scheduling controls.
- **Henry Event System**: Universal event format for cross-assistant communication with correlation tracking.
- **Centralized Assistant Registry**: Single source of truth for all AI assistants with department configuration, capabilities, permissions, and data flow definitions.
- **Event Bus Middleware**: Redux middleware enabling event-driven communication between assistants.
- **AI Command Center**: Unified dashboard entry point with an AIDropdownSelector for selecting assistants, quick stats bar, and activity sidebar.
- **Company Services Registry**: 35 services across 6 categories with workflow stages and assigned AI assistants.
- **ServiceDemoMode Component**: Interactive end-to-end service workflow demonstration.
- **Reusable CRM Components**: StatsBar, DataTable, ActionButton, ActivityFeed, StatusBadge, FlowchartViewer.

## External Dependencies

- **Stripe**: Payment processing.
- **Mashreq NEOBiz**: Primary bank account for transfers and digital payments.
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
- **Vercel Speed Insights**: Performance analytics.

## AI Assistants Registry (24 Total)

### Executive Department
| Assistant | Role | Features |
|-----------|------|----------|
| **Zoe** | CEO Intelligence | Executive Dashboard, Suggestion Inbox, Analytics, Reports |

### Operations Department
| Assistant | Role | Features |
|-----------|------|----------|
| **Mary** | Inventory Manager | Inventory, Data Tools Suite, Asset Fetcher, Data Import |
| **Daisy** | Property Coordinator | Leases, Tenants, Maintenance, Rental Analytics |
| **Sentinel** | Quality Control | Property Monitoring, Predictive Maintenance, Inspections, Emergency Response |

### Sales Department
| Assistant | Role | Features |
|-----------|------|----------|
| **Clara** | Lead Manager | Pipeline, Lead List, Scoring, Nurturing Workflows |
| **Nancy** | HR & Performance | Employees, Recruitment, Attendance, Performance Reviews |
| **Hunter** | Lead Hunter | Prospects, Outreach Campaigns, Pattern Detection, Lead Enrichment |

### Communications Department
| Assistant | Role | Features |
|-----------|------|----------|
| **Linda** | WhatsApp Manager | Conversations, Agent Status, Templates, Broadcasts |
| **Nina** | Client Relations | Bot Builder, Flow Designer, Sessions, Bot Analytics |

### Finance Department
| Assistant | Role | Features |
|-----------|------|----------|
| **Theodora** | CFO Intelligence | Invoices, Payments, Financial Reports, Escrow |
| **Penny** | Commission Tracker | Commission calculations, payout schedules, agent earnings |
| **Quinn** | Payment Processor | Payment gateway, transaction tracking, refunds |

### Marketing Department
| Assistant | Role | Features |
|-----------|------|----------|
| **Marcus** | Campaign Manager | Campaign creation, A/B testing, performance tracking |
| **Stella** | Content Creator | Content calendar, asset management, copywriting |
| **Laila** | Brand Manager | KYC verification, AML monitoring, Contract Review, Audit Trail |

### Compliance Department
| Assistant | Role | Features |
|-----------|------|----------|
| **Henry** | Compliance Officer | Events, Audit Log, Timeline Analytics, Compliance Reports |
| **Vera** | KYC Specialist | Identity verification, document validation, risk scoring |

### Technology Department
| Assistant | Role | Features |
|-----------|------|----------|
| **Aurora** | CTO Intelligence | Systems Health, Deployments, Documentation, AI Governance |
| **Atlas** | API Monitor | Projects, Feasibility Analysis, Developer Tracking, Zoning |

### Intelligence Department
| Assistant | Role | Features |
|-----------|------|----------|
| **Sage** | Market Analyst | Market trends, pricing predictions, competitor tracking |
| **Olivia** | Research Lead | Campaigns, Social Media, Automation, Market Intelligence |

### Legal Department
| Assistant | Role | Features |
|-----------|------|----------|
| **Sophia** | Contract Manager | Deals, Sales Pipeline, Forecast, Commission Calculator |
| **Ivy** | Ejari Specialist | Ejari registration, contract compliance, renewals |
| **Max** | Document Processor | Document generation, OCR processing, archival |

### Additional Specialized Assistants
| Assistant | Role | Features |
|-----------|------|----------|
| **Hazel** | Frontend UX | Components, Design System, Accessibility, Themes |
| **Willow** | Backend Ops | APIs, Database, Performance, Security |
| **Evangeline** | Legal Risk | Risk Analysis, Contracts, Regulations, Best Practices |
| **Cipher** | Market Intel | Market Trends, Predictions, Competitors, Economic Indicators |
| **Vesta** | Project Handover | Milestones, Snagging, Handover, Defects |
| **Juno** | Community Mgmt | Facilities, IoT, Events, Energy Optimization |
| **Kairos** | VIP Services | VIP Clients, Concierge, Lifestyle, Partners |
| **Maven** | Investment | Portfolio, Yields, Tax Planning, Investment Advice |