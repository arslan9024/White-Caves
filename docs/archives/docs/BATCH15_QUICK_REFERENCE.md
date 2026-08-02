# BATCH 15: Quick Reference Guide
## Navigation & UI CSS to Styled-Components Migration

---

## 🎯 QUICK STATS

| Metric | Count |
|--------|-------|
| Total CSS Files | 100 |
| Styled-Components Created (this batch) | 2 |
| Total .styles.ts Files in Project | 102 |
| Migration Progress | ~50% |
| Build Status | ✅ Success |
| TypeScript Errors | 0 |

---

## 📋 PRIORITY CHECKLISTS

### ✅ TIER 1: DO FIRST (24 components, ~2 weeks)
- [ ] MegaNav (styles created, JSX pending update)
- [ ] MobileNav (styles created, JSX pending update)
- [ ] RoleNavigation (verify existing styles)
- [ ] RoleSelector
- [ ] Toast
- [ ] ThemeToggle
- [ ] PageLoader
- [ ] SkeletonLoader
- [ ] Footer
- [ ] Services
- [ ] SocialLinks
- [ ] JobBoard
- [ ] TestimonialsCarousel
- [ ] Homepage: Hero, Features, Testimonials, Team, Locations, ContactCTA
- [ ] ProfileCompletion
- [ ] SignaturePad
- [ ] PassportUpload
- [ ] PerformanceTracker
- [ ] ServiceTracker
- [ ] RoleGateway

### ⏳ TIER 2: DO NEXT (32 components, dashboard & CRM)
All CRM dashboard assistants (Zoe, Olivia, Laila, Willow, Hazel, etc.)
All dashboard components (EnhancedStatCard, charts, analytics)
Property components (PropertyDetail, PropertyComparison, etc.)
LeadsDashboard, ClientsDashboard, OverviewDashboard

### 🔹 TIER 3: DO LATER (28 components, specialized)
Inventory management (MaryInventory, FilterPanel, PropertyMatrix, etc.)
Shared CRM components (BotComponents, PaymentComponents, etc.)
HR/Owner components (NancyHRCRM, ProductivityTools, etc.)

### 🟡 TIER 4: POLISH (16 components, UI library)
Button, Badge, Input, Card CSS
Profile, Breadcrumb, Tenancy components
Design system components

---

## 🔧 QUICK COMMAND REFERENCE

### Verify Current Status
```bash
# Count remaining CSS files
find src/components -name "*.css" -type f | wc -l

# Find CSS imports in components
grep -r "\.css'" src/components --include="*.jsx" --include="*.tsx"

# List all .styles.ts files
find src/components -name "*.styles.ts" -type f | wc -l
```

### Build & Test
```bash
# Complete build verification
npm run build

# Type checking only
npm run type-check

# Start dev server
npm run dev

# Lint code
npm run lint
```

### Archive CSS Files
```bash
# Create archive directory
mkdir -p archives/css-migration

# Move CSS file after migration
mv src/components/ComponentName.css archives/css-migration/ComponentName.css
```

---

## 📝 COMPONENT MIGRATION TEMPLATE

### Step 1: Create .styles.ts
```typescript
// src/components/ComponentName.styles.ts
import styled from 'styled-components';

export const Container = styled.div`
  // Base styles
  background: ${props => props.theme?.bgPrimary || '#ffffff'};
  color: ${props => props.theme?.textPrimary || '#1a1a1a'};
  padding: 1.5rem;
  border-radius: ${props => props.theme?.radiusMd || '8px'};
  
  // Dark theme
  [data-theme="dark"] & {
    background: ${props => props.theme?.bgSecondary || '#1a1a1a'};
    color: rgba(255, 255, 255, 0.9);
  }
  
  // Responsive
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  // Interactive
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const Header = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;
```

### Step 2: Update JSX Component
```typescript
// Before
import './ComponentName.css';

export default function ComponentName() {
  return (
    <div className="component-name">
      <div className="component-header">Title</div>
    </div>
  );
}

// After
import * as S from './ComponentName.styles';

export default function ComponentName() {
  return (
    <S.Container>
      <S.Header>Title</S.Header>
    </S.Container>
  );
}
```

### Step 3: Verify & Test
```bash
# 1. Build
npm run build

# 2. Dev server
npm run dev

# 3. Browser test:
# - Visual appearance matches original
# - Dark theme switching works (Ctrl+Shift+D)
# - Responsive breakpoints work
# - Hover/active states work
# - Animations smooth
```

### Step 4: Archive CSS
```bash
# Move old CSS file
mv src/components/ComponentName.css \
    archives/css-migration/ComponentName.css

# Verify it's gone
grep -r "ComponentName.css" src/components
```

---

## 🎨 THEME VARIABLES REFERENCE

### Common CSS Variables to Use
```typescript
// Colors
background-primary:   ${props => props.theme?.bgPrimary || '#ffffff'}
background-secondary: ${props => props.theme?.bgSecondary || '#f5f5f5'}
background-tertiary:  ${props => props.theme?.bgTertiary || '#eeeeee'}
text-primary:        ${props => props.theme?.textPrimary || '#1a1a1a'}
text-secondary:      ${props => props.theme?.textSecondary || '#666666'}
text-muted:          ${props => props.theme?.textMuted || '#999999'}
border-color:        ${props => props.theme?.borderColor || '#d0d0d0'}

// Colors
primary-color:       ${props => props.theme?.primaryColor || '#d4af37'}
primary-dark:        ${props => props.theme?.primaryDark || '#b8860b'}
success-color:       ${props => props.theme?.successColor || '#48bb78'}
error-color:         ${props => props.theme?.errorColor || '#f56565'}
warning-color:       ${props => props.theme?.warningColor || '#ed8936'}
info-color:          ${props => props.theme?.infoColor || '#4299e1'}

// Spacing
radius-sm:  ${props => props.theme?.radiusSm || '4px'}
radius-md:  ${props => props.theme?.radiusMd || '8px'}
radius-lg:  ${props => props.theme?.radiusLg || '12px'}
radius-xl:  ${props => props.theme?.radiusXl || '16px'}
```

### Dark Theme Pattern
```typescript
// Always include dark theme variant
[data-theme="dark"] & {
  background: #1a1a1a;  // or theme variable
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}
```

---

## ✨ COMMON PATTERNS

### Pattern 1: Button Variants
```typescript
export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  
  background: ${props => {
    if (props.variant === 'secondary') return '#f5f5f5';
    return '#d4af37';
  }};
  
  color: ${props => {
    if (props.variant === 'secondary') return '#1a1a1a';
    return 'white';
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;
```

### Pattern 2: Card with Hover Effect
```typescript
export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
  
  [data-theme="dark"] & {
    background: #1a1a1a;
    border-color: rgba(255, 255, 255, 0.1);
  }
`;
```

### Pattern 3: Grid Layout
```typescript
export const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
```

### Pattern 4: Animated Skeleton
```typescript
export const SkeletonItem = styled.div<{ width?: string; height?: string }>`
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;
```

---

## 🚀 EXECUTION WORKFLOW

### Daily Workflow for Migration
```
1. Pick component from Tier 1 list
2. Create .styles.ts file (30-45 min)
3. Update JSX imports (5-10 min)
4. Build & verify (10-15 min)
5. Test in browser (5-10 min)
6. Archive CSS file (1-2 min)
7. Create pull request
8. Mark as complete in checklist
9. Move to next component
```

### Weekly Targets
- **Week 1:** 6-8 Tier 1 components (~6 hours)
- **Week 2:** 8-10 Tier 1 + start Tier 2 (~8 hours)
- **Week 3:** 10-12 Tier 2 components (~10 hours)
- **Week 4:** 12-14 Tier 2/3 components (~12 hours)
- **Week 5:** 10-12 Tier 3/4 components (~10 hours)

---

## 🔍 DEBUGGING CHECKLIST

### Styles Not Applying?
- [ ] Verify JSX imports styled-components (not CSS)
- [ ] Check theme provider wraps the component
- [ ] Look for CSS specificity conflicts
- [ ] Verify [data-theme] attribute on document
- [ ] Check console for TypeScript errors

### Dark Theme Issues?
- [ ] Verify [data-theme="dark"] & syntax
- [ ] Check contrast ratios for accessibility
- [ ] Test theme switching in browser
- [ ] Verify color variables exist in theme
- [ ] Check for hardcoded colors

### Responsive Issues?
- [ ] Verify @media query breakpoints
- [ ] Test at 768px and 480px widths
- [ ] Check mobile-specific properties
- [ ] Verify flex/grid layouts
- [ ] Test on actual mobile device

### Performance Issues?
- [ ]  Check for duplicate styled components
- [ ] Verify no inline style objects
- [ ] Check keyframe animations are smooth
- [ ] Monitor bundle size increase
- [ ] Check for unnecessary re-renders

---

## 📊 DEPENDENCY IMPORTS NEEDED

```typescript
// Every .styles.ts file needs
import styled from 'styled-components';

// Type checking (optional but recommended)
import { CSSProperties } from 'react';

// Theme interface (if available)
import { DefaultTheme } from 'styled-components';
```

---

## ⚠️ COMMON PITFALLS TO AVOID

1. **❌ Don't forget to remove .css imports**
   - Visual: See className warnings in console
   - Fix: Remove `import './ComponentName.css';`

2. **❌ Don't use hardcoded color values**
   - Visual: Dark theme looks wrong
   - Fix: Use theme props or CSS variables

3. **❌ Don't forget responsive media queries**
   - Visual: Mobile layout broken
   - Fix: Add @media (max-width: 768px) styles

4. **❌ Don't lose animation properties**
   - Visual: Smooth interactions become jarring
   - Fix: Include @keyframes in styled component

5. **❌ Don't nest unnecessarily**
   - Visual: Component appears broken in strict mode
   - Fix: Only nest when necessary for child styling

---

## 📞 SUPPORT & QUESTIONS

### Check These First
1. Look at similar already-migrated components
2. Review Batch 10-14 reports for patterns
3. Check styled-components docs
4. Build and check console errors
5. Compare original CSS with new styles

### Common Solutions
- **Missing styles?** → Check CSS selectors converted correctly
- **z-index issues?** → Increase z-index values
- **Animations jittery?** → Use cubic-bezier timing
- **Colors different?** → Check theme variable names
- **Layout broken?** → Verify flexbox/grid settings

---

## ✅ SIGN-OFF CHECKLIST

Before marking a component complete:

- [ ] .styles.ts file created
- [ ] All CSS selectors migrated
- [ ] JSX component updated
- [ ] Dark theme working
- [ ] Animations preserved
- [ ] Responsive design intact
- [ ] Build passes (npm run build)
- [ ] No console errors/warnings
- [ ] Visually matches original
- [ ] CSS file archived
- [ ] Pull request created

---

**Document Version:** 1.0  
**Created:** March 11, 2026  
**Status:** READY FOR DEVELOPERS  

