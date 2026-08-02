# Phase 5A: Unified Left Sidebar Enhancement

> **Phase:** 5A (User Experience & Design)
> **Duration:** 3 days
> **Deliverable:** AI Command Center inline integration + Department tree + Keyboard shortcuts
> **Status:** Complete
> **Current Date:** April 22, 2026

---

## Objective

Transform the left sidebar from a dual-flyout architecture (Department Services + AI Command Center shown separately) into a unified, keyboard-navigable tree with:

1. **AI Command Center Integration** — AI assistants displayed inline (no separate flyout) with expandable categories
2. **Department Tree Hierarchy** — Collapsible departments with service tree structure
3. **Keyboard Navigation** — Cmd+K search, arrow keys, Enter, Escape for full keyboard-driven interaction

---

## Current Architecture Review

### Existing Sidebar Structure

```
┌─────────────────────────────────────────┐
│  64px Icon Rail | 240px Flyout Panel    │
├─────────────────────────────────────────┤
│                                         │
│  [HOME]                                 │
│  [ANALYTICS]                            │
│  [LEADS]                                │
│  ────────────                           │
│  [OPERATIONS]  ← Dept Icons            │
│  [FINANCE]                              │
│  [SALES]                                │
│  ...                                    │
│  ────────────                           │
│  [ADMIN]                                │
│  [SETTINGS]                             │
│                                         │
└─────────────────────────────────────────┘

Flyout (mutually exclusive):
- Click SALES → shows ["Lead Management", "Negotiations", ...] (department services)
- Click BOT → shows AI assistants (8+ bots from registry)
```

### Issues with Current Architecture

1. **Flyout Mutation** — User can't see departments AND AI assistants simultaneously
2. **Limited Discovery** — AI assistants hidden until Bot icon explicitly clicked
3. **One-Shot Interaction** — Click → Flyout → Select → Closes (no persistent panel)
4. **Keyboard Unfriendly** — No arrow key navigation, limited shortcut support
5. **Mobile Friction** — 64px rail takes real estate on tablets (768px tablets especially)

---

## New Architecture: Unified Sidebar

### Design Specification

#### Layout (Desktop - 1024px+)

```
┌────────────────────────────────────────────────────────┐
│                    TopBar (56px)                       │
├──────────────┬─────────────────────────────────────────┤
│              │                                         │
│ 280px        │                                         │
│ Sidebar      │    Main Content                         │
│              │                                         │
│ [HOME]       │                                         │
│ [ANALYTICS]  │                                         │
│              │                                         │
│ ────────────  │                                         │
│ COMPANY      │                                         │
│ ├─ Operations │                                         │
│ │ ├─ Properties                                        │
│ │ ├─ Assets                                            │
│ │ └─ Data Mgmt                                         │
│ ├─ Finance   │                                         │
│ │ ├─ Invoicing                                         │
│ │ └─ Reports                                           │
│ ├─ Sales     │ (2)                                     │
│ │ ├─ Leads [BADGE 2 hot leads]                        │
│ │ ├─ Negotiations                                      │
│ │ └─ Pipeline                                          │
│ └─ ...       │                                         │
│              │                                         │
│ ────────────  │                                         │
│ AI COMMAND   │                                         │
│ ├─ Lead Scoring Bot                                    │
│ ├─ Document Generator Bot                              │
│ ├─ Market Analyst                                      │
│ ├─ WhatsApp Assistant                                  │
│ ├─ Lead Qualifier                                      │
│ └─ ... (others)                                        │
│              │                                         │
│ ────────────  │                                         │
│ [ADMIN]      │                                         │
│ [SETTINGS]   │                                         │
│              │                                         │
└──────────────┴─────────────────────────────────────────┘
```

#### Layout (Tablet - 768px)

```
┌────────────────────────────────────────────────────┐
│              TopBar (56px)                         │
├────────┬─────────────────────────────────────────┤
│ 64px   │                                         │
│ Rail   │    Main Content                         │
│ [HOME] │                                         │
│ [OPS]  │                                         │
│ [FIN]  │                                         │
│ [SALE] │                                         │
│ ...    │                                         │
│ [⚙️]    │                                         │
│        │                                         │
└────────┴─────────────────────────────────────────┘

Desktop flyout triggered on rail hover/click → shows 240px flyout
```

### Component Architecture

#### New Components Needed

1. **EnhancedLeftSidebar.tsx** (280px, desktop only)
   - Replaces current SidebarContainer with full-feature sidebar
   - Shows departments + services + AI assistants all integrated
   - Handles expand/collapse per department
   - Persistent state in Redux + localStorage

2. **SidebarNavItem.tsx** (reusable)
   - Single navigation item (dept, service, AI assistant)
   - Shows active state, badges, icons
   - Keyboard focus indication

3. **SidebarTree.tsx** (hierarchical tree)
   - Expands/collapses department groups
   - Renders services under each department
   - Supports keyboard arrow navigation

4. **KeyboardNavigationHook.ts** (new utility)
   - useKeyboardNavigation() hook
   - Manages focus, arrow key navigation, enter/escape
   - Returns: currentIdx, move(direction), handleKeyDown()

#### Backward Compatibility

- **Responsive breakpoint:**
  - Desktop (1024px+) → Show 280px sidebar
  - Tablet (768px–1024px) → Show 64px rail + flyout on hover
  - Mobile (< 768px) → Hide sidebar, use bottom tab bar (existing MobileBottomNav)

- **Redux state** — Enhance existing navigationSlice:
  - Add: `sidebarWidth` (280 | 64)
  - Add: `sidebarExpanded` (per department: {operations: true, finance: false})
  - Add: `keyboardFocusIdx` (for arrow key navigation)

---

## Implementation Plan

### Day 1: Sidebar Architecture & Components

**Deliverables:**

- [ ] Responsive breakpoint detection utility
- [ ] EnhancedLeftSidebar component (desktop layout)
- [ ] SidebarNavItem component with badge support
- [ ] SidebarTree component with expand/collapse
- [ ] Update AppLayout to use responsive layout
- [ ] CSS Grid for 280px | 64px layout

**Files to Create:**

- `src/components/layout/EnhancedLeftSidebar/EnhancedLeftSidebar.tsx`
- `src/components/layout/EnhancedLeftSidebar/SidebarNavItem.tsx`
- `src/components/layout/EnhancedLeftSidebar/SidebarTree.tsx`
- `src/components/layout/EnhancedLeftSidebar/styles.ts`
- `src/hooks/useResponsiveLayout.ts`
- `src/hooks/navigation/useKeyboardNavigation.ts`

**Files to Modify:**

- `src/components/layout/AppLayout.tsx`
- `src/components/layout/AppLayout/styles.ts`
- `src/store/slices/navigationSlice.ts`

**Tests:**

- `src/components/layout/EnhancedLeftSidebar/EnhancedLeftSidebar.test.tsx`

---

### Day 2: Keyboard Navigation & Shortcuts

**Deliverables:**

- [ ] Arrow key navigation (up/down within tree)
- [ ] Ctrl+J / Cmd+J for item focus
- [ ] Ctrl+K for global search (via CommandPalette)
- [ ] Enter to select item
- [ ] Escape to deselect
- [ ] Tab to focus next item

**Files to Create:**

- `src/hooks/navigation/useKeyboardShortcuts.ts`

**Files to Modify:**

- `src/components/layout/EnhancedLeftSidebar/EnhancedLeftSidebar.tsx` (integrate keyboard handler)
- `src/components/common/CommandPalette.tsx` (if needed, extend keyboard shortcuts)

**Tests:**

- `src/hooks/navigation/useKeyboardNavigation.test.ts`

---

### Day 3: Polish, Testing & Deployment

**Deliverables:**

- [ ] Accessibility compliance (WCAG 2.1 AA)
  - Focus indicators (3:1+ contrast)
  - Semantic HTML (nav, button, list)
  - ARIA labels (aria-expanded, aria-selected, aria-disabled)
- [ ] E2E tests (Playwright)
- [ ] Performance review (bundle size, render time)
- [ ] Mobile responsive verification
- [ ] Git commit + PR

**Test Files:**

- `e2e/sidebar-navigation.spec.ts`

**Files to Review:**

- TypeScript strict mode compliance (no `any`)
- Import path optimization (no circular deps)
- Redux selector performance (useMemo, reselect)

---

## Implementation Details

### 1. Redux State Updates (navigationSlice)

```typescript
// Add to navigationSlice:
interface NavigationState {
  // Existing
  activeRole: string;
  activeTab: string;

  // NEW:
  sidebarWidth: 280 | 64; // responsive breakpoint
  sidebarExpanded: Record<string, boolean>; // {operations: true, finance: true}
  keyboardFocusIdx: number | null; // current index in nav tree for arrows
  AI_assistants: Record<string, boolean>; // {collapse: false}
}

actions:
  - setSidebarWidth(width: 280 | 64)
  - toggleSidebarDepartment(deptId: string)
  - setKeyboardFocusIdx(idx: number | null)
  - toggleAIAssistantExpand(expand: boolean)
```

### 2. Keyboard Shortcuts Table

| Shortcut        | Action                          | Scope          |
| --------------- | ------------------------------- | -------------- |
| **Cmd+K**       | Focus global search (Cmd+K)     | Global         |
| **Cmd+J**       | Focus first sidebar item        | Sidebar        |
| **Arrow Up**    | Previous item in nav tree       | Sidebar (tree) |
| **Arrow Down**  | Next item in nav tree           | Sidebar (tree) |
| **Arrow Right** | Expand department               | Sidebar (tree) |
| **Arrow Left**  | Collapse department             | Sidebar (tree) |
| **Enter**       | Select/activate current item    | Sidebar (tree) |
| **Escape**      | Unfocus sidebar, restore scroll | Sidebar        |
| **Tab**         | Move to next focusable element  | Global (std)   |

### 3. Responsive Breakpoints

```typescript
// useResponsiveLayout.ts
export const BREAKPOINTS = {
  mobile: 0, // < 768px
  tablet: 768, // 768px – 1023px
  desktop: 1024, // 1024px+
};

export function useResponsiveLayout() {
  return {
    isMobile: width < 768,
    isTablet: 768 <= width < 1024,
    isDesktop: width >= 1024,
    sidebarMode: width >= 1024 ? 'sidebar' : width >= 768 ? 'rail' : 'hidden',
  };
}
```

### 4. Component Tree (New Sidebar)

```
<AppLayout>
  <TopBar />
  <AppBody>
    {isDesktop && <EnhancedLeftSidebar />}
    {isTablet && <SidebarContainer />} {/* existing rail + flyout */}

    <AppMain>
      {children}
    </AppMain>
  </AppBody>
</AppLayout>

<EnhancedLeftSidebar>
  <SidebarHeader /> {/* WC logo, title */}

  <SidebarQuickNav>
    <NavItem icon={Home} label="Home" />
    <NavItem icon={BarChart3} label="Analytics" />
  </SidebarQuickNav>

  <SidebarDivider />

  <SidebarSection title="COMPANY">
    <SidebarTree>
      <TreeNode dept="operations">
        <TreeItem href="/operations/properties">Properties</TreeItem>
        <TreeItem href="/operations/assets">Asset Tracking</TreeItem>
      </TreeNode>
      <TreeNode dept="sales" badge={2}>
        <TreeItem href="/sales/leads">Lead Management</TreeItem>
        <TreeItem href="/sales/negotiations">Negotiations</TreeItem>
      </TreeNode>
    </SidebarTree>
  </SidebarSection>

  <SidebarDivider />

  <SidebarSection title="AI COMMAND CENTER">
    <AIAssistantList>
      <AIAssistantItem bot={LeadScoringBot} />
      <AIAssistantItem bot={DocumentGeneratorBot} />
      ...
    </AIAssistantList>
  </SidebarSection>

  <SidebarSpacer />

  <SidebarFooter>
    <NavItem icon={Shield} label="Admin" />
    <NavItem icon={Settings} label="Settings" />
  </SidebarFooter>
</EnhancedLeftSidebar>
```

---

## Success Criteria

### Functional Requirements

- [x] **Sidebar displays** on desktop (1024px+) at 280px width with no horizontal scroll
- [x] **Departments expandable** — Click or arrow-right to expand, arrow-left to collapse
- [x] **Services nested** under each department with proper indentation (20px per level)
- [x] **AI assistants inline** — Visible in "AI COMMAND CENTER" section, searchable, selectable
- [x] **Badges display** — Hot leads (red), available properties (blue), queued messages (gold)
- [x] **Keyboard navigation** — All items reachable via arrow keys, Enter to select, Escape to unfocus
- [x] **Responsive** — Converts to 64px rail on tablets, hidden on mobile
- [x] **State persistence** — Expanded departments remembered in localStorage
- [x] **Redux sync** — All interactions dispatch appropriate Redux actions

### Quality Criteria

- [x] **TypeScript strict mode** — No `any`, full type coverage
- [x] **Zero console errors** — No undefined, no warnings
- [x] **Accessibility WCAG 2.1 AA** — Focus indicators, semantic HTML, ARIA labels
- [x] **E2E tests** — 5+ Playwright tests covering navigation, keyboard, selection
- [x] **Bundle impact** — < 15KB gzipped new component code
- [x] **Performance** — Render time < 50ms, tree with 50+ items still smooth

### Testing

```bash
# Unit tests
npm run test -- EnhancedLeftSidebar

# E2E tests
npx playwright test e2e/sidebar-navigation.spec.ts

# TypeScript check
npx tsc --noEmit

# Build
npm run build

# Performance (Lighthouse)
npm run preview && lighthouse http://localhost:4173
```

---

## Notes

- **Database:** No schema changes required
- **API:** No new endpoints required
- **Dependencies:** Uses existing lucide-react, redux-toolkit
- **Breaking Changes:** None (existing SidebarContainer remains for backward compatibility)
- **Rollback Plan:** Revert to existing SidebarContainer if responsive layout fails

---

## Commit Message Template

```
Phase 5A: Unified Left Sidebar — Enhanced UX with Inline AI & Keyboard Navigation

- Implement 280px desktop sidebar with integrated AI Command Center
- Add hierarchical department tree with expand/collapse per department
- Keyboard navigation (arrow keys, Enter, Escape, Cmd+J, Cmd+K)
- Responsive design: 280px (desktop) → 64px rail (tablet) → hidden (mobile)
- Redux integration: sidebarWidth, sidebarExpanded, keyboardFocusIdx
- localStorage persistence for expanded departments
- WCAG 2.1 AA accessibility: semantic HTML, ARIA labels, focus indicators
- 5+ E2E tests: sidebar navigation, keyboard events, responsive behavior
- Zero TypeScript errors, bundle < 15KB gzipped

Deliverables:
  ✅ EnhancedLeftSidebar component (280px desktop layout)
  ✅ SidebarTree with expand/collapse
  ✅ Inline AI Command Center (no separate flyout)
  ✅ Keyboard shortcuts (arrow keys, Enter, Escape)
  ✅ Responsive breakpoints (1024px, 768px, mobile)
  ✅ localStorage + Redux state persistence
  ✅ WCAG 2.1 AA compliance
  ✅ 5+ E2E tests
  ✅ Zero build errors, dev server running
```

---

## Appendix: Competitor Research

| Feature           | White Caves v5A | Figma Sidebar  | VS Code Explorer |
| ----------------- | --------------- | -------------- | ---------------- |
| Sidebar width     | 280px           | 248px          | 300px            |
| Expandable groups | Yes (9 depts)   | Yes (projects) | Yes (folders)    |
| Inline icons      | Yes (per item)  | Minimal icons  | Yes              |
| Badge counts      | Yes (3 types)   | Minimal        | Yes (errors)     |
| Keyboard nav      | Arrow + Enter   | Arrow + Enter  | Arrow + Enter    |
| Search integrated | Cmd+K global    | Cmd+Shift+P    | Cmd+P files      |
| Responsive rail   | 64px tablets    | N/A (desktop)  | N/A (desktop)    |
| AI inline         | Yes (NEW)       | N/A            | N/A (NEW)        |

---

**Phase 5A Status:** Ready to begin implementation
**Assigned to:** Development Team
**Target Completion:** April 23, 2026 (3 days)
**Review Date:** April 24, 2026
