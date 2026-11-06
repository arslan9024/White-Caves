# FILE: docs/architecture/INTERFACE_OVERDRIVE.md

# CONSTITUTION: UI Refactor Laws, Sidebar Deduplication, AI CRM CRUD & Layout Fixed Framework

# OPTIMIZATION: High-Density Low-Token Technical Specifications | Chakra UI Integration Matrix

## 👑 1. ANCHOR: THE PROFILE DROPDOWN CENTRALIZATION

- Centralize `ThemeContext` tracking nodes (Light, Dark, System mode) along with `LanguageContext` (en/ar/es/ru) and `CurrencyContext` (AED/USD/EUR) into the isolated top header Profile Dropdown component (`UserPreferencesDropdown`).
- Remove duplicate component nodes, layout variations, and multi-layered configurations from the primary viewport tracking canvas.
- Permanently purge Level 5 Founder administrative item listings from standard viewing panels; co-locate these administrative controls under a strict RBAC layout conditional check hidden within the main Profile Dropdown drawer matrix.

## 🗂️ 2. LAYOUT: SIDEBAR DISCIPLINE (ZERO-FLICKER FULLSCREEN)

- State Rules: Default initialization state (`useState` state flags initialized inside `UnifiedWorkspaceLayout.logic.ts` and `ModernDashboardPage.tsx`) for _both_ Left and Right sidebars MUST be hidden (`isOpen: false`).
- Dual Sidebar Constraint: Enforce a disciplined constraint tracking switch: `activeSidebar: 'LEFT' | 'RIGHT' | 'BOTH' | null`. By default selecting an icon from either sidebar sets exclusive focus, unless the user explicitly toggles both sidebars to be open simultaneously.
- Deep Routing Mutators: Selecting an Activity Bar icon transitions the global main viewport router state (`DashboardContentRouter.tsx`). Clicking a localized sub-menu item layer inside the active explorer list triggers explicit asynchronous component viewport updates on the main canvas screen without resetting global filters.

## 🎨 3. STYLING: LUXURY DARK/LIGHT/SYSTEM FIXES

- Fix visibility bugs (such as black text rendering on dark backdrops, or white elements bleeding into light screens). Bind all components directly to a zero-runtime compiled design token stylesheet framework using our brand variables:
  - Brand Accent: White Caves Red `#EF4444` (used for active operational switches, state indicators, and glowing boundary feedback parameters).
  - Light Mode: Background Canvas `#F8FAFC` | Surface Card `#FFFFFF` | Text Color `#0F172A`.
  - Dark Mode: Background Canvas `#0F172A` | Surface Card `#1E293B` | Text Color `#F8FAFC`.
- Apply strict CSS inheritance overrides globally across all nested tables, text inputs, loading templates, and data row view grids to maintain clear text contrast boundaries on both LTR and RTL directions natively.

## 🤖 4. EXTENSION: AI ASSISTANTS TEAM MANAGEMENT CRUD

- Structural Database Expansion: Integrate a dedicated CRUD administration subsystem within the Left Sidebar navigation panel to govern our 35-AI-Agent Mesh. This structure allows managing and updating records for all automated corporate branches (including Zoe, Linda, Daisy, Mary, and incoming models).
- Database Schema Map (`prisma/schema.prisma`):

```prisma
model AiAssistantAgent {
  id               String     @id @default(auto()) @map("_id") @db.ObjectId
  agentName        String     @unique /// e.g., @Zoe, @Linda, @Daisy, @Mary
  departmentCode   String     /// e.g., WC-EXE, WC-LMS, WC-CRM
  agentRoleTitle   String
  concurrencyCap   Int        @default(5)
  isActive         Boolean    @default(true)
  cachedMemorySize Int        @default(4096)
  updatedAt        DateTime   @updatedAt

  @@index([departmentCode])
}
```

## 🏗️ 5. COMPONENT UPGRADE: CHAKRA UI #GRILL-ME MATRIX

- Resolution Analysis: The core dashboard area relies on structured layout wrappers aligned with brand identity tokens (`#EF4444`, luxury dark/light surfaces). Chakra-aligned structural primitives (`Flex`, `Grid`, `Card`, `Box`, `Skeleton`) natively handle layout directions (`dir="rtl"` / `dir="ltr"`), aria standards, and multi-viewport responsiveness.
- Component Mapping Plan:
  - Layout boxes wrapped with `<Flex>` and `<Grid>` wrappers to align elements with luxury visual spacing guidelines.
  - Use `<Card>` and `<Box>` containers wrapped inside custom hooks to update light/dark backgrounds automatically when themes switch.
  - Wrap all operational tracking parameters inside `<Skeleton>` fallback tags during background database streaming phases.
