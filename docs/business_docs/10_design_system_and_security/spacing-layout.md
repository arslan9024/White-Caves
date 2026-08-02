# White Caves — Spacing & Layout System

> **Grid unit:** 8px  
> **Content max width:** 1400px  
> **Source:** `src/styles/brand-tokens.ts`, `src/styles/theme/spacing.ts`

---

## 1. Spacing Scale (8px grid)

| Token | Value | CSS | Usage |
|-------|-------|-----|-------|
| `xs` | 0.5 units | 4px | Tight internal padding, icon gaps |
| `sm` | 1 unit | 8px | Compact spacing, inline elements |
| `md` | 2 units | 16px | Standard padding, form spacing |
| `lg` | 3 units | 24px | Section padding, card internal spacing |
| `xl` | 4 units | 32px | Section gaps, large card padding |
| `xxl` | 6 units | 48px | Page section spacing |
| `xxxl` | 8 units | 64px | Hero section padding, major divisions |

---

## 2. Layout Dimensions

| Token | Value | Usage |
|-------|-------|-------|
| `navbarHeight` | 64px | Top navigation bar |
| `sidebarWidth` | 280px | Left sidebar (expanded) |
| `sidebarCollapsed` | 72px | Left sidebar (icon-only) |
| `contentMaxWidth` | 1400px | Main content area maximum |
| `contextBarHeight` | 56px | Department context bar |

---

## 3. Responsive Breakpoints

| Name | Value | Target |
|------|-------|--------|
| `xs` | 0px | Mobile portrait |
| `sm` | 576px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Small desktop |
| `xl` | 1280px | Desktop |
| `xxl` | 1440px | Large desktop |

### Layout Behavior
```
Mobile (< 768px):
  - Single column layout
  - Sidebars hidden (hamburger menu)
  - Bottom CTA bar visible
  - Full-width cards

Tablet (768px – 1024px):
  - Left sidebar collapsed (72px)
  - Right panel hidden
  - 2-column card grid

Desktop (> 1024px):
  - Full dual-sidebar layout
  - Left sidebar (280px) + Content + Right panel
  - 3-4 column card grids
```

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `none` | 0 | No rounding |
| `sm` | 4px | Tags, badges, small elements |
| `md` | 8px | Buttons, inputs, cards |
| `lg` | 12px | Large cards, modals |
| `xl` | 16px | Hero sections, featured cards |
| `full` | 9999px | Circular elements, pills |

---

## 5. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `base` | 0 | Default content |
| `dropdown` | 100 | Dropdown menus |
| `sticky` | 200 | Sticky headers |
| `sidebar` | 300 | Sidebars |
| `overlay` | 400 | Overlays, backdrop |
| `modal` | 500 | Modal dialogs |
| `toast` | 600 | Toast notifications |
| `tooltip` | 700 | Tooltips |
| `maximum` | 9999 | Emergency overlays |
