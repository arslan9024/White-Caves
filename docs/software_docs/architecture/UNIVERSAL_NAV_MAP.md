# Universal Navigation Map & Workspace Flowchart

This document outlines the user interaction flow from authenticating as a Managing Director (Level 5 Master Admin) or general agent, to navigation actions and rendering components in the unified content canvas.

```
[MD Account Login] ➔ [Hydration Bypass: Level 5 Master Admin] ➔ [Redirect to ProfilePage.tsx]
│
├────────────────────────────────────────┴────────────────────────────────────────┐
▼                                        ▼                                        ▼
[Universal Top Nav Click]         [Universal Sidebar Click]          [Main Content Canvas Update]
│                                        │                                        │
▼                                        ▼                                        ▼
[Global Search Palette]           [Select Dept / Service / Role]     [Render Local Mock Data / CRUD]
```

## Navigation Mechanics

1. **Hydration Guard Redirect (`FounderRedirectGuard`):** 
   When the email matches `arslanmalikgoraha@gmail.com`, the user is force-granted Level 5 Master permissions (`accessLevel: 5`), bypassing lower-tier department constraints. If they navigate to any page other than `/profile` on boot/login, the guard instantly redirects them to [ProfilePage.tsx](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/pages/crm/ProfilePage.tsx) to execute overall system controls.

2. **Unified Workspace Sidebar:**
   All operations are merged into a single Left Sidebar Command menu. Clicking options updates the URL path to `/crm/:department`, which updates the flexible content canvas in [UnifiedDashboardPage.tsx](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/pages/crm/UnifiedDashboardPage.tsx) without full page reload.

3. **80-Point Interactive Views:**
   Mock data from [dubaiRealEstateMocks.ts](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/mocks/dubaiRealEstateMocks.ts) handles local client-side CRUD workflows for properties, employee ledgers, multi-currency calculators, and AI command trace logs.
