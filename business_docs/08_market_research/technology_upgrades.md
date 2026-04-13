# Technology Upgrades Roadmap

> **Last Updated**: April 14, 2026  
> **Purpose**: Research-backed technology recommendations for White Caves platform  
> **Source**: Industry analysis, competitor benchmarking, Dubai market requirements

---

## 1. AI & Machine Learning

### Current State
- 26 AI assistant personas defined in `/business_docs/03_ai_assistants/`
- Nina NLP engine (intent detection, sentiment analysis) — Phase 3 complete
- Conversation memory and routing — implemented
- Lead scoring field exists (`Lead.score` 0-100) — manual scoring only

### Recommendations

| Technology | Use Case | Impact | Effort |
|-----------|----------|--------|--------|
| **Weighted scoring algorithm** | Replace manual lead scoring with behavior-based ML scoring | High — 2-3x lead conversion | 20h |
| **OpenAI/Llama API** | AI-generated property descriptions, market reports, email drafts | High — 10x content speed | 15h |
| **Sentiment analysis** | Real-time customer sentiment on WhatsApp conversations | Medium — better routing | 8h |
| **Price prediction** | ML model for property valuation based on area + type + historical data | High — unique feature | 40h |
| **Document OCR** | Extract data from Emirates ID, title deeds, contracts using Tesseract.js | Medium — reduce manual entry | 12h |

### Recommended Stack
- **Lead scoring**: Custom weighted algorithm (Phase 1), then TensorFlow.js model (Phase 2)
- **Content generation**: OpenAI GPT-4 API or Llama 3 (self-hosted for privacy)
- **Document processing**: Tesseract.js (OCR) + pdf-lib (PDF generation)

---

## 2. AR/VR & 3D Tours

### Current State
- No virtual tour implementation
- PropertyMap component exists for location display
- DubaiMap component exists for area visualization

### Recommendations

| Technology | Use Case | Cost | Browser Support |
|-----------|----------|------|----------------|
| **Pannellum** | 360° photo tours (open-source) | Free | All modern browsers |
| **model-viewer** | AR furniture placement (Google) | Free | Chrome, Safari (AR) |
| **React Three Fiber** | Custom 3D property models | Free | WebGL browsers |
| **Matterport SDK** | Professional 3D scanning | $70/mo/space | All browsers |
| **WebXR API** | Full VR headset support | Free | Chrome, Edge |

### Recommendation
Start with **Pannellum** for 360° tours + **model-viewer** for AR (both free). Upgrade to Matterport for premium listings only. See `plans/ar_vr_tours.md` for detailed implementation plan.

---

## 3. Payment Gateways & Multi-Currency

### Current State
- `stripe` package already in dependencies (v5.3.0)
- No payment routes or services implemented
- Commission model tracks amounts but no actual payment flow

### Recommendations

| Gateway | AED Support | Integration | Fees |
|---------|:---:|-----------|------|
| **Stripe UAE** | ✅ | Already in deps, days to integrate | 2.9% + 1 AED |
| **Checkout.com** | ✅ | Good MENA presence, enterprise clients | 2.5% + custom |
| **Tabby** | ✅ | Buy-now-pay-later for installments | Varies |
| **PayTabs** | ✅ | Local UAE provider | 2.8% |

### Recommendation
**Stripe UAE** first (already a dependency). Add multi-currency (AED/USD/EUR/GBP) with Stripe's auto-conversion. See `plans/payment_gateways.md` for full plan.

---

## 4. MongoDB Performance & Scaling

### Current State
- Prisma 6.6 ORM with MongoDB
- 15 models, 60+ indexes defined in schema
- No sharding, no Redis caching layer
- Docker Compose includes Redis (configured but unused in application code)

### Recommendations

| Optimization | Impact | Effort |
|-------------|--------|--------|
| **Redis caching** | 10x faster repeated queries (dashboards, listings) | 8h |
| **Query explain()** audit | Identify COLLSCAN queries, add missing indexes | 4h |
| **Aggregation pipelines** | Replace multiple queries with single aggregation for reports | 12h |
| **Connection pooling** | Prisma already handles this — verify pool size for prod | 2h |
| **Read replicas** | Secondary reads for analytics/reports | Infra only |
| **Atlas Search** | Full-text search on property titles/descriptions (replace `contains`) | 6h |

### Recommendation
1. **Immediate**: Run `explain()` on top 20 most-called endpoints. Add missing indexes.
2. **Phase 2**: Add Redis caching for dashboard metrics and property search results (TTL: 5 min).
3. **Phase 3**: MongoDB Atlas Search for full-text property search (replaces Prisma's slow `contains` filter).

---

## 5. Internationalization (i18n)

### Current State
- `src/i18n/` directory exists (foundation)
- Language toggle in navigation state (Redux: `navigationSlice.language`)
- No RTL CSS support
- No Arabic translation files

### Recommendations

| Technology | Purpose |
|-----------|---------|
| **react-i18next** | Industry-standard React i18n library |
| **i18next-browser-languagedetector** | Auto-detect browser language |
| **CSS logical properties** | `margin-inline-start` instead of `margin-left` for RTL |
| **Noto Sans Arabic** | Google font, free, excellent Arabic rendering |

### Recommendation
See `plans/i18n_rtl.md` for full implementation plan (25h effort). Critical for Dubai market.

---

## 6. Security Hardening

### Current State (Strong Foundation)
- JWT authentication with bcrypt (12 rounds)
- 12-role RBAC with 50+ permissions
- 5 rate limiters (auth, register, password, API, strict)
- Helmet.js (14 security headers including CSP)
- Input sanitization middleware

### Recommendations

| Enhancement | Category | Effort |
|------------|----------|--------|
| **OWASP ZAP scan** | Vulnerability detection | 4h |
| **Firebase Admin SDK** verify | Server-side token verification (not just client) | 4h |
| **Audit logging** | Immutable activity log for compliance (RERA requirement) | 8h |
| **GDPR/PDPL consent** | UAE Personal Data Protection Law (effective 2022) | 6h |
| **2FA enforcement** | TOTP-based 2FA for admin/owner roles | 8h |
| **API key rotation** | Automated rotation for external API keys | 4h |

### UAE PDPL (Personal Data Protection Law)
- **Effective**: January 2, 2022 (enforced since 2024)
- **Scope**: Processing personal data of UAE residents
- **Requirements**: Consent collection, data minimization, right to erasure, breach notification (72h)
- **Penalties**: Up to AED 5M for violations
- **Action**: Add consent management to registration flow, implement data export/delete endpoints

---

## 7. Deployment & Scaling

### Current State
- Docker multi-stage build ready
- Vercel deployment configured (vercel.json)
- Kubernetes manifests (k8s/) and Helm charts ready
- Nginx reverse proxy configuration

### Recommendations

| Strategy | Benefit | Cost |
|---------|---------|------|
| **Vercel Edge Functions** | <50ms global latency for API | $20/mo hobby, $150/mo pro |
| **Cloudflare CDN** | Asset caching, DDoS protection, WAF | Free tier available |
| **AWS S3 + CloudFront** | Image hosting for property photos | ~$0.023/GB |
| **Upstash Redis** | Serverless Redis for Vercel (no Docker needed) | Free 10K/day |
| **MongoDB Atlas** | Managed DB with auto-scaling | $57/mo M10 |

### Recommendation
**Production MVP**: Vercel (app) + MongoDB Atlas (DB) + Cloudflare (CDN) + AWS S3 (images).
**Scale**: Add Redis (Upstash), enable read replicas on Atlas, add Cloudflare WAF.

---

## 8. SEO & Performance

### Current State
- Vite build with 8-way code splitting (vendor chunks)
- Lazy-loaded routes (50+ pages)
- Open Graph meta tags in index.html (static)
- No JSON-LD structured data
- No sitemap.xml
- No dynamic meta tags per page

### Recommendations
See `plans/seo_strategy.md` for full plan (15h). Critical items:
1. `react-helmet-async` for per-page meta tags
2. JSON-LD `RealEstateListing` schema on property pages
3. Auto-generated sitemap.xml
4. Area guide pages for long-tail SEO

---

## Implementation Priority Matrix

```
HIGH IMPACT, LOW EFFORT (Do First)
├── RERA permit display (4h)
├── JSON-LD structured data (8h)
├── Redis caching for dashboards (8h)
├── query explain() audit (4h)
└── react-helmet-async SEO (4h)

HIGH IMPACT, HIGH EFFORT (Plan Carefully)
├── Arabic/RTL i18n (25h)
├── AI lead scoring (20h)
├── Stripe payment integration (30h)
└── 360° virtual tours (20h)

LOW IMPACT, LOW EFFORT (Quick Wins)
├── Mortgage calculator (6h)
├── Share property button (2h)
├── Agent verification badges (8h)
└── Enhanced error pages (4h)

LOW IMPACT, HIGH EFFORT (Defer)
├── Full VR walkthrough (40h)
├── Price prediction ML (40h)
└── Mobile native apps (200h+)
```

---

## Sources
- Meta WhatsApp Cloud API Documentation (developers.facebook.com)
- Stripe UAE Documentation (stripe.com/docs)
- MongoDB Atlas Documentation (mongodb.com/docs/atlas)
- OWASP Top 10 2021 (owasp.org)
- UAE PDPL Federal Decree-Law No. 45 of 2021
- Matterport Developer Documentation (matterport.com)
- Google model-viewer (modelviewer.dev)
