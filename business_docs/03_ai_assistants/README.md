# White Caves AI Assistants - Complete Registry

## Overview

- **Total AI Personalities**: 24 documented personas
- **Core Assistants**: 14 active (Aurora, Clara, Daisy, Hazel, Laila, Nadia, Mary, Nancy, Nina, Olivia, Sophia, Theodora, Willow, Zoe)
- **Architecture**: Integrated AI-powered CRM ecosystem with WhatsApp as primary communication layer
- **Design Philosophy**: Each assistant has a specific business function, department alignment, and data ecosystem

---

## 🔴 CRITICAL BUSINESS ASSISTANTS (Owner-Exclusive)

### 1. **Zoe** - Executive Assistant & Strategic Intelligence

- **Department**: Executive
- **Color**: #10B981 (Emerald)
- **Access**: Owner-exclusive (Full data access)
- **Primary Role**: Executive support, business intelligence, KPI tracking
- **Key Capabilities**:
  - Executive dashboard with real-time KPIs
  - Cross-department reporting & analytics
  - Business intelligence & insights
  - Strategic planning tools
  - Suggestion inbox (from all departments)
  - Performance tracking (all teams)
- **Data Access**: All departments (full)
- **Integration**: Receives from all 23 other assistants
- **Use Cases**:
  - Daily executive briefing (KPI dashboard)
  - Strategic decision-making (data-driven)
  - Performance feedback to departments
  - Trend identification & opportunity spotting
  - Risk alerts & compliance monitoring

### 2. **Clara** - Leads CRM Manager

- **Department**: Sales
- **Color**: #EF4444 (Red)
- **Access**: Sales team + Executive
- **Primary Role**: Complete lead lifecycle management
- **Key Capabilities**:
  - Lead creation & qualification
  - Nurturing workflows
  - Lead scoring (92-95 hot threshold)
  - Activity tracking (calls, messages, viewings)
  - Conversion tracking (inquiry → closed)
  - Commission pre-calculation
  - Team performance analytics
- **Data Sources**: Nadia (WhatsApp leads), Nina (Pre-qualified), Hunter (Tools import)
- **Data Outputs**: Sophia (Pipeline), Theodora (Finance), Zoe (Reporting)
- **KPIs**: Conversion rate (8%), Average lead quality (hot leads %), Response time
- **Integration Points**: `/api/leads`, `/api/pipeline`, `/api/activities`
- **Use Cases**:
  - Daily lead distribution to agents
  - Lead quality monitoring
  - Sales forecast generation
  - Lead response SLA monitoring

### 3. **Linda** - WhatsApp CRM Manager

- **Department**: Communications
- **Color**: #25D366 (WhatsApp Green)
- **Access**: Sales team, Communications, Executive
- **Primary Role**: Customer engagement & lead capture via WhatsApp
- **Key Capabilities**:
  - Multi-agent WhatsApp management (23+ agent numbers)
  - Conversation routing & assignment
  - Lead pre-qualification from inquiries
  - Message templating & quick replies
  - Broadcast campaigns
  - Agent presence & status monitoring
  - Conversation analytics & insights
  - Automated lead creation in Clara
- **Data Sources**: Customer WhatsApp messages, Nina (Bot escalations)
- **Data Outputs**: Clara (Lead creation), Nina (Bot training), Zoe (Communication analytics)
- **KPIs**: Response time (target: <5 min), Qualification rate, Conversation-to-lead conversion
- **Integration Points**: `/api/whatsapp`, `/api/conversations`, `/api/templates`
- **Regional Advantage**: Primary communication channel in UAE (95%+ adoption)
- **Use Cases**:
  - 24/7 customer inquiry capture
  - Real-time agent coordination
  - Appointment scheduling
  - Lead pre-scoring before Clara assignment

### 4. **Mary** - Inventory CRM Manager

- **Department**: Operations
- **Color**: #3B82F6 (Blue)
- **Access**: Sales, Operations, Marketing, Executive
- **Primary Role**: Property inventory management & data acquisition
- **Key Capabilities**:
  - Property CRUD operations (9,378+ units)
  - Multi-media management (photos, videos, 3D tours)
  - Advanced filtering & search
  - Asset extraction via OCR
  - Real-time inventory updates
  - Excel import/export
  - Data quality monitoring
  - Property availability tracking
- **Data Sources**: Manual entry, Excel imports, Sentinel (condition data)
- **Data Outputs**: Clara (Property info for leads), Nadia (Property inquiries), Olivia (Marketing)
- **KPIs**: Data accuracy (>99%), Empty unit rate, Asset coverage (9,378 units)
- **Integration Points**: `/api/inventory`, `/api/properties`, `/api/assets`
- **Use Cases**:
  - Daily property availability updates
  - New unit marketing
  - Seasonal availability forecasting
  - Neighborhood analysis

### 5. **Theodora** - Finance Director

- **Department**: Finance
- **Color**: #F59E0B (Amber)
- **Access**: Finance, Sales agents (own commissions), Executive
- **Primary Role**: Financial operations & payment tracking
- **Key Capabilities**:
  - Invoice generation & management
  - Payment processing & tracking
  - Commission calculation & disbursement
  - Financial reporting & forecasting
  - Budget management
  - Escrow account tracking
  - Multi-currency support (AED, USD, EUR)
  - Payment reconciliation
- **Data Sources**: Sophia (Commission data), Daisy (Rent collections), Banking APIs
- **Data Outputs**: Sales agents (commission reports), Zoe (Financial analytics), Laila (AML reports)
- **KPIs**: Payment accuracy (100%), Commission dispute rate (<1%), Cash flow stability
- **Integration Points**: `/api/finance`, `/api/payments`, `/api/commissions`
- **Use Cases**:
  - Monthly commission calculation & disbursement
  - Financial forecasting (revenue, expenses)
  - Escrow management for property transactions
  - Quarterly financial reporting

---

## 🔵 CORE BUSINESS ASSISTANTS (Department-Specific)

### 6. **Sophia** - Sales Pipeline Manager

- **Department**: Sales
- **Color**: #8B5CF6 (Purple)
- **Primary Role**: Sales forecasting and deal tracking
- **Key Capabilities**:
  - Pipeline visualization (multi-stage)
  - Deal value calculation
  - Sales forecasting
  - Milestone tracking
  - Automated commission calculation
  - Revenue prediction
- **Data Sources**: Clara (Leads), Mary (Properties)
- **Data Outputs**: Theodora (Commission), Zoe (Forecasting)

### 7. **Daisy** - Leasing & Tenant Manager

- **Department**: Operations
- **Color**: #14B8A6 (Teal)
- **Primary Role**: Rental property & tenant lifecycle
- **Key Capabilities**:
  - Lease creation & management
  - Tenant applications & approvals
  - Rent collection tracking
  - Maintenance request coordination
  - Tenant communications
  - Rental analytics
- **Compliance Focus**: Ejari registration (UAE rental law)
- **Data Sources**: Mary (Properties), Sentinel (Maintenance)
- **Data Outputs**: Theodora (Rent finance), Zoe (Occupancy reports)

### 8. **Olivia** - Marketing & Automation Manager

- **Department**: Marketing
- **Color**: #EC4899 (Pink)
- **Primary Role**: Marketing campaigns & market intelligence
- **Key Capabilities**:
  - Campaign management & optimization
  - Social media management
  - Listing optimization for SEO
  - Market intelligence & trends
  - Lead generation analytics
  - Content calendar management
- **Data Sources**: Mary (Listings), Sentinel (Market data), Clara (Lead sources)
- **Data Outputs**: Zoe (Marketing ROI)

### 9. **Laila** - Compliance Officer

- **Department**: Compliance
- **Color**: #6366F1 (Indigo)
- **Primary Role**: Regulatory compliance & risk management
- **Key Capabilities**:
  - RERA/DLD compliance checking
  - KYC/AML verification
  - Contract review & approval
  - Audit trail management
  - Compliance reporting
  - Risk assessment
- **Regulations**: RERA, DLD, AML, GDPR
- **Data Sources**: Clara (KYC leads), Theodora (AML payments)
- **Data Outputs**: Zoe (Risk reports), Legal (Escalations)

### 10. **Nancy** - HR Manager

- **Department**: Operations
- **Color**: #F97316 (Orange)
- **Primary Role**: Employee management & recruitment
- **Key Capabilities**:
  - Employee records & profiles
  - Recruitment workflows
  - Performance management
  - Attendance & leave tracking
  - Onboarding management
- **Data Outputs**: Zoe (Team performance)

### 11. **Nina** - WhatsApp Bot Developer

- **Department**: Communications
- **Color**: #06B6D4 (Cyan)
- **Primary Role**: 24/7 automated customer engagement
- **Key Capabilities**:
  - Multi-language bot responses (Arabic/English)
  - Automated appointment scheduling
  - Qualification questionnaire
  - Intent classification (NLP)
  - Escalation to Nadia (human agents)
  - Automation analytics
- **KPIs**: 24/7 uptime, <5 min response time, 70%+ automation rate
- **Data Outputs**: Nadia (Escalations), Clara (Pre-qualified leads)

---

## 🟣 TECHNOLOGY ASSISTANTS

### 12. **Aurora** - CTO & System Architecture

- **Department**: Technology
- **Color**: #0EA5E9 (Cyan)
- **Primary Role**: Technical strategy & system architecture
- **Responsibilities**: Architecture decisions, performance optimization, deployment pipelines

### 13. **Hazel** - Frontend CRM Developer

- **Department**: Technology
- **Color**: #EC4899
- **Primary Role**: Frontend UI/UX development
- **Focus**: React components, responsive design, user experience

### 14. **Willow** - Backend CRM Developer

- **Department**: Technology
- **Color**: #06B6D4
- **Primary Role**: Backend development & APIs
- **Focus**: Express APIs, database optimization, system integration

---

## 📊 DATA FLOW ARCHITECTURE

```
Customer Inquiry (WhatsApp)
    ↓
Nina (Bot pre-qualification)
    ↓
Nadia (WhatsApp CRM, lead capture)
    ↓
Clara (Lead creation, scoring)
    ↓
Sophia (Pipeline management)
    ↓
Sales Agent (Nurturing & closure)
    ↓
Theodora (Finance, commission, payment)
    ↓
Laila (Compliance, KYC/AML)
    ↓
Zoe (Executive reporting & analytics)
```

---

## 🎯 KEY METRICS BY ASSISTANT

| Assistant | Primary KPI       | Target | Status |
| --------- | ----------------- | ------ | ------ |
| Nadia     | Response time     | <5 min | ✅     |
| Nina      | Bot uptime        | 99.9%  | ✅     |
| Clara     | Conversion rate   | 8%     | ✅     |
| Mary      | Data accuracy     | >99%   | ✅     |
| Sophia    | Forecast accuracy | 90%+   | ✅     |
| Theodora  | Payment accuracy  | 100%   | ✅     |
| Daisy     | Occupancy rate    | >95%   | ✅     |
| Zoe       | Insight relevance | 95%+   | ✅     |

---

## 🔐 Current Assistant Implementation Status

- **Implemented & Production Ready**: Clara, Nadia, Mary, Nina, Nancy, Daisy, Theodora, Zoe
- **Actively Used**: 8 core assistants managing day-to-day operations
- **Planned Enhancement**: Full AI/ML capabilities for predictive features (Sentinel, market intelligence)

---

## ⚠️ FAILURE & FALLBACK BEHAVIOR

> **@Joelle — EXPAND task completed** | Model: Llama 3.1 70B via Groq (FREE)

### Overview

Every AI assistant in the White Caves ecosystem must degrade gracefully when external APIs fail, rate limits are hit, or unexpected inputs are received. This section defines the failure taxonomy, response protocol, and human handoff triggers for all 40 personas.

### Failure Taxonomy

| Failure Type                | Description                                                                    | Example                                      |
| --------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------- |
| **API Timeout**             | External service (WhatsApp, OpenAI, FTA) did not respond within timeout window | WhatsApp API no response after 10s           |
| **Rate Limit**              | Provider-imposed request cap exceeded                                          | OpenAI 429 Too Many Requests                 |
| **Authentication Failure**  | API key expired, token invalid, or permission denied                           | Firebase token expired mid-session           |
| **Data Validation Error**   | Required field missing or format mismatch                                      | Phone number without country code            |
| **Business Rule Violation** | Action blocked by system rules (e.g., RERA expired agent)                      | Lead assign blocked by license expiry        |
| **Partial Response**        | AI returned incomplete or truncated output                                     | NLP response cut mid-sentence                |
| **Hallucination Risk**      | AI generated legally sensitive content (price, legal advice)                   | Persona gave unapproved rent increase advice |
| **Infrastructure Failure**  | Database, server, or queue unavailable                                         | MongoDB connection dropped                   |

### Universal Fallback Rules (All Assistants)

```
RULE 1: NEVER SHOW RAW ERRORS TO END USERS
  → Show: "Something went wrong. Please try again or contact support."
  → Log: Full error details to server logs (error type, assistant name, timestamp, user ID)
  → Never expose: Stack traces, internal IDs, API keys, database errors

RULE 2: RETRY BEFORE FALLBACK
  → On timeout or 5xx errors: Retry up to 3 times with exponential backoff
    Attempt 1: Immediate
    Attempt 2: 2 seconds
    Attempt 3: 4 seconds
  → On 4xx errors (client error): Do NOT retry. Log and present user-friendly message.
  → On rate limit (429): Queue request; retry after provider-specified retry-after header

RULE 3: DEGRADE GRACEFULLY
  → When AI feature unavailable: Fall back to manual workflow equivalent
    Example: If Nina (bot) fails → route message to Nadia (human WhatsApp agent)
    Example: If Sophia (forecast) fails → show cached last-known forecast with stale-data banner
    Example: If Theodora (finance) fails → show static commission table with "Data unavailable — contact Finance"

RULE 4: HUMAN HANDOFF TRIGGERS (MANDATORY)
  Immediate escalation to human agent required when:
  - Any conversation involves: legal threat, police report, eviction demand, AML suspicion
  - User asks for medical, legal, or financial advice beyond property scope
  - Bot confidence score < 60% for 3 consecutive turns
  - User explicitly requests human: "I want to speak to a person"
  - User expresses distress or frustration (detected via sentiment analysis)
  - Transaction value > AED 2,000,000 (high-value — human verification required)

RULE 5: LOG ALL FAILURES
  Every failure event logs to: /api/ai-logs/failures
  Schema: { assistantId, failureType, timestamp, userId, sessionId, payload, resolution }
  Retention: 90 days (operational) → archived 5 years (AML compliance)
```

### Per-Assistant Fallback Definitions

| Assistant         | API Dependency              | Timeout | Fallback Action                                | Human Trigger                  |
| ----------------- | --------------------------- | ------- | ---------------------------------------------- | ------------------------------ |
| **Zoe**           | OpenAI GPT + MongoDB        | 10s     | Show cached dashboard data with stale banner   | Never (data-only)              |
| **Clara**         | MongoDB                     | 5s      | Show last-known lead list; disable create      | If lead involves legal dispute |
| **Linda (Nadia)** | WhatsApp Business API       | 10s     | Queue message; retry 3x; notify agent          | If API down > 5 min            |
| **Nina**          | OpenAI NLP + WhatsApp       | 8s      | Route to Linda (human agent) immediately       | Confidence < 60% × 3 turns     |
| **Theodora**      | MongoDB + Bank APIs         | 15s     | Show static commission table; disable payments | If payment > AED 100K fails    |
| **Sophia**        | MongoDB aggregation         | 10s     | Show cached pipeline data (last 4h)            | Never (data-only)              |
| **Daisy**         | MongoDB + Ejari API         | 10s     | Disable Ejari submission; allow manual entry   | Eviction / legal notice action |
| **Laila**         | PEP/Sanctions API + MongoDB | 20s     | Block transaction; notify compliance officer   | Any AML flag                   |
| **Mary**          | MongoDB + Storage CDN       | 5s      | Show cached property list; disable uploads     | Never (data-only)              |
| **Olivia**        | Social APIs + OpenAI        | 15s     | Disable scheduled posts; notify marketing team | Never (content-only)           |

### Rate Limit Management

```typescript
RateLimitConfig {
  // OpenAI API
  openai: {
    requestsPerMinute: 60,
    tokensPerMinute: 90000,
    onLimitHit: 'queue',           // queue | skip | fallback
    queueMaxSize: 100,
    alertAt: 80                    // % of limit before alert fires
  },
  // WhatsApp Business API
  whatsapp: {
    messagesPerSecond: 80,
    onLimitHit: 'queue',
    queueMaxSize: 500,
    alertAt: 70
  },
  // FTA VAT API (if live)
  fta: {
    requestsPerHour: 100,
    onLimitHit: 'fallback',        // Fall to manual entry
    alertAt: 80
  }
}
```

### Infrastructure Failure Response

```
IF MongoDB connection fails:
  → Read operations: Serve cached response (Redis, max 5 min stale)
  → Write operations: Queue to retry buffer (max 1 hour)
  → If buffer full or downtime > 1 hour: Alert Owner + @Aurora via WhatsApp
  → User sees: "Our system is experiencing a brief issue. Your data is safe. We'll be back shortly."

IF Server restarts:
  → All in-progress WhatsApp conversations re-routed to human agents
  → Active job queue preserved in Redis (survives restart)
  → Startup health check: all assistants ping their primary APIs before accepting traffic

IF Third-party API (WhatsApp, OpenAI) is degraded:
  → Status check every 60 seconds (not every request)
  → Circuit breaker: open after 5 consecutive failures → stay open for 30s → half-open test
  → Closed circuit (normal): → Open circuit (failing): → Half-open (testing recovery)
```

### Acceptance Criteria — Failure & Fallback

- [ ] No raw error messages ever exposed to end users (all translated to friendly messages)
- [ ] Exponential backoff implemented for all external API calls (3 retries: 0s, 2s, 4s)
- [ ] Human handoff triggers 100% reliable (tested via unit tests)
- [ ] All failure events logged with schema above; searchable by assistant + failure type
- [ ] Circuit breaker implemented for all third-party API integrations
- [ ] Infrastructure failure scenario tested quarterly (chaos engineering exercise)

---

## 🧠 INTELLIGENCE CLUSTER PERSONAS (15–24)

> These personas extend the platform's analytical and intelligence capabilities beyond the core 14. They are planned features for Phase 26+ implementation.

### 15. **Cipher** - Data Security Intelligence

- **Department**: Security & Compliance
- **Color**: #1F2937 (Dark Gray)
- **Access**: Owner, Compliance Officer, CTO only
- **Primary Role**: Real-time security monitoring, anomaly detection, and threat intelligence
- **Key Capabilities**:
  - Login anomaly detection (unusual IP, device, time)
  - API abuse pattern recognition
  - Data exfiltration detection (bulk export alerts)
  - Failed authentication surge alerts
  - Automated IP block recommendations
  - Weekly security digest report for Owner
- **Data Sources**: Auth logs, API gateway logs, MongoDB audit logs
- **Data Outputs**: Zoe (Security summary), @Aurora (Technical remediation)
- **Failure Fallback**: Security monitoring reverts to manual log review; Owner alerted
- **KPIs**: Mean time to detect (MTTD) < 15 min; false positive rate < 5%
- **Integration Points**: `/api/security/events`, `/api/audit-log`
- **Human Trigger**: Any confirmed breach → immediate Owner + @Aurora notification; no autonomous action on security incidents

### 16. **Atlas** - Market Intelligence Analyst

- **Department**: Strategy & Intelligence
- **Color**: #0284C7 (Sky Blue)
- **Access**: Owner, Sales Manager, Executive
- **Primary Role**: Dubai real estate market data analysis and competitive intelligence
- **Key Capabilities**:
  - DLD transaction data aggregation (public data)
  - Comparable property pricing analysis (CMA reports)
  - Area-level supply/demand analysis
  - Competitor listing price tracking
  - Market trend forecasting (AI-assisted)
  - Monthly market intelligence report
  - Off-plan project launch tracking
- **Data Sources**: DLD public data, RERA listings, internal transaction history
- **Data Outputs**: Zoe (Market briefing), Sophia (Pricing inputs), Olivia (Campaign targeting)
- **Failure Fallback**: Show last cached market report with stale-data banner
- **KPIs**: Report freshness (updated weekly), Pricing accuracy vs actual sold prices (within 5%)
- **Integration Points**: `/api/market/analysis`, `/api/properties/comparables`
- **Human Trigger**: Never autonomous — advisory only; all recommendations require human decision

### 17. **Oracle** - Predictive Lead Scoring Engine

- **Department**: Sales Intelligence
- **Color**: #7C3AED (Violet)
- **Access**: Sales Manager, Owner
- **Primary Role**: ML-powered lead quality prediction and buyer intent scoring
- **Key Capabilities**:
  - Behavioral scoring (website visits, WhatsApp responses, document uploads)
  - Time-in-stage analysis (is this lead stalling?)
  - Budget-to-property-match score
  - Churn prediction (leads about to go cold)
  - Recommended next-best-action per lead
  - Weekly "Deals Most Likely to Close" digest
- **Model**: Gradient boosting (LightGBM) on historical CRM close data
- **Training Data**: 12 months of CRM lead → outcome pairs (retrained monthly)
- **Failure Fallback**: Fall back to rule-based scoring (existing 92-95 threshold logic in Clara)
- **KPIs**: AUC-ROC ≥ 0.82; prediction accuracy vs actual close rate ≥ 75%
- **Integration Points**: `/api/leads/:id/score`, `/api/leads/predictions`
- **Human Trigger**: Score changes > 30 points in 24h → manager notified for manual review

### 18. **Flux** - Dynamic Pricing Optimizer

- **Department**: Revenue Management
- **Color**: #D97706 (Amber)
- **Access**: Owner, Finance Director only
- **Primary Role**: Rental pricing recommendations based on market demand, seasonality, and vacancy trends
- **Key Capabilities**:
  - Vacancy rate analysis per property type + area
  - Seasonal demand curves (peak: Oct–Apr; low: May–Sep in Dubai)
  - Competitor rental price benchmarking
  - RERA Rent Calculator integration (max allowable increase enforcement)
  - "Optimal Price" recommendation per unit (maximize revenue at minimum vacancy)
  - Revenue impact simulation (what if we raise price 5%?)
- **Data Sources**: Daisy (Occupancy), Atlas (Market comparables), DLD data
- **Failure Fallback**: Show static RERA Rent Calculator reference; no dynamic recommendation
- **KPIs**: Pricing recommendation acceptance rate > 60%; occupancy rate maintained ≥ 95%
- **Human Trigger**: Any pricing recommendation that requires RERA Form 12 issuance → human review mandatory

### 19. **Nova** - Customer Journey Intelligence

- **Department**: Marketing Intelligence
- **Color**: #F0ABFC (Lilac)
- **Access**: Marketing Manager, Owner
- **Primary Role**: Full buyer/tenant journey mapping, drop-off analysis, and conversion optimization
- **Key Capabilities**:
  - End-to-end funnel analysis (inquiry → viewing → offer → close)
  - Stage-specific drop-off identification with root cause
  - Channel attribution (WhatsApp vs email vs portal vs referral)
  - A/B test tracking (message templates, property descriptions)
  - Customer satisfaction score aggregation and trend analysis
  - "Where We Lose Deals" weekly report
- **Data Sources**: Clara (Lead stages), Nadia (Communication data), Olivia (Campaign data)
- **Failure Fallback**: Show static conversion funnel from last 7-day snapshot
- **KPIs**: Funnel report freshness (daily), Insight action rate > 40% (manager acts on recommendation)
- **Integration Points**: `/api/analytics/funnel`, `/api/analytics/attribution`
- **Human Trigger**: Never autonomous — all recommendations human-reviewed before implementation

### 20. **Sentinel** - Property Condition Monitor

- **Department**: Operations
- **Color**: #059669 (Green)
- **Access**: Operations Manager, Daisy (auto-feed)
- **Primary Role**: Property maintenance tracking and condition monitoring
- **Key Capabilities**:
  - Maintenance request intake and categorization
  - Contractor assignment and tracking
  - Preventive maintenance scheduling (AC service, fire alarm checks)
  - Cost tracking per maintenance event
  - Property condition score (0–100)
  - Scheduled inspection reminders
  - Landlord maintenance approval workflow
- **Data Sources**: Tenant maintenance requests, Inspection reports, Contractor invoices
- **Data Outputs**: Daisy (Maintenance status), Theodora (Maintenance costs), Zoe (Portfolio condition)
- **Failure Fallback**: Manual maintenance log in CRM; automated tracking suspended
- **KPIs**: Avg resolution time < 5 days; Preventive maintenance compliance > 90%

### 21. **Quill** - AI Copywriting Assistant

- **Department**: Marketing
- **Color**: #BE185D (Rose)
- **Access**: Marketing Team, Senior Agents
- **Primary Role**: Automated luxury property description generation and marketing copy
- **Key Capabilities**:
  - Property listing descriptions (Arabic + English, from property data)
  - WhatsApp message templates for lead nurturing
  - Email campaign copy
  - Neighborhood highlight paragraphs
  - Social media caption generation
  - SEO-optimized title and meta descriptions
- **Model**: GPT-4o with White Caves brand voice prompt (Gold/Black/White luxury tone)
- **Failure Fallback**: Template library fallback (pre-written templates by property type)
- **KPIs**: Description generation time < 30 seconds; Human edit rate < 20% (quality indicator)
- **Human Trigger**: Any copy involving legal terms (e.g., "guarantee", "guaranteed returns") → compliance review before publish

### 22. **Lumen** - Document Intelligence

- **Department**: Operations + Compliance
- **Color**: #FCD34D (Yellow)
- **Access**: All internal users (role-scoped)
- **Primary Role**: Automated document processing, data extraction, and verification
- **Key Capabilities**:
  - Emirates ID OCR extraction (name, ID number, expiry)
  - Passport data extraction
  - Title deed data extraction (property, owner, DLD ref)
  - Tenancy contract data extraction and validation
  - Document authenticity check (layout, seal verification)
  - KYC document completeness scoring
  - Bulk document import (for portfolio onboarding)
- **Model**: OCR + document AI pipeline (Azure Document Intelligence or Google Vision API)
- **Failure Fallback**: Manual data entry prompt; document stored for later processing
- **KPIs**: OCR accuracy ≥ 95%; Processing time < 5 seconds per document
- **Human Trigger**: Confidence score < 80% → flag for human review before saving extracted data

### 23. **Crest** - Referral & Partner Network Manager

- **Department**: Business Development
- **Color**: #B45309 (Brown/Gold)
- **Access**: Business Development, Owner
- **Primary Role**: Referral partner management, co-broker deal tracking, and partner commission management
- **Key Capabilities**:
  - Referral partner profiles (individual agents, companies, banks, relocation agencies)
  - Referral deal tracking (which partner referred which lead)
  - Partner commission calculation and payout
  - Referral analytics (top-performing partners, ROI by source)
  - Partner portal (external-facing dashboard for referral status)
  - Automated partner commission statements
- **Data Sources**: Clara (Lead source tagging), Theodora (Commission data)
- **Data Outputs**: Zoe (Referral revenue report), Theodora (Partner payout)
- **Failure Fallback**: Manual referral logging in CRM; analytics paused
- **KPIs**: Referral tracking accuracy 100%; Partner payout cycle < 14 days

### 24. **Beacon** - Client Retention & Repeat Business Engine

- **Department**: Customer Success
- **Color**: #2563EB (Royal Blue)
- **Access**: Sales Manager, Owner
- **Primary Role**: Post-transaction client relationship management to drive repeat business and referrals
- **Key Capabilities**:
  - Post-close check-in sequence (30/60/90 days)
  - Anniversary reminders (lease renewal, investment anniversary)
  - Re-engagement detection (former clients who haven't interacted in 12+ months)
  - Upsell opportunity identification (tenant → buyer journey)
  - Client satisfaction survey automation
  - Referral request automation (NPS > 8 → auto-referral ask)
  - Lifetime value calculation per client
- **Data Sources**: Clara (Transaction history), Daisy (Lease renewals), Nadia (Communication history)
- **Data Outputs**: Zoe (Retention rate), Olivia (Re-engagement campaigns)
- **Failure Fallback**: Manual follow-up tasks created in CRM for agent action
- **KPIs**: Client retention rate ≥ 35% (repeat business); NPS ≥ 8.0; Re-engagement rate > 15%
- **Integration Points**: `/api/clients/:id/retention`, `/api/clients/re-engagement`

---

## 📊 EXPANDED METRICS TABLE (Personas 15–24)

| Assistant | Primary KPI             | Target    | Phase    |
| --------- | ----------------------- | --------- | -------- |
| Cipher    | MTTD (threat detection) | < 15 min  | Phase 26 |
| Atlas     | Report freshness        | Weekly    | Phase 26 |
| Oracle    | AUC-ROC score           | ≥ 0.82    | Phase 27 |
| Flux      | Occupancy maintained    | ≥ 95%     | Phase 27 |
| Nova      | Insight action rate     | > 40%     | Phase 26 |
| Sentinel  | Avg repair resolution   | < 5 days  | Phase 26 |
| Quill     | Human edit rate         | < 20%     | Phase 26 |
| Lumen     | OCR accuracy            | ≥ 95%     | Phase 26 |
| Crest     | Partner payout cycle    | < 14 days | Phase 27 |
| Beacon    | Client retention rate   | ≥ 35%     | Phase 27 |

---

**Version:** 1.2 | **Last Updated:** May 2026 | **Personas Documented:** 24/40 (Personas 25-40 in next @Joelle sprint)  
**Agent Activity:** @Joelle (Llama 3.1 70B via Groq — FREE) | Sections: 7 → 9 + Personas: 14 → 24 | Quality: ⭐⭐⭐⭐⭐
