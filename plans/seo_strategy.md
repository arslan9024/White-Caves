# SEO & Lead Generation Strategy

**Status**: Planned  
**Priority**: High  
**Estimated Effort**: 15 hours  
**Depends On**: Public pages (HomePage, PropertiesPage, PropertyDetailPage)

---

## Objective

Achieve top-10 Google ranking for Dubai real estate keywords. Drive organic traffic to property listings and convert visitors into qualified leads.

---

## Success Criteria

- [ ] Lighthouse SEO score: 100 on all public pages
- [ ] Structured data (JSON-LD) on every property listing
- [ ] Sitemap.xml auto-generated with all property URLs
- [ ] Page load <2s on 3G (Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] Organic traffic increase: 200% within 6 months of launch
- [ ] Meta tags (title, description, OG) unique per property

---

## Target Keywords (Dubai Real Estate)

| Keyword | Monthly Volume | Difficulty | Priority |
|---------|---------------|-----------|----------|
| "dubai apartments for sale" | 14,800 | High | ⭐⭐⭐ |
| "dubai real estate" | 33,100 | Very High | ⭐⭐ |
| "villa for sale dubai" | 6,600 | Medium | ⭐⭐⭐ |
| "dubai property for rent" | 9,900 | High | ⭐⭐⭐ |
| "luxury apartments dubai" | 3,600 | Medium | ⭐⭐⭐ |
| "jbr apartments for sale" | 1,300 | Low | ⭐⭐⭐ |
| "dubai marina rent" | 4,400 | Medium | ⭐⭐⭐ |
| "off plan dubai" | 5,400 | Medium | ⭐⭐ |
| "palm jumeirah villa" | 2,400 | Low | ⭐⭐⭐ |
| "business bay apartments" | 2,900 | Low | ⭐⭐⭐ |

---

## Implementation Checklist

### Phase 1: Technical SEO (8h)
- [ ] Create `src/utils/seo.ts` — SEO helper utilities
- [ ] Add `react-helmet-async` for dynamic meta tags per page
- [ ] Property pages: unique title, description, OG image from property photos
- [ ] JSON-LD structured data:
  - [ ] `RealEstateListing` schema on property pages
  - [ ] `Organization` schema on homepage
  - [ ] `BreadcrumbList` schema on all pages
  - [ ] `FAQPage` schema on about/services pages
- [ ] Auto-generated `sitemap.xml` (server-side, updated daily)
- [ ] `robots.txt` with sitemap reference
- [ ] Canonical URLs on all pages
- [ ] `hreflang` for en/ar versions (when i18n implemented)

### Phase 2: Content SEO (4h)
- [ ] Area guides: create `/areas/:area` pages (Dubai Marina, JBR, Downtown, etc.)
- [ ] Blog section: `/blog` with real estate market insights
- [ ] Property descriptions: AI-generated SEO-optimized descriptions
- [ ] Internal linking: related properties, area guides from property pages
- [ ] Image alt text: descriptive, keyword-rich alternatives

### Phase 3: Lead Generation (3h)
- [ ] Property inquiry form → creates Lead in CRM automatically
- [ ] "Save Search" → creates SavedSearch + email alerts
- [ ] Exit intent popup with property match offer
- [ ] Google Ads landing page templates (UTM parameter tracking)
- [ ] Email capture: market report download in exchange for email
- [ ] WhatsApp widget on property pages (direct to Nadia bot)

---

## Competitor SEO Analysis

| Competitor | Domain Authority | Indexed Pages | Speed | Structured Data |
|-----------|-----------------|---------------|-------|-----------------|
| **Property Finder** | 72 | 500K+ | Fast | Yes (full JSON-LD) |
| **Bayut** | 70 | 400K+ | Fast | Yes |
| **Dubizzle** | 75 | 1M+ | Medium | Partial |
| **Houza** | 45 | 50K | Fast | Yes |
| **White Caves** | NEW | <100 | Fast | ❌ Not yet |

**Our advantage**: Fresh domain can target long-tail keywords that established sites overlook. Focus on area-specific, luxury-segment, and investment-focused keywords.
