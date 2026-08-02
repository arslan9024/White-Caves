# MD Dashboard Upgrade - TODO List

## Phase 1: Role & Route Configuration
- [x] 1.1 Rename "Company Owner" to "Managing Director" in RoleSelectorDropdown.jsx
- [x] 1.2 Add new route /md/dashboard in App.jsx
- [x] 1.3 Keep /owner/dashboard for backward compatibility (merge data/functions)
- [ ] 1.4 Rename OwnerDashboardPage.jsx to ManagingDirectorDashboardPage.jsx (optional - keeping same file)
- [x] 1.5 Update role mapping in REAL_ESTATE_ROLES

## Phase 2: Left Sidebar Enhancement (Departments & Features)
- [ ] 2.1 Add search bar to filter departments and assistants
- [ ] 2.2 Add filter options (by department, by status)
- [ ] 2.3 Expand department items to show features/capabilities
- [ ] 2.4 Add quick navigation to specific services

## Phase 3: Right Sidebar (AI Assistants Panel)
- [ ] 3.1 Create new AI Assistants Panel component
- [ ] 3.2 Make each AI assistant clickable to open dashboard
- [ ] 3.3 Add quick actions for each assistant
- [ ] 3.4 Show assistant status and notifications

## Phase 4: MD Dashboard UI Enhancement
- [ ] 4.1 Enhanced KPI cards with real-time metrics
- [ ] 4.2 Department overview cards
- [ ] 4.3 Recent activity feed
- [ ] 4.4 Quick action buttons
- [ ] 4.5 Performance charts

## Phase 5: Integration & Testing
- [ ] 5.1 Integrate right sidebar into DashboardShell
- [ ] 5.2 Test all routes work correctly
- [ ] 5.3 Test search and filter functionality
- [ ] 5.4 Test AI assistant click navigation
