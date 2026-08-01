# White Caves — Component Specifications

> **Framework:** React 18, styled-components  
> **Design System Path:** `src/components/design-system/`  
> **Source:** Component source files

---

## 1. Component Inventory

| Component | Path | Variants | Gold-Branded |
|-----------|------|----------|-------------|
| Alert | `design-system/Alert/` | success, warning, error, info | ✅ Info uses gold |
| Avatar | `design-system/Avatar/` | xs, sm, md, lg, xl | — |
| Badge | `design-system/Badge/` | primary, success, warning, danger, info | ✅ Primary = gold |
| Button | `design-system/Button/` | primary, secondary, ghost, danger, outline | ✅ Primary = gold |
| Card | `design-system/Card/` | default, elevated, outlined | ✅ Gold hover border |
| Checkbox | `design-system/Checkbox/` | default, disabled | ✅ Gold check |
| Input | `design-system/Input/` | text, password, email, search | ✅ Gold focus ring |
| Pagination | `design-system/Pagination/` | default | ✅ Active = gold |
| Spinner | `design-system/Spinner/` | sm, md, lg | ✅ Gold spinner |
| Switch | `design-system/Switch/` | default, disabled | ✅ Gold active |
| Table | `design-system/Table/` | default, striped, bordered | ✅ Gold header accent |
| Tag | `design-system/Tag/` | primary, success, warning, danger | ✅ Primary = gold |
| Tooltip | `design-system/Tooltip/` | top, bottom, left, right | — |

---

## 2. Button Specifications

### Variants
| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| Primary | `#D4AF37` | `#FFFFFF` | none | `#C9A030` |
| Secondary | transparent | `#D4AF37` | `1px solid #D4AF37` | `rgba(212,175,55,0.1)` |
| Ghost | transparent | `#666666` | none | `#F5F5F5` |
| Danger | `#C62828` | `#FFFFFF` | none | `#B71C1C` |
| Outline | transparent | `#2C2C2C` | `1px solid #E0E0E0` | `#F5F5F5` |

### Sizes
| Size | Height | Padding | Font Size | Border Radius |
|------|--------|---------|-----------|---------------|
| sm | 32px | 8px 16px | 0.875rem | 6px |
| md | 40px | 10px 20px | 1rem | 8px |
| lg | 48px | 12px 24px | 1.125rem | 8px |

---

## 3. Card Specifications

### Variants
| Variant | Shadow | Border | Background |
|---------|--------|--------|-----------|
| Default | card shadow | `1px solid #E0E0E0` | `#FFFFFF` |
| Elevated | medium shadow | none | `#FFFFFF` |
| Outlined | none | `1px solid #E0E0E0` | transparent |

### Hover State
- Shadow: `cardHover`
- Border color: `#D4AF37` (gold accent on hover)
- Transform: `translateY(-2px)` with 200ms ease

---

## 4. Input Specifications

### States
| State | Border | Shadow | Label Color |
|-------|--------|--------|------------|
| Default | `#E0E0E0` | none | `#757575` |
| Focus | `#D4AF37` | `0 0 0 3px rgba(212,175,55,0.15)` | `#D4AF37` |
| Error | `#C62828` | `0 0 0 3px rgba(198,40,40,0.15)` | `#C62828` |
| Disabled | `#F0F0F0` | none | `#BDBDBD` |

---

## 5. Design System Integration

### Import Pattern
```typescript
import { Button, Card, Input, Badge } from '@/components/design-system';
```

### Theme Access in styled-components
```typescript
const StyledComponent = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;
```
