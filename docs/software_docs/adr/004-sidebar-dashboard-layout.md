# ADR-004: Sidebar & Dashboard Layout Pattern

**Status:** Accepted  
**Date:** 2026-03-31  
**Deciders:** Platform Team  

## Context

The platform evolved through multiple sidebar implementations:

1. **Phase 0.5:** 7+ individual sidebar components (CompanyDepartmentSidebar, AIAssistantsSidebar, MaryInventorySidebar, etc.)
2. **Phase 0.6:** Consolidated into `EnhancedLeftSidebar` + `EnhancedRightSidebar` inside a `DualSidebarLayout`
3. **Current:** `SidebarContainer` + CSS-native layout (the Enhanced components were subsequently removed)

The layout must support 24 roles, each with different tab configurations, while maintaining consistent navigation and responsive behavior.

## Decision

Adopt a **CSS-native dual-panel layout** with `SidebarContainer` and `UnifiedNavbar`:

### Architecture

```
┌──────────────────────────────────────────────────┐
│  TopBar (56px fixed)                             │
├────────────┬─────────────────────────────────────┤
│ Sidebar    │  Main Content Area                  │
│ Container  │  ┌───────────────────────────────┐  │
│ (260px)    │  │  UnifiedDashboardPage         │  │
│            │  │  ├── Role-gated Tabs          │  │
│ - Nav      │  │  │   (from ROLE_TAB_MAPPING)  │  │
│ - browseAs │  │  │                            │  │
│ - CRM      │  │  └───────────────────────────┘  │
│   links    │                                     │
└────────────┴─────────────────────────────────────┘
```

### Key components

| Component | Path | Responsibility |
|---|---|---|
| `TopBar` | `src/components/layout/TopBar/` | Fixed 56px navbar with logo, breadcrumbs, search, notifications, user menu |
| `SidebarContainer` | `src/components/layout/SidebarContainer/` | Left nav with role-based links, browseAs switcher, CRM navigation |
| `UnifiedDashboardPage` | `src/pages/UnifiedDashboardPage.tsx` | Tab-based dashboard; tabs gated by `ROLE_TAB_MAPPING` |
| `ROLE_TAB_MAPPING` | `src/config/ROLE_TAB_MAPPING.ts` | Source of truth: 30 role → tab[] mappings |

### Why CSS-native instead of component-based dual sidebar

1. Simpler — no wrapper component managing open/close state for two sidebars
2. Responsive — CSS handles collapse at breakpoints
3. Performance — no Redux state for sidebar visibility
4. Fewer components to maintain

## Consequences

### Positive
- Single layout pattern for all 24 roles
- Tab content area is the only dynamic element
- `browseAs` feature lets owner/admin preview other role dashboards
- Responsive collapse handled at CSS level

### Negative
- Lost the right sidebar panel (no AI assistant sidebar on dashboard pages)
- If right sidebar is needed later, need to revisit layout

## Files
- `src/components/layout/SidebarContainer/`
- `src/components/layout/TopBar/`
- `src/pages/UnifiedDashboardPage.tsx`
- `src/config/ROLE_TAB_MAPPING.ts`
