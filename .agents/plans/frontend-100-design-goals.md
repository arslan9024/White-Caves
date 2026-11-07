# White Caves Real Estate LLC — 100 Frontend UI/UX Design & Aesthetics Goals (`plans/FRONTEND_100_DESIGN_GOALS.md`)

> **System Version:** 2.0.26  
> **Target Scope:** Frontend UI/UX, Design, Graphics, Styles, Theme Systems, Animations & Accessibility  
> **Brand Palette:** Red (`#EF4444`) | White (`#FFFFFF`) | Slate (`#1E293B`)  
> **Core Focus Viewports:** Homepage (`/`), Sovereign Profile (`/profile`), Executive Dashboard (`/dashboard`)  
> **Status:** 100 Itemized Frontend Enhancement Goals  

---

## 🎨 Wave 56 — Homepage Hero, Typography & Overhanging Logo Shell (`/`)

- [ ] **FE-GOAL-001**: Enforce 76px $\times$ 76px circular logo diameter with 3.5px solid Red (`#EF4444`) glowing ring overhanging 50% down past navbar bottom border (`TopNavbar.tsx`).
- [ ] **FE-GOAL-002**: Completely suppress written brand name text strings next to circular logo on desktop and mobile viewports (`TopNavbar.css`).
- [ ] **FE-GOAL-003**: Floating glassmorphism search pill container centered on Hero background canvas (`HeroSection.tsx`).
- [ ] **FE-GOAL-004**: Animated headline gradient typography transition (Pure White $\rightarrow$ White Caves Red `#EF4444`).
- [ ] **FE-GOAL-005**: Micro-hover elevation shadow effects on property card grid containers (`box-shadow: 0 12px 30px rgba(239,68,68,0.2)`).
- [ ] **FE-GOAL-006**: Smooth scroll navigation anchor links with active section indicator dot.
- [ ] **FE-GOAL-007**: Interactive property category filter pills with instant red badge highlight animation.
- [ ] **FE-GOAL-008**: Custom SVG vector icons for Bedrooms, Bathrooms, SqFt, and Location badges.
- [ ] **FE-GOAL-009**: High-resolution hero background video mesh with subtle dark vignette gradient overlay.
- [ ] **FE-GOAL-010**: Responsive mobile hero layout optimization with bottom sheet filter drawer.

---

## 🎨 Wave 57 — Homepage Interactive Map & Property Grid (`/`)

- [ ] **FE-GOAL-011**: Interactive Leaflet map container with custom monochrome dark theme tile layer and red map markers (`#EF4444`).
- [ ] **FE-GOAL-012**: Property card hover synchronizer (hovering a property card triggers glowing pulse on corresponding map marker).
- [ ] **FE-GOAL-013**: Dynamic map cluster grouping pins displaying available property count per Dubai community.
- [ ] **FE-GOAL-014**: Quick-view property drawer sliding smoothly from right viewport edge on map marker click.
- [ ] **FE-GOAL-015**: Infinite scroll listing grid with skeleton loader cards during data hydration.
- [ ] **FE-GOAL-016**: Currency switcher dropdown button (AED, USD, EUR, GBP) dynamically updating listing prices across grid.
- [ ] **FE-GOAL-017**: Unit measurement toggle (SqFt $\leftrightarrow$ SqM) with smooth number transition.
- [ ] **FE-GOAL-018**: Favorite / Wishlist red heart button animation with pulse effect.
- [ ] **FE-GOAL-019**: Social share modal widget with instant QR code generator for luxury villas.
- [ ] **FE-GOAL-020**: Featured Community carousel displaying Palm Jumeirah, Downtown Dubai, Dubai Marina, and Dubai Hills Estate.

---

## 🎨 Wave 58 — Sovereign Profile Credentials & Milestone Timeline (`/profile`)

- [ ] **FE-GOAL-021**: Founder & Managing Director VIP summary card with 3.5px solid Red border and metallic badge.
- [ ] **FE-GOAL-022**: Interactive 90/60/30-day credential countdown badges for DET License (`1388443`), RERA ORN (`44483`), Ejari (`0120250814005322`), and ICP Card (`2/1/1192499`).
- [ ] **FE-GOAL-023**: Session security ticker displaying current IP address, browser user-agent, and active session timestamp.
- [ ] **FE-GOAL-024**: Interactive career milestone progress line tracing corporate growth from inception to 2026.
- [ ] **FE-GOAL-025**: Avatar photo upload modal with real-time circular crop preview and canvas compression.
- [ ] **FE-GOAL-026**: Personal details inline editor with instant field validation feedback tags.
- [ ] **FE-GOAL-027**: Department assignment badge display with Level 5 Superuser bypass indicator.
- [ ] **FE-GOAL-028**: Two-Factor Authentication (2FA) QR code setup card with TOTP code input.
- [ ] **FE-GOAL-029**: Active login sessions list with one-click "Revoke All Other Devices" action button.
- [ ] **FE-GOAL-030**: Profile theme customization widget allowing custom accent ring colors.

---

## 🎨 Wave 59 — Executive Dashboard Analytics Cockpit & Flight Deck (`/dashboard`)

- [ ] **FE-GOAL-031**: High-density analytics KPI cards displaying Total Revenue, Active Leads, Off-Plan Sales, and Managed Units.
- [ ] **FE-GOAL-032**: Micro-sparkline trend graphs embedded directly inside metric cards showing 30-day performance.
- [ ] **FE-GOAL-033**: Drag-and-drop dashboard widget grid layout customizable by department manager.
- [ ] **FE-GOAL-034**: Real-time executive ticker displaying live inbound leads, deal closures, and WhatsApp messages.
- [ ] **FE-GOAL-035**: Department Manager performance comparison radar chart.
- [ ] **FE-GOAL-036**: Revenue vs Target gauge meter with animated progress arc (`#EF4444` indicator).
- [ ] **FE-GOAL-037**: Quick-action FAB button panel triggering New Lead, New Listing, or Send Invoice modals.
- [ ] **FE-GOAL-038**: Lead funnel conversion waterfall chart tracing Lead Ingest $\rightarrow$ Viewing $\rightarrow$ Offer $\rightarrow$ Ejari.
- [ ] **FE-GOAL-039**: Recent activities audit log stream with user avatar avatars and relative timestamp badges.
- [ ] **FE-GOAL-040**: Dashboard layout view mode selector (Compact Density vs Expanded Executive Deck).

---

## 🎨 Wave 60 — Theme Systems, Binary Light/Dark Mode & Brand Palette

- [ ] **FE-GOAL-041**: Strict Binary Theme Switcher enforcing Light (`#FFFFFF` + `#EF4444`) vs Dark (`#0F172A` + `#EF4444`).
- [ ] **FE-GOAL-042**: Centralized CSS Design Token variables file (`src/styles/brand-tokens.css`).
- [ ] **FE-GOAL-043**: Smooth theme transition animation preventing color flickering during mode toggle.
- [ ] **FE-GOAL-044**: Contrast ratio enforcement ensuring WCAG AAA accessibility compliance across dark text on light bg and light text on dark bg.
- [ ] **FE-GOAL-045**: Custom scrollbar styling with White Caves Red thumb (`#EF4444`) and slate track (`#1E293B`).
- [ ] **FE-GOAL-046**: Universal focus ring style for input elements (`outline: 2px solid #EF4444`).
- [ ] **FE-GOAL-047**: Toast notification system with custom Red (Error), Green (Success), and Blue (Info) glassmorphic cards.
- [ ] **FE-GOAL-048**: Loading spinner widget with glowing double-ring SVG spin animation.
- [ ] **FE-GOAL-049**: Custom tooltip container with subtle arrow pointing to trigger element.
- [ ] **FE-GOAL-050**: System dark mode auto-detection syncing browser `prefers-color-scheme`.

---

## 🎨 Wave 61 — Navigation, Header & Footer UX Refactor

- [ ] **FE-GOAL-051**: Fixed navbar scroll shrink effect (navbar height transitions from 80px to 64px on page scroll).
- [ ] **FE-GOAL-052**: Fluid Mega-Menu dropdown with glassmorphic backdrop for Residential, Commercial, and Off-Plan links.
- [ ] **FE-GOAL-053**: Left sidebar collapse/expand toggle button with smooth width transition (`240px` $\leftrightarrow$ `64px`).
- [ ] **FE-GOAL-054**: Breadcrumb navigation bar with home icon and clickable parent route links.
- [ ] **FE-GOAL-055**: Footer design upgrade featuring Dubai skyline vector illustration, quick links, and DET license numbers.
- [ ] **FE-GOAL-056**: Back-to-top floating button appearing after 400px vertical scroll.
- [ ] **FE-GOAL-057**: Mobile bottom navigation bar for quick access to Home, Search, CRM, and Profile.
- [ ] **FE-GOAL-058**: Global search modal triggered by `Cmd+K` / `Ctrl+K` keyboard shortcut.
- [ ] **FE-GOAL-059**: Notification bell icon with unread badge counter and dropdown feed.
- [ ] **FE-GOAL-060**: Language selector dropdown (English $\leftrightarrow$ Arabic RTL toggle).

---

## 🎨 Wave 62 — Property Detail View & Gallery Lightbox UI (`/properties/:id`)

- [ ] **FE-GOAL-061**: Full-width hero image gallery with thumbnail strip and lightbox modal.
- [ ] **FE-GOAL-062**: Interactive floorplan switcher (2D Schematic $\leftrightarrow$ 3D Model).
- [ ] **FE-GOAL-063**: Property highlights pill list (Private Pool, Sea View, Balcony, Maid Room).
- [ ] **FE-GOAL-064**: Mortgage EMI calculator widget embedded directly on property detail page.
- [ ] **FE-GOAL-065**: Schedule a Viewing sticky sidebar widget with calendar date picker.
- [ ] **FE-GOAL-066**: Agent contact card with direct WhatsApp chat button (`#25D366`) and call trigger.
- [ ] **FE-GOAL-067**: Neighborhood amenity distance visualizer (Schools, Hospitals, Malls, Airport).
- [ ] **FE-GOAL-068**: Download Brochure PDF button with instant document compilation preview.
- [ ] **FE-GOAL-069**: Similar Properties recommendation carousel based on price and community.
- [ ] **FE-GOAL-070**: Property status badge (Available / Under Offer / Sold / Rented) with color indicator.

---

## 🎨 Wave 63 — Forms, Inputs & Data Entry Controls

- [ ] **FE-GOAL-071**: Floating label input fields with smooth label float animation on focus.
- [ ] **FE-GOAL-072**: Custom searchable Select dropdown with auto-complete filtering.
- [ ] **FE-GOAL-073**: Date range picker widget for booking viewings and rental contract periods.
- [ ] **FE-GOAL-074**: File upload dropzone with drag-and-drop support, image thumbnail preview, and progress bar.
- [ ] **FE-GOAL-075**: Form validation error summary banner with anchor links to invalid fields.
- [ ] **FE-GOAL-076**: Currency input field with automated thousand-separator formatting (`AED 1,500,000`).
- [ ] **FE-GOAL-077**: Multi-step form progress bar with step numbers and completion icons.
- [ ] **FE-GOAL-078**: Password strength meter bar with real-time entropy calculation.
- [ ] **FE-GOAL-079**: Rich text editor widget for property description copywriting.
- [ ] **FE-GOAL-080**: Interactive checkbox and radio button controls with custom check mark graphics.

---

## 🎨 Wave 64 — Animations, Micro-Interactions & Motion Design

- [ ] **FE-GOAL-081**: Framer Motion page transition animations (Fade In + Slide Up on route change).
- [ ] **FE-GOAL-082**: Skeleton UI placeholders for property cards, profile statistics, and dashboard tables.
- [ ] **FE-GOAL-083**: Counting numbers animation for KPI stat cards (counts up from 0 to target value).
- [ ] **FE-GOAL-084**: Ripple click effect on primary action buttons.
- [ ] **FE-GOAL-085**: Confetti animation trigger on successful transaction closure or contract signature.
- [ ] **FE-GOAL-086**: Smooth accordion collapse/expand animation for FAQ and document sections.
- [ ] **FE-GOAL-087**: Card flip animation for viewing property front photo $\leftrightarrow$ key property specs back.
- [ ] **FE-GOAL-088**: Parallax scrolling background effect on luxury homepage sections.
- [ ] **FE-GOAL-089**: Floating chat widget pulse animation drawing user attention to WhatsApp assistant.
- [ ] **FE-GOAL-090**: Magnetic cursor effect on primary luxury CTA buttons.

---

## 🎨 Wave 65 — Mobile Responsiveness, PWA UI & Accessibility (WCAG 2.1)

- [ ] **FE-GOAL-091**: Mobile bottom sheet modal drawer for mobile search filters and options.
- [ ] **FE-GOAL-092**: Touch gesture swipe navigation for image carousels and gallery modals.
- [ ] **FE-GOAL-093**: PWA Install App banner with custom White Caves app icon preview.
- [ ] **FE-GOAL-094**: Offline banner alert notifying user when device drops internet connection.
- [ ] **FE-GOAL-095**: ARIA attributes audit across all interactive buttons, links, and modal dialogs (`aria-label`, `aria-expanded`).
- [ ] **FE-GOAL-096**: Keyboard navigation focus trap inside modal dialogs (`Tab` / `Shift+Tab` cycling).
- [ ] **FE-GOAL-097**: High-contrast text mode toggle for visually impaired users.
- [ ] **FE-GOAL-098**: Screen reader visually-hidden utility classes (`.sr-only`) for graphical elements.
- [ ] **FE-GOAL-099**: Touch target size enforcement (minimum 44px $\times$ 44px clickable area on mobile).
- [ ] **FE-GOAL-100**: Sovereign OS Version 3.0 Master Frontend UI Design & Aesthetics Certificate.
