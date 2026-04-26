# Phase 1 — Public Homepage (Frontend First, Dummy Data)

> **Priority**: #1 — Highest  
> **Goal**: A complete, polished, publicly visible homepage that showcases White Caves  
> **Approach**: All content uses static/dummy data — no backend dependency  
> **Status**: 🚧 In Progress — shell exists, sections need polishing

---

## Why This Is Priority #1

The homepage is the first thing every visitor, investor, and potential client sees. It must look
production-quality and convey trust before we wire up any real data. Using dummy data means we can
build and iterate the full visual experience independently of the backend, deploy it today, and
swap in real data later without changing any component code.

---

## What Already Exists ✅

| Component | Location | Status |
|-----------|----------|--------|
| `HomePage.tsx` | `src/pages/HomePage.tsx` | ✅ Exists — renders all sections via lazy Suspense |
| `HOME_PROPERTIES` dummy data | `src/data/homeProperties.ts` | ✅ 10 Dubai luxury properties |
| `Hero` section | `src/components/homepage/Hero/` | ✅ Animated counter, typewriter, parallax scroll |
| `Features` section | `src/components/homepage/Features/` | ✅ Platform feature cards |
| `Locations` section | `src/components/homepage/Locations/` | ✅ Dubai area cards |
| `Team` section | `src/components/homepage/Team/` | ✅ 3+ team members with dummy data |
| `Testimonials` section | `src/components/homepage/Testimonials/` | ✅ Client quotes |
| `ContactCTA` section | `src/components/homepage/Contact/` | ✅ Call-to-action with contact form |
| `DubaiMap` | `src/components/DubaiMap.tsx` | ✅ Interactive property map |
| `PropertyComparison` | `src/components/PropertyComparison.tsx` | ✅ Side-by-side compare tool |
| `BlogSection` | `src/components/BlogSection.tsx` | ✅ Dummy blog articles |
| `NewsletterSubscription` | `src/components/NewsletterSubscription.tsx` | ✅ Email capture form |
| `Footer` | `src/components/Footer.tsx` | ✅ Links, socials, legal |
| AppLayout + Navbar | `src/components/layout/AppLayout.tsx` | ✅ Unified top bar + nav |
| SEO meta tags | `HomePage.tsx` + `useDocumentTitle` | ✅ Title, OG, JSON-LD |

---

## What Needs To Be Done 🚧

### 1.1 — Hero Section Polish
**Goal**: Hero is the most important above-the-fold section. It must instantly communicate luxury Dubai real estate.

- [ ] Verify Hero background image/video is high quality (currently CSS gradient — add a real hero image from Unsplash/local assets)
- [ ] Stats counter (`200+ Agents`, `5000+ Properties`, `AED 2B+ Sold`) — confirm numbers are prominent and animate on scroll-into-view
- [ ] CTA buttons: "Browse Properties" → `/properties` and "Book Consultation" → `/contact` — verify both navigate correctly
- [ ] Search bar in Hero (area, property type, min/max price) — if hidden, surface it prominently
- [ ] Mobile responsiveness: hero must look polished on 375px iPhone and 768px iPad
- [ ] Lighthouse performance score on hero load: aim for > 90 (hero image should be WebP + lazy-loaded below fold)

**Dummy data to add** (if not present):
```ts
// src/data/heroStats.ts
export const HERO_STATS = [
  { value: 200, suffix: '+', label: 'Expert Agents' },
  { value: 5000, suffix: '+', label: 'Properties Listed' },
  { value: 2, suffix: 'B+', label: 'AED in Transactions' },
  { value: 15, suffix: '+', label: 'Years in Dubai' },
];
```

---

### 1.2 — Featured Properties Section
**Goal**: Showcase the best listings with real-looking card UI.

- [ ] Add a `FeaturedProperties` section to `HomePage.tsx` if not already visible (render 3–6 cards from `HOME_PROPERTIES`)
- [ ] Each property card must show: image, title, price (AED), beds/baths/sqft, location badge, "View Details" button
- [ ] Carousel / horizontal scroll on mobile (3 cards → swipe)
- [ ] Property images: use Unsplash placeholder URLs or local `/public/images/` assets
- [ ] "View All Properties" link at the bottom → `/properties`

**Dummy property card data** already in `src/data/homeProperties.ts` — just needs a rendered section.

---

### 1.3 — Locations / Areas Section
**Goal**: Highlight top Dubai areas with a visual grid.

- [ ] Confirm `Locations` component renders: Palm Jumeirah, Downtown Dubai, Dubai Marina, JBR, Business Bay, Dubai Hills
- [ ] Each location tile: background image, area name, avg. price per sqft (dummy), property count (dummy)
- [ ] Hover/click: navigate to `/properties?area=palm-jumeirah` (filtered properties page)
- [ ] Section is responsive: 3 columns desktop → 2 columns tablet → 1 column mobile

**Dummy location data**:
```ts
export const DUBAI_AREAS = [
  { name: 'Palm Jumeirah', image: '…unsplash url…', avgPricePerSqft: 3200, listings: 142 },
  { name: 'Downtown Dubai', image: '…', avgPricePerSqft: 2800, listings: 89 },
  { name: 'Dubai Marina', image: '…', avgPricePerSqft: 1900, listings: 213 },
  { name: 'Jumeirah Beach Residence', image: '…', avgPricePerSqft: 1700, listings: 97 },
  { name: 'Business Bay', image: '…', avgPricePerSqft: 1600, listings: 175 },
  { name: 'Dubai Hills Estate', image: '…', avgPricePerSqft: 1800, listings: 121 },
];
```

---

### 1.4 — Why White Caves / Features Section
**Goal**: Communicate USPs clearly.

- [ ] Confirm `Features` section renders 6 feature cards
- [ ] Features must include: AI-powered matching, WhatsApp-first communication, RERA-compliant, multi-lingual support, 24/7 availability, verified listings
- [ ] Each card: icon (Lucide), headline, 1-line description
- [ ] Section must be visible on mobile without horizontal scroll

---

### 1.5 — Team Section
**Goal**: Build trust by showing real faces.

- [ ] Confirm `Team` component renders with at least 4 team members
- [ ] Each member: photo (Unsplash URL), name, title, short bio, LinkedIn link
- [ ] Carousel or grid — must work on mobile
- [ ] "Meet the Full Team" link → `/about`

---

### 1.6 — Testimonials Section
**Goal**: Social proof from real (dummy) clients.

- [ ] Confirm `Testimonials` renders at least 4 reviews
- [ ] Each review: client name, location (e.g., "Purchased in Dubai Marina"), star rating (5/5), quote text, date
- [ ] Auto-scroll carousel with manual controls
- [ ] Visually premium — gold star ratings, italic quote text

---

### 1.7 — Contact / CTA Section
**Goal**: Capture leads from the homepage.

- [ ] `ContactCTA` section is visible above the footer
- [ ] Form fields: Name, Email, Phone, Message, "I'm a: Buyer / Seller / Investor / Tenant" dropdown
- [ ] On submit: show success message (no backend needed — just UI confirmation for now)
- [ ] WhatsApp "Chat with us" button: opens `wa.me/971XXXXXXXX` in new tab
- [ ] Phone number prominently displayed

---

### 1.8 — Navigation & Routing
**Goal**: All nav links work and feel polished.

- [ ] Top navbar: Logo | Properties | About | Services | Careers | Contact | **[Sign In]** button
- [ ] Logo click → `/`
- [ ] "Sign In" button → `/signin`
- [ ] Sticky navbar on scroll with background blur effect
- [ ] Mobile: hamburger menu with slide-in drawer

---

### 1.9 — Footer
**Goal**: Professional, complete footer.

- [ ] Columns: Company (About, Careers, Blog), Services (Buy, Sell, Rent, Invest), Areas, Contact info
- [ ] Social icons: LinkedIn, Instagram, Facebook, X/Twitter
- [ ] Copyright: "© 2026 White Caves Real Estate. All rights reserved."
- [ ] RERA license number (dummy: `RERA-12345`)
- [ ] Links to `/privacy-policy` and `/terms` (pages can be placeholder for now)

---

### 1.10 — Mobile Responsiveness Audit
**Goal**: Perfect display at 375px, 768px, 1024px, 1440px.

- [ ] Run through all homepage sections at each breakpoint
- [ ] No horizontal overflow anywhere
- [ ] Touch targets ≥ 44px on mobile
- [ ] Images load correctly (WebP with fallback)
- [ ] Animations don't cause jank on mobile (prefers-reduced-motion respected)

---

### 1.11 — Performance & SEO
**Goal**: Lighthouse scores all > 90.

- [ ] Hero image uses `<img loading="lazy">` below fold, `loading="eager"` for above-fold
- [ ] All section images use the `ResponsiveImage` component (`src/components/ui/ResponsiveImage/`)
- [ ] Meta title: "White Caves Real Estate — Dubai Luxury Properties"
- [ ] Meta description: 155-character description including "Dubai", "luxury", "RERA"
- [ ] Open Graph image: 1200×630 brand image
- [ ] JSON-LD: `Organization` + `RealEstateAgent` schema (already partially in place)

---

## Dummy Data Strategy

All data on the homepage uses static files — **no API calls needed**:

| Data | File | 
|------|------|
| Featured properties | `src/data/homeProperties.ts` |
| Team members | Inline in `Team.tsx` |
| Testimonials | Inline in `Testimonials.tsx` |
| Dubai areas | Inline in `Locations.tsx` |
| Blog posts | Inline in `BlogSection.tsx` |
| Hero stats | Inline in `Hero.tsx` |

When real data is available (Phase 3+), these files can be swapped for API calls without changing any component code.

---

## Definition of Done — Phase 1

- [ ] All homepage sections render correctly at 375px, 768px, 1024px, and 1440px viewport widths
- [ ] No broken links, no 404s, no console errors
- [ ] Lighthouse Performance > 90, SEO > 95, Accessibility > 92
- [ ] All images load (not broken Unsplash links or missing local files)
- [ ] "Sign In" button navigates to `/signin`
- [ ] "Browse Properties" button navigates to `/properties`
- [ ] Contact form shows success state on submit
- [ ] Footer copyright, RERA number, and social links are present
- [ ] Mobile hamburger menu opens and closes correctly
- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npx vitest run`

---

## Next Phase After This

Once Phase 1 is complete, move to **[PHASE_2_LANDLORD_TENANT.md](./PHASE_2_LANDLORD_TENANT.md)**.
