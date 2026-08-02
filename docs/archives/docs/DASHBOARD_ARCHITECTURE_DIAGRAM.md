# Dashboard Architecture Diagram

## Component Hierarchy

```
App.jsx
└── Routes
    ├── /owner-dashboard
    │   └── OwnerDashboardPage.jsx
    │       └── UnifiedDashboardLayout
    │           ├── MainNavBar
    │           │   ├── Logo
    │           │   ├── NotificationBell
    │           │   ├── UserProfile
    │           │   └── ThemeToggle
    │           │
    │           ├── SidebarContainer (LEFT)
    │           │   ├── SidebarHeader (Logo & Branding)
    │           │   ├── SidebarNav (Navigation Items)
    │           │   │   ├── Dashboard (Overview)
    │           │   │   ├── Users
    │           │   │   ├── Properties
    │           │   │   ├── Agents
    │           │   │   ├── Leads
    │           │   │   ├── Contracts
    │           │   │   ├── Analytics
    │           │   │   └── Settings
    │           │   └── SidebarFooter (Logout)
    │           │
    │           ├── MainContent (CENTER)
    │           │   ├── TabHeader (Tab Navigation)
    │           │   └── TabContent (Rendered via renderTabContent())
    │           │       ├── OverviewTab
    │           │       ├── AICommandCenter (CRM Dashboard)
    │           │       ├── AIAssistantHub
    │           │       ├── UsersTab
    │           │       ├── PropertiesTab
    │           │       ├── AgentsTab
    │           │       ├── LeadsTab
    │           │       ├── ContractsTab
    │           │       ├── AnalyticsTab
    │           │       ├── [CRM Tabs: Linda, Mary, Clara, Nina, etc.]
    │           │       ├── ChatbotTab
    │           │       ├── WhatsAppTab
    │           │       ├── UAEPassTab
    │           │       ├── FeatureExplorer
    │           │       └── SettingsTab
    │           │
    │           └── RightPanelContainer (RIGHT)
    │               ├── PanelHeader (Toggle & Title)
    │               │   └── Keyboard Shortcut: Cmd+A
    │               ├── AssistantsList
    │               │   ├── Linda (WhatsApp)
    │               │   ├── Mary (Inventory)
    │               │   ├── Clara (Leads)
    │               │   ├── Nina (WhatsApp Bot)
    │               │   ├── Nancy (HR)
    │               │   ├── Sophia (Sales)
    │               │   ├── Daisy (Leasing)
    │               │   ├── Theodora (Finance)
    │               │   ├── Olivia (Marketing)
    │               │   ├── Zoe (Executive)
    │               │   ├── Laila (Compliance)
    │               │   ├── Aurora (CTO)
    │               │   ├── Hazel (Frontend)
    │               │   └── Willow (Backend)
    │               └── PanelFooter (Quick Links)
    │
    ├── /buyer-dashboard → BuyerDashboardPage.jsx (Next: Migrate to UnifiedDashboardLayout)
    ├── /agent-dashboard → AgentDashboardPage.jsx (Next: Migrate to UnifiedDashboardLayout)
    └── ... [Other role dashboards]
```

## Responsive Behavior

### Desktop View (1024px+)
```
┌─────────────────────────────────────────────────────┐
│  MainNavBar (Logo, Notifications, User Menu)        │
├──────────────┬──────────────────────┬───────────────┤
│              │                      │               │
│ SidebarCont. │   MainContent        │ RightPanel    │
│ (280px)      │   (Tabs)             │ (Floating)    │
│              │                      │ (320px)       │
│              │  ┌────────────────┐  │               │
│              │  │ Tab Headers    │  │ ┌───────────┐ │
│              │  ├────────────────┤  │ │ Assistants│ │
│              │  │                │  │ ├───────────┤ │
│              │  │ Tab Content    │  │ │ - Linda   │ │
│              │  │ (Dynamic)      │  │ │ - Mary    │ │
│              │  │                │  │ │ - Clara   │ │
│              │  │                │  │ │ - etc...  │ │
│              │  │                │  │ │           │ │
│              │  │                │  │ └───────────┘ │
│              │  └────────────────┘  │               │
│              │                      │               │
└──────────────┴──────────────────────┴───────────────┘
```

### Tablet View (768px - 1023px)
```
┌──────────────────────────────────┐
│  MainNavBar (Hamburger Menu)     │
├──────────────────────────────────┤
│                                  │
│  SidebarContainer (Docked)       │
│  - 100% width                    │
│  - Slideout on mobile            │
│                                  │
├──────────────────────────────────┤
│                                  │
│  MainContent (Full Width)        │
│                                  │
│  ┌─────────────────────────────┐ │
│  │ Tab Headers                 │ │
│  ├─────────────────────────────┤ │
│  │ Tab Content (Dynamic)       │ │
│  │                             │ │
│  │                             │ │
│  └─────────────────────────────┘ │
│                                  │
│  RightPanel (Collapsed/Button)   │
│                                  │
└──────────────────────────────────┘
```

### Mobile View (<768px)
```
┌──────────────────────────────────┐
│  MainNavBar (Compact)            │
├──────────────────────────────────┤
│                                  │
│  MainContent (Full Width)        │
│                                  │
│  ┌─────────────────────────────┐ │
│  │ Tab Headers (Scrollable)    │ │
│  ├─────────────────────────────┤ │
│  │ Tab Content (Dynamic)       │ │
│  │                             │ │
│  │                             │ │
│  └─────────────────────────────┘ │
│                                  │
│  Bottom Drawer (SidebarContainer)│
│  Bottom Drawer (RightPanelCont.) │
│                                  │
└──────────────────────────────────┘
```

## State Management

### UI State (useDashboardState Hook)
```javascript
{
  sidebarCollapsed: boolean,          // Sidebar collapse state
  setSidebarCollapsed: function,      // Toggle sidebar
  rightPanelOpen: boolean,            // Right panel visibility
  setRightPanelOpen: function,        // Toggle right panel
  theme: 'light' | 'dark',            // Current theme
  setTheme: function,                 // Change theme
  isMobile: boolean,                  // Mobile detection
  isTablet: boolean                   // Tablet detection
}
```

### Redux State
```javascript
{
  auth: {
    user: { id, email, role, firebase_id },
    isAuthenticated: boolean
  },
  navigation: {
    activeTab: string,
    breadcrumbs: array
  },
  aiAssistantDashboard: {
    selectedAssistant: string,
    notifications: { byAssistantId: {} },
    assistants: array
  }
}
```

## Data Flow

### Dashboard Initialization
```
OwnerDashboardPage.jsx
  ↓
useEffect: Load Dashboard Data
  ├── Fetch user profile
  ├── Fetch initial dashboard data
  └── Set loading state
  ↓
Redux Store Update
  ├── auth state (user, role)
  ├── navigation state (activeTab)
  └── aiAssistantDashboard state
  ↓
UnifiedDashboardLayout Renders
  ├── Passes user, onLogout, activeTab, onTabChange to layout
  ├── Passes role for role-specific rendering
  └── Children (renderTabContent()) rendered based on activeTab
```

### Tab Navigation
```
User clicks Tab
  ↓
handleTabChange(tabName)
  ↓
setActiveTab(tabName)
  ↓
renderTabContent() switches on activeTab
  ↓
Appropriate component renders (OverviewTab, AICommandCenter, etc.)
  ↓
Data loaded if needed
```

### Keyboard Shortcuts
```
User presses Cmd+B / Ctrl+B
  ↓
UnifiedDashboardLayout detects keydown
  ↓
setSidebarCollapsed(!sidebarCollapsed)
  ↓
SidebarContainer animates collapse/expand

User presses Cmd+A / Ctrl+A
  ↓
UnifiedDashboardLayout detects keydown
  ↓
setRightPanelOpen(!rightPanelOpen)
  ↓
RightPanelContainer animates slide in/out
```

## CSS Architecture

### Structure
```
UnifiedDashboardLayout.css
├── Root Variables (--color-*, --spacing-*)
├── Main Layout Grid
│   ├── Desktop: Grid with 3 columns (sidebar, content, panel)
│   ├── Tablet: Grid with 2 columns (sidebar, content)
│   └── Mobile: Single column (content) + drawers
├── Component-specific Styles
│   ├── NavBar styling
│   ├── Sidebar animations
│   ├── Content area
│   └── Right panel transitions

SidebarContainer.css
├── Sidebar Container
├── Header Section
├── Navigation Items
├── Footer Section
└── Animations (collapse, expand)

RightPanelContainer.css
├── Panel Container
├── Header Section
├── Assistant List
├── Footer Section
└── Animations (slide in, slide out)
```

## Integration Checklist

### Phase 2: Integration (Ready to Start)
- [ ] BuyerDashboardPage
  - [ ] Replace with UnifiedDashboardLayout
  - [ ] Test responsive behavior
  - [ ] Update tab configuration
  
- [ ] AgentDashboardPage  
  - [ ] Replace with UnifiedDashboardLayout
  - [ ] Test responsive behavior
  - [ ] Update tab configuration
  
- [ ] Other Role Dashboards
  - [ ] FreelancerDashboardPage
  - [ ] AdminDashboardPage
  - [ ] Any other role dashboards

### Phase 3: Cleanup
- [ ] Delete deprecated dashboard files
- [ ] Update route definitions
- [ ] Remove unused imports
- [ ] Test app routing

### Phase 4: Optimization
- [ ] Bundle size analysis
- [ ] Code splitting for large components
- [ ] Performance monitoring
- [ ] Accessibility audit

---

**Current Status**: Phase 1 COMPLETE ✅  
**Build**: Passing ✅  
**Dev Server**: Running ✅  
**Next Phase**: Integration into other dashboards
