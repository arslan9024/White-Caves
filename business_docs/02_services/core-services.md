# White Caves Services & Features

## Core CRM Services

### Lead Management (Clara Leads CRM)
- **Status**: ✅ Production Ready
- **Purpose**: Complete lead lifecycle management
- **Features**:
  - Lead creation from multiple channels (WhatsApp/Nadia, manual entry, imports)
  - Intelligent lead scoring (92-95 hot threshold)
  - Lead qualification & nurturing workflows
  - Activity timeline (calls, messages, viewings)
  - Conversion tracking (inquiry → viewing → offer → closed)
  - Automated lead routing to agents
  - Lead source attribution
- **Performance**: ~100 leads/month with 8% conversion rate
- **Integration Points**: Nadia (WhatsApp), Nina (Bot pre-qualification), Sophia (Pipeline)
- **Target Users**: Sales agents, Sales manager, Admin, Owner

### Sales Pipeline & Deal Management (Sophia Pipeline Manager)
- **Status**: ✅ Production Ready
- **Purpose**: Sales forecasting and deal tracking
- **Features**:
  - Pipeline visualization (stages: Lead → Viewing → Offer → Negotiations → Closed)
  - Deal value calculation & forecasting
  - Automated commission calculation
  - Deal assignment & routing
  - Milestone tracking & alerts
  - Sales forecasting & analytics
  - Revenue prediction
- **Integration Points**: Clara (Lead source), Theodora (Commission/Finance)
- **Target Users**: Sales agents, Sales manager, Executive (Zoe)

### Property Inventory Management (Mary Inventory CRM)
- **Status**: ✅ Production Ready
- **Purpose**: Property portfolio management and distribution
- **Features**:
  - Property CRUD operations (9,378+ units in DAMAC Hills 2)
  - Multi-media property uploads (photos, videos, 3D tours)
  - Property filtering & advanced search
  - Property availability tracking
  - Unit-level metadata management
  - Excel import/export
  - Real-time inventory updates
  - Market listing syndication (Bayut, Property Finder - future)
- **Data Accuracy**: Asset extraction via OCR
- **Integration Points**: Nadia (Lead property inquiry), Clara (Deal properties), Olivia (Marketing/Listings)
- **Target Users**: Operations, Sales agents, Marketing, Buyers/Sellers

### WhatsApp Communication Platform (Nadia WhatsApp CRM)
- **Status**: ✅ Production Ready
- **Purpose**: Customer engagement and lead capture via WhatsApp
- **Features**:
  - Multi-agent WhatsApp number management (23+ connected agents)
  - Conversation routing & assignment
  - Lead pre-qualification via Linda
  - Message templating & quick replies
  - Broadcast campaign management
  - Agent presence & status monitoring
  - Conversation history & analytics
  - 24/7 availability
- **Integration Points**: Nina (Bot escalation), Clara (Lead creation), Compliance (Message archiving)
- **Target Users**: Sales agents, Communications team, Customers
- **Regional Advantage**: Primary communication channel in UAE

### WhatsApp Automation Bot (Nina WhatsApp Bot)
- **Status**: ✅ Production Ready
- **Purpose**: 24/7 automated customer engagement and pre-qualification
- **Features**:
  - Automated property inquiry responses
  - Viewing appointment scheduling
  - Qualification questionnaire
  - Multi-language support (Arabic/English)
  - Session management
  - NLP-based intent classification
  - Escalation to Nadia (human agents)
  - Automation analytics
- **KPIs**: 24/7 uptime, Sub-5 minute response time, 70%+ automated resolution
- **Integration Points**: Nadia (Agent escalation), Clara (Pre-qualified leads)
- **Target Users**: Customers (24/7 availability)

## Operational Services

### Property Leasing & Tenant Management (Daisy Leasing CRM)
- **Status**: ✅ Production Ready
- **Purpose**: Rental property and tenant lifecycle management
- **Features**:
  - Property listing for rental
  - Tenant application & approval workflow
  - Lease creation & management (e.g., Ejari registration)
  - Rent tracking & collection
  - Maintenance request management & coordination
  - Tenant communications
  - Lease renewal management
  - Rental analytics & reports
- **Integration Points**: Mary (Property inventory), Theodora (Rent finance), Sentinel (Maintenance alerts)
- **Target Users**: Landlords, Leasing agents, Tenants

### HR & Employee Management (Nancy HR CRM)
- **Status**: ✅ Production Ready
- **Purpose**: Employee lifecycle and recruitment management
- **Features**:
  - Employee records & profiles
  - Recruitment & applicant tracking
  - Performance management
  - Attendance & leave tracking
  - Payroll integration
  - Team collaboration tools
  - Employee onboarding workflows
- **Integration Points**: All departments (reporting)
- **Target Users**: HR manager, Admin, All employees

## Financial Services

### Financial Management & Payments (Theodora Finance)
- **Status**: ✅ Production Ready
- **Purpose**: Financial operations and payment tracking
- **Features**:
  - Invoice generation & management
  - Payment processing & tracking
  - Commission calculation & disbursement
  - Escrow account management
  - Financial reporting & analysis
  - Budget management & forecasting
  - Payment reconciliation
  - Multi-currency support (AED, USD, EUR)
- **Integration Points**: Sophia (Commission calculation), Daisy (Rent payments), Compliance (AML)
- **Target Users**: Finance manager, Sales agents (commission tracking), Owner, Landlords

### Compliance & Regulatory Management (Laila Compliance)
- **Status**: ✅ Production Ready
- **Purpose**: Regulatory compliance and risk management
- **Features**:
  - RERA compliance checking & documentation
  - KYC/AML verification
  - Contract review & approval workflow
  - Audit trail & logging
  - Compliance reporting
  - Document archiving
  - Risk assessment
- **Regulations Covered**: 
  - RERA (Real Estate Regulatory Agency - Dubai)
  - DLD (Dubai Land Department)
  - AML (Anti-Money Laundering)
  - GDPR (Data Protection)
- **Integration Points**: Clara (Lead KYC), Theodora (Payment AML), Legal (Contracts)
- **Target Users**: Compliance officer, Admin, Legal team

## Analytics & Intelligence Services

### Business Intelligence & Reporting (Zoe Executive Assistant)
- **Status**: ✅ Production Ready
- **Purpose**: Executive support and business intelligence
- **Features**:
  - Executive dashboard with KPIs
  - Real-time business metrics
  - Department performance tracking
  - Sales forecasting & trend analysis
  - Market intelligence & competitive analysis
  - Custom report generation
  - Data-driven insights & recommendations
  - Cross-departmental analytics
- **Data Sources**: All CRM systems (Clara, Mary, Nadia, etc.)
- **Integration Points**: All departments
- **Target Users**: MD/Owner, Executive team

### Market Intelligence & Sensor Monitoring (Sentinel)
- **Status**: ✅ In Development
- **Purpose**: Market trends and property condition monitoring
- **Features**:
  - Real-time Dubai property market analysis
  - Price trend forecasting
  - Competitor monitoring
  - IoT property condition sensors
  - Maintenance alerts & predictions
  - Market opportunity identification
  - Property valuation models
- **Integration Points**: Mary (Inventory), Daisy (Maintenance), Zoe (Reporting)
- **Target Users**: Executive, Marketing, Operations

## Public-Facing Services

### Property Search & Discovery
- **Status**: ✅ Production Ready
- **Purpose**: Public property browsing for buyers/investors
- **Features**:
  - Advanced property search filters
  - Map-based property discovery
  - Virtual tours (2D/3D)
  - Street view integration
  - Property comparison tools
  - Saved favorites & search alerts
  - Property details & amenities
- **Target Users**: Buyers, Investors, Tenants

### Buyer Tools & Calculators
- **Status**: ✅ Production Ready
- **Purpose**: Financial planning tools for buyers
- **Features**:
  - Mortgage calculator
  - Affordability calculator
  - ROI calculator
  - Price per sqm comparison
  - Market research reports
  - Neighborhood analysis
- **Integration Points**: Mary (Property data), Sentinel (Market intelligence)
- **Target Users**: Buyers, Investors

### Seller Services
- **Status**: ✅ Production Ready
- **Purpose**: Property selling support
- **Features**:
  - List property for sale
  - Pricing tools & market comparables
  - Professional marketing support
  - Virtual tours & photography
  - Buyer inquiry management
  - Offer negotiation tracking
  - Performance analytics
- **Integration Points**: Mary (Inventory), Nadia (Inquiry capture), Clara (Deal management)
- **Target Users**: Property sellers, Property owners

---

## Service Pricing Tiers

### Lead Management (Clara Leads CRM)

| Tier | Price | Included Leads/Month | Features |
|------|-------|---------------------|---------|
| **Basic** | AED 500/month | Up to 100 active leads | Manual entry, basic scoring, WhatsApp integration |
| **Professional** | AED 1,500/month | Up to 500 active leads | AI scoring, automated routing, source attribution, analytics |
| **Enterprise** | AED 4,000/month | Unlimited | All Professional + custom scoring model, bulk import, API access, dedicated support |

### Property Inventory Management (Mary Inventory CRM)

| Tier | Price | Included Units | Features |
|------|-------|---------------|---------|
| **Starter** | AED 300/month | Up to 200 units | Manual CRUD, basic photos, simple search |
| **Growth** | AED 900/month | Up to 2,000 units | Multi-media, advanced filters, Excel import, portal sync (Bayut/PF) |
| **Enterprise** | AED 2,500/month | Unlimited | All Growth + OCR extraction, IoT integration, custom fields, API access |

### Leasing & Tenant Management (Daisy Leasing CRM)

| Tier | Price | Included Active Leases | Features |
|------|-------|----------------------|---------|
| **Basic** | AED 400/month | Up to 50 leases | Lease CRUD, basic tenant profiles, rent reminders |
| **Standard** | AED 1,200/month | Up to 300 leases | Full lifecycle, maintenance management, Ejari integration, renewal tracking |
| **Premium** | AED 3,000/month | Unlimited | All Standard + digital signing, tenant portal, automated invoicing, analytics |

### WhatsApp Platform (Nadia + Nina)

| Tier | Price | Included Agents/Numbers | Features |
|------|-------|------------------------|---------|
| **Basic** | AED 800/month | Up to 5 agent numbers | Shared inbox, manual routing, templates |
| **Team** | AED 2,000/month | Up to 15 agent numbers | Auto-routing, Nina bot, broadcast (500/day), analytics |
| **Enterprise** | AED 5,000/month | Unlimited numbers | All Team + priority routing, custom bot flows, 100K+ daily broadcast |

---

## Acceptance Criteria per Service

### Lead Management — Acceptance Criteria

| ID | Requirement | Acceptance Criterion | Test Method |
|----|-------------|---------------------|------------|
| LM-AC-001 | Lead capture from WhatsApp | Lead auto-created in Clara CRM within 60 seconds of WhatsApp inquiry | Automated E2E test: send WhatsApp message → verify lead in DB |
| LM-AC-002 | AI lead scoring | Lead score calculated within 10 seconds of creation; hot threshold ≥ 92 triggers immediate agent notification | Unit test: verify score algorithm; E2E: verify notification delivery |
| LM-AC-003 | Lead routing | Lead assigned to available agent within 5 minutes during business hours (Sun–Thu 9am–6pm) | E2E test: create lead → verify assignment timestamp |
| LM-AC-004 | Lead source attribution | 100% of leads have source field populated (WhatsApp / manual / import / portal) | Data quality test: query leads with null source = 0 |
| LM-AC-005 | KYC trigger | Leads where deal value > AED 55,000 must have KYC workflow initiated before deal progresses to "Offer" stage | Business rule test: create deal > 55K → verify KYC gate active |
| LM-AC-006 | Duplicate detection | System warns if phone number or email already exists in CRM before creating new lead | Unit test: submit duplicate phone → verify warning returned |
| LM-AC-007 | RERA compliance — Form A | System must not allow marketing a seller's property without RERA Form A being signed and uploaded | Validation test: create property listing without Form A → verify block |

### Sales Pipeline — Acceptance Criteria

| ID | Requirement | Acceptance Criterion | Test Method |
|----|-------------|---------------------|------------|
| SP-AC-001 | Deal stage transitions | All stage transitions (Lead → Viewing → Offer → Negotiation → Closed) log timestamp + agent ID in audit trail | DB audit log test per transition |
| SP-AC-002 | Commission calculation | Commission auto-calculated within 1 second of deal closure; formula: `dealValue × commissionRate / 100`; accurate to 2 decimal places in AED | Unit test: verify calculation against 10 test scenarios |
| SP-AC-003 | Deal above AED 5M flag | Deals with value > AED 5,000,000 automatically flagged for MD review; deal cannot close without MD approval | Business rule test: create deal AED 6M → verify MD approval gate |
| SP-AC-004 | Forecasting accuracy | Sales forecast deviation from actual ≤ ±15% over rolling 3-month period | Analytics test: backtest forecast against historical data |
| SP-AC-005 | Form B compliance | RERA Form B must be generated and uploaded before deal moves to "Offer Accepted" stage | Validation test: advance deal without Form B → verify block |

### Property Inventory — Acceptance Criteria

| ID | Requirement | Acceptance Criterion | Test Method |
|----|-------------|---------------------|------------|
| PI-AC-001 | Property search performance | Search API returns results in < 300ms at p95 under 100 concurrent users | Load test with k6: 100 VU, 5-minute duration |
| PI-AC-002 | Media upload | Property photos upload successfully for files ≤ 10MB (JPEG/PNG/WebP); videos ≤ 100MB (MP4) | Integration test: upload boundary-value files |
| PI-AC-003 | Inventory accuracy | Property availability status updated within 5 minutes of lease/sale status change | E2E test: mark unit as leased → verify status in inventory |
| PI-AC-004 | RERA permit before listing | Property cannot be set to `status: listed` without a valid RERA permit number in the record | Validation test: publish property without permit → verify 422 error |
| PI-AC-005 | Portal syndication | Listed properties appear on PropertyFinder / Bayut within 2 hours of status change to "listed" | Integration test: list property → verify portal API call in logs within 2h |
| PI-AC-006 | DLD ownership verification | System must verify property ownership via DLD API before allowing seller to list | Integration test: list with invalid title deed → verify DLD API rejection |

### WhatsApp Platform — Acceptance Criteria

| ID | Requirement | Acceptance Criterion | Test Method |
|----|-------------|---------------------|------------|
| WA-AC-001 | Message routing speed | Incoming customer message routed to available agent in < 5 seconds during business hours | Load test: 50 concurrent messages → measure routing time |
| WA-AC-002 | Bot auto-resolution rate | Nina bot resolves ≥ 70% of property inquiries without human escalation | A/B monitoring: track escalation rate over 30-day period |
| WA-AC-003 | Message delivery confirmation | Sent messages achieve ≥ 98% delivery rate (WhatsApp delivered status) | Dashboard metric: delivery rate tracked weekly |
| WA-AC-004 | Meta template compliance | All broadcast templates approved by Meta before use; no unapproved templates sent | Compliance test: attempt to send unapproved template → verify block |
| WA-AC-005 | Message archive | All WhatsApp conversations archived in CRM with searchable text; retention 2 years | Data test: verify conversation stored in DB within 30 seconds of sending |
| WA-AC-006 | 24-hour window enforcement | System must not send free-form messages to customers who have not messaged in past 24 hours; template required | Business rule test: attempt free-form to 25h+ silent contact → verify template enforcement |

### Leasing & Tenancy — Acceptance Criteria

| ID | Requirement | Acceptance Criterion | Test Method |
|----|-------------|---------------------|------------|
| LA-AC-001 | Ejari registration | Ejari registration submitted to DLD API within 30 days of tenancy contract signing; system alerts at 25 days | E2E test: sign lease → verify Ejari API call with timestamp |
| LA-AC-002 | Rent due reminders | Automated WhatsApp + email reminder sent to tenant 5 days before rent due date | E2E test: create lease with upcoming rent → verify notification at T-5 |
| LA-AC-003 | Lease renewal workflow | Renewal offer generated 90 days before lease expiry; agent and landlord notified; RERA rental index consulted | Integration test: create lease expiring in 91 days → verify renewal alert |
| LA-AC-004 | Maintenance SLA | Maintenance ticket P1 (emergency) acknowledged within 4 hours, P2 within 24 hours, P3 within 72 hours | SLA test: create tickets of each priority → verify acknowledgment timestamps |
| LA-AC-005 | RERA rental increase cap | System must not allow rent increase above RERA rental index cap for the property area; auto-calculates allowed % | Validation test: submit 15% increase for area capped at 10% → verify rejection |
| LA-AC-006 | Tenancy contract generation | Standard tenancy contract PDF generated within 30 seconds; includes all RERA-mandatory fields | Performance test: generate 10 contracts simultaneously → verify < 30s |

### Finance & Compliance — Acceptance Criteria

| ID | Requirement | Acceptance Criterion | Test Method |
|----|-------------|---------------------|------------|
| FIN-AC-001 | Commission accuracy | Commission calculations are 100% accurate; verified by Finance before disbursement; no rounding error > AED 1 | Unit test: 50 test commission scenarios vs manual calculation |
| FIN-AC-002 | VAT on invoices | All invoices include correct VAT (5% on commercial services; 0% on exempt residential rent); TRN displayed | Invoice generation test: verify VAT field per transaction type |
| FIN-AC-003 | AML threshold alert | Transaction above AED 55,000 in cash triggers AML review workflow; Compliance Officer notified | Business rule test: record cash payment AED 60K → verify alert |
| FIN-AC-004 | Audit trail immutability | No record in audit log collection can be updated or deleted after creation; append-only enforced at DB level | DB constraint test: attempt updateOne/deleteOne on audit_log → verify rejection |
| FIN-AC-005 | KYC completion gate | Deal cannot advance beyond "Offer Accepted" stage until KYC for all parties (buyer + seller) is complete and approved | E2E test: advance deal with pending KYC → verify gate block |

---

## Dubai Market Positioning vs Competitors

### Competitive Landscape

| Competitor | Market Position | Key Strength | White Caves Advantage |
|------------|----------------|-------------|----------------------|
| **Betterhomes** | Established mid-market broker (25+ years) | Brand recognition; large agent network (300+ agents) | AI-powered CRM; WhatsApp-first; faster response time; DAMAC Hills 2 specialist |
| **Allsopp & Allsopp** | Premium residential broker | Strong British expat following; mortgage partnerships | Arabic-English AI bots; investor-focused tools; lower commission entry points |
| **Haus & Haus** | Boutique luxury broker | Social media-driven; modern brand aesthetic | Technology platform depth; automated Ejari/DLD; investor ROI tools |
| **Hamptons Dubai** | High-end international brand | International buyer network; Colliers partnership | Hyperlocal DAMAC Hills 2 expertise; AI lead scoring; WhatsApp broadcast scale |
| **Patriot Real Estate** | Mid-market DAMAC specialist | DAMAC relationship; bulk unit access | Broader AI capability; tenant portal; facility management bundle |
| **Provident Estate** | Large volume broker | High listing volume; PropertyFinder dominance | Superior CRM automation; commission transparency; tenant management |

### White Caves Unique Value Proposition (UVP)

| Differentiator | Description | Market Claim |
|----------------|-------------|-------------|
| **AI-First CRM** | 16 AI assistants across all departments; no human required for lead routing, Ejari prep, or report generation | "The most intelligent CRM in Dubai real estate" |
| **WhatsApp-Native** | Nina bot + Nadia CRM built for UAE's primary channel; 23+ agent numbers; 100K+ daily capacity | "Fastest response in the market — under 5 minutes, 24/7" |
| **DAMAC Hills 2 Specialist** | 9,378+ unit inventory; deeper pricing intelligence in this community than any competitor | "Dubai's largest single-community inventory manager" |
| **Transparent Commissions** | Real-time commission tracking visible to agents; no disputes; automated calculation | "Zero commission disputes — guaranteed" |
| **End-to-End Compliance** | RERA, Ejari, DLD, KYC, AML, PDPL all handled in one platform | "RERA-compliant by design — not by checklist" |
| **Investor ROI Tools** | Gross/net yield calculator, market index, portfolio dashboard | "Know your returns before you buy" |

### Pricing vs Market Benchmarks

| Service | White Caves Rate | Market Standard (Dubai) | Premium/Discount |
|---------|-----------------|------------------------|-----------------|
| Sales brokerage commission | 2% of sale price | 2% (standard) | Market rate |
| Leasing fee (new tenancy) | 5% of annual rent | 5% (RERA standard) | Market rate |
| Lease renewal commission | 2.5% of annual rent | 2–5% | Competitive |
| Property management fee | 5–8% of collected rent | 5–10% | Competitive |
| Valuation — residential | AED 2,500–5,000 | AED 2,000–6,000 | Mid-range |
| Valuation — commercial | AED 5,000–15,000 | AED 5,000–20,000 | Competitive |

---

## RERA-Required Service Standards

### Mandatory RERA Compliance per Service Line

| Service | RERA Requirement | Regulatory Basis | System Enforcement |
|---------|-----------------|------------------|--------------------|
| **Sales Brokerage** | Form A (seller authorization) before listing; Form B (buyer authorization) before submitting offer; licensed RERA broker to conduct all transactions | Dubai Law 85/2006 Art. 15; RERA Admin Resolution | System blocks listing without Form A; blocks offer without Form B; blocks transaction if agent BRN expired |
| **Leasing** | Ejari registration within 30 days of tenancy contract signing; RERA-compliant tenancy contract template; rental index compliance for renewals | Dubai Law 26/2007 (Landlord-Tenant Law); RERA Executive Circular | System alerts at 25 days if Ejari not filed; rental increase capped per RERA index per area |
| **Off-Plan Sales** | Oqood registration with DLD within 60 days of SPA signing; funds into RERA-approved escrow account; developer RERA-registered | Dubai Law 8/2007 (Escrow); RERA Resolution 6/2010 | System enforces Oqood deadline tracker; escrow account field mandatory before off-plan deal can close |
| **Property Management** | Property manager must hold RERA property manager license (separate from broker license); written management agreement | RERA Standard Management Agreement | Compliance module validates PM license; management agreement template enforced |
| **Advertising Standards** | Property listings must include: RERA permit number, accurate price, property status, agent BRN, company ORN | RERA Advertising Regulations Circular 2023 | System validates all required fields before property can be set to `listed` status |
| **KYC/AML** | Customer Due Diligence for all clients; Enhanced Due Diligence for PEPs, cash transactions > AED 55,000; SAR via goAML | UAE AML Law 20/2019; Ministerial Resolution 45/2022 | KYC workflow mandatory before deal closure; PEP screening automated; SAR workflow in compliance module |
| **Data Handling** | Client data must be stored per UAE PDPL; consent obtained; 7-year retention for AML records | UAE PDPL Federal DL 45/2021; CBUAE AML Standards | Consent checkbox at lead creation; data retention policies automated in DB; PDPL breach notification workflow |

### RERA Fee Schedule (2026)

| Fee Type | Amount (AED) | Payable To | When |
|----------|-------------|------------|------|
| Broker license annual renewal | 3,020 | RERA / DLD | Annual (before December 31) |
| Agent BRN annual renewal | 1,560 | RERA | Annual (per agent) |
| RERA training course (mandatory) | 500–2,000 | RERA-approved training provider | Before BRN issuance/renewal |
| Ejari registration fee | 220 + 10 knowledge fee = 230 | DLD | Per tenancy registration |
| DLD property transfer fee | 4% of sale price | DLD | Per sale transaction |
| DLD title deed issuance | 250 | DLD | Per title deed |
| Oqood registration (off-plan) | 4% of sale price | DLD | Per off-plan sale |
| NOC from developer | AED 500–5,000 | Developer | Per resale (varies by developer) |

---

## Future Enhancements (Planned)

- **Fractional Ownership Platform**: Enable tokenization & fractional buying
- **International Buyer Support**: Multi-language, multi-currency, global compliance
- **Bayut & Property Finder Integration**: Automatic listing syndication
- **Predictive Pricing Engine**: AI-powered property valuation
- **Smart Contracts**: Blockchain-based lease & sale agreements
- **Video Escrow**: Secure document management & signing
