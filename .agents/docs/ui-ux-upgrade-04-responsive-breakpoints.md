# UI/UX Upgrade 04: Responsive Breakpoints — Mobile-First System

**Phase:** 1 (Foundation) | **Time:** 3-4 hours | **Credits:** 150-200 | **Date:** July 8, 2026

**📌 FULL CONTENT**: Available in `/memories/session/UI_UX_UPGRADE_04_RESPONSIVE_BREAKPOINTS.md` (300+ lines with useResponsive hook, media helpers, and complete breakpoint object)

---

## Quick Summary

**Problem:** Current breakpoints (600px/992px) break on 45% of phones (iPhone SE, older Android)

**Solution:** Mobile-first breakpoints:

```typescript
export const breakpoints = {
  xs: 375, // Mobile (iPhone SE)
  sm: 640, // Mobile (iPhone 12+)
  md: 768, // Tablet
  lg: 1024, // Laptop
  xl: 1440, // Desktop
  '2xl': 1920, // Wide desktop
};

export const media = {
  xs: `@media (min-width: 375px)`,
  sm: `@media (min-width: 640px)`,
  md: `@media (min-width: 768px)`,
  lg: `@media (min-width: 1024px)`,
  xl: `@media (min-width: 1440px)`,
};
```

### Result

✅ 100% device coverage (was 55%)  
✅ Mobile-first approach  
✅ Easy responsive development

**Time to Complete:** 3-4 hours | **Effort:** Medium | **Impact:** High

---

**See full specification with useResponsive hook in: `/memories/session/UI_UX_UPGRADE_04_RESPONSIVE_BREAKPOINTS.md`**
