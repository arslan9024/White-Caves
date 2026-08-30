#!/usr/bin/env node
/**
 * aegis-1000-issues-generator.js
 *
 * AEGIS Wave 50–74 Sprint:
 * Creates 25 Milestones × 40 Issues = 1000 Unique Critical Issues on GitHub Live
 *
 * Format: Enhanced — with Acceptance Criteria, Definition of Done & Effort Points
 * Priority Distribution: P0: 200 · P1: 400 · P2: 300 · P3: 100
 * Waves: 50 → 74 (continuation from the previous 500 issues, Waves 24–49)
 * Batch Size: 50 issues per batch with 300ms delay between issues
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const REPO_OWNER = 'arslan9024';
const REPO_NAME  = 'White-Caves';
const BATCH_DELAY_MS = 3000;    // 3s per issue — safe for GitHub secondary rate limits
const MILESTONE_DELAY_MS = 5000; // 5s between milestones
const MAX_RETRIES = 4;           // max retries with exponential backoff on 403/429
const START_WAVE = parseInt(process.env.START_WAVE || '50', 10);

// ─── Auth ────────────────────────────────────────────────────────────────────
function getToken() {
  try {
    const raw = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n',
      encoding: 'utf8', stdio: ['pipe','pipe','ignore']
    });
    const m = raw.match(/password=(.+)/);
    if (m && m[1].trim()) return m[1].trim();
  } catch {}
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
}

function headers(token) {
  return {
    'User-Agent':    'White-Caves-AEGIS-1000',
    'Authorization': `Bearer ${token}`,
    'Content-Type':  'application/json',
    'Accept':        'application/vnd.github+json'
  };
}

// ─── Sleep helper ─────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── GitHub API helpers ───────────────────────────────────────────────────────
async function createMilestone(hdrs, title, description) {
  const r = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/milestones`, {
    method: 'POST', headers: hdrs,
    body: JSON.stringify({ title, description, state: 'open' })
  });
  if (!r.ok) {
    const e = await r.json();
    if (e?.errors?.[0]?.code === 'already_exists') {
      // fetch existing
      const list = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/milestones?state=open&per_page=100`, { headers: hdrs });
      const all = await list.json();
      return all.find(m => m.title === title);
    }
    console.error('Milestone creation failed:', e);
    return null;
  }
  return r.json();
}

async function createIssue(hdrs, title, body, milestoneNumber, labels, attempt = 1) {
  const r = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
    method: 'POST', headers: hdrs,
    body: JSON.stringify({ title, body, milestone: milestoneNumber, labels })
  });

  if (r.status === 429 || r.status === 403) {
    // Rate limited — exponential backoff
    if (attempt <= MAX_RETRIES) {
      const waitMs = Math.min(30000 * Math.pow(2, attempt - 1), 120000); // 30s, 60s, 120s, 120s
      console.log(`  ⏳ Rate limited (${r.status}). Waiting ${waitMs / 1000}s before retry ${attempt}/${MAX_RETRIES}...`);
      await sleep(waitMs);
      return createIssue(hdrs, title, body, milestoneNumber, labels, attempt + 1);
    }
    console.error(`  ❌ Rate limit persists after ${MAX_RETRIES} retries: ${title}`);
    return null;
  }

  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    // Duplicate issue — skip gracefully
    if (e?.errors?.[0]?.code === 'already_exists') {
      console.log(`  ⚠️  Already exists (skipped): ${title.substring(0, 70)}`);
      return { number: 'SKIP' };
    }
    console.error(`  ❌ Failed to create: ${title.substring(0, 70)}`, e?.message || '');
    return null;
  }
  return r.json();
}

// ─── Issue body builder ────────────────────────────────────────────────────────
function buildBody({ tag, priority, effort, domain, description, acceptance, dod }) {
  return `## 📋 Issue Overview
**Tag:** \`${tag}\`
**Priority:** ${priority}
**Effort Points:** ${effort} SP
**Domain:** ${domain}

## 🎯 Description
${description}

## ✅ Acceptance Criteria
${acceptance.map(a => `- [ ] ${a}`).join('\n')}

## 🏁 Definition of Done
${dod.map(d => `- [ ] ${d}`).join('\n')}

## 🔏 MD Sovereign Seal
> _This issue is automatically sealed upon all acceptance criteria being checked and verified by the AEGIS Autonomous Engine under the authority of Founder & Managing Director Arslan Malik Bashir Ahmad (Level 5 Clearance · \`arslanmalikgoraha@gmail.com\`)._
`;
}

// ─── Master 1000-issue catalog (25 milestones × 40 issues) ────────────────────
// Priority helper: index drives P label
function p(i) {
  if (i < 8)  return '🔴 P0 Critical';
  if (i < 24) return '🟠 P1 High';
  if (i < 36) return '🟡 P2 Medium';
  return '🔵 P3 Low';
}
function ep(i) {
  if (i < 8)  return 13;
  if (i < 24) return 8;
  if (i < 36) return 5;
  return 3;
}

// The milestones array — each has a title, wave, domain code, and 40 issues
const MILESTONES = [
  // ── Wave 50 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 27 (Wave 50): Homepage Hero & Luxury Entry Experience',
    wave: 50, code: 'HERO',
    desc: 'Pixel-perfect luxury hero section, cinematic property reveals, and animated CTA for whitecaves.com',
    issues: [
      { sub: 'SPEC',     title: 'Hero Section — Technical Architecture & Full-Page Cinematic Layout Spec' },
      { sub: 'CORE',     title: 'Hero Section — Core State Machine: Property Cycle, Auto-Play & Pause Logic' },
      { sub: 'UI',       title: 'Hero Section — Full-Bleed 4K Video Loop with GPU-Accelerated Transitions' },
      { sub: 'MOTION',   title: 'Hero Section — Framer Motion Entrance Choreography & Stagger Reveals' },
      { sub: 'CTA',      title: 'Hero Section — Dual CTA Buttons: "Book a Viewing" & "Explore Portfolio"' },
      { sub: 'TYPOGRAPHY', title: 'Hero Section — Luxury Serif Headline Typography with Arabic RTL Mirror' },
      { sub: 'PERF',     title: 'Hero Section — LCP < 1.8s: Next-Gen Image Formats (AVIF/WebP) & Preload' },
      { sub: 'MOBILE',   title: 'Hero Section — Mobile-First Responsive Hero with Touch-Swipe Property Cycle' },
      { sub: 'SEO',      title: 'Hero Section — Structured Data, OG Tags & Canonical for whitecaves.com' },
      { sub: 'ARRTL',   title: 'Hero Section — Arabic RTL Complete Layout Mirror & Bidirectional Copy' },
      { sub: 'ANALYTICS', title: 'Hero Section — CTA Click Heatmap & Engagement Time Tracking Pixel' },
      { sub: 'A11Y',     title: 'Hero Section — WCAG 2.1 AA: Alt Text, Focus Traps & Reduced-Motion API' },
      { sub: 'DARK',     title: 'Hero Section — Dark/Light Mode Toggle with Seamless Brand Token Swap' },
      { sub: 'BADGE',    title: 'Hero Section — Trust Badges: DET, RERA ORN, DLD Broker Seal Inline' },
      { sub: 'SEARCH',   title: 'Hero Section — Embedded Property Search Bar with Autocomplete & Filters' },
      { sub: 'GALLERY',  title: 'Hero Section — Floating Property Count Badge with Live Listing Ticker' },
      { sub: 'SOCIAL',   title: 'Hero Section — Social Proof Strip: TrustPilot Stars, Google 4.9★, 200+ Reviews' },
      { sub: 'VIDEO',    title: 'Hero Section — Muted Autoplay Drone Footage with Click-to-Unmute UX' },
      { sub: 'ANIM',     title: 'Hero Section — Particle.js or GSAP Canvas Background: Subtle Gold Dust' },
      { sub: 'PRELOADER', title: 'Hero Section — White Caves Branded Preloader with SVG Logo Morph Animation' },
      { sub: 'PWA',      title: 'Hero Section — PWA Splash Screen with Offline Hero Fallback Cache' },
      { sub: 'CACHE',    title: 'Hero Section — Edge CDN Cache Strategy (Vercel Edge + stale-while-revalidate)' },
      { sub: 'MICRO',    title: 'Hero Section — Micro-Copy: Tagline A/B Test with GTM Variant Switcher' },
      { sub: 'CURSOR',   title: 'Hero Section — Custom Luxury Cursor (Circle Follow) on Desktop Viewport' },
      { sub: 'SCROLL',   title: 'Hero Section — Smooth Parallax Scroll Reveal into Property Grid Below' },
      { sub: 'I18N',     title: 'Hero Section — i18n JSON Key Mapping for en.json & ar.json Content Keys' },
      { sub: 'COUNTDOWN', title: 'Hero Section — Countdown Timer for Off-Plan Launch Events with Konfetti Burst' },
      { sub: 'SCHEMA',   title: 'Hero Section — JSON-LD RealEstateAgent Schema for Google Rich Results' },
      { sub: 'COOKIE',   title: 'Hero Section — GDPR/UAE PDPL Cookie Consent Banner Integration' },
      { sub: 'SPLIT',    title: 'Hero Section — Split-Screen Variant: Property Left / Lead Form Right' },
      { sub: 'WHATSAPP', title: 'Hero Section — Floating WhatsApp CTA Orb Anchored to Hero Viewport' },
      { sub: 'TRUST',    title: 'Hero Section — Animated Number Counters: AED 1.2B+ Sales, 500+ Clients' },
      { sub: 'AWARD',    title: 'Hero Section — Award Badges Strip: RERA Best Broker, DAMAC Preferred Partner' },
      { sub: 'MAP',      title: 'Hero Section — Interactive Area Heat Map Teaser Overlay on Hero Image' },
      { sub: 'STREAM',   title: 'Hero Section — WebSocket Live "New Listing Added" Toast Notification Pulse' },
      { sub: 'TEST-UNIT', title: 'Hero Section — Vitest Unit & Snapshot Tests (100% Component Coverage)' },
      { sub: 'TEST-E2E', title: 'Hero Section — Playwright End-to-End: All CTA Flows & Mobile Swipe Journey' },
      { sub: 'DOCS',     title: 'Hero Section — Technical Storybook Stories + Business Design Rationale Doc' },
      { sub: 'BENCH',    title: 'Hero Section — Lighthouse Score Target: Performance 95+, SEO 100, A11Y 95+' },
      { sub: 'GATE',     title: 'Hero Section — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 51 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 28 (Wave 51): Property Listing Grid & Search Experience',
    wave: 51, code: 'GRID',
    desc: 'UAE luxury property listing grid with advanced filters, map view toggle, and real-time Bayut/PropertyFinder parity',
    issues: [
      { sub: 'SPEC',     title: 'Listing Grid — Architecture Spec: Card Anatomy, Grid Breakpoints & Filter Contract' },
      { sub: 'CORE',     title: 'Listing Grid — Data Fetching Engine: SWR/React Query with Cursor Pagination' },
      { sub: 'CARD',     title: 'Listing Grid — Luxury Property Card: Image Carousel, Price AED, Badge & CTA' },
      { sub: 'FILTER',   title: 'Listing Grid — Advanced Filter Panel: Beds/Baths, Price, Area, District, Type' },
      { sub: 'MAP',      title: 'Listing Grid — Mapbox/Google Maps Hybrid Toggle: Pin Clusters & Hover Cards' },
      { sub: 'SORT',     title: 'Listing Grid — Sort Controls: Price High/Low, Newest, Size, ROI Yield %' },
      { sub: 'SAVE',     title: 'Listing Grid — Wishlist Heart Toggle with LocalStorage + Auth-synced Save List' },
      { sub: 'COMPARE',  title: 'Listing Grid — Side-by-Side Property Compare Drawer (up to 4 properties)' },
      { sub: 'VIRTUAL',  title: 'Listing Grid — Virtual Scroll Engine (react-window) for 10,000+ Listings' },
      { sub: 'SKELETON', title: 'Listing Grid — Red/White Shimmer Skeleton Cards During Data Fetch' },
      { sub: 'BADGE',    title: 'Listing Grid — Premium Badges: "Hot Deal", "Price Drop", "Off-Plan Launch"' },
      { sub: 'PERF',     title: 'Listing Grid — Image Lazy Loading with Intersection Observer & AVIF/WebP' },
      { sub: 'ARRTL',   title: 'Listing Grid — Arabic RTL Grid Mirror with Bidirectional Price Formatting' },
      { sub: 'MOBILE',   title: 'Listing Grid — Mobile Single-Column Card Stack with Bottom Filter Sheet' },
      { sub: 'SEARCH',   title: 'Listing Grid — Instant Algolia/ElasticSearch Text Search with Highlighting' },
      { sub: 'RECENT',   title: 'Listing Grid — "Recently Viewed" Horizontal Scroll Strip with Browser Persist' },
      { sub: 'PAGINATION', title: 'Listing Grid — Infinite Scroll or "Load More" with URL-persisted Page State' },
      { sub: 'LEAD',     title: 'Listing Grid — Inline "Request Info" Quick Lead Form Without Leaving Page' },
      { sub: 'SHARE',    title: 'Listing Grid — Share Card Button: WhatsApp, Email, Copy Link, Instagram Story' },
      { sub: 'CURRENCY', title: 'Listing Grid — FX Price Toggle: AED / USD / GBP / EUR / INR / CNY' },
      { sub: 'ROI',      title: 'Listing Grid — ROI Yield Calculator Overlay on Each Card Hover' },
      { sub: 'FLOOR',    title: 'Listing Grid — Floor Plan Preview Tooltip on Hover or Tap' },
      { sub: 'TOUR',     title: 'Listing Grid — 360° Virtual Tour Shortcut Icon on Card Thumbnail' },
      { sub: 'AML',      title: 'Listing Grid — goAML AED 55,000 Threshold Warning Banner on High-Price Cards' },
      { sub: 'PRINT',    title: 'Listing Grid — Print-Optimized Property Sheet with White Caves Letterhead' },
      { sub: 'EMBED',    title: 'Listing Grid — Embeddable iFrame Widget for External Agent Partner Sites' },
      { sub: 'ALERT',    title: 'Listing Grid — Email/Push Alert Setup: "Notify Me" When New Match Arrives' },
      { sub: 'STREAM',   title: 'Listing Grid — WebSocket Real-Time Price Update Pulse on Live Listings' },
      { sub: 'AUTH',     title: 'Listing Grid — Role-Based Card Actions: Guest vs Agent vs MD View Variants' },
      { sub: 'EXPORT',   title: 'Listing Grid — Export Filtered Results to PDF/Excel with Company Branding' },
      { sub: 'HISTORY',  title: 'Listing Grid — Price History Chart (12-Month AED Trend) on Card Expand' },
      { sub: 'AUDIT',    title: 'Listing Grid — Audit Log: User Search Queries Stored for AI Re-targeting' },
      { sub: 'I18N',     title: 'Listing Grid — en.json & ar.json Locale Keys for All Card & Filter Labels' },
      { sub: 'SEO',      title: 'Listing Grid — Dynamic /properties/[slug] SSR Pages with Full OG Meta' },
      { sub: 'SCHEMA',   title: 'Listing Grid — JSON-LD Apartment/House/LandForSale per Listing for Google' },
      { sub: 'TEST-UNIT', title: 'Listing Grid — Vitest Unit Tests: Filter Logic, Sort Algorithm, Card Render' },
      { sub: 'TEST-E2E', title: 'Listing Grid — Playwright E2E: Filter → Map → Contact Journey on Mobile' },
      { sub: 'DOCS',     title: 'Listing Grid — Storybook Stories + API Contract Documentation' },
      { sub: 'BENCH',    title: 'Listing Grid — Core Web Vitals: CLS 0, INP < 200ms, LCP < 2.5s Verified' },
      { sub: 'GATE',     title: 'Listing Grid — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 52 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 29 (Wave 52): Property Detail Page & Virtual Showroom',
    wave: 52, code: 'PDP',
    desc: 'S-Tier luxury property detail page with 360° tours, floor plans, ROI calculators, and DLD/RERA compliance stamps',
    issues: [
      { sub: 'SPEC',     title: 'Property Detail — Architecture Spec: Layout Zones, Data Contract & SSR Strategy' },
      { sub: 'CORE',     title: 'Property Detail — getStaticProps/getServerSideProps with ISR 60s Revalidation' },
      { sub: 'GALLERY',  title: 'Property Detail — Full-Screen Swipeable Gallery with Zoom & Thumbnail Strip' },
      { sub: 'TOUR360',  title: 'Property Detail — Pannellum WebGL 360° Virtual Tour with Hotspot Annotations' },
      { sub: 'FLOOR',    title: 'Property Detail — Interactive SVG Floor Plan with Room Label Highlights' },
      { sub: 'VIDEO',    title: 'Property Detail — Embedded Drone/Walkthrough Video with Autoplay Control' },
      { sub: 'PRICE',    title: 'Property Detail — Price Breakdown Widget: Base Price + DLD 4% + Agency Fee' },
      { sub: 'ROI',      title: 'Property Detail — ROI Yield Calculator with Annual Rental Projection AED' },
      { sub: 'MORTGAGE', title: 'Property Detail — UAE Mortgage Calculator: LTV 80%, Interest Rates & EMI' },
      { sub: 'DLD',      title: 'Property Detail — DLD Title Deed Verification Status Badge & Freehold Map' },
      { sub: 'RERA',     title: 'Property Detail — RERA Project Registration Number (OQOOD) Trust Badge' },
      { sub: 'DEVELOPER', title: 'Property Detail — Developer Profile Card: Emaar, DAMAC, Meraas, Sobha etc' },
      { sub: 'NEARBY',   title: 'Property Detail — Nearby Amenities Map: Schools, Metro, Malls, Hospitals' },
      { sub: 'SIMILAR',  title: 'Property Detail — Similar Listings Carousel with ML Recommendation Engine' },
      { sub: 'AGENT',    title: 'Property Detail — Assigned Agent Card: Photo, RERA No, WhatsApp, Call CTA' },
      { sub: 'LEAD',     title: 'Property Detail — Multi-Step Lead Form: Viewing Request, Offer, Financing' },
      { sub: 'CALENDAR', title: 'Property Detail — Inline Viewing Appointment Calendar (Google/Outlook Sync)' },
      { sub: 'SHARE',    title: 'Property Detail — Social Share Suite: WhatsApp, Email, PDF Brochure, QR Code' },
      { sub: 'PRINT',    title: 'Property Detail — Print-Optimized Brochure with White Caves Letterhead' },
      { sub: 'HISTORY',  title: 'Property Detail — 24-Month AED Price History Chart (DLD Transaction Data)' },
      { sub: 'OWNERSHIP', title: 'Property Detail — Ownership Type Tag: Freehold, Leasehold, Usufruct' },
      { sub: 'SNAGGING', title: 'Property Detail — Snagging Checklist Download for Ready Properties' },
      { sub: 'HANDOVER', title: 'Property Detail — Handover Timeline Tracker for Off-Plan with Milestone Dates' },
      { sub: 'PAYMENT',  title: 'Property Detail — Off-Plan Payment Plan Table: % on Completion, PDC Dates' },
      { sub: 'CURRENCY', title: 'Property Detail — Dynamic Currency Converter: AED ↔ USD/GBP/EUR/INR/CNY' },
      { sub: 'SAVE',     title: 'Property Detail — Save/Favourite Button Synced to User Account Wishlist' },
      { sub: 'COMPARE',  title: 'Property Detail — Add to Compare CTA Bar (Sticky Bottom on Mobile)' },
      { sub: 'BREADCRUMB', title: 'Property Detail — SEO Breadcrumb: Home > Dubai > Palm Jumeirah > [Title]' },
      { sub: 'MOBILE',   title: 'Property Detail — Sticky Bottom CTA Bar: Call/WhatsApp/Enquire on Mobile' },
      { sub: 'ARRTL',   title: 'Property Detail — Arabic RTL Full-Page Mirror with Locale Content Swap' },
      { sub: 'STREAM',   title: 'Property Detail — WebSocket "X People Viewing Now" Live Social Proof' },
      { sub: 'AUDIT',    title: 'Property Detail — Tamper-Evident Audit Log: Page Views, Lead Submissions' },
      { sub: 'CACHE',    title: 'Property Detail — Edge Cache + Redis Property Object Cache (TTL 300s)' },
      { sub: 'SEO',      title: 'Property Detail — Canonical URLs, Hreflang, Structured Breadcrumb JSON-LD' },
      { sub: 'A11Y',     title: 'Property Detail — WCAG AA: Keyboard Navigation, Screen Reader, Focus Ring' },
      { sub: 'TEST-UNIT', title: 'Property Detail — Vitest Unit: ROI Calc, Mortgage Calc, Floor Plan Load' },
      { sub: 'TEST-E2E', title: 'Property Detail — Playwright E2E: Full Buyer Journey from Hero to Enquiry' },
      { sub: 'DOCS',     title: 'Property Detail — Technical Doc + Storybook + Business Brochure Spec' },
      { sub: 'BENCH',    title: 'Property Detail — Lighthouse 95+ Performance, Zero CLS, INP < 200ms' },
      { sub: 'GATE',     title: 'Property Detail — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 53 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 30 (Wave 53): CRM Dashboard — Executive Command Center V2',
    wave: 53, code: 'CRM-DASH',
    desc: 'Next-gen CRM Executive Dashboard with S-Tier analytics podiums, live pipeline, SLA watchdogs, and MD Sovereign Hub',
    issues: [
      { sub: 'SPEC',     title: 'CRM Dashboard — V2 Architecture: Widget Registry, Role-Based Layout Engine' },
      { sub: 'CORE',     title: 'CRM Dashboard — Drag-and-Drop Widget Customization with Persist to DB' },
      { sub: 'KPI',      title: 'CRM Dashboard — Real-Time KPI Cards: Revenue AED, Listings, Leads, Conversions' },
      { sub: 'PODIUM',   title: 'CRM Dashboard — 3-Tier Gamified Agent Podiums: Gold/Silver/Bronze with Avatars' },
      { sub: 'PIPELINE', title: 'CRM Dashboard — Kanban Sales Pipeline: Prospect → Offer → SPA → Closed Won' },
      { sub: 'FORECAST', title: 'CRM Dashboard — AI Revenue Forecast: 30/60/90-Day Rolling AED Projections' },
      { sub: 'SLA',      title: 'CRM Dashboard — 15-Minute SLA Countdown Tickers with Pulsing Red Alert' },
      { sub: 'SPARKLINE', title: 'CRM Dashboard — 7-Day SVG Mini-Sparkline Trend Lines per KPI Widget' },
      { sub: 'CALENDAR', title: 'CRM Dashboard — Today\'s Viewings & Tasks Calendar Strip (Google Sync)' },
      { sub: 'LEADS',    title: 'CRM Dashboard — New Leads Inbox: Priority-Sorted, Unread Badge, Quick Reply' },
      { sub: 'MAP',      title: 'CRM Dashboard — Live Deal Heatmap: Dubai Districts by Closed Volume AED' },
      { sub: 'ACTIVITY', title: 'CRM Dashboard — Activity Feed: Last 24h Actions with Actor Avatars & Timestamps' },
      { sub: 'ALERTS',   title: 'CRM Dashboard — Smart Alerts: License Expiry, Overdue Tasks, Missed SLA' },
      { sub: 'EXPORT',   title: 'CRM Dashboard — Export All Widgets to PDF Board Report with Letterhead' },
      { sub: 'ROLE',     title: 'CRM Dashboard — Role Variant: MD vs Agent vs Supervisor Layout Switcher' },
      { sub: 'MD-HUB',   title: 'CRM Dashboard — MD Sovereign Hub: Ghost Impersonation, Clearance Override' },
      { sub: 'MOBILE',   title: 'CRM Dashboard — Mobile Responsive: Bottom Tab Nav + Swipeable Card Stack' },
      { sub: 'DARK',     title: 'CRM Dashboard — Dark Mode with White Caves Token Palette: No Generic Colors' },
      { sub: 'ARRTL',   title: 'CRM Dashboard — Arabic RTL Dashboard Mirror with Flipped Kanban Direction' },
      { sub: 'NOTIFY',   title: 'CRM Dashboard — Browser Push Notifications: New Lead, SLA Breach, Deal Closed' },
      { sub: 'SEARCH',   title: 'CRM Dashboard — Global ⌘K Search: Properties, Contacts, Deals, Documents' },
      { sub: 'SHORTCUTS', title: 'CRM Dashboard — Keyboard Shortcuts Panel: Quick Actions for Power Users' },
      { sub: 'FILTER',   title: 'CRM Dashboard — Date Range Picker: Today, 7D, 30D, 90D, Custom Fiscal' },
      { sub: 'AUDIT',    title: 'CRM Dashboard — Audit Log Viewer: Immutable Action Trail with Actor IDs' },
      { sub: 'I18N',     title: 'CRM Dashboard — All Widget Labels via en.json & ar.json with RTL Numbers' },
      { sub: 'PERF',     title: 'CRM Dashboard — Dashboard Load < 1.5s: Route-Level Code Splitting + Prefetch' },
      { sub: 'CACHE',    title: 'CRM Dashboard — Redis Dashboard Cache (TTL 30s) with WebSocket Invalidation' },
      { sub: 'HEALTH',   title: 'CRM Dashboard — System Health Widget: API Latency, DB Queries, Memory %' },
      { sub: 'STREAM',   title: 'CRM Dashboard — WebSocket Live Feed: Real-Time Deal & Lead State Updates' },
      { sub: 'WHATSAPP', title: 'CRM Dashboard — Embedded WhatsApp Conversation Preview Strip' },
      { sub: 'GOAL',     title: 'CRM Dashboard — Monthly Goal Progress Ring Charts per Agent & Team' },
      { sub: 'NEWS',     title: 'CRM Dashboard — DLD Market Intelligence News Feed Strip (Filtered, UAE Only)' },
      { sub: 'THEME',    title: 'CRM Dashboard — Branded Theme Engine: Admin Can Customize Widget Colors' },
      { sub: 'EMBED',    title: 'CRM Dashboard — Embeddable Public Dashboard for Investor Relations Reports' },
      { sub: 'AUTH',     title: 'CRM Dashboard — Session Timeout Guard: 30-min Idle Lock with Re-Auth Modal' },
      { sub: 'TEST-UNIT', title: 'CRM Dashboard — Vitest Unit Tests: KPI Calc, Pipeline State Machine, Role Guard' },
      { sub: 'TEST-E2E', title: 'CRM Dashboard — Playwright E2E: MD Login → Hub → Deal Closed Full Flow' },
      { sub: 'DOCS',     title: 'CRM Dashboard — Widget Registry Documentation + Storybook Component Stories' },
      { sub: 'BENCH',    title: 'CRM Dashboard — Performance Benchmark: FCP < 1s, TTI < 2s, Apdex > 0.95' },
      { sub: 'GATE',     title: 'CRM Dashboard — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 54 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 31 (Wave 54): Lead Management & AI Lead Scoring Engine V2',
    wave: 54, code: 'LEAD-AI',
    desc: 'AI-powered lead lifecycle management: intake, scoring, auto-assignment, nurture sequences, and conversion analytics',
    issues: [
      { sub: 'SPEC',     title: 'Lead AI — Architecture Spec: Intake Schema, Scoring Model & Assignment Rules' },
      { sub: 'INTAKE',   title: 'Lead AI — Multi-Channel Intake: Web Form, WhatsApp, Email, Bayut, PF API' },
      { sub: 'SCORE',    title: 'Lead AI — ML Lead Scoring: Budget, Location Intent, Timeline, Engagement' },
      { sub: 'ASSIGN',   title: 'Lead AI — Auto-Assignment Rules Engine: Language, Specialty, Availability' },
      { sub: 'NURTURE',  title: 'Lead AI — Automated Email/WhatsApp Nurture Sequences by Lead Stage' },
      { sub: 'QUALIFY',  title: 'Lead AI — Lead Qualification Gate: BANT Framework (Budget/Authority/Need/Timeline)' },
      { sub: 'DUPLICATE', title: 'Lead AI — Duplicate Detection Engine: Phone, Email, Device Fingerprint' },
      { sub: 'TIMELINE', title: 'Lead AI — Lead Timeline View: Every Touchpoint, Call, Message, Email Logged' },
      { sub: 'NOTES',    title: 'Lead AI — Rich-Text Notes Editor with @Mention Team Members & Attachments' },
      { sub: 'TASK',     title: 'Lead AI — Auto-Task Generator: Follow-Up Tasks from AI Recommendation Engine' },
      { sub: 'HOTLEAD',  title: 'Lead AI — Hot Lead Pulse: Real-Time Notification when Score Crosses Threshold' },
      { sub: 'DEADLEAD', title: 'Lead AI — Dead Lead Revival: 90-Day Auto Re-Engagement Campaign Trigger' },
      { sub: 'PIPELINE', title: 'Lead AI — Lead-to-Deal Pipeline Conversion Funnel with Drop-Off Analysis' },
      { sub: 'SOURCE',   title: 'Lead AI — UTM Source Attribution: Campaign, Medium, Keyword per Lead' },
      { sub: 'BUDGET',   title: 'Lead AI — Budget Bracket Classifier: < 1M, 1–3M, 3–10M, 10M+ AED' },
      { sub: 'LANGUAGE', title: 'Lead AI — Language Preference Detection: Arabic, English, Hindi, Chinese, Russian' },
      { sub: 'INTEREST', title: 'Lead AI — Property Interest Profiler: Villas, Apartments, Off-Plan, Penthouses' },
      { sub: 'CALL',     title: 'Lead AI — Click-to-Call with Automatic Call Log Recording & Transcript' },
      { sub: 'EMAIL',    title: 'Lead AI — Personalized Email Templates with Token Merge & Open Tracking' },
      { sub: 'WHATSAPP', title: 'Lead AI — WhatsApp API Integration: Auto-Reply, Template Messages, Media Send' },
      { sub: 'PREDICT',  title: 'Lead AI — Predictive Close Probability Model: % Likelihood to Transact in 30d' },
      { sub: 'SEGMENT',  title: 'Lead AI — Lead Segmentation: First-Time Buyer, Investor, Developer Contact, HNW' },
      { sub: 'GDPR',     title: 'Lead AI — UAE PDPL Consent Capture, Data Retention Policy & Right-to-Erase' },
      { sub: 'AML',      title: 'Lead AI — AML/KYC Flag: Automatic Risk Score for High-Value Lead Transactions' },
      { sub: 'IMPORT',   title: 'Lead AI — Bulk CSV/Excel Import with Duplicate Merge & Validation Error Map' },
      { sub: 'EXPORT',   title: 'Lead AI — Export Lead Report: PDF/Excel with Filter Criteria & Date Range' },
      { sub: 'ANALYTICS', title: 'Lead AI — Lead Analytics Board: Source, Stage, Agent, Conversion by Period' },
      { sub: 'MOBILE',   title: 'Lead AI — Mobile Lead Card: Swipe to Call/WhatsApp, Tap to View Timeline' },
      { sub: 'ARRTL',   title: 'Lead AI — Arabic RTL Lead Form & Timeline with Bidirectional Name Handling' },
      { sub: 'I18N',     title: 'Lead AI — All Labels & Status Keys in en.json & ar.json for Bilingual CRM' },
      { sub: 'WEBHOOK',  title: 'Lead AI — Outbound Webhooks: Notify ERP/CRM Partners on Stage Changes' },
      { sub: 'CALLBACK', title: 'Lead AI — Callback Request Widget with Time-Slot Booking & Agent Notification' },
      { sub: 'FEEDBACK', title: 'Lead AI — Post-Interaction Satisfaction Score (1–5★) Auto-Sent via WhatsApp' },
      { sub: 'REFERRAL', title: 'Lead AI — Referral Tracking: Source Agent, Partner Commission % Calculation' },
      { sub: 'AUDIT',    title: 'Lead AI — Immutable Audit Trail: Every Lead State Transition with Timestamp' },
      { sub: 'TEST-UNIT', title: 'Lead AI — Vitest Unit: Scoring Model, Assignment Rules, Duplicate Detection' },
      { sub: 'TEST-E2E', title: 'Lead AI — Playwright E2E: WhatsApp Lead → Score → Assign → Close Journey' },
      { sub: 'DOCS',     title: 'Lead AI — Technical Architecture Doc + Business Lead Lifecycle Flowchart' },
      { sub: 'BENCH',    title: 'Lead AI — Benchmark: Score Computation < 50ms for 10,000 Lead Records' },
      { sub: 'GATE',     title: 'Lead AI — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 55 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 32 (Wave 55): Tenancy & Ejari Digital Management Suite',
    wave: 55, code: 'EJARI',
    desc: 'Full digital tenancy lifecycle: Ejari creation/renewal, PDC tracking, bounced cheques, eviction notices, and RERA forms',
    issues: [
      { sub: 'SPEC',     title: 'Ejari Suite — Architecture: Tenancy State Machine, RERA Form Registry & PDC Model' },
      { sub: 'EJARI',    title: 'Ejari Suite — Live Ejari API Integration: Create, Renew, Cancel via DLD Gateway' },
      { sub: 'CONTRACT', title: 'Ejari Suite — Digital Tenancy Contract Builder with Electronic Signature (DocuSign/eSign)' },
      { sub: 'PDC',      title: 'Ejari Suite — PDC Tracker: Post-Dated Cheque Calendar with 7-Day Advance Alerts' },
      { sub: 'BOUNCE',   title: 'Ejari Suite — Bounced Cheque Workflow: Police Report, Legal Notice (Form 12) Auto-Generation' },
      { sub: 'EVICTION', title: 'Ejari Suite — Eviction Process: 12-Month Notice via Notary, RERA Dispute Mediation' },
      { sub: 'RENEWAL',  title: 'Ejari Suite — Auto-Renewal Engine: 90/60/30-Day Advance Notices with Approval Gate' },
      { sub: 'TERMINATION', title: 'Ejari Suite — Early Termination Clause Manager with Penalty Calculation (2 Months Rent)' },
      { sub: 'RECEIPT',  title: 'Ejari Suite — Digital Rent Receipt Generator with VAT 5% Itemization & TRN' },
      { sub: 'INCREASE', title: 'Ejari Suite — RERA Rent Increase Calculator: DLD Index-Capped % per Zone' },
      { sub: 'DEPOSIT',  title: 'Ejari Suite — Security Deposit Ledger: Hold, Deductions, Refund Timeline Tracker' },
      { sub: 'INSPECTION', title: 'Ejari Suite — Move-In/Move-Out Inspection Checklist with Photo Upload & Sign-Off' },
      { sub: 'TENANT',   title: 'Ejari Suite — Tenant Portal: Payments, Documents, Maintenance Requests, Messages' },
      { sub: 'LANDLORD', title: 'Ejari Suite — Landlord Portal: Income Dashboard, Renewals, Approvals, Statements' },
      { sub: 'NOC',      title: 'Ejari Suite — NOC Letter Generator: From Owner for Sub-Letting or Modifications' },
      { sub: 'UTILITY',  title: 'Ejari Suite — DEWA/Etisalat Transfer Checklist with Auto-Reminder on Handover' },
      { sub: 'INSURANCE', title: 'Ejari Suite — Home Insurance Certificate Upload & Expiry Reminder Automation' },
      { sub: 'ARBITRATION', title: 'Ejari Suite — RERA Arbitration Case Filing: Evidence Packet Generator & Submission' },
      { sub: 'MAINTENANCE', title: 'Ejari Suite — Maintenance Liability Tracker: Tenant vs Landlord Responsibility Matrix' },
      { sub: 'COOLING',  title: 'Ejari Suite — Cooling-Off Period Tracker for Off-Plan Contracts (Dubai Law)' },
      { sub: 'MULTIPLE', title: 'Ejari Suite — Multi-Unit Portfolio: Manage 9,378 DH2 Units in Bulk Batch View' },
      { sub: 'DOCUMENT', title: 'Ejari Suite — Document Vault: Emirates ID, Passport, Title Deed, DEWA per Tenant' },
      { sub: 'COMM',     title: 'Ejari Suite — Communication Log: Every Call, Message, Email per Tenancy Record' },
      { sub: 'AUDIT',    title: 'Ejari Suite — Cryptographic Audit Trail: Ejari Number, Timestamps, Version History' },
      { sub: 'REPORT',   title: 'Ejari Suite — Tenancy Report: Occupancy %, Average Rent AED, Lease Duration KPIs' },
      { sub: 'EXPORT',   title: 'Ejari Suite — Export Tenancy Register to Excel/PDF with DLD-Required Format' },
      { sub: 'ARRTL',   title: 'Ejari Suite — Arabic RTL Contract Layout with Bilingual Signature Blocks' },
      { sub: 'MOBILE',   title: 'Ejari Suite — Mobile Tenancy Card: PDC Due, Renewal Status, Quick Actions' },
      { sub: 'I18N',     title: 'Ejari Suite — en.json & ar.json Keys for All Ejari Labels, Statuses & Notices' },
      { sub: 'NOTIFY',   title: 'Ejari Suite — Automated WhatsApp/Email Reminders: PDC, Renewal, Expiry Alerts' },
      { sub: 'STREAM',   title: 'Ejari Suite — WebSocket Live PDC & Payment Event Feed for Dashboard Widget' },
      { sub: 'CALENDAR', title: 'Ejari Suite — Tenancy Calendar: PDC Dates, Renewals, Inspections (Google Sync)' },
      { sub: 'KYC',      title: 'Ejari Suite — KYC Gate: Emirates ID Verification Before Contract Activation' },
      { sub: 'PRINT',    title: 'Ejari Suite — Printable Tenancy Summary Card with QR Code Linking to Portal' },
      { sub: 'RATING',   title: 'Ejari Suite — Tenant Rating System: Payment History Score, Maintenance Reports' },
      { sub: 'TEST-UNIT', title: 'Ejari Suite — Vitest Unit Tests: PDC Calendar Engine, RERA Calc, State Machine' },
      { sub: 'TEST-E2E', title: 'Ejari Suite — Playwright E2E: Ejari Create → PDC Set → Bounced Cheque Flow' },
      { sub: 'DOCS',     title: 'Ejari Suite — Business Flow Diagrams + UAE Legal Reference Documentation' },
      { sub: 'BENCH',    title: 'Ejari Suite — Performance: 9,378 Unit Portfolio Load < 2s, Ejari API < 500ms' },
      { sub: 'GATE',     title: 'Ejari Suite — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 56 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 33 (Wave 56): Financial Accounting & UAE VAT Compliance Engine',
    wave: 56, code: 'FINANCE',
    desc: 'In-house real estate accounting: double-entry ledger, UAE 5% VAT (FTA), 9% Corporate Tax, invoicing with TRN, and cash flow',
    issues: [
      { sub: 'SPEC',     title: 'Finance Engine — Architecture: Double-Entry Ledger Schema, Chart of Accounts, VAT Model' },
      { sub: 'LEDGER',   title: 'Finance Engine — Double-Entry General Ledger: Assets = Liabilities + Equity Invariant' },
      { sub: 'VAT',      title: 'Finance Engine — UAE FTA VAT Engine: 5% Standard, 0% Zero-Rated, Exempt Categories' },
      { sub: 'INVOICE',  title: 'Finance Engine — Tax Invoice Generator: TRN, VAT Breakdown, Due Date, PDF Export' },
      { sub: 'RECEIPT',  title: 'Finance Engine — Payment Receipt: Bank Transfer Reference, Cheque No, Cash Confirm' },
      { sub: 'COMMISSION', title: 'Finance Engine — Commission Ledger: 2% Agency + 5% VAT per Transaction AED' },
      { sub: 'PAYROLL',  title: 'Finance Engine — Agent Payroll Calculation: Base + Commission Split + DIFC WPS' },
      { sub: 'EXPENSE',  title: 'Finance Engine — Expense Claims: Category, Receipt Upload, Approval Workflow' },
      { sub: 'CASHFLOW', title: 'Finance Engine — Rolling 12-Month Cash Flow Forecast: In/Out/Net Projection' },
      { sub: 'BUDGET',   title: 'Finance Engine — Annual Budget vs Actual Variance Analysis by Department' },
      { sub: 'CORPORATE-TAX', title: 'Finance Engine — UAE Corporate Tax 9% (FTA June 2023): Taxable Income Calc' },
      { sub: 'TRANSFER', title: 'Finance Engine — Intercompany Transfer Ledger Between White Caves Entities' },
      { sub: 'BANK',     title: 'Finance Engine — Bank Reconciliation: Statement Import, Match, Unmatched Alert' },
      { sub: 'CHEQUE',   title: 'Finance Engine — Cheque Registry: PDC Log, Presented/Cleared/Bounced Tracking' },
      { sub: 'FX',       title: 'Finance Engine — FX Gain/Loss Ledger: AED/USD/GBP Conversion with Live Rates' },
      { sub: 'TRUST',    title: 'Finance Engine — Client Money Trust Account Register (RERA Escrow Rules)' },
      { sub: 'REFUND',   title: 'Finance Engine — Refund Management: Security Deposit, Cancellation Refund Calc' },
      { sub: 'AGING',    title: 'Finance Engine — Accounts Receivable Aging: 0–30, 31–60, 61–90, 90+ Days AED' },
      { sub: 'REPORT',   title: 'Finance Engine — P&L, Balance Sheet, Trial Balance Reports with AED Formatting' },
      { sub: 'AUDIT',    title: 'Finance Engine — FTA Audit Trail: Immutable VAT Transactions with E-Tax Reference' },
      { sub: 'TAX-RETURN', title: 'Finance Engine — Quarterly VAT Return (Form 201) Auto-Population from Ledger' },
      { sub: 'EXPORT',   title: 'Finance Engine — Export to XERO/QuickBooks via API + Direct Excel/PDF Report' },
      { sub: 'APPROVAL', title: 'Finance Engine — Multi-Level Approval Workflow: Agent → Manager → MD Signoff' },
      { sub: 'RECURRING', title: 'Finance Engine — Recurring Invoice Engine: Rent, Retainer, Subscription Auto-Bill' },
      { sub: 'ESCROW',   title: 'Finance Engine — RERA Off-Plan Escrow Account: Developer Drawdown vs Completion' },
      { sub: 'MOBILE',   title: 'Finance Engine — Mobile Finance: Invoice Approve, Expense Submit, P&L Snapshot' },
      { sub: 'ARRTL',   title: 'Finance Engine — Arabic RTL Invoice & Ledger Layout with Right-Aligned AED Figures' },
      { sub: 'I18N',     title: 'Finance Engine — en.json & ar.json Keys for All Finance Modules & Status Labels' },
      { sub: 'NOTIFY',   title: 'Finance Engine — Automated Alerts: Overdue Invoice, VAT Filing Due, Low Cash Warning' },
      { sub: 'CHART',    title: 'Finance Engine — Interactive Financial Charts: Bar, Line, Pie with Date Range Filter' },
      { sub: 'CRYPTO',   title: 'Finance Engine — Crypto Payment Receipt Integration (BTC/ETH/USDT) with AED Equiv' },
      { sub: 'INSURANCE', title: 'Finance Engine — Business Insurance Premium Ledger & Renewal Reminder Engine' },
      { sub: 'BENCHMARK', title: 'Finance Engine — Industry Benchmark Comparison: Commission % vs Dubai Market Avg' },
      { sub: 'ZAKAT',    title: 'Finance Engine — Zakat Calculation Assistant (2.5% on eligible assets per Hijri year)' },
      { sub: 'AUTH',     title: 'Finance Engine — Finance RBAC: View-Only vs Edit vs Approve per Role Matrix' },
      { sub: 'TEST-UNIT', title: 'Finance Engine — Vitest Unit Tests: VAT Calc, Double-Entry Balance, Payroll Math' },
      { sub: 'TEST-E2E', title: 'Finance Engine — Playwright E2E: Invoice Create → Approve → Pay → Reconcile' },
      { sub: 'DOCS',     title: 'Finance Engine — FTA Compliance Reference + Chart of Accounts Schema Docs' },
      { sub: 'BENCH',    title: 'Finance Engine — Performance: Ledger Query < 20ms for 1M+ Transaction Records' },
      { sub: 'GATE',     title: 'Finance Engine — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 57 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 34 (Wave 57): RERA, DLD & UAE Compliance Automation',
    wave: 57, code: 'COMPLIANCE',
    desc: 'Full automation of RERA, DLD, UAE PDPL, goAML, and AML/KYC compliance workflows with proactive renewal management',
    issues: [
      { sub: 'SPEC',     title: 'Compliance — Architecture: Regulatory Document Registry, Expiry Engine & AML Rules' },
      { sub: 'DET',      title: 'Compliance — DET License `1388443` Monitor: 90/60/30-Day Renewal Countdown' },
      { sub: 'RERA-ORN', title: 'Compliance — RERA ORN `44483` Auto-Renewal Workflow with RERA Portal Integration' },
      { sub: 'EJARI-HQ', title: 'Compliance — HQ Ejari `0120250814005322` Renewal: D-72 El Shaye-4, Deira' },
      { sub: 'ICP',      title: 'Compliance — ICP Establishment Card `2/1/1192499` Expiry Monitor & MoHRE Filing' },
      { sub: 'RERA-CERT', title: 'Compliance — RERA Certified Agent Certificate Tracker: All 108 Staff Members' },
      { sub: 'PDPL',     title: 'Compliance — UAE PDPL Data Privacy: Consent Register, Data Mapping, DPA Contracts' },
      { sub: 'GOAML',    title: 'Compliance — goAML Registration & STR Filing: AED 55,000 Cash Threshold Automated' },
      { sub: 'AML',      title: 'Compliance — AML Policy: CDD, EDD, PEP Screening, Sanctions List API (OFAC/UN)' },
      { sub: 'KYC',      title: 'Compliance — KYC Gate: Emirates ID OCR Scan, Passport Verify, Source of Funds' },
      { sub: 'OQOOD',    title: 'Compliance — OQOOD Off-Plan Registration: Buyer, Developer, Project via DLD API' },
      { sub: 'SPA',      title: 'Compliance — SPA (Sale & Purchase Agreement) Compliance Checklist & Filing' },
      { sub: 'TITLE-DEED', title: 'Compliance — Title Deed Verification: DLD e-Title API Integration & QR Validation' },
      { sub: 'MORTGAGE-REG', title: 'Compliance — Mortgage Registration: 0.25% Fee Calc + DLD Form Submission' },
      { sub: 'FORM-A',   title: 'Compliance — RERA Form A/B/F: Auto-Population from CRM Deal & E-Sign Workflow' },
      { sub: 'NOC-DEVELOPER', title: 'Compliance — NOC from Developer: Automated Request Letter Generator + Tracker' },
      { sub: 'AML-REPORT', title: 'Compliance — Annual AML Risk Assessment Report: Typology Matrix & Risk Score' },
      { sub: 'BROKER-LICENSE', title: 'Compliance — Broker License Display: Public-Facing RERA Verification Badge' },
      { sub: 'TRAINING', title: 'Compliance — RERA-Mandated Training Tracker: 12 CPD Hours/Year per Agent' },
      { sub: 'SANCTION', title: 'Compliance — Automated Sanctions Screening: Every New Client vs UN/OFAC/EU Lists' },
      { sub: 'WHISTLEBLOW', title: 'Compliance — Whistleblower Reporting Portal: Anonymous AML/Fraud Reports' },
      { sub: 'DATA-RETENTION', title: 'Compliance — Data Retention Schedule: 7-Year Minimum per UAE Commercial Law' },
      { sub: 'BREACH',   title: 'Compliance — Data Breach Incident Response Workflow: Notification within 72h' },
      { sub: 'CONSENT',  title: 'Compliance — PDPL Consent Manager: Per-Purpose, Granular, Withdraw at Any Time' },
      { sub: 'MUBKHAR', title: 'Compliance — Mukhbarat / Government Portal Integration: GDRFA, MOHRE, DED Filings' },
      { sub: 'AUDIT-LOG', title: 'Compliance — Immutable Compliance Audit Log with Tamper-Proof Hash Chain' },
      { sub: 'POLICY',   title: 'Compliance — AML/CFT Policy Document Generator: Customized per RERA Requirements' },
      { sub: 'REPORT',   title: 'Compliance — Compliance KPI Dashboard: Open Items, Overdue, Upcoming Deadlines' },
      { sub: 'MOBILE',   title: 'Compliance — Mobile Compliance Card: Quick Status, Next Renewal, Action Button' },
      { sub: 'ARRTL',   title: 'Compliance — Arabic RTL Compliance Forms with Bilingual Regulatory Labels' },
      { sub: 'I18N',     title: 'Compliance — en.json & ar.json Keys: All Regulatory Status & Expiry Labels' },
      { sub: 'NOTIFY',   title: 'Compliance — Automated Compliance Alerts via WhatsApp, Email & In-App Banners' },
      { sub: 'CHECKLIST', title: 'Compliance — Pre-Transaction Compliance Checklist: AML/KYC Before Deal Sign-Off' },
      { sub: 'VAT-REG',  title: 'Compliance — VAT Registration Certificate Display & TRN Validation Engine' },
      { sub: 'CORP-TAX-REG', title: 'Compliance — Corporate Tax Registration Status: FTA Portal Sync & TIN Display' },
      { sub: 'TEST-UNIT', title: 'Compliance — Vitest Unit: Expiry Calc, AML Threshold, Sanction Match Algorithm' },
      { sub: 'TEST-E2E', title: 'Compliance — Playwright E2E: KYC Gate → Deal Creation → AML Check Journey' },
      { sub: 'DOCS',     title: 'Compliance — Regulatory Reference Manual + Legal Flowchart (UAE Law Mapped)' },
      { sub: 'BENCH',    title: 'Compliance — Benchmark: Sanction Screen < 200ms, KYC OCR < 3s per ID Scan' },
      { sub: 'GATE',     title: 'Compliance — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 58 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 35 (Wave 58): AI Virtual Concierge & 44-Assistant Mesh V2',
    wave: 58, code: 'AI-MESH',
    desc: 'Upgrade 44-AI Assistant mesh with GPT-4o/Gemini 1.5 Flash, multilingual voice, personalized property recommendations, and Zoe/Aurora sync',
    issues: [
      { sub: 'SPEC',     title: 'AI Mesh V2 — Architecture: Assistant Router, Confidence Thresholds & Model Cascade' },
      { sub: 'ROUTER',   title: 'AI Mesh V2 — Intent Router: Query Classification across 44 Specialist Domains' },
      { sub: 'GEMINI',   title: 'AI Mesh V2 — Gemini 1.5 Flash Integration: Property Q&A, Market Analysis, Valuation' },
      { sub: 'GPT4O',    title: 'AI Mesh V2 — GPT-4o Integration: Luxury Buyer Consultation & Investment Advice' },
      { sub: 'VOICE',    title: 'AI Mesh V2 — Multilingual Voice Concierge: Arabic, English, Hindi, Chinese, Russian' },
      { sub: 'RECOMMEND', title: 'AI Mesh V2 — ML Property Recommender: Collaborative Filtering on 10k+ Listings' },
      { sub: 'VALUATION', title: 'AI Mesh V2 — AI Automated Valuation Model (AVM): Dubai DLD Transaction Comps' },
      { sub: 'CHATBOT',  title: 'AI Mesh V2 — WhatsApp Chatbot: Lead Qualify, Viewing Book, FAQ via Meta API' },
      { sub: 'ZOE',      title: 'AI Mesh V2 — @Zoe (COO) Knowledge Sync: SLA Policies, Escalation Matrices' },
      { sub: 'AURORA',   title: 'AI Mesh V2 — @Aurora (CTO) Architecture Sync: SRS, SAD, API, DB, AI Catalogs' },
      { sub: 'PERSONA',  title: 'AI Mesh V2 — 44 Persona Profiles: Each with Specialty, Language & Fallback Model' },
      { sub: 'MEMORY',   title: 'AI Mesh V2 — Conversation Memory: Per-Session Context Store (Redis TTL 24h)' },
      { sub: 'EMBED',    title: 'AI Mesh V2 — Property Embeddings: OpenAI/Gemini Vector Embeddings in Pinecone' },
      { sub: 'SEARCH-AI', title: 'AI Mesh V2 — Semantic Property Search: "3 bed sea view Dubai Marina under 3M AED"' },
      { sub: 'TRANSLATE', title: 'AI Mesh V2 — Real-Time Translation: All 44 Assistants Support 10 Languages' },
      { sub: 'FALLBACK', title: 'AI Mesh V2 — Fallback Chain: AI Fail → Human Agent Handoff → WhatsApp Escalation' },
      { sub: 'SENTIMENT', title: 'AI Mesh V2 — Sentiment Analysis: Flag Frustrated/Urgent Leads for Immediate Call' },
      { sub: 'SUMMARY',  title: 'AI Mesh V2 — Conversation Summary Engine: Auto-Generate CRM Note after Chat' },
      { sub: 'INSIGHT',  title: 'AI Mesh V2 — Market Insight Assistant: "What is the ROI in JBR right now?"' },
      { sub: 'MORTGAGE-AI', title: 'AI Mesh V2 — AI Mortgage Advisor: Eligibility Check, Best Bank Picker, EMI Calc' },
      { sub: 'LEGAL-AI', title: 'AI Mesh V2 — AI Legal Assistant: RERA Clause Explainer, Tenant Rights UAE' },
      { sub: 'TAX-AI',   title: 'AI Mesh V2 — AI Tax Advisor: VAT on Property, Corporate Tax Impact for Investors' },
      { sub: 'DOCS-AI',  title: 'AI Mesh V2 — Document AI: Extract Data from Passports, Title Deeds, Contracts' },
      { sub: 'ALERT-AI', title: 'AI Mesh V2 — Proactive AI Alerts: Price Drop, New Match, Investment Opportunity' },
      { sub: 'TRAINING', title: 'AI Mesh V2 — Fine-Tuning Pipeline: Dubai Real Estate Q&A Dataset Curation' },
      { sub: 'MODERATION', title: 'AI Mesh V2 — Content Moderation: Block Illegal, Misleading & Off-Topic Outputs' },
      { sub: 'ANALYTICS', title: 'AI Mesh V2 — AI Usage Analytics: Queries, Accuracy Rate, Escalation Rate per Month' },
      { sub: 'COST',     title: 'AI Mesh V2 — Token Cost Monitor: Per-Query Cost Tracking with Budget Cap Alert' },
      { sub: 'MOBILE',   title: 'AI Mesh V2 — Mobile AI Chat UI: Floating Chat Button, Bottom Sheet, Voice Input' },
      { sub: 'ARRTL',   title: 'AI Mesh V2 — Arabic RTL Chat Bubbles with Right-to-Left Text Rendering' },
      { sub: 'I18N',     title: 'AI Mesh V2 — en.json & ar.json Keys for All 44 Assistant UI Labels & Prompts' },
      { sub: 'STREAM',   title: 'AI Mesh V2 — WebSocket Streaming Responses: Token-by-Token for Fast Perception' },
      { sub: 'AUDIT',    title: 'AI Mesh V2 — AI Audit Log: Every Query, Model Used, Response Stored (PDPL)' },
      { sub: 'SAFETY',   title: 'AI Mesh V2 — AI Safety Red-Teaming: Adversarial Prompt Attack Test Suite' },
      { sub: 'RATE',     title: 'AI Mesh V2 — Rate Limiting: Per-User 100 queries/day, Anti-Abuse Protection' },
      { sub: 'TEST-UNIT', title: 'AI Mesh V2 — Vitest Unit: Intent Router, Model Cascade, Fallback Logic' },
      { sub: 'TEST-E2E', title: 'AI Mesh V2 — Playwright E2E: Lead Chat → Property Recommend → WhatsApp Handoff' },
      { sub: 'DOCS',     title: 'AI Mesh V2 — 44 Assistant Profile Directory + Integration Architecture Doc' },
      { sub: 'BENCH',    title: 'AI Mesh V2 — Benchmark: First Token < 500ms, Full Response < 2s per Query' },
      { sub: 'GATE',     title: 'AI Mesh V2 — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 59 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 36 (Wave 59): Mobile App & PWA Excellence',
    wave: 59, code: 'PWA',
    desc: 'Production-grade PWA with installable app experience, offline support, push notifications, and 100 Lighthouse score',
    issues: [
      { sub: 'SPEC',     title: 'PWA — Architecture Spec: Service Worker Strategy, Cache Manifest & Install Criteria' },
      { sub: 'MANIFEST', title: 'PWA — Web App Manifest: Icons, Splash, Theme Color, Short Name, Orientation' },
      { sub: 'SW',       title: 'PWA — Workbox Service Worker: Cache-First, Network-First & Stale-While-Revalidate' },
      { sub: 'INSTALL',  title: 'PWA — Install Prompt: Custom "Add to Home Screen" CTA with Brand Dismiss Logic' },
      { sub: 'OFFLINE',  title: 'PWA — Offline Shell: Property Grid & Search Available Without Internet (Cached)' },
      { sub: 'PUSH',     title: 'PWA — Push Notifications: New Listing, Price Drop, Viewing Reminder via FCM' },
      { sub: 'SHARE',    title: 'PWA — Web Share API: Share Property Listings as Native Share Sheet on Mobile' },
      { sub: 'SHORTCUTS', title: 'PWA — App Shortcuts: "Search Properties", "Book Viewing", "My Wishlist"' },
      { sub: 'BADGE',    title: 'PWA — App Badge API: Unread Notification Count on Home Screen Icon' },
      { sub: 'SYNC',     title: 'PWA — Background Sync: Offline Lead Submissions Re-Sent When Back Online' },
      { sub: 'UPDATE',   title: 'PWA — SW Update Flow: Skip-Waiting Banner "New Version Available — Reload"' },
      { sub: 'DEEP-LINK', title: 'PWA — Deep Links: /properties/[slug] & /appointments Directly from Push CTA' },
      { sub: 'BIOMETRIC', title: 'PWA — WebAuthn Biometric Login: Face ID / Fingerprint on Supported Devices' },
      { sub: 'CAMERA',   title: 'PWA — Camera API: Scan QR Codes for Property Info & KYC Emirates ID Capture' },
      { sub: 'GEOLOCATION', title: 'PWA — Geolocation: "Properties Near Me" with Haversine Distance Ranking' },
      { sub: 'MOTION',   title: 'PWA — Device Motion: Gyroscope-Enabled 360° Tour Exploration on Mobile' },
      { sub: 'HAPTICS',  title: 'PWA — Haptic Feedback: Vibration on CTA Tap & Error States on iOS/Android' },
      { sub: 'ACCESSIBILITY', title: 'PWA — Mobile A11Y: 44px Touch Targets, VoiceOver, TalkBack Full Support' },
      { sub: 'SPLASH',   title: 'PWA — iOS/Android Splash Screens: All Device Sizes with White Caves Branding' },
      { sub: 'ICON',     title: 'PWA — App Icons: All Sizes (16×16 to 512×512) including Maskable for Android' },
      { sub: 'PERFORMANCE', title: 'PWA — Lighthouse 100 Performance: Zero Render-Blocking, Minimal JS Bundle' },
      { sub: 'TTI',      title: 'PWA — Time-to-Interactive < 2s on 3G: Code Splitting & Critical CSS Inline' },
      { sub: 'ARRTL',   title: 'PWA — Arabic RTL: dir="rtl" on Install Prompt, Push Notifications, Offline Page' },
      { sub: 'DARK',     title: 'PWA — Automatic Dark Mode: prefers-color-scheme with Brand Token Swap' },
      { sub: 'I18N',     title: 'PWA — PWA Content in en.json & ar.json: Install CTA, Offline Message, Push Text' },
      { sub: 'ANALYTICS', title: 'PWA — Workbox Analytics: Cache Hit Rate, Offline Usage %, Install Conversion' },
      { sub: 'PROTOCOLS', title: 'PWA — Protocol Handlers: Handle "web+whitecaves://" Deep Link Protocol' },
      { sub: 'BLUETOOTH', title: 'PWA — Web Bluetooth: NFC Property Tag Reader for Physical Signage at Sites' },
      { sub: 'PAYMENT',  title: 'PWA — Payment Request API: Stripe/Apple Pay/Google Pay One-Tap Checkout' },
      { sub: 'STORAGE',  title: 'PWA — IndexedDB Vault: Offline Property Data, Lead Drafts, Appointment Queue' },
      { sub: 'CONTACTS', title: 'PWA — Contact Picker API: Import Referral Contacts from Phone Address Book' },
      { sub: 'WAKELOCK', title: 'PWA — Wake Lock API: Screen Stay-On During 360° Property Tour Sessions' },
      { sub: 'CLIP',     title: 'PWA — Clipboard API: One-Click Copy for Property Links & Contact Details' },
      { sub: 'PRINT',    title: 'PWA — Print Dialog: Property Brochure Print with @media print Optimized CSS' },
      { sub: 'TELEMETRY', title: 'PWA — Real-User Monitoring: CrUX Field Data Integrated with GA4 + Sentry' },
      { sub: 'TEST-UNIT', title: 'PWA — Vitest Unit: SW Cache Strategy, Sync Queue, Notification Payload Tests' },
      { sub: 'TEST-E2E', title: 'PWA — Playwright E2E: Install Flow, Offline Browse, Push Click, Biometric Login' },
      { sub: 'DOCS',     title: 'PWA — PWA Implementation Guide + Lighthouse Audit Report Documentation' },
      { sub: 'BENCH',    title: 'PWA — Lighthouse Score: Performance 100, SEO 100, A11Y 95+, Best Practices 100' },
      { sub: 'GATE',     title: 'PWA — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 60 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 37 (Wave 60): SEO, Content Marketing & Dubai Property Blog',
    wave: 60, code: 'SEO',
    desc: 'Full SEO architecture for whitecaves.com: structured data, content strategy, Dubai real estate blog, and Google rank domination',
    issues: [
      { sub: 'SPEC',     title: 'SEO — Architecture: URL Structure, Sitemap Strategy, Canonical & Hreflang Plan' },
      { sub: 'SITEMAP',  title: 'SEO — Dynamic XML Sitemap: /properties, /blog, /areas, /developments Auto-Updated' },
      { sub: 'ROBOTS',   title: 'SEO — robots.txt: Crawl Budget Optimization, Disallow Private CRM URLs' },
      { sub: 'OG',       title: 'SEO — Open Graph Meta: Title, Description, Image, Type per Dynamic Property Page' },
      { sub: 'TWITTER',  title: 'SEO — Twitter/X Card Meta: Summary Large Image for Property Share Posts' },
      { sub: 'SCHEMA-PROPERTY', title: 'SEO — JSON-LD Per Listing: Apartment/House/LandForSale with AED Price' },
      { sub: 'SCHEMA-AGENT', title: 'SEO — JSON-LD RealEstateAgent: White Caves, RERA #, Address, Phone' },
      { sub: 'SCHEMA-FAQ', title: 'SEO — FAQ JSON-LD: "How to buy property in Dubai?", "What is RERA?"' },
      { sub: 'SCHEMA-REVIEW', title: 'SEO — Review JSON-LD: Aggregate Rating 4.9★ from Google & TrustPilot' },
      { sub: 'CORE-WEB', title: 'SEO — Core Web Vitals: CLS < 0.1, LCP < 2.5s, FID < 100ms All Pages' },
      { sub: 'BREADCRUMB', title: 'SEO — Breadcrumb JSON-LD on All Pages: Home > Area > Community > Property' },
      { sub: 'CANONICAL', title: 'SEO — Canonical Tags: Prevent Duplicate Content on Filter Permutations' },
      { sub: 'HREFLANG', title: 'SEO — Hreflang en-AE / ar-AE on All Pages for Arabic/English Targeting' },
      { sub: 'BLOG',     title: 'SEO — Real Estate Blog CMS: 100 Articles on Dubai Areas, Investment, Off-Plan' },
      { sub: 'KEYWORD',  title: 'SEO — Keyword Cluster Strategy: Dubai luxury villas, apartments for sale, ROI' },
      { sub: 'LOCAL-SEO', title: 'SEO — Google Business Profile: White Caves Real Estate, Deira, 5★ Reviews' },
      { sub: 'GSC',      title: 'SEO — Google Search Console Integration: Performance Monitoring & Index Check' },
      { sub: 'GA4',      title: 'SEO — GA4 Enhanced E-Commerce: Property View, Inquiry, Viewing Booking Events' },
      { sub: 'CONVERSION', title: 'SEO — Conversion Tracking: Google Ads / Meta Ads Pixel for Lead Attribution' },
      { sub: 'SPEED',    title: 'SEO — Page Speed: Critical CSS Inline, Font Preload, Third-Party Script Defer' },
      { sub: 'IMAGE-SEO', title: 'SEO — Image SEO: Alt Text, Descriptive File Names, AVIF/WebP with Lazy Load' },
      { sub: 'INTERNAL', title: 'SEO — Internal Linking Strategy: Area Hub Pages to Individual Listings' },
      { sub: 'AREA-PAGES', title: 'SEO — Area Landing Pages: Dubai Marina, Palm Jumeirah, Downtown, JBR, DIFC' },
      { sub: 'DEVELOPER-PAGES', title: 'SEO — Developer Pages: Emaar, DAMAC, Meraas, Sobha, Aldar, Nakheel' },
      { sub: 'COMMUNITY-PAGES', title: 'SEO — Community Pages: Business Bay, Arabian Ranches, City Walk, Bluewaters' },
      { sub: 'VIDEO-SEO', title: 'SEO — Video SEO: YouTube Embed + VideoObject JSON-LD for Property Tour Videos' },
      { sub: 'BACKLINK', title: 'SEO — Backlink Strategy: RERA Directory, Bayut, PF Partner Pages, UAE News' },
      { sub: 'SOCIAL',   title: 'SEO — Social Media SEO: LinkedIn, Instagram, TikTok Property Content Calendar' },
      { sub: 'EMAIL-SEO', title: 'SEO — Email Newsletter SEO: Monthly "Dubai Real Estate Market Report" to 10k' },
      { sub: 'SEARCH-CONSOLE', title: 'SEO — Index Coverage Alerts: Orphan Pages, 404s, Crawl Errors Auto-Fix' },
      { sub: 'REDIRECT', title: 'SEO — 301 Redirect Map: Old URL Structure to New /properties/[slug] Format' },
      { sub: 'MOBILE-SEO', title: 'SEO — Mobile-First Indexing: All Content Visible on Mobile, No Hidden Text' },
      { sub: 'VOICE-SEO', title: 'SEO — Voice Search Optimization: Conversational Keywords, Featured Snippets' },
      { sub: 'EEAT',     title: 'SEO — E-E-A-T Signals: Expert Author Bios, RERA Credentials, Trust Signals' },
      { sub: 'PENALTY',  title: 'SEO — Google Penalty Audit: Manual Actions, Algorithmic Filters, Link Disavow' },
      { sub: 'TEST-UNIT', title: 'SEO — Vitest Unit: Sitemap Generator, Canonical Builder, Schema Validator' },
      { sub: 'TEST-E2E', title: 'SEO — Playwright E2E: Verify All Meta Tags, JSON-LD, Hreflang on Key Pages' },
      { sub: 'DOCS',     title: 'SEO — SEO Playbook: Content Calendar, Keyword Map, Schema Reference Guide' },
      { sub: 'BENCH',    title: 'SEO — SEO Benchmark: Page 1 Google "Dubai luxury apartments" within 6 months' },
      { sub: 'GATE',     title: 'SEO — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 61 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 38 (Wave 61): WhatsApp Business API & Communications Hub',
    wave: 61, code: 'WHATSAPP',
    desc: 'Enterprise WhatsApp Business API integration: automated messaging, broadcast campaigns, chatbot flows, and CRM sync',
    issues: [
      { sub: 'SPEC',     title: 'WhatsApp Hub — Architecture: Meta Business API, Template Registry & Webhook Pipeline' },
      { sub: 'SETUP',    title: 'WhatsApp Hub — Meta Business API Setup: WABA Account, Phone Number, Webhook URL' },
      { sub: 'TEMPLATE', title: 'WhatsApp Hub — Template Library: Viewing Confirmation, Lead Qualify, Follow-Up, Invoice' },
      { sub: 'CHATBOT',  title: 'WhatsApp Hub — AI Chatbot Flow Builder: Property Search, FAQ, Appointment Booking' },
      { sub: 'BROADCAST', title: 'WhatsApp Hub — Broadcast Campaign Engine: Segment Leads & Send Property Alerts' },
      { sub: 'CRM-SYNC', title: 'WhatsApp Hub — Bidirectional CRM Sync: Every WhatsApp Message Logged on Lead' },
      { sub: 'INBOX',    title: 'WhatsApp Hub — Unified WhatsApp Inbox: All Agent Numbers in One Shared Panel' },
      { sub: 'ASSIGN',   title: 'WhatsApp Hub — Auto-Assign Conversations: by Language, Specialty, Round-Robin' },
      { sub: 'MEDIA',    title: 'WhatsApp Hub — Media Send: Property Brochure PDF, Floor Plan Image, Video Tour' },
      { sub: 'BUTTON',   title: 'WhatsApp Hub — Interactive CTA Buttons: "Book Viewing", "Get Price", "More Info"' },
      { sub: 'LIST',     title: 'WhatsApp Hub — List Messages: "Choose Property Type" with 10 Options Display' },
      { sub: 'CATALOG',  title: 'WhatsApp Hub — WhatsApp Product Catalog: Property Listings via Meta Commerce' },
      { sub: 'PAYMENT',  title: 'WhatsApp Hub — WhatsApp Pay Integration: Booking Fee Collection In-Chat' },
      { sub: 'LOCATION', title: 'WhatsApp Hub — Location Message: Send Development Site GPS Pin to Prospect' },
      { sub: 'REACTION', title: 'WhatsApp Hub — Message Reactions Tracking: Engagement Analytics per Campaign' },
      { sub: 'OPTIN',    title: 'WhatsApp Hub — UAE PDPL Opt-In Gate: Explicit Consent Before First Message' },
      { sub: 'OPTOUT',   title: 'WhatsApp Hub — "STOP" Opt-Out Handler: Immediate Unsubscribe & DNC Registry' },
      { sub: 'FALLBACK', title: 'WhatsApp Hub — Fallback: WhatsApp Fail → SMS Fallback → Email via Twilio' },
      { sub: 'HOURS',    title: 'WhatsApp Hub — Business Hours Auto-Reply: "We reply within 15 mins during 9–6pm"' },
      { sub: 'HANDOFF',  title: 'WhatsApp Hub — Bot-to-Human Handoff: "Connect to Agent" with Context Packet' },
      { sub: 'ANALYTICS', title: 'WhatsApp Hub — Campaign Analytics: Open, Read, Reply, Click, Conversion Rates' },
      { sub: 'A/B',      title: 'WhatsApp Hub — A/B Testing Framework: Template Variants, Timing, Language Tests' },
      { sub: 'DRIP',     title: 'WhatsApp Hub — Drip Campaign Builder: 7-Touch Nurture Sequence for Cold Leads' },
      { sub: 'REFERRAL', title: 'WhatsApp Hub — Referral Share: "Share This Property" Button with UTM Tracking' },
      { sub: 'REVIEW',   title: 'WhatsApp Hub — Post-Deal Review Request: Auto-Send Google Review Link after Close' },
      { sub: 'SURVEY',   title: 'WhatsApp Hub — Client Satisfaction Survey: 5-Question NPS via WhatsApp Poll' },
      { sub: 'REMINDER', title: 'WhatsApp Hub — Appointment Reminders: 24h & 1h Before Viewing Auto-Message' },
      { sub: 'ARRTL',   title: 'WhatsApp Hub — Arabic RTL Template Messages with Proper Bidirectional Encoding' },
      { sub: 'I18N',     title: 'WhatsApp Hub — Template Translations: en/ar/hi/zh/ru for All Campaign Types' },
      { sub: 'WEBHOOK',  title: 'WhatsApp Hub — Webhook Security: HMAC-SHA256 Signature Verification on Receive' },
      { sub: 'RATE',     title: 'WhatsApp Hub — Rate Limit Manager: Respect Meta API Tier Limits, Queue Overflow' },
      { sub: 'LOG',      title: 'WhatsApp Hub — Message Delivery Log: Sent, Delivered, Read, Failed per Message' },
      { sub: 'ENCRYPT',  title: 'WhatsApp Hub — End-to-End Encryption Compliance: No Plain-Text PII in Logs' },
      { sub: 'REPORT',   title: 'WhatsApp Hub — Monthly WhatsApp Performance Report PDF with Brand Letterhead' },
      { sub: 'COST',     title: 'WhatsApp Hub — Meta API Cost Tracker: Per-Message AED Cost & Budget Alert' },
      { sub: 'TEST-UNIT', title: 'WhatsApp Hub — Vitest Unit: Template Builder, Webhook Parser, Assign Logic' },
      { sub: 'TEST-E2E', title: 'WhatsApp Hub — Playwright E2E: Simulate Lead → Bot → Handoff → Reply Flow' },
      { sub: 'DOCS',     title: 'WhatsApp Hub — Template Registry Documentation + Meta API Integration Guide' },
      { sub: 'BENCH',    title: 'WhatsApp Hub — Benchmark: Message Delivery < 3s, Bot Response < 1.5s' },
      { sub: 'GATE',     title: 'WhatsApp Hub — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 62 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 39 (Wave 62): Performance, Caching & 300% Speed Protocol',
    wave: 62, code: 'PERF',
    desc: 'Sub-10ms database queries, Redis cluster, edge caching, CDN optimization, and 300% throughput acceleration',
    issues: [
      { sub: 'SPEC',     title: 'Performance — Architecture: Cache Topology, MapIndexHash Strategy & Sub-10ms SLA' },
      { sub: 'REDIS',    title: 'Performance — Redis Cluster: Property Cache, Session Store, Rate Limiter (TTL Strategy)' },
      { sub: 'MAPINDEX', title: 'Performance — MapIndexHash O(1) Lookup: All Entity Indexes for Sub-10ms Query' },
      { sub: 'CDN',      title: 'Performance — Vercel Edge Network: CDN Headers, Cache-Control, Purge API' },
      { sub: 'COMPRESS', title: 'Performance — Brotli/Gzip Compression: All API Responses and Static Assets' },
      { sub: 'BUNDLE',   title: 'Performance — JS Bundle Optimization: Tree Shaking, Lazy Chunks, Code Splitting' },
      { sub: 'CRITICAL-CSS', title: 'Performance — Critical CSS Extraction: Inline Above-the-Fold, Defer Rest' },
      { sub: 'FONT',     title: 'Performance — Font Loading: font-display: swap, Subset Arabic + Latin, Preload' },
      { sub: 'IMAGE',    title: 'Performance — Image Pipeline: AVIF > WebP > JPEG Fallback with CDN Resize' },
      { sub: 'HTTP3',    title: 'Performance — HTTP/3 & QUIC: Enable on Vercel/Cloudflare for Faster Mobile' },
      { sub: 'PREFETCH', title: 'Performance — Link Prefetch: Hover-Based Route Prefetch on Property Cards' },
      { sub: 'MEMO',     title: 'Performance — Memoization: React.memo, useMemo, useCallback Audit across CRM' },
      { sub: 'VDOM',     title: 'Performance — Virtual DOM Optimization: Remove Unnecessary Re-Renders with Profiler' },
      { sub: 'DB-INDEX', title: 'Performance — PostgreSQL/MongoDB Indexes: Compound, Partial, Covering for CRM Queries' },
      { sub: 'POOL',     title: 'Performance — Database Connection Pool: PgBouncer/Prisma Pool Sizing & Monitoring' },
      { sub: 'QUERY',    title: 'Performance — N+1 Query Elimination: Prisma includes, DataLoader for Batch Fetch' },
      { sub: 'SWR',      title: 'Performance — SWR/React Query Config: Dedupe, Background Refresh, Retry Logic' },
      { sub: 'THROTTLE', title: 'Performance — API Throttle: 100 req/min per IP, Burst 200, Redis Token Bucket' },
      { sub: 'QUEUE',    title: 'Performance — Bull/BullMQ Job Queue: Heavy Tasks Offloaded from Request Thread' },
      { sub: 'WARM',     title: 'Performance — Cache Warm-Up: Pre-Load Top 100 Property Pages at Deploy Time' },
      { sub: 'EDGE-FUNCTIONS', title: 'Performance — Vercel Edge Functions: Auth, Geo-Redirect, A/B at Network Edge' },
      { sub: 'STREAM',   title: 'Performance — HTTP Streaming: Server-Sent Events for Long-Running Report Jobs' },
      { sub: 'WASM',     title: 'Performance — WebAssembly: AVM Valuation Model Compiled to WASM for Speed' },
      { sub: 'PROFILER', title: 'Performance — Browser Profiler Analysis: Long Tasks, Layout Thrash, Paint Storms' },
      { sub: 'MONITOR',  title: 'Performance — APM Dashboard: Datadog/Sentry Performance Monitoring + Alerts' },
      { sub: 'LIGHTHOUSE', title: 'Performance — Automated Lighthouse CI: Fail PR if Score < 90 on Any Metric' },
      { sub: 'RUM',      title: 'Performance — Real User Monitoring: CrUX + GA4 Custom Metrics per Country' },
      { sub: 'BUDGET',   title: 'Performance — Performance Budget: JS < 200KB, CSS < 50KB, Image < 150KB per Page' },
      { sub: 'THIRD-PARTY', title: 'Performance — Third-Party Script Audit: Defer/Remove Non-Critical Scripts' },
      { sub: 'DEAD-CODE', title: 'Performance — Dead Code Elimination: Bundle Analyzer + Unused Exports Prune' },
      { sub: 'CSS-OPT',  title: 'Performance — PurgeCSS: Remove Unused CSS Rules from Production Build' },
      { sub: 'LAZY',     title: 'Performance — Lazy Loading: All Below-Fold Images, Maps, Charts, Videos' },
      { sub: 'API-CACHE', title: 'Performance — API Response Cache: stale-while-revalidate for Public Endpoints' },
      { sub: 'WORKER',   title: 'Performance — Web Worker: Offload Heavy Calc (Mortgage, ROI) from Main Thread' },
      { sub: 'PRERENDER', title: 'Performance — Pre-Render: Static Area Pages, Developer Pages at Build Time' },
      { sub: 'TEST-UNIT', title: 'Performance — Vitest Unit: Cache Hit Logic, Index Query Speed, Pool Config' },
      { sub: 'TEST-E2E', title: 'Performance — Playwright Perf E2E: Network Throttle 3G, Verify LCP < 2.5s' },
      { sub: 'DOCS',     title: 'Performance — Performance Runbook: Cache Key Strategy, Invalidation, Pool Sizing' },
      { sub: 'BENCH',    title: 'Performance — Benchmark: 10k Concurrent Users, P99 < 200ms API Response' },
      { sub: 'GATE',     title: 'Performance — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 63 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 40 (Wave 63): Security Hardening & OWASP Compliance',
    wave: 63, code: 'SECURITY',
    desc: 'Enterprise security hardening: OWASP Top 10, CSP, CORS, CSRF, JWT, HTTPS enforcement, and penetration testing',
    issues: [
      { sub: 'SPEC',     title: 'Security — Architecture: Threat Model, Trust Boundary Map & Security Control Matrix' },
      { sub: 'OWASP',    title: 'Security — OWASP Top 10 Remediation: SQLi, XSS, SSRF, IDOR, Broken Auth Fixes' },
      { sub: 'CSP',      title: 'Security — Content Security Policy: Strict CSP Header with Nonce-Based Script Allow' },
      { sub: 'CORS',     title: 'Security — CORS Policy: Allowlist whitecaves.com & admin.whitecaves.com Only' },
      { sub: 'CSRF',     title: 'Security — CSRF Protection: Double-Submit Cookie + SameSite=Strict on All Forms' },
      { sub: 'JWT',      title: 'Security — JWT: RS256 Signing, 15-min Access Token, Refresh Token Rotation' },
      { sub: 'HTTPS',    title: 'Security — HTTPS Enforcement: HSTS max-age=63072000, includeSubDomains, Preload' },
      { sub: 'RATE',     title: 'Security — Rate Limiting: Auth Endpoint 5 req/min, API 100 req/min with Lockout' },
      { sub: 'INPUT',    title: 'Security — Input Validation: Zod Schemas on All API Routes, HTML Sanitization' },
      { sub: 'AUTH',     title: 'Security — Authentication Hardening: Bcrypt cost 12, MFA TOTP (Authenticator App)' },
      { sub: 'SESSION',  title: 'Security — Session Security: HttpOnly, Secure Cookies, 30-Min Idle Timeout' },
      { sub: 'PRIVILEGE', title: 'Security — Least Privilege: Row-Level Security in PostgreSQL, API Scope Enforcement' },
      { sub: 'SECRETS',  title: 'Security — Secrets Management: Vault/AWS Secrets Manager, No Plaintext .env in Git' },
      { sub: 'DEP',      title: 'Security — Dependency Audit: npm audit, Dependabot Alerts, Zero Critical CVEs' },
      { sub: 'SCAN',     title: 'Security — SAST: CodeQL + Semgrep Scan on Every PR, Block Merge on Critical Findings' },
      { sub: 'DAST',     title: 'Security — DAST: OWASP ZAP Automated Scan on Staging Before Every Deploy' },
      { sub: 'PENTEST',  title: 'Security — Annual Penetration Test: External Firm with RERA Audit Trail Evidence' },
      { sub: 'WAF',      title: 'Security — Web Application Firewall: Cloudflare WAF Rules + Bot Management' },
      { sub: 'DDOS',     title: 'Security — DDoS Protection: Cloudflare Shield + Vercel Rate Limiting Layer' },
      { sub: 'LOG',      title: 'Security — Security Log: All Auth Events, Role Changes, API Calls to SIEM' },
      { sub: 'ALERT',    title: 'Security — Security Alerts: PagerDuty Integration for Critical Threat Detection' },
      { sub: 'INCIDENT', title: 'Security — Incident Response Playbook: Breach → Contain → Notify → Recover' },
      { sub: 'BACKUP',   title: 'Security — Encrypted Backups: AES-256 Daily DB Backup to S3 with 90-Day Retain' },
      { sub: 'RECOVERY', title: 'Security — Disaster Recovery: RTO < 4h, RPO < 1h, Tested Quarterly' },
      { sub: 'SUBRESOURCE', title: 'Security — Subresource Integrity: SRI Hash on All CDN-Loaded Scripts & CSS' },
      { sub: 'UPLOAD',   title: 'Security — File Upload Security: Type Whitelist, Size Limit, Malware Scan (ClamAV)' },
      { sub: 'API-KEY',  title: 'Security — API Key Management: Scoped Keys, Rotation Schedule, Usage Monitor' },
      { sub: 'ENCRYPTION', title: 'Security — Data Encryption at Rest: AES-256 for PII Fields in DB' },
      { sub: 'TRANSPORT', title: 'Security — Transport Security: TLS 1.3 Only, Cipher Suite Hardening' },
      { sub: 'COOKIE',   title: 'Security — Cookie Audit: Remove All Non-Essential Tracking Cookies, PDPL-Compliant' },
      { sub: 'LOGOUT',   title: 'Security — Logout Security: Server-Side Token Revocation + Redis Blacklist' },
      { sub: 'MFA',      title: 'Security — MFA Enforcement: Mandatory for MD, Managers & Finance Role Users' },
      { sub: 'ADMIN',    title: 'Security — Admin Panel Security: IP Allowlist + MFA + Activity Log for /admin' },
      { sub: 'PRIVACY',  title: 'Security — Privacy Headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy' },
      { sub: 'AUDIT',    title: 'Security — Security Audit Log: Immutable, Cryptographically Signed per Entry' },
      { sub: 'TEST-UNIT', title: 'Security — Vitest Unit: CSRF Token, JWT Validate, Input Sanitize, Rate Limit' },
      { sub: 'TEST-E2E', title: 'Security — Playwright Security E2E: XSS Injection Attempt, Auth Bypass Test' },
      { sub: 'DOCS',     title: 'Security — Security Policy Document + OWASP Compliance Checklist + DRP' },
      { sub: 'BENCH',    title: 'Security — Security Benchmark: Zero Critical CVEs, OWASP ZAP Clean Report' },
      { sub: 'GATE',     title: 'Security — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 64 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 41 (Wave 64): DevOps, CI/CD & Cloud Infrastructure',
    wave: 64, code: 'DEVOPS',
    desc: 'Enterprise CI/CD pipeline, zero-downtime deployments, multi-region redundancy, monitoring, and auto-scaling',
    issues: [
      { sub: 'SPEC',     title: 'DevOps — Architecture: Pipeline Stages, Environment Strategy & IaC Blueprint' },
      { sub: 'GITHUB-ACTIONS', title: 'DevOps — GitHub Actions: PR Check → Lint → Test → Build → Deploy Pipeline' },
      { sub: 'PREVIEW',  title: 'DevOps — Vercel Preview Deployments: Per-PR Staging URL with Auto-Comment' },
      { sub: 'PRODUCTION', title: 'DevOps — Zero-Downtime Production Deploy: Blue-Green Strategy on Vercel' },
      { sub: 'ROLLBACK', title: 'DevOps — Instant Rollback: One-Click Previous Deploy via Vercel CLI / GitHub Action' },
      { sub: 'ENVIRONMENTS', title: 'DevOps — Environment Management: dev / staging / production with Secret Isolation' },
      { sub: 'DOCKER',   title: 'DevOps — Dockerized Services: Dockerfile.server + docker-compose for Local Dev' },
      { sub: 'IaC',      title: 'DevOps — Infrastructure as Code: Terraform for DNS, SSL, S3, CloudFront Setup' },
      { sub: 'MONITORING', title: 'DevOps — APM Monitoring: Sentry + Datadog Dashboards for Error Rate & Latency' },
      { sub: 'UPTIME',   title: 'DevOps — Uptime Monitoring: Pingdom/UptimeRobot 99.9% SLA with PagerDuty Alert' },
      { sub: 'LOGS',     title: 'DevOps — Centralized Logs: Vercel Log Drain → Datadog / Papertrail Aggregation' },
      { sub: 'AUTOSCALE', title: 'DevOps — Auto-Scaling: Vercel Serverless + DB Read Replicas on Traffic Spike' },
      { sub: 'HEALTH',   title: 'DevOps — /api/health Endpoint: Memory, DB Connection, Redis Ping, API Version' },
      { sub: 'COST',     title: 'DevOps — Cloud Cost Dashboard: Monthly Spend by Service, Budget Alerts' },
      { sub: 'CDN',      title: 'DevOps — CDN Strategy: Vercel Edge + Cloudflare R2 for Media Asset Storage' },
      { sub: 'DNS',      title: 'DevOps — DNS Management: whitecaves.com, admin.whitecaves.com, api.whitecaves.com' },
      { sub: 'SSL',      title: 'DevOps — SSL/TLS: Auto-Renewing Let\'s Encrypt, ECDSA, HSTS Preload Submit' },
      { sub: 'REGION',   title: 'DevOps — Multi-Region: UAE-East Primary, EU-West Failover, Asia Latency Routing' },
      { sub: 'BACKUP',   title: 'DevOps — Automated Daily Backups: DB Snapshot to S3, 90-Day Retention + Test Restore' },
      { sub: 'CRON',     title: 'DevOps — Cron Jobs: License Expiry Checks, Lead Nurture, Report Generation Jobs' },
      { sub: 'QUEUE',    title: 'DevOps — Redis Queue Infrastructure: BullMQ Workers, Dead Letter Queue, Retries' },
      { sub: 'SECRETS',  title: 'DevOps — Secrets Rotation: Quarterly API Key Rotation Script + Audit Log' },
      { sub: 'SCAN',     title: 'DevOps — Container Security Scan: Trivy on Docker Images in CI, Block Critical' },
      { sub: 'COMPLIANCE', title: 'DevOps — SOC 2 Readiness: Evidence Collection for Vercel Infrastructure Audit' },
      { sub: 'NOTIFY',   title: 'DevOps — Deploy Notifications: Slack/Teams Channel + WhatsApp on Deploy Events' },
      { sub: 'SMOKE',    title: 'DevOps — Post-Deploy Smoke Tests: 10 Critical User Journeys via Playwright' },
      { sub: 'CANARY',   title: 'DevOps — Canary Releases: 5% Traffic Shift with Automated Rollback on Error Spike' },
      { sub: 'FEATURE-FLAG', title: 'DevOps — Feature Flags: LaunchDarkly / OpenFeature for Gradual Rollout' },
      { sub: 'GITOPS',   title: 'DevOps — GitOps: All Infrastructure Changes via PR, No Direct Console Edits' },
      { sub: 'ARTIFACT', title: 'DevOps — Build Artifact Registry: Versioned Builds Stored 90 Days for Rollback' },
      { sub: 'TEST-PERF', title: 'DevOps — Load Test in CI: k6 Runs on Staging with 500 Virtual Users Before Deploy' },
      { sub: 'SBOM',     title: 'DevOps — Software Bill of Materials (SBOM): CycloneDX per Release for Supply Chain' },
      { sub: 'CHAOS',    title: 'DevOps — Chaos Engineering: Gremlin/LitmusChaos Quarterly DR Test' },
      { sub: 'RELEASE',  title: 'DevOps — Release Notes Generator: Auto-Changelog from Conventional Commits' },
      { sub: 'OBSERVABILITY', title: 'DevOps — Distributed Tracing: OpenTelemetry + Jaeger across API, DB, Queue' },
      { sub: 'TEST-UNIT', title: 'DevOps — Vitest Unit: Health Check Logic, Cron Scheduler, Queue Handler Tests' },
      { sub: 'TEST-E2E', title: 'DevOps — Playwright E2E: Full Smoke Suite Run in GitHub Actions on Every Deploy' },
      { sub: 'DOCS',     title: 'DevOps — Infrastructure Runbook: Scaling, Rollback, Incident, Cost Optimization' },
      { sub: 'BENCH',    title: 'DevOps — Benchmark: Deploy Time < 3min, Zero-Downtime, 99.9% Monthly Uptime' },
      { sub: 'GATE',     title: 'DevOps — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Waves 65–74: Remaining 13 milestones ──────────────────────────────────
  {
    title: 'Milestone 42 (Wave 65): Off-Plan Developments & OQOOD Management',
    wave: 65, code: 'OFFPLAN',
    desc: 'Dedicated off-plan project microsites, OQOOD registration, payment plan tables, escrow tracking, and developer portals',
    issues: [
      { sub: 'SPEC',     title: 'Off-Plan — Architecture: Project Registry, OQOOD Model & Payment Plan Schema' },
      { sub: 'MICROSITE', title: 'Off-Plan — Project Microsite Builder: Individual Landing Pages per Development' },
      { sub: 'OQOOD',    title: 'Off-Plan — OQOOD Registration: DLD Off-Plan API Integration for Buyer Reg' },
      { sub: 'PAYMENT-PLAN', title: 'Off-Plan — Payment Plan Table: % Milestones, Dates, On-Completion Structure' },
      { sub: 'ESCROW',   title: 'Off-Plan — Escrow Account Tracker: RERA-Mandated Developer Drawdown Control' },
      { sub: 'DEVELOPER', title: 'Off-Plan — Developer Portal: Emaar, DAMAC, Sobha API Data Feed Integration' },
      { sub: 'LAUNCH',   title: 'Off-Plan — Launch Event Module: Countdown Timer, EOI Collection, Priority List' },
      { sub: 'RENDER',   title: 'Off-Plan — 3D Render Gallery: High-Res Architectural Visualizations with Lightbox' },
      { sub: 'PROGRESS', title: 'Off-Plan — Construction Progress Tracker: % Complete with Drone Photo Updates' },
      { sub: 'HANDOVER', title: 'Off-Plan — Handover Timeline: Expected Date, Snag List, Keys Collection Flow' },
      { sub: 'BROKER-COMM', title: 'Off-Plan — Broker Commission Register: Developer % + Override Rules + Payout' },
      { sub: 'INVENTORY', title: 'Off-Plan — Unit Inventory Matrix: Available, Reserved, Sold Status by Floor/Unit' },
      { sub: 'COOLING',  title: 'Off-Plan — Cooling-Off Period: 10-Day Cancellation Right per Dubai Law 13/2008' },
      { sub: 'NOC-DEV',  title: 'Off-Plan — Developer NOC Tracker: Title Transfer Prerequisite Compliance' },
      { sub: 'SPA-OFFPLAN', title: 'Off-Plan — SPA Template: Off-Plan Specific Clauses, PDC Schedule, Sinking Fund' },
      { sub: 'COMPARISON', title: 'Off-Plan — Development Comparison: Side-by-Side Price/ROI/Completion Matrix' },
      { sub: 'NEWSLETTER', title: 'Off-Plan — Off-Plan Newsletter: Monthly Launch Alerts to Investor Database' },
      { sub: 'INVESTOR', title: 'Off-Plan — Investor ROI Calculator: Capital Appreciation + Rental Yield AED' },
      { sub: 'MAP',      title: 'Off-Plan — Master Community Map: All White Caves Off-Plan Projects on Dubai Map' },
      { sub: 'ARRTL',   title: 'Off-Plan — Arabic RTL Project Microsite with Bilingual Payment Plan Tables' },
      { sub: 'MOBILE',   title: 'Off-Plan — Mobile Off-Plan Card: Swipeable Project Gallery + EOI CTA Bottom' },
      { sub: 'I18N',     title: 'Off-Plan — en.json & ar.json Keys for All Off-Plan Labels, Stages & Statuses' },
      { sub: 'STREAM',   title: 'Off-Plan — WebSocket: Real-Time Unit Availability Update (Sold / Available Pulse)' },
      { sub: 'AUDIT',    title: 'Off-Plan — Audit Trail: Every Reservation, Cancellation, Payment Cryptographically Logged' },
      { sub: 'REPORT',   title: 'Off-Plan — Off-Plan Portfolio Report: Projects, AED Value, Completion, ROI KPIs' },
      { sub: 'EXPORT',   title: 'Off-Plan — Export Project Inventory to Excel/PDF with Developer Branding' },
      { sub: 'EOI',      title: 'Off-Plan — Expression of Interest Form: Buyer Profile, Budget, Unit Preference' },
      { sub: 'LEAD',     title: 'Off-Plan — Off-Plan Lead CRM: Stage-Specific Off-Plan Funnel with Developer Link' },
      { sub: 'SEO',      title: 'Off-Plan — Off-Plan SEO: /off-plan/[project-slug] with JSON-LD & Hreflang' },
      { sub: 'CALENDAR', title: 'Off-Plan — Off-Plan Calendar: Launch Dates, Handover Dates, Payment Milestones' },
      { sub: 'NOTIFY',   title: 'Off-Plan — Automated Alerts: Construction Update, Launch Alert, Handover Notice' },
      { sub: 'VIDEO',    title: 'Off-Plan — Project Video: Drone Footage, CGI Walkthrough with Autoplay in Hero' },
      { sub: 'TESTIMONIAL', title: 'Off-Plan — Buyer Testimonials: Video/Text Reviews from Off-Plan Purchasers' },
      { sub: 'RESALE',   title: 'Off-Plan — Off-Plan Resale Module: Secondary Market Listing of Contracted Units' },
      { sub: 'FINANCE',  title: 'Off-Plan — Financing Guide: Bank Partners for Off-Plan Mortgages + Eligibility' },
      { sub: 'TEST-UNIT', title: 'Off-Plan — Vitest Unit: Payment Plan Calc, Escrow Drawdown Logic, OQOOD Schema' },
      { sub: 'TEST-E2E', title: 'Off-Plan — Playwright E2E: EOI → Payment Plan → OQOOD → Handover Full Flow' },
      { sub: 'DOCS',     title: 'Off-Plan — Off-Plan Playbook: Developer API Guides + RERA OQOOD Reference' },
      { sub: 'BENCH',    title: 'Off-Plan — Benchmark: Project Microsite < 2s Load, Unit Inventory < 50ms Query' },
      { sub: 'GATE',     title: 'Off-Plan — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 66 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 43 (Wave 66): Mortgage, Finance & Investment Analytics',
    wave: 66, code: 'MORTGAGE',
    desc: 'Comprehensive UAE mortgage calculators, bank API integrations, investment ROI modelling, and portfolio analytics',
    issues: [
      { sub: 'SPEC',     title: 'Mortgage — Architecture: Calculator Engine, Bank API Contract & Portfolio Data Model' },
      { sub: 'CALC',     title: 'Mortgage — UAE Mortgage Calculator: LTV 80%, EIBOR + Spread, Fixed vs Variable' },
      { sub: 'AFFORDABILITY', title: 'Mortgage — Affordability Calculator: Salary-to-EMI Ratio per UAE Bank Rules' },
      { sub: 'ELIGIBILITY', title: 'Mortgage — Eligibility Checker: UAE Resident vs Non-Resident, Salary, Age, DBR' },
      { sub: 'BANK-API', title: 'Mortgage — Bank Partner API: Emirates NBD, ADCB, FAB, HSBC Pre-Qualification' },
      { sub: 'COMPARE',  title: 'Mortgage — Mortgage Comparison: Side-by-Side Rate, EMI, Total Cost across Banks' },
      { sub: 'AMORTIZE', title: 'Mortgage — Amortization Schedule: Monthly AED Breakdown for Loan Duration' },
      { sub: 'DLD-FEES', title: 'Mortgage — DLD Fee Calculator: 4% Transfer + 0.25% Mortgage Reg + Admin AED' },
      { sub: 'INSURANCE', title: 'Mortgage — Mortgage Life Insurance: Coverage Calc + Provider Comparison' },
      { sub: 'REFINANCE', title: 'Mortgage — Refinance Calculator: Break-Even Analysis, Savings vs Cost' },
      { sub: 'ROI-CALC', title: 'Mortgage — Investment ROI: Net Yield After Mortgage vs Cash Purchase Comparison' },
      { sub: 'CAP-RATE', title: 'Mortgage — Cap Rate Calculator: NOI / Property Value with Service Charge Deduction' },
      { sub: 'GRM',      title: 'Mortgage — Gross Rent Multiplier: Purchase Price / Annual Rent by Community' },
      { sub: 'IRR',      title: 'Mortgage — Internal Rate of Return: 5-Year Exit Strategy with Capital Gain Projection' },
      { sub: 'PORTFOLIO', title: 'Mortgage — Investment Portfolio Tracker: Multi-Property AED Value, Yield, LTV' },
      { sub: 'GOLDEN-VISA', title: 'Mortgage — Golden Visa Eligibility: AED 2M+ Property Investment Calculator' },
      { sub: 'FX-IMPACT', title: 'Mortgage — FX Impact Analysis: Mortgage in USD vs AED for Non-Resident Buyers' },
      { sub: 'TAX-INVEST', title: 'Mortgage — Tax Efficiency: 0% Capital Gains, 0% Income Tax UAE Advantage Brief' },
      { sub: 'CHART',    title: 'Mortgage — Interactive Charts: Amortization, Portfolio Growth, Market Comparison' },
      { sub: 'SAVE',     title: 'Mortgage — Save & Share Calculation: Unique URL, PDF Export, WhatsApp Share' },
      { sub: 'HISTORY',  title: 'Mortgage — Interest Rate History: EIBOR 5-Year Chart with Projection Band' },
      { sub: 'MARKET',   title: 'Mortgage — Dubai Market Data: Average Price/sqft by Community, YoY Growth %' },
      { sub: 'BROKER',   title: 'Mortgage — Mortgage Broker Referral: White Caves Partner Broker Commission Calc' },
      { sub: 'PREAPPROVAL', title: 'Mortgage — Pre-Approval Application: Online Submission to Bank Partner APIs' },
      { sub: 'ARRTL',   title: 'Mortgage — Arabic RTL Calculator with Right-Aligned AED Figures & Arabic Labels' },
      { sub: 'MOBILE',   title: 'Mortgage — Mobile Mortgage Calc: Touch-Friendly Sliders with Instant Results' },
      { sub: 'I18N',     title: 'Mortgage — en.json & ar.json Keys for All Calculator Labels & Result Text' },
      { sub: 'EMBED',    title: 'Mortgage — Embeddable Calculator Widget for Developer & Bank Partner Sites' },
      { sub: 'PDF',      title: 'Mortgage — PDF Investment Report: Full Calc Summary with White Caves Branding' },
      { sub: 'NOTIFY',   title: 'Mortgage — Rate Alert: Notify When EIBOR Drops Below Threshold via Email/WhatsApp' },
      { sub: 'AUDIT',    title: 'Mortgage — Audit Log: Calculator Sessions Stored for Re-Marketing & Lead Score' },
      { sub: 'COMMUNITY', title: 'Mortgage — Community ROI Database: Cached Yield% per Community Updated Monthly' },
      { sub: 'NRI',      title: 'Mortgage — NRI Guide: Indian Buyer Mortgage + Repatriation Rules + FEMA Basics' },
      { sub: 'CRYPTO',   title: 'Mortgage — Crypto-to-AED Purchase Guide: DLD Accepted Crypto Protocol Overview' },
      { sub: 'LEGAL',    title: 'Mortgage — Legal Cost Estimator: Conveyancing, NOC, Title, Power of Attorney Fees' },
      { sub: 'TEST-UNIT', title: 'Mortgage — Vitest Unit: EMI Formula, ROI Calc, DLD Fee Math, Rate Comparison' },
      { sub: 'TEST-E2E', title: 'Mortgage — Playwright E2E: Calc Journey → Save PDF → Share WhatsApp → Lead Create' },
      { sub: 'DOCS',     title: 'Mortgage — Calculator Methodology Doc + UAE Banking Regulation Reference' },
      { sub: 'BENCH',    title: 'Mortgage — Benchmark: Calculator Result < 50ms, Bank API < 500ms Response' },
      { sub: 'GATE',     title: 'Mortgage — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 67 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 44 (Wave 67): Scheduling, Viewings & Calendar Management',
    wave: 67, code: 'SCHEDULE',
    desc: 'End-to-end property viewing scheduler with Google/Outlook sync, automated reminders, and CRM pipeline integration',
    issues: [
      { sub: 'SPEC',     title: 'Scheduling — Architecture: Booking Engine, Calendar API Contract & Availability Model' },
      { sub: 'CALENDAR', title: 'Scheduling — Google Calendar & Outlook Sync: Two-Way Bidirectional Appointment Sync' },
      { sub: 'BOOKING',  title: 'Scheduling — Online Viewing Booking: Date/Time Picker with Agent Availability Check' },
      { sub: 'CONFIRM',  title: 'Scheduling — Booking Confirmation: Instant Email + WhatsApp + Calendar Invite Sent' },
      { sub: 'REMIND',   title: 'Scheduling — Automated Reminders: 24h & 1h Before via WhatsApp & Email' },
      { sub: 'RESCHEDULE', title: 'Scheduling — Self-Service Reschedule: Client Link to Change Date/Time Online' },
      { sub: 'CANCEL',   title: 'Scheduling — Cancellation Flow: Reason Capture + Re-Book CTA + Agent Notification' },
      { sub: 'NOSHOW',   title: 'Scheduling — No-Show Handler: Auto-Flag, Re-Engage Campaign, Lead Score Penalty' },
      { sub: 'FEEDBACK', title: 'Scheduling — Post-Viewing Feedback: Automated Survey 1h After Viewing Ends' },
      { sub: 'VIRTUAL',  title: 'Scheduling — Virtual Viewing: Zoom/Teams Link Auto-Generate for Remote Buyers' },
      { sub: 'OPEN-HOUSE', title: 'Scheduling — Open House Events: Public Registration, Capacity Limits, Waitlist' },
      { sub: 'AGENT-CAL', title: 'Scheduling — Agent Calendar Dashboard: Day/Week/Month View of All Appointments' },
      { sub: 'ROUND-ROBIN', title: 'Scheduling — Round-Robin Assignment: Fair Viewing Distribution across Agent Team' },
      { sub: 'BUFFER',   title: 'Scheduling — Viewing Buffer: 30-Min Gap Between Back-to-Back Property Viewings' },
      { sub: 'MAP-ROUTE', title: 'Scheduling — Viewing Route Optimizer: Google Maps Driving Order for Multi-Viewing Day' },
      { sub: 'CHECKLIST', title: 'Scheduling — Pre-Viewing Checklist: Keys, Access Code, Utility Status, Snagging Notes' },
      { sub: 'HANDOVER', title: 'Scheduling — Handover Appointment: Property Key & Document Transfer Scheduling' },
      { sub: 'SLA',      title: 'Scheduling — SLA Enforcement: P0 Lead → Viewing Appointment Within 24h Mandate' },
      { sub: 'PIPELINE', title: 'Scheduling — CRM Pipeline Sync: Viewing → "Offer Stage" Auto-Move on Attend' },
      { sub: 'MULTIPLE', title: 'Scheduling — Multi-Property Tour: Book 3–5 Properties in One Viewing Session' },
      { sub: 'DEVELOPER', title: 'Scheduling — Developer Showroom Booking: Sync with Developer Sales Calendar' },
      { sub: 'LANDLORD', title: 'Scheduling — Landlord Approval Gate: Owner Must Accept Before Viewing Confirmed' },
      { sub: 'MOBILE',   title: 'Scheduling — Mobile Booking Flow: 3-Step Native-Feel Booking on Smartphone' },
      { sub: 'ARRTL',   title: 'Scheduling — Arabic RTL Booking Form & Confirmation Messages Fully Translated' },
      { sub: 'I18N',     title: 'Scheduling — en.json & ar.json Keys for All Scheduling Labels & System Messages' },
      { sub: 'ANALYTICS', title: 'Scheduling — Viewing Analytics: Show Rate, Cancellation %, Lead-to-Viewing Ratio' },
      { sub: 'WAITLIST', title: 'Scheduling — Waitlist Engine: Auto-Offer Slot When Cancellation Received' },
      { sub: 'BLOCK',    title: 'Scheduling — Blocked Times: Agent Holidays, Training Days, Property Unavailability' },
      { sub: 'REPORT',   title: 'Scheduling — Monthly Viewing Report: Count, Rate, Top Properties, Agent KPIs' },
      { sub: 'EXPORT',   title: 'Scheduling — Export Appointment Log: Excel/PDF with Date Range Filter' },
      { sub: 'NOTIFY',   title: 'Scheduling — Real-Time Push: New Booking Alert to Agent Mobile App Instantly' },
      { sub: 'RATING',   title: 'Scheduling — Agent Viewing Rating: Buyer Rates Agent 1–5★ After Each Viewing' },
      { sub: 'AUDIT',    title: 'Scheduling — Audit Log: Every Booking State Change with Actor & Timestamp' },
      { sub: 'STREAM',   title: 'Scheduling — WebSocket Live: Agent Calendar Updates in Real-Time Dashboard' },
      { sub: 'CACHE',    title: 'Scheduling — Availability Cache: Redis TTL 60s for Agent Slot Availability' },
      { sub: 'TEST-UNIT', title: 'Scheduling — Vitest Unit: Slot Availability, Round-Robin, SLA Countdown Logic' },
      { sub: 'TEST-E2E', title: 'Scheduling — Playwright E2E: Lead Books → Agent Confirms → Reminder Sent Flow' },
      { sub: 'DOCS',     title: 'Scheduling — Booking Engine Architecture + Calendar API Integration Guide' },
      { sub: 'BENCH',    title: 'Scheduling — Benchmark: Slot Availability Query < 100ms, Calendar Sync < 2s' },
      { sub: 'GATE',     title: 'Scheduling — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 68 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 45 (Wave 68): Document Management & E-Signature Suite',
    wave: 68, code: 'DOCS-SIGN',
    desc: 'Centralized document vault, e-signature workflows, version control, and automated legal document generation',
    issues: [
      { sub: 'SPEC',     title: 'Documents — Architecture: Document Model, Vault Schema, E-Sign Provider Contract' },
      { sub: 'VAULT',    title: 'Documents — Secure Document Vault: AES-256 Encrypted Storage per Entity' },
      { sub: 'ESIGN',    title: 'Documents — E-Signature: DocuSign/Adobe Sign Integration for SPA, Tenancy, NOC' },
      { sub: 'TEMPLATE', title: 'Documents — Document Template Library: RERA Forms A/B/F, SPA, Ejari, NOC, MOU' },
      { sub: 'GENERATOR', title: 'Documents — Auto-Fill Generator: CRM Data → Populate Legal Template Instantly' },
      { sub: 'VERSION',  title: 'Documents — Version Control: Every Document Edit Tracked with Diff View & Restore' },
      { sub: 'OCR',      title: 'Documents — OCR Engine: Extract Data from Scanned Emirates IDs, Title Deeds' },
      { sub: 'CLASSIFY', title: 'Documents — AI Document Classifier: Auto-Tag Uploaded Files by Type & Entity' },
      { sub: 'SHARE',    title: 'Documents — Secure Share: Time-Limited, Watermarked, Download-Limited Links' },
      { sub: 'APPROVAL', title: 'Documents — Approval Workflow: Agent → Manager → MD Sequential Sign Chain' },
      { sub: 'AUDIT',    title: 'Documents — Audit Trail: Every View, Download, Sign, Share Cryptographically Logged' },
      { sub: 'EXPIRE',   title: 'Documents — Document Expiry Monitor: License Docs, Emirates IDs, Title Deeds' },
      { sub: 'RETENTION', title: 'Documents — Retention Policy: 7-Year Auto-Archive then Secure Delete Schedule' },
      { sub: 'SEARCH',   title: 'Documents — Full-Text Search: Find Clause in 10,000+ Contracts Instantly' },
      { sub: 'FOLDER',   title: 'Documents — Folder Structure: Per-Property, Per-Client, Per-Deal Organization' },
      { sub: 'BULK',     title: 'Documents — Bulk Actions: Multi-Select Download, Delete, Move, Tag Documents' },
      { sub: 'MERGE',    title: 'Documents — Document Merge: Combine Multiple PDFs into Single Closing Pack' },
      { sub: 'COMPRESS', title: 'Documents — PDF Compression: Reduce File Size Before WhatsApp/Email Send' },
      { sub: 'WATERMARK', title: 'Documents — Dynamic Watermark: "DRAFT" / "CONFIDENTIAL" / Client Name on PDF' },
      { sub: 'PRINT',    title: 'Documents — Print Manager: Print to Physical Printer with Duplex, Letterhead Auto' },
      { sub: 'TRANSLATE', title: 'Documents — AI Document Translation: Arabic ↔ English Legal Document Translate' },
      { sub: 'QR',       title: 'Documents — QR Code on Document: Scan to Verify Authenticity on Blockchain Hash' },
      { sub: 'MOBILE',   title: 'Documents — Mobile Document Access: View, Sign, Share from Smartphone App' },
      { sub: 'OFFLINE',  title: 'Documents — Offline Documents: PWA Cache Critical Documents for Field Agent Use' },
      { sub: 'ARRTL',   title: 'Documents — Arabic RTL Document View: Right-to-Left PDF Rendering Support' },
      { sub: 'I18N',     title: 'Documents — en.json & ar.json for All Document Module Labels & Status Names' },
      { sub: 'NOTIFY',   title: 'Documents — Notifications: Sign Request, Approval Needed, Document Expired Alerts' },
      { sub: 'STREAM',   title: 'Documents — WebSocket: Real-Time Sign Status Updates in Document Dashboard' },
      { sub: 'QUOTA',    title: 'Documents — Storage Quota: Per-User 10GB Limit with Warning at 80% Usage' },
      { sub: 'ENCRYPT',  title: 'Documents — End-to-End Encryption: Client Documents Encrypted with Client Key' },
      { sub: 'GDPR',     title: 'Documents — PDPL Compliance: Data Subject Access Request → Download All Docs' },
      { sub: 'ANALYTICS', title: 'Documents — Document Analytics: Most Viewed, Unsigned, Expired, Overdue' },
      { sub: 'REPORT',   title: 'Documents — Monthly Document Report: Signed, Pending, Expired Count per Category' },
      { sub: 'EXPORT',   title: 'Documents — Export Document Registry: Full Audit CSV/Excel for Legal Review' },
      { sub: 'CHECKLIST', title: 'Documents — Deal Checklist: Required Docs per Transaction Type (Sale/Lease/Mortgage)' },
      { sub: 'TEST-UNIT', title: 'Documents — Vitest Unit: Template Merge, OCR Parse, Version Diff, Audit Hash' },
      { sub: 'TEST-E2E', title: 'Documents — Playwright E2E: Upload → OCR → Auto-Fill → E-Sign → Share Flow' },
      { sub: 'DOCS',     title: 'Documents — Document System Architecture + Legal Template Registry Guide' },
      { sub: 'BENCH',    title: 'Documents — Benchmark: OCR < 3s, Search < 200ms, Sign Request < 1s Deliver' },
      { sub: 'GATE',     title: 'Documents — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 69 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 46 (Wave 69): HR, Staff Management & 108-Supervisor Portal',
    wave: 69, code: 'HR',
    desc: 'Complete HR module for 108 supervisors and agents: onboarding, RERA training, attendance, payroll, and performance reviews',
    issues: [
      { sub: 'SPEC',     title: 'HR Module — Architecture: Staff Schema, Role Hierarchy & 108-Supervisor Registry Model' },
      { sub: 'ONBOARD',  title: 'HR Module — Onboarding Flow: Document Collection, KYC, RERA Cert, System Access Grant' },
      { sub: 'PROFILE',  title: 'HR Module — Staff Profile: Photo, RERA License, Specialty, Languages, Targets, Stats' },
      { sub: 'RERA-CERT', title: 'HR Module — RERA Certificate Tracker: All 108 Staff, Expiry, Renewal Initiation' },
      { sub: 'TRAINING', title: 'HR Module — Training Module: 12 CPD Hours/Year, Progress Tracking, Completion Badge' },
      { sub: 'ATTENDANCE', title: 'HR Module — Attendance Management: Check-In/Out, Leave Requests, Holiday Calendar' },
      { sub: 'PAYROLL',  title: 'HR Module — Payroll Engine: Base + Commission + Bonus + WPS DIFC Compliance' },
      { sub: 'TARGET',   title: 'HR Module — Sales Target Setting: Monthly AED Targets per Agent + Department' },
      { sub: 'PERFORMANCE', title: 'HR Module — Performance Review: Quarterly 360° Review with Manager & MD Signoff' },
      { sub: 'PIPELINE', title: 'HR Module — Agent Pipeline Dashboard: Personal Deals, Leads, Revenue this Month' },
      { sub: 'AWARD',    title: 'HR Module — Awards & Recognition: Monthly Best Agent, Best Team, Most Improved' },
      { sub: 'ORGANOGRAM', title: 'HR Module — Live Organogram: Visual 1-12-108 Hierarchy Chart, Click to Profile' },
      { sub: 'COMMS',    title: 'HR Module — Internal Communications: Announcements, Policy Updates, Team Chat' },
      { sub: 'LEAVE',    title: 'HR Module — Leave Management: Annual, Sick, Maternity, Emergency with Approvals' },
      { sub: 'EXPENSE',  title: 'HR Module — Expense Claims: Fuel, Parking, Entertainment with Receipt Upload' },
      { sub: 'DISCIPLINE', title: 'HR Module — Disciplinary Module: Warnings, PIPs, Termination Process Logged' },
      { sub: 'OFFBOARD', title: 'HR Module — Offboarding Checklist: Access Revoke, Document Return, Final Pay Calc' },
      { sub: 'VISA',     title: 'HR Module — Visa & Emirates ID Tracker: Expiry, Renewal, Status per Employee' },
      { sub: 'MEDICAL',  title: 'HR Module — Medical Insurance: Policy Details, Claims Tracker, Provider Portal Link' },
      { sub: 'GRATUITY', title: 'HR Module — End-of-Service Gratuity Calculator: UAE Labour Law Art 51 Formula' },
      { sub: 'CONTRACT', title: 'HR Module — Employment Contract Generator: UAE Labour Law Compliant Template' },
      { sub: 'PROBATION', title: 'HR Module — Probation Tracker: 3/6-Month Period with Mid-Review Checklist' },
      { sub: 'MOBILE',   title: 'HR Module — Mobile HR App: Self-Service Leave, Payslip, Target View on Phone' },
      { sub: 'ARRTL',   title: 'HR Module — Arabic RTL HR Forms: Payslip, Contract, Leave Request Bilingual' },
      { sub: 'I18N',     title: 'HR Module — en.json & ar.json Keys for All HR Labels, Status, Notifications' },
      { sub: 'NOTIFY',   title: 'HR Module — HR Alerts: Visa Expiry, RERA Cert Due, Payroll Processed, Leave Approved' },
      { sub: 'ANALYTICS', title: 'HR Module — HR Analytics: Headcount, Attrition, Revenue per Employee AED KPIs' },
      { sub: 'SURVEY',   title: 'HR Module — Employee NPS Survey: Quarterly Satisfaction Survey with Anonymous Mode' },
      { sub: 'AUDIT',    title: 'HR Module — HR Audit Log: All Role Changes, Access Grants, Payroll Entries' },
      { sub: 'EXPORT',   title: 'HR Module — Export Staff Register: Excel/PDF with RERA Compliance Fields' },
      { sub: 'WPS',      title: 'HR Module — WPS Export: DIFC Wage Protection System File Generation + Upload' },
      { sub: 'MOHRE',    title: 'HR Module — MoHRE Integration: Labour Card, Contract Attestation Status API' },
      { sub: 'DIFC',     title: 'HR Module — DIFC Employment Law Overlay: Special Rules for DIFC Entity Staff' },
      { sub: 'IMPERSONATION', title: 'HR Module — MD Ghost Session: Founder Views Any Staff Profile for Audit' },
      { sub: 'REPORT',   title: 'HR Module — HR Report: Monthly Headcount, Joiners, Leavers, Attrition Rate' },
      { sub: 'TEST-UNIT', title: 'HR Module — Vitest Unit: Payroll Calc, Gratuity Formula, Leave Balance Logic' },
      { sub: 'TEST-E2E', title: 'HR Module — Playwright E2E: Onboard Staff → Set Target → Monthly Payroll Flow' },
      { sub: 'DOCS',     title: 'HR Module — HR Operations Manual + UAE Labour Law Reference Index' },
      { sub: 'BENCH',    title: 'HR Module — Benchmark: Organogram Load < 1s for 108 Nodes, Payroll Run < 10s' },
      { sub: 'GATE',     title: 'HR Module — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 70 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 47 (Wave 70): Client & Investor Relations Portal',
    wave: 70, code: 'CLIENT-PORTAL',
    desc: 'Secure self-service client portal: portfolio tracking, document access, investment reports, and advisor messaging',
    issues: [
      { sub: 'SPEC',     title: 'Client Portal — Architecture: Auth Model, Portfolio Schema & Permission Isolation' },
      { sub: 'AUTH',     title: 'Client Portal — Client Authentication: Magic Link + Biometric + 2FA TOTP Login' },
      { sub: 'PORTFOLIO', title: 'Client Portal — Portfolio Dashboard: All Properties, AED Values, Rental Yield Overview' },
      { sub: 'DOCS',     title: 'Client Portal — My Documents: Title Deed, Ejari, SPA, NOC Secure View & Download' },
      { sub: 'PAYMENTS', title: 'Client Portal — Payment History: All Transactions, Receipts, PDC Schedule View' },
      { sub: 'MAINTENANCE', title: 'Client Portal — Maintenance Requests: Submit, Track, Approve, Rate Technician' },
      { sub: 'ADVISOR',  title: 'Client Portal — My Advisor: Profile, Direct Call/WhatsApp, Video Meeting Book' },
      { sub: 'MESSAGES', title: 'Client Portal — Secure Messaging: Client ↔ Agent Encrypted In-Portal Chat' },
      { sub: 'REPORTS',  title: 'Client Portal — Investment Reports: Annual AED Yield, Capital Growth, Tax Summary' },
      { sub: 'MARKET',   title: 'Client Portal — Market Insights: Personalized Dubai Market Updates for Portfolio' },
      { sub: 'ALERTS',   title: 'Client Portal — Smart Alerts: Rental Due, Renewal Due, Maintenance Update, Price Alert' },
      { sub: 'WISHLIST', title: 'Client Portal — Saved Properties: Wishlist + Comparison Tool + Price Tracker' },
      { sub: 'REFERRAL', title: 'Client Portal — Referral Program: Unique Link, Track Referrals, AED Reward Claim' },
      { sub: 'PROFILE',  title: 'Client Portal — Client Profile: Preferences, Budget, Nationality, Tax Residency' },
      { sub: 'TIMELINE', title: 'Client Portal — Purchase Timeline: Every Step from Offer to Title Deed Transfer' },
      { sub: 'SURVEY',   title: 'Client Portal — Satisfaction Survey: Post-Purchase & Annual NPS Questionnaire' },
      { sub: 'TOUR',     title: 'Client Portal — Virtual Tours: Access 360° Tours of Owned/Interested Properties' },
      { sub: 'CALENDAR', title: 'Client Portal — My Calendar: Viewings, Appointments, PDC Dates, Renewal Dates' },
      { sub: 'NEWS',     title: 'Client Portal — Property News: Personalized Dubai Real Estate News Feed' },
      { sub: 'VALUATION', title: 'Client Portal — Live Valuation: AI AVM Updated Monthly for All Owned Properties' },
      { sub: 'SELLING',  title: 'Client Portal — Sell My Property: Initiate Sale, Set Price, Request Marketing' },
      { sub: 'RENTING',  title: 'Client Portal — Rent My Property: Landlord Activation, Tenant Matching, Income' },
      { sub: 'LEGAL',    title: 'Client Portal — Legal Corner: FAQ, RERA Rights, Tenant/Buyer Guides in Simple Language' },
      { sub: 'TRUST',    title: 'Client Portal — Trust Score: Agent Reliability, Response Time, Deal Success Rate' },
      { sub: 'MOBILE',   title: 'Client Portal — Mobile Client App: Native-Feel PWA with Biometric Login & Widgets' },
      { sub: 'ARRTL',   title: 'Client Portal — Arabic RTL Portal: Full Mirror Layout for Arabic-Speaking Clients' },
      { sub: 'I18N',     title: 'Client Portal — en.json & ar.json for All Portal Labels, Reports & Alerts' },
      { sub: 'NOTIFY',   title: 'Client Portal — Push Notifications: PDC Due, Lease Renewal, Advisor Message' },
      { sub: 'PRIVACY',  title: 'Client Portal — Data Privacy: Client Controls Own Data, Export & Erase Request' },
      { sub: 'ANALYTICS', title: 'Client Portal — Portal Analytics: Login Frequency, Docs Viewed, Reports Downloaded' },
      { sub: 'ONBOARD',  title: 'Client Portal — Client Onboarding: Welcome Flow, Profile Setup, First Report Tour' },
      { sub: 'AUDIT',    title: 'Client Portal — Audit Log: Every Client Action Logged with Timestamp for PDPL' },
      { sub: 'EXPORT',   title: 'Client Portal — Data Export: Client Downloads Own Full Data Pack (PDPL Right)' },
      { sub: 'THEME',    title: 'Client Portal — Client White-Label Option: Developer Partner Co-Branding Portal' },
      { sub: 'SSO',      title: 'Client Portal — SSO Integration: Login with Google, Apple, LinkedIn for Clients' },
      { sub: 'TEST-UNIT', title: 'Client Portal — Vitest Unit: Auth Guards, Portfolio Calc, Permission Matrix' },
      { sub: 'TEST-E2E', title: 'Client Portal — Playwright E2E: Login → View Portfolio → Download Deed → Message Agent' },
      { sub: 'DOCS-ARCH', title: 'Client Portal — Architecture Doc + Client Journey Map + Permission Model Diagram' },
      { sub: 'BENCH',    title: 'Client Portal — Benchmark: Dashboard Load < 1.5s, Document Download < 2s' },
      { sub: 'GATE',     title: 'Client Portal — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 71 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 48 (Wave 71): Reporting, Analytics & Business Intelligence',
    wave: 71, code: 'ANALYTICS',
    desc: 'Enterprise BI platform: real-time KPI dashboards, cross-department reporting, data exports, and executive board reports',
    issues: [
      { sub: 'SPEC',     title: 'Analytics — Architecture: Report Engine, Data Warehouse Schema & KPI Taxonomy' },
      { sub: 'REVENUE',  title: 'Analytics — Revenue Report: Monthly/Quarterly/Annual AED Commission & Net Profit' },
      { sub: 'PIPELINE', title: 'Analytics — Pipeline Report: Value by Stage, Win/Loss Rate, Average Deal Size' },
      { sub: 'LEADS',    title: 'Analytics — Lead Report: Source Attribution, Conversion Funnel, Cost per Lead AED' },
      { sub: 'AGENT',    title: 'Analytics — Agent Performance: Individual KPI Cards with Rankings & Percentile' },
      { sub: 'PROPERTY', title: 'Analytics — Property Performance: Listing Days-on-Market, View Count, Lead Rate' },
      { sub: 'MARKET',   title: 'Analytics — Market Report: Dubai Community Price Trends, DLD Transaction Analysis' },
      { sub: 'FORECAST', title: 'Analytics — Revenue Forecast: AI-Powered 90-Day Rolling with Confidence Interval' },
      { sub: 'COHORT',   title: 'Analytics — Client Cohort Analysis: Retention, Re-Purchase Rate, LTV by Nationality' },
      { sub: 'FUNNEL',   title: 'Analytics — Conversion Funnel: Lead → Viewing → Offer → SPA → Closed Step Rates' },
      { sub: 'HEATMAP',  title: 'Analytics — Geographic Heatmap: Deal Density & Revenue by Dubai Community' },
      { sub: 'TEAM',     title: 'Analytics — Team Dashboard: Department vs Department Performance Scorecard' },
      { sub: 'FINANCE-BI', title: 'Analytics — Finance BI: Cash Flow, AR Aging, Budget vs Actual by Department' },
      { sub: 'MARKETING-BI', title: 'Analytics — Marketing BI: Campaign ROI, Cost per Lead, Channel Attribution' },
      { sub: 'SEO-BI',   title: 'Analytics — SEO Analytics: Organic Traffic, Rankings, CTR, Bounce Rate Trend' },
      { sub: 'SOCIAL-BI', title: 'Analytics — Social Media BI: Instagram, LinkedIn, TikTok Follower & Engagement KPIs' },
      { sub: 'WHATSAPP-BI', title: 'Analytics — WhatsApp BI: Message Volume, Response Time, Conversion Rate' },
      { sub: 'COMPLIANCE-BI', title: 'Analytics — Compliance BI: Open Items, Overdue, Expiry Timeline, Risk Score' },
      { sub: 'HR-BI',    title: 'Analytics — HR BI: Headcount, Revenue per Staff AED, Attrition Rate, CPD Hours' },
      { sub: 'CLIENT-BI', title: 'Analytics — Client BI: NPS Score, Portal Engagement, Satisfaction Trend' },
      { sub: 'BOARD',    title: 'Analytics — Board Report Generator: One-Click PDF Executive Report with Brand' },
      { sub: 'CUSTOM',   title: 'Analytics — Custom Report Builder: Drag-and-Drop KPI Builder for MD & Managers' },
      { sub: 'SCHEDULE', title: 'Analytics — Scheduled Reports: Auto-Email PDF Reports Daily/Weekly/Monthly' },
      { sub: 'ALERTS',   title: 'Analytics — BI Alerts: Threshold-Based Alerts when KPI Below/Above Target' },
      { sub: 'DRILL',    title: 'Analytics — Drill-Down: Click Any KPI to Explore Underlying Transaction Data' },
      { sub: 'COMPARE',  title: 'Analytics — Period Comparison: MoM, QoQ, YoY with % Delta and Variance Color' },
      { sub: 'EXPORT',   title: 'Analytics — Data Export: CSV, Excel, JSON, PDF for Any Report with Date Range' },
      { sub: 'API',      title: 'Analytics — Analytics API: Secure REST Endpoints for External BI Tool Connection' },
      { sub: 'EMBED',    title: 'Analytics — Embeddable Widgets: Public-Safe KPI Cards for Investor Presentations' },
      { sub: 'REALTIME', title: 'Analytics — Real-Time Streaming: WebSocket Live KPI Updates on Executive Dashboard' },
      { sub: 'MOBILE',   title: 'Analytics — Mobile Analytics: Responsive Charts & KPI Cards on All Screen Sizes' },
      { sub: 'ARRTL',   title: 'Analytics — Arabic RTL Reports: Mirrored Charts, Right-Aligned AED Figures' },
      { sub: 'I18N',     title: 'Analytics — en.json & ar.json Keys for All Report Labels, KPI Names & Filters' },
      { sub: 'CACHE',    title: 'Analytics — Analytics Cache: Pre-Computed Reports in Redis, Refresh on Schedule' },
      { sub: 'PRIVACY',  title: 'Analytics — Analytics Privacy: Anonymize Client PII in All Aggregate Reports' },
      { sub: 'TEST-UNIT', title: 'Analytics — Vitest Unit: KPI Formula, Forecast Model, Cohort Calc, Export Logic' },
      { sub: 'TEST-E2E', title: 'Analytics — Playwright E2E: Open Board → Set Date Range → Export PDF → Email' },
      { sub: 'DOCS',     title: 'Analytics — KPI Definition Dictionary + Data Warehouse Schema Documentation' },
      { sub: 'BENCH',    title: 'Analytics — Benchmark: Report Load < 2s, Export < 5s for 1M+ Record Datasets' },
      { sub: 'GATE',     title: 'Analytics — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 72 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 49 (Wave 72): Accessibility, Internationalisation & Arabic Excellence',
    wave: 72, code: 'A11Y-I18N',
    desc: 'WCAG 2.1 AA compliance, bilingual Arabic/English parity, RTL layout perfection, and inclusive design across all 100 views',
    issues: [
      { sub: 'SPEC',     title: 'A11Y-i18n — Architecture: WCAG Audit Plan, RTL Layout Engine & Translation Workflow' },
      { sub: 'WCAG-AUDIT', title: 'A11Y-i18n — WCAG 2.1 AA Full Audit: All 100 CRM Views with axe-core Automated Scan' },
      { sub: 'COLOR',    title: 'A11Y-i18n — Color Contrast: All Text/Background Pairs 4.5:1 Ratio Minimum' },
      { sub: 'FOCUS',    title: 'A11Y-i18n — Keyboard Focus: Visible Focus Ring on All Interactive Elements' },
      { sub: 'ARIA',     title: 'A11Y-i18n — ARIA Labels: All Icons, Buttons, Inputs with Descriptive aria-label' },
      { sub: 'HEADINGS', title: 'A11Y-i18n — Heading Hierarchy: Single H1 per Page, Logical H2/H3/H4 Structure' },
      { sub: 'SKIP',     title: 'A11Y-i18n — Skip-to-Content Link: Keyboard Users Bypass Navigation Instantly' },
      { sub: 'MOTION',   title: 'A11Y-i18n — Reduced Motion: prefers-reduced-motion Respected on All Animations' },
      { sub: 'SCREEN-READER', title: 'A11Y-i18n — Screen Reader: NVDA/VoiceOver/TalkBack Full Content Accessible' },
      { sub: 'FORMS',    title: 'A11Y-i18n — Accessible Forms: Labels, Error Messages, Required Indicators, Help Text' },
      { sub: 'TOUCH',    title: 'A11Y-i18n — Touch Targets: All Interactive Elements Min 44×44px on Mobile' },
      { sub: 'ERROR',    title: 'A11Y-i18n — Error Identification: Inline Errors with Icon + Color + Text Message' },
      { sub: 'LANGUAGE', title: 'A11Y-i18n — lang Attribute: Correct lang="en" or lang="ar" on Every Page' },
      { sub: 'IMAGES',   title: 'A11Y-i18n — Image Alt Text: Descriptive alt on All Property & UI Images' },
      { sub: 'VIDEO-CAPTIONS', title: 'A11Y-i18n — Video Captions: All Property Videos Have Arabic & English CC' },
      { sub: 'RTL-LAYOUT', title: 'A11Y-i18n — RTL Layout: dir="rtl" All 100 Views with CSS Logical Properties' },
      { sub: 'RTL-NUMBERS', title: 'A11Y-i18n — Number Direction: Arabic Numerals or LTR Number in RTL Context' },
      { sub: 'RTL-CHARTS', title: 'A11Y-i18n — RTL Charts: Recharts/ApexCharts Mirrored Axis for Arabic Mode' },
      { sub: 'RTL-ICONS', title: 'A11Y-i18n — RTL Icons: Directional Icons (Arrows, Chevrons) Flipped for Arabic' },
      { sub: 'RTL-CALENDAR', title: 'A11Y-i18n — RTL Calendar: Right-to-Left Date Picker with Hijri Date Option' },
      { sub: 'ARABIC-FONT', title: 'A11Y-i18n — Arabic Font: Noto Kufi Arabic / Cairo for Headlines, IBM Plex Arabic' },
      { sub: 'ARABIC-COPY', title: 'A11Y-i18n — Arabic Copywriting: Professional Legal-Grade Arabic for All Labels' },
      { sub: 'ARABIC-CRM', title: 'A11Y-i18n — Arabic CRM Data: Full Arabic Input Support in All Form Fields' },
      { sub: 'PLURAL',   title: 'A11Y-i18n — Arabic Plural Rules: ICU MessageFormat for Arabic Complex Plurals' },
      { sub: 'MISSING-KEYS', title: 'A11Y-i18n — Missing Key Audit: Zero Untranslated Keys in en.json & ar.json' },
      { sub: 'NAMESPACE', title: 'A11Y-i18n — i18n Namespace: Organize Keys by Component for Maintainability' },
      { sub: 'DYNAMIC',  title: 'A11Y-i18n — Dynamic Content Translation: SSR Locale Detection + Cookie/Header Switch' },
      { sub: 'CURRENCY-RTL', title: 'A11Y-i18n — Currency Format: AED 1,234,567 Left (LTR) in Arabic Context' },
      { sub: 'DATE-LOCALE', title: 'A11Y-i18n — Date Locale: Gregorian en-AE vs Hijri ar-AE Date Format Switching' },
      { sub: 'LEGAL-AR', title: 'A11Y-i18n — Legal Arabic: RERA, DLD, Ejari Terms Correctly Translated in AR' },
      { sub: 'TESTING-A11Y', title: 'A11Y-i18n — A11Y Testing: axe-core + WAVE + Manual Screen Reader Full Regression' },
      { sub: 'TESTING-RTL', title: 'A11Y-i18n — RTL Testing: Cypress/Playwright AR Locale Run on All 100 Views' },
      { sub: 'STORYBOOK-A11Y', title: 'A11Y-i18n — Storybook A11Y Addon: Accessibility Panel on Every Component Story' },
      { sub: 'AUDIT-LOG', title: 'A11Y-i18n — A11Y Audit Report: axe-core HTML Report Saved per Release' },
      { sub: 'STATEMENT', title: 'A11Y-i18n — Accessibility Statement: Public Page on whitecaves.com/accessibility' },
      { sub: 'FEEDBACK-A11Y', title: 'A11Y-i18n — A11Y Feedback Form: Report Barrier Button on Every Page' },
      { sub: 'TEST-UNIT', title: 'A11Y-i18n — Vitest Unit: i18n Key Completeness, RTL Flag Logic, Locale Switch' },
      { sub: 'TEST-E2E', title: 'A11Y-i18n — Playwright E2E: Screen Reader Simulation, AR Full App Navigation' },
      { sub: 'DOCS',     title: 'A11Y-i18n — i18n Guide: Key Naming Convention, Translation Workflow, RTL Rules' },
      { sub: 'GATE',     title: 'A11Y-i18n — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 73 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 50 (Wave 73): Testing Excellence & Quality Assurance V2',
    wave: 73, code: 'SQA',
    desc: 'Comprehensive testing: 100% Vitest unit coverage, full Playwright E2E suite, chaos testing, visual regression, and performance testing',
    issues: [
      { sub: 'SPEC',     title: 'SQA V2 — Architecture: Test Strategy, Coverage Targets & CI Quality Gates' },
      { sub: 'VITEST',   title: 'SQA V2 — Vitest Configuration: Coverage 80%+ Threshold, HTML Report, Watch Mode' },
      { sub: 'UNIT-CALC', title: 'SQA V2 — Unit Tests: All Financial Calculators (VAT, Mortgage, ROI, Gratuity)' },
      { sub: 'UNIT-AUTH', title: 'SQA V2 — Unit Tests: Auth Guards, JWT Validate, RBAC Permission Matrix' },
      { sub: 'UNIT-STATE', title: 'SQA V2 — Unit Tests: All State Machines (Tenancy, Lead, Deal, Onboarding)' },
      { sub: 'UNIT-API',  title: 'SQA V2 — Unit Tests: All API Route Handlers with Mock DB & Auth Context' },
      { sub: 'UNIT-HOOKS', title: 'SQA V2 — Unit Tests: All Custom React Hooks with renderHook Utility' },
      { sub: 'SNAPSHOT', title: 'SQA V2 — Snapshot Tests: All Key UI Components with Storybook Storyshots' },
      { sub: 'PLAYWRIGHT', title: 'SQA V2 — Playwright Setup: Multi-Browser (Chrome, Firefox, Safari, Mobile)' },
      { sub: 'E2E-AUTH',  title: 'SQA V2 — E2E: Login → MD Hub → Ghost Session → Logout Full Flow' },
      { sub: 'E2E-LEAD',  title: 'SQA V2 — E2E: Lead Intake → Score → Assign → Viewing → Offer → Close Journey' },
      { sub: 'E2E-EJARI', title: 'SQA V2 — E2E: Ejari Create → PDC Track → Bounced Cheque → Legal Notice Flow' },
      { sub: 'E2E-FINANCE', title: 'SQA V2 — E2E: Invoice Create → Approve → VAT Submit → Bank Reconcile Flow' },
      { sub: 'E2E-SEARCH', title: 'SQA V2 — E2E: Property Search → Filter → Map → Detail → Enquiry Full Flow' },
      { sub: 'E2E-PWA',   title: 'SQA V2 — E2E: PWA Install → Offline Browse → Push Notification → Re-engage' },
      { sub: 'E2E-MOBILE', title: 'SQA V2 — E2E: Mobile (375px) Full App Journey: Search, Book, Message, Sign' },
      { sub: 'E2E-AR',    title: 'SQA V2 — E2E: Arabic Locale Full Journey — All RTL Views, Forms, Notifications' },
      { sub: 'VISUAL',   title: 'SQA V2 — Visual Regression: Percy/Chromatic on All 100 Storybook Components' },
      { sub: 'LOAD',     title: 'SQA V2 — Load Testing: k6 — 500 VU × 10min on /properties and /api/leads' },
      { sub: 'STRESS',   title: 'SQA V2 — Stress Testing: k6 Ramp to 2,000 VU to Find Failure Point' },
      { sub: 'SOAK',     title: 'SQA V2 — Soak Testing: 250 VU × 2 Hours — Check for Memory Leaks & DB Pool' },
      { sub: 'CHAOS',    title: 'SQA V2 — Chaos Engineering: Kill DB, Redis, Queue — Verify Graceful Degradation' },
      { sub: 'CONTRACT', title: 'SQA V2 — API Contract Tests: Pact Consumer-Driven Contract Testing per Service' },
      { sub: 'MUTATION', title: 'SQA V2 — Mutation Testing: Stryker.js to Validate Test Effectiveness' },
      { sub: 'FUZZ',     title: 'SQA V2 — Fuzz Testing: Random Input Generation on All Public API Endpoints' },
      { sub: 'A11Y-TEST', title: 'SQA V2 — Accessibility Testing: axe-core Integration in Playwright Pipeline' },
      { sub: 'SECURITY-TEST', title: 'SQA V2 — Security Tests: OWASP ZAP Scan + SQLi/XSS Injection Playwright Suite' },
      { sub: 'REGRESSION', title: 'SQA V2 — Full Regression Suite: 500+ Test Cases Run on Every Release Branch' },
      { sub: 'CI-GATES',  title: 'SQA V2 — CI Quality Gates: Block Merge if Coverage < 80% or Any E2E Fails' },
      { sub: 'FLAKY',    title: 'SQA V2 — Flaky Test Elimination: Retry Logic, Stable Selectors, Wait Strategies' },
      { sub: 'REPORT',   title: 'SQA V2 — Test Report: HTML Playwright + Vitest Report Published to GitHub Pages' },
      { sub: 'PARALLEL', title: 'SQA V2 — Parallel Test Execution: Playwright Sharded across 4 Machines in CI' },
      { sub: 'MOCK',     title: 'SQA V2 — Mock Infrastructure: MSW Service Worker Mocks for All External APIs' },
      { sub: 'SEED',     title: 'SQA V2 — Test Data Seeding: Realistic UAE Property & Lead Fixtures via Factory' },
      { sub: 'COVERAGE-MAP', title: 'SQA V2 — Coverage Dashboard: Real-Time Coverage Map per Feature Module' },
      { sub: 'BENCHMARK', title: 'SQA V2 — Benchmark Tests: Critical Path Operations with Timing Assertions' },
      { sub: 'TEST-UNIT', title: 'SQA V2 — Meta: Unit Tests for Test Utilities, Factories & Mock Handlers' },
      { sub: 'DOCS',     title: 'SQA V2 — Test Strategy Document + Coverage Map + Known Issues Register' },
      { sub: 'METRICS',  title: 'SQA V2 — QA Metrics Dashboard: Pass Rate, Flaky Count, Coverage %, MTTR' },
      { sub: 'GATE',     title: 'SQA V2 — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
  // ── Wave 74 ──────────────────────────────────────────────────────────────
  {
    title: 'Milestone 51 (Wave 74): Platform-Wide UI/UX Luxury Polish & Design System V3',
    wave: 74, code: 'DESIGN-SYS',
    desc: 'S-Tier design system V3: refined luxury tokens, motion design, dark mode, component library, and Storybook documentation',
    issues: [
      { sub: 'SPEC',     title: 'Design System V3 — Architecture: Token Taxonomy, Component API & Storybook Structure' },
      { sub: 'TOKENS',   title: 'Design System V3 — Design Token Refinement: Color, Typography, Spacing, Shadow, Radius' },
      { sub: 'COLOR',    title: 'Design System V3 — Color Palette V3: Expanded Red/White/Slate Shades + Semantic Aliases' },
      { sub: 'TYPOGRAPHY', title: 'Design System V3 — Typography Scale: Display/H1–H6/Body/Caption with Arabic Pairing' },
      { sub: 'SPACING',  title: 'Design System V3 — 8px Spacing Grid: margin/padding/gap via CSS Custom Properties' },
      { sub: 'ELEVATION', title: 'Design System V3 — Elevation System: 6-Level Shadow Scale from Card to Modal' },
      { sub: 'RADIUS',   title: 'Design System V3 — Border Radius Tokens: Pill/Full/lg/md/sm/none per Component' },
      { sub: 'MOTION',   title: 'Design System V3 — Motion Tokens: Duration (50ms–700ms), Easing Curves per Type' },
      { sub: 'DARK',     title: 'Design System V3 — Dark Mode: Complete Token Swap, No Raw Hex in Any Component' },
      { sub: 'ICONS',    title: 'Design System V3 — Icon System: Custom White Caves SVG Icon Set + Lucide Fallback' },
      { sub: 'BUTTONS',  title: 'Design System V3 — Button Component: Primary/Secondary/Ghost/Danger + All States' },
      { sub: 'INPUTS',   title: 'Design System V3 — Input Components: Text, Select, Checkbox, Radio, Textarea, File' },
      { sub: 'MODAL',    title: 'Design System V3 — Modal/Dialog: Accessible, Focus Trap, Backdrop, Animation Entry' },
      { sub: 'TOAST',    title: 'Design System V3 — Toast/Snackbar: Success/Error/Warning/Info with Auto-Dismiss' },
      { sub: 'TABLE',    title: 'Design System V3 — Data Table: Sortable, Filterable, Selectable, Paginated, Exportable' },
      { sub: 'CARD',     title: 'Design System V3 — Card Components: Property, Contact, Agent, KPI, Stat Variants' },
      { sub: 'NAV',      title: 'Design System V3 — Navigation: TopBar, Sidebar, Breadcrumb, Tabs, Pagination' },
      { sub: 'CHART',    title: 'Design System V3 — Chart Components: Line, Bar, Pie, Donut, Sparkline, Heatmap' },
      { sub: 'FORM',     title: 'Design System V3 — Form Layout: Multi-Step, Inline, Floating Label, Validation UX' },
      { sub: 'SKELETON', title: 'Design System V3 — Skeleton Loaders: Page, Card, Table, List — Red/White Shimmer' },
      { sub: 'EMPTY',    title: 'Design System V3 — Empty States: Illustrated States for No Data, No Results, Error' },
      { sub: 'ERROR-UI', title: 'Design System V3 — Error Boundary UI: Friendly Error Pages (404, 500, Offline)' },
      { sub: 'BADGE',    title: 'Design System V3 — Badge & Tag Components: Status, Category, Priority, Count Variants' },
      { sub: 'AVATAR',   title: 'Design System V3 — Avatar Component: Photo, Initials, Group Stack, Online Indicator' },
      { sub: 'PROGRESS', title: 'Design System V3 — Progress Components: Bar, Ring, Step Indicator, Upload Progress' },
      { sub: 'CALENDAR-UI', title: 'Design System V3 — Calendar Component: Day/Week/Month View, Event Dots, RTL' },
      { sub: 'MAP-UI',   title: 'Design System V3 — Map Component: Mapbox GL with White Caves Custom Style Layer' },
      { sub: 'GALLERY-UI', title: 'Design System V3 — Gallery Component: Lightbox, Carousel, Masonry, Thumbnail Strip' },
      { sub: 'CAROUSEL', title: 'Design System V3 — Carousel Component: Touch Swipe, Autoplay, Dots, Arrow Controls' },
      { sub: 'TOOLTIP',  title: 'Design System V3 — Tooltip & Popover: Floating UI Positioned, Accessible, Animated' },
      { sub: 'DRAWER',   title: 'Design System V3 — Drawer/Sheet: Bottom Sheet Mobile, Side Drawer Desktop, Overlay' },
      { sub: 'COMMAND',  title: 'Design System V3 — Command Palette: ⌘K Global Search with Keyboard Navigation' },
      { sub: 'STORYBOOK', title: 'Design System V3 — Storybook 8: Stories for All 80+ Components, Controls, Docs Mode' },
      { sub: 'FIGMA',    title: 'Design System V3 — Figma Sync: Design Tokens via Style Dictionary to Figma Variables' },
      { sub: 'ARRTL',   title: 'Design System V3 — RTL Story Variants: Every Component Shown in Arabic RTL in Storybook' },
      { sub: 'ANIMATION-LIB', title: 'Design System V3 — Animation Library: Framer Motion Presets for Enter/Exit/Hover' },
      { sub: 'TEST-UNIT', title: 'Design System V3 — Vitest Unit: Token Export, Component API, Variant Rendering' },
      { sub: 'TEST-E2E', title: 'Design System V3 — Playwright Visual: Screenshot Diff for Every Component Variant' },
      { sub: 'DOCS',     title: 'Design System V3 — Design System Documentation: Usage Guidelines + Anti-Patterns' },
      { sub: 'BENCH',    title: 'Design System V3 — Benchmark: Storybook Build < 60s, Component Render < 16ms' },
      { sub: 'GATE',     title: 'Design System V3 — Production Release Gate & MD Sovereign Seal Signoff' },
    ]
  },
];

// ─── Acceptance Criteria & DoD builder ────────────────────────────────────────
function buildEnhancedBody(wave, code, sub, title, priority, effort) {
  const isGate  = sub === 'GATE';
  const isTest  = sub.startsWith('TEST');
  const isDocs  = sub === 'DOCS';
  const isBench = sub === 'BENCH';

  const acceptance = isGate ? [
    'All 39 domain issues in this milestone are verified as completed',
    'Build passes `npm run build` with 0 errors on local machine',
    'All Vitest unit tests pass with ≥ 80% coverage for this module',
    'All Playwright E2E tests pass on Chrome, Firefox, and Mobile Safari',
    '`npm run aegis:health` returns PASS with 0 critical drift',
    '`npm run plans:validate` returns ✅ Governance audit passed',
    'Git commit pushed to `origin/main` with conventional commit message',
  ] : isTest ? [
    'Test file created following the established test structure convention',
    'All described test cases are implemented and passing (0 failures)',
    'Test coverage for related module ≥ 80% (unit) / 100% journey coverage (E2E)',
    'Tests run in < 30 seconds in CI/CD pipeline',
    'No flaky tests — stable on 3 consecutive CI runs',
  ] : isDocs ? [
    'Technical document covers architecture, data model, and integration contracts',
    'Business document covers UAE regulatory references and compliance notes',
    'Storybook stories created for all UI component variants',
    'Document reviewed and signed off by team lead and @Ada',
  ] : isBench ? [
    'All specified performance targets are met in the staging environment',
    'Lighthouse scores verified with automated Lighthouse CI run',
    'Load test results captured in k6 HTML report and stored in `/reports/`',
    'Zero regressions introduced vs previous baseline benchmark',
  ] : [
    `Component implementation follows 4-Way Separation Standard (view / logic / styles / data)`,
    `All business logic isolated in \`logic/${code}.logic.ts\` — zero logic in JSX`,
    `All copy referenced via \`en.json\` and \`ar.json\` locale keys — no hardcoded strings`,
    `Styled components use only design tokens — no raw hex colors or magic numbers`,
    `Component renders correctly in both LTR (English) and RTL (Arabic) layouts`,
    `Mobile responsive: tested at 375px, 768px, 1024px, 1440px viewports`,
    `Z-index follows \`zIndexTokens.ts\` — no inline z-index overrides`,
    `WCAG 2.1 AA compliant: keyboard accessible, screen reader friendly, 4.5:1 contrast`,
    `UAE-specific requirements implemented and verified (RERA/DLD/PDPL as applicable)`,
    `Code reviewed and approved via GitHub PR with no unresolved comments`,
  ];

  const dod = [
    '✅ Feature branch merged to `main` via approved pull request',
    '✅ Unit tests written and passing in CI (`npm run test`)',
    '✅ No ESLint/TypeScript errors (`npm run lint && npm run type-check`)',
    '✅ Reviewed for potential deduplication — shared logic extracted to utils if reusable',
    '✅ Performance impact verified — no LCP, CLS, or INP regression',
    '✅ Documented in relevant architecture or business doc',
    '✅ Verified in AR locale (RTL) and EN locale (LTR)',
    '✅ Checked against AEGIS Continuous Deduplication Law — no duplicate handlers',
  ];

  return buildBody({
    tag: `[WAVE-${wave}-${code}-${sub}]`,
    priority,
    effort,
    domain: `Wave ${wave} · ${code}`,
    description: `**${title}**\n\nThis issue is part of the White Caves Real Estate LLC enterprise platform development sprint (Wave ${wave}). It covers the \`${sub}\` sub-domain within the \`${code}\` feature vertical.\n\nAll implementation must adhere to:\n- ⚙️ AEGIS V4 4-Way File Separation Standard\n- 🎨 White Caves Brand Palette (Red \`#EF4444\`, White \`#FFFFFF\`, Slate \`#1E293B\`)\n- 🌐 Bilingual EN/AR with RTL Layout Support\n- 🔐 UAE RERA / DLD / PDPL Compliance Where Applicable\n- ⚡ Sub-10ms Query Performance via MapIndexHash Indexing`,
    acceptance,
    dod,
  });
}

// ─── Main execution ────────────────────────────────────────────────────────────
async function main() {
  const token = getToken();
  if (!token) {
    console.error('❌ Could not retrieve GitHub credentials.');
    process.exit(1);
  }
  const hdrs = headers(token);

  let totalIssues = 0;
  let totalMilestones = 0;

  const filteredMilestones = MILESTONES.filter(ms => ms.wave >= START_WAVE);
  if (START_WAVE > 50) {
    console.log(`\n⏩ Resuming from Wave ${START_WAVE} — skipping Waves 50–${START_WAVE - 1}`);
  }

  for (const ms of filteredMilestones) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🏛️  Creating Milestone: ${ms.title}`);
    console.log(`${'='.repeat(70)}`);

    // 1. Create Milestone
    const milestone = await createMilestone(hdrs, ms.title, ms.desc);
    if (!milestone) {
      console.error(`❌ Failed to create milestone: ${ms.title}`);
      continue;
    }
    totalMilestones++;
    console.log(`✅ Milestone created: #${milestone.number} — ${milestone.title}\n`);
    await sleep(MILESTONE_DELAY_MS);

    // 2. Create Issues for this Milestone
    for (let i = 0; i < ms.issues.length; i++) {
      const issue    = ms.issues[i];
      const priority = p(i);
      const effort   = ep(i);
      const title    = `[WAVE-${ms.wave}-${ms.code}-${issue.sub}] ${issue.title}`;
      const body     = buildEnhancedBody(ms.wave, ms.code, issue.sub, issue.title, priority, effort);

      const label = priority.includes('P0') ? 'P0-Critical'
                  : priority.includes('P1') ? 'P1-High'
                  : priority.includes('P2') ? 'P2-Medium'
                  : 'P3-Low';

      process.stdout.write(`  ⚡ [${i + 1}/${ms.issues.length}] Creating: ${title.substring(0, 90)}...`);
      const created = await createIssue(hdrs, title, body, milestone.number, [label]);
      if (created) {
        totalIssues++;
        console.log(` ✅ #${created.number} [Total: ${totalIssues}/1000]`);
      } else {
        console.log(` ❌ Failed`);
      }
      await sleep(BATCH_DELAY_MS);
    }

    console.log(`\n🎉 Milestone "${ms.title}" complete — ${ms.issues.length} issues created.\n`);
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log(`🏆 [AEGIS 1000-Issue Sprint COMPLETE]`);
  console.log(`   Milestones Created: ${totalMilestones} / 25`);
  console.log(`   Issues Created:     ${totalIssues} / 1000`);
  console.log(`   Waves Covered:      50 → 74`);
  console.log(`${'='.repeat(70)}\n`);
}

main().catch(err => {
  console.error('❌ Fatal Error:', err.message);
  process.exit(1);
});
