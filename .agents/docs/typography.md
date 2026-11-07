# White Caves — Typography System

> **Headings:** Poppins (replaces Montserrat)  
> **Body:** Inter (unchanged)  
> **Monospace:** JetBrains Mono (unchanged)  
> **Source:** `src/styles/brand-tokens.ts`, `src/styles/theme/typography.ts`

---

## 1. Font Families

| Purpose | Family | Fallbacks | Weight Range |
|---------|--------|-----------|-------------|
| Headings | **Poppins** | Inter, -apple-system, sans-serif | 500–800 |
| Body | **Inter** | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif | 400–700 |
| Monospace | **JetBrains Mono** | Fira Code, monospace | 400–600 |

### Why Poppins?
- Geometric sans-serif conveys modernity and luxury
- Excellent readability at all sizes
- Strong visual hierarchy in headings
- Pairs beautifully with Inter body text
- Well-supported across all browsers and platforms

---

## 2. Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `display` | 3rem (48px) | 1.2 | 800 | Hero headings, splash screens |
| `h1` | 2.25rem (36px) | 1.2 | 700 | Page titles |
| `h2` | 1.875rem (30px) | 1.2 | 700 | Section headings |
| `h3` | 1.5rem (24px) | 1.3 | 600 | Card titles, subsections |
| `h4` | 1.25rem (20px) | 1.3 | 600 | Widget titles, labels |
| `bodyLg` | 1.125rem (18px) | 1.5 | 400 | Introductory text |
| `body` | 1rem (16px) | 1.5 | 400 | Default body text |
| `bodySm` | 0.875rem (14px) | 1.5 | 400 | Secondary text, descriptions |
| `caption` | 0.75rem (12px) | 1.4 | 400 | Labels, timestamps, metadata |
| `tiny` | 0.625rem (10px) | 1.4 | 500 | Badge text, status indicators |

---

## 3. Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `regular` | 400 | Body text, descriptions |
| `medium` | 500 | Emphasized body, subtle headings |
| `semibold` | 600 | Sub-headings, labels, navigation |
| `bold` | 700 | Headings, CTAs, important text |
| `extrabold` | 800 | Display/hero headings only |

---

## 4. Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `tight` | 1.2 | Headings, display text |
| `normal` | 1.5 | Body text, paragraphs |
| `relaxed` | 1.75 | Long-form content, documentation |

---

## 5. Responsive Typography

### Mobile (< 768px)
- Display: 2rem
- H1: 1.75rem
- H2: 1.5rem
- Body: 0.9375rem

### Tablet (768px – 1024px)
- Display: 2.5rem
- H1: 2rem
- H2: 1.75rem
- Body: 1rem

### Desktop (> 1024px)
- Standard scale as defined above

---

## 6. Usage Guidelines

### Headings
```css
h1, h2, h3, h4 {
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.02em;
}
```

### Body Text
```css
body, p, li, td {
  font-family: 'Inter', sans-serif;
  letter-spacing: 0;
}
```

### Code Blocks
```css
code, pre, .monospace {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875em;
}
```
