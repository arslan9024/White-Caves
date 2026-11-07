# Quick Start: Integrating Phase 2 Components

## 🎨 Dark Mode Toggle in TopNavigation

### Step 1: Import DarkModeToggle

```jsx
import DarkModeToggle from '../layout/FourPanelLayout/DarkModeToggle';
```

### Step 2: Add to JSX (in nav-right section)

```jsx
<div className="nav-right">
  <DarkModeToggle />
  {/* Other nav items (profile menu, notifications, etc.) */}
</div>
```

### Step 3: Ensure ThemeProvider Wraps App

In your main App.jsx or index.jsx:

```jsx
import { ThemeProvider } from '../context/ThemeContext';

function App() {
  return <ThemeProvider>{/* Your app components */}</ThemeProvider>;
}
```

---

## 📊 Using Finance Module Components

### VATDashboard Example

```jsx
import { VATDashboard } from '../components/modules/finance';

export default function FinanceDashboard() {
  const handleFileVAT = data => {
    console.log('Filing VAT:', data);
    // Call Aisha (Corporate Tax Manager) assistant
  };

  const handleDownloadReport = () => {
    console.log('Downloading VAT reports');
  };

  return (
    <VATDashboard
      vatMetrics={{
        totalVAT: 45200,
        collectedVAT: 32000,
        payableVAT: 13200,
        filingStatus: 'Compliant',
      }}
      returns={[
        {
          period: '2024-Q1',
          filed: '2024-04-15',
          due: '2024-05-31',
          amount: 15000,
          status: 'Filed',
        },
      ]}
      upcomingFilings={[
        {
          period: '2024-Q2',
          dueDate: '2024-08-31',
          estimatedVAT: 12000,
        },
      ]}
      onFileVAT={handleFileVAT}
      onDownloadReport={handleDownloadReport}
    />
  );
}
```

### TaxFilingWizard Example

```jsx
import { TaxFilingWizard } from '../components/modules/finance';

export default function TaxFilingPage() {
  const handleSubmit = formData => {
    console.log('Tax filing submitted:', formData);
    // Call Aisha (Corporate Tax Manager) assistant
  };

  return <TaxFilingWizard onSubmit={handleSubmit} onCancel={() => window.history.back()} />;
}
```

### AuditReportViewer Example

```jsx
import { AuditReportViewer } from '../components/modules/finance';

export default function AuditPage() {
  const auditData = {
    id: 'AUD-2024-001',
    title: 'Annual Audit Report 2024',
    // ... audit report data
  };

  return (
    <AuditReportViewer
      report={auditData}
      onDownload={() => {
        /* Download PDF */
      }}
      onExport={() => {
        /* Export to CSV */
      }}
    />
  );
}
```

---

## 🎨 Using UI Components

### KPICard Example

```jsx
import { KPICard } from '../components/ui';

<KPICard
  title="Total Revenue"
  value="$125.5K"
  unit="AED"
  trend={{ value: 12.5, direction: 'up' }}
  color="red"
  sparklineData={[10, 20, 15, 30, 25, 40, 35]}
/>;
```

### DataTable Example

```jsx
import { DataTable } from '../components/ui';

<DataTable
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', renderer: value => <StatusBadge status={value} /> },
  ]}
  rows={employees}
  onSort={(column, direction) => {
    /* Handle sort */
  }}
  onFilter={search => {
    /* Handle filter */
  }}
  rowsPerPage={10}
/>;
```

### Modal Example

```jsx
import { Modal } from '../components/ui';
import { useState } from 'react';

export default function ConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action" size="md">
        <p>Are you sure you want to continue?</p>
      </Modal>
    </>
  );
}
```

### AlertBanner Example

```jsx
import { AlertBanner } from '../components/ui';

<AlertBanner
  type="success"
  title="Success!"
  message="Your changes have been saved"
  autoClose={3000}
  onDismiss={() => {
    /* Handle dismiss */
  }}
/>;
```

---

## 🌙 Dark Mode Usage

### Accessing Theme in Components

```jsx
import { useTheme } from '../context/ThemeContext';

export default function MyComponent() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={isDark ? 'dark' : ''}>
      <button onClick={toggleTheme}>Switch to {isDark ? 'Light' : 'Dark'} Mode</button>
    </div>
  );
}
```

### Using useDarkMode Hook

```jsx
import { useDarkMode } from '../hooks/useDarkMode';

export default function MyComponent() {
  const { isDark } = useDarkMode();

  return <div className={isDark ? 'text-white' : 'text-black'}>{/* Content */}</div>;
}
```

### Styling with Dark Mode

```jsx
<div className="bg-white dark:bg-slate-800">
  <p className="text-slate-900 dark:text-white">
    This text automatically changes color in dark mode
  </p>
</div>
```

---

## 📝 Animation Usage

### Applying Animations

```jsx
import { ANIMATION_PRESETS } from '../styles/design-tokens/animations';

// In your component
const getAnimationCSS = animationName => {
  const preset = ANIMATION_PRESETS[animationName];
  return `animation: ${preset.name} ${preset.duration}ms ${preset.easing} forwards;`;
};
```

### Common Animations

- **pageTransitionSlide** (300ms) - Page entrance
- **cardHover** (200ms) - Card lift on hover
- **buttonRipple** (600ms) - Button click effect
- **loadingSpinner** (1000ms) - Loading state
- **modalAppear** (300ms) - Modal entrance
- **fadeIn** (250ms) - Fade entrance

---

## 🚀 Deployment

All components are production-ready and can be:

1. Imported directly into your page components
2. Combined for complex layouts
3. Customized via props
4. Integrated with your state management
5. Connected to backend APIs

---

## 📚 Documentation

- **ACCESSIBILITY_GUIDE.md** - WCAG AAA compliance guide
- **Component PropTypes** - Check individual component files
- **Color Tokens** - `src/styles/design-tokens/colors-dark.js`
- **Animations** - `src/styles/design-tokens/animations.js`

---

## ✅ Testing Checklist

Before integrating components, verify:

- [ ] Dark mode toggle works in TopNavigation
- [ ] Theme persists across page reloads
- [ ] All components render without errors
- [ ] Color contrast meets WCAG AAA (7:1 text, 3:1 UI)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Responsive design on mobile (375px width)
- [ ] Animations respect prefers-reduced-motion
- [ ] No console errors or warnings

---

**Last Updated:** January 16, 2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
