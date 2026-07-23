// ─────────────────────────────────────────────────────────────
// BREAKPOINTS — Canonical responsive sizes
// ─────────────────────────────────────────────────────────────

export const breakpoints = {
  xs: 375, // Mobile: iPhone SE
  sm: 640, // Mobile: iPhone 12+
  md: 768, // Tablet
  lg: 1024, // Laptop
  xl: 1440, // Desktop
  '2xl': 1920, // Wide desktop
};

// Media query helpers
export const media = {
  xs: `@media (min-width: ${breakpoints.xs}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
};
