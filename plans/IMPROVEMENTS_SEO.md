# 🌐 SEO & Marketing Improvements

> **Phase assignments**: Phase 1, Phase 6  
> **Parent backlog**: [IMPROVEMENTS_BACKLOG.md](./IMPROVEMENTS_BACKLOG.md)  
> **Priority**: High for Phase 1 items — SEO is critical for Dubai real estate search rankings

---

## Item 27 — Dynamic OG Meta Tags for Property Pages

**Phase**: Phase 1  
**Current state**: `homepageSeo.ts` generates static meta tags for the homepage. Individual property detail pages (`/properties/:id`) share the same generic title, description, and image regardless of which property is viewed. Social shares and Google previews show generic content.

### What Needs Doing
- [ ] Update `PropertyDetailPage.tsx` to use `react-helmet-async` (install if not present: `npm install react-helmet-async`)
- [ ] For each property, dynamically generate:
  ```html
  <title>{property.title} — White Caves Real Estate Dubai</title>
  <meta name="description" content="AED {price} | {bedrooms}BR {type} in {area}, Dubai. {shortDescription}" />
  <meta property="og:title" content="{property.title}" />
  <meta property="og:description" content="..." />
  <meta property="og:image" content="{property.images[0]}" />
  <meta property="og:url" content="https://whitecaves.ae/properties/{id}" />
  <meta name="twitter:card" content="summary_large_image" />
  ```
- [ ] Add canonical URL tag on every property page to prevent duplicate content
- [ ] Add `HelmetProvider` wrapper at the root of `src/main.tsx` (if not already present)
- [ ] Test that social preview tools (opengraph.xyz, Twitter Card Validator) show property-specific content

### Acceptance Criteria
- Sharing a property link on WhatsApp shows the property photo and title in the preview
- Each property page has a unique `<title>` tag matching the property name
- Google Search Console shows no "missing description" warnings for property pages

---

## Item 28 — Sitemap Not Auto-Generated for New Properties

**Phase**: Phase 6  
**Current state**: `scripts/generate-seo-assets.js` generates a static `sitemap.xml`. New properties added to the database are not indexed in the sitemap until the script is manually re-run. Google cannot crawl newly listed properties.

### What Needs Doing
- [ ] Create `server/routes/sitemap.ts` — a live dynamic sitemap endpoint at `GET /sitemap.xml`
- [ ] The dynamic sitemap queries the database and returns an XML sitemap with all published properties + static pages:
  ```xml
  <url><loc>https://whitecaves.ae/properties/{id}</loc><lastmod>{updatedAt}</lastmod><priority>0.8</priority></url>
  ```
- [ ] Include static pages: homepage, `/properties`, `/about`, `/contact`, `/blog` at priority 1.0/0.9
- [ ] Cache the sitemap response for 1 hour in Redis (Item 19) or in-memory cache
- [ ] Invalidate sitemap cache when a property is published or unpublished
- [ ] Add sitemap URL to `robots.txt`: `Sitemap: https://whitecaves.ae/sitemap.xml`
- [ ] Remove the now-redundant `scripts/generate-seo-assets.js` once the dynamic route is live
- [ ] Submit the sitemap URL to Google Search Console

### Acceptance Criteria
- `GET /sitemap.xml` returns valid XML with all published properties
- After a new property is created and published, it appears in the sitemap within 1 hour
- `robots.txt` references the sitemap URL
- Google Search Console "Sitemap" status shows the URL as successfully fetched

---

## Item 29 — No Schema.org Structured Data (JSON-LD)

**Phase**: Phase 1  
**Current state**: Property detail pages have no JSON-LD structured data. Google cannot display rich results (price, location, bedrooms, availability) in search listings for White Caves properties. Competitors using JSON-LD get richer SERP displays and higher CTR.

### What Needs Doing
- [ ] Add a `<script type="application/ld+json">` block to `PropertyDetailPage.tsx` for each property:
  ```json
  {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": "{property.title}",
    "description": "{property.description}",
    "url": "https://whitecaves.ae/properties/{id}",
    "image": ["{property.images[0]}", "{property.images[1]}"],
    "offers": {
      "@type": "Offer",
      "price": "{property.price}",
      "priceCurrency": "AED",
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "{property.area}",
      "addressCountry": "AE"
    },
    "numberOfRooms": "{property.bedrooms}",
    "floorSize": { "@type": "QuantitativeValue", "value": "{property.size}", "unitCode": "MTK" },
    "broker": {
      "@type": "RealEstateAgent",
      "name": "White Caves Real Estate LLC",
      "url": "https://whitecaves.ae"
    }
  }
  ```
- [ ] Add Organization JSON-LD to the homepage for brand knowledge panel:
  ```json
  {
    "@type": "RealEstateAgent",
    "name": "White Caves Real Estate LLC",
    "address": { "@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE" },
    "telephone": "+971-XX-XXX-XXXX",
    "url": "https://whitecaves.ae",
    "sameAs": ["https://www.linkedin.com/company/white-caves", "https://instagram.com/whitecaves"]
  }
  ```
- [ ] Validate JSON-LD with Google's Rich Results Test tool before releasing
- [ ] Add `BreadcrumbList` JSON-LD to property pages for navigation breadcrumbs in SERPs

### Acceptance Criteria
- Google Rich Results Test shows zero errors for a property detail page
- Property pages show price and location as rich snippets in Google Search (may take weeks to appear after crawl)
- Homepage passes Organization schema validation
