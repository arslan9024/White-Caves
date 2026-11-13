# AEGIS Web & CRM Decoupling Migration Ledger

> **Policy:** `TURING-SEPARATION-010` & `TURING-BOOK-011`  
> **Status:** Active Wave  
> **Target:** Decouple public customer-facing website (`White-Caves-Web` / Next.js) from internal enterprise CRM (`White-Caves-Frontend` / Vite SPA).

---

## Migration Tracker

| Step   | Component / Section                    | Source (`White-Caves-Frontend`)                                      | Target (`White-Caves-Web`)                    | Performance & UX Improvements                                                                                                                                                                                   | Status        |
| :----- | :------------------------------------- | :------------------------------------------------------------------- | :-------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------ |
| **01** | **Brand Logo & Glowing Overhang Ring** | `TopNavbar.style.ts` (`OverhangingLogoWrapper`) & `PublicNavbar.tsx` | `src/components/Brand/BrandLogo.tsx`          | Exact 68-74px circular red ring (`border: 3.5px solid #EF4444`), translateY overhang past navbar bottom border, glow `0 8px 30px rgba(239, 68, 68, 0.45)`, green live status node, Next.js `<Image priority />` | **COMPLETED** |
| **02** | **Public Navigation Bar**              | `PublicNavbar.tsx` (Vite)                                            | `Navbar.tsx` (Next.js App Router)             | SSR prefetching, mobile drawer, theme integration                                                                                                                                                               | _Next_        |
| **03** | **Luxury Hero Immersion**              | `LuxuryHeroSection.tsx`                                              | `src/components/Hero/Hero.tsx`                | Turbopack static pre-render, LCP preloading                                                                                                                                                                     | _Queued_      |
| **04** | **Market Telemetry / Stats**           | `MarketStatsBanner.tsx`                                              | `src/components/MarketStats/`                 | Cached API route fetch, zero client bundle weight                                                                                                                                                               | _Queued_      |
| **05** | **Featured Properties Grid**           | `FeaturedPropertiesSection.tsx`                                      | `src/components/Properties/`                  | Static page generation + ISR, instant thumbnail cache                                                                                                                                                           | _Queued_      |
| **06** | **Off-Plan Showcase**                  | `OffPlanTracker.tsx`                                                 | `src/app/off-plan/`                           | Standalone SEO routes, SSR dynamic metadata                                                                                                                                                                     | _Queued_      |
| **07** | **Area Guides & Interactive Map**      | `AreaGuideGrid.tsx`, `MapContainer.tsx`                              | `src/components/AreaGuides/`                  | Leaflet/MapLibre dynamic import without SSR hydration penalties                                                                                                                                                 | _Queued_      |
| **08** | **Testimonial Podium & Trust**         | `TestimonialPodium.tsx`, `RegulatoryTrustStrip.tsx`                  | `src/components/Testimonials/`, `TrustStrip/` | SEO Schema.org microdata JSON-LD injection                                                                                                                                                                      | _Queued_      |
| **09** | **WhatsApp Concierge & Tools**         | `WhatsAppConciergePill.tsx`, `ToolsDashboard.tsx`                    | `src/components/Concierge/`, `Tools/`         | Serverless direct lead forwarding to WhatsApp Linda / Server                                                                                                                                                    | _Queued_      |
| **10** | **Public Footer**                      | `Footer.tsx`                                                         | `src/components/Footer/Footer.tsx`            | Canonical DLD/RERA license badge, structured links                                                                                                                                                              | _Queued_      |

---

## Architectural Rules Established During Step 01

1. **Next.js Native Image Pipeline:** All brand assets must use `next/image` with explicit `width`, `height`, and `priority` when above the fold to guarantee zero cumulative layout shift (CLS = 0).
2. **Unified Color Palette:** The signature White Caves Red `#EF4444` and Deep Onyx `#070B14` remain invariant across Web and CRM.
3. **Clean Decoupling:** When a public component is migrated to `White-Caves-Web`, legacy and dead code in `White-Caves-Frontend` is purged and covered by Vitest regression tests.
