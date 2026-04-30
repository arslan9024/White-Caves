# Technology Upgrades — Stack Improvements for 400% Performance Gain

> **Last Updated:** April 11, 2026
> **Current Stack:** React 18, TypeScript, Redux, Node/Express, MongoDB (Prisma), whatsapp-web.js
> **Target:** Transform White Caves into the #1 Dubai real estate platform

---

## 1. Executive Summary

Based on competitor analysis and industry best practices, the following technology upgrades are recommended to achieve a 400% improvement in platform performance, user experience, and revenue. Each recommendation includes estimated impact, implementation complexity, and priority.

---

## 2. Search & Discovery — Elasticsearch

### Current State
- MongoDB-only search with basic Prisma queries
- No full-text search, faceted filters, or autocomplete
- Property search is 5–10x slower than competitors using Elasticsearch

### Recommendation

| Item | Details |
|------|---------|
| **Technology** | Elasticsearch 8.x (or OpenSearch) |
| **Use Cases** | Property search, autocomplete, faceted filters, geospatial search |
| **Integration** | Sync from MongoDB via Change Streams → Elasticsearch indexer |
| **Index Design** | `properties` index with mappings for location (geo_point), price (scaled_float), type (keyword), amenities (keyword array), description (text with analyzers) |
| **Autocomplete** | Completion suggester on property titles, locations, community names |
| **Faceted Search** | Aggregations for price ranges, bedrooms, property types, areas |

### Implementation Steps

1. Deploy Elasticsearch cluster (AWS OpenSearch or self-managed)
2. Create property index with custom analyzers (Arabic + English)
3. Build sync service: MongoDB Change Streams → Elasticsearch
4. Add `GET /api/properties/search` endpoint using Elasticsearch
5. Implement autocomplete endpoint `GET /api/properties/suggest`
6. Add faceted filter aggregations to search response
7. Update frontend PropertySearch component to use new endpoints

### Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Search latency (p95) | 800ms | 50ms | 16x faster |
| Autocomplete | None | <30ms suggestions | New capability |
| Faceted filters | Basic MongoDB queries | Real-time aggregations | 10x faster |
| Relevance scoring | None | TF-IDF + custom boosting | Dramatically better results |

### Estimated Effort
- **Backend:** 3–4 weeks
- **Frontend:** 2 weeks
- **DevOps:** 1 week (cluster setup, monitoring)

---

## 3. Caching Layer — Redis

### Current State
- No caching layer; every request hits MongoDB
- Session stored in memory (not scalable)
- Rate limiting uses in-memory store

### Recommendation

| Item | Details |
|------|---------|
| **Technology** | Redis 7.x (or AWS ElastiCache) |
| **Use Cases** | Session store, API response cache, rate limiting, real-time pub/sub |
| **Caching Strategy** | Cache-aside for property listings (TTL: 5 min), write-through for user sessions |

### Cache Targets

| Data | TTL | Invalidation Strategy |
|------|-----|-----------------------|
| Property listings (list view) | 5 minutes | Invalidate on create/update/delete |
| Property detail | 10 minutes | Invalidate on update |
| Search results | 3 minutes | TTL-based |
| User sessions | 24 hours | On logout or token refresh |
| Dashboard analytics | 15 minutes | TTL-based |
| RERA permit status | 1 hour | Webhook or TTL |

### Implementation Steps

1. Deploy Redis instance (AWS ElastiCache or Docker)
2. Install `ioredis` package for Node.js client
3. Create caching middleware: `cacheMiddleware(key, ttl)`
4. Migrate session store from in-memory to Redis (`connect-redis`)
5. Migrate rate limiter to Redis-backed store (`rate-limit-redis`)
6. Add cache invalidation hooks to Prisma middleware
7. Implement pub/sub for real-time notifications

### Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| API response time (cached) | 200ms | 5ms | 40x faster |
| MongoDB load | 100% | ~40% | 60% reduction |
| Session scalability | Single instance | Multi-instance | Horizontally scalable |
| Rate limiting accuracy | Approximate | Exact (atomic) | Production-ready |

### Estimated Effort
- **Backend:** 2 weeks
- **DevOps:** 0.5 weeks

---

## 4. API Evolution — GraphQL

### Current State
- REST-only API (20+ routes, 8 stub endpoints)
- Over-fetching on list endpoints; under-fetching requires multiple calls
- Frontend makes 3–5 requests for dashboard data

### Recommendation

| Item | Details |
|------|---------|
| **Technology** | Apollo Server 4 with Express integration |
| **Strategy** | GraphQL gateway alongside existing REST (not replacement) |
| **Schema** | Auto-generate from Prisma schema using `typegraphql-prisma` |
| **Key Resolvers** | `properties`, `leads`, `transactions`, `analytics`, `users` |
| **Subscriptions** | WebSocket subscriptions for real-time updates (new leads, messages) |

### Benefits for White Caves

1. **Dashboard efficiency:** Single query for all dashboard widgets (currently 5+ REST calls)
2. **Mobile optimization:** Request only needed fields (reduce payload by 60–80%)
3. **Real-time updates:** GraphQL subscriptions for WhatsApp messages, new leads
4. **Developer experience:** Type-safe schema, auto-generated types, GraphQL Playground

### Implementation Steps

1. Install Apollo Server + graphql packages
2. Define GraphQL schema from Prisma models
3. Implement resolvers for core entities (Property, Lead, User, Transaction)
4. Add DataLoader for N+1 query prevention
5. Add authentication context from existing JWT middleware
6. Enable GraphQL subscriptions via WebSocket
7. Deploy GraphQL Playground at `/graphql`
8. Gradually migrate frontend components to use GraphQL

### Impact

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Dashboard API calls | 5+ requests | 1 request | 80% fewer requests |
| Payload size (mobile) | Full objects | Only needed fields | 60–80% smaller |
| Real-time updates | Polling | WebSocket subscriptions | Instant |
| API documentation | Manual OpenAPI | Auto-generated schema | Always up-to-date |

### Estimated Effort
- **Backend:** 3–4 weeks
- **Frontend migration:** 4–6 weeks (incremental)

---

## 5. Real-Time Communication — WebSocket

### Current State
- No real-time capability; WhatsApp messages polled
- No live notifications in CRM
- No collaborative features

### Recommendation

| Item | Details |
|------|---------|
| **Technology** | Socket.IO 4.x (or native WebSocket with ws library) |
| **Use Cases** | WhatsApp message delivery, lead notifications, live property updates |
| **Integration** | Redis adapter for multi-instance support |

### Implementation Steps

1. Add Socket.IO server to Express app
2. Redis adapter for horizontal scaling
3. Emit events: `new-lead`, `whatsapp-message`, `property-update`, `offer-received`
4. Frontend: Socket.IO client with Redux integration
5. Notification center component with real-time badge counts

### Estimated Effort
- **Backend:** 1.5 weeks
- **Frontend:** 1.5 weeks

---

## 6. File Storage — S3/Cloud Storage

### Current State
- No file upload system implemented
- Property photos, documents, agent profiles cannot be stored
- File upload endpoint returns 501

### Recommendation

| Item | Details |
|------|---------|
| **Technology** | AWS S3 (or DigitalOcean Spaces / Cloudflare R2) |
| **Upload** | Multer middleware → S3 with presigned URLs for direct upload |
| **Processing** | Sharp for image optimization (resize, WebP conversion) |
| **CDN** | CloudFront or Cloudflare for global delivery |
| **Security** | Virus scanning via ClamAV, MIME type validation, size limits |

### Implementation Steps

1. Install `@aws-sdk/client-s3`, `multer`, `multer-s3`, `sharp`
2. Configure S3 bucket with CORS and lifecycle policies
3. Create upload middleware with validation (type, size, virus scan)
4. Image processing pipeline (thumbnail, medium, large, WebP)
5. Presigned URL generation for direct browser uploads
6. CDN configuration for property photo delivery

### Estimated Effort
- **Backend:** 2 weeks
- **DevOps:** 0.5 weeks

---

## 7. MongoDB Performance Optimization

### Current State
- 15 Prisma models with basic indexes
- No geospatial indexes for location-based search
- No aggregation pipelines for analytics dashboards

### Recommended Indexes

```
// Property search optimization
db.properties.createIndex({ "status": 1, "city": 1, "price": 1, "type": 1 })
db.properties.createIndex({ "location": "2dsphere" })
db.properties.createIndex({ "title": "text", "description": "text" })
db.properties.createIndex({ "createdAt": -1 })
db.properties.createIndex({ "agentId": 1, "status": 1 })

// Lead pipeline optimization
db.leads.createIndex({ "status": 1, "assignedTo": 1, "score": -1 })
db.leads.createIndex({ "createdAt": -1, "source": 1 })

// Transaction analytics
db.transactions.createIndex({ "date": -1, "type": 1, "status": 1 })
db.transactions.createIndex({ "propertyId": 1, "agentId": 1 })
```

### Aggregation Pipelines for Analytics

| Pipeline | Purpose | Stages |
|----------|---------|--------|
| Revenue by month | Finance dashboard | `$match` → `$group` → `$sort` |
| Leads by source | Marketing analytics | `$match` → `$group` → `$project` |
| Properties by area | Inventory heatmap | `$geoNear` → `$group` → `$project` |
| Agent performance | Team metrics | `$lookup` → `$group` → `$sort` |
| Commission summary | Finance reports | `$match` → `$group` → `$facet` |

### Implementation Steps

1. Add compound indexes to Prisma schema (`@@index` directives)
2. Add geospatial index for property locations
3. Run `prisma db push` to apply indexes
4. Build aggregation pipeline service for analytics
5. Add `explain()` monitoring to track query performance
6. Set up MongoDB Atlas Performance Advisor (if using Atlas)

### Estimated Effort
- **Backend:** 1.5 weeks

---

## 8. Email & Marketing Automation — SendGrid

### Current State
- No email sending capability
- No drip campaigns or automated follow-ups
- Marketing CRM (Olivia) uses mock data

### Recommendation

| Item | Details |
|------|---------|
| **Technology** | SendGrid (or Mailgun / AWS SES) |
| **Templates** | New listing alerts, viewing reminders, market reports, welcome series |
| **Automation** | Drip campaigns triggered by lead status changes |
| **Analytics** | Open rates, click rates, conversion tracking |

### Implementation Steps

1. Install `@sendgrid/mail` package
2. Create email templates (Handlebars) for all communication types
3. Build email service with queue (Bull/BullMQ + Redis)
4. Implement drip campaign engine (trigger-based sequences)
5. Add email tracking endpoints (open, click, unsubscribe)
6. Connect to Olivia Marketing CRM for campaign management

### Estimated Effort
- **Backend:** 2 weeks
- **Frontend (campaign builder):** 2 weeks

---

## 9. 3D Tours & Virtual Staging — Matterport

### Current State
- No virtual tour capability
- Property listings are photo-only
- Missing key feature that competitors (PropertyFinder, Bayut) offer

### Recommendation

| Item | Details |
|------|---------|
| **Technology** | Matterport SDK + Three.js for custom viewers |
| **Integration** | Embed Matterport tours via iframe or SDK |
| **Virtual Staging** | AI-powered virtual staging via roOomy or similar API |
| **360° Photos** | Support 360° photo uploads with pannellum viewer |

### Implementation Steps

1. Add `matterportTourUrl` field to Property model
2. Create 3D tour viewer component (iframe + Matterport SDK)
3. Add 360° photo support with pannellum.js
4. Integrate virtual staging API for empty properties
5. Add "Virtual Tour" badge to listing cards

### Estimated Effort
- **Frontend:** 2 weeks
- **Backend:** 0.5 weeks

---

## 10. Technology Upgrade Priority Matrix

| Priority | Technology | Impact | Effort | ROI |
|----------|-----------|--------|--------|-----|
| **P0** | Elasticsearch | Search 16x faster | 6 weeks | ★★★★★ |
| **P0** | Redis | API 40x faster (cached) | 2.5 weeks | ★★★★★ |
| **P0** | S3 File Storage | Enable photo uploads | 2.5 weeks | ★★★★★ |
| **P0** | MongoDB Indexes | Query optimization | 1.5 weeks | ★★★★☆ |
| **P1** | SendGrid Email | Marketing automation | 4 weeks | ★★★★☆ |
| **P1** | WebSocket (Socket.IO) | Real-time notifications | 3 weeks | ★★★★☆ |
| **P1** | 3D Tours (Matterport) | +40% engagement | 2.5 weeks | ★★★★☆ |
| **P2** | GraphQL (Apollo) | 80% fewer API calls | 8 weeks | ★★★☆☆ |
| **P2** | PWA / React Native | Mobile users | 8+ weeks | ★★★☆☆ |

---

## 11. Infrastructure Cost Estimates

| Service | Provider | Monthly Cost (Est.) |
|---------|----------|-------------------|
| Elasticsearch | AWS OpenSearch (t3.medium) | $150–300 |
| Redis | AWS ElastiCache (t3.micro) | $25–50 |
| S3 Storage | AWS S3 (100GB) | $5–15 |
| CloudFront CDN | AWS CloudFront | $20–50 |
| SendGrid | Pro plan (100K emails/mo) | $90 |
| Matterport | Business plan | $70/mo |
| **Total additional** | | **$360–575/mo** |

---

## Sources

- [MongoDB Indexing Best Practices](https://www.mongodb.com/company/blog/performance-best-practices-indexing)
- [Elasticsearch Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/)
- [Redis Best Practices](https://redis.io/docs/management/optimization/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [SendGrid API Documentation](https://docs.sendgrid.com/)
- [Matterport SDK](https://matterport.github.io/showcase-sdk/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)


---

## 12. MENA Proptech Competitive Landscape (2025–2026)

### 12.1 Dubai Proptech Startups to Watch

| Company | Stage | What They Offer | Threat Level | Opportunity |
|---------|-------|----------------|-------------|-------------|
| **Huspy** | Series B ($37M raised) | Mortgage marketplace + property search | Medium | Partner for mortgage referrals |
| **Stake** | Series A | Fractional real estate investment (AED 500 min) | Low (different market) | Feature differentiation |
| **SmartCrowd** | Operational | Crowdfunded Dubai property investment | Low | Awareness — informs investor lead strategy |
| **Holo** | Seed | Mortgage automation for UAE expats | Medium | Partner for fast mortgage pre-approval |
| **Estate Intel** | Operational | Pan-Africa data analytics (expanding to MENA) | Low | Data partnership opportunity |
| **Nobroker** | Series C (India-based, UAE expansion) | No-agent platform | High (future) | Build agent value-add features to defend |
| **Keyper** | Seed | Rent-now-pay-later for Dubai tenants | Low | Monitor for Tenant portal integration |

**Key takeaway:** The "no-agent" trend is early-stage in UAE but growing. White Caves' defence is deep specialist knowledge + compliance — things an algorithm cannot replicate. Platform must emphasise agent expertise + human service at every touchpoint.

### 12.2 Global Proptech Trends Relevant to White Caves

| Trend | Global Leader | White Caves Application | Timeline |
|-------|-------------|------------------------|---------|
| AI-generated property descriptions | OpenAI API + real estate fine-tuning | Auto-generate listing copy from structured data (beds, baths, area, views) | Phase 7 |
| Conversational AI for property search | Redfin's AI search, Zillow AI | Clara AI assistant: natural language property search ("3-bed villa under AED 2M near schools") | Phase 7 |
| Automated Valuation Models (AVM) | Zillow Zestimate, Rightmove AVM | Vesta + Oracle AI: DLD transaction data → price prediction for DAMAC Hills 2 | Phase 7 |
| Digital / paperless transactions | DocuSign + blockchain | Quill + DocuSign integration (Phase 2); DLD blockchain pilot integration (Phase 8) | Phase 2/8 |
| Fractional ownership | Republic, Arrived | Not directly applicable — monitor regulatory landscape | Phase 10+ |

---

## 13. AI/ML Implementation Roadmap — Technical Choices

### 13.1 Lead Scoring Model

| Phase | Algorithm | Rationale |
|-------|---------|----------|
| Phase 2–3 | Rule-based weighted scoring (Archer) | Fast to implement; interpretable; no training data needed; agents trust it |
| Phase 7 | Gradient Boosting (XGBoost or LightGBM) | Handles tabular data well; fast inference; handles missing values natively; industry standard for structured lead data |
| Phase 9+ | Online learning (Vowpal Wabbit) | Updates model in real-time as new conversions come in; ideal for growing dataset |

**Why XGBoost over Neural Network at Phase 7:**
- White Caves' dataset (estimated 5,000–10,000 leads by Phase 7) is too small for deep learning
- Neural networks need 100K+ samples for reliable generalisation
- XGBoost achieves comparable accuracy on tabular data with much less data
- XGBoost is explainable via SHAP (agents can see "why" a lead is scored hot)
- Neural networks are black boxes — compliance risk for GDPR/PDPL automated decision-making

### 13.2 Property Price Prediction (AVM)

| Component | Choice | Rationale |
|----------|--------|-----------|
| Feature engineering | Area, sqft, floor, view, community cluster, age, season, economic index | Standard AVM features; all available from DLD + CRM |
| Base model | XGBoost (regression) | Best performance on UAE housing tabular data (industry research) |
| Time-series component | Facebook Prophet | Captures Dubai property cycle seasonality (Expo boosts, Ramadan dips) |
| Training data | DLD transaction feed (5+ years) | Only authoritative source; minimum 50,000 transactions per area |
| Validation | MAPE (Mean Absolute Percentage Error) target < 10% | Industry standard for AVM accuracy |
| SHAP explainability | SHAP values per prediction | "Your property is valued at AED 1.8M — main factors: area (+15%), floor level (+8%), view type (+5%)" |

### 13.3 Natural Language Processing for WhatsApp (Nina)

| Task | Model Choice | Rationale |
|------|------------|----------|
| Intent detection | Fine-tuned BERT (Arabic + English) | Multilingual BERT handles code-switching (common in Dubai WhatsApp) |
| Entity extraction | spaCy with custom NER | Extract: budget, property type, area, bedroom count, timeline from conversational text |
| Sentiment analysis | CardiffNLP multilingual sentiment | Detect frustrated clients (negative sentiment → escalate to human agent) |
| Language detection | langdetect Python library | Auto-detect language → route to English or Arabic flow |
| Response generation | Rule-based templates + GPT-4 for complex queries | Rule-based = fast + predictable for standard queries; GPT-4 = fallback for complex/unusual |

---

## 14. Integration Architecture Decision Table

| Integration | Build vs. Buy vs. Partner | TCO (Year 1) | Implementation Time | Risk | Decision |
|------------|--------------------------|-------------|-------------------|------|----------|
| Property search (Elasticsearch) | Build (self-host on AWS) | $2,400/year | 6 weeks | Medium | Build — control over Arabic analysers + data |
| E-signatures | Buy (DocuSign) | $4,800/year | 2 weeks | Low | Buy — legal validity is DocuSign's core business |
| Virtual tours | Partner (Matterport) | $840/year + camera | 2 weeks | Low | Partner — Matterport is industry standard |
| Email delivery | Buy (SendGrid) | $1,200/year | 1 week | Low | Buy — commodity service |
| Maps | Buy (Google Maps API) | ~$1,000/year | 1 week | Low | Buy — reliability + coverage |
| Mortgage calculator | Build | $0 | 3 days | Low | Build — simple formula; full control |
| Portal syndication | Partner (PF + Bayut APIs) | $30,000–80,000/year | 8 weeks | Medium | Partner — access to their audience is the value |
| AML screening | Buy (ComplyAdvantage API) | $3,600/year | 2 weeks | Medium | Buy — sanctions database maintenance is not White Caves' core skill |
| Price prediction | Build | $0 (compute only) | 12 weeks | High | Build — UAE-specific data + competitive advantage |
| WhatsApp bot | Build (on Meta Cloud API) | $0 (usage-based) | 6 weeks | Medium | Build — custom BANT flow is competitive advantage |
| Payment processing | Buy (Stripe) | 1.5% per transaction | 3 weeks | Low | Buy — PCI-DSS compliance is complex to build |

---

## 15. Data Engineering Stack — Phase 7

### 15.1 Architecture Overview

```
DATA SOURCES          INGESTION           TRANSFORMATION       SERVING
─────────────         ─────────           ──────────────       ────────
DLD Transaction  ─→   Apache Airflow  ─→   dbt (SQL models) ─→  MongoDB (operational)
  feed (CSV)          Orchestrator         transformation       Elasticsearch (search)
                                           layer                Redis (cache)
Bayut API       ─→    API connectors  ─→   Staging tables  ─→   Metabase (BI)
PropertyFinder        (Python)             (PostgreSQL)         Grafana (ops metrics)
  API

WhatsApp        ─→    Real-time Kafka ─→   Stream proc.    ─→   WebSocket (live CRM)
  webhooks            (Phase 8+)           (Faust Python)       dashboard

CRM Events      ─→    MongoDB Atlas   ─→   Aggregation     ─→   KPI dashboard
  (Prisma)            Change Streams       pipeline             (React/SWR)
```

### 15.2 Tool Choices

| Layer | Tool | Rationale |
|-------|------|----------|
| Orchestration | Apache Airflow (managed: Astronomer) | Industry standard; Python DAGs; rich monitoring; UAE market data pipelines |
| Transformation | dbt (data build tool) | SQL-based transformations; version control; testing; documentation auto-generated |
| Operational DB | MongoDB Atlas | Already in stack; flexible schema for property data |
| Analytics DB | PostgreSQL (Amazon RDS or Supabase) | Best SQL analytics engine; dbt native; cheaper than Redshift at Phase 7 scale |
| Search | Elasticsearch 8.x | Arabic + English full-text; geospatial; facets |
| Cache | Redis (Upstash — serverless Redis) | Serverless = no idle cost; TTL cache for KPI aggregations and property queries |
| BI / Reporting | Metabase (open-source, self-hosted) | Free; PostgreSQL native; non-technical users can build dashboards; Arabic UI |
| Monitoring | Grafana (infrastructure) + Metabase (business KPIs) | Two-layer: tech + business metrics separated |

### 15.3 dbt Model Structure

```
models/
├── staging/           # Raw source data (1:1 with source)
│   ├── stg_dld_transactions.sql
│   ├── stg_cma_leads.sql
│   ├── stg_propertyfinder_leads.sql
│   └── stg_whatsapp_conversations.sql
├── intermediate/      # Business logic transformations
│   ├── int_property_pricing.sql        # Price per sqft calculations
│   ├── int_lead_qualification.sql      # BANT score computation
│   └── int_agent_performance.sql       # KPI calculations
└── marts/             # Final analytical models
    ├── mart_executive_kpis.sql         # MD dashboard data
    ├── mart_market_trends.sql          # Area price trends
    ├── mart_agent_leaderboard.sql      # Agent rankings
    └── mart_lead_funnel.sql            # Pipeline analytics
```

---

## 16. Security Technology Stack

### 16.1 Security Architecture by Layer

| Layer | Tool / Technology | Purpose | Status |
|-------|-----------------|---------|--------|
| Web Application Firewall (WAF) | Cloudflare (free tier → Pro) | Block SQLi, XSS, DDoS, rate limiting | ✅ Vercel edge + add Cloudflare Phase 2 |
| API Security | Helmet.js + express-rate-limit | Security headers, request throttling | ✅ Implemented |
| Authentication | Firebase + JWT (RS256) | Token-based auth with RERA role enforcement | ✅ Implemented |
| Secrets Management | Railway environment variables → HashiCorp Vault (Phase 5) | Never hardcode secrets; rotating API keys | ⏳ Phase 5 — Vault |
| Dependency scanning | `npm audit` + GitHub Dependabot | Catch vulnerable packages | ⏳ CI pipeline Phase 2 |
| SAST (Static Analysis) | ESLint security plugin + SonarCloud | Detect security anti-patterns in code | ⏳ Phase 2 |
| DAST (Dynamic Analysis) | OWASP ZAP (automated) | Scan running app for vulnerabilities | ⏳ Phase 5 (pre-launch security test) |
| Error tracking | Sentry (PII-scrubbed) | Production error visibility | ⏳ Phase 2 |
| Monitoring | Grafana + Prometheus | Anomaly detection (unusual login patterns, data spike) | ⏳ Phase 2 |
| Penetration testing | External provider (annual) | Independent security assessment | ⏳ Phase 5 (annual) |
| Incident response | Documented playbook (DPIA §11) | Structured breach response | ✅ Documented |

### 16.2 Vulnerability Management Process

```
DISCOVERY → TRIAGE → REMEDIATION → VERIFICATION → DOCUMENTATION

1. Discovery sources:
   ├── npm audit (CI pipeline — blocks deploy if critical)
   ├── Dependabot alerts (GitHub)
   ├── Sentry error reports (runtime vulnerabilities)
   ├── Penetration test findings (annual)
   └── Security researcher disclosure (via security@whitecaves.ae)

2. Triage: Classify by CVSS score:
   ├── Critical (9.0–10): Fix within 24 hours
   ├── High (7.0–8.9): Fix within 7 days
   ├── Medium (4.0–6.9): Fix within 30 days
   └── Low (0.1–3.9): Fix in next sprint

3. Remediation: Update dependency + regression test + deploy

4. Verification: Re-run scan to confirm fix

5. Documentation: Update Tech Debt Register with resolution
```

---

**Document Owner:** Technology (@Grace — Lead Engineer, @Radia — Security, @Ecem — Security Lead)
**Version History:** v1.0 April 2026 (initial); v2.0 April 2026 (expanded with proptech landscape, AI/ML choices, security stack)
**Review Cycle:** Quarterly — technology landscape changes rapidly
**Related Documents:**
- `business/05_srs_and_engineering/software-design-document-v2.md`
- `business/05_srs_and_engineering/technical-debt-register.md`
- `business/09_operations/vendor-management.md`
