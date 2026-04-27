# White Caves — Milestone Commit Grouping Plan
**Date:** 2026-04-27
**Purpose:** Split current working tree into clean milestone commits (Dubai Luxury roadmap-aligned)

---

## Commit 1 — CI/CD hardening + SEO quality gates
**Message:** `ci(cicd): harden workflows with pinned actions, timeouts, and SEO/runtime verification gates`

### Files
- `.github/workflows/ci.yml`
- `.github/workflows/cd.yml`
- `.github/workflows/pr-validation.yml`
- `.github/workflows/scheduled-testing.yml`
- `.github/workflows/node.js.yml`
- `playwright.config.ts`
- `package.json`
- `README.md`

### Stage command
```powershell
git add \
  .github/workflows/ci.yml \
  .github/workflows/cd.yml \
  .github/workflows/pr-validation.yml \
  .github/workflows/scheduled-testing.yml \
  .github/workflows/node.js.yml \
  playwright.config.ts package.json README.md
```

---

## Commit 2 — SEO ops scripts + generated public assets + tests
**Message:** `feat(seo-ops): add sitemap/robots generators, runtime verification, and ops test suite`

### Files
- `scripts/generate-seo-assets.js`
- `scripts/seo-routes.json`
- `scripts/verify-runtime-endpoints.js`
- `scripts/verify-deployment.js`
- `server/__tests__/generate-seo-assets.script.test.ts`
- `server/__tests__/verify-deployment.script.test.ts`
- `server/__tests__/verify-runtime-endpoints.script.test.ts`
- `public/robots.txt`
- `public/sitemap.xml`

### Stage command
```powershell
git add \
  scripts/generate-seo-assets.js scripts/seo-routes.json scripts/verify-runtime-endpoints.js scripts/verify-deployment.js \
  server/__tests__/generate-seo-assets.script.test.ts \
  server/__tests__/verify-deployment.script.test.ts \
  server/__tests__/verify-runtime-endpoints.script.test.ts \
  public/robots.txt public/sitemap.xml
```

---

## Commit 3 — Homepage live-data integration (API + Redux + sections)
**Message:** `feat(homepage): wire aggregate API + redux slice + live hybrid homepage sections`

### Files
- `server/routes/homepage.ts`
- `server/routes/homepage.test.ts`
- `server/routes/contact.ts`
- `server/index.ts`
- `src/store/slices/homepageSlice.ts`
- `src/store/slices/homepageSlice.test.ts`
- `src/store/store.tsx`
- `src/store/store.test.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/HomePage.test.tsx`
- `src/components/homepage/Hero/Hero.tsx`
- `src/components/homepage/Hero/Hero.css`
- `src/components/homepage/Hero/HeroSearchBar.tsx`
- `src/components/homepage/Hero/HeroSearchBar.css`
- `src/components/homepage/Locations/Locations.tsx`
- `src/components/homepage/Locations/Locations.css`
- `src/components/homepage/Team/Team.tsx`
- `src/components/homepage/Team/Team.css`
- `src/components/homepage/Testimonials/Testimonials.tsx`
- `src/components/homepage/Testimonials/Testimonials.css`
- `src/components/homepage/FeaturedProperties/FeaturedPropertiesSection.tsx`
- `src/components/homepage/FeaturedProperties/FeaturedPropertiesSection.css`
- `src/components/homepage/MarketStats/MarketStatsBanner.tsx`
- `src/components/homepage/MarketStats/MarketStatsBanner.css`
- `src/components/BlogSection.tsx`
- `src/components/BlogSection.test.tsx`
- `src/components/VirtualTourGallery.tsx`
- `src/components/VirtualTourGallery.test.tsx`
- `src/components/OffPlanTracker.tsx`
- `src/components/OffPlanTracker.test.tsx`
- `src/components/homepage/Contact/ContactCTA.tsx`
- `src/components/homepage/Contact/ContactCTA.css`
- `src/components/homepage/Contact/ContactCTA.test.tsx`
- `src/components/common/PropertyCard.tsx`
- `src/components/common/PropertyCard/PropertyCard.styles.ts`

### Stage command
```powershell
git add \
  server/routes/homepage.ts server/routes/homepage.test.ts server/routes/contact.ts server/index.ts \
  src/store/slices/homepageSlice.ts src/store/slices/homepageSlice.test.ts src/store/store.tsx src/store/store.test.tsx \
  src/pages/HomePage.tsx src/pages/HomePage.test.tsx \
  src/components/homepage/Hero/Hero.tsx src/components/homepage/Hero/Hero.css \
  src/components/homepage/Hero/HeroSearchBar.tsx src/components/homepage/Hero/HeroSearchBar.css \
  src/components/homepage/Locations/Locations.tsx src/components/homepage/Locations/Locations.css \
  src/components/homepage/Team/Team.tsx src/components/homepage/Team/Team.css \
  src/components/homepage/Testimonials/Testimonials.tsx src/components/homepage/Testimonials/Testimonials.css \
  src/components/homepage/FeaturedProperties/FeaturedPropertiesSection.tsx src/components/homepage/FeaturedProperties/FeaturedPropertiesSection.css \
  src/components/homepage/MarketStats/MarketStatsBanner.tsx src/components/homepage/MarketStats/MarketStatsBanner.css \
  src/components/BlogSection.tsx src/components/BlogSection.test.tsx \
  src/components/VirtualTourGallery.tsx src/components/VirtualTourGallery.test.tsx \
  src/components/OffPlanTracker.tsx src/components/OffPlanTracker.test.tsx \
  src/components/homepage/Contact/ContactCTA.tsx src/components/homepage/Contact/ContactCTA.css src/components/homepage/Contact/ContactCTA.test.tsx \
  src/components/common/PropertyCard.tsx src/components/common/PropertyCard/PropertyCard.styles.ts
```

---

## Commit 4 — SEO runtime utility layer
**Message:** `feat(seo): add runtime SEO utility, hook, and homepage JSON-LD builder with tests`

### Files
- `src/utils/seo.ts`
- `src/utils/seo.test.ts`
- `src/hooks/useSEO.ts`
- `src/hooks/useSEO.test.ts`
- `src/pages/homepageSeo.ts`
- `src/pages/homepageSeo.test.ts`

### Stage command
```powershell
git add src/utils/seo.ts src/utils/seo.test.ts src/hooks/useSEO.ts src/hooks/useSEO.test.ts src/pages/homepageSeo.ts src/pages/homepageSeo.test.ts
```

---

## Commit 5 — CRM leads hardening + validation alignment
**Message:** `feat(crm): align lead status/source enums, sanitize filters, and improve lead form validation UX`

### Files
- `server/routes/leads.ts`
- `server/routes/leads.test.ts`
- `server/services/LeadsService.ts`
- `server/services/LeadsService.test.ts`
- `prisma/schema.prisma`
- `src/pages/crm/hooks/useLeadManagement.ts`
- `src/pages/crm/hooks/useLeadManagement.test.ts`
- `src/pages/crm/LeadManagementPage.tsx`
- `src/pages/crm/LeadManagementPage.test.tsx`
- `src/pages/crm/styles/CrmPageStyles.ts`
- `src/shared/components/ui/Modal/Modal.styles.ts`
- `src/components/crm/inventory/__tests__/FilterDropdown.test.tsx`

### Stage command
```powershell
git add \
  server/routes/leads.ts server/routes/leads.test.ts \
  server/services/LeadsService.ts server/services/LeadsService.test.ts \
  prisma/schema.prisma \
  src/pages/crm/hooks/useLeadManagement.ts src/pages/crm/hooks/useLeadManagement.test.ts \
  src/pages/crm/LeadManagementPage.tsx src/pages/crm/LeadManagementPage.test.tsx \
  src/pages/crm/styles/CrmPageStyles.ts \
  src/shared/components/ui/Modal/Modal.styles.ts \
  src/components/crm/inventory/__tests__/FilterDropdown.test.tsx
```

---

## Commit 6 — Test infra/mock fixes + TS config compatibility + milestone docs
**Message:** `chore(qa): stabilize chart mocks, fix tsconfig alias compatibility, and update milestone tracking`

### Files
- `src/components/charts/TrendChart.test.tsx`
- `tsconfig.json`
- `DAILY_MILESTONE_TRACKER.md`
- `.github/copilot-instructions.md`
- `plans/MILESTONE_COMMIT_GROUPING_2026-04-27.md`

### Stage command
```powershell
git add src/components/charts/TrendChart.test.tsx tsconfig.json DAILY_MILESTONE_TRACKER.md .github/copilot-instructions.md plans/MILESTONE_COMMIT_GROUPING_2026-04-27.md
```

---

## Optional execution checklist
1. `git status --short`
2. Stage files for Commit 1, run `npm run quality:seo`, commit.
3. Stage files for Commit 2, run `npm run test:ops`, commit.
4. Stage files for Commit 3, run focused tests (`homepage` + UI), commit.
5. Stage files for Commit 4, run `vitest` on SEO tests, commit.
6. Stage files for Commit 5, run CRM/lead tests, commit.
7. Stage files for Commit 6, run `npx tsc --noEmit`, commit.

---

## Note
This plan intentionally keeps milestone boundaries clean while preserving dependency order (infrastructure/scripts before their workflow use, homepage API/slice before page integration, and final QA/chore pass last).
