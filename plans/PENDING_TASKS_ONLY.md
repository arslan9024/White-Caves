# AEGIS 2.0 — 100-Point Master UI/UX & Graphic Refactoring Backlog

> **Audit Mode:** 100-Point Master UI/UX & Graphic Refactoring Audit Matrix  
> **Status:** Phase 1 In Progress — Plan & Documentation Active  
> **Active Roadmap:** [MASTER_PLAN.md](./MASTER_PLAN.md)  
> **Active Wave Backlog:** [WAVE_30_IMPLEMENTATION_BACKLOG.md](./waves/WAVE_30_IMPLEMENTATION_BACKLOG.md) (Wave 30)  
> **Last Updated:** 2026-08-01  

---

## 🎨 1. Universal Design Tokens & Branding Safeguards (Items 01 - 15)

- [ ] **01. Strict Color Lockdown:** Purge all random blues, purples, or multi-tint grays. Lock strictly to `#EF4444` Red, `#FFFFFF` White, `#1E293B` Slate.
- [ ] **02. BEM-Contained CSS Isolation:** Move loose styling variables into `src/styles/DashboardComponents.css`.
- [ ] **03. Elimination of Inline Styles:** Ban floating `style={{...}}` properties across presentation components.
- [ ] **04. Unified Typography Scale:** Enforce Inter/Roboto font scale with absolute hierarchy rules.
- [ ] **05. Consistent Corner Radii:** Standardize input windows, cards, and buttons to `border-radius: 8px`.
- [ ] **06. Smooth Interaction Easings:** Inject global `transition: all 0.25s ease-in-out` across interactive elements.
- [ ] **07. Hardware-Accelerated Hovers:** Apply GPU-transformed `transform: translateY(-2px)` scaling on hover.
- [ ] **08. Z-Index Layer Matrix:** Establish strict z-index scale (TopNav: 1000, Sidebar: 900, Modals: 2000).
- [ ] **09. Standardized Element Spacing Multipliers:** Enforce padding scale multipliers (`0.5rem` / `1rem` / `1.5rem`).
- [ ] **10. High-Contrast Input Focus Rings:** Style form focus inputs with high-visibility Red ring outlines.
- [ ] **11. Soft Micro-Dropshadow Vectors:** Wire subtle, low-opacity gray shadow properties (`0 4px 12px rgba(0,0,0,0.05)`).
- [ ] **12. Compact Metadata Text Baselines:** Style layout timestamps and tracking logs with micro-typography.
- [ ] **13. Horizontal Section Hairline Dividers:** Insert low-opacity hairline dividers (`1px solid #E2E8F0`) between widgets.
- [ ] **14. Skeleton Screen Placeholder Cards:** Design matching skeleton screens for initial data loading states.
- [ ] **15. Auto-Generated UI Evidence Specs:** Link automated frontend validation script logs directly into daily ledgers.

---

## 🏡 2. Public Homepage Visual Transformation (Items 16 - 40)

- [ ] **16. Cinematic Parallax Hero Section:** High-performance full-bleed drone video/carousel showing Dubai communities.
- [ ] **17. Universal Fixed Top Navbar Shell:** Position top navbar fixed (`top: 0`, `z-index: 1000`) with 2px `#EF4444` bottom border.
- [ ] **18. Content Overlap Padding Correction:** Add `padding-top: 64px` (`pt-16`) to main content container.
- [ ] **19. Floating Search Command Pill:** Centered floating search pill (`top: 80px`, `z-index: 999`) to open search modal via `Ctrl+K`.
- [ ] **20. Framer Motion Property Search Modal:** Full-screen search overlay managing complex filters without page reloads.
- [ ] **21. Real Google Maps JavaScript API Integration:** Connect `@googlemaps/js-api-loader` to render live Dubai map.
- [ ] **22. Minimalist Silver Map Custom Skin:** Apply monochrome skin coloring water/land to soft grays for marker pop.
- [ ] **23. Custom Red Property Marker Assets:** Plot listing coordinates using White Caves Red (`#EF4444`) pins.
- [ ] **24. Glassmorphic Property Quick-View Popups:** Map marker popups showing property photo, AED price, and WhatsApp link.
- [ ] **25. Advanced Marker Clustering Array:** Use `MarkerClusterer` to group 9,378+ property units dynamically on zoom.
- [ ] **26. Gamified Tools & Insights Section Layout:** 3-column dashboard matrix hosting ROI gauges and mortgage sliders.
- [ ] **27. Interactive ROI Delta Gauges:** Circular SVG progress indicators animating on sales vs leasing toggle.
- [ ] **28. Mortgage Flight Slider:** Interactive mortgage slider with Red anchor handle calculating payments in real time.
- [ ] **29. Neighborhood Pulse Carousel Cards:** Compact cards flipping on hover to show 7-day Dubai price trends.
- [ ] **30. Testimonial Podium Component:** Animated 3D rotating slider displaying verified customer reviews.
- [ ] **31. High-Density Area Guide Grid:** Informational grid for Dubai master communities with Unsplash CDNs.
- [ ] **32. Frictionless WhatsApp Contact Integration:** Single floating contact orb in right-bottom corner.
- [ ] **33. Open-Source Villa Picture Hydration:** High-resolution luxury real estate photos from Unsplash CDN.
- [ ] **34. Bilingual Language Toggle Control:** English/Arabic text toggle widget in global header bar.
- [ ] **35. Smooth Image Fading Transits:** Soft opacity transit filters on listing photos during hydration.
- [ ] **36. Refactored Public Footer:** 4-column corporate footer with RERA license badge and legal disclaimers.
- [ ] **37. Contact Capture Widgets:** Inline lead generation card with instant phone validation.
- [ ] **38. Newsletter Input Field:** Single-line email subscription box with interactive submit state.
- [ ] **39. Corporate Asset Listings:** High-density luxury villa & penthouse feature cards.
- [ ] **40. Community Info Layouts:** Detailed neighborhood amenity tags (pools, schools, metro distance).

---

## 👤 3. Auth Module & Profile Page Modernization (Items 41 - 60)

- [ ] **41. Luxury Split-Screen Login Shell:** Refactor `SignIn.tsx` & `SignUp.tsx` into modern split-screen presentation cards.
- [ ] **42. Floating Form Labels:** Sleek floating placeholder labels moving up smoothly on input focus.
- [ ] **43. Google OAuth Exception Safety Wrapper:** Try-catch error bounds around Google login handshakes.
- [ ] **44. Instant Post-Login Routing Guard:** Pre-check local storage tokens before mounting routes.
- [ ] **45. Founder Landing Short-Circuit:** Email `arslanmalikgoraha@gmail.com` force-injects `accessLevel: 5` (`LEVEL_5_MASTER`).
- [ ] **46. Direct Profile Page Landing:** Force Managing Director directly onto `ProfilePage.tsx` with zero latency.
- [ ] **47. Executive Profile CRUD Editor:** Credential layout inside Profile page with editable fields and session logs.
- [ ] **48. Level 5 Administrative Overrides Button:** Quick-action button jumping straight to corporate workspace.
- [ ] **49. Bypass Guard Security Floor:** Default securely to master profile session if identity system drops.
- [ ] **50. Defensive Password Reset Viewport:** Dark-slate minimalist container with floating alert warnings.
- [ ] **51. Multi-Factor Verification Views:** 6-digit OTP code input boxes with auto-focus step transitions.
- [ ] **52. Profile Picture Upload Crop Box:** Circular crop preview modal with drag-and-drop avatar file handling.
- [ ] **53. Security Log History Tables:** Chronological audit log showing IP addresses, device user-agents, and login timestamps.
- [ ] **54. Active Role Verification Badges:** Visual rank tags displaying `LEVEL_5_MASTER`, `LEVEL_4_MANAGER`, or `LEVEL_3_SUPERVISOR`.
- [ ] **55. Session Timeout Warning Modals:** 60-second countdown modal warning users before session expiration.
- [ ] **56. Single Sign-On (SSO) Enterprise Connectors:** Microsoft Azure AD & Okta SAML 2.0 auth hooks.
- [ ] **57. Biometric WebAuthn Support:** TouchID/FaceID passkey authentication trigger for executive devices.
- [ ] **58. Impersonation Audit Trail Banner:** Yellow caution banner indicating active Ghost Session impersonation.
- [ ] **59. Password Strength Meter Indicator:** 4-stage visual color bar validating passphrase complexity.
- [ ] **60. Account Lockout Escalation Routine:** 5-attempt failed login lock with automated admin notification.

---

## 💼 4. The 12-Department "Sovereign" CRM Cockpit (Items 61 - 100)

- [ ] **61. 1-12-108 Management Navigator Sidebar:** Permanent left command panel unmasking 12 departments.
- [ ] **62. Recursive Department Links Generation:** Read 12 department parameters dynamically from `companyMasterLedger.json`.
- [ ] **63. "Ghost Session" Impersonation Selector:** Header dropdown allowing MD to simulate any employee/tenant layout.
- [ ] **64. 1-12-108 Hierarchy Data Mapping:** Divide organization into 12 Managers & 108 Supervisors in 9-person squads.
- [ ] **65. High-Density Inventory Spreadsheet Grid:** Data-dense table showing status badges for 9,378+ managed properties.
- [ ] **66. Interactive 4-Column Kanban Lead Board:** Drag-and-drop workflow kanban tracking leads to closing.
- [ ] **67. Kanban Card Action Trigger Modals:** Single-click popups on lead cards launching quick contact/notes forms.
- [ ] **68. Portal Ingestion SLA Counter Tickers:** Live countdown timers enforcing 15-minute round-robin routing SLA.
- [ ] **69. WhatsApp SLA Response Clocks:** Live countdown timers enforcing agent reply speed parameters.
- [ ] **70. Gamified Sales Leaderboard Podium:** Animated 3-tier podium displaying top brokers sorted by volume.
- [ ] **71. Automated Commission Rate Matrix Instance:** Tier lookup matrix (0-5M AED deals = 2% broker / 3% agency split).
- [ ] **72. State-Driven Commission Approval Workflow:** Transition array (`SUBMITTED` ➔ `APPROVED` ➔ `LOCKED` ➔ `RELEASED`).
- [ ] **73. Immutable Accounting Ledger Enforcement Operator:** `lockLedgerPeriod(monthIndex)` freeze function locking past records.
- [ ] **74. Rolling 12-Month Cash-Flow Forecast Chart:** Predictive modeling component outputting 12-month cash flow array.
- [ ] **75. Monthly P&L Ingestor with Close-Month Lock:** Multi-currency revenue calculator with close-month freeze.
- [ ] **76. Automated Commission Clawback Risk Monitor:** 30-day deal review algorithm calculating clawback adjustments.
- [ ] **77. Accounts Receivable Chronological Aging Sorter:** Array reduction separating invoices into 30/60/90/120+ days.
- [ ] **78. Budget vs Actual Variance Data Aggregator:** Aggregator comparing monthly budgets against transaction totals.
- [ ] **79. One-Click Commission Statement PDF Simulator:** Memory compiler building printable agent commission statements.
- [ ] **80. UAE FTA VAT Return Formatter Routine:** Tax processor isolating commercial fees & formatting 5% UAE VAT.
- [ ] **81. 4-Hour TTL Local Memory Cache Timer:** Cache wrapper around exchange rates saving cloud invocation costs.
- [ ] **82. AI Assistant Avatar Active Status Hub:** Configuration viewport housing active AI avatar nodes (Zoe, Nadia, Sentinel, Clara, Sophia).
- [ ] **83. Live AI Text Ingestion Trace Tickers:** Console widgets tracking unformatted text strings analyzed by AI.
- [ ] **84. AI Compliance Contract Audit Feedback Blocks:** Responsive side-by-side error tracking boxes for contract violations.
- [ ] **85. 5-Star Social Review Invitation Flow View:** Interface converting high CSAT scores into social review links.
- [ ] **86. RUP 4-Tier Documentation Structure:** Structured `/software_docs` (`01_requirements/`, `02_design/`, `03_use_cases/`, `04_flowcharts/`).
- [ ] **87. Tech Replacement Rules Manifest:** `software_docs/tech_replacement_rules.md` tracking upgrades & fallbacks.
- [ ] **88. Dynamic Plan Reflection Loop:** Update physical files in `/plans/` at the start of every turn.
- [ ] **89. Pure Presentation/Logic File Separation:** Move state math into custom hooks (`useWorkspaceEngine.ts`).
- [ ] **90. Nodemon Backend Hot-Reload Integration:** Verify `package.json` scripts linked to nodemon for local hot-reload.
- [ ] **91. Corporate Onboarding Guide View:** Interactive 5-step stepper guiding new brokers through RERA registration.
- [ ] **92. Tenant Communication Log Panel:** Centralized history table recording Ejari renewal notices and SMS dispatches.
- [ ] **93. Vendor Performance Rating Matrix:** 5-star evaluation grid tracking maintenance contractor service speeds.
- [ ] **94. Security Audit Logging Input View:** Admin panel filtering system events by user level and IP address.
- [ ] **95. Automated Document Approval Chips:** Color-coded status chips (`DRAFT`, `PENDING_RERA`, `EXPIRED`, `EXECUTED`).
- [ ] **96. DAMAC Hills 2 Cluster Filter Bar:** Quick-toggle cluster pills (Akoya, Basswood, Camelia, Vardon) for unit inventory.
- [ ] **97. Off-Plan Payment Plan Schedule Visualizer:** Timeline stepper showing milestone payments (10% booking, 40% construction, 50% handover).
- [ ] **98. Ejari Contract Expiry Warning Ticker:** Alert strip notifying property managers 90 days before Ejari contract expiration.
- [ ] **99. PDC Post-Dated Cheque Vault Manager:** Digital ledger tracking incoming PDC clearance dates & bank deposit statuses.
- [ ] **100. Executive Performance Export Pipeline:** Single-click CSV/PDF data exporter compiling 12-department KPIs.
