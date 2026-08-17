# White Caves Real Estate UI/UX Architecture

## The Feature-First Co-Located View-Logic-Style-Data 4-Way Segregation
To guarantee a resilient `O(1)` module lookup speed, seamless multi-language translations, and infinite scaling potential without spaghetti code, the entire White Caves front-end follows a strict BEM-clean 4-Way isolation pattern.

### Structure Rule:
For any distinct module (e.g. `TopNavbar`, `HeroSection`, `AICommandCenter`, `CavesFloatingSearch`), it MUST be wrapped in its own isolated subfolder within `src/components/`.

Inside that subfolder, there must be 4 co-located files perfectly decoupled:

1. **The View (`Component.tsx`)**
   - Sits at the folder root: purely presentational shell.
   - Responsible for rendering the layout skeleton, mapping props, and consuming content data variables and hooks.
   - Zero hardcoded internal logic or inline styling tokens.

2. **The Logic (`logic/Component.logic.ts` or `Component.logic.ts`)**
   - The neurological core of the component.
   - Houses all React hooks, state management, Redux dispatchers, global event listeners, and API calls.
   - Exports a custom hook (e.g. `useComponentLogic()`) returning state and handlers to the View.

3. **The Style (`styles/Component.style.ts` or `Component.style.ts`)**
   - The visual paint and physics layer.
   - Powered by `styled-components` and `framer-motion`.
   - Adheres strictly to the Color Lockdown protocol.

4. **The Data Layer (`data/Component.data.ts` or `Component.data.ts`)**
   - Stores only content strings and structured data variables for instant multi-language translation and localization.

---

### Color Lockdown Protocol:
- **Primary / Brand Action:** White Caves Red (`#EF4444`)
- **Canvas / Contrast:** Brilliant Crisp White (`#FFFFFF`)
- **Text / Depth:** Deep Slate Gray (`#1E293B`)
- **BANNED:** Emerald Green, Metallic Gold, Obsidian Dark.

---

### Government Accreditations & Proactive Expiry Monitors:
- **DET Commercial License:** No. `1388443` (General Brokerage Classification)
- **RERA Registration ORN:** No. `44483` (Real Estate Regulatory Agency Dubai)
- **HQ Ejari Certificate:** No. `0120250814005322` (Office D-72, El Shaye - 4 Building)
- **ICP Establishment Card / MOL:** No. `2/1/1192499` (Ministry of Human Resources & Emiratisation)

---

### MD Founder Bypass (Level 5 Shortcut)
If authentication matches the core sovereign email (`arslanmalikgoraha@gmail.com`), the RBAC engine will immediately elevate the session token to `accessLevel: 5` (`LEVEL_5_MASTER`), suppressing the white screen loader, disabling all degradation guards, and routing directly to the MD Profile hub to unmask the Unified 12-Department Dashboard.
