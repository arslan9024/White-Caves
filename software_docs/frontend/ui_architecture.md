# White Caves Real Estate UI/UX Architecture

## The Feature-First Co-Located View-Logic-Style Segregation
To guarantee a resilient `O(1)` module lookup speed and infinite scaling potential without spaghetti code, the entire White Caves front-end follows a strict BEM-clean 3-Folder isolation pattern.

### Structure Rule:
For any distinct module (e.g. `TopNavbar`, `HeroSection`, `ProfileCard`), it MUST be wrapped in its own isolated subfolder within `src/components/`.

Inside that subfolder, there must be 3 files perfectly decoupled:

1. **The View (`Component.tsx`)**
   - Purely presentational.
   - Responsible for rendering the skeleton, mapping props, and consuming localization (`useTranslation.ts`).
   - Zero internal state (`useState`), zero side-effects (`useEffect`), zero inline-styles.

2. **The Logic (`Component.logic.ts`)**
   - The neurological core of the component.
   - Houses all React hooks (`useWorkspaceEngine`), Redux dispatchers, global event listeners, and API calls.
   - Exports a custom hook (e.g. `useComponentLogic()`) that returns the state and handler functions to the View.

3. **The Style (`Component.style.ts`)**
   - The visual paint and physics layer.
   - Powered by `styled-components` and `framer-motion`.
   - Adheres strictly to the Color Lockdown protocol.

### Color Lockdown Protocol:
- **Primary / Brand Action:** White Caves Red (`#EF4444`)
- **Canvas / Contrast:** Brilliant Crisp White (`#FFFFFF`)
- **Text / Depth:** Deep Slate Gray (`#1E293B`)
- **BANNED:** Emerald Green, Metallic Gold, Obsidian Dark.

### Micro-Interactions & Hardware Acceleration
- Every click must yield visual feedback (e.g., a Framer Motion spring pop).
- All transitions must be exactly `0.25s ease-in-out`.
- Employ HTML5 `navigator.vibrate` on critical phase gates (e.g., successful login, heavy API sync) to close the tactile loop.

## MD Founder Bypass (Level 5 Shortcut)
If authentication matches the core sovereign email (`arslanmalikgoraha@gmail.com`), the RBAC engine will immediately elevate the session token to `accessLevel: 5` (`LEVEL_5_MASTER`), suppressing the white screen loader, disabling all degradation guards, and routing directly to the MD Profile hub to unmask the Unified 12-Department Dashboard.
