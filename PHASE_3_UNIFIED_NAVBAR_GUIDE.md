# PHASE 3: UNIFIED NAVBAR IMPLEMENTATION GUIDE

**Date**: Feb 14, 2026  
**Current Status**: Planning & Design  
**Target Status**: ✅ Production Ready  
**Estimated Duration**: 2-3 hours  

---

## 📋 Executive Summary

Phase 3 will create a new **UnifiedNavbar** component to replace the fragmented navbar implementations across the dashboard. This unified navbar will:

- ✅ Serve as the single source of truth for top-level navigation
- ✅ Integrate seamlessly with the design system (styled-components, theme tokens)
- ✅ Support role-based UI rendering (Super User, Freelancer, Admin, etc.)
- ✅ Include notification center, user profile menu, and admin controls
- ✅ Work flawlessly with the dual-sidebar layout (left/right sidebars)
- ✅ Maintain consistent styling and responsive behavior

---

## 🎯 Phase 3 Objectives

### **Primary Goals**
1. Create a modular, reusable `UnifiedNavbar` component
2. Eliminate navbar duplication (currently in MainNavBar.jsx, etc.)
3. Ensure zero overlapping with sidebars and content
4. Provide clear navigation and user context
5. Ready for immediate dashboard integration

### **Secondary Goals**
1. Add notification center UI
2. Integrate user profile menu
3. Support role-based visibility
4. Maintain 100% TypeScript compliance
5. Zero build/lint errors

---

## 🏗️ Architecture Design

### **Component Hierarchy**

```
UnifiedNavbar (Main Container)
├── LeftSection
│   ├── Logo/Branding
│   ├── DashboardTitle
│   └── NavLinks (for mini-nav)
├── CenterSection (Spacer)
└── RightSection
    ├── NotificationCenter
    │   ├── NotificationBell
    │   └── NotificationDropdown
    ├── UserProfile
    │   ├── ProfileMenu icon
    │   └── ProfileDropdown
    │       ├── Settings
    │       ├── Profile
    │       └── Logout
    └── AdminControls (Conditional)
        ├── Settings
        ├── User Management
        └── System Status
```

### **Key Features**

#### **1. Logo & Branding**
- **Location**: Far left
- **Content**: White Caves logo + company name
- **Responsive**: Logo only on mobile (< 768px)
- **Height**: Consistent with design token (`navbar-height`)

#### **2. Dashboard Title**
- **Location**: Left section (next to logo)
- **Content**: Current page/section title (e.g., "Freelancer Dashboard")
- **Font**: Typography system (bold, medium size)
- **Dynamic**: Updates based on Redux state

#### **3. Notification Center**
- **Location**: Right section
- **Icon**: Bell icon with badge (unread count)
- **Dropdown**: Shows 5 latest notifications
- **Features**:
  - Hover to preview
  - Click to view all
  - Mark as read
  - Dismissible notifications
- **Integration**: Redux notification state

#### **4. User Profile Menu**
- **Location**: Right section (next to notifications)
- **Icon**: Avatar or user initials
- **Dropdown Items**:
  - User name (display)
  - Settings (link)
  - Profile (link)
  - Divider
  - Logout (link)
- **Integration**: Redux auth state

#### **5. Admin Controls** (Conditional)
- **Visibility**: Only for Admin/Super User roles
- **Items**:
  - System status indicator
  - User management link
  - Settings link
- **Integration**: Redux auth role state

---

## 📐 Design Specifications

### **Layout & Spacing**

```
┌─────────────────────────────────────────────────────────────┐
│  Logo   Dashboard Title    [spacer]   🔔   👤   ⚙️          │  (h=64px)
└─────────────────────────────────────────────────────────────┘
```

| Property | Value | Source |
|----------|-------|--------|
| **Height** | 64px (4rem) | `spacing.xl * 2` |
| **Background** | `theme.colors.background.primary` | Design tokens |
| **Border Bottom** | 1px solid `theme.colors.border` | Shadows system |
| **Padding** | 0 `theme.spacing.lg` | Spacing grid |
| **Z-Index** | `theme.zIndex.navbar` | Z-index system |
| **Position** | Fixed (top: 0) | Layout |
| **Responsive** | Mobile-first | Breakpoints |

### **Color Scheme**

| Element | Default | Hover | Active |
|---------|---------|-------|--------|
| **Background** | `primary` | - | - |
| **Text** | `text.primary` | - | - |
| **Borders** | `border` | - | - |
| **Icons** | `text.secondary` | `primary` | `primary` |
| **Badge** | `error` | `error-dark` | - |

### **Typography**

| Element | Font Size | Weight | Color |
|---------|-----------|--------|-------|
| **Logo Text** | md | bold | `text.primary` |
| **Dashboard Title** | base | medium | `text.primary` |
| **Nav Links** | sm | medium | `text.secondary` |
| **Dropdown Menu** | sm | regular | `text.primary` |

---

## 💻 Implementation Plan

### **Step 1: Create UnifiedNavbar Component** (30-45 min)

**File**: `src/components/UnifiedNavbar/UnifiedNavbar.tsx`

```typescript
// Import structure:
import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { theme } from '../../styles/theme';

// Styled components:
const NavbarContainer = styled.nav`
  // Layout, colors, spacing
`;

const LeftSection = styled.div`
  // Logo and title
`;

const LogoSection = styled.div`
  // Logo display
`;

const CenterSection = styled.div`
  // Spacer (flex: 1)
`;

const RightSection = styled.div`
  // Notifications, profile, admin
`;

// Sub-components:
interface UnifiedNavbarProps {
  title?: string;
  className?: string;
}

export const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ title, className = '' }) => {
  // Redux hooks
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const notifications = useSelector(state => state.notifications);
  
  // State
  
  // Handlers
  
  // Render
  return (
    <NavbarContainer className={className}>
      <LeftSection>
        {/* Logo */}
        {/* Title */}
      </LeftSection>
      <CenterSection />
      <RightSection>
        {/* Notifications */}
        {/* Profile */}
        {/* Admin Controls (conditional) */}
      </RightSection>
    </NavbarContainer>
  );
};
```

### **Step 2: Create Sub-Components** (45-60 min)

**Files to Create**:
1. `NotificationCenter.tsx` - Bell icon + dropdown
2. `UserProfileMenu.tsx` - User menu dropdown
3. `AdminControls.tsx` - Admin-only controls
4. `NotificationCenter.types.ts` - Types
5. `UserProfileMenu.types.ts` - Types
6. `AdminControls.types.ts` - Types

**NotificationCenter Features**:
- Unread count badge
- Hover preview
- "View All" link
- Mark as read
- Dismiss notification

**UserProfileMenu Features**:
- Avatar display
- Username
- Settings link
- Profile link
- Logout handler
- Role display

**AdminControls Features**:
- System status indicator
- User management link
- Settings link
- Visible only to Super User/Admin

### **Step 3: Integrate with App.tsx** (15-20 min)

**Current Setup**:
```typescript
<ThemeProvider theme={theme}>
  <GlobalStyle />
  <DualSidebarLayout>
    {/* Content */}
  </DualSidebarLayout>
</ThemeProvider>
```

**New Setup**:
```typescript
<ThemeProvider theme={theme}>
  <GlobalStyle />
  <UnifiedNavbar title={currentPageTitle} />
  <DualSidebarLayout>
    {/* Content - with navbar-height padding-top */}
  </DualSidebarLayout>
</ThemeProvider>
```

**Content Adjustment**:
```css
.dashboard-content {
  margin-top: 64px; /* navbar height */
  padding-top: 20px;
  /* ... rest of styles */
}
```

### **Step 4: Redux Integration** (20-30 min)

**State Requirements**:
```typescript
// From auth slice:
- currentUser: { name, email, role, avatar }
- isAuthenticated: boolean

// From notifications slice:
- notifications: Array<Notification>
- unreadCount: number

// From dashboard slice:
- currentPageTitle: string
```

**Action Requirements**:
```typescript
// Auth actions:
- logout()
- navigateToSettings()
- navigateToProfile()

// Notification actions:
- markAsRead(id)
- dismissNotification(id)
- fetchNotifications()
- setUnreadCount(count)
```

### **Step 5: Styling & Responsiveness** (30-45 min)

**Desktop (> 1024px)**:
- Full logo + text
- Full dashboard title
- All controls visible

**Tablet (768px - 1024px)**:
- Condensed logo (icon only)
- Abbreviated title
- All controls visible

**Mobile (< 768px)**:
- Logo icon only
- Title hidden (or in sidebar)
- Stacked controls

**Breakpoints**:
```typescript
// From theme.breakpoints
desktop: '1024px'
tablet: '768px'
mobile: '480px'
```

### **Step 6: Testing & Verification** (30 min)

**Unit Tests**:
- Component renders correctly
- Props are applied properly
- Click handlers work
- Conditional rendering works

**Integration Tests**:
- Navbar doesn't overlap sidebars
- Navbar height consistent with content padding
- Redux selectors working
- Actions dispatching correctly

**Visual Tests**:
- Dev server responsive design (F12)
- No overlapping elements
- Consistent colors/spacing
- All icons visible

---

## 📦 File Structure

```
src/components/
├── UnifiedNavbar/
│   ├── UnifiedNavbar.tsx (Main navbar component)
│   ├── UnifiedNavbar.types.ts (Types)
│   ├── NotificationCenter.tsx (Notification sub-component)
│   ├── NotificationCenter.types.ts
│   ├── UserProfileMenu.tsx (Profile sub-component)
│   ├── UserProfileMenu.types.ts
│   ├── AdminControls.tsx (Admin sub-component)
│   ├── AdminControls.types.ts
│   └── index.ts (Barrel export)
├── design-system/
│   └── ... (25 components)
├── DualSidebarLayout/
│   └── ... (existing)
└── ... (other components)
```

---

## 🔗 Integration Points

### **Redux Selectors to Create**
```typescript
// auth.ts
export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectUserRole = (state) => state.auth.currentUser?.role;
export const selectIsAdmin = (state) => state.auth.currentUser?.role === 'ADMIN';
export const selectIsSuperUser = (state) => state.auth.currentUser?.role === 'SUPER_USER';

// notifications.ts
export const selectNotifications = (state) => state.notifications.list;
export const selectUnreadCount = (state) => state.notifications.unreadCount;

// dashboard.ts (new)
export const selectCurrentPageTitle = (state) => state.dashboard.pageTitle;
```

### **Redux Slices to Update**
```typescript
// auth/authSlice.ts
- Already has currentUser state
- Add logout() action
- Add navigateToSettings() action

// notifications/notificationsSlice.ts
- Already has notifications state
- Add markAsRead(id) action
- Add dismissNotification(id) action

// dashboard/dashboardSlice.ts (new)
- Add pageTitle state
- Add setPageTitle(title) action
```

### **App.tsx Integration**
```typescript
// Update App.tsx to:
1. Import UnifiedNavbar
2. Place it BEFORE DualSidebarLayout
3. Set content margin-top to navbar height
4. Pass title from Redux state
```

---

## ✨ Design System Components Used

The UnifiedNavbar will leverage these design system components:

| Component | Usage |
|-----------|-------|
| **Button** | Navbar action buttons, logout |
| **Avatar** | User profile picture |
| **Badge** | Notification unread count |
| **Menu** | Dropdown menus (profile, admin) |
| **Tooltip** | Icon descriptions on hover |
| **Icon System** | Bell, settings, gear, etc. |

---

## 🧪 Testing Checklist

### **Component Tests**
- [ ] UnifiedNavbar renders without errors
- [ ] Logo displays correctly
- [ ] Dashboard title updates from Redux
- [ ] Notification bell shows correct count
- [ ] User profile menu opens/closes
- [ ] Admin controls only show for admins
- [ ] Logout action dispatches correctly

### **Integration Tests**
- [ ] Works with DualSidebarLayout
- [ ] Content doesn't overlap navbar
- [ ] Navbar height consistent
- [ ] Redux state updates trigger re-render
- [ ] Responsive at all breakpoints

### **Visual Tests**
- [ ] Colors match design tokens
- [ ] Spacing matches grid
- [ ] Typography consistent
- [ ] Icons aligned properly
- [ ] Hover states work
- [ ] No z-index conflicts

---

## 📝 Documentation to Create

1. **UnifiedNavbar Component Guide**
   - Props documentation
   - Usage examples
   - Customization options

2. **Redux Integration Guide**
   - Required selectors
   - Required actions
   - State shape

3. **Phase 3 Completion Summary**
   - All changes made
   - Verification results
   - Next steps

---

## ⏱️ Estimated Timeline

| Task | Duration | Status |
|------|----------|--------|
| Create UnifiedNavbar | 30-45 min | 📋 Pending |
| Create sub-components | 45-60 min | 📋 Pending |
| Redux integration | 20-30 min | 📋 Pending |
| Styling & responsiveness | 30-45 min | 📋 Pending |
| Testing & verification | 30 min | 📋 Pending |
| Documentation | 20 min | 📋 Pending |
| **Total** | **2.5-3.5 hours** | 📋 Pending |

---

## 🎯 Success Criteria

- ✅ UnifiedNavbar component created and production-ready
- ✅ Zero TypeScript errors
- ✅ Zero build errors
- ✅ Dev server running and navbar displays correctly
- ✅ All navbar elements properly styled and responsive
- ✅ Redux integration complete and working
- ✅ Git commit with comprehensive message
- ✅ Documentation complete

---

## 📌 Key Decisions

1. **Position**: Fixed at top (z-index: navbar)
2. **Height**: 64px (consistent with spacing grid)
3. **Content Padding**: Added margin-top to main content
4. **Role-Based**: Admin controls conditional on user role
5. **State Management**: Redux for user, notifications, page title
6. **Styling**: styled-components with design tokens

---

## 🚀 Next Phase (Phase 4)

After Phase 3 completion, we'll move to:

**Phase 4: Resizable Sidebars**
- Implement react-rnd for sidebar resizing
- Add start resize handle to sidebars
- Persist sidebar width to localStorage
- Responsive "collapse" on mobile
- Estimated: 3-4 hours

---

## 📚 Related Documentation

- `PHASE_1_THEME_SYSTEM_COMPLETE.md` - Design tokens
- `PHASE_2_COMPONENT_LIBRARY_COMPLETE.md` - Available components
- `PROJECT_OVERVIEW_REFACTOR.md` - Architecture overview
- `src/styles/theme/index.ts` - Theme exports

---

**Status**: Ready to begin implementation  
**Start Time**: Ready to execute  
**Target Completion**: ~3 hours after start  
**Next Checkpoint**: Phase 3 completion summary
