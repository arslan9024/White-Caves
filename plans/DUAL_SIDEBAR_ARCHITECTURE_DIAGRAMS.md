# Dual Sidebar Architecture - Visual Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            White Caves Dashboard                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      Status Bar (48px)                          │   │
│  │  [Logo] > Departments / Sales  [System Status: Active] ✓       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│  ┌──────────────┬───────────────────────────────┬──────────────────┐   │
│  │              │                               │                  │   │
│  │              │                               │                  │   │
│  │  Left        │     Dynamic Content Area      │    Right         │   │
│  │  Sidebar     │                               │    Sidebar       │   │
│  │  (280px)     │  [Loaded Component]           │    (280px)       │   │
│  │              │                               │                  │   │
│  │              │  • Context-aware              │                  │   │
│  │              │  • Responsive layout          │                  │   │
│  │              │  • Real-time updates          │                  │   │
│  │              │  • Smooth transitions         │                  │   │
│  │              │                               │                  │   │
│  │              │                               │                  │   │
│  │              │                               │                  │   │
│  │              │                               │                  │   │
│  │              │                               │                  │   │
│  │              │                               │                  │   │
│  │              │                               │                  │   │
│  │              │                               │                  │   │
│  │              │                               │                  │   │
│  │              │                               │                  │   │
│  └──────────────┴───────────────────────────────┴──────────────────┘   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                     Registries (Configuration)                      │
│  ┌────────────────────────────┬─────────────────────────────────┐   │
│  │  departmentsRegistry.ts    │  aiAssistantsRegistry.ts        │   │
│  │  • 10+ Departments         │  • 12+ AI Assistants           │   │
│  │  • Hierarchy Levels        │  • Functional Roles            │   │
│  │  • Services & Teams        │  • Status & Capabilities       │   │
│  │  • Color Coding            │  • Department Assignment       │   │
│  └────────────────────────────┴─────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
              │                              │
              ▼                              ▼
┌──────────────────────────┐  ┌──────────────────────────────────┐
│ CompanyDepartmentSidebar │  │  AIAssistantsSidebar             │
│  • Hierarchical Display  │  │  • Role-based Grouping           │
│  • Collapsible Sections  │  │  • Status Indicators             │
│  • Service Lists         │  │  • Quick Actions                 │
│  • Team Navigation       │  │  • Department Context            │
└──────────────────────────┘  └──────────────────────────────────┘
              │                              │
              └──────────────┬───────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│              DualSidebarLayout (Main Container)                 │
│  • State Management                                             │
│  • Event Handling                                              │
│  • Breadcrumb Navigation                                       │
│  • Status Bar                                                  │
└──────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│         DynamicContentRouter (Feature Dispatcher)               │
│  • Maps feature IDs to components                              │
│  • Passes context data                                         │
│  • Handles transitions                                         │
└──────────────────────────────────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
   [Department]      [AI Assistants]      [Shared Features]
    Dashboards         Dashboards          Dashboards
```

## Component Hierarchy

```
DualSidebarLayout
├── LeftSidebarWrapper
│   └── CompanyDepartmentSidebar
│       └── BaseSidebar
│           ├── SidebarSection
│           │   └── SidebarItem (multiple)
│           │       ├── Department Head Info
│           │       ├── Service List
│           │       └── Team Links
│           └── [Multiple Sections by Hierarchy]
│
├── ContentAreaWrapper
│   ├── StatusBar
│   │   ├── BreadcrumbNav
│   │   └── StatusIndicator
│   └── DynamicContentRouter
│       └── [Feature Component]
│
└── RightSidebarWrapper
    └── AIAssistantsSidebar
        └── BaseSidebar
            ├── SidebarSection (WhatsApp Agents)
            │   └── SidebarItem (multiple)
            │       ├── Assistant Info
            │       └── Status Badge
            ├── SidebarSection (CRM Agents)
            │   └── SidebarItem (multiple)
            ├── SidebarSection (Data Management)
            │   └── SidebarItem (multiple)
            ├── SidebarSection (Analytics)
            │   └── SidebarItem (multiple)
            └── Quick Actions
                └── SidebarItem (Settings, Performance, Training)
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               Redux Store (useSidebarState Hook)               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ activeFeature: string                                    │   │
│  │ activeDepartment: string                                 │   │
│  │ activeAssistant: string                                  │   │
│  │ expandedSections: Set<string>                            │   │
│  │ contentContext: { department?, role?, assistantId? }     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
    │                          │                          │
    │                          │                          │
    ▼                          ▼                          ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Sidebar 1   │      │   Router     │      │  Sidebar 2   │
│  Updates     │      │  Reads       │      │  Updates     │
│  activeFeature       activeFeature │      activeAssistant
│  department          contentContext│      expandedSections
└──────────────┘      └──────────────┘      └──────────────┘
    │                          │                          │
    └──────────────┬───────────┴───────────┬──────────────┘
                   │
                   ▼
          Callback Handlers:
    • onFeatureSelect()
    • onAssistantSelect()
```

## Department Hierarchy Visualization

```
                          White Caves
                         Organization
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ▼         ▼         ▼
              [Level 1: C-Suite]
              • Executive     • Technology
              
                    │         │
        ┌───────────┼─────────┼───────────┐
        ▼           ▼         ▼           ▼
    [Level 2: Directors]
    • Sales      • Property  • Finance   • Legal
    • Leasing    • PM        • Admin     • Compliance
    
        │           │         │           │
    ┌───┴──┐    ┌───┴──┐    ┌─┴──┐    ┌──┴────┐
    ▼      ▼    ▼      ▼    ▼    ▼    ▼       ▼
[Level 3: Managers]
• Sales  • Lease  • Prop  • Maint  • Finance  • Legal
• Agents • Mgmt   • Inv   • Staff  • Tax      • Contracts
```

## AI Assistant Role Grouping

```
                    AI Assistants (12+)
                          │
        ┌───────────────┬──┴──┬──────────────┬─────────────┐
        ▼               ▼     ▼              ▼             ▼
┌──────────────┐  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌────────┐
│ WhatsApp     │  │   CRM   │  │   Data   │  │Analytics│  │Support │
│   Agents     │  │ Agents  │  │Management│  │Reporting│  │ Tools  │
├──────────────┤  ├─────────┤  ├──────────┤  ├─────────┤  ├────────┤
│ • Nina       │  │ • Clara │  │ • Mary   │  │ • Zoe   │  │ • Logs │
│ • Linda      │  │ • Diana │  │ • Aurora │  │ • Beacon│  │ • Info │
│              │  │ • Eva   │  │ • Cipher │  │ • Harmony  │        │
│              │  │         │  │ • Design │  │         │  │        │
└──────────────┘  └─────────┘  └──────────┘  └─────────┘  └────────┘
```

## Feature Routing Map

```
┌──────────────────────────────────────────────────────────────┐
│          DynamicContentRouter Feature Mapping               │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  Feature ID Pattern      →    Component to Load              │
│  ─────────────────────────────────────────────────────────   │
│  dept-*                  →    Department Dashboard          │
│  service-*               →    Service Detail Page           │
│  team-*                  →    Team Directory                │
│  ai-*                    →    AI Assistant Dashboard        │
│  whatsapp-*              →    WhatsApp Management           │
│  analytics-*             →    Analytics Dashboard           │
│  settings-*              →    Settings Page                 │
│  performance-*           →    Performance Metrics           │
│                                                               │
│  Examples:                                                   │
│  • dept-sales            →    Sales Dashboard               │
│  • service-import        →    Data Import Wizard            │
│  • ai-nina               →    Nina WhatsApp Bot             │
│  • ai-linda              →    Linda WhatsApp CRM            │
│  • whatsapp-analytics    →    WhatsApp Analytics            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## User Interaction Flow

```
START
  │
  ▼
┌─────────────────────────────┐
│  User Loads Dashboard       │
│  DualSidebarLayout renders  │
└─────────────────────────────┘
  │
  ├──────────────┬──────────────┐
  ▼              ▼              ▼
┌──────┐    ┌──────┐    ┌────────┐
│Dept  │    │Status│    │AI Asst │
│Sidebar    │Bar   │    │Sidebar │
└──────┘    └──────┘    └────────┘
  │                        │
  │ User clicks            │ User clicks
  │ Department             │ AI Assistant
  │                        │
  ▼                        ▼
┌──────────────────────────────┐
│ DualSidebarLayout updates    │
│ - activeFeature              │
│ - contentContext             │
└──────────────────────────────┘
  │
  ▼
┌──────────────────────────────┐
│ Breadcrumb updates           │
│ Content Router runs          │
└──────────────────────────────┘
  │
  ▼
┌──────────────────────────────┐
│ Correct Component loads      │
│ with context data            │
└──────────────────────────────┘
  │
  ▼
┌──────────────────────────────┐
│ User interacts with feature  │
│ Changes propagate through    │
│ app state                    │
└──────────────────────────────┘
  │
  └─────────────────────────────┘
        (cycle continues)
```

## Responsive Design Breakpoints

```
Desktop (1920px+)        Laptop (1366px)      Tablet (768px)
┌──────────────────┐    ┌──────────────┐     ┌────────────┐
│▌Dept │Content│AI▌│    │D│Content│A│  │     │D  Content │
│ 280  │ Flex │280│    │ │       │ │  │     │  (Stack) │
│      │      │   │    │ │       │ │  │     │ A        │
│      │      │   │    │ │       │ │  │     │          │
└──────────────────┘    └──────────────┘     └────────────┘
All sidebars show      Compact spacing     Stacked/Hidden
```

## Color Scheme & Theme

```
┌─────────────────────────────────────────────────────────┐
│              Theme Colors (Customizable)               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Primary Brand      #3B82F6  ■  (Blue)                  │
│  Success            #10B981  ■  (Green)                │
│  Warning            #F59E0B  ■  (Amber)                │
│  Danger             #EF4444  ■  (Red)                  │
│  Background         #F9FAFB  ■  (Light Gray)           │
│  Sidebar BG         #FFFFFF  ■  (White)                │
│  Border             #E5E7EB  ■  (Border Gray)          │
│  Text Primary       #111827  ■  (Dark Gray)            │
│  Text Secondary     #6B7280  ■  (Gray)                 │
│                                                          │
│  Department Colors: Custom per department               │
│  • Sales: #3B82F6 (Blue)                               │
│  • Inventory: #8B5CF6 (Purple)                         │
│  • Finance: #F59E0B (Amber)                            │
│  • Legal: #6366F1 (Indigo)                             │
│  • Property Mgmt: #EC4899 (Pink)                       │
│  • Tech: #F97316 (Orange)                              │
│  • Operations: #06B6D4 (Cyan)                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Status Indicator System

```
┌──────────────────────────────────────────┐
│         System Status Indicator          │
├──────────────────────────────────────────┤
│                                           │
│  ● Active        #10B981  (Green, Pulse) │
│  ● Inactive      #6B7280  (Gray)         │
│  ● Training      #F59E0B  (Amber)        │
│  ● Error         #EF4444  (Red)          │
│  ● Connecting    #3B82F6  (Blue, Spin)  │
│                                           │
│  Visual: Dot (8px) + Optional Label      │
│  Behavior: Pulse animation for Active    │
│  Update Frequency: Real-time             │
│                                           │
└──────────────────────────────────────────┘
```

## Performance Characteristics

```
┌─────────────────────────────────────────┐
│       Performance Targets                │
├─────────────────────────────────────────┤
│                                          │
│  Initial Load        < 2 seconds         │
│  Sidebar Switch      < 500 ms            │
│  Component Mount     < 300 ms            │
│  State Update        < 100 ms            │
│  Re-render           Optimized w/ memo   │
│  Bundle Size         < 500 KB (gzipped)  │
│  Memory Usage        < 50 MB             │
│                                          │
│  Optimizations:                          │
│  • useMemo for grouping                 │
│  • useCallback for handlers             │
│  • React.FC memoization                 │
│  • Lazy loading ready                   │
│  • Tree-shakeable exports               │
│                                          │
└─────────────────────────────────────────┘
```

## File Size & Dependencies

```
┌────────────────────────────────────────────────────┐
│            File Size Analysis                     │
├────────────────────────────────────────────────────┤
│                                                     │
│  departmentsRegistry.ts     ~5-8 KB                │
│  aiAssistantsRegistry.ts    ~8-12 KB               │
│  CompanyDepartmentSidebar   ~4-6 KB                │
│  AIAssistantsSidebar        ~4-6 KB                │
│  DualSidebarLayout          ~3-5 KB                │
│  Shared Components          ~10-15 KB              │
│  ─────────────────────────────────                 │
│  Total New Code             ~35-50 KB              │
│                                                     │
│  Dependencies:                                    │
│  ✓ React (existing)                               │
│  ✓ styled-components (existing)                   │
│  ✓ Redux (existing)                               │
│  ✓ TypeScript (existing)                          │
│  → No new dependencies added                      │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

These diagrams provide a complete visual understanding of:
- System architecture and layout
- Data flow and state management
- Component hierarchy and composition
- User interaction patterns
- Feature routing logic
- Visual design and theming
- Performance characteristics

**For detailed implementation**, see `DUAL_SIDEBAR_IMPLEMENTATION.md`
**For integration steps**, see `DUAL_SIDEBAR_CHECKLIST.md`
