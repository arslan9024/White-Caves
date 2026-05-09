# SEO Strategy

> **Owner:** @Rachel | **Tool:** Google AI Studio (Gemini 2.0 Flash)
> **Module:** Rachel SEO + Marketing Analytics
> **Status:** Production-ready specification

`CONSUMES←@Marissa: business_docs/06_design_architecture/ui-ux-specification.md#seo-ux-copy`
`FEEDS→@Joelle: business_docs/09_crm_features/seo-strategy.md#persona-intents`

---

## 1. Overview

White Caves Real Estate targets affluent buyers, investors, and renters in Dubai's premium property market. The SEO strategy focuses on three objectives:

1. **Rank for high-intent Dubai property keywords** (buy, rent, invest)
2. **Capture local SEO** (Google Business Profile + RERA agent visibility)
3. **Pass Core Web Vitals** on all devices (required for Google ranking signals since 2021)

All SEO metadata is generated server-side for public pages and injected via React Helmet / `useSEO()` hook. Structured data (JSON-LD) is embedded at the page level.

---

## 2. Dubai Keyword Clusters

### 2.1 Cluster 1 — Buy Keywords (High Intent, High Competition)

| Keyword | Monthly Vol (est.) | Competition | Target Page |
|---------|-------------------|-------------|-------------|
| buy villa Dubai | 14,800 | High | /properties?purpose=sale&type=villa |
| buy apartment Dubai | 22,000 | High | /properties?purpose=sale&type=apartment |
| luxury villa Dubai for sale | 8,100 | Medium | /properties?purpose=sale&type=villa&luxury=true |
| off plan properties Dubai | 27,000 | High | /off-plan |
| properties for sale Palm Jumeirah | 5,400 | Medium | /properties?area=palm-jumeirah |
| freehold property Dubai | 6,600 | Medium | /about#freehold |
| title deed transfer Dubai | 3,200 | Low | /tools/title-deed-registration |

### 2.2 Cluster 2 — Rent Keywords (High Volume, Mid Intent)

| Keyword | Monthly Vol (est.) | Competition | Target Page |
|---------|-------------------|-------------|-------------|
| rent apartment Dubai | 33,100 | High | /properties?purpose=rent&type=apartment |
| apartment for rent Downtown Dubai | 9,900 | High | /properties?area=downtown-dubai&purpose=rent |
| 2BR apartment JVC rent | 4,400 | Low | /properties?area=jvc&bedrooms=2&purpose=rent |
| furnished apartment Dubai monthly | 8,100 | Medium | /properties?furnished=true&purpose=rent |
| studio apartment Dubai Marina rent | 6,600 | Medium | /properties?area=dubai-marina&type=studio |
| Ejari renewal process Dubai | 1,900 | Low | /services#ejari |

### 2.3 Cluster 3 — Investment Keywords (HNWI Intent)

| Keyword | Monthly Vol (est.) | Competition | Target Page |
|---------|-------------------|-------------|-------------|
| off plan projects Dubai Marina | 3,600 | Medium | /off-plan?area=dubai-marina |
| Dubai property investment 2025 | 5,400 | High | /blog/dubai-investment-guide |
| ROI Dubai property | 2,900 | Low | /tools/roi-calculator |
| Dubai real estate market report | 3,200 | Medium | /blog/market-report |
| RERA developer rating | 1,200 | Low | /blog/rera-developer-guide |
| Golden Visa property Dubai | 4,400 | High | /services#golden-visa |

### 2.4 Cluster 4 — Arabic Keywords (AR Language Pages)

| Arabic Keyword (transliterated) | Intent | Target Page (AR) |
|--------------------------------|--------|-----------------|
| شقق للبيع في دبي (Apartments for sale Dubai) | Buy | /ar/properties?purpose=sale |
| فيلا للإيجار دبي (Villa for rent Dubai) | Rent | /ar/properties?purpose=rent&type=villa |
| استثمار عقاري دبي (Real estate investment Dubai) | Invest | /ar/blog/investment |
| مكتب للبيع في مركز دبي المالي العالمي (Office DIFC) | Commercial | /ar/properties?area=difc&type=office |

---

## 3. Core Web Vitals Targets

| Metric | Current Baseline | Target | Measurement Tool |
|--------|-----------------|--------|-----------------|
| **LCP** (Largest Contentful Paint) | ~3.2s | **< 2.5s** | Lighthouse / CrUX |
| **FID** (First Input Delay) | ~85ms | **< 100ms** | CrUX real user data |
| **CLS** (Cumulative Layout Shift) | ~0.08 | **< 0.1** | Lighthouse |
| **INP** (Interaction to Next Paint) | ~180ms | **< 200ms** | CrUX (replaces FID in 2024) |
| **TTFB** (Time to First Byte) | ~650ms | **< 600ms** | WebPageTest |

### 3.1 Optimisation Actions

| Issue | Fix | Priority |
|-------|-----|----------|
| Hero image not preloaded | Add `<link rel="preload" as="image">` for above-fold hero | P0 |
| Property card images lazy load too late | Use `loading="lazy"` only below fold (first 4 cards: eager) | P1 |
| Font FOUT causing CLS | Preconnect to Google Fonts + `font-display: swap` | P1 |
| Large bundle initial JS | Already code-split — verify homepage chunk < 80kB gzip | P2 |
| Missing `sizes` on responsive images | Add `sizes="(max-width: 768px) 100vw, 50vw"` on property cards | P2 |

---

## 4. Local SEO Setup

### 4.1 Google Business Profile

| Field | Value |
|-------|-------|
| Business Name | White Caves Real Estate LLC |
| Category | Real Estate Agency |
| Address | Unit [TBD], [Building], Dubai, UAE |
| Phone | +971 [company number] |
| Website | https://www.whitecaves.com |
| Hours | Mon–Fri 9am–6pm, Sat 10am–4pm |
| Service Areas | All Dubai areas |
| Attributes | Online estimates, appointment required |

**Monthly tasks:** Respond to all reviews within 48h, post 2 Google Business updates/month (new listing spotlight + market report).

### 4.2 RERA Agent Profile Optimisation

- Ensure all listed agents have complete RERA BRN profiles at rera.gov.ae
- Link individual agent profile pages (`/agents/{slug}`) with structured data (`Person` schema)
- Agent pages include: photo, BRN, languages spoken, active listings count, review aggregation

---

## 5. Structured Data Schemas (JSON-LD)

### 5.1 RealEstateListing (property detail pages)

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "3BR Apartment in Dubai Marina",
  "description": "...",
  "url": "https://www.whitecaves.com/properties/3br-apartment-dubai-marina-001",
  "image": ["https://..."],
  "offers": {
    "@type": "Offer",
    "price": 2500000,
    "priceCurrency": "AED",
    "availability": "https://schema.org/InStock"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Dubai Marina",
    "addressRegion": "Dubai",
    "addressCountry": "AE"
  },
  "numberOfRooms": 3,
  "floorSize": { "@type": "QuantitativeValue", "value": 1650, "unitCode": "FTK" }
}
```

### 5.2 LocalBusiness (homepage + about page)

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "White Caves Real Estate LLC",
  "url": "https://www.whitecaves.com",
  "logo": "https://www.whitecaves.com/logo.png",
  "sameAs": [
    "https://www.instagram.com/whitecaves",
    "https://www.linkedin.com/company/whitecaves"
  ],
  "address": { "@type": "PostalAddress", "addressCountry": "AE", "addressRegion": "Dubai" },
  "openingHoursSpecification": [...],
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": 4.8, "reviewCount": 127 }
}
```

### 5.3 FAQPage (FAQ section, blog posts)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I register an Ejari in Dubai?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ejari registration is done online at ejari.ae or at RERA typing centres..."
      }
    }
  ]
}
```

---

## 6. Arabic / English Multilingual SEO

### 6.1 hreflang Tags

```html
<link rel="alternate" hreflang="en" href="https://www.whitecaves.com/properties" />
<link rel="alternate" hreflang="ar" href="https://www.whitecaves.com/ar/properties" />
<link rel="alternate" hreflang="x-default" href="https://www.whitecaves.com/properties" />
```

### 6.2 Arabic Meta Tags

```html
<html lang="ar" dir="rtl">
<meta name="description" content="ابحث عن شقق وفلل للبيع والإيجار في دبي مع وايت كيفز للعقارات" />
<title>عقارات دبي للبيع والإيجار | وايت كيفز</title>
```

### 6.3 Arabic Keyword Strategy

- Use Modern Standard Arabic (MSA) for meta tags
- Use Gulf Arabic variations in blog content (more natural for UAE audience)
- Avoid direct translation — localise intent (Dubai residents search differently)
- Arabic property description minimum: 150 words per listing for indexing

---

## 7. Sitemap and Robots

### 7.1 sitemap.xml Structure

```
/sitemap.xml
  /sitemap-index.xml
    /sitemap-static.xml          ← homepage, about, services, contact
    /sitemap-properties.xml      ← all active property listing URLs
    /sitemap-blog.xml            ← all published blog posts
    /sitemap-tools.xml           ← calculator, ROI tool, Ejari guide
```

Auto-generated by `scripts/generate-seo-assets.js` (existing script).

### 7.2 robots.txt

```
User-agent: *
Disallow: /owner/
Disallow: /admin/
Disallow: /api/
Allow: /

Sitemap: https://www.whitecaves.com/sitemap.xml
```

---

## 8. SEO Monitoring & Reporting

| Tool | Purpose | Frequency |
|------|---------|-----------|
| Google Search Console | Impressions, clicks, position, Core Web Vitals | Weekly review |
| Lighthouse CI | CWV regression detection | On every PR via CI |
| Ahrefs / SEMrush | Keyword rank tracking | Monthly |
| GA4 | Organic traffic, session duration, conversion rate | Weekly |
| Google Business Insights | Local search impressions, direction requests | Monthly |

**Monthly SEO Report to MD:** Rankings for top 20 keywords + CWV pass/fail + organic traffic trend.

---

## 9. Validation Rules

| Rule | Check |
|------|-------|
| Every property page must have `<title>` < 60 chars | ESLint / SSR check |
| Every property page must have `<meta name="description">` 120–160 chars | CI validation |
| Structured data must validate via schema.org validator | CI job |
| hreflang must be present on all bilingual pages | CI check |
| Sitemap regenerated on every property create/update/delete | Event-driven |

---

## 10. Failure and Edge Handling

| Scenario | Handling |
|----------|----------|
| Property deleted → still in sitemap | Sitemap regeneration removes it; Google recrawls within 48h |
| Duplicate content (same listing, multiple URLs) | Canonical tag on all variants pointing to primary URL |
| Paginated property list | `rel="next"` / `rel="prev"` tags on listing pages |
| Image CDN down | `alt` text always present; structured data `image` field omitted gracefully |

---

## 11. Tests

| Test | Type | Target |
|------|------|--------|
| `useSEO()` sets correct title and description | Unit | hook |
| Sitemap includes all active properties | Integration | generate-seo-assets |
| Schema.org JSON-LD valid on property detail page | E2E | Playwright |
| hreflang tags present on `/ar/` pages | Unit | SSR render |
| Core Web Vitals pass in Lighthouse CI | E2E | CI pipeline |

---

## 12. Rollback / Migration Plan

- SEO meta changes: immediate effect, rollback via git revert — no data migration
- Sitemap: auto-regenerated — worst case stale for 24h until next cron run
- Structured data schema changes: additive only; removing fields has no breaking impact on indexing
- Arabic pages: can be toggled by `LanguageProvider` default setting without DB change