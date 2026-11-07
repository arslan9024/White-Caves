# Accessibility Guidelines — WCAG 2.1 AA Compliance

Comprehensive accessibility standards for the White Caves Real Estate platform, ensuring an inclusive experience for all users regardless of ability, device, or assistive technology.

> Last Updated: April 2026

---

## Table of Contents

1. [Overview & Compliance Target](#1-overview--compliance-target)
2. [Color Contrast Requirements](#2-color-contrast-requirements)
3. [Keyboard Navigation Patterns](#3-keyboard-navigation-patterns)
4. [Screen Reader Compatibility](#4-screen-reader-compatibility)
5. [Focus Management](#5-focus-management)
6. [Form Accessibility](#6-form-accessibility)
7. [Responsive Design Requirements](#7-responsive-design-requirements)
8. [Touch Target Sizes](#8-touch-target-sizes)
9. [Animation & Motion Preferences](#9-animation--motion-preferences)
10. [Testing Tools & Procedures](#10-testing-tools--procedures)
11. [Dubai-Specific Considerations](#11-dubai-specific-considerations)

---

## 1. Overview & Compliance Target

### Compliance Standard

White Caves targets **WCAG 2.1 Level AA** compliance across all public-facing pages and internal CRM interfaces. This is the internationally recognized standard and aligns with UAE accessibility expectations for digital services.

### POUR Principles

| Principle | Description | Key Requirements |
|-----------|-------------|-----------------|
| **Perceivable** | Content must be presentable in ways users can perceive | Text alternatives, captions, contrast, adaptable content |
| **Operable** | UI components must be operable by all users | Keyboard access, time limits, seizure safety, navigation |
| **Understandable** | Content and operation must be understandable | Readable text, predictable behavior, input assistance |
| **Robust** | Content must be robust enough for diverse user agents | Valid HTML, ARIA compatibility, future-proofing |

### Scope

| Surface | Compliance Level | Priority |
|---------|-----------------|----------|
| Public website (listings, guides) | AA | Critical |
| CRM dashboard | AA | High |
| Admin panel | A (minimum) | Medium |
| Email templates | Best effort | Low |
| PDF reports | Tagged PDF (AA) | Medium |

---

## 2. Color Contrast Requirements

### Minimum Contrast Ratios

| Element | Ratio Required | WCAG Criterion | Example |
|---------|---------------|----------------|---------|
| Normal text (< 18px) | **4.5:1** | 1.4.3 | Body copy, labels, links |
| Large text (≥ 18px or ≥ 14px bold) | **3:1** | 1.4.3 | Headings, large buttons |
| UI components & graphics | **3:1** | 1.4.11 | Icons, borders, form controls |
| Focus indicators | **3:1** | 1.4.11 | Focus rings, outlines |
| Disabled elements | No requirement | — | Visually distinct but exempt |

### White Caves Palette — Contrast Verification

| Combination | Foreground | Background | Ratio | Status |
|------------|-----------|-----------|-------|--------|
| Body text on white | Charcoal `#2C2C2C` | White `#FFFFFF` | 14.5:1 | ✅ Pass |
| Body text on sand | Charcoal `#2C2C2C` | Sand `#F5E6D3` | 9.8:1 | ✅ Pass |
| Gold on white | Gold `#D4AF37` | White `#FFFFFF` | 2.6:1 | ❌ Fail (text) |
| Gold on charcoal | Gold `#D4AF37` | Charcoal `#2C2C2C` | 5.6:1 | ✅ Pass |
| White on emerald | White `#FFFFFF` | Emerald `#2E5A4F` | 7.2:1 | ✅ Pass |
| White on gold | White `#FFFFFF` | Gold `#D4AF37` | 2.6:1 | ❌ Fail (text) |
| Charcoal on gold | Charcoal `#2C2C2C` | Gold `#D4AF37` | 5.6:1 | ✅ Pass |

### Rules

1. **Never use gold text on white/sand backgrounds** — fails contrast. Use gold only for decorative elements, borders, or as background with dark text.
2. **Error states**: Use `#C53030` (red) on white — ratio 6.1:1 ✅
3. **Success states**: Use `#276749` (green) on white — ratio 7.5:1 ✅
4. **Always provide a non-color indicator** — do not rely on color alone to convey meaning (WCAG 1.4.1). Use icons, text labels, or patterns alongside color.

### Implementation

```css
/* Ensure link text is distinguishable beyond color */
a {
  color: #2E5A4F;
  text-decoration: underline; /* Non-color indicator */
}

a:hover {
  color: #1A3D35;
  text-decoration-thickness: 2px;
}
```

---

## 3. Keyboard Navigation Patterns

### General Requirements

All interactive elements must be operable via keyboard alone (WCAG 2.1.1).

| Key | Action | Context |
|-----|--------|---------|
| `Tab` | Move focus to next interactive element | Global |
| `Shift + Tab` | Move focus to previous element | Global |
| `Enter` | Activate button, link, or form submit | Buttons, links |
| `Space` | Toggle checkbox, activate button | Checkboxes, buttons |
| `Escape` | Close modal, dropdown, tooltip | Overlays |
| `Arrow Keys` | Navigate within component | Menus, tabs, radio groups |
| `Home / End` | Jump to first/last item | Lists, menus |

### Component-Specific Patterns

#### Navigation Menu

```
Tab      → Focus first menu item
→        → Move to next top-level item
←        → Move to previous top-level item
↓        → Open submenu / move down in submenu
↑        → Move up in submenu
Enter    → Navigate to link
Escape   → Close submenu, return to parent
```

#### Tab Component

```
Tab      → Focus active tab
→ / ←    → Switch between tabs (activate immediately)
Home     → Focus first tab
End      → Focus last tab
```

#### Data Table

```
Tab      → Focus table, then interactive cells
Arrow Keys → Navigate between cells
Enter    → Activate cell content (link, button)
```

#### Property Listing Cards

```
Tab      → Focus card (entire card is a link)
Enter    → Navigate to property detail page
```

### Focus Order

Focus order must match the visual reading order:

1. Skip navigation link
2. Header / navigation
3. Main content (left to right, top to bottom)
4. Sidebar (if present)
5. Footer

For RTL layouts (Arabic), focus order mirrors to right-to-left within content regions while maintaining top-to-bottom flow.

---

## 4. Screen Reader Compatibility

### ARIA Roles

| Component | Role | Required Attributes |
|-----------|------|-------------------|
| Navigation | `role="navigation"` | `aria-label="Main navigation"` |
| Search | `role="search"` | `aria-label="Property search"` |
| Main content | `role="main"` | — |
| Property card | `role="article"` | `aria-label="{property title}"` |
| Modal dialog | `role="dialog"` | `aria-modal="true"`, `aria-labelledby` |
| Alert/toast | `role="alert"` | `aria-live="assertive"` |
| Status update | `role="status"` | `aria-live="polite"` |
| Tab list | `role="tablist"` | `aria-label="Section tabs"` |
| Tab | `role="tab"` | `aria-selected`, `aria-controls` |
| Tab panel | `role="tabpanel"` | `aria-labelledby` |

### ARIA Labels

```jsx
/* Good — descriptive label */
<button aria-label="Save property Al Wasl Tower to favorites">
  <HeartIcon />
</button>

/* Bad — no context */
<button>
  <HeartIcon />
</button>

/* Good — dynamic count */
<span aria-live="polite" role="status">
  {count} properties found matching your criteria
</span>
```

### ARIA Descriptions

```jsx
/* Providing additional context for complex elements */
<input
  type="text"
  aria-label="Minimum price"
  aria-describedby="price-help"
/>
<span id="price-help" className="sr-only">
  Enter minimum price in AED. Example: 500000
</span>
```

### Landmark Structure

```html
<body>
  <a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>
  <header role="banner">...</header>
  <nav role="navigation" aria-label="Main">...</nav>
  <main id="main" role="main">
    <section aria-label="Property search">...</section>
    <section aria-label="Featured listings">...</section>
  </main>
  <aside role="complementary" aria-label="Filters">...</aside>
  <footer role="contentinfo">...</footer>
</body>
```

### Screen Reader Text (Visually Hidden)

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## 5. Focus Management

### Focus Indicators

All focusable elements must have a visible focus indicator with at least **3:1 contrast** against adjacent colors.

```css
/* Default focus style */
:focus-visible {
  outline: 3px solid #2E5A4F;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remove default outline only when focus-visible is supported */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Modal & Dialog Focus

| Event | Focus Action |
|-------|-------------|
| Modal opens | Focus moves to first focusable element inside modal |
| Modal closes | Focus returns to the element that triggered the modal |
| Focus trap | Tab cycles within modal (does not escape to background) |
| Escape key | Closes modal and returns focus |

```jsx
// Focus trap implementation pattern
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
    return () => {
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  // ... focus trap logic
}
```

### Dropdown & Combobox Focus

| Event | Focus Action |
|-------|-------------|
| Dropdown opens | Focus moves to first/selected option |
| Option selected | Focus returns to trigger button |
| Escape pressed | Closes dropdown, focus returns to trigger |
| Arrow keys | Navigate between options |

### Page Navigation Focus

- On route change (SPA navigation), focus moves to the `<h1>` of the new page or a skip target.
- Announce page title change to screen readers via `aria-live` region or document title update.

```jsx
useEffect(() => {
  document.title = `${pageTitle} | White Caves Real Estate`;
  const heading = document.querySelector('h1');
  heading?.focus();
}, [pageTitle]);
```

---

## 6. Form Accessibility

### Label Requirements

Every form input must have an associated label (WCAG 1.3.1, 3.3.2).

```jsx
/* Explicit label association */
<label htmlFor="property-type">Property Type</label>
<select id="property-type" name="propertyType">
  <option value="">Select type...</option>
  <option value="apartment">Apartment</option>
  <option value="villa">Villa</option>
</select>

/* Required fields */
<label htmlFor="email">
  Email Address <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>
<input id="email" type="email" required aria-required="true" />
```

### Error Messages

| Requirement | Implementation |
|------------|---------------|
| Error identified | `aria-invalid="true"` on the input |
| Error described | `aria-describedby` pointing to error message |
| Error visible | Red border + icon + text message |
| Error announced | Error summary at form top with `role="alert"` |

```jsx
<div>
  <label htmlFor="phone">Phone Number</label>
  <input
    id="phone"
    type="tel"
    aria-invalid={hasError}
    aria-describedby={hasError ? "phone-error" : undefined}
  />
  {hasError && (
    <span id="phone-error" role="alert" className="error-text">
      Please enter a valid UAE phone number (e.g., +971 50 123 4567)
    </span>
  )}
</div>
```

### Validation Patterns

1. **Inline validation**: Validate on blur, not on every keystroke
2. **Error summary**: On submit failure, show a summary linking to each errored field
3. **Success confirmation**: Announce successful submission via `aria-live="polite"`
4. **Do not rely on placeholder text** as the only label — it disappears on input

### Form Groups

```jsx
<fieldset>
  <legend>Property Features</legend>
  <label>
    <input type="checkbox" name="features" value="pool" /> Swimming Pool
  </label>
  <label>
    <input type="checkbox" name="features" value="gym" /> Gym
  </label>
  <label>
    <input type="checkbox" name="features" value="parking" /> Parking
  </label>
</fieldset>
```

---

## 7. Responsive Design Requirements

### Viewport Range

White Caves must be fully functional and accessible from **320px to 2560px** viewport width.

| Breakpoint | Width | Target Devices |
|-----------|-------|---------------|
| XS | 320px – 479px | Small phones (iPhone SE) |
| SM | 480px – 639px | Standard phones |
| MD | 640px – 767px | Large phones, small tablets |
| LG | 768px – 1023px | Tablets (iPad) |
| XL | 1024px – 1279px | Small laptops |
| 2XL | 1280px – 1535px | Standard desktops |
| 3XL | 1536px – 2560px | Large monitors, ultrawide |

### Responsive Requirements

| Requirement | WCAG Criterion | Implementation |
|------------|----------------|---------------|
| Content reflow at 320px | 1.4.10 | No horizontal scrolling for text content |
| Text resize to 200% | 1.4.4 | All text remains readable at 200% zoom |
| Orientation support | 1.3.4 | Works in portrait and landscape |
| Target spacing | 2.5.8 | Adequate spacing between interactive elements |

### Content Adaptation

```
Desktop (≥1024px):    3-column property grid, full sidebar filters
Tablet (768-1023px):  2-column grid, collapsible filters
Mobile (320-767px):   1-column stack, bottom sheet filters, sticky CTA
```

### Typography Scaling

```css
/* Fluid typography — scales between breakpoints */
html {
  font-size: clamp(14px, 1vw + 0.5rem, 18px);
}

h1 { font-size: clamp(1.75rem, 3vw, 3rem); }
h2 { font-size: clamp(1.5rem, 2.5vw, 2.25rem); }
body { font-size: clamp(0.875rem, 1vw, 1.125rem); }
```

---

## 8. Touch Target Sizes

### Minimum Sizes (WCAG 2.5.5 — Enhanced, 2.5.8 — AA)

| Target Type | Minimum Size | Recommended Size |
|-------------|-------------|-----------------|
| Buttons | **44 × 44px** | 48 × 48px |
| Links (standalone) | **44 × 44px** | 48 × 48px |
| Links (inline text) | No minimum (text flow) | Adequate line height |
| Form inputs | **44px height** | 48px height |
| Checkboxes / radios | **44 × 44px** (hit area) | 48 × 48px (hit area) |
| Icon buttons | **44 × 44px** | 48 × 48px |
| Close buttons (×) | **44 × 44px** | 48 × 48px |

### Spacing Between Targets

- Minimum **8px gap** between adjacent touch targets
- For critical actions (delete, submit), minimum **16px gap** from destructive alternatives

### Implementation

```css
/* Ensure minimum touch target */
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

/* Expand hit area for small visual elements */
.icon-button {
  position: relative;
  width: 24px;
  height: 24px;
}

.icon-button::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}

/* Checkbox with expanded hit area */
.checkbox-label {
  display: flex;
  align-items: center;
  min-height: 44px;
  padding: 8px;
  cursor: pointer;
}
```

---

## 9. Animation & Motion Preferences

### Respecting User Preferences

All animations must respect the `prefers-reduced-motion` media query (WCAG 2.3.3).

```css
/* Default: animations enabled */
.card-enter {
  animation: fadeSlideUp 300ms ease-out;
}

.hero-image {
  animation: parallaxScroll 1s ease;
}

/* Reduced motion: disable or simplify */
@media (prefers-reduced-motion: reduce) {
  .card-enter {
    animation: none;
    opacity: 1;
  }

  .hero-image {
    animation: none;
  }

  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

### Animation Guidelines

| Rule | Requirement |
|------|------------|
| No flashing content | No content flashes more than 3 times per second (WCAG 2.3.1) |
| Auto-playing media | Must have pause/stop controls |
| Carousels / sliders | Must be pausable; include prev/next controls |
| Loading spinners | Use `aria-live="polite"` to announce state changes |
| Page transitions | Keep under 300ms; fade preferred over slide |
| Decorative animations | Must not interfere with readability or interaction |

### Framer Motion Integration

```jsx
import { motion, useReducedMotion } from 'framer-motion';

function PropertyCard({ property }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
    >
      {/* Card content */}
    </motion.div>
  );
}
```

---

## 10. Testing Tools & Procedures

### Automated Testing

| Tool | Purpose | Integration Point |
|------|---------|------------------|
| **axe-core** | Automated WCAG testing | Unit tests (vitest-axe), CI pipeline |
| **Lighthouse** | Accessibility audit score | CI/CD (target: 95+) |
| **ESLint (jsx-a11y)** | Static analysis for JSX | Pre-commit hook, CI |
| **Pa11y** | CLI accessibility testing | CI pipeline |
| **Playwright** | E2E accessibility assertions | E2E test suite |

### Manual Testing

| Tool / Method | Purpose | Frequency |
|---------------|---------|-----------|
| **NVDA** (Windows) | Primary screen reader testing | Every sprint |
| **VoiceOver** (macOS/iOS) | Apple ecosystem testing | Every release |
| **TalkBack** (Android) | Android screen reader testing | Every release |
| **Keyboard-only navigation** | Ensure full keyboard access | Every sprint |
| **Browser zoom (200%)** | Verify text reflow | Every sprint |
| **High contrast mode** | Verify contrast adequacy | Every release |

### Testing Checklist (Per Component)

- [ ] Passes axe-core with zero violations
- [ ] Lighthouse accessibility score ≥ 95
- [ ] All interactive elements reachable via keyboard
- [ ] Focus indicators visible on all focusable elements
- [ ] Screen reader announces all content meaningfully
- [ ] Color is not the sole means of conveying information
- [ ] Touch targets meet 44×44px minimum
- [ ] Works at 200% browser zoom without horizontal scroll
- [ ] `prefers-reduced-motion` disables animations
- [ ] All images have appropriate alt text
- [ ] Form errors are announced and associated with inputs
- [ ] Page language is declared (`lang="en"` or `lang="ar"`)

### Axe Integration Example

```jsx
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('PropertyCard has no accessibility violations', async () => {
  const { container } = render(<PropertyCard property={mockProperty} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### CI Pipeline Integration

```yaml
accessibility:
  runs-on: ubuntu-latest
  steps:
    - name: Run Lighthouse CI
      run: |
        npx lhci autorun --collect.url=http://localhost:3000
        # Fail if accessibility score < 95
    - name: Run Pa11y
      run: |
        npx pa11y http://localhost:3000 --standard WCAG2AA
```

---

## 11. Dubai-Specific Considerations

### Arabic RTL Support

| Requirement | Implementation |
|------------|---------------|
| `dir="rtl"` on `<html>` for Arabic pages | Language switcher toggles direction |
| Logical CSS properties | `margin-inline-start` instead of `margin-left` |
| Mirrored layouts | Navigation, icons, sliders reverse for RTL |
| Bidirectional text | `unicode-bidi: embed` for mixed EN/AR content |
| Focus order | Mirrors to right-to-left for RTL |
| Screen reader language | `lang="ar"` on Arabic content sections |

### Bilingual Content Accessibility

```html
<!-- Page-level language -->
<html lang="en" dir="ltr">

<!-- Inline Arabic content -->
<p>
  This property is located in
  <span lang="ar" dir="rtl">دبي مارينا</span>,
  one of Dubai's most popular areas.
</p>

<!-- Bilingual property card -->
<article aria-label="Luxury Villa in Palm Jumeirah">
  <h3 lang="en">Luxury Villa — Palm Jumeirah</h3>
  <h3 lang="ar" dir="rtl">فيلا فاخرة — نخلة جميرا</h3>
</article>
```

### Currency & Number Formatting

```jsx
// Accessible price display
<span aria-label="Price: 1 million 800 thousand AED">
  AED 1,800,000
</span>

// Arabic numeral option
<span lang="ar" aria-label="السعر: ١٬٨٠٠٬٠٠٠ درهم">
  ١٬٨٠٠٬٠٠٠ د.إ
</span>
```

### Regional Accessibility Notes

- **Multi-language screen readers**: Test with both English and Arabic voices
- **Phone numbers**: Format with country code for international users (`+971 4 XXX XXXX`)
- **Addresses**: Provide both English transliteration and Arabic for screen readers
- **Date formats**: Use unambiguous formats (`15 April 2026`) — avoid `04/15/2026` vs `15/04/2026` confusion
- **WhatsApp integration**: Ensure click-to-chat links have descriptive `aria-label` including agent name

---

## Compliance Tracking

| Criterion | Status | Notes |
|-----------|--------|-------|
| 1.1.1 Non-text Content | ✅ | Alt text on all images |
| 1.3.1 Info and Relationships | 🔄 | Semantic HTML in progress |
| 1.4.3 Contrast (Minimum) | ✅ | Verified with palette |
| 1.4.11 Non-text Contrast | 🔄 | UI component audit needed |
| 2.1.1 Keyboard | 🔄 | Major components done |
| 2.4.3 Focus Order | 🔄 | RTL focus order pending |
| 2.4.7 Focus Visible | ✅ | Custom focus styles applied |
| 2.5.5 Target Size | ✅ | 44px minimum enforced |
| 3.3.1 Error Identification | ✅ | Form validation implemented |
| 3.3.2 Labels or Instructions | ✅ | All forms labeled |
| 4.1.2 Name, Role, Value | 🔄 | ARIA audit in progress |

---

*This document is a living standard. Review and update quarterly or when WCAG guidelines are revised.*

*See also: [rtl-internationalization.md](rtl-internationalization.md) for detailed RTL/i18n implementation.*
