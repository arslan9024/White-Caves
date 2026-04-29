# AI Assistant Integration Map — White Caves CRM

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Purpose:** Maps each AI assistant to its department, API endpoints, dependencies, and implementation status

---

## Overview

White Caves has 24 named AI assistants, each representing a business function or department. Assistants fall into three categories:

| Category | Description | Count |
|----------|-------------|-------|
| **Role-Based UI** | Named personas that drive CRM module UX; no direct LLM calls — powered by deterministic business logic | 18 |
| **Automation** | Assistants that automate workflows via API orchestration (rule-based + ML-scoring) | 4 |
| **Intelligence** | Assistants that call LLM APIs (OpenAI / Gemini) for predictive or conversational tasks | 2 |

---

## Assistant Catalogue

### CLARA — Lead Manager
- **Department:** Sales
- **Category:** Role-Based UI + Automation
- **Module:** `/api/leads` — full CRUD
- **Functions:** Lead creation, scoring, assignment, status tracking, pipeline view
- **Data Sources:** Leads DB, Activities DB, Properties DB
- **Depends On:** Nadia (WhatsApp leads), Nina (bot pre-qualification), Sophia (pipeline)
- **AI/ML:** Lead scoring algorithm (rule-based, see Business Rules BR-001)
- **LLM Required:** No
- **Implementation Status:** ✅ Backend complete; ✅ Frontend complete

### SOPHIA — Pipeline Manager
- **Department:** Sales
- **Category:** Role-Based UI
- **Module:** `/api/transactions` — CRUD
- **Functions:** Sales pipeline visualisation, deal tracking, forecasting
- **Data Sources:** Transactions DB, Leads DB, Properties DB
- **Depends On:** Clara (qualified leads), Theodora (commissions)
- **LLM Required:** No
- **Implementation Status:** ✅ Backend complete; ✅ Frontend complete

### MARY — Inventory Manager
- **Department:** Operations
- **Category:** Role-Based UI
- **Module:** `/api/properties` — full CRUD
- **Functions:** Property CRUD, media upload, Excel import, availability tracking
- **Data Sources:** Properties DB, Media Storage
- **Depends On:** Nothing (source of truth for inventory)
- **LLM Required:** No
- **Implementation Status:** ✅ Backend complete; ✅ Frontend complete

### NADIA — WhatsApp CRM Manager
- **Department:** Communications
- **Category:** Role-Based UI + Automation
- **Module:** `/api/communications`, WhatsApp Cloud API
- **Functions:** Multi-agent inbox, conversation routing, template messaging, lead capture
- **Data Sources:** WhatsApp conversations, Leads DB
- **Depends On:** Nina (bot pre-qualification), Meta WhatsApp Cloud API
- **External APIs:** Meta WhatsApp Cloud API — `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`
- **LLM Required:** No (routing is rule-based)
- **Implementation Status:** ✅ Frontend complete; ⏳ Backend partial (API stubs)

### NINA — WhatsApp Bot Developer
- **Department:** Communications
- **Category:** Automation + Intelligence
- **Module:** `/api/bots`, `/api/flows`, `/api/sessions` (planned)
- **Functions:** Conversation bot logic, intent classification, lead pre-qualification, FAQs
- **Data Sources:** Conversations DB, Properties DB (for search), FAQ knowledge base
- **Depends On:** Nadia (handover), Clara (lead creation from conversation)
- **External APIs:**
  - Meta WhatsApp Cloud API (send messages)
  - OpenAI API (for intent classification — optional) — `OPENAI_API_KEY`
- **LLM Required:** Optional (rule-based NLP first, LLM upgrade later)
- **Implementation Status:** ⏳ Planned

### THEODORA — Finance Director
- **Department:** Finance
- **Category:** Role-Based UI
- **Module:** `/api/finance` — summary, commissions, payments
- **Functions:** Commission management, financial summary, rent tracking, P&L
- **Data Sources:** Commissions DB, Transactions DB, Leases DB
- **Depends On:** Sophia (closed transactions), Daisy (rent payments)
- **LLM Required:** No
- **Implementation Status:** ✅ Backend complete; ✅ Frontend complete

### DAISY — Leasing Manager
- **Department:** Operations
- **Category:** Role-Based UI
- **Module:** `/api/tenants`, lease management (planned full module)
- **Functions:** Tenant management, lease agreements, Ejari tracking, rent collection
- **Data Sources:** Tenants DB, Leases DB, Properties DB
- **Depends On:** Mary (property availability), Theodora (rent payments), Laila (KYC)
- **LLM Required:** No
- **Implementation Status:** ✅ Backend basic; ⏳ Full leasing module planned

### LAILA — Compliance Officer
- **Department:** Legal/Compliance
- **Category:** Role-Based UI + Automation
- **Module:** `/api/compliance` — status, requirements, KYC
- **Functions:** KYC verification, AML monitoring, RERA compliance, SAR management
- **Data Sources:** Transactions DB, Tenants DB, Compliance DB
- **Depends On:** All modules (cross-cutting concern)
- **External APIs:**
  - AML Screening service (e.g., ComplyAdvantage) — `AML_API_KEY` (planned)
  - goAML portal (UAE FIU — manual submission)
- **LLM Required:** No (rule-based risk scoring)
- **Implementation Status:** ✅ Backend basic; ⏳ Full KYC/AML workflow planned

### ZOE — Executive Assistant
- **Department:** Executive
- **Category:** Role-Based UI + Intelligence
- **Module:** `/api/dashboard` — reporting, analytics
- **Functions:** Executive dashboard, KPIs, forecasting, strategic reports
- **Data Sources:** All DBs (aggregated)
- **Depends On:** All departments (read-only aggregation)
- **LLM Required:** Optional (for natural language Q&A dashboard)
- **Implementation Status:** ✅ Backend complete; ✅ Frontend complete

### OLIVIA — Marketing Manager
- **Department:** Marketing
- **Category:** Role-Based UI
- **Module:** Campaign management (planned), WhatsApp broadcasts
- **Functions:** Campaign planning, broadcast execution, analytics, lead attribution
- **Data Sources:** Leads DB, Campaign DB, WhatsApp API
- **Depends On:** Nadia (WhatsApp sends), Clara (lead source attribution)
- **LLM Required:** No
- **Implementation Status:** ⏳ Planned

### CIPHER — Market Intelligence AI
- **Department:** Strategy
- **Category:** Intelligence (LLM-powered)
- **Module:** Market analytics endpoint (planned)
- **Functions:** Dubai market trend analysis, price predictions, investment hotspot mapping
- **Data Sources:** External market data APIs, internal transaction history
- **External APIs:**
  - OpenAI GPT-4 or Gemini Pro for analysis — `OPENAI_API_KEY`
  - Dubai REST / DLD data feeds (when available)
- **LLM Required:** Yes — primary function is AI-powered analysis
- **Implementation Status:** ⏳ Planned (Phase D2)

### MAVEN — Investment Intelligence AI
- **Department:** Investment Advisory
- **Category:** Intelligence (LLM-powered)
- **Module:** Investment analysis endpoint (planned)
- **Functions:** ROI calculations, yield predictions, investment portfolio recommendations
- **Data Sources:** Property prices, rental yields, transaction history, market data
- **External APIs:**
  - OpenAI GPT-4 / Gemini Pro — `OPENAI_API_KEY`
  - Exchange Rate API for multi-currency calculations
- **LLM Required:** Yes — generates personalised investment recommendations
- **Implementation Status:** ⏳ Planned (Phase D3)

### KAIROS — Luxury Concierge
- **Department:** Luxury Sales
- **Category:** Role-Based UI
- **Module:** Luxury client portal (planned)
- **Functions:** VIP client management, white-glove service coordination, bespoke property sourcing
- **Data Sources:** VIP clients, high-value transactions (AED 5M+), luxury properties
- **LLM Required:** No (CRM module)
- **Implementation Status:** ⏳ Planned

### ATLAS — Operations Director
- **Department:** Operations
- **Category:** Role-Based UI
- **Module:** Operations dashboard
- **Functions:** Cross-departmental operations overview, maintenance coordination
- **Data Sources:** All operations data
- **LLM Required:** No
- **Implementation Status:** ⏳ Planned

### AURORA — Tech Director
- **Department:** Technology
- **Category:** Role-Based UI
- **Module:** System health dashboard
- **Functions:** System monitoring, uptime, API health, deployment management
- **Data Sources:** System metrics, error logs
- **LLM Required:** No
- **Implementation Status:** ⏳ Planned

### SENTINEL — IoT & Property Monitoring
- **Department:** Operations
- **Category:** Automation
- **Module:** Maintenance + IoT events (planned)
- **Functions:** Property condition monitoring, maintenance alerts, sensor data
- **Data Sources:** IoT sensors (future), maintenance DB
- **LLM Required:** No
- **Implementation Status:** ⏳ Future (Phase F)

### HENRY — Mortgage Advisor
- **Department:** Finance
- **Category:** Role-Based UI
- **Module:** Mortgage calculator (planned)
- **Functions:** Mortgage eligibility, bank comparison, payment schedule
- **Data Sources:** Property prices, client income data
- **External APIs:** Mortgage rate API (planned)
- **LLM Required:** No
- **Implementation Status:** ⏳ Planned

### HUNTER — Property Scout
- **Department:** Sales
- **Category:** Automation
- **Module:** Property recommendation engine (planned)
- **Functions:** AI-powered property matching based on client preferences
- **Data Sources:** Properties DB, Leads DB
- **LLM Required:** Optional (ML recommendation model)
- **Implementation Status:** ⏳ Planned

### JUNO — Tenant Relations
- **Department:** Operations
- **Category:** Role-Based UI
- **Module:** Tenant portal (planned)
- **Functions:** Tenant self-service portal (rent, maintenance, documents)
- **Data Sources:** Tenants DB, Leases DB
- **LLM Required:** No
- **Implementation Status:** ⏳ Planned

### NANCY — HR Manager
- **Department:** HR
- **Category:** Role-Based UI
- **Module:** HR module (planned)
- **Functions:** Employee management, agent credentials, job board, training records
- **Data Sources:** Users DB, HR records
- **LLM Required:** No
- **Implementation Status:** ⏳ Planned

### VESTA — Interior Design
- **Department:** Services
- **Category:** Role-Based UI
- **Module:** Interior design module (planned)
- **Functions:** Design project management, furniture catalogue, client proposals
- **Data Sources:** Properties DB, Design projects DB
- **LLM Required:** No
- **Implementation Status:** ⏳ Planned

### WILLOW — Client Relationship
- **Department:** Customer Success
- **Category:** Role-Based UI
- **Module:** Client management
- **Functions:** Long-term client relationship tracking, satisfaction monitoring, repeat purchase
- **Data Sources:** Clients DB, Transactions DB, Activities DB
- **LLM Required:** No
- **Implementation Status:** ⏳ Planned

### HAZEL — Legal Assistant
- **Department:** Legal
- **Category:** Role-Based UI
- **Module:** Contract management (planned)
- **Functions:** Contract generation, e-signature workflows, document management
- **Data Sources:** Transactions DB, Tenants DB, Contract templates
- **LLM Required:** No
- **Implementation Status:** ⏳ Planned

### EVANGELINE — Brand & Content
- **Department:** Marketing
- **Category:** Role-Based UI
- **Module:** Content management (planned)
- **Functions:** Blog management, social media scheduling, brand asset library
- **Data Sources:** Content DB
- **LLM Required:** Optional (AI content suggestions)
- **Implementation Status:** ⏳ Planned

---

## API Key Requirements Summary

| Service | Env Variable | Required By | Status |
|---------|-------------|-------------|--------|
| Meta WhatsApp Cloud API | `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WEBHOOK_SECRET` | Nadia, Nina | ⏳ Needs WABA account |
| Firebase Admin SDK | `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL` | Auth | ✅ Configured |
| OpenAI API | `OPENAI_API_KEY` | Cipher, Maven, Nina (optional) | ⏳ Needs API key |
| Exchange Rate API | `EXCHANGE_RATE_API_KEY` | Theodora, general display | ⏳ Needs API key |
| SendGrid | `SENDGRID_API_KEY` | All email notifications | ✅ Configured |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Payments | ⏳ Needs account |
| AML Screening (ComplyAdvantage) | `AML_API_KEY` | Laila | ⏳ Needs contract |
| PropertyFinder API | `PROPERTY_FINDER_API_KEY`, `PROPERTY_FINDER_PARTNER_ID` | Mary (portals) | ⏳ Needs agreement |
| Bayut API | `BAYUT_API_KEY`, `BAYUT_PARTNER_ID` | Mary (portals) | ⏳ Needs agreement |

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Technical Team
