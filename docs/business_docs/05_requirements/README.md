# White Caves Unified CRM - Complete Requirements Specification

**Status:** Active / Transitional Canonical Bridge  
**Owner:** Requirements Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Partial (see canonical authority below)

## Canonical authority (must read first)

This file remains a comprehensive narrative/reference requirement pack. Canonical counting and requirement-governance authority is distributed as follows:

- Business requirement counting authority: [`functional-requirements.md`](./functional-requirements.md)
- Business↔software mapping authority: [`REQ_TO_FR_BR_NFR_POL_AC_MAPPING_2026-08-03.md`](./REQ_TO_FR_BR_NFR_POL_AC_MAPPING_2026-08-03.md)
- Software canonical requirement register authority: [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)
- Cross-domain traceability authority: [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)

## 10k SRS hybrid program alignment

During the 10k SRS campaign, this document functions as a business-facing requirement narrative source. Canonical requirement totals must be derived from the software-side canonical registry and validated mapping artifacts, not from narrative mentions in this file.

## Frontend-first priority note

Requirements that drive frontend behavior (routing, state flows, UI resilience, accessibility, performance) should be tagged in downstream mapping artifacts for first-cluster execution in future waves.

## Executive Summary

Complete specifications for White Caves unified real estate CRM platform serving 200+ agents across Dubai with 9,378+ properties, 1,500+ monthly leads, and $50M+ annual transaction volume.

## Enterprise Inventory Index

- [Business-document inventory](./enterprise-requirement-inventory.md)
- [Software requirements inventory](../../software_docs/01_requirements_engineering/ENTRPRISE_SRS_INVENTORY_2026-08-06.md)
- [Generated requirement catalog](../../software_docs/01_requirements_engineering/enterprise-requirement-catalog.json)

---

## 📋 FUNCTIONAL REQUIREMENTS

### FR-1: CUSTOMER INQUIRY CAPTURE (WhatsApp-First)

**Priority**: CRITICAL
**Personas**: Nina (Bot), Nadia (Agents), Customers

#### FR-1.1: 24/7 WhatsApp Bot Availability

- [ ] Multi-language support (Arabic/English, 95%+ accuracy)
- [ ] 24/7 uptime guarantee (99.9%)
- [ ] <10 second response time to customer messages
- [ ] Intent classification (property search, scheduling, support, other)
- [ ] Auto-response templates (20+ common scenarios)
- [ ] Escalation to human agent (Nadia) when needed
- [ ] Message history persistence (7-year retention)
- [ ] Sentiment analysis for support escalation

#### FR-1.2: Lead Pre-Qualification (Nina Bot)

- [ ] Qualification questionnaire (5-7 required fields)
- [ ] Budget range validation (AED, USD, EUR)
- [ ] Property type preference capture
- [ ] Location preference (neighborhoods, communities)
- [ ] Timeline capture (urgent, 1-3 months, 3-6 months, future)
- [ ] Contact information (phone, email, agent, family size)
- [ ] Lead score calculation (0-100 scale, 90+ = hot lead)
- [ ] Automated lead creation in Clara CRM

#### FR-1.3: Human Agent Escalation (Nadia)

- [ ] Smart agent assignment (least busy, language match)
- [ ] Real-time agent availability status
- [ ] Multi-agent number support (23+ agent WhatsApp profiles)
- [ ] Conversation context transfer (previous chat history)
- [ ] Agent performance metrics (response time, conversion)
- [ ] After-hours escalation routing

---

### FR-2: LEAD MANAGEMENT (Clara - Sales CRM)

**Priority**: CRITICAL
**Personas**: Clara (Lead Manager), Sales Agents, Zoe (Executive)

#### FR-2.1: Lead Lifecycle Management

- [ ] Lead creation from multiple sources (WhatsApp, website, email, phone)
- [ ] Lead status tracking (New, Contacted, Qualified, Viewing, Offered, Won, Lost)
- [ ] Lead source attribution (Nadia WhatsApp, Nina bot, marketing campaign, referral)
- [ ] Lead assignment to sales agent (auto or manual)
- [ ] Lead score updates based on activity (calls, emails, viewings, offers)
- [ ] Automatic hot lead flagging (score 90+)
- [ ] Lead dormancy tracking (8+ days no contact = alert)
- [ ] Lost lead reasons tracking (budget, location, timing, competing agent)

#### FR-2.2: Activity Tracking

- [ ] Call logging (date, time, duration, notes, outcome)
- [ ] Email tracking (sent, opened, replied)
- [ ] SMS/WhatsApp message logging
- [ ] Property viewing scheduling & confirmation
- [ ] Viewing outcomes (interested, not interested, renegotiate)
- [ ] Offer creation & tracking (offer amount, terms, dates)
- [ ] Offer response tracking (accepted, rejected, counter-offer)
- [ ] Task creation & completion (follow-up reminders)
- [ ] Activity timeline with audit trail

#### FR-2.3: Pipeline Management (Sophia integration)

- [ ] Visual deal pipeline (Kanban board)
- [ ] Multi-stage pipeline (New → Contacting → Viewing → Offering → Closing)
- [ ] Deal value tracking (proposed, agreed, closed)
- [ ] Time-in-stage metrics
- [ ] Agent forecast submission (monthly)
- [ ] Probability-weighted revenue forecast
- [ ] Pipeline reporting by agent, department, property type

#### FR-2.4: Lead Intelligence

- [ ] Automatic property recommendations (AI matching)
- [ ] Lead duplicate detection (same phone/email)
- [ ] Lead enrichment (company, title, LinkedIn profile)
- [ ] Competitor tracking (leads lost to competitor)
- [ ] Market intelligence by neighborhood
- [ ] Lead trend analysis (peak inquiry times, seasonal patterns)

---

### FR-3: PROPERTY INVENTORY MANAGEMENT (Mary)

**Priority**: CRITICAL
**Personas**: Mary (Inventory Manager), Sales Agents, Marketing, Customers

#### FR-3.1: Property CRUD Operations

- [ ] Create property listing (50+ fields: address, price, size, beds, baths, amenities)
- [ ] Bulk import (Excel, CSV with 9,378+ existing records)
- [ ] Property status tracking (Available, Reserved, Sold, Rented, Archived)
- [ ] Multi-unit complex management (single complex, 100+ individual units)
- [ ] Neighborhood & community tagging
- [ ] Regulatory compliance fields (RERA, DLD verification)
- [ ] Property history tracking (price changes, ownership)
- [ ] SOP compliance (all 50 fields must follow business rules)

#### FR-3.2: Media Management

- [ ] Photo upload & organization (multiple photos per property)
- [ ] Video hosting (30-60 second property video)
- [ ] 3D virtual tour integration (Matterport/similar)
- [ ] Floor plan upload & display
- [ ] 360° panoramic photo support
- [ ] Media quality standards (min 1080p, optimized for web)
- [ ] Watermark application to prevent misuse
- [ ] Media copyright tracking

#### FR-3.3: Search & Filtering

- [ ] Advanced search (location, price range, size, beds, property type)
- [ ] Map-based search (show properties on Dubai district map)
- [ ] Favorites/Wishlist functionality
- [ ] Save search criteria for alerts
- [ ] Price comparison by neighborhood
- [ ] Recently added properties carousel
- [ ] Featured properties section
- [ ] Search suggestion autocomplete

#### FR-3.4: Data Quality & Import/Export

- [ ] Data validation on all new/updated properties
- [ ] Excel template for bulk import
- [ ] Duplicate detection (same address, unit number)
- [ ] Data audit trail (who changed what, when)
- [ ] Rera/DLD compliance auto-check
- [ ] Export properties to Excel (with all fields)
- [ ] CSV import for partner integrations
- [ ] Data reconciliation reports

**Implementation Progress Snapshot (May 2026):**

- [x] Smart import route validation hardening in place (sheetName/dryRun/strategy/mapping/cluster payload guards)
- [x] Required mapping coverage enforcement (`ownerName`, `area`, `pNumber`) with token normalization support
- [x] Error contract normalization for missing worksheet/file and unsupported upload formats (400-class responses)
- [x] Upload safeguards validated (missing file, unsupported extension, oversize file)
- [x] Import execution resilience expanded (invalid rows handling, dedup strategy fallback, placeholder normalization)
- [x] Import history/report routes standardized with ownership checks and strict pagination/format validation
- [x] Focused backend regression coverage expanded and stabilized for import routes/services

---

### FR-4: SALES COMMISSION MANAGEMENT (Theodora)

**Status**: ACTIVE (Implemented + expanding)
**Reason**: Commission workflows are core to White Caves CRM finance operations and already integrated in Theodora module and API stack.

**Current Scope (Canonical):**

- Commission lifecycle: pending -> approved/rejected -> paid
- Manager/owner approval controls
- Finance/owner payment controls
- Agent visibility for own commission statements
- Monthly/periodic commission summaries in reporting stack

**Canonical API Namespace:**

- Primary: `/api/commissions`
- Legacy compatibility routes may exist under finance namespace and should be documented as aliases only.

---

### FR-5: LEASING & TENANT MANAGEMENT (Daisy)

**Priority**: HIGH
**Personas**: Daisy (Leasing Manager), Property Owners, Tenants

#### FR-5.1: Lease Management

- [ ] Lease agreement generation (template-based, RERA-compliant)
- [ ] Ejari registration assistance (UAE law requirement)
- [ ] Lease term tracking (start, end, renewal dates)
- [ ] Lease modification requests (rent changes, amendments)
- [ ] Property condition checklist (move-in, move-out)
- [ ] Maintenance responsibility tracking by clause
- [ ] Automatic renewal reminders (90 days before expiry)
- [ ] Archive of completed leases

#### FR-5.2: Tenant Application & Approval

- [ ] Online tenant application form
- [ ] Required document collection (ID, income, credit check, references)
- [ ] Application workflow (submitted, under review, approved, rejected)
- [ ] Approval notification to applicant
- [ ] Tenant background check integration
- [ ] Guarantee/security deposit tracking
- [ ] Insurance requirement tracking

#### FR-5.3: Rent Collection & Tracking

- [ ] Monthly rent due notice (automatic WhatsApp)
- [ ] Online payment link provision (Theodora integration)
- [ ] Payment acknowledgment (auto-email/SMS)
- [ ] Late payment escalation (day 10, 15, 25, 30)
- [ ] Partial payment tracking & plans
- [ ] Rent collection history (12+ month view)
- [ ] Overdue rent reporting
- [ ] Annual rent adjustment tracking

#### FR-5.4: Maintenance & Tenant Communication

- [ ] Maintenance request submission (WhatsApp/app)
- [ ] Request triage & priority assignment
- [ ] Maintenance contractor assignment
- [ ] Work order tracking & completion confirmation
- [ ] Post-repair tenant satisfaction survey
- [ ] Maintenance cost tracking & landlord reporting
- [ ] 24/7 emergency contact availability
- [ ] Tenant communication portal (announcements, notices)

---

### FR-6: FINANCIAL MANAGEMENT & PAYMENTS (Theodora)

**Priority**: CRITICAL
**Personas**: Theodora (Finance), Agents, Property Owners, Tenants

#### FR-6.1: Payment Processing

- [ ] Online payment gateway (Stripe, 2Checkout, local AED options)
- [ ] Multi-currency support (AED, USD, EUR minimum)
- [ ] Agent commission payments (monthly automated transfers)
- [ ] Rent collection from tenants (scheduled/on-demand)
- [ ] Buyer/seller payment escrow accounts
- [ ] Payment receipt generation (PDF, email)
- [ ] Payment reconciliation (bank statement matching)
- [ ] Chargeback handling & fraud prevention

#### FR-6.2: Commission Calculation

- [ ] Configurable commission structure (% of sale price, fixed, tiered)
- [ ] Multi-agent commission splits (co-agent rules)
- [ ] Commission dispute resolution
- [ ] Commission override for special deals
- [ ] Commission reporting by agent (monthly statement)
- [ ] Commission tax documentation (for freelancer/contractor agents)
- [ ] Year-end commission summary

#### FR-6.3: Financial Reporting

- [ ] Monthly P&L statement (revenue, costs, profit)
- [ ] Cash flow reporting (daily, weekly, monthly)
- [ ] Revenue by department/source
- [ ] Agent productivity (revenue per agent)
- [ ] Property performance (profit margin, occupancy rate)
- [ ] Board-level executive summary
- [ ] Quarterly & annual financial close

#### FR-6.4: Compliance & AML

- [ ] KYC verification for high-value transactions (>AED 5M)
- [ ] AML screening (customer name checks)
- [ ] Transaction reporting for suspicious activity (>AED 5M)
- [ ] Compliance audit trail (immutable records)
- [ ] Regulatory reporting (CBU, DFSA, local authorities)
- [ ] Document retention policies (7-year archives)

---

### FR-7: MARKETING & LEAD GENERATION (Olivia)

**Priority**: HIGH
**Personas**: Olivia (Marketing), Clara (CRM)

#### FR-7.1: Campaign Management

- [ ] Campaign creation & scheduling (email, social, SMS, WhatsApp)
- [ ] Campaign audience segmentation (by property type, location, price range)
- [ ] A/B testing (subject lines, messaging, timing)
- [ ] Campaign calendar (visual timeline)
- [ ] Competitor analysis & benchmarking
- [ ] Lead source attribution
- [ ] Campaign ROI tracking
- [ ] Budget allocation & tracking

#### FR-7.2: Digital Marketing Channels

- [ ] Email marketing (newsletters, property alerts, drip campaigns)
- [ ] Social media management (Facebook, Instagram, LinkedIn, TikTok posting)
- [ ] WhatsApp broadcast campaigns (to opted-in customers)
- [ ] SMS campaigns (for mobile-first audience)
- [ ] Paid ads (Google Ads, Facebook Ads, real estate portals)
- [ ] Website SEO optimization (property listing for search visibility)
- [ ] Property lead magnets (guides, checklists, calculators)

#### FR-7.3: Analytics & Optimization

- [ ] Lead generation volume by source
- [ ] Cost per lead by channel
- [ ] Conversion rate by campaign
- [ ] Marketing-influenced revenue attribution
- [ ] Customer acquisition cost (CAC) tracking
- [ ] Return on ad spend (ROAS) calculation
- [ ] Seasonal trend analysis
- [ ] Monthly marketing performance dashboard

---

### FR-8: COMPLIANCE & REGULATORY (Laila)

**Priority**: CRITICAL
**Personas**: Laila (Compliance Officer), Legal

#### FR-8.1: RERA/DLD Compliance

- [ ] RERA license verification for all agents
- [ ] DLD project registration verification
- [ ] Off-plan property compliance tracking
- [ ] Escrow account regulatory compliance
- [ ] RERA dispute resolution support
- [ ] RERA reporting requirements (if applicable)

#### FR-8.2: KYC/Anti-Money Laundering

- [ ] KYC questionnaire (name, ID, source of funds, beneficial owner)
- [ ] ID verification (passport, visa, national ID)
- [ ] Sanctions list screening (OFAC, UN, local lists)
- [ ] PEP (Politically Exposed Person) screening
- [ ] Transaction monitoring (>AED 5M flag)
- [ ] Escalation procedures for red flags
- [ ] Training documentation (staff KYC/AML certification)

#### FR-8.3: Contract & Legal Compliance

- [ ] Contract template management (sale, lease, services)
- [ ] Contract approval workflow (agent → manager → legal → customer)
- [ ] Electronic signature support (digital contracts)
- [ ] Contract version control (amendment tracking)
- [ ] Legal review trail (who approved, when, comments)
- [ ] Insurance verification (agency liability, professional indemnity)

#### FR-8.4: Data Privacy & Security

- [ ] GDPR compliance (customer data privacy)
- [ ] Data retention policies (what data, how long)
- [ ] Customer right-to-be-forgotten implementation
- [ ] Data breach notification procedures
- [ ] Vendor data processing agreements
- [ ] Staff confidentiality agreements
- [ ] Customer consent tracking (marketing, data processing)

---

### FR-9: EXECUTIVE DASHBOARD & REPORTING (Zoe)

**Priority**: HIGH
**Personas**: Zoe (Executive), C-Suite, Investors

#### FR-9.1: Real-Time KPI Dashboard

- [ ] Sales pipeline value (current, forecast)
- [ ] Monthly sales volume (AED, units)
- [ ] Lead generation volume (source attribution)
- [ ] Lead conversion rate (inquiry → viewing → offer → close)
- [ ] Average transaction value (by property type, agent, location)
- [ ] Agent productivity ranking (revenue, deals, customer satisfaction)
- [ ] Customer satisfaction scores
- [ ] Market share by neighborhood
- [ ] Live operational alerts (dormant leads, overdue rents, compliance flags)

#### FR-9.2: Financial Dashboard

- [ ] Monthly revenue (projected, actual)
- [ ] Gross profit by department
- [ ] Cost per lead (by channel)
- [ ] Marketing ROI
- [ ] Agent commission payouts
- [ ] Cash flow status
- [ ] Accounts receivable aging
- [ ] Quarterly & annual budgets vs actual

#### FR-9.3: Strategic Reporting

- [ ] Trending analysis (6-month, yearly trends)
- [ ] Competitor intelligence (market share, pricing, agent count)
- [ ] Market condition insights (Dubai real estate trends)
- [ ] Risk alerts (compliance, financial, operational)
- [ ] Board-level executive summary
- [ ] Investor metrics & reporting
- [ ] Strategic initiative tracking (quarters, months)

#### FR-9.4: Custom Reporting

- [ ] Report builder (ad-hoc queries)
- [ ] Scheduled reports (daily, weekly, monthly email)
- [ ] Export to PDF, Excel, PowerPoint
- [ ] Visualization options (charts, graphs, tables)
- [ ] Drill-down capabilities (dive into details)
- [ ] Comparative analysis (month-over-month, year-over-year)

---

## 🔐 NON-FUNCTIONAL REQUIREMENTS

### NFR-1: PERFORMANCE

- [ ] Page load time: <2 seconds (95th percentile)
- [ ] API response time: <200ms (95th percentile)
- [ ] Database query time: <100ms (95th percentile)
- [ ] Concurrent users supported: 500+ simultaneous
- [ ] Mobile responsiveness: 100% of features on mobile (iOS, Android)
- [ ] Search results: <500ms for any search
- [ ] Report generation: <30 seconds for standard reports

### NFR-2: SCALABILITY

- [ ] Support 9,378+ properties without performance degradation
- [ ] Support 200+ sales agents simultaneously
- [ ] Support 1,500+ leads processed per month
- [ ] Support $50M+ annual transaction volume
- [ ] Database growth: 100GB+ data capacity
- [ ] Real-time updates (WebSocket for dashboards)
- [ ] Load balancing for high traffic periods

### NFR-3: SECURITY

- [ ] Data encryption at rest (AES-256)
- [ ] HTTPS/TLS encryption in transit
- [ ] Role-based access control (RBAC)
- [ ] Two-factor authentication (2FA) for sensitive actions
- [ ] Session timeout (30 minutes inactivity)
- [ ] Password requirements (12+ chars, complexity)
- [ ] API rate limiting (prevent abuse)
- [ ] Audit logging (all actions tracked)
- [ ] Penetration testing (annual, pre-launch)
- [ ] SOC 2 Type II compliance (future)

### NFR-4: AVAILABILITY & DISASTER RECOVERY

- [ ] 99.9% uptime SLA (30 minutes downtime/month max)
- [ ] Automated daily backups (offsite)
- [ ] Recovery time objective (RTO): <1 hour
- [ ] Recovery point objective (RPO): <1 hour
- [ ] Redundancy: Multi-region deployment (local + cloud)
- [ ] Load balancing (auto-failover)
- [ ] Disaster recovery testing (quarterly)

### NFR-5: COMPLIANCE & AUDIT

- [ ] GDPR compliance (customer data privacy)
- [ ] RERA compliance (UAE real estate)
- [ ] DLD compliance (Dubai Land Department)
- [ ] AML/OFAC compliance (financial)
- [ ] PCI-DSS compliance (payment processing)
- [ ] Audit logging (7-year retention)
- [ ] Compliance certifications (SOC 2, ISO 27001 target)

### NFR-6: USABILITY

- [ ] Intuitive UI (minimal training required)
- [ ] Accessibility (WCAG 2.1 AA compliance)
- [ ] Multi-language support (Arabic/English)
- [ ] Mobile-first design
- [ ] Customizable dashboards (user preference)
- [ ] Keyboard navigation (power users)
- [ ] Help documentation (in-app + knowledge base)
- [ ] API documentation (developer guide)

### NFR-7: INTEGRATION & EXTENSIBILITY

- [ ] WhatsApp Business API integration
- [ ] Payment gateway integration (3+ providers)
- [ ] Email integration (Gmail, Outlook)
- [ ] Calendar integration (Google, Outlook)
- [ ] SMS gateway integration
- [ ] CRM export (multiple formats)
- [ ] Custom API endpoints (partner integrations)
- [ ] Webhook support (event notifications)
- [ ] Third-party authentication (SSO, OAuth)

---

## 📊 DATA & ARCHITECTURE REQUIREMENTS

### DR-1: DATA MODELS

- **Lead**: 30+ fields (contact, scoring, activity, financials)
- **Property**: 50+ fields (details, media, regulatory, statistics)
- **Agent**: 25+ fields (profile, performance, commission, licenses)
- **Tenant**: 20+ fields (contact, lease, payment, compliance)
- **Transaction**: 40+ fields (parties, pricing, timeline, escrow)
- **Activity**: 15+ fields (type, timestamp, notes, outcome)
- **User**: 20+ fields (account, permissions, preferences, audit)

### DR-2: API ENDPOINTS (Expected: 80+ endpoints)

- Leads API: CRUD, search, bulk operations, scoring
- Properties API: CRUD, search, media, availability
- Agents API: CRUD, performance, commission
- Tenants API: CRUD, leases, payments, maintenance
- Transactions API: CRUD, escrow, reporting
- Financial API: Payments, reconciliation, reporting
- Communications API: WhatsApp, email, SMS
- Reporting API: KPIs, custom reports, exports
- Admin API: User management, system settings

### DR-3: TECHNOLOGY STACK

- **Frontend**: React 18, TypeScript, Redux Toolkit, Styled-components
- **Backend**: Node.js/Express 5, TypeScript
- **Database**: MongoDB (primary), SQL backup option
- **ORM**: Prisma 6.6
- **Authentication**: JWT + 2FA
- **Payment**: Stripe/2Checkout API integration
- **WhatsApp**: Twilio/WhatsApp Business API
- **SMS**: Twilio or local provider
- **Email**: SendGrid/SMTP
- **Cloud**: AWS or Azure (scalability)
- **Hosting**: Docker containerization, CI/CD pipeline
- **Testing**: Vitest, Playwright, Jest
- **Monitoring**: Application Performance Monitoring (APM)

---

## ✅ ACCEPTANCE CRITERIA

### MUST HAVE (Phase 0.2-1)

- [x] WhatsApp-first customer engagement (24/7 bot + human escalation)
- [x] Full lead lifecycle management
- [x] Property inventory management (9,378+ properties)
- [x] Sales pipeline visibility
- [x] Agent information management
- [x] Basic financial management (payment processing)
- [x] Mobile responsiveness
- [x] User authentication & roles

### SHOULD HAVE (Phase 1-2)

- [ ] Advanced leasing & tenant management
- [ ] Marketing campaign management
- [ ] Comprehensive financial reporting
- [ ] AI-powered property recommendations
- [ ] Predictive analytics for sales forecasting
- [ ] Multi-language support (Arabic/English)
- [ ] Advanced compliance features (KYC/AML)
- [ ] Executive dashboard with live KPIs

### NICE TO HAVE (Phase 2+)

- [ ] Virtual property tours (3D/VR)
- [ ] Mobile app (iOS/Android native)
- [ ] Video conferencing integration
- [ ] AI chatbot training (customer service automation)
- [ ] Machine learning (predictive pricing, lead scoring)
- [ ] Advanced analytics (clustering, segmentation)
- [ ] Multi-property portfolio management
- [ ] Tenant portal (self-service)

---

## 📅 IMPLEMENTATION ROADMAP

| Phase     | Timeline        | Scope                                              |
| --------- | --------------- | -------------------------------------------------- |
| Phase 0.2 | Jan 26 - Feb 15 | Business documentation, data models                |
| Phase 1   | Feb 16 - Mar 31 | Core features (leads, properties, agents)          |
| Phase 2   | Apr 1 - May 31  | Advanced features (leasing, compliance, reporting) |
| Phase 3   | Jun 1+          | AI/ML, optimization, mobile app                    |

---

## 🎯 SUCCESS METRICS

| Metric                | Target           | Owner                |
| --------------------- | ---------------- | -------------------- |
| System uptime         | 99.9%            | Aurora (CTO)         |
| Page load time        | <2 sec           | Aurora (Performance) |
| Lead conversion rate  | 8%+              | Clara (Sales)        |
| Customer satisfaction | 4.5/5.0          | Zoe (Executive)      |
| Data accuracy         | 99%+             | Mary (Inventory)     |
| Compliance violations | 0                | Laila (Compliance)   |
| Agent productivity    | $500K/agent/year | HR (Nancy)           |
