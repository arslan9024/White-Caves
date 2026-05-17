# ⚡ QUICK COMMAND & REFERENCE GUIDE

**Current Time**: 2:45 PM, January 19, 2026
**Server Status**: ✅ Running
**Dashboard**: ✅ Sales Dashboard Live
**Next**: Your Choice!

---

## 🖥️ SERVER COMMANDS

### Start Development Server
```bash
npm run dev
```
✅ Starts at: http://localhost:5000
✅ Auto-reloads on file changes
✅ Hot Module Replacement enabled

### View Dashboard
```
Open browser: http://localhost:5000/modern-dashboard
```

### Stop Server
```bash
Ctrl + C
```

---

## 📂 QUICK FILE LOCATIONS

### Sales Dashboard (New!)
```
src/components/features/Departments/Sales/
├── SalesDashboard.tsx    (Main component - 400 lines)
├── styled.ts              (Styling - 280 lines)
└── index.ts               (Exports)
```

### Dynamic Content Router (Key!)
```
src/components/layout/DashboardLayout/DynamicContentRouter.tsx
└─ Maps feature IDs to components
└─ 30+ routes configured
└─ Add new features here
```

### Sidebars & Layout
```
src/components/layout/DashboardLayout/DualSidebarLayout.tsx
src/components/sidebars/CompanyDepartmentSidebar/
src/components/sidebars/AIAssistantsSidebar/
```

### Configuration
```
src/config/departmentsRegistry.ts
src/config/aiAssistantsRegistry.ts
```

### Theme & Styling
```
src/styles/theme.ts
src/styles/globalStyles.ts
src/components/shared/sidebars/styled/SidebarStyledComponents.tsx
```

---

## 🎨 STYLING PATTERNS

### How to Create a New Dashboard

```typescript
// 1. Create file: src/components/features/Departments/NewDept/NewDeptDashboard.tsx

import React from 'react';
import { Container, Header, HeaderTitle, MetricsGrid, MetricCard } from './styled';

interface Props {
  featureId?: string;
  context?: any;
}

const NewDeptDashboard: React.FC<Props> = ({ featureId, context }) => {
  return (
    <Container>
      <Header>
        <HeaderTitle>✨ New Department</HeaderTitle>
      </Header>
      
      <MetricsGrid>
        <MetricCard>
          <div>Your Metric Here</div>
        </MetricCard>
      </MetricsGrid>
    </Container>
  );
};

export default NewDeptDashboard;
```

### 2. Create styled file: styled.ts
```typescript
import styled from 'styled-components';

export const Container = styled.div`
  padding: 32px;
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

// ... add more styled components
```

### 3. Create index.ts
```typescript
export { default as NewDeptDashboard } from './NewDeptDashboard';
export * from './styled';
```

### 4. Add to DynamicContentRouter.tsx
```typescript
import NewDeptDashboard from '../../features/Departments/NewDept/NewDeptDashboard';

// In featureComponentMap:
'dept-newdept': () => <NewDeptDashboard featureId="dept-newdept" />,
```

### 5. That's it! ✨
The new dashboard is automatically available in the sidebar

---

## 🔌 THEME COLORS AVAILABLE

```typescript
// Use in styled components:
${({ theme }) => theme.colors.primary}        // #C41E3A (Red)
${({ theme }) => theme.colors.secondary}      // #0EA5E9 (Blue)
${({ theme }) => theme.colors.background}     // #FFFFFF
${({ theme }) => theme.colors.cardBg}         // #FFFFFF
${({ theme }) => theme.colors.textPrimary}    // #1F2937
${({ theme }) => theme.colors.textSecondary}  // #6B7280
${({ theme }) => theme.colors.border}         // #E5E7EB
${({ theme }) => theme.colors.success}        // #10B981
${({ theme }) => theme.colors.warning}        // #F59E0B
${({ theme }) => theme.colors.error}          // #EF4444
${({ theme }) => theme.colors.info}           // #3B82F6
```

---

## 📏 SPACING SCALE

```typescript
// Use in styled components:
${({ theme }) => theme.spacing[1]}   // 4px
${({ theme }) => theme.spacing[2]}   // 8px
${({ theme }) => theme.spacing[3]}   // 12px
${({ theme }) => theme.spacing[4]}   // 16px
${({ theme }) => theme.spacing[5]}   // 20px
${({ theme }) => theme.spacing[6]}   // 24px
${({ theme }) => theme.spacing[8]}   // 32px
${({ theme }) => theme.spacing[12]}  // 48px
```

---

## 📱 RESPONSIVE BREAKPOINTS

```typescript
// Import from theme:
import { MEDIA_QUERIES } from '../../styles/theme';

// Use in styled components:
@media ${MEDIA_QUERIES.mobile} {    // 0-640px
  // Mobile styles
}

@media ${MEDIA_QUERIES.tablet} {    // 640px-1024px
  // Tablet styles
}

@media ${MEDIA_QUERIES.desktop} {   // 1024px+
  // Desktop styles
}

@media ${MEDIA_QUERIES.largeDesktop} {  // 1280px+
  // Large desktop styles
}
```

---

## 🎯 ADD A NEW DEPARTMENT

### Step 1: Add to departmentsRegistry.ts
```typescript
export const departmentsRegistry = [
  // ... existing departments
  {
    id: 'NEW',
    name: 'New Department',
    head: 'John Doe',
    color: '#3B82F6',
    // ... other properties
  },
];
```

### Step 2: Create Component (as shown above)

### Step 3: Wire to Router
```typescript
// In DynamicContentRouter.tsx
'dept-new': () => <NewDepartmentDashboard />,
```

### Step 4: Done!
The department automatically appears in the left sidebar

---

## 🤖 ADD A NEW AI ASSISTANT

### Step 1: Add to aiAssistantsRegistry.ts
```typescript
export const aiAssistantsRegistry = [
  // ... existing assistants
  {
    id: 'new-assistant',
    name: 'New Assistant',
    role: 'Custom Role',
    status: 'active',
    // ... other properties
  },
];
```

### Step 2: Create Component (if needed)

### Step 3: Wire to Router
```typescript
// In DynamicContentRouter.tsx
'ai-newassistant': () => <NewAssistantDashboard />,
```

### Step 4: Done!
The assistant automatically appears in the right sidebar

---

## 🧪 TESTING WITH MOCK DATA

### Example Mock Data Pattern (from Sales)
```typescript
const mockMetrics = {
  totalRevenue: 2450000,
  activeDeals: 23,
  closedDeals: 12,
  conversionRate: 52.2,
  pipelineValue: 4850000,
  avgDealSize: 202083,
};

// Use in component:
const [metrics, setMetrics] = useState(mockMetrics);
```

### Replace with API Later
```typescript
// TODO Phase 2B
useEffect(() => {
  const fetchMetrics = async () => {
    const res = await fetch('/api/department/metrics');
    const data = await res.json();
    setMetrics(data);
  };
  fetchMetrics();
}, []);
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Styled components not found
**Fix**: Make sure imports are correct
```typescript
// ❌ Wrong
import { styled } from 'styled-components';

// ✅ Correct
import styled from 'styled-components';
```

### Issue: Theme colors not showing
**Fix**: Component must be wrapped in ThemeProvider (already in App.jsx)

### Issue: Dashboard doesn't appear
**Checklist**:
- [ ] Component exported correctly
- [ ] Route added to DynamicContentRouter
- [ ] Component import added at top
- [ ] No TypeScript errors
- [ ] Browser DevTools console clear
- [ ] Server restarted

---

## 📊 DASHBOARD STATISTICS

### What Each Component Shows
```
SalesDashboard
├── Metrics: Revenue, Deals, Conversion, Pipeline
├── Pipeline: 4 stages with deal counts
├── Deals: List of recent deals
├── Team: Performance grid
└── Stats: Key indicators
```

### Responsive Behavior
```
Desktop (1200px+):   4 metrics across, 60%|40% split
Tablet (768-1200):   2x2 metrics, stacked layout
Mobile (<768px):     Single column, optimized spacing
```

---

## 🔐 TypeScript INTERFACES

### Component Props Template
```typescript
interface DashboardProps {
  featureId?: string;      // 'dept-name' or 'ai-name'
  context?: any;           // Optional context from router
}
```

### Metric Card Data
```typescript
interface MetricData {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}
```

---

## 🚀 DEPLOY CHECKLIST

Before pushing to production:
- [ ] All components rendering correctly
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Responsive design tested on mobile
- [ ] API endpoints created (if needed)
- [ ] Mock data replaced with API calls
- [ ] Environment variables configured
- [ ] Performance optimized (<2s load time)
- [ ] Accessibility tested
- [ ] Cross-browser tested

---

## 📞 USEFUL GIT COMMANDS

```bash
# See what files changed
git status

# View recent changes
git log --oneline -5

# Add all files
git add .

# Commit with message
git commit -m "Add Sales Dashboard"

# Push to remote
git push origin main
```

---

## 🔍 DEBUGGING TIPS

### Check Console Errors
```bash
F12 → Console tab → Look for red errors
```

### Check Network Requests
```bash
F12 → Network tab → Check API calls
```

### Check React Component
```bash
F12 → Components tab → Inspect component tree
```

### Check Performance
```bash
F12 → Performance tab → Record actions → Analyze
```

### Check Responsive Design
```bash
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
Test on: iPhone 12, iPad, Desktop
```

---

## 📚 DOCUMENTATION FILES

Quick references:
```
PHASE_2_DEPARTMENT_DASHBOARDS.md     ← Planning & architecture
PHASE_2_SALES_DASHBOARD_COMPLETE.md  ← Sales dashboard details
NEXT_STEPS_OPTIONS.md                ← 7 options for continuation
SESSION_SUMMARY_JAN_19_2026.md        ← Full session summary
QUICK_VISUAL_SUMMARY.md              ← Visual reference
QUICK_COMMAND_REFERENCE.md           ← This file!
```

---

## 🎯 NEXT ACTIONS

### Quick Option 1 (Recommended): Build More Dashboards
```bash
# What to do:
1. Copy Sales folder to Leasing
2. Change component name and styling
3. Update DynamicContentRouter
4. Done! New dashboard live

# Time: 15 minutes per dashboard
```

### Quick Option 2: Connect APIs
```bash
# What to do:
1. Create API endpoints (/api/sales/metrics, etc.)
2. Replace mock data with fetch calls
3. Add loading/error states
4. Test with real data

# Time: 2-3 hours
```

### Quick Option 3: Add Charts
```bash
# What to do:
1. npm install recharts
2. Create chart components
3. Add to dashboards
4. Test visualization

# Time: 2-3 hours
```

---

## 🎁 FILE TEMPLATES

### Empty Dashboard Template
```typescript
// Copy this and modify as needed
import React, { useState } from 'react';
import { Container, Header, HeaderTitle } from './styled';

interface Props {
  featureId?: string;
  context?: any;
}

const DepartmentDashboard: React.FC<Props> = ({ featureId, context }) => {
  const [data, setData] = useState(null);

  return (
    <Container>
      <Header>
        <HeaderTitle>📊 Department Name</HeaderTitle>
      </Header>
      
      {/* Your content here */}
    </Container>
  );
};

export default DepartmentDashboard;
```

---

## ✨ YOU'RE ALL SET!

Everything is ready. The server is running, the patterns are proven, and the documentation is complete.

**Just tell me what to build next!**

Options:
- A) More dashboards
- B) Connect APIs
- C) Advanced features
- D) WhatsApp integration
- E) Something else

---

**Server**: Running ✅
**Dashboard**: Live ✅
**Ready**: YES! 🚀

**What's next?** 👇
