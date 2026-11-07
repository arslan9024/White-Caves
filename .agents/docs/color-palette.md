# White Caves — Brand Color Palette (Red / White Authority)

> **Brand Authority:** Primary brand palette is **Red + White**.  
> **Effective:** April 27, 2026  
> **Source files:** `src/styles/theme/colors.ts`, `src/styles/global.ts`

---

## 1. Primary Brand Colors (Red / White)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary.50` | `#FFF8E1` | Lightest tint, hover backgrounds |
| `primary.100` | `#FFECB3` | Light surface highlights |
| `primary.200` | `#FFE082` | Soft accents, tag backgrounds |
| `primary.300` | `#FFD54F` | Medium accents |
| `primary.400` | `#FFCA28` | Button hover states |
| `primary.500` | `#E31E24` | **Primary brand color** — buttons, links, key UI |
| `primary.600` | `#C62828` | Active states, pressed buttons |
| `primary.700` | `#B71C1C` | Dark accents, focus rings |
| `primary.800` | `#8E0000` | Very dark red, text on light backgrounds |
| `primary.900` | `#5F0000` | Darkest red, high-contrast text |

### Primary Brand Gradient
```css
background: linear-gradient(135deg, #E31E24 0%, #B71C1C 50%, #E31E24 100%);
```

---

## 2. Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Emerald** | `#2E5A4F` | Secondary accent, success states, growth indicators |
| **Emerald Light** | `#3D7A6B` | Hover states for emerald elements |
| **Sand** | `#F5E6D3` | Warm backgrounds, card surfaces |
| **Sand Light** | `#FBF3EA` | Page background alternative |
| **Charcoal** | `#2C2C2C` | Dark text, dark mode primary |
| **Charcoal Light** | `#3D3D3D` | Dark mode surface |

---

## 3. Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#2E7D32` | Positive outcomes, completed states |
| `successLight` | `#E8F5E9` | Success backgrounds |
| `warning` | `#F57C00` | Caution states, pending items |
| `warningLight` | `#FFF3E0` | Warning backgrounds |
| `error` | `#C62828` | Error states, destructive actions |
| `errorLight` | `#FFEBEE` | Error backgrounds |
| `info` | `#1565C0` | Informational states |
| `infoLight` | `#E3F2FD` | Info backgrounds |

---

## 4. Department Colors (Unchanged)

Department colors remain consistent regardless of primary brand changes:

| Department | Hex | Gradient |
|------------|-----|----------|
| Communications | `#25D366` | `#25D366 → #128C7E` |
| Operations | `#3B82F6` | `#667eea → #764ba2` |
| Sales | `#8B5CF6` | `#8B5CF6 → #D946EF` |
| Finance | `#F59E0B` | `#f093fb → #f5576c` |
| Marketing | `#EC4899` | `#4facfe → #00f2fe` |
| Executive | `#10B981` | `#43e97b → #38f9d7` |
| Compliance | `#6366F1` | `#6366f1 → #8b5cf6` |
| Technology | `#0EA5E9` | `#0EA5E9 → #06B6D4` |
| Legal | `#DC2626` | `#DC2626 → #B91C1C` |
| Intelligence | `#0D9488` | `#0D9488 → #0F766E` |

---

## 5. Elevation / Shadows (Updated for Red)

| Level | Value | Usage |
|-------|-------|-------|
| None | `none` | Flat elements |
| Low | `0 2px 4px rgba(227, 30, 36, 0.08)` | Subtle cards |
| Medium | `0 4px 12px rgba(227, 30, 36, 0.12)` | Elevated cards |
| High | `0 8px 24px rgba(227, 30, 36, 0.16)` | Modals, dropdowns |
| Overlay | `0 16px 48px rgba(0, 0, 0, 0.2)` | Full overlays |
| Card | `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` | Default card |
| Card Hover | `0 4px 12px rgba(0, 0, 0, 0.12)` | Hovered card |

---

## 6. Dark Mode Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `dark.bg` | `#1A1A1A` | Primary background |
| `dark.bgSecondary` | `#2A2A2A` | Card/surface background |
| `dark.bgTertiary` | `#3A3A3A` | Elevated surface |
| `dark.text` | `#FFFFFF` | Primary text |
| `dark.textSecondary` | `#D1D5DB` | Secondary text |
| `dark.border` | `#404040` | Borders |
| `dark.brandPrimary` | `#EF5350` | Brand red in dark mode (increased brightness for contrast) |

---

## 7. Usage Guidelines

### DO
- ✅ Use `primary.500` (#E31E24) for primary CTAs, links, and brand elements
- ✅ Use emerald (#2E5A4F) for secondary actions and success indicators
- ✅ Use sand (#F5E6D3) for warm background areas
- ✅ Maintain 4.5:1 contrast ratio (WCAG AA) for text on backgrounds
- ✅ Use the primary red gradient for branded hero/CTA sections

### DON'T
- ❌ Reintroduce gold as the primary brand color in public-facing pages
- ❌ Mix gold with other warm colors without sufficient contrast
- ❌ Use gold text on white backgrounds (fails contrast — use `primary.700`+ for text)
- ❌ Override department colors with brand colors
