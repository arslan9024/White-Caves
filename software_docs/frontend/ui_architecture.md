# White Caves Real Estate LLC — UI/UX Architecture & Standards

## 🏛️ The Feature-First Co-Located View-Logic-Style-Data 4-Way Segregation

To guarantee a resilient `O(1)` module lookup speed, seamless multi-language translations (`en`, `ar`, `es`, `ru`), and infinite scaling potential without spaghetti code or style collision, the entire White Caves front-end follows a strict BEM-clean 4-Way isolation pattern.

### Structure Rule:
For every distinct component or UI feature, it MUST be wrapped in its own isolated subfolder within `src/components/`.

Inside that subfolder, there are 4 co-located layers:

```
src/components/[category]/ComponentName/
├── ComponentName.tsx                # 1. View Layer: Pure presentational shell
├── logic/
│   └── ComponentName.logic.ts       # 2. Logic Layer: React hooks, state, Redux thunks, event handlers
├── styles/
│   └── ComponentName.style.ts       # 3. Style Layer: styled-components & framer-motion UI tokens
├── data/
│   └── ComponentName.data.ts        # 4. Data Layer: Isolated copy, labels, constants for i18n
├── ComponentName.test.tsx           # Unit tests (Vitest + React Testing Library)
└── index.ts                         # Re-exports View, Logic, Styles, and Data
```

---

## 📋 Standardized 4-Way Component Registry

| Component | Category / Path | View Shell | Logic Layer | Style Layer | Data Layer | Unit Test Status |
|---|---|---|---|---|---|---|
| **AI Command Center** | `src/components/crm/AICommandCenter/` | `AICommandCenter.tsx` | `logic/AICommandCenter.logic.ts` | `styles/AICommandCenter.style.ts` | `data/AICommandCenter.data.ts` | ✅ 100% Passed |
| **Homepage Hero** | `src/components/home/HeroSection/` | `HeroSection.tsx` | `HeroSection.logic.ts` | `HeroSection.style.ts` | `data/HeroSection.data.ts` | ✅ 3/3 Passed |
| **Prime Communities Carousel** | `src/components/home/FeaturedCommunityCarousel/` | `FeaturedCommunityCarousel.tsx` | `logic/FeaturedCommunityCarousel.logic.ts` | `styles/FeaturedCommunityCarousel.style.ts` | `data/FeaturedCommunityCarousel.data.ts` | ✅ 1/1 Passed |
| **Floating Hero Search Pill** | `src/components/home/FloatingHeroSearchPill/` | `FloatingHeroSearchPill.tsx` | `logic/FloatingHeroSearchPill.logic.ts` | `styles/FloatingHeroSearchPill.style.ts` | `data/FloatingHeroSearchPill.data.ts` | ✅ 1/1 Passed |
| **Floating Search Widget** | `src/components/CavesFloatingSearch/` | `CavesFloatingSearch.tsx` | `CavesFloatingSearch.logic.ts` | `CavesFloatingSearch.style.ts` | `data/CavesFloatingSearch.data.ts` | ✅ 1/1 Passed |
| **Floating WhatsApp Widget** | `src/components/CavesFloatingWhatsApp/` | `CavesFloatingWhatsApp.tsx` | `logic/CavesFloatingWhatsApp.logic.ts` | `styles/CavesFloatingWhatsApp.style.ts` | `data/CavesFloatingWhatsApp.data.ts` | ✅ 8/8 Passed |
| **3-Column Tools Dashboard** | `src/components/home/ToolsDashboard/` | `ToolsDashboard.tsx` | `logic/ToolsDashboard.logic.ts` | `styles/ToolsDashboard.style.ts` | `data/ToolsDashboard.data.ts` | ✅ 1/1 Passed |
| **Binary Theme Switcher** | `src/components/common/BinaryThemeSwitcher/` | `BinaryThemeSwitcher.tsx` | `logic/BinaryThemeSwitcher.logic.ts` | `styles/BinaryThemeSwitcher.style.ts` | `data/BinaryThemeSwitcher.data.ts` | ✅ 1/1 Passed |
| **Language Switcher Pill** | `src/components/common/LanguageSwitcherPill/` | `LanguageSwitcherPill.tsx` | `logic/LanguageSwitcherPill.logic.ts` | `styles/LanguageSwitcherPill.style.ts` | `data/LanguageSwitcherPill.data.ts` | ✅ 3/3 Passed |
| **User Preferences Dropdown** | `src/components/layout/PublicNavbar/UserPreferencesDropdown/` | `UserPreferencesDropdown.tsx` | `logic/UserPreferencesDropdown.logic.ts` | `styles/UserPreferencesDropdown.style.ts` | `data/UserPreferencesDropdown.data.ts` | ✅ 5/5 Passed |
| **Interactive Map Drawer** | `src/components/home/InteractiveMapDrawer/` | `InteractiveMapDrawer.tsx` | `logic/InteractiveMapDrawer.logic.ts` | `styles/InteractiveMapDrawer.style.ts` | `data/InteractiveMapDrawer.data.ts` | ✅ 1/1 Passed |
| **Global Property Card** | `src/components/common/PropertyCard/` | `PropertyCard.tsx` | `logic/PropertyCard.logic.ts` | `styles/PropertyCard.style.ts` | `data/PropertyCard.data.ts` | ✅ 26/26 Passed |
| **Employee Leaderboard Panel** | `src/components/crm/EmployeeLeaderboardPanel/` | `EmployeeLeaderboardPanel.tsx` | `logic/EmployeeLeaderboardPanel.logic.ts` | `styles/EmployeeLeaderboardPanel.style.ts` | `data/EmployeeLeaderboardPanel.data.ts` | ✅ 1/1 Passed |
| **Animated Headline Gradient** | `src/components/home/AnimatedHeadlineGradient/` | `AnimatedHeadlineGradient.tsx` | `logic/AnimatedHeadlineGradient.logic.ts` | `styles/AnimatedHeadlineGradient.style.ts` | `data/AnimatedHeadlineGradient.data.ts` | ✅ 2/2 Passed |
| **Unified Workspace Layout** | `src/layouts/UnifiedWorkspaceLayout.tsx` | `UnifiedWorkspaceLayout.tsx` | `UnifiedWorkspaceLayout.logic.ts` | `UnifiedWorkspaceLayout.style.ts` | `UnifiedWorkspaceLayout.data.ts` | ✅ Verified |

---

## 🎨 Color Lockdown & Brand Design Token System

The visual design system enforces the quiet luxury aesthetic tailored for ultra-high-net-worth real estate:

- **Primary / Brand Action Accent:** White Caves Red (`#EF4444` / `rgba(239, 68, 68, 1)`)
- **Light Theme Background:** Pure Crisp White (`#FFFFFF` / `#F8FAFC`)
- **Dark Theme Background:** Deep Slate Gray (`#0F172A` / `#1E293B`)
- **Text & Contrast Tokens:**
  - High-Contrast Light Mode: `#0F172A` (Text Primary), `#64748B` (Text Muted)
  - High-Contrast Dark Mode: `#FFFFFF` (Text Primary), `#94A3B8` (Text Muted)
- **Hierarchy Rank Badges:**
  - Level 5 Managing Director: Gold (`#D4AF37`)
  - Level 4 Department Manager: White Caves Red (`#EF4444`)
  - Level 3 Supervisor: Royal Purple (`#7C3AED`)
  - Level 2 Junior Agent: Sky Blue (`#0EA5E9`)
  - Level 1 Intern: Silver Slate (`#94A3B8`)

---

## 🌐 4-Language Universal Localization (i18n)

Full cross-platform support across both JSON dictionary loaders and typed TypeScript definitions:

1. **English (`en`)** — LTR (`dir="ltr"`), default primary corporate language.
2. **Arabic (`ar`)** — RTL (`dir="rtl"`), full native UAE typography & mirrored layouts.
3. **Spanish (`es`)** — LTR (`dir="ltr"`), international high-net-worth European / LatAm investors.
4. **Russian (`ru`)** — LTR (`dir="ltr"`), international CIS luxury buyers & off-plan investors.

All 12 corporate departments, 35 AI assistants, and UI command hubs are fully translated and verified.

---

## ⚖️ Symmetrical Floating Viewport Balance

- **Bottom-Left Widget:** `<CavesFloatingSearch />` — Fullscreen Framer Motion overlay modal search viewport triggered via floating pill or `⌘K` / `Ctrl+K`.
- **Bottom-Right Widget:** `<CavesFloatingWhatsApp />` — Symmetrical floating WhatsApp click-to-chat action widget with brand pulse glow linking directly to official broker lines (`+971505110636`).

---

## 🏛️ Government Accreditations & Proactive Expiry Monitors

- **DET Commercial License:** No. `1388443` (General Brokerage Classification)
- **RERA Registration ORN:** No. `44483` (Real Estate Regulatory Agency Dubai)
- **HQ Ejari Certificate:** No. `0120250814005322` (Office D-72, El Shaye - 4 Building, Dubai, UAE)
- **ICP Establishment Card / MOL:** No. `2/1/1192499` (Ministry of Human Resources & Emiratisation)

---

## 👑 Sovereign Managing Director Bypass (Level 5 Bypass)

If authentication matches the core sovereign email (`arslanmalikgoraha@gmail.com`), the RBAC engine immediately:
1. Elevates session token to `accessLevel: 5` (`LEVEL_5_MASTER`).
2. Suppresses white screen blockers and bypasses degradation guards.
3. Grants absolute unmasked visibility over all 12 corporate departments, 35 AI assistants, financial audit trails, and employee hierarchical controls.
